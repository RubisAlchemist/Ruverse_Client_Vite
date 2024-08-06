import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setStylus } from "../../store/logger/loggerSlice";

const StylusLogger = ({ strokeColor, isEraser, children, ...props }) => {
  const [stylusState, setStylusState] = useState("IDLE");
  const [isPointerDown, setIsPointerDown] = useState(false);
  const containerRef = useRef(null);

  const dispatch = useDispatch();

  const eventTypeMapping = {
    ENTER: ["OFF_SCREEN", 0],
    DOWN: ["ON_SCREEN", 1],
    MOVE: [stylusState, 2],
    UP: ["OFF_SCREEN", 3],
    LEAVE: ["IDLE", 4],
  };

  const handlePointerEvent = (e, eventType, isoDate) => {
    e.stopPropagation();

    setStylusState(eventTypeMapping[eventType][0]);
    setIsPointerDown(
      eventType === "DOWN" ||
        (eventType === "MOVE" && stylusState === "ON_SCREEN")
    );

    const pointerType =
      e.pointerType === "mouse" ? 0 : e.pointerType === "touch" ? 1 : 2;

    const scrollTop = containerRef.current?.scrollTop || 0;

    const eventData = {
      pt: pointerType,
      pi: e.pointerId,
      et: eventTypeMapping[eventType][1],
      ws: stylusState === "IDLE" ? 0 : stylusState === "OFF_SCREEN" ? 1 : 2,
      t: Math.floor(e.timeStamp),
      it: isoDate,
      px: e.pageX,
      py: e.pageY + scrollTop,
      sx: e.screenX,
      sy: e.screenY,
      p: e.pressure,
      tx: e.tiltX,
      ty: e.tiltY,
      h: e.height,
      w: e.width,
      qt: 1,
      ie: isEraser ? 1 : 0,
      c: strokeColor,
    };
    dispatch(setStylus(eventData));
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

  return <div {...eventHandlers}>{children}</div>;
};

export default StylusLogger;
