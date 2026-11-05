// Keeps the site shell and visited pages readable offline.
// Hashed build files (/_next/static) are cache-first; everything else is
// network-first with the cached copy as the offline fallback.
// ponytail: no size limit on the cache; add eviction if it ever grows large.
const CACHE = "omnigroup-v1"; // keep in sync with src/components/layout/Connectivity.tsx

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== location.origin || url.pathname.startsWith("/api/")) return;
  event.respondWith(url.pathname.startsWith("/_next/static/") ? cacheFirst(request) : networkFirst(request));
});

async function cacheFirst(request) {
  return (await caches.match(request)) ?? fetchAndStore(request);
}

async function networkFirst(request) {
  try {
    return await fetchAndStore(request);
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw err;
  }
}

async function fetchAndStore(request) {
  const response = await fetch(request);
  if (response.ok && response.type === "basic") {
    const copy = response.clone();
    caches.open(CACHE).then((cache) => cache.put(request, copy));
  }
  return response;
}
