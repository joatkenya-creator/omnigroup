"use client";

import dynamic from "next/dynamic";

/**
 * LeadForm loaded on demand. Used in the site-wide footer so pages without a
 * form don't ship the form, validation and Turnstile code in the shared bundle.
 */
export const LazyLeadForm = dynamic(() => import("./LeadForm").then((m) => m.LeadForm), {
  loading: () => <div className="h-40" aria-hidden="true" />,
});
