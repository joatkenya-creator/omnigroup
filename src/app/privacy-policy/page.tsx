import { LegalPage } from "@/components/LegalPage";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Omnicruit LLC (OmniGroup HR) collects, uses and protects personal information from website visitors and candidates.",
  path: "/privacy-policy",
});

// Text reproduced verbatim from the existing omnigrouphr.com Privacy Policy.
export default function PrivacyPolicyPage() {
  const { contact } = site;
  return (
    <LegalPage title="Privacy Policy" path="/privacy-policy">
      <p>Effective Date: (05/04/26)</p>
      <p>
        Omnicruit LLC (&quot;Omnicruit,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting the
        privacy of individuals who visit our website and use our services. This Privacy Policy outlines the types of information
        we may collect, how we use it, and the choices individuals have regarding our use of their information.
      </p>

      <h2>1. Information We Collect:</h2>
      <ul>
        <li>
          <strong>Personal Information:</strong> When you visit our website or use our services, we may collect personal
          information such as your name, email address, phone number, resume/CV, employment history, education history, and other
          information relevant to your job search or recruitment process.
        </li>
        <li>
          <strong>Usage Information:</strong> We may automatically collect certain information about your device and how you
          interact with our website and services. This may include your IP address, browser type, device type, operating system,
          and browsing actions and patterns.
        </li>
      </ul>

      <h2>2. How We Use Your Information:</h2>
      <ul>
        <li>
          <strong>Recruitment Services:</strong> We use the information we collect to provide recruitment and staffing services to
          our clients and candidates. This may include matching candidates with job opportunities, facilitating interviews, and
          communicating with clients and candidates throughout the recruitment process.
        </li>
        <li>
          <strong>Communication:</strong> We may use your contact information to communicate with you about our services, job
          opportunities, updates, and promotions.
        </li>
        <li>
          <strong>Improvement of Services:</strong> We use the information to analyze trends, administer our website, improve our
          services, and customize your experience.
        </li>
      </ul>

      <h2>3. Sharing of Information:</h2>
      <ul>
        <li>
          <strong>With Clients:</strong> We may share your information with our clients for the purpose of facilitating the
          recruitment process.
        </li>
        <li>
          <strong>With Service Providers:</strong> We may share your information with third-party service providers who assist us
          in operating our website, conducting our business, or servicing you.
        </li>
        <li>
          <strong>Legal Compliance:</strong> We may disclose your information if required by law or in response to a subpoena or
          similar legal process.
        </li>
      </ul>

      <h2>4. Your Choices:</h2>
      <ul>
        <li>
          <strong>Opt-Out:</strong> You may opt-out of receiving promotional emails from us by following the instructions in those
          emails. Please note that even if you opt-out, you may still receive non-promotional communications, such as those related
          to your job application or account.
        </li>
        <li>
          <strong>Access and Update:</strong> You may access and update your personal information by contacting us using the
          contact information provided below.
        </li>
      </ul>

      <h2>5. Data Security:</h2>
      <p>
        We implement appropriate technical and organizational measures to protect the security of your personal information.
        However, please note that no method of transmission over the Internet or electronic storage is 100% secure.
      </p>

      <h2>6. Children&apos;s Privacy:</h2>
      <p>
        Our website and services are not directed to individuals under the age of 18. We do not knowingly collect personal
        information from children under 18. If you are a parent or guardian and believe we may have collected information about a
        child, please contact us using the contact information provided below.
      </p>

      <h2>7. Changes to this Privacy Policy:</h2>
      <p>
        We reserve the right to update or modify this Privacy Policy at any time. Any changes will be effective immediately upon
        posting the updated Privacy Policy on our website.
      </p>

      <h2>8. Contact Us:</h2>
      <p>
        If you have any questions about this Privacy Policy or our privacy practices, please contact us at{" "}
        <a href={`mailto:${contact.email}`} className="text-link">
          {contact.email}
        </a>{" "}
        or{" "}
        <a href={`tel:${contact.phoneE164}`} className="text-link">
          {contact.phoneDisplay}
        </a>
      </p>

      <p>By using our website or services, you consent to the collection and use of your information as described in this Privacy Policy.</p>
    </LegalPage>
  );
}
