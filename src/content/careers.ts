/**
 * CONFIRM BEFORE LAUNCH: these openings were listed on the previous careers
 * page (24 Oct 2026). Remove any role that is no longer open. Do not add
 * roles that are not genuinely being recruited for. Set the array to [] if
 * there are no current openings — the careers page then shows a general
 * application option instead.
 */
export type Opening = {
  id: string;
  title: string;
  location: string;
  summary: string;
  responsibilities: string[];
};

export const openings: Opening[] = [
  {
    id: "virtual-assistant",
    title: "Virtual Assistant",
    location: "United States",
    summary: "Provide end-to-end administrative support for clients.",
    responsibilities: [
      "Manage calendars, communications and records",
      "Keep work organized and on schedule",
      "Identify and flag risks to deadlines",
    ],
  },
  {
    id: "contracts-administrator",
    title: "Contracts Administrator",
    location: "United States",
    summary: "Support the full contract lifecycle.",
    responsibilities: ["Review and draft contracts", "Support negotiations", "Identify contractual risks"],
  },
  {
    id: "subcontracts-administrator",
    title: "Subcontracts Administrator",
    location: "United States",
    summary: "Manage subcontracts from requirements through closeout.",
    responsibilities: [
      "Manage subcontracts from requirements to closeout",
      "Procure supplies and services",
      "Maintain accurate subcontract records",
    ],
  },
  {
    id: "event-setup-crew",
    title: "Event Setup Crew / Staff",
    location: "United States",
    summary: "Prepare convention center spaces for events.",
    responsibilities: [
      "Set up and tear down furnishings",
      "Operate facility equipment",
      "Keep event spaces clean and ready",
    ],
  },
  {
    id: "maintenance-worker",
    title: "Maintenance Worker",
    location: "United States",
    summary: "Keep facilities running smoothly.",
    responsibilities: ["Carry out a range of maintenance tasks", "Support facility operations", "Report issues promptly"],
  },
];

export const GENERAL_APPLICATION = "General application";
