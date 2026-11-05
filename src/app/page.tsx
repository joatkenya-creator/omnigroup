import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Icon } from "@/components/Icon";
import { CtaBand, FaqList, ProcessSteps, Section, SectionHeading, ServiceLinkCard, Testimonials, TrustedBy } from "@/components/sections";
import { differentiators, engagementSteps, homeFaqs } from "@/content/home";
import { industries } from "@/content/industries";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = {
  ...pageMetadata({
    title: "Virtual Assistant, HR & Staffing Services",
    description:
      "OmniGroup HR provides virtual assistant services, HR support, specialist and executive recruitment, leadership development and workplace mediation for U.S. organizations.",
    path: "/",
  }),
  title: { absolute: `${site.name} | Virtual Assistant, HR & Staffing Services` },
};

const intents = [
  { label: "Virtual assistant support", href: "/virtual-assistant-services", icon: "assistant" as const },
  { label: "Staff or a specialist hire", href: "/staffing-recruitment", icon: "recruitment" as const },
  { label: "HR guidance and policy", href: "/hr-services", icon: "hr" as const },
  { label: "Leadership development", href: "/leadership-development", icon: "leadership" as const },
  { label: "Help with a workplace dispute", href: "/mediation-workplace-support", icon: "mediation" as const },
];

export default function HomePage() {
  const va = services["virtual-assistant-services"];
  return (
    <>
      {/* Hero */}
      <section className="on-navy relative overflow-hidden border-b border-navy-line bg-navy text-on-navy">
        <Image src="/images/home/virtual-meeting.webp" alt="" fill preload sizes="100vw" className="hero-photo object-cover object-center" />
        {/* Solid enough that muted text stays above WCAG AA (4.5:1) even over white areas of the photo. */}
        <div aria-hidden="true" className="absolute inset-0 bg-navy/85" />
        <div className="container-page relative grid gap-12 py-14 md:py-20 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:py-24">
          <div>
            <p className="eyebrow">HR, staffing &amp; virtual support</p>
            <h1 className="mt-5 text-[2.6rem] leading-[1.05] md:text-6xl lg:text-[4.25rem]">
              The people and support your business needs to grow.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-on-navy-muted md:text-xl">
              From virtual assistants to specialist recruitment and HR strategy, OmniGroup HR helps organizations operate
              efficiently, resolve workplace challenges and grow with confidence.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-primary">
                Request a consultation <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link href="/virtual-assistant-services" className="btn btn-secondary">
                Explore virtual assistant services
              </Link>
            </div>
            <p className="mt-6 text-on-navy-muted">
              Looking for work?{" "}
              <Link href="/careers" className="text-link">
                View current openings
              </Link>
            </p>
          </div>

          <nav aria-labelledby="intent-heading" className="card p-2.5 text-ink shadow-lift">
            <h2 id="intent-heading" className="px-4 pb-2 pt-4 font-sans text-sm font-semibold uppercase tracking-[0.08em] text-muted">
              What do you need help with?
            </h2>
            <ul>
              {intents.map((intent) => (
                <li key={intent.href}>
                  <Link
                    href={intent.href}
                    className="group flex items-center gap-4 rounded-xl px-4 py-3.5 transition-colors hover:bg-sand"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-tint text-accent">
                      <Icon name={intent.icon} />
                    </span>
                    <span className="flex-1 font-semibold">{intent.label}</span>
                    <ArrowRight className="size-4 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden="true" />
                  </Link>
                </li>
              ))}
              <li className="mt-1 border-t border-line">
                <Link href="/careers" className="group flex items-center gap-4 rounded-xl px-4 py-3.5 transition-colors hover:bg-sand">
                  <span className="flex-1 text-ink-soft">
                    I&apos;m a job seeker<span className="text-muted">: see openings</span>
                  </span>
                  <ArrowUpRight className="size-4 text-muted group-hover:text-accent" aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </section>

      {/* Facts strip: verifiable statements only */}
      <section aria-label="About OmniGroup HR" className="border-b border-line bg-paper">
        <ul className="container-page grid gap-6 py-8 text-ink-soft sm:grid-cols-3">
          {[
            "Virtual assistant, HR, recruitment and workplace support from one partner",
            "Specialist recruitment across engineering, energy, infrastructure, finance and HR",
            `Based in ${site.contact.address.city}, Virginia, supporting U.S. organizations`,
          ].map((fact) => (
            <li key={fact} className="flex gap-3">
              <Check className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      </section>

      <TrustedBy />

      {/* Services */}
      <Section labelledBy="services-heading">
        <SectionHeading
          id="services-heading"
          eyebrow="Our services"
          title="Support across your whole workforce"
          lead="Use one service or combine several. Each is tailored to your goals, values and the way your organization works."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <Link
            href="/virtual-assistant-services"
            className="group on-navy relative flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-navy p-7 text-on-navy shadow-lift md:p-9 lg:row-span-2"
          >
            <div className="relative -mx-7 -mt-7 mb-7 aspect-[16/9] md:-mx-9 md:-mt-9">
              <Image
                src="/images/va/flexible-support.webp"
                alt="Laptop open on a wooden desk beside a potted plant and notebooks"
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
            <span className="flex size-12 items-center justify-center rounded-xl bg-navy-raised text-highlight">
              <Icon name="assistant" className="size-6" />
            </span>
            <p className="eyebrow mt-8">Featured service</p>
            <h3 className="mt-3 text-3xl leading-tight md:text-4xl">{va.name}</h3>
            <p className="mt-4 leading-relaxed text-on-navy-muted">{va.lead}</p>
            <ul className="mt-6 grid gap-2 text-[0.9375rem]">
              {va.offerings.items.map((o) => (
                <li key={o.title} className="flex gap-2.5">
                  <Check className="mt-0.5 size-4 shrink-0 text-highlight" aria-hidden="true" />
                  {o.title}
                </li>
              ))}
            </ul>
            <span className="mt-auto inline-flex items-center gap-2 pt-8 font-semibold text-highlight">
              Explore VA services <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </Link>
          <ServiceLinkCard
            slug="staffing-recruitment"
            image={{ src: "/images/home/signing-document.webp", alt: "Close-up of a hand signing a document with a pen" }}
          />
          <ServiceLinkCard slug="hr-services" image={{ src: "/images/industries/hr-services.webp", alt: "", contain: true }} />
          <ServiceLinkCard
            slug="leadership-development"
            image={{ src: "/images/about/modern-office-view.webp", alt: "Empty modern office with desks overlooking a city skyline" }}
          />
          <ServiceLinkCard
            slug="mediation-workplace-support"
            image={{ src: "/images/home/business-handshake.webp", alt: "Two people in business suits shaking hands" }}
          />
        </div>
      </Section>

      {/* Industries */}
      <Section tone="sand" labelledBy="industries-heading">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <SectionHeading
              id="industries-heading"
              eyebrow="Industry expertise"
              title="Specialist talent for complex industries"
              lead="We connect organizations with specialized professionals and support complex hiring needs."
            />
            <Link href="/industries" className="btn btn-secondary mt-8">
              Explore industries
            </Link>
          </div>
          <ul className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2">
            {industries.map((ind) => (
              <li key={ind.id} className="bg-white p-6">
                <Image src={ind.image} alt="" width={1200} height={1698} className="mb-4 size-14 rounded-lg object-cover" />
                <h3 className="font-sans text-lg font-semibold tracking-normal">
                  <Link href={`/industries#${ind.id}`} className="hover:text-accent">
                    {ind.name}
                  </Link>
                </h3>
                <p className="mt-2 text-muted">{ind.summary}</p>
              </li>
            ))}
            <li className="bg-white p-6">
              <h3 className="font-sans text-lg font-semibold tracking-normal">
                <Link href="/staffing-recruitment" className="hover:text-accent">
                  Trades &amp; skilled labor
                </Link>
              </h3>
              <p className="mt-2 text-muted">Skilled trades and labor sourced and placed to help you meet project deadlines.</p>
            </li>
          </ul>
        </div>
      </Section>

      {/* How it works */}
      <Section tone="navy" labelledBy="how-heading">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <SectionHeading
            id="how-heading"
            eyebrow="How it works"
            title="A clear process from first conversation to results"
            lead="Whatever the service, every engagement starts with understanding your organization."
          />
          <Image
            src="/images/va/streamlined-process.webp"
            alt="Smiling professional taking notes at her desk"
            width={1200}
            height={800}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="aspect-[3/2] w-full rounded-[var(--radius-card)] object-cover object-[60%_30%]"
          />
        </div>
        <ProcessSteps steps={engagementSteps} />
      </Section>

      {/* Why */}
      <Section labelledBy="why-heading">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <SectionHeading
              id="why-heading"
              eyebrow="Why OmniGroup HR"
              title="HR that drives growth, not just support"
              lead="We believe HR should be a strategic contributor to business growth. That philosophy shapes how we work with every client."
            />
            <Link href="/about" className="text-link mt-8 inline-block">
              More about our approach
            </Link>
            <Image
              src="/images/home/our-philosophy.webp"
              alt="Boardroom table laid out with printed reports and a tablet showing growth charts"
              width={1200}
              height={800}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="mt-10 aspect-[3/2] w-full rounded-[var(--radius-card)] object-cover"
            />
          </div>
          <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {differentiators.map((d) => (
              <li key={d.title} className="border-t-2 border-accent pt-5">
                <h3 className="font-sans text-lg font-semibold tracking-normal">{d.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{d.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Testimonials />

      {/* Paths */}
      <Section tone="sand" labelledBy="paths-heading">
        <h2 id="paths-heading" className="sr-only">
          Get started
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="card flex flex-col overflow-hidden p-8 md:p-10">
            <div className="relative -mx-8 -mt-8 mb-8 aspect-[16/9] md:-mx-10 md:-mt-10">
              <Image
                src="/images/home/business-handshake.webp"
                alt="Two people in business suits shaking hands"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <p className="eyebrow">For employers</p>
            <h3 className="mt-3 text-3xl">Find talent or support</h3>
            <p className="mt-3 flex-1 text-lg text-muted">
              Tell us what your organization needs, whether that&apos;s a virtual assistant, a specialist hire or HR guidance, and we&apos;ll arrange a
              conversation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-primary">
                Request a consultation
              </Link>
              <Link href="/staffing-recruitment#enquire" className="btn btn-secondary">
                Request talent
              </Link>
            </div>
          </div>
          <div className="card flex flex-col overflow-hidden p-8 md:p-10">
            <div className="relative -mx-8 -mt-8 mb-8 aspect-[16/9] md:-mx-10 md:-mt-10">
              <Image
                src="/images/careers/woman-using-laptop.webp"
                alt="Woman talking on the phone while working on a laptop"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover object-right"
              />
            </div>
            <p className="eyebrow">For job seekers</p>
            <h3 className="mt-3 text-3xl">Start your next role</h3>
            <p className="mt-3 flex-1 text-lg text-muted">
              We recruit for professional and non-professional opportunities. See current openings and apply online.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/careers" className="btn btn-secondary">
                View openings
              </Link>
              <Link href="/careers/apply" className="btn btn-secondary">
                Apply now
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section labelledBy="faq-heading">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
          <SectionHeading id="faq-heading" eyebrow="FAQ" title="Common questions" />
          <FaqList faqs={homeFaqs} />
        </div>
      </Section>

      <CtaBand
        title="Ready to talk about your needs?"
        body="Tell us what you're working on and we'll recommend the right support, whether that's a virtual assistant, a new hire or HR guidance."
        primary={{ label: "Request a consultation", href: "/contact" }}
        secondary={{ label: "Explore VA services", href: "/virtual-assistant-services" }}
      />
    </>
  );
}
