"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number };
type Stroke = { points: Point[] };

export function AnnotationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const currentStrokeRef = useRef<Stroke | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    // ✅ FORCE ALPHA ENABLED CONTEXT
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = parent.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);

      canvas.style.width = "100%";
      canvas.style.height = "100%";

      // Reset transform and apply DPR scaling
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      redraw();
    };

    const redraw = () => {
      // ✅ CLEAR FULL BITMAP (NOT CSS SIZE)
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "red";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const cssWidth = canvas.clientWidth;
      const cssHeight = canvas.clientHeight;

      strokesRef.current.forEach((stroke) => {
        if (stroke.points.length < 2) return;

        ctx.beginPath();
        stroke.points.forEach((p, i) => {
          const x = p.x * cssWidth;
          const y = p.y * cssHeight;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      });
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let drawing = false;

    const getNormalizedPos = (e: MouseEvent): Point => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      drawing = true;

      const stroke: Stroke = { points: [getNormalizedPos(e)] };
      currentStrokeRef.current = stroke;
      strokesRef.current.push(stroke);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!drawing || !currentStrokeRef.current) return;
      currentStrokeRef.current.points.push(getNormalizedPos(e));
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full absolute inset-0"
      style={{
        background: "transparent",
        pointerEvents: "auto",
        touchAction: "none",
      }}
    />
  );
}
