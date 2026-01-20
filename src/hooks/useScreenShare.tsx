"use client";

import { useCallback } from "react";
import { useAppDispatch } from "@/redux";
import { screenShareAction } from "@/redux/store/screenSharing";

export function useScreenShare() {
  const dispatch = useAppDispatch();

  const startSharing = useCallback(() => {
    dispatch(screenShareAction.startShareRequest());
  }, [dispatch]);

  const stopSharing = useCallback(() => {
    dispatch(screenShareAction.stopShare());
  }, [dispatch]);

  return {
    startSharing,
    stopSharing,
  };
}
