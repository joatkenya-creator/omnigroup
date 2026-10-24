import type { MetadataRoute } from "next";
import { serviceList } from "@/content/services";
import { site } from "@/content/site";
import { absoluteUrl } from "@/lib/seo";

/** Indexable routes. Keep in sync when pages are added or removed. */
export const indexablePaths = [
  "/",
  "/services",
  ...serviceList.map((s) => `/${s.slug}`),
  "/industries",
  "/about",
  "/careers",
  "/careers/apply",
  "/contact",
  "/privacy-policy",
  "/eeo-statement",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(site.contentUpdated);
  return indexablePaths.map((path) => ({ url: absoluteUrl(path), lastModified }));
}
