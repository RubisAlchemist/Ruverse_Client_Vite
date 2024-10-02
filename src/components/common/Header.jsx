import React from "react";
//import { AppBar, Toolbar, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "@assets/images/logo.png";
import aiisImage from "@assets/images/snu_aiis.png";
import koreaImage from "@assets/images/korea.png";
import styled from "styled-components";

export const HEADER_HEIGHT = "calc(16vh)";

const Header = () => {
  const navigate = useNavigate();

  const onClickLogo = () => navigate("/");

  return (
    // 태휘 코드
    // <AppBar
    //   position="fixed"

    //   elevation={0}
    //   sx={{
    //     height: HEADER_HEIGHT,
    //     backgroundColor:"#ffffff",
    //     paddingTop: "30px"
    //   }}
    // >
    //   <Toolbar
    //     sx={{
    //       width: "100%",
    //       justifyContent: "space-between",
    //       alignItems: "center",
    //       backgroundColor:"#cf9d329"
    //     }}
    //   >
    //     <Box
    //       component="img"
    //       sx={{
    //         height: { xs: "5vh", md: "8vh" },
    //         cursor: "pointer",
    //       }}
    //       alt="Logo"
    //       src={logo}
    //       onClick={onClickLogo}
    //     />
    //     <Grid container sx={{ width: "100%", mt: 1 }}>
    //       <Grid item xs={6}>
    //         <Box
    //           component="img"
    //           sx={{
    //             height: "8vh", // Adjust height as needed
    //           }}
    //           alt="AIIS"
    //           src={aiisImage}
    //         />
    //       </Grid>
    //       <Grid
    //         item
    //         xs={6}
    //         sx={{ display: "flex", justifyContent: "flex-end" }}
    //       >
    //         <Box
    //           component="img"
    //           sx={{
    //             height: "8vh", // Adjust height as needed
    //           }}
    //           alt="Korea"
    //           src={koreaImage}
    //         />
    //       </Grid>
    //     </Grid>
    //   </Toolbar>
    // </AppBar>

    // 소연 코드
    <HeaderContainer>
      <HeaderUpper>
        <Logo src={logo} alt="Logo" onClick={onClickLogo}/>
      </HeaderUpper>
      <HeaderLower>
        <AiisImageStyled src={aiisImage} alt="AIIS" />
        <KoreaImageStyled src={koreaImage} alt="Korea" />
      </HeaderLower>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  width: 100%;
  
  background-color: #f8f9fa; 
  display: flex;
  flex-direction: column;
  padding: 20px 20px;
`;

const HeaderUpper = styled.div`
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  //padding: 20px 20px; 
  flex: 1;
`;

const HeaderLower = styled.div`
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  //padding: 20px 20px; 
  flex: 1;
`;

const Logo = styled.img`
  height: 50px; 
  width: auto;
  cursor: pointer;

  @media (max-width: 768px) {
    height: 40px;
  }
`;

const AiisImageStyled = styled.img`
  height: 50px;
  width: auto;

  @media (max-width: 768px) {
    height: 40px;
  }
`;

const KoreaImageStyled = styled.img`
  height: 50px;
  width: auto;

  @media (max-width: 768px) {
    height: 40px;
  }
`;

export default Header;
