"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { ChevronDown, MapPin, Search } from "lucide-react";
import { GENERAL_APPLICATION, jobCategories, type Opening } from "@/content/careers";
import { searchOpenings, suggestQuery } from "@/lib/search";

const generalHref = `/careers/apply?position=${encodeURIComponent(GENERAL_APPLICATION)}`;
const control =
  "block w-full rounded-xl border border-line bg-white px-4 py-3 text-[0.9375rem] text-ink focus:border-accent focus:outline-none focus:ring-3 focus:ring-accent/20";

/**
 * Searchable openings list. The search term and category live in the URL
 * (?q=&category=) so results can be shared and survive a refresh.
 * `syncUrl={false}` is for the dev states preview.
 */
export function Openings({ openings, initialQuery = "", syncUrl = true }: { openings: Opening[]; initialQuery?: string; syncUrl?: boolean }) {
  const uid = useId();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("");
  // Set when the user chooses to see results for exactly what they typed.
  const [exact, setExact] = useState(false);

  useEffect(() => {
    if (!syncUrl) return;
    const params = new URLSearchParams(window.location.search);
    // Reading the URL after hydration keeps the prerendered list unfiltered.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery(params.get("q") ?? "");
    setCategory(params.get("category") ?? "");
  }, [syncUrl]);

  useEffect(() => {
    if (!syncUrl) return;
    const url = new URL(window.location.href);
    for (const [k, v] of [["q", query.trim()], ["category", category]]) {
      if (v) url.searchParams.set(k, v);
      else url.searchParams.delete(k);
    }
    window.history.replaceState(window.history.state, "", url);
  }, [query, category, syncUrl]);

  let results = searchOpenings(openings, query, category);
  let correctedFrom = "";
  let shown = query.trim();
  if (results.length === 0 && query.trim() && !exact) {
    const suggestion = suggestQuery(openings, query);
    const corrected = suggestion ? searchOpenings(openings, suggestion, category) : [];
    if (corrected.length > 0) {
      correctedFrom = query.trim();
      results = corrected;
      shown = suggestion!;
    }
  }

  const usedCategories = new Set(openings.map((o) => o.category));
  const related = jobCategories.filter((c) => c.value !== category && usedCategories.has(c.value)).slice(0, 3);
  const categoryLabel = jobCategories.find((c) => c.value === category)?.label;

  return (
    <>
      <form role="search" onSubmit={(e) => e.preventDefault()} className="mt-10 grid gap-4 sm:grid-cols-[2fr_1fr]">
        <div>
          <label htmlFor={`${uid}-q`} className="block text-sm font-semibold">
            Search openings
          </label>
          <div className="relative mt-2">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              id={`${uid}-q`}
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setExact(false);
              }}
              placeholder="Job title or keyword"
              className={`${control} pl-11`}
            />
          </div>
        </div>
        <div>
          <label htmlFor={`${uid}-cat`} className="block text-sm font-semibold">
            Category
          </label>
          <div className="relative mt-2">
            <select id={`${uid}-cat`} value={category} onChange={(e) => setCategory(e.target.value)} className={`${control} appearance-none pr-11`}>
              <option value="">All categories</option>
              {jobCategories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          </div>
        </div>
      </form>

      <div role="status" className="mt-6 min-h-6 text-sm text-ink-soft">
        {correctedFrom ? (
          <p>
            Showing results for <em className="font-semibold">{shown}</em> instead of <em>{correctedFrom}</em>.{" "}
            <button type="button" className="text-link" onClick={() => setExact(true)}>
              Search for {correctedFrom}
            </button>
          </p>
        ) : (
          results.length > 0 &&
          (shown || category) && (
            <p>
              {results.length} {results.length === 1 ? "opening" : "openings"} found.
            </p>
          )
        )}
      </div>

      {results.length > 0 ? (
        <ul className="mt-4 grid gap-5 md:grid-cols-2">
          {results.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </ul>
      ) : (
        <div className="mt-4 rounded-[var(--radius-card)] border border-line bg-sand p-7">
          <h3 className="font-sans text-lg font-semibold tracking-normal">
            No openings match {shown ? <>&ldquo;{shown}&rdquo;</> : "this search"}
            {categoryLabel && ` in ${categoryLabel}`}
          </h3>
          {related.length > 0 && (
            <>
              <p className="mt-2 text-ink-soft">Try a related search:</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {related.map((c) => (
                  <li key={c.value}>
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setCategory(c.value);
                      }}
                      className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold hover:border-accent hover:text-accent"
                    >
                      {c.label}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          <p className="mt-5 text-ink-soft">
            Or{" "}
            <Link href={generalHref} className="text-link">
              send a general application
            </Link>{" "}
            and we&apos;ll keep you in mind for new roles.
          </p>
        </div>
      )}

      {results.length > 0 && (
        <p className="mt-10 text-ink-soft">
          Don&apos;t see the right role?{" "}
          <Link href={generalHref} className="text-link">
            Send a general application
          </Link>
          .
        </p>
      )}
    </>
  );
}

function JobCard({ job }: { job: Opening }) {
  return (
    <li className="card flex flex-col p-7">
      <h3 className="text-2xl">{job.title}</h3>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
        <MapPin className="size-4" aria-hidden="true" /> {job.location}
      </p>
      <p className="mt-4 text-ink-soft">{job.summary}</p>
      <ul className="mt-4 flex-1 space-y-1.5 text-sm text-ink-soft">
        {job.responsibilities.map((r) => (
          <li key={r} className="flex gap-2">
            <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
            {r}
          </li>
        ))}
      </ul>
      <Link
        href={`/careers/apply?position=${encodeURIComponent(job.title)}`}
        className="btn btn-secondary mt-6 self-start"
        aria-label={`Apply for ${job.title}`}
      >
        Apply for this role
      </Link>
    </li>
  );
}
