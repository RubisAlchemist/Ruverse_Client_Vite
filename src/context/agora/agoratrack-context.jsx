import { createContext } from "react";
import PropTypes from "prop-types";

export const AgoraTrackContext = createContext(null);

export const AgoraTrackProvider = ({
  localCameraTrack,
  localMicrophoneTrack,
  children,
}) => (
  <AgoraTrackContext.Provider
    value={{ localCameraTrack, localMicrophoneTrack, children }}
  >
    {children}
  </AgoraTrackContext.Provider>
);

AgoraTrackProvider.propTypes = {
  localCameraTrack: PropTypes.object,
  localMicrophoneTrack: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
