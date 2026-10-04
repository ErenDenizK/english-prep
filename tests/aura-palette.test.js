import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const stylesheet = await readFile(new URL("../css/editorial.css", import.meta.url), "utf8");
const checker = fileURLToPath(new URL("../tools/editorial-palette.mjs", import.meta.url));

// Numerical endpoints alone are insufficient if someone changes how the
// nine crossfading layers compose. Keep the continuous proof tied to CSS.
for (const [name, mutation, expected] of [
  ["missing group cap", css => css.replace("opacity: var(--aurora-opacity);", "opacity: 1;"), /one group opacity cap/],
  ["unmeasured hue rotation", css => css.replace("isolation: isolate;", "isolation: isolate; filter: hue-rotate(90deg);"), /Unaudited ambient blend/],
  ["unreadable strong atmosphere", css => css.replace("--aurora-opacity: .42;", "--aurora-opacity: .95;"), /FAIL dark/],
]) {
  test(`aura validator rejects ${name}`, async (t) => {
    const directory = await mkdtemp(join(tmpdir(), "english-prep-aura-"));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const fixture = join(directory, "invalid-aura.css");
    await writeFile(fixture, mutation(stylesheet));
    const result = spawnSync(process.execPath, [checker, fixture], { encoding: "utf8" });
    assert.equal(result.status, 1);
    assert.match(result.stderr, expected);
  });
}
