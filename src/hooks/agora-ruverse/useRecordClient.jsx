import { useState } from "react";

const useRecordClient = () => {
  const [videoRecordBlob, setVideoRecordBlob] = useState(null);

  const saveVideoRecord = (videoBlob) => setVideoRecordBlob(videoBlob);

  return { videoRecordBlob, saveVideoRecord };
};

export default useRecordClient;
