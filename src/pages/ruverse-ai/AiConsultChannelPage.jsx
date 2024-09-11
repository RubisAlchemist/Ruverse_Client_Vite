import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  AudioRecorder,
  LocalUser,
  SeamlessVideoPlayer,
} from "@components/index";
import { Box, Fade, CircularProgress } from "@mui/material";
import { clearAudioSrc, setGreetingsPlayed } from "@store/ai/aiConsultSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const AiConsultChannelPage = () => {
  const { uname } = useParams();
  const dispatch = useDispatch();
  const [overlayVideo, setOverlayVideo] = useState(null);
  const [isSeamlessPlaying, setIsSeamlessPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnswerButtonEnabled, setIsAnswerButtonEnabled] = useState(true);
  const greetingsVideoRef = useRef(null);

  const src = useSelector((state) => state.aiConsult.audio.src);
  const defaultSrc = useSelector((state) => state.aiConsult.audio.defaultSrc);
  const greetingsSrc = useSelector(
    (state) => state.aiConsult.audio.greetingsSrc
  );
  const isGreetingsPlaying = useSelector(
    (state) => state.aiConsult.audio.isGreetingsPlaying
  );
  const isUploading = useSelector(
    (state) => state.aiConsult.audio.upload.isLoading
  );

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

  useEffect(() => {
    console.log("State change detected", {
      isGreetingsPlaying,
      greetingsSrc,
      src,
      isSeamlessPlaying,
      overlayVideo,
    });
    if (isGreetingsPlaying && greetingsSrc && !overlayVideo) {
      console.log("Playing greeting video");
      setOverlayVideo(greetingsSrc);
      setIsSeamlessPlaying(false);
    } else if (src && !isSeamlessPlaying && !isGreetingsPlaying) {
      console.log("Starting seamless video playback");
      setOverlayVideo(null);
      setIsSeamlessPlaying(true);
      setIsLoading(true);
    } else if (!src && !isGreetingsPlaying && !isSeamlessPlaying) {
      console.log("Resetting to default state");
      setOverlayVideo(null);
      setIsSeamlessPlaying(false);
    }
  }, [isGreetingsPlaying, src, greetingsSrc, isSeamlessPlaying, overlayVideo]);

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
    setIsLoading(false);
    setIsAnswerButtonEnabled(false);
  }, []);

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
        {/* Background default video */}
        <Box
          component="video"
          width="100%"
          height="100%"
          src={defaultSrc}
          loop
          autoPlay
          muted
        />

        {/* Seamless video player */}
        {isSeamlessPlaying && (
          <Box position="absolute" top={0} left={0} width="100%" height="100%">
            <SeamlessVideoPlayer
              initialVideoUrl={src}
              isVisible={isSeamlessPlaying}
              onEnded={handleAllVideosEnded}
              onStart={handleSeamlessVideoStart}
            />
          </Box>
        )}

        {/* Overlay video (greetings or single response) */}
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
            />
          </Fade>
        )}

        {/* Loading indicator */}
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
            bgcolor="rgba(0, 0, 0, 0.5)"
          >
            <CircularProgress />
          </Box>
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
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="10%"
        borderTop={1}
        borderColor={"#ccc"}
      >
        <AudioRecorder
          uname={uname}
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
      </Box>
    </Box>
  );
};

export default AiConsultChannelPage;
