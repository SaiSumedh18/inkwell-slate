export const BASE_PRICE = 399;

export const finishes = [
  { id: "bone", name: "Bone", swatch: "bg-bone" },
  { id: "charcoal", name: "Charcoal", swatch: "bg-charcoal" },
] as const;

export const pens = [
  {
    id: "standard",
    name: "Standard pen",
    price: 0,
    detail: "Pressure-sensitive. Attaches magnetically.",
  },
  { id: "pro", name: "Pro pen", price: 79, detail: "Adds an eraser end and a shortcut button." },
] as const;

export const storages = [
  { id: "32", name: "32 GB", price: 0, detail: "About 100,000 pages." },
  { id: "64", name: "64 GB", price: 50, detail: "About 200,000 pages, plus room for PDFs." },
] as const;

export const folios = [
  { id: "none", name: "No cover", price: 0, detail: "Just the Slate." },
  { id: "felt", name: "Felt folio", price: 49, detail: "Wool felt with a pen loop." },
  { id: "leather", name: "Leather folio", price: 99, detail: "Vegetable-tanned, ages with use." },
] as const;

export const ENGRAVING_MAX = 20;

export type Finish = (typeof finishes)[number]["id"];
export type Pen = (typeof pens)[number]["id"];
export type Storage = (typeof storages)[number]["id"];
export type Folio = (typeof folios)[number]["id"];

export type Config = {
  finish: Finish;
  pen: Pen;
  storage: Storage;
  folio: Folio;
  engraving: string;
};

export const defaultConfig: Config = {
  finish: "bone",
  pen: "standard",
  storage: "32",
  folio: "none",
  engraving: "",
};

const byId = <T extends { id: string }>(list: readonly T[], id: string) =>
  list.find((o) => o.id === id)!;

export function unitPrice(c: Config) {
  return (
    BASE_PRICE +
    byId(pens, c.pen).price +
    byId(storages, c.storage).price +
    byId(folios, c.folio).price
  );
}

/** Human-readable lines describing a configuration, for the bag and checkout. */
export function describe(c: Config) {
  const lines = [
    `${byId(finishes, c.finish).name} · ${byId(storages, c.storage).name}`,
    byId(pens, c.pen).name,
  ];
  if (c.folio !== "none") lines.push(byId(folios, c.folio).name);
  if (c.engraving) lines.push(`Engraved: “${c.engraving}”`);
  return lines;
}

export const configKey = (c: Config) =>
  [c.finish, c.pen, c.storage, c.folio, c.engraving].join("|");

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export const shippingMethods = [
  { id: "standard", name: "Standard delivery", price: 0, days: [3, 5] },
  { id: "express", name: "Express delivery", price: 15, days: [1, 2] },
] as const;

export type ShippingMethod = (typeof shippingMethods)[number]["id"];

export const shippingById = (id: ShippingMethod) => byId(shippingMethods, id);

/** Delivery window as readable dates, counting business days from `from`. */
export function deliveryWindow(method: ShippingMethod, engraved: boolean, from = new Date()) {
  const [min, max] = shippingById(method).days;
  const extra = engraved ? 1 : 0;
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  return `${fmt(addBusinessDays(from, min + extra))} – ${fmt(addBusinessDays(from, max + extra))}`;
}

function addBusinessDays(from: Date, days: number) {
  const d = new Date(from);
  while (days > 0) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) days--;
  }
  return d;
}

export const COUNTRIES = ["United States", "Canada", "United Kingdom", "India", "Australia"];
