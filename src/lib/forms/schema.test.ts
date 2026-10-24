import { describe, expect, it } from "vitest";
import { forms } from "./definitions";
import { validateFile, validateValues } from "./schema";

const cvField = forms.application.fields.find((f) => f.type === "file") as Extract<
  (typeof forms.application.fields)[number],
  { type: "file" }
>;

describe("validateValues", () => {
  it("accepts a complete VA enquiry and trims values", () => {
    const result = validateValues(forms.va, {
      name: "  Jordan Lee ",
      email: "jordan@example.com",
      company: "Acme",
      supportType: "executive",
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.values.name).toBe("Jordan Lee");
  });

  it("reports friendly messages for missing and invalid fields", () => {
    const result = validateValues(forms.va, { email: "not-an-email", supportType: "made-up" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.name).toBe("Full name is required");
      expect(result.errors.email).toBe("Enter a valid email address");
      expect(result.errors.supportType).toBe("Please choose an option from the list");
      expect(result.errors.workload).toBeUndefined(); // optional
    }
  });

  it("treats whitespace-only input as missing", () => {
    const result = validateValues(forms.business, { name: "   " });
    expect(!result.ok && result.errors.name).toBe("Full name is required");
  });

  it("enforces minimum message length on business enquiries", () => {
    const result = validateValues(forms.business, {
      name: "A",
      email: "a@b.co",
      company: "C",
      service: "hr",
      preferredContact: "email",
      message: "short",
    });
    expect(!result.ok && result.errors.message).toMatch(/at least 10/);
  });

  it("requires consent on applications", () => {
    const result = validateValues(forms.application, {});
    expect(!result.ok && result.errors.consent).toBe("Please confirm to continue");
  });

  it("rejects malformed phone numbers", () => {
    const result = validateValues(forms.staffing, { phone: "call me maybe" });
    expect(!result.ok && result.errors.phone).toBe("Enter a valid phone number");
  });
});

describe("validateFile", () => {
  const pdfHead = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]);

  it("accepts a real PDF", () => {
    expect(validateFile(cvField, { name: "resume.PDF", size: 1000 }, pdfHead)).toBeNull();
  });

  it("requires a file", () => {
    expect(validateFile(cvField, null)).toMatch(/required/);
  });

  it("rejects disallowed extensions", () => {
    expect(validateFile(cvField, { name: "resume.exe", size: 1000 })).toMatch(/PDF, DOC, DOCX/);
  });

  it("rejects oversized files", () => {
    expect(validateFile(cvField, { name: "cv.pdf", size: 6 * 1024 * 1024 })).toMatch(/smaller than 5 MB/);
  });

  it("rejects a renamed file whose signature doesn't match", () => {
    const exeHead = new Uint8Array([0x4d, 0x5a, 0x90, 0x00]);
    expect(validateFile(cvField, { name: "cv.pdf", size: 1000 }, exeHead)).toMatch(/valid document/);
  });
});
