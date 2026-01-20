import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ScreenShareState {
  isSharing: boolean;
  stream: MediaStream | null;
  error: string | null;
}

const initialState: ScreenShareState = {
  isSharing: false,
  stream: null,
  error: null,
};

const screenShareSlice = createSlice({
  name: "screenShare",
  initialState,
  reducers: {
    startShareRequest(state) {
      state.error = null;
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
      state.stream = null;
    },
    resetError(state) {
      state.error = null;
    },
  },
});

export const { actions: screenShareAction, reducer: screenShareReducer } =
  screenShareSlice;
