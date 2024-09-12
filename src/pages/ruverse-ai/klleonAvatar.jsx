import React, { useEffect, useRef, useState, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { clearAudioSrc, uploadKlleonRequest } from "@store/ai/aiConsultSlice";
import { useReactMediaRecorder } from "react-media-recorder";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { MicIcon } from "@mui/icons-material/Mic";

// Import your images
import ExitImage from "@assets/images/exit.png";
import Describe1Image from "@assets/images/describe1.png";
import Describe2Image from "@assets/images/describe2.png";

const KlleonAvatar = () => {
  const audioRef = useRef(null);
  const current = useSelector((state) => state.aiConsult.audio.current);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEchoRunning, setIsEchoRunning] = useState(false);
  const [isGreeting, setIsGreeting] = useState(false);
  const [showInstruction, setShowInstruction] = useState(true);

  const location = useLocation();
  const [uname, setUname] = useState(location.state?.uname || "");

  const onRecordingStop = useCallback(
    async (url, blob) => {
      console.log("[RECORDER] video record stop");
      const formData = new FormData();
      formData.append("audio", blob, `audio_${current}.wav`);
      formData.append("uname", uname);

      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      console.log("formData uname:", formData.get("uname"));

      dispatch(clearAudioSrc());
      const response = await dispatch(uploadKlleonRequest(formData));
      window.KlleonChat.echo(response.payload);

      setIsEchoRunning(true);

      setTimeout(() => {
        setIsEchoRunning(false);
      }, 5000);
    },
    [current, uname, dispatch]
  );

  const { status, startRecording, stopRecording } = useReactMediaRecorder({
    audio: true,
    blobPropertyBag: { type: "audio/wav" },
    onStart: () => console.log(`[RECORDER] video record start = ${status}`),
    onStop: onRecordingStop,
  });

  useEffect(() => {
    console.log("Received uname:", uname);
    setUname(location.state?.uname || "");

    const script = document.createElement("script");
    script.src = "https://sdk.klleon.io/klleon-chat/0.9.0/klleon_chat_sdk.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const sdkOption = { sdk_key: import.meta.env.VITE_KLLEON_TRIAL_KEY };
      const avatarOption = {
        avatar_id: "a57d4b8e-0090-11ef-8ee1-0abbf354c5cc",
      };

      if (window.KlleonChat) {
        window.KlleonChat.init(sdkOption);
        window.KlleonChat.showStreaming(avatarOption);
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [location.state?.uname]);

  const handleEndConsultation = () => {
    navigate("/AvatarChoosePage");
  };

  const handleRecordingToggle = () => {
    if (status === "recording") {
      stopRecording();
    } else {
      startRecording();
      setShowInstruction(false);
    }
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
        <div id="klleon_chat" style={{ width: "100%", height: "100%" }}></div>
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="10%"
        borderColor={"#ccc"}
        position="relative"
      >
        {showInstruction && (
          <Box
            component="img"
            src={Describe1Image}
            alt="Describe 1"
            sx={{
              height: "50px",
              objectFit: "contain",
              mr: 2,
              position: "absolute",
              left: "50%",
              transform: "translateX(-120%)",
            }}
          />
        )}

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          onClick={handleRecordingToggle}
          sx={{
            cursor: "pointer",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <MicIcon sx={{ fontSize: 50, mb: 1 }} />
          <Typography
            sx={{
              fontSize: { xs: "15px", md: "20px", lg: "25px" },
              cursor: "pointer",
              color: "primary.main",
              textAlign: "center",
            }}
          >
            {status === "recording" ? "말 끝내기" : "말 시작하기"}
          </Typography>
        </Box>

        {showInstruction && (
          <Box
            component="img"
            src={Describe2Image}
            alt="Describe 2"
            sx={{
              position: "absolute",
              top: "50%",
              right: "80px",
              height: "50px",
              objectFit: "contain",
              transform: "translateY(-50%)",
            }}
          />
        )}

        <Box
          component="img"
          src={ExitImage}
          alt="Exit"
          onClick={handleEndConsultation}
          sx={{
            position: "absolute",
            top: "50%",
            right: "20px",
            width: "50px",
            height: "50px",
            cursor: "pointer",
            transform: "translateY(-50%)",
          }}
        />
      </Box>
    </Box>
  );
};

KlleonAvatar.propTypes = {
  uname: PropTypes.string,
  disabled: PropTypes.bool,
};

export default KlleonAvatar;
