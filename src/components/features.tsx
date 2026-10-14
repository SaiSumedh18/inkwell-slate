"use client";

import { motion } from "framer-motion";

const sounds = ["Rain on canvas", "Distant surf", "Night train", "Box fan", "Pine forest", "Low hum"];

export function Features() {
  return (
    <section className="bg-paper px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <h2 className="max-w-2xl text-headline font-semibold">
          Everything a bedside needs. Nothing it doesn&rsquo;t.
        </h2>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ staggerChildren: 0.08 }}
          className="mt-16 grid gap-4 sm:grid-cols-6"
        >
          {/* Sunrise */}
          <Tile className="bg-night text-white sm:col-span-4 sm:row-span-2">
            <div className="flex h-full flex-col justify-between gap-16">
              <div>
                <h3 className="text-title font-semibold">A sunrise, in thirty minutes.</h3>
                <p className="mt-3 max-w-md text-white/60">
                  Light climbs from 1,800K to 6,500K, from a candle&rsquo;s glow to noon. You can
                  shorten it to ten minutes or stretch it to an hour.
                </p>
              </div>
              <div
                aria-hidden
                className="h-24 rounded-2xl bg-gradient-to-r from-night via-ember via-40% to-sun"
              />
            </div>
          </Tile>

          {/* Sounds */}
          <Tile className="bg-mist sm:col-span-2">
            <h3 className="text-xl font-semibold tracking-tight">Twelve sounds for falling asleep.</h3>
            <ul className="mt-4 space-y-1 text-muted">
              {sounds.map((s) => (
                <li key={s}>{s}</li>
              ))}
              <li className="text-ink">and six more.</li>
            </ul>
          </Tile>

          {/* Dial */}
          <Tile className="bg-mist sm:col-span-2">
            <div className="flex flex-col items-start gap-6">
              <Dial />
              <div>
                <h3 className="text-xl font-semibold tracking-tight">One dial. No app.</h3>
                <p className="mt-1 text-muted">Turn for brightness. Press to snooze.</p>
              </div>
            </div>
          </Tile>

          {/* Sunset */}
          <Tile className="bg-gradient-to-b from-amber to-ember text-white sm:col-span-6">
            <div className="grid gap-6 sm:grid-cols-2 sm:items-end">
              <h3 className="text-headline font-semibold">Sunset, too.</h3>
              <p className="text-lede text-white/85">
                At night it runs the other way. The light dims and warms over twenty minutes while
                a sound plays, then fades to dark on its own.
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

function Dial() {
  return (
    <div
      aria-hidden
      className="relative size-20 shrink-0 rounded-full bg-gradient-to-br from-paper to-chalk shadow-[inset_0_-4px_8px_rgba(0,0,0,0.12),0_8px_16px_-6px_rgba(0,0,0,0.25)]"
    >
      <span className="absolute left-1/2 top-2 h-4 w-1 -translate-x-1/2 rounded-full bg-amber" />
    </div>
  );
}
