// import React, { useEffect, useRef } from "react";
// import { Box, Typography } from "@mui/material";
// import { keyframes } from "@emotion/react";
// import aiis from "@assets/images/snu_aiis.png";
// import threeR from "@assets/images/3r.png";
// import virnect from "@assets/images/virnect.png";
// import snuh from "@assets/images/snuh.png";
// import ktcloud from "@assets/images/ktcloud.png";
// import kakao from "@assets/images/kakao.png";
// import korea from "@assets/images/korea.png";
// import education from "@assets/images/education.png";
// import ifland from "@assets/images/ifland.png";
// import harvard from "@assets/images/harvard.png";

// const Footer = () => {
//   const logos = [
//     aiis,
//     snuh,
//     korea,
//     harvard,
//     threeR,
//     virnect,
//     ktcloud,
//     kakao,
//     education,
//     ifland,
//   ];

//   const containerRef = useRef(null);

//   useEffect(() => {
//     const container = containerRef.current;
//     if (container) {
//       const scrollWidth = container.scrollWidth / 2;
//       const animationDuration = scrollWidth / 100; // Adjust speed here
//       container.style.setProperty("--scroll-width", `${scrollWidth}px`);
//       container.style.setProperty(
//         "--animation-duration",
//         `${animationDuration}s`
//       );
//     }
//   }, []);

//   const scroll = keyframes`
//     0% { transform: translateX(0); }
//     100% { transform: translateX(calc(-1 * var(--scroll-width))); }
//   `;

//   return (
//     <Box
//       sx={{
//         padding: "20px 0",
//         textAlign: "center",
//         color: "white",
//         overflow: "hidden",
//         width: "100%",
//         position: "relative",
//       }}
//     >
//       <Typography variant="h6" sx={{ marginBottom: "10px" }}>
//         클레온 스튜디오 고객사
//       </Typography>
//       <Box
//         sx={{
//           overflow: "hidden",
//           whiteSpace: "nowrap",
//           position: "relative",
//           "&::before, &::after": {
//             content: '""',
//             position: "absolute",
//             top: 0,
//             width: "100px",
//             height: "100%",
//             zIndex: 2,
//           },
//           "&::before": {
//             left: 0,
//             background: "linear-gradient(to right, white, transparent)",
//           },
//           "&::after": {
//             right: 0,
//             background: "linear-gradient(to left, white, transparent)",
//           },
//         }}
//       >
//         <Box
//           ref={containerRef}
//           sx={{
//             display: "inline-block",
//             whiteSpace: "nowrap",
//             animation: `${scroll} var(--animation-duration) linear infinite`,
//           }}
//         >
//           {[...logos, ...logos].map((logo, index) => (
//             <Box
//               key={index}
//               component="img"
//               src={logo}
//               sx={{
//                 height: "80px",
//                 marginRight: "40px",
//                 verticalAlign: "middle",
//               }}
//               alt={`Logo ${(index % logos.length) + 1}`}
//             />
//           ))}
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default Footer;
import React from "react";
import { Box, Typography } from "@mui/material";
import footerRow from "@assets/images/footer_row.png"; // footer_row 이미지 가져오기

const Footer = () => {
  return (
    <Box
      sx={{
        padding: "20px 0",
        textAlign: "center",
        color: "white",
        width: "100%",
        position: "relative",
      }}
    >
      {/* 반응형 footer_row.png 이미지 */}
      <Box
        component="img"
        src={footerRow}
        alt="Footer Row"
        sx={{
          display: "block",
          margin: "0 auto", // 가운데 정렬
          width: { xs: "90%", sm: "80%", md: "70%", lg: "60%" }, // 화면 크기에 따라 너비 조절
          height: "auto", // 높이를 자동으로 설정하여 비율 유지
          maxWidth: "100%", // 이미지가 부모 요소를 넘어가지 않도록 제한
        }}
      />
    </Box>
  );
};

export default Footer;
