let cacheName = 'indramahkota-v1';
let filesToCache = [
  '/',
  '/bundle.js',
  '/worker.js',
  '/index.html',
  '/assets/fonts/MaterialIcons-Regular.eot',
  '/assets/fonts/MaterialIcons-Regular.ttf',
  '/assets/fonts/MaterialIcons-Regular.woff',
  '/assets/fonts/MaterialIcons-Regular.woff2',
  '/assets/images/arsenal.png',
  '/assets/images/astonvilla.png',
  '/assets/images/bournemouth.png',
  '/assets/images/brighton.png',
  '/assets/images/burnley.png',
  '/assets/images/bgprofile.webp',
  '/assets/images/indra.webp'
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
