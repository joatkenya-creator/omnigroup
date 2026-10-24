import { GENERAL_APPLICATION, openings } from "@/content/careers";

/**
 * Single source of truth for every public form. The same definitions drive
 * the rendered fields, client-side validation, server-side validation and
 * the formatted lead email, so they cannot drift apart.
 */

export type Option = { value: string; label: string };

type BaseField = {
  name: string;
  label: string;
  required?: boolean;
  hint?: string;
  autoComplete?: string;
  /** Lay two half-width fields side by side on wider screens. */
  half?: boolean;
};

export type FieldDef =
  | (BaseField & { type: "text" | "email" | "tel"; maxLength?: number; placeholder?: string })
  | (BaseField & { type: "textarea"; maxLength?: number; minLength?: number; rows?: number; placeholder?: string })
  | (BaseField & { type: "select"; options: Option[]; placeholder?: string })
  | (BaseField & { type: "checkbox" })
  | (BaseField & { type: "file"; accept: string[]; maxBytes: number });

export type FormKey = "business" | "va" | "staffing" | "application" | "newsletter";

export type FormDef = {
  key: FormKey;
  /** Human-readable name used in lead emails and analytics. */
  label: string;
  /** Analytics event fired only after the server confirms delivery. */
  event: string;
  destination: "leads" | "careers" | "newsletter";
  submitLabel: string;
  fields: FieldDef[];
  success: { heading: string; body: string };
};

const name: FieldDef = { name: "name", label: "Full name", type: "text", required: true, autoComplete: "name", maxLength: 120, half: true };
const workEmail: FieldDef = { name: "email", label: "Work email", type: "email", required: true, autoComplete: "email", maxLength: 200, half: true };
const company: FieldDef = { name: "company", label: "Company", type: "text", required: true, autoComplete: "organization", maxLength: 160, half: true };
const phone: FieldDef = { name: "phone", label: "Phone", type: "tel", autoComplete: "tel", maxLength: 40, half: true, hint: "Optional" };

export const serviceOptions: Option[] = [
  { value: "va", label: "Virtual assistant services" },
  { value: "staffing", label: "Staffing & recruitment" },
  { value: "hr", label: "HR services" },
  { value: "leadership", label: "Executive coaching & leadership development" },
  { value: "mediation", label: "Mediation & workplace support" },
  { value: "other", label: "Something else / not sure yet" },
];

export const forms: Record<FormKey, FormDef> = {
  business: {
    key: "business",
    label: "Business enquiry",
    event: "Lead: Business Enquiry",
    destination: "leads",
    submitLabel: "Send enquiry",
    fields: [
      name,
      workEmail,
      company,
      phone,
      { name: "service", label: "Service you're interested in", type: "select", required: true, options: serviceOptions, placeholder: "Select a service" },
      {
        name: "preferredContact",
        label: "Preferred contact method",
        type: "select",
        required: true,
        options: [
          { value: "email", label: "Email" },
          { value: "phone", label: "Phone" },
        ],
      },
      { name: "message", label: "How can we help?", type: "textarea", required: true, minLength: 10, maxLength: 3000, rows: 5, placeholder: "A short description of what you need" },
    ],
    success: {
      heading: "Thank you — your enquiry has been sent",
      body: "A member of the OmniGroup HR team will review it and contact you using your preferred method.",
    },
  },

  va: {
    key: "va",
    label: "Virtual assistant enquiry",
    event: "Lead: VA Consultation",
    destination: "leads",
    submitLabel: "Request a VA consultation",
    fields: [
      name,
      workEmail,
      company,
      phone,
      {
        name: "supportType",
        label: "Type of support needed",
        type: "select",
        required: true,
        placeholder: "Select the main area",
        options: [
          { value: "executive", label: "Executive support" },
          { value: "calendar", label: "Calendar management" },
          { value: "social-inbox", label: "Social media & inbox management" },
          { value: "crm-data", label: "CRM & data management" },
          { value: "operations", label: "Operations & project coordination" },
          { value: "customer-service", label: "Customer service support" },
          { value: "multiple", label: "A mix of the above" },
          { value: "unsure", label: "Not sure yet" },
        ],
      },
      {
        name: "workload",
        label: "Expected workload",
        type: "select",
        half: true,
        placeholder: "If known",
        options: [
          { value: "under-10", label: "Under 10 hours a week" },
          { value: "10-20", label: "10–20 hours a week" },
          { value: "20-40", label: "20–40 hours a week" },
          { value: "full-time", label: "Full-time" },
          { value: "unsure", label: "Not sure yet" },
        ],
      },
      {
        name: "start",
        label: "Desired start",
        type: "select",
        half: true,
        placeholder: "If known",
        options: [
          { value: "asap", label: "As soon as possible" },
          { value: "1-month", label: "Within a month" },
          { value: "1-3-months", label: "In 1–3 months" },
          { value: "exploring", label: "Just exploring" },
        ],
      },
      { name: "message", label: "Anything else we should know?", type: "textarea", maxLength: 3000, rows: 4, hint: "Optional — tools you use, time zone, tasks you'd like to hand off" },
    ],
    success: {
      heading: "Thank you — your VA enquiry has been sent",
      body: "We'll review your requirements and contact you to arrange a consultation.",
    },
  },

  staffing: {
    key: "staffing",
    label: "Talent request",
    event: "Lead: Staffing Request",
    destination: "leads",
    submitLabel: "Request talent",
    fields: [
      name,
      workEmail,
      company,
      phone,
      {
        name: "roleCategory",
        label: "Role category",
        type: "select",
        required: true,
        half: true,
        placeholder: "Select a category",
        options: [
          { value: "engineering", label: "Engineering" },
          { value: "oil-gas", label: "Oil & gas" },
          { value: "infrastructure", label: "Infrastructure" },
          { value: "finance", label: "Finance" },
          { value: "hr", label: "Human resources" },
          { value: "executive", label: "Executive / leadership" },
          { value: "trades", label: "Trades & skilled labor" },
          { value: "administrative", label: "Administrative / virtual assistant" },
          { value: "other", label: "Other" },
        ],
      },
      {
        name: "engagementType",
        label: "Engagement type",
        type: "select",
        required: true,
        half: true,
        placeholder: "Select a type",
        options: [
          { value: "contract", label: "Contract / project staffing" },
          { value: "executive-search", label: "Executive search" },
          { value: "specialist", label: "Specialist or technical hire" },
          { value: "trades", label: "Trades & skilled labor" },
          { value: "unsure", label: "Not sure yet" },
        ],
      },
      { name: "roleTitle", label: "Role title(s)", type: "text", maxLength: 200, half: true, hint: "Optional" },
      { name: "location", label: "Role location", type: "text", required: true, maxLength: 200, half: true, placeholder: "City, state or remote" },
      {
        name: "timeline",
        label: "Hiring timeline",
        type: "select",
        required: true,
        placeholder: "Select a timeline",
        options: [
          { value: "urgent", label: "Urgent — within 2 weeks" },
          { value: "1-month", label: "Within a month" },
          { value: "1-3-months", label: "In 1–3 months" },
          { value: "planning", label: "Planning ahead" },
        ],
      },
      { name: "message", label: "Hiring requirements", type: "textarea", maxLength: 3000, rows: 4, hint: "Optional — number of roles, key skills, certifications" },
    ],
    success: {
      heading: "Thank you — your talent request has been sent",
      body: "We'll review the role details and contact you to discuss requirements and next steps.",
    },
  },

  application: {
    key: "application",
    label: "Job application",
    event: "Candidate: Application Submitted",
    destination: "careers",
    submitLabel: "Submit application",
    fields: [
      { name: "firstName", label: "First name", type: "text", required: true, autoComplete: "given-name", maxLength: 80, half: true },
      { name: "lastName", label: "Last name", type: "text", required: true, autoComplete: "family-name", maxLength: 80, half: true },
      { name: "email", label: "Email", type: "email", required: true, autoComplete: "email", maxLength: 200, half: true },
      { name: "phone", label: "Phone", type: "tel", required: true, autoComplete: "tel", maxLength: 40, half: true },
      {
        name: "position",
        label: "Position",
        type: "select",
        required: true,
        placeholder: "Select a position",
        options: [...openings.map((o) => ({ value: o.title, label: o.title })), { value: GENERAL_APPLICATION, label: GENERAL_APPLICATION }],
      },
      {
        name: "cv",
        label: "Resume / CV",
        type: "file",
        required: true,
        accept: [".pdf", ".doc", ".docx"],
        maxBytes: 5 * 1024 * 1024,
        hint: "PDF, DOC or DOCX, up to 5 MB",
      },
      {
        name: "availability",
        label: "Interview availability",
        type: "textarea",
        maxLength: 1000,
        rows: 3,
        hint: "Optional — suggest three dates and times over the next week for a 30-minute interview",
      },
      {
        name: "consent",
        label:
          "I agree that OmniGroup HR may use the information I provide to assess my application and, with my agreement, share it with prospective employers. See the Privacy Policy.",
        type: "checkbox",
        required: true,
      },
    ],
    success: {
      heading: "Thank you — your application has been received",
      body: "Our recruitment team will review your details. If your experience matches a current opportunity, we'll contact you about next steps.",
    },
  },

  newsletter: {
    key: "newsletter",
    label: "Newsletter sign-up",
    event: "Newsletter: Subscribed",
    destination: "newsletter",
    submitLabel: "Subscribe",
    fields: [
      { name: "email", label: "Email address", type: "email", required: true, autoComplete: "email", maxLength: 200 },
      { name: "consent", label: "Yes, send me the OmniGroup HR newsletter. I can unsubscribe at any time.", type: "checkbox", required: true },
    ],
    success: { heading: "You're subscribed", body: "Thanks for signing up." },
  },
};

export function isFormKey(value: string): value is FormKey {
  return Object.hasOwn(forms, value);
}
