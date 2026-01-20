"use client";

import { useCallback, useRef } from "react";
import { useAppDispatch } from "@/redux";
import { screenShareAction } from "@/redux/store/screenSharing";

export function useScreenShare() {
  const dispatch = useAppDispatch();
  const streamRef = useRef<MediaStream | null>(null);

  const stopSharing = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    dispatch(screenShareAction.stopShare());
  }, []);

  const startSharing = useCallback(async () => {
    dispatch(screenShareAction.startShareRequest());

    try {
      if (!navigator.mediaDevices?.getDisplayMedia) {
        throw new Error("Screen sharing is not supported in this browser.");
      }

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          frameRate: { ideal: 60, max: 60 },
        },
        audio: false,
      });

      // Handle browser "Stop sharing" button
      stream.getVideoTracks()[0].addEventListener("ended", () => {
        stopSharing();
      });

      streamRef.current = stream;
      dispatch(screenShareAction.startShareSuccess(stream));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Permission denied";
      dispatch(screenShareAction.startShareFailure(message));
    }
  }, []);

  return {
    startSharing,
    stopSharing,
  };
}
