import React, { useEffect, useRef } from "react";
import { Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { clearAudioSrc, uploadKlleonRequest } from "@store/ai/aiConsultSlice";
import { useReactMediaRecorder } from "react-media-recorder";
import PropTypes from "prop-types";

const KlleonAvatar = () => {
  const audioRef = useRef(null);
  const current = useSelector((state) => state.aiConsult.audio.current);
  const dispatch = useDispatch();
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
      //const audioUrl = response.payload; // 서버로부터 받은 오디오 URL
      KlleonChat.echo(response.payload);

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
        avatar_id: "a5fe629d-0090-11ef-8ee1-0abbf354c5cc",
      };
      const chatOption = { type: "right" };

      if (window.KlleonChat) {
        window.KlleonChat.init(sdkOption);
        window.KlleonChat.showStreaming(avatarOption);
        window.KlleonChat.showChatUi(chatOption);
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <h1>Klleon Chat SDK</h1>
      <div id="klleon_chat" style={{ width: "1000px", height: "90vh" }}></div>
      {status === "recording" ? (
        <Button onClick={stopRecording} color="primary" variant="contained">
          <Typography sx={{ fontSize: { xs: "12px", md: "16px", lg: "18px" } }}>
            대답 끝내기
          </Typography>
        </Button>
      ) : (
        <Button onClick={startRecording} color="primary" variant="contained">
          <Typography sx={{ fontSize: { xs: "12px", md: "16px", lg: "18px" } }}>
            대답하기
          </Typography>
        </Button>
      )}
    </div>
  );
};

KlleonAvatar.propTypes = {
  uname: PropTypes.string,
  disabled: PropTypes.bool,
};

export default KlleonAvatar;
