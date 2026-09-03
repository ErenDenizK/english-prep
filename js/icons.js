// The icon set. Hand-drawn, to the contract in docs/design-system.md §6 —
// which is binding, because a hand-built set decays within a dozen icons
// without one. If you are adding the thirteenth icon, draw it to this:
//
//   canvas        viewBox="0 0 24 24"
//   live area     20 × 20, centred — every path coordinate inside 2…22
//   padding       2 on every side; this is the budget the ink bleeds into
//   stroke        2, currentColor, fill none, caps and joins round
//   corner radius 2 on rectangular forms
//   min gap       2 between distinct elements, measured ink to ink
//                 (an arrowhead is part of its shaft, not a distinct element)
//
// The 2-unit padding exists so shapes can be optically corrected rather
// than mathematically equal: circles and diamonds are drawn slightly
// larger than squares to *look* the same size, triangles slightly smaller.
// `target` is the extreme case — an r=10 circle sits exactly on the live
// area edge, next to `check-square`'s 18-unit box, and the two read alike.
//
// Two rules that are easy to break by accident:
//
//   1. No per-path stroke-width, ever. The shared attributes below are set
//      once on the <svg>; a path that overrides them is the thing that
//      makes a set look homemade.
//   2. Stroke width is absolute, not scaled (§6). `size` exists because
//      call sites need it, but rendering 24px geometry at 20px turns the
//      2-unit stroke into 1.67 and the whole set goes soft. Prefer 24, or
//      redraw at the size you actually need.
//
// Filled variants exist for the two bottom-nav destinations only, because
// the selected state must survive greyscale and forced-colors — fill
// changes visual mass, hue does not. They are the same drawing as their
// outlines, not a heavier stroke: the silhouette is identical and the
// internal separation is simply widened by 2 so it survives being stroked.
//
// No innerHTML here, same as everywhere else in js/ — nodes are built with
// createElementNS and attributes set one at a time.

const SVG_NS = "http://www.w3.org/2000/svg";

const DEFAULT_SIZE = 24;

/** Set once on every <svg>; never repeated or overridden on a child. */
const ROOT_ATTRS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  focusable: "false",
};

const FILLED = { fill: "currentColor" };

/**
 * Each icon is a list of [tag, attributes] pairs. Coordinate extremes are
 * noted so the next drawing can be matched to the set's visual mass rather
 * than to whatever felt right on the day.
 */
const ICONS = {
  // An open book, spine centred. x 3…21, y 5…19.
  book: [
    ["path", { d: "M3 7a2 2 0 0 1 2-2h3l4 2v12l-4-2H5a2 2 0 0 1-2-2z" }],
    ["path", { d: "M21 7a2 2 0 0 0-2-2h-3l-4 2v12l4-2h3a2 2 0 0 0 2-2z" }],
  ],

  // Same book, pages filled and pulled 2 off the spine each side, so the
  // 2-unit stroke does not close the gap that makes it read as *open*.
  // Silhouette matches the outline exactly: x 2…22, y 4…20 of ink.
  "book-fill": [
    ["path", { d: "M3 7a2 2 0 0 1 2-2h2l3 2v12l-3-2H5a2 2 0 0 1-2-2z", ...FILLED }],
    ["path", { d: "M21 7a2 2 0 0 0-2-2h-2l-3 2v12l3-2h2a2 2 0 0 0 2-2z", ...FILLED }],
  ],

  // Checkable document. 18-unit box, r2; check inset 5 from every edge.
  "check-square": [
    ["path", { d: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" }],
    ["path", { d: "m8 12 3 3 5-6" }],
  ],

  // The box filled, the check knocked out of it with fill-rule evenodd.
  // The hole is the outline check's own stroke, offset to half-width 2:
  // stroking this path at 2 paints 1 unit back in from each side, leaving
  // a 2-wide void — i.e. pixel-for-pixel the outline check, inverted.
  // Redraw the outline check and this has to be re-offset with it.
  "check-square-fill": [
    [
      "path",
      {
        d:
          "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" +
          "M9.414 10.586 10.866 12.037 14.464 7.72" +
          "A2 2 0 0 1 17.536 10.28L12.536 16.28" +
          "A2 2 0 0 1 9.586 16.414L6.586 13.414" +
          "A2 2 0 0 1 9.414 10.586Z",
        "fill-rule": "evenodd",
        ...FILLED,
      },
    ],
  ],

  // Head r4 at y7, shoulders a 5-radius sweep off y15 — a 4-unit centreline
  // gap, so the ink clears by 2. x 4…20, y 3…21.
  user: [
    ["circle", { cx: "12", cy: "7", r: "4" }],
    ["path", { d: "M4 21v-1a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v1" }],
  ],

  // Shaft 16, head 7 deep and 7 either side. x 4…20, y 5…19.
  "arrow-left": [
    ["path", { d: "M20 12H4" }],
    ["path", { d: "m11 5-7 7 7 7" }],
  ],

  "arrow-right": [
    ["path", { d: "M4 12h16" }],
    ["path", { d: "m13 5 7 7-7 7" }],
  ],

  // Standalone correct-answer tick, larger than the one inside check-square.
  // x 4…20, y 6…18.
  check: [["path", { d: "m4 12 6 6L20 6" }]],

  // Diagonals overshoot a square's 18 by design: 14 × 14 spans 19.8 corner
  // to corner, which is what makes it sit level with check-square.
  close: [["path", { d: "m5 5 14 14M19 5 5 19" }]],

  // Deliberately lighter than the destination icons — a chevron is an
  // affordance on a row, not a thing you look at. x 6…18, y 9…15.
  "chevron-down": [["path", { d: "m6 9 6 6 6-6" }]],

  "chevron-right": [["path", { d: "m9 6 6 6-6 6" }]],

  // Axis plus three bars at 4 spacing (2 of ink between each), bars stopping
  // 4 short of the baseline. x 4…20, y 4…20.
  "bar-chart": [
    ["path", { d: "M4 4v16h16" }],
    ["path", { d: "M8 16v-3" }],
    ["path", { d: "M12 16V9" }],
    ["path", { d: "M16 16V5" }],
  ],

  // Three quarters of an r8 circle, open at the top right, with a chevron
  // head on the tangent at 12 o'clock. The circle sits at y13 rather than
  // y12 so the head has room above it without leaving the live area.
  refresh: [
    ["path", { d: "M20 13A8 8 0 1 1 12 5" }],
    ["path", { d: "m9 2 3 3-3 3" }],
  ],

  // r 10 / 6 / 2 is the only set of three concentric rings that fits the
  // live area and still keeps 2 of ink between each. Do not adjust.
  target: [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["circle", { cx: "12", cy: "12", r: "6" }],
    ["circle", { cx: "12", cy: "12", r: "2" }],
  ],
};

/** Every name `icon()` will accept, in drawing order. */
export const ICON_NAMES = Object.keys(ICONS);

/**
 * Builds one icon.
 *
 * Decorative by default (`aria-hidden="true"`), because in this app an icon
 * sits beside a visible label and the label is what names the control. An
 * icon-only control is labelled with `aria-label` on the *button*, not
 * here — see §6. `title` is the narrow exception: an icon that carries
 * meaning nothing else on screen carries.
 *
 * @param {string} name One of ICON_NAMES.
 * @param {{ size?: number, title?: string }} [options]
 *   size  — width and height in CSS px, default 24. See the note at the top
 *           of this file before passing anything else.
 *   title — accessible name; makes the svg `role="img"` instead of hidden.
 * @returns {SVGElement}
 */
export function icon(name, options = {}) {
  const parts = Object.prototype.hasOwnProperty.call(ICONS, name) ? ICONS[name] : null;
  if (!parts) {
    throw new Error(
      `icon(): unknown icon "${name}". Available: ${ICON_NAMES.join(", ")}`,
    );
  }

  const size = options.size === undefined ? DEFAULT_SIZE : options.size;
  const svg = document.createElementNS(SVG_NS, "svg");

  Object.entries(ROOT_ATTRS).forEach(([attr, value]) => {
    svg.setAttribute(attr, value);
  });
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));

  if (options.title) {
    svg.setAttribute("role", "img");
    const title = document.createElementNS(SVG_NS, "title");
    title.textContent = options.title;
    svg.appendChild(title);
  } else {
    svg.setAttribute("aria-hidden", "true");
  }

  parts.forEach(([tag, attrs]) => {
    const node = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([attr, value]) => {
      node.setAttribute(attr, String(value));
    });
    svg.appendChild(node);
  });

  return svg;
}
