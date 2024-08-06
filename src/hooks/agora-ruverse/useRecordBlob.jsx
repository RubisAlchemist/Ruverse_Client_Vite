import { RecordContext } from "@context/agora/record-context";
import { useContext } from "react";

const useRecordBlob = () => {
  const { videoRecordBlob } = useContext(RecordContext);
  return videoRecordBlob;
};

export default useRecordBlob;
