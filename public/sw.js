// Minimal service worker — no caching strategy, just satisfies browser requests.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.clients.claim());
