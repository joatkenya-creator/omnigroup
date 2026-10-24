/**
 * Industry focus from the previous About Us page. Role examples are those
 * the company listed publicly. CONFIRM the list and add sector-specific
 * detail (certifications, project types, regions) before creating
 * individual industry landing pages.
 */
export type Industry = {
  id: string;
  name: string;
  summary: string;
  roles: string[];
  context: string;
};

export const industries: Industry[] = [
  {
    id: "engineering",
    name: "Engineering",
    summary: "Mechanical, electrical and structural specialists for technical projects.",
    roles: ["Mechanical engineers", "Electrical engineers", "Structural engineers"],
    context:
      "Engineering roles demand verified technical skills and the right project experience. We focus on specialists who can contribute to technical projects from day one.",
  },
  {
    id: "oil-gas",
    name: "Oil & Gas",
    summary: "Engineers, project managers and technical experts for energy companies.",
    roles: ["Engineers", "Project managers", "Technical experts"],
    context:
      "Energy projects are complex, schedule-driven and often in demanding locations. We help energy companies find people with the technical depth those projects require.",
  },
  {
    id: "infrastructure",
    name: "Infrastructure",
    summary: "Civil engineers and project consultants for construction, transportation and development.",
    roles: ["Civil engineers", "Project consultants", "Construction and transportation specialists"],
    context:
      "Infrastructure programs depend on the right people being available when each phase begins. We support construction, transportation and development projects with specialist talent.",
  },
  {
    id: "finance",
    name: "Finance",
    summary: "Analysts, accountants and financial strategists who support stability, compliance and growth.",
    roles: ["Financial analysts", "Accountants", "Financial strategists"],
    context:
      "Finance roles carry responsibility for accuracy, compliance and decision-making. We help organizations find finance professionals they can trust.",
  },
  {
    id: "hr",
    name: "Human Resources",
    summary: "HR specialists, recruiters and workforce strategists who strengthen culture and efficiency.",
    roles: ["HR specialists", "Recruiters", "Workforce strategists"],
    context:
      "The right HR professionals shape how an organization hires, develops and retains its people. We place HR talent that strengthens company culture and operational efficiency.",
  },
];

/** Additional talent areas supported across industries. */
export const crossIndustryTalent = [
  { name: "Trades & skilled labor", href: "/staffing-recruitment" },
  { name: "Executive & leadership roles", href: "/staffing-recruitment" },
  { name: "Virtual assistants & administrative support", href: "/virtual-assistant-services" },
];
