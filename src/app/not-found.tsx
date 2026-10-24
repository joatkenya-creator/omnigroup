import Link from "next/link";
import type { Metadata } from "next";
import { serviceNav } from "@/content/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="container-page py-20 md:py-28">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 max-w-2xl text-4xl md:text-5xl">We couldn&apos;t find that page</h1>
      <p className="mt-5 max-w-xl text-lg text-ink-soft">
        The page may have moved as part of our new website. Try one of these instead, or get in touch and we&apos;ll point you in
        the right direction.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">
          Go to the homepage
        </Link>
        <Link href="/contact" className="btn btn-secondary">
          Contact us
        </Link>
      </div>
      <ul className="mt-12 grid max-w-3xl gap-3 sm:grid-cols-2">
        {[...serviceNav, { label: "Careers", href: "/careers" }].map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-link">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
