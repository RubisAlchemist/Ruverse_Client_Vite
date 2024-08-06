import VideoCallImage from "@assets/images/videocallImage.png";
import useCurrentGps from "@hooks/useCurrentGps";
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

const RealTimeConsultEntryPage = () => {
  const navigate = useNavigate();
  const { handleGps } = useCurrentGps();
  const [uid, setUid] = useState({
    value: "",
    error: false,
  });

  const [cname, setCname] = useState({
    value: "",
    error: false,
  });

  const onChangeUname = (e) => {
    const value = e.target.value;
    const valid = e.target.validity.valid;

    setUid({
      value,
      error: !valid,
    });
  };
  const onChangeCname = (e) => {
    const value = e.target.value;
    const valid = e.target.validity.valid;

    setCname({
      value,
      error: !valid,
    });
  };

  const onNavigate = () => {
    handleGps();
    navigate(`/consult/${window.btoa(cname.value)}/${window.btoa(uid.value)}`);
  };

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
            value={uid.value}
            error={uid.error}
            fullWidth
            required
            label="유저 아이디"
            onChange={onChangeUname}
            helperText={uid.error ? "유저 이름은 숫자만 가능합니다." : ""}
            inputProps={{
              pattern: "[0-9]+",
            }}
          />
          <TextField
            value={cname.value}
            error={cname.error}
            label="채널 이름"
            fullWidth
            required
            onChange={onChangeCname}
            helperText={
              cname.error ? "채널 이름은 영문 숫자만 가능합니다." : ""
            }
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
            <Button onClick={onNavigate}>
              <Typography>상담 시작하기</Typography>
            </Button>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};

export default RealTimeConsultEntryPage;
