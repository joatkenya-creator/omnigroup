import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.omnigrouphr.com");
const productionHost = siteUrl.host;
// Apex domain (omnigrouphr.com) redirects to the canonical www host.
const apexHost = productionHost.replace(/^www\./, "");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  {
    // Scripts are not restricted here because statically prerendered pages
    // cannot carry per-request nonces. These directives still block framing,
    // plugin content, base-tag hijacking and off-site form posts.
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'",
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_BUILD_YEAR: String(new Date().getFullYear()),
  },
  turbopack: {
    // Pin the workspace root so stray lockfiles in parent folders are ignored.
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Keep staging, preview and *.workers.dev hosts out of search indexes.
        source: "/:path*",
        missing: [{ type: "host", value: productionHost }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  async redirects() {
    return [
      // Legacy URLs from the previous website.
      { source: "/our-services", destination: "/services", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/apply-now", destination: "/careers/apply", permanent: true },
      { source: "/clients", destination: "/about", permanent: true },
      ...(apexHost !== productionHost
        ? [
            {
              source: "/:path*",
              has: [{ type: "host" as const, value: apexHost }],
              destination: `${siteUrl.origin}/:path*`,
              permanent: true,
            },
          ]
        : []),
    ];
  },
};

export default nextConfig;

// Exposes Cloudflare bindings (e.g. the rate limiter) to `next dev`.
initOpenNextCloudflareForDev();
