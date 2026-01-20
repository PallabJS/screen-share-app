"use client";

import { useEffect, useRef } from "react";

import { useAppSelector } from "@/redux";
import { CanvasTool } from "@/redux/store/canvas";
import { CanvasTools } from "./CanvasTools";

type Point = { x: number; y: number };

type Stroke = {
  tool: CanvasTool;
  color: string;
  width: number;
  points: Point[];
};

export function AnnotationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const currentStrokeRef = useRef<Stroke | null>(null);

  const { enabled, tool, color } = useAppSelector((state) => state.canvas);

  const clearCanvas = () => {
    strokesRef.current = [];
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    /* ---------------- Redraw ---------------- */

    const redraw = () => {
      // Clear full bitmap safely (keeps transparency)
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

    /* ---------------- Resize ---------------- */

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

    /* ---------------- Drawing ---------------- */

    let drawing = false;

    const getPoint = (e: MouseEvent): Point => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };

    const getStrokeWidth = (tool: CanvasTool) => {
      switch (tool) {
        case "pen":
          return 3;
        case "highlighter":
          return 10;
        case "eraser":
          return 24;
        default:
          return 3;
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      if (!enabled) return;
      if (e.button !== 0) return;

      drawing = true;

      const stroke: Stroke = {
        tool,
        color,
        width: getStrokeWidth(tool),
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
  }, [enabled, tool, color]);

  return (
    <div className="flex w-full h-full">
      {/* Controls */}
      <CanvasTools tool={tool} color={color} clearCanvas={clearCanvas} />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full ${
          enabled ? "pointer-events-auto" : "pointer-events-none"
        }`}
        style={{
          background: "transparent",
          touchAction: "none",
        }}
      />
    </div>
  );
}
