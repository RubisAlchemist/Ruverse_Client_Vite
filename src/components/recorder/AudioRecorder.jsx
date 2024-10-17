// // // 클레온 아바타 하단바 디자인 적용 버전

// import { Button, Typography } from "@mui/material";
// import {
//   clearAudioSrc,
//   uploadRequest,
//   setNotePlaying,
// } from "@store/ai/aiConsultSlice";
// import PropTypes from "prop-types";
// import { useReactMediaRecorder } from "react-media-recorder";
// import { useDispatch, useSelector } from "react-redux";

// // Icon import
// import Mic from "@assets/images/mic_blue.png";
// import Pause from "@assets/images/pause_blue.png";

// // for profiling
// function saveTimestampsToCSV(timestamps) {
//   const fields = ["requestSentTime", "firstVideoPlayedTime"];
//   // Create CSV header and content
//   const csvRows = [];
//   csvRows.push(fields.join(",")); // Add header
//   csvRows.push(
//     [timestamps.requestSentTime, timestamps.firstVideoPlayedTime].join(",")
//   ); // Add row
//   // Convert CSV array to a Blob
//   const csvContent = csvRows.join("\n");
//   const blob = new Blob([csvContent], { type: "text/csv" });
//   // Create a downloadable link for the CSV
//   const url = window.URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.href = url;
//   link.download = "timestamps_profiling_0911_requestSent.csv";
//   // Programmatically click the link to trigger the download
//   document.body.appendChild(link);
//   link.click();
//   // Cleanup
//   document.body.removeChild(link);
//   window.URL.revokeObjectURL(url);
// }
// //

// const AudioRecorder = ({
//   uname,
//   phoneNumber,
//   selectedAvatar,
//   disabled,
//   onRecordingStart,
// }) => {
//   const current = useSelector((state) => state.aiConsult.audio.current);
//   const dispatch = useDispatch();

//   const { status, startRecording, stopRecording } = useReactMediaRecorder({
//     audio: true,
//     blobPropertyBag: {
//       type: "audio/wav",
//     },
//     onStart: () => {
//       console.log(`[RECORDER] audio record start = ${status}`);
//       onRecordingStart();
//     },
//     onStop: async (url, blob) => {
//       const requestSentTime = Date.now(); // profiling
//       const timestamps = { requestSentTime, firstVideoPlayedTime: -1 };
//       // saveTimestampsToCSV(timestamps);
//       console.log("대답끝내기: ", requestSentTime);
//       console.log("[RECORDER] audio record stop");
//       console.log(blob);

//       const formData = new FormData();
//       formData.append("audio", blob, `${uname}_audio_${current}.wav`);
//       formData.append("uname", uname);
//       formData.append("phoneNumber", phoneNumber);
//       formData.append("selectedAvatar", selectedAvatar);
//       console.log(formData.get("audio"));
//       console.log(formData.get("uname"));
//       console.log(formData.get("phoneNumber"));
//       console.log(formData.get("selectedAvatar"));

//       dispatch(clearAudioSrc());
//       dispatch(uploadRequest(formData));
//       dispatch(setNotePlaying());
//     },
//   });

//   return (
//     <>
//       {status === "recording" ? (
//         <Button
//           onClick={stopRecording}
//           disabled={disabled}
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             padding: 0,
//             // width: { xs: "30px", sm: "40px", md: "50px", lg: "60px" },  // 반응형 너비
//             height: { xs: "30px", sm: "40px", md: "50px", lg: "60px" }, // 반응형 높이
//           }}
//         >
//           <img
//             src={Pause}
//             alt="pause icon"
//             style={{
//               width: "auto", // 부모 버튼의 크기에 맞춰 이미지 크기 조정
//               height: "100%",
//             }}
//           />
//           <Typography
//             sx={{
//               fontSize: { xs: "10px", sm: "12px", md: "14px", lg: "16px" }, // 반응형 폰트 크기
//               fontWeight: "800",
//             }}
//           >
//             말 끝내기
//           </Typography>
//         </Button>
//       ) : (
//         <Button
//           onClick={startRecording}
//           disabled={disabled}
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             padding: 0,
//             // width: { xs: "30px", sm: "40px", md: "50px", lg: "60px" },  // 반응형 너비
//             height: { xs: "30px", sm: "40px", md: "50px", lg: "60px" }, // 반응형 높이
//           }}
//         >
//           <img
//             src={Mic}
//             alt="mic icon"
//             style={{
//               width: "auto", // 부모 버튼의 크기에 맞춰 이미지 크기 조정
//               height: "100%",
//             }}
//           />
//           <Typography
//             sx={{
//               fontSize: { xs: "10px", sm: "12px", md: "14px", lg: "16px" }, // 반응형 폰트 크기
//               fontWeight: "800",
//             }}
//           >
//             말 시작하기
//           </Typography>
//         </Button>
//       )}
//     </>
//   );
// };

// AudioRecorder.propTypes = {
//   uname: PropTypes.string,
//   phoneNumber: PropTypes.string,
//   selectedAvatar: PropTypes.string,
//   disabled: PropTypes.bool,
//   onRecordingStart: PropTypes.func,
// };

// export default AudioRecorder;

import { Button, Typography } from "@mui/material";
import {
  clearAudioSrc,
  uploadRequest,
  setNotePlaying,
} from "@store/ai/aiConsultSlice";
import PropTypes from "prop-types";
import { useReactMediaRecorder } from "react-media-recorder";
import { useDispatch, useSelector } from "react-redux";

// Icon import
import Mic from "@assets/images/mic_blue.png";
import Pause from "@assets/images/pause_blue.png";

const AudioRecorder = ({
  uname,
  phoneNumber,
  selectedAvatar,
  disabled,
  onRecordingStart,
  onRecordingStop, // 추가된 부분
}) => {
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
      const requestSentTime = Date.now(); // 타임스탬프 기록
      console.log("대답끝내기: ", requestSentTime);
      console.log("[RECORDER] audio record stop");
      console.log(blob);

      // onRecordingStop 콜백 호출
      if (onRecordingStop) {
        onRecordingStop(requestSentTime);
      }

      const formData = new FormData();
      formData.append("audio", blob, `${uname}_audio_${current}.wav`);
      formData.append("uname", uname);
      formData.append("phoneNumber", phoneNumber);
      formData.append("selectedAvatar", selectedAvatar);
      console.log(formData.get("audio"));
      console.log(formData.get("uname"));
      console.log(formData.get("phoneNumber"));
      console.log(formData.get("selectedAvatar"));

      dispatch(clearAudioSrc());
      dispatch(uploadRequest(formData));
      dispatch(setNotePlaying());
    },
  });

  return (
    <>
      {status === "recording" ? (
        <Button
          onClick={stopRecording}
          disabled={disabled}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 0,
            // width: { xs: "30px", sm: "40px", md: "50px", lg: "60px" },  // 반응형 너비
            height: { xs: "30px", sm: "40px", md: "50px", lg: "60px" }, // 반응형 높이
          }}
        >
          <img
            src={Pause}
            alt="pause icon"
            style={{
              width: "auto", // 부모 버튼의 크기에 맞춰 이미지 크기 조정
              height: "100%",
            }}
          />
          <Typography
            sx={{
              fontSize: { xs: "10px", sm: "12px", md: "14px", lg: "16px" }, // 반응형 폰트 크기
              fontWeight: "800",
            }}
          >
            말 끝내기
          </Typography>
        </Button>
      ) : (
        <Button
          onClick={startRecording}
          disabled={disabled}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 0,
            // width: { xs: "30px", sm: "40px", md: "50px", lg: "60px" },  // 반응형 너비
            height: { xs: "30px", sm: "40px", md: "50px", lg: "60px" }, // 반응형 높이
          }}
        >
          <img
            src={Mic}
            alt="mic icon"
            style={{
              width: "auto", // 부모 버튼의 크기에 맞춰 이미지 크기 조정
              height: "100%",
            }}
          />
          <Typography
            sx={{
              fontSize: { xs: "10px", sm: "12px", md: "14px", lg: "16px" }, // 반응형 폰트 크기
              fontWeight: "800",
            }}
          >
            말 시작하기
          </Typography>
        </Button>
      )}
    </>
  );
};

AudioRecorder.propTypes = {
  uname: PropTypes.string,
  phoneNumber: PropTypes.string,
  selectedAvatar: PropTypes.string,
  disabled: PropTypes.bool,
  onRecordingStart: PropTypes.func,
  onRecordingStop: PropTypes.func, // 추가된 부분
};

export default AudioRecorder;
