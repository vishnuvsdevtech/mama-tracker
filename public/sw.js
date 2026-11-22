/* Offline shell for a page a mama opens every day, often on a bad connection.
 *
 * Strategy, deliberately conservative:
 *   - navigations: network first, so a deploy is picked up immediately; the last
 *     good page is kept as the offline fallback
 *   - assets and media: cache first, because Vite fingerprints the filenames, so
 *     a cached asset can never be stale
 *   - version bumps delete old caches in activate
 * A service worker that serves stale HTML is worse than no service worker, which
 * is why navigations never come from the cache while the network works.
 */
const V = 'v1'
const SHELL = 'shell-' + V
const MEDIA = 'media-' + V
const ROOT = new URL('./', self.location).href

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys()
    await Promise.all(keys.filter((k) => k !== SHELL && k !== MEDIA).map((k) => caches.delete(k)))
    await self.clients.claim()
  })())
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return

  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req)
        if (fresh.ok) (await caches.open(SHELL)).put(ROOT, fresh.clone())
        return fresh
      } catch {
        const cached = await (await caches.open(SHELL)).match(ROOT)
        return cached || Response.error()
      }
    })())
    return
  }

  event.respondWith((async () => {
    const cache = await caches.open(MEDIA)
    const hit = await cache.match(req)
    if (hit) return hit
    const res = await fetch(req)
    if (res.ok && (url.pathname.includes('/assets/') || url.pathname.includes('/baby/') || /\.(png|webp|svg|ico|woff2?)$/.test(url.pathname))) {
      cache.put(req, res.clone())
      // fingerprints mean a new deploy writes new entries; without a cap the cache
      // accumulates a copy of every build that ever shipped
      const keys = await cache.keys()
      if (keys.length > 80) await Promise.all(keys.slice(0, keys.length - 80).map((k) => cache.delete(k)))
    }
    return res
  })())
})
