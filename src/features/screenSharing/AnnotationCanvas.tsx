"use client";

import { useCallback, useEffect, useRef } from "react";

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

const getCursor = (tool: CanvasTool) => {
  switch (tool) {
    case "pen":
      return "url('/cursors/pencil.png') 0 32, pointer";
    case "highlighter":
      return "url('/cursors/highlighter.png') 0 32, pointer";
    case "eraser":
      return "url('/cursors/eraser.png') 0 32, pointer";
    default:
      return "default";
  }
};

type AnnotationCanvasProps = {
  videoElementId?: string;
};

export function AnnotationCanvas(props: AnnotationCanvasProps) {
  const { videoElementId } = props;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const currentStrokeRef = useRef<Stroke | null>(null);

  const redoStackRef = useRef<Stroke[]>([]);

  const { annotationVisible, tool, color, strokeWidth } = useAppSelector(
    (state) => state.canvas,
  );

  const clearCanvas = () => {
    strokesRef.current = [];
    redoStackRef.current = [];
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  // CANVAS OPERATIONS
  /* ---------------- Redraw ---------------- */
  const redraw = useCallback(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Clear full bitmap safely (keeps transparency)
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.restore();

    if (!annotationVisible) return;

    const cssWidth = canvasRef.current.clientWidth;
    const cssHeight = canvasRef.current.clientHeight;

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
  }, [annotationVisible]);

  /* ---------------- Resize ---------------- */
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!parent) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const rect = parent.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);

    canvas.style.width = "100%";
    canvas.style.height = "100%";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    redraw();
  }, [redraw]);

  /* ---------------- Undo ---------------- */
  const undo = () => {
    if (strokesRef.current.length === 0) return;
    const stroke = strokesRef.current.pop();
    if (stroke) {
      redoStackRef.current.push(stroke);
      redraw();
    }
  };

  /* ---------------- Redo ---------------- */
  const redo = () => {
    if (redoStackRef.current.length === 0) return;
    const stroke = redoStackRef.current.pop();
    if (stroke) {
      strokesRef.current.push(stroke);
      redraw();
    }
  };

  const exportSnapshot = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // Offscreen canvas
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = width;
    exportCanvas.height = height;

    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    // Draw the video frame
    if (videoElementId) {
      // Find the video element (screen share)
      const video = document.getElementById(
        videoElementId,
      ) as HTMLVideoElement | null;

      // 1️⃣ Draw video frame (if exists)
      if (video && video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, width, height);
      } else {
        // Optional: white background fallback
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
      }
    }

    // 2️⃣ Draw annotation canvas on top
    ctx.drawImage(canvas, 0, 0, width, height);

    // 3️⃣ Export
    exportCanvas.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `session-${Date.now()}.png`;
      a.click();

      URL.revokeObjectURL(url);
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

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
      return tool === "eraser" ? strokeWidth * 2 : strokeWidth;
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;

      drawing = true;

      redoStackRef.current = [];

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
  }, [annotationVisible, tool, color, strokeWidth, resizeCanvas, redraw]);

  return (
    <div className="flex w-full h-full">
      {/* Controls */}
      <CanvasTools
        onUndo={undo}
        onRedo={redo}
        clearCanvas={clearCanvas}
        onExport={exportSnapshot}
      />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full pointer-events-auto`}
        style={{
          background: "transparent",
          touchAction: "none",
          cursor: getCursor(tool),
        }}
      />
    </div>
  );
}
