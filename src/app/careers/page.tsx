import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Openings } from "@/components/careers/Openings";
import { PageHero, Section, SectionHeading } from "@/components/sections";
import { EmptyState } from "@/components/states";
import { GENERAL_APPLICATION, applicationSteps, openings } from "@/content/careers";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Careers & Job Openings",
  description:
    "Explore careers with OmniGroup HR, see current job openings and submit an application online.",
  path: "/careers",
});

export default function CareersPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Careers", path: "/careers" }]}
        image={{ src: "/images/careers/hero-customer-service-team.webp", position: "object-[30%_center]" }}
        eyebrow="Careers"
        title="Build your future with us"
        lead="We invest in people. Explore professional and non-professional opportunities and apply online in a few minutes."
      >
        <Link href="/careers/apply" className="btn btn-primary">
          Apply now <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        {openings.length > 0 && (
          <a href="#openings" className="btn btn-secondary">
            View openings
          </a>
        )}
      </PageHero>

      <Section id="openings" labelledBy="openings-heading">
        {openings.length > 0 ? (
          <>
            <SectionHeading
              id="openings-heading"
              eyebrow="Current openings"
              title="Open positions"
              lead="All positions are based in the United States."
            />
            <Openings openings={openings} />
          </>
        ) : (
          <EmptyState
            id="openings-heading"
            eyebrow="Current openings"
            title="No open positions right now"
            body="We post roles as clients bring them to us, so openings change often."
            action={{ label: "Send a general application", href: `/careers/apply?position=${encodeURIComponent(GENERAL_APPLICATION)}` }}
          />
        )}
      </Section>

      <Section tone="sand" labelledBy="process-heading">
        <SectionHeading id="process-heading" eyebrow="What to expect" title="How applications work" />
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {applicationSteps.map((s, i) => (
            <li key={s.title} className="card p-7">
              <span className="font-display text-3xl text-accent" aria-hidden="true">
                {i + 1}
              </span>
              <h3 className="mt-3 font-sans text-lg font-semibold tracking-normal">{s.title}</h3>
              <p className="mt-2 text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-10 max-w-3xl text-sm leading-relaxed text-ink-soft">
          OmniGroup HR is an equal opportunity employer. Read our{" "}
          <Link href="/eeo-statement" className="text-link">
            EEO Statement
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="text-link">
            Privacy Policy
          </Link>{" "}
          to learn how we handle applications. Employers looking to hire should visit{" "}
          <Link href="/staffing-recruitment" className="text-link">
            Staffing &amp; Recruitment
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
