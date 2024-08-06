import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setTouch } from "../../store/logger/loggerSlice";

const TouchLogger = ({ children }) => {
  const [stylusState, setStylusState] = useState("IDLE");
  const [lastY, setLastY] = useState(0);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [nextScrollTop, setNextScrollTop] = useState(null);
  const myRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (nextScrollTop === null) return;
    myRef.current.scrollTop = nextScrollTop;
    setNextScrollTop(null);
    requestAnimationFrame(() => {
      if (myRef.current) myRef.current.scrollTop = nextScrollTop;
    });
  }, [myRef, nextScrollTop]);

  const eventTypeMapping = {
    ENTER: ["OFF_SCREEN", 0],
    DOWN: ["ON_SCREEN", 1],
    MOVE: [stylusState, 2],
    UP: ["OFF_SCREEN", 3],
    LEAVE: ["IDLE", 4],
  };

  const quizTypeMapping = {
    OX: 0,
    STYLUS: 1,
    MULTIPLE: 2,
    SHORT: 3,
    LONG: 4,
  };

  const handlePointerEvent = (e, eventType, isoDate) => {
    // Prevent pointer event inside the keyboard layout; they are logged in keyboard-logger.
    const keyboardDefault =
      "react-simple-keyboard simple-keyboard hg-theme-default hg-layout-default";
    const keyboardShift =
      "react-simple-keyboard simple-keyboard hg-theme-default hg-layout-shift";
    if (
      e.target.className === keyboardDefault ||
      e.target.className === keyboardShift ||
      e.target.id === "react-sketch-canvas-student__canvas-background"
    ) {
      return;
    }

    setStylusState(eventTypeMapping[eventType][0]);
    setIsPointerDown(
      eventType === "DOWN" ||
        (eventType === "MOVE" && stylusState === "ON_SCREEN")
    );
    if (eventType === "DOWN") {
      setLastY(e.clientY);
    }
    if (eventType === "MOVE" && isPointerDown) {
      const deltaY = lastY - e.clientY;
      setNextScrollTop(myRef.current.scrollTop + deltaY);
      setLastY(e.clientY);
    }

    const pointerType =
      e.pointerType === "mouse" ? 0 : e.pointerType === "touch" ? 1 : 2;
    // const height = deviceType === 'iOS' ? e.height / 10 : e.height;
    // const width = deviceType === 'iOS' ? e.width / 10 : e.width;
    const height = e.height;
    const width = e.width;

    const eventData = {
      pt: pointerType,
      pi: e.pointerId,
      et: eventTypeMapping[eventType][1],
      ws: stylusState === "IDLE" ? 0 : stylusState === "OFF_SCREEN" ? 1 : 2,
      t: Math.floor(e.timeStamp),
      it: isoDate,
      px: e.pageX,
      py: e.pageY + myRef.current.scrollTop,
      sx: e.screenX,
      sy: e.screenY,
      p: e.pressure,
      tx: e.tiltX,
      ty: e.tiltY,
      h: height,
      w: width,
    };
    // console.log("setTouchData", eventData)

    // if (quizSessionType === 'QUIZ') {
    dispatch(setTouch(eventData));
    // setTouchData([eventData]);
    // } else {
    //   setTouchData((prevTouchData) => [...prevTouchData, eventData]);
    // }
  };

  const eventHandlers = ["Enter", "Down", "Move", "Up", "Leave"].reduce(
    (handlers, eventType) => {
      handlers["onPointer" + eventType] = (e) => {
        const isoDate = new Date().toISOString();
        handlePointerEvent(e, eventType.toUpperCase(), isoDate);
      };
      return handlers;
    },
    {}
  );

  return (
    <div ref={myRef} {...eventHandlers}>
      {children}
    </div>
  );
};

TouchLogger.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default TouchLogger;
