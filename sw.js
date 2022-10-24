// (A) FILES TO CACHE
const CACHE_NAME = "PingPongOffline";
var urlsToCache = [
    '/',
    '/Javascript/player.js',
    '/Javascript/scoreboard.js',
    '/Images/favicon.ico',
    '/Images/winner.gif',
    '/css/reset.css',
    '/css/site.css'
];
 
// (B) CREATE/INSTALL CACHE
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
 
// (C) LOAD FROM CACHE, FALLBACK TO NETWORK IF NOT FOUND
self.addEventListener("fetch", (evt) => {
  evt.respondWith(
    caches.match(evt.request)
    .then((res) => { return res || fetch(evt.request); })
  );
});