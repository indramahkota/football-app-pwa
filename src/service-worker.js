import { registerRoute } from "workbox-routing";
import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute } from 'workbox-precaching';
import { clientsClaim, skipWaiting } from 'workbox-core';

registerRoute(
  new RegExp(/\.(?:png|gif|jpg|jpeg|svg|webp)$/),
  new CacheFirst({
      cacheName: "cache-images",
      plugins: [
          new ExpirationPlugin({
              maxAgeSeconds: 60 * 60 * 24 * 30,
              maxEntries: 100,
          }),
      ],
  })
);

registerRoute(
  new RegExp("https://api.football-data.org/v2/"),
  new StaleWhileRevalidate({
      cacheName: "cache-api",
      plugins: [
          new ExpirationPlugin({
              maxAgeSeconds: 60 * 60,
          }),
      ],
  })
);

registerRoute(
  new RegExp("https://upload.wikimedia.org"),
  new StaleWhileRevalidate({
      cacheName: "cache-crest",
      plugins: [
          new ExpirationPlugin({
              maxAgeSeconds: 60 * 60 * 24 * 30,
              maxEntries: 60,
          }),
      ],
  })
);

/* Posisi sangat berpengaruh */
/* https://developers.google.com/web/tools/workbox/guides/codelabs/webpack */
skipWaiting();
clientsClaim();

self.addEventListener("push", e => {
  let body;

  if(e.data) {
    body = e.data.text();
  } else {
    body = "Push message no payload";
  }

  let options = {
    body: body,
    icon: "assets/icons/manifest/icon_144x144.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };

  e.waitUntil(self.registration.showNotification("Push Notification", options));
});

precacheAndRoute(self.__WB_MANIFEST);