"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import { forms, type FieldDef, type FormKey } from "@/lib/forms/definitions";
import { validateFile, validateValues, type FieldErrors } from "@/lib/forms/schema";
import { track } from "@/lib/analytics";
import { site } from "@/content/site";
import { leadRows } from "@/lib/server/delivery";
import type { SubmitResponse } from "@/lib/server/submit";
import { useOnline } from "@/components/layout/Connectivity";
import { DraftNote, ErrorSummary, FormAlert, SlowNotice, SuccessPanel, UploadProgress, type AlertKind } from "./FormStates";
import { Field } from "./Field";
import { Turnstile } from "./Turnstile";

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  /** Submitted while offline; sends automatically when the connection returns. */
  | { state: "queued" }
  | { state: "success"; firstName?: string; replyTo?: string }
  | { state: "error"; kind: Exclude<AlertKind, "queued">; message?: string };

const SLOW_MS = 8000;
const DRAFT_SAVE_MS = 1500;
const SENDING = "Sending...";
const WAITING = "Waiting for connection";
const turnstileEnabled = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

const privacyNotes: Partial<Record<FormKey, string>> = {
  application: "Your resume is sent securely to our recruitment team. It is never published or shared without your agreement.",
  newsletter: "",
};

const stringValues = (el: HTMLFormElement) =>
  Object.fromEntries([...new FormData(el).entries()].filter(([, v]) => typeof v === "string")) as Record<string, string>;

/** XHR rather than fetch: only XHR reports upload progress. */
function post(url: string, data: FormData, onProgress: (percent: number) => void, xhrRef: { current: XMLHttpRequest | null }) {
  return new Promise<{ code: number; body: SubmitResponse | null }>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    xhr.open("POST", url);
    xhr.responseType = "json";
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => resolve({ code: xhr.status, body: xhr.response });
    xhr.onerror = () => reject(new TypeError("Network request failed"));
    xhr.onabort = () => reject(new DOMException("Upload cancelled", "AbortError"));
    xhr.send(data);
  });
}

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
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showSummary, setShowSummary] = useState(false);
  const [turnstileReset, setTurnstileReset] = useState(0);
  const [upload, setUpload] = useState<{ name: string; size: number; percent: number } | null>(null);
  /** mailto: link for the slow-network fallback, set once a submission passes SLOW_MS. */
  const [slowMailto, setSlowMailto] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);
  const online = useOnline();
  const dark = variant === "compact";
  const fieldId = (name: string) => `${uid}-${name}`;
  const draftKey = formKey === "newsletter" ? null : `omnigroup-draft:${formKey}`;
  const fileField = form.fields.find((f): f is Extract<FieldDef, { type: "file" }> => f.type === "file");
  const prefillKey = prefillFromQuery.join(",");

  /** Records when the form was first shown, for the server's minimum fill-time check. */
  function stamp() {
    const ts = formRef.current?.elements.namedItem("_ts") as HTMLInputElement | null;
    if (ts) ts.value = String(Date.now());
  }

  function applyQueryPrefill() {
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
  }

  // Restore an unsent draft first, so a link like ?position= still wins over it.
  useEffect(() => {
    stamp();
    const el = formRef.current;
    if (el && draftKey) {
      let saved: Record<string, string> | null = null;
      try {
        saved = JSON.parse(localStorage.getItem(draftKey) ?? "null");
      } catch {}
      let restoredAny = false;
      for (const f of form.fields) {
        const value = saved?.[f.name];
        const input = el.elements.namedItem(f.name) as HTMLInputElement | null;
        if (!value || !input || f.type === "file" || f.type === "checkbox") continue;
        input.value = value;
        restoredAny = true;
      }
      if (restoredAny) setRestored(true);
    }
    applyQueryPrefill();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once per form
  }, [formKey]);

  useEffect(() => {
    if (status.state === "success") successRef.current?.focus();
    if (status.state === "error") errorRef.current?.focus();
  }, [status]);

  // Back online with a queued submission: get a fresh spam-check token, then send.
  useEffect(() => {
    if (status.state !== "queued" || !online) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- re-renders the Turnstile widget
    setTurnstileReset((n) => n + 1);
    let cancelled = false;
    (async () => {
      for (let i = 0; i < 30; i++) {
        await new Promise((r) => setTimeout(r, 500));
        if (!turnstileEnabled) break;
        const token = formRef.current?.elements.namedItem("cf-turnstile-response") as HTMLInputElement | null;
        if (token?.value) break;
      }
      if (cancelled) return;
      setStatus({ state: "idle" });
      formRef.current?.requestSubmit();
    })();
    return () => {
      cancelled = true;
    };
  }, [status.state, online]);

  useEffect(() => () => clearTimeout(saveTimer.current), []);

  /** Saves text fields to localStorage. Files and consent boxes are never stored. */
  function saveDraft() {
    clearTimeout(saveTimer.current);
    const el = formRef.current;
    if (!el || !draftKey) return;
    const values: Record<string, string> = {};
    for (const f of form.fields) {
      const value = (el.elements.namedItem(f.name) as HTMLInputElement | null)?.value;
      if (value && f.type !== "file" && f.type !== "checkbox") values[f.name] = value;
    }
    try {
      if (Object.keys(values).length > 0) localStorage.setItem(draftKey, JSON.stringify(values));
      else localStorage.removeItem(draftKey);
    } catch {}
  }

  function clearDraft() {
    clearTimeout(saveTimer.current);
    try {
      if (draftKey) localStorage.removeItem(draftKey);
    } catch {}
  }

  function discardDraft() {
    clearDraft();
    formRef.current?.reset();
    stamp();
    applyQueryPrefill();
    setErrors({});
    setRestored(false);
  }

  function errorFor(name: string) {
    const el = formRef.current;
    const field = form.fields.find((f) => f.name === name);
    if (!el || !field) return undefined;
    if (field.type === "file") return validateFile(field, (el.elements.namedItem(name) as HTMLInputElement).files?.[0]) ?? undefined;
    const result = validateValues(form, stringValues(el));
    return result.ok ? undefined : result.errors[name];
  }

  function updateError(name: string) {
    const message = errorFor(name);
    setErrors((prev) => {
      if (prev[name] === message) return prev;
      const next = { ...prev };
      if (message) next[name] = message;
      else delete next[name];
      return next;
    });
  }

  // Validate a field when the user leaves it, but don't flag a required field they only tabbed past.
  function onBlur(e: FocusEvent<HTMLFormElement>) {
    const t = e.target as EventTarget as HTMLInputElement;
    if (!form.fields.some((f) => f.name === t.name)) return;
    const filled = t.type === "checkbox" ? t.checked : t.value !== "";
    if (t.type !== "file" && (filled || errors[t.name])) updateError(t.name);
    saveDraft();
  }

  // Once a field shows an error, re-check it as the user fixes it. Files are checked as soon as they're chosen.
  function onChange(e: ChangeEvent<HTMLFormElement>) {
    const t = e.target as EventTarget as HTMLInputElement;
    if (t.type === "file" || errors[t.name]) updateError(t.name);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(saveDraft, DRAFT_SAVE_MS);
  }

  function focusFirstError(errs: FieldErrors) {
    const first = form.fields.find((f) => errs[f.name]);
    if (first) document.getElementById(fieldId(first.name))?.focus();
  }

  function emailFallback(values: Record<string, string>) {
    const name = [values.firstName, values.lastName].filter(Boolean).join(" ") || values.name || "";
    const subject = formKey === "application" ? `Application for ${values.position || "a position"} from ${name}` : `${form.label} from ${name}`;
    const body = leadRows(form, values)
      .map((r) => `${r.label}: ${r.value}`)
      .concat(formKey === "application" ? ["", "My resume is attached."] : [])
      .join("\n");
    return `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.state === "submitting") return;
    const el = e.currentTarget;
    const strings = stringValues(el);

    const result = validateValues(form, strings);
    const clientErrors: FieldErrors = result.ok ? {} : { ...result.errors };
    const file = fileField ? (el.elements.namedItem(fileField.name) as HTMLInputElement).files?.[0] : undefined;
    const fileError = fileField && validateFile(fileField, file);
    if (fileField && fileError) clientErrors[fileField.name] = fileError;
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) {
      setShowSummary(true);
      setStatus({ state: "idle" });
      focusFirstError(clientErrors);
      return;
    }
    setShowSummary(false);
    saveDraft();
    if (!navigator.onLine) {
      setStatus({ state: "queued" });
      return;
    }

    const data = new FormData(el);
    data.set("_page", window.location.pathname);
    setStatus({ state: "submitting" });
    setUpload(file ? { name: file.name, size: file.size, percent: 0 } : null);
    const slowTimer = setTimeout(() => setSlowMailto(emailFallback(strings)), SLOW_MS);
    try {
      const { code, body } = await post(`/api/forms/${formKey}`, data, (percent) => setUpload((u) => u && { ...u, percent }), xhrRef);
      if (body?.ok) {
        clearDraft();
        const firstName = (strings.firstName ?? strings.name ?? "").trim().split(/\s+/)[0] || undefined;
        setStatus({ state: "success", firstName, replyTo: strings.email });
        const service = strings.service ?? strings.supportType ?? strings.roleCategory ?? strings.position;
        track(form.event, { form: formKey, page: window.location.pathname, ...(service ? { detail: String(service) } : {}) });
        return;
      }
      if (body && !body.ok && body.errors) {
        setErrors(body.errors);
        setShowSummary(true);
        setStatus({ state: "idle" });
        focusFirstError(body.errors);
        return;
      }
      // Our side: any 5xx or a delivery problem. Otherwise (rate limit, spam check) show the server's explanation.
      if (code < 500 && body && !body.ok && body.code !== "not_configured" && body.code !== "delivery_failed") {
        setStatus({ state: "error", kind: "other", message: body.message });
      } else {
        setStatus({ state: "error", kind: "server" });
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") setStatus({ state: "idle" });
      else setStatus(navigator.onLine ? { state: "error", kind: "network" } : { state: "queued" });
    } finally {
      clearTimeout(slowTimer);
      setSlowMailto(null);
      setUpload(null);
      xhrRef.current = null;
      setTurnstileReset((n) => n + 1);
    }
  }

  if (status.state === "success") {
    return <SuccessPanel form={form} firstName={status.firstName} replyTo={status.replyTo} dark={dark} headingRef={successRef} />;
  }

  const submitting = status.state === "submitting";
  const queued = status.state === "queued";
  const buttonLabel = submitting ? SENDING : queued ? WAITING : form.submitLabel;
  const note = privacyNotes[formKey] ?? "We'll use your details only to respond to this enquiry.";

  return (
    <form ref={formRef} onSubmit={onSubmit} onBlur={onBlur} onChange={onChange} noValidate aria-busy={submitting} className="grid gap-5">
      {restored && <DraftNote onDiscard={discardDraft} />}
      {status.state === "error" && (
        <FormAlert
          kind={status.kind}
          noun={form.success.noun}
          message={status.message}
          onRetry={() => formRef.current?.requestSubmit()}
          alertRef={errorRef}
        />
      )}
      {queued && <FormAlert kind="queued" noun={form.success.noun} />}
      {showSummary && <ErrorSummary errors={errors} fields={form.fields} idFor={fieldId} />}

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

      {upload && <UploadProgress file={upload} percent={upload.percent} onCancel={() => xhrRef.current?.abort()} />}
      {slowMailto && <SlowNotice application={formKey === "application"} mailto={slowMailto} />}

      <div className={`flex flex-col gap-4 ${dark ? "" : "sm:flex-row sm:items-center sm:justify-between"}`}>
        <button type="submit" className={`btn ${dark ? "btn-light" : "btn-primary"}`} disabled={submitting || queued}>
          {/* Every label occupies the same grid cell, so the button keeps its width as the label changes. */}
          <span className="grid">
            {[form.submitLabel, SENDING, WAITING].map((l) => (
              <span key={l} className={`col-start-1 row-start-1 ${l === buttonLabel ? "" : "invisible"}`}>
                {l}
              </span>
            ))}
          </span>
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
