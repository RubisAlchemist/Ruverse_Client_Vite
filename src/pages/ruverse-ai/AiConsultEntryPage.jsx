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
import { convert } from "hangul-romanization";

const AiConsultEntryPage = () => {
  // State variables for username and phone number
  const [uname, setUname] = useState({
    value: "",
    error: false,
  });

  const [phoneNumber, setPhoneNumber] = useState({
    value: "",
    error: false,
  });

  const navigate = useNavigate();

  // Handler for username input
  const onChangeUname = (e) => {
    const value = e.target.value;
    // Regex to allow English letters, numbers, and Korean characters
    const regex = /^[A-Za-z0-9ㄱ-ㅎㅏ-ㅣ가-힣]+$/;
    const valid = regex.test(value);

    setUname({
      value,
      error: !valid && value !== "",
    });
  };

  // Handler for phone number input
  const onChangePhoneNumber = (e) => {
    const value = e.target.value;
    const valid = e.target.validity.valid;

    setPhoneNumber({
      value,
      error: !valid && value !== "",
    });
  };

  // Handler for the start button click
  const onClickStart = () => {
    let unameToUse = uname.value;

    // Check if username contains Korean characters
    const containsKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(uname.value);
    if (containsKorean) {
      // Transliterate Korean to English
      unameToUse = convert(uname.value).replace(/\s+/g, "");
    }

    navigate(`/ai-consult/${unameToUse}?phoneNumber=${phoneNumber.value}`);
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
          {/* Username input field */}
          <TextField
            fullWidth
            required
            error={uname.error}
            value={uname.value}
            helperText={
              uname.error ? "이름은 숫자, 영문, 한글만 가능합니다." : ""
            }
            label="이름"
            onChange={onChangeUname}
            // Removed pattern from inputProps
            inputProps={{}}
            sx={{
              fontSize: { xs: "14px", md: "16px" },
            }}
          />

          {/* Phone number input field */}
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
              pattern: "[0-9]+", // Only numbers allowed
            }}
            placeholder="01012345678" // Added placeholder
            sx={{
              fontSize: { xs: "14px", md: "16px" },
            }}
          />

          {/* Image */}
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

          {/* Start Consultation Button */}
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
                  backgroundColor: "#1565c0", // Darker color on hover
                  transform: "scale(1.03)", // Slightly enlarge on hover
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
