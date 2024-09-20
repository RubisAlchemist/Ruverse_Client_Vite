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

  //Klleon
  // const onClickStart = () => navigate(`/klleonAvatar`);

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
            sx={{
              fontSize: { xs: '14px', md: '16px' },
            }}
          />

          <Box
            component="img"
            sx={{
              // maxHeight: { xs: 300, md: 360 },
              // maxWidth: { xs: 400, md: 420 },
              // objectFit: "cover",
              maxHeight: { xs: 200, sm: 300, md: 360 },
              maxWidth: { xs: 300, sm: 400, md: 420 },
              objectFit: "cover",
              margin: '0 auto',
            }}
            alt="The house from the offer."
            src={VideoCallImage}
          />
          <Box display="flex" justifyContent="center">
            <Button
              onClick={onClickStart}
              disabled={uname.value === "" || uname.error}
              variant="contained"
              sx={{
                fontFamily: 'SUIT Variable',
                backgroundColor: "#1976d2",
                color: "white",
                borderRadius: "25px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease-in-out, background-color 0.3s",
                "&:hover": {
                  backgroundColor: "#1565c0", // 호버 시 더 진한 색상
                  transform: "scale(1.03)", // 호버 시 살짝 커짐
                },
                padding: { xs: "6px 14px", sm: "8px 16px", md: "10px 20px" },
                fontWeight: "bold",
                fontSize: { xs: "14px", sm: "16px", md: "20px" },
              }}
            >
              상담 시작하기
            </Button>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};

export default AiConsultEntryPage;
