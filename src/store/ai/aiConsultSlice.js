import { ruverseClient } from "@apis/ruverse";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import format from "pretty-format";

const initialState = {
  audio: {
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
        responseType: "blob",
      }
    );
    const data = response.data;
    console.log(format(data));
    return data;
  }
);

export const aiConsultSlice = createSlice({
  name: "aiConsultSlice",
  initialState,
  reducers: {
    closeModal: (state) => {
      state.modal = initialState.modal;
      state.audio = initialState.audio;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(uploadRequest.pending, (state) => {
      state.audio.upload.isLoading = true;
    });
    builder.addCase(uploadRequest.fulfilled, (state) => {
      state.audio.upload.isSuccess = true;
      state.audio.upload.isLoading = false;
      state.audio.upload.isError = false;
      state.audio.upload.error = null;

      state.audio.current += 1;

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

export const { closeModal } = aiConsultSlice.actions;

export default aiConsultSlice.reducer;
