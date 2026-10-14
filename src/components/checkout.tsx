"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { describe, formatPrice, unitPrice } from "@/lib/product";
import { useBag } from "./bag/bag-context";
import { Slate } from "./slate";

type Order = { number: string; email: string; total: number };

const fields = [
  { name: "name", label: "Full name", autoComplete: "name", type: "text" },
  { name: "email", label: "Email", autoComplete: "email", type: "email" },
  { name: "address", label: "Street address", autoComplete: "street-address", type: "text" },
  { name: "city", label: "City", autoComplete: "address-level2", type: "text" },
  { name: "postcode", label: "Postal code", autoComplete: "postal-code", type: "text" },
] as const;

export function Checkout() {
  const { items, subtotal, clear } = useBag();
  const [order, setOrder] = useState<Order | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function placeOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    for (const f of fields) {
      const value = String(data.get(f.name) ?? "").trim();
      if (!value) next[f.name] = `Enter your ${f.label.toLowerCase()}.`;
      else if (f.type === "email" && !/^\S+@\S+\.\S+$/.test(value))
        next[f.name] = "Enter an email like name@example.com.";
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    setOrder({
      number: `IW-${Math.floor(100000 + Math.random() * 900000)}`,
      email: String(data.get("email")),
      total: subtotal,
    });
    clear();
  }

  if (order) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-xl rounded-3xl bg-paper p-10 text-center"
      >
        <p className="font-hand text-5xl text-cobalt">Thank you.</p>
        <h1 className="mt-4 font-serif text-title font-medium">Order {order.number} is placed.</h1>
        <p className="mt-4 text-muted">
          We’d send a confirmation to {order.email}. This is a demo store, so nothing was charged
          and nothing will ship.
        </p>
        <p className="mt-6 text-lg font-semibold tabular-nums">Total {formatPrice(order.total)}</p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-cobalt px-8 py-3 font-medium text-white transition-colors hover:bg-ink"
        >
          Back to Inkwell
        </Link>
      </motion.div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl bg-paper p-10 text-center">
        <h1 className="font-serif text-title font-medium">Your bag is empty.</h1>
        <p className="mt-3 text-muted">Choose a finish, pen and cover, then come back here.</p>
        <Link
          href="/#buy"
          className="mt-8 inline-block rounded-full bg-cobalt px-8 py-3 font-medium text-white transition-colors hover:bg-ink"
        >
          Choose your Slate
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-serif text-headline font-medium">Check out</h1>
      <div className="mt-10 grid gap-10 md:grid-cols-[1.2fr_1fr]">
        <form noValidate onSubmit={placeOrder} className="rounded-3xl bg-paper p-6 sm:p-10">
          <h2 className="text-xl font-semibold">Where should we send it?</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {fields.map((f) => (
              <div
                key={f.name}
                className={f.name === "city" || f.name === "postcode" ? "" : "sm:col-span-2"}
              >
                <label htmlFor={f.name} className="block text-sm font-medium">
                  {f.label}
                </label>
                <input
                  id={f.name}
                  name={f.name}
                  type={f.type}
                  autoComplete={f.autoComplete}
                  aria-invalid={!!errors[f.name]}
                  aria-describedby={errors[f.name] ? `${f.name}-error` : undefined}
                  className="mt-2 w-full rounded-2xl border border-ink/15 bg-paper px-4 py-3 outline-none transition focus:border-cobalt focus:ring-2 focus:ring-cobalt/20 aria-[invalid=true]:border-error"
                />
                <AnimatePresence>
                  {errors[f.name] && (
                    <motion.p
                      id={`${f.name}-error`}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-1 text-sm text-error"
                    >
                      {errors[f.name]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
          <p className="mt-8 rounded-2xl bg-mist p-4 text-sm text-muted">
            This is a demo store. No payment is taken and nothing is shipped.
          </p>
          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-cobalt px-8 py-4 font-medium text-white transition-colors hover:bg-ink"
          >
            Place order · {formatPrice(subtotal)}
          </button>
        </form>

        <aside className="self-start rounded-3xl bg-paper p-6 sm:p-10">
          <h2 className="text-xl font-semibold">Order summary</h2>
          <ul className="mt-6 divide-y divide-ink/10">
            {items.map((item) => (
              <li key={item.key} className="flex gap-4 py-4">
                <div className="w-14 shrink-0">
                  <Slate finish={item.config.finish} paper="blank" />
                </div>
                <div className="min-w-0 flex-1 text-sm">
                  <div className="flex justify-between gap-3 font-semibold">
                    <span>
                      Inkwell Slate{" "}
                      {item.qty > 1 && <span className="text-muted">× {item.qty}</span>}
                    </span>
                    <span className="tabular-nums">
                      {formatPrice(unitPrice(item.config) * item.qty)}
                    </span>
                  </div>
                  <ul className="mt-1 text-muted">
                    {describe(item.config).map((l) => (
                      <li key={l} className="truncate">
                        {l}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-ink/10 pt-4 text-sm">
            <div className="flex justify-between text-muted">
              <span>Delivery</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="tabular-nums">{formatPrice(subtotal)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
