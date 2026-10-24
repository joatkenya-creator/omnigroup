import { LegalPage } from "@/components/LegalPage";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How OmniGroup HR collects, uses and protects personal information submitted through this website.",
  path: "/privacy-policy",
});

/**
 * DRAFT — requires review by OmniGroup HR and qualified legal counsel before
 * launch. Written to match how this website actually handles data.
 */
const UPDATED = "2026-10-24";

export default function PrivacyPolicyPage() {
  const { contact } = site;
  return (
    <LegalPage title="Privacy Policy" path="/privacy-policy" updated={UPDATED}>
      <p>
        This policy explains how {site.legalName}, doing business as {site.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;), collects and
        uses personal information when you visit this website or contact us through it.
      </p>

      <h2>Information we collect</h2>
      <p>We collect only the information you choose to give us through our forms:</p>
      <ul>
        <li>
          <strong>Business enquiries</strong> (including virtual assistant and talent requests): your name, work email, company,
          optional phone number, the service you&apos;re interested in and the details you provide about your needs.
        </li>
        <li>
          <strong>Job applications</strong>: your name, email, phone number, the position you&apos;re applying for, your resume or CV,
          and any interview availability you share.
        </li>
        <li>
          <strong>Newsletter sign-ups</strong>, where offered: your email address and your consent to receive updates.
        </li>
      </ul>
      <p>
        When you use the website, our hosting and security providers automatically process technical information such as your IP
        address, browser type and the pages you request. This is used to deliver the website, protect it from abuse and spam, and
        understand overall usage.
      </p>

      <h2>How we use your information</h2>
      <ul>
        <li>To respond to your enquiry and provide the services you ask about.</li>
        <li>To assess job applications and match candidates with suitable opportunities.</li>
        <li>To send newsletters, only if you have opted in. You can unsubscribe at any time.</li>
        <li>To keep the website secure, prevent spam and improve how it works.</li>
      </ul>

      <h2>How we share information</h2>
      <p>We do not sell your personal information. We share it only:</p>
      <ul>
        <li>
          With prospective employers, when you apply for a role and agree that we may share your application with them for
          recruitment purposes.
        </li>
        <li>
          With service providers who help us operate, such as website hosting and security (Cloudflare) and email delivery. They
          may process your information only on our behalf.
        </li>
        <li>When required by law, or to protect our rights, users or the public.</li>
      </ul>

      <h2>Cookies and analytics</h2>
      <p>
        This website does not use advertising cookies. Our spam-protection service may set a strictly necessary cookie or similar
        technology to verify that form submissions come from a person. Where we use website analytics, we use privacy-focused
        tools that measure overall visits without building advertising profiles.
      </p>

      <h2>Resumes and application documents</h2>
      <p>
        Resumes uploaded through this website are sent directly to our recruitment team. They are not published or stored on the
        public website.
      </p>

      <h2>How long we keep information</h2>
      <p>
        We keep personal information only for as long as we need it for the purposes described above, including any legal or
        record-keeping obligations, and then delete or anonymize it.
      </p>

      <h2>Your choices and rights</h2>
      <p>
        You can ask us to access, correct or delete the personal information we hold about you, or to stop sending you marketing
        messages, by contacting us using the details below. Depending on where you live, you may have additional rights under
        applicable privacy laws.
      </p>

      <h2>Security</h2>
      <p>
        We use reasonable technical and organizational measures to protect personal information. No method of transmission over
        the internet or electronic storage is completely secure, so we cannot guarantee absolute security.
      </p>

      <h2>Children</h2>
      <p>This website is not intended for anyone under 18, and we do not knowingly collect information from children.</p>

      <h2>Changes to this policy</h2>
      <p>We may update this policy from time to time. The date at the top of this page shows when it was last updated.</p>

      <h2>Contact us</h2>
      <p>
        Questions about this policy or your information? Email{" "}
        <a href={`mailto:${contact.email}`} className="text-link">
          {contact.email}
        </a>
        , call{" "}
        <a href={`tel:${contact.phoneE164}`} className="text-link">
          {contact.phoneDisplay}
        </a>
        , or write to us at {contact.address.street}, {contact.address.city}, {contact.address.region} {contact.address.postalCode}.
      </p>
    </LegalPage>
  );
}
