import type { Faq } from "./services";

/**
 * Approved testimonials only. Leave empty until OmniGroup HR supplies
 * real, attributable testimonials with permission to publish.
 * Sections that use this list are hidden while it is empty.
 */
export const testimonials: { quote: string; name: string; role: string; organization?: string }[] = [];

export const differentiators = [
  {
    title: "One partner across support, HR and hiring",
    body: "Virtual assistants, HR guidance, recruitment and workplace support from a single team that already understands your organization.",
  },
  {
    title: "People-first and tailored",
    body: "Every engagement is shaped around your goals, values and vision rather than a one-size-fits-all package.",
  },
  {
    title: "Specialist industry recruitment",
    body: "Experience recruiting for engineering, oil and gas, infrastructure, finance and HR roles, including complex and technical hires.",
  },
  {
    title: "HR as a driver of growth",
    body: "We combine modern methods with proven practices so HR strengthens the business instead of only supporting it.",
  },
];

export const engagementSteps = [
  { title: "Tell us what you need", body: "Send an enquiry or request a consultation. We'll arrange a conversation about your goals and challenges." },
  { title: "We scope the support", body: "Together we define the role, tasks, timeline and how we'll work with you." },
  { title: "We deliver", body: "We match a virtual assistant, begin the search, or start the HR or workplace work we've agreed." },
  { title: "We stay involved", body: "We check in as the engagement progresses so support continues to fit your needs." },
];

export const homeFaqs: Faq[] = [
  {
    q: "What does OmniGroup HR do?",
    a: "We provide virtual assistant services, HR support, staffing and recruitment, executive coaching and leadership development, and workplace mediation for organizations that want to operate efficiently and grow with confidence.",
  },
  {
    q: "Do you only provide virtual assistants?",
    a: "No. Virtual assistant services are a core offering, alongside HR services, specialist and executive recruitment, leadership development and mediation.",
  },
  {
    q: "Which industries do you recruit for?",
    a: "Engineering, oil and gas, infrastructure, finance and human resources, as well as skilled trades, executive roles and administrative support.",
  },
  {
    q: "How do I get started?",
    a: "Choose the service you're interested in and send a short enquiry, or request a general consultation. We'll contact you to discuss your needs.",
  },
  {
    q: "I'm looking for work. How do I apply?",
    a: "Visit our careers page to see current openings and submit an application.",
  },
];
