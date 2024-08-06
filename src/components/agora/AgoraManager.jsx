import { AgoraTrackProvider } from "@context/agora/agoratrack-context";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import {
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import PropTypes from "prop-types";
import { useEffect } from "react";

const APP_ID = import.meta.env.VITE_AGORA_RTC_APP_KEY;

const AgoraManager = ({ config, children }) => {
  // 로컬 사용자 카메라 트랙
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  // 로컬 사용자 마이크 트랙
  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack();

  // 채널에 입장하는 훅
  useJoin(
    {
      appid: APP_ID,
      uid: config.uid,
      channel: config.cname,
      token: null, // 토큰을 사용하지 않을 경우 null
    },
    true
  );

  useEffect(() => {
    return () => {
      // 채널에서 나갈때 카메라, 마이크 트랙 닫기
      localCameraTrack?.close();
      localMicrophoneTrack?.close();
    };
  }, []);

  // 채널에 연결된 상대방들
  const remoteUsers = useRemoteUsers();

  // 로컬 사용자 비디오, 마이크 상대방에게 전달하기
  usePublish([localMicrophoneTrack, localCameraTrack]);

  // Check if devices are still loading
  const deviceLoading =
    isLoadingMic || isLoadingCam || !localCameraTrack || !localMicrophoneTrack;

  if (deviceLoading) {
    return (
      <Box
        component="div"
        display="flex"
        width="100%"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        p={4}
      >
        <Stack spacing={2}>
          <Box display="flex" justifyContent="center">
            <CircularProgress value={40} />
          </Box>
          <Typography variant="h5" component="h5">
            채널에 입장중입니다...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <AgoraTrackProvider
      localCameraTrack={localCameraTrack}
      localMicrophoneTrack={localMicrophoneTrack}
    >
      <Box display="flex" flexWrap="wrap" width="100%" height="90%">
        {remoteUsers
          .filter((user) => user.hasVideo)
          .map((user) => (
            <Box key={user.uid} width="100%" height="100%">
              <RemoteUser user={user} playVideo playAudio autoPlay={true} />;
            </Box>
          ))}
        <Box
          position="absolute"
          bottom="10%"
          right={0}
          width={{ xs: "35%", lg: "25%" }}
          height={{ xs: "20%", md: "25%", lg: "30%" }}
        >
          <LocalVideoTrack
            track={localCameraTrack}
            play={true}
            autoPlay={true}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "10%",
        }}
      >
        {children}
      </Box>
    </AgoraTrackProvider>
  );
};

AgoraManager.propTypes = {
  config: PropTypes.shape({
    cname: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
  }).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default AgoraManager;
