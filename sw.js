const version = 1;
const appName = "PingPongOffline";
const CACHE_NAME = `${appName}V${version}`;

var cacheItemUrls = [
    './',
    './index.html',
    './Javascript/player.js',
    './Javascript/scoreboard.js',
    './Images/favicon.ico',
    './Images/winner.gif',
    './css/reset.css',
    './css/site.css'
];
 
const addResourceUrlsToCache = async (items) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(items).catch((err) => {
    console.error(err);
  });;
};

const putInCache = async (request, response) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
};

const deleteCache = async (key) => {
  await caches.delete(key);
};

const deleteOldCaches = async () => {
  const keyList = await caches.keys();
  const cachesToDelete = keyList.filter((key) => key.startsWith(appName) && key != CACHE_NAME);
  await Promise.all(cachesToDelete.map(deleteCache));
}

// Create the cache on install
self.addEventListener('install', function(event) {
    event.waitUntil(
      addResourceUrlsToCache(cacheItemUrls)
    );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(deleteOldCaches());
});
 
const cacheFirst = async ({ request, fallbackUrl }) => {
  // Try to get the resource from the cache
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // Try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request.clone());
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }

    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
};


self.addEventListener('fetch', (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      fallbackUrl: './index.html',
    })
  );
});
