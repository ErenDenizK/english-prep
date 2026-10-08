// One motion preference across the app, tutorial and portfolio. The OS request
// always wins; hidden pages pause their decoration without changing the choice.
import { el } from "./dom.js";
import { icon } from "./icons.js";

const STORAGE_KEY = "englishPrep.motion";
let preferred = true;
let media = null;
let cleanup = null;

function ensureAmbient() {
  if (!document.body || document.querySelector(".ambient")) return;
  const ambient = el("div", "ambient");
  ambient.setAttribute("aria-hidden", "true");
  // The parent opacity caps the COMPOSITED group, not each of these nine
  // layers. Every local cluster visits all three pigments; overlap cannot
  // accumulate past the audited group envelope. CSS owns the idle timelines.
  for (const corner of ["north", "east", "south"]) {
    const field = el("span", `ambient__field ambient__field--${corner}`);
    for (const tone of ["cherry", "iris", "lagoon"]) {
      field.appendChild(el("span", `ambient__pigment ambient__pigment--${tone}`));
    }
    ambient.appendChild(field);
  }
  // One wall clock for every document: the aurora keeps its phase across a
  // page navigation instead of restarting its colors behind the new page.
  ambient.style?.setProperty?.("--aura-clock", `${Date.now() % 86_400_000}ms`);
  document.body.prepend(ambient);
}

function readPreference() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

/** Effective preference, independent of visibility so a hidden tab does not
 * rewrite the learner's choice. Scripted effects should also check hidden. */
export function motionEnabled() {
  return preferred && !media?.matches;
}

function paintControl(button) {
  const enabled = motionEnabled();
  const reduced = Boolean(media?.matches);
  button.setAttribute("aria-pressed", String(enabled));
  button.setAttribute("aria-disabled", String(reduced));
  button.dataset.systemReduced = String(reduced);
  button.title = reduced
    ? "Hareket, cihazının azaltılmış hareket ayarı nedeniyle kapalı."
    : enabled ? "Hareketi durdur" : "Hareketi aç";
  const glyph = button.querySelector(".motion-control__icon");
  glyph?.replaceChildren(icon(enabled ? "pause" : "play", { size: 20 }));
  const label = button.querySelector(".motion-control__label");
  if (label) label.textContent = reduced ? "Sistem: azaltılmış" : enabled ? "Açık" : "Kapalı";
}

function paint() {
  const enabled = motionEnabled();
  const visible = !document.hidden;
  for (const node of [document.documentElement, document.body]) {
    if (!node) continue;
    node.dataset.motion = enabled ? "on" : "off";
    node.dataset.pageVisible = String(visible);
  }
  // Looking up connected controls avoids keeping detached Profile/tutorial
  // buttons alive after a route change. New controls paint when constructed.
  for (const button of document.querySelectorAll("[data-motion-control]")) {
    paintControl(button);
  }
  document.dispatchEvent(new CustomEvent("motion:change", {
    detail: { enabled, visible, systemReduced: Boolean(media?.matches) },
  }));
}

/** Idempotent initialization; returns a cleanup function for isolated hosts. */
export function initMotion() {
  if (cleanup) {
    ensureAmbient();
    return cleanup;
  }
  ensureAmbient();
  preferred = readPreference();
  media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const changed = () => paint();
  const stored = (event) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    // A storage event provides the new value even when reads are restricted.
    preferred = event.key === null || event.newValue !== "off";
    paint();
  };
  media.addEventListener("change", changed);
  document.addEventListener("visibilitychange", changed);
  window.addEventListener("storage", stored);
  cleanup = () => {
    media.removeEventListener("change", changed);
    document.removeEventListener("visibilitychange", changed);
    window.removeEventListener("storage", stored);
    cleanup = null;
  };
  paint();
  return cleanup;
}

export function setMotionEnabled(enabled) {
  initMotion();
  preferred = Boolean(enabled);
  try {
    localStorage.setItem(STORAGE_KEY, preferred ? "on" : "off");
  } catch {
    // Current-session controls still work if the browser cannot persist data.
  }
  paint();
}

/** A stable-name toggle: aria-pressed describes whether motion is enabled;
 * the native tooltip explains the action. No route or reading state changes. */
export function createMotionControl({ compact = false } = {}) {
  initMotion();
  const button = el("button", `btn btn--quiet motion-control${compact ? " motion-control--compact" : ""}`);
  button.type = "button";
  button.dataset.motionControl = "";
  button.setAttribute("aria-label", "Hareket");
  button.appendChild(el("span", "motion-control__icon"));
  if (!compact) button.appendChild(el("span", "motion-control__label"));
  button.addEventListener("click", () => {
    if (!media.matches) setMotionEnabled(!preferred);
  });
  paintControl(button);
  return button;
}

if (typeof document !== "undefined" && typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMotion, { once: true });
  } else {
    initMotion();
  }
}
