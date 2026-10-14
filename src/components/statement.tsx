"use client";

import { motion, type MotionValue, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const text =
  "Most notes get lost because they end up in the wrong place. Inkwell Slate keeps every page you write in one thin, quiet slab. No apps to open, no alerts to dismiss. Just the next blank page.";

/** Words darken one by one as the paragraph scrolls through the viewport. */
export function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");

  return (
    <section id="overview" className="bg-paper px-4 py-32 sm:py-48">
      <p
        ref={ref}
        className="mx-auto max-w-4xl font-serif text-title font-medium sm:text-headline"
      >
        <span className="sr-only">{text}</span>
        {words.map((w, i) => (
          <Word
            key={i}
            progress={scrollYProgress}
            range={[i / words.length, (i + 1) / words.length]}
          >
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
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span aria-hidden style={{ opacity }} className="inline-block whitespace-pre">
      {children}{" "}
    </motion.span>
  );
}
