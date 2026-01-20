"use client";

import { useEffect, useRef } from "react";

interface Props {
  stream: MediaStream | null;
}

export function ScreenVideo({ stream }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      className="w-full h-full object-contain bg-black rounded-lg"
    />
  );
}
