import { Button, CircularProgress, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

const StartRecordingButton = ({ onClick }) => {
  const isLoading = useSelector((state) => state.agora.startRecord.isLoading);

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Button variant="outlined" color="error" onClick={onClick}>
      <Typography fontSize={{ xs: "12px", md: "16px", lg: "18px" }}>
        녹화 시작
      </Typography>
    </Button>
  );
};

StartRecordingButton.propTypes = {
  onClick: PropTypes.func,
};

export default StartRecordingButton;
