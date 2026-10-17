"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { Order } from "@/lib/server/orders";
import { OrderSummary } from "./order-summary";

const inputClass =
  "mt-2 w-full rounded-2xl border border-ink/15 bg-paper px-4 py-3 outline-none transition focus:border-cobalt focus:ring-2 focus:ring-cobalt/20";

export function OrderLookup() {
  const params = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function lookUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const query = new URLSearchParams({
      number: String(data.get("number") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
    });
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/orders?${query}`);
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setOrder(null);
        setError(body.error ?? "We couldn’t find that order.");
        return;
      }
      setOrder(body.order);
    } catch {
      setError("You seem to be offline. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-serif text-headline font-medium">Check an order</h1>
      <p className="mt-3 text-lede text-muted">
        Enter the order number from your confirmation and the email you used.
      </p>

      <form
        onSubmit={lookUp}
        className="mt-10 grid gap-5 rounded-3xl bg-paper p-6 sm:grid-cols-2 sm:p-10"
      >
        <div>
          <label htmlFor="number" className="block text-sm font-medium">
            Order number
          </label>
          <input
            id="number"
            name="number"
            required
            placeholder="IW-ABC234"
            defaultValue={params.get("number") ?? ""}
            className={`${inputClass} uppercase`}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-cobalt px-8 py-3 font-medium text-white transition-colors hover:bg-ink disabled:opacity-70 sm:col-span-2 sm:justify-self-start"
        >
          {loading ? "Looking it up…" : "Find order"}
        </button>
        <AnimatePresence>
          {error && (
            <motion.p
              role="alert"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-error sm:col-span-2"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </form>

      {order && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <OrderSummary order={order} className="mt-6" />
        </motion.div>
      )}
    </div>
  );
}
