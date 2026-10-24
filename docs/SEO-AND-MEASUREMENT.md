# SEO, conversion and measurement

## Page-to-intent map

Each indexable page targets one distinct intent. The keywords below are **seed themes, not validated targets**. No search-volume or difficulty data was available during the build.

Before finalising titles and descriptions, validate them in Google Search Console (after launch) and a keyword tool (Semrush, Ahrefs or Google Keyword Planner). Decide geographic targeting with the client first: nationwide U.S., Virginia / Hampton Roads, or both.

| Page | Primary intent | Seed themes |
| --- | --- | --- |
| `/` | Brand + overview | OmniGroup HR, HR and staffing services, virtual assistant and HR services |
| `/virtual-assistant-services` | Hire VA support (commercial) | virtual assistant services for businesses, executive virtual assistant services, remote administrative support |
| `/hr-services` | HR consulting (commercial) | HR consulting services, HR policy development, small business HR support |
| `/staffing-recruitment` | Employer hiring (commercial) | staffing and recruitment services, executive search services, contract staffing, skilled trades staffing |
| `/leadership-development` | Coaching / L&D (commercial) | executive coaching services, leadership training for managers |
| `/mediation-workplace-support` | Dispute support (commercial) | workplace mediation services, workplace conflict resolution |
| `/industries` | Sector recruiting | engineering recruitment, oil and gas recruitment, infrastructure recruitment, finance recruitment |
| `/careers`, `/careers/apply` | Job seekers | OmniGroup HR jobs, virtual assistant jobs |
| `/about`, `/contact` | Navigational | — |

## Technical SEO

Implemented and verified by `npm run check:links` against a production build, both under Node and inside the Workers runtime:

- **Titles and descriptions:** every page has a unique `<title>` and a unique meta description of 70–160 characters.
- **Headings:** exactly one `<h1>` per page, and no skipped heading levels.
- **Canonical URLs:** absolute canonicals on every page, built from `NEXT_PUBLIC_SITE_URL`.
- **Social metadata:** Open Graph and Twitter tags, plus a generated 1200×630 share image.
- **Structured data (JSON-LD), using only facts visible on the page:**
  - `Organization` on every page
  - `Service` on each service page
  - `BreadcrumbList` on inner pages
  - No review ratings, aggregate scores or `FAQPage` markup were added. Google now limits FAQ rich results to authoritative government and health sites.
- **`sitemap.xml`:** generated, and the checker cross-checks it against the crawlable pages.
- **`robots.txt`:**
  - Production allows crawling, disallows `/api/` and points to the sitemap.
  - Non-production builds disallow everything and add `noindex` metadata.
- **Staging protection:** `X-Robots-Tag: noindex` is sent on any host other than the production host, which covers `*.workers.dev` and preview URLs.
- **Legacy redirects:** 308 redirects from old URLs; the apex domain redirects to `www`.
- **404 page:** a custom 404 that returns HTTP 404.
- **Rendering:** every page is static, so crawlers receive full HTML with no client-side rendering.

## Performance and accessibility (measured)

Lighthouse 12 results on a local production build. On this machine the CPU benchmark index was about 700, which Lighthouse classes as a slow machine. Its mobile figures here are pessimistic and should be re-measured after deployment.

| Page | Desktop perf | Mobile perf (4× CPU throttle) | Accessibility | Best practices | CLS |
| --- | --- | --- | --- | --- | --- |
| Home | 100 | 71 | 100 | 100 | 0 |
| VA services | 99 | 69 | 100 | 100 | 0 |
| Contact, Apply | — | 61–65 (earlier run) | 100 | 100 | 0 |

The Lighthouse SEO category scores 66 locally only because `localhost` correctly receives `X-Robots-Tag: noindex`. On the production hostname that audit passes.

**JavaScript:** about 181 KB gzipped on pages without a form, most of it the React and Next.js runtime. Form pages add about 37 KB for validation and Turnstile.

**Mobile layout:** checked at 390 px on all 15 routes with no horizontal overflow.

**Accessibility checks:**

- Skip link and visible focus states.
- Labelled fields, with errors linked through `aria-describedby`.
- On a failed submit, focus moves to the first invalid field; after success, to the confirmation message.
- Reduced-motion support.
- Colour contrast meets AA. Body muted text is about 5.8:1 and the accent colour about 6.2:1.

## After launch

1. **Search Console:**
   - Verify `https://www.omnigrouphr.com` with a Domain property via DNS TXT.
   - Submit `sitemap.xml`.
   - Request indexing for the homepage and the five service pages.
2. **URL inspection:** use it on a few pages to confirm Google renders the content and the canonical is accepted.
3. **Rich Results Test:** run https://search.google.com/test/rich-results on `/` and `/virtual-assistant-services`.
4. **PageSpeed Insights:** run it on the live URLs for field-representative mobile scores.
5. **Coverage:** after 2–4 weeks, review Search Console coverage for old Wix URLs returning 404 and add redirects where needed.
6. **Bing Webmaster Tools:** import from Search Console.
7. **Google Business Profile:** if OmniGroup HR has or wants one, keep its name, address and phone identical to the website footer.

## Analytics and conversion events

`src/lib/analytics.ts` sends events to Plausible, if `NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC` is set, and to `window.dataLayer`. Lead events fire **only after the server confirms delivery**; button clicks never count as leads. This was checked end to end in a browser.

| Event | When it fires | Props |
| --- | --- | --- |
| `Lead: VA Consultation` | VA form delivered | form, page, detail (support type) |
| `Lead: Staffing Request` | Talent request delivered | form, page, detail (role category) |
| `Lead: Business Enquiry` | General / HR / leadership / mediation enquiry delivered | form, page, detail (service) |
| `Candidate: Application Submitted` | Application delivered | form, page, detail (position) |
| `Newsletter: Subscribed` | Provider confirmed subscription | form, page |
| `Contact: Click to Call` | `tel:` link clicked (intent, not a lead) | location, page |
| `Contact: Email Click` | `mailto:` link clicked (intent, not a lead) | location, page |

In Plausible, add these as custom-event goals, and use the `page` property to see which landing page produced each lead.

**Channel attribution:** Plausible records the referrer and UTM source automatically. Tag campaign links with `utm_source`, `utm_medium` and `utm_campaign`.

**Lead quality:** lead emails include the submission page. Record in the CRM which leads became qualified opportunities, then compare that against landing pages each month. Volume alone is not the goal.

## Content plan

Publish articles only once OmniGroup HR can review them for accuracy. Each piece should answer a real prospect question and link to the matching service page:

1. *What tasks can a virtual assistant handle for a growing business?* → VA services
2. *Virtual assistant vs. part-time employee: how to decide* → VA services
3. *How to prepare for a staffing engagement: what recruiters need from you* → Staffing & recruitment
4. *Contract staffing vs. direct hire for project-based work* → Staffing & recruitment
5. *When to bring in a workplace mediator* → Mediation
6. *Updating your employee handbook as your company grows* → HR services

When the first articles are approved, add an `/insights` section with MDX or a lightweight CMS, plus `Article` structured data. It was not built now, to avoid publishing an empty section.

## A/B testing ideas

Run these only once traffic supports significance; nothing here has been measured yet.

- Homepage hero: the current "people and support" headline vs. a VA-led headline.
- Hero router card vs. a single CTA.
- VA form: current fields vs. a shorter version without workload and start date.
- Contact page: dedicated-form tiles above the general form vs. below it.
