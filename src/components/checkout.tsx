"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  COUNTRIES,
  type ShippingMethod,
  deliveryWindow,
  describe,
  formatPrice,
  shippingMethods,
  unitPrice,
} from "@/lib/product";
import type { Order } from "@/lib/server/orders";
import { useBag } from "./bag/bag-context";
import { OrderSummary } from "./order-summary";
import { Slate } from "./slate";

const fields = [
  { name: "name", label: "Full name", autoComplete: "name", type: "text", wide: true },
  { name: "email", label: "Email", autoComplete: "email", type: "email", wide: true },
  {
    name: "address",
    label: "Street address",
    autoComplete: "street-address",
    type: "text",
    wide: true,
  },
  { name: "city", label: "City", autoComplete: "address-level2", type: "text", wide: false },
  {
    name: "postcode",
    label: "Postal code",
    autoComplete: "postal-code",
    type: "text",
    wide: false,
  },
] as const;

const inputClass =
  "mt-2 w-full rounded-2xl border border-ink/15 bg-paper px-4 py-3 outline-none transition focus:border-cobalt focus:ring-2 focus:ring-cobalt/20 aria-[invalid=true]:border-error";

export function Checkout() {
  const { items, subtotal, clear } = useBag();
  const [shipping, setShipping] = useState<ShippingMethod>("standard");
  const [order, setOrder] = useState<Order | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const ship = shippingMethods.find((s) => s.id === shipping)!;
  const engraved = items.some((i) => i.config.engraving);
  const total = subtotal + ship.price;

  async function placeOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;

    // Quick checks in the browser; the server checks everything again.
    const next: Record<string, string> = {};
    for (const f of fields) {
      const value = (data[f.name] ?? "").trim();
      if (!value) next[f.name] = `Enter your ${f.label.toLowerCase()}.`;
      else if (f.type === "email" && !/^\S+@\S+\.\S+$/.test(value))
        next[f.name] = "Enter an email like name@example.com.";
    }
    setErrors(next);
    setFormError("");
    if (Object.keys(next).length) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ config, qty }) => ({ config, qty })),
          customer: data,
          shipping,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors(body.fields ?? {});
        setFormError(body.error ?? "We couldn’t place your order. Try again.");
        return;
      }
      setOrder(body.order);
      clear();
      window.scrollTo({ top: 0 });
    } catch {
      setFormError("You seem to be offline. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (order) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl"
      >
        <div className="rounded-3xl bg-paper p-8 text-center sm:p-10">
          <p className="font-hand text-5xl text-cobalt">Thank you.</p>
          <h1 className="mt-4 font-serif text-title font-medium">
            Order {order.number} is placed.
          </h1>
          <p className="mt-4 text-muted">
            Arriving {order.shipping.window}. Keep your order number to check on it later. This is a
            demo store, so nothing was charged and nothing will ship.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={`/orders?number=${order.number}`}
              className="rounded-full bg-cobalt px-8 py-3 font-medium text-white transition-colors hover:bg-ink"
            >
              Check order status
            </Link>
            <Link
              href="/"
              className="rounded-full px-8 py-3 font-medium text-ink ring-1 ring-ink/15 transition-colors hover:bg-mist"
            >
              Back to Inkwell
            </Link>
          </div>
        </div>
        <OrderSummary order={order} className="mt-6" />
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
              <div key={f.name} className={f.wide ? "sm:col-span-2" : ""}>
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
                  className={inputClass}
                />
                <FieldError id={f.name} message={errors[f.name]} />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label htmlFor="country" className="block text-sm font-medium">
                Country
              </label>
              <select
                id="country"
                name="country"
                autoComplete="country-name"
                defaultValue={COUNTRIES[0]}
                aria-invalid={!!errors.country}
                className={inputClass}
              >
                {COUNTRIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <FieldError id="country" message={errors.country} />
            </div>
          </div>

          <fieldset className="mt-10">
            <legend className="text-xl font-semibold">How fast do you need it?</legend>
            <div className="mt-4 grid gap-3">
              {shippingMethods.map((s) => (
                <label key={s.id} className="cursor-pointer">
                  <input
                    type="radio"
                    name="shipping"
                    value={s.id}
                    checked={shipping === s.id}
                    onChange={() => setShipping(s.id)}
                    className="peer sr-only"
                  />
                  <span className="flex items-center justify-between gap-4 rounded-2xl border border-ink/15 px-5 py-4 transition peer-checked:border-cobalt peer-checked:bg-cobalt/5 peer-checked:ring-1 peer-checked:ring-cobalt peer-focus-visible:ring-2 peer-focus-visible:ring-ink">
                    <span>
                      <span className="block font-medium">{s.name}</span>
                      <span className="block text-sm text-muted">
                        Arrives {deliveryWindow(s.id, engraved)}
                      </span>
                    </span>
                    <span className="text-sm tabular-nums">
                      {s.price ? formatPrice(s.price) : "Free"}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <p className="mt-8 rounded-2xl bg-mist p-4 text-sm text-muted">
            This is a demo store. Your order is saved so you can look it up, but no payment is taken
            and nothing is shipped.
          </p>

          <AnimatePresence>
            {formError && (
              <motion.p
                role="alert"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 rounded-2xl border border-error/30 bg-error/5 p-4 text-sm text-error"
              >
                {formError}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-full bg-cobalt px-8 py-4 font-medium text-white transition-colors hover:bg-ink disabled:cursor-wait disabled:opacity-70"
          >
            {submitting ? "Placing order…" : `Place order · ${formatPrice(total)}`}
          </button>
        </form>

        <aside className="self-start rounded-3xl bg-paper p-6 sm:p-10 md:sticky md:top-20">
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
              <span>Subtotal</span>
              <span className="tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>{ship.name}</span>
              <span className="tabular-nums">{ship.price ? formatPrice(ship.price) : "Free"}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="tabular-nums">{formatPrice(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          id={`${id}-error`}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-1 text-sm text-error"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
