/* ==========================================================================
   stay add. — service worker: lets the site install as an app and open offline.
   It sits between every page and the network and decides, for each request,
   whether to answer from the network or from the saved copy (the cache).

     install   once per new version: download every file below into the cache
     activate  when the new version takes over: delete the old versions' caches
     fetch     every request: pages network-first, site files stale-while-
               revalidate, fonts and GSAP from their own long-lived cache

   ★ After changing site files, raise CACHE_VERSION (v1 → v2 …). The browser only
     notices a new version when this file changes. New pages or scripts also go in
     APP_FILES, so they are ready offline before anyone visits them.
   ========================================================================== */

const CACHE_VERSION = "v7";
const APP_CACHE = `stayadd-app-${CACHE_VERSION}`;   // the site's own files
const LIB_CACHE = "stayadd-libs";                   // Google Fonts and GSAP: kept across versions

// paths are relative to this file, which sits at the site root
const APP_FILES = [
  "./", "./index.html", "./manifest.webmanifest",
  // shared
  "./assets/css/base.css", "./assets/css/landing.css", "./assets/css/lesson.css", "./assets/css/menu.css",
  "./assets/js/catalog.js", "./assets/js/core.js", "./assets/js/fx.js", "./assets/js/landing.js", "./assets/js/lesson.js", "./assets/js/menu.js",
  "./assets/icons/icon.svg", "./assets/icons/icon-32.png", "./assets/icons/apple-touch-icon.png",
  "./assets/icons/icon-192.png", "./assets/icons/icon-512.png", "./assets/icons/icon-maskable-192.png", "./assets/icons/icon-maskable-512.png",
  // chemistry
  "./chemistry/index.html", "./chemistry/css/home.css", "./chemistry/css/lab.css",
  "./chemistry/js/home.js", "./chemistry/js/electrolysis.js", "./chemistry/js/naming-organic.js", "./chemistry/js/collision-theory.js",
  "./chemistry/lessons/electrolysis.html", "./chemistry/lessons/naming-organic.html", "./chemistry/lessons/collision-theory.html",
  // physics
  "./physics/index.html", "./physics/css/home.css", "./physics/css/lab.css",
  "./physics/js/home.js", "./physics/js/projectile.js", "./physics/js/field.js", "./physics/js/refraction.js", "./physics/js/quiz-data.js",
  "./physics/labs/refraction.html",
  // biology
  "./biology/index.html", "./biology/css/home.css", "./biology/css/lab.css",
  "./biology/js/home.js", "./biology/js/enzyme.js", "./biology/js/enzymes.js", "./biology/js/reproduction.js", "./biology/js/inheritance.js",
  "./biology/js/blood.js", "./biology/js/molecules.js", "./biology/js/movement.js",
  ...["classification", "organisation", "movement", "molecules", "enzymes", "plant-nutrition", "human-nutrition", "transport-plants",
      "transport-animals", "disease-immunity", "gas-exchange", "respiration", "excretion", "coordination", "drugs", "reproduction",
      "inheritance", "variation", "ecology", "human-influences", "biotechnology"].map((l) => `./biology/lessons/${l}.html`),
  // computer science
  "./computer-science/index.html", "./computer-science/css/home.css", "./computer-science/css/lab.css",
  "./computer-science/js/home.js", "./computer-science/js/kit.js",
  ...["data-representation", "data-transmission", "hardware", "software", "internet", "emerging-tech", "algorithms",
      "programming", "databases", "boolean-logic"].flatMap((l) => [`./computer-science/lessons/${l}.html`, `./computer-science/js/${l}.js`])
];
const isLib = (url) => ["fonts.googleapis.com", "fonts.gstatic.com", "cdn.jsdelivr.net"].includes(url.hostname);

// 1. install: save every file. One missing file is skipped rather than failing the whole install.
//    cache: "reload" skips the browser's HTTP cache, so a new version never saves old copies.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_CACHE)
      .then((cache) => Promise.allSettled(APP_FILES.map((f) => cache.add(new Request(f, { cache: "reload" })))))
      .then(() => self.skipWaiting())
  );
});

// 2. activate: remove caches left by older versions, and take over pages that are already open
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((n) => n.startsWith("stayadd-app-") && n !== APP_CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

// 3. fetch: choose where each answer comes from
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // a page: the network first, so edits show at once; the saved copy when offline
  if (request.mode === "navigate") return event.respondWith(networkFirst(request));
  // the site's CSS, JS and icons: the saved copy at once, a fresh one fetched for next time
  if (url.origin === self.location.origin) return event.respondWith(staleWhileRevalidate(request, APP_CACHE));
  // fonts and GSAP rarely change: the same, in a cache that survives new versions
  if (isLib(url)) return event.respondWith(staleWhileRevalidate(request, LIB_CACHE));
  // anything else goes to the network as normal
});

async function networkFirst(request) {
  const cache = await caches.open(APP_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (error) {
    // offline: the saved page (ignoring ?query and #topic), or the home page
    return (await cache.match(request, { ignoreSearch: true })) || (await cache.match("./index.html")) || Response.error();
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const fresh = fetch(request)
    .then((response) => {
      // "opaque" = another site's response we cannot read but may store (Google Fonts, the CDN)
      if (response.ok || response.type === "opaque") cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached || Response.error());
  return cached || fresh;
}
