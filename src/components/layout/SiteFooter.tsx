import Link from "next/link";
import type { ReactNode } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Brand, VeteranBadge } from "@/components/Brand";
import { LazyLeadForm } from "@/components/forms/LazyLeadForm";
import { footerNav, site } from "@/content/site";

/** Brand marks (lucide-react 1.x ships none). 24x24 viewBox, drawn in currentColor. */
const socialIcons: Record<(typeof site.social)[number]["label"], ReactNode> = {
  LinkedIn: (
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
  ),
  Facebook: (
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.026 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971H15.83c-1.491 0-1.956.93-1.956 1.886v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
  ),
  Instagram: (
    <g fill="none" stroke="currentColor" strokeWidth="2.25">
      <rect x="1.5" y="1.5" width="21" height="21" rx="6" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="18.25" cy="5.75" r="0.6" fill="currentColor" />
    </g>
  ),
};

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
                <a href={`tel:${contact.phoneE164}`} data-track-location="footer" className="flex items-center gap-3 hover:text-highlight">
                  <Phone className="size-4 text-highlight" aria-hidden="true" />
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} data-track-location="footer" className="flex items-center gap-3 hover:text-highlight">
                  <Mail className="size-4 text-highlight" aria-hidden="true" />
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-on-navy-muted">
                <MapPin className="mt-0.5 size-4 shrink-0 text-highlight" aria-hidden="true" />
                <address className="not-italic">
                  {contact.address.street}, {contact.address.city}, {contact.address.region} {contact.address.postalCode}
                </address>
              </li>
            </ul>
            <h2 className="mt-10 font-sans text-sm font-semibold uppercase tracking-[0.08em] text-highlight">Business credentials</h2>
            {/* White plate: the JPG has a white background that would otherwise show as a box on navy. */}
            <div className="mt-4 inline-block rounded-[var(--radius-card)] bg-white p-3">
              <VeteranBadge className="h-32 sm:h-36" />
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {footerNav.map((group) => (
              <nav key={group.heading} aria-label={`Footer ${group.heading.toLowerCase()}`}>
                <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.08em] text-highlight">{group.heading}</h2>
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
          <ul className="flex gap-2" aria-label="Social media">
            {site.social.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="flex size-11 items-center justify-center rounded-full transition-colors hover:bg-navy-raised hover:text-on-navy"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-5">
                    {socialIcons[s.label]}
                  </svg>
                  <span className="sr-only">
                    {site.name} on {s.label} (opens in a new tab)
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
