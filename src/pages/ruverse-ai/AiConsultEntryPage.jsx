// import VideoCallImage from "@assets/images/videocallImage.png";
// import {
//   Box,
//   Button,
//   //Container,
//   Stack,
//   TextField,
//   Typography,
//   Grid,
//   Dialog,
//   DialogContent,
//   DialogActions,
//   Toolbar,
// } from "@mui/material";
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { convert } from "hangul-romanization";
// import { Header, HEADER_HEIGHT } from "@components/index";
// import avatarSonny from "@assets/images/avatar_sonny.png";
// import avatarJennie from "@assets/images/avatar_karina.png";
// import { useDispatch, useSelector } from "react-redux";
// import { uploadNewSessionRequest } from "@store/ai/aiConsultSlice";
// import styled from "styled-components";
// // import avatarJungkook from "@assets/images/avatar_jungkook.png";

// const AiConsultEntryPage = () => {
//   const dispatch = useDispatch();
//   const [selectedAvatar, setSelectedAvatar] = useState(null);
//   const [openPopup, setOpenPopup] = useState(false);
//   const [uname, setUname] = useState({
//     value: "",
//     error: false,
//   });
//   const [phoneNumber, setPhoneNumber] = useState({
//     value: "",
//     error: false,
//   });
//   const [isButtonEnabled, setIsButtonEnabled] = useState(false);

//   const handleAvatarClick = (avatar) => {
//     if (avatar === "sonny") {
//       setSelectedAvatar((prev) => (prev === "sonny" ? null : "sonny"));
//     } else if (avatar === "karina") {
//       setOpenPopup(true);
//     }
//   };

//   const handleClosePopup = () => {
//     setOpenPopup(false);
//   };

//   const navigate = useNavigate();

//   const onChangeUname = (e) => {
//     const value = e.target.value;
//     const regex = /^[A-Za-z0-9ㄱ-ㅎㅏ-ㅣ가-힣]+$/;
//     const valid = regex.test(value);

//     setUname({
//       value,
//       error: !valid && value !== "",
//     });
//   };

//   const onChangePhoneNumber = (e) => {
//     const value = e.target.value;
//     const isValid = /^[0-9]{11}$/.test(value);

//     setPhoneNumber({
//       value,
//       error: value !== "" && !isValid,
//     });
//   };

//   const onClickStart = () => {
//     let unameToUse = uname.value;

//     const containsKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(uname.value);
//     if (containsKorean) {
//       unameToUse = convert(uname.value).replace(/\s+/g, "");
//     }
//     console.log("uname: ", unameToUse, ", phoneNum: ", phoneNumber.value);
//     const formData = new FormData();

//     formData.append("uname", unameToUse);
//     formData.append("phoneNumber", phoneNumber.value);

//     dispatch(uploadNewSessionRequest(formData));

//     navigate(`/ai-consult/${unameToUse}?phoneNumber=${phoneNumber.value}`);
//   };

//   useEffect(() => {
//     const isNameValid = uname.value !== "" && !uname.error;
//     const isPhoneValid = phoneNumber.value !== "" && !phoneNumber.error;
//     const isAvatarSelected = selectedAvatar !== null;

//     setIsButtonEnabled(isNameValid && isPhoneValid && isAvatarSelected);
//   }, [uname, phoneNumber, selectedAvatar]);

//   return (
//     <Container>
//       <Header />
//       {/* <Toolbar/> */}
//       <Box
//         flex="1"
//         display="flex"
//         alignItems="center"
//         justifyContent="center"
//         //height="100vh"
//         //sx={{ paddingTop: { xs: '40px', md: '80px' }, backgroundColor: "#b0e977t1" }}
//       >
//         <Stack spacing={{ xs: 3, md: 4 }} alignItems="center" width="100%">
//           <Box
//             width="100%"
//             display="flex"
//             flexDirection="column"
//             alignItems="center"
//           >
//             <TextField
//               required
//               error={uname.error}
//               value={uname.value}
//               helperText={
//                 uname.error ? "이름은 숫자, 영문, 한글만 가능합니다." : ""
//               }
//               label="이름을 입력해주세요."
//               onChange={onChangeUname}
//               inputProps={{}}
//               sx={{
//                 fontSize: { xs: "14px", md: "16px" },
//                 width: { xs: "70%", sm: "70%", md: "70%" },
//                 maxWidth: "400px",
//                 mb: 2,
//               }}
//             />

//             <TextField
//               required
//               error={phoneNumber.error}
//               value={phoneNumber.value}
//               helperText={
//                 phoneNumber.error
//                   ? "전화번호는 11자리의 숫자만 입력 가능합니다."
//                   : ""
//               }
//               label="전화번호를 입력해주세요."
//               onChange={onChangePhoneNumber}
//               inputProps={{
//                 pattern: "[0-9]{11}",
//                 maxLength: 11,
//                 inputMode: "numeric",
//               }}
//               placeholder="01012345678"
//               sx={{
//                 fontSize: { xs: "14px", md: "16px" },
//                 width: { xs: "70%", sm: "70%", md: "70%" },
//                 maxWidth: "400px",
//               }}
//             />
//           </Box>

//           <Box display="flex" justifyContent="center" gap={4}>
//             {[
//               { name: "sonny", src: avatarSonny },
//               { name: "karina", src: avatarJennie },
//             ].map((avatar) => (
//               <Box
//                 key={avatar.name}
//                 display="flex"
//                 justifyContent="center"
//                 alignItems="center"
//                 height="100%"
//               >
//                 <Box
//                   component="img"
//                   sx={{
//                     width: "100%",
//                     height: "auto",
//                     maxWidth: { xs: "150px", sm: "220px", md: "240px" },
//                     cursor: "pointer",
//                     border:
//                       selectedAvatar === avatar.name
//                         ? "5px solid #3399FF"
//                         : "none",
//                     borderRadius: "8px",
//                     transition: "all 0.3s ease",
//                   }}
//                   alt={`Avatar ${avatar.name}`}
//                   src={avatar.src}
//                   onClick={() => handleAvatarClick(avatar.name)}
//                 />
//               </Box>
//             ))}
//           </Box>

//           {/* <Grid container justifyContent="center" >
//             {[
//               { name: "sonny", src: avatarSonny },
//               { name: "karina", src: avatarJennie },
//             ].map((avatar) => (
//               <Grid item xs={6} sm={5} md={2} key={avatar.name}>
//                 <Box
//                   display="flex"
//                   justifyContent="center"
//                   alignItems="center"
//                   height="100%"
//                 >
//                   <Box
//                     component="img"
//                     sx={{
//                       width: "100%",
//                       height: "auto",
//                       maxWidth: { xs: "150px", sm: "220px", md: "240px" },
//                       cursor: "pointer",
//                       border:
//                         selectedAvatar === avatar.name
//                           ? "5px solid #3399FF"
//                           : "none",
//                       borderRadius: "8px",
//                       transition: "all 0.3s ease",
//                     }}
//                     alt={`Avatar ${avatar.name}`}
//                     src={avatar.src}
//                     onClick={() => handleAvatarClick(avatar.name)}
//                   />
//                 </Box>
//               </Grid>
//             ))}
//           </Grid> */}

//           <Box display="flex" justifyContent="center">
//             <Button
//               onClick={onClickStart}
//               disabled={!isButtonEnabled}
//               variant="contained"
//               sx={{
//                 fontFamily: "SUIT Variable",
//                 backgroundColor: "#1976d2",
//                 color: "white",
//                 borderRadius: "25px",
//                 boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
//                 transition: "transform 0.3s ease-in-out, background-color 0.3s",
//                 "&:hover": {
//                   backgroundColor: "#1565c0",
//                   transform: "scale(1.03)",
//                 },
//                 padding: { xs: "6px 14px", sm: "8px 16px", md: "10px 20px" },
//                 fontWeight: "bold",
//                 fontSize: { xs: "14px", sm: "16px", md: "20px" },
//               }}
//             >
//               상담 시작하기
//             </Button>
//           </Box>
//         </Stack>
//       </Box>

//       <Dialog open={openPopup} onClose={handleClosePopup}>
//         <DialogContent>Coming Soon</DialogContent>
//         <DialogActions sx={{ justifyContent: "center" }}>
//           <Button onClick={handleClosePopup} autoFocus>
//             확인
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// };

// const Container = styled.div`
//   display: flex;
//   //background-color: yellow;
//   //padding-top: HEADER_HEIGHT;
//   height: 100vh;
//   flex-direction: column;
// `;

// export default AiConsultEntryPage;

import VideoCallImage from "@assets/images/videocallImage.png";
import {
  Box,
  Button,
  //Container,
  Stack,
  TextField,
  Typography,
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  Toolbar,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { convert } from "hangul-romanization";
import { Header, HEADER_HEIGHT } from "@components/index";
import avatarSonny from "@assets/images/avatar_sonny.png";
import avatarJennie from "@assets/images/avatar_karina.png";
import { useDispatch, useSelector } from "react-redux";
import { uploadNewSessionRequest } from "@store/ai/aiConsultSlice";
import styled from "styled-components";
// import avatarJungkook from "@assets/images/avatar_jungkook.png";

const AiConsultEntryPage = () => {
  const dispatch = useDispatch();
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [uname, setUname] = useState({
    value: "",
    error: false,
  });
  const [phoneNumber, setPhoneNumber] = useState({
    value: "",
    error: false,
  });
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const handleAvatarClick = (avatar) => {
    setSelectedAvatar((prev) => (prev === avatar ? null : avatar));
  };

  const navigate = useNavigate();

  const onChangeUname = (e) => {
    const value = e.target.value;
    const regex = /^[A-Za-z0-9ㄱ-ㅎㅏ-ㅣ가-힣]+$/;
    const valid = regex.test(value);

    setUname({
      value,
      error: !valid && value !== "",
    });
  };

  const onChangePhoneNumber = (e) => {
    const value = e.target.value;
    const isValid = /^[0-9]{11}$/.test(value);

    setPhoneNumber({
      value,
      error: value !== "" && !isValid,
    });
  };

  const onClickStart = () => {
    let unameToUse = uname.value;

    const containsKorean = /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(uname.value);
    if (containsKorean) {
      unameToUse = convert(uname.value).replace(/\s+/g, "");
    }
    console.log(
      "uname: ",
      unameToUse,
      ", phoneNum: ",
      phoneNumber.value,
      ", selectedAvatar: ",
      selectedAvatar
    );
    const formData = new FormData();

    formData.append("uname", unameToUse);
    formData.append("phoneNumber", phoneNumber.value);
    formData.append("selectedAvatar", selectedAvatar);

    dispatch(uploadNewSessionRequest(formData));

    navigate(
      `/ai-consult/${unameToUse}?phoneNumber=${phoneNumber.value}&selectedAvatar=${selectedAvatar}`
    );
  };

  useEffect(() => {
    const isNameValid = uname.value !== "" && !uname.error;
    const isPhoneValid = phoneNumber.value !== "" && !phoneNumber.error;
    const isAvatarSelected = selectedAvatar !== null;

    setIsButtonEnabled(isNameValid && isPhoneValid && isAvatarSelected);
  }, [uname, phoneNumber, selectedAvatar]);

  return (
    <Container>
      <Header />
      {/* <Toolbar/> */}
      <Box
        flex="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
        //height="100vh"
        //sx={{ paddingTop: { xs: '40px', md: '80px' }, backgroundColor: "#b0e977t1" }}
      >
        <Stack spacing={{ xs: 3, md: 4 }} alignItems="center" width="100%">
          <Box
            width="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <TextField
              required
              error={uname.error}
              value={uname.value}
              helperText={
                uname.error ? "이름은 숫자, 영문, 한글만 가능합니다." : ""
              }
              label="이름을 입력해주세요."
              onChange={onChangeUname}
              inputProps={{}}
              sx={{
                fontSize: { xs: "14px", md: "16px" },
                width: { xs: "70%", sm: "70%", md: "70%" },
                maxWidth: "400px",
                mb: 2,
              }}
            />

            <TextField
              required
              error={phoneNumber.error}
              value={phoneNumber.value}
              helperText={
                phoneNumber.error
                  ? "전화번호는 11자리의 숫자만 입력 가능합니다."
                  : ""
              }
              label="전화번호를 입력해주세요."
              onChange={onChangePhoneNumber}
              inputProps={{
                pattern: "[0-9]{11}",
                maxLength: 11,
                inputMode: "numeric",
              }}
              placeholder="01012345678"
              sx={{
                fontSize: { xs: "14px", md: "16px" },
                width: { xs: "70%", sm: "70%", md: "70%" },
                maxWidth: "400px",
              }}
            />
          </Box>

          <Box display="flex" justifyContent="center" gap={4}>
            {[
              { name: "sonny", src: avatarSonny },
              { name: "karina", src: avatarJennie },
            ].map((avatar) => (
              <Box
                key={avatar.name}
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                <Box
                  component="img"
                  sx={{
                    width: "100%",
                    height: "auto",
                    maxWidth: { xs: "150px", sm: "220px", md: "240px" },
                    cursor: "pointer",
                    border:
                      selectedAvatar === avatar.name
                        ? "5px solid #3399FF"
                        : "none",
                    // borderRadius: "8px",
                    transition: "all 0.3s ease",
                  }}
                  alt={`Avatar ${avatar.name}`}
                  src={avatar.src}
                  onClick={() => handleAvatarClick(avatar.name)}
                />
              </Box>
            ))}
          </Box>

          <Box display="flex" justifyContent="center">
            <Button
              onClick={onClickStart}
              disabled={!isButtonEnabled}
              variant="contained"
              sx={{
                fontFamily: "SUIT Variable",
                backgroundColor: "#1976d2",
                color: "white",
                borderRadius: "25px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s ease-in-out, background-color 0.3s",
                "&:hover": {
                  backgroundColor: "#1565c0",
                  transform: "scale(1.03)",
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

const Container = styled.div`
  display: flex;
  //background-color: yellow;
  //padding-top: HEADER_HEIGHT;
  height: 100vh;
  flex-direction: column;
`;

export default AiConsultEntryPage;
