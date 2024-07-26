import useDevicePermissions from "@hooks/useDevicePermissions";
import { Check } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const PermissionsPage = () => {
  const { permissions, handlePermissions, isAllPermissionsGranted } =
    useDevicePermissions();

  const navigate = useNavigate();

  const onClick = () => navigate("/ai-consultEntry");

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Stack spacing={4} width="100%">
          <Box textAlign="center">
            <Typography variant="h7" fontWeight={600}>
              RuVerse 이용을 진행하려면 아래 권한들이 필요해요.
            </Typography>
          </Box>
          <List>
            {permissions.map((permission, index) => (
              <Box
                key={permission.key}
                padding={1}
                border={1}
                borderRadius={2}
                borderBottom={index === permissions.length - 1 ? 1 : 0}
                borderColor="#ccc"
              >
                <ListItem
                  secondaryAction={
                    permission.isPermitted ? (
                      <Check />
                    ) : permission.loading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <ListItemButton
                        onClick={() => handlePermissions(permission.key)}
                      >
                        <Typography color="#0ba1ae">권한 설정하기</Typography>
                      </ListItemButton>
                    )
                  }
                >
                  <ListItemIcon>{permission.icon}</ListItemIcon>
                  <ListItemText primary={permission.name} />
                </ListItem>
              </Box>
            ))}
          </List>
          <Box display="flex" justifyContent="center">
            <Button onClick={onClick} disabled={!isAllPermissionsGranted}>
              <Typography>온라인 상담하러 가기</Typography>
            </Button>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};

export default PermissionsPage;
