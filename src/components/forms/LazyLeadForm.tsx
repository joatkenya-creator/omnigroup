"use client";

import dynamic from "next/dynamic";

/**
 * LeadForm loaded on demand. Used in the site-wide footer so pages without a
 * form don't ship the form, validation and Turnstile code in the shared bundle.
 */
export const LazyLeadForm = dynamic(() => import("./LeadForm").then((m) => m.LeadForm), {
  loading: () => (
    <div className="grid h-40 content-start gap-4" aria-hidden="true">
      <div className="skeleton h-12 w-full rounded-xl opacity-20" />
      <div className="skeleton h-5 w-2/3 opacity-20" />
      <div className="skeleton h-12 w-36 rounded-full opacity-20" />
    </div>
  ),
});
