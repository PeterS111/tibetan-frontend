// Minimal pass-through Service Worker for single-instance Android WebAPK / PWA install.
// Intentionally does NOT cache HTML, JS, Clerk auth, or API responses so updates are always instant.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // Pass-through directly to network
});
