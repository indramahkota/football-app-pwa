importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const rev = 1;
const PRECACHE_RESOURCES = [
  /* root folder */
  { url: '/', revision: rev },
  { url: '/bundle.js', revision: rev },
  { url: '/bundle.css', revision: rev },
  { url: '/worker.js', revision: rev },
  { url: '/polyfill.js', revision: rev },
  { url: '/index.html', revision: rev },

  /* inside folder /assets/icons/favicons */
  { url: '/assets/icons/favicons/favicon.ico', revision: rev },
  { url: '/assets/icons/favicons/favicon-16x16.png', revision: rev },
  { url: '/assets/icons/favicons/favicon-32x32.png', revision: rev },
  { url: '/assets/icons/favicons/favicon-96x96.png', revision: rev },

  /* inside folder /assets/icons/fonticon */
  { url: '/assets/icons/fonticon/MaterialIcons-Regular.eot', revision: rev },
  { url: '/assets/icons/fonticon/MaterialIcons-Regular.ttf', revision: rev },
  { url: '/assets/icons/fonticon/MaterialIcons-Regular.woff', revision: rev },
  { url: '/assets/icons/fonticon/MaterialIcons-Regular.woff2', revision: rev },

  /* inside folder /assets/icons/manifest */
  { url: '/assets/icons/manifest/icon_36x36.png', revision: rev },
  { url: '/assets/icons/manifest/icon_48x48.png', revision: rev },
  { url: '/assets/icons/manifest/icon_57x57.png', revision: rev },
  { url: '/assets/icons/manifest/icon_72x72.png', revision: rev },
  { url: '/assets/icons/manifest/icon_76x76.png', revision: rev },
  { url: '/assets/icons/manifest/icon_96x96.png', revision: rev },
  { url: '/assets/icons/manifest/icon_114x114.png', revision: rev },
  { url: '/assets/icons/manifest/icon_120x120.png', revision: rev },
  { url: '/assets/icons/manifest/icon_128x128.png', revision: rev },
  { url: '/assets/icons/manifest/icon_144x144.png', revision: rev },
  { url: '/assets/icons/manifest/icon_152x152.png', revision: rev },
  { url: '/assets/icons/manifest/icon_180x180.png', revision: rev },
  { url: '/assets/icons/manifest/icon_192x192.png', revision: rev },
  { url: '/assets/icons/manifest/icon_384x384.png', revision: rev },
  { url: '/assets/icons/manifest/icon_512x512.png', revision: rev },

  /* inside folder /assets/icons/maskicon */
  { url: '/assets/icons/maskicon/mask-icon.svg', revision: rev },

  /* inside folder /assets/icons/msicon */
  { url: '/assets/icons/msicon/browserconfig.xml', revision: rev },
  { url: '/assets/icons/msicon/ms-icon-70x70.png', revision: rev },
  { url: '/assets/icons/msicon/ms-icon-144x144.png', revision: rev },
  { url: '/assets/icons/msicon/ms-icon-150x150.png', revision: rev },
  { url: '/assets/icons/msicon/ms-icon-310x310.png', revision: rev }
];

workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.precaching.precacheAndRoute(PRECACHE_RESOURCES);

workbox.routing.registerRoute(
  new RegExp(/\.(?:png|gif|jpg|jpeg|svg|webp)$/),
  new workbox.strategies.CacheFirst({
      cacheName: 'cache-images',
      plugins: [
          new workbox.expiration.ExpirationPlugin({
              maxAgeSeconds: 60 * 60 * 24 * 30,
              maxEntries: 100,
          }),
      ],
  })
);

workbox.routing.registerRoute(
  new RegExp('https://api.football-data.org/v2/'),
  new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'cache-api',
      plugins: [
          new workbox.expiration.ExpirationPlugin({
              maxAgeSeconds: 60 * 60,
          }),
      ],
  })
);

workbox.routing.registerRoute(
  new RegExp('https://upload.wikimedia.org'),
  new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'cache-crest',
      plugins: [
          new workbox.expiration.ExpirationPlugin({
              maxAgeSeconds: 60 * 60 * 24 * 30,
              maxEntries: 60,
          }),
      ],
  })
);

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
  e.waitUntil(
    self.registration.showNotification("Push Notification", options)
  );
});