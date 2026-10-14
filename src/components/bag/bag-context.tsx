"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { type Config, configKey, unitPrice } from "@/lib/product";

export type BagItem = { key: string; config: Config; qty: number };

// A tiny store kept outside React so the bag survives reloads in this browser.
const STORAGE_KEY = "inkwell-bag";
const EMPTY: BagItem[] = [];
let items: BagItem[] | null = null;
const listeners = new Set<() => void>();

function read(): BagItem[] {
  if (items) return items;
  try {
    items = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    items = [];
  }
  return items!;
}

function write(update: (prev: BagItem[]) => BagItem[]) {
  items = update(read());
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const bag = {
  add(config: Config) {
    const key = configKey(config);
    write((prev) =>
      prev.some((i) => i.key === key)
        ? prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { key, config, qty: 1 }],
    );
  },
  setQty(key: string, qty: number) {
    write((prev) =>
      qty < 1
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, qty } : i)),
    );
  },
  remove(key: string) {
    write((prev) => prev.filter((i) => i.key !== key));
  },
  clear() {
    write(() => []);
  },
};

type BagState = typeof bag & {
  items: BagItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const BagContext = createContext<BagState | null>(null);

export function BagProvider({ children }: { children: React.ReactNode }) {
  const current = useSyncExternalStore(subscribe, read, () => EMPTY);
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<BagState>(
    () => ({
      ...bag,
      add: (config: Config) => {
        bag.add(config);
        setIsOpen(true);
      },
      items: current,
      count: current.reduce((n, i) => n + i.qty, 0),
      subtotal: current.reduce((n, i) => n + i.qty * unitPrice(i.config), 0),
      isOpen,
      open,
      close,
    }),
    [current, isOpen, open, close],
  );

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

export function useBag() {
  const ctx = useContext(BagContext);
  if (!ctx) throw new Error("useBag must be used inside BagProvider");
  return ctx;
}
