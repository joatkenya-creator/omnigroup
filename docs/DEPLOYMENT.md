# Deployment: Cloudflare Workers

## Architecture decision

Cloudflare documents two ways to run Next.js on Workers (checked 24 October 2026):

| Option | Status | Decision |
| --- | --- | --- |
| **vinext** (`@vinext/cloudflare`) | Cloudflare's new default, but **beta**. It reimplements the Next.js API on Vite. | Not used. A beta reimplementation is too risky for a production client site. Re-evaluate once it is stable. |
| **OpenNext** (`@opennextjs/cloudflare`) | Supports Next.js 16, App Router, route handlers, SSG and middleware. Uses the real Next.js build. | **Used.** |

`@cloudflare/next-on-pages` is not used; it has been superseded.

### How the site runs on Cloudflare

- **Pages:** all are prerendered at build time.
  - `open-next.config.ts` uses OpenNext's static-assets incremental cache, so prerendered HTML is served from Workers static assets.
  - No R2 bucket, KV namespace or Durable Object is needed.
  - There is no ISR or revalidation; content changes ship with a new deploy.
- **Forms:** `/api/forms/[form]` runs in the Worker. Delivery uses `fetch` to Resend and/or a webhook, so no SDK is needed.
- **Rate limiting:** the `FORM_RATE_LIMITER` Workers Rate Limiting binding (5 requests per 60 s per IP per form), declared in `wrangler.jsonc`.
- **Images:** the site uses no raster images, so Next image optimisation and the Cloudflare `IMAGES` binding are not configured. If photography is added with `next/image`, configure the binding first: https://opennext.js.org/cloudflare/howtos/image
- **Static assets:** `public/_headers` makes `/_next/static/*` immutable for one year.
- **Worker size:** measured at **2.04 MiB gzipped** with `wrangler deploy --dry-run`. This fits the Free plan limit (3 MiB); the Paid plan limit is 10 MiB.

### Verified locally (24 Oct 2026)

These steps succeeded on Windows 10:

- `opennextjs-cloudflare build`
- `opennextjs-cloudflare preview`, which runs the Worker in `workerd`. In it:
  - All 14 pages crawled successfully.
  - Legacy redirects worked.
  - Security headers were present.
  - The rate-limit binding returned 429 after 5 requests.

OpenNext does not officially guarantee Windows builds. If a future build fails on Windows, build in WSL or let Cloudflare Workers Builds (Linux) build it.

## 1. One-time Cloudflare setup

1. Have a Cloudflare account, ideally the one that will own `omnigrouphr.com`.
2. Log in:
   ```bash
   npx wrangler login
   ```
3. **Turnstile** (spam protection). In the dashboard, go to Turnstile → Add widget.
   - Hostnames: `www.omnigrouphr.com`, `omnigrouphr.com`, plus any staging hostname.
   - Mode: Managed.
   - Keep the site key and the secret key for the next steps.
4. **Resend** (lead email delivery). Create an account and verify the sending domain, e.g. `omnigrouphr.com`, by adding the DNS records Resend gives you. Then create an API key with send-only access.
   - Any provider with an HTTP API could be substituted by editing `src/lib/server/delivery.ts`.

## 2. Environment variables

`.env.example` lists every variable.

There are two kinds:

- **Build-time (`NEXT_PUBLIC_*`):** inlined into the build. Set them where the build runs, i.e. Workers Builds → *Build variables*, or your shell or CI.
- **Runtime secrets:** read by the Worker at request time. Set them as Worker secrets.

| Variable | Kind | Required for launch |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | build | Yes: `https://www.omnigrouphr.com` |
| `NEXT_PUBLIC_SITE_ENV` | build | Yes: `production` for the live site, anything else for staging (noindex) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | build | Yes |
| `NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC` | build | Optional (analytics) |
| `NEXT_PUBLIC_CF_BEACON_TOKEN` | build | Optional (Cloudflare Web Analytics) |
| `NEXT_PUBLIC_NEWSLETTER_ENABLED` | build | Only if a newsletter provider is configured |
| `TURNSTILE_SECRET_KEY` | secret | Yes |
| `RESEND_API_KEY` | secret | Yes, unless leads go only to a webhook. Always required for job applications, because CVs are emailed. |
| `LEAD_FROM_EMAIL` | secret / var | Yes, a sender on the verified domain |
| `LEAD_TO_EMAIL` | secret / var | Yes; comma-separate multiple recipients |
| `CAREERS_TO_EMAIL` | secret / var | Optional; defaults to `LEAD_TO_EMAIL` |
| `LEAD_WEBHOOK_URL` | secret | Optional; copy of every lead as JSON to a CRM or automation tool |
| `NEWSLETTER_WEBHOOK_URL` | secret | Only with the newsletter enabled |

Set the secrets:

```bash
npx wrangler secret put TURNSTILE_SECRET_KEY
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put LEAD_FROM_EMAIL
npx wrangler secret put LEAD_TO_EMAIL
```

> **Important:** if `TURNSTILE_SECRET_KEY` is missing, Turnstile verification is skipped. That is convenient locally but must not happen in production. The honeypot, fill-time check and rate limiting still apply.

## 3. Deploy

**Option A: Cloudflare Workers Builds (recommended).** This connects the GitHub repository so every push to `main` deploys.

1. In the dashboard, go to Workers & Pages → Create → Import a repository → select `joatkenya-creator/omnigroup`.
2. Build command: `npx opennextjs-cloudflare build`
3. Deploy command: `npx opennextjs-cloudflare deploy`
4. Add the build variables from the table above.
5. Optionally, enable non-production branch builds for preview URLs. These URLs are automatically `noindex`: the site sends `X-Robots-Tag: noindex` on any host other than the production host.

**Option B: from a workstation.**

```bash
NEXT_PUBLIC_SITE_ENV=production NEXT_PUBLIC_TURNSTILE_SITE_KEY=... npm run deploy
```

**Staging:** deploy a separate Worker with `NEXT_PUBLIC_SITE_ENV=staging`, for example by copying `wrangler.jsonc` with a different `name` and running `wrangler deploy -c wrangler.staging.jsonc`. Staging builds emit `noindex` metadata and a `Disallow: /` robots.txt.

**Rollback:** in the dashboard, go to Workers → omnigroup-hr → Deployments → roll back. Or run `npx wrangler rollback`.

## 4. Custom domain and DNS

**Do not change DNS until OmniGroup HR approves the cut-over.** The existing website (currently on Wix) stays live until then.

1. Add `omnigrouphr.com` to Cloudflare as a zone if it isn't there already. Update the nameservers at the registrar when instructed.
   - **Before switching, recreate any existing MX, TXT and SPF records** so company email keeps working.
2. Go to Workers → omnigroup-hr → Settings → Domains & Routes → Add → Custom domain.
   - Add `www.omnigrouphr.com`.
   - Add `omnigrouphr.com` as well. The app permanently redirects the apex domain to `www`.
3. Wait for the certificate, then run the post-launch checks in [SEO-AND-MEASUREMENT.md](SEO-AND-MEASUREMENT.md).

### Redirects from the old site

These are built into `next.config.ts`:

| Old URL | New URL |
| --- | --- |
| `/our-services` | `/services` |
| `/about-us` | `/about` |
| `/contact-us` | `/contact` |
| `/apply-now` | `/careers/apply` |
| `/clients` | `/about` |

`/virtual-assistant-services`, `/careers`, `/privacy-policy` and `/eeo-statement` keep their existing URLs.

Before cut-over, export the old site's indexed URLs from Google Search Console and add redirects for any others that receive traffic.

## 5. Known limitations

- **Analytics on Plausible:** the init snippet in `src/components/layout/Analytics.tsx` follows Plausible's current script format. Verify it against the snippet shown in the client's Plausible dashboard.
- **Content-Security-Policy:** it does not restrict scripts, because prerendered pages cannot carry per-request nonces. It does block framing, plugins, `<base>` hijacking and off-site form posts.
- **Fallback rate limiter:** the in-memory limiter used outside Workers (`next start`) is per-process only. Production uses the Cloudflare binding.
- **npm audit:** advisories are reported in `wrangler`/`miniflare` (bundled `undici`) and in a `glob` dependency of OpenNext's minifier. These are build and local-development tooling and are not part of the deployed Worker. The suggested `--force` fix would downgrade wrangler below OpenNext's requirement, so keep these packages updated instead.
