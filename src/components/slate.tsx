import type { Finish } from "@/lib/product";

export type Paper = "lined" | "grid" | "dots" | "planner" | "music" | "blank";

const rule = "var(--color-rule)";

/** Background patterns for each paper template, drawn in CSS. */
const paperStyles: Record<Paper, React.CSSProperties> = {
  lined: {},
  blank: {},
  grid: {
    backgroundImage: `linear-gradient(${rule} 1px, transparent 1px), linear-gradient(90deg, ${rule} 1px, transparent 1px)`,
    backgroundSize: "8cqw 8cqw",
    backgroundPosition: "-1px -1px",
  },
  dots: {
    backgroundImage: `radial-gradient(circle, ${rule} 0.5cqw, transparent 0.6cqw)`,
    backgroundSize: "7cqw 7cqw",
  },
  planner: {
    backgroundImage: `linear-gradient(90deg, transparent calc(50% - 0.5px), ${rule} calc(50% - 0.5px), ${rule} calc(50% + 0.5px), transparent calc(50% + 0.5px)), linear-gradient(${rule} 1px, transparent 1px)`,
    backgroundSize: "100% 100%, 100% 25%",
    backgroundPosition: "0 0, 0 12%",
  },
  music: {
    backgroundImage: `repeating-linear-gradient(to bottom, ${rule} 0 1px, transparent 1px 2.2cqw)`,
    backgroundSize: "100% 11cqw",
    backgroundPosition: "0 4cqw",
    maskImage: "repeating-linear-gradient(to bottom, black 0 9.9cqw, transparent 9.9cqw 18cqw)",
  },
};

/** The Inkwell Slate, drawn in CSS: a thin frame around an e-ink page. */
export function Slate({
  finish = "bone",
  paper = "lined",
  engraving,
  className = "",
  children,
}: {
  finish?: Finish;
  paper?: Paper;
  engraving?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const frame = finish === "bone" ? "bg-bone ring-rule" : "bg-charcoal ring-graphite";
  const engraveColor = finish === "bone" ? "text-muted" : "text-white/50";

  return (
    <div
      className={`relative aspect-[3/4] rounded-[6%/4.5%] p-[5%] ring-1 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.45)] transition-colors duration-500 ${frame} ${className}`}
    >
      <div className="relative h-full w-full rounded-[2%] bg-eink [container-type:inline-size]">
        <div aria-hidden className="absolute inset-[5%]" style={paperStyles[paper]} />
        {paper === "lined" &&
          Array.from({ length: 7 }, (_, i) => (
            <span
              key={i}
              aria-hidden
              className="absolute inset-x-[6%] h-px bg-rule"
              style={{ top: `${6 + (i + 1) * 12.5}%` }}
            />
          ))}
        {children}
      </div>
      {engraving && (
        <p
          className={`absolute inset-x-0 bottom-[1.2%] truncate px-[8%] text-center text-[0.55rem] tracking-[0.2em] sm:text-[0.65rem] ${engraveColor}`}
        >
          {engraving}
        </p>
      )}
    </div>
  );
}
