import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { clearAudioSrc, uploadKlleonRequest } from "@store/ai/aiConsultSlice";
import { useReactMediaRecorder } from "react-media-recorder";
import PropTypes from "prop-types";

const KlleonAvatar = () => {
  const audioRef = useRef(null);
  const current = useSelector((state) => state.aiConsult.audio.current);
  const dispatch = useDispatch();
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

      // Disabling "대답하기" button during echo execution
      setIsEchoRunning(true);

      // Mocking the duration of KlleonChat.echo for demo purposes
      setTimeout(() => {
        setIsEchoRunning(false);
      }, 5000);

      // Uncomment the following if KlleonChat.echo provides a callback
      // window.KlleonChat.echo(response.payload, () => {
      //   setIsEchoRunning(false);
      // });

      // 오디오 파일 다운로드 및 Base64 인코딩
      //   fetch(audioUrl)
      //     .then((res) => res.blob())
      //     .then((blob) => {
      //       const reader = new FileReader();
      //       reader.onloadend = () => {
      //         const base64AudioMessage = reader.result.split(",")[1];
      //         // 클레온에 오디오 전송
      //         window.KlleonChat.startAudioEcho(base64AudioMessage);
      //       };
      //       reader.readAsDataURL(blob);
      //     })
      //     .catch(console.error);
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
        avatar_id: "a6124155-0090-11ef-8ee1-0abbf354c5cc",
      };

      if (window.KlleonChat) {
        window.KlleonChat.init(sdkOption);
        window.KlleonChat.showStreaming(avatarOption);

        // Polling for the readiness of showStreaming
        // const checkStreamingReady = setInterval(() => {
        //   if (window.KlleonChat.isStreamingReady && !isGreeting) {
        //     clearInterval(checkStreamingReady);
        // window.KlleonChat.echo(
        //   "안녕하세요, 저는 오늘 함께 이야기를 나눌 에코입니다. 여러 일들로 마음이 불편하고 자기 감정을 알기 어려울 때 상담을 통해 마음의 안정을 찾도록 돕는 일을 하고 있어요. 간단하게 자기 소개를 부탁해도 될까요?"
        // );
        //     setIsGreeting(true);
        //   }
        // }, 500); // Check every 500ms

        // setTimeout(() => {
        //   window.KlleonChat.echo(
        //     "안녕하세요, 저는 오늘 함께 이야기를 나눌 에코입니다. 여러 일들로 마음이 불편하고 자기 감정을 알기 어려울 때 상담을 통해 마음의 안정을 찾도록 돕는 일을 하고 있어요. 간단하게 자기 소개를 부탁해도 될까요?"
        //   );
        // }, 100);
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [isGreeting]);

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
        <div id="klleon_chat" style={{ width: "50%", height: "100%" }}></div>
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="10%"
        borderTop={1}
        borderColor={"#ccc"}
      >
        {status === "recording" ? (
          <Button onClick={stopRecording} color="primary" variant="contained">
            <Typography
              sx={{ fontSize: { xs: "12px", md: "16px", lg: "18px" } }}
            >
              대답 끝내기
            </Typography>
          </Button>
        ) : (
          <Button
            onClick={startRecording}
            color="primary"
            variant="contained"
            disabled={isEchoRunning}
          >
            <Typography
              sx={{ fontSize: { xs: "12px", md: "16px", lg: "18px" } }}
            >
              대답하기
            </Typography>
          </Button>
        )}
      </Box>
    </Box>
  );
};

KlleonAvatar.propTypes = {
  uname: PropTypes.string,
  disabled: PropTypes.bool,
};

export default KlleonAvatar;
