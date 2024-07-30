// import { AudioRecorder, LocalUser } from "@components/index";
// import { Box } from "@mui/material";
// import { clearAudioSrc } from "@store/ai/aiConsultSlice"; // Adjust the import path accordingly
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";

// const AiConsultChannelPage = () => {
//   const { uname } = useParams();
//   const dispatch = useDispatch();

//   const defaultSrc = useSelector((state) => state.aiConsult.audio.defaultSrc);
//   const src = useSelector((state) => state.aiConsult.audio.src);

//   const isLoading = useSelector(
//     (state) => state.aiConsult.audio.upload.isLoading
//   );

//   const handleVideoEnd = () => {
//     dispatch(clearAudioSrc());
//   };

//   return (
//     <Box width="100%" height="100vh">
//       {/* remote user */}
//       {
//         <Box
//           width="100%"
//           height="90%"
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//         >
//           {src === "" || isLoading ? (
//             <Box
//               component="video"
//               width="100%"
//               height="100%"
//               src={defaultSrc}
//               loop={true}
//               autoPlay
//               onEnded={handleVideoEnd}
//             />
//           ) : (
//             <Box
//               component="video"
//               width="100%"
//               height="100%"
//               src={src}
//               autoPlay
//               onEnded={handleVideoEnd}
//             />
//           )}
//         </Box>
//       }

//       <Box
//         sx={{
//           position: "absolute",
//           right: 0,
//           bottom: "10%",
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

import { AudioRecorder, LocalUser } from "@components/index";
import { Box } from "@mui/material";
import { clearAudioSrc } from "@store/ai/aiConsultSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
const AiConsultChannelPage = () => {
  const { uname } = useParams();
  const dispatch = useDispatch();
  const defaultSrc = useSelector((state) => state.aiConsult.audio.defaultSrc);
  const src = useSelector((state) => state.aiConsult.audio.src);
  const isLoading = useSelector(
    (state) => state.aiConsult.audio.upload.isLoading
  );
  const [showNewVideo, setShowNewVideo] = useState(false);
  useEffect(() => {
    if (src && !isLoading) {
      setShowNewVideo(true);
    }
  }, [src, isLoading]);
  const handleVideoEnd = () => {
    dispatch(clearAudioSrc());
    setShowNewVideo(false);
  };
  return (
    <Box width="100%" height="100vh" position="relative">
      {/* Video container */}
      <Box
        width="100%"
        height="90%"
        position="relative"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {/* Default video */}
        <Box
          component="video"
          width="100%"
          height="100%"
          src={defaultSrc}
          loop
          autoPlay
          muted
          sx={{ position: "absolute", top: 0, left: 0 }}
        />
        {/* New video */}
        {showNewVideo && (
          <Box
            component="video"
            width="100%"
            height="100%"
            src={src}
            autoPlay
            onEnded={handleVideoEnd}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              transition: "opacity 0.5s ease-in-out",
              opacity: 1,
            }}
          />
        )}
      </Box>
      {/* Local user video */}
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
      {/* Audio recorder */}
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
    </Box>
  );
};
export default AiConsultChannelPage;
