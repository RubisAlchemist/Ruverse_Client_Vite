import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

const VideoPlayer = ({ stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div style={styles.container}>
      <video ref={videoRef} style={styles.video} autoPlay muted />
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    height: "100%",
    position: "relative",
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
};

VideoPlayer.propTypes = {
  stream: PropTypes.object || null,
};

export default VideoPlayer;
