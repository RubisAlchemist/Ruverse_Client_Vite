import { AudioRecorder, LocalUser } from "@components/index";
import { Box } from "@mui/material";
import { clearAudioSrc } from "@store/ai/aiConsultSlice"; // Adjust the import path accordingly
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const AiConsultChannelPage = () => {
  const { uname } = useParams();
  const dispatch = useDispatch();

  const defaultSrc = useSelector((state) => state.aiConsult.audio.defaultSrc);
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
      {
        <Box
          width="100%"
          height="90%"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {src === "" || isLoading ? (
            <Box
              component="video"
              width="100%"
              height="100%"
              src={defaultSrc}
              loop={true}
              autoPlay
              onEnded={handleVideoEnd}
            />
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
      }

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
