import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ScreenShareState {
  isSharing: boolean;
  stream: MediaStream | null;
  error?: string;
}

const initialState: ScreenShareState = {
  isSharing: false,
  stream: null,
  error: undefined,
};

const screenShareSlice = createSlice({
  name: "screenShare",
  initialState,
  reducers: {
    startShareRequest(state) {
      state.error = undefined;
    },
    startShareSuccess(state, action: PayloadAction<MediaStream>) {
      state.isSharing = true;
      state.stream = action.payload;
    },
    startShareFailure(state, action: PayloadAction<string>) {
      state.isSharing = false;
      state.error = action.payload;
    },
    stopShare(state) {
      state.isSharing = false;
      state.stream?.getTracks().forEach((track) => track.stop());
      state.stream = null;
    },
    resetError(state) {
      state.error = undefined;
    },
  },
});

export const { actions: screenShareAction, reducer: screenShareReducer } =
  screenShareSlice;
