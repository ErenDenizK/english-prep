// hex -> OKLCH / CIE L*, the inverse of tools/color.mjs's oklch().
// Same matrices, run backwards. Zero dependencies, like everything in tools/.

const gammaDecode = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

export function hexToRgb(hex) {
  let h = String(hex).trim().replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (h.length === 8) h = h.slice(0, 6);
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

/** sRGB hex -> {L,C,H} in OKLCH (L 0..1, H degrees 0..360). */
export function hexToOklch(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const [r, g, b] = rgb.map((v) => gammaDecode(v / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.hypot(A, B);
  let H = (Math.atan2(B, A) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { L, C, H: C < 0.0005 ? NaN : H };
}

/** sRGB hex -> CIE L* (0..100), the perceptual lightness the design docs use. */
export function hexToLstar(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const [r, g, b] = rgb.map((v) => gammaDecode(v / 255));
  const Y = 0.2126729 * r + 0.7151522 * g + 0.072175 * b;
  return Y <= 216 / 24389 ? Y * (24389 / 27) : Math.cbrt(Y) * 116 - 16;
}

/** CSS oklch(L% C H) / oklch(L C H) -> hex, via tools/color.mjs conventions. */
export function parseCssOklch(str) {
  const m = /oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)/.exec(str);
  if (!m) return null;
  const L = m[2] === "%" ? Number(m[1]) / 100 : Number(m[1]);
  return { L, C: Number(m[3]), H: Number(m[4]) };
}

export const round = (x, n = 3) => (Number.isFinite(x) ? Number(x.toFixed(n)) : null);
