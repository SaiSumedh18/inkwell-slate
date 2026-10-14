"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useBag } from "./bag/bag-context";

const links = [
  { href: "/#overview", label: "Overview" },
  { href: "/#pen", label: "Pen" },
  { href: "/#workflow", label: "How it works" },
  { href: "/#specs", label: "Tech specs" },
];

export function Nav() {
  const { count, open } = useBag();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-mist/75 backdrop-blur-xl">
      <nav className="mx-auto flex h-12 max-w-5xl items-center justify-between gap-4 px-4 text-sm text-ink/70">
        <Link href="/" className="font-serif text-lg font-medium text-ink">
          Inkwell
        </Link>
        <ul className="hidden gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="transition-colors hover:text-ink">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <button
            onClick={open}
            aria-label={`Open bag, ${count} ${count === 1 ? "item" : "items"}`}
            className="relative grid size-9 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5"
          >
            <BagIcon />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-cobalt px-1 text-[0.6875rem] font-semibold leading-5 text-white tabular-nums"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <Link
            href="/#buy"
            className="rounded-full bg-cobalt px-4 py-1.5 font-medium text-white transition-colors hover:bg-ink"
          >
            Buy
          </Link>
        </div>
      </nav>
    </header>
  );
}

function BagIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden
    >
      <path d="M5 8h14l-1 12H6L5 8Z" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
    </svg>
  );
}
