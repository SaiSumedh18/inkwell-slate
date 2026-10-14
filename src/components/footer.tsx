import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/#overview", label: "Overview" },
      { href: "/#pen", label: "Pen" },
      { href: "/#specs", label: "Tech specs" },
      { href: "/#buy", label: "Buy" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/#faq", label: "Delivery" },
      { href: "/#faq", label: "Returns" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-mist px-4 pb-10 pt-16 text-sm">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-10 border-b border-ink/10 pb-12 sm:grid-cols-[2fr_1fr_1fr]">
          <div>
            <p className="font-serif text-2xl font-medium">Inkwell</p>
            <p className="mt-3 max-w-xs text-muted">Paper, but it remembers.</p>
          </div>
          {columns.map((c) => (
            <div key={c.title}>
              <p className="font-semibold">{c.title}</p>
              <ul className="mt-4 space-y-2 text-muted">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="transition-colors hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-8 text-muted">
          Inkwell and Inkwell Slate are a made-up brand and product, designed for this demo site.
          Nothing is sold or shipped.
        </p>
      </div>
    </footer>
  );
}
