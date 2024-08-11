import React, { useEffect, useRef, useState, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { clearAudioSrc, uploadKlleonRequest } from "@store/ai/aiConsultSlice";
import { useReactMediaRecorder } from "react-media-recorder";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import MicIcon from "@mui/icons-material/Mic";

// Import your exit image
import ExitImage from "@assets/images/exit.png";

const KlleonAvatar = () => {
  const audioRef = useRef(null);
  const current = useSelector((state) => state.aiConsult.audio.current);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEchoRunning, setIsEchoRunning] = useState(false);
  const [isGreeting, setIsGreeting] = useState(false);
  const [showInstruction, setShowInstruction] = useState(true); // State to manage the visibility of the instruction

  const location = useLocation();
  const [uname, setUname] = useState(location.state?.uname || "");

  const onRecordingStop = useCallback(
    async (url, blob) => {
      console.log("[RECORDER] video record stop");
      const formData = new FormData();
      formData.append("audio", blob, `audio_${current}.wav`);
      formData.append("uname", uname);

      // formData 내용 확인
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
      setShowInstruction(false); // Hide the instruction text after the first click
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
        {showInstruction && (
          <Typography
            sx={{
              fontSize: { xs: "12px", md: "15px", lg: "20px" },
              color: "primary.main",
              position: "absolute",
              left: "20px", // Positioning the instruction to the left
              bottom: "35px", // Aligning with the MicIcon's vertical position
              textAlign: "center",
            }}
          >
            말시작하기 버튼을 눌러 이름과 상담목적을
            <br />
            간단히 말씀해주시고 말끝내기 버튼을 눌러주세요
          </Typography>
        )}

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          onClick={handleRecordingToggle} // MicIcon 클릭 시 녹음 토글
          sx={{ cursor: "pointer" }} // Pointer로 변경하여 클릭 가능하다는 느낌을 줌
        >
          <MicIcon sx={{ fontSize: 50, mb: 1 }} />
          <Typography
            // onClick={handleRecordingToggle}
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

        <Box
          component="img"
          src={ExitImage}
          alt="Exit"
          onClick={handleEndConsultation}
          sx={{
            position: "absolute",
            bottom: "35px",
            right: "20px",
            width: "50px",
            height: "50px",
            cursor: "pointer",
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
