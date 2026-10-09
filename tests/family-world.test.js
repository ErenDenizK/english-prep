// docs/family/world.json is the portfolio's copy of this app's world. It is
// generated from the stylesheets, so a token change that forgets to
// regenerate it fails here rather than drifting silently into the embassy.
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { buildWorld, serialise, WORLD_PATH } from "../tools/make-world.mjs";

test("world.json matches the tokens it was generated from", async () => {
  const current = await readFile(WORLD_PATH, "utf8");
  assert.equal(current, serialise(buildWorld()), "run node tools/make-world.mjs");
});

