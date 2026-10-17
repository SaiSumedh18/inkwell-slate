"use client";

import { motion } from "framer-motion";

/** Side profiles drawn to scale (1 mm = 6 px) to show how thin the Slate is. */
const profiles = [
  { name: "Inkwell Slate", mm: 5.1, className: "bg-cobalt" },
  { name: "A pencil", mm: 7, className: "bg-graphite/70" },
  { name: "A typical phone", mm: 7.8, className: "bg-graphite/40" },
];

const contents = [
  { item: "Inkwell Slate", note: "In the finish you choose" },
  { item: "Inkwell pen", note: "Standard or Pro" },
  { item: "Five spare nibs", note: "About a year of writing each" },
  { item: "USB-C cable", note: "1 metre, braided" },
  { item: "Felt or leather folio", note: "If you add one" },
];

export function InTheBox() {
  return (
    <section className="bg-paper px-4 py-24 sm:py-32">
      <div className="mx-auto grid max-w-5xl gap-20 md:grid-cols-2 md:gap-16">
        <div>
          <h2 className="font-serif text-headline font-medium">Thinner than a pencil.</h2>
          <p className="mt-4 text-lede text-muted">
            5.1 mm and 390 g. It slips into the same bag as your laptop and you forget it’s there.
          </p>
          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-20% 0px" }}
            transition={{ staggerChildren: 0.15 }}
            className="mt-12 space-y-6"
          >
            {profiles.map((p) => (
              <li key={p.name}>
                <div className="flex justify-between text-sm">
                  <span className={p.className === "bg-cobalt" ? "font-semibold" : "text-muted"}>
                    {p.name}
                  </span>
                  <span className="tabular-nums text-muted">{p.mm} mm</span>
                </div>
                <motion.div
                  aria-hidden
                  variants={{
                    hidden: { scaleX: 0 },
                    show: { scaleX: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
                  }}
                  className={`mt-2 origin-left rounded-full ${p.className}`}
                  style={{ height: `${p.mm * 6}px` }}
                />
              </li>
            ))}
          </motion.ul>
        </div>

        <div>
          <h2 className="font-serif text-headline font-medium">In the box.</h2>
          <ul className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
            {contents.map((c) => (
              <li key={c.item} className="flex items-baseline justify-between gap-6 py-5">
                <span className="font-medium">{c.item}</span>
                <span className="text-right text-sm text-muted">{c.note}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted">
            Packed in recycled card with no plastic. The box is a notebook-sized drawer you’ll want
            to keep.
          </p>
        </div>
      </div>
    </section>
  );
}
