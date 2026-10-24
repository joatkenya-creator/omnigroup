"use client";

import Script from "next/script";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

const plausibleSrc = process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC;
const cfBeaconToken = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

/**
 * Loads optional, cookieless analytics and records phone and email link
 * clicks site-wide. A click is tracked as a contact intent, never as a lead.
 */
export function Analytics() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href^="tel:"], a[href^="mailto:"]');
      if (!link) return;
      const method = link.href.startsWith("tel:") ? "phone" : "email";
      track(method === "phone" ? "Contact: Click to Call" : "Contact: Email Click", {
        location: link.dataset.trackLocation ?? "content",
        page: window.location.pathname,
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      {plausibleSrc && (
        <>
          <Script id="plausible-init" strategy="afterInteractive">
            {"window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()"}
          </Script>
          <Script src={plausibleSrc} strategy="afterInteractive" />
        </>
      )}
      {cfBeaconToken && (
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          strategy="afterInteractive"
          data-cf-beacon={JSON.stringify({ token: cfBeaconToken })}
        />
      )}
    </>
  );
}
