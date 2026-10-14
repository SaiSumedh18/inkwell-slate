"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { palette } from "@/lib/palette";
import { Lamp } from "./lamp";

const finishes = [
  { id: "chalk", name: "Chalk", swatch: "bg-chalk" },
  { id: "graphite", name: "Graphite", swatch: "bg-graphite" },
] as const;

type Finish = (typeof finishes)[number]["id"];

export function Buy() {
  const [finish, setFinish] = useState<Finish>("chalk");
  const [added, setAdded] = useState(false);
  const current = finishes.find((f) => f.id === finish)!;

  return (
    <section id="buy" className="bg-paper px-4 py-24 sm:py-32">
      <div className="mx-auto grid max-w-5xl items-center gap-16 md:grid-cols-2">
        <div className="relative mx-auto w-full max-w-xs py-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={finish}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
            >
              <Lamp light={palette.sun} glow={0.9} finish={finish} />
            </motion.div>
          </AnimatePresence>
        </div>

        <div>
          <h2 className="text-headline font-semibold">Buy Lull One</h2>
          <p className="mt-3 text-lede text-muted">$149. Free delivery and 60 nights to try it.</p>

          <fieldset className="mt-10">
            <legend className="font-semibold">
              Finish <span className="font-normal text-muted">· {current.name}</span>
            </legend>
            <div className="mt-4 flex gap-3">
              {finishes.map((f) => (
                <label key={f.id} className="cursor-pointer">
                  <input
                    type="radio"
                    name="finish"
                    value={f.id}
                    checked={finish === f.id}
                    onChange={() => {
                      setFinish(f.id);
                      setAdded(false);
                    }}
                    className="peer sr-only"
                  />
                  <span
                    className={`block size-10 rounded-full ${f.swatch} ring-2 ring-transparent ring-offset-2 transition peer-checked:ring-amber peer-focus-visible:ring-ink`}
                  />
                  <span className="sr-only">{f.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <motion.button
            type="button"
            onClick={() => setAdded(true)}
            whileTap={{ scale: 0.97 }}
            className="mt-10 w-full rounded-full bg-ink px-8 py-4 font-medium text-white transition-colors hover:bg-graphite sm:w-auto"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={added ? "added" : "add"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="block"
              >
                {added ? `${current.name} Lull One added to bag` : "Add to bag"}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
