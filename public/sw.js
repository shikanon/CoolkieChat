const CACHE_NAME = 'coolkiechat-media-v1';
const MEDIA_PATH_PREFIX = '/uploads/';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Only cache media files from our /uploads/ path
  if (url.pathname.startsWith(MEDIA_PATH_PREFIX) && event.request.method === 'GET') {
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
