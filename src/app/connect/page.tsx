"use client";

import { AnnotationCanvas } from "@/features/screenSharing/AnnotationCanvas";
import { ScreenVideo } from "@/features/screenSharing/ScreenVideo";
import { useScreenShare } from "@/hooks/useScreenShare";
import { useAppSelector } from "@/redux";

export default function ScreenSharing() {
  const { startSharing, stopSharing } = useScreenShare();
  const { isSharing, stream, error } = useAppSelector(
    (state) => state.screenShare,
  );

  return (
    <main className="h-screen w-screen flex flex-col gap-4">
      <header className="flex items-center gap-4">
        {!isSharing ? (
          <button
            onClick={startSharing}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Start Screen Share
          </button>
        ) : (
          <button
            onClick={stopSharing}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Stop Screen Share
          </button>
        )}

        {error && <span className="text-red-500 text-sm">{error}</span>}
      </header>

      <div className="flex-1 absolute w-full h-screen">
        <AnnotationCanvas />
      </div>

      {/* <section className="flex-1 relative border rounded-lg overflow-hidden bg-transparent">
        {isSharing && (
          <>
            <ScreenVideo stream={stream} />
            <AnnotationCanvas />
          </>
        )}
        {!isSharing && (
          <div className="h-full flex items-center justify-center text-gray-500">
            No screen being shared
          </div>
        )}
      </section> */}
    </main>
  );
}
