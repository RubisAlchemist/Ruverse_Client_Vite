import React from "react";
import { AppBar, Toolbar, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "@assets/images/logo.png";

export const HEADER_HEIGHT = "calc(8vh + 30px)";

const Header = () => {
  const navigate = useNavigate();

  const onClickLogo = () => navigate("/");

  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      sx={{ top: 30, height: HEADER_HEIGHT }}
    >
      <Toolbar sx={{ justifyContent: "center", minHeight: "8vh" }}>
        <Box
          component="img"
          sx={{
            height: "8vh",
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
