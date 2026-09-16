#!/usr/bin/env node
// Colour maths for the design system: OKLCH -> sRGB, WCAG 2 contrast, and
// APCA lightness contrast (Lc). Zero dependencies, same as everything else
// in tools/.
//
// Why both contrast models: WCAG 2 is the legal benchmark, but its formula
// is known to overestimate contrast for very dark colours — by 200-250% at
// the near-black end, per APCA's author. On a dark-only app that error lands
// exactly where the whole interface lives, so every token is checked against
// both and has to satisfy both.

/* ---- OKLCH -> sRGB ---- */

const clamp01 = (x) => Math.min(1, Math.max(0, x));

function gammaEncode(c) {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

function gammaDecode(c) {
  // WCAG switched this threshold from 0.03928 to 0.04045 in 2021 to match
  // the IEC sRGB standard; no practical difference at 8-bit depth.
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * @param {number} L 0..1
 * @param {number} C chroma, 0..~0.37 in sRGB
 * @param {number} H hue in degrees
 * @returns {{hex: string, rgb: number[], inGamut: boolean}}
 */
export function oklch(L, C, H) {
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  const linear = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  // Out of gamut means the browser will clip it; worth knowing rather than
  // silently shipping a colour that isn't the one that was designed.
  const inGamut = linear.every((c) => c >= -0.0001 && c <= 1.0001);
  const rgb = linear.map((c) => Math.round(clamp01(gammaEncode(clamp01(c))) * 255));
  const hex = "#" + rgb.map((c) => c.toString(16).padStart(2, "0")).join("").toUpperCase();
  return { hex, rgb, inGamut };
}

export function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

/* ---- WCAG 2 ---- */

function relativeLuminance([r, g, b]) {
  const [R, G, B] = [r, g, b].map((c) => gammaDecode(c / 255));
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/** @returns {number} contrast ratio, 1..21 */
export function wcagContrast(fg, bg) {
  const a = relativeLuminance(typeof fg === "string" ? hexToRgb(fg) : fg);
  const b = relativeLuminance(typeof bg === "string" ? hexToRgb(bg) : bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/* ---- APCA (constants from the reference implementation, apca-w3) ---- */

const MAIN_TRC = 2.4;
const S_RCO = 0.2126729, S_GCO = 0.7151522, S_BCO = 0.072175;
const NORM_BG = 0.56, NORM_TXT = 0.57, REV_BG = 0.65, REV_TXT = 0.62;
const BLK_THRS = 0.022, BLK_CLMP = 1.414;
const SCALE_BOW = 1.14, SCALE_WOB = 1.14;
const LO_BOW_OFFSET = 0.027, LO_WOB_OFFSET = 0.027;
const DELTA_Y_MIN = 0.0005, LO_CLIP = 0.1;

const apcaY = ([r, g, b]) =>
  S_RCO * (r / 255) ** MAIN_TRC + S_GCO * (g / 255) ** MAIN_TRC + S_BCO * (b / 255) ** MAIN_TRC;

const softClamp = (y) => (y > BLK_THRS ? y : y + (BLK_THRS - y) ** BLK_CLMP);

/**
 * @returns {number} Lc. Negative means light text on a dark background,
 *   which is this app's only case; magnitude is what the thresholds use.
 */
export function apca(text, bg) {
  const yTxt = softClamp(apcaY(typeof text === "string" ? hexToRgb(text) : text));
  const yBg = softClamp(apcaY(typeof bg === "string" ? hexToRgb(bg) : bg));
  if (Math.abs(yBg - yTxt) < DELTA_Y_MIN) return 0;

  let output;
  if (yBg > yTxt) {
    output = (yBg ** NORM_BG - yTxt ** NORM_TXT) * SCALE_BOW;
    output = output < LO_CLIP ? 0 : output - LO_BOW_OFFSET;
  } else {
    output = (yBg ** REV_BG - yTxt ** REV_TXT) * SCALE_WOB;
    output = output > -LO_CLIP ? 0 : output + LO_WOB_OFFSET;
  }
  return output * 100;
}

/* ---- Thresholds, for reporting ---- */

export const WCAG = { bodyAA: 4.5, bodyAAA: 7, largeAA: 3, uiComponent: 3 };
export const APCA_LC = { bodyPreferred: 90, bodyMinimum: 75, fluent: 60, large: 45, anyText: 30, nonText: 15 };
