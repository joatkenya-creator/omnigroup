import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { FieldDef } from "@/lib/forms/definitions";

const control =
  "block w-full rounded-xl border bg-white px-4 py-3 text-[0.9375rem] text-ink placeholder:text-muted/80 transition-colors focus:border-accent focus:outline-none focus:ring-3 focus:ring-accent/20 aria-[invalid=true]:border-danger aria-[invalid=true]:ring-danger/15";

function withPolicyLink(label: string) {
  const [before, after] = label.split("Privacy Policy");
  if (after === undefined) return label;
  return (
    <>
      {before}
      <Link href="/privacy-policy" className="text-link" target="_blank">
        Privacy Policy
      </Link>
      {after}
    </>
  );
}

export function Field({
  field,
  id,
  error,
  defaultValue,
  dark = false,
}: {
  field: FieldDef;
  id: string;
  error?: string;
  defaultValue?: string;
  dark?: boolean;
}) {
  const hintId = field.hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const common = {
    id,
    name: field.name,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    "aria-required": field.required || undefined,
  };
  const borderClass = error ? "border-danger" : "border-line";
  const labelClass = `block text-sm font-semibold ${dark ? "text-on-navy" : "text-ink"}`;
  const hintClass = `mt-1 text-sm ${dark ? "text-on-navy-muted" : "text-muted"}`;

  const messages = (
    <>
      {field.hint && field.type !== "checkbox" && (
        <p id={hintId} className={hintClass}>
          {field.hint}
        </p>
      )}
      {error && (
        <p id={errorId} className={`mt-1.5 text-sm font-medium ${dark ? "text-[#fda29b]" : "text-danger"}`}>
          {error}
        </p>
      )}
    </>
  );

  if (field.type === "checkbox") {
    return (
      <div>
        <div className="flex items-start gap-3">
          <input
            {...common}
            type="checkbox"
            className="mt-0.5 size-5 shrink-0 cursor-pointer rounded border-line accent-[var(--color-accent)]"
          />
          <label htmlFor={id} className={`text-sm leading-relaxed ${dark ? "text-on-navy-muted" : "text-ink-soft"}`}>
            {withPolicyLink(field.label)}
          </label>
        </div>
        {messages}
      </div>
    );
  }

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {field.label}
        {field.required && (
          <span className="text-danger" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      <div className="mt-2">
        {field.type === "textarea" ? (
          <textarea
            {...common}
            rows={field.rows ?? 4}
            maxLength={field.maxLength}
            placeholder={field.placeholder}
            defaultValue={defaultValue}
            className={`${control} ${borderClass} resize-y`}
          />
        ) : field.type === "select" ? (
          <div className="relative">
            <select {...common} defaultValue={defaultValue ?? ""} className={`${control} ${borderClass} appearance-none pr-11`}>
              <option value="" disabled={field.required}>
                {field.placeholder ?? "Select an option"}
              </option>
              {field.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          </div>
        ) : field.type === "file" ? (
          <input
            {...common}
            type="file"
            accept={field.accept.join(",")}
            className={`${control} ${borderClass} cursor-pointer file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-sand file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-ink hover:file:bg-sand-deep`}
          />
        ) : (
          <input
            {...common}
            type={field.type}
            autoComplete={field.autoComplete}
            maxLength={field.maxLength}
            placeholder={field.placeholder}
            defaultValue={defaultValue}
            inputMode={field.type === "tel" ? "tel" : field.type === "email" ? "email" : undefined}
            className={`${control} ${borderClass}`}
          />
        )}
      </div>
      {messages}
    </div>
  );
}
