import { describe, expect, it } from "vitest";
import type { Opening } from "@/content/careers";
import { levenshtein, searchOpenings, suggestQuery } from "./search";

const job = (title: string, category: Opening["category"]): Opening => ({
  id: title,
  title,
  category,
  location: "Norfolk, VA",
  summary: "",
  responsibilities: [],
});
const openings = [job("Civil Engineer", "engineering"), job("HR Generalist", "hr"), job("Staff Accountant", "finance")];

describe("search", () => {
  it("measures edit distance", () => {
    expect(levenshtein("enginer", "engineer")).toBe(1);
    expect(levenshtein("", "abc")).toBe(3);
  });

  it("matches words, synonyms and categories", () => {
    expect(searchOpenings(openings, "civil").map((o) => o.title)).toEqual(["Civil Engineer"]);
    expect(searchOpenings(openings, "accounting").map((o) => o.title)).toEqual(["Staff Accountant"]);
    expect(searchOpenings(openings, "human resources").map((o) => o.title)).toEqual(["HR Generalist"]);
    expect(searchOpenings(openings, "", "finance")).toHaveLength(1);
    expect(searchOpenings(openings, "civil", "finance")).toHaveLength(0);
  });

  it("suggests a correction for typos only", () => {
    expect(suggestQuery(openings, "enginer")).toBe("engineer");
    expect(suggestQuery(openings, "engineer")).toBeNull();
    expect(suggestQuery(openings, "zzzzzz")).toBeNull();
  });
});
