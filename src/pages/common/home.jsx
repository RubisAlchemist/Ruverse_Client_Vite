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
  animation: ${floatAnimation} 3s ease-in-out infinite;
  transform: translate(-50%, -50%);
  text-align: center;
  position: absolute;
  left: 50%;
  top: 20vh;
  width: 100%;
  margin-bottom: 50px; 
  margin-top: 30px;
  cursor: default;
  letter-spacing: 1px;


  @media all and (min-width:1280px) { 
    font-size: 35px;
    margin-top: 120px;
  } 

  /* 노트북 & 테블릿 가로 (해상도 1024px ~ 1279px)*/ 
  @media all and (min-width:1024px) and (max-width:1279px) { 
    font-size: 28px;
    margin-top: 100px;
  } 

  /* 테블릿 가로 (해상도 768px ~ 1023px)*/ 
  @media all and (min-width:768px) and (max-width:1023px) { 
    font-size: 25px;
    margin-top: 60px;
  } 

  /* 모바일 가로 & 테블릿 세로 (해상도 480px ~ 767px)*/ 
  @media all and (min-width:480px) and (max-width:767px) {
    font-size: 22px;
    margin-top: 50px;
  } 

  /* 모바일 세로 (해상도 ~ 479px)*/ 
  @media all and (min-width:376px) and (max-width:479px) {
    font-size: 18px;
    margin-top: 40px;
  }

  @media all and (max-width:375px) {
    font-size: 16px;
    margin-top: 40px;
  }
`;

const ResponsiveImage = styled.img`
  /* max-height: 600px;
  max-width: 700px; */
  object-fit: cover;

  @media all and (min-width:1280px) { 
    max-height: 400px;
  } 

  /* 노트북 & 테블릿 가로 (해상도 1024px ~ 1279px)*/ 
  @media all and (min-width:1024px) and (max-width:1279px) { 
    max-height: 400px;
  } 

  /* 테블릿 가로 (해상도 768px ~ 1023px)*/ 
  @media all and (min-width:768px) and (max-width:1023px) { 
    max-height: 250px;
  } 

  /* 모바일 가로 & 테블릿 세로 (해상도 480px ~ 767px)*/ 
  @media all and (min-width:480px) and (max-width:767px) {
    max-height: 250px;
  } 

  /* 모바일 세로 (해상도 ~ 479px)*/ 
  @media all and (min-width:376px) and (max-width:479px) {
    max-height: 230px;
  }

  @media all and (max-width:375px) {
    max-height: 150px;
  }
`;


const HomePage = () => {
  const navigate = useNavigate();

  // const onClickNavigate = () => navigate("/AvatarChoosePage");
  const onClickNavigate = () => navigate("/ai-consultEntry");
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
          position: "relative",
          paddingTop: {
            xs: "4px", 
            sm: "6px", 
            md: "8px", 
            lg: "10px",
          },
        }}
      >
        
        <AnimatedText>
          🌈 마음의 상처를 치유할 시간💡
          {/* 🥑 */}
          <br />
          여기서 잠시 머물러 쉬어가세요
        </AnimatedText>
        <Container maxWidth="xs">
        <Stack
            spacing={{ xs: 6, sm: 8, md: 10, lg: 6 }}
            alignItems="center"
            sx={{ mt: { xs: 10, sm: 20, md: 30, lg: 40} }}
          >
          <ResponsiveImage src={homeImage} alt="Home Image" />
          <Button
              onClick={onClickNavigate}
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

                padding: "8px 16px",
                fontWeight: "bold",

                '@media (min-width:1280px)' : { 
                  fontSize: "25px",
                  padding: "10px 30px",
                },
              
                /* 노트북 & 테블릿 가로 (해상도 1024px ~ 1279px)*/ 
                '@media all and (min-width:1024px) and (max-width:1279px)' :{ 
                  fontSize: "17px",
                  padding: "10px 30px",
                },
              
                /* 테블릿 가로 (해상도 768px ~ 1023px)*/ 
                '@media all and (min-width:768px) and (max-width:1023px)' :{ 
                  fontSize: "17px",
                  padding: "10px 30px",
                },
              
                /* 모바일 가로 & 테블릿 세로 (해상도 480px ~ 767px)*/ 
                '@media all and (min-width:480px) and (max-width:767px)' :{
                  fontSize: "15px",
                  padding: "10px 30px",
                },
              
                /* 모바일 세로 (해상도 ~ 479px)*/ 
                '@media all and (min-width:376px) and (max-width:479px)' :{
                  fontSize: "15px",
                  padding: "10px 30px",
                },
              
                '@media all and (max-width:375px)' : {
                  fontSize: "12px",
                  padding: "8px 24px",
                }
              }}
            >
              AI 심리상담소 입장하기
            </Button>
          </Stack>
        </Container>
      </Box>

      <Box sx={{ mt: 4, mb: 6 }}>{/* <Footer /> */}</Box>
    </Box>
  );
};

export default HomePage;