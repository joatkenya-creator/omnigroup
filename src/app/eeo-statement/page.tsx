import { LegalPage } from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Equal Employment Opportunity Statement",
  description: "Omnicruit LLC (OmniGroup HR) is an equal opportunity employer committed to a diverse, inclusive and fair workplace.",
  path: "/eeo-statement",
});

// Text reproduced verbatim from the existing omnigrouphr.com EEO Statement.
export default function EeoStatementPage() {
  return (
    <LegalPage title="Equal Employment Opportunity Statement" path="/eeo-statement">
      <p>
        Omnicruit LLC is an equal opportunity employer. We are committed to providing equal employment opportunities to all
        employees and applicants for employment without regard to race, color, religion, sex, national origin, age, disability,
        sexual orientation, gender identity, genetic information, or any other characteristic protected by applicable law.
      </p>
      <p>
        We strive to create a diverse and inclusive work environment where all individuals are valued, respected, and treated
        fairly. Our employment decisions are based on merit, qualifications, and business needs.
      </p>
      <p>
        We do not tolerate discrimination or harassment of any kind in the workplace. Harassment based on any protected
        characteristic is prohibited, including but not limited to harassment based on race, color, religion, sex, national
        origin, age, disability, sexual orientation, gender identity, or genetic information.
      </p>
      <p>
        Omnicruit LLC complies with all applicable laws regarding EEO and affirmative action. If you believe you have been
        subjected to discrimination or harassment, or if you require accommodation to participate in the job application process,
        please contact Human Resources or the designated EEO Officer.
      </p>
      <p>
        We are committed to promoting diversity, equity, and inclusion throughout our organization and in all aspects of our
        employment practices.
      </p>
      <p>
        Equal opportunity is not only the law; it is our commitment to fostering a diverse and inclusive workplace that reflects
        the communities we serve and the clients we support.
      </p>
    </LegalPage>
  );
}
