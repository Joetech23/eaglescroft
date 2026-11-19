/* Eaglescroft portal service worker: app-file cache, offline fallback + push notifications. */
const CACHE = 'es-portal-v2'
const STATIC = 'es-static-v1' // build files: content-hashed, so safe to keep across deploys
const STATIC_MAX = 250
const OFFLINE = '/offline.html'
const PRECACHE = [OFFLINE, '/pwa/icon-192.png', '/brand/eagle-white.png']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  const keep = [CACHE, STATIC]
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => !keep.includes(k)).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  )
})

async function trim(cacheName, max) {
  const c = await caches.open(cacheName)
  const keys = await c.keys()
  for (let i = 0; i < keys.length - max; i++) await c.delete(keys[i])
}

// Next.js build files (/_next/static/...) never change once deployed (the hash is in the
// name), so serve them from the phone first and only download each one once.
async function cacheFirst(req) {
  const c = await caches.open(STATIC)
  const hit = await c.match(req)
  if (hit) return hit
  const res = await fetch(req)
  if (res.ok) {
    c.put(req, res.clone()).then(() => trim(STATIC, STATIC_MAX))
  }
  return res
}

// Brand images and icons: show the stored copy instantly, refresh it in the background.
async function staleWhileRevalidate(req) {
  const c = await caches.open(CACHE)
  const hit = await c.match(req)
  const network = fetch(req)
    .then((res) => {
      if (res.ok) c.put(req, res.clone())
      return res
    })
    .catch(() => hit)
  return hit || network
}

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return

  // (Skipped on localhost: dev builds reuse file names, so caching them would serve stale code.)
  if (url.pathname.startsWith('/_next/static/') && url.hostname !== 'localhost') {
    event.respondWith(cacheFirst(req))
    return
  }
  if (url.pathname.startsWith('/brand/') || url.pathname.startsWith('/pwa/')) {
    event.respondWith(staleWhileRevalidate(req))
    return
  }
  // Portal pages and data are always fetched fresh (live data); only when the network is
  // gone do we show the offline page.
  if (req.mode !== 'navigate') return
  if (!url.pathname.startsWith('/portal') && !url.pathname.startsWith('/admin')) return
  event.respondWith(fetch(req).catch(() => caches.match(OFFLINE)))
})

self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch {
    data = { title: 'Eaglescroft', body: event.data && event.data.text() }
  }
  event.waitUntil(
    self.registration.showNotification(data.title || 'Eaglescroft', {
      body: data.body || '',
      icon: '/pwa/icon-192.png',
      badge: '/pwa/icon-192.png',
      tag: data.tag || undefined,
      renotify: Boolean(data.tag),
      data: { url: data.url || '/portal' },
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = new URL(event.notification.data?.url || '/portal', self.location.origin).href
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((wins) => {
      for (const w of wins) {
        if ('focus' in w) {
          w.navigate(target)
          return w.focus()
        }
      }
      return self.clients.openWindow(target)
    }),
  )
})
