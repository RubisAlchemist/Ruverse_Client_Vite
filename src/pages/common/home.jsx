import React from "react";
import { Box, Button, Container, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Footer, Header } from "@components/index";
import homeImage from "@assets/images/homeImage.png";
import styled, { keyframes } from "styled-components";

const floatAnimation = keyframes`
  0% {
    transform: translate(-50%, -50%);
  }
  50% {
    transform: translate(-50%, -60%);
  }
  100% {
    transform: translate(-50%, -50%);
  }
`;

const AnimatedText = styled.div`
  font-size: 30px;
  font-weight: 800;
  animation: ${floatAnimation} 4s ease-in-out infinite;
  transform: translate(-50%, -50%);
  text-align: center;
  position: absolute;
  left: 50%;
  top: 20vh;
  width: 100%;
  margin-bottom: 50px; // Add spacing below the text
`;

const HomePage = () => {
  const navigate = useNavigate();

  const onClickNavigate = () => navigate("/AvatarChoosePage");
  const onClickLogo = () => navigate("/");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "absoulte",
          paddingTop: "40px",
        }}
      >
        <AnimatedText>
          🥑 마음의 상처를 치유할 시간 🥑
          <br />
          여기서 잠시 머물러 쉬어가세요
        </AnimatedText>
        <Container maxWidth="xs">
          <Stack spacing={10} alignItems="center" sx={{ mt: 35 }}>
            <Box
              component="img"
              sx={{
                maxHeight: { xs: 400, md: 600 }, // Image height
                maxWidth: { xs: 500, md: 700 }, // Image width
                objectFit: "cover",
              }}
              alt="Home Image"
              src={homeImage}
            />
            <Button
              onClick={onClickNavigate}
              variant="contained"
              sx={{
                fontSize: "1.2rem", // Increased button text size
                padding: "12px 24px", // Increased button padding
                fontWeight: "bold",
              }}
            >
              AI 심리상담소 입장하기
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* <Box sx={{ mt: 4, mb: 6 }}>
        <Footer />
      </Box> */}
    </Box>
  );
};

export default HomePage;
