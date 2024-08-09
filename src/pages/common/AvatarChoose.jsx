import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Header } from "@components/index";
import avatarJiho from "@assets/images/avatar_jiho.png";
import avatarJennie from "@assets/images/avatar_jennie.png";
import avatarJungkook from "@assets/images/avatar_jungkook.png";

const HEADER_HEIGHT = "64px";

const AiConsultEntryPage = () => {
  const [uname, setUname] = useState({ value: "", error: false });
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const navigate = useNavigate();

  const onChangeUname = (e) => {
    const value = e.target.value;
    const valid = e.target.validity.valid;
    setUname({ value, error: !valid });
  };

  const onClickStart = () => navigate(`/klleonAvatar`);

  const handleAvatarClick = (avatar) => {
    if (avatar === "jiho") {
      setSelectedAvatar((prev) => (prev === "jiho" ? null : "jiho"));
    } else {
      setOpenPopup(true);
    }
  };

  const handleClosePopup = () => setOpenPopup(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <Container
        maxWidth="md"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingTop: `calc(${HEADER_HEIGHT} + 2vh)`,
          paddingBottom: "2vh",
          boxSizing: "border-box",
          paddingTop: HEADER_HEIGHT, // 헤더 높이만큼 패딩 추가
        }}
      >
        <Stack spacing={{ xs: 3, md: 4 }} alignItems="center">
          <Box sx={{ width: "100%", maxWidth: "500px", mb: { xs: 2, md: 4 } }}>
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
                style: { fontSize: "clamp(14px, 2vw, 18px)" },
              }}
              InputLabelProps={{
                style: { fontSize: "clamp(14px, 2vw, 18px)" },
              }}
              FormHelperTextProps={{
                style: { fontSize: "clamp(10px, 1.5vw, 14px)" },
              }}
            />
          </Box>

          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{ fontSize: "clamp(18px, 2.5vw, 22px)" }}
          >
            누구랑 대화하고 싶으신가요?
          </Typography>

          <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center">
            {[
              { name: "jiho", src: avatarJiho },
              { name: "jennie", src: avatarJennie },
              { name: "jungkook", src: avatarJungkook },
            ].map((avatar) => (
              <Grid item xs={4} sm={4} md={4} key={avatar.name}>
                <Box
                  component="img"
                  sx={{
                    width: "100%",
                    height: "auto",
                    maxWidth: { xs: "120px", sm: "200px", md: "250px" },
                    cursor: "pointer",
                    border:
                      selectedAvatar === avatar.name
                        ? "5px solid #3399FF"
                        : "none",
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                  }}
                  alt={`Avatar ${avatar.name}`}
                  src={avatar.src}
                  onClick={() => handleAvatarClick(avatar.name)}
                />
              </Grid>
            ))}
          </Grid>

          <Button
            onClick={onClickStart}
            disabled={
              uname.value === "" || uname.error || selectedAvatar !== "jiho"
            }
            sx={{
              fontSize: "clamp(14px, 2vw, 20px)",
              padding: "10px 20px",
              minWidth: "200px",
              fontWeight: "bold",
            }}
          >
            상담 시작하기
          </Button>
        </Stack>
      </Container>

      <Dialog open={openPopup} onClose={handleClosePopup}>
        <DialogContent>Coming Soon</DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={handleClosePopup} autoFocus>
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AiConsultEntryPage;
