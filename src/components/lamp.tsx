"use client";

import { motion, type MotionValue, useMotionTemplate } from "framer-motion";

type LampProps = {
  /** Light color of the diffuser. */
  light: MotionValue<string> | string;
  /** 0–1 glow strength. */
  glow: MotionValue<number> | number;
  finish?: "chalk" | "graphite";
  className?: string;
};

/** The Lull One, drawn in CSS: a metal ring holding a frosted disc on a small foot. */
export function Lamp({ light, glow, finish = "chalk", className = "" }: LampProps) {
  const ring =
    finish === "chalk"
      ? "from-chalk via-paper to-chalk"
      : "from-graphite via-muted to-graphite";

  return (
    <div className={`relative aspect-square ${className}`}>
      {/* light spill behind the lamp */}
      <motion.div
        aria-hidden
        className="absolute -inset-[60%] rounded-full blur-3xl"
        style={{
          background: useLight(light, "radial-gradient(circle, ", " 0%, transparent 60%)"),
          opacity: glow,
        }}
      />
      {/* ring */}
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-br ${ring} p-[5%] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]`}
      >
        {/* diffuser */}
        <div className="relative h-full w-full overflow-hidden rounded-full bg-night">
          <motion.div
            className="absolute inset-0"
            style={{
              background: useLight(light, "radial-gradient(circle at 50% 45%, ", " 40%, transparent 100%)"),
              opacity: glow,
            }}
          />
          <div className="absolute inset-0 rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.35)]" />
        </div>
      </div>
      {/* neck and foot */}
      <div
        className={`absolute -bottom-[6%] left-1/2 h-[8%] w-[10%] -translate-x-1/2 bg-gradient-to-r ${ring}`}
      />
      <div
        className={`absolute -bottom-[9%] left-1/2 h-[5%] w-[38%] -translate-x-1/2 rounded-full bg-gradient-to-r ${ring}`}
      />
    </div>
  );
}

function useLight(light: MotionValue<string> | string, before: string, after: string) {
  return useMotionTemplate`${before}${light}${after}`;
}
