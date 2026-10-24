import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Brand } from "@/components/Brand";
import { LazyLeadForm } from "@/components/forms/LazyLeadForm";
import { footerNav, site } from "@/content/site";

const newsletterEnabled = process.env.NEXT_PUBLIC_NEWSLETTER_ENABLED === "true";

export function SiteFooter() {
  const { contact } = site;
  return (
    <footer className="on-navy bg-navy text-on-navy">
      <div className="container-page py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div className="max-w-sm">
            <Brand tone="light" />
            <p className="mt-5 leading-relaxed text-on-navy-muted">
              Virtual assistant services, HR support, specialist recruitment and workplace solutions for organizations that want
              to operate efficiently and grow with confidence.
            </p>
            <ul className="mt-8 space-y-3 text-[0.9375rem]">
              <li>
                <a href={`tel:${contact.phoneE164}`} data-track-location="footer" className="flex items-center gap-3 hover:text-brass">
                  <Phone className="size-4 text-brass" aria-hidden="true" />
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} data-track-location="footer" className="flex items-center gap-3 hover:text-brass">
                  <Mail className="size-4 text-brass" aria-hidden="true" />
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-on-navy-muted">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brass" aria-hidden="true" />
                <address className="not-italic">
                  {contact.address.street}, {contact.address.city}, {contact.address.region} {contact.address.postalCode}
                </address>
              </li>
            </ul>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {footerNav.map((group) => (
              <nav key={group.heading} aria-label={`Footer ${group.heading.toLowerCase()}`}>
                <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.08em] text-brass">{group.heading}</h2>
                <ul className="mt-3 space-y-1 text-[0.9375rem]">
                  {group.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link href={link.href} className="inline-block py-1.5 text-on-navy-muted transition-colors hover:text-on-navy">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {newsletterEnabled && (
          <div className="mt-14 grid gap-6 rounded-[var(--radius-card)] border border-navy-line bg-navy-raised p-6 md:grid-cols-[1fr_1.4fr] md:p-8">
            <div>
              <h2 className="text-2xl">Stay up to date</h2>
              <p className="mt-2 text-on-navy-muted">Occasional updates from OmniGroup HR. No spam — unsubscribe any time.</p>
            </div>
            <LazyLeadForm formKey="newsletter" variant="compact" />
          </div>
        )}

        <div className="mt-14 flex flex-col gap-4 border-t border-navy-line pt-8 text-sm text-on-navy-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {process.env.NEXT_PUBLIC_BUILD_YEAR} {site.name}. {site.parentStatement}.
          </p>
          <ul className="flex gap-5" aria-label="Social media">
            {site.social.map((s) => (
              <li key={s.href}>
                <a href={s.href} rel="noopener noreferrer" target="_blank" className="inline-block py-1.5 hover:text-on-navy">
                  {s.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
