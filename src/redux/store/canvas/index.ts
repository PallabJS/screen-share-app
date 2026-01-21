import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CanvasTool = "pen" | "highlighter" | "eraser";

interface CanvasState {
  annotationVisible: boolean;
  tool: CanvasTool;
  color: string;
  strokeWidth: number;
}

const initialState: CanvasState = {
  annotationVisible: true,
  tool: "pen",
  color: "#ffffff",
  strokeWidth: 2,
};

const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    setTool(state, action: PayloadAction<CanvasTool>) {
      state.tool = action.payload;
    },
    setColor(state, action: PayloadAction<string>) {
      state.color = action.payload;
    },
    setStrokeWidth(state, action: PayloadAction<number>) {
      state.strokeWidth = action.payload;
    },
    toggleAnnotationVisibility(state) {
      state.annotationVisible = !state.annotationVisible;
    },
    reset() {
      return initialState;
    },
  },
});

export const { actions: canvasAction, reducer: canvasReducer } = canvasSlice;
