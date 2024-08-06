import { AgoraWebRecordManager } from "@components/index";
import { Box, Typography } from "@mui/material";
import AgoraRTC, { AgoraRTCProvider, useRTCClient } from "agora-rtc-react";
import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const AgoraRecordPage = () => {
  const { cname: cnameBase64, uid: uidBase64 } = useParams();

  /**
   * @param {string} local - 녹화 요청을 보낸 사용자의 uid
   */
  const [searchParams] = useSearchParams();

  const [isError, setError] = useState(false);
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
      // localUser uid base64 decode
      const localUid = window.atob(searchParams.get("local"));
      // remoteUser uid base64 decode
      // const remoteUid = window.atob(searchParams.get("remote"));
      console.log(cname);
      console.log(uid);
      console.log(`[LOCAL UID] ${localUid}`);
      // console.log(remoteUid);

      // 복호화한 값들이 정규식과 일치하지 않을 경우 Error
      if (
        !cnameRegex.test(cname) ||
        !uidRegex.test(uid) ||
        !uidRegex.test(localUid)
        // !uidRegex.test(remoteUid)
      ) {
        setError(true);
        return null;
      }

      setError(false);
      return {
        cname,
        uid,
        localUid,
        // remoteUid,
      };
    } catch (err) {
      console.log(err);
      setError(true);
    }
  }, [cnameBase64, searchParams, uidBase64]);

  if (isError) {
    return (
      <Box
        width="100%"
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h2">유효하지 않은 채널입니다.</Typography>
      </Box>
    );
  }

  return (
    <Box width="100%" height="100vh">
      <AgoraRTCProvider client={client}>
        <AgoraWebRecordManager config={config} />
      </AgoraRTCProvider>
    </Box>
  );
};

export default AgoraRecordPage;
