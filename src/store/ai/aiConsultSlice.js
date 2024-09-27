import { ruverseClient } from "@apis/ruverse";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  audio: {
    defaultSrc: "https://server.snuruverse.com/video/default.mp4",
    greetingsSrc: "https://server.snuruverse.com/video/greetings.webm", // 추가: 인사 비디오 URL
    isGreetingsPlaying: true,
    src: "",
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

export const uploadKlleonRequest = createAsyncThunk(
  "asyncThunk/uploadAudioRequest",
  async (audioForm) => {
    const response = await ruverseClient.post(
      "/counseling/get_klleon_response",
      audioForm,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const data = response.data;

    return data;
  }
);

export const uploadNewSessionRequest = createAsyncThunk(
  "asyncThunk/uploadAudioRequest",
  async (formData) => {
    console.log(formData);
    const response = await ruverseClient.post("/counseling/init", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const data = response.data;
    console.log("response data: ", response);
    return data;
  }
);

export const uploadRequest = createAsyncThunk(
  "asyncThunk/uploadAudioRequest",
  async (audioForm) => {
    console.log(audioForm);
    const response = await ruverseClient.post(
      "/counseling/get_response",
      audioForm,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const data = response.data;
    console.log("response data: ", response);
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
      state.audio.src = initialState.audio.src;
    },
    setAudioSrc: (state, action) => {
      state.audio.src = action.payload;
    },
    // 새로운 reducer 추가
    setGreetingsPlayed: (state) => {
      state.audio.isGreetingsPlaying = false;
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

export const { clearAudioSrc, closeModal, setAudioSrc, setGreetingsPlayed } =
  aiConsultSlice.actions;

export default aiConsultSlice.reducer;
