import { AudioRecorder, LocalUser, UploadInfoModal } from "@components/index";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";

const AiConsultChannelPage = () => {
  const { uname } = useParams();

  return (
    <Box width="100%" height="100vh">
      {/* remote user */}
      <Box width="100%" height="90%">
        <Box
          component="video"
          width="100%"
          height="100%"
          autoPlay
          src="https://ruverse.snu.ac.kr/video/helloworld.mp4"
        ></Box>
      </Box>

      <Box
        sx={{
          position: "absolute",
          right: 0,
          bottom: 0 + "10%",
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
      <UploadInfoModal />
    </Box>
  );
};

export default AiConsultChannelPage;
