import { Button, Typography } from "@mui/material";
import { uploadRequest } from "@store/ai/aiConsultSlice";
import PropTypes from "prop-types";
import { useReactMediaRecorder } from "react-media-recorder";
import { useDispatch, useSelector } from "react-redux";

const AudioRecorder = ({ uname }) => {
  // const { audioStream, saveAudioStream } = useRecordContext();
  const current = useSelector((state) => state.aiConsult.audio.current);
  const dispatch = useDispatch();

  const { status, startRecording, stopRecording } = useReactMediaRecorder({
    // video: true,
    audio: true,
    blobPropertyBag: {
      type: "audio/wav",
    },
    onStart: () => {
      console.log(`[RECORDER] video record start = ${status}`);
    },
    onStop: async (url, blob) => {
      console.log("[RECORDER] video record stop");
      console.log(blob);

      const formData = new FormData();

      // audio: 서버에서 접근할때 사용하는 키값
      formData.append("audio", blob, `${uname}_오디오_${current}.wav`);
      console.log(formData.get("audio"));

      dispatch(uploadRequest(formData));

      // saveAudioStream(blob);
    },
  });

  return (
    <>
      {status === "recording" ? (
        <Button onClick={stopRecording} color="primary" variant="contained">
          <Typography
            sx={{
              fontSize: { xs: "12px", md: "16px", lg: "18px" },
            }}
          >
            대답 끝내기
          </Typography>
        </Button>
      ) : (
        <Button onClick={startRecording} color="primary" variant="contained">
          <Typography
            sx={{
              fontSize: { xs: "12px", md: "16px", lg: "18px" },
            }}
          >
            대답하기
          </Typography>
        </Button>
      )}
    </>
  );
};

AudioRecorder.propTypes = {
  uname: PropTypes.string,
};

export default AudioRecorder;
