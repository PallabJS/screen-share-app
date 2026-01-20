import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Tool = "pen" | "highlighter" | "eraser";

interface CanvasState {
  enabled: boolean;
  tool: Tool;
  color: string;
}

const initialState: CanvasState = {
  enabled: true,
  tool: "pen",
  color: "#ffffff",
};

const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    toggleCanvas(state) {
      state.enabled = !state.enabled;
    },
    setCanvasEnabled(state, action: PayloadAction<boolean>) {
      state.enabled = action.payload;
    },
    setTool(state, action: PayloadAction<Tool>) {
      state.tool = action.payload;
    },
    setColor(state, action: PayloadAction<string>) {
      state.color = action.payload;
    },
  },
});

export const { actions: canvasAction, reducer: canvasReducer } = canvasSlice;
