import type { Metadata } from "next";
import { site } from "@/content/site";

export const absoluteUrl = (path = "/") => new URL(path, site.url).toString();

// A page-level `openGraph` object replaces the root one, which would drop the
// generated app/opengraph-image. Reference it explicitly on every page.
const shareImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "OmniGroup HR — virtual assistant, HR and staffing services",
};

/** Per-page metadata with canonical URL and matching Open Graph tags. */
export function pageMetadata({
  title,
  description,
  path,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website", siteName: site.name, locale: "en_US", images: [shareImage] },
    twitter: { card: "summary_large_image", title, description, images: [shareImage.url] },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

const orgId = `${site.url}/#organization`;

export function organizationJsonLd() {
  const { contact } = site;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": orgId,
    name: site.name,
    url: site.url,
    description: site.description,
    email: contact.email,
    telephone: contact.phoneE164,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address.street,
      addressLocality: contact.address.city,
      addressRegion: contact.address.region,
      postalCode: contact.address.postalCode,
      addressCountry: contact.address.country,
    },
    sameAs: site.social.map((s) => s.href),
  };
}

export function serviceJsonLd(service: { name: string; serviceType: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    serviceType: service.serviceType,
    description: service.description,
    url: absoluteUrl(service.path),
    provider: { "@id": orgId },
    areaServed: { "@type": "Country", name: "United States" },
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}
