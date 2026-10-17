"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useBag } from "./bag/bag-context";

const links = [
  { href: "/#overview", label: "Overview" },
  { href: "/#pen", label: "Pen" },
  { href: "/#workflow", label: "How it works" },
  { href: "/#specs", label: "Tech specs" },
];

export function Nav() {
  const { count, open } = useBag();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu when navigating or pressing Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

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
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="grid size-9 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5 md:hidden"
          >
            <MenuIcon open={menuOpen} />
          </button>
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
      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-ink/10 px-4 md:hidden"
          >
            {[...links, { href: "/orders", label: "Order status" }].map((l) => (
              <li key={l.href} className="border-b border-ink/5 last:border-0">
                <Link
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-4 font-serif text-2xl text-ink"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <motion.path
        initial={false}
        animate={{ d: open ? "M6 6L18 18" : "M4 9H20" }}
        strokeLinecap="round"
        transition={{ duration: 0.2 }}
      />
      <motion.path
        initial={false}
        animate={{ d: open ? "M6 18L18 6" : "M4 15H20" }}
        strokeLinecap="round"
        transition={{ duration: 0.2 }}
      />
    </svg>
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
