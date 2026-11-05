import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

/** Says why a list is empty, then offers exactly one next step. */
export function EmptyState({
  id,
  eyebrow,
  title,
  body,
  action,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  body: string;
  action: { label: string; href: string };
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id} className="mt-3 text-3xl leading-tight md:text-[2.625rem]">
        {title}
      </h2>
      <p className="mt-4 text-lg leading-relaxed text-muted">{body}</p>
      <Link href={action.href} className="btn btn-primary mt-8">
        {action.label} <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

/** Placeholder with the same footprint as a job card in the openings list. */
export function JobCardSkeleton() {
  return (
    <div className="card flex flex-col p-7" aria-hidden="true">
      <div className="skeleton h-8 w-3/4" />
      <div className="skeleton mt-3 h-4 w-1/3" />
      <div className="skeleton mt-5 h-4 w-full" />
      <div className="skeleton mt-2 h-4 w-5/6" />
      <div className="skeleton mt-6 h-12 w-44 rounded-full" />
    </div>
  );
}

/** Full-page message for 403, 404 and 500, with one clear way back. */
export function StatusPage({
  code,
  title,
  children,
  action = { label: "Go to the homepage", href: "/" },
  extra,
}: {
  code: string;
  title: string;
  children: ReactNode;
  action?: { label: string; href: string };
  extra?: ReactNode;
}) {
  return (
    <section className="container-page py-20 md:py-28">
      <p className="eyebrow">{code}</p>
      <h1 className="mt-4 max-w-2xl text-4xl md:text-5xl">{title}</h1>
      <div className="mt-5 max-w-xl text-lg text-ink-soft">{children}</div>
      <Link href={action.href} className="btn btn-primary mt-8">
        {action.label}
      </Link>
      {extra}
    </section>
  );
}

export function ForbiddenPage() {
  return (
    <StatusPage code="403" title="You don't have access to this page">
      This page is for OmniGroup HR staff who manage the website. Access is limited to protect applicants&apos; and clients&apos;
      information. If you think you should have access, sign in with your staff account or{" "}
      <Link href="/contact" className="text-link">
        contact us
      </Link>
      .
    </StatusPage>
  );
}
