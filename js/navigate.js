// The one place the app moves between its pages.
//
// On the real site this is just `window.location.href = page` — three
// separate HTML files, no router, nothing clever. The indirection exists
// for the single-file preview build (scripts/build-artifact.js), which
// packs all three pages into one document and therefore has to swap
// screens in place instead of navigating.
//
// Keeping that difference behind one function is what lets the preview be
// *generated from these exact files* rather than hand-maintained as a
// parallel copy — which is how it used to drift from the real app every
// time either one changed.

const pageInits = new Map();

/**
 * Lets a page module say "this is how you (re)start me", so the bundled
 * build can re-run it on navigation. Harmless on the real site, where a
 * page only ever starts once, on load.
 * @param {string} page - the page's filename, e.g. "quiz.html"
 * @param {() => void} init
 */
export function registerPage(page, init) {
  pageInits.set(page, init);
}

/**
 * True when running inside the generated single-file build. Page modules
 * use it to skip their own load-time init, because there every module
 * loads at once and only the entry page should start.
 * @returns {boolean}
 */
export function isBundled() {
  return globalThis.__ENGLISH_PREP_BUNDLED__ === true;
}

/**
 * @param {string} page - "index.html" | "quiz.html" | "results.html"
 */
export function navigateTo(page) {
  const swap = globalThis.__ENGLISH_PREP_NAVIGATE__;
  if (typeof swap === "function") {
    swap(page, pageInits.get(page));
    return;
  }
  window.location.href = page;
}
