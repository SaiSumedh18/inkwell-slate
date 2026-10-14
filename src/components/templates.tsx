"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { type Paper, Slate } from "./slate";

const templates: { id: Paper; name: string; body: string; sample: React.ReactNode }[] = [
  {
    id: "lined",
    name: "Lined",
    body: "For notes, journals and letters you never send.",
    sample: <Hand top="14%">Tuesday, 7am</Hand>,
  },
  {
    id: "grid",
    name: "Grid",
    body: "Sketch floor plans, wireframes and the occasional chart.",
    sample: (
      <svg viewBox="0 0 100 100" className="absolute inset-[18%] text-ink" aria-hidden>
        <path
          d="M10 80 L10 30 L50 10 L90 30 L90 80 Z M40 80 L40 55 L60 55 L60 80"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "dots",
    name: "Dot grid",
    body: "Structure when you want it, freedom when you don’t.",
    sample: <Hand top="18%">☐ Ship it</Hand>,
  },
  {
    id: "planner",
    name: "Week planner",
    body: "Seven days on one page, with room for the weekend.",
    sample: (
      <>
        <Hand top="10%" left="9%" size="7cqw">
          Mon
        </Hand>
        <Hand top="10%" left="56%" size="7cqw">
          Tue
        </Hand>
        <Hand top="35%" left="9%" size="7cqw">
          Wed
        </Hand>
      </>
    ),
  },
  {
    id: "music",
    name: "Sheet music",
    body: "Staves for melodies that arrive at inconvenient times.",
    sample: (
      <Hand top="5%" size="8cqw">
        ♩ ♪ ♫
      </Hand>
    ),
  },
];

export function Templates() {
  const [active, setActive] = useState(0);
  const t = templates[active];

  return (
    <section className="bg-paper px-4 py-24 sm:py-32">
      <div className="mx-auto grid max-w-5xl items-center gap-16 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-headline font-medium">
            A page for every kind of thinking.
          </h2>
          <p className="mt-4 text-lede text-muted">
            Over forty paper templates built in. Switch the page under your pen at any time.
          </p>

          <div role="tablist" aria-label="Paper templates" className="mt-10 flex flex-wrap gap-2">
            {templates.map((tpl, i) => (
              <button
                key={tpl.id}
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  i === active ? "text-white" : "text-ink hover:bg-mist"
                }`}
              >
                {i === active && (
                  <motion.span
                    layoutId="template-pill"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative">{tpl.name}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={t.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="mt-6 min-h-12 text-muted"
            >
              {t.body}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="mx-auto w-full max-w-xs">
          <Slate paper={t.id}>
            <AnimatePresence mode="wait">
              <motion.div
                key={t.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0"
              >
                {t.sample}
              </motion.div>
            </AnimatePresence>
          </Slate>
        </div>
      </div>
    </section>
  );
}

function Hand({
  children,
  top,
  left = "9%",
  size = "10cqw",
}: {
  children: React.ReactNode;
  top: string;
  left?: string;
  size?: string;
}) {
  return (
    <p className="absolute font-hand leading-none text-ink" style={{ top, left, fontSize: size }}>
      {children}
    </p>
  );
}
