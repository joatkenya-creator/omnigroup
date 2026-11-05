import { jobCategories, type Opening } from "@/content/careers";

/** Common shorthand people type, mapped to the words used in our listings. */
const synonyms: Record<string, string> = {
  va: "virtual assistant",
  hr: "human resources",
  accountant: "finance",
  accounting: "finance",
  engineer: "engineering",
  oil: "oil gas",
  electrician: "trades",
  welder: "trades",
  plumber: "trades",
  carpenter: "trades",
};

const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

export function levenshtein(a: string, b: string) {
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = row;
  }
  return prev[b.length];
}

const categoryLabel = (value: string) => jobCategories.find((c) => c.value === value)?.label ?? "";

function haystack(o: Opening) {
  return normalize([o.title, categoryLabel(o.category), o.location, o.summary, ...o.responsibilities].join(" "));
}

/** Openings whose text contains every search word (or its synonym's words) as a prefix match. */
export function searchOpenings(openings: Opening[], query: string, category = "") {
  const words = normalize(query).flatMap((w) => (synonyms[w] ? normalize(synonyms[w]) : [w]));
  return openings.filter((o) => {
    if (category && o.category !== category) return false;
    const text = haystack(o);
    return words.every((w) => text.some((t) => t.startsWith(w)));
  });
}

/**
 * A corrected query when a word looks like a typo of a word in the listings,
 * category names or synonym list, e.g. "enginer" -> "engineer". Null when
 * nothing is close enough.
 */
export function suggestQuery(openings: Opening[], query: string) {
  const vocabulary = new Set([
    ...openings.flatMap((o) => normalize(`${o.title} ${categoryLabel(o.category)}`)),
    ...jobCategories.flatMap((c) => normalize(c.label)),
    ...Object.keys(synonyms),
  ]);
  let changed = false;
  const corrected = normalize(query).map((word) => {
    if (vocabulary.has(word) || word.length < 3) return word;
    const limit = word.length <= 5 ? 1 : 2;
    let best = word;
    let bestScore = limit + 1;
    for (const v of vocabulary) {
      const score = levenshtein(word, v);
      if (score < bestScore) [best, bestScore] = [v, score];
    }
    if (best !== word) changed = true;
    return best;
  });
  return changed ? corrected.join(" ") : null;
}
