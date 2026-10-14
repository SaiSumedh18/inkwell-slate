export type Finish = "bone" | "charcoal";

/** The Inkwell Slate, drawn in CSS: a thin frame around a ruled e-ink page. */
export function Slate({
  finish = "bone",
  className = "",
  children,
}: {
  finish?: Finish;
  className?: string;
  children?: React.ReactNode;
}) {
  const frame = finish === "bone" ? "bg-bone ring-rule" : "bg-charcoal ring-graphite";

  return (
    <div
      className={`relative aspect-[3/4] rounded-[6%/4.5%] p-[5%] ring-1 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.45)] ${frame} ${className}`}
    >
      <div
        className="relative h-full w-full rounded-[2%] bg-eink [container-type:inline-size]"
      >
        {Array.from({ length: 7 }, (_, i) => (
          <span
            key={i}
            aria-hidden
            className="absolute inset-x-[6%] h-px bg-rule"
            style={{ top: `${6 + (i + 1) * 12.5}%` }}
          />
        ))}
        {children}
      </div>
    </div>
  );
}
