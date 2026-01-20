import { configureStore } from "@reduxjs/toolkit";
import { canvasReducer } from "./store/canvas";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { screenShareReducer } from "./store/screenSharing";

export const store = configureStore({
  reducer: {
    canvas: canvasReducer,
    screenShare: screenShareReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
