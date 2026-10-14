"use client";

import { motion } from "framer-motion";

const steps = [
  {
    time: "6:00",
    title: "Deep red",
    body: "1% brightness. Too dim to wake you, bright enough to start.",
  },
  { time: "6:10", title: "Amber", body: "Your eyelids notice before you do." },
  { time: "6:20", title: "Warm white", body: "The room is lit like an early summer morning." },
  {
    time: "6:30",
    title: "Daylight",
    body: "Full brightness, and a soft chime. Most people are up already.",
  },
];

const dots = ["bg-ember", "bg-amber", "bg-sun", "bg-paper"];

export function Timeline() {
  return (
    <section id="morning" className="bg-night px-4 py-24 text-white sm:py-32">
      <div className="mx-auto max-w-5xl">
        <h2 className="max-w-xl text-headline font-semibold">Your 6:30 alarm, minute by minute.</h2>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ staggerChildren: 0.25 }}
          className="relative mt-16"
        >
          {/* the light rising across the timeline */}
          <motion.div
            aria-hidden
            variants={{
              hidden: { scaleX: 0 },
              show: { scaleX: 1, transition: { duration: 1.4, ease: "easeInOut" } },
            }}
            className="absolute left-0 right-0 top-[7px] hidden h-0.5 origin-left bg-gradient-to-r from-ember via-amber to-paper sm:block"
          />
          <ol className="grid gap-10 sm:grid-cols-4 sm:gap-6">
            {steps.map((s, i) => (
              <motion.li
                key={s.time}
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <span className={`block size-4 rounded-full ${dots[i]}`} />
                <p className="mt-6 text-title font-semibold tabular-nums">{s.time}</p>
                <p className="mt-1 font-medium">{s.title}</p>
                <p className="mt-2 text-white/60">{s.body}</p>
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </div>
    </section>
  );
}
