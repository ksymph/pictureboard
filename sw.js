// This is the "Offline copy of pages" service worker

const CACHE = "pwabuilder-offline";
const TILES_JSON_URL = "/tiles.json";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

// Skip waiting once new service worker is installed
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Precaching files from tiles.json during installation
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then(async (cache) => {
        try {
          const response = await fetch(TILES_JSON_URL);
          const data = await response.json();

          // Prepare an array to store all URLs to be cached
          const filesToCache = [];

          // Iterate over each key in the tiles.json object
          Object.keys(data).forEach(animalKey => {
            const animalData = data[animalKey];
            filesToCache.push(animalData.face); // Add the face image to cache
            filesToCache.push(...animalData.clips); // Add all clips to cache
          });

          // Add all files to the cache
          await cache.addAll(filesToCache);
          console.log('Files from tiles.json have been cached:', filesToCache);
        } catch (error) {
          console.error('Failed to cache tiles.json files:', error);
        }
      })
  );
});

// Use stale-while-revalidate strategy for all other requests
workbox.routing.registerRoute(
  new RegExp('/*'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE
  })
);

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
