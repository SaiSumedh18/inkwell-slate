"use client";

import { motion } from "framer-motion";

export function Features() {
  return (
    <section className="bg-mist px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <h2 className="max-w-2xl font-serif text-headline font-medium">
          It does one thing. It does it beautifully.
        </h2>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ staggerChildren: 0.08 }}
          className="mt-16 grid gap-4 sm:grid-cols-6"
        >
          {/* Latency */}
          <Tile className="bg-night text-white sm:col-span-4 sm:row-span-2">
            <div className="flex h-full flex-col justify-between gap-12">
              <div>
                <h3 className="text-title font-semibold">Ink lands where the nib does.</h3>
                <p className="mt-3 max-w-md text-white/60">
                  Strokes appear nine milliseconds after the pen touches the screen. Fast enough
                  that your hand never waits for the page.
                </p>
              </div>
              <Stroke />
            </div>
          </Tile>

          {/* Battery */}
          <Tile className="bg-paper sm:col-span-2">
            <h3 className="text-xl font-semibold tracking-tight">Four weeks on a charge.</h3>
            <p className="mt-2 text-muted">A screen that only uses power when the page changes.</p>
            <div aria-hidden className="mt-6 h-3 overflow-hidden rounded-full bg-eink">
              <motion.div
                variants={{
                  hidden: { scaleX: 0 },
                  show: { scaleX: 0.92, transition: { duration: 1.2, delay: 0.3 } },
                }}
                className="h-full origin-left rounded-full bg-ink"
              />
            </div>
          </Tile>

          {/* Conversion */}
          <Tile className="bg-paper sm:col-span-2">
            <h3 className="text-xl font-semibold tracking-tight">Handwriting becomes text.</h3>
            <div className="mt-5 flex items-baseline gap-4">
              <span className="font-hand text-3xl">buy film</span>
              <span aria-hidden className="text-muted">
                to
              </span>
              <span className="font-medium">buy film</span>
            </div>
          </Tile>

          {/* Quiet */}
          <Tile className="bg-cobalt text-white sm:col-span-6">
            <div className="grid gap-6 sm:grid-cols-2 sm:items-end">
              <h3 className="font-serif text-headline font-medium">No notifications. Ever.</h3>
              <p className="text-lede text-white/85">
                No email, no feeds, no browser. When you pick up Slate, the only thing waiting for
                you is the page you left off on.
              </p>
            </div>
          </Tile>
        </motion.div>
      </div>
    </section>
  );
}

function Tile({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 32 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
      }}
      className={`rounded-3xl p-8 sm:p-10 ${className}`}
    >
      {children}
    </motion.article>
  );
}

/** A pen stroke that draws itself when the tile comes into view. */
function Stroke() {
  return (
    <svg viewBox="0 0 400 80" className="w-full" aria-hidden>
      <motion.path
        d="M8 52 C 48 8, 72 8, 92 44 S 140 78, 168 40 S 214 6, 240 42 S 296 76, 324 36 S 372 18, 392 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0 },
          show: { pathLength: 1, transition: { duration: 1.6, ease: "easeInOut", delay: 0.3 } },
        }}
      />
    </svg>
  );
}
