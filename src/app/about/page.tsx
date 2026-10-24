import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaBand, PageHero, Section, SectionHeading } from "@/components/sections";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "OmniGroup HR helps organizations build strong teams and sustainable systems through virtual assistants, executive search, staffing, HR consulting and workplace support.",
  path: "/about",
});

/** CONFIRM: names, titles and biographies from the previous About Us page. No photos until supplied and approved. */
const leadership = [
  {
    name: "Tim Armstrong",
    role: "CEO & Founder",
    bio: "Tim leads OmniGroup HR with a focus on workforce development, operational efficiency and scalable growth. He works with organizations on recruitment solutions, HR strategy and operational support, with an emphasis on building strong teams and systems.",
  },
  {
    name: "Patricia Depra",
    role: "Operations Manager",
    bio: "Patricia leads operations with a focus on efficiency, organization and process execution. Her background in recruitment and HR supports well-managed workflows, timelines and client engagements.",
  },
];

const approach = [
  {
    title: "Global reach, local understanding",
    body: "A U.S. presence with the ability to connect clients with talent beyond their local market, including cross-border recruitment support.",
  },
  {
    title: "Industry experience",
    body: "Recruitment and workforce support for complex industries, including engineering, oil and gas, infrastructure and finance.",
  },
  {
    title: "Seamless hiring",
    body: "Attention to compliance, cultural alignment and smooth onboarding — not just getting a candidate through the door.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "About", path: "/about" }]}
        eyebrow="About OmniGroup HR"
        title="More than filling positions"
        lead="We help organizations build strong teams and sustainable systems, with a people-first approach tailored to each client's goals, values and vision."
      />

      <Section labelledBy="who-heading">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <SectionHeading id="who-heading" eyebrow="Who we are" title="A partner for your people and operations" />
          <div className="space-y-5 text-lg leading-relaxed text-ink-soft">
            <p>
              OmniGroup HR supports organizations through virtual assistant services, executive search, staffing and recruitment,
              HR consulting, leadership development, and mediation and workplace support.
            </p>
            <p>
              Our philosophy is simple: HR should be a strategic contributor to business growth, not only a support function. We
              combine modern methods with proven practices to help teams stay aligned and productive.
            </p>
            <p>
              Every engagement is shaped around the client. We take the time to understand your organization before recommending
              people, processes or support.
            </p>
            <p className="text-base text-muted">{site.parentStatement}.</p>
          </div>
        </div>
      </Section>

      <Section tone="sand" labelledBy="approach-heading">
        <SectionHeading id="approach-heading" eyebrow="How we support you" title="World-class talent solutions" />
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {approach.map((a) => (
            <li key={a.title} className="card p-7">
              <h3 className="font-sans text-lg font-semibold tracking-normal">{a.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{a.body}</p>
            </li>
          ))}
        </ul>
        <Link href="/industries" className="text-link mt-10 inline-flex items-center gap-2">
          Explore our industry reach <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </Section>

      <Section labelledBy="leadership-heading">
        <SectionHeading id="leadership-heading" eyebrow="Leadership" title="The team behind OmniGroup HR" />
        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {leadership.map((p) => (
            <li key={p.name} className="card p-7 md:p-9">
              <h3 className="text-2xl">{p.name}</h3>
              <p className="mt-1 font-semibold text-accent">{p.role}</p>
              <p className="mt-4 leading-relaxed text-ink-soft">{p.bio}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="sand" labelledBy="message-heading">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Our commitment</p>
          <h2 id="message-heading" className="mt-3 text-3xl leading-snug md:text-4xl">
            Structured, reliable workforce solutions that help organizations operate with confidence.
          </h2>
          <p className="mt-5 text-lg text-ink-soft">
            We bring precision, professionalism and strong systems to every engagement — particularly in complex industries where
            the right people make the difference.
          </p>
        </div>
      </Section>

      <CtaBand
        title="Let's talk about your organization"
        body="Tell us what you're working towards and we'll recommend how we can help."
        primary={{ label: "Contact us", href: "/contact" }}
        secondary={{ label: "View services", href: "/services" }}
      />
    </>
  );
}
