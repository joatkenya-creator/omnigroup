import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/sections";

export function LegalPage({ title, path, children }: { title: string; path: string; children: ReactNode }) {
  return (
    <article className="container-page py-12 md:py-20">
      <Breadcrumbs crumbs={[{ name: title, path }]} />
      <div className="mt-8 max-w-3xl">
        <h1 className="text-4xl md:text-5xl">{title}</h1>
        <div className="prose-legal mt-10">{children}</div>
      </div>
    </article>
  );
}
