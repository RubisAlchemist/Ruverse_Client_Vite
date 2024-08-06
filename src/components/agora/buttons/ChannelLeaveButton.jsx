import { Button, Typography } from "@mui/material";
import { resetLogger } from "@store/logger/loggerSlice";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ChannelLeaveButton = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  // 녹화 업로드 성공한 경우 나가기 버튼 활성화
  const isSuccessUpload = useSelector(
    (state) => state.agora.s3Upload.isSuccess
  );

  /**
   * 상담 끝내기
   * 로거, 업로드 스토어 초기화
   */
  const handleLeave = () => {
    // webgazer.end();

    dispatch(resetLogger());
    // dispatch(resetUpload());
    navigate("/consultEntry", { replace: true });
  };

  return (
    <Button
      onClick={handleLeave}
      color="info"
      disabled={!isSuccessUpload}
      width={{ xs: "80px", md: "100px", lg: "120px" }}
      height={{ xs: "30px", md: "40px", lg: "50px" }}
    >
      <Typography fontSize={{ xs: "12px", md: "16px", lg: "18px" }}>
        상담 끝내기
      </Typography>
    </Button>
  );
};

export default ChannelLeaveButton;
