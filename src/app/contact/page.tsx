import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { Icon } from "@/components/Icon";
import { LeadForm } from "@/components/forms/LeadForm";
import { PageHero, Section } from "@/components/sections";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact Us & Request a Consultation",
  description:
    "Contact OmniGroup HR to request a consultation about virtual assistant services, staffing and recruitment, HR support, leadership development or workplace mediation.",
  path: "/contact",
});

const routes = [
  { label: "Virtual assistant support", body: "Dedicated VA enquiry form", href: "/virtual-assistant-services#enquire", icon: "assistant" as const },
  { label: "Hiring or staffing", body: "Request talent for a role", href: "/staffing-recruitment#enquire", icon: "recruitment" as const },
  { label: "Looking for a job", body: "View openings and apply", href: "/careers", icon: "people" as const },
];

const nextSteps = [
  "We review your enquiry and match it to the right member of our team.",
  "We contact you using your preferred method to understand your needs.",
  "If we're a good fit, we'll recommend next steps.",
];

export default function ContactPage() {
  const { contact } = site;
  return (
    <>
      <PageHero
        crumbs={[{ name: "Contact", path: "/contact" }]}
        eyebrow="Contact us"
        title="Request a consultation"
        lead="Tell us what your organization needs and we'll arrange a conversation. If you know exactly what you're looking for, a dedicated form below will get you to the right person faster."
      />

      <Section className="!pt-12">
        <h2 className="sr-only">Choose the right enquiry</h2>
        <ul className="grid gap-4 md:grid-cols-3">
          {routes.map((r) => (
            <li key={r.href}>
              <Link href={r.href} className="group card flex h-full items-center gap-4 p-5 hover:shadow-lift">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-tint text-accent">
                  <Icon name={r.icon} />
                </span>
                <span className="flex-1">
                  <span className="block font-semibold group-hover:text-accent">{r.label}</span>
                  <span className="block text-sm text-muted">{r.body}</span>
                </span>
                <ArrowRight className="size-4 text-muted group-hover:text-accent" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl">General enquiry</h2>
              <p className="mt-3 text-ink-soft">For HR services, leadership development, mediation or anything else.</p>
            </div>
            <div>
              <h3 className="font-sans text-sm font-semibold uppercase tracking-[0.08em] text-muted">Contact details</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href={`tel:${contact.phoneE164}`} data-track-location="contact-page" className="flex items-center gap-3 text-lg font-semibold hover:text-accent">
                    <Phone className="size-5 text-accent" aria-hidden="true" /> {contact.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${contact.email}`} data-track-location="contact-page" className="flex items-center gap-3 text-lg font-semibold hover:text-accent">
                    <Mail className="size-5 text-accent" aria-hidden="true" /> {contact.email}
                  </a>
                </li>
                <li className="flex items-start gap-3 text-ink-soft">
                  <MapPin className="mt-1 size-5 shrink-0 text-accent" aria-hidden="true" />
                  <address className="not-italic">
                    {contact.address.street}
                    <br />
                    {contact.address.city}, {contact.address.region} {contact.address.postalCode}
                  </address>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-sans text-sm font-semibold uppercase tracking-[0.08em] text-muted">What happens next</h3>
              <ol className="mt-4 space-y-3">
                {nextSteps.map((s, i) => (
                  <li key={s} className="flex gap-3 text-ink-soft">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-tint text-sm font-semibold text-accent">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="card p-6 md:p-9">
            <LeadForm formKey="business" prefillFromQuery={["service"]} />
          </div>
        </div>
      </Section>
    </>
  );
}
