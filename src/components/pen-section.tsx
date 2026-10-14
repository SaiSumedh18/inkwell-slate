"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { type Pen as PenModel, formatPrice, pens } from "@/lib/product";
import { Pen } from "./pen";

const details: Record<PenModel, { label: string; body: string }[]> = {
  standard: [
    {
      label: "4,096 pressure levels",
      body: "Press lightly for a hairline, harder for a bold stroke.",
    },
    {
      label: "No battery",
      body: "Powered by the Slate’s screen. Never needs charging or pairing.",
    },
    { label: "Magnetic", body: "Clicks onto the side of the Slate so it’s always there." },
  ],
  pro: [
    { label: "Eraser end", body: "Flip it over and rub out, just like a pencil." },
    { label: "Shortcut button", body: "Press to switch between pen and highlighter." },
    { label: "Everything else", body: "Same pressure, same magnet, still no battery." },
  ],
};

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

        <motion.div
          key={model}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 -mr-[20%] sm:mr-0"
        >
          <Pen model={model} className="w-full drop-shadow-[0_20px_25px_rgba(0,0,0,0.25)]" />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.dl
            key={model}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
            transition={{ staggerChildren: 0.08 }}
            className="mt-16 grid gap-8 sm:grid-cols-3"
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
      </div>
    </section>
  );
}
