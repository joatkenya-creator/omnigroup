import Link from "next/link";

/**
 * TEMPORARY WORDMARK — placeholder until OmniGroup HR supplies its approved
 * logo. This is the only component that renders the brand mark; replace its
 * contents with the approved SVG (or next/image) and every usage updates.
 * Keep the accessible name "OmniGroup HR home".
 */
export function Brand({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  const text = tone === "light" ? "text-on-navy" : "text-ink";
  const badge = tone === "light" ? "border-brass text-brass" : "border-accent text-accent";
  return (
    <Link href="/" aria-label="OmniGroup HR home" className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`font-display text-[1.375rem] leading-none tracking-tight ${text}`} aria-hidden="true">
        OmniGroup
      </span>
      <span
        className={`rounded-[5px] border px-1.5 py-0.5 text-[0.6875rem] font-bold leading-none tracking-[0.12em] ${badge}`}
        aria-hidden="true"
      >
        HR
      </span>
    </Link>
  );
}
