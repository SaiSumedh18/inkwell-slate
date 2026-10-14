"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  type Config,
  defaultConfig,
  ENGRAVING_MAX,
  finishes,
  folios,
  formatPrice,
  pens,
  storages,
  unitPrice,
} from "@/lib/product";
import { useBag } from "./bag/bag-context";
import { Pen } from "./pen";
import { Slate } from "./slate";

const folioColor = { felt: "bg-felt", leather: "bg-leather" } as const;

export function Buy() {
  const [config, setConfig] = useState<Config>(defaultConfig);
  const { add } = useBag();
  const set = <K extends keyof Config>(key: K, value: Config[K]) =>
    setConfig((c) => ({ ...c, [key]: value }));
  const price = unitPrice(config);

  return (
    <section id="buy" className="bg-paper px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-serif text-headline font-medium">Make it yours.</h2>
        <p className="mt-3 text-lede text-muted">
          Free delivery, free engraving, 30 days to return it.
        </p>

        <div className="mt-12 grid gap-12 md:grid-cols-[1fr_1.1fr] md:gap-16">
          {/* Live preview */}
          <div className="md:sticky md:top-24 md:self-start">
            <div className="relative mx-auto flex w-full max-w-sm items-end justify-center gap-[4%] rounded-3xl bg-mist px-[10%] py-[12%]">
              <div className="relative w-[78%]">
                <AnimatePresence>
                  {config.folio !== "none" && (
                    <motion.div
                      key={config.folio}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`absolute -inset-y-[3%] -left-[8%] right-[10%] rounded-[6%/4.5%] shadow-lg ${folioColor[config.folio]}`}
                    />
                  )}
                </AnimatePresence>
                <Slate finish={config.finish} engraving={config.engraving} className="relative">
                  <p className="absolute left-[9%] top-[8%] font-hand text-[11cqw] text-cobalt">
                    Hello.
                  </p>
                </Slate>
              </div>
              <motion.div
                key={config.pen}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative aspect-[44/640] w-[6%]"
              >
                {/* the pen SVG is horizontal; rotate it upright with the nib down */}
                <Pen
                  model={config.pen}
                  className="absolute left-1/2 top-1/2 w-[1454%] max-w-none -translate-x-1/2 -translate-y-1/2 -rotate-90"
                />
              </motion.div>
            </div>
            <p className="mt-6 text-center text-sm text-muted">Preview updates as you choose.</p>
          </div>

          {/* Options */}
          <div className="space-y-10">
            <Group legend="Finish" value={finishes.find((f) => f.id === config.finish)!.name}>
              <div className="flex gap-3">
                {finishes.map((f) => (
                  <label key={f.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="finish"
                      checked={config.finish === f.id}
                      onChange={() => set("finish", f.id)}
                      className="peer sr-only"
                    />
                    <span
                      className={`block size-11 rounded-full ${f.swatch} ring-2 ring-transparent ring-offset-2 transition peer-checked:ring-cobalt peer-focus-visible:ring-ink`}
                    />
                    <span className="sr-only">{f.name}</span>
                  </label>
                ))}
              </div>
            </Group>

            <Group legend="Pen">
              <Cards name="pen" options={pens} value={config.pen} onChange={(v) => set("pen", v)} />
            </Group>

            <Group legend="Storage">
              <Cards
                name="storage"
                options={storages}
                value={config.storage}
                onChange={(v) => set("storage", v)}
              />
            </Group>

            <Group legend="Cover">
              <Cards
                name="folio"
                options={folios}
                value={config.folio}
                onChange={(v) => set("folio", v)}
              />
            </Group>

            <Group legend="Engraving" value="Free">
              <label htmlFor="engraving" className="sr-only">
                Engraving text
              </label>
              <input
                id="engraving"
                type="text"
                maxLength={ENGRAVING_MAX}
                placeholder="Add up to 20 characters"
                value={config.engraving}
                onChange={(e) => set("engraving", e.target.value)}
                className="w-full rounded-2xl border border-ink/15 bg-paper px-4 py-3 outline-none transition focus:border-cobalt focus:ring-2 focus:ring-cobalt/20"
              />
              <p className="mt-2 text-right text-xs text-muted tabular-nums">
                {config.engraving.length}/{ENGRAVING_MAX}
              </p>
            </Group>

            <div className="flex flex-col gap-4 border-t border-ink/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted">Total</p>
                <motion.p
                  key={price}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-semibold tabular-nums"
                >
                  {formatPrice(price)}
                </motion.p>
              </div>
              <motion.button
                type="button"
                onClick={() => add(config)}
                whileTap={{ scale: 0.97 }}
                className="rounded-full bg-cobalt px-10 py-4 font-medium text-white transition-colors hover:bg-ink"
              >
                Add to bag
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Group({
  legend,
  value,
  children,
}: {
  legend: string;
  value?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="mb-4 font-semibold">
        {legend} {value && <span className="font-normal text-muted">· {value}</span>}
      </legend>
      {children}
    </fieldset>
  );
}

function Cards<T extends string>({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: readonly { id: T; name: string; price: number; detail: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="grid gap-3">
      {options.map((o) => (
        <label key={o.id} className="cursor-pointer">
          <input
            type="radio"
            name={name}
            checked={value === o.id}
            onChange={() => onChange(o.id)}
            className="peer sr-only"
          />
          <span className="flex items-center justify-between gap-4 rounded-2xl border border-ink/15 px-5 py-4 transition peer-checked:border-cobalt peer-checked:bg-cobalt/5 peer-checked:ring-1 peer-checked:ring-cobalt peer-focus-visible:ring-2 peer-focus-visible:ring-ink hover:border-ink/40">
            <span>
              <span className="block font-medium">{o.name}</span>
              <span className="block text-sm text-muted">{o.detail}</span>
            </span>
            <span className="shrink-0 text-sm tabular-nums">
              {o.price > 0 ? `+${formatPrice(o.price)}` : "Included"}
            </span>
          </span>
        </label>
      ))}
    </div>
  );
}
