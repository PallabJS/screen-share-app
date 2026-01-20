"use client";

import { useCallback } from "react";
import { useAppDispatch } from "@/redux";
import { screenShareSagaAction } from "@/redux/store/screenSharing/action";

export function useScreenShare() {
  const dispatch = useAppDispatch();

  const startSharing = useCallback(() => {
    dispatch(screenShareSagaAction.startScreenShare());
  }, [dispatch]);

  const stopSharing = useCallback(() => {
    dispatch(screenShareSagaAction.stopScreenShare());
  }, [dispatch]);

  return {
    startSharing,
    stopSharing,
  };
}
