import footballAppConstant from "./scripts/app-constants.js";

const CACHE_NAME = "indramahkota-footballapp-v1";
const filesToCache = [
  /* root folder */
  "/",
  "/bundle.js",
  "/bundle.css",
  "/worker.js",
  "/index.html",
  "/favicon.ico",
  "/manifest.json",

  /* inside folder /assets/icons/fonticon */
  "/assets/icons/fonticon/MaterialIcons-Regular.eot",
  "/assets/icons/fonticon/MaterialIcons-Regular.ttf",
  "/assets/icons/fonticon/MaterialIcons-Regular.woff",
  "/assets/icons/fonticon/MaterialIcons-Regular.woff2",

  /* inside folder /assets/icons/images */
  "/assets/images/bgprofile.webp",
  "/assets/images/indra.webp",
  "/assets/images/null-image.jpg",

  /* inside folder /assets/icons/manifest */
  "/assets/icons/manifest/icon_36x36.png",
  "/assets/icons/manifest/icon_48x48.png",
  "/assets/icons/manifest/icon_72x72.png",
  "/assets/icons/manifest/icon_96x96.png",
  "/assets/icons/manifest/icon_144x144.png",
  "/assets/icons/manifest/icon_192x192.png",
  "/assets/icons/manifest/icon_512x512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
          .then(cache => cache.addAll(filesToCache))
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(cacheNames => 
      Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

self.addEventListener("fetch", e => {
  if (e.request.url.indexOf(footballAppConstant.baseUrl) > -1) {
    e.respondWith(
      caches.open(CACHE_NAME).then(cache => 
          fetch(e.request).then(response => {
            cache.put(e.request.url, response.clone());
            return response;
          })
      )
    );
  } else {
    e.respondWith(
      caches.match(e.request, { cacheName: CACHE_NAME, ignoreSearch: true })
            .then(response => response || fetch(e.request))
    );
  }
});
