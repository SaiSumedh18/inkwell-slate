"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { type Pen as PenModel, formatPrice, pens } from "@/lib/product";
import { Pen } from "./pen";
import { SketchPad } from "./sketch-pad";

const details: Record<PenModel, { label: string; body: string }[]> = {
  standard: [
    {
      label: "Erase with a tap",
      body: "Tap Eraser in the Slate’s toolbar and rub out with the tip. Tap Pen to keep writing.",
    },
    {
      label: "4,096 pressure levels",
      body: "Press lightly for a hairline, harder for a bold stroke.",
    },
    {
      label: "No battery",
      body: "Powered by the Slate’s screen. Never needs charging or pairing.",
    },
  ],
  pro: [
    {
      label: "Eraser end",
      body: "Flip it over and rub out, just like a pencil. No toolbar needed.",
    },
    {
      label: "Shortcut button",
      body: "Press to switch between pen and highlighter while you write.",
    },
    {
      label: "Everything else",
      body: "Same pressure, same magnet, still no battery.",
    },
  ],
};

/** Labels pointing at parts of the pen drawing, positioned as a % of its width. */
const callouts: { x: number; label: string; pro?: boolean }[] = [
  { x: 1, label: "Replaceable nib" },
  { x: 32, label: "Shortcut button", pro: true },
  { x: 58, label: "Flat side clicks onto the Slate" },
  { x: 94, label: "Eraser end", pro: true },
];

export function PenSection() {
  const [model, setModel] = useState<PenModel>("standard");

  return (
    <section id="pen" className="overflow-hidden bg-mist px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <h2 className="max-w-2xl font-serif text-headline font-medium">
          The pen is in the box. Choose which one.
        </h2>

        <div
          role="radiogroup"
          aria-label="Pen model"
          className="mt-10 inline-flex rounded-full bg-paper p-1 ring-1 ring-ink/10"
        >
          {pens.map((p) => (
            <button
              key={p.id}
              role="radio"
              aria-checked={model === p.id}
              onClick={() => setModel(p.id)}
              className={`relative rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                model === p.id ? "text-white" : "text-ink"
              }`}
            >
              {model === p.id && (
                <motion.span
                  layoutId="pen-pill"
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              <span className="relative">
                {p.name} {p.price > 0 ? `+${formatPrice(p.price)}` : "· Included"}
              </span>
            </button>
          ))}
        </div>

        {/* Pen with labelled parts */}
        <div className="relative mt-20 -mr-[20%] sm:mr-0">
          <div aria-hidden className="absolute inset-x-0 -top-12 hidden h-12 sm:block">
            <AnimatePresence>
              {callouts
                .filter((c) => !c.pro || model === "pro")
                .map((c) => (
                  <motion.div
                    key={c.label}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.3, delay: 0.25 }}
                    className={`absolute bottom-0 flex flex-col ${c.x > 80 ? "items-end" : "items-start"}`}
                    style={c.x > 80 ? { right: `${100 - c.x - 3}%` } : { left: `${c.x}%` }}
                  >
                    <span className="whitespace-nowrap text-xs text-muted">{c.label}</span>
                    <span
                      className={`mt-1 h-5 w-px bg-ink/30 ${c.x > 80 ? "mr-[1.6rem]" : "ml-1"}`}
                    />
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
          <motion.div
            key={model}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Pen model={model} className="w-full drop-shadow-[0_20px_25px_rgba(0,0,0,0.25)]" />
          </motion.div>
        </div>

        {/* Details and a place to try it */}
        <div className="mt-16 grid gap-12 md:grid-cols-[1fr_1.3fr] md:items-start">
          <AnimatePresence mode="wait">
            <motion.dl
              key={model}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0 }}
              transition={{ staggerChildren: 0.08 }}
              className="grid gap-8"
            >
              {details[model].map((d) => (
                <motion.div
                  key={d.label}
                  variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                  className="border-t border-ink/15 pt-5"
                >
                  <dt className="font-semibold">{d.label}</dt>
                  <dd className="mt-2 text-muted">{d.body}</dd>
                </motion.div>
              ))}
            </motion.dl>
          </AnimatePresence>

          <div>
            <h3 className="mb-4 text-xl font-semibold tracking-tight">Try it</h3>
            <SketchPad model={model} />
          </div>
        </div>
      </div>
    </section>
  );
}
