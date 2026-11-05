"use client";

import { StatusPage } from "@/components/states";
import { site } from "@/content/site";

export default function Error({ retry }: { error: unknown; retry: () => void }) {
  return (
    <StatusPage code="500" title="Something went wrong on our side">
      This page didn&apos;t load because of a problem on our end, not anything you did.{" "}
      <button type="button" onClick={() => retry()} className="text-link">
        Try loading it again
      </button>
      , or email{" "}
      <a href={`mailto:${site.contact.email}`} className="text-link">
        {site.contact.email}
      </a>{" "}
      if you need us now.
    </StatusPage>
  );
}
