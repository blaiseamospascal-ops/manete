// Fonctionnement hors ligne : l'app est gardée en cache sur le téléphone.
const CACHE = "manete-__VERSION__";
const FILES = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png"];
// Sons et crédits des images : mis en cache quand c'est possible, sans bloquer l'installation.
const EXTRAS = ["sounds/cloche.mp3", "sounds/gong.mp3", "sounds/orgue.mp3", "sounds/musique.mp3", "sounds/voix.json", "sounds/prieres/voix.json", "images/credits.json"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES).then(() => Promise.all(EXTRAS.map((f) => c.add(f).catch(() => {})))))); self.skipWaiting(); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request).then((r) => r || caches.match("index.html"))));
});
