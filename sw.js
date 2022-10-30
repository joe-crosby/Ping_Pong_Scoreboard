const CACHE_NAME = "PingPongOffline";

var urlsToCache = [
    'https://joe-crosby.github.io/Ping_Pong_Scoreboard/',
    'https://joe-crosby.github.io/Ping_Pong_Scoreboard/Javascript/player.js',
    'https://joe-crosby.github.io/Ping_Pong_Scoreboard/Javascript/scoreboard.js',
    'https://joe-crosby.github.io/Ping_Pong_Scoreboard/Images/favicon.ico',
    'https://joe-crosby.github.io/Ping_Pong_Scoreboard/Images/winner.gif',
    'https://joe-crosby.github.io/Ping_Pong_Scoreboard/css/reset.css',
    'https://joe-crosby.github.io/Ping_Pong_Scoreboard/css/site.css'
];
 
// Create the cache on install
self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function(cache) {
          return cache.addAll(urlsToCache);
        })
        .catch(function(err) { 
            console.error(err); 
        })
    );
});
 
// Network first, fall back to cache. This will keep the cache up to date.
self.addEventListener('fetch', (event) => {
  // Check if this is a navigation request
  if (event.request.mode === 'navigate') {
    // Open the cache
    event.respondWith(caches.open(CACHE_NAME).then((cache) => {
      // Go to the network first
      return fetch(event.request.url).then((fetchedResponse) => {
        cache.put(event.request, fetchedResponse.clone());

        return fetchedResponse;
      }).catch(() => {
        // If the network is unavailable, get
        return cache.match(event.request.url);
      });
    }));
  } else {
    return;
  }
});
