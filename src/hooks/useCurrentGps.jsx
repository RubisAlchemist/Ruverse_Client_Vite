// src/hooks/useCurrentPosition.js

import { setGps } from "@store/logger/loggerSlice";
import { useDispatch } from "react-redux";

const useCurrentGps = () => {
  const dispatch = useDispatch();

  // Geolocation의 `getCurrentPosition` 메소드에 대한 성공 callback 핸들러
  const handleSuccess = (position) => {
    const gpsLogs = {
      timeStamp: new Date().toISOString(),
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      altitude: position.coords.altitude,
    };

    // console.log("useCurrentLocation success", gpsLogs);
    dispatch(setGps(gpsLogs));
  };

  // Geolocation의 `getCurrentPosition` 메소드에 대한 실패 callback 핸들러
  const handleError = (error) => {
    console.log("gps error");
    console.log(error);
  };

  return {
    handleGps: () =>
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {}),
  };
};

export default useCurrentGps;
