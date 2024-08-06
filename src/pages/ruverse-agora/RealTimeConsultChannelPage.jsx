import {
  AgoraManager,
  AgoraModal,
  AgoraRecordManager,
  ChannelLeaveButton,
  VirtualBackground,
} from "@components/index";
import { StylusLogger, TouchLogger } from "@components/logger";
import { Box, Typography } from "@mui/material";
import AgoraRTC, { AgoraRTCProvider, useRTCClient } from "agora-rtc-react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

const RealTimeConsultChannelPage = () => {
  const { cname: cnameBase64, uid: uidBase64 } = useParams();

  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );

  const config = useMemo(() => {
    // cname 정규식
    const cnameRegex = /^[a-zA-Z0-9]+$/;
    // uid 정규식
    const uidRegex = /^[0-9]+$/;
    try {
      // cname base64 decode
      const cname = window.atob(cnameBase64);
      // uid base64 decode
      const uid = window.atob(uidBase64);

      // 복호화한 값들이 정규식과 일치하지 않을s 경우 Error
      if (!cnameRegex.test(cname) || !uidRegex.test(uid)) {
        return null;
      }

      return {
        cname,
        uid,
      };
    } catch (err) {
      console.log(err);
      return null;
    }
  }, [cnameBase64, uidBase64]);

  if (config === null) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="100vh"
      >
        <Typography variant="h2">유효하지 않은 채널입니다.</Typography>
      </Box>
    );
  }

  return (
    <StylusLogger>
      <TouchLogger>
        <Box width="100%" height="100dvh">
          <AgoraRTCProvider client={client}>
            <AgoraManager config={config}>
              <Box
                width="100%"
                height="100%"
                display="flex"
                alignItems="center"
                justifyContent="space-around"
                bgcolor="ButtonShadow"
                padding={4}
              >
                <ChannelLeaveButton />

                <AgoraRecordManager>
                  <AgoraModal />
                </AgoraRecordManager>

                <VirtualBackground />
              </Box>
            </AgoraManager>
          </AgoraRTCProvider>
        </Box>
      </TouchLogger>
    </StylusLogger>
  );
};

export default RealTimeConsultChannelPage;
