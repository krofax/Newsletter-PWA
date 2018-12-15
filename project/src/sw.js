importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js');

if (workbox) {
  console.log(`Workbox is loading`);

  workbox.precaching.precacheAndRoute([]);

  workbox.routing.registerRoute(
    /(.*)articles(.*)\.(?:png|gif|jpg)/, 
    workbox.strategies.cacheFirst({
      cacheName: 'images-cache',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        })
      ]
    })
  ); 

    //Make workbox work networkfirst
  const articleHandler = workbox.strategies.networkFirst({
    cacheName: 'articles-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 50,
      })
    ]
  });
  
  //Workbox Routing
  workbox.routing.registerRoute(/(.*)article(.*)\.html/, args => {
    return articleHandler.handle(args).then(response => {
      if (!response) {
        return caches.match('pages/offline.html');
      } else if (response.status === 404) {
        return caches.match('pages/404.html');
      }
      return response;
    });
  });
  
  

} else {
  console.log(`Oh yunk!! Workbox didn't load `);
}