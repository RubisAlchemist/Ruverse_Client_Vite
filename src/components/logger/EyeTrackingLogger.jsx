import { useEffect } from "react";
import { useDispatch } from "react-redux";
import webgazer from "webgazer";

import PropTypes from "prop-types";
import { setEyetracking } from "@store/logger/loggerSlice";

const licenseKey = import.meta.env.VITE_EYETRACKING_LICENSE_KEY;

const EyetrackingLogger = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    async function initGaze() {
      console.log("INIT GAZE");
      try {
        await webgazer
          .setGazeListener((data, elapsedTime) => {
            console.log("GazeListener");
            console.log(data);
            if (data) {
              // 데이터가 있고, 컴포넌트가 마운트 상태인지 확인합니다.
              let isoDate = new Date().toISOString();
              console.log(data);
              dispatch(
                setEyetracking({ x: data.x, y: data.y, timestamp: isoDate })
              );
              // console.log(`Gaze Position - X: ${data.x}, Y: ${data.y}`);
            }
          })
          .showVideoPreview(false) // 이 부분을 추가하세요
          .showFaceOverlay(false) // 이 부분을 추가하세요
          .showPredictionPoints(false)
          .showFaceFeedbackBox(false); // 이 부분을 추가하세요
      } catch (err) {
        console.log("ERROR Init webgazer");
        console.log(err);
      }
    }

    initGaze();
  }, []);

  return <>{children}</>;
};

EyetrackingLogger.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default EyetrackingLogger;
