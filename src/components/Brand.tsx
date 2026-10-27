import Link from "next/link";

/**
 * OmniGroup HR logo (from the existing website). The single white PNG is
 * used as a CSS mask, so it renders in brand blue on light backgrounds and
 * white on navy without a second asset.
 */
export function Brand({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <Link href="/" aria-label="OmniGroup HR home" className={`inline-flex ${className}`}>
      <span
        aria-hidden="true"
        className={`block h-10 w-[178px] md:h-12 md:w-[213px] ${tone === "light" ? "bg-white" : "bg-accent"}`}
        style={{
          maskImage: "url(/brand/omnigroup-hr-logo.png)",
          maskSize: "contain",
          maskRepeat: "no-repeat",
          maskPosition: "left center",
        }}
      />
    </Link>
  );
}
