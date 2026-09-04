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

test("activate deletes every cache that is not the current one", () => {
  // The half of the mechanism a bumped version depends on.
  assert.match(sw, /names\.filter\(\(name\) => name !== VERSION\)/);
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
