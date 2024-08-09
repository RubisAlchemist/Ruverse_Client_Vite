import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { clearAudioSrc, uploadKlleonRequest } from "@store/ai/aiConsultSlice";
import { useReactMediaRecorder } from "react-media-recorder";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import MicIcon from "@mui/icons-material/Mic"; // Example icon, replace with image if needed

// Import your exit image
import ExitImage from "@assets/images/exit.png"; // Adjust the path as necessary

const KlleonAvatar = () => {
  const audioRef = useRef(null);
  const current = useSelector((state) => state.aiConsult.audio.current);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEchoRunning, setIsEchoRunning] = useState(false);
  const [isGreeting, setIsGreeting] = useState(false);
  const { status, startRecording, stopRecording } = useReactMediaRecorder({
    audio: true,
    blobPropertyBag: { type: "audio/wav" },
    onStart: () => console.log(`[RECORDER] video record start = ${status}`),
    onStop: async (url, blob) => {
      console.log("[RECORDER] video record stop");
      const formData = new FormData();
      formData.append("audio", blob, `audio_${current}.wav`);
      formData.append("uname", "user");

      dispatch(clearAudioSrc());
      const response = await dispatch(uploadKlleonRequest(formData));
      window.KlleonChat.echo(response.payload);

      setIsEchoRunning(true);

      setTimeout(() => {
        setIsEchoRunning(false);
      }, 5000);
    },
  });

  useEffect(() => {
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
  }, [isGreeting]);

  const handleEndConsultation = () => {
    navigate("/AvatarChoosePage");
  };

  const handleRecordingToggle = () => {
    if (status === "recording") {
      stopRecording();
    } else {
      startRecording();
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
        borderTop={1}
        borderColor={"#ccc"}
        position="relative"
      >
        {/* Wrapping the MicIcon and Typography together */}
        <Box display="flex" flexDirection="column" alignItems="center">
          {/* Microphone Icon above the text */}
          <MicIcon sx={{ fontSize: 50, mb: 1 }} />{" "}
          {/* Adjust size and margin as needed */}
          <Typography
            onClick={handleRecordingToggle} // Attach the onClick event
            sx={{
              fontSize: { xs: "15px", md: "20px", lg: "25px" },
              cursor: "pointer", // Add pointer cursor to indicate it's clickable
              color: "primary.main", // Adjust color as needed
              textAlign: "center",
            }}
          >
            {status === "recording" ? "말 끝내기" : "말 시작하기"}
          </Typography>
        </Box>

        {/* Exit Image at the bottom-right corner */}
        <Box
          component="img"
          src={ExitImage} // Ensure this path is correct
          alt="Exit"
          onClick={handleEndConsultation} // Attach the same onClick event
          sx={{
            position: "absolute",
            bottom: "35px", // Distance from the bottom of the box
            right: "20px", // Distance from the right of the box
            width: "50px", // Adjust size as needed
            height: "50px",
            cursor: "pointer", // Add pointer cursor to indicate it's clickable
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
