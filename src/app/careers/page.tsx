import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { PageHero, Section, SectionHeading } from "@/components/sections";
import { openings } from "@/content/careers";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Careers & Job Openings",
  description:
    "Explore current job openings with OmniGroup HR, including virtual assistant, contracts administration and facilities roles, and apply online.",
  path: "/careers",
});

const steps = [
  { title: "Apply online", body: "Choose a position, upload your resume and suggest times for a short interview." },
  { title: "Review", body: "Our recruitment team reviews your experience against current opportunities." },
  { title: "Conversation", body: "If there's a potential match, we'll contact you to arrange an interview." },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Careers", path: "/careers" }]}
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
        <SectionHeading
          id="openings-heading"
          eyebrow="Current openings"
          title={openings.length > 0 ? "Open positions" : "No open positions right now"}
          lead={
            openings.length > 0
              ? "All positions are based in the United States."
              : "We don't have any open positions at the moment, but you're welcome to send a general application."
          }
        />
        {openings.length > 0 && (
          <ul className="mt-10 grid gap-5 md:grid-cols-2">
            {openings.map((job) => (
              <li key={job.id} className="card flex flex-col p-7">
                <h3 className="text-2xl">{job.title}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                  <MapPin className="size-4" aria-hidden="true" /> {job.location}
                </p>
                <p className="mt-4 text-ink-soft">{job.summary}</p>
                <ul className="mt-4 flex-1 space-y-1.5 text-sm text-ink-soft">
                  {job.responsibilities.map((r) => (
                    <li key={r} className="flex gap-2">
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                      {r}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/careers/apply?position=${encodeURIComponent(job.title)}`}
                  className="btn btn-secondary mt-6 self-start"
                  aria-label={`Apply for ${job.title}`}
                >
                  Apply for this role
                </Link>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-10 text-ink-soft">
          Don&apos;t see the right role?{" "}
          <Link href="/careers/apply?position=General%20application" className="text-link">
            Send a general application
          </Link>
          .
        </p>
      </Section>

      <Section tone="sand" labelledBy="process-heading">
        <SectionHeading id="process-heading" eyebrow="What to expect" title="How applications work" />
        <ol className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
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
