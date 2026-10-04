// Finite interface effects. State, focus and the final DOM belong to callers;
// this module never schedules an application mutation after an animation.
import { initMotion, motionEnabled } from "./motion.js";

export const MOTION_DURATIONS = Object.freeze({
  control: 100, reveal: 220, route: 360, scene: 560, complete: 720, story: 900,
});
const EASING = "cubic-bezier(0.2, 0, 0, 1)";
const SETTLE = "cubic-bezier(0.22, 1, 0.36, 1)";
const MAX_SEQUENCE_DELAY = 180;
const active = new Set();
const channels = new WeakMap();
const pointerScenes = new Set();
let listening = false;

function canMove() {
  return motionEnabled() && !document.hidden;
}

function forget(record) {
  active.delete(record);
  const map = channels.get(record.element);
  if (map?.get(record.channel) === record) map.delete(record.channel);
}

function cancel(record) {
  forget(record);
  record.animation.cancel();
}

function stopAll() {
  for (const record of [...active]) cancel(record);
  for (const scene of pointerScenes) scene.reset();
}

// Real input takes priority over an arriving container. Settle only the
// animated target/ancestors before focus scrolling or popup positioning reads
// their geometry; independent artwork siblings keep their expressive sequence.
function settleInputAncestors(event) {
  const target = event.target;
  if (!target) return;
  for (const record of [...active]) {
    if (record.element === target || record.element.contains(target)) cancel(record);
  }
}

function initialize() {
  initMotion();
  if (listening) return;
  listening = true;
  document.addEventListener("motion:change", (event) => {
    if (!event.detail.enabled || !event.detail.visible) stopAll();
  });
  window.addEventListener("pagehide", stopAll);
  document.addEventListener("pointerdown", settleInputAncestors, true);
  document.addEventListener("focusin", settleInputAncestors, true);
}

function timing(role) {
  const property = `--d-${role}`;
  const value = window.getComputedStyle?.(document.documentElement).getPropertyValue(property).trim();
  if (value && /^\d+(?:\.\d+)?m?s$/.test(value)) {
    return Number.parseFloat(value) * (value.endsWith("ms") ? 1 : 1000);
  }
  return MOTION_DURATIONS[role];
}

function preset(kind, direction) {
  const sign = direction === "back" ? -1 : 1;
  switch (kind) {
    // Productive motion: no overshoot or scaling of a reading surface.
    case "control": return { role: "control", frames: [{ transform: "scale(.975)" }, { transform: "scale(1)" }] };
    case "menu": return { role: "reveal", frames: [{ transform: `translateY(${direction === "top" ? 8 : -8}px)` }, { transform: "translateY(0)" }] };
    case "dialog": return { role: "route", frames: [{ transform: "translateY(12px)" }, { transform: "translateY(0)" }] };
    case "route": return { role: "route", frames: [{ transform: `translateX(${sign * 12}px)` }, { transform: "translateX(0)" }] };
    case "onboard": return { role: "scene", frames: [{ transform: `translateX(${sign * 12}px)` }, { transform: "translateX(0)" }] };
    // Expressive motion belongs to artwork and small glyphs, never answer text.
    // Explicit finite keyframes give a spring-like settle without an idle solver
    // or a dependence on linear() easing support in the browser.
    case "mark": return {
      role: "route", easing: "linear", frames: [
        { transform: "scale(.78) rotate(-8deg)", offset: 0, easing: SETTLE },
        { transform: "scale(1.055) rotate(2deg)", offset: .68, easing: EASING },
        { transform: "scale(1) rotate(0deg)", offset: 1 },
      ],
    };
    case "scene": return {
      role: "scene", easing: "linear", frames: [
        { transform: `translateX(${sign * 20}px) translateY(4px) scale(.985)`, offset: 0, easing: SETTLE },
        { transform: `translateX(${-sign}px) translateY(0) scale(1.008)`, offset: .72, easing: EASING },
        { transform: "translateX(0) translateY(0) scale(1)", offset: 1 },
      ],
    };
    case "complete": return {
      role: "complete", easing: "linear", frames: [
        { transform: "scale(.84) rotate(-6deg)", offset: 0, easing: SETTLE },
        { transform: "scale(1.045) rotate(1deg)", offset: .68, easing: EASING },
        { transform: "scale(1) rotate(0deg)", offset: 1 },
      ],
    };
    case "story":
    case "storytelling": return {
      role: "story", easing: "linear", frames: [
        { transform: "translateY(24px) scale(.96) rotate(-2deg)", offset: 0, easing: SETTLE },
        { transform: "translateY(-2px) scale(1.008) rotate(.2deg)", offset: .74, easing: EASING },
        { transform: "translateY(0) scale(1) rotate(0deg)", offset: 1 },
      ],
    };
    // A caller gives decorative paths pathLength=1 and a complete static stroke.
    // The real diagram, score and text never depend on the animated drawing.
    case "draw": return { role: "complete", frames: [{ strokeDasharray: "1", strokeDashoffset: "1" }, { strokeDasharray: "1", strokeDashoffset: "0" }] };
    case "progress": return { role: "complete", frames: [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }] };
    case "rule": return { role: "scene", frames: [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }] };
    default: return { role: "reveal", frames: [{ transform: "translateY(8px)" }, { transform: "translateY(0)" }] };
  }
}

/** Animate connected decoration after its final state is committed.
 * A repeated element/channel replaces its predecessor; detached nodes, reduced
 * motion and browsers without WAAPI simply show the final presentation.
 * Delays are presentation-only and bounded: no timer or application callback.
 * @returns {Animation|null}
 */
export function animateElement(element, kind = "reveal", { channel = "default", direction = "forward", delay = 0 } = {}) {
  if (!element) return null;
  const current = channels.get(element)?.get(channel);
  if (current) cancel(current);
  if (!element.isConnected || typeof element.animate !== "function") return null;
  initialize();
  if (!canMove()) return null;
  const { role, frames, easing = EASING } = preset(kind, direction);
  const wait = Math.min(MAX_SEQUENCE_DELAY, Math.max(0, Number(delay) || 0));
  const animation = element.animate(frames, {
    duration: timing(role), delay: wait, easing,
    // Delayed decoration holds its first frame; text stays fully opaque and
    // interactive throughout. On finish/cancel the authored final CSS wins.
    fill: wait ? "backwards" : "none",
  });
  const record = { element, channel, animation };
  let map = channels.get(element);
  if (!map) channels.set(element, (map = new Map()));
  map.set(channel, record);
  active.add(record);
  // cancel() rejects finished with AbortError: handle both outcomes and never
  // leave a finished animation or detached element in the active collection.
  animation.finished.then(() => forget(record), () => forget(record));
  return animation;
}

/** A small, interruptible composition. Entries use { element, kind, at };
 * at is milliseconds from this call, capped at 180. No content is inserted,
 * hidden or changed later. Call cancelAnimationsWithin before replacing a scene
 * to release outgoing entries that the next sequence no longer includes.
 * @returns {Animation[]}
 */
export function animateSequence(entries, { channel = "sequence", direction = "forward" } = {}) {
  const animations = [];
  for (const entry of entries ?? []) {
    if (!entry?.element) continue;
    const animation = animateElement(entry.element, entry.kind ?? "reveal", {
      channel, direction, delay: entry.at,
    });
    if (animation) animations.push(animation);
  }
  return animations;
}

/** Release outgoing finite effects immediately before closing or replacing UI. */
export function cancelAnimationsWithin(container) {
  if (!container) return;
  for (const record of [...active]) {
    if (record.element === container || container.contains(record.element)) cancel(record);
  }
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/** Optional fine-pointer scene, never a reading-text effect.
 * The target receives CSS variables only; the caller chooses a decorative
 * layer that may use them. Touch/keyboard retain the complete static scene.
 * No pointer capture, scroll interception or idle animation loop is used.
 * @returns {() => void} Call when the scene is removed.
 */
export function bindPointerScene(element, { target = element, maxTilt = 2, maxShift = 6 } = {}) {
  initialize();
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  const tilt = clamp(Number(maxTilt) || 0, 0, 2);
  const shift = clamp(Number(maxShift) || 0, 0, 8);
  let frame = null;
  let point = null;
  let disposed = false;

  function reset() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    point = null;
    target.dataset.sceneActive = "false";
    for (const axis of ["x", "y"]) {
      target.style.setProperty(`--scene-rotate-${axis}`, "0deg");
      target.style.setProperty(`--scene-shift-${axis}`, "0px");
      target.style.setProperty(`--scene-pointer-${axis}`, "50%");
    }
  }

  function update() {
    frame = null;
    if (disposed || !point || !element.isConnected || !target.isConnected || !fine.matches || !canMove()) {
      reset();
      return;
    }
    const bounds = element.getBoundingClientRect();
    if (!bounds.width || !bounds.height) { reset(); return; }
    const x = clamp((point.x - bounds.left) / bounds.width, 0, 1);
    const y = clamp((point.y - bounds.top) / bounds.height, 0, 1);
    target.dataset.sceneActive = "true";
    target.style.setProperty("--scene-rotate-x", `${((.5 - y) * tilt * 2).toFixed(3)}deg`);
    target.style.setProperty("--scene-rotate-y", `${((x - .5) * tilt * 2).toFixed(3)}deg`);
    target.style.setProperty("--scene-shift-x", `${((x - .5) * shift * 2).toFixed(3)}px`);
    target.style.setProperty("--scene-shift-y", `${((y - .5) * shift * 2).toFixed(3)}px`);
    target.style.setProperty("--scene-pointer-x", `${(x * 100).toFixed(2)}%`);
    target.style.setProperty("--scene-pointer-y", `${(y * 100).toFixed(2)}%`);
  }

  function moved(event) {
    if (disposed || event.pointerType === "touch" || !fine.matches || !canMove()) return;
    point = { x: event.clientX, y: event.clientY };
    if (frame === null) frame = requestAnimationFrame(update);
  }

  const scene = { reset };
  pointerScenes.add(scene);
  element.addEventListener("pointermove", moved, { passive: true });
  element.addEventListener("pointerleave", reset);
  element.addEventListener("pointercancel", reset);
  window.addEventListener("blur", reset);
  fine.addEventListener("change", reset);
  reset();
  return () => {
    if (disposed) return;
    disposed = true;
    reset();
    pointerScenes.delete(scene);
    element.removeEventListener("pointermove", moved);
    element.removeEventListener("pointerleave", reset);
    element.removeEventListener("pointercancel", reset);
    window.removeEventListener("blur", reset);
    fine.removeEventListener("change", reset);
  };
}
