import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setGps, setGpsRef } from "../../store/logger/loggerSlice";

const options = {
  enableHighAccuracy: true,
  maximumAge: 5000,
  // timeout: 5000,
};

const GpsLogger = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const startWatchingPosition = () => {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const gpsLogs = {
            timeStamp: new Date().toISOString(),
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude,
          };
          console.log("[watch]");
          console.log(position);

          dispatch(setGps(gpsLogs));
        },
        (err) => console.warn(err),
        options
      );
      dispatch(setGpsRef(watchId));
    };
    startWatchingPosition();
  }, []);
  return null;
};

export default GpsLogger;
