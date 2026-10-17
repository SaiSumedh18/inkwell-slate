import "server-only";
import {
  COUNTRIES,
  type Config,
  ENGRAVING_MAX,
  type ShippingMethod,
  deliveryWindow,
  describe,
  finishes,
  folios,
  pens,
  shippingById,
  shippingMethods,
  storages,
  unitPrice,
} from "@/lib/product";
import { getStore } from "./store";

export type Customer = {
  name: string;
  email: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
};

export type OrderLine = { config: Config; qty: number; unitPrice: number; lines: string[] };

export type Order = {
  number: string;
  createdAt: string;
  customer: Customer;
  items: OrderLine[];
  shipping: { method: ShippingMethod; name: string; price: number; window: string };
  subtotal: number;
  total: number;
  status: "received";
};

/** What the browser is allowed to send. Prices are never taken from the client. */
export type OrderRequest = {
  items: { config: Config; qty: number }[];
  customer: Customer;
  shipping: ShippingMethod;
};

export class ValidationError extends Error {
  constructor(public fields: Record<string, string>) {
    super("Some details need fixing.");
  }
}

const MAX_ITEMS = 10;
const MAX_QTY = 10;

const oneOf = <T extends string>(list: readonly { id: T }[], v: unknown): v is T =>
  typeof v === "string" && list.some((o) => o.id === v);

const text = (v: unknown, max = 120) =>
  typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "";

/** Checks and cleans an order request, throwing a ValidationError listing every problem. */
export function parseOrderRequest(body: unknown): OrderRequest {
  const b = (body ?? {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const rawItems = Array.isArray(b.items) ? b.items : [];
  if (rawItems.length === 0) errors.items = "Your bag is empty.";
  if (rawItems.length > MAX_ITEMS) errors.items = `Orders are limited to ${MAX_ITEMS} lines.`;

  const items = rawItems.slice(0, MAX_ITEMS).map((raw, i) => {
    const r = (raw ?? {}) as { config?: Record<string, unknown>; qty?: unknown };
    const c = r.config ?? {};
    const engraving = text(c.engraving, ENGRAVING_MAX + 1);
    const qty = Number(r.qty);
    if (
      !oneOf(finishes, c.finish) ||
      !oneOf(pens, c.pen) ||
      !oneOf(storages, c.storage) ||
      !oneOf(folios, c.folio)
    )
      errors[`items.${i}`] = "One of the products in your bag is no longer available.";
    if (engraving.length > ENGRAVING_MAX)
      errors[`items.${i}`] = `Engraving can be up to ${ENGRAVING_MAX} characters.`;
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY)
      errors[`items.${i}`] = `Quantity must be between 1 and ${MAX_QTY}.`;
    return {
      config: {
        finish: c.finish,
        pen: c.pen,
        storage: c.storage,
        folio: c.folio,
        engraving,
      } as Config,
      qty,
    };
  });

  const c = (b.customer ?? {}) as Record<string, unknown>;
  const customer: Customer = {
    name: text(c.name),
    email: text(c.email, 200).toLowerCase(),
    address: text(c.address, 200),
    city: text(c.city),
    postcode: text(c.postcode, 20),
    country: text(c.country),
  };
  if (!customer.name) errors.name = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email))
    errors.email = "Enter an email like name@example.com.";
  if (!customer.address) errors.address = "Enter your street address.";
  if (!customer.city) errors.city = "Enter your city.";
  if (!customer.postcode) errors.postcode = "Enter your postal code.";
  if (!COUNTRIES.includes(customer.country)) errors.country = "Choose a country we deliver to.";

  if (!oneOf(shippingMethods, b.shipping)) errors.shipping = "Choose a delivery option.";

  if (Object.keys(errors).length) throw new ValidationError(errors);
  return { items, customer, shipping: b.shipping as ShippingMethod };
}

function orderNumber() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O or 1/I
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return "IW-" + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export async function createOrder(req: OrderRequest): Promise<Order> {
  const items: OrderLine[] = req.items.map(({ config, qty }) => ({
    config,
    qty,
    unitPrice: unitPrice(config),
    lines: describe(config),
  }));
  const subtotal = items.reduce((n, i) => n + i.unitPrice * i.qty, 0);
  const ship = shippingById(req.shipping);
  const engraved = items.some((i) => i.config.engraving);

  const order: Order = {
    number: orderNumber(),
    createdAt: new Date().toISOString(),
    customer: req.customer,
    items,
    shipping: {
      method: ship.id,
      name: ship.name,
      price: ship.price,
      window: deliveryWindow(ship.id, engraved),
    },
    subtotal,
    total: subtotal + ship.price,
    status: "received",
  };

  const store = getStore();
  await store.set(`order:${order.number}`, JSON.stringify(order));
  await store.pushToList("orders", order.number);
  return order;
}

/** Looks up an order only when the email matches, so numbers alone reveal nothing. */
export async function findOrder(number: string, email: string): Promise<Order | null> {
  const raw = await getStore().get(`order:${text(number, 20).toUpperCase()}`);
  if (!raw) return null;
  const order = JSON.parse(raw) as Order;
  return order.customer.email === text(email, 200).toLowerCase() ? order : null;
}

export async function listOrders(limit = 200): Promise<Order[]> {
  const store = getStore();
  const numbers = await store.range("orders", limit);
  const orders = await Promise.all(numbers.map((n) => store.get(`order:${n}`)));
  return orders.filter((o): o is string => !!o).map((o) => JSON.parse(o));
}
