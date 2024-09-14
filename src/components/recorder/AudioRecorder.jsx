import { Button, Typography } from "@mui/material";
import { clearAudioSrc, uploadRequest } from "@store/ai/aiConsultSlice";
import PropTypes from "prop-types";
import { useReactMediaRecorder } from "react-media-recorder";
import { useDispatch, useSelector } from "react-redux";
// for profiling
function saveTimestampsToCSV(timestamps) {
  const fields = ["requestSentTime", "firstVideoPlayedTime"];
  // Create CSV header and content
  const csvRows = [];
  csvRows.push(fields.join(",")); // Add header
  csvRows.push(
    [timestamps.requestSentTime, timestamps.firstVideoPlayedTime].join(",")
  ); // Add row
  // Convert CSV array to a Blob
  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  // Create a downloadable link for the CSV
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "timestamps_profiling_0911_requestSent.csv";
  // Programmatically click the link to trigger the download
  document.body.appendChild(link);
  link.click();
  // Cleanup
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
//

const AudioRecorder = ({ uname, disabled, onRecordingStart }) => {
  const current = useSelector((state) => state.aiConsult.audio.current);
  const dispatch = useDispatch();

  const { status, startRecording, stopRecording } = useReactMediaRecorder({
    audio: true,
    blobPropertyBag: {
      type: "audio/wav",
    },
    onStart: () => {
      console.log(`[RECORDER] audio record start = ${status}`);
      onRecordingStart();
    },
    onStop: async (url, blob) => {
      const requestSentTime = Date.now(); // profiling
      const timestamps = { requestSentTime, firstVideoPlayedTime: -1 };
      // saveTimestampsToCSV(timestamps);
      console.log("대답끝내기: ", requestSentTime);
      console.log("[RECORDER] audio record stop");
      console.log(blob);

      const formData = new FormData();
      formData.append("audio", blob, `${uname}_audio_${current}.wav`);
      formData.append("uname", uname);
      console.log(formData.get("audio"));
      console.log(formData.get("uname"));

      dispatch(clearAudioSrc());
      dispatch(uploadRequest(formData));
    },
  });

  return (
    <>
      {status === "recording" ? (
        <Button
          onClick={stopRecording}
          color="primary"
          variant="contained"
          disabled={disabled}
        >
          <Typography
            sx={{
              fontSize: { xs: "12px", md: "16px", lg: "18px" },
            }}
          >
            대답 끝내기
          </Typography>
        </Button>
      ) : (
        <Button
          onClick={startRecording}
          color="primary"
          variant="contained"
          disabled={disabled}
        >
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
  disabled: PropTypes.bool,
  onRecordingStart: PropTypes.func,
};

export default AudioRecorder;
