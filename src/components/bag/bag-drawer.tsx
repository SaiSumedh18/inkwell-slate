"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { describe, formatPrice, unitPrice } from "@/lib/product";
import { Slate } from "../slate";
import { useBag } from "./bag-context";

export function BagDrawer() {
  const { items, subtotal, isOpen, close, setQty, remove } = useBag();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      // Keep Tab focus inside the panel while it's open.
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      opener?.focus();
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[60] bg-night/40 backdrop-blur-sm"
          />
          <motion.aside
            ref={panelRef}
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label="Your bag"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col bg-paper shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <h2 className="font-serif text-2xl font-medium">Your bag</h2>
              <button
                ref={closeRef}
                onClick={close}
                className="rounded-full px-3 py-1 text-sm text-muted transition-colors hover:bg-mist hover:text-ink"
              >
                Close
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-lede">Your bag is empty.</p>
                <Link
                  href="/#buy"
                  onClick={close}
                  className="rounded-full bg-cobalt px-6 py-3 font-medium text-white transition-colors hover:bg-ink"
                >
                  Choose your Slate
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-ink/10 overflow-y-auto px-6">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.key}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex gap-4 py-5">
                          <div className="w-16 shrink-0">
                            <Slate finish={item.config.finish} paper="blank" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex justify-between gap-4">
                              <p className="font-semibold">Inkwell Slate</p>
                              <p className="font-semibold tabular-nums">
                                {formatPrice(unitPrice(item.config) * item.qty)}
                              </p>
                            </div>
                            <ul className="mt-1 text-sm text-muted">
                              {describe(item.config).map((l) => (
                                <li key={l} className="truncate">
                                  {l}
                                </li>
                              ))}
                            </ul>
                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center rounded-full border border-ink/15">
                                <button
                                  aria-label="Decrease quantity"
                                  onClick={() => setQty(item.key, item.qty - 1)}
                                  className="size-8 rounded-full text-lg transition-colors hover:bg-mist"
                                >
                                  −
                                </button>
                                <span
                                  className="w-6 text-center text-sm tabular-nums"
                                  aria-live="polite"
                                >
                                  {item.qty}
                                </span>
                                <button
                                  aria-label="Increase quantity"
                                  onClick={() => setQty(item.key, item.qty + 1)}
                                  className="size-8 rounded-full text-lg transition-colors hover:bg-mist"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => remove(item.key)}
                                className="text-sm text-cobalt hover:underline"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <footer className="border-t border-ink/10 px-6 py-6">
                  <div className="flex justify-between text-sm text-muted">
                    <span>Delivery</span>
                    <span>Free</span>
                  </div>
                  <div className="mt-2 flex justify-between text-lg font-semibold">
                    <span>Subtotal</span>
                    <span className="tabular-nums">{formatPrice(subtotal)}</span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={close}
                    className="mt-6 block rounded-full bg-cobalt px-6 py-4 text-center font-medium text-white transition-colors hover:bg-ink"
                  >
                    Check out
                  </Link>
                  <button
                    onClick={close}
                    className="mt-3 w-full rounded-full px-6 py-3 text-sm text-muted transition-colors hover:text-ink"
                  >
                    Keep shopping
                  </button>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
