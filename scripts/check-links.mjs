#!/usr/bin/env node
/**
 * Crawls a running build (default http://localhost:3000) from "/" and checks:
 *  - every internal link resolves (200, or a redirect to a 200)
 *  - every #fragment target exists on its page
 *  - each page has exactly one <h1>, a unique <title> and meta description,
 *    a canonical URL, Open Graph tags and valid JSON-LD
 *  - heading levels never skip (e.g. h2 -> h4)
 *  - legacy URLs redirect permanently
 *
 * Usage: npm run build && npm start, then in another terminal:
 *        npm run check:links [-- http://localhost:3000]
 */
const base = process.argv[2] ?? "http://localhost:3000";
const legacy = { "/our-services": "/services", "/about-us": "/about", "/contact-us": "/contact", "/apply-now": "/careers/apply", "/clients": "/about" };

const pages = new Map(); // path -> { html, status }
const problems = [];
const queue = ["/"];
const linkSources = new Map(); // href -> first page that linked it

const attr = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1];

async function fetchPage(path) {
  const res = await fetch(base + path, { redirect: "follow" });
  return { status: res.status, html: await res.text(), finalPath: new URL(res.url).pathname };
}

while (queue.length) {
  const path = queue.shift();
  if (pages.has(path)) continue;
  const page = await fetchPage(path);
  pages.set(path, page);
  if (page.status !== 200) {
    problems.push(`${path} → HTTP ${page.status} (linked from ${linkSources.get(path) ?? "start"})`);
    continue;
  }
  for (const m of page.html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const href = m[1].replace(/&amp;/g, "&");
    if (/^(https?:|mailto:|tel:)/.test(href)) continue;
    const url = new URL(href, base + path);
    const target = url.pathname;
    if (url.hash) linkSources.set(`${target}${url.hash}`, path);
    if (!linkSources.has(target)) linkSources.set(target, path);
    if (!pages.has(target) && !queue.includes(target)) queue.push(target);
  }
}

// Fragment targets
for (const [key, from] of linkSources) {
  const i = key.indexOf("#");
  if (i === -1) continue;
  const [target, id] = [key.slice(0, i), key.slice(i + 1)];
  const page = pages.get(target);
  if (page?.status === 200 && !new RegExp(`id="${id}"`).test(page.html)) problems.push(`Missing anchor #${id} on ${target} (linked from ${from})`);
}

// Per-page SEO checks
const titles = new Map();
const descriptions = new Map();
const report = [];
for (const [path, { html, status }] of pages) {
  if (status !== 200) continue;
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  const description = attr(html.match(/<meta name="description"[^>]*>/)?.[0] ?? "", "content");
  const canonical = attr(html.match(/<link rel="canonical"[^>]*>/)?.[0] ?? "", "href");
  const ogImage = /<meta property="og:image"/.test(html);
  const h1s = (html.match(/<h1\b/g) ?? []).length;
  const robots = attr(html.match(/<meta name="robots"[^>]*>/)?.[0] ?? "", "content");
  const levels = [...html.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]));
  const skips = levels.filter((l, i) => i > 0 && l > levels[i - 1] + 1);
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => m[1]);
  const types = [];
  for (const block of jsonLd) {
    try {
      types.push(JSON.parse(block)["@type"]);
    } catch {
      problems.push(`${path}: invalid JSON-LD`);
    }
  }

  if (!title) problems.push(`${path}: missing <title>`);
  if (!description) problems.push(`${path}: missing meta description`);
  if (h1s !== 1) problems.push(`${path}: expected 1 <h1>, found ${h1s}`);
  if (skips.length) problems.push(`${path}: heading level skipped (${levels.join(" ")})`);
  if (!ogImage) problems.push(`${path}: missing og:image`);
  if (!canonical && !path.startsWith("/_")) problems.push(`${path}: missing canonical`);
  if (description && (description.length < 70 || description.length > 170))
    problems.push(`${path}: meta description length ${description.length} (aim for 70–160)`);
  if (title) titles.set(title, [...(titles.get(title) ?? []), path]);
  if (description) descriptions.set(description, [...(descriptions.get(description) ?? []), path]);
  report.push({ path, title, canonical, robots, jsonLd: types.join(", ") });
}
for (const [t, p] of titles) if (p.length > 1) problems.push(`Duplicate title "${t}" on ${p.join(", ")}`);
for (const p of descriptions.values()) if (p.length > 1) problems.push(`Duplicate description on ${p.join(", ")}`);

// Legacy redirects
for (const [from, to] of Object.entries(legacy)) {
  const res = await fetch(base + from, { redirect: "manual" });
  const location = res.headers.get("location") ?? "";
  if (![301, 308].includes(res.status) || new URL(location, base).pathname !== to)
    problems.push(`Legacy ${from}: expected permanent redirect to ${to}, got ${res.status} ${location}`);
}

// 404 handling
const missing = await fetch(`${base}/this-page-does-not-exist`);
if (missing.status !== 404) problems.push(`Unknown URL returned ${missing.status}, expected 404`);

// robots + sitemap
const robots = await (await fetch(`${base}/robots.txt`)).text();
const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const sitemapPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
for (const p of sitemapPaths) if (!pages.has(p)) problems.push(`Sitemap lists ${p} but it is not linked from the site`);
for (const p of pages.keys()) if (pages.get(p).status === 200 && !sitemapPaths.includes(p)) problems.push(`${p} is linked but missing from the sitemap`);

console.table(report);
console.log(`\nrobots.txt:\n${robots}`);
console.log(`Crawled ${pages.size} pages, ${linkSources.size} unique link targets, ${sitemapPaths.length} sitemap URLs.`);
if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
console.log("\nAll link, anchor, redirect and metadata checks passed.");
