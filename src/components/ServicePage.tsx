import Link from "next/link";
import { ArrowRight, Check, Info } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { LeadForm } from "@/components/forms/LeadForm";
import { FaqList, ItemGrid, PageHero, ProcessSteps, RelatedServices, Section, SectionHeading } from "@/components/sections";
import { site } from "@/content/site";
import type { Service } from "@/content/services";
import { pageMetadata, serviceJsonLd } from "@/lib/seo";

export function serviceMetadata(s: Service) {
  return pageMetadata({ title: s.metaTitle, description: s.metaDescription, path: `/${s.slug}` });
}

export function ServicePage({ service: s }: { service: Service }) {
  const path = `/${s.slug}`;
  return (
    <>
      <JsonLd data={serviceJsonLd({ name: s.name, serviceType: s.schemaServiceType, description: s.metaDescription, path })} />

      <PageHero
        crumbs={[{ name: "Services", path: "/services" }, { name: s.name, path }]}
        eyebrow={s.eyebrow}
        title={s.title}
        lead={s.lead}
        aside={
          <div className="card p-6 md:p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-muted">At a glance</p>
            <ul className="mt-4 space-y-3">
              {s.offerings.items.slice(0, 4).map((o) => (
                <li key={o.title} className="flex gap-3 text-ink-soft">
                  <Check className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                  {o.title}
                </li>
              ))}
            </ul>
          </div>
        }
      >
        <a href="#enquire" className="btn btn-primary">
          {s.primaryCta} <ArrowRight className="size-4" aria-hidden="true" />
        </a>
        <a href="#how-it-works" className="btn btn-secondary">
          How it works
        </a>
      </PageHero>

      <Section labelledBy="intro-heading">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <h2 id="intro-heading" className="text-3xl leading-tight md:text-[2.625rem]">
            {s.intro.heading}
          </h2>
          <div className="space-y-5 text-lg leading-relaxed text-ink-soft">
            {s.intro.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <ItemGrid items={s.problems.items} />
      </Section>

      <Section tone="sand" labelledBy="offerings-heading">
        <SectionHeading id="offerings-heading" eyebrow="What we offer" title={s.offerings.heading} lead={s.offerings.lead} />
        <ItemGrid items={s.offerings.items} columns={s.offerings.items.length === 4 ? 2 : 3} />
      </Section>

      {s.audience && (
        <Section labelledBy="audience-heading">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <SectionHeading id="audience-heading" eyebrow="Who it's for" title={s.audience.heading} />
            <ul className="grid gap-4">
              {s.audience.items.map((a) => (
                <li key={a} className="flex gap-4 border-b border-line pb-4 text-lg text-ink-soft last:border-0">
                  <Check className="mt-1 size-5 shrink-0 text-accent" aria-hidden="true" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      <Section tone="navy" id="how-it-works" labelledBy="process-heading">
        <SectionHeading id="process-heading" eyebrow="Process" title={s.process.heading} lead={s.process.lead} />
        <ProcessSteps steps={s.process.steps} />
      </Section>

      {s.scoping && (
        <Section labelledBy="scoping-heading">
          <SectionHeading id="scoping-heading" eyebrow="Getting started" title={s.scoping.heading} lead={s.scoping.lead} />
          <ItemGrid items={s.scoping.items} columns={4} />
        </Section>
      )}

      <Section tone={s.scoping ? "sand" : "paper"} id="enquire" labelledBy="enquire-heading">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <SectionHeading id="enquire-heading" eyebrow="Enquire" title={s.form.heading} lead={s.form.lead} />
            <div className="mt-8 space-y-2 text-ink-soft">
              <p className="font-semibold text-ink">Prefer to talk?</p>
              <p>
                Call{" "}
                <a href={`tel:${site.contact.phoneE164}`} className="text-link">
                  {site.contact.phoneDisplay}
                </a>{" "}
                or email{" "}
                <a href={`mailto:${site.contact.email}`} className="text-link">
                  {site.contact.email}
                </a>
              </p>
            </div>
            {s.note && (
              <p className="mt-8 flex gap-3 rounded-xl border border-line bg-white p-4 text-sm leading-relaxed text-ink-soft">
                <Info className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                {s.note}
              </p>
            )}
          </div>
          <div className="card p-6 md:p-9">
            <LeadForm formKey={s.form.key} defaults={s.form.defaultService ? { service: s.form.defaultService } : undefined} />
          </div>
        </div>
      </Section>

      <Section labelledBy="faq-heading">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
          <div>
            <SectionHeading id="faq-heading" eyebrow="FAQ" title="Frequently asked questions" />
            <p className="mt-6 text-ink-soft">
              Have a different question?{" "}
              <Link href="/contact" className="text-link">
                Contact us
              </Link>
              .
            </p>
          </div>
          <FaqList faqs={s.faqs} />
        </div>
      </Section>

      <RelatedServices slugs={s.related} />
    </>
  );
}
