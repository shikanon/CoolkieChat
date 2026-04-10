const CACHE_NAME = 'coolkiechat-v2';
const MEDIA_PATH_PREFIXES = ['/uploads/', '/photo/'];
const INDIVIDUAL_ASSETS = ['/虫儿飞.mp3', '/mosaic_generated.jpg'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Cache media files from /uploads/ and /photo/ or specific assets
  const shouldCache = MEDIA_PATH_PREFIXES.some(prefix => url.pathname.startsWith(prefix)) || 
                      INDIVIDUAL_ASSETS.includes(url.pathname);

  if (shouldCache && event.request.method === 'GET') {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request).then((networkResponse) => {
            // Only cache valid responses
            if (networkResponse.status === 200 || networkResponse.status === 206) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
  }
});
