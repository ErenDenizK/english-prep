// Finite interface effects. State, focus and the final DOM belong to callers;
// this module never schedules an application mutation after an animation.
import { initMotion, motionEnabled } from "./motion.js";

export const MOTION_DURATIONS = Object.freeze({ control: 100, reveal: 160, route: 220, complete: 360 });
const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
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

function initialize() {
  initMotion();
  if (listening) return;
  listening = true;
  document.addEventListener("motion:change", (event) => {
    if (!event.detail.enabled || !event.detail.visible) stopAll();
  });
  window.addEventListener("pagehide", stopAll);
}

function timing(role) {
  const property = { control: "--d-control", reveal: "--d-reveal", route: "--d-route", complete: "--d-complete" }[role];
  const value = window.getComputedStyle?.(document.documentElement).getPropertyValue(property).trim();
  if (value && /^\d+(?:\.\d+)?m?s$/.test(value)) {
    return Number.parseFloat(value) * (value.endsWith("ms") ? 1 : 1000);
  }
  return MOTION_DURATIONS[role];
}

function preset(kind, direction) {
  switch (kind) {
    case "control": return { role: "control", frames: [{ transform: "scale(.98)" }, { transform: "scale(1)" }] };
    case "menu": return { role: "reveal", frames: [{ opacity: .86, transform: `translateY(${direction === "top" ? 3 : -3}px)` }, { opacity: 1, transform: "translateY(0)" }] };
    case "dialog": return { role: "route", frames: [{ transform: "translateY(4px)" }, { transform: "translateY(0)" }] };
    case "mark": return { role: "reveal", frames: [{ transform: "scale(.86)" }, { transform: "scale(1)" }] };
    case "scene": return { role: "route", frames: [{ transform: `translateX(${direction === "back" ? -6 : 6}px)` }, { transform: "translateX(0)" }] };
    case "complete": return { role: "complete", frames: [{ transform: "scale(.96)" }, { transform: "scale(1)" }] };
    default: return { role: "reveal", frames: [{ opacity: .88, transform: "translateY(3px)" }, { opacity: 1, transform: "translateY(0)" }] };
  }
}

/** Animate connected decoration after its final state is committed.
 * A repeated element/channel replaces its predecessor; detached nodes, reduced
 * motion and browsers without WAAPI simply show the final presentation.
 * @returns {Animation|null}
 */
export function animateElement(element, kind = "reveal", { channel = "default", direction = "forward" } = {}) {
  if (!element) return null;
  const current = channels.get(element)?.get(channel);
  if (current) cancel(current);
  if (!element.isConnected || typeof element.animate !== "function") return null;
  initialize();
  if (!canMove()) return null;
  const { role, frames } = preset(kind, direction);
  const animation = element.animate(frames, { duration: timing(role), easing: EASING, fill: "none" });
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
