// Finite interface effects. State, focus and the final DOM belong to callers;
// this module never schedules an application mutation after an animation.
import { initMotion, motionEnabled } from "./motion.js";

export const MOTION_DURATIONS = Object.freeze({
  control: 100, reveal: 220, route: 360, release: 380, scene: 560, complete: 720, story: 900, flow: 1100,
});
const EASING = "cubic-bezier(0.2, 0, 0, 1)";
const SETTLE = "cubic-bezier(0.22, 1, 0.36, 1)";
// Compositions may stagger further than a single cue; still bounded, still
// presentation only. A part that has not started yet is visible as its first
// keyframe and is released by real input like every other entry.
const MAX_SEQUENCE_DELAY = 360;

/* ---- Springs (v0.76) ----
 * A damped spring is simulated once per preset at module load and sampled
 * into a CSS linear() easing, so the browser compositor plays real spring
 * physics with no per-frame JavaScript. Browsers without linear() receive an
 * expo-out curve of the same settling time. Values are unit-free: 0 → 1. */
const SPRINGS = Object.freeze({
  // Content: no visible overshoot; most of the travel is done by ~200 ms.
  soft: { stiffness: 420, damping: 36 },
  // Route slides and cards: a small, lively settle past rest (~2%).
  lively: { stiffness: 380, damping: 30 },
  // Marks, glyphs and celebratory accents: a distinct bounce (~8%).
  bouncy: { stiffness: 600, damping: 30 },
});

function simulate({ stiffness, damping, mass = 1 }) {
  const dt = 1 / 600;
  let x = 0;
  let v = 0;
  let t = 0;
  const samples = [0];
  const every = 10; // a linear() point every 1/60 s
  for (let step = 1; step < 600 * 3; step += 1) {
    const force = -stiffness * (x - 1) - damping * v;
    v += (force / mass) * dt;
    x += v * dt;
    t += dt;
    if (step % every === 0) samples.push(x);
    if (t > 0.12 && Math.abs(1 - x) < 0.0015 && Math.abs(v) < 0.02) break;
  }
  samples.push(1);
  return { duration: Math.round(t * 1000), samples };
}

const supportsLinear = (() => {
  try {
    return typeof CSS !== "undefined" && CSS.supports("transition-timing-function", "linear(0, 1)");
  } catch {
    return false;
  }
})();

const SPRING_CURVES = Object.fromEntries(Object.entries(SPRINGS).map(([name, spec]) => {
  const { duration, samples } = simulate(spec);
  const easing = supportsLinear
    ? `linear(${samples.map((value) => Number(value.toFixed(4))).join(", ")})`
    : SETTLE;
  return [name, Object.freeze({ duration, easing, samples: Object.freeze(samples.slice()) })];
}));

/** Spring timing for callers and tests: { duration, easing, samples }.
 * `samples` are the simulated positions at 60 points per second (0 → 1),
 * so a chart (about/) can draw the very curve the browser plays. */
export function spring(name = "soft") {
  return SPRING_CURVES[name] ?? SPRING_CURVES.soft;
}
const active = new Set();
const channels = new WeakMap();
const pointerScenes = new Set();
const arrivals = new Set();
let listening = false;
let pressing = null;
const releasedAt = new WeakMap();
const PRESSABLE = 'button, a.btn, a.about-button, .nav__item, summary';

// Move a control's presentation, never the pointer target. Wrapping keeps the
// original nodes (and their listeners/ARIA IDs); it does not clone a control.
function controlFace(control, prepare = false) {
  if (control.matches('.option, .switch, .folio-leaf-face, .scroll-rail *, [role="slider"]')) return null;
  if (!control.matches('.btn, .about-button, .choice:not(.choice--card), .nav__item, .listbox__trigger, summary') && !control.className.startsWith('folio-')) return null;
  let face = control.querySelector(':scope > .control-face');
  if (!face && prepare) {
    face = document.createElement('span');
    face.className = 'control-face';
    while (control.firstChild) face.appendChild(control.firstChild);
    control.appendChild(face);
    control.dataset.tactile = '';
  }
  return face;
}

function pressTargets(control, prepare = false) {
  const face = controlFace(control, prepare);
  if (face) return [face];
  const targets = [...control.querySelectorAll(':scope > .row__main, :scope > .row__trail, :scope > .tile__head, :scope > .tile__sub, :scope > .tile__meta, :scope > .option__key, :scope > .icon, .onboard-flow__choice > span:not(.onboard-flow__stop), .about-study-step > span:not(.about-step-number), .about-architecture-node > span')];
  targets.forEach((node) => node.classList.add('control-press-part'));
  return targets;
}

function stopPress() {
  if (!pressing) return;
  delete pressing.control.dataset.pressing;
  for (const node of pressing.targets) node.style.removeProperty('--press-depth');
  pressing = null;
}

function beginPress(event) {
  if (event.button > 0 || !canMove()) return;
  const control = event.target?.closest?.(PRESSABLE);
  if (!control || control.matches(':disabled, [aria-disabled="true"]') || control.closest('.scroll-rail')) return;
  stopPress();
  const targets = pressTargets(control);
  if (!targets.length) return;
  cancelAnimationsWithin(control);
  pressing = { control, targets, pointerId: event.pointerId, x: event.clientX, y: event.clientY };
  control.dataset.pressing = 'true';
  targets.forEach((node) => node.style.setProperty('--press-depth', '.945'));
}

function endPress(event, cancelled = false) {
  if (!pressing || (event.pointerId != null && pressing.pointerId != null && event.pointerId !== pressing.pointerId)) return;
  const { control, targets } = pressing;
  // Capture the interpolated position so even a very short tap has one fluid
  // release rather than a hard jump to the held-down keyframe.
  const starts = targets.map((node) => window.getComputedStyle(node).transform);
  stopPress();
  if (cancelled || !control.isConnected || !canMove()) return;
  releasedAt.set(control, Date.now());
  targets.forEach((node, index) => animateElement(node, 'release', {
    channel: 'control-release', startTransform: starts[index],
  }));
}

function movePress(event) {
  if (!pressing || event.pointerId !== pressing.pointerId) return;
  if (Math.hypot(event.clientX - pressing.x, event.clientY - pressing.y) > 12) endPress(event, true);
}

function keyboardPress(event) {
  if (event.repeat || !['Enter', ' '].includes(event.key) || event.target?.matches?.('input, textarea, select')) return;
  beginPress(event);
}

// Native click still fires at its normal time, including keyboard/AT clicks.
// A programmatic activation receives the release accent without manufacturing
// a pointer event or holding navigation until animation finishes.
function clickPress(event) {
  if (event.detail !== 0 || !canMove()) return;
  const control = event.target?.closest?.(PRESSABLE);
  if (!control || control.matches(':disabled, [aria-disabled="true"]') || control.closest('.scroll-rail')) return;
  if (pressing?.control === control) { endPress(event); return; }
  if (Date.now() - (releasedAt.get(control) ?? 0) < 80) return;
  for (const node of pressTargets(control)) animateElement(node, 'release', { channel: 'control-release' });
}

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
  stopPress();
  for (const arrival of [...arrivals]) arrival.dispose();
  for (const record of [...active]) cancel(record);
  for (const scene of pointerScenes) scene.reset();
}

// Real input takes priority over an arriving container. Settle only the
// animated target/ancestors before focus scrolling or popup positioning reads
// their geometry; independent artwork siblings keep their expressive sequence.
function settleInputAncestors(event) {
  const target = event.target;
  if (!target) return;
  for (const arrival of [...arrivals]) {
    if (arrival.element === target || arrival.element.contains(target)) arrival.dispose();
  }
  for (const record of [...active]) {
    if (record.element === target || record.element.contains(target)) cancel(record);
  }
}

function initialize() {
  initMotion();
  if (listening) return;
  listening = true;
  // Prepare newly rendered controls before painting or a user's pointerdown.
  // Reparenting a hit descendant during pointerdown can suppress native click.
  const prepare = (root) => {
    if (root.matches?.(PRESSABLE)) controlFace(root, true);
    root.querySelectorAll?.(PRESSABLE).forEach((node) => controlFace(node, true));
  };
  prepare(document);
  if (typeof MutationObserver !== 'undefined') {
    new MutationObserver((records) => {
      for (const record of records) {
        if (record.target.matches?.(PRESSABLE)) controlFace(record.target, true);
        for (const node of record.addedNodes) if (node.nodeType === 1) prepare(node);
      }
    }).observe(document.body, { childList: true, subtree: true });
  }
  document.addEventListener("motion:change", (event) => {
    if (!event.detail.enabled || !event.detail.visible) stopAll();
  });
  window.addEventListener("pagehide", stopAll);
  document.addEventListener("pointerdown", settleInputAncestors, true);
  document.addEventListener("focusin", settleInputAncestors, true);
  document.addEventListener('pointerdown', beginPress, true);
  document.addEventListener('pointerup', endPress, true);
  document.addEventListener('pointercancel', (event) => endPress(event, true), true);
  document.addEventListener('pointermove', movePress, { passive: true });
  document.addEventListener('keydown', keyboardPress, true);
  document.addEventListener('keyup', (event) => { if (['Enter', ' '].includes(event.key)) endPress(event); }, true);
  document.addEventListener('click', clickPress, true);
  window.addEventListener('blur', stopPress);
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
    /* ---- v0.76 entrances. Each starts from its own first keyframe on the
     * very first painted frame (the caller animates before yielding), so a
     * screen never shows its final layout and then jumps. Opacity is part of
     * an entrance only; reading text is never dimmed after it has arrived. */
    case "enter": return { curve: "lively", frames: [
      { opacity: 0, transform: `translateX(${sign * 28}px)` },
      { opacity: 1, transform: "translateX(0)" },
    ] };
    case "rise": return { curve: "soft", frames: [
      { opacity: 0, transform: "translateY(18px)" },
      { opacity: 1, transform: "translateY(0)" },
    ] };
    case "headline": return { curve: "soft", frames: [
      { opacity: 0, transform: "translateY(14px)" },
      { opacity: 1, transform: "translateY(0)" },
    ] };
    case "title": return { curve: "soft", frames: [
      { opacity: 0, transform: "translateY(6px)" },
      { opacity: 1, transform: "translateY(0)" },
    ] };
    // Content the viewport may scroll straight to: present from frame one.
    case "settle": return { curve: "soft", frames: [
      { opacity: .45, transform: "translateY(12px)" },
      { opacity: 1, transform: "translateY(0)" },
    ] };
    case "pop": return { curve: "bouncy", frames: [
      { opacity: 0, transform: "scale(.82)" },
      { opacity: 1, transform: "scale(1)" },
    ] };
    case "fade": return { role: "reveal", easing: "cubic-bezier(.2,.6,.2,1)", frames: [{ opacity: 0 }, { opacity: 1 }] };
    case "prompt": return { curve: "lively", frames: [
      { opacity: 0, transform: `translateX(${sign * 40}px)` },
      { opacity: 1, transform: "translateX(0)" },
    ] };
    case "grow": return { curve: "soft", frames: [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }] };
    case "celebrate": return { role: "scene", easing: "linear", frames: [
      { transform: "scale(1)", offset: 0, easing: "cubic-bezier(.3,.7,.4,1)" },
      { transform: "scale(1.035)", offset: .35, easing: EASING },
      { transform: "scale(1)", offset: 1 },
    ] };
    case "shake": return { role: "scene", easing: "cubic-bezier(.36,.07,.19,.97)", frames: [
      { transform: "translateX(0)" }, { transform: "translateX(-7px)" }, { transform: "translateX(6px)" },
      { transform: "translateX(-4px)" }, { transform: "translateX(2px)" }, { transform: "translateX(0)" },
    ] };
    // Productive motion: no overshoot or scaling of a reading surface.
    case "release": return { role: "release", easing: "linear", frames: [
      { transform: "scale(.945) translateY(1px)", offset: 0, easing: "cubic-bezier(.15,.7,.25,1)" },
      { transform: "scale(1.035) translateY(-1px)", offset: .48, easing: EASING },
      { transform: "scale(1) translateY(0)", offset: 1 },
    ] };
    case "control": return { role: "control", frames: [{ transform: "scale(.975)" }, { transform: "scale(1)" }] };
    // Opacity only: the listbox measures option geometry while it opens and
    // an option under a fast second tap must already be where it is drawn.
    // Its labels assemble inside it (js/listbox.js).
    case "menu": return { role: "reveal", easing: "cubic-bezier(.2,.6,.2,1)", frames: [{ opacity: 0 }, { opacity: 1 }] };
    case "dialog": return { curve: "lively", frames: [
      { opacity: 0, transform: "translateY(18px) scale(.96)" },
      { opacity: 1, transform: "translateY(0) scale(1)" },
    ] };
    case "route": return { role: "route", frames: [{ transform: `translateX(${sign * 12}px)` }, { transform: "translateX(0)" }] };
    case "onboard": return { role: "scene", frames: [{ transform: `translateX(${sign * 12}px)` }, { transform: "translateX(0)" }] };
    // An outside halo acknowledges the opening. Clipping even a stable box
    // would remove its edge hit targets before pointerdown can settle it.
    case "panel": return { role: "route", frames: [
      { boxShadow: "0 0 0 1px var(--accent-tint), 0 0 0 0 transparent" },
      { boxShadow: "0 0 0 5px var(--accent-tint), 0 8px 24px #00000018", offset: .45 },
      { boxShadow: "0 0 0 8px transparent, 0 0 0 0 transparent" },
    ] };
    case "item": return { role: "reveal", frames: [{ transform: "translateY(6px)" }, { transform: "translateY(0)" }] };
    case "unfold": return { role: "scene", frames: [{ transform: "translateY(5px) scaleY(.84)" }, { transform: "translateY(0) scaleY(1)" }] };
    case "fan": return {
      role: "complete", easing: "linear", frames: [
        { transform: `translateX(${sign * 12}px) rotate(${sign * 5}deg)`, offset: 0, easing: SETTLE },
        { transform: `translateX(${-sign}px) rotate(${-sign}deg)`, offset: .72, easing: EASING },
        { transform: "translateX(0) rotate(0deg)", offset: 1 },
      ],
    };
    case "signal": return {
      role: "scene", easing: "linear", frames: [
        { transform: "scale(.55)", offset: 0, easing: SETTLE },
        { transform: "scale(1.22)", offset: .62, easing: EASING },
        { transform: "scale(1)", offset: 1 },
      ],
    };
    case "folio": return {
      role: "flow", easing: "linear", frames: [
        { transform: `perspective(900px) translateX(${sign * 12}px) rotateY(${sign * 24}deg)`, offset: 0, easing: "cubic-bezier(.22,.65,.25,1)" },
        { transform: `perspective(900px) translateX(${-sign}px) rotateY(${-sign * 2}deg)`, offset: .74, easing: EASING },
        { transform: "perspective(900px) translateX(0) rotateY(0deg)", offset: 1 },
      ],
    };
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
    case "flow": return {
      role: "flow", easing: "linear", frames: [
        { transform: `translateX(${sign * 14}px) translateY(7px) scale(.96) rotate(${-sign * 2}deg)`, offset: 0, easing: "cubic-bezier(.22,.65,.25,1)" },
        { transform: `translateX(${-sign * 1.5}px) translateY(-2px) scale(1.012) rotate(${sign * .5}deg)`, offset: .65, easing: EASING },
        { transform: "translateX(0) translateY(0) scale(1) rotate(0deg)", offset: 1 },
      ],
    };
    case "trace": return { role: "flow", easing: "cubic-bezier(.3,.1,.2,1)", frames: [{ strokeDasharray: "1", strokeDashoffset: "1" }, { strokeDasharray: "1", strokeDashoffset: "0" }] };
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
export function animateElement(element, kind = "reveal", { channel = "default", direction = "forward", delay = 0, startTransform } = {}) {
  if (!element) return null;
  const current = channels.get(element)?.get(channel);
  if (current) cancel(current);
  if (!element.isConnected || typeof element.animate !== "function") return null;
  initialize();
  if (!canMove()) return null;
  const { role, frames, curve, easing: authored = EASING } = preset(kind, direction);
  if (kind === "release" && startTransform && startTransform !== "none") frames[0].transform = startTransform;
  // A fill grows to whatever ratio its own style already commits.
  if (kind === "grow") {
    const final = window.getComputedStyle?.(element).transform;
    if (final && final !== "none") frames[1].transform = final;
  }
  const wait = Math.min(MAX_SEQUENCE_DELAY, Math.max(0, Number(delay) || 0));
  const motion = curve ? spring(curve) : { duration: timing(role), easing: authored };
  const animation = element.animate(frames, {
    duration: motion.duration, delay: wait, easing: motion.easing,
    // Delayed decoration holds its first frame; text stays fully opaque and
    // interactive throughout. On finish/cancel the authored final CSS wins.
    fill: wait || curve ? "backwards" : "none",
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


/* ---- Composition (v0.76) ----
 * A new screen arrives as a short cascade of its visible parts. The caller
 * has already committed the final DOM, state and focus; compose() only lays
 * presentation over it, synchronously, before the browser paints. Parts that
 * are offscreen are left alone and already final. */
const ATOMIC = "p, h1, h2, h3, h4, h5, h6, button, a, label, input, textarea, select, svg, img, canvas, figure, table, pre, blockquote, .option, .row, .tile, .btn, .chip, .metric, .avatar, [data-compose-part]";
// One vector per screen: every part of a cascade moves the same way, so a
// screen arrives as one gesture rather than as several unrelated motions.
const CASCADE_SPAN = 220;

function viewportBounds() {
  const scroller = document.getElementById("shell-scroll");
  const height = window.innerHeight || document.documentElement.clientHeight || 0;
  const box = scroller?.getBoundingClientRect?.();
  return { top: Math.max(0, box?.top ?? 0), bottom: Math.min(height || Infinity, box?.bottom ?? height) };
}

function onScreen(node, view) {
  const box = node.getBoundingClientRect?.();
  return Boolean(box) && box.width > 2 && box.height > 2 && box.top < view.bottom && box.bottom > view.top;
}

function isSurface(node) {
  const style = window.getComputedStyle?.(node);
  if (!style) return false;
  const background = style.backgroundColor ?? "";
  const painted = background && background !== "transparent" && !/rgba\([^)]*,\s*0\)$/.test(background);
  return Boolean(painted || (style.backgroundImage && style.backgroundImage !== "none")
    || (style.boxShadow && style.boxShadow !== "none") || parseFloat(style.borderTopWidth) > 0);
}

/** The visible presentation parts of a container, outermost-first. Tall
 * groups are opened so each card, row or heading arrives on its own beat;
 * atomic nodes (prose, controls, artwork) are never split. */
export function collectParts(root, { limit = 8, view = viewportBounds() } = {}) {
  const parts = [];
  if (!root?.children) return parts;
  const tall = Math.min(220, (view.bottom - view.top) * 0.34);
  (function walk(node, depth) {
    for (const child of node.children) {
      if (parts.length >= limit) return;
      if (child.matches("script, template, style, [hidden], .sr-only, .visually-hidden, [data-compose='skip']")) continue;
      if (!onScreen(child, view)) continue;
      const height = child.getBoundingClientRect().height;
      // A card travels with its contents: an empty surface filling in reads
      // as loading, so a painted surface is never opened.
      const open = depth < 4 && !child.matches(ATOMIC) && child.childElementCount > 0 && height > tall
        && !isSurface(child);
      if (open) walk(child, depth + 1);
      else parts.push(child);
    }
  })(root, 0);
  return parts;
}

/** Cascade the given parts (elements, or { element, kind, at }) into place,
 * all with the same `kind`. The cascade fits inside ~220 ms however many
 * parts it has, so the whole screen has landed by about half a second. */
export function compose(parts, { kind = "rise", direction = "forward", channel = "compose", step = 36 } = {}) {
  initialize();
  if (!canMove()) return [];
  const list = (parts ?? []).map((part) => (part?.element ? part : { element: part }))
    .filter((part) => part.element?.isConnected);
  if (!list.length) return [];
  const gap = list.length > 1 ? Math.min(step, CASCADE_SPAN / (list.length - 1)) : 0;
  const animations = animateSequence(list.map(({ element, kind: own, at }, index) => ({
    element,
    kind: own ?? kind,
    at: at ?? Math.round(index * gap),
  })), { channel, direction });
  if (SIDEWAYS.has(kind)) clipSideways(animations);
  return animations;
}

// A sideways entrance briefly extends past the column. Clip the page in x
// while it runs, so the scroller never gains horizontal overflow that focus
// or text zoom could scroll into and leave behind.
const SIDEWAYS = new Set(["enter", "prompt"]);
let clipping = 0;
function clipSideways(animations) {
  const scroller = document.getElementById?.("shell-scroll");
  if (!scroller || !animations.length) return;
  const ticket = ++clipping;
  scroller.dataset.composing = "sideways";
  Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
    if (ticket === clipping) delete scroller.dataset.composing;
  });
}

/** Compose a whole screen: collect its visible parts and cascade them. */
export function composeScreen(root, options = {}) {
  if (!root?.isConnected) return [];
  initialize();
  if (!canMove()) return [];
  const view = viewportBounds();
  const animations = compose(collectParts(root, { ...options, view }), options);
  // Visible progress fills grow to their committed ratio after their rows land.
  const fills = [...root.querySelectorAll(".metric__fill")].filter((fill) => onScreen(fill, view)).slice(0, 6);
  animations.push(...animateSequence(fills.map((element, index) => ({
    element, kind: "grow", at: 120 + index * 40,
  })), { channel: `${options.channel ?? "compose"}-fill` }));
  return animations;
}

/** Release outgoing finite effects immediately before closing or replacing UI. */
export function cancelAnimationsWithin(container) {
  if (!container) return;
  for (const arrival of [...arrivals]) {
    if (arrival.element === container || container.contains(arrival.element)) arrival.dispose();
  }
  for (const record of [...active]) {
    if (record.element === container || container.contains(record.element)) cancel(record);
  }
}

/** Start presentation once its real scene is ready AND visible. Content is
 * already usable: this never hides, loads or commits application state. A slow
 * font/image cannot consume an offscreen animation. New scenes, real input,
 * motion-off and hidden pages discard pending arrivals instead of replaying
 * stale events later. `ready` may be an image.decode() promise. */
export function whenVisible(element, callback, { ready, channel = "arrival", threshold = .12 } = {}) {
  initialize();
  for (const arrival of [...arrivals]) {
    if (arrival.element === element && arrival.channel === channel) arrival.dispose();
  }
  if (!element?.isConnected || !canMove()) return () => {};
  let observer = null;
  let frame = null;
  let disposed = false;
  let prepared = false;
  let visible = typeof IntersectionObserver === "undefined";
  const minimum = Math.min(.5, Math.max(0, Number(threshold) || 0));
  const record = { element, channel, dispose };
  arrivals.add(record);

  function dispose() {
    if (disposed) return;
    disposed = true;
    observer?.disconnect();
    if (frame !== null) cancelAnimationFrame(frame);
    arrivals.delete(record);
  }
  function schedule() {
    if (disposed || !prepared || !visible || frame !== null) return;
    // Two render frames leave a complete, painted scene before its flourish.
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        frame = null;
        if (disposed || !element.isConnected || !canMove()) { dispose(); return; }
        if (!visible) return;
        dispose();
        callback();
      });
    });
  }
  if (typeof IntersectionObserver !== "undefined") {
    observer = new IntersectionObserver((entries) => {
      const entry = entries.at(-1);
      visible = !!entry?.isIntersecting && entry.intersectionRatio >= minimum;
      if (!element.isConnected) { dispose(); return; }
      schedule();
    }, { threshold: [0, minimum] });
    observer.observe(element);
  }
  // Called at presentation time after styles exist, not during an early boot
  // script whose fonts.ready could resolve before the font face is discovered.
  const fonts = document.fonts;
  const typography = fonts?.load
    ? fonts.load('400 16px "Inter"', "İngilizce").then(() => fonts.ready)
    : fonts?.ready;
  Promise.allSettled([typography, ready]).then(() => {
    if (disposed) return;
    prepared = true;
    schedule();
  });
  return dispose;
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
