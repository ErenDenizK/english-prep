// docs/family/world.json is the portfolio's copy of this app's world, on the
// family kit's schema (docs/family/kit/world.schema.json). It is generated
// from the stylesheets, so a token change that forgets to regenerate it fails
// here rather than drifting silently into the embassy. The volatile fields
// (source commit, version, date; capture dates) are left out of the drift
// comparison: tools/make-world.mjs explains why.
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { buildWorld, serialise, stable, WORLD_PATH } from "../tools/make-world.mjs";
import { checkField } from "../docs/family/kit/light.js";

const world = JSON.parse(await readFile(WORLD_PATH, "utf8"));
const schema = JSON.parse(await readFile(new URL("../docs/family/kit/world.schema.json", import.meta.url), "utf8"));

/* A zero-dependency validator for the JSON Schema keywords the kit's schema
 * uses: type, const, enum, required, properties, additionalProperties: false,
 * items, minItems, maxItems, pattern, minimum, maximum, exclusiveMinimum,
 * format: date, oneOf and local $ref. Returns error strings ([] passes). */
function validate(value, node, path = "", root = node) {
  if (node.$ref) {
    const target = node.$ref.replace(/^#\//, "").split("/").reduce((at, key) => at[key], root);
    return validate(value, target, path, root);
  }
  const errors = [];
  const fail = (message) => errors.push(`${path || "/"}: ${message}`);
  if (node.oneOf) {
    const passing = node.oneOf.filter((option) => validate(value, option, path, root).length === 0).length;
    if (passing !== 1) fail(`matches ${passing} of oneOf, expected 1`);
  }
  if ("const" in node && value !== node.const) fail(`must be ${JSON.stringify(node.const)}`);
  if (node.enum && !node.enum.includes(value)) fail(`must be one of ${node.enum.join(", ")}`);
  if (node.type) {
    const actual = value === null ? "null" : Array.isArray(value) ? "array" : Number.isInteger(value) ? "integer" : typeof value;
    const ok = node.type === actual || (node.type === "number" && actual === "integer");
    if (!ok) return [...errors, `${path || "/"}: expected ${node.type}, got ${actual}`];
  }
  if (typeof value === "string") {
    if (node.pattern && !new RegExp(node.pattern).test(value)) fail(`"${value}" does not match ${node.pattern}`);
    if (node.format === "date" && !/^\d{4}-\d{2}-\d{2}$/.test(value)) fail(`"${value}" is not a date`);
  }
  if (typeof value === "number") {
    if (node.minimum !== undefined && value < node.minimum) fail(`${value} < ${node.minimum}`);
    if (node.maximum !== undefined && value > node.maximum) fail(`${value} > ${node.maximum}`);
    if (node.exclusiveMinimum !== undefined && value <= node.exclusiveMinimum) fail(`${value} <= ${node.exclusiveMinimum}`);
  }
  if (Array.isArray(value)) {
    if (node.minItems !== undefined && value.length < node.minItems) fail(`fewer than ${node.minItems} items`);
    if (node.maxItems !== undefined && value.length > node.maxItems) fail(`more than ${node.maxItems} items`);
    if (node.items) value.forEach((item, i) => errors.push(...validate(item, node.items, `${path}/${i}`, root)));
  } else if (value && typeof value === "object") {
    for (const key of node.required ?? []) if (!(key in value)) fail(`missing required "${key}"`);
    for (const [key, item] of Object.entries(value)) {
      if (node.properties?.[key]) errors.push(...validate(item, node.properties[key], `${path}/${key}`, root));
      else if (node.additionalProperties === false) fail(`unexpected key "${key}"`);
    }
  }
  return errors;
}

test("the mini validator catches what the schema forbids", () => {
  assert.deepEqual(validate(world, schema), []);
  const broken = structuredClone(world);
  broken.version = 2;
  broken.slug = "English Prep";
  broken.ground.base = "#FFF";
  broken.light.behaviour = "pulse";
  broken.motion.pop = { duration: 0.3, bounce: 0.9 };
  broken.captures[0].kind = "video";
  broken.extra = true;
  delete broken.promise.evidence;
  const errors = validate(broken, schema).join("\n");
  for (const where of ["/version", "/slug", "/ground/base", "/light/behaviour", "/motion/pop", "/captures/0/kind", "unexpected key \"extra\"", "\"evidence\""]) {
    assert.match(errors, new RegExp(where.replace(/[/"]/g, "\\$&")), `expected an error at ${where}`);
  }
});

test("world.json is valid on the family kit's schema", () => {
  assert.deepEqual(validate(world, schema), []);
});

test("world.json matches the tokens it was generated from", () => {
  assert.equal(serialise(stable(world)), serialise(stable(buildWorld())), "run node tools/make-world.mjs");
});

test("the light field passes the kit's checkField", () => {
  assert.deepEqual(checkField(world.light), []);
});

test("motion keeps the kit's role rules: settle never overshoots, press carries the release", () => {
  const zeta = ({ stiffness, damping }) => damping / (2 * Math.sqrt(stiffness));
  assert.ok(zeta(world.motion.settle) >= 0.85, "settle must not overshoot a surface (kit motion.md §2)");
  assert.ok(world.source.estimated.includes("/motion/press"), "the press spring is fitted to the release keyframes");
  assert.match(world.motion.note, /release is the spring/);
});

test("the promise is the line About ships, in Turkish", async () => {
  const about = await readFile(new URL("../about/index.html", import.meta.url), "utf8");
  assert.equal(world.promise.text, "Ücretsiz · Hesap yok · İlerlemen kendi tarayıcında");
  assert.ok(about.includes(`<p class="ab-quiet" data-reveal>${world.promise.text}</p>`));
  assert.equal(world.promise.lang, "tr");
});

test("captures follow the kit's file names, hero first", () => {
  assert.equal(world.captures[0].id, "egitim-wide");
  for (const capture of world.captures) {
    const [w, h] = capture.viewport;
    for (const file of capture.files) {
      assert.match(file, new RegExp(`^captures/english-prep-[a-z0-9-]+-${w}x${h}@${capture.dpr}x(-poster\\.png|\\.(av1|hevc|h264)\\.mp4|\\.png)$`));
    }
  }
  const signature = world.captures.filter((capture) => capture.kind === "signature");
  assert.equal(signature.length, 1);
  const suffixes = signature[0].files.map((file) => file.match(/(-poster\.png|\.\w+\.mp4)$/)?.[1]);
  assert.deepEqual(suffixes, ["-poster.png", ".av1.mp4", ".hevc.mp4", ".h264.mp4"], "poster first, then av1, hevc, h264");
});
