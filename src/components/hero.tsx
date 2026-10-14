"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { palette } from "@/lib/palette";
import { Lamp } from "./lamp";

/** Scroll drives a sunrise: the page goes from night to morning as the lamp warms up. */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const background = useTransform(
    p,
    [0, 0.35, 0.7, 1],
    [palette.night, palette.dusk, palette.dawn, palette.daylight],
  );
  const light = useTransform(
    p,
    [0, 0.35, 0.7, 1],
    [palette.ember, palette.flame, palette.amber, palette.sun],
  );
  const glow = useTransform(p, [0, 0.08, 0.9], [0.15, 0.35, 1]);
  const lampScale = useTransform(p, [0, 1], [0.92, 1.05]);
  const lampY = useTransform(p, [0.6, 0.9], ["0vh", "-8vh"]);

  const nightOpacity = useTransform(p, [0, 0.25], [1, 0]);
  const nightY = useTransform(p, [0, 0.25], [0, -40]);
  const morningOpacity = useTransform(p, [0.72, 0.9], [0, 1]);
  const morningY = useTransform(p, [0.72, 0.9], [40, 0]);
  const cueOpacity = useTransform(p, [0, 0.05], [1, 0]);

  return (
    <motion.section id="top" ref={ref} style={{ background }} className="relative h-[320vh]">
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden px-4 pt-12">
        <motion.div
          style={{ opacity: nightOpacity, y: nightY }}
          className="absolute top-[14vh] text-center text-white"
        >
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-display font-semibold"
          >
            Wake up to a sunrise.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-4 text-lede text-white/60"
          >
            Lull One. From $149.
          </motion.p>
        </motion.div>

        <motion.div style={{ scale: lampScale, y: lampY }} className="w-[min(62vw,22rem,40svh)]">
          <Lamp light={light} glow={glow} />
        </motion.div>

        <motion.div
          style={{ opacity: morningOpacity, y: morningY }}
          className="absolute bottom-[8vh] max-w-xl text-center text-ink"
        >
          <p className="text-headline font-semibold">Not an alarm.</p>
          <p className="mt-3 text-lede text-ink/70">
            Light that rises over thirty minutes, so you&rsquo;re awake before the sound.
          </p>
        </motion.div>

        <motion.p
          style={{ opacity: cueOpacity }}
          className="absolute bottom-8 text-sm text-white/50"
        >
          Scroll to sunrise
        </motion.p>
      </div>
    </motion.section>
  );
}
