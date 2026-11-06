// Service worker del CRM: guarda la app para que abra rápido y sin conexión.
// Nunca guarda datos de Odoo ni de Outlook: esas peticiones van siempre a la red.
const VERSION = "crm-2026.11.07";
const SHELL = [
  "./", "./index.html", "./config.js", "./manifest.webmanifest",
  "./vendor/msal-browser.min.js",
  "./img/trimodos.png", "./img/stinsa.png", "./img/transargi.png",
  "./icons/icon-192.png", "./icons/apple-touch-icon.png", "./icons/favicon-32.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Tipografías de Google: de la caché si ya están.
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(caches.open(VERSION).then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok || res.type === "opaque") c.put(req, res.clone());
      return res;
    }));
    return;
  }

  // Solo se gestionan los archivos de la propia app.
  if (url.origin !== self.location.origin) return;

  // La página y la configuración: primero la red (así llegan los cambios), y la caché si no hay conexión.
  if (req.mode === "navigate" || url.pathname.endsWith("/config.js")) {
    e.respondWith(
      fetch(req).then(res => {
        if (res.ok) caches.open(VERSION).then(c => c.put(req.mode === "navigate" ? "./index.html" : req, res.clone()));
        return res;
      }).catch(async () => (await caches.match(req.mode === "navigate" ? "./index.html" : req)) || caches.match("./"))
    );
    return;
  }

  // El resto (logos, iconos, librería): de la caché y se renueva por detrás.
  e.respondWith(caches.open(VERSION).then(async c => {
    const hit = await c.match(req);
    const net = fetch(req).then(res => { if (res.ok) c.put(req, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  }));
});
