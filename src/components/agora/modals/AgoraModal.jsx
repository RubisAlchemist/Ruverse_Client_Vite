import { UploadInfoModal } from "@components/index";
import { useSelector } from "react-redux";
import { MODAL_TYPES } from "./ModalTypes";

const MODAL_COMPONENTS = [
  {
    type: MODAL_TYPES.UploadInfoModal,
    component: <UploadInfoModal />,
  },
];

function AgoraModal() {
  // modal type을 string 형태로 받습니다.

  const modalType = useSelector((state) => state.agora.modal.modalType);
  const isOpen = useSelector((state) => state.agora.modal.isOpen);

  if (!isOpen) return;

  const findModal = MODAL_COMPONENTS.find((modal) => {
    return modal.type === modalType;
  });

  const renderModal = () => {
    return findModal.component;
  };
  return renderModal();
}

export default AgoraModal;
