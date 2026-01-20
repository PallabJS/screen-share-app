"use client";
import { SquareStop } from "lucide-react";

import { AnnotationCanvas } from "@/features/screenSharing/AnnotationCanvas";
import { ScreenVideo } from "@/features/screenSharing/ScreenVideo";
import { useScreenShare } from "@/hooks/useScreenShare";
import { useAppSelector } from "@/redux";

export default function ScreenSharing() {
  const { startSharing, stopSharing } = useScreenShare();
  const { isSharing, stream } = useAppSelector((state) => state.screenShare);

  return (
    <main className="h-screen w-screen flex flex-col gap-4">
      {isSharing && (
        <section className="flex-1 relative rounded-lg overflow-hidden bg-transparent">
          <ScreenVideo stream={stream} />
          <AnnotationCanvas />
        </section>
      )}

      <div
        className={`absolute transition-transform duration-500 ease-in-out ${!isSharing ? "self-center top-1/2" : "bottom-4 right-4"}`}
      >
        {isSharing ? (
          <button
            onClick={stopSharing}
            className="group flex items-center gap-2 px-3 py-3 rounded-full text-white bg-linear-to-r from-red-800 to-red-500 opacity-80    hover:opacity-100 transition-all duration-300 ease-in-out shadow-black shadow-inner"
          >
            <SquareStop fill="white" size={20} />
          </button>
        ) : (
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
