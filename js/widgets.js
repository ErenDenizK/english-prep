// The small drawn objects that outlived UI 3 — a topic's hue, the
// learner's avatar and a haptic pulse — built the way everything here is
// built: nodes and textContent, never innerHTML. The ring, monogram
// builder, choice group and count-up went with phase 1 of the roadmap
// (no live caller; docs/STATE.md §6.3).

import { el } from "./dom.js";
import { icon } from "./icons.js";

/**
 * A topic's hue, from its id. Stable across sessions and devices — the
 * same topic is the same colour on every phone — and spread around the
 * wheel so neighbours in the list differ. Ten topics land ~36° apart.
 * @param {string} id
 */
export function hueOf(id) {
  let hash = 0;
  for (const char of id) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  // Golden-angle steps from the hash, which spreads clustered ids apart.
  return Math.round((hash % 360) * 1.0);
}

/**
 * The learner: their initial on the accent gradient, or the figure.
 * Turkish casing — "i" upper-cases to "İ".
 * @param {string} name
 * @param {{size?: "md"|"lg"}} [options]
 */
export function avatar(name, { size = "md" } = {}) {
  const node = el("span", `avatar${size === "lg" ? " avatar--lg" : ""}`);
  node.setAttribute("aria-hidden", "true");
  const trimmed = name.trim();
  if (trimmed) {
    node.textContent = trimmed[0].toLocaleUpperCase("tr");
  } else {
    node.appendChild(icon("user", { size: size === "lg" ? 36 : 20 }));
  }
  return node;
}

/**
 * One short pulse where the platform offers one. Android's Chrome does;
 * iOS ignores the call, which is fine — a haptic is a garnish.
 */
export function haptic() {
  try {
    navigator.vibrate?.(12);
  } catch {
    // Not available, or not allowed yet. Nothing to do.
  }
}
