"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import { forms, type FieldDef, type FormKey } from "@/lib/forms/definitions";
import { validateFile, validateValues, type FieldErrors } from "@/lib/forms/schema";
import { track } from "@/lib/analytics";
import { site } from "@/content/site";
import type { SubmitResponse } from "@/lib/server/submit";
import { Field } from "./Field";
import { Turnstile } from "./Turnstile";

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success" }
  | { state: "error"; message: string; offerContact: boolean };

const privacyNotes: Partial<Record<FormKey, string>> = {
  application: "Your resume is sent securely to our recruitment team. It is never published or shared without your agreement.",
  newsletter: "",
};

export function LeadForm({
  formKey,
  defaults = {},
  prefillFromQuery = [],
  variant = "card",
}: {
  formKey: FormKey;
  defaults?: Record<string, string>;
  /** Field names that may be pre-selected from the URL, e.g. ?service=va */
  prefillFromQuery?: string[];
  variant?: "card" | "compact";
}) {
  const form = forms[formKey];
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [turnstileReset, setTurnstileReset] = useState(0);
  const dark = variant === "compact";
  const fieldId = (name: string) => `${uid}-${name}`;

  // Records when the form was first shown, for the server's minimum fill-time check.
  useEffect(() => {
    const ts = formRef.current?.elements.namedItem("_ts") as HTMLInputElement | null;
    if (ts) ts.value = String(Date.now());
  }, []);

  const prefillKey = prefillFromQuery.join(",");
  useEffect(() => {
    const el = formRef.current;
    if (!el || !prefillKey) return;
    const params = new URLSearchParams(window.location.search);
    for (const name of prefillKey.split(",")) {
      const value = params.get(name);
      const field = form.fields.find((f) => f.name === name);
      if (value && field?.type === "select" && field.options.some((o) => o.value === value)) {
        (el.elements.namedItem(name) as HTMLSelectElement).value = value;
      }
    }
  }, [form, prefillKey]);

  useEffect(() => {
    if (status.state === "success") successRef.current?.focus();
    if (status.state === "error") errorRef.current?.focus();
  }, [status]);

  function focusFirstError(errs: FieldErrors) {
    const first = form.fields.find((f) => errs[f.name]);
    if (first) document.getElementById(fieldId(first.name))?.focus();
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.state === "submitting") return;
    const el = e.currentTarget;
    const data = new FormData(el);
    data.set("_page", window.location.pathname);

    const strings = Object.fromEntries([...data.entries()].filter(([, v]) => typeof v === "string"));
    const result = validateValues(form, strings);
    const clientErrors: FieldErrors = result.ok ? {} : { ...result.errors };
    for (const f of form.fields) {
      if (f.type !== "file") continue;
      const file = data.get(f.name);
      const err = validateFile(f as Extract<FieldDef, { type: "file" }>, file instanceof File ? file : null);
      if (err) clientErrors[f.name] = err;
    }
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) {
      setStatus({ state: "idle" });
      focusFirstError(clientErrors);
      return;
    }

    setStatus({ state: "submitting" });
    try {
      const res = await fetch(`/api/forms/${formKey}`, { method: "POST", body: data });
      const body = (await res.json().catch(() => null)) as SubmitResponse | null;
      if (res.ok && body?.ok) {
        setStatus({ state: "success" });
        const service = strings.service ?? strings.supportType ?? strings.roleCategory ?? strings.position;
        track(form.event, { form: formKey, page: window.location.pathname, ...(service ? { detail: String(service) } : {}) });
        return;
      }
      if (body && !body.ok && body.errors) {
        setErrors(body.errors);
        setStatus({ state: "idle" });
        focusFirstError(body.errors);
        return;
      }
      const code = body && !body.ok ? body.code : "delivery_failed";
      setStatus({
        state: "error",
        message: body && !body.ok ? body.message : "Something went wrong while sending your submission.",
        offerContact: code === "not_configured" || code === "delivery_failed",
      });
    } catch {
      setStatus({ state: "error", message: "We couldn't reach the server. Please check your connection and try again.", offerContact: true });
    } finally {
      setTurnstileReset((n) => n + 1);
    }
  }

  if (status.state === "success") {
    return (
      <div role="status" className={`rounded-2xl p-6 md:p-8 ${dark ? "bg-navy text-on-navy" : "bg-success-tint"}`}>
        <CircleCheck className={`size-8 ${dark ? "text-brass" : "text-success"}`} aria-hidden="true" />
        <h3 ref={successRef} tabIndex={-1} className="mt-4 text-2xl outline-none">
          {form.success.heading}
        </h3>
        <p className={`mt-2 ${dark ? "text-on-navy-muted" : "text-ink-soft"}`}>{form.success.body}</p>
        {!dark && (
          <p className="mt-4 text-sm text-ink-soft">
            Need to reach us sooner? Call{" "}
            <a href={`tel:${site.contact.phoneE164}`} data-track-location="form-success" className="text-link">
              {site.contact.phoneDisplay}
            </a>
            .
          </p>
        )}
      </div>
    );
  }

  const submitting = status.state === "submitting";
  const note = privacyNotes[formKey] ?? "We'll use your details only to respond to this enquiry.";

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-busy={submitting} className="grid gap-5">
      {status.state === "error" && (
        <div ref={errorRef} tabIndex={-1} role="alert" className="flex gap-3 rounded-xl border border-danger/30 bg-danger-tint p-4 text-sm text-danger outline-none">
          <CircleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">{status.message}</p>
            {status.offerContact && (
              <p className="mt-1 text-ink-soft">
                Please email{" "}
                <a href={`mailto:${site.contact.email}`} data-track-location="form-error" className="text-link">
                  {site.contact.email}
                </a>{" "}
                or call{" "}
                <a href={`tel:${site.contact.phoneE164}`} data-track-location="form-error" className="text-link">
                  {site.contact.phoneDisplay}
                </a>{" "}
                and we&apos;ll help directly.
              </p>
            )}
          </div>
        </div>
      )}

      {Object.keys(errors).length > 1 && (
        <p className={`text-sm font-medium ${dark ? "text-[#fda29b]" : "text-danger"}`}>
          Please correct the {Object.keys(errors).length} highlighted fields.
        </p>
      )}

      <div className={dark ? "grid gap-4" : "grid gap-5 sm:grid-cols-2"}>
        {form.fields.map((field) => (
          <div key={field.name} className={dark || field.half ? "" : "sm:col-span-2"}>
            <Field field={field} id={fieldId(field.name)} error={errors[field.name]} defaultValue={defaults[field.name]} dark={dark} />
          </div>
        ))}
      </div>

      {/* Bot traps: hidden from people and assistive technology. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <input type="hidden" name="_ts" defaultValue="" />

      <Turnstile resetKey={turnstileReset} theme={dark ? "dark" : "light"} />

      <div className={`flex flex-col gap-4 ${dark ? "" : "sm:flex-row sm:items-center sm:justify-between"}`}>
        <button type="submit" className={`btn ${dark ? "btn-light" : "btn-primary"} sm:min-w-52`} disabled={submitting}>
          {submitting && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
          {submitting ? "Sending…" : form.submitLabel}
        </button>
        {note && (
          <p className={`text-sm ${dark ? "text-on-navy-muted" : "text-muted"} sm:max-w-xs`}>
            {note}{" "}
            <Link href="/privacy-policy" className={dark ? "underline" : "text-link"}>
              Privacy Policy
            </Link>
          </p>
        )}
      </div>
    </form>
  );
}
