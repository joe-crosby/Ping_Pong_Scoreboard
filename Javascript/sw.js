// (A) FILES TO CACHE
const cName = "PingPongOffline",
urlToCache = [
    'https://joe-crosby.github.io/Ping_Pong_Scoreboard/',
    'https://joe-crosby.github.io/Ping_Pong_Scoreboard/Javascript/player.js',
    'https://joe-crosby.github.io/Ping_Pong_Scoreboard/Javascript/scoreboard.js',
    'https://joe-crosby.github.io/Ping_Pong_Scoreboard/Images/favicon.ico',
    'https://joe-crosby.github.io/Ping_Pong_Scoreboard/Images/winner.gif',
    'https://joe-crosby.github.io/Ping_Pong_Scoreboard/css/reset.css',
    'https://joe-crosby.github.io/Ping_Pong_Scoreboard/css/site.css',
];
 
// (B) CREATE/INSTALL CACHE
self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(cName)
    .then((cache) => { return cache.addAll(urlToCache); })
    .catch((err) => { console.error(err) })
  );
});
 
// (C) LOAD FROM CACHE, FALLBACK TO NETWORK IF NOT FOUND
self.addEventListener("fetch", (evt) => {
  evt.respondWith(
    caches.match(evt.request)
    .then((res) => { return res || fetch(evt.request); })
  );
});