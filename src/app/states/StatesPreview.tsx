"use client";

import type { ReactNode } from "react";
import { Openings } from "@/components/careers/Openings";
import { Field } from "@/components/forms/Field";
import { DraftNote, ErrorSummary, FormAlert, SlowNotice, SuccessPanel, UploadProgress } from "@/components/forms/FormStates";
import { OfflineNotice } from "@/components/layout/Connectivity";
import { EmptyState, ForbiddenPage, JobCardSkeleton, StatusPage } from "@/components/states";
import { GENERAL_APPLICATION, type Opening } from "@/content/careers";
import { forms } from "@/lib/forms/definitions";

const noop = () => {};

/** Sample roles for the search states only; never shown on the live careers page. */
const sampleOpenings: Opening[] = [
  { id: "1", title: "Civil Engineer", category: "engineering", location: "Norfolk, VA", summary: "Sample opening for previewing search.", responsibilities: ["Site inspections", "Design reviews"] },
  { id: "2", title: "HR Generalist", category: "hr", location: "Remote (U.S.)", summary: "Sample opening for previewing search.", responsibilities: ["Onboarding", "Policy support"] },
  { id: "3", title: "Staff Accountant", category: "finance", location: "Richmond, VA", summary: "Sample opening for previewing search.", responsibilities: ["Reconciliations", "Month-end close"] },
];

const states = [
  "empty",
  "loading",
  "error",
  "offline",
  "slow",
  "noresults",
  "forbidden",
  "expired",
  "validation",
  "success",
] as const;

function Block({ id, title, note, children }: { id: string; title: string; note?: string; children: ReactNode }) {
  return (
    <section id={id} className="border-t border-line py-12">
      <div className="container-page">
        <h2 className="text-3xl">{title}</h2>
        {note && <p className="mt-2 max-w-2xl text-muted">{note}</p>}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

export function StatesPreview() {
  const app = forms.application;
  const id = (name: string) => `preview-${name}`;
  const validationErrors = { email: "Enter a work email, for example name@company.com", service: "Choose an option from the list" };

  return (
    <>
      <div className="container-page py-12">
        <p className="eyebrow">Development only</p>
        <h1 className="mt-3 text-4xl">Interface states</h1>
        <p className="mt-3 max-w-2xl text-muted">Every state, rendered with sample data. Check each at 375px (phone), 768px (tablet) and 1280px (desktop) wide.</p>
        <nav className="mt-6 flex flex-wrap gap-2" aria-label="States">
          {states.map((s) => (
            <a key={s} href={`#${s}`} className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-accent">
              {s}
            </a>
          ))}
        </nav>
      </div>

      <Block id="empty" title="1. Empty" note="Careers with zero openings.">
        <EmptyState
          eyebrow="Current openings"
          title="No open positions right now"
          body="We post roles as clients bring them to us, so openings change often."
          action={{ label: "Send a general application", href: `/careers/apply?position=${encodeURIComponent(GENERAL_APPLICATION)}` }}
        />
      </Block>

      <Block id="loading" title="2. Loading" note="Job card skeletons, and a submit button mid-send. The footer newsletter form uses the same shimmer while its code loads.">
        <div className="grid gap-5 md:grid-cols-2">
          <JobCardSkeleton />
          <JobCardSkeleton />
        </div>
        <button type="button" className="btn btn-primary mt-8" disabled>
          Sending...
        </button>
      </Block>

      <Block id="error" title="3. Error" note="Form failures by cause, then the 404 and 500 pages.">
        <div className="grid max-w-2xl gap-4">
          <FormAlert kind="server" noun="enquiry" onRetry={noop} />
          <FormAlert kind="network" noun="application" onRetry={noop} />
          <FormAlert kind="other" noun="enquiry" message="Too many submissions. Please wait a minute and try again." onRetry={noop} />
        </div>
        <div className="mt-8 rounded-[var(--radius-card)] border border-line">
          <StatusPage code="404" title="We couldn't find that page">
            The page may have moved as part of our new website.
          </StatusPage>
        </div>
        <div className="mt-8 rounded-[var(--radius-card)] border border-line">
          <StatusPage code="500" title="Something went wrong on our side">
            This page didn&apos;t load because of a problem on our end, not anything you did.
          </StatusPage>
        </div>
      </Block>

      <Block id="offline" title="4. No internet" note="Banner under the header, the reconnect note, and a form submitted while offline.">
        <div className="border-y border-line bg-sand">
          <OfflineNotice kind="offline" onDismiss={noop} />
        </div>
        <div className="mt-4 border-y border-line bg-success-tint">
          <OfflineNotice kind="back" />
        </div>
        <div className="mt-6 max-w-2xl">
          <FormAlert kind="queued" noun="enquiry" />
        </div>
      </Block>

      <Block id="slow" title="5. Slow network" note="Resume upload progress with cancel, then the notice shown after 8 seconds.">
        <div className="grid max-w-2xl gap-4">
          <UploadProgress file={{ name: "Jordan-Lee-resume.pdf", size: 1_850_000 }} percent={42} onCancel={noop} />
          <SlowNotice application mailto="mailto:hr@omnigrouphr.com" />
          <SlowNotice application={false} mailto="mailto:hr@omnigrouphr.com" />
        </div>
      </Block>

      <Block id="noresults" title="6. No search results" note="Live search over sample roles. Try “enginer”, “VA” or “zzz”. Starts with a typo.">
        <Openings openings={sampleOpenings} initialQuery="enginer" syncUrl={false} />
      </Block>

      <Block id="forbidden" title="7. Permission denied" note="The site has no protected routes yet; this is the 403 page for when it does.">
        <div className="rounded-[var(--radius-card)] border border-line">
          <ForbiddenPage />
        </div>
      </Block>

      <Block id="expired" title="8. Restored draft" note="There is no sign-in on this site, so only the draft restore applies: shown when a visitor returns to an unsent form.">
        <div className="max-w-2xl">
          <DraftNote onDiscard={noop} />
        </div>
      </Block>

      <Block id="validation" title="9. Form validation" note="Summary at the top, then inline messages under each field.">
        <div className="card grid max-w-2xl gap-5 p-6 md:p-9">
          <ErrorSummary errors={validationErrors} fields={forms.business.fields} idFor={id} />
          {forms.business.fields
            .filter((f) => f.name in validationErrors || f.name === "phone")
            .map((f) => (
              <Field key={f.name} field={f} id={id(f.name)} error={validationErrors[f.name as keyof typeof validationErrors]} />
            ))}
          <Field field={app.fields.find((f) => f.type === "file")!} id={id("cv")} error="This file is 7.2 MB. Upload a file up to 5 MB, or save a smaller copy first" />
        </div>
      </Block>

      <Block id="success" title="10. Success" note="Enquiry and job application.">
        <div className="grid gap-6 lg:grid-cols-2">
          <SuccessPanel form={forms.business} firstName="Jordan" replyTo="jordan@company.com" />
          <SuccessPanel form={app} firstName="Jordan" replyTo="jordan@example.com" />
        </div>
      </Block>
    </>
  );
}
