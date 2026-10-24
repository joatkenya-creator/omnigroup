import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { escapeHtml } from "./delivery";
import { handleSubmission } from "./submit";

let ipCounter = 0;

function request(fields: Record<string, string | Blob>, opts: { ip?: string; startedAgoMs?: number } = {}) {
  const data = new FormData();
  data.set("_ts", String(Date.now() - (opts.startedAgoMs ?? 10_000)));
  data.set("_page", "/virtual-assistant-services");
  for (const [k, v] of Object.entries(fields)) data.set(k, v);
  return new Request("http://localhost/api/forms/va", {
    method: "POST",
    body: data,
    headers: { "cf-connecting-ip": opts.ip ?? `10.0.0.${++ipCounter}` },
  });
}

const validVa = { name: "Jordan <Lee>", email: "jordan@example.com", company: "Acme & Co", supportType: "executive" };

const resendEnv = {
  RESEND_API_KEY: "re_test",
  LEAD_FROM_EMAIL: "Website <website@example.com>",
  LEAD_TO_EMAIL: "leads@example.com",
};

beforeEach(() => {
  for (const k of [...Object.keys(resendEnv), "TURNSTILE_SECRET_KEY", "LEAD_WEBHOOK_URL", "CAREERS_TO_EMAIL", "NEWSLETTER_WEBHOOK_URL"])
    vi.stubEnv(k, "");
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("handleSubmission", () => {
  it("returns 404 for an unknown form", async () => {
    const res = await handleSubmission(request(validVa), "nope");
    expect(res.status).toBe(404);
  });

  it("returns 503 not_configured rather than faking success when no delivery channel exists", async () => {
    const res = await handleSubmission(request(validVa), "va");
    expect(res.status).toBe(503);
    expect(await res.json()).toMatchObject({ ok: false, code: "not_configured" });
  });

  it("rejects honeypot submissions", async () => {
    const res = await handleSubmission(request({ ...validVa, website: "spam.example" }), "va");
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("verification_failed");
  });

  it("rejects submissions completed implausibly fast", async () => {
    const res = await handleSubmission(request(validVa, { startedAgoMs: 200 }), "va");
    expect(res.status).toBe(400);
  });

  it("returns field errors with 422", async () => {
    const res = await handleSubmission(request({ name: "x" }), "va");
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.errors.email).toBe("Work email is required");
  });

  it("delivers through Resend with escaped HTML and reply-to set", async () => {
    for (const [k, v] of Object.entries(resendEnv)) vi.stubEnv(k, v);
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: "1" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const res = await handleSubmission(request(validVa), "va");
    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    const payload = JSON.parse(init.body);
    expect(payload.to).toEqual(["leads@example.com"]);
    expect(payload.reply_to).toBe("jordan@example.com");
    expect(payload.subject).toBe("New virtual assistant enquiry: Acme & Co — Jordan <Lee>");
    expect(payload.html).toContain("Jordan &lt;Lee&gt;");
    expect(payload.html).not.toContain("<Lee>");
    expect(payload.text).toContain("Executive support"); // option label, not raw value
  });

  it("reports delivery_failed when the provider errors", async () => {
    for (const [k, v] of Object.entries(resendEnv)) vi.stubEnv(k, v);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("bad", { status: 500 })));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await handleSubmission(request(validVa), "va");
    expect(res.status).toBe(502);
  });

  it("verifies Turnstile when a secret is configured", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ success: false })));
    const res = await handleSubmission(request(validVa), "va");
    expect(res.status).toBe(400);
    expect((await res.json()).message).toMatch(/Spam protection/);
  });

  it("rate limits repeated submissions from one IP", async () => {
    const statuses = [];
    for (let i = 0; i < 6; i++) statuses.push((await handleSubmission(request(validVa, { ip: "192.0.2.1" }), "va")).status);
    expect(statuses.slice(0, 5).every((s) => s === 503)).toBe(true);
    expect(statuses[5]).toBe(429);
  });

  it("attaches a validated CV to application emails", async () => {
    for (const [k, v] of Object.entries(resendEnv)) vi.stubEnv(k, v);
    vi.stubEnv("CAREERS_TO_EMAIL", "careers@example.com");
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ id: "2" }));
    vi.stubGlobal("fetch", fetchMock);

    const cv = new File([new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31])], "My CV.pdf", { type: "application/pdf" });
    const res = await handleSubmission(
      request({
        firstName: "Sam",
        lastName: "Rivera",
        email: "sam@example.com",
        phone: "+1 757 555 0100",
        position: "Virtual Assistant",
        consent: "on",
        cv,
      }),
      "application",
    );
    expect(res.status).toBe(200);
    const payload = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(payload.to).toEqual(["careers@example.com"]);
    expect(payload.attachments[0].filename).toBe("My CV.pdf");
    expect(payload.attachments[0].content).toBe(Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31]).toString("base64"));
  });

  it("rejects a disguised executable uploaded as a CV", async () => {
    const fake = new File([new Uint8Array([0x4d, 0x5a, 0x90, 0x00])], "cv.pdf");
    const res = await handleSubmission(
      request({ firstName: "A", lastName: "B", email: "a@b.co", phone: "5555555555", position: "Virtual Assistant", consent: "on", cv: fake }),
      "application",
    );
    expect(res.status).toBe(422);
    expect((await res.json()).errors.cv).toMatch(/valid document/);
  });
});

describe("escapeHtml", () => {
  it("escapes all HTML-significant characters", () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe("&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;");
  });
});
