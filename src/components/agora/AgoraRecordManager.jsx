import { RecordProvider } from "@context/agora/record-context.jsx";
import useRecordClient from "@hooks/agora-ruverse/useRecordClient";
import { Button, Typography } from "@mui/material";
import { openModal } from "@store/agora/agoraSlice";
import {
  requestAgoraRecord,
  requestAgoraRecordStop,
} from "@store/agora/agoraThunk";
import PropTypes from "prop-types";
import { useReactMediaRecorder } from "react-media-recorder";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { MODAL_TYPES, StartRecordingButton } from "..";

const AgoraRecordManager = ({ children }) => {
  const { cname, uid } = useParams();

  const client = useRecordClient();

  const dispatch = useDispatch();

  // 비디오 오디오 녹화
  const {
    status: videoStatus,
    startRecording: startVideoRecording,
    stopRecording: stopVideoRecording,
  } = useReactMediaRecorder({
    video: true,
    audio: true,
    blobPropertyBag: {
      type: "video/mp4",
    },
    onStart: () => {
      console.log(`[RECORDER] video record start = ${videoStatus}`);
    },
    onStop: (url, blob) => {
      console.log("[RECORDER] video record stop");
      console.log(blob);
      client.saveVideoRecord(blob);
    },
  });

  // 로컬 화면 녹화
  // 아고라 cloud recording 기능 사용으로 인한 주석 처리
  /*
  const {
    status: screenStatus,
    startRecording: startScreenRecording,
    stopRecording: stopScreenRecording,
    error: screenError,
  } = useReactMediaRecorder({
    screen: true,
    audio: true,
    blobPropertyBag: {
      type: "video/mp4",
    },
    askPermissionOnMount: false,
    onStart: () => {
      console.log(`[RECORDER] screen record start = ${screenStatus}`);
    },
    onStop: (url, blob) => {
      console.log("[RECORDER] screen record stop");
      console.log(`[RECORDER] result: ${blob}`);
      setScreenRecordBlob(blob);
    },
  });
  */

  // 녹화 시작 할 때 webgazer 실행
  const startRecording = () => {
    try {
      console.log("[WEBGAZER] start");
      // webgazer.begin();
    } catch (err) {
      console.log("[WEBGAZER] end error");
      console.log(err);
    }
    startVideoRecording();

    dispatch(requestAgoraRecord({ cname, uid }));
  };

  const stopRecording = () => {
    try {
      console.log("[WEBGAZER] end");
      // webgazer.pause();
    } catch (err) {
      console.log("[WEBGAZER] end error");
      console.log(err);
    }
    stopVideoRecording();

    dispatch(requestAgoraRecordStop({ cname, uid }));
    dispatch(openModal({ modalType: MODAL_TYPES.UploadInfoModal }));
  };

  const recordingStatus = videoStatus === "recording";

  return (
    <RecordProvider client={client}>
      {children}
      {recordingStatus ? (
        <Button variant="outlined" color="error" onClick={stopRecording}>
          <Typography>녹화 종료</Typography>
        </Button>
      ) : (
        <StartRecordingButton onClick={startRecording} />
      )}
    </RecordProvider>
  );
};

AgoraRecordManager.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default AgoraRecordManager;
