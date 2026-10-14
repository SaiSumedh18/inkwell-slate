import type { Pen as PenModel } from "@/lib/product";

/** The Inkwell pen as a horizontal SVG. The Pro model adds an eraser and a shortcut button. */
export function Pen({
  model = "standard",
  className = "",
}: {
  model?: PenModel;
  className?: string;
}) {
  const pro = model === "pro";
  return (
    <svg
      viewBox="0 0 640 44"
      className={className}
      role="img"
      aria-label={pro ? "Inkwell Pro pen" : "Inkwell Standard pen"}
    >
      <defs>
        <linearGradient id="pen-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-graphite)" />
          <stop offset="0.45" stopColor="var(--color-charcoal)" />
          <stop offset="1" stopColor="var(--color-night)" />
        </linearGradient>
        <linearGradient id="pen-nib" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-rule)" />
          <stop offset="1" stopColor="var(--color-muted)" />
        </linearGradient>
        <linearGradient id="pen-eraser" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--color-cobalt)" />
          <stop offset="1" stopColor="var(--color-night)" />
        </linearGradient>
      </defs>
      {/* nib */}
      <path d="M4 22 L70 8 L70 36 Z" fill="url(#pen-nib)" />
      <circle cx="6" cy="22" r="3" fill="var(--color-night)" />
      {/* body */}
      <rect x="66" y="6" width={pro ? 510 : 560} height="32" rx="6" fill="url(#pen-body)" />
      {/* flat side that clicks onto the Slate */}
      <rect
        x="120"
        y="6"
        width={pro ? 420 : 470}
        height="5"
        rx="2"
        fill="var(--color-graphite)"
        opacity="0.7"
      />
      {pro && (
        <>
          <rect x="190" y="14" width="34" height="16" rx="8" fill="var(--color-graphite)" />
          <rect x="570" y="8" width="66" height="28" rx="12" fill="url(#pen-eraser)" />
        </>
      )}
    </svg>
  );
}
