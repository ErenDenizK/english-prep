// The app shell: the bar, the one scrolling region, the action bar and
// the polite live region. Every screen is bar · body · foot
// (docs/ui2-plan.md §3.1), and this module owns the bar and the foot so
// that seven screens cannot each grow their own top — which is how the
// three focused screens drifted apart last time.
//
// The bar is deliberately part of the shell rather than of the scrolling
// content: answering a question must never move the control the learner is
// already reaching for. `.shell__bar-inner` has a fixed minimum height for
// the same reason, so a bar holding a hint and a bar holding a button are
// the same size.

import { el, clear } from "./dom.js";
import { icon } from "./icons.js";

const liveRegion = document.getElementById("live-region");
const scrollRegion = document.getElementById("shell-scroll");

/**
 * Announces a view change or an answer outcome. The node is persistent and
 * only its children change: a live region created together with its
 * content is frequently missed by screen readers. Polite, never assertive
 * — feedback is a status message, not an emergency, and interrupting a
 * learner who is still hearing the option they chose helps nobody.
 *
 * Parts are strings, or `{en}` for an English fragment, which is wrapped
 * in `lang="en"` so the synthesiser switches voice rather than reading an
 * English verb form with Turkish phonology.
 * @param {...(string|{en: string})} parts
 */
export function announce(...parts) {
  if (!liveRegion) {
    return;
  }
  liveRegion.replaceChildren(
    ...parts.map((part) => {
      if (typeof part === "string") {
        return document.createTextNode(part);
      }
      const span = el("span", null, part.en);
      span.lang = "en";
      return span;
    })
  );
}

/** Back to the top of the one scrolling region — a new step, a new question. */
export function scrollToTop() {
  scrollRegion?.scrollTo({ top: 0 });
}

/**
 * @typedef {object} BarLead
 * @property {string} label - where the back action goes: "Konular", "Dersler"
 * @property {() => void} [onClick]
 * @property {string} [href]
 * @property {string} [icon] - defaults to arrow-left
 */

/**
 * @typedef {object} BarSpec
 * @property {string|{text: string, lang?: string}} title - the screen's
 *   name. Always present: a person always knows where they are.
 * @property {BarLead|null} [lead] - a back action, or nothing on a root
 * @property {Node|string|null} [trail] - one control, or one readout
 * @property {number|null} [progress] - 0…1 along the bar's bottom edge,
 *   or null for no line
 */

const bars = new Map();

/**
 * The top bar: leading · title · trailing, and an optional progress line.
 * One per page, cached by id, so the module that routes and the module
 * that renders a lesson set the same element rather than two.
 *
 * @param {string} barId
 */
export function createBar(barId) {
  if (bars.has(barId)) {
    return bars.get(barId);
  }
  const bar = document.getElementById(barId);
  const lead = bar.querySelector(".bar__lead");
  const title = bar.querySelector(".bar__title");
  const trail = bar.querySelector(".bar__trail");
  const track = bar.querySelector(".bar__progress");
  const fill = track?.querySelector(".progress__fill") ?? null;

  /** @param {BarSpec} spec */
  function set(spec) {
    clear(lead);
    if (spec.lead) {
      const back = spec.lead.href ? el("a", "btn btn--quiet") : el("button", "btn btn--quiet");
      if (spec.lead.href) {
        back.href = spec.lead.href;
      } else {
        back.type = "button";
        back.addEventListener("click", spec.lead.onClick);
      }
      back.appendChild(icon(spec.lead.icon ?? "arrow-left", { size: 20 }));
      back.appendChild(document.createTextNode(spec.lead.label));
      lead.appendChild(back);
    }

    const text = typeof spec.title === "string" ? spec.title : spec.title.text;
    title.textContent = text;
    if (typeof spec.title !== "string" && spec.title.lang) {
      title.lang = spec.title.lang;
    } else {
      title.removeAttribute("lang");
    }

    clear(trail);
    if (spec.trail instanceof Node) {
      trail.appendChild(spec.trail);
    } else if (typeof spec.trail === "string") {
      trail.appendChild(el("p", "t-meta t-num", spec.trail));
    }

    setProgress(spec.progress ?? null);
    bar.hidden = false;
  }

  /** @param {number|null} ratio */
  function setProgress(ratio) {
    if (!track) {
      return;
    }
    if (ratio === null || ratio === undefined) {
      track.hidden = true;
      return;
    }
    track.hidden = false;
    if (fill) {
      fill.style.width = `${Math.round(Math.min(Math.max(ratio, 0), 1) * 100)}%`;
    }
  }

  const api = { set, setProgress, element: bar };
  bars.set(barId, api);
  return api;
}

/**
 * @typedef {object} BarAction
 * @property {string} label
 * @property {"primary"|"secondary"|"quiet"} [level] - defaults to primary;
 *   exactly one per bar, per the button rule.
 * @property {string} [href] - renders an anchor instead of a button
 * @property {() => void} [onClick]
 * @property {string} [icon] - name from js/icons.js, drawn before the label
 * @property {boolean} [focus] - take focus once rendered
 */

/**
 * @param {string} barId
 * @returns {{ set: (actions: BarAction[]) => void, hint: (text: string) => void,
 *             hide: () => void, contains: (node: Node) => boolean,
 *             buttons: () => HTMLElement[] }}
 */
export function createActionBar(barId) {
  const bar = document.getElementById(barId);
  const inner = bar.querySelector(".shell__bar-inner");

  function set(actions) {
    clear(inner);
    let toFocus = null;

    for (const action of actions) {
      const level = action.level ?? "primary";
      const className = `btn btn--${level}`;
      const control = action.href ? el("a", className) : el("button", className);
      if (action.href) {
        control.href = action.href;
      } else {
        control.type = "button";
        control.addEventListener("click", action.onClick);
      }
      if (action.icon) {
        control.appendChild(icon(action.icon, { size: 20 }));
      }
      control.appendChild(document.createTextNode(action.label));
      inner.appendChild(control);
      if (action.focus) {
        toFocus = control;
      }
    }

    bar.hidden = actions.length === 0;
    toFocus?.focus();
  }

  /**
   * The bar with no action yet — a test question before it is answered.
   * Says what is needed rather than showing a disabled button: a disabled
   * control is exempt from contrast rules, drops out of the tab order and
   * explains nothing.
   */
  function hint(text) {
    clear(inner);
    inner.appendChild(el("p", "shell__bar-hint t-meta", text));
    bar.hidden = false;
  }

  function hide() {
    bar.hidden = true;
    clear(inner);
  }

  return {
    set,
    hint,
    hide,
    contains: (node) => bar.contains(node),
    buttons: () => Array.from(inner.querySelectorAll("a, button")),
  };
}
