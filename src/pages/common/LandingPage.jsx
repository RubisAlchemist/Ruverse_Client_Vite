import permissionCheckImage from "@assets/images/permissionCheckImage.png";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const onClickNavigate = () => navigate("/permissions");

  return (
    <Container maxWidth="xs">
      <Box
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Stack spacing={2}>
          <Box textAlign="center">
            <Typography variant="h4" fontWeight={600}>
              환영합니다!
            </Typography>
          </Box>
          <Box
            component="img"
            sx={{
              maxHeight: { xs: 300, md: 360 },
              maxWidth: { xs: 400, md: 420 },
              objectFit: "cover",
            }}
            alt="The house from the offer."
            src={permissionCheckImage}
          />
          <Box display="flex" justifyContent="center">
            <Button onClick={onClickNavigate} variant="contained">
              <Typography color="white">권한 설정 하러가기</Typography>
            </Button>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};

export default LandingPage;
