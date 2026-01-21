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
  text?: string;
};

const toolCursor: Record<CanvasTool, string> = {
  pen: "url('/cursors/pencil.png') 0 32, pointer",
  highlighter: "url('/cursors/highlighter.png') 0 32, pointer",
  eraser: "url('/cursors/eraser.png') 0 32, pointer",
  rectangle: "crosshair",
  arrow: "crosshair",
  text: "text",
};

type AnnotationCanvasProps = {
  videoElementId?: string;
};

export function AnnotationCanvas({ videoElementId }: AnnotationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const strokesRef = useRef<Stroke[]>([]);
  const redoStackRef = useRef<Stroke[]>([]);
  const currentStrokeRef = useRef<Stroke | null>(null);
  const isDrawing = useRef(false);

  const { annotationVisible, tool, color, strokeWidth } = useAppSelector(
    (state) => state.canvas,
  );

  /* ---------------- Canvas Helpers ---------------- */
  const clearCanvas = () => {
    strokesRef.current = [];
    redoStackRef.current = [];
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  /* ---------------- Shape Drawers ---------------- */
  const drawRectangle = (ctx: CanvasRenderingContext2D, a: Point, b: Point) => {
    const x = Math.min(a.x, b.x);
    const y = Math.min(a.y, b.y);
    const w = Math.abs(a.x - b.x);
    const h = Math.abs(a.y - b.y);
    ctx.strokeRect(x, y, w, h);
  };

  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    from: Point,
    to: Point,
    strokeWidth: number,
  ) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const angle = Math.atan2(dy, dx);

    const headLength = Math.max(12, strokeWidth * 3);
    const headAngle = Math.PI / 7;

    // Amount to overlap shaft into head
    const overlap = strokeWidth / 2;

    // ---- Shaft ----
    ctx.save();
    ctx.lineCap = "butt";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(
      to.x - (headLength - overlap) * Math.cos(angle),
      to.y - (headLength - overlap) * Math.sin(angle),
    );
    ctx.stroke();
    ctx.restore();

    // ---- Arrow head ----
    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(
      to.x - headLength * Math.cos(angle - headAngle),
      to.y - headLength * Math.sin(angle - headAngle),
    );
    ctx.lineTo(
      to.x - headLength * Math.cos(angle + headAngle),
      to.y - headLength * Math.sin(angle + headAngle),
    );
    ctx.closePath();

    ctx.fillStyle = ctx.strokeStyle as string;
    ctx.fill();
  };

  /* ---------------- Redraw ---------------- */
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    if (!annotationVisible) return;

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    const toCanvas = (p: Point) => ({
      x: p.x * w,
      y: p.y * h,
    });

    strokesRef.current.forEach((stroke) => {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = stroke.width;
      ctx.strokeStyle = stroke.color;
      ctx.fillStyle = stroke.color;
      ctx.globalAlpha = stroke.tool === "highlighter" ? 0.3 : 1;
      ctx.globalCompositeOperation =
        stroke.tool === "eraser" ? "destination-out" : "source-over";

      if (stroke.tool === "rectangle" && stroke.points.length === 2) {
        drawRectangle(
          ctx,
          toCanvas(stroke.points[0]),
          toCanvas(stroke.points[1]),
        );
        return;
      }

      if (stroke.tool === "arrow" && stroke.points.length === 2) {
        drawArrow(
          ctx,
          toCanvas(stroke.points[0]),
          toCanvas(stroke.points[1]),
          stroke.width,
        );
        return;
      }

      if (stroke.tool === "text" && stroke.text) {
        const p = toCanvas(stroke.points[0]);
        ctx.font = `${stroke.width * 4}px sans-serif`;
        ctx.fillText(stroke.text, p.x, p.y);
        return;
      }

      if (stroke.points.length < 2) return;

      ctx.beginPath();
      stroke.points.forEach((p, i) => {
        const pt = toCanvas(p);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
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
    if (!canvas || !parent) return;

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

  /* ---------------- Undo / Redo ---------------- */
  const undo = () => {
    const s = strokesRef.current.pop();
    if (s) {
      redoStackRef.current.push(s);
      redraw();
    }
  };
  const redo = () => {
    const s = redoStackRef.current.pop();
    if (s) {
      strokesRef.current.push(s);
      redraw();
    }
  };

  /* ---------------- Export ---------------- */
  const exportSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = canvas.clientWidth;
    exportCanvas.height = canvas.clientHeight;

    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    if (videoElementId) {
      const video = document.getElementById(videoElementId) as HTMLVideoElement;
      if (video && video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, exportCanvas.width, exportCanvas.height);
      }
    }

    ctx.drawImage(canvas, 0, 0);

    exportCanvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `snapshot-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  /* ---------------- Drawing Logic ---------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getPoint = (e: MouseEvent): Point => {
      const r = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - r.left) / r.width,
        y: (e.clientY - r.top) / r.height,
      };
    };

    const getStrokeWidth = (tool: CanvasTool) => {
      return tool === "eraser" ? strokeWidth * 2 : strokeWidth;
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0 || !annotationVisible) return;
      redoStackRef.current = [];

      const start = getPoint(e);

      if (tool === "text") {
        const text = prompt("Enter text");
        if (!text) return;

        strokesRef.current.push({
          tool,
          color,
          width: strokeWidth,
          points: [start],
          text,
        });

        redraw();
        return;
      }

      isDrawing.current = true;

      const stroke: Stroke = {
        tool,
        color,
        width: getStrokeWidth(tool),
        points: [start],
      };

      currentStrokeRef.current = stroke;
      strokesRef.current.push(stroke);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (
        !isDrawing.current ||
        !currentStrokeRef.current ||
        !annotationVisible
      ) {
        return;
      }

      const p = getPoint(e);

      if (tool === "rectangle" || tool === "arrow") {
        currentStrokeRef.current.points[1] = p;
      } else {
        currentStrokeRef.current.points.push(p);
      }

      redraw();
    };

    const endDrawing = () => {
      isDrawing.current = false;
      currentStrokeRef.current = null;
    };

    resizeCanvas();

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", endDrawing);
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    window.addEventListener("mouseup", endDrawing);
    window.addEventListener("resize", resizeCanvas);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", endDrawing);
      window.removeEventListener("mouseup", endDrawing);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [annotationVisible, tool, color, strokeWidth, resizeCanvas, redraw]);

  return (
    <div className="flex w-full h-full">
      <CanvasTools
        onUndo={undo}
        onRedo={redo}
        clearCanvas={clearCanvas}
        onExport={exportSnapshot}
      />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-auto"
        style={{
          background: "transparent",
          touchAction: "none",
          cursor: toolCursor[tool] || "default",
        }}
      />
    </div>
  );
}
