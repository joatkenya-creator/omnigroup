import type { FormDef } from "@/lib/forms/definitions";
import type { FormValues } from "@/lib/forms/schema";

export type Attachment = { filename: string; content: string /* base64 */ };

export type Lead = {
  form: FormDef;
  values: FormValues;
  page: string;
  submittedAt: string;
  attachment?: Attachment;
};

export type DeliveryResult =
  | { status: "delivered" }
  | { status: "not_configured" }
  | { status: "duplicate" }
  | { status: "failed" };

const env = (name: string) => process.env[name]?.trim() || undefined;
const list = (value?: string) => value?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** Field label/value pairs in form order, with option values shown as their labels. */
export function leadRows(form: FormDef, values: FormValues) {
  return form.fields
    .filter((f) => f.type !== "file" && f.type !== "checkbox" && values[f.name])
    .map((f) => {
      const raw = values[f.name];
      const label = f.type === "select" ? (f.options.find((o) => o.value === raw)?.label ?? raw) : raw;
      return { name: f.name, label: f.label, value: label };
    });
}

export function leadSubject(lead: Lead) {
  const v = lead.values;
  const who =
    lead.form.key === "application"
      ? `${v.position} — ${v.firstName} ${v.lastName}`
      : [v.company, v.name].filter(Boolean).join(" — ");
  return `New ${lead.form.label.toLowerCase()}: ${who}`.replace(/[\r\n]+/g, " ").slice(0, 200);
}

function renderEmail(lead: Lead) {
  const rows = leadRows(lead.form, lead.values);
  const meta = [
    { label: "Submitted", value: lead.submittedAt },
    { label: "Page", value: lead.page },
    ...(lead.attachment ? [{ label: "Attachment", value: lead.attachment.filename }] : []),
  ];
  const text = [...rows, ...meta].map((r) => `${r.label}:\n${r.value}\n`).join("\n");
  const tr = (r: { label: string; value: string }) =>
    `<tr><th align="left" valign="top" style="padding:8px 16px 8px 0;color:#475467;font-weight:600;white-space:nowrap">${escapeHtml(r.label)}</th><td style="padding:8px 0;white-space:pre-wrap">${escapeHtml(r.value)}</td></tr>`;
  const html = `<div style="font-family:Arial,sans-serif;font-size:14px;color:#101828">
<h2 style="font-size:18px">${escapeHtml(lead.form.label)}</h2>
<table cellspacing="0" cellpadding="0">${rows.map(tr).join("")}</table>
<hr style="border:none;border-top:1px solid #e4e7ec;margin:20px 0">
<table cellspacing="0" cellpadding="0" style="font-size:12px;color:#475467">${meta.map(tr).join("")}</table>
</div>`;
  return { html, text };
}

async function sendEmail(lead: Lead): Promise<DeliveryResult> {
  const apiKey = env("RESEND_API_KEY");
  const from = env("LEAD_FROM_EMAIL");
  const to = list(lead.form.destination === "careers" ? (env("CAREERS_TO_EMAIL") ?? env("LEAD_TO_EMAIL")) : env("LEAD_TO_EMAIL"));
  if (!apiKey || !from || to.length === 0) return { status: "not_configured" };

  const { html, text } = renderEmail(lead);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to,
      reply_to: lead.values.email,
      subject: leadSubject(lead),
      html,
      text,
      ...(lead.attachment ? { attachments: [lead.attachment] } : {}),
    }),
  });
  if (!res.ok) {
    console.error("Resend delivery failed", res.status, await res.text().catch(() => ""));
    return { status: "failed" };
  }
  return { status: "delivered" };
}

async function postWebhook(url: string, payload: unknown): Promise<DeliveryResult> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (res.status === 409) return { status: "duplicate" };
  if (!res.ok) {
    console.error("Webhook delivery failed", res.status);
    return { status: "failed" };
  }
  return { status: "delivered" };
}

/**
 * Delivers a lead through every configured channel. Succeeds when at least
 * one channel accepts it. CV attachments are only ever sent by email, so
 * applications require email delivery to be configured.
 */
export async function deliver(lead: Lead): Promise<DeliveryResult> {
  if (lead.form.destination === "newsletter") {
    const url = env("NEWSLETTER_WEBHOOK_URL");
    if (!url) return { status: "not_configured" };
    return postWebhook(url, {
      email: lead.values.email,
      source: lead.page,
      consentText: lead.form.fields.find((f) => f.name === "consent")?.label,
      submittedAt: lead.submittedAt,
    }).catch(() => ({ status: "failed" }) as const);
  }

  const webhook = lead.form.destination === "leads" ? env("LEAD_WEBHOOK_URL") : undefined;
  const attempts: Promise<DeliveryResult>[] = [sendEmail(lead)];
  if (webhook) {
    attempts.push(
      postWebhook(webhook, {
        form: lead.form.key,
        formLabel: lead.form.label,
        submittedAt: lead.submittedAt,
        page: lead.page,
        fields: leadRows(lead.form, lead.values),
      }),
    );
  }

  const results = (await Promise.allSettled(attempts)).map((r) =>
    r.status === "fulfilled" ? r.value : ({ status: "failed" } as const),
  );
  if (results.some((r) => r.status === "delivered")) return { status: "delivered" };
  if (results.every((r) => r.status === "not_configured")) return { status: "not_configured" };
  return { status: "failed" };
}
