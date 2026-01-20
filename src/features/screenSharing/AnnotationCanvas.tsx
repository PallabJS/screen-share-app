"use client";

import { useEffect, useRef, useState } from "react";
import { Pencil, Highlighter, Eraser, Trash2 } from "lucide-react";

type Tool = "pen" | "highlighter" | "eraser";
type Point = { x: number; y: number };

type Stroke = {
  tool: Tool;
  color: string;
  width: number;
  points: Point[];
};

export function AnnotationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const currentStrokeRef = useRef<Stroke | null>(null);

  // Annotation controls (local for now)
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const redraw = () => {
      // Clear full bitmap safely
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      const cssWidth = canvas.clientWidth;
      const cssHeight = canvas.clientHeight;

      strokesRef.current.forEach((stroke) => {
        if (stroke.points.length < 2) return;

        ctx.beginPath();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = stroke.width;
        ctx.strokeStyle = stroke.color;

        ctx.globalAlpha = stroke.tool === "highlighter" ? 0.3 : 1;

        ctx.globalCompositeOperation =
          stroke.tool === "eraser" ? "destination-out" : "source-over";

        stroke.points.forEach((p, i) => {
          const x = p.x * cssWidth;
          const y = p.y * cssHeight;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });

        ctx.stroke();
      });

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const resizeCanvas = () => {
      const rect = parent.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);

      canvas.style.width = "100%";
      canvas.style.height = "100%";

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      redraw();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let drawing = false;

    const getPoint = (e: MouseEvent): Point => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      drawing = true;

      const stroke: Stroke = {
        tool,
        color,
        width: tool === "highlighter" || tool === "eraser" ? 10 : 3,
        points: [getPoint(e)],
      };

      currentStrokeRef.current = stroke;
      strokesRef.current.push(stroke);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!drawing || !currentStrokeRef.current) return;
      currentStrokeRef.current.points.push(getPoint(e));
      redraw();
    };

    const endDrawing = () => {
      drawing = false;
      currentStrokeRef.current = null;
    };

    const onContextMenu = (e: MouseEvent) => e.preventDefault();

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", endDrawing);
    window.addEventListener("mouseup", endDrawing);
    canvas.addEventListener("contextmenu", onContextMenu);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", endDrawing);
      window.removeEventListener("mouseup", endDrawing);
      canvas.removeEventListener("contextmenu", onContextMenu);
    };
  }, [tool, color]);

  const clearCanvas = () => {
    strokesRef.current = [];
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  return (
    <div className="flex w-full h-full">
      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full shadow-lg px-4 py-2 flex gap-4 items-center">
        {/* Pen */}
        <button
          onClick={() => setTool("pen")}
          className={`p-3 rounded-full transition
      ${tool === "pen" ? "bg-gray-100/30" : "hover:bg-gray-200/20"}`}
          title="Pen"
        >
          <Pencil size={20} />
        </button>

        {/* Highlighter */}
        <button
          onClick={() => setTool("highlighter")}
          className={`p-3 rounded-full transition
      ${tool === "highlighter" ? "bg-gray-100/30" : "hover:bg-gray-200/20"}`}
          title="Highlighter"
        >
          <Highlighter size={20} />
        </button>

        {/* Eraser */}
        <button
          onClick={() => setTool("eraser")}
          className={`p-3 rounded-full transition
      ${tool === "eraser" ? "bg-gray-100/30" : "hover:bg-gray-200/20"}`}
          title="Eraser"
        >
          <Eraser size={20} />
        </button>

        {/* Color Picker */}
        <label
          className="relative w-8 h-8 rounded-full cursor-pointer overflow-hidden"
          title="Stroke color"
        >
          {/* Visible circle */}
          <span
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: color }}
          />

          {/* Hidden native input */}
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>

        {/* Clear */}
        <button
          onClick={clearCanvas}
          className="p-3 rounded-full hover:bg-red-500/10 transition"
          title="Clear annotations"
        >
          <Trash2 size={22} className="text-red-400/50" />
        </button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          background: "transparent",
          touchAction: "none",
        }}
      />
    </div>
  );
}
