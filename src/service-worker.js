let cacheName = "indramahkota-v1";
let filesToCache = [
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
    caches.open(cacheName).then((cache) => cache.addAll(filesToCache))
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
