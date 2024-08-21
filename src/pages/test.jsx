import React, { useEffect, useRef, useState } from "react";

const SeamlessVideoStreamer = () => {
  const videoRef = useRef(null);
  const mediaSourceRef = useRef(null);
  const sourceBufferRef = useRef(null);
  const queueRef = useRef([]);
  const [isLoading, setIsLoading] = useState(false);
  const currentUrlIndexRef = useRef(0);

  // 테스트를 위한 비디오 URL들 (실제 MP4 파일 URL로 교체해야 함)
  const videoUrls = [
    "https://ruverse.snu.ac.kr/video/test1.mp4",
    "https://ruverse.snu.ac.kr/video/test2.mp4",
    "https://ruverse.snu.ac.kr/video/test3.mp4",
  ];

  useEffect(() => {
    if (!videoRef.current) return;

    const initMediaSource = () => {
      return new Promise((resolve) => {
        mediaSourceRef.current = new MediaSource();
        videoRef.current.src = URL.createObjectURL(mediaSourceRef.current);
        mediaSourceRef.current.addEventListener("sourceopen", () => {
          sourceBufferRef.current = mediaSourceRef.current.addSourceBuffer(
            'video/mp4; codecs="avc1.42E01E,mp4a.40.2"'
          );
          sourceBufferRef.current.mode = "sequence";
          sourceBufferRef.current.addEventListener("updateend", onUpdateEnd);
          resolve();
        });
      });
    };

    const fetchNextSegment = async () => {
      if (currentUrlIndexRef.current >= videoUrls.length) {
        console.log("All segments loaded");
        return;
      }

      try {
        const response = await fetch(videoUrls[currentUrlIndexRef.current]);
        const videoData = await response.arrayBuffer();
        queueRef.current.push(videoData);

        if (!isLoading) {
          loadNextSegment();
        }

        currentUrlIndexRef.current++;
        setTimeout(fetchNextSegment, 0);
      } catch (error) {
        console.error("Error fetching video segment:", error);
      }
    };

    const loadNextSegment = () => {
      if (queueRef.current.length === 0 || isLoading) return;

      setIsLoading(true);
      const nextSegment = queueRef.current.shift();

      if (sourceBufferRef.current.updating) {
        sourceBufferRef.current.addEventListener(
          "updateend",
          () => appendBuffer(nextSegment),
          { once: true }
        );
      } else {
        appendBuffer(nextSegment);
      }
    };

    const appendBuffer = (segment) => {
      try {
        sourceBufferRef.current.appendBuffer(segment);
      } catch (error) {
        console.error("Error appending buffer:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const onUpdateEnd = () => {
      if (queueRef.current.length > 0) {
        loadNextSegment();
      }

      if (
        videoRef.current.paused &&
        sourceBufferRef.current.buffered.length > 0
      ) {
        const bufferedEnd = sourceBufferRef.current.buffered.end(
          sourceBufferRef.current.buffered.length - 1
        );
        if (bufferedEnd - videoRef.current.currentTime > 1) {
          videoRef.current.play().catch(console.error);
        }
      }

      if (
        currentUrlIndexRef.current >= videoUrls.length &&
        queueRef.current.length === 0 &&
        !sourceBufferRef.current.updating
      ) {
        mediaSourceRef.current.endOfStream();
      }
    };

    const startStreaming = async () => {
      await initMediaSource();
      fetchNextSegment();
    };

    startStreaming();

    return () => {
      // Cleanup logic here
      if (mediaSourceRef.current) {
        URL.revokeObjectURL(videoRef.current.src);
      }
    };
  }, []);

  return (
    <div>
      <h1>Seamless Video Streaming Test</h1>
      <video ref={videoRef} controls width="640" height="360" />
    </div>
  );
};

export default SeamlessVideoStreamer;
