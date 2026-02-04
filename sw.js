// BUMPED VERSION TO V2 (Forces phone to update)
const CACHE_NAME = 'journal-v2';

// Files to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/src/style.css',
  '/src/main.js',
  '/manifest.json'
];

// 1. INSTALL: Cache the files
self.addEventListener('install', event => {
  // Force this new service worker to become active immediately
  self.skipWaiting(); 
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// 2. ACTIVATE: Delete old caches (The Fix)
self.addEventListener('activate', event => {
  // Take control of all open tabs immediately
  event.waitUntil(clients.claim());

  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // If the cache name is NOT 'journal-v2', delete it
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. FETCH: Serve from cache, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});