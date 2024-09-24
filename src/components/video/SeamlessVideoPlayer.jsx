import React, { useEffect, useRef, useState } from "react";

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
  const queuedVideos = useRef([]);
  const [canPlay, setCanPlay] = useState(false);
  const baseUrl = useRef("");
  const initialUrlSet = useRef(false);
  const isStopped = useRef(false);
  const currentIndexRef = useRef(0);
  const fetchInProgress = useRef({});
  const retryCounts = useRef({});
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 1000;

  useEffect(() => {
    if (!initialUrlSet.current && initialVideoUrl) {
      const urlPart = initialVideoUrl.videoPath
        .split("/video/")[1]
        .split(/(_\d+)?\.webm$/)[0];
      // baseUrl.current = `/video/${urlPart}`;
      baseUrl.current = `/proxy/video/${urlPart}`;
      initialUrlSet.current = true;
    }
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

    const url = getVideoUrl(index);
    const mediaSource = mediaSourceRef.current;

    try {
      console.log(`Attempting to fetch video ${index}`);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch video: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      queuedVideos.current.push(arrayBuffer);

      fetchInProgress.current[index] = false;
      retryCounts.current[index] = 0; // Reset retry count on success

      if (
        mediaSource &&
        mediaSource.readyState === "open" &&
        sourceBufferRef.current &&
        !sourceBufferRef.current.updating
      ) {
        appendNextVideo();
      }

      // Prefetch the next video in the background
      if (index === 0) {
        // Fetch the second video before starting playback
        fetchAndAppendVideo(index + 1);
      } else if (index > 0) {
        // Continue fetching subsequent videos
        currentIndexRef.current = index + 1;
        fetchAndAppendVideo(currentIndexRef.current);
      }
    } catch (error) {
      console.error(`Error fetching video ${index}:`, error);
      fetchInProgress.current[index] = false;
      retryCounts.current[index] = (retryCounts.current[index] || 0) + 1;

      if (retryCounts.current[index] < MAX_RETRIES) {
        setTimeout(() => fetchAndAppendVideo(index), RETRY_DELAY);
      } else {
        console.error(
          `Max retries reached for video ${index}. Checking for final video.`
        );
        checkForFinalVideo(index);
      }
    }
  };

  const checkForFinalVideo = async (index) => {
    if (isStopped.current) return;
    if (fetchInProgress.current["final"]) return; // Avoid overlapping fetches
    fetchInProgress.current["final"] = true;

    const finalUrl = getVideoUrl("final");

    try {
      const response = await fetch(finalUrl);
      if (response.ok) {
        // '_final' video exists, call onAllVideosEnded immediately
        console.log(`'_final' video exists. Ending playback.`);
        fetchInProgress.current["final"] = false;
        retryCounts.current["final"] = 0; // Reset retry count on success

        onAllVideosEnded();
        isStopped.current = true;
      } else {
        // '_final' video does not exist, retry fetching the same index
        console.log(`'_final' video does not exist. Retrying video ${index}`);
        fetchInProgress.current["final"] = false;
        retryCounts.current[index] = (retryCounts.current[index] || 0) + 1;

        if (retryCounts.current[index] < MAX_RETRIES) {
          setTimeout(() => fetchAndAppendVideo(index), RETRY_DELAY);
        } else {
          console.error(
            `Max retries reached for video ${index}. Cannot proceed further.`
          );
          // You may choose to call onAllVideosEnded() here or handle it differently
          onAllVideosEnded();
          isStopped.current = true;
        }
      }
    } catch (error) {
      console.error("Error checking for '_final' video:", error);
      fetchInProgress.current["final"] = false;
      retryCounts.current["final"] = (retryCounts.current["final"] || 0) + 1;

      if (retryCounts.current["final"] < MAX_RETRIES) {
        setTimeout(() => checkForFinalVideo(index), RETRY_DELAY);
      } else {
        console.error(
          `Max retries reached for '_final' video. Retrying video ${index}`
        );
        retryCounts.current[index] = (retryCounts.current[index] || 0) + 1;

        if (retryCounts.current[index] < MAX_RETRIES) {
          setTimeout(() => fetchAndAppendVideo(index), RETRY_DELAY);
        } else {
          console.error(
            `Max retries reached for video ${index}. Cannot proceed further.`
          );
          onAllVideosEnded();
          isStopped.current = true;
        }
      }
    }
  };

  const appendNextVideo = () => {
    if (isStopped.current) return;

    const mediaSource = mediaSourceRef.current;

    console.log("appendNextVideo()");
    console.log("queuedVideos.current.length:", queuedVideos.current.length);

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
        // In case of error, re-queue the video and retry later
        queuedVideos.current.unshift(nextVideo);
      }
    }
  };

  const onUpdateEnd = () => {
    if (isStopped.current) return;

    console.log("onUpdateEnd()");
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

      // Start by fetching the first two videos
      fetchAndAppendVideo(0);
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

// //{* 1. 첫번째 비디오 시작 전 2초 딜레이 / 2. 버퍼 다 비워진 후에 onAllVideosEnded() *}//

// import React, { useEffect, useRef, useState } from "react";

// const SeamlessVideoPlayer = ({
//   initialVideoUrl,
//   isVisible = true,
//   onEnded,
//   onStart,
//   onAllVideosEnded,
// }) => {
//   const videoRef = useRef(null);
//   const mediaSourceRef = useRef(null);
//   const sourceBufferRef = useRef(null);
//   const queuedVideos = useRef([]);
//   const [canPlay, setCanPlay] = useState(false);
//   const baseUrl = useRef("");
//   const initialUrlSet = useRef(false);
//   const isStopped = useRef(false);
//   const currentIndexRef = useRef(0);
//   const fetchInProgress = useRef({});
//   const retryCounts = useRef({});
//   const MAX_RETRIES = 5;
//   const RETRY_DELAY = 1000;
//   const hasStarted = useRef(false); // 첫 번째 비디오 시작 여부 추적
//   const finalVideoFetched = useRef(false); // final 비디오가 추가되었는지 추적

//   useEffect(() => {
//     if (!initialUrlSet.current && initialVideoUrl) {
//       const urlPart = initialVideoUrl.videoPath
//         .split("/video/")[1]
//         .split(/(_\d+)?\.webm$/)[0];
//       baseUrl.current = `/video/${urlPart}`;
//       // baseUrl.current = `/proxy/video/${urlPart}`;
//       initialUrlSet.current = true;
//     }
//   }, [initialVideoUrl]);

//   const getVideoUrl = (index) => {
//     if (index === "final") {
//       return `${baseUrl.current}_final.webm`;
//     } else {
//       return `${baseUrl.current}_${index}.webm`;
//     }
//   };

//   const fetchAndAppendVideo = async (index) => {
//     if (isStopped.current) return;
//     if (fetchInProgress.current[index]) return; // 중복된 fetch 방지
//     fetchInProgress.current[index] = true;

//     const url = getVideoUrl(index);
//     const mediaSource = mediaSourceRef.current;

//     try {
//       console.log(`Attempting to fetch video ${index}`);

//       const response = await fetch(url);

//       if (!response.ok) {
//         throw new Error(`Failed to fetch video: ${response.statusText}`);
//       }

//       const arrayBuffer = await response.arrayBuffer();
//       queuedVideos.current.push(arrayBuffer);

//       fetchInProgress.current[index] = false;
//       retryCounts.current[index] = 0; // 성공 시 retry count 초기화

//       if (
//         mediaSource &&
//         mediaSource.readyState === "open" &&
//         sourceBufferRef.current &&
//         !sourceBufferRef.current.updating
//       ) {
//         appendNextVideo();
//       }

//       // 다음 비디오 가져오기
//       if (index === 0) {
//         // 첫 번째 비디오 이후 두 번째 비디오 가져오기
//         fetchAndAppendVideo(index + 1);
//       } else if (index > 0 && !finalVideoFetched.current) {
//         // 이후 비디오 계속 가져오기, final 비디오가 추가되지 않은 경우
//         currentIndexRef.current = index + 1;
//         fetchAndAppendVideo(currentIndexRef.current);
//       }
//     } catch (error) {
//       console.error(`Error fetching video ${index}:`, error);
//       fetchInProgress.current[index] = false;
//       retryCounts.current[index] = (retryCounts.current[index] || 0) + 1;

//       if (retryCounts.current[index] < MAX_RETRIES) {
//         setTimeout(() => fetchAndAppendVideo(index), RETRY_DELAY);
//       } else {
//         console.error(
//           `Max retries reached for video ${index}. Checking for final video.`
//         );
//         checkForFinalVideo(index);
//       }
//     }
//   };

//   const checkForFinalVideo = async (index) => {
//     if (isStopped.current) return;
//     if (fetchInProgress.current["final"]) return; // 중복된 fetch 방지
//     fetchInProgress.current["final"] = true;

//     const finalUrl = getVideoUrl("final");

//     try {
//       const response = await fetch(finalUrl);
//       if (response.ok) {
//         // '_final' 비디오가 존재하면 final 비디오를 가져와 버퍼에 추가하고 endOfStream 호출
//         console.log(
//           `'_final' video exists. Preparing to end playback after buffer is exhausted.`
//         );

//         const arrayBuffer = await response.arrayBuffer();
//         queuedVideos.current.push(arrayBuffer);
//         finalVideoFetched.current = true;

//         fetchInProgress.current["final"] = false;
//         retryCounts.current["final"] = 0; // 성공 시 retry count 초기화

//         if (
//           mediaSourceRef.current &&
//           mediaSourceRef.current.readyState === "open" &&
//           sourceBufferRef.current &&
//           !sourceBufferRef.current.updating
//         ) {
//           appendNextVideo();
//           // 모든 비디오가 버퍼에 추가된 후 endOfStream 호출
//           sourceBufferRef.current.addEventListener(
//             "updateend",
//             onFinalUpdateEnd,
//             { once: true }
//           );
//         }
//       } else {
//         // '_final' 비디오가 없으면 현재 비디오 재시도
//         console.log(`'_final' video does not exist. Retrying video ${index}`);
//         fetchInProgress.current["final"] = false;
//         retryCounts.current[index] = (retryCounts.current[index] || 0) + 1;

//         if (retryCounts.current[index] < MAX_RETRIES) {
//           setTimeout(() => fetchAndAppendVideo(index), RETRY_DELAY);
//         } else {
//           console.error(
//             `Max retries reached for video ${index}. Cannot proceed further.`
//           );
//           // 최종적으로 종료
//           isStopped.current = true;
//           onAllVideosEnded();
//         }
//       }
//     } catch (error) {
//       console.error("Error checking for '_final' video:", error);
//       fetchInProgress.current["final"] = false;
//       retryCounts.current["final"] = (retryCounts.current["final"] || 0) + 1;

//       if (retryCounts.current["final"] < MAX_RETRIES) {
//         setTimeout(() => checkForFinalVideo(index), RETRY_DELAY);
//       } else {
//         console.error(
//           `Max retries reached for '_final' video. Retrying video ${index}`
//         );
//         retryCounts.current[index] = (retryCounts.current[index] || 0) + 1;

//         if (retryCounts.current[index] < MAX_RETRIES) {
//           setTimeout(() => fetchAndAppendVideo(index), RETRY_DELAY);
//         } else {
//           console.error(
//             `Max retries reached for video ${index}. Cannot proceed further.`
//           );
//           // 최종적으로 종료
//           isStopped.current = true;
//           onAllVideosEnded();
//         }
//       }
//     }
//   };

//   const appendNextVideo = () => {
//     if (isStopped.current) return;

//     const mediaSource = mediaSourceRef.current;

//     console.log("appendNextVideo()");
//     console.log("queuedVideos.current.length:", queuedVideos.current.length);

//     if (
//       queuedVideos.current.length > 0 &&
//       mediaSource &&
//       mediaSource.readyState === "open" &&
//       sourceBufferRef.current &&
//       !sourceBufferRef.current.updating
//     ) {
//       const nextVideo = queuedVideos.current.shift();
//       console.log("Appending video segment, size:", nextVideo.byteLength);

//       try {
//         sourceBufferRef.current.appendBuffer(nextVideo);
//         console.log("Buffer appended successfully.");

//         if (!hasStarted.current) {
//           // 첫 번째 비디오가 추가된 후 2초 딜레이 후 재생 시작
//           console.log(
//             "First video appended. Starting playback in 2 seconds..."
//           );
//           hasStarted.current = true;
//           setTimeout(() => {
//             setCanPlay(true);
//           }, 2000); // 2000 밀리초 = 2초
//         }
//       } catch (error) {
//         console.error("Error appending buffer:", error);
//         // 오류 발생 시 비디오를 다시 큐에 넣고 나중에 재시도
//         queuedVideos.current.unshift(nextVideo);
//       }
//     } else if (queuedVideos.current.length === 0 && finalVideoFetched.current) {
//       // 모든 비디오가 추가되고 큐가 비어있으며 final 비디오가 추가된 경우 endOfStream 호출
//       try {
//         console.log("All videos appended. Calling endOfStream.");
//         mediaSourceRef.current.endOfStream();
//       } catch (e) {
//         console.warn("Error calling endOfStream:", e);
//       }
//     }
//   };

//   const onFinalUpdateEnd = () => {
//     if (isStopped.current) return;
//     console.log("Final video appended. Calling endOfStream.");
//     try {
//       mediaSourceRef.current.endOfStream();
//     } catch (e) {
//       console.warn("Error calling endOfStream after final video:", e);
//     }
//   };

//   const onUpdateEnd = () => {
//     if (isStopped.current) return;

//     console.log("onUpdateEnd()");
//     appendNextVideo();
//   };

//   const sourceOpen = (e) => {
//     console.log("sourceOpen()");

//     const mediaSource = e.target;
//     try {
//       const mimeType = 'video/webm; codecs="vp8, vorbis"';
//       sourceBufferRef.current = mediaSource.addSourceBuffer(mimeType);
//       sourceBufferRef.current.mode = "sequence";
//       sourceBufferRef.current.addEventListener("updateend", onUpdateEnd);

//       console.log(
//         "MediaSource readyState after sourceOpen:",
//         mediaSource.readyState
//       );

//       // 첫 비디오를 가져오기 시작
//       fetchAndAppendVideo(0);
//     } catch (error) {
//       console.error("Error during sourceOpen:", error);
//     }
//   };

//   useEffect(() => {
//     const video = videoRef.current;
//     const mediaSource = new MediaSource();
//     mediaSourceRef.current = mediaSource;
//     video.src = URL.createObjectURL(mediaSource);

//     const handleSourceOpen = (e) => sourceOpen(e);
//     mediaSource.addEventListener("sourceopen", handleSourceOpen);

//     return () => {
//       mediaSource.removeEventListener("sourceopen", handleSourceOpen);
//       if (sourceBufferRef.current) {
//         mediaSource.removeSourceBuffer(sourceBufferRef.current);
//       }
//       URL.revokeObjectURL(video.src);

//       // Cleanup function
//       if (video) {
//         video.pause();
//         video.src = "";
//         video.load();
//       }
//     };
//   }, []);

//   useEffect(() => {
//     const videoElement = videoRef.current;

//     const handleEnded = () => {
//       console.log("Video playback ended.");
//       if (onAllVideosEnded) {
//         onAllVideosEnded();
//       }
//     };

//     if (videoElement) {
//       videoElement.addEventListener("ended", handleEnded);
//     }

//     return () => {
//       if (videoElement) {
//         videoElement.removeEventListener("ended", handleEnded);
//       }
//     };
//   }, [onAllVideosEnded]);

//   useEffect(() => {
//     if (isVisible && canPlay) {
//       const videoElement = videoRef.current;
//       if (videoElement) {
//         videoElement
//           .play()
//           .then(() => {
//             console.log("Video started playing.");
//             if (onStart) {
//               onStart();
//             }
//           })
//           .catch((error) => {
//             console.error("Playback failed:", error);
//           });
//       }
//     } else {
//       videoRef.current?.pause();
//     }
//   }, [isVisible, canPlay, onStart]);

//   return <video ref={videoRef} style={{ width: "100%", height: "100%" }} />;
// };

// export default SeamlessVideoPlayer;
