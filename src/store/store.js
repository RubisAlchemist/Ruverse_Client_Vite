import { configureStore } from "@reduxjs/toolkit";
import aiConsultReducer from "./ai/aiConsultSlice";
import logger from "redux-logger";

export const store = configureStore({
  reducer: {
    aiConsult: aiConsultReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
