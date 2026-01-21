"use client";

import { useEffect, useRef } from "react";

interface Props {
  elementId?: string;
  stream: MediaStream | null;
}

export function ScreenVideo({ elementId, stream }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      id={elementId}
      ref={videoRef}
      autoPlay
      muted
      playsInline
      className="w-full h-full object-contain bg-black rounded-lg"
    />
  );
}
