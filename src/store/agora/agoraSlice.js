import { createSlice } from "@reduxjs/toolkit";
import {
  requestAgoraRecord,
  requestAgoraRecordStop,
  requestS3Upload,
} from "./agoraThunk";

const initialState = {
  resourceId: null,
  sid: null,
  startRecord: {
    error: null,
    isError: false,
    isLoading: false,
    isSuccess: false,
  },
  stopRecord: {
    error: null,
    isError: false,
    isLoading: false,
    isSuccess: false,
  },

  s3Upload: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
  },

  modal: {
    modalType: "",
    isOpen: false,
  },
};

export const agoraSlice = createSlice({
  name: "agora",
  initialState,
  reducers: {
    openModal: (state, actions) => {
      const { modalType } = actions.payload;
      state.modal.modalType = modalType;
      state.modal.isOpen = true;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
    resetAgoraSlice: (state) => {
      state.resourceId = null;
      state.sid = null;
      state.startRecord = initialState.startRecord;
      state.stopRecord = initialState.stopRecord;
    },
  },
  extraReducers: (builder) => {
    // 아고라 녹화 요청
    builder.addCase(requestAgoraRecord.pending, (state) => {
      state.startRecord.isLoading = true;
    });
    builder.addCase(requestAgoraRecord.fulfilled, (state, action) => {
      state.startRecord.isLoading = false;

      state.resourceId = action.payload.resourceId;
      state.sid = action.payload.sid;

      state.startRecord.isSuccess = true;
      state.startRecord.isError = false;
    });
    builder.addCase(requestAgoraRecord.rejected, (state, action) => {
      state.startRecord.isLoading = false;
      state.startRecord.isSuccess = false;
      state.startRecord.isError = true;
      state.startRecord.error = action.error.message;
    });
    // 아고라 녹화 종료 요청
    builder.addCase(requestAgoraRecordStop.pending, (state) => {
      state.stopRecord.isLoading = false;
    });
    builder.addCase(requestAgoraRecordStop.fulfilled, (state) => {
      state.stopRecord.isLoading = false;
    });
    builder.addCase(requestAgoraRecordStop.rejected, (state, action) => {
      state.stopRecord.isLoading = false;
      state.stopRecord.isSuccess = false;
      state.stopRecord.isError = false;
      state.stopRecord.error = action.error.message;
    });

    // aws s3 upload
    builder.addCase(requestS3Upload.pending, (state) => {
      state.s3Upload.isLoading = true;
    });
    builder.addCase(requestS3Upload.fulfilled, (state) => {
      state.s3Upload.isLoading = false;
      state.s3Upload.isSuccess = true;
      state.s3Upload.isError = false;
      state.s3Upload.error = null;

      state.modal = initialState.modal;
    });
    builder.addCase(requestS3Upload.rejected, (state, action) => {
      state.s3Upload.isLoading = false;
      state.s3Upload.isSuccess = false;
      state.s3Upload.isError = true;
      state.s3Upload.error = action.error.message;
    });
  },
});

// Action creators are generated for each case reducer function
export const { openModal, closeModal, resetAgoraSlice } = agoraSlice.actions;

export default agoraSlice.reducer;
