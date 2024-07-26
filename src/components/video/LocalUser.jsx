import { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";

const LocalUser = () => {
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const getMediaStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(mediaStream);
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    };

    getMediaStream();
  }, []);
  return <VideoPlayer stream={stream} />;
};

export default LocalUser;
