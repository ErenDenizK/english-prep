import test from "node:test";
import assert from "node:assert/strict";

function emitter() {
  const listeners = new Map();
  return {
    listeners,
    addEventListener(name, fn) {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name).add(fn);
    },
    removeEventListener(name, fn) { listeners.get(name)?.delete(fn); },
    dispatchEvent(event) { for (const fn of listeners.get(event.type) ?? []) fn(event); },
  };
}

function environment() {
  function element() {
    const node = Object.assign(emitter(), {
      dataset: {}, attributes: new Map(), children: [], isConnected: true,
      style: { values: new Map(), setProperty(key, value) { this.values.set(key, value); } },
      setAttribute(key, value) { this.attributes.set(key, value); },
      appendChild(child) { this.children.push(child); },
      prepend(child) { this.children.unshift(child); },
      append(...children) { this.children.push(...children); },
      contains(child) { return this.children.includes(child); },
      getBoundingClientRect() { return { left: 0, top: 0, width: 200, height: 100 }; },
      effects: [],
      animate(frames, timing) {
        let done, fail;
        const animation = {
          frames, timing, cancelled: 0,
          finished: new Promise((resolve, reject) => { done = resolve; fail = reject; }),
          cancel() { this.cancelled += 1; fail(new Error("AbortError")); },
          finish() { done(); },
        };
        this.effects.push(animation);
        return animation;
      },
    });
    return node;
  }
  const reduced = Object.assign(emitter(), { matches: false });
  const fine = Object.assign(emitter(), { matches: true });
  const document = Object.assign(emitter(), {
    body: element(), documentElement: element(), readyState: "complete", hidden: false,
    createElement: element,
    querySelector() { return this.body.children.find((node) => node.className === "ambient") ?? null; },
    querySelectorAll() { return []; },
  });
  const window = Object.assign(emitter(), {
    matchMedia(query) { return query.includes("prefers-reduced") ? reduced : fine; },
    getComputedStyle() { return { getPropertyValue() { return ""; } }; },
  });
  const frames = new Map();
  let nextFrame = 1;
  return {
    document, window, element, reduced, fine, frames,
    localStorage: { getItem() { return null; }, setItem() {} },
    CustomEvent: class { constructor(type, { detail }) { this.type = type; this.detail = detail; } },
    requestAnimationFrame(callback) { const id = nextFrame++; frames.set(id, callback); return id; },
    cancelAnimationFrame(id) { frames.delete(id); },
    flush() { const pending = [...frames.values()]; frames.clear(); pending.forEach((fn) => fn()); },
    hide(value) { document.hidden = value; document.dispatchEvent({ type: "visibilitychange" }); },
    reduce(value) { reduced.matches = value; reduced.dispatchEvent({ type: "change" }); },
    precision(value) { fine.matches = value; fine.dispatchEvent({ type: "change" }); },
  };
}

test("finite presentation responds safely to interruption and input changes", async (t) => {
  const env = environment();
  const keys = ["document", "window", "localStorage", "CustomEvent", "requestAnimationFrame", "cancelAnimationFrame"];
  const old = new Map(keys.map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const key of keys) Object.defineProperty(globalThis, key, { configurable: true, value: env[key] });
  const motion = await import("../js/motion.js");
  const ui = await import("../js/interactions.js");
  const stopMotion = motion.initMotion();
  t.after(() => {
    env.window.dispatchEvent({ type: "pagehide" });
    stopMotion();
    for (const [key, descriptor] of old) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });

  await t.test("latest effect replaces its channel without holding focus or final state", async () => {
    const node = env.element();
    node.textContent = "Immediate result";
    const first = ui.animateElement(node, "menu");
    const second = ui.animateElement(node, "menu");
    assert.equal(first.cancelled, 1);
    assert.equal(second.cancelled, 0);
    assert.equal(node.textContent, "Immediate result");
    assert.equal(second.timing.duration, 220);
    assert.equal(second.frames[0].transform, "translateY(-8px)", "popup scroll measurements must not be scaled");
    assert.equal(second.timing.fill, "none");
    const independent = ui.animateElement(node, "mark", { channel: "mark" });
    assert.equal(second.cancelled, 0);
    second.finish();
    await Promise.resolve();
    ui.cancelAnimationsWithin(node);
    assert.equal(second.cancelled, 0, "finished effects have been released");
    assert.equal(independent.cancelled, 1);
  });

  await t.test("off, OS reduction, hidden pages and pagehide cancel running effects", () => {
    const node = env.element();
    const first = ui.animateElement(node);
    motion.setMotionEnabled(false);
    assert.equal(first.cancelled, 1);
    assert.equal(ui.animateElement(node), null);
    motion.setMotionEnabled(true);
    assert.equal(node.effects.length, 1, "enabling does not replay previous actions");
    const second = ui.animateElement(node);
    env.reduce(true);
    assert.equal(second.cancelled, 1);
    assert.equal(ui.animateElement(node), null);
    env.reduce(false);
    const third = ui.animateElement(node);
    env.hide(true);
    assert.equal(third.cancelled, 1);
    assert.equal(ui.animateElement(node), null);
    env.hide(false);
    const fourth = ui.animateElement(node);
    env.window.dispatchEvent({ type: "pagehide" });
    assert.equal(fourth.cancelled, 1);
  });

  await t.test("detached and unsupported hosts immediately retain their static presentation", () => {
    const detached = env.element();
    detached.isConnected = false;
    assert.equal(ui.animateElement(detached), null);
    assert.equal(detached.effects.length, 0);
    const unsupported = env.element();
    unsupported.animate = undefined;
    assert.equal(ui.animateElement(unsupported), null);
    const parent = env.element();
    const child = env.element();
    parent.appendChild(child);
    const effect = ui.animateElement(child);
    ui.cancelAnimationsWithin(parent);
    assert.equal(effect.cancelled, 1);
  });

  await t.test("expressive sequences remain finite, readable and immediately cancellable", async () => {
    const parent = env.element();
    const heading = env.element();
    const drawing = env.element();
    const glyph = env.element();
    heading.textContent = "Final score is already available";
    parent.append(heading, drawing, glyph);
    const sequence = ui.animateSequence([
      { element: heading, kind: "onboard", at: 0 },
      { element: drawing, kind: "draw", at: 80 },
      { element: glyph, kind: "complete", at: 160 },
    ], { channel: "completion", direction: "back" });
    assert.equal(sequence.length, 3);
    assert.deepEqual(sequence.map((a) => a.timing.delay), [0, 80, 160]);
    assert.deepEqual(sequence.map((a) => a.timing.duration), [560, 720, 720]);
    assert.deepEqual(sequence.map((a) => a.timing.fill), ["none", "backwards", "backwards"]);
    assert.equal(heading.textContent, "Final score is already available");
    assert.equal(sequence[0].frames[0].transform, "translateX(-12px)");
    assert.ok(sequence[0].frames.every((frame) => frame.opacity === undefined || frame.opacity === 1));
    assert.equal(sequence[1].frames.at(-1).strokeDashoffset, "0");
    assert.equal(sequence[2].frames.at(-1).transform, "scale(1) rotate(0deg)");
    assert.equal(env.frames.size, 0, "composition starts no recurring JavaScript work");
    ui.cancelAnimationsWithin(parent);
    assert.ok(sequence.every((animation) => animation.cancelled === 1));
    await Promise.resolve();
    motion.setMotionEnabled(false);
    assert.deepEqual(ui.animateSequence([{ element: glyph, kind: "complete", at: 160 }]), []);
    motion.setMotionEnabled(true);
    assert.equal(glyph.effects.length, 1, "interrupted delayed decoration never replays");
  });

  await t.test("stagger limits and replacements prevent a queued or stale scene", () => {
    const node = env.element();
    const first = ui.animateSequence([{ element: node, kind: "story", at: 99999 }]);
    assert.equal(first[0].timing.delay, 180);
    assert.equal(first[0].timing.duration, 900);
    const replacement = ui.animateSequence([{ element: node, kind: "scene", at: -50 }]);
    assert.equal(first[0].cancelled, 1);
    assert.equal(replacement[0].timing.delay, 0);
    assert.equal(replacement[0].timing.fill, "none");
    assert.equal(replacement[0].timing.duration, 560);
    env.hide(true);
    assert.equal(replacement[0].cancelled, 1);
    assert.deepEqual(ui.animateSequence([{ element: node, kind: "scene", at: 80 }]), []);
    env.hide(false);
    assert.equal(node.effects.length, 2);
    const detached = env.element();
    detached.isConnected = false;
    assert.deepEqual(ui.animateSequence([null, {}, { element: detached, kind: "draw" }]), []);
  });

  await t.test("arrival waits for readiness and paint, and pending scenes remain cancellable", async () => {
    const node = env.element();
    let resolveReady;
    let calls = 0;
    const ready = new Promise((resolve) => { resolveReady = resolve; });
    ui.whenVisible(node, () => { calls++; }, { ready });
    env.flush(); env.flush();
    assert.equal(calls, 0, "slow assets do not consume an arrival");
    resolveReady();
    await new Promise((resolve) => setImmediate(resolve));
    env.flush();
    assert.equal(calls, 0, "first painted frame stays readable");
    env.flush();
    assert.equal(calls, 1);
    env.flush();
    assert.equal(calls, 1, "no recurring frame or replay");

    for (const stop of [
      () => ui.cancelAnimationsWithin(node),
      () => env.document.dispatchEvent({ type: "pointerdown", target: node }),
      () => motion.setMotionEnabled(false),
      () => env.hide(true),
    ]) {
      let readyNow;
      ui.whenVisible(node, () => { calls++; }, { ready: new Promise((r) => { readyNow = r; }) });
      stop();
      readyNow();
      await new Promise((resolve) => setImmediate(resolve));
      env.flush(); env.flush();
      motion.setMotionEnabled(true); env.hide(false);
      assert.equal(calls, 1, "cancelled pending scenes cannot return later");
    }
    assert.equal(env.frames.size, 0);
  });

  await t.test("spatial cues and progress use distinct bounded roles with static endings", () => {
    const kinds = { control: 100, reveal: 220, menu: 220, dialog: 360, route: 360,
      mark: 360, onboard: 560, scene: 560, rule: 560, complete: 720, draw: 720,
      progress: 720, story: 900, flow: 1100, trace: 1100, panel: 360, item: 220, unfold: 560, fan: 720, signal: 560, folio: 1100, release: 380 };
    for (const [kind, duration] of Object.entries(kinds)) {
      const node = env.element();
      const animation = ui.animateElement(node, kind);
      assert.equal(animation.timing.duration, duration, kind);
      assert.equal(animation.timing.delay, 0);
      assert.equal(animation.timing.fill, "none");
      assert.ok(animation.frames.every((frame) => frame.opacity === undefined || frame.opacity === 1), kind);
      animation.finish();
    }
    const progress = ui.animateElement(env.element(), "progress");
    assert.equal(progress.frames[0].transform, "scaleX(0)");
    assert.equal(progress.frames.at(-1).transform, "scaleX(1)");
    const previousStyle = env.window.getComputedStyle;
    env.window.getComputedStyle = () => ({ getPropertyValue: (name) => name === "--d-scene" ? "0.62s" : "" });
    assert.equal(ui.animateElement(env.element(), "scene").timing.duration, 620);
    env.window.getComputedStyle = previousStyle;
  });

  await t.test("direct input settles arriving ancestors without cancelling independent artwork", () => {
    const container = env.element();
    const control = env.element();
    const glyph = env.element();
    const neighbor = env.element();
    container.append(control, glyph);
    const arriving = ui.animateElement(container, "route");
    const decorative = ui.animateElement(glyph, "complete");
    const unrelated = ui.animateElement(neighbor, "story");
    env.document.dispatchEvent({ type: "pointerdown", target: control });
    assert.equal(arriving.cancelled, 1, "input geometry settles before popup placement");
    assert.equal(decorative.cancelled, 0);
    assert.equal(unrelated.cancelled, 0);
    const focused = ui.animateElement(control, "reveal");
    env.document.dispatchEvent({ type: "focusin", target: control });
    assert.equal(focused.cancelled, 1);
    assert.equal(decorative.cancelled, 0);
    // Focusing an ancestor does not suppress an independent descendant drawing.
    env.document.dispatchEvent({ type: "focusin", target: container });
    assert.equal(decorative.cancelled, 0);
    ui.cancelAnimationsWithin(container);
    ui.cancelAnimationsWithin(neighbor);
  });

  await t.test("pointer bursts coalesce, remain bounded, and leave no idle frame", () => {
    const scene = env.element();
    const plane = env.element();
    const cleanup = ui.bindPointerScene(scene, { target: plane, maxTilt: 20, maxShift: 100 });
    for (let index = 0; index < 30; index++) {
      scene.dispatchEvent({ type: "pointermove", pointerType: "mouse", clientX: 300, clientY: -100 });
    }
    assert.equal(env.frames.size, 1);
    env.flush();
    assert.equal(env.frames.size, 0, "stationary pointer schedules no further work");
    assert.equal(plane.style.values.get("--scene-rotate-x"), "2.000deg");
    assert.equal(plane.style.values.get("--scene-rotate-y"), "2.000deg");
    assert.equal(plane.style.values.get("--scene-shift-x"), "8.000px");
    assert.equal(plane.dataset.sceneActive, "true");
    scene.dispatchEvent({ type: "pointerleave" });
    assert.equal(plane.style.values.get("--scene-shift-x"), "0px");
    assert.equal(plane.dataset.sceneActive, "false");
    cleanup();
    cleanup();
    assert.equal(scene.listeners.get("pointermove").size, 0);
  });

  await t.test("coarse/touch input and motion cancellation keep pointer scenes static", () => {
    const scene = env.element();
    const cleanup = ui.bindPointerScene(scene);
    const moved = { type: "pointermove", pointerType: "mouse", clientX: 150, clientY: 75 };
    env.precision(false);
    scene.dispatchEvent(moved);
    assert.equal(env.frames.size, 0);
    env.precision(true);
    scene.dispatchEvent({ ...moved, pointerType: "touch" });
    assert.equal(env.frames.size, 0);
    scene.dispatchEvent(moved);
    assert.equal(env.frames.size, 1);
    motion.setMotionEnabled(false);
    assert.equal(env.frames.size, 0);
    assert.equal(scene.dataset.sceneActive, "false");
    motion.setMotionEnabled(true);
    scene.dispatchEvent(moved);
    env.flush();
    env.hide(true);
    assert.equal(scene.dataset.sceneActive, "false");
    env.hide(false);
    scene.dispatchEvent(moved);
    cleanup();
    assert.equal(env.frames.size, 0);
    scene.dispatchEvent(moved);
    assert.equal(env.frames.size, 0);
  });

  await t.test("compact and full signatures have one stable accessible identity", async () => {
    const { createBrand } = await import("../js/brand.js");
    for (const variant of ["compact", "full", "responsive"]) {
      const brand = createBrand({ variant });
      assert.equal(brand.attributes.get("aria-label"), "English Prep");
      assert.equal(brand.attributes.get("role"), "img");
      assert.equal(brand.lang, "en");
      assert.equal(brand.children.at(-1).textContent, ".");
    }
    assert.equal(createBrand({ variant: "full" }).children[0].textContent, "english prep");
    assert.equal(createBrand().children[0].textContent, "ep");
  });
});
