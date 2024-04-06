function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("sw.js", { scope: "/" })
      .then(() => {
        console.log("Service Worker registrado com sucesso.");
      })
      .catch((error) => {
        console.log("Service Worker falhou:", error);
      });
  }
}

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('my-pwa-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/scripts/index.js',
        '/sw.js',
        '/styles/index.css',
        '/styles/media-query.css',
        '/manifest.json',
        '/assets/images/male-icons/android-chrome-192x192.png',
        '/assets/images/male-icons/android-chrome-512x512.png',
        '/assets/images/male-icons/apple-touch-icon.png',
        '/assets/images/male-icons/favicon-16x16.png',
        '/assets/images/male-icons/favicon-32x32.png',
        '/assets/images/male-icons/favicon.ico',
        '/assets/images/male-icons/mstile-144x144.png',
        '/assets/images/male-icons/mstile-150x150.png',
        '/assets/images/male-icons/mstile-310x150.png',
        '/assets/images/male-icons/mstile-70x70.png',
        '/assets/images/male-icons/safari-pinned-tab.svg',
        '/assets/images/male-icons/mstile-310x310.png',
        '/assets/images/male-icons/browserconfig.xml',
        '/assets/images/female-icons/android-chrome-192x192.png',
        '/assets/images/female-icons/android-chrome-512x512.png',
        '/assets/images/female-icons/apple-touch-icon.png',
        '/assets/images/female-icons/browserconfig.xml',
        '/assets/images/female-icons/favicon-16x16.png',
        '/assets/images/female-icons/favicon-32x32.png',
        '/assets/images/female-icons/favicon.ico',
        '/assets/images/female-icons/mstile-144x144.png',
        '/assets/images/female-icons/mstile-150x150.png',
        '/assets/images/female-icons/mstile-310x150.png',
        '/assets/images/female-icons/mstile-310x310.png',
        '/assets/images/female-icons/mstile-70x70.png',
      ]);
    })
  );
 });
