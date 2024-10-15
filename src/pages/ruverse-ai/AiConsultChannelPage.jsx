import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  AudioRecorder,
  LocalUser,
  SeamlessVideoPlayer,
} from "@components/index";
import { Button, Box, Fade, CircularProgress } from "@mui/material";
import { clearAudioSrc, setGreetingsPlayed } from "@store/ai/aiConsultSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";

// Icon imports
import Exit from "@assets/images/exit.png";
import Describe1Image from "@assets/images/describe1.png";
import Describe2Image from "@assets/images/describe2.png";

// Background image
import BackgroundImage from "@assets/images/background.png";

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
  const [overlayVideo, setOverlayVideo] = useState(null);
  const [isSeamlessPlaying, setIsSeamlessPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnswerButtonEnabled, setIsAnswerButtonEnabled] = useState(true);
  const [showInstruction, setShowInstruction] = useState(true);
  const [isSeamlessLoading, setIsSeamlessLoading] = useState(false);

  const greetingsVideoRef = useRef(null);

  // Retrieve all sources from the Redux store
  const audioSources = useSelector((state) => state.aiConsult.audio);

  console.log("audioSource: ", audioSources[selectedAvatar]);

  // Select the appropriate sources based on selectedAvatar
  const defaultSrc = audioSources[selectedAvatar]?.defaultSrc;
  const greetingsSrc = audioSources[selectedAvatar]?.greetingsSrc;
  const errorSrc = audioSources[selectedAvatar]?.errorSrc;

  const src = useSelector((state) => state.aiConsult.audio.src);
  const isGreetingsPlaying = useSelector(
    (state) => state.aiConsult.audio.isGreetingsPlaying
  );
  const isUploading = useSelector(
    (state) => state.aiConsult.audio.upload.isLoading
  );

  const handleEndConsultation = useCallback(() => {
    // 페이지 이동 전에 필요한 정리 작업 수행
    dispatch(clearAudioSrc());
    // 다른 필요한 상태 초기화...

    // 페이지 이동
    navigate("/ai-consultEntry", { replace: true });
    window.location.reload();
  }, [navigate, dispatch]);

  const handleExitClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      // 즉시 종료 처리
      handleEndConsultation();
    },
    [handleEndConsultation]
  );

  const handleRefresh = useCallback((e) => {
    e.preventDefault();
    const confirmRefresh = window.confirm(
      "Are you sure you want to refresh the page?"
    );
    if (confirmRefresh) {
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "F5" || (e.ctrlKey && e.key === "r")) {
        handleRefresh(e);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleRefresh]);

  useEffect(() => {
    console.log("AiConsultChannelPage: Component mounted");
    if (greetingsSrc && isGreetingsPlaying) {
      console.log("Setting initial greeting video");
      setOverlayVideo(greetingsSrc);
    }
    return () => {
      console.log("AiConsultChannelPage: Component unmounting");
    };
  }, [greetingsSrc, isGreetingsPlaying]);

  // 📌 src가 "error"일 때 errorSrc를 재생하도록 하는 useEffect 로직 수정
  useEffect(() => {
    console.log("State change detected", {
      isGreetingsPlaying,
      greetingsSrc,
      src,
      errorSrc,
      isSeamlessPlaying,
      overlayVideo,
      isSeamlessLoading,
    });

    // src가 'error'일 때 errorSrc 비디오 재생
    if (src === "error" && !overlayVideo) {
      console.log("Playing error video due to error in src");
      setOverlayVideo(errorSrc); // errorSrc를 overlayVideo로 설정
      setIsSeamlessPlaying(false);
      dispatch(setGreetingsPlayed());
    }
    // 인사말 비디오 재생
    else if (isGreetingsPlaying && greetingsSrc && !overlayVideo) {
      console.log("Playing greeting video");
      setOverlayVideo(greetingsSrc);
      setIsSeamlessPlaying(false);
    }
    // 일반 비디오 재생
    else if (
      src &&
      !isSeamlessPlaying &&
      !isGreetingsPlaying &&
      src !== "error"
    ) {
      console.log("Starting seamless video playback");
      setOverlayVideo(null);
      setIsSeamlessPlaying(true);
      setIsLoading(true);
    }
    // 초기 상태로 리셋
    else if (!src && !isGreetingsPlaying && !isSeamlessPlaying) {
      console.log("Resetting to default state");
      setOverlayVideo(null);
      setIsSeamlessPlaying(false);
    }
  }, [
    isGreetingsPlaying,
    src,
    greetingsSrc,
    errorSrc, // errorSrc를 의존성 배열에 추가
    isSeamlessPlaying,
    overlayVideo,
    isSeamlessLoading,
    dispatch,
  ]);

  const handleOverlayVideoEnd = useCallback(() => {
    console.log("Overlay video ended");
    if (isGreetingsPlaying) {
      console.log("Greeting video finished");
      dispatch(setGreetingsPlayed());
    } else {
      console.log("Regular overlay video finished");
      dispatch(clearAudioSrc());
    }
    setOverlayVideo(null);
    setIsAnswerButtonEnabled(true);
  }, [dispatch, isGreetingsPlaying]);

  const handleSeamlessVideoEnd = useCallback(() => {
    console.log("Seamless video playback ended");
    setIsSeamlessPlaying(false);
    setIsLoading(false);
    dispatch(clearAudioSrc());
  }, [dispatch]);

  const handleSeamlessVideoStart = useCallback(() => {
    console.log("Seamless video playback started");
    console.log(src);
    setIsLoading(false);
    setIsAnswerButtonEnabled(false);
  }, [src]);

  const handleAllVideosEnded = useCallback(() => {
    console.log("All seamless videos have ended");
    setIsSeamlessPlaying(false);
    setIsLoading(false);
    dispatch(clearAudioSrc());
    setIsAnswerButtonEnabled(true);
  }, [dispatch]);

  const handleGreetingsVideoPlay = () => {
    console.log("Greetings video started playing");
  };

  const handleGreetingsVideoError = (e) => {
    console.error("Error playing greetings video:", e);
  };

  const handleRecordingStart = () => {
    console.log("Recording started");
    setShowInstruction(false);
  };

  const handleRecordingStop = () => {
    console.log("Recording stopped");
  };

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

        <Box
          component="video"
          width="100%"
          height="100%"
          src={defaultSrc}
          loop
          autoPlay
          muted
          position="relative"
          zIndex={1}
          sx={{ border: "none" }}
        />

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
            zIndex={5}
          />
        )}
      </Box>

      <Box
        position="absolute"
        zIndex={2}
        right={0}
        bottom={"10%"}
        width={{ xs: "200px", md: "320px" }}
        height={{ xs: "120px", md: "200px" }}
      >
        <LocalUser />
      </Box>

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
          onRecordingStop={handleRecordingStop}
        />

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
