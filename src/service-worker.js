import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { registerRoute } from "workbox-routing";
import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute } from 'workbox-precaching';
import { clientsClaim, skipWaiting } from 'workbox-core';

/* ref: destination: https://fetch.spec.whatwg.org/#concept-request-destination */
registerRoute(
  ({request}) => request.destination === 'script' ||
                 request.destination === 'style',
  new CacheFirst({
    cacheName: 'sources',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 365 * 24 * 60 * 60 // 1 Tahun
      })
    ]
  })
);

registerRoute(
  new RegExp(/\.(?:eot|ttf|woff|woff2)$/),
  new CacheFirst({
    cacheName: 'font-icons',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 365 * 24 * 60 * 60 // 1 Tahun
      })
    ]
  })
);

registerRoute(
  ({request}) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Hari
      })
    ]
  })
);

/* API: CacheFirst */
registerRoute(
  ({request}) => request.url.indexOf("competitions?plan=TIER_ONE") > -1,
  new CacheFirst({
    cacheName: 'api-cachefirst',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Hari
      })
    ]
  })
);

/* API: StaleWhileRevalidate */
registerRoute(
  ({request}) => (request.url.indexOf("matches?status=SCHEDULED") > -1 ||
  request.url.indexOf("standings") > -1 || request.url.indexOf("teams") > -1),
  new StaleWhileRevalidate({
      cacheName: "api-stalewhilerevalidate",
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new ExpirationPlugin({
          maxAgeSeconds: 60 * 60, // 1 Jam
          maxEntries: 60
        }),
      ],
  })
);

/* ref: https://developers.google.com/web/tools/workbox/guides/codelabs/webpack */
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