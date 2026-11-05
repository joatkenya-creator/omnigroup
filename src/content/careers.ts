/**
 * Current openings. OmniGroup HR confirmed on 30 Oct 2026 that none of the
 * roles from the previous careers page are still open. Only add roles that
 * are genuinely being recruited for. With an empty list the careers page
 * shows a general application option instead.
 */
export const jobCategories = [
  { value: "engineering", label: "Engineering" },
  { value: "oil-gas", label: "Oil & Gas" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "finance", label: "Finance" },
  { value: "hr", label: "Human Resources" },
  { value: "trades", label: "Trades & skilled labor" },
] as const;

export type JobCategory = (typeof jobCategories)[number]["value"];

export type Opening = {
  id: string;
  title: string;
  category: JobCategory;
  location: string;
  summary: string;
  responsibilities: string[];
};

export const openings: Opening[] = [];

export const GENERAL_APPLICATION = "General application";

/** "How applications work" on /careers; the last two also close the application success panel. */
export const applicationSteps = [
  { title: "Apply online", body: "Choose a position, upload your resume and suggest times for a short interview." },
  { title: "Review", body: "Our recruitment team reviews your experience against current opportunities." },
  { title: "Conversation", body: "If there's a potential match, we'll contact you to arrange an interview." },
];
