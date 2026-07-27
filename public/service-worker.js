/* StellarPath service worker — offline support
 * Strategy: network-first for page navigations (so updates always land),
 * cache-first for hashed static assets, with runtime caching. */
const CACHE_NAME = 'stellarpath-v2';
const CORE_ASSETS = [
  '/stellarpath/manifest.json',
  '/stellarpath/icons/icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Page navigations: network first, fall back to cached shell when offline
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('/stellarpath/index.html', clone));
          return response;
        })
        .catch(() => caches.match('/stellarpath/index.html'))
    );
    return;
  }

  // Static assets: cache first, then network (and cache it)
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.ok && new URL(event.request.url).origin === self.location.origin) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
