"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const faqs = [
  {
    q: "Can I read books or PDFs on it?",
    a: "Yes. Drop PDFs and EPUBs onto the Slate from your computer, then write in the margins. There’s no store or browser built in.",
  },
  {
    q: "Does it work with my phone or laptop?",
    a: "The free Inkwell desktop app syncs notebooks over Wi-Fi to Mac and Windows. Pages export as PDF, PNG or text, so you can open them anywhere.",
  },
  {
    q: "How do I erase with the Standard pen?",
    a: "Tap Eraser in the toolbar at the top of the page, then rub out with the pen tip. Tap Pen to go back to writing. The Pro pen skips the tap: flip it over and use the eraser end.",
  },
  {
    q: "What happens if I lose the pen?",
    a: "Replacement pens are sold separately, and any Inkwell pen works with any Slate. Spare nibs come in the box.",
  },
  {
    q: "How long does delivery take?",
    a: "Orders ship in 1–2 business days and arrive in 3–5. Engraved Slates take one extra day.",
  },
  {
    q: "What if I don’t like it?",
    a: "Send it back within 30 days for a full refund, engraved or not. Return shipping is free.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-mist px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-serif text-headline font-medium">Questions, answered.</h2>
        <ul className="mt-12 divide-y divide-ink/10 border-y border-ink/10">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-medium"
                >
                  {f.q}
                  <motion.span
                    aria-hidden
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    className="text-2xl leading-none text-muted"
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-6 text-muted">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
