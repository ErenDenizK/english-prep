import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const stylesheet = await readFile(new URL("../css/editorial.css", import.meta.url), "utf8");
const checker = fileURLToPath(new URL("../tools/editorial-palette.mjs", import.meta.url));

// A readable check/cross must not hide an unreadable answer boundary. These
// negative fixtures catch that omission in the production palette validator.
for (const state of ["ok", "no"]) {
  test(`palette validator rejects a ${state} boundary that disappears into its fill`, async (t) => {
    const directory = await mkdtemp(join(tmpdir(), "english-prep-answer-palette-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const fill = stylesheet.match(new RegExp(`--${state}-tint:\\s*(#[0-9a-f]{6})`, "i"))[1];
    const invisibleBoundary = stylesheet.replace(
      new RegExp(`(--${state}-edge:\\s*)#[0-9a-f]{6}`, "i"), `$1${fill}`);
    const fixture = join(directory, "invisible-boundary.css");
    await writeFile(fixture, invisibleBoundary);
    const result = spawnSync(process.execPath, [checker, fixture], { encoding: "utf8" });
    assert.equal(result.status, 1);
    assert.match(result.stderr, new RegExp(`FAIL dark --${state}-edge on --${state}-tint: 1\\.00:1`));
  });
}
