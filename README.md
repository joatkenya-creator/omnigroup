# OmniGroup HR website

Marketing and lead-generation website for OmniGroup HR. It covers virtual assistant services, HR services, staffing and recruitment, leadership development, workplace mediation and careers.

- **Stack:** Next.js 16 (App Router, TypeScript), React 19, Tailwind CSS v4, zod.
- **Hosting:** Cloudflare Workers via the [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare).
- **Rendering:** every page is prerendered at build time. The root layout sets `ensureStatic = 'navigation'`, so the build fails if a page starts doing request-time work. Only `/api/forms/[form]` runs on demand.

| Document | Purpose |
| --- | --- |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Cloudflare architecture, environment variables, deploy, domain and DNS |
| [docs/CONTENT-APPROVAL.md](docs/CONTENT-APPROVAL.md) | Business facts and copy that OmniGroup HR must confirm before launch |
| [docs/SEO-AND-MEASUREMENT.md](docs/SEO-AND-MEASUREMENT.md) | Keyword map, technical SEO, analytics events, post-launch checks |
| [docs/omnigrouphr_website_redevelopment_brief.md](docs/omnigrouphr_website_redevelopment_brief.md) | Original redevelopment brief (business requirements source) |

## Getting started

Requires Node.js 22 or later.

```bash
npm install
cp .env.example .env.local     # fill in values as needed; all are optional locally
npm run dev                    # http://localhost:3000
```

Forms work locally without credentials. They return a clear "not configured" error rather than a fake success. To test delivery locally, set `RESEND_API_KEY`, `LEAD_FROM_EMAIL` and `LEAD_TO_EMAIL`, or `LEAD_WEBHOOK_URL`, in `.env.local`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run build` | Production Next.js build (validates static rendering) |
| `npm start` | Serve the production build with Node (for local QA) |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generate route types and run `tsc` |
| `npm test` | Unit and integration tests (Vitest) |
| `npm run check:links -- <url>` | Crawl a running build and check links, anchors, redirects, metadata, sitemap and JSON-LD |
| `npm run preview` | Build for Cloudflare and run the Worker locally in `workerd` |
| `npm run deploy` | Build and deploy to Cloudflare (requires `wrangler login`) |
| `npm run cf-typegen` | Generate `CloudflareEnv` binding types |

## Project structure

```
src/
  app/                    Routes (one folder per URL), sitemap, robots, OG image
    api/forms/[form]/     POST endpoint for every form
  components/
    Brand.tsx             Logo — the only place the logo renders
    ServicePage.tsx       Template used by all five service pages
    sections.tsx          Hero, section, grid, process, FAQ, CTA, breadcrumbs…
    forms/                LeadForm (client), Field, Turnstile, LazyLeadForm
    layout/               Header/nav, footer, analytics loader
  content/                All business copy and facts (typed, no JSX)
  lib/
    forms/                Form definitions + shared client/server validation
    server/               Submission pipeline, delivery (Resend/webhook), guards
    seo.ts                Metadata helper and JSON-LD builders
    analytics.ts          Provider-agnostic `track()`
scripts/check-links.mjs   Post-build crawler / SEO checker
```

## Editing content

Copy lives in `src/content/`, separate from layout:

- `site.ts`: company name, contact details, address, social links and navigation.
- `services.ts`: each service's headline, offerings, process, FAQs and form. Adding a service needs an entry here, a route folder under `src/app/<slug>/page.tsx` (copy an existing one), and a sitemap entry in `src/app/sitemap.ts`.
- `industries.ts`, `careers.ts` and `home.ts`: industries, job openings, differentiators, homepage FAQs and testimonials.

Items marked `CONFIRM` came from the previous website and need client sign-off. See [docs/CONTENT-APPROVAL.md](docs/CONTENT-APPROVAL.md).

**Testimonials** go in `src/content/home.ts`. The section stays hidden while the list is empty. Add only real, attributable quotes the client has permission to publish.

**Job openings** are in `src/content/careers.ts`. Remove filled roles. If the list is empty, the careers page shows a general-application option instead.

## Logo and brand colours

The logo and colours come from the existing omnigrouphr.com website.

- `public/brand/omnigroup-hr-logo.png` is the horizontal logo (white PNG). `src/components/Brand.tsx` uses it as a CSS mask, so it shows in brand blue on light backgrounds and white on navy. The header and footer both use this component.
- `src/app/icon.png` and `src/app/apple-icon.png` are the favicons, made from the square logo.
- `src/app/opengraph-image.tsx` builds the social-sharing image from the same logo.
- Brand colours are the `@theme` tokens in `src/app/globals.css`: logo blue `#23398E`, deep navy `#22274F` and light blue `#9BBDFF`. Change colours there only.

## Forms and lead delivery

All forms (business enquiry, VA enquiry, talent request, job application, newsletter) are defined once in `src/lib/forms/definitions.ts`. That one definition drives the rendered fields, client-side validation, server-side validation and the formatted lead email.

The submission pipeline is in `src/lib/server/submit.ts`. It runs these steps in order:

1. **Rate limit** per IP, using the Cloudflare Rate Limiting binding.
2. **Honeypot field and minimum fill time** to catch simple bots.
3. **Cloudflare Turnstile** verification, when `TURNSTILE_SECRET_KEY` is set.
4. **Schema validation** of all fields.
5. **File checks** for CV uploads: extension, size and file-signature.
6. **Delivery** via Resend email and/or a CRM webhook.

CVs are attached to the recruitment email and never stored on, or served from, the website.

The response is always honest:

| Outcome | HTTP status |
| --- | --- |
| Delivered | 200 |
| No delivery channel configured | 503 `not_configured` |
| Provider error | 502 |

The UI shows the phone number and email address as a fallback whenever delivery fails.

Analytics conversion events fire only after the server confirms delivery.

## Testing

```bash
npm run lint && npm run typecheck && npm test && npm run build
npm start &                                   # then:
npm run check:links -- http://localhost:3000
```
