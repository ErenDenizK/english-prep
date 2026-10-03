import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";

const KEY = "englishPrep.theme";
const DARK = "#111316";
const LIGHT = "#f5f3ed";
let instance = 0;

function environment({ stored = null, light = true, blocked = false, full = false } = {}) {
  const values = new Map(stored === null ? [] : [[KEY, stored]]);
  const attributes = new Map();
  const themeColor = { content: DARK };
  const colorScheme = { content: "dark light" };
  const listeners = new Set();
  const media = {
    matches: light,
    addEventListener(name, fn) { assert.equal(name, "change"); listeners.add(fn); },
    removeEventListener(name, fn) { assert.equal(name, "change"); listeners.delete(fn); },
  };
  const localStorage = {
    getItem(key) {
      if (blocked) throw new Error("Storage blocked");
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      if (blocked || full) throw new Error("Storage unavailable");
      values.set(key, value);
    },
  };
  const document = {
    documentElement: {
      setAttribute(key, value) { attributes.set(key, value); },
      removeAttribute(key) { attributes.delete(key); },
    },
    querySelector(selector) {
      if (selector === 'meta[name="theme-color"]') return themeColor;
      if (selector === 'meta[name="color-scheme"]') return colorScheme;
      throw new Error(`Unexpected selector: ${selector}`);
    },
  };
  const window = {
    matchMedia(query) {
      assert.equal(query, "(prefers-color-scheme: light)");
      return media;
    },
  };
  return {
    document, window, localStorage, values, attributes, themeColor, colorScheme, listeners,
    changeSystem(nextLight) {
      media.matches = nextLight;
      for (const fn of listeners) fn({ matches: nextLight });
    },
  };
}

async function moduleIn(t, env) {
  for (const key of ["document", "window", "localStorage"]) {
    const previous = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { configurable: true, value: env[key] });
    t.after(() => {
      if (previous) Object.defineProperty(globalThis, key, previous);
      else delete globalThis[key];
    });
  }
  return import(`../js/theme.js?theme-test=${instance++}`);
}

function expectPaint(env, preference, resolved) {
  assert.equal(env.attributes.get("data-theme"), preference === "system" ? undefined : preference);
  assert.equal(env.themeColor.content, resolved === "light" ? LIGHT : DARK);
  assert.equal(env.colorScheme.content, resolved);
}

test("new learners start dark even when the device prefers light", async (t) => {
  const env = environment();
  const theme = await moduleIn(t, env);
  assert.equal(theme.getTheme(), "dark");
  const stop = theme.initTheme();
  expectPaint(env, "dark", "dark");
  assert.equal(env.values.has(KEY), false, "rendering must not invent a saved preference");
  env.changeSystem(false);
  env.changeSystem(true);
  expectPaint(env, "dark", "dark");
  stop();
});

for (const stored of ["light", "dark"]) {
  test(`an existing ${stored} preference overrides the device and survives initialization`, async (t) => {
    const env = environment({ stored, light: stored !== "light" });
    const theme = await moduleIn(t, env);
    const stop = theme.initTheme();
    assert.equal(theme.getTheme(), stored);
    expectPaint(env, stored, stored);
    env.changeSystem(stored === "light");
    env.changeSystem(stored !== "light");
    expectPaint(env, stored, stored);
    assert.equal(env.values.get(KEY), stored);
    stop();
  });
}

test("system is an explicit persisted choice and browser chrome follows live OS changes", async (t) => {
  const env = environment({ light: true });
  const theme = await moduleIn(t, env);
  const stop = theme.initTheme();
  theme.setTheme("system");
  assert.equal(env.values.get(KEY), "system");
  expectPaint(env, "system", "light");
  env.changeSystem(false);
  expectPaint(env, "system", "dark");
  env.changeSystem(true);
  expectPaint(env, "system", "light");
  const reopened = await import(`../js/theme.js?theme-test=${instance++}`);
  assert.equal(reopened.getTheme(), "system", "full navigation must preserve the opt-in");
  reopened.applyTheme(reopened.getTheme());
  expectPaint(env, "system", "light");
  stop();
});

test("switching away from system prevents later OS changes from changing an explicit choice", async (t) => {
  const env = environment({ stored: "system", light: false });
  const theme = await moduleIn(t, env);
  const stop = theme.initTheme();
  theme.setTheme("light");
  env.changeSystem(true);
  env.changeSystem(false);
  expectPaint(env, "light", "light");
  assert.equal(env.values.get(KEY), "light");
  stop();
});

for (const settings of [{ stored: "invalid" }, { blocked: true }, { stored: "dark", full: true }]) {
  test(`invalid/unavailable storage starts safely; in-session choices still work (${JSON.stringify(settings)})`, async (t) => {
    const env = environment(settings);
    const theme = await moduleIn(t, env);
    const stop = theme.initTheme();
    expectPaint(env, "dark", "dark");
    theme.setTheme("light");
    assert.equal(theme.getTheme(), "light");
    expectPaint(env, "light", "light");
    theme.setTheme("system");
    env.changeSystem(false);
    assert.equal(theme.getTheme(), "system");
    expectPaint(env, "system", "dark");
    stop();
  });
}

test("initialization is idempotent and its listener can be cleaned up", async (t) => {
  const env = environment({ stored: "system" });
  const theme = await moduleIn(t, env);
  const stop = theme.initTheme();
  assert.equal(theme.initTheme(), stop);
  assert.equal(env.listeners.size, 1);
  stop();
  assert.equal(env.listeners.size, 0);
  theme.initTheme()();
  assert.equal(env.listeners.size, 0);
});

test("all three entry pages paint the same preference before CSS and initialize live system updates", async () => {
  const pages = await Promise.all(["index.html", "quiz.html", "results.html"].map((name) =>
    readFile(new URL(`../${name}`, import.meta.url), "utf8")));
  const scripts = pages.map((html) => html.match(/<script>([\s\S]*?)<\/script>/)?.[1]);
  assert.ok(scripts[0]);
  assert.equal(new Set(scripts).size, 1, "first-paint behavior must not drift across pages");
  for (const html of pages) {
    assert.ok(html.indexOf("<script>") < html.indexOf('rel="stylesheet"'));
    assert.match(html, /import \{ initTheme \} from "\.\/js\/theme\.js";\s*initTheme\(\);/);
  }
  for (const stored of [null, "invalid", "dark", "light", "system"]) {
    for (const light of [false, true]) {
      for (const blocked of [false, true]) {
        const env = environment({ stored, light, blocked });
        runInNewContext(scripts[0], { document: env.document, window: env.window, localStorage: env.localStorage });
        const preference = !blocked && (stored === "light" || stored === "system") ? stored : "dark";
        const resolved = preference === "system" ? (light ? "light" : "dark") : preference;
        expectPaint(env, preference, resolved);
      }
    }
  }
});
