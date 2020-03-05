self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("v1").then(cache => {
      return cache.addAll([
        "./index.html",
        "./style.css",
        "./main.js",
        "./icons/chevron-up-solid.svg",
        "./icons/chevron-left-solid.svg",
        "./icons/dot-circle-regular.svg",
        "./icons/chevron-right-solid.svg",
        "./icons/chevron-down-solid.svg",
        "./hammer.min.js"
      ]);
    })
  );
});

// self.addEventListener("fetch", event => {
//   event.respondWith(caches.match(event.request));
// });
