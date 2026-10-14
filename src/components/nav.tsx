const links = [
  { href: "#overview", label: "Overview" },
  { href: "#workflow", label: "How it works" },
  { href: "#specs", label: "Tech specs" },
];

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-mist/75 backdrop-blur-xl">
      <nav className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4 text-sm text-ink/70">
        <a href="#top" className="font-serif text-lg font-medium text-ink">
          Inkwell
        </a>
        <ul className="hidden gap-8 sm:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition-colors hover:text-ink">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#buy"
          className="rounded-full bg-cobalt px-4 py-1 font-medium text-white transition-colors hover:bg-ink"
        >
          Buy
        </a>
      </nav>
    </header>
  );
}
