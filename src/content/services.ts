import type { FormKey } from "@/lib/forms/definitions";

/**
 * Service catalogue. Scope is drawn from the previous public website
 * (home, Virtual Assistant Services, Our Services and About Us pages).
 * Process steps and FAQ answers describe a typical engagement and must be
 * confirmed by OmniGroup HR before launch — see docs/CONTENT-APPROVAL.md.
 */

export type IconKey =
  | "assistant"
  | "hr"
  | "recruitment"
  | "leadership"
  | "mediation"
  | "calendar"
  | "inbox"
  | "database"
  | "workflow"
  | "support"
  | "executive"
  | "policy"
  | "compliance"
  | "structure"
  | "people"
  | "search"
  | "contract"
  | "tools"
  | "globe"
  | "coaching"
  | "training"
  | "handshake"
  | "shield";

export type ServiceSlug =
  | "virtual-assistant-services"
  | "hr-services"
  | "staffing-recruitment"
  | "leadership-development"
  | "mediation-workplace-support";

export type Item = { title: string; body: string; icon?: IconKey; points?: string[] };
export type Faq = { q: string; a: string };

export type Service = {
  slug: ServiceSlug;
  name: string;
  icon: IconKey;
  eyebrow: string;
  title: string;
  lead: string;
  summary: string;
  metaTitle: string;
  metaDescription: string;
  schemaServiceType: string;
  primaryCta: string;
  intro: { heading: string; paragraphs: string[] };
  problems: { heading: string; items: Item[] };
  offerings: { heading: string; lead: string; items: Item[] };
  audience?: { heading: string; items: string[] };
  process: { heading: string; lead: string; steps: Item[] };
  scoping?: { heading: string; lead: string; items: Item[] };
  note?: string;
  faqs: Faq[];
  form: { key: FormKey; heading: string; lead: string; defaultService?: string };
  related: ServiceSlug[];
};

export const services: Record<ServiceSlug, Service> = {
  "virtual-assistant-services": {
    slug: "virtual-assistant-services",
    name: "Virtual Assistant Services",
    icon: "assistant",
    eyebrow: "Virtual Assistant Services",
    title: "Virtual assistant support that keeps your business running",
    lead: "Skilled virtual assistants for executive support, day-to-day administration and the workflows that keep your operations on track — without the overhead of a full-time hire.",
    summary:
      "Executive assistants and virtual specialists for scheduling, inbox and social media management, CRM and data, project coordination and customer service.",
    metaTitle: "Virtual Assistant Services for Businesses",
    metaDescription:
      "Executive and administrative virtual assistants for U.S. businesses: calendar and inbox management, CRM and data, project coordination and customer service support.",
    schemaServiceType: "Virtual assistant services",
    primaryCta: "Discuss your VA needs",
    intro: {
      heading: "Reliable support, built around how you already work",
      paragraphs: [
        "As a business grows, the administrative load grows with it. Calendars fill up, inboxes back up, records drift out of date and leaders end up spending their best hours on tasks someone else could own.",
        "OmniGroup HR provides virtual assistants who take on that work — from executive-level support to the daily administration and coordination that keeps projects moving. Support is shaped around your priorities and works inside the systems your team already uses.",
      ],
    },
    problems: {
      heading: "Why businesses bring in a virtual assistant",
      items: [
        {
          icon: "people",
          title: "Skilled help without a full-time hire",
          body: "Add experienced support without the cost and commitment of recruiting, onboarding and employing another full-time staff member.",
        },
        {
          icon: "workflow",
          title: "Flexible as your needs change",
          body: "Support can be scoped to your current workload and revisited as your business, projects or season changes.",
        },
        {
          icon: "executive",
          title: "Time back for leadership",
          body: "Hand off scheduling, follow-ups and routine administration so founders and executives can focus on clients and growth.",
        },
      ],
    },
    offerings: {
      heading: "What our virtual assistants support",
      lead: "Typical areas of support. Tell us what is taking up your team's time and we will tell you honestly whether a virtual assistant is the right fit.",
      items: [
        {
          icon: "executive",
          title: "Executive support",
          body: "High-level administrative and operational support for leaders and leadership teams.",
          points: ["Priority and follow-up tracking", "Meeting preparation", "Correspondence on your behalf"],
        },
        {
          icon: "calendar",
          title: "Calendar management",
          body: "Scheduling, meeting coordination and task prioritization so the week runs to plan.",
          points: ["Scheduling and rescheduling", "Meeting coordination", "Task prioritization"],
        },
        {
          icon: "inbox",
          title: "Social media & inbox management",
          body: "Content scheduling, audience engagement and inbox management to keep communication timely.",
          points: ["Content scheduling", "Audience engagement", "Inbox triage"],
        },
        {
          icon: "database",
          title: "CRM & data management",
          body: "System tracking, database organization and reporting so your records stay accurate and useful.",
          points: ["CRM updates", "Database organization", "Routine reporting"],
        },
        {
          icon: "workflow",
          title: "Operations & project coordination",
          body: "Workflow oversight, deadline management and cross-team alignment for projects in motion.",
          points: ["Workflow oversight", "Deadline tracking", "Cross-team coordination"],
        },
        {
          icon: "support",
          title: "Customer service support",
          body: "Client communication and responsive support that keeps customers informed.",
          points: ["Client communication", "Responding to enquiries", "Follow-up and updates"],
        },
      ],
    },
    audience: {
      heading: "Who virtual assistant support suits",
      items: [
        "Founders and executives who need dependable support across scheduling, correspondence and follow-up.",
        "Small and growing businesses with more administration than their current team can absorb.",
        "Teams with recurring operational work — data entry, reporting, coordination — that keeps slipping.",
        "Organizations that need extra capacity for a project or busy period without a permanent hire.",
      ],
    },
    process: {
      heading: "How a VA engagement works",
      lead: "A straightforward process from first conversation to day-to-day support.",
      steps: [
        {
          title: "Consultation",
          body: "Tell us about your business, the tasks you want to hand off and the outcome you need.",
        },
        {
          title: "Scope and match",
          body: "We define the role, expected workload and skills required, then identify the right assistant for your needs.",
        },
        {
          title: "Onboarding",
          body: "We agree system access, tools, communication preferences and working hours so support starts smoothly.",
        },
        {
          title: "Ongoing support",
          body: "Your assistant works inside your workflows, and we check in so the support keeps fitting as your needs change.",
        },
      ],
    },
    scoping: {
      heading: "What we agree with you up front",
      lead: "Every business is different, so the details of each engagement are set during scoping rather than fixed in a package.",
      items: [
        { icon: "calendar", title: "Hours and coverage", body: "The expected workload, working hours and time-zone coverage you need." },
        { icon: "tools", title: "Tools and systems", body: "Which platforms your assistant will use and how access will be granted." },
        { icon: "inbox", title: "Communication", body: "How and when you will exchange updates, requests and approvals." },
        { icon: "shield", title: "Confidentiality", body: "How sensitive information, accounts and documents will be handled." },
      ],
    },
    faqs: [
      {
        q: "What tasks can a virtual assistant handle?",
        a: "Our virtual assistants support executive support, calendar management, social media and inbox management, CRM and data management, operations and project coordination, and customer service. If your needs fall outside those areas, ask — we will tell you plainly whether we are the right fit.",
      },
      {
        q: "How is a virtual assistant different from hiring an employee?",
        a: "A virtual assistant gives you skilled support without recruiting, onboarding and employing a full-time staff member. It suits businesses that need dependable help with defined work but do not need, or are not ready for, another permanent role.",
      },
      {
        q: "How many hours of support can I get?",
        a: "Support is scoped to your workload. During the consultation we discuss the volume of work, the hours and the time-zone coverage you need, and recommend an arrangement that fits.",
      },
      {
        q: "Can a virtual assistant work in our existing tools?",
        a: "Yes. Support is designed to integrate with the systems your team already uses. We confirm the tools and how access will be granted during onboarding.",
      },
      {
        q: "How is confidential information handled?",
        a: "Confidentiality and system access are agreed before support begins, including which accounts and documents your assistant can access. Ask us about our confidentiality practices during your consultation.",
      },
      {
        q: "How much does a virtual assistant cost?",
        a: "Cost depends on the scope, hours and type of support you need. Request a consultation and we will discuss options based on your requirements.",
      },
    ],
    form: {
      key: "va",
      heading: "Discuss your virtual assistant needs",
      lead: "Share a few details and a member of our team will contact you to talk through your requirements. It takes about two minutes.",
    },
    related: ["hr-services", "staffing-recruitment"],
  },

  "hr-services": {
    slug: "hr-services",
    name: "HR Services",
    icon: "hr",
    eyebrow: "HR Services",
    title: "HR support that strengthens your people and your operations",
    lead: "Practical HR guidance — from policy development and compliance guidance to workforce alignment and organizational structure — so HR becomes a driver of growth, not just a support function.",
    summary:
      "Policy development, compliance guidance, workforce alignment and organizational structure strategy from HR specialists and workforce strategists.",
    metaTitle: "HR Consulting & Support Services",
    metaDescription:
      "HR consulting for growing organizations: HR policy development, compliance guidance, workforce alignment and organizational structure strategy from OmniGroup HR.",
    schemaServiceType: "Human resources consulting",
    primaryCta: "Talk to an HR specialist",
    intro: {
      heading: "HR as a strategic contributor",
      paragraphs: [
        "Many organizations treat HR as an administrative function — something that handles paperwork after decisions are made. We take a different view: well-designed HR keeps teams aligned, reduces friction and supports sustainable growth.",
        "OmniGroup HR's specialists, recruiters and workforce strategists combine modern methods with proven practices to help you build the policies, structure and culture your organization needs.",
      ],
    },
    problems: {
      heading: "Common reasons organizations call us",
      items: [
        {
          icon: "policy",
          title: "Policies that haven't kept up",
          body: "Handbooks and procedures written for a smaller or different organization that no longer reflect how you operate.",
        },
        {
          icon: "structure",
          title: "Growth without structure",
          body: "Roles, reporting lines and responsibilities that have grown organically and now create confusion.",
        },
        {
          icon: "people",
          title: "Teams pulling in different directions",
          body: "A workforce that isn't aligned with business priorities, affecting productivity and culture.",
        },
      ],
    },
    offerings: {
      heading: "How we support your HR function",
      lead: "Support can be focused on a specific project or provide ongoing guidance alongside your leadership team.",
      items: [
        {
          icon: "policy",
          title: "HR policy development",
          body: "Clear, practical policies and procedures tailored to your organization, values and way of working.",
        },
        {
          icon: "compliance",
          title: "Compliance guidance",
          body: "Guidance to help you understand and keep pace with your HR obligations. For legal advice, we recommend working alongside qualified employment counsel.",
        },
        {
          icon: "people",
          title: "Workforce alignment",
          body: "Connecting roles, responsibilities and people practices to the goals of the business.",
        },
        {
          icon: "structure",
          title: "Organizational structure strategy",
          body: "Designing reporting lines and team structures that support how you plan to grow.",
        },
      ],
    },
    process: {
      heading: "How an HR engagement works",
      lead: "We start by understanding your organization before recommending anything.",
      steps: [
        { title: "Discovery", body: "We learn about your organization, current HR practices and the challenge you want to solve." },
        { title: "Assessment", body: "We review what is working, what isn't and where the gaps are." },
        { title: "Recommendations", body: "We agree a practical plan with clear priorities and responsibilities." },
        { title: "Implementation", body: "We support you as policies, structures or practices are put in place." },
      ],
    },
    faqs: [
      {
        q: "Do you replace an in-house HR team?",
        a: "Not necessarily. We can work alongside an existing HR team on specific projects, or provide HR guidance to organizations that don't yet have dedicated HR staff. We will discuss what fits during your consultation.",
      },
      {
        q: "Do you provide legal advice?",
        a: "No. We provide HR guidance and practical support. For legal questions, we recommend working with qualified employment counsel, and we are happy to work alongside them.",
      },
      {
        q: "Can you help with recruitment as well?",
        a: "Yes. Our staffing and recruitment service supports specialist, executive and skilled-trades hiring, and many clients combine HR support with recruitment.",
      },
      {
        q: "How do we get started?",
        a: "Send us a short enquiry describing your situation. We will arrange a conversation to understand your needs before proposing any work.",
      },
    ],
    form: {
      key: "business",
      heading: "Tell us about your HR challenge",
      lead: "Share a few details and we will arrange a conversation to understand your needs.",
      defaultService: "hr",
    },
    related: ["leadership-development", "mediation-workplace-support"],
  },

  "staffing-recruitment": {
    slug: "staffing-recruitment",
    name: "Staffing & Recruitment",
    icon: "recruitment",
    eyebrow: "Staffing & Recruitment",
    title: "Specialist staffing and recruitment for complex hiring needs",
    lead: "From executive search and contract staffing to skilled trades and technical specialists, we help organizations find people who fit the role, the team and the timeline.",
    summary:
      "Executive search, contract staffing, specialist technical recruitment and trades and skilled-labor staffing, including cross-border recruitment support.",
    metaTitle: "Staffing, Recruitment & Executive Search",
    metaDescription:
      "Staffing and recruitment for engineering, oil and gas, infrastructure, finance and HR roles — plus executive search, contract staffing and skilled-trades staffing.",
    schemaServiceType: "Staffing and recruitment",
    primaryCta: "Request talent",
    intro: {
      heading: "More than filling positions",
      paragraphs: [
        "A hire that looks right on paper can still be the wrong fit. We take time to understand the role, the team it sits in and the outcomes it needs to deliver before we start searching.",
        "OmniGroup HR supports organizations hiring across technical and specialist fields, leadership roles and skilled trades, with recruitment that considers cultural alignment and onboarding as well as qualifications.",
      ],
    },
    problems: {
      heading: "Hiring challenges we help with",
      items: [
        {
          icon: "search",
          title: "Hard-to-find specialists",
          body: "Technical and specialist roles where qualified candidates are scarce and generic job boards don't reach them.",
        },
        {
          icon: "contract",
          title: "Project deadlines",
          body: "Contract and skilled-labor needs tied to project schedules, where delays in hiring delay delivery.",
        },
        {
          icon: "globe",
          title: "Cross-border hiring",
          body: "Recruiting beyond your local market while keeping compliance, cultural alignment and onboarding on track.",
        },
      ],
    },
    offerings: {
      heading: "Recruitment and staffing services",
      lead: "Each engagement is scoped around the role and your timeline.",
      items: [
        {
          icon: "executive",
          title: "Executive search & placement",
          body: "Identifying and placing leaders who fit your organization's direction and culture.",
        },
        {
          icon: "contract",
          title: "Contract staffing",
          body: "Flexible staffing for projects, peaks in demand and roles with a defined duration.",
        },
        {
          icon: "search",
          title: "Specialist & technical recruitment",
          body: "Engineering, oil and gas, infrastructure, finance and HR professionals for complex roles.",
        },
        {
          icon: "tools",
          title: "Trades & skilled-labor staffing",
          body: "Sourcing and placing trades and skilled labor to help you meet project deadlines.",
        },
        {
          icon: "globe",
          title: "Cross-border recruitment",
          body: "Support connecting with talent beyond your local market, with attention to compliance, cultural alignment and smooth onboarding.",
        },
        {
          icon: "assistant",
          title: "Virtual assistant placement",
          body: "Executive assistants and virtual specialists for administrative and operational roles.",
        },
      ],
    },
    process: {
      heading: "How a recruitment engagement works",
      lead: "A structured process that keeps you informed at every stage.",
      steps: [
        { title: "Intake", body: "We discuss the role, team, requirements, location and timeline with you." },
        { title: "Search", body: "We source and approach candidates through the channels that suit the role." },
        { title: "Screening", body: "We assess candidates against your requirements and share a shortlist." },
        { title: "Placement", body: "We coordinate interviews and offers, and support onboarding once a candidate is chosen." },
      ],
    },
    scoping: {
      heading: "What helps us start quickly",
      lead: "You don't need everything ready to enquire, but these details help us scope a search.",
      items: [
        { icon: "policy", title: "Role overview", body: "Job title, key responsibilities and the skills or certifications required." },
        { icon: "globe", title: "Location", body: "Where the role is based and whether on-site, hybrid or remote work is possible." },
        { icon: "calendar", title: "Timeline", body: "When you need the person to start and any project deadlines involved." },
        { icon: "contract", title: "Engagement type", body: "Whether the role is contract, project-based or a leadership appointment." },
      ],
    },
    faqs: [
      {
        q: "Which industries do you recruit for?",
        a: "We recruit across engineering, oil and gas, infrastructure, finance and HR, as well as skilled trades and administrative and virtual roles. See our industries page for the kinds of roles we support.",
      },
      {
        q: "Do you support contract and project-based staffing?",
        a: "Yes. Contract staffing and trades and skilled-labor staffing are designed for projects, peaks in demand and roles with a defined duration.",
      },
      {
        q: "Can you recruit outside the United States?",
        a: "We offer cross-border recruitment support to help organizations connect with talent beyond their local market. Tell us where you are hiring and we will discuss what is possible.",
      },
      {
        q: "What should I prepare before requesting talent?",
        a: "A role overview, location, timeline and engagement type are helpful, but not required. We can work through the details with you during intake.",
      },
      {
        q: "I'm looking for a job. Is this the right page?",
        a: "This page is for employers. If you're looking for work, visit our careers page to see current openings and apply.",
      },
    ],
    form: {
      key: "staffing",
      heading: "Request talent",
      lead: "Tell us about the role you're hiring for. We will contact you to discuss the requirements and next steps.",
    },
    related: ["virtual-assistant-services", "hr-services"],
  },

  "leadership-development": {
    slug: "leadership-development",
    name: "Leadership Development",
    icon: "leadership",
    eyebrow: "Executive Coaching & Organizational Development",
    title: "Leadership development and organizational effectiveness",
    lead: "Executive coaching, leadership training and organizational development that help managers lead with confidence and teams perform at their best.",
    summary:
      "Tailored executive coaching, leadership training and organizational development, including custom HR policies and organizational strategy.",
    metaTitle: "Executive Coaching & Leadership Development",
    metaDescription:
      "Executive coaching, leadership training and organizational development programs tailored to your managers, teams and business goals.",
    schemaServiceType: "Executive coaching and leadership development",
    primaryCta: "Discuss a program",
    intro: {
      heading: "Stronger leaders, stronger organizations",
      paragraphs: [
        "The business environment asks more of managers than ever: leading change, developing people and making decisions with incomplete information. Few are given structured support to do it well.",
        "OmniGroup HR designs coaching and development programs around your leaders and your organization's goals, alongside the policies and structure that help good leadership stick.",
      ],
    },
    problems: {
      heading: "When leadership support makes a difference",
      items: [
        { icon: "executive", title: "New or newly promoted leaders", body: "Managers stepping into bigger roles who need support to lead effectively." },
        { icon: "structure", title: "Periods of change", body: "Growth, restructuring or new direction that requires leaders to bring teams with them." },
        { icon: "people", title: "Performance and productivity", body: "Teams that aren't performing as they could because of unclear expectations or inconsistent management." },
      ],
    },
    offerings: {
      heading: "Programs and services",
      lead: "Programs are tailored to the people involved and the outcomes you want.",
      items: [
        {
          icon: "coaching",
          title: "Executive coaching",
          body: "One-to-one coaching that helps executives and managers develop the skills to lead in a complex business environment.",
        },
        {
          icon: "training",
          title: "Leadership training",
          body: "Development for managers and emerging leaders, designed around your organization's needs.",
        },
        {
          icon: "structure",
          title: "Organizational development",
          body: "Organizational strategy that improves how teams work together, perform and stay productive.",
        },
        {
          icon: "policy",
          title: "Custom HR policies",
          body: "Policies that reinforce the expectations and culture your leaders are building.",
        },
      ],
    },
    process: {
      heading: "How we design a program",
      lead: "Every program starts with understanding your leaders and your goals.",
      steps: [
        { title: "Understand", body: "We discuss your organization, the leaders involved and what you want to change." },
        { title: "Design", body: "We tailor a coaching or training approach to those goals." },
        { title: "Deliver", body: "Coaching sessions or training are delivered with your leaders." },
        { title: "Review", body: "We review progress with you and agree any next steps." },
      ],
    },
    faqs: [
      {
        q: "Who is executive coaching for?",
        a: "Executives, senior managers and leaders preparing for larger roles. Coaching is tailored to the individual and the challenges they face.",
      },
      {
        q: "Can training be delivered to a group?",
        a: "Yes. Leadership training can be designed for groups of managers or emerging leaders. Tell us about your team and we'll discuss options.",
      },
      {
        q: "How long does a program last?",
        a: "It depends on the goals and the people involved. We agree the scope and duration with you before any program begins.",
      },
    ],
    form: {
      key: "business",
      heading: "Discuss a leadership program",
      lead: "Tell us about your leaders and goals and we will arrange a conversation.",
      defaultService: "leadership",
    },
    related: ["hr-services", "mediation-workplace-support"],
  },

  "mediation-workplace-support": {
    slug: "mediation-workplace-support",
    name: "Mediation & Workplace Support",
    icon: "mediation",
    eyebrow: "Mediation & Workplace Support",
    title: "Workplace mediation and support for healthier teams",
    lead: "Neutral, structured mediation that helps resolve workplace disputes, rebuild working relationships and maintain a positive environment.",
    summary:
      "Neutral mediation and structured conflict resolution to resolve workplace disputes, encourage collaboration and maintain a positive environment.",
    metaTitle: "Workplace Mediation & Conflict Resolution",
    metaDescription:
      "Neutral workplace mediation and structured conflict resolution to help teams resolve disputes, improve collaboration and maintain a positive work environment.",
    schemaServiceType: "Workplace mediation",
    primaryCta: "Request a confidential conversation",
    intro: {
      heading: "When conflict gets in the way of work",
      paragraphs: [
        "Unresolved conflict affects more than the people directly involved. It drains productivity, damages morale and can push good employees to leave.",
        "OmniGroup HR provides neutral mediation and structured conflict resolution that gives everyone a fair hearing and helps the people involved find a workable way forward.",
      ],
    },
    problems: {
      heading: "Situations where mediation can help",
      items: [
        { icon: "people", title: "Breakdowns between colleagues", body: "Working relationships that have become strained and are affecting the wider team." },
        { icon: "executive", title: "Manager and employee disputes", body: "Disagreements about expectations, communication or treatment that need an impartial facilitator." },
        { icon: "structure", title: "Team-wide tension", body: "Friction within or between teams, often during periods of change." },
      ],
    },
    offerings: {
      heading: "Mediation and workplace services",
      lead: "Support is shaped around the situation and the people involved.",
      items: [
        {
          icon: "handshake",
          title: "Workplace mediation",
          body: "Neutral facilitation that helps parties understand each other's perspectives and agree a way forward.",
        },
        {
          icon: "workflow",
          title: "Structured conflict resolution",
          body: "A clear, fair process for addressing disputes before they escalate.",
        },
        {
          icon: "people",
          title: "Collaboration support",
          body: "Helping teams rebuild trust and working relationships after conflict.",
        },
      ],
    },
    process: {
      heading: "How mediation typically works",
      lead: "Participation in mediation is voluntary, and the process is designed to be fair to everyone involved.",
      steps: [
        { title: "Initial conversation", body: "A confidential discussion to understand the situation and whether mediation is appropriate." },
        { title: "Preparation", body: "We speak with the parties involved so everyone understands the process." },
        { title: "Mediation session", body: "A facilitated conversation focused on understanding and finding solutions." },
        { title: "Agreed next steps", body: "The parties record what they have agreed, with follow-up where helpful." },
      ],
    },
    note: "Mediation is not legal advice and does not replace advice from qualified legal counsel. Outcomes depend on the willingness of the parties involved, so no particular result can be guaranteed.",
    faqs: [
      {
        q: "Is mediation confidential?",
        a: "Confidentiality is discussed and agreed with all parties at the start of the process, including what, if anything, will be shared with the organization.",
      },
      {
        q: "Is the mediator neutral?",
        a: "Yes. The mediator's role is to facilitate the conversation impartially, not to take sides or decide who is right.",
      },
      {
        q: "Does mediation replace a formal grievance or legal process?",
        a: "No. Mediation is one option for resolving workplace disputes. It does not replace your organization's formal procedures or advice from legal counsel.",
      },
      {
        q: "How do we get started?",
        a: "Request a confidential conversation. We will discuss the situation and whether mediation is the right approach.",
      },
    ],
    form: {
      key: "business",
      heading: "Request a confidential conversation",
      lead: "Share a brief summary — avoid names or sensitive details at this stage. We will contact you to discuss next steps.",
      defaultService: "mediation",
    },
    related: ["hr-services", "leadership-development"],
  },
};

export const serviceList: Service[] = [
  services["virtual-assistant-services"],
  services["hr-services"],
  services["staffing-recruitment"],
  services["leadership-development"],
  services["mediation-workplace-support"],
];
