importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.5.3/workbox-sw.js'
);

if (workbox) {
  console.log('Workbox is loaded');

  workbox.precaching.precacheAndRoute([
    '/index.html',
    '/styles.css',
    '/app.js',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
  ]);

  // Caching untuk request API daftar restoran
  workbox.routing.registerRoute(
    new RegExp('https://restaurant-api.dicoding.dev/list'),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'api-list-data',
    })
  );

  // Caching untuk request detail restoran
  workbox.routing.registerRoute(
    ({ url }) => url.href.includes('https://restaurant-api.dicoding.dev/detail'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'api-detail-data',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24, // 1 day
        }),
      ],
    })
  );

  // Caching halaman HTML
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'html-cache',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24,
        }),
      ],
    })
  );
}
