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

          // Cache each file individually and catch errors
          await Promise.all(
            filesToCache.map(async (file) => {
              try {
                const request = new Request(file);
                await cache.add(request);
                console.log(`Cached: ${file}`);
              } catch (error) {
                console.error(`Failed to cache: ${file}`, error);
              }
            })
          );

          console.log('All available files from tiles.json have been cached.');
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
