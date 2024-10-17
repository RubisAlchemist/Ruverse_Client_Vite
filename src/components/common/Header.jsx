// import React from "react";
// //import { AppBar, Toolbar, Box, Grid } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import logo from "@assets/images/logo.png";
// import aiisImage from "@assets/images/snu_aiis.png";
// import koreaImage from "@assets/images/korea.png";
// import styled from "styled-components";

// export const HEADER_HEIGHT = "calc(16vh)";

// const Header = () => {
//   const navigate = useNavigate();

//   const onClickLogo = () => navigate("/");

//   return (

//     // 소연 코드
//     <HeaderContainer>
//       <HeaderUpper>
//         <Logo src={logo} alt="Logo" onClick={onClickLogo}/>
//       </HeaderUpper>
//       <HeaderLower>
//         <AiisImageStyled src={aiisImage} alt="AIIS" />
//         <KoreaImageStyled src={koreaImage} alt="Korea" />
//       </HeaderLower>
//     </HeaderContainer>
//   );
// };

// const HeaderContainer = styled.header`
//   width: 100%;

//   background-color: #ffffff;
//   display: flex;
//   flex-direction: column;
//   padding: 20px 20px;
// `;

// const HeaderUpper = styled.div`
//   height: 50%;
//   display: flex;
//   align-items: center;
//   justify-content: flex-start;
//   //padding: 20px 20px;
//   flex: 1;
// `;

// const HeaderLower = styled.div`
//   height: 50%;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   //padding: 20px 20px;
//   flex: 1;
// `;

// const Logo = styled.img`
//   height: 50px;
//   width: auto;
//   cursor: pointer;

//   @media (max-width: 768px) {
//     height: 40px;
//   }
// `;

// const AiisImageStyled = styled.img`
//   height: 50px;
//   width: auto;

//   @media (max-width: 768px) {
//     height: 40px;
//   }
// `;

// const KoreaImageStyled = styled.img`
//   height: 50px;
//   width: auto;

//   @media (max-width: 768px) {
//     height: 40px;
//   }
// `;

// export default Header;
import React from "react";
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
    <HeaderContainer>
      {/* <HeaderUpper>
        <Logo src={logo} alt="Logo" onClick={onClickLogo} />
      </HeaderUpper> */}
      <HeaderLower>
        <AiisImageStyled src={aiisImage} alt="AIIS" />
        <Logo src={logo} alt="Logo" onClick={onClickLogo} />
        <KoreaImageStyled src={koreaImage} alt="Korea" />
      </HeaderLower>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  width: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const HeaderUpper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeaderLower = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative; /* 상대적 위치 */
  width: 100%;
`;

const Logo = styled.img`
  height: 80px;
  width: auto;
  cursor: pointer;

  @media (max-width: 768px) {
    height: 40px;
  }
`;

const AiisImageStyled = styled.img`
  height: 80px;
  width: auto;
  position: absolute; /* 절대 위치 */
  left: 0; /* 좌측에 고정 */

  @media (max-width: 768px) {
    height: 40px;
  }
`;

const RuverseImageStyled = styled.img`
  height: 50px;
  width: auto;
  margin: 0 auto; /* 가운데 정렬 */

  @media (max-width: 768px) {
    height: 40px;
  }
`;

const KoreaImageStyled = styled.img`
  height: 80px;
  width: auto;
  position: absolute; /* 절대 위치 */
  right: 0; /* 우측에 고정 */

  @media (max-width: 768px) {
    height: 40px;
  }
`;

export default Header;
