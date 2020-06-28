let cacheName = 'indramahkota-v1';
let filesToCache = [
  '/',
  '/index.html',
  '/page1.html',
  '/page2.html',
  '/page3.html',
  '/assets/scripts/pages.js',
  '/assets/scripts/tambah.js',
  '/assets/scripts/mapbox.js',
  '/assets/styles/inline.css',
  '/assets/images/bgprofile.webp',
  '/assets/images/home.webp',
  '/assets/images/info.webp',
  '/assets/images/logout.webp',
  '/assets/images/settings.webp',
  '/assets/images/indra.webp',
  '/assets/images/refresh.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches
      .open(cacheName)
      .then(cache => cache.addAll(filesToCache))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches
      .keys()
      .then(keyList => {
        return Promise.all(
          keyList.map(key => {
            if(key !== cacheName){
              return caches.delete(key);
            }
          })
        );
      })
  );
});

self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(
    caches
      .match(e.request)
      .then(response => response || fetch(e.request))
  );
});
