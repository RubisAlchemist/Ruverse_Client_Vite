import React, { useState, useEffect } from "react";
import { AudioRecorder, LocalUser } from "@components/index";
import { Box, Fade } from "@mui/material";
import { clearAudioSrc, setGreetingsPlayed } from "@store/ai/aiConsultSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const AiConsultChannelPage = () => {
  const { uname } = useParams();
  const dispatch = useDispatch();
  const [overlayVideo, setOverlayVideo] = useState(null);

  const src = useSelector((state) => state.aiConsult.audio.src);
  const defaultSrc = useSelector((state) => state.aiConsult.audio.defaultSrc);
  const greetingsSrc = useSelector(
    (state) => state.aiConsult.audio.greetingsSrc
  );
  const isGreetingsPlaying = useSelector(
    (state) => state.aiConsult.audio.isGreetingsPlaying
  );
  const isLoading = useSelector(
    (state) => state.aiConsult.audio.upload.isLoading
  );

  useEffect(() => {
    if (isGreetingsPlaying) {
      setOverlayVideo(greetingsSrc);
    } else if (src) {
      setOverlayVideo(src);
    } else {
      setOverlayVideo(null);
    }
  }, [isGreetingsPlaying, src, greetingsSrc]);

  const handleOverlayVideoEnd = () => {
    if (isGreetingsPlaying) {
      dispatch(setGreetingsPlayed());
    } else {
      dispatch(clearAudioSrc());
    }
    setOverlayVideo(null);
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

        {/* Overlay video (greetings or response) */}
        {overlayVideo && (
          <Fade in={true}>
            <Box
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              component="video"
              src={overlayVideo}
              autoPlay
              onEnded={handleOverlayVideoEnd}
            />
          </Fade>
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
          disabled={isGreetingsPlaying || !!overlayVideo}
        />
      </Box>
    </Box>
  );
};

export default AiConsultChannelPage;
