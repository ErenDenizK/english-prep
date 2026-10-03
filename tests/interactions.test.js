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
    assert.equal(second.timing.duration, 160);
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
