/**
 * Current openings. OmniGroup HR confirmed on 30 Oct 2026 that none of the
 * roles from the previous careers page are still open. Only add roles that
 * are genuinely being recruited for. With an empty list the careers page
 * shows a general application option instead.
 */
export type Opening = {
  id: string;
  title: string;
  location: string;
  summary: string;
  responsibilities: string[];
};

export const openings: Opening[] = [];

export const GENERAL_APPLICATION = "General application";
