// A service worker, and the smallest one that solves the actual problem.
//
// The app is static, has no build step and no runtime dependencies, and
// this file keeps all three: it is plain ES, registered directly, and
// nothing bundles it. What it buys is the case the owner will actually
// meet — opening the app on a bus with no signal, where until now the
// reload was a blank page and a month of revision was unreachable behind
// a network error.
//
// Cache-first for the shell, network-first for content. The shell is
// three HTML files, one stylesheet and the modules: they change only
// when the app is deployed, so serving them from the cache is both
// faster and correct. The content is different — a topic file gains
// questions between deploys, and a learner who is online should get the
// new ones — so those go to the network first and fall back to whatever
// was cached the last time there was a connection.
//
// The version string is the whole cache-busting mechanism, and it had
// been "v1" across every deploy since it was written — so a change to a
// module reached a returning learner only through the background refresh
// below, on their *second* open. That is a fair trade for a topic file;
// it is not one for a bug fix shipped four days before an exam.
//
// It is the app's own version now, and `tests/service-worker.test.js`
// fails when it does not match the top of CHANGELOG.md. A rule that says
// "remember to bump this" is a rule that gets forgotten once and then
// silently stays forgotten, which is exactly what happened here.

const VERSION = "english-prep-v0.30";

/**
 * The shell. Everything needed to paint a screen with no network at all.
 *
 * The modules are listed, and they were not before. They used to be
 * cached on demand, which was fine while VERSION never changed — but a
 * bumped VERSION deletes the old cache on activate, so a learner who
 * went offline in the window between the new worker taking over and the
 * next page load would have had the three HTML files and none of the
 * code. `tests/service-worker.test.js` checks this list against `js/`,
 * because a module added later and not listed here is exactly the kind
 * of omission nobody notices until they are on a bus.
 *
 * Content is deliberately absent: it is cached on demand, because
 * pre-caching every topic file would download the whole corpus to a
 * learner who opened the app once. Fonts too — they fall back to the
 * metric-matched system stack, which is what they are chosen for.
 */
const SHELL = [
  "./",
  "./index.html",
  "./quiz.html",
  "./results.html",
  "./css/style.css",
  "./css/fonts.css",
  "./manifest.webmanifest",
  "./js/answers.js",
  "./js/backup-ui.js",
  "./js/backup.js",
  "./js/config.js",
  "./js/dom.js",
  "./js/education.js",
  "./js/feedback.js",
  "./js/home.js",
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
  "./js/topics.js",
];

self.addEventListener("install", (event) => {
  // `addAll` rejects the whole install if any one file 404s, which is
  // what should happen: a half-cached shell is worse than none, because
  // it fails at a moment the learner cannot diagnose.
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) => Promise.all(names.filter((name) => name !== VERSION).map((name) => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  // Only GET, and only this origin. A service worker that answers for
  // anything else is a service worker that will one day answer wrongly.
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  const isContent = new URL(request.url).pathname.includes("/data/");

  if (isContent) {
    // Network first: a topic file gains questions between deploys and a
    // learner who has a connection should get them.
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(VERSION).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache first for the shell, but still refresh it in the background so
  // a deploy reaches a daily user on their second open rather than never.
  event.respondWith(
    caches.match(request).then((cached) => {
      const live = fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(VERSION).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => cached);
      return cached ?? live;
    })
  );
});
