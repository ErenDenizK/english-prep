// The service worker's cache name is the app's whole cache-busting
// mechanism: `activate` deletes every cache that is not the current
// VERSION, so a changed VERSION is what makes a deploy reach a returning
// learner on their first open rather than their second.
//
// It sat at "english-prep-v1" across every deploy from the day it was
// written. Nothing was wrong with the code — the rule was "bump it in the
// same commit", and a rule like that is forgotten once and then stays
// forgotten. So the rule is a test.

import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const sw = await readFile(new URL("../sw.js", import.meta.url), "utf8");
const changelog = await readFile(new URL("../CHANGELOG.md", import.meta.url), "utf8");

/** The newest version heading, which is the first one in the file. */
function latestReleased() {
  const match = changelog.match(/^## v(\d+\.\d+)/m);
  assert.ok(match, "CHANGELOG.md has no `## vX.Y` heading");
  return match[1];
}

test("the cache name carries a version", () => {
  assert.match(sw, /const VERSION = "english-prep-v\d+\.\d+";/);
});

test("the cache name matches the newest CHANGELOG entry", () => {
  const [, version] = sw.match(/const VERSION = "english-prep-v(\d+\.\d+)";/);
  assert.equal(
    version,
    latestReleased(),
    "sw.js VERSION and CHANGELOG.md disagree — bump sw.js in the same commit, " +
      "or a returning learner keeps the old shell for one more open"
  );
});

test("activate deletes stale caches and keeps the content one", () => {
  // Both halves of the mechanism a bumped version depends on. The second
  // half is one release old: tying the cache name to the version made
  // activate delete the cache the topic files were in, so every deploy
  // wiped the learner's offline content. Content is unversioned now and
  // activate must keep it — a future tidy-up that folds it back into the
  // versioned cache fails here rather than in someone's metro tunnel.
  assert.match(sw, /name !== VERSION && name !== CONTENT/);
  assert.match(sw, /const CONTENT = "english-prep-content";/);
});

test("content is written to the content cache, not the versioned one", () => {
  const contentBranch = sw.slice(sw.indexOf("if (isContent)"), sw.indexOf("// Cache first"));
  assert.match(contentBranch, /caches\.open\(CONTENT\)/);
  assert.ok(
    !contentBranch.includes("caches.open(VERSION)"),
    "the content branch must not write into the versioned cache"
  );
});

test("the shell lists every module in js/", async () => {
  const { readdir } = await import("node:fs/promises");
  const modules = (await readdir(new URL("../js", import.meta.url)))
    .filter((name) => name.endsWith(".js"))
    .sort();
  const missing = modules.filter((name) => !sw.includes(`"./js/${name}"`));
  assert.deepEqual(
    missing,
    [],
    `sw.js does not pre-cache ${missing.join(", ")} — a bumped VERSION wipes the ` +
      "old cache, so an unlisted module is missing for anyone who goes offline first"
  );
});
