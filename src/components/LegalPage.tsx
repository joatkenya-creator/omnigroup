import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/sections";

export function LegalPage({ title, path, updated, children }: { title: string; path: string; updated: string; children: ReactNode }) {
  const date = new Date(`${updated}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
  return (
    <article className="container-page py-12 md:py-20">
      <Breadcrumbs crumbs={[{ name: title, path }]} />
      <div className="mt-8 max-w-3xl">
        <h1 className="text-4xl md:text-5xl">{title}</h1>
        <p className="mt-4 text-muted">Last updated {date}</p>
        <div className="prose-legal mt-10">{children}</div>
      </div>
    </article>
  );
}
