// Scope-specific caches let the redesigned and preserved original apps share
// an origin without either worker deleting or serving the other app's shell.
// Content stays unversioned so a release cannot erase downloaded lessons.
const VERSION = "english-prep-v0.67";
const SCOPE = new URL(self.registration.scope);
const NAMESPACE = `english-prep:${encodeURIComponent(SCOPE.pathname)}:`;
const SHELL_PREFIX = `${NAMESPACE}shell:`;
const SHELL_CACHE = `${SHELL_PREFIX}${VERSION}`;
const CONTENT = `${NAMESPACE}content`;
const LEGACY_CONTENT = "english-prep-content";
const DATA = new URL("./data/", SCOPE);

// Precache every runtime module and the assets needed to render the shell.
// Lessons/questions remain network-first and are cached when visited.
const SHELL = [
  "./",
  "./index.html",
  "./quiz.html",
  "./results.html",
  "./css/style.css",
  "./css/fonts.css",
  "./css/editorial.css",
  "./assets/fonts/InterVariable.woff2",
  "./manifest.webmanifest",
  "./js/answers.js",
  "./js/backup-ui.js",
  "./js/backup.js",
  "./js/config.js",
  "./js/dom.js",
  "./js/education.js",
  "./js/feedback.js",
  "./js/home.js",
  "./js/install.js",
  "./about/",
  "./about/index.html",
  "./about/about.css",
  "./about/about.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-180.png",
  "./js/icons.js",
  "./js/listbox.js",
  "./js/modal.js",
  "./js/profile.js",
  "./js/prompt.js",
  "./js/quiz-engine.js",
  "./js/quiz-launch.js",
  "./js/quiz.js",
  "./js/report.js",
  "./js/results.js",
  "./js/session-state.js",
  "./js/shell.js",
  "./js/storage.js",
  "./js/tiers.js",
  "./js/theme.js",
  "./js/topics.js",
  "./js/widgets.js",
  "./js/onboarding.js",
  "./js/celebrate.js",
];

function isScopedContent(request) {
  const url = new URL(request.url);
  return url.origin === DATA.origin && url.pathname.startsWith(DATA.pathname);
}

async function migrateContent() {
  // The previous cache was shared by every copy on this origin. Copy only
  // this scope's data, keep newer scoped responses, and leave the shared
  // cache intact because another installed copy may still rely on it.
  if (!(await caches.keys()).includes(LEGACY_CONTENT)) return;
  const previous = await caches.open(LEGACY_CONTENT);
  const current = await caches.open(CONTENT);
  for (const request of await previous.keys()) {
    if (!isScopedContent(request) || await current.match(request)) continue;
    const response = await previous.match(request);
    if (response) {
      try {
        await current.put(request, response);
      } catch {
        // A full cache must not prevent the worker from taking control.
        // The original response remains available in the legacy cache.
      }
    }
  }
}

async function fetchFresh(request, cacheName) {
  const response = await fetch(request);
  if (response.ok) {
    try {
      const cache = await caches.open(cacheName);
      await cache.put(request, response.clone());
    } catch {
      // Storage failures must not discard a usable network response.
    }
  }
  return response;
}

self.addEventListener("install", (event) => {
  // Any missing shell asset rejects installation; never activate half a UI.
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL.map((path) => new Request(new URL(path, SCOPE), { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    migrateContent()
      .then(() => caches.keys())
      .then((names) => Promise.all(
        names
          .filter((name) => name.startsWith(SHELL_PREFIX) && name !== SHELL_CACHE)
          .map((name) => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== SCOPE.origin
    || !url.pathname.startsWith(SCOPE.pathname)) return;

  if (isScopedContent(request)) {
    event.respondWith(
      fetchFresh(request, CONTENT)
        .catch(async () => {
          const own = await (await caches.open(CONTENT)).match(request);
          if (own) return own;
          // Also preserve offline access if migration could not write due
          // to quota. This lookup is for the exact request in our data path.
          if ((await caches.keys()).includes(LEGACY_CONTENT)) {
            return (await caches.open(LEGACY_CONTENT)).match(request);
          }
          return undefined;
        })
    );
    return;
  }

  // Shell lookups are deliberately local to this cache. CacheStorage.match
  // would search other releases/copies and could resurrect their stale UI.
  const cached = caches.open(SHELL_CACHE).then((cache) => cache.match(request));
  const live = fetchFresh(request, SHELL_CACHE).catch(() => cached);
  event.waitUntil(live.then(() => undefined));
  event.respondWith(cached.then((response) => response ?? live));
});
