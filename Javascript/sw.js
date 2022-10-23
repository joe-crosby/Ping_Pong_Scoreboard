// (A) FILES TO CACHE
const CACHE_NAME = "PingPongOffline";
var urlsToCache = [
    'https://joe-crosby.github.io/Ping_Pong_Scoreboard/',
    'https://joe-crosby.github.io/Ping_Pong_Scoreboard/Javascript/player.js',
    'https://joe-crosby.github.io/Ping_Pong_Scoreboard/Javascript/scoreboard.js',
    'https://joe-crosby.github.io/Ping_Pong_Scoreboard/Images/favicon.ico',
    'https://joe-crosby.github.io/Ping_Pong_Scoreboard/Images/winner.gif',
    'https://joe-crosby.github.io/Ping_Pong_Scoreboard/css/reset.css',
    'https://joe-crosby.github.io/Ping_Pong_Scoreboard/css/site.css',
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