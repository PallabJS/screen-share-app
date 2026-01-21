import { useState } from "react";
import {
  Pencil,
  Highlighter,
  Eraser,
  Trash2,
  SquareStop,
  Eye,
  EyeOff,
  LineSquiggle,
  Undo2Icon,
  Redo2Icon,
  Download,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/redux";
import { canvasAction } from "@/redux/store/canvas";
import { useScreenShare } from "@/hooks/useScreenShare";
import { colorUtils } from "@/utility/color";

type CanvasToolsProps = {
  clearCanvas: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
};

export const CanvasTools = (props: CanvasToolsProps) => {
  const { clearCanvas, onUndo, onRedo, onExport } = props;
  const dispatch = useAppDispatch();
  const { stopSharing } = useScreenShare();
  const { annotationVisible, strokeWidth, tool, color } = useAppSelector(
    (state) => state.canvas,
  );

  const [strokeWidthSelectorVisible, setStrokeWidthSelectorVisible] =
    useState(false);

  const handleStopSharing = () => {
    stopSharing();
  };

  return (
    <div className="absolute bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full shadow-lg px-3 py-2  flex gap-2 items-center bg-zinc-900/90 shadow-zinc-900 border border-zinc-700">
      {/* DRAWING TOOLS */}
      <div className="flex justify-center items-center gap-x-2">
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
      </div>

      {/* Color Picker */}
      <label
        title="Stroke color"
        aria-description="Stroke color picker"
        className="relative w-6 h-6 overflow-hidden rounded-full border"
        style={{ borderColor: colorUtils.getContrastMonoColor(color, 0.5) }}
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

      {/* Stroke Width */}
      <div
        className="relative flex items-center justify-center cursor-pointer"
        onClick={() =>
          setStrokeWidthSelectorVisible(!strokeWidthSelectorVisible)
        }
      >
        <div
          className={`absolute w-4 h-4 ${strokeWidthSelectorVisible ? "" : "hidden"}`}
        >
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={strokeWidth}
            onChange={(e) => {
              dispatch(canvasAction.setStrokeWidth(Number(e.target.value)));
            }}
            className="absolute appearance-none h-2 -top-7.5 bg-zinc-600 rounded-full cursor-pointer"
            style={{ accentColor: color }}
          />
        </div>
        {/* Value indicator */}
        <div className="min-w-8 text-zinc-300 font-normal flex items-center justify-center cursor-pointer">
          <div
            className="absolute -z-10 rounded-full self-center"
            style={{
              width: strokeWidth,
              height: strokeWidth,
              backgroundColor: color,
              opacity: 0.5,
            }}
          />
          <LineSquiggle
            size={14}
            color={colorUtils.getContrastMonoColor(color)}
          />
        </div>
      </div>

      <div className="h-8 w-px bg-zinc-500" />

      <div className="flex items-center justify-center gap-x-1">
        {/* Clear / Delete All */}
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

        {/* UNDO Annotations */}
        <button
          title={annotationVisible ? "Disable annotation" : "Enable annotation"}
          onClick={onUndo}
          className={`w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-600/50 cursor-pointer`}
        >
          <Undo2Icon size={15} />
        </button>

        {/* REDO Annotations */}
        <button
          title={annotationVisible ? "Disable annotation" : "Enable annotation"}
          onClick={onRedo}
          className={`w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-600/50 cursor-pointer`}
        >
          <Redo2Icon size={15} />
        </button>

        {/* SHOW/HIDE Annotations */}
        <button
          title={annotationVisible ? "Disable annotation" : "Enable annotation"}
          onClick={() => dispatch(canvasAction.toggleAnnotationVisibility())}
          className={`w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-600/50 cursor-pointer ${annotationVisible ? "" : "bg-zinc-700/50"}`}
        >
          {annotationVisible ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </div>

      {/* DOWNLOAD as Image */}
      <button
        title="Export snapshot"
        onClick={onExport}
        className="p-1.5 rounded-full hover:bg-white/10 transition"
      >
        <Download size={18} />
      </button>

      <div className="h-8 w-px bg-zinc-500" />

      {/* Stop Session */}
      <button
        onClick={handleStopSharing}
        className="flex justify-center items-center p-1.5 rounded-full bg-linear-to-r from-red-900 to-red-600 opacity-80 hover:opacity-90 active:opacity-70 shadow-black hover:shadow-sm cursor-pointer"
      >
        <SquareStop fill="white" size={14} color="white" />
      </button>
    </div>
  );
};
