import { formatPrice } from "@/lib/product";
import type { Order } from "@/lib/server/orders";
import { Slate } from "./slate";

/** Read-only view of a saved order, used after checkout and on the order status page. */
export function OrderSummary({ order, className = "" }: { order: Order; className?: string }) {
  const placed = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const c = order.customer;

  return (
    <div className={`rounded-3xl bg-paper p-6 sm:p-10 ${className}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-semibold">Order {order.number}</h2>
        <p className="text-sm text-muted">Placed {placed}</p>
      </div>

      <ol
        className="mt-6 grid grid-cols-3 gap-2 text-center text-xs sm:text-sm"
        aria-label="Order progress"
      >
        {["Received", "Shipped", "Delivered"].map((step, i) => (
          <li key={step}>
            <span
              className={`block h-1.5 rounded-full ${i === 0 ? "bg-cobalt" : "bg-eink"}`}
              aria-hidden
            />
            <span className={`mt-2 block ${i === 0 ? "font-semibold" : "text-muted"}`}>
              {step}
              {i === 0 && <span className="sr-only"> (current)</span>}
            </span>
          </li>
        ))}
      </ol>

      <ul className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
        {order.items.map((item, i) => (
          <li key={i} className="flex gap-4 py-4">
            <div className="w-12 shrink-0">
              <Slate finish={item.config.finish} paper="blank" />
            </div>
            <div className="min-w-0 flex-1 text-sm">
              <div className="flex justify-between gap-3 font-semibold">
                <span>
                  Inkwell Slate {item.qty > 1 && <span className="text-muted">× {item.qty}</span>}
                </span>
                <span className="tabular-nums">{formatPrice(item.unitPrice * item.qty)}</span>
              </div>
              <ul className="mt-1 text-muted">
                {item.lines.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 grid gap-8 text-sm sm:grid-cols-2">
        <div>
          <p className="font-semibold">Delivering to</p>
          <p className="mt-2 text-muted">
            {c.name}
            <br />
            {c.address}
            <br />
            {c.city} {c.postcode}
            <br />
            {c.country}
          </p>
          <p className="mt-4 font-semibold">{order.shipping.name}</p>
          <p className="mt-1 text-muted">Arriving {order.shipping.window}</p>
        </div>
        <dl className="space-y-2 self-end">
          <div className="flex justify-between text-muted">
            <dt>Subtotal</dt>
            <dd className="tabular-nums">{formatPrice(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between text-muted">
            <dt>Delivery</dt>
            <dd className="tabular-nums">
              {order.shipping.price ? formatPrice(order.shipping.price) : "Free"}
            </dd>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
