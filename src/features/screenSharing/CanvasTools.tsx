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
  Square,
  Type,
  ArrowUpRight,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/redux";
import { canvasAction, CanvasTool } from "@/redux/store/canvas";
import { useScreenShare } from "@/hooks/useScreenShare";
import { colorUtils } from "@/utility/color";
import { ToolButton } from "./CanvasTools/ToolButton";
import { ToolDivider } from "./CanvasTools/ToolDivider";
import { IconButton } from "./CanvasTools/IconButton";

type CanvasToolsProps = {
  clearCanvas: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
};

export const CanvasTools = ({
  clearCanvas,
  onUndo,
  onRedo,
  onExport,
}: CanvasToolsProps) => {
  const dispatch = useAppDispatch();
  const { stopSharing } = useScreenShare();

  const { annotationVisible, strokeWidth, tool, color } = useAppSelector(
    (state) => state.canvas,
  );

  const [strokeWidthSelectorVisible, setStrokeWidthSelectorVisible] =
    useState(false);

  return (
    <div className="absolute bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full shadow-lg px-3 py-2 flex gap-2 items-center bg-zinc-900/90 border border-zinc-700">
      {/* ----- DRAWING TOOLS ----- */}
      <div className="flex items-center gap-x-1">
        {/* Pen */}
        <ToolButton
          title="Pen"
          active={tool === "pen"}
          onClick={() => dispatch(canvasAction.setTool(CanvasTool.Pen))}
        >
          <Pencil size={16} />
        </ToolButton>

        {/* Highlighter */}
        <ToolButton
          title="Highlighter"
          active={tool === "highlighter"}
          onClick={() => dispatch(canvasAction.setTool(CanvasTool.Highlighter))}
        >
          <Highlighter size={18} strokeWidth={1.5} />
        </ToolButton>

        {/* Eraser */}
        <ToolButton
          title="Eraser"
          active={tool === "eraser"}
          onClick={() => dispatch(canvasAction.setTool(CanvasTool.Eraser))}
        >
          <Eraser size={18} strokeWidth={1.5} />
        </ToolButton>
      </div>

      {/* ----- COLOR PICKER ----- */}
      <label
        title="Stroke color"
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
          onChange={(e) => dispatch(canvasAction.setColor(e.target.value))}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        />
      </label>

      {/* ----- STROKE WIDTH ----- */}
      <div
        className="relative flex items-center cursor-pointer"
        onClick={() =>
          setStrokeWidthSelectorVisible(!strokeWidthSelectorVisible)
        }
      >
        {strokeWidthSelectorVisible && (
          <input
            type="range"
            min={1}
            max={30}
            value={strokeWidth}
            onChange={(e) =>
              dispatch(canvasAction.setStrokeWidth(Number(e.target.value)))
            }
            className="absolute -top-7 h-2 bg-zinc-600 rounded-full"
            style={{ accentColor: color }}
          />
        )}

        <div className="min-w-8 flex justify-center items-center">
          <div
            className="absolute rounded-full"
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

      <ToolDivider />

      {/* ----- SHAPE TOOLS ----- */}
      <div className="flex items-center gap-x-1">
        <ToolButton
          title="Rectangle"
          active={tool === "rectangle"}
          onClick={() => dispatch(canvasAction.setTool(CanvasTool.Rectangle))}
        >
          <Square size={16} />
        </ToolButton>

        <ToolButton
          title="Arrow"
          active={tool === "arrow"}
          onClick={() => dispatch(canvasAction.setTool(CanvasTool.Arrow))}
        >
          <ArrowUpRight size={16} />
        </ToolButton>

        <ToolButton
          title="Text"
          active={tool === "text"}
          onClick={() => dispatch(canvasAction.setTool(CanvasTool.Text))}
        >
          <Type size={16} />
        </ToolButton>
      </div>

      <ToolDivider />

      {/* ----- UNDO / REDO ----- */}
      <IconButton title="Undo" onClick={onUndo}>
        <Undo2Icon size={15} />
      </IconButton>

      <IconButton title="Redo" onClick={onRedo}>
        <Redo2Icon size={15} />
      </IconButton>

      {/* ----- SHOW / HIDE ----- */}
      <IconButton
        title={annotationVisible ? "Hide annotations" : "Show annotations"}
        onClick={() => dispatch(canvasAction.toggleAnnotationVisibility())}
        active={!annotationVisible}
      >
        {annotationVisible ? <Eye size={16} /> : <EyeOff size={16} />}
      </IconButton>

      {/* ----- CLEAR ----- */}
      <IconButton title="Clear annotations" onClick={clearCanvas}>
        <Trash2 size={18} className="text-red-400" />
      </IconButton>

      {/* ----- EXPORT ----- */}
      <IconButton title="Export snapshot" onClick={onExport}>
        <Download size={18} />
      </IconButton>

      <ToolDivider />

      {/* ----- STOP SHARING ----- */}
      <button
        onClick={stopSharing}
        className="p-1.5 rounded-full bg-linear-to-r from-red-900 to-red-600 opacity-80 hover:opacity-90"
      >
        <SquareStop fill="white" size={14} />
      </button>
    </div>
  );
};
