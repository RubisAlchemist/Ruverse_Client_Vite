import VideoCallImage from "@assets/images/videocallImage.png";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const RealTimeConsultEntryPage = () => {
  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Stack spacing={3}>
          <TextField
            fullWidth
            required
            label="유저 아이디"
            onChange={(e) => {
              console.log(e.target.validity);
            }}
            inputProps={{
              pattern: "[0-9]+",
            }}
          />
          <TextField
            fullWidth
            required
            label="채널 이름"
            onChange={(e) => {
              console.log(e.target.validity);
            }}
            inputProps={{
              pattern: "[A-Za-z0-9]+",
            }}
          />

          <Box
            component="img"
            sx={{
              maxHeight: { xs: 300, md: 360 },
              maxWidth: { xs: 400, md: 420 },
              objectFit: "cover",
            }}
            alt="The house from the offer."
            src={VideoCallImage}
          />
          <Box display="flex" justifyContent="center">
            <Button>
              <Typography>상담 시작하기</Typography>
            </Button>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};

export default RealTimeConsultEntryPage;
