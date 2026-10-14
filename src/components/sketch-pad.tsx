"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Pen } from "@/lib/product";

type Tool = "pen" | "eraser";

/** A small drawing surface so visitors can try writing and erasing. */
export function SketchPad({ model }: { model: Pen }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [tool, setTool] = useState<Tool>("pen");
  const [hasInk, setHasInk] = useState(false);

  // Match the canvas to its on-screen size for sharp lines on high-density screens.
  useEffect(() => {
    const canvas = canvasRef.current!;
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.getContext("2d")!.scale(dpr, dpr);
      setHasInk(false);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const point = (e: React.PointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, p: e.pressure || 0.5 };
  };

  function down(e: React.PointerEvent) {
    canvasRef.current!.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = point(e);
    move(e);
  }

  function move(e: React.PointerEvent) {
    if (!drawing.current || !last.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const p = point(e);
    // A stylus's eraser end reports button 5 (buttons & 32): honour it like the Pro pen would.
    const erasing = tool === "eraser" || (e.buttons & 32) !== 0;
    ctx.globalCompositeOperation = erasing ? "destination-out" : "source-over";
    ctx.strokeStyle = getComputedStyle(canvasRef.current!).color;
    ctx.lineWidth = erasing ? 22 : 1.5 + p.p * 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    if (!erasing) setHasInk(true);
  }

  function up() {
    drawing.current = false;
    last.current = null;
  }

  function clear() {
    const c = canvasRef.current!;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    setHasInk(false);
  }

  const hint =
    model === "pro"
      ? "With the Pro pen you flip it over to erase. Here, choose Eraser to try it."
      : "With the Standard pen, tap Eraser in the toolbar, then rub out with the tip.";

  return (
    <div className="rounded-3xl bg-paper p-4 ring-1 ring-ink/10 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="radiogroup"
          aria-label="Drawing tool"
          className="flex gap-1 rounded-full bg-mist p-1"
        >
          {(["pen", "eraser"] as const).map((t) => (
            <button
              key={t}
              role="radio"
              aria-checked={tool === t}
              onClick={() => setTool(t)}
              className={`relative rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                tool === t ? "text-white" : "text-ink"
              }`}
            >
              {tool === t && (
                <motion.span
                  layoutId="sketch-tool"
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              <span className="relative">{t}</span>
            </button>
          ))}
        </div>
        <button onClick={clear} className="text-sm text-cobalt hover:underline">
          Clear page
        </button>
      </div>

      <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-2xl bg-eink">
        <canvas
          ref={canvasRef}
          aria-label="Drawing area. Draw with your mouse, finger or stylus."
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          className={`absolute inset-0 h-full w-full touch-none text-ink ${
            tool === "eraser" ? "cursor-cell" : "cursor-crosshair"
          }`}
        />
        {!hasInk && (
          <p className="pointer-events-none absolute inset-0 grid place-items-center font-hand text-3xl text-muted/70">
            Write something here
          </p>
        )}
      </div>
      <p className="mt-3 text-sm text-muted">{hint}</p>
    </div>
  );
}
