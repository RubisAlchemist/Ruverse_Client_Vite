import React from "react";
import { AppBar, Toolbar, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "@assets/images/logo.png";
import aiisImage from "@assets/images/aiis.png";
import koreaImage from "@assets/images/korea.png";

export const HEADER_HEIGHT = "calc(16vh + 30px)";

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
      <Toolbar
        sx={{
          flexDirection: "column",
          alignItems: "flex-start",
          minHeight: "16vh",
        }}
      >
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
        <Grid container sx={{ width: "100%", mt: 1 }}>
          <Grid item xs={6}>
            <Box
              component="img"
              sx={{
                height: "5vh", // Adjust height as needed
              }}
              alt="AIIS"
              src={aiisImage}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Box
              component="img"
              sx={{
                height: "5vh", // Adjust height as needed
              }}
              alt="Korea"
              src={koreaImage}
            />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
