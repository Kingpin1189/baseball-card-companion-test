const CACHE='moeller-offline-test-v22';
const PAGE=new URL('offline-test.html',self.registration.scope).href;
const ASSETS=['offline-test.html','offline-test.webmanifest','icon.png'].map(x=>new URL(x,self.registration.scope).href);
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||!ASSETS.includes(e.request.url.split('?')[0]))return; e.respondWith(caches.open(CACHE).then(async c=>{const hit=await c.match(e.request.url.split('?')[0]);return hit||fetch(e.request)}));});
