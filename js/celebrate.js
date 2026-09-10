// Confetti, for a score that earned it.
//
// A canvas over everything, a hundred-odd particles in the app's own
// colours, gone in under two seconds, and never when the person has asked
// for less motion. Drawn with the Canvas API rather than DOM nodes so it
// costs one layer and no layout; removed from the tree the moment the
// last particle leaves the screen, so nothing lingers for a screen reader
// or a tap.
//
// It is called only from the results screen and only at 80 % and above
// (docs/ui3-plan.md §7): a celebration the learner did not earn teaches
// them that the app's praise means nothing.

import { motionWelcome } from "./widgets.js";

const DURATION = 1600;
const COUNT = 120;

/** The palette, read from the page so both themes get their own. */
function colours() {
  const style = getComputedStyle(document.documentElement);
  const read = (name, fallback) => style.getPropertyValue(name).trim() || fallback;
  return [read("--accent", "#f1af5d"), read("--accent-2", "#f69c51"), read("--ok", "#7ccd8e"), read("--ink", "#e9ecef")];
}

/**
 * @returns {Promise<void>} resolves when the canvas is gone
 */
export function confetti() {
  if (!motionWelcome() || typeof document.createElement("canvas").getContext !== "function") {
    return Promise.resolve();
  }
  const canvas = document.createElement("canvas");
  canvas.className = "confetti";
  canvas.setAttribute("aria-hidden", "true");
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(innerWidth * scale);
  canvas.height = Math.round(innerHeight * scale);
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  const palette = colours();
  const particles = Array.from({ length: COUNT }, () => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.2;
    const speed = 380 + Math.random() * 420;
    return {
      x: innerWidth / 2 + (Math.random() - 0.5) * innerWidth * 0.5,
      y: innerHeight * 0.55,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      w: 6 + Math.random() * 6,
      h: 4 + Math.random() * 6,
      rot: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 12,
      colour: palette[Math.floor(Math.random() * palette.length)],
    };
  });

  const gravity = 1100;
  const drag = 0.985;
  let last = performance.now();
  const start = last;

  return new Promise((resolve) => {
    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const life = (now - start) / DURATION;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ctx.globalAlpha = life > 0.7 ? Math.max(0, 1 - (life - 0.7) / 0.3) : 1;
      for (const p of particles) {
        p.vy += gravity * dt;
        p.vx *= drag;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.spin * dt;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.colour;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (life < 1) {
        requestAnimationFrame(frame);
      } else {
        canvas.remove();
        resolve();
      }
    };
    requestAnimationFrame(frame);
  });
}
