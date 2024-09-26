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
//   const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
//     if (fetchInProgress.current[index]) return; // Avoid overlapping fetches
//     fetchInProgress.current[index] = true;

//     if (index == 0) {
//       console.log("sleeping...");
//       await sleep(8000);
//       console.log("sleep end");
//     }

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
//       retryCounts.current[index] = 0; // Reset retry count on success

//       if (
//         mediaSource &&
//         mediaSource.readyState === "open" &&
//         sourceBufferRef.current &&
//         !sourceBufferRef.current.updating
//       ) {
//         appendNextVideo();
//       }

//       // Prefetch the next video in the background
//       if (index === 0) {
//         // Fetch the second video before starting playback

//         fetchAndAppendVideo(index + 1);
//       } else if (index > 0) {
//         // Continue fetching subsequent videos
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
//     if (fetchInProgress.current["final"]) return; // Avoid overlapping fetches
//     fetchInProgress.current["final"] = true;

//     const finalUrl = getVideoUrl("final");

//     try {
//       const response = await fetch(finalUrl);
//       if (response.ok) {
//         // '_final' video exists, call onAllVideosEnded immediately
//         console.log(`'_final' video exists. Ending playback.`);
//         fetchInProgress.current["final"] = false;
//         retryCounts.current["final"] = 0; // Reset retry count on success

//         onAllVideosEnded();
//         isStopped.current = true;
//       } else {
//         // '_final' video does not exist, retry fetching the same index
//         console.log(`'_final' video does not exist. Retrying video ${index}`);
//         fetchInProgress.current["final"] = false;
//         retryCounts.current[index] = (retryCounts.current[index] || 0) + 1;

//         if (retryCounts.current[index] < MAX_RETRIES) {
//           setTimeout(() => fetchAndAppendVideo(index), RETRY_DELAY);
//         } else {
//           console.error(
//             `Max retries reached for video ${index}. Cannot proceed further.`
//           );
//           // You may choose to call onAllVideosEnded() here or handle it differently
//           onAllVideosEnded();
//           isStopped.current = true;
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
//           onAllVideosEnded();
//           isStopped.current = true;
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
//       } catch (error) {
//         console.error("Error appending buffer:", error);
//         // In case of error, re-queue the video and retry later
//         queuedVideos.current.unshift(nextVideo);
//       }
//     }
//   };

//   const onUpdateEnd = () => {
//     if (isStopped.current) return;

//     console.log("onUpdateEnd()");
//     appendNextVideo();

//     // Set canPlay to true after the first video is appended
//     if (!canPlay) {
//       setCanPlay(true);
//     }
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

//       // Start by fetching the first two videos
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
//     if (isVisible && canPlay) {
//       const videoElement = videoRef.current;
//       if (videoElement) {
//         videoElement
//           .play()
//           .then(() => {
//             console.log("Video started playing.");
//           })
//           .catch((error) => {
//             console.error("Playback failed:", error);
//           });
//       }
//     } else {
//       videoRef.current?.pause();
//     }
//   }, [isVisible, canPlay]);

//   return (
//     <video
//       ref={videoRef}
//       style={{ width: "100%", height: "100%" }}
//       onPlay={onStart}
//     />
//   );
// };

// export default SeamlessVideoPlayer;

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
//   const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
//     if (fetchInProgress.current[index]) return; // Avoid overlapping fetches
//     fetchInProgress.current[index] = true;

//     if (index == 0) {
//       console.log("sleeping...");
//       await sleep(7000);
//       console.log("sleep end");
//     }

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
//       retryCounts.current[index] = 0; // Reset retry count on success

//       if (
//         mediaSource &&
//         mediaSource.readyState === "open" &&
//         sourceBufferRef.current &&
//         !sourceBufferRef.current.updating
//       ) {
//         appendNextVideo();
//       }

//       // Prefetch the next video in the background
//       if (index === 0) {
//         // Fetch the second video before starting playback

//         fetchAndAppendVideo(index + 1);
//       } else if (index > 0) {
//         // Continue fetching subsequent videos
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

//   const fetchAndAppendVideoAfterFinal = async (index) => {
//     if (isStopped.current) return;
//     if (fetchInProgress.current[index]) return; // Avoid overlapping fetches
//     fetchInProgress.current[index] = true;

//     const url = getVideoUrl(index);
//     const mediaSource = mediaSourceRef.current;

//     try {
//       console.log(
//         `Attempting to fetch video fetchAndAppendVideoAfterFinal ${index}`
//       );

//       const response = await fetch(url);

//       if (!response.ok) {
//         // throw new Error(`Failed to fetch video: ${response.statusText}`);
//         onAllVideosEnded();
//         isStopped.current = true;
//       }

//       const arrayBuffer = await response.arrayBuffer();
//       queuedVideos.current.push(arrayBuffer);

//       fetchInProgress.current[index] = false;
//       retryCounts.current[index] = 0; // Reset retry count on success

//       if (
//         mediaSource &&
//         mediaSource.readyState === "open" &&
//         sourceBufferRef.current &&
//         !sourceBufferRef.current.updating
//       ) {
//         appendNextVideo();
//       }

//       // Prefetch the next video in the background
//       if (index === 0) {
//         // Fetch the second video before starting playback

//         fetchAndAppendVideoAfterFinal(index + 1);
//       } else if (index > 0) {
//         // Continue fetching subsequent videos
//         currentIndexRef.current = index + 1;
//         fetchAndAppendVideoAfterFinal(currentIndexRef.current);
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
//     if (fetchInProgress.current["final"]) return; // Avoid overlapping fetches
//     fetchInProgress.current["final"] = true;

//     const finalUrl = getVideoUrl("final");

//     try {
//       const response = await fetch(finalUrl);
//       if (response.ok) {
//         // '_final' video exists, call onAllVideosEnded immediately
//         console.log(`'_final' video exists. Ending playback.`);
//         fetchInProgress.current["final"] = false;
//         retryCounts.current["final"] = 0; // Reset retry count on success

//         // onAllVideosEnded();
//         fetchAndAppendVideoAfterFinal(index);
//       } else {
//         // '_final' video does not exist, retry fetching the same index
//         console.log(`'_final' video does not exist. Retrying video ${index}`);
//         fetchInProgress.current["final"] = false;
//         retryCounts.current[index] = (retryCounts.current[index] || 0) + 1;

//         if (retryCounts.current[index] < MAX_RETRIES) {
//           setTimeout(() => fetchAndAppendVideo(index), RETRY_DELAY);
//         } else {
//           console.error(
//             `Max retries reached for video ${index}. Cannot proceed further.`
//           );
//           // You may choose to call onAllVideosEnded() here or handle it differently
//           onAllVideosEnded();
//           isStopped.current = true;
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
//           onAllVideosEnded();
//           isStopped.current = true;
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
//       } catch (error) {
//         console.error("Error appending buffer:", error);
//         // In case of error, re-queue the video and retry later
//         queuedVideos.current.unshift(nextVideo);
//       }
//     }
//   };

//   const onUpdateEnd = () => {
//     if (isStopped.current) return;

//     console.log("onUpdateEnd()");
//     appendNextVideo();

//     // Set canPlay to true after the first video is appended
//     if (!canPlay) {
//       setCanPlay(true);
//     }
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

//       // Start by fetching the first two videos
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
//     if (isVisible && canPlay) {
//       const videoElement = videoRef.current;
//       if (videoElement) {
//         videoElement
//           .play()
//           .then(() => {
//             console.log("Video started playing.");
//           })
//           .catch((error) => {
//             console.error("Playback failed:", error);
//           });
//       }
//     } else {
//       videoRef.current?.pause();
//     }
//   }, [isVisible, canPlay]);

//   return (
//     <video
//       ref={videoRef}
//       style={{ width: "100%", height: "100%" }}
//       onPlay={onStart}
//     />
//   );
// };

// export default SeamlessVideoPlayer;

import React, { useEffect, useRef, useState } from "react";

const SeamlessVideoPlayer = ({
  initialVideoUrl,
  isVisible = true,
  onEnded,
  onStart,
  onAllVideosEnded,
  onLoadingChange, // AiConsultChannelPage에 알려주기
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
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const [isInitialLoading, setIsInitialLoading] = useState(true); // 로딩 스피너 대신 디폴트 영상 보이게

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

    if (index == 0) {
      console.log("sleeping...");
      await sleep(5000);
      console.log("sleep end");

      setIsInitialLoading(false); // 로딩 스피너 대신 디폴트 영상 보이게
    }

    const url = getVideoUrl(index);
    const mediaSource = mediaSourceRef.current;
    try {
      console.log("Fetching url: ", url);
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

  const fetchAndAppendVideoAfterFinal = async (index) => {
    if (isStopped.current) return;
    if (fetchInProgress.current[index]) return; // Avoid overlapping fetches
    fetchInProgress.current[index] = true;

    const url = getVideoUrl(index);
    const mediaSource = mediaSourceRef.current;

    try {
      console.log(
        `Attempting to fetch video fetchAndAppendVideoAfterFinal ${index}`
      );

      const response = await fetch(url);

      if (!response.ok) {
        // If the final video does not exist, end the stream
        console.log(`'_final' video does not exist. Ending stream.`);
        fetchInProgress.current["final"] = false;
        isStopped.current = true;

        if (mediaSource && mediaSource.readyState === "open") {
          mediaSource.endOfStream();
        }

        return;
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
        fetchAndAppendVideoAfterFinal(index + 1);
      } else if (index > 0) {
        // Continue fetching subsequent videos
        currentIndexRef.current = index + 1;
        fetchAndAppendVideoAfterFinal(currentIndexRef.current);
      }
    } catch (error) {
      console.error(`Error fetching video ${index}:`, error);
      fetchInProgress.current[index] = false;
      retryCounts.current[index] = (retryCounts.current[index] || 0) + 1;
      if (retryCounts.current[index] < MAX_RETRIES) {
        setTimeout(() => fetchAndAppendVideoAfterFinal(index), RETRY_DELAY);
      } else {
        console.error(`Max retries reached for video ${index}. Ending stream.`);
        isStopped.current = true;
        if (mediaSource && mediaSource.readyState === "open") {
          mediaSource.endOfStream();
        }
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
        // '_final' video exists, proceed to fetch it
        console.log(`'_final' video exists. Fetching final video.`);
        fetchInProgress.current["final"] = false;
        retryCounts.current["final"] = 0; // Reset retry count on success
        fetchAndAppendVideoAfterFinal(index);
      } else {
        // '_final' video does not exist, end the stream
        console.log(`'_final' video does not exist. Ending stream.`);
        fetchInProgress.current["final"] = false;
        isStopped.current = true;
        if (mediaSource && mediaSource.readyState === "open") {
          mediaSource.endOfStream();
        }
      }
    } catch (error) {
      console.error("Error checking for '_final' video:", error);
      fetchInProgress.current["final"] = false;
      retryCounts.current["final"] = (retryCounts.current["final"] || 0) + 1;
      if (retryCounts.current["final"] < MAX_RETRIES) {
        setTimeout(() => checkForFinalVideo(index), RETRY_DELAY);
      } else {
        console.error(`Max retries reached for '_final' video. Ending stream.`);
        isStopped.current = true;
        if (mediaSource && mediaSource.readyState === "open") {
          mediaSource.endOfStream();
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
    const handleEnded = () => {
      console.log("Playback ended.");
      onAllVideosEnded();
    };
    video.addEventListener("ended", handleEnded);
    return () => {
      mediaSource.removeEventListener("sourceopen", handleSourceOpen);
      video.removeEventListener("ended", handleEnded);
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
    // 로딩 스피너 대신 디폴트 영상 보이게 하려고 주석시킨 원래 코드
    // <video
    //   ref={videoRef}
    //   style={{ width: "100%", height: "100%" }}
    //   onPlay={onStart}
    // />

    // 로딩 스피너 대신 디폴트 영상 보이게
    // <div style={{ position: "relative", width: "100%", height: "100%" }}>
    <video
      ref={videoRef}
      style={{ width: "100%", height: "100%" }}
      onPlay={onStart}
    />
    /* {isInitialLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
            zIndex: 1, // 비디오 위에 오버레이 표시 // 안되면 2로 바꿔보기
          }}
        />
      )}
    </div> */
  );
};

export default SeamlessVideoPlayer;
