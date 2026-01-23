"use client";

import { useAppSelector } from "@/redux";
import { AnnotationCanvas } from "@/features/screenSharing/AnnotationCanvas";
import { ScreenVideo } from "@/features/screenSharing/ScreenVideo";
import { useScreenShare } from "@/hooks/useScreenShare";

export default function ScreenSharing() {
  const { startSharing } = useScreenShare();
  const { isSharing, stream } = useAppSelector((state) => state.screenShare);

  return (
    <main className="h-screen w-screen relative bg-zinc-950 text-white overflow-hidden">
      {/* -------- Active Session -------- */}
      {isSharing && (
        <section className="absolute inset-0">
          <AnnotationCanvas videoElementId="video_screen_share" />
          <ScreenVideo elementId="video_screen_share" stream={stream} />
        </section>
      )}

      {/* -------- Pre-Session State -------- */}
      {!isSharing && (
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="max-w-lg text-center space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight">
              Start Screen Sharing
            </h2>

            <p className="text-zinc-400 leading-relaxed">
              Share your screen and annotate it in real time using drawing
              tools, shapes, and highlights. No backend. No collaboration.
              Everything runs locally in your browser.
            </p>

            <button
              onClick={startSharing}
              className="inline-flex items-center justify-center rounded-lg bg-linear-to-r from-blue-700 to-blue-500 px-6 py-3 font-medium hover:opacity-90 active:opacity-80 transition"
            >
              Start Screen Sharing
            </button>

            <p className="text-xs text-zinc-500">
              You will be asked to select a screen or window to share
            </p>
          </div>
        </div>
      )}

      {/* -------- Floating Entry Button (Animated) -------- */}
      <div
        className={`absolute transition-all duration-500 ease-in-out ${
          !isSharing
            ? "opacity-0 scale-95 pointer-events-none"
            : "bottom-4 right-4 opacity-100 scale-100"
        }`}
      >
        {!isSharing && null}
      </div>
    </main>
  );
}
