"use client";

import { motion } from "framer-motion";

const steps = [
  { title: "Write", body: "Any page, any notebook. The pen needs no charging or pairing." },
  { title: "Convert", body: "Tap the margin and your handwriting turns into editable text." },
  { title: "Find", body: "Search every notebook at once, including the pages you never converted." },
  { title: "Send", body: "Share a page as PDF or text by email, straight from the Slate." },
];

export function Timeline() {
  return (
    <section id="workflow" className="bg-night px-4 py-24 text-white sm:py-32">
      <div className="mx-auto max-w-5xl">
        <h2 className="max-w-xl font-serif text-headline font-medium">
          From margin to inbox in four steps.
        </h2>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ staggerChildren: 0.25 }}
          className="relative mt-16"
        >
          {/* a line drawn across the steps */}
          <motion.div
            aria-hidden
            variants={{
              hidden: { scaleX: 0 },
              show: { scaleX: 1, transition: { duration: 1.4, ease: "easeInOut" } },
            }}
            className="absolute left-0 right-0 top-[7px] hidden h-0.5 origin-left bg-white/30 sm:block"
          />
          <ol className="grid gap-10 sm:grid-cols-4 sm:gap-6">
            {steps.map((s, i) => (
              <motion.li
                key={s.title}
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <span
                  className={`block size-4 rounded-full ${i === steps.length - 1 ? "bg-cobalt" : "bg-white"}`}
                />
                <p className="mt-6 text-title font-semibold">{s.title}</p>
                <p className="mt-2 text-white/60">{s.body}</p>
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </div>
    </section>
  );
}
