// This is the "Offline copy of pages" service worker

const CACHE = "pwabuilder-offline";
const TILES_JSON_URL = "/tiles.json";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

// Skip waiting once new service worker is installed
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "CACHE_TILES") {
    cacheTiles();
  }
});

// Function to cache tiles from tiles.json
const cacheTiles = async () => {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(TILES_JSON_URL);
    const data = await response.json();

    const filesToCache = [];
    Object.keys(data).forEach(animalKey => {
      const animalData = data[animalKey];
      filesToCache.push(animalData.face); // Add the face image to cache
      filesToCache.push(...animalData.clips); // Add all clips to cache
    });

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
};

// Use stale-while-revalidate strategy for all other requests
workbox.routing.registerRoute(
  new RegExp('/*'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE
  })
);
