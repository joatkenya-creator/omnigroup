import { z } from "zod";
import type { FieldDef, FormDef } from "./definitions";

export type FieldErrors = Record<string, string>;
export type FormValues = Record<string, string>;

const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const phonePattern = /^[+()\d\s.\-x]{7,40}$/i;

function fieldSchema(field: FieldDef) {
  const required = `${field.label} is required`;

  switch (field.type) {
    case "checkbox": {
      const schema = z.literal("on", { error: "Please confirm to continue" });
      return field.required ? schema : schema.optional();
    }
    case "select": {
      const values = field.options.map((o) => o.value) as [string, ...string[]];
      const schema = z.enum(values, { error: (iss) => (iss.input === undefined ? required : "Please choose an option from the list") });
      return field.required ? schema : schema.optional();
    }
    case "file":
      // Files are validated separately by validateFile().
      return z.string().optional();
    default: {
      let schema = z.string({ error: required }).trim();
      if (field.type === "email") schema = schema.regex(emailPattern, { error: "Enter a valid email address" });
      if (field.type === "tel") schema = schema.regex(phonePattern, { error: "Enter a valid phone number" });
      if (field.type === "textarea" && field.minLength)
        schema = schema.min(field.minLength, { error: `Please add a little more detail (at least ${field.minLength} characters)` });
      if (field.maxLength) schema = schema.max(field.maxLength, { error: `Please keep this under ${field.maxLength} characters` });
      return field.required ? schema : schema.optional();
    }
  }
}

/** Validates the non-file values of a submission. Blank strings count as missing. */
export function validateValues(form: FormDef, raw: Record<string, unknown>) {
  const input: Record<string, string | undefined> = {};
  for (const field of form.fields) {
    const v = raw[field.name];
    input[field.name] = typeof v === "string" && v.trim() !== "" ? v : undefined;
  }

  const shape = Object.fromEntries(form.fields.map((f) => [f.name, fieldSchema(f)]));
  const result = z.object(shape).safeParse(input);

  if (result.success) {
    const values: FormValues = {};
    for (const [k, v] of Object.entries(result.data)) if (typeof v === "string") values[k] = v;
    return { ok: true as const, values };
  }

  const errors: FieldErrors = {};
  for (const issue of result.error.issues) errors[String(issue.path[0])] ??= issue.message;
  return { ok: false as const, errors };
}

const signatures: Record<string, number[]> = {
  ".pdf": [0x25, 0x50, 0x44, 0x46], // %PDF
  ".docx": [0x50, 0x4b, 0x03, 0x04], // ZIP container
  ".doc": [0xd0, 0xcf, 0x11, 0xe0], // OLE compound file
};

export function extensionOf(filename: string) {
  const i = filename.lastIndexOf(".");
  return i === -1 ? "" : filename.slice(i).toLowerCase();
}

/**
 * Checks an upload's name and size and, when its first bytes are supplied,
 * its file signature, so a renamed executable is rejected server-side.
 */
export function validateFile(
  field: Extract<FieldDef, { type: "file" }>,
  file: { name: string; size: number } | null | undefined,
  head?: Uint8Array,
): string | null {
  if (!file || file.size === 0) return field.required ? `${field.label} is required` : null;
  const ext = extensionOf(file.name);
  if (!field.accept.includes(ext)) return `Please upload a ${field.accept.map((a) => a.slice(1).toUpperCase()).join(", ")} file`;
  if (file.size > field.maxBytes) return `Files must be smaller than ${Math.round(field.maxBytes / 1024 / 1024)} MB`;
  if (head && !(signatures[ext] ?? []).every((b, i) => head[i] === b)) return "This file doesn't appear to be a valid document";
  return null;
}
