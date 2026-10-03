// The small drawn objects UI 3 added — a ring, a monogram, an avatar, a
// choice group, a count-up — built the way everything here is built:
// nodes and textContent, never innerHTML. Each is a component with a spec
// in docs/design-system.md §7 and an entry in docs/components.html.

import { el } from "./dom.js";
import { icon } from "./icons.js";

const SVG_NS = "http://www.w3.org/2000/svg";

/** Reduced motion, read once per call so a change mid-session is honoured. */
export function motionWelcome() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * A fraction as an arc. `ratio` 0…1 (null draws an empty track); the
 * text in the middle is whatever the caller says it is, so a ring can
 * read "%74", "3/5" or a bare number.
 *
 * The arc is drawn to its value on the next frame so the stroke's
 * transition runs — a ring that appears already full has nothing to say.
 *
 * @param {{ratio: number|null, label?: string, size?: "sm"|"md"|"lg", tone?: "accent"|"ok"|"no", describedAs?: string}} spec
 */
export function ring({ ratio, label = "", size = "md", tone = "accent", describedAs }) {
  const wrap = el("div", `ring${size === "lg" ? " ring--lg" : size === "sm" ? " ring--sm" : ""}${tone !== "accent" ? ` ring--${tone}` : ""}`);
  if (describedAs) {
    wrap.setAttribute("role", "img");
    wrap.setAttribute("aria-label", describedAs);
  } else {
    wrap.setAttribute("aria-hidden", "true");
  }

  // A 100-unit viewBox: r 44 leaves room for the stroke at any size, and
  // the circumference is a constant the offset is computed from.
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", "ring__svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  const R = 44;
  const C = 2 * Math.PI * R;
  for (const cls of ["ring__track", "ring__fill"]) {
    const circle = document.createElementNS(SVG_NS, "circle");
    circle.setAttribute("class", cls);
    circle.setAttribute("cx", "50");
    circle.setAttribute("cy", "50");
    circle.setAttribute("r", String(R));
    if (cls === "ring__fill") {
      circle.setAttribute("stroke-dasharray", String(C));
      circle.setAttribute("stroke-dashoffset", String(C));
    }
    svg.appendChild(circle);
  }
  wrap.appendChild(svg);
  if (label) {
    // The large ring's value is the screen's display figure — the one
    // `.t-display` on the results screen.
    wrap.appendChild(el("span", size === "lg" ? "ring__value t-num t-display" : "ring__value t-num", label));
  }

  const fill = svg.querySelector(".ring__fill");
  const clamped = ratio === null ? 0 : Math.min(Math.max(ratio, 0), 1);
  const target = String(C * (1 - clamped));
  if (motionWelcome()) {
    requestAnimationFrame(() => requestAnimationFrame(() => fill.setAttribute("stroke-dashoffset", target)));
  } else {
    fill.setAttribute("stroke-dashoffset", target);
  }
  return wrap;
}

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
 * The initials a monogram shows: the first letter of each of the first
 * two words. "Passive Voice" → PV, "Tenses" → T.
 * @param {string} title
 */
export function initialsOf(title) {
  return title
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
}

/**
 * A topic's coloured tile with its initials. Decorative: the title beside
 * it is what a reader gets, so it is hidden from the tree.
 * @param {string} id - the topic id, for the hue
 * @param {string} title - for the initials
 * @param {{size?: "md"|"lg"}} [options]
 */
export function monogram(id, title, { size = "md" } = {}) {
  const node = el("span", `monogram${size === "lg" ? " monogram--lg" : ""}`, initialsOf(title));
  node.style.setProperty("--hue", String(hueOf(id)));
  node.setAttribute("aria-hidden", "true");
  node.lang = "en";
  return node;
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
 * A group of pressed-state buttons for one of a few values — a count, a
 * goal, a theme. `aria-pressed` carries the state; the group is labelled
 * by the caller's label id. Arrow keys move between them, as a group of
 * toggles should.
 *
 * @param {{options: Array<{value: string, label: string, sub?: string}>, value: string,
 *          onChange: (value: string) => void, labelledBy: string, card?: boolean}} spec
 * @returns {{element: HTMLElement, getValue: () => string, setValue: (value: string) => void}}
 */
export function choices({ options, value, onChange, labelledBy, card = false }) {
  const group = el("div", card ? "choices stack stack--tight" : "choices");
  group.setAttribute("role", "group");
  group.setAttribute("aria-labelledby", labelledBy);
  let current = value;
  const buttons = [];

  const paint = () => {
    for (const button of buttons) {
      button.setAttribute("aria-pressed", String(button.dataset.value === current));
    }
  };

  for (const option of options) {
    const button = el("button", card ? "choice choice--card" : "choice");
    button.type = "button";
    button.dataset.value = option.value;
    if (card) {
      const main = el("span", "row__main");
      main.appendChild(el("span", "row__title", option.label));
      if (option.sub) {
        main.appendChild(el("span", "row__sub", option.sub));
      }
      button.appendChild(main);
    } else {
      button.textContent = option.label;
    }
    button.addEventListener("click", () => {
      if (current === option.value) {
        return;
      }
      current = option.value;
      paint();
      onChange(current);
    });
    button.addEventListener("keydown", (event) => {
      const index = buttons.indexOf(button);
      const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
      if (step === 0) {
        return;
      }
      event.preventDefault();
      buttons[(index + step + buttons.length) % buttons.length].focus();
    });
    buttons.push(button);
    group.appendChild(button);
  }
  paint();

  return {
    element: group,
    getValue: () => current,
    setValue: (next) => {
      current = next;
      paint();
    },
  };
}

/**
 * A number that counts up to its value. The node's text is the final
 * value from the first frame under reduced motion; otherwise it rises
 * over ~700ms on an ease-out, which is what makes a score feel earned
 * rather than reported. `format` turns the running integer into text.
 *
 * @param {HTMLElement} node
 * @param {number} to
 * @param {(n: number) => string} [format]
 */
export function countUp(node, to, format = String) {
  if (!motionWelcome() || to <= 0) {
    node.textContent = format(to);
    return;
  }
  const duration = 700;
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    node.textContent = format(Math.round(to * eased));
    if (t < 1) {
      requestAnimationFrame(tick);
    }
  };
  node.textContent = format(0);
  requestAnimationFrame(tick);
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
