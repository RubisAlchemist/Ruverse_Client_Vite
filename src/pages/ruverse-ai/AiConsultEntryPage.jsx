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
  // 상태 변수: uname과 phoneNumber 각각 관리
  const [uname, setUname] = useState({
    value: "",
    error: false,
  });

  const [phoneNumber, setPhoneNumber] = useState({
    value: "",
    error: false,
  });

  const navigate = useNavigate();

  // 유저 이름 입력 핸들러
  const onChangeUname = (e) => {
    const value = e.target.value;
    const valid = e.target.validity.valid;

    setUname({
      value,
      error: !valid,
    });
  };

  // 전화번호 입력 핸들러
  const onChangePhoneNumber = (e) => {
    const value = e.target.value;
    const valid = e.target.validity.valid;

    setPhoneNumber({
      value,
      error: !valid,
    });
  };

  // 시작 버튼 클릭 시
  const onClickStart = () =>
    navigate(`/ai-consult/${uname.value}?phoneNumber=${phoneNumber.value}`);

  return (
    <Container maxWidth="md">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Stack spacing={3}>
          {/* 유저 이름 입력 필드 */}
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
              fontSize: { xs: "14px", md: "16px" },
            }}
          />

          {/* 전화번호 입력 필드 */}
          <TextField
            fullWidth
            required
            error={phoneNumber.error}
            value={phoneNumber.value}
            helperText={
              phoneNumber.error ? "전화번호는 숫자만 입력 가능합니다." : ""
            }
            label="전화번호"
            onChange={onChangePhoneNumber}
            inputProps={{
              pattern: "[0-9]+", // 숫자만 허용
            }}
            sx={{
              fontSize: { xs: "14px", md: "16px" },
            }}
          />

          {/* 이미지 */}
          <Box
            component="img"
            sx={{
              maxHeight: { xs: 200, sm: 300, md: 360 },
              maxWidth: { xs: 300, sm: 400, md: 420 },
              objectFit: "cover",
              margin: "0 auto",
            }}
            alt="The house from the offer."
            src={VideoCallImage}
          />

          {/* 상담 시작하기 버튼 */}
          <Box display="flex" justifyContent="center">
            <Button
              onClick={onClickStart}
              disabled={
                uname.value === "" ||
                uname.error ||
                phoneNumber.value === "" ||
                phoneNumber.error
              }
              variant="contained"
              sx={{
                fontFamily: "SUIT Variable",
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
