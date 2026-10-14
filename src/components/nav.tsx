const links = [
  { href: "#overview", label: "Overview" },
  { href: "#morning", label: "How it wakes you" },
  { href: "#specs", label: "Tech specs" },
];

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-night/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4 text-sm text-white/80">
        <a href="#top" className="text-base font-semibold tracking-tight text-white">
          Lull
        </a>
        <ul className="hidden gap-8 sm:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition-colors hover:text-white">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#buy"
          className="rounded-full bg-white px-4 py-1 font-medium text-ink transition-colors hover:bg-sun"
        >
          Buy
        </a>
      </nav>
    </header>
  );
}
