import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/components/Icon";
import { CtaBand, PageHero, Section } from "@/components/sections";
import { serviceList } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Our Services",
  description:
    "Explore OmniGroup HR services: virtual assistants, HR consulting, staffing and recruitment, executive coaching and leadership development, and workplace mediation.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Services", path: "/services" }]}
        eyebrow="Our services"
        title="Talent and support solutions for a growing workforce"
        lead="Recruitment, staffing, virtual support and workforce development for U.S. businesses — from executive and skilled-trades hiring to HR strategy and workplace mediation."
      />
      <Section>
        <ul className="grid gap-6">
          {serviceList.map((s, i) => (
            <li key={s.slug}>
              <Link
                href={`/${s.slug}`}
                className="group card grid gap-6 p-7 transition-shadow hover:shadow-lift md:grid-cols-[auto_1fr_auto] md:items-center md:p-9"
              >
                <span
                  className={`flex size-14 items-center justify-center rounded-2xl ${i === 0 ? "bg-navy text-brass" : "bg-accent-tint text-accent"}`}
                >
                  <Icon name={s.icon} className="size-6" />
                </span>
                <div>
                  <h2 className="text-2xl md:text-3xl group-hover:text-accent">{s.name}</h2>
                  <p className="mt-2 max-w-2xl text-lg text-muted">{s.summary}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {s.offerings.items.slice(0, 4).map((o) => (
                      <li key={o.title} className="rounded-full bg-sand px-3 py-1 text-sm text-ink-soft">
                        {o.title}
                      </li>
                    ))}
                  </ul>
                </div>
                <span className="inline-flex items-center gap-2 font-semibold text-accent">
                  Learn more <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <CtaBand
        title="Not sure which service fits?"
        body="Tell us about your situation and we'll recommend the right starting point."
        primary={{ label: "Talk to our team", href: "/contact" }}
      />
    </>
  );
}
