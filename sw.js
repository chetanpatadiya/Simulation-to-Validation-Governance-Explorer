/* Same-origin, versioned offline cache. No telemetry or background upload. */
const CACHE='svg-explorer-static-v0.1.0';
const ASSETS=['./','./index.html','./assets/styles.css','./src/app.js','./src/catalog.js','./src/engine.js','./src/statistics.js','./src/examples.js','./src/io.js','./public/icon.svg','./manifest.webmanifest'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('svg-explorer-static-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;event.respondWith(caches.match(req).then(hit=>hit||fetch(req)));});
