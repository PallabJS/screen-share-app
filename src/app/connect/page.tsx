"use client";

import { useAppSelector } from "@/redux";
import { AnnotationCanvas } from "@/features/screenSharing/AnnotationCanvas";
import { ScreenVideo } from "@/features/screenSharing/ScreenVideo";
import { useScreenShare } from "@/hooks/useScreenShare";

export default function ScreenSharing() {
  const { startSharing } = useScreenShare();
  const { isSharing, stream } = useAppSelector((state) => state.screenShare);

  return (
    <main className="h-screen w-screen flex flex-col gap-4">
      {isSharing && (
        <section className="flex-1 relative rounded-lg overflow-hidden bg-transparent">
          <ScreenVideo elementId="video_screen_share" stream={stream} />
          <AnnotationCanvas videoElementId="video_screen_shares" />
        </section>
      )}

      <div
        className={`absolute transition-transform duration-500 ease-in-out ${!isSharing ? "self-center top-1/2" : "bottom-4 right-4"}`}
      >
        {!isSharing && (
          <button
            onClick={startSharing}
            className="px-4 py-2 text-white rounded-md opacity-80 hover:opacity-100 bg-linear-to-r from-blue-800 to-blue-500 transition-opacity duration-300 active:opacity-80 active:transition-none"
          >
            Start Screen Sharing
          </button>
        )}
      </div>
    </main>
  );
}
