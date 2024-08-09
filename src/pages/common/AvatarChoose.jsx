import avatarJiho from "@assets/images/avatar_jiho.png";
import avatarJennie from "@assets/images/avatar_jennie.png";
import avatarJungkook from "@assets/images/avatar_jungkook.png";
import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@components/index";

const AiConsultEntryPage = () => {
  const [uname, setUname] = useState({
    value: "",
    error: false,
  });

  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const navigate = useNavigate();

  const onClickLogo = () => navigate("/");

  const onChangeUname = (e) => {
    const value = e.target.value;
    const valid = e.target.validity.valid;

    setUname({
      value,
      error: !valid,
    });
  };

  const onClickStart = () => navigate(`/klleonAvatar`);

  const handleAvatarClick = (avatar) => {
    if (avatar === "jiho") {
      setSelectedAvatar((prev) => (prev === "jiho" ? null : "jiho"));
    } else {
      setOpenPopup(true);
    }
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  return (
    <Container maxWidth="md">
      <Header />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="90vh"
      >
        <Stack spacing={4} alignItems="center">
          <Box
            sx={{
              width: { xs: "100%", md: "500px" },
              mb: 12, // 아래쪽 마진을 8에서 12로 증가
            }}
          >
            <TextField
              fullWidth
              required
              error={uname.error}
              value={uname.value}
              helperText={
                uname.error ? "유저 이름은 숫자, 영문만 가능합니다." : ""
              }
              label="이름을 영어로 입력해주세요"
              onChange={onChangeUname}
              inputProps={{
                pattern: "[A-Za-z0-9]+",
                style: { fontSize: "1.2rem" },
              }}
              InputLabelProps={{
                style: { fontSize: "1.2rem" },
              }}
              FormHelperTextProps={{
                style: { fontSize: "1rem" },
              }}
            />
          </Box>

          <Typography variant="h5" align="center" gutterBottom>
            누구랑 대화하고 싶으신가요?
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            <Grid item>
              <Box
                component="img"
                sx={{
                  maxHeight:
                    selectedAvatar === "jiho"
                      ? { xs: 340, md: 400 } // 크기 증가
                      : { xs: 320, md: 380 }, // 크기 증가
                  maxWidth:
                    selectedAvatar === "jiho"
                      ? { xs: 340, md: 400 } // 크기 증가
                      : { xs: 320, md: 380 }, // 크기 증가
                  cursor: "pointer",
                  border:
                    selectedAvatar === "jiho" ? "5px solid #3399FF" : "none",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                }}
                alt="Avatar Jiho"
                src={avatarJiho}
                onClick={() => handleAvatarClick("jiho")}
              />
            </Grid>
            <Grid item>
              <Box
                component="img"
                sx={{
                  maxHeight: { xs: 320, md: 380 }, // 크기 증가
                  maxWidth: { xs: 320, md: 380 }, // 크기 증가
                  cursor: "pointer",
                }}
                alt="Avatar Jennie"
                src={avatarJennie}
                onClick={() => handleAvatarClick("jennie")}
              />
            </Grid>
            <Grid item>
              <Box
                component="img"
                sx={{
                  maxHeight: { xs: 320, md: 380 }, // 크기 증가
                  maxWidth: { xs: 320, md: 380 }, // 크기 증가
                  cursor: "pointer",
                }}
                alt="Avatar Jungkook"
                src={avatarJungkook}
                onClick={() => handleAvatarClick("jungkook")}
              />
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="center">
            <Button
              onClick={onClickStart}
              disabled={
                uname.value === "" || uname.error || selectedAvatar !== "jiho"
              }
            >
              <Typography
                sx={{
                  fontSize: "1.5rem",
                  padding: "15px 30px",
                  minWidth: "250px",
                  fontWeight: "bold",
                }}
              >
                상담 시작하기
              </Typography>
            </Button>
          </Box>
        </Stack>
      </Box>

      {/* Popup for the "서비스 준비중입니다" message */}
      <Dialog open={openPopup} onClose={handleClosePopup}>
        <DialogContent>Comming Soon</DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={handleClosePopup} autoFocus>
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AiConsultEntryPage;
