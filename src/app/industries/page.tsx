import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaBand, PageHero, Section, SectionHeading } from "@/components/sections";
import { crossIndustryTalent, industries } from "@/content/industries";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Industry Expertise: Engineering, Oil & Gas, Infrastructure, Finance",
  description:
    "Specialist recruitment for engineering, oil and gas, infrastructure, finance and HR roles — technical and professional talent for complex projects.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Industries", path: "/industries" }]}
        eyebrow="Industry expertise"
        title="Specialist talent for the industries that build and power the economy"
        lead="We connect organizations with specialized professionals in engineering, energy, infrastructure, finance and HR, and support complex hiring needs from technical specialists to project leadership."
      >
        <Link href="/staffing-recruitment#enquire" className="btn btn-primary">
          Request talent <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <Link href="/staffing-recruitment" className="btn btn-secondary">
          How recruitment works
        </Link>
      </PageHero>

      <Section>
        <nav aria-label="Industries on this page">
          <ul className="flex flex-wrap gap-2">
            {industries.map((i) => (
              <li key={i.id}>
                <a href={`#${i.id}`} className="inline-block rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold hover:border-accent hover:text-accent">
                  {i.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-12 divide-y divide-line border-y border-line">
          {industries.map((ind) => (
            <article key={ind.id} id={ind.id} aria-labelledby={`${ind.id}-heading`} className="grid gap-6 py-12 lg:grid-cols-[1fr_1.4fr_1fr] lg:gap-10">
              <h2 id={`${ind.id}-heading`} className="text-3xl">
                {ind.name}
              </h2>
              <div>
                <p className="text-lg font-semibold text-ink">{ind.summary}</p>
                <p className="mt-3 leading-relaxed text-ink-soft">{ind.context}</p>
              </div>
              <div>
                <h3 className="font-sans text-sm font-semibold uppercase tracking-[0.08em] text-muted">Roles we support</h3>
                <ul className="mt-3 space-y-2">
                  {ind.roles.map((r) => (
                    <li key={r} className="flex gap-2.5 text-ink-soft">
                      <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="sand" labelledBy="across-heading">
        <SectionHeading
          id="across-heading"
          eyebrow="Across every industry"
          title="Leadership, skilled trades and administrative talent"
          lead="Beyond sector specialists, we support the roles every organization relies on."
        />
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {crossIndustryTalent.map((t) => (
            <li key={t.name}>
              <Link href={t.href} className="group card flex h-full items-center justify-between gap-4 p-6 hover:shadow-lift">
                <span className="text-lg font-semibold group-hover:text-accent">{t.name}</span>
                <ArrowRight className="size-5 shrink-0 text-accent" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand
        title="Hiring for a complex role?"
        body="Tell us about the position, location and timeline. We'll contact you to discuss requirements."
        primary={{ label: "Request talent", href: "/staffing-recruitment#enquire" }}
        secondary={{ label: "Contact us", href: "/contact" }}
      />
    </>
  );
}
