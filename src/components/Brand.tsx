import Image from "next/image";
import Link from "next/link";

/**
 * Veteran credential badge, the client-supplied artwork with only its blank
 * white canvas trimmed and downscaled (3.2 MB -> 73 KB). Unoptimized because
 * the Worker has no image-optimization binding. Size it with a height class.
 */
export function VeteranBadge({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/brand/veteran-powered-business.png"
      width={640}
      height={384}
      alt="Veteran Powered Business logo"
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
