"use client";

import { motion, type MotionValue, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const text =
  "Thirty minutes before you need to be up, Lull One begins to glow. Deep red first, then amber, then daylight. By the time the chime plays, your body has already decided it’s morning.";

/** Words brighten one by one as the paragraph scrolls through the viewport. */
export function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");

  return (
    <section id="overview" className="bg-daylight px-4 py-32 sm:py-48">
      <p
        ref={ref}
        className="mx-auto max-w-4xl text-title font-semibold sm:text-headline"
      >
        <span className="sr-only">{text}</span>
        {words.map((w, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {w}
          </Word>
        ))}
      </p>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span aria-hidden style={{ opacity }} className="inline-block whitespace-pre">
      {children}{" "}
    </motion.span>
  );
}
