import React, { useEffect, useRef, useState, useCallback } from "react";

// for profiling
function saveTimestampsToCSV(timestamps) {
  const fields = ["requestSentTime", "firstVideoPlayedTime"];
  // Create CSV header and content
  const csvRows = [];
  csvRows.push(fields.join(",")); // Add header
  csvRows.push(
    [timestamps.requestSentTime, timestamps.firstVideoPlayedTime].join(",")
  ); // Add row
  // Convert CSV array to a Blob
  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  // Create a downloadable link for the CSV
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "timestamps_profiling_0911_firstResponse.csv";
  // Programmatically click the link to trigger the download
  document.body.appendChild(link);
  link.click();
  // Cleanup
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
//

const SeamlessVideoPlayer = ({
  initialVideoUrl,
  isVisible = true,
  onEnded,
  onStart,
  onAllVideosEnded,
}) => {
  const videoRef = useRef(null);
  const mediaSourceRef = useRef(null);
  const sourceBufferRef = useRef(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const queuedVideos = useRef([]);
  const [isLoading, setIsLoading] = useState(true);
  const [canPlay, setCanPlay] = useState(false);
  const baseUrl = useRef("");
  const initialUrlSet = useRef(false);
  const isEndOfStream = useRef(false);
  const numVideos = initialVideoUrl.numVideo;
  const videoIndexRef = useRef(0);

  useEffect(() => {
    console.log(initialVideoUrl.videoPath);
    if (!initialUrlSet.current && initialVideoUrl) {
      // const urlPart = initialVideoUrl.videoPath
      //   .split("/video/")[1]
      //   .split("_0")[0];
      // baseUrl.current = `/video/${urlPart}`;
      // initialUrlSet.current = true;
      baseUrl.current = initialVideoUrl.videoPath;
      initialUrlSet.current = true;
    }
  }, [initialVideoUrl]);

  const getVideoUrl = (index) => {
    return `${baseUrl.current}${index}.webm`;
  };

  const sourceOpen = useCallback((e) => {
    console.log("sourceOpen()");

    const mediaSource = e.target;
    try {
      const mimeType = 'video/webm; codecs="vp8, vorbis"';
      sourceBufferRef.current = mediaSource.addSourceBuffer(mimeType);
      sourceBufferRef.current.mode = "sequence";
      sourceBufferRef.current.addEventListener("updateend", onUpdateEnd);

      sourceBufferRef.current.addEventListener("abort", () => {
        console.log("sourceBuffer event : abort");
      });
      sourceBufferRef.current.addEventListener("error", (e) => {
        console.log("sourceBuffer event : error");
        console.log(e);
      });
      sourceBufferRef.current.addEventListener("update", (e) => {
        console.log("sourceBuffer event : update");
        console.log(e);
      });
      sourceBufferRef.current.addEventListener("updatestart", () => {
        console.log("sourceBuffer event : updatestart");
      });

      console.log(
        "MediaSource readyState after sourceOpen:",
        mediaSource.readyState
      );

      // Wait 1 second before starting the fetching process
      setTimeout(() => {
        console.log("time out");
      }, 1000); // Initial 1-second delay

      // Start fetching videos at 1-second intervals
      let videoIndex = 0;
      const fetchInterval = setInterval(() => {
        console.log("videoIndex: ", videoIndex);
        console.log("numVideos: ", numVideos);
        if (videoIndex < numVideos) {
          fetchAndAppendVideo(videoIndex);
          videoIndex++;
        } else {
          clearInterval(fetchInterval);
          setIsLoading(false);
          onEnded();
        }
      }, 1000);
    } catch (error) {
      console.error("Error during sourceOpen:", error);
    }
  }, []);

  const fetchAndAppendVideo = useCallback(async (index) => {
    const url = getVideoUrl(index);
    console.log("Current url: ", url);
    const mediaSource = mediaSourceRef.current;

    const fetchWithRetry = async (retryCount = 30) => {
      try {
        console.log(
          `Attempting to fetch video ${index}, Retry count: ${retryCount}`
        );
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch video: ${response.statusText}`);
        }

        console.log("response, ", response);
        const arrayBuffer = await response.arrayBuffer();
        console.log("arrayBuffer, ", arrayBuffer);
        queuedVideos.current.push(arrayBuffer);

        if (
          mediaSource &&
          mediaSource.readyState === "open" &&
          sourceBufferRef.current &&
          !sourceBufferRef.current.updating
        ) {
          appendNextVideo();
        }
      } catch (error) {
        console.error(`Error fetching video ${index}:`, error);

        if (retryCount > 0) {
          console.log(`Retrying to fetch video ${index} in 1 seconds...`);
          setTimeout(() => fetchWithRetry(retryCount - 1), 1000); // Retry after 1 second
        } else {
          console.error(
            `Failed to fetch video ${index} after multiple attempts.`
          );
          setIsLoading(false);
        }
      }
    };

    fetchWithRetry();
  }, []);

  const appendNextVideo = useCallback(() => {
    const mediaSource = mediaSourceRef.current;
    console.log("appendNextVideo()");
    console.log("queuedVideos.current.length:", queuedVideos.current.length);

    console.log(
      "MediaSource readyState before append:",
      mediaSource ? mediaSource.readyState : "MediaSource not available"
    );

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
      }
    } else {
      console.log(
        "Cannot append: queue length:",
        queuedVideos.current.length,
        "MediaSource state:",
        mediaSource ? mediaSource.readyState : "MediaSource not available",
        "SourceBuffer updating:",
        sourceBufferRef.current
          ? sourceBufferRef.current.updating
          : "SourceBuffer not available"
      );
    }
  }, []);

  const onUpdateEnd = useCallback(() => {
    console.log("onUpdateEnd()");
    console.log(
      "MediaSource readyState during onUpdateEnd:",
      mediaSourceRef.current
        ? mediaSourceRef.current.readyState
        : "MediaSource not available"
    );
    appendNextVideo();
    if (!canPlay) {
      setCanPlay(true);
    }
  }, [appendNextVideo, canPlay]);

  useEffect(() => {
    const video = videoRef.current;
    const mediaSource = new MediaSource();
    mediaSourceRef.current = mediaSource;
    video.src = URL.createObjectURL(mediaSource);

    const handleSourceOpen = (e) => sourceOpen(e);
    mediaSource.addEventListener("sourceopen", handleSourceOpen);

    return () => {
      mediaSource.removeEventListener("sourceopen", handleSourceOpen);
      if (sourceBufferRef.current) {
        mediaSource.removeSourceBuffer(sourceBufferRef.current);
      }
      URL.revokeObjectURL(video.src);

      // Cleanup function
      if (video) {
        video.pause();
        video.src = "";
        video.load();
      }
    };
  }, [sourceOpen]);

  useEffect(() => {
    if (isVisible && canPlay) {
      const videoElement = videoRef.current;
      if (videoElement) {
        videoElement
          .play()
          .then(() => {
            const firstVideoPlayedTime = Date.now(); // profiling
            const timestamps = { requestSentTime: -1, firstVideoPlayedTime };
            saveTimestampsToCSV(timestamps);
            console.log(
              "First video started playing at:",
              firstVideoPlayedTime
            );
          })
          .catch((error) => {
            console.error("Playback failed:", error);
          });
      }
    } else {
      videoRef.current?.pause();
    }
  }, [isVisible, canPlay]);

  const handleVideoEnded = useCallback(() => {
    console.log(`Video ${videoIndexRef.current} ended`);
    if (videoIndexRef.current < numVideos - 1) {
      console.log("currentVideoIndex: ", videoIndexRef.current);
      videoIndexRef.current += 1;
      setCurrentVideoIndex(videoIndexRef.current);
      onEnded(); // Call onEnded for each video that ends
    } else {
      console.log("All videos have ended");
      onAllVideosEnded(); // Call the new callback when all videos have ended
    }
  }, [numVideos, onEnded, onAllVideosEnded]);

  return (
    <video
      ref={videoRef}
      style={{ width: "100%", height: "100%" }}
      controls
      onEnded={handleVideoEnded}
      onPlay={onStart}
    />
  );
};

export default SeamlessVideoPlayer;
