import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CanvasTool = "pen" | "highlighter" | "eraser";

interface CanvasState {
  enabled: boolean;
  tool: CanvasTool;
  color: string;
  strokeWidth: number;
  opacity: number;
  canUndo: boolean;
  canRedo: boolean;
}

const initialState: CanvasState = {
  enabled: false,
  tool: "pen",
  color: "#ff0000",
  strokeWidth: 2,
  opacity: 1,
  canUndo: false,
  canRedo: false,
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
    setTool(state, action: PayloadAction<CanvasTool>) {
      state.tool = action.payload;

      if (action.payload === "highlighter") {
        state.opacity = 0.3;
      } else {
        state.opacity = 1;
      }
    },
    setColor(state, action: PayloadAction<string>) {
      state.color = action.payload;
    },
    setStrokeWidth(state, action: PayloadAction<number>) {
      state.strokeWidth = action.payload;
    },
    setUndoRedoState(
      state,
      action: PayloadAction<{ canUndo: boolean; canRedo: boolean }>,
    ) {
      state.canUndo = action.payload.canUndo;
      state.canRedo = action.payload.canRedo;
    },
    resetCanvasState() {
      return initialState;
    },
  },
});

export const { actions: canvasAction, reducer: canvasReducer } = canvasSlice;
