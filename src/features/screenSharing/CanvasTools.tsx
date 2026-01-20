import { Pencil, Highlighter, Eraser, Trash2, SquareStop } from "lucide-react";

import { useAppDispatch } from "@/redux";
import { canvasAction, CanvasTool } from "@/redux/store/canvas";
import { useScreenShare } from "@/hooks/useScreenShare";

type CanvasToolsProps = {
  tool: CanvasTool;
  color: string;
  clearCanvas: () => void;
};

export const CanvasTools = (props: CanvasToolsProps) => {
  const { tool, color, clearCanvas } = props;
  const dispatch = useAppDispatch();
  const { stopSharing } = useScreenShare();

  const handleStopSharing = () => {
    stopSharing();
  };

  return (
    <div className="absolute bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full shadow-lg px-3 py-2  flex gap-3 items-center bg-zinc-900/90 shadow-zinc-900 border border-zinc-700">
      {/* Pen */}
      <button
        title="Pen"
        className={`w-8 h-8 rounded-full cursor-pointer justify-center items-center flex
            ${tool === "pen" ? "bg-white/20" : "hover:bg-white/10"}`}
        onClick={() => dispatch(canvasAction.setTool("pen"))}
      >
        <Pencil size={16} />
      </button>

      {/* Highlighter */}
      <button
        title="Highlighter"
        className={`w-8 h-8 rounded-full cursor-pointer justify-center items-center flex
          ${tool === "highlighter" ? "bg-white/20" : "hover:bg-white/10"}`}
        onClick={() => dispatch(canvasAction.setTool("highlighter"))}
      >
        <Highlighter size={20} strokeWidth={1.5} />
      </button>

      {/* Eraser */}
      <button
        title="Eraser"
        className={`w-8 h-8 rounded-full cursor-pointer justify-center items-center flex
          ${tool === "eraser" ? "bg-white/20" : "hover:bg-white/10"}`}
        onClick={() => dispatch(canvasAction.setTool("eraser"))}
      >
        <Eraser size={20} strokeWidth={1.5} />
      </button>

      {/* Color Picker */}
      <label
        title="Stroke color"
        aria-description="Stroke color picker"
        className="relative w-6 h-6 overflow-hidden rounded-full border border-gray-200/50"
      >
        <span
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: color }}
        />
        <input
          type="color"
          value={color}
          title=""
          onChange={(e) => dispatch(canvasAction.setColor(e.target.value))}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        />
      </label>

      {/* Clear */}
      <button
        title="Clear annotations"
        className="p-1.5 rounded-full hover:bg-red-500/20 transition cursor-pointer"
        onClick={clearCanvas}
      >
        <Trash2
          size={20}
          className="text-red-400 cursor-pointer"
          strokeWidth={1}
        />
      </button>

      <button
        onClick={handleStopSharing}
        className="flex justify-center items-center p-1.5 rounded-full bg-linear-to-r from-red-900 to-red-600 opacity-80 hover:opacity-90 active:opacity-70 shadow-black hover:shadow-sm cursor-pointer"
      >
        <SquareStop fill="white" size={14} color="white" />
      </button>
    </div>
  );
};
