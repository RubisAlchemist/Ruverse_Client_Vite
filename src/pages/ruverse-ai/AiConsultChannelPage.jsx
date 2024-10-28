// import React, { useState, useEffect, useRef, useCallback } from "react";
// import {
//   AudioRecorder,
//   LocalUser,
//   SeamlessVideoPlayer,
// } from "@components/index";
// import { Button, Box, Fade, CircularProgress } from "@mui/material";
// import {
//   clearAudioSrc,
//   setGreetingsPlayed,
//   setNotePlaying,
//   clearNotePlaying,
// } from "@store/ai/aiConsultSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useLocation, useNavigate } from "react-router-dom";

// // Icon imports
// import Exit from "@assets/images/exit.png";
// import Describe1Image from "@assets/images/describe1.png";
// import Describe2Image from "@assets/images/describe2.png";

// // Background image
// import BackgroundImage_sonny from "@assets/images/background_sonny.png";
// import BackgroundImage_karina from "@assets/images/background_karina.png";

// const useQuery = () => {
//   return new URLSearchParams(useLocation().search);
// };

// const AiConsultChannelPage = () => {
//   const { uname } = useParams();
//   const query = useQuery();
//   const phoneNumber = query.get("phoneNumber");
//   const selectedAvatar = query.get("selectedAvatar");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [overlayVideo, setOverlayVideo] = useState(null);
//   const [isSeamlessPlaying, setIsSeamlessPlaying] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isAnswerButtonEnabled, setIsAnswerButtonEnabled] = useState(true);
//   const [showInstruction, setShowInstruction] = useState(true);
//   const [isSeamlessLoading, setIsSeamlessLoading] = useState(false);

//   const greetingsVideoRef = useRef(null);

//   // Retrieve all sources from the Redux store
//   const audioSources = useSelector((state) => state.aiConsult.audio);

//   // console.log("audioSource: ", audioSources[selectedAvatar]);

//   // Select the appropriate sources based on selectedAvatar
//   const defaultSrc = audioSources[selectedAvatar]?.defaultSrc;
//   const greetingsSrc = audioSources[selectedAvatar]?.greetingsSrc;
//   const errorSrc = audioSources[selectedAvatar]?.errorSrc;
//   const noteSrc = audioSources[selectedAvatar]?.noteSrc;

//   const src = useSelector((state) => state.aiConsult.audio.src);
//   const isGreetingsPlaying = useSelector(
//     (state) => state.aiConsult.audio.isGreetingsPlaying
//   );
//   const isUploading = useSelector(
//     (state) => state.aiConsult.audio.upload.isLoading
//   );
//   const isNotePlaying = useSelector(
//     (state) => state.aiConsult.audio.isNotePlaying
//   );

//   let BackgroundImage;
//   if (selectedAvatar === "sonny") {
//     BackgroundImage = BackgroundImage_sonny;
//   } else if (selectedAvatar === "karina") {
//     BackgroundImage = BackgroundImage_karina;
//   } else {
//     // Default background image
//     BackgroundImage = BackgroundImage_sonny;
//   }

//   const handleEndConsultation = useCallback(() => {
//     // 페이지 이동 전에 필요한 정리 작업 수행
//     dispatch(clearAudioSrc());
//     // 다른 필요한 상태 초기화...

//     // 페이지 이동
//     navigate("/ai-consultEntry", { replace: true });
//     window.location.reload();
//   }, [navigate, dispatch]);

//   const handleExitClick = useCallback(
//     (e) => {
//       e.preventDefault();
//       e.stopPropagation();
//       // 즉시 종료 처리
//       handleEndConsultation();
//     },
//     [handleEndConsultation]
//   );

//   const handleRefresh = useCallback((e) => {
//     e.preventDefault();
//     const confirmRefresh = window.confirm(
//       "Are you sure you want to refresh the page?"
//     );
//     if (confirmRefresh) {
//       window.location.reload();
//     }
//   }, []);

//   useEffect(() => {
//     const handleKeyPress = (e) => {
//       if (e.key === "F5" || (e.ctrlKey && e.key === "r")) {
//         handleRefresh(e);
//       }
//     };

//     window.addEventListener("keydown", handleKeyPress);

//     return () => {
//       window.removeEventListener("keydown", handleKeyPress);
//     };
//   }, [handleRefresh]);

//   useEffect(() => {
//     console.log("AiConsultChannelPage: Component mounted");
//     if (greetingsSrc && isGreetingsPlaying) {
//       console.log("Setting initial greeting video");
//       setOverlayVideo(greetingsSrc);
//     }
//     return () => {
//       console.log("AiConsultChannelPage: Component unmounting");
//     };
//   }, [greetingsSrc, isGreetingsPlaying]);

//   // 📌 src가 "error"일 때 errorSrc를 재생하도록 하는 useEffect 로직 수정
//   useEffect(() => {
//     console.log("State change detected", {
//       isGreetingsPlaying,
//       greetingsSrc,
//       isNotePlaying,
//       src,
//       errorSrc,
//       isSeamlessPlaying,
//       overlayVideo,
//       isSeamlessLoading,
//     });

//     // src가 'error'일 때 errorSrc 비디오 재생
//     if (src === "error" && !overlayVideo) {
//       console.log("Playing error video due to error in src");
//       setOverlayVideo(errorSrc); // errorSrc를 overlayVideo로 설정
//       setIsSeamlessPlaying(false);
//       dispatch(setGreetingsPlayed());
//     }
//     // 인사말 비디오 재생
//     else if (isGreetingsPlaying && greetingsSrc && !overlayVideo) {
//       console.log("Playing greeting video");
//       setOverlayVideo(greetingsSrc);
//       setIsSeamlessPlaying(false);
//     }
//     // 일반 비디오 재생
//     else if (
//       src &&
//       !isSeamlessPlaying &&
//       !isGreetingsPlaying &&
//       !overlayVideo &&
//       src !== "error"
//     ) {
//       console.log("Starting seamless video playback");
//       setOverlayVideo(null);
//       setIsSeamlessPlaying(true);
//       setIsLoading(true);
//     }
//     // 초기 상태로 리셋
//     else if (
//       !src &&
//       !isGreetingsPlaying &&
//       !isSeamlessPlaying &&
//       !isNotePlaying
//     ) {
//       console.log("Resetting to default state");
//       setOverlayVideo(null);
//       setIsSeamlessPlaying(false);
//     }
//   }, [
//     isGreetingsPlaying,
//     src,
//     isNotePlaying,
//     greetingsSrc,
//     errorSrc, // errorSrc를 의존성 배열에 추가
//     noteSrc,
//     isSeamlessPlaying,
//     overlayVideo,
//     isSeamlessLoading,
//     dispatch,
//   ]);

//   const handleOverlayVideoEnd = useCallback(() => {
//     console.log("Overlay video ended");
//     if (isGreetingsPlaying) {
//       console.log("Greeting video finished");
//       dispatch(setGreetingsPlayed());
//     } else if (isNotePlaying) {
//       console.log("Note video finished");
//       dispatch(clearNotePlaying());
//     } else {
//       console.log("Regular overlay video finished");
//       dispatch(clearAudioSrc());
//     }
//     setOverlayVideo(null);
//     setIsAnswerButtonEnabled(true);
//   }, [dispatch, isGreetingsPlaying, isNotePlaying]);

//   const handleSeamlessVideoEnd = useCallback(() => {
//     console.log("Seamless video playback ended");
//     setIsSeamlessPlaying(false);
//     setIsLoading(false);
//     dispatch(clearAudioSrc());
//   }, [dispatch]);

//   const handleSeamlessVideoStart = useCallback(() => {
//     console.log("Seamless video playback started");
//     console.log(src);
//     setIsLoading(false);
//     setIsAnswerButtonEnabled(false);
//     if (isNotePlaying) {
//       console.log("Stopping note video as seamless video is starting");
//       dispatch(clearNotePlaying());
//       setOverlayVideo(null);
//     }
//   }, [src, dispatch, isNotePlaying]);
//   const handleAllVideosEnded = useCallback(() => {
//     console.log("All seamless videos have ended");
//     setIsSeamlessPlaying(false);
//     setIsLoading(false);
//     dispatch(clearAudioSrc());
//     setIsAnswerButtonEnabled(true);
//   }, [dispatch]);

//   const handleGreetingsVideoPlay = () => {
//     console.log("Greetings video started playing");
//   };

//   const handleGreetingsVideoError = (e) => {
//     console.error("Error playing greetings video:", e);
//   };

//   const handleRecordingStart = () => {
//     console.log("Recording started");
//     setShowInstruction(false);
//   };

//   const handleRecordingStop = () => {
//     console.log("Recording stopped");
//   };

//   return (
//     <Box width="100%" height="100vh">
//       <Box
//         width="100%"
//         height="90%"
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         position="relative"
//       >
//         <Box
//           component="img"
//           src={BackgroundImage}
//           alt="Background"
//           position="absolute"
//           height="100%"
//           objectFit="cover"
//           zIndex={0}
//           sx={{
//             display: { xs: "none", md: "block" },
//             border: "none",
//           }}
//         />

//         <Box
//           component="video"
//           width="100%"
//           height="100%"
//           src={defaultSrc}
//           loop
//           autoPlay
//           muted
//           position="relative"
//           zIndex={1}
//           sx={{ border: "none" }}
//         />

//         {isSeamlessPlaying && (
//           <Box
//             position="absolute"
//             top={0}
//             left={0}
//             width="100%"
//             height="100%"
//             zIndex={3}
//             sx={{ border: "none" }}
//           >
//             <SeamlessVideoPlayer
//               initialVideoUrl={src}
//               isVisible={isSeamlessPlaying}
//               onEnded={handleAllVideosEnded}
//               onStart={handleSeamlessVideoStart}
//               onAllVideosEnded={handleAllVideosEnded}
//             />
//           </Box>
//         )}

//         {overlayVideo && (
//           <Fade in={true}>
//             <Box
//               position="absolute"
//               top={0}
//               left={0}
//               width="100%"
//               height="100%"
//               component="video"
//               ref={greetingsVideoRef}
//               src={overlayVideo}
//               autoPlay
//               onEnded={handleOverlayVideoEnd}
//               onPlay={handleGreetingsVideoPlay}
//               onError={handleGreetingsVideoError}
//               zIndex={2}
//             />
//           </Fade>
//         )}

//         {isLoading && (
//           <Box
//             position="absolute"
//             top={0}
//             left={0}
//             width="100%"
//             height="100%"
//             display="flex"
//             justifyContent="center"
//             alignItems="center"
//             bgcolor="transparent"
//           >
//             <CircularProgress />
//           </Box>
//         )}

//         {isSeamlessLoading && (
//           <Box
//             position="absolute"
//             top={0}
//             left={0}
//             width="100%"
//             height="100%"
//             bgcolor="transparent"
//             zIndex={5}
//           />
//         )}
//       </Box>

//       <Box
//         position="absolute"
//         zIndex={2}
//         right={0}
//         bottom={"10%"}
//         width={{ xs: "200px", md: "320px" }}
//         height={{ xs: "120px", md: "200px" }}
//       >
//         <LocalUser />
//       </Box>

//       <Box
//         position="relative"
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         height="10%"
//         borderTop={1}
//         borderColor={"#ccc"}
//       >
//         {showInstruction && (
//           <Box
//             position="absolute"
//             margin="auto"
//             display="flex"
//             sx={{
//               transform: "translateX(-65%)",
//               height: { xs: "24px", sm: "40px", md: "50px", lg: "60px" },
//             }}
//           >
//             <img
//               src={Describe1Image}
//               alt="describe1"
//               style={{
//                 width: "auto",
//                 height: "100%",
//               }}
//             />
//           </Box>
//         )}

//         <AudioRecorder
//           uname={uname}
//           phoneNumber={phoneNumber}
//           selectedAvatar={selectedAvatar}
//           disabled={
//             isGreetingsPlaying ||
//             !!overlayVideo ||
//             isSeamlessPlaying ||
//             isUploading ||
//             isLoading ||
//             !isAnswerButtonEnabled
//           }
//           onRecordingStart={handleRecordingStart}
//           onRecordingStop={handleRecordingStop}
//         />

//         <Box
//           position="absolute"
//           right="2px"
//           display="flex"
//           alignItems="center"
//           sx={{
//             gap: { xs: "2px", sm: "3px", md: "4px", lg: "5px" },
//           }}
//         >
//           {showInstruction && (
//             <Box
//               sx={{
//                 height: { xs: "24px", sm: "40px", md: "50px", lg: "60px" },
//               }}
//             >
//               <img
//                 src={Describe2Image}
//                 alt="describe2"
//                 style={{
//                   width: "auto",
//                   height: "100%",
//                 }}
//               />
//             </Box>
//           )}

//           <Button
//             onClick={handleExitClick}
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               height: { xs: "35px", sm: "45px", md: "55px", lg: "65px" },
//               minWidth: 0,
//             }}
//           >
//             <img
//               src={Exit}
//               alt="exit icon"
//               style={{
//                 width: "auto",
//                 height: "100%",
//               }}
//             />
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default AiConsultChannelPage;

// import React, { useState, useEffect, useRef, useCallback } from "react";
// import {
//   AudioRecorder,
//   LocalUser,
//   SeamlessVideoPlayer,
// } from "@components/index";
// import { Button, Box, Fade, CircularProgress } from "@mui/material";
// import {
//   clearAudioSrc,
//   setGreetingsPlayed,
//   setNotePlaying,
//   clearNotePlaying,
// } from "@store/ai/aiConsultSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useLocation, useNavigate } from "react-router-dom";

// // 아이콘 및 이미지 임포트
// import Exit from "@assets/images/exit.png";
// import Describe1Image from "@assets/images/describe1.png";
// import Describe2Image from "@assets/images/describe2.png";
// import BackgroundImage_sonny from "@assets/images/background_sonny.png";
// import BackgroundImage_karina from "@assets/images/background_karina.png";

// const useQuery = () => {
//   return new URLSearchParams(useLocation().search);
// };

// const AiConsultChannelPage = () => {
//   const { uname } = useParams();
//   const query = useQuery();
//   const phoneNumber = query.get("phoneNumber");
//   const selectedAvatar = query.get("selectedAvatar");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // 상태 변수들
//   const [overlayVideo, setOverlayVideo] = useState(null);
//   const [isSeamlessPlaying, setIsSeamlessPlaying] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isAnswerButtonEnabled, setIsAnswerButtonEnabled] = useState(true);
//   const [showInstruction, setShowInstruction] = useState(true);
//   const [isSeamlessLoading, setIsSeamlessLoading] = useState(false);

//   const greetingsVideoRef = useRef(null);

//   // Redux 상태 가져오기
//   const audioSources = useSelector((state) => state.aiConsult.audio);
//   const src = useSelector((state) => state.aiConsult.audio.src);
//   const isGreetingsPlaying = useSelector(
//     (state) => state.aiConsult.audio.isGreetingsPlaying
//   );
//   const isNotePlaying = useSelector(
//     (state) => state.aiConsult.audio.isNotePlaying
//   );
//   const isUploading = useSelector(
//     (state) => state.aiConsult.audio.upload.isLoading
//   );

//   // 선택된 아바타에 따른 소스 가져오기
//   const defaultSrc = audioSources[selectedAvatar]?.defaultSrc;
//   const greetingsSrc = audioSources[selectedAvatar]?.greetingsSrc;
//   const errorSrc = audioSources[selectedAvatar]?.errorSrc;
//   const noteSrc = audioSources[selectedAvatar]?.noteSrc;

//   // 배경 이미지 설정
//   let BackgroundImage;
//   if (selectedAvatar === "sonny") {
//     BackgroundImage = BackgroundImage_sonny;
//   } else if (selectedAvatar === "karina") {
//     BackgroundImage = BackgroundImage_karina;
//   } else {
//     BackgroundImage = BackgroundImage_sonny;
//   }

//   // 상담 종료 핸들러
//   const handleEndConsultation = useCallback(() => {
//     dispatch(clearAudioSrc());
//     navigate("/ai-consultEntry", { replace: true });
//     window.location.reload();
//   }, [navigate, dispatch]);

//   // 종료 버튼 클릭 핸들러
//   const handleExitClick = useCallback(
//     (e) => {
//       e.preventDefault();
//       e.stopPropagation();
//       handleEndConsultation();
//     },
//     [handleEndConsultation]
//   );

//   // 페이지 새로고침 방지 핸들러
//   const handleRefresh = useCallback((e) => {
//     e.preventDefault();
//     const confirmRefresh = window.confirm("페이지를 새로고침하시겠습니까?");
//     if (confirmRefresh) {
//       window.location.reload();
//     }
//   }, []);

//   useEffect(() => {
//     const handleKeyPress = (e) => {
//       if (e.key === "F5" || (e.ctrlKey && e.key === "r")) {
//         handleRefresh(e);
//       }
//     };
//     window.addEventListener("keydown", handleKeyPress);
//     return () => {
//       window.removeEventListener("keydown", handleKeyPress);
//     };
//   }, [handleRefresh]);

//   // 상태 변화에 따른 비디오 재생 로직
//   useEffect(() => {
//     if (!overlayVideo) {
//       if (isGreetingsPlaying && greetingsSrc) {
//         console.log("인사말 비디오 재생");
//         setOverlayVideo(greetingsSrc);
//         setIsSeamlessPlaying(false);
//       } else if (src === "error") {
//         console.log("에러 비디오 재생");
//         setOverlayVideo(errorSrc);
//         setIsSeamlessPlaying(false);
//         // 에러 비디오 재생을 표시하기 위해 상태 설정
//       } else if (isNotePlaying && noteSrc) {
//         console.log("노트 비디오 재생");
//         setOverlayVideo(noteSrc);
//       }
//     }

//     if (src && !isSeamlessPlaying && src !== "error") {
//       console.log("시작하기 seamless 비디오 재생");
//       setIsSeamlessPlaying(true);
//       setIsLoading(true);
//     }
//   }, [
//     overlayVideo,
//     isGreetingsPlaying,
//     greetingsSrc,
//     src,
//     errorSrc,
//     isNotePlaying,
//     noteSrc,
//     isSeamlessPlaying,
//     dispatch,
//   ]);

//   // overlay 비디오 종료 핸들러
//   const handleOverlayVideoEnd = useCallback(() => {
//     console.log("Overlay 비디오 종료");
//     if (isGreetingsPlaying) {
//       dispatch(setGreetingsPlayed());
//     } else if (isNotePlaying) {
//       dispatch(clearNotePlaying());
//     } else if (src === "error") {
//       console.log("에러 비디오 재생 종료");
//       dispatch(clearAudioSrc()); // src를 초기화하여 에러 비디오가 다시 재생되지 않도록 함
//     }
//     setOverlayVideo(null);
//     setIsAnswerButtonEnabled(true);
//   }, [dispatch, isGreetingsPlaying, isNotePlaying, src]);

//   // seamless 비디오 핸들러들
//   const handleSeamlessVideoEnd = useCallback(() => {
//     console.log("Seamless 비디오 재생 종료");
//     setIsSeamlessPlaying(false);
//     setIsLoading(false);
//     dispatch(clearAudioSrc());
//   }, [dispatch]);

//   const handleSeamlessVideoStart = useCallback(() => {
//     console.log("Seamless 비디오 재생 시작");
//     setIsLoading(false);
//     setIsAnswerButtonEnabled(false);
//   }, []);

//   const handleAllVideosEnded = useCallback(() => {
//     console.log("모든 Seamless 비디오 종료");
//     setIsSeamlessPlaying(false);
//     setIsLoading(false);
//     dispatch(clearAudioSrc());
//     setIsAnswerButtonEnabled(true);
//   }, [dispatch]);

//   const handleGreetingsVideoPlay = () => {
//     console.log("인사말 비디오 재생 시작");
//   };

//   const handleGreetingsVideoError = (e) => {
//     console.error("인사말 비디오 재생 오류:", e);
//   };

//   const handleRecordingStart = () => {
//     console.log("녹음 시작");
//     setShowInstruction(false);
//   };

//   const handleRecordingStop = () => {
//     console.log("녹음 종료");
//   };

//   return (
//     <Box width="100%" height="100vh">
//       <Box
//         width="100%"
//         height="90%"
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         position="relative"
//       >
//         {/* 배경 이미지 */}
//         <Box
//           component="img"
//           src={BackgroundImage}
//           alt="Background"
//           position="absolute"
//           height="100%"
//           objectFit="cover"
//           zIndex={0}
//           sx={{
//             display: { xs: "none", md: "block" },
//             border: "none",
//           }}
//         />

//         {/* default 비디오 */}
//         <Box
//           component="video"
//           width="100%"
//           height="100%"
//           top={0}
//           left={0}
//           src={defaultSrc}
//           loop
//           autoPlay
//           muted
//           position="relative"
//           zIndex={1}
//         />

//         {/* overlay 비디오 (greetings, note, error 등) */}
//         {overlayVideo && (
//           <Fade in={true}>
//             <Box
//               position="absolute"
//               top={0}
//               left={0}
//               width="100%"
//               height="100%"
//               component="video"
//               ref={greetingsVideoRef}
//               src={overlayVideo}
//               autoPlay
//               onEnded={handleOverlayVideoEnd}
//               onPlay={handleGreetingsVideoPlay}
//               onError={handleGreetingsVideoError}
//               zIndex={2}
//             />
//           </Fade>
//         )}

//         {/* seamless 비디오 */}
//         {isSeamlessPlaying && (
//           <Box
//             position="absolute"
//             top={0}
//             left={0}
//             width="100%"
//             height="100%"
//             zIndex={3}
//             sx={{ border: "none" }}
//           >
//             <SeamlessVideoPlayer
//               initialVideoUrl={src}
//               isVisible={isSeamlessPlaying}
//               onEnded={handleAllVideosEnded}
//               onStart={handleSeamlessVideoStart}
//               onAllVideosEnded={handleAllVideosEnded}
//             />
//           </Box>
//         )}

//         {/* 로딩 표시 */}
//         {isLoading && (
//           <Box
//             position="absolute"
//             top={0}
//             left={0}
//             width="100%"
//             height="100%"
//             display="flex"
//             justifyContent="center"
//             alignItems="center"
//             bgcolor="transparent"
//           >
//             <CircularProgress />
//           </Box>
//         )}

//         {isSeamlessLoading && (
//           <Box
//             position="absolute"
//             top={0}
//             left={0}
//             width="100%"
//             height="100%"
//             bgcolor="transparent"
//             zIndex={4}
//           />
//         )}
//       </Box>

//       {/* 로컬 유저 비디오 */}
//       <Box
//         position="absolute"
//         zIndex={2}
//         right={0}
//         bottom={"10%"}
//         width={{ xs: "200px", md: "320px" }}
//         height={{ xs: "120px", md: "200px" }}
//       >
//         <LocalUser />
//       </Box>

//       {/* 하단 컨트롤 바 */}
//       <Box
//         position="relative"
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         height="10%"
//         borderTop={1}
//         borderColor={"#ccc"}
//       >
//         {showInstruction && (
//           <Box
//             position="absolute"
//             margin="auto"
//             display="flex"
//             sx={{
//               transform: "translateX(-65%)",
//               height: { xs: "24px", sm: "40px", md: "50px", lg: "60px" },
//             }}
//           >
//             <img
//               src={Describe1Image}
//               alt="describe1"
//               style={{
//                 width: "auto",
//                 height: "100%",
//               }}
//             />
//           </Box>
//         )}

//         {/* 오디오 레코더 */}
//         <AudioRecorder
//           uname={uname}
//           phoneNumber={phoneNumber}
//           selectedAvatar={selectedAvatar}
//           disabled={
//             isGreetingsPlaying ||
//             !!overlayVideo ||
//             isSeamlessPlaying ||
//             isUploading ||
//             isLoading ||
//             !isAnswerButtonEnabled
//           }
//           onRecordingStart={handleRecordingStart}
//           onRecordingStop={handleRecordingStop}
//         />

//         {/* 종료 버튼 */}
//         <Box
//           position="absolute"
//           right="2px"
//           display="flex"
//           alignItems="center"
//           sx={{
//             gap: { xs: "2px", sm: "3px", md: "4px", lg: "5px" },
//           }}
//         >
//           {showInstruction && (
//             <Box
//               sx={{
//                 height: { xs: "24px", sm: "40px", md: "50px", lg: "60px" },
//               }}
//             >
//               <img
//                 src={Describe2Image}
//                 alt="describe2"
//                 style={{
//                   width: "auto",
//                   height: "100%",
//                 }}
//               />
//             </Box>
//           )}

//           <Button
//             onClick={handleExitClick}
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               height: { xs: "35px", sm: "45px", md: "55px", lg: "65px" },
//               minWidth: 0,
//             }}
//           >
//             <img
//               src={Exit}
//               alt="exit icon"
//               style={{
//                 width: "auto",
//                 height: "100%",
//               }}
//             />
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default AiConsultChannelPage;

// import React, { useState, useEffect, useRef, useCallback } from "react";
// import {
//   AudioRecorder,
//   LocalUser,
//   SeamlessVideoPlayer,
// } from "@components/index";
// import { Button, Box, Fade, CircularProgress } from "@mui/material";
// import {
//   clearAudioSrc,
//   setGreetingsPlayed,
//   setNotePlaying,
//   clearNotePlaying,
// } from "@store/ai/aiConsultSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useLocation, useNavigate } from "react-router-dom";

// // 아이콘 및 이미지 임포트
// import Exit from "@assets/images/exit.png";
// import Describe1Image from "@assets/images/describe1.png";
// import Describe2Image from "@assets/images/describe2.png";
// import BackgroundImage_sonny from "@assets/images/background_sonny.png";
// import BackgroundImage_karina from "@assets/images/background_karina.png";

// const useQuery = () => {
//   return new URLSearchParams(useLocation().search);
// };

// const AiConsultChannelPage = () => {
//   const { uname } = useParams();
//   const query = useQuery();
//   const phoneNumber = query.get("phoneNumber");
//   const selectedAvatar = query.get("selectedAvatar");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // 상태 변수들
//   const [overlayVideo, setOverlayVideo] = useState(null);
//   const [isSeamlessPlaying, setIsSeamlessPlaying] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isAnswerButtonEnabled, setIsAnswerButtonEnabled] = useState(true);
//   const [showInstruction, setShowInstruction] = useState(true);
//   const [isSeamlessLoading, setIsSeamlessLoading] = useState(false);
//   const [timestampsArray, setTimestampsArray] = useState([]); // 타임스탬프 저장 배열 추가

//   const greetingsVideoRef = useRef(null);

//   // Redux 상태 가져오기
//   const audioSources = useSelector((state) => state.aiConsult.audio);
//   const src = useSelector((state) => state.aiConsult.audio.src);
//   const isGreetingsPlaying = useSelector(
//     (state) => state.aiConsult.audio.isGreetingsPlaying
//   );
//   const isNotePlaying = useSelector(
//     (state) => state.aiConsult.audio.isNotePlaying
//   );
//   const isUploading = useSelector(
//     (state) => state.aiConsult.audio.upload.isLoading
//   );

//   // 선택된 아바타에 따른 소스 가져오기
//   const defaultSrc = audioSources[selectedAvatar]?.defaultSrc;
//   const greetingsSrc = audioSources[selectedAvatar]?.greetingsSrc;
//   const errorSrc = audioSources[selectedAvatar]?.errorSrc;
//   const noteSrc = audioSources[selectedAvatar]?.noteSrc;

//   // 배경 이미지 설정
//   let BackgroundImage;
//   if (selectedAvatar === "sonny") {
//     BackgroundImage = BackgroundImage_sonny;
//   } else if (selectedAvatar === "karina") {
//     BackgroundImage = BackgroundImage_karina;
//   } else {
//     BackgroundImage = BackgroundImage_sonny;
//   }

//   // 상담 종료 핸들러
//   const handleEndConsultation = useCallback(() => {
//     dispatch(clearAudioSrc());
//     navigate("/ai-consultEntry", { replace: true });
//     window.location.reload();
//   }, [navigate, dispatch]);

//   // CSV 저장 함수
//   const saveTimestampsToCSV = (timestampsArray) => {
//     const fields = ["requestSentTime", "firstVideoPlayedTime"];
//     const csvRows = [];
//     csvRows.push(fields.join(",")); // 헤더 추가
//     timestampsArray.forEach((timestamp) => {
//       csvRows.push(
//         [timestamp.requestSentTime, timestamp.firstVideoPlayedTime].join(",")
//       );
//     });
//     const csvContent = csvRows.join("\n");
//     const blob = new Blob([csvContent], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `timestamps_${Date.now()}.csv`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);
//   };

//   // 종료 버튼 클릭 핸들러
//   const handleExitClick = useCallback(
//     (e) => {
//       e.preventDefault();
//       e.stopPropagation();
//       saveTimestampsToCSV(timestampsArray); // CSV 저장 함수 호출
//       handleEndConsultation();
//     },
//     [handleEndConsultation, timestampsArray]
//   );

//   // 페이지 새로고침 방지 핸들러
//   const handleRefresh = useCallback((e) => {
//     e.preventDefault();
//     const confirmRefresh = window.confirm("페이지를 새로고침하시겠습니까?");
//     if (confirmRefresh) {
//       window.location.reload();
//     }
//   }, []);

//   useEffect(() => {
//     const handleKeyPress = (e) => {
//       if (e.key === "F5" || (e.ctrlKey && e.key === "r")) {
//         handleRefresh(e);
//       }
//     };
//     window.addEventListener("keydown", handleKeyPress);
//     return () => {
//       window.removeEventListener("keydown", handleKeyPress);
//     };
//   }, [handleRefresh]);

//   // 상태 변화에 따른 비디오 재생 로직
//   useEffect(() => {
//     if (!overlayVideo) {
//       if (isGreetingsPlaying && greetingsSrc) {
//         console.log("인사말 비디오 재생");
//         setOverlayVideo(greetingsSrc);
//         setIsSeamlessPlaying(false);
//       } else if (src === "error") {
//         console.log("에러 비디오 재생");
//         setOverlayVideo(errorSrc);
//         setIsSeamlessPlaying(false);
//         // 에러 비디오 재생을 표시하기 위해 상태 설정
//       } else if (isNotePlaying && noteSrc) {
//         console.log("노트 비디오 재생");
//         setOverlayVideo(noteSrc);
//       }
//     }

//     if (src && !isSeamlessPlaying && src !== "error") {
//       console.log("시작하기 seamless 비디오 재생");
//       setIsSeamlessPlaying(true);
//       setIsLoading(true);
//     }
//   }, [
//     overlayVideo,
//     isGreetingsPlaying,
//     greetingsSrc,
//     src,
//     errorSrc,
//     isNotePlaying,
//     noteSrc,
//     isSeamlessPlaying,
//     dispatch,
//   ]);

//   // overlay 비디오 종료 핸들러
//   const handleOverlayVideoEnd = useCallback(() => {
//     console.log("Overlay 비디오 종료");
//     if (isGreetingsPlaying) {
//       dispatch(setGreetingsPlayed());
//     } else if (isNotePlaying) {
//       dispatch(clearNotePlaying());
//     } else if (src === "error") {
//       console.log("에러 비디오 재생 종료");
//       dispatch(clearAudioSrc()); // src를 초기화하여 에러 비디오가 다시 재생되지 않도록 함
//     }
//     setOverlayVideo(null);
//     setIsAnswerButtonEnabled(true);
//   }, [dispatch, isGreetingsPlaying, isNotePlaying, src]);

//   // seamless 비디오 핸들러들
//   const handleSeamlessVideoEnd = useCallback(() => {
//     console.log("Seamless 비디오 재생 종료");
//     setIsSeamlessPlaying(false);
//     setIsLoading(false);
//     dispatch(clearAudioSrc());
//   }, [dispatch]);

//   const handleSeamlessVideoStart = useCallback(() => {
//     console.log("Seamless 비디오 재생 시작");
//     setIsLoading(false);
//     setIsAnswerButtonEnabled(false);

//     // 타임스탬프 배열의 마지막 객체에 firstVideoPlayedTime 추가
//     setTimestampsArray((prevArray) => {
//       if (prevArray.length === 0) return prevArray;
//       const newArray = [...prevArray];
//       newArray[newArray.length - 1].firstVideoPlayedTime = Date.now();
//       return newArray;
//     });
//   }, []);

//   const handleAllVideosEnded = useCallback(() => {
//     console.log("모든 Seamless 비디오 종료");
//     setIsSeamlessPlaying(false);
//     setIsLoading(false);
//     dispatch(clearAudioSrc());
//     setIsAnswerButtonEnabled(true);
//   }, [dispatch]);

//   const handleGreetingsVideoPlay = () => {
//     console.log("인사말 비디오 재생 시작");
//   };

//   const handleGreetingsVideoError = (e) => {
//     console.error("인사말 비디오 재생 오류:", e);
//   };

//   const handleRecordingStart = () => {
//     console.log("녹음 시작");
//     setShowInstruction(false);
//   };

//   const handleRecordingStop = useCallback((timestamp) => {
//     console.log("녹음 종료");
//     // 타임스탬프 배열에 새로운 객체 추가
//     setTimestampsArray((prevArray) => [
//       ...prevArray,
//       { requestSentTime: timestamp, firstVideoPlayedTime: null },
//     ]);
//   }, []);

//   return (
//     <Box width="100%" height="100vh">
//       <Box
//         width="100%"
//         height="90%"
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         position="relative"
//       >
//         {/* 배경 이미지 */}
//         <Box
//           component="img"
//           src={BackgroundImage}
//           alt="Background"
//           position="absolute"
//           height="100%"
//           objectFit="cover"
//           zIndex={0}
//           sx={{
//             display: { xs: "none", md: "block" },
//             border: "none",
//           }}
//         />

//         {/* default 비디오 */}
//         <Box
//           component="video"
//           width="100%"
//           height="100%"
//           top={0}
//           left={0}
//           src={defaultSrc}
//           loop
//           autoPlay
//           muted
//           position="relative"
//           zIndex={1}
//         />

//         {/* overlay 비디오 (greetings, note, error 등) */}
//         {overlayVideo && (
//           <Fade in={true}>
//             <Box
//               position="absolute"
//               top={0}
//               left={0}
//               width="100%"
//               height="100%"
//               component="video"
//               ref={greetingsVideoRef}
//               src={overlayVideo}
//               autoPlay
//               onEnded={handleOverlayVideoEnd}
//               onPlay={handleGreetingsVideoPlay}
//               onError={handleGreetingsVideoError}
//               zIndex={2}
//             />
//           </Fade>
//         )}

//         {/* seamless 비디오 */}
//         {isSeamlessPlaying && (
//           <Box
//             position="absolute"
//             top={0}
//             left={0}
//             width="100%"
//             height="100%"
//             zIndex={3}
//             sx={{ border: "none" }}
//           >
//             <SeamlessVideoPlayer
//               initialVideoUrl={src}
//               isVisible={isSeamlessPlaying}
//               onEnded={handleAllVideosEnded}
//               onStart={handleSeamlessVideoStart}
//               onAllVideosEnded={handleAllVideosEnded}
//             />
//           </Box>
//         )}

//         {/* 로딩 표시 */}
//         {isLoading && (
//           <Box
//             position="absolute"
//             top={0}
//             left={0}
//             width="100%"
//             height="100%"
//             display="flex"
//             justifyContent="center"
//             alignItems="center"
//             bgcolor="transparent"
//           >
//             <CircularProgress />
//           </Box>
//         )}

//         {isSeamlessLoading && (
//           <Box
//             position="absolute"
//             top={0}
//             left={0}
//             width="100%"
//             height="100%"
//             bgcolor="transparent"
//             zIndex={4}
//           />
//         )}
//       </Box>

//       {/* 로컬 유저 비디오 */}
//       <Box
//         position="absolute"
//         zIndex={2}
//         right={0}
//         bottom={"10%"}
//         width={{ xs: "200px", md: "320px" }}
//         height={{ xs: "120px", md: "200px" }}
//       >
//         <LocalUser />
//       </Box>

//       {/* 하단 컨트롤 바 */}
//       <Box
//         position="relative"
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         height="10%"
//         borderTop={1}
//         borderColor={"#ccc"}
//       >
//         {showInstruction && (
//           <Box
//             position="absolute"
//             margin="auto"
//             display="flex"
//             sx={{
//               transform: "translateX(-65%)",
//               height: { xs: "24px", sm: "40px", md: "50px", lg: "60px" },
//             }}
//           >
//             <img
//               src={Describe1Image}
//               alt="describe1"
//               style={{
//                 width: "auto",
//                 height: "100%",
//               }}
//             />
//           </Box>
//         )}

//         {/* 오디오 레코더 */}
//         <AudioRecorder
//           uname={uname}
//           phoneNumber={phoneNumber}
//           selectedAvatar={selectedAvatar}
//           disabled={
//             isGreetingsPlaying ||
//             !!overlayVideo ||
//             isSeamlessPlaying ||
//             isUploading ||
//             isLoading ||
//             !isAnswerButtonEnabled
//           }
//           onRecordingStart={handleRecordingStart}
//           onRecordingStop={handleRecordingStop} // 추가된 부분
//         />

//         {/* 종료 버튼 */}
//         <Box
//           position="absolute"
//           right="2px"
//           display="flex"
//           alignItems="center"
//           sx={{
//             gap: { xs: "2px", sm: "3px", md: "4px", lg: "5px" },
//           }}
//         >
//           {showInstruction && (
//             <Box
//               sx={{
//                 height: { xs: "24px", sm: "40px", md: "50px", lg: "60px" },
//               }}
//             >
//               <img
//                 src={Describe2Image}
//                 alt="describe2"
//                 style={{
//                   width: "auto",
//                   height: "100%",
//                 }}
//               />
//             </Box>
//           )}

//           <Button
//             onClick={handleExitClick}
//             sx={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               height: { xs: "35px", sm: "45px", md: "55px", lg: "65px" },
//               minWidth: 0,
//             }}
//           >
//             <img
//               src={Exit}
//               alt="exit icon"
//               style={{
//                 width: "auto",
//                 height: "100%",
//               }}
//             />
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default AiConsultChannelPage;

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  AudioRecorder,
  LocalUser,
  SeamlessVideoPlayer,
} from "@components/index";
import { Button, Box, Fade, CircularProgress } from "@mui/material";
import {
  clearAudioSrc,
  setGreetingsPlayed,
  setNotePlaying,
  clearNotePlaying,
} from "@store/ai/aiConsultSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";

// 아이콘 및 이미지 임포트
import Exit from "@assets/images/exit.png";
import Describe1Image from "@assets/images/describe1.png";
import Describe2Image from "@assets/images/describe2.png";
import BackgroundImage_sonny from "@assets/images/background_sonny.png";
import BackgroundImage_karina from "@assets/images/background_karina.png";

// SweetAlert2 임포트
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const AiConsultChannelPage = () => {
  const { uname } = useParams();
  const query = useQuery();
  const phoneNumber = query.get("phoneNumber");
  const selectedAvatar = query.get("selectedAvatar");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 상태 변수들
  const [overlayVideo, setOverlayVideo] = useState(null);
  const [isSeamlessPlaying, setIsSeamlessPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnswerButtonEnabled, setIsAnswerButtonEnabled] = useState(true);
  const [showInstruction, setShowInstruction] = useState(true);
  const [isSeamlessLoading, setIsSeamlessLoading] = useState(false);
  const [timestampsArray, setTimestampsArray] = useState([]); // 타임스탬프 저장 배열 추가

  const greetingsVideoRef = useRef(null);

  // Redux 상태 가져오기
  const audioSources = useSelector((state) => state.aiConsult.audio);
  const src = useSelector((state) => state.aiConsult.audio.src);
  const isGreetingsPlaying = useSelector(
    (state) => state.aiConsult.audio.isGreetingsPlaying
  );
  const isNotePlaying = useSelector(
    (state) => state.aiConsult.audio.isNotePlaying
  );
  const isUploading = useSelector(
    (state) => state.aiConsult.audio.upload.isLoading
  );

  // 선택된 아바타에 따른 소스 가져오기
  const defaultSrc = audioSources[selectedAvatar]?.defaultSrc;
  const greetingsSrc = audioSources[selectedAvatar]?.greetingsSrc;
  const errorSrc = audioSources[selectedAvatar]?.errorSrc;
  const noteSrc = audioSources[selectedAvatar]?.noteSrc;

  // 배경 이미지 설정
  let BackgroundImage;
  if (selectedAvatar === "sonny") {
    BackgroundImage = BackgroundImage_sonny;
  } else if (selectedAvatar === "karina") {
    BackgroundImage = BackgroundImage_karina;
  } else {
    BackgroundImage = BackgroundImage_sonny;
  }

  // 상담 종료 핸들러
  const handleEndConsultation = useCallback(() => {
    dispatch(clearAudioSrc());
    navigate("/", { replace: true });
    window.location.reload();
  }, [navigate, dispatch]);

  // CSV 저장 함수
  const saveTimestampsToCSV = (timestampsArray) => {
    const fields = ["requestSentTime", "firstVideoPlayedTime"];
    const csvRows = [];
    csvRows.push(fields.join(",")); // 헤더 추가
    timestampsArray.forEach((timestamp) => {
      csvRows.push(
        [timestamp.requestSentTime, timestamp.firstVideoPlayedTime].join(",")
      );
    });
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `timestamps_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // 종료 버튼 클릭 핸들러 수정
  const handleExitClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      MySwal.fire({
        title: "상담 종료",
        text: "정말로 상담을 종료하시겠습니까?",
        icon: "info",
        showCancelButton: true,
        showCloseButton: true, // 우측 상단 X 버튼 추가
        confirmButtonText: "만족도 조사 하러가기",
        cancelButtonText: "새로운 심리상담 받기",
      }).then((result) => {
        if (result.isConfirmed) {
          // '만족도조사 하러가기' 버튼 클릭 시 실행할 코드
          // saveTimestampsToCSV(timestampsArray);
          window.open(
            "https://docs.google.com/forms/d/e/1FAIpQLScdd0osi9M_RWAnjnCEjaku49Cee7jMhkIpZF9VnUBfzQy2ZQ/viewform"
          );
          handleEndConsultation(); // 필요한 경우 유지
        } else if (result.isDismissed) {
          if (result.dismiss === Swal.DismissReason.cancel) {
            // '새로운 심리상담 받기' 버튼 클릭 시 실행할 코드
            // saveTimestampsToCSV(timestampsArray);
            window.location.href = `/ai-consultEntryRe?uname=${encodeURIComponent(
              uname
            )}&phoneNumber=${encodeURIComponent(phoneNumber)}`;
          }
          // 'X' 버튼 클릭 시에는 아무 동작도 하지 않음 (모달이 자동으로 닫힘)
        }
      });
    },
    [handleEndConsultation, timestampsArray, navigate]
  );

  // 페이지 새로고침 방지 핸들러(F5, Ctrl+R 용)
  const handleRefresh = useCallback((e) => {
    e.preventDefault();
    MySwal.fire({
      title: "알림",
      html: "우측 하단의 나가기 버튼(문 모양)을 사용해<br>종료 후 처음부터 시작해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
      allowOutsideClick: false, // 팝업 외부 클릭 시 닫히지 않도록 설정
    }).then(() => {
      // 팝업 확인 후 아무 동작도 하지 않음 (새로고침 방지)
    });
  }, []);

  // Reload page once on first load
  // useEffect(() => {
  //   const hasReloaded = sessionStorage.getItem("hasReloaded");
  //   if (!hasReloaded) {
  //     console.log("페이지가 처음 로드되어 리로드합니다.");
  //     sessionStorage.setItem("hasReloaded", "true");
  //     window.location.reload();
  //   } else {
  //     console.log("페이지가 이미 리로드되었습니다.");
  //   }
  // }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "F5" || (e.ctrlKey && e.key === "r")) {
        e.preventDefault();
        handleRefresh(e);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleRefresh]);

  // 상태 변화에 따른 비디오 재생 로직
  useEffect(() => {
    if (!overlayVideo) {
      if (isGreetingsPlaying && greetingsSrc) {
        console.log("인사말 비디오 재생");
        setOverlayVideo(greetingsSrc);
        setIsSeamlessPlaying(false);
      } else if (src === "error") {
        console.log("에러 비디오 재생");
        setOverlayVideo(errorSrc);
        setIsSeamlessPlaying(false);
        // 에러 비디오 재생을 표시하기 위해 상태 설정
      } else if (isNotePlaying && noteSrc) {
        console.log("노트 비디오 재생");
        setOverlayVideo(noteSrc);
      }
    }

    if (src && !isSeamlessPlaying && src !== "error") {
      console.log("시작하기 seamless 비디오 재생");
      setIsSeamlessPlaying(true);
      setIsLoading(true);
    }
  }, [
    overlayVideo,
    isGreetingsPlaying,
    greetingsSrc,
    src,
    errorSrc,
    isNotePlaying,
    noteSrc,
    isSeamlessPlaying,
    dispatch,
  ]);

  // overlay 비디오 종료 핸들러
  const handleOverlayVideoEnd = useCallback(() => {
    console.log("Overlay 비디오 종료");
    if (isGreetingsPlaying) {
      dispatch(setGreetingsPlayed());
    } else if (isNotePlaying) {
      dispatch(clearNotePlaying());
    } else if (src === "error") {
      console.log("에러 비디오 재생 종료");
      dispatch(clearAudioSrc()); // src를 초기화하여 에러 비디오가 다시 재생되지 않도록 함
    }
    setOverlayVideo(null);
    setIsAnswerButtonEnabled(true);
  }, [dispatch, isGreetingsPlaying, isNotePlaying, src]);

  // seamless 비디오 핸들러들
  const handleSeamlessVideoEnd = useCallback(() => {
    console.log("Seamless 비디오 재생 종료");
    setIsSeamlessPlaying(false);
    setIsLoading(false);
    dispatch(clearAudioSrc());
  }, [dispatch]);

  const handleSeamlessVideoStart = useCallback(() => {
    console.log("Seamless 비디오 재생 시작");
    setIsLoading(false);
    setIsAnswerButtonEnabled(false);

    // 타임스탬프 배열의 마지막 객체에 firstVideoPlayedTime 추가
    setTimestampsArray((prevArray) => {
      if (prevArray.length === 0) return prevArray;
      const newArray = [...prevArray];
      newArray[newArray.length - 1].firstVideoPlayedTime = Date.now();
      return newArray;
    });
  }, []);

  const handleAllVideosEnded = useCallback(() => {
    console.log("모든 Seamless 비디오 종료");
    setIsSeamlessPlaying(false);
    setIsLoading(false);
    dispatch(clearAudioSrc());
    setIsAnswerButtonEnabled(true);
  }, [dispatch]);

  const handleGreetingsVideoPlay = () => {
    console.log("인사말 비디오 재생 시작");
  };

  const handleGreetingsVideoError = (e) => {
    console.error("인사말 비디오 재생 오류:", e);
  };

  const handleRecordingStart = () => {
    console.log("녹음 시작");
    setShowInstruction(false);
  };

  const handleRecordingStop = useCallback((timestamp) => {
    console.log("녹음 종료");
    // 타임스탬프 배열에 새로운 객체 추가
    setTimestampsArray((prevArray) => [
      ...prevArray,
      { requestSentTime: timestamp, firstVideoPlayedTime: null },
    ]);
  }, []);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 현재 상태를 히스토리 스택에 추가
    window.history.pushState({ preventPop: true }, "");

    const handlePopState = (event) => {
      // preventPop이 true인 경우, 사용자에게 확인 팝업을 표시
      console.log(event.state);
      console.log(event.state.preventPop);
      if (event.state || event.state.preventPop) {
        // SweetAlert2를 사용한 팝업 표시
        MySwal.fire({
          title: "알림",
          html: "우측 하단의 나가기 버튼(문 모양)을 사용해<br>종료 후 처음부터 시작해주세요.",
          icon: "warning",
          confirmButtonText: "확인",
          allowOutsideClick: false, // 팝업 외부 클릭 시 닫히지 않도록 설정
        }).then(() => {
          // 사용자가 확인 버튼을 클릭하면 현재 상태를 다시 히스토리 스택에 추가
          window.history.pushState({ preventPop: true }, "");
        });
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // 페이지 새로고침 방지 핸들러(브라우저의 새로고침 버튼)
  // useEffect(() => {
  //   const handleBeforeUnload = (e) => {
  //     e.preventDefault();
  //     // Chrome requires returnValue to be set
  //     e.returnValue = "";
  //     // Note: Custom messages are not supported by most browsers
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);

  return (
    <Box width="100%" height="100vh">
      <Box
        width="100%"
        height="90%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        position="relative"
      >
        {/* 배경 이미지 */}
        <Box
          component="img"
          src={BackgroundImage}
          alt="Background"
          position="absolute"
          height="100%"
          objectFit="cover"
          zIndex={0}
          sx={{
            display: { xs: "none", md: "block" },
            border: "none",
          }}
        />

        {/* default 비디오 */}
        <Box
          component="video"
          width="100%"
          height="100%"
          top={0}
          left={0}
          src={defaultSrc}
          loop
          autoPlay
          muted
          position="relative"
          zIndex={1}
        />

        {/* overlay 비디오 (greetings, note, error 등) */}
        {overlayVideo && (
          <Fade in={true}>
            <Box
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              component="video"
              ref={greetingsVideoRef}
              src={overlayVideo}
              autoPlay
              onEnded={handleOverlayVideoEnd}
              onPlay={handleGreetingsVideoPlay}
              onError={handleGreetingsVideoError}
              zIndex={2}
            />
          </Fade>
        )}

        {/* seamless 비디오 */}
        {isSeamlessPlaying && (
          <Box
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            zIndex={3}
            sx={{ border: "none" }}
          >
            <SeamlessVideoPlayer
              initialVideoUrl={src}
              isVisible={isSeamlessPlaying}
              onEnded={handleAllVideosEnded}
              onStart={handleSeamlessVideoStart}
              onAllVideosEnded={handleAllVideosEnded}
            />
          </Box>
        )}

        {/* 로딩 표시 */}
        {isLoading && (
          <Box
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgcolor="transparent"
          >
            <CircularProgress />
          </Box>
        )}

        {isSeamlessLoading && (
          <Box
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            bgcolor="transparent"
            zIndex={4}
          />
        )}
      </Box>

      {/* 로컬 유저 비디오 */}
      <Box
        position="absolute"
        zIndex={999}
        right={0}
        bottom={"10%"}
        width={{ xs: "200px", md: "320px" }}
        height={{ xs: "120px", md: "200px" }}
      >
        <LocalUser />
      </Box>

      {/* 하단 컨트롤 바 */}
      <Box
        position="relative"
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="10%"
        borderTop={1}
        borderColor={"#ccc"}
      >
        {showInstruction && (
          <Box
            position="absolute"
            margin="auto"
            display="flex"
            sx={{
              transform: "translateX(-65%)",
              height: { xs: "24px", sm: "40px", md: "50px", lg: "60px" },
            }}
          >
            <img
              src={Describe1Image}
              alt="describe1"
              style={{
                width: "auto",
                height: "100%",
              }}
            />
          </Box>
        )}

        {/* 오디오 레코더 */}
        <AudioRecorder
          uname={uname}
          phoneNumber={phoneNumber}
          selectedAvatar={selectedAvatar}
          disabled={
            isGreetingsPlaying ||
            !!overlayVideo ||
            isSeamlessPlaying ||
            isUploading ||
            isLoading ||
            !isAnswerButtonEnabled
          }
          onRecordingStart={handleRecordingStart}
          onRecordingStop={handleRecordingStop} // 추가된 부분
        />

        {/* 종료 버튼 */}
        <Box
          position="absolute"
          right="2px"
          display="flex"
          alignItems="center"
          sx={{
            gap: { xs: "2px", sm: "3px", md: "4px", lg: "5px" },
          }}
        >
          {showInstruction && (
            <Box
              sx={{
                height: { xs: "24px", sm: "40px", md: "50px", lg: "60px" },
              }}
            >
              <img
                src={Describe2Image}
                alt="describe2"
                style={{
                  width: "auto",
                  height: "100%",
                }}
              />
            </Box>
          )}

          <Button
            onClick={handleExitClick}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: { xs: "35px", sm: "45px", md: "55px", lg: "65px" },
              minWidth: 0,
            }}
          >
            <img
              src={Exit}
              alt="exit icon"
              style={{
                width: "auto",
                height: "100%",
              }}
            />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AiConsultChannelPage;
