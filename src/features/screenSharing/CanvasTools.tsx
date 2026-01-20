import React from "react";
import { Pencil, Highlighter, Eraser, Trash2 } from "lucide-react";

import { useAppDispatch } from "@/redux";
import { canvasAction, CanvasTool } from "@/redux/store/canvas";

type CanvasToolsProps = {
  tool: CanvasTool;
  color: string;
  clearCanvas: () => void;
};

export const CanvasTools = (props: CanvasToolsProps) => {
  const { tool, color, clearCanvas } = props;
  const dispatch = useAppDispatch();

  return (
    <div className="absolute bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full shadow-lg px-2 py-1  flex gap-2 items-center bg-zinc-900/90">
      {/* Pen */}
      <button
        onClick={() => dispatch(canvasAction.setTool("pen"))}
        className={`p-2 rounded-full transition
            ${tool === "pen" ? "bg-white/20" : "hover:bg-white/10"}`}
        title="Pen"
      >
        <Pencil size={20} />
      </button>

      {/* Highlighter */}
      <button
        onClick={() => dispatch(canvasAction.setTool("highlighter"))}
        className={`p-2 rounded-full transition
            ${tool === "highlighter" ? "bg-white/20" : "hover:bg-white/10"}`}
        title="Highlighter"
      >
        <Highlighter size={20} />
      </button>

      {/* Eraser */}
      <button
        onClick={() => dispatch(canvasAction.setTool("eraser"))}
        className={`p-2 rounded-full transition
            ${tool === "eraser" ? "bg-white/20" : "hover:bg-white/10"}`}
        title="Eraser"
      >
        <Eraser size={20} />
      </button>

      {/* Color Picker */}
      <label
        className="relative w-6 h-6 rounded-full cursor-pointer overflow-hidden"
        title="Stroke color"
      >
        <span
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: color }}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => dispatch(canvasAction.setColor(e.target.value))}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </label>

      {/* Clear */}
      <button
        onClick={clearCanvas}
        className="p-2 rounded-full hover:bg-red-500/20 transition"
        title="Clear annotations"
      >
        <Trash2 size={22} className="text-red-400" />
      </button>
    </div>
  );
};
