// (A) FILES TO CACHE
const cName = "PingPongOffline",
urlToCache = [
    '/',
    '/Javascript/player.js',
    '/Javascript/scoreboard.js',
    '/Images/favicon.ico',
    '/Images/winner.gif',
    '/css/reset.css',
    '/css/site.css',
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