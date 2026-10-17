"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/product";
import type { Order } from "@/lib/server/orders";

const SESSION_KEY = "inkwell-admin";

export function AdminDashboard() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  async function load(password: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${password}` },
        cache: "no-store",
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error ?? "Couldn’t load orders.");
        return;
      }
      try {
        sessionStorage.setItem(SESSION_KEY, password);
      } catch {}
      setOrders(body.orders);
    } catch {
      setError("You seem to be offline. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function refresh() {
    let saved = "";
    try {
      saved = sessionStorage.getItem(SESSION_KEY) ?? "";
    } catch {}
    if (saved) load(saved);
    else setOrders(null);
  }

  if (!orders) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          load(String(new FormData(e.currentTarget).get("password") ?? ""));
        }}
        className="mx-auto max-w-sm rounded-3xl bg-paper p-8"
      >
        <h1 className="font-serif text-title font-medium">Orders dashboard</h1>
        <label htmlFor="password" className="mt-6 block text-sm font-medium">
          Admin password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-2 w-full rounded-2xl border border-ink/15 px-4 py-3 outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/20"
        />
        {error && (
          <p role="alert" className="mt-3 text-sm text-error">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-ink px-6 py-3 font-medium text-white disabled:opacity-70"
        >
          {loading ? "Signing in…" : "Show orders"}
        </button>
      </form>
    );
  }

  const revenue = orders.reduce((n, o) => n + o.total, 0);
  const units = orders.reduce((n, o) => n + o.items.reduce((m, i) => m + i.qty, 0), 0);
  const stats = [
    { label: "Orders", value: orders.length.toLocaleString() },
    { label: "Slates sold", value: units.toLocaleString() },
    { label: "Revenue", value: formatPrice(revenue) },
    { label: "Average order", value: orders.length ? formatPrice(revenue / orders.length) : "—" },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-headline font-medium">Orders</h1>
        <button
          onClick={refresh}
          className="rounded-full px-5 py-2 text-sm font-medium ring-1 ring-ink/15 transition-colors hover:bg-paper"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-paper p-5">
            <dt className="text-sm text-muted">{s.label}</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">{s.value}</dd>
          </div>
        ))}
      </dl>

      {orders.length === 0 ? (
        <p className="mt-10 rounded-3xl bg-paper p-10 text-center text-muted">
          No orders yet. Place one from the checkout page and it will show up here.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-3xl bg-paper">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="border-b border-ink/10 text-muted">
              <tr>
                <th className="px-5 py-4 font-medium">Order</th>
                <th className="px-5 py-4 font-medium">Placed</th>
                <th className="px-5 py-4 font-medium">Customer</th>
                <th className="px-5 py-4 font-medium">Delivery</th>
                <th className="px-5 py-4 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {orders.map((o) => (
                <OrderRow
                  key={o.number}
                  order={o}
                  open={open === o.number}
                  onToggle={() => setOpen(open === o.number ? null : o.number)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function OrderRow({
  order,
  open,
  onToggle,
}: {
  order: Order;
  open: boolean;
  onToggle: () => void;
}) {
  const placed = new Date(order.createdAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  return (
    <>
      <tr className="align-top">
        <td className="px-5 py-4">
          <button
            onClick={onToggle}
            aria-expanded={open}
            className="font-semibold text-cobalt hover:underline"
          >
            {order.number}
          </button>
        </td>
        <td className="px-5 py-4 text-muted">{placed}</td>
        <td className="px-5 py-4">
          {order.customer.name}
          <span className="block text-muted">{order.customer.email}</span>
        </td>
        <td className="px-5 py-4 text-muted">{order.shipping.name}</td>
        <td className="px-5 py-4 text-right font-semibold tabular-nums">
          {formatPrice(order.total)}
        </td>
      </tr>
      {open && (
        <tr>
          <td colSpan={5} className="bg-mist/60 px-5 py-4">
            <ul className="space-y-2">
              {order.items.map((i, n) => (
                <li key={n}>
                  <span className="font-medium">
                    {i.qty} × Inkwell Slate ({formatPrice(i.unitPrice)} each)
                  </span>
                  <span className="text-muted"> — {i.lines.join(", ")}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-muted">
              {order.customer.address}, {order.customer.city} {order.customer.postcode},{" "}
              {order.customer.country} · Arriving {order.shipping.window}
            </p>
          </td>
        </tr>
      )}
    </>
  );
}
