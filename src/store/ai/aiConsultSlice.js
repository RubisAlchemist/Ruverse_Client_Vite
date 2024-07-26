import { ruverseClient } from "@apis/ruverse";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  audio: {
    src: "https://ruverse.snu.ac.kr/video/Integrated.mp4",
    upload: {
      error: null,
      isError: false,
      isSuccess: false,
      isLoading: false,
    },
    current: 1,
  },
  modal: {
    open: false,
    modalType: "",
    message: null,
  },
};

export const uploadRequest = createAsyncThunk(
  "asyncThunk/uploadAudioRequest",
  async (audioForm) => {
    const response = await ruverseClient.post(
      "/counseling/get_response",
      audioForm,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Content-Type을 반드시 이렇게 하여야 한다.
        },
      }
    );
    const data = response.data;

    return data;
  }
);

export const aiConsultSlice = createSlice({
  name: "aiConsultSlice",
  initialState,
  reducers: {
    closeModal: (state) => {
      state.modal = initialState.modal;
      state.audio.upload = initialState.audio.upload;
    },
    clearAudioSrc: (state) => {
      state.audio.src = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(uploadRequest.pending, (state) => {
      state.audio.upload.isLoading = true;
    });
    builder.addCase(uploadRequest.fulfilled, (state, action) => {
      state.audio.upload.isSuccess = true;
      state.audio.upload.isLoading = false;
      state.audio.upload.isError = false;
      state.audio.upload.error = null;

      state.audio.current += 1;
      console.log(`uploadRequest result = ${action.payload}`);
      state.audio.src = action.payload;

      state.modal.open = true;
      state.modal.message = "요청 성공";
    });
    builder.addCase(uploadRequest.rejected, (state, action) => {
      state.audio.upload.isSuccess = false;
      state.audio.upload.isLoading = false;
      state.audio.upload.isError = true;
      state.audio.upload.error = action.error.message;

      state.modal.message = "요청 실패";
      state.modal.open = true;
    });
  },
});

export const { clearAudioSrc, closeModal } = aiConsultSlice.actions;

export default aiConsultSlice.reducer;
