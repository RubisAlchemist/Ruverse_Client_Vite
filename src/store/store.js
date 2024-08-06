import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import agoraReducer from "./agora/agoraSlice";
import aiConsultReducer from "./ai/aiConsultSlice";
import loggerReducer from "./logger/loggerSlice";

const logger = createLogger({
  predicate: (getState, action) => {
    // 특정 액션 타입을 기반으로 로깅을 제외할 수 있습니다.
    const ignoreActions = ["logger/setStylus", "logger/setTouch"];
    return !ignoreActions.includes(action.type);
  },
});

export const store = configureStore({
  reducer: {
    aiConsult: aiConsultReducer,
    agora: agoraReducer,
    logger: loggerReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
