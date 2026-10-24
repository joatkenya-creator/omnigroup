import { forms, isFormKey, type FieldDef } from "@/lib/forms/definitions";
import { validateFile, validateValues, type FieldErrors } from "@/lib/forms/schema";
import { deliver, type Attachment } from "./delivery";
import { clientIp, isRateLimited, verifyTurnstile } from "./guards";

/** Response codes the client form understands. */
export type SubmitResponse =
  | { ok: true }
  | {
      ok: false;
      code: "invalid" | "rate_limited" | "verification_failed" | "not_configured" | "already_subscribed" | "delivery_failed" | "too_large" | "bad_request";
      message: string;
      errors?: FieldErrors;
    };

const MAX_BODY_BYTES = 6 * 1024 * 1024;
const MIN_FILL_MS = 2500;

const json = (body: SubmitResponse, status: number) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

function safePage(value: FormDataEntryValue | null) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value.slice(0, 200) : "/";
}

export async function handleSubmission(request: Request, formKey: string): Promise<Response> {
  if (!isFormKey(formKey)) return json({ ok: false, code: "bad_request", message: "Unknown form." }, 404);
  const form = forms[formKey];

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) return json({ ok: false, code: "too_large", message: "This submission is too large. Please upload a smaller file." }, 413);

  const ip = clientIp(request);
  if (await isRateLimited(`${formKey}:${ip}`)) {
    return json({ ok: false, code: "rate_limited", message: "Too many submissions. Please wait a minute and try again." }, 429);
  }

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return json({ ok: false, code: "bad_request", message: "We couldn't read this submission." }, 400);
  }

  // Bot checks: a hidden honeypot field, then a minimum time to fill the form.
  const startedAt = Number(data.get("_ts"));
  if (data.get("website") || !Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) {
    return json({ ok: false, code: "verification_failed", message: "We couldn't verify this submission. Please wait a moment and try again." }, 400);
  }

  if (!(await verifyTurnstile(data.get("cf-turnstile-response") as string | null, ip))) {
    return json({ ok: false, code: "verification_failed", message: "Spam protection check failed. Please complete the check and try again." }, 400);
  }

  const raw = Object.fromEntries([...data.entries()].filter(([, v]) => typeof v === "string"));
  const result = validateValues(form, raw);
  const errors: FieldErrors = result.ok ? {} : { ...result.errors };

  let attachment: Attachment | undefined;
  const fileField = form.fields.find((f): f is Extract<FieldDef, { type: "file" }> => f.type === "file");
  if (fileField) {
    const entry = data.get(fileField.name);
    const file = entry instanceof File ? entry : null;
    const bytes = file && file.size > 0 ? new Uint8Array(await file.arrayBuffer()) : undefined;
    const fileError = validateFile(fileField, file, bytes?.subarray(0, 8));
    if (fileError) errors[fileField.name] = fileError;
    else if (file && bytes) attachment = { filename: file.name.replace(/[^\w.\- ]+/g, "_").slice(-120), content: Buffer.from(bytes).toString("base64") };
  }

  if (!result.ok || Object.keys(errors).length > 0) {
    return json({ ok: false, code: "invalid", message: "Please check the highlighted fields.", errors }, 422);
  }

  const outcome = await deliver({
    form,
    values: result.values,
    page: safePage(data.get("_page")),
    submittedAt: new Date().toISOString(),
    attachment,
  });

  switch (outcome.status) {
    case "delivered":
      return json({ ok: true }, 200);
    case "duplicate":
      return json({ ok: false, code: "already_subscribed", message: "This email address is already subscribed." }, 409);
    case "not_configured":
      console.error(`Form "${formKey}" received a submission but no delivery channel is configured.`);
      return json({ ok: false, code: "not_configured", message: "Online submissions aren't available right now." }, 503);
    default:
      return json({ ok: false, code: "delivery_failed", message: "We couldn't send your submission." }, 502);
  }
}
