import { Box } from "@mui/material";
import { RemoteUser, useJoin, useRemoteUsers } from "agora-rtc-react";
import PropTypes from "prop-types";

const APP_ID = import.meta.env.VITE_AGORA_RTC_APP_KEY;

const AgoraWebRecordManager = ({ config }) => {
  const remoteUsers = useRemoteUsers();

  useJoin(
    {
      appid: APP_ID,
      uid: config.uid,
      channel: config.cname,
      token: null,
    },
    true
  );

  return (
    <Box display="flex" flexWrap="wrap" width="100%" height="100%">
      {/* 내 화면 */}
      {remoteUsers
        .filter((user) => user.uid !== config.localUid)
        .map((user) => (
          <Box key={user.uid} width="100%" height="100%">
            <RemoteUser user={user} playVideo playAudio />
          </Box>
        ))}
      {/* 상대방 화면 */}
      {remoteUsers
        .filter((user) => user.uid === config.localUid)
        .filter((user) => user.hasVideo)
        .map((user) => (
          <Box
            key={user.uid}
            position="absolute"
            bottom={0}
            right={0}
            width={{ xs: "35%", lg: "25%" }}
            height={{ xs: "20%", md: "25%", lg: "30%" }}
          >
            <RemoteUser user={user} playVideo playAudio />
          </Box>
        ))}
    </Box>
  );
};

AgoraWebRecordManager.propTypes = {
  config: PropTypes.shape({
    cname: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
    localUid: PropTypes.string.isRequired,
  }).isRequired,
};

export default AgoraWebRecordManager;
