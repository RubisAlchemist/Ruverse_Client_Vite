import React, { useEffect, useRef, useState } from "react";

const SeamlessVideoPlayer = ({
  initialVideoUrl,
  isVisible = true,
  onEnded,
  onStart,
  onAllVideosEnded,
  onLoadingChange,
}) => {
  const videoRef = useRef(null);
  const mediaSourceRef = useRef(null);
  const sourceBufferRef = useRef(null);
  const queuedVideos = useRef([]);
  const [canPlay, setCanPlay] = useState(false);
  const baseUrl = useRef("");
  const initialUrlSet = useRef(false);
  const isStopped = useRef(false);
  const currentIndexRef = useRef(0);
  const fetchInProgress = useRef({});
  const retryCounts = useRef({});
  const RETRY_DELAY = 1000; // 1 second delay between retries
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    if (!initialUrlSet.current && initialVideoUrl) {
      console.log("initialVideoUrl: ", initialVideoUrl);
      const urlPart = initialVideoUrl.videoPath
        .split("/video/")[1]
        .split(/(_\d+)?\.webm$/)[0];
      //baseUrl.current = `/video/${urlPart}`;
      baseUrl.current = `/proxy/video/${urlPart}`;
      initialUrlSet.current = true;
    }
    console.log("seamlessVideoPlayer: ", initialVideoUrl.videoPath);
  }, [initialVideoUrl]);

  const getVideoUrl = (index) => {
    if (index === "final") {
      return `${baseUrl.current}_final.webm`;
    } else {
      return `${baseUrl.current}_${index}.webm`;
    }
  };

  const fetchAndAppendVideo = async (index) => {
    if (isStopped.current) return;
    if (fetchInProgress.current[index]) return; // Avoid overlapping fetches
    fetchInProgress.current[index] = true;

    // if (index === 0) {
    //   console.log("sleeping...");
    //   await sleep(2000);
    //   console.log("sleep end");
    //   setIsInitialLoading(false);
    // }

    const url = getVideoUrl(index);
    console.log(url);
    const mediaSource = mediaSourceRef.current;
    retryCounts.current[index] = 0;

    const MAX_RETRIES_BEFORE_FINAL_CHECK = 3;

    while (!isStopped.current) {
      try {
        console.log(`Attempting to fetch video ${index}`);
        const response = await fetch(url, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch video: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();

        // Add this check for zero-byte arrayBuffer
        if (arrayBuffer.byteLength === 0) {
          throw new Error("Fetched video segment is empty");
        }

        fetchInProgress.current[index] = false;
        retryCounts.current[index] = 0;

        // Add to queue
        queuedVideos.current.push(arrayBuffer);

        // Append if possible
        if (
          mediaSource &&
          mediaSource.readyState === "open" &&
          sourceBufferRef.current &&
          !sourceBufferRef.current.updating
        ) {
          appendNextVideo();
        }

        // Fetching successful, proceed to next index
        currentIndexRef.current = index + 1;
        // Proceed to fetch next segment
        fetchAndAppendVideo(currentIndexRef.current);
        return;
      } catch (error) {
        retryCounts.current[index] += 1;
        console.error(
          `Error fetching video ${index}, retry ${retryCounts.current[index]}:`,
          error
        );
        if (retryCounts.current[index] % MAX_RETRIES_BEFORE_FINAL_CHECK === 0) {
          console.log(
            `Reached ${retryCounts.current[index]} retries for video ${index}. Checking for final video.`
          );
          await checkForFinalVideo();
          if (isStopped.current) {
            fetchInProgress.current[index] = false;
            return;
          }
        }
        await sleep(RETRY_DELAY);
        // Continue loop to retry
      }
    }

    fetchInProgress.current[index] = false;
  };

  const checkForFinalVideo = async () => {
    if (isStopped.current) return;
    const finalUrl = getVideoUrl("final");
    const mediaSource = mediaSourceRef.current;
    try {
      console.log("Checking for '_final' video.");
      const response = await fetch(finalUrl, {
        credentials: "include",
      });
      if (response.ok) {
        // '_final' video exists
        console.log(
          `'_final' video exists. Will end stream after buffered videos.`
        );
        isStopped.current = true;
        // If buffer is empty, end stream immediately
        if (
          queuedVideos.current.length === 0 &&
          mediaSource &&
          mediaSource.readyState === "open"
        ) {
          mediaSource.endOfStream();
        }
        // Else, allow buffered videos to play out
      } else {
        // '_final' video does not exist, continue fetching
        console.log(`'_final' video does not exist. Continuing to retry.`);
      }
    } catch (error) {
      console.error("Error checking for '_final' video:", error);
      // Decide whether to stop or continue retrying
      // For now, we'll continue retrying
    }
  };

  const appendNextVideo = () => {
    const mediaSource = mediaSourceRef.current;
    if (
      queuedVideos.current.length > 0 &&
      mediaSource &&
      mediaSource.readyState === "open" &&
      sourceBufferRef.current &&
      !sourceBufferRef.current.updating
    ) {
      const nextVideo = queuedVideos.current.shift();
      console.log("Appending video segment, size:", nextVideo.byteLength);
      try {
        sourceBufferRef.current.appendBuffer(nextVideo);
        console.log("Buffer appended successfully.");
      } catch (error) {
        console.error("Error appending buffer:", error);
        // Re-queue the video and retry later
        queuedVideos.current.unshift(nextVideo);
      }
    } else if (isStopped.current && queuedVideos.current.length === 0) {
      // If we've been instructed to stop and the buffer is empty, end the stream
      if (mediaSource && mediaSource.readyState === "open") {
        console.log("Ending stream after all videos have been appended.");
        mediaSource.endOfStream();
      }
    }
  };

  const onUpdateEnd = () => {
    appendNextVideo();

    // Set canPlay to true after the first video is appended
    if (!canPlay) {
      setCanPlay(true);
    }
  };

  const sourceOpen = (e) => {
    console.log("sourceOpen()");
    const mediaSource = e.target;
    try {
      const mimeType = 'video/webm; codecs="vp8, vorbis"';
      sourceBufferRef.current = mediaSource.addSourceBuffer(mimeType);
      sourceBufferRef.current.mode = "sequence";
      sourceBufferRef.current.addEventListener("updateend", onUpdateEnd);
      console.log(
        "MediaSource readyState after sourceOpen:",
        mediaSource.readyState
      );
      // Start by fetching the first video
      currentIndexRef.current = 0;
      fetchAndAppendVideo(currentIndexRef.current);
    } catch (error) {
      console.error("Error during sourceOpen:", error);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    const mediaSource = new MediaSource();
    mediaSourceRef.current = mediaSource;
    video.src = URL.createObjectURL(mediaSource);
    const handleSourceOpen = (e) => sourceOpen(e);
    mediaSource.addEventListener("sourceopen", handleSourceOpen);
    const handleEnded = () => {
      console.log("Playback ended.");
      onAllVideosEnded();
    };
    video.addEventListener("ended", handleEnded);
    return () => {
      mediaSource.removeEventListener("sourceopen", handleSourceOpen);
      video.removeEventListener("ended", handleEnded);
      if (sourceBufferRef.current) {
        sourceBufferRef.current.removeEventListener("updateend", onUpdateEnd);
        mediaSource.removeSourceBuffer(sourceBufferRef.current);
      }
      URL.revokeObjectURL(video.src);
      if (video) {
        video.pause();
        video.src = "";
        video.load();
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible && canPlay) {
      const videoElement = videoRef.current;
      if (videoElement) {
        videoElement
          .play()
          .then(() => {
            console.log("Video started playing.");
          })
          .catch((error) => {
            console.error("Playback failed:", error);
          });
      }
    } else {
      videoRef.current?.pause();
    }
  }, [isVisible, canPlay]);

  return (
    <video
      ref={videoRef}
      style={{ width: "100%", height: "100%" }}
      onPlay={onStart}
    />
  );
};

export default SeamlessVideoPlayer;
