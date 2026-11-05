"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { WifiOff, X } from "lucide-react";

/** Must match CACHE in public/sw.js. */
const CACHE = "omnigroup-v1";

function subscribe(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

export function useOnline() {
  return useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
}

export function OfflineNotice({ kind, onDismiss }: { kind: "offline" | "back"; onDismiss?: () => void }) {
  if (kind === "back") {
    return <p className="container-page py-2.5 text-sm font-semibold text-success">Back online.</p>;
  }
  return (
    <div className="container-page flex items-center gap-3 py-2.5 text-sm text-ink">
      <WifiOff className="size-4 shrink-0 text-accent" aria-hidden="true" />
      <p className="flex-1">
        You&apos;re offline. You can keep reading this page and filling in forms. We&apos;ll send your enquiry when you reconnect.
      </p>
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="flex size-9 shrink-0 items-center justify-center rounded-full hover:bg-sand-deep">
          <X className="size-4" aria-hidden="true" />
          <span className="sr-only">Dismiss</span>
        </button>
      )}
    </div>
  );
}

/** Offline banner under the header, plus the service worker that keeps visited pages available offline. */
export function Connectivity() {
  const online = useOnline();
  const [dismissed, setDismissed] = useState(false);
  const [backOnline, setBackOnline] = useState(false);
  const wasOffline = useRef(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- reacting to an external connectivity change */
    if (!online) {
      wasOffline.current = true;
      setDismissed(false);
      setBackOnline(false);
      return;
    }
    if (!wasOffline.current) return;
    wasOffline.current = false;
    setBackOnline(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    const t = setTimeout(() => setBackOnline(false), 4000);
    return () => clearTimeout(t);
  }, [online]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    const firstVisit = !navigator.serviceWorker.controller;
    navigator.serviceWorker
      .register("/sw.js")
      .then(async () => {
        if (!firstVisit) return;
        // This page and its CSS, fonts and logo loaded before the worker existed, so store them now.
        const cache = await caches.open(CACHE);
        const urls = performance
          .getEntriesByType("resource")
          .map((e) => e.name)
          .filter((u) => u.startsWith(location.origin) && !u.includes("/api/"));
        await Promise.allSettled([location.pathname, ...urls].map((u) => cache.add(u)));
      })
      .catch((err) => console.error(err));
  }, []);

  const show = (!online && !dismissed) || backOnline;
  return (
    <div role="status" className={show ? `sticky top-[4.5rem] z-30 border-b border-line ${online ? "bg-success-tint" : "bg-sand"}` : ""}>
      {show && <OfflineNotice kind={online ? "back" : "offline"} onDismiss={() => setDismissed(true)} />}
    </div>
  );
}
