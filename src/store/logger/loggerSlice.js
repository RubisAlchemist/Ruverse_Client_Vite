import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  gps: [],
  touch: [],
  accelGyro: [],
  stylus: [],
  eyetracking: [],
};

export const loggerSlice = createSlice({
  name: "logger",
  initialState,
  reducers: {
    setGps: (state, action) => {
      const curGps = state.gps;
      const newGps = action.payload;
      const exists = curGps.some((item) => {
        return (
          item.latitude === newGps.latitude &&
          item.longitude === newGps.longitude &&
          item.altitude === newGps.altitude
        );
      });

      if (!exists) {
        curGps.push(newGps);
      }
    },
    setGpsRef: (state, action) => {
      state.gps.currentRef = action.payload;
    },
    setTouch: (state, action) => {
      state.touch.push(action.payload);
    },
    setAccelGyro: (state, action) => {
      state.accelGyro.push(action.payload);
    },
    setStylus: (state, action) => {
      state.stylus.push(action.payload);
    },
    setEyetracking: (state, action) => {
      state.eyetracking.push(action.payload);
    },

    resetLogger: (state) => {
      state.gps = initialState.gps;
      state.touch = initialState.touch;
      state.accelGyro = initialState.accelGyro;
      state.stylus = initialState.accelGyro;
      state.eyetracking = initialState.eyetracking;
    },
  },
});

export const {
  setGps,
  setGpsRef,
  setTouch,
  setKeyboard,
  setAccelGyro,
  setStylus,
  setEyetracking,
  resetLogger,
} = loggerSlice.actions;

export default loggerSlice.reducer;
