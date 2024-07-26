import { Box, Button, Modal, Typography } from "@mui/material";
import { closeModal } from "@store/ai/aiConsultSlice";

import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

const UploadInfoModal = () => {
  const open = useSelector((state) => state.aiConsult.modal.open);
  const message = useSelector((state) => state.aiConsult.modal.message);
  const error = useSelector((state) => state.aiConsult.audio.error);

  const dispatch = useDispatch();

  const onClose = () => dispatch(closeModal());

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {message}
        </Typography>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {error !== null && error}
        </Typography>

        <Button onClick={onClose}>모달 닫기</Button>
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

const style = {
  display: "flex",
  flexDirection: "column",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default UploadInfoModal;
