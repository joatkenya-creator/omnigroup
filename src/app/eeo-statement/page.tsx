import { LegalPage } from "@/components/LegalPage";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Equal Employment Opportunity Statement",
  description: "OmniGroup HR's commitment to equal employment opportunity and fair, merit-based hiring.",
  path: "/eeo-statement",
});

/** DRAFT — based on the previous EEO statement; requires review by OmniGroup HR and legal counsel. */
const UPDATED = "2026-10-24";

export default function EeoStatementPage() {
  const { contact } = site;
  return (
    <LegalPage title="Equal Employment Opportunity Statement" path="/eeo-statement" updated={UPDATED}>
      <p>
        {site.legalName}, doing business as {site.name}, is an equal opportunity employer. We are committed to a diverse and
        inclusive workplace where everyone is treated fairly and with respect.
      </p>

      <h2>Our commitment</h2>
      <p>
        We do not discriminate on the basis of race, color, religion, sex, national origin, age, disability, sexual orientation,
        gender identity, genetic information, or any other characteristic protected by applicable law.
      </p>
      <p>
        Recruitment, hiring, placement and other employment decisions are based on merit, qualifications and business needs. We
        comply with applicable equal employment opportunity laws.
      </p>

      <h2>Harassment</h2>
      <p>
        Harassment based on any of the characteristics listed above is prohibited and will not be tolerated in our workplace or
        recruitment processes.
      </p>

      <h2>Accommodations and concerns</h2>
      <p>
        If you need a reasonable accommodation during the application or interview process, or believe you have experienced
        discrimination or harassment, please contact us at{" "}
        <a href={`mailto:${contact.email}`} className="text-link">
          {contact.email}
        </a>{" "}
        or{" "}
        <a href={`tel:${contact.phoneE164}`} className="text-link">
          {contact.phoneDisplay}
        </a>
        . Requests and concerns are handled promptly and confidentially.
      </p>
    </LegalPage>
  );
}
