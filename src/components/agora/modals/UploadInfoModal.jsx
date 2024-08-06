import {
  Box,
  Button,
  CircularProgress,
  Modal,
  Stack,
  Typography,
} from "@mui/material";

import UploadIcon from "@mui/icons-material/Upload";

import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import useRecordBlob from "@hooks/agora-ruverse/useRecordBlob";
import { closeModal } from "@store/agora/agoraSlice";
import { requestS3Upload } from "@store/agora/agoraThunk";
import { useParams } from "react-router-dom";

const UploadInfoModal = () => {
  const { cname, uid } = useParams();
  const videoRecordBlob = useRecordBlob();

  const isLoading = useSelector((state) => state.agora.s3Upload.isLoading);

  const dispatch = useDispatch();

  const handleUpload = () => {
    dispatch(
      requestS3Upload({
        channelInfo: {
          cname: window.atob(cname),
          uid: window.atob(uid),
        },
        videoRecordBlob,
      })
    );
  };

  const onClose = () => dispatch(closeModal());

  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        display="flex"
        flexDirection="column"
        position="absolute"
        top="50%"
        left="50%"
        width={400}
        bgcolor="background.paper"
        border="2px solid #000"
        boxShadow={24}
        p={4}
        sx={{
          transform: "translate(-50%, -50%)",
        }}
      >
        {isLoading ? (
          <>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              녹화 영상 업로드중입니다.
            </Typography>
            <CircularProgress
              style={{ marginTop: "12px", alignSelf: "center" }}
            />
          </>
        ) : (
          <Stack spacing={2}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              녹화 업로드
            </Typography>
            <Typography
              id="modal-modal-title"
              variant="caption"
              component="p"
              color="crimson"
            >
              업로드 완료 후 퇴장합니다.
            </Typography>
            <Button variant="outlined" color="info" onClick={handleUpload}>
              <UploadIcon fontSize="medium" />
            </Button>
          </Stack>
        )}
      </Box>
    </Modal>
  );
};

UploadInfoModal.propTypes = {
  open: PropTypes.bool,
  isError: PropTypes.bool,
  isSuccess: PropTypes.bool,
  message: PropTypes.string,
  onClose: PropTypes.func,
};

export default UploadInfoModal;
