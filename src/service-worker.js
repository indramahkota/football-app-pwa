const CACHE_NAME = "indramahkota-footballclubs-v1";
const filesToCache = [
  "/",
  "/bundle.js",
  "/worker.js",
  "/index.html",
  "/favicon.ico",
  "/manifest.json",
  "/MaterialIcons-Regular.eot",
  "/MaterialIcons-Regular.ttf",
  "/MaterialIcons-Regular.woff",
  "/MaterialIcons-Regular.woff2",
  "/arsenal.png",
  "/astonvilla.png",
  "/bournemouth.png",
  "/brighton.png",
  "/burnley.png",
  "/bgprofile.webp",
  "/indra.webp",
  "/icon_36x36.png",
  "/icon_48x48.png",
  "/icon_72x72.png",
  "/icon_96x96.png",
  "/icon_144x144.png",
  "/icon_192x192.png",
  "/icon_512x512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
          .then((cache) => cache.addAll(filesToCache))
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName.startsWith("indramahkota-footballclubs")) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { cacheName: CACHE_NAME })
          .then((response) => response || fetch(e.request))
  );
});
