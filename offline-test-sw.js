const CACHE = 'moeller-offline-test-v23';
const PAGE = new URL('offline-test.html', self.registration.scope).href;
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const response = await fetch(PAGE, {cache: 'reload'});
    if (!response.ok) throw new Error('App download failed: ' + response.status);
    await cache.put(PAGE, response);
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  url.search = ''; url.hash = '';
  if (url.href !== PAGE) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    return (await cache.match(PAGE)) || fetch(event.request);
  })());
});
