import { AgoraTrackContext } from "@context/agora/agoratrack-context";
import { useContext } from "react";

export const useAgoraTrackContext = () => {
  const context = useContext(AgoraTrackContext);
  if (!context)
    throw new Error("useAgoraContext must be used within an AgoraProvider");
  return context;
};
