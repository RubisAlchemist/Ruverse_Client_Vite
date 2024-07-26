import VideoCallImage from "@assets/images/videocallImage.png";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AiConsultEntryPage = () => {
  const [uname, setUname] = useState({
    value: "",
    error: false,
  });

  const navigate = useNavigate();

  const onChangeUname = (e) => {
    const value = e.target.value;
    const valid = e.target.validity.valid;

    setUname({
      value,
      error: !valid,
    });
  };

  const onClickStart = () => navigate(`/ai-consult/${uname.value}`);

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
            error={uname.error}
            value={uname.value}
            helperText={
              uname.error ? "유저 이름은 숫자, 영문만 가능합니다." : ""
            }
            label="유저 이름"
            onChange={onChangeUname}
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
            <Button
              onClick={onClickStart}
              disabled={uname.value === "" || uname.error}
            >
              <Typography>상담 시작하기</Typography>
            </Button>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};

export default AiConsultEntryPage;
