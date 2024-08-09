import React from "react";
import { AppBar, Toolbar, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "@assets/images/logo.png"; // 로고 이미지 경로를 확인하세요

const Header = () => {
  const navigate = useNavigate();

  const onClickLogo = () => navigate("/");

  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      sx={{ top: 30 }} // 상단에 16px의 여백 추가
    >
      <Toolbar sx={{ justifyContent: "center", minHeight: "48px" }}>
        <Box
          component="img"
          sx={{
            height: 70,
            cursor: "pointer",
          }}
          alt="Logo"
          src={logo}
          onClick={onClickLogo}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
