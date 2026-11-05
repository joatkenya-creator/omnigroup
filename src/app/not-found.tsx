import Link from "next/link";
import type { Metadata } from "next";
import { StatusPage } from "@/components/states";
import { serviceNav } from "@/content/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <StatusPage
      code="404"
      title="We couldn't find that page"
      extra={
        <ul className="mt-12 grid max-w-3xl gap-3 sm:grid-cols-2">
          {[...serviceNav, { label: "Careers", href: "/careers" }].map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-link">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      }
    >
      The page may have moved as part of our new website. Try one of the pages below, or{" "}
      <Link href="/contact" className="text-link">
        get in touch
      </Link>{" "}
      and we&apos;ll point you in the right direction.
    </StatusPage>
  );
}
