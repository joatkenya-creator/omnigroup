import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StatesPreview } from "./StatesPreview";

export const metadata: Metadata = { title: "Interface states preview", robots: { index: false, follow: false } };

/** Development-only gallery of every empty, loading, error and success state. 404 in production builds. */
export default function StatesPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <StatesPreview />;
}
