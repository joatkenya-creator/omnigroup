import Link from "next/link";
import { LeadForm } from "@/components/forms/LeadForm";
import { PageHero, Section } from "@/components/sections";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Apply Now",
  description: "Apply for a position with OmniGroup HR. Upload your resume and share your interview availability.",
  path: "/careers/apply",
});

export default function ApplyPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { name: "Careers", path: "/careers" },
          { name: "Apply now", path: "/careers/apply" },
        ]}
        eyebrow="Apply now"
        title="Apply for a position"
        lead="Complete the form below. It takes about three minutes, and you'll need your resume as a PDF or Word document."
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.8fr]">
          <aside className="space-y-6 text-ink-soft">
            <div>
              <h2 className="font-sans text-lg font-semibold tracking-normal text-ink">Before you start</h2>
              <ul className="mt-3 space-y-2">
                <li>Have your resume ready (PDF, DOC or DOCX, up to 5 MB).</li>
                <li>Suggest a few times for a 30-minute interview over the next week.</li>
              </ul>
            </div>
            <div>
              <h2 className="font-sans text-lg font-semibold tracking-normal text-ink">How we use your information</h2>
              <p className="mt-3">
                Your application is sent securely to our recruitment team and used to assess your suitability for current and
                future roles. It is never published. See our{" "}
                <Link href="/privacy-policy" className="text-link">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
            <p>
              <Link href="/careers" className="text-link">
                ← Back to current openings
              </Link>
            </p>
          </aside>
          <div className="card p-6 md:p-9">
            <LeadForm formKey="application" prefillFromQuery={["position"]} />
          </div>
        </div>
      </Section>
    </>
  );
}
