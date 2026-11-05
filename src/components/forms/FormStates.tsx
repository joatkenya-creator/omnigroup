"use client";

import Link from "next/link";
import type { RefObject } from "react";
import { ArrowRight, CircleAlert, CircleCheck, Clock, WifiOff, X } from "lucide-react";
import type { FieldDef, FormDef } from "@/lib/forms/definitions";
import { site } from "@/content/site";

const { email, phoneDisplay, phoneE164 } = site.contact;

export type AlertKind = "server" | "network" | "other" | "queued";

/** Submission problems that aren't about a specific field. The form's data always stays in place. */
export function FormAlert({
  kind,
  noun,
  message,
  onRetry,
  alertRef,
}: {
  kind: AlertKind;
  noun: string;
  message?: string;
  onRetry?: () => void;
  alertRef?: RefObject<HTMLDivElement | null>;
}) {
  if (kind === "queued") {
    return (
      <div role="status" className="flex gap-3 rounded-xl border border-line bg-sand p-4 text-sm text-ink">
        <WifiOff className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
        <p>
          You&apos;re offline, so your {noun} hasn&apos;t been sent yet. Keep this page open and we&apos;ll send it automatically
          when you reconnect.
        </p>
      </div>
    );
  }
  const text = {
    server: `Something went wrong on our side and your ${noun} was not sent. Your details are still here. Try again, or email ${email}.`,
    network: `We couldn't reach our server, so your ${noun} was not sent. Your details are still here. Check your connection and try again, or email ${email}.`,
    other: message ?? "",
  }[kind];
  return (
    <div ref={alertRef} tabIndex={-1} role="alert" className="flex gap-3 rounded-xl border border-danger/30 bg-danger-tint p-4 text-sm text-danger outline-none">
      <CircleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div>
        <p className="font-semibold">{text}</p>
        <p className="mt-1 text-ink-soft">
          You can also call{" "}
          <a href={`tel:${phoneE164}`} data-track-location="form-error" className="text-link">
            {phoneDisplay}
          </a>
          .
        </p>
        {onRetry && (
          <button type="button" onClick={onRetry} className="btn btn-secondary mt-3 !min-h-10 !py-2">
            Try again
          </button>
        )}
      </div>
    </div>
  );
}

/** Lists every invalid field at the top of the form, each linking to its field. */
export function ErrorSummary({ errors, fields, idFor }: { errors: Record<string, string>; fields: FieldDef[]; idFor: (name: string) => string }) {
  const listed = fields.filter((f) => errors[f.name]);
  if (listed.length === 0) return null;
  return (
    <div role="alert" className="rounded-xl border border-danger/30 bg-danger-tint p-4 text-sm">
      <p className="font-semibold text-danger">
        {listed.length === 1 ? "One field needs attention" : `${listed.length} fields need attention`}
      </p>
      <ul className="mt-2 space-y-1">
        {listed.map((f) => (
          <li key={f.name}>
            <a
              href={`#${idFor(f.name)}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(idFor(f.name))?.focus();
              }}
              className="text-link"
            >
              {f.type === "checkbox" ? "Consent" : f.label}
            </a>
            : {errors[f.name]}
          </li>
        ))}
      </ul>
    </div>
  );
}

const formatSize = (bytes: number) => (bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`);

export function UploadProgress({ file, percent, onCancel }: { file: { name: string; size: number }; percent: number; onCancel: () => void }) {
  return (
    <div className="rounded-xl border border-line bg-sand p-4 text-sm">
      <div className="flex items-center gap-3">
        <p className="min-w-0 flex-1 truncate">
          <span className="font-semibold">{file.name}</span> <span className="text-muted">({formatSize(file.size)})</span>
        </p>
        <span className="tabular-nums text-ink-soft">{percent}%</span>
        <button type="button" onClick={onCancel} className="flex items-center gap-1 font-semibold text-accent hover:underline">
          <X className="size-4" aria-hidden="true" /> Cancel
        </button>
      </div>
      <div
        role="progressbar"
        aria-label={`Uploading ${file.name}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="mt-3 h-2 overflow-hidden rounded-full bg-sand-deep"
      >
        <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

/** Shown when a submission runs past ~8 seconds: offers a lighter way to reach us. */
export function SlowNotice({ application, mailto }: { application: boolean; mailto: string }) {
  return (
    <div role="status" className="flex gap-3 rounded-xl border border-line bg-sand p-4 text-sm text-ink">
      <Clock className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
      <p>
        This is taking longer than usual.{" "}
        {application ? (
          <>
            If your connection is slow, you can{" "}
            <a href={mailto} className="text-link">
              email your resume to {email}
            </a>{" "}
            instead.
          </>
        ) : (
          <>
            If your connection is slow, you can{" "}
            <a href={mailto} className="text-link">
              send this enquiry by email
            </a>{" "}
            instead.
          </>
        )}
      </p>
    </div>
  );
}

export function DraftNote({ onDiscard }: { onDiscard: () => void }) {
  return (
    <p role="status" className="flex flex-wrap items-center gap-x-2 rounded-xl bg-accent-tint px-4 py-3 text-sm text-ink">
      We restored your unsent draft.
      <button type="button" onClick={onDiscard} className="text-link">
        Discard
      </button>
    </p>
  );
}

/** Replaces the form after a confirmed submission: confirm, reassure, then what happens next. */
export function SuccessPanel({
  form,
  firstName,
  replyTo,
  dark = false,
  headingRef,
}: {
  form: FormDef;
  firstName?: string;
  replyTo?: string;
  dark?: boolean;
  headingRef?: RefObject<HTMLHeadingElement | null>;
}) {
  const { noun, steps, next } = form.success;
  const heading =
    form.success.heading ?? `Thanks${firstName ? `, ${firstName}` : ""}. Your ${noun} has been ${noun === "application" ? "received" : "sent"}.`;
  return (
    <div className={`rounded-2xl p-6 md:p-8 ${dark ? "bg-navy text-on-navy" : "bg-success-tint"}`}>
      <CircleCheck className={`size-8 ${dark ? "text-highlight" : "text-success"}`} aria-hidden="true" />
      <h3 ref={headingRef} tabIndex={-1} className="mt-4 text-2xl outline-none">
        {heading}
      </h3>
      {!form.success.heading && (
        <p className="mt-2 text-ink-soft">
          {replyTo && (
            <>
              We&apos;ll reply to <span className="font-semibold text-ink">{replyTo}</span>.{" "}
            </>
          )}
          Your details are only used to respond to this {noun}.
        </p>
      )}
      {steps && (
        <>
          <h4 className="mt-6 font-sans text-sm font-semibold uppercase tracking-[0.08em] text-muted">What happens next</h4>
          <ol className="mt-3 space-y-3">
            {steps.map((s, i) => (
              <li key={s} className="flex gap-3 text-ink-soft">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-accent">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </>
      )}
      {next && (
        <Link href={next.href} className="text-link mt-6 inline-flex items-center gap-1.5">
          {next.label} <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
