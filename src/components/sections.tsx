import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ChevronRight, Plus } from "lucide-react";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { services, type Faq, type Item, type ServiceSlug } from "@/content/services";
import { testimonials } from "@/content/home";
import { breadcrumbJsonLd, type Crumb } from "@/lib/seo";

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  const all = [{ name: "Home", path: "/" }, ...crumbs];
  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
          {all.map((c, i) => (
            <li key={c.path} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="size-3.5" aria-hidden="true" />}
              {i === all.length - 1 ? (
                <span aria-current="page" className="text-ink-soft">
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} className="hover:text-accent hover:underline">
                  {c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(all)} />
    </>
  );
}

export function PageHero({
  crumbs,
  eyebrow,
  title,
  lead,
  children,
  aside,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: string;
  lead: string;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-sand">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgb(35_57_142/0.09),transparent_45%)]" />
      <div className="container-page relative py-12 md:py-20">
        <Breadcrumbs crumbs={crumbs} />
        <div className={`mt-8 grid gap-10 ${aside ? "lg:grid-cols-[1.35fr_1fr] lg:items-end" : ""}`}>
          <div className="max-w-3xl">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-4 text-4xl leading-[1.08] md:text-[3.5rem]">{title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl">{lead}</p>
            {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
          </div>
          {aside}
        </div>
      </div>
    </section>
  );
}

export function Section({
  children,
  tone = "paper",
  id,
  className = "",
  labelledBy,
}: {
  children: ReactNode;
  tone?: "paper" | "sand" | "navy" | "white";
  id?: string;
  className?: string;
  labelledBy?: string;
}) {
  const tones = { paper: "bg-paper", sand: "bg-sand", white: "bg-white", navy: "on-navy bg-navy text-on-navy" };
  return (
    <section id={id} aria-labelledby={labelledBy} className={`${tones[tone]} py-16 md:py-24 ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  align = "left",
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id} className="mt-3 text-3xl leading-tight md:text-[2.625rem]">
        {title}
      </h2>
      {lead && <p className="mt-4 text-lg leading-relaxed text-muted [.on-navy_&]:text-on-navy-muted">{lead}</p>}
    </div>
  );
}

export function ItemGrid({ items, columns = 3 }: { items: Item[]; columns?: 2 | 3 | 4 }) {
  const cols = { 2: "md:grid-cols-2", 3: "md:grid-cols-2 lg:grid-cols-3", 4: "md:grid-cols-2 lg:grid-cols-4" };
  return (
    <ul className={`mt-12 grid gap-5 ${cols[columns]}`}>
      {items.map((item) => (
        <li key={item.title} className="card flex flex-col p-6 md:p-7">
          {item.icon && (
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent-tint text-accent">
              <Icon name={item.icon} className="size-5" />
            </span>
          )}
          <h3 className="mt-5 font-sans text-lg font-semibold tracking-normal">{item.title}</h3>
          <p className="mt-2 leading-relaxed text-muted">{item.body}</p>
          {item.points && (
            <ul className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm text-ink-soft">
              {item.points.map((p) => (
                <li key={p} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                  {p}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

export function ProcessSteps({ steps }: { steps: Item[] }) {
  return (
    <ol className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line md:grid-cols-2 lg:grid-cols-4 [.on-navy_&]:border-navy-line [.on-navy_&]:bg-navy-line">
      {steps.map((step, i) => (
        <li key={step.title} className="bg-white p-6 md:p-7 [.on-navy_&]:bg-navy-raised">
          <span className="font-display text-4xl text-accent [.on-navy_&]:text-highlight" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-4 font-sans text-lg font-semibold tracking-normal">
            <span className="sr-only">Step {i + 1}: </span>
            {step.title}
          </h3>
          <p className="mt-2 leading-relaxed text-muted [.on-navy_&]:text-on-navy-muted">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="mt-10 divide-y divide-line border-y border-line">
      {faqs.map((f) => (
        <details key={f.q} className="group py-1">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold [&::-webkit-details-marker]:hidden">
            <h3 className="font-sans text-lg font-semibold tracking-normal">{f.q}</h3>
            <Plus className="size-5 shrink-0 text-accent transition-transform group-open:rotate-45" aria-hidden="true" />
          </summary>
          <p className="max-w-3xl pb-6 leading-relaxed text-ink-soft">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function CtaBand({
  title,
  body,
  primary,
  secondary,
}: {
  title: string;
  body: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="on-navy bg-navy text-on-navy">
      <div className="container-page grid gap-8 py-16 md:grid-cols-[1.4fr_1fr] md:items-center md:py-20">
        <div>
          <h2 className="text-3xl leading-tight md:text-[2.625rem]">{title}</h2>
          <p className="mt-4 max-w-xl text-lg text-on-navy-muted">{body}</p>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <Link href={primary.href} className="btn btn-light">
            {primary.label} <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          {secondary && (
            <Link href={secondary.href} className="btn btn-ghost-light">
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export function ServiceLinkCard({ slug, featured = false }: { slug: ServiceSlug; featured?: boolean }) {
  const s = services[slug];
  return (
    <Link
      href={`/${s.slug}`}
      className={`group card flex h-full flex-col p-6 transition-shadow hover:shadow-lift md:p-7 ${featured ? "border-accent/40" : ""}`}
    >
      <span className="flex size-11 items-center justify-center rounded-xl bg-accent-tint text-accent">
        <Icon name={s.icon} className="size-5" />
      </span>
      <h3 className="mt-5 font-sans text-lg font-semibold tracking-normal group-hover:text-accent">{s.name}</h3>
      <p className="mt-2 flex-1 leading-relaxed text-muted">{s.summary}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
        Explore {s.name.toLowerCase().startsWith("virtual") ? "VA services" : s.name}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </Link>
  );
}

export function RelatedServices({ slugs }: { slugs: ServiceSlug[] }) {
  return (
    <Section tone="sand" labelledBy="related-heading">
      <SectionHeading id="related-heading" eyebrow="Related services" title="Often combined with" />
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {slugs.map((slug) => (
          <ServiceLinkCard key={slug} slug={slug} />
        ))}
      </div>
    </Section>
  );
}

/** Renders only approved testimonials; hidden entirely while none exist. */
export function Testimonials() {
  if (testimonials.length === 0) return null;
  return (
    <Section tone="white" labelledBy="testimonials-heading">
      <SectionHeading id="testimonials-heading" eyebrow="Client feedback" title="What our clients say" />
      <ul className="mt-10 grid gap-5 md:grid-cols-2">
        {testimonials.map((t) => (
          <li key={t.name} className="card p-7">
            <blockquote>
              <p className="font-display text-xl leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-5 text-sm text-muted">
                <span className="font-semibold text-ink">{t.name}</span>, {t.role}
                {t.organization && `, ${t.organization}`}
              </footer>
            </blockquote>
          </li>
        ))}
      </ul>
    </Section>
  );
}
