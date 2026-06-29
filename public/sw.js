/* New Wings Solutions — Service Worker */
const CACHE_NAME = 'nw-solutions-v1';

// Core shell assets cached on install.
const PRECACHE_URLS = ['/', '/manifest.json', '/favicon.ico'];

// Install: pre-cache the app shell. Each URL is added individually so one
// missing asset (e.g. favicon) can't abort the whole install.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url))),
    ),
  );
  // Activate this SW immediately on first install.
  self.skipWaiting();
});

// Activate: drop any caches from previous versions.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// Network-first: try the network, fall back to cache (good for API/data).
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    // Only cache successful, basic (same-origin) GET responses.
    if (request.method === 'GET' && response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw err;
  }
}

// Cache-first: serve from cache, fall back to network (good for static assets).
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const cache = await caches.open(CACHE_NAME);
  const response = await fetch(request);
  if (request.method === 'GET' && response && response.ok) {
    cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle same-origin GET requests; let everything else pass through.
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Network-first for API routes so data stays fresh; cache-first otherwise.
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
  } else {
    event.respondWith(cacheFirst(request));
  }
});
