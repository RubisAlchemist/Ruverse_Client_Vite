import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import aiis from "@assets/images/aiis.png";
import threeR from "@assets/images/3r.png";
import virnect from "@assets/images/virnect.png";
import snuh from "@assets/images/snuh.png";
import ktcloud from "@assets/images/ktcloud.png";
import kakao from "@assets/images/kakao.png";
import korea from "@assets/images/korea.png";
import education from "@assets/images/education.png";
import ifland from "@assets/images/ifland.png";

const Footer = () => {
  const logos = [
    aiis,
    snuh,
    korea,
    threeR,
    virnect,
    ktcloud,
    kakao,
    education,
    ifland,
  ];

  const logoTrackRef = useRef(null);

  useEffect(() => {
    const logoTrack = logoTrackRef.current;
    let animationFrameId;

    const scrollLogos = () => {
      if (logoTrack.scrollLeft >= logoTrack.scrollWidth / 2) {
        logoTrack.scrollLeft = 0;
      } else {
        logoTrack.scrollLeft += 1;
      }

      animationFrameId = requestAnimationFrame(scrollLogos);
    };

    animationFrameId = requestAnimationFrame(scrollLogos);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <Box
      sx={{
        // backgroundColor: "#2E3B55",
        padding: "20px 0",
        textAlign: "center",
        color: "white",
        overflow: "hidden",
        width: "100vw", // 뷰포트 너비로 설정
        maxWidth: "100%", // 화면 너비를 초과하지 않도록 설정
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: "10px" }}>
        클레온 스튜디오 고객사
      </Typography>
      <Box
        ref={logoTrackRef}
        sx={{
          display: "flex",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        <Box
          sx={{
            display: "flex",
          }}
        >
          {logos.map((logo, index) => (
            <Box
              key={index}
              component="img"
              src={logo}
              sx={{
                maxHeight: "60px",
                marginRight: "30px",
              }}
              alt={`Logo ${index + 1}`}
            />
          ))}
          {logos.map((logo, index) => (
            <Box
              key={index + logos.length}
              component="img"
              src={logo}
              sx={{
                maxHeight: "60px",
                marginRight: "30px",
              }}
              alt={`Logo ${index + 1}`}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
