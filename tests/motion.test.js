import test from "node:test";
import assert from "node:assert/strict";

const KEY = "englishPrep.motion";
let instance = 0;

function environment({ stored = null, reduced = false, blocked = false } = {}) {
  const values = new Map(stored === null ? [] : [[KEY, stored]]);
  const documentListeners = new Map();
  const windowListeners = new Map();
  const mediaListeners = new Set();
  const changes = [];
  const makeElement = () => ({
    dataset: {}, children: [], attributes: new Map(),
    setAttribute(name, value) { this.attributes.set(name, value); },
    appendChild(child) { this.children.push(child); },
    prepend(child) { this.children.unshift(child); },
  });
  const body = makeElement();
  const media = {
    matches: reduced,
    addEventListener(name, listener) { assert.equal(name, "change"); mediaListeners.add(listener); },
    removeEventListener(name, listener) { mediaListeners.delete(listener); },
  };
  const document = {
    readyState: "complete", hidden: false, body, documentElement: makeElement(),
    createElement: makeElement,
    querySelector(selector) {
      assert.equal(selector, ".ambient");
      return body.children.find((node) => node.className === "ambient") ?? null;
    },
    querySelectorAll(selector) { assert.equal(selector, "[data-motion-control]"); return []; },
    addEventListener(name, listener) { documentListeners.set(name, listener); },
    removeEventListener(name, listener) {
      if (documentListeners.get(name) === listener) documentListeners.delete(name);
    },
    dispatchEvent(event) { changes.push(event); },
  };
  const window = {
    matchMedia(query) { assert.equal(query, "(prefers-reduced-motion: reduce)"); return media; },
    addEventListener(name, listener) { windowListeners.set(name, listener); },
    removeEventListener(name, listener) {
      if (windowListeners.get(name) === listener) windowListeners.delete(name);
    },
  };
  const localStorage = {
    getItem(name) { if (blocked) throw new Error("Unavailable"); return values.get(name) ?? null; },
    setItem(name, value) { if (blocked) throw new Error("Unavailable"); values.set(name, value); },
  };
  return {
    document, window, localStorage, values, changes, documentListeners, windowListeners, mediaListeners,
    CustomEvent: class { constructor(type, { detail }) { this.type = type; this.detail = detail; } },
    reduce(value) { media.matches = value; for (const listener of mediaListeners) listener(); },
    hide(value) { document.hidden = value; documentListeners.get("visibilitychange")?.(); },
    storage(key, newValue) { windowListeners.get("storage")?.({ key, newValue }); },
  };
}

async function moduleIn(t, env) {
  const originals = new Map();
  for (const key of ["document", "window", "localStorage", "CustomEvent"]) {
    originals.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, { configurable: true, value: env[key] });
  }
  const motion = await import(`../js/motion.js?motion-test=${instance++}`);
  const stop = motion.initMotion();
  t.after(() => {
    stop();
    for (const [key, previous] of originals) {
      if (previous) Object.defineProperty(globalThis, key, previous);
      else delete globalThis[key];
    }
  });
  return motion;
}

test("motion initializes once, creates one shared atmosphere and invents no stored choice", async (t) => {
  const env = environment();
  const motion = await moduleIn(t, env);
  assert.equal(motion.motionEnabled(), true);
  assert.equal(env.values.size, 0);
  assert.equal(motion.initMotion(), motion.initMotion());
  assert.equal(env.document.body.children.length, 1);
  assert.equal(env.document.body.children[0].children.length, 3);
  assert.equal(env.document.body.children[0].attributes.get("aria-hidden"), "true");
  assert.equal(env.mediaListeners.size, 1);
  assert.equal(env.documentListeners.size, 1);
  assert.equal(env.windowListeners.size, 1);
  assert.equal(env.document.documentElement.dataset.motion, "on");
});

test("the explicit off choice persists and is respected when the OS preference changes", async (t) => {
  const env = environment({ stored: "off" });
  const motion = await moduleIn(t, env);
  assert.equal(motion.motionEnabled(), false);
  env.reduce(true);
  env.reduce(false);
  assert.equal(motion.motionEnabled(), false);
  motion.setMotionEnabled(true);
  assert.equal(env.values.get(KEY), "on");
  assert.equal(motion.motionEnabled(), true);
  motion.setMotionEnabled(false);
  assert.equal(env.values.get(KEY), "off");
  assert.equal(env.document.body.dataset.motion, "off");
});

test("system reduction wins over on, including a live system change", async (t) => {
  const env = environment({ stored: "on", reduced: true });
  const motion = await moduleIn(t, env);
  motion.setMotionEnabled(true);
  assert.equal(motion.motionEnabled(), false);
  assert.equal(env.changes.at(-1).detail.systemReduced, true);
  env.reduce(false);
  assert.equal(motion.motionEnabled(), true);
  env.reduce(true);
  assert.equal(motion.motionEnabled(), false);
});

test("visibility pauses decoration without rewriting the chosen preference", async (t) => {
  const env = environment();
  const motion = await moduleIn(t, env);
  env.hide(true);
  assert.equal(env.document.documentElement.dataset.pageVisible, "false");
  assert.equal(env.document.body.dataset.pageVisible, "false");
  assert.equal(motion.motionEnabled(), true);
  assert.equal(env.values.size, 0);
  assert.deepEqual(env.changes.at(-1).detail, { enabled: true, visible: false, systemReduced: false });
  motion.setMotionEnabled(false);
  env.hide(false);
  assert.equal(env.document.documentElement.dataset.pageVisible, "true");
  assert.equal(motion.motionEnabled(), false);
});

test("other tabs synchronize the same preference while unrelated storage events do nothing", async (t) => {
  const env = environment();
  const motion = await moduleIn(t, env);
  env.storage(KEY, "off");
  assert.equal(motion.motionEnabled(), false);
  const count = env.changes.length;
  env.storage("englishPrep.theme", "light");
  assert.equal(env.changes.length, count);
  env.storage(null, null);
  assert.equal(motion.motionEnabled(), true);
  env.reduce(true);
  env.storage(KEY, "on");
  assert.equal(motion.motionEnabled(), false);
});

test("blocked storage still permits in-session control and safe cleanup", async (t) => {
  const env = environment({ blocked: true });
  const motion = await moduleIn(t, env);
  motion.setMotionEnabled(false);
  assert.equal(motion.motionEnabled(), false);
  motion.setMotionEnabled(true);
  assert.equal(motion.motionEnabled(), true);
  const stop = motion.initMotion();
  stop();
  assert.equal(env.mediaListeners.size, 0);
  assert.equal(env.documentListeners.size, 0);
  assert.equal(env.windowListeners.size, 0);
});
