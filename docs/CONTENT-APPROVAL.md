# Content approval checklist

The new site's copy is based on the previous public website and was reviewed on 24 October 2026:

- home
- Virtual Assistant Services
- Our Services
- About Us
- Clients
- Careers
- Apply Now
- Contact Us
- Privacy Policy
- EEO Statement

**OmniGroup HR must confirm each item below before launch.** Where information was missing, it was left out rather than invented.

Edit the copy in `src/content/` (see README) and the legal pages in `src/app/privacy-policy` and `src/app/eeo-statement`.

## Brand

- [x] Logo: the existing website's logo is used, as instructed on 27 Oct 2026.
- [x] Brand colours: the existing website's colours are used (`src/app/globals.css`).
- [ ] Typography. The site keeps its own fonts (Newsreader headings, Geist body); the old site used Montserrat. Confirm or request a switch.
- [ ] Photography. None is used. If photos are added, use approved company photos or licensed stock. Do not present stock images as real staff, clients or offices.

## Company facts (`src/content/site.ts`)

- [ ] Email: `hr@omnigrouphr.com`
- [ ] Phone: (757) 986-9846
- [ ] Address: 739 High St, Portsmouth, VA 23704. Should it be published, and used in Organization structured data?
- [ ] Legal entity: "Omnicruit LLC" (named in the old privacy policy and EEO statement)
- [ ] Relationship statement: "An Omnicruit International company" (shown in the footer and on the About page)
- [ ] Social accounts: LinkedIn, Facebook and Instagram, as linked in the old footer.
  - The old header also linked to **Wix Studio's** social accounts, which looks like a template leftover. These were not carried over.
- [ ] Geographic coverage. Copy says "U.S. organizations" and mentions cross-border recruitment support. Confirm the target markets.

## Services (`src/content/services.ts`)

### Virtual assistant services

- [ ] The six VA categories are as listed on the old site:
  - Executive support
  - Calendar management
  - Social media & inbox management
  - CRM & data management
  - Operations & project coordination
  - Customer service support
- [ ] The old VA page had two cards both titled "Calendar Management" and one titled "Customer Service Report". These were corrected to "Social media & inbox management" and "Customer service support", based on the card descriptions. Confirm.
- [ ] Engagement steps: consultation → scope and match → onboarding → ongoing support. The old "How it works" section was image-only, so these steps were written fresh.
- [ ] Working hours, time zones, part-time or full-time options, pricing, minimum engagement, screening and onboarding process, and confidentiality and data-access practices.
  - **None of these are published.** The page says they are "agreed during scoping".
  - Add specifics only once confirmed.

### Other services

- [ ] HR services scope: policy development, compliance guidance, workforce alignment and organizational structure.
- [ ] Staffing & recruitment scope:
  - Executive search and placement
  - Contract staffing
  - Specialist and technical recruitment
  - Trades and skilled labor
  - Cross-border recruitment
  - VA placement
- [ ] Leadership development: executive coaching, leadership training, organizational development and custom HR policies. This combines the old "Executive Coaching" and "Organizational Development & Leadership Training" sections.
- [ ] Mediation:
  - Mediator qualifications and any jurisdictional limits.
  - Whether mediation is offered only to organizations or also to individuals.
  - The page includes a "not legal advice / no guaranteed outcome" note.
- [ ] Process steps and FAQ answers on every service page. These describe a typical engagement and need confirming.

## Industries (`src/content/industries.ts`)

- [ ] Industry list and example roles: engineering, oil & gas, infrastructure, finance and HR, as on the old About page.
- [ ] Individual industry landing pages were **not** created; there was not yet enough distinct content to justify them.
  - Supply sector specifics (certifications, typical projects, regions, example placements) to justify separate pages.

## About (`src/app/about/page.tsx`)

- [ ] Tim Armstrong: CEO & Founder. Confirm title and biography.
- [ ] Patricia Depra: Operations Manager. Confirm title and biography.
- [ ] Headshots: none used. Supply approved photos if wanted.
- [ ] **"Combined 90+ years of leadership experience"** is **not published** until verified.

## Clients and proof

- [ ] The old Clients page named the **City of Richmond** and the **City of Virginia Beach** and showed several logos.
  - **None of this is published.** `/clients` redirects to `/about`.
  - To publish client names, logos, case studies or testimonials, provide written permission and the approved wording. Testimonials go in `src/content/home.ts`.
- [ ] Any awards, certifications, memberships or statistics to add as trust signals.

## Careers (`src/content/careers.ts`)

- [ ] Five openings were copied from the old careers page:
  - Virtual Assistant
  - Contracts Administrator
  - Subcontracts Administrator
  - Event Setup Crew / Staff
  - Maintenance Worker
- [ ] **Remove any that are no longer open.**
- [ ] Should job-posting structured data (Google for Jobs) be added? It needs date posted, closing date, employment type and pay details.
- [ ] Who receives applications? Set `CAREERS_TO_EMAIL`.
- [ ] Candidate data retention period.

## Legal

- [x] **Privacy Policy** and **EEO Statement** are the existing website's text, unchanged, as instructed on 27 Oct 2026.
- [ ] Optional: ask legal counsel whether the privacy policy should mention the new site's spam-protection check (Cloudflare Turnstile) and any analytics added later. It currently covers these only under "third-party service providers".
- [ ] Cookie or consent banner. Not needed with the current setup (no advertising cookies, cookieless analytics). Revisit if GA4 or ad pixels are added.

## Operations

- [ ] Lead notification recipients (`LEAD_TO_EMAIL`) and response-time expectations, so the "what happens next" copy is accurate.
- [ ] CRM in use, if any. `LEAD_WEBHOOK_URL` can forward every lead.
- [ ] Newsletter:
  - Is there a real newsletter and provider? It is hidden until `NEXT_PUBLIC_NEWSLETTER_ENABLED=true` and `NEWSLETTER_WEBHOOK_URL` are set.
  - Its consent wording.
- [ ] Analytics provider and any consent requirements.
- [ ] Any public pricing or consultation policy.
