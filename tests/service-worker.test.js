// Exercise the actual workers against a shared, in-memory CacheStorage.
// Co-hosted copies must neither erase nor read each other's shell caches.
import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { runInNewContext } from "node:vm";

const sw = await readFile(new URL("../sw.js", import.meta.url), "utf8");
const originalSw = await readFile(new URL("../original/sw.js", import.meta.url), "utf8");
const changelog = await readFile(new URL("../CHANGELOG.md", import.meta.url), "utf8");
const ROOT = "https://prep.example/app/";
const ORIGINAL = `${ROOT}original/`;

function memoryCaches() {
  const stores = new Map();
  const key = (request) => typeof request === "string" ? request : request.url;
  return {
    failWrites: false,
    failInstall: false,
    installRequests: [],
    async keys() { return [...stores.keys()]; },
    async delete(name) { return stores.delete(name); },
    async open(name) {
      if (!stores.has(name)) stores.set(name, new Map());
      const entries = stores.get(name);
      const cache = {
        match: async (request) => entries.get(key(request))?.clone(),
        keys: async () => [...entries.keys()].map((url) => new Request(url)),
        put: async (request, response) => {
          if (this.failWrites) throw new Error("Cache quota exceeded");
          entries.set(key(request), response.clone());
        },
        addAll: async (urls) => {
          if (this.failInstall) throw new Error("Missing shell asset");
          this.installRequests.push(...urls);
          for (const url of urls) await cache.put(url, new Response(`shell:${key(url)}`));
        },
      };
      return cache;
    },
  };
}

function worker(source = sw, scope = ROOT, caches = memoryCaches()) {
  const handlers = new Map();
  const lifecycle = { skipped: 0, claimed: 0 };
  let network = async () => { throw new Error("Offline"); };
  const context = {
    URL, Request, Response, caches,
    fetch: (request) => network(request),
    self: {
      registration: { scope },
      location: new URL("sw.js", scope),
      addEventListener: (name, handler) => handlers.set(name, handler),
      skipWaiting: async () => { lifecycle.skipped += 1; },
      clients: { claim: async () => { lifecycle.claimed += 1; } },
    },
  };
  runInNewContext(`${source}\nglobalThis.config = { VERSION, SHELL_CACHE, SHELL_PREFIX, CONTENT, SHELL };`, context);
  return {
    caches, lifecycle, config: context.config,
    setNetwork(fn) { network = fn; },
    async dispatch(name) {
      const pending = [];
      handlers.get(name)({ waitUntil: (promise) => pending.push(promise) });
      await Promise.all(pending);
    },
    async request(url, options) {
      const pending = [];
      let response;
      let handled = false;
      handlers.get("fetch")({
        request: new Request(url, options),
        waitUntil: (promise) => pending.push(promise),
        respondWith: (promise) => { handled = true; response = promise; },
      });
      response = await response;
      await Promise.all(pending);
      return { handled, response };
    },
  };
}

async function seed(caches, name, url, text) {
  await (await caches.open(name)).put(url, new Response(text));
}

async function cachedText(caches, name, url) {
  return (await (await caches.open(name)).match(url))?.text();
}

test("the deployed shell version matches the newest CHANGELOG entry", () => {
  const match = changelog.match(/^## v(\d+\.\d+)/m);
  assert.ok(match, "CHANGELOG.md has no version heading");
  const { config } = worker();
  assert.equal(config.VERSION, `english-prep-v${match[1]}`);
  assert.ok(config.SHELL_CACHE.endsWith(config.VERSION));
  assert.equal(worker(originalSw, ORIGINAL).config.VERSION, "english-prep-v0.64");
});

test("each registration scope has separate shell and stable content caches", () => {
  const root = worker().config;
  const original = worker(originalSw, ORIGINAL).config;
  const other = worker(sw, "https://prep.example/another-app/").config;
  assert.equal(new Set([root.SHELL_CACHE, original.SHELL_CACHE, other.SHELL_CACHE]).size, 3);
  assert.equal(new Set([root.CONTENT, original.CONTENT, other.CONTENT]).size, 3);
  const nextVersion = root.VERSION.replace(/\d+$/, (minor) => Number(minor) + 1);
  const nextRelease = worker(sw.replace(JSON.stringify(root.VERSION), JSON.stringify(nextVersion))).config;
  assert.notEqual(nextRelease.SHELL_CACHE, root.SHELL_CACHE);
  assert.equal(nextRelease.CONTENT, root.CONTENT, "a release must retain downloaded content");
});

test("both workers can activate without deleting each other's or unrelated caches", async () => {
  const caches = memoryCaches();
  const root = worker(sw, ROOT, caches);
  const original = worker(originalSw, ORIGINAL, caches);
  const rootOld = `${root.config.SHELL_PREFIX}english-prep-v0.63`;
  const originalOld = `${original.config.SHELL_PREFIX}english-prep-v0.63`;
  const retained = [root.config.SHELL_CACHE, original.config.SHELL_CACHE,
    root.config.CONTENT, original.config.CONTENT, "unrelated-app-assets",
    "english-prep-content", "english-prep-v0.64"];
  for (const name of [...retained, rootOld, originalOld]) await caches.open(name);
  await root.dispatch("activate");
  assert.equal((await caches.keys()).includes(rootOld), false);
  assert.ok((await caches.keys()).includes(originalOld));
  for (const name of retained) assert.ok((await caches.keys()).includes(name), name);
  await original.dispatch("activate");
  assert.equal((await caches.keys()).includes(originalOld), false);
  for (const name of retained) assert.ok((await caches.keys()).includes(name), name);
  assert.equal(root.lifecycle.claimed, 1);
  assert.equal(original.lifecycle.claimed, 1);
});

test("activation migrates only its own legacy content and never overwrites newer data", async () => {
  const caches = memoryCaches();
  const root = worker(sw, ROOT, caches);
  const original = worker(originalSw, ORIGINAL, caches);
  const rootData = `${ROOT}data/topic.json`;
  const originalData = `${ORIGINAL}data/topic.json`;
  const otherData = "https://prep.example/unrelated/data/topic.json";
  await seed(caches, "english-prep-content", rootData, "root legacy lesson");
  await seed(caches, "english-prep-content", originalData, "original legacy lesson");
  await seed(caches, "english-prep-content", otherData, "other app lesson");
  await seed(caches, root.config.CONTENT, rootData, "newer root lesson");
  await root.dispatch("activate");
  await original.dispatch("activate");
  assert.equal(await cachedText(caches, root.config.CONTENT, rootData), "newer root lesson");
  assert.equal(await cachedText(caches, original.config.CONTENT, originalData), "original legacy lesson");
  assert.equal(await cachedText(caches, root.config.CONTENT, originalData), undefined);
  assert.equal(await cachedText(caches, original.config.CONTENT, rootData), undefined);
  assert.equal(await cachedText(caches, root.config.CONTENT, otherData), undefined);
  assert.equal((await (await caches.open("english-prep-content")).keys()).length, 3);
  assert.equal(await (await root.request(rootData)).response.text(), "newer root lesson");
  assert.equal(await (await original.request(originalData)).response.text(), "original legacy lesson");
});

test("legacy offline content remains available when migration hits storage quota", async () => {
  const caches = memoryCaches();
  const root = worker(sw, ROOT, caches);
  const url = `${ROOT}data/lesson.json`;
  await seed(caches, "english-prep-content", url, "saved lesson");
  caches.failWrites = true;
  await root.dispatch("activate");
  assert.equal(await cachedText(caches, root.config.CONTENT, url), undefined);
  assert.equal(await (await root.request(url)).response.text(), "saved lesson");
  assert.equal(root.lifecycle.claimed, 1);
});

test("shell requests use only the active scope's shell cache", async () => {
  const caches = memoryCaches();
  const root = worker(sw, ROOT, caches);
  const original = worker(originalSw, ORIGINAL, caches);
  const url = `${ROOT}index.html`;
  await seed(caches, original.config.SHELL_CACHE, url, "wrong copy");
  await seed(caches, "english-prep-v0.64", url, "old UI");
  root.setNetwork(async () => new Response("current network UI"));
  assert.equal(await (await root.request(url)).response.text(), "current network UI");
  assert.equal(await cachedText(caches, root.config.SHELL_CACHE, url), "current network UI");
  root.setNetwork(async () => { throw new Error("Offline"); });
  assert.equal(await (await root.request(url)).response.text(), "current network UI");
  assert.equal(await cachedText(caches, original.config.SHELL_CACHE, url), "wrong copy");
});

test("content is refreshed in its stable cache and shell entries are unaffected", async () => {
  const root = worker();
  const url = `${ROOT}data/topics.json`;
  await seed(root.caches, root.config.SHELL_CACHE, url, "old misplaced content");
  root.setNetwork(async () => new Response("updated topics"));
  assert.equal(await (await root.request(url)).response.text(), "updated topics");
  assert.equal(await cachedText(root.caches, root.config.CONTENT, url), "updated topics");
  assert.equal(await cachedText(root.caches, root.config.SHELL_CACHE, url), "old misplaced content");
});

test("server errors cannot overwrite saved lessons and quota does not hide live responses", async () => {
  const root = worker();
  const url = `${ROOT}data/topic.json`;
  await seed(root.caches, root.config.CONTENT, url, "saved lesson");
  root.setNetwork(async () => new Response("server error", { status: 500 }));
  assert.equal((await root.request(url)).response.status, 500);
  assert.equal(await cachedText(root.caches, root.config.CONTENT, url), "saved lesson");
  root.caches.failWrites = true;
  root.setNetwork(async () => new Response("live lesson"));
  assert.equal(await (await root.request(url)).response.text(), "live lesson");
  assert.equal(await cachedText(root.caches, root.config.CONTENT, url), "saved lesson");
});

test("workers ignore non-GET, foreign-origin, and outside-scope requests", async () => {
  const original = worker(originalSw, ORIGINAL);
  assert.equal((await original.request(`${ORIGINAL}index.html`, { method: "POST" })).handled, false);
  assert.equal((await original.request("https://elsewhere.example/data/topic.json")).handled, false);
  assert.equal((await original.request(`${ROOT}data/topic.json`)).handled, false);
});

test("installation precaches scope-relative assets before calling skipWaiting", async () => {
  for (const [source, scope] of [[sw, ROOT], [originalSw, ORIGINAL]]) {
    const app = worker(source, scope);
    await app.dispatch("install");
    assert.equal(app.lifecycle.skipped, 1);
    for (const path of app.config.SHELL) {
      assert.ok(await (await app.caches.open(app.config.SHELL_CACHE)).match(new URL(path, scope).href), path);
    }
  }
  const root = worker();
  assert.ok(root.config.SHELL.includes("./css/editorial.css"));
  assert.ok(root.config.SHELL.includes("./assets/fonts/InterVariable.woff2"));
});

test("About's study-loop captures are precached, so the page reads whole offline", async () => {
  const content = await readFile(new URL("../about/content.js", import.meta.url), "utf8");
  const captures = [...content.matchAll(/capture:\s*"([^"]+)"/g)].map((match) => match[1]);
  assert.ok(captures.length >= 3, `found ${captures.length} captures`);
  const { SHELL } = worker().config;
  for (const capture of captures) {
    assert.ok(SHELL.includes(`./about/assets/${capture}-phone.webp`), capture);
  }
});

test("a new release bypasses stale HTTP-cache assets while building its offline shell", async () => {
  const app = worker();
  await app.dispatch("install");
  assert.equal(app.caches.installRequests.length, app.config.SHELL.length);
  assert.ok(app.caches.installRequests.every((request) => request instanceof Request && request.cache === "reload"));
});

test("an incomplete shell installation never activates the new worker", async () => {
  const app = worker();
  app.caches.failInstall = true;
  await assert.rejects(app.dispatch("install"), /Missing shell asset/);
  assert.equal(app.lifecycle.skipped, 0);
});

test("the shell lists every module in js/", async () => {
  const modules = (await readdir(new URL("../js", import.meta.url)))
    .filter((name) => name.endsWith(".js")).sort();
  const shell = worker().config.SHELL;
  const missing = modules.filter((name) => !shell.includes(`./js/${name}`));
  assert.deepEqual(missing, [], `sw.js is missing modules needed offline: ${missing.join(", ")}`);
});
