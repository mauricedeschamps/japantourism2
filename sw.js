const CACHE_NAME = 'japan-travel-v2';  // バージョンを上げて確実に更新
const urlsToCache = [
  './',
  'index.html',
  'manifest.json',
  'sw.js',
  'icons/icon-192.jpg',
  'icons/icon-512.jpg'
  
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        return fetch(event.request).catch(() => {
          // オフライン時に代替テキストを返す
          return new Response(
            '<html><body><h1>オフライン</h1><p>ネットワークに接続して再度お試しください。</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});