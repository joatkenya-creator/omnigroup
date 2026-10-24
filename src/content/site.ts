/**
 * Company-wide facts. Values marked CONFIRM were taken from the previous
 * public website (reviewed 24 Oct 2026) and must be re-approved by
 * OmniGroup HR before launch — see docs/CONTENT-APPROVAL.md.
 */
export const site = {
  name: "OmniGroup HR",
  /** CONFIRM: legal entity named in the previous privacy policy and EEO statement. */
  legalName: "Omnicruit LLC",
  /** CONFIRM: footer relationship statement on the previous site. */
  parentStatement: "An Omnicruit International company",
  tagline: "Connecting talent. Empowering success.",
  description:
    "OmniGroup HR provides virtual assistant services, HR support, staffing and recruitment, leadership development and workplace mediation for U.S. organizations.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.omnigrouphr.com",
  isProduction: process.env.NEXT_PUBLIC_SITE_ENV === "production",
  /** Date the published content was last reviewed. Update when copy changes. */
  contentUpdated: "2026-10-24",
  contact: {
    /** CONFIRM */
    email: "hr@omnigrouphr.com",
    /** CONFIRM */
    phoneDisplay: "(757) 986-9846",
    phoneE164: "+17579869846",
    /** CONFIRM: whether this address should be published and used in structured data. */
    address: {
      street: "739 High St",
      city: "Portsmouth",
      region: "VA",
      postalCode: "23704",
      country: "US",
    },
  },
  /** CONFIRM: accounts linked from the previous site's footer. */
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/omnigroup-hr/" },
    { label: "Facebook", href: "https://www.facebook.com/omnigrouphr" },
    { label: "Instagram", href: "https://www.instagram.com/omnigrouphr/" },
  ],
} as const;

export type NavLink = { label: string; href: string; description?: string };

export const serviceNav: NavLink[] = [
  {
    label: "Virtual Assistant Services",
    href: "/virtual-assistant-services",
    description: "Executive, administrative and operations support",
  },
  {
    label: "HR Services",
    href: "/hr-services",
    description: "Policy, compliance guidance and workforce strategy",
  },
  {
    label: "Staffing & Recruitment",
    href: "/staffing-recruitment",
    description: "Specialist, executive and skilled-trades hiring",
  },
  {
    label: "Leadership Development",
    href: "/leadership-development",
    description: "Executive coaching and organizational development",
  },
  {
    label: "Mediation & Workplace Support",
    href: "/mediation-workplace-support",
    description: "Neutral support for workplace disputes",
  },
];

export const mainNav: NavLink[] = [
  { label: "Industries", href: "/industries" },
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: { heading: string; links: NavLink[] }[] = [
  { heading: "Services", links: [...serviceNav.map(({ label, href }) => ({ label, href })), { label: "All services", href: "/services" }] },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Industries", href: "/industries" },
      { label: "Careers", href: "/careers" },
      { label: "Apply now", href: "/careers/apply" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Policies",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "EEO Statement", href: "/eeo-statement" },
    ],
  },
];
