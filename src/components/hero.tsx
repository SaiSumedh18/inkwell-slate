"use client";

import { motion, type MotionValue, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Slate } from "./slate";

const note = ["Cabin trip, June", "– canoe at sunrise", "– learn three knots", "– leave the phone"];

const WRITE_START = 0.1;
const WRITE_LINE = 0.14;

/** Scroll writes a note on the Slate by hand, then converts it to typed text. */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const introOpacity = useTransform(p, [0, 0.1], [1, 0]);
  const handOpacity = useTransform(p, [0.72, 0.8], [1, 0]);
  const typedOpacity = useTransform(p, [0.74, 0.82], [0, 1]);
  const outroOpacity = useTransform(p, [0.78, 0.88], [0, 1]);
  const outroY = useTransform(p, [0.78, 0.88], [24, 0]);
  const cueOpacity = useTransform(p, [0, 0.04], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative h-[420vh] bg-mist">
      <div className="sticky top-0 flex h-svh flex-col items-center overflow-hidden px-4 pt-20">
        <div className="relative grid min-h-[24svh] w-full max-w-3xl place-items-center text-center">
          <motion.div style={{ opacity: introOpacity }} className="col-start-1 row-start-1">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-display font-medium"
            >
              Paper, but it remembers.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mt-4 text-lede text-muted"
            >
              Inkwell Slate. From $399.
            </motion.p>
          </motion.div>

          <motion.div
            style={{ opacity: outroOpacity, y: outroY }}
            className="col-start-1 row-start-1"
          >
            <p className="font-serif text-headline font-medium">
              Write it by hand. Search it like text.
            </p>
            <p className="mt-3 text-lede text-muted">One tap turns your handwriting into type.</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 w-[min(78vw,36svh)]"
        >
          <Slate>
            {note.map((line, i) => (
              <div
                key={line}
                className="absolute left-[9%] right-[6%]"
                style={{ top: `${6 + (i + 1) * 12.5}%`, transform: "translateY(-88%)" }}
              >
                <motion.div style={{ opacity: handOpacity }}>
                  <HandLine
                    progress={p}
                    range={[WRITE_START + i * WRITE_LINE, WRITE_START + (i + 1) * WRITE_LINE]}
                    title={i === 0}
                  >
                    {line}
                  </HandLine>
                </motion.div>
                <motion.p
                  style={{ opacity: typedOpacity }}
                  className={`absolute bottom-[8%] left-0 font-sans text-ink ${i === 0 ? "text-[7cqw] font-semibold" : "text-[5.5cqw]"}`}
                >
                  {line}
                </motion.p>
              </div>
            ))}
          </Slate>
        </motion.div>

        <motion.p style={{ opacity: cueOpacity }} className="absolute bottom-6 text-sm text-muted">
          Scroll to write
        </motion.p>
      </div>
    </section>
  );
}

function HandLine({
  children,
  progress,
  range,
  title,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  title: boolean;
}) {
  const reveal = useTransform(progress, range, [0, 100]);
  const clipPath = useTransform(reveal, (r) => `inset(-20% ${r >= 100 ? -10 : 100 - r}% -20% -5%)`);
  const penLeft = useTransform(reveal, (r) => `${r}%`);
  const penOpacity = useTransform(reveal, [0, 1, 99, 100], [0, 1, 1, 0]);

  return (
    <div className="relative inline-block">
      <motion.span
        style={{ clipPath }}
        className={`block whitespace-nowrap font-hand leading-none ${title ? "text-[13cqw] text-cobalt" : "text-[10.5cqw] text-ink"}`}
      >
        {children}
      </motion.span>
      {/* stylus, nib at the writing point */}
      <motion.span
        aria-hidden
        style={{ left: penLeft, opacity: penOpacity }}
        className="pointer-events-none absolute bottom-[10%] h-[28cqw] w-[2.6cqw] origin-bottom rotate-[28deg] rounded-t-full rounded-b-[40%] bg-gradient-to-r from-graphite via-charcoal to-night shadow-lg"
      />
    </div>
  );
}
