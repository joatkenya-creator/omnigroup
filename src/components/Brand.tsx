import Image from "next/image";
import Link from "next/link";

/**
 * Veteran-owned credential badge, the client-supplied JPG shown as-is.
 * Unoptimized because the Worker has no image-optimization binding; the
 * 34 KB source is already small. Size it with a height class; width follows.
 */
export function VeteranBadge({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/brand/veteran-owned-business.jpg"
      width={500}
      height={375}
      alt="Veteran-Owned Business logo"
      unoptimized
      className={`w-auto ${className}`}
    />
  );
}

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
