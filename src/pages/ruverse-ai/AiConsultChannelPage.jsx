// import { AudioRecorder, LocalUser, UploadInfoModal } from "@components/index";
// import { Box, CircularProgress } from "@mui/material";
// import { useSelector } from "react-redux";
// import { useParams } from "react-router-dom";

// const AiConsultChannelPage = () => {
//   const { uname } = useParams();

//   const src = useSelector((state) => state.aiConsult.audio.src);
//   console.log(`src change ${src}`);

//   const isLoading = useSelector(
//     (state) => state.aiConsult.audio.upload.isLoading
//   );

//   return (
//     <Box width="100%" height="100vh">
//       {/* remote user */}
//       <Box
//         width="100%"
//         height="90%"
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//       >
//         {isLoading ? (
//           <CircularProgress />
//         ) : (
//           <Box
//             component="video"
//             width="100%"
//             height="100%"
//             src={src}
//             autoPlay
//           />
//         )}
//       </Box>

//       <Box
//         sx={{
//           position: "absolute",
//           right: 0,
//           bottom: 0 + "10%",
//           backgroundColor: "blue",
//           width: { xs: "200px", md: "320px" },
//           height: { xs: "120px", md: "200px" },
//         }}
//       >
//         <LocalUser />
//       </Box>
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         height="10%"
//         borderTop={1}
//         borderColor={"#ccc"}
//       >
//         <AudioRecorder uname={uname} />
//       </Box>
//       {/* <UploadInfoModal /> */}
//     </Box>
//   );
// };

// export default AiConsultChannelPage;
import { AudioRecorder, LocalUser } from "@components/index";
import { Box, CircularProgress } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { clearAudioSrc } from "./aiConsultSlice"; // Adjust the import path accordingly

const AiConsultChannelPage = () => {
  const { uname } = useParams();
  const dispatch = useDispatch();

  const src = useSelector((state) => state.aiConsult.audio.src);
  const isLoading = useSelector(
    (state) => state.aiConsult.audio.upload.isLoading
  );

  const handleVideoEnd = () => {
    dispatch(clearAudioSrc());
  };

  return (
    <Box width="100%" height="100vh">
      {/* remote user */}
      <Box
        width="100%"
        height="90%"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Box
            component="video"
            width="100%"
            height="100%"
            src={src}
            autoPlay
            onEnded={handleVideoEnd}
          />
        )}
      </Box>

      <Box
        sx={{
          position: "absolute",
          right: 0,
          bottom: "10%",
          backgroundColor: "blue",
          width: { xs: "200px", md: "320px" },
          height: { xs: "120px", md: "200px" },
        }}
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
        <AudioRecorder uname={uname} />
      </Box>
      {/* <UploadInfoModal /> */}
    </Box>
  );
};

export default AiConsultChannelPage;
