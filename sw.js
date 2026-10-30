// Offline cache. Bump VERSION when files change.
const VERSION = 'mamram-v6';
const SHELL = [
  './', 'index.html', 'manifest.webmanifest', 'css/app.css',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png',
  'js/app.js', 'js/ui.js', 'js/state.js',
  'js/content/index.js', 'js/content/meta.js', 'js/content/module1.js', 'js/content/module2.js', 'js/content/svg.js', 'js/content/module3.js', 'js/content/module4.js',
  'js/engines/index.js', 'js/engines/sorter.js', 'js/engines/fixit.js', 'js/engines/packet.js',
  'js/engines/cipher.js', 'js/engines/password.js', 'js/engines/combo.js',
  'js/engines/inbox.js', 'js/engines/order.js', 'js/engines/firewall.js', 'js/engines/twofa.js', 'js/engines/logs.js',
  'js/engines/blocks.js', 'js/engines/python.js', 'js/engines/git.js', 'js/python.js', 'js/py-worker.js',
  'js/engines/promptlab.js', 'js/engines/predict.js', 'js/engines/trainer.js', 'js/engines/chatbot.js', 'js/engines/canvas.js',
  'js/pages/common.js', 'js/pages/map.js', 'js/pages/mission.js', 'js/pages/welcome.js',
  'js/pages/profile.js', 'js/pages/parent.js',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Network-first for same-origin (fresh content when online), cache fallback offline.
// Cache-first for fonts and the Pyodide CDN (so Python works offline after first load).
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    e.respondWith(fetch(req).then(res => {
      const copy = res.clone();
      caches.open(VERSION).then(c => c.put(req, copy));
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('index.html'))));
  } else if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname) || url.hostname === 'cdn.jsdelivr.net') {
    e.respondWith(caches.match(req).then(r => r || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(VERSION).then(c => c.put(req, copy));
      return res;
    })));
  }
});
