// The About masthead is the one surface that blurs. It holds to the
// material contract (docs/PRINCIPLES.md §4): G2, a blur that never renders
// leaves the content behind unreadable (residual contrast <= 1.15:1), and
// G4, every still twin renders the solid page colour.
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { hexToRgb, wcagContrast } from "../tools/color.mjs";

const about = await readFile(new URL("../about/about.css", import.meta.url), "utf8");
const editorial = await readFile(new URL("../css/editorial.css", import.meta.url), "utf8");

/** The first `--name: #hex` inside the block that starts at `from`. */
function token(name, from) {
  const start = editorial.indexOf(from);
  assert.notEqual(start, -1, `editorial.css has ${from}`);
  const match = editorial.slice(start).match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, "i"));
  assert.ok(match, `--${name} after ${from}`);
  return match[1];
}

const THEMES = {
  dark: { page: token("page", ":root {"), ink: token("ink", ":root {") },
  light: { page: token("page", ":root:not([data-theme=\"dark\"])"), ink: token("ink", ":root:not([data-theme=\"dark\"])") },
};

const toHex = (rgb) => `#${rgb.map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;
/** A colour seen through a page-coloured tint of `alpha`, composited in sRGB. */
const under = (page, alpha, colour) =>
  toHex(hexToRgb(page).map((c, i) => alpha * c + (1 - alpha) * hexToRgb(colour)[i]));

const masthead = /\.ab-masthead\[data-scrolled="true"\]\s*\{([^}]*)\}/g;
const rules = [...about.matchAll(masthead)].map((match) => ({ body: match[1], at: match.index }));

test("the masthead tint keeps an unrendered blur unreadable (G2)", () => {
  const glass = rules.find((rule) => /backdrop-filter/.test(rule.body) && !/none/.test(rule.body));
  assert.ok(glass, "a blurred masthead rule exists");
  const alpha = Number(glass.body.match(/color-mix\(in srgb, var\(--page\) (\d+(?:\.\d+)?)%, transparent\)/)[1]) / 100;
  assert.ok(alpha >= 0.93, `tint alpha ${alpha} >= 0.93`);
  for (const [theme, { page, ink }] of Object.entries(THEMES)) {
    for (const [a, b] of [[ink, page], ["#ffffff", "#000000"]]) {
      const residual = wcagContrast(under(page, alpha, a), under(page, alpha, b));
      assert.ok(residual <= 1.15, `${theme}: ${a} vs ${b} under ${alpha} leaves ${residual.toFixed(3)}:1`);
    }
  }
});

test("the blur is guarded and has solid twins (G4)", () => {
  const supports = about.indexOf("@supports ((backdrop-filter");
  assert.notEqual(supports, -1, "backdrop-filter sits behind @supports");
  for (const rule of rules) {
    if (/backdrop-filter:\s*blur/.test(rule.body)) assert.ok(rule.at > supports, "every blur is inside @supports");
  }
  assert.doesNotMatch(about, /saturate\(/, "no colour shift on chrome");
  const twin = about.match(/@media \(prefers-reduced-transparency: reduce\), \(prefers-contrast: more\), \(forced-colors: active\)\s*\{([^]*?)\n\}/);
  assert.ok(twin, "one solid twin for reduced transparency, more contrast and forced colours");
  assert.match(twin[1], /background: var\(--page\);/);
  assert.match(twin[1], /backdrop-filter: none;/);
  assert.ok(twin.index > supports, "the twin comes after the blur, so it wins");
});
