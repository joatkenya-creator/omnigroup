/**
 * Provider-agnostic conversion tracking. Events go to Plausible (if its
 * script is loaded) and to window.dataLayer (for a tag manager, if the
 * business later adopts one with appropriate consent handling).
 *
 * Lead events must only be fired after the server confirms delivery.
 */
type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Props }) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: string, props: Props = {}) {
  if (typeof window === "undefined") return;
  window.plausible?.(event, { props });
  window.dataLayer?.push({ event, ...props });
  window.dispatchEvent(new CustomEvent("omnigroup:track", { detail: { event, props } }));
  if (process.env.NODE_ENV === "development") console.debug("[track]", event, props);
}
