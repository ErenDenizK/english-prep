import { createInstallControl } from "../js/install.js";
import { initMotion } from "../js/motion.js";
import { animateElement, animateSequence, cancelAnimationsWithin, bindPointerScene, whenVisible } from "../js/interactions.js";
import { initScrollRail } from "../js/scroll-rail.js";
import { createBrand } from "../js/brand.js";
import { icon } from "../js/icons.js";
import { studyStages, architecture, everydayFeatures, engineering, questions, extraSections } from "./content.js";

const node = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};
const link = ({ label, href }, className = "about-text-link") => {
  const element = node("a", className, label);
  try {
    const url = new URL(href, location.href);
    if (["https:", "http:"].includes(url.protocol)) element.href = href;
  } catch { /* An incomplete authored link remains ordinary text. */ }
  return element;
};
const byId = (id) => document.getElementById(id);
const glyph = (name) => {
  try { return icon(name, { size: 24 }); } catch { return icon("spark", { size: 24 }); }
};
function setAction(element, spec) {
  const authored = link(spec);
  if (authored.hasAttribute("href")) element.setAttribute("href", authored.getAttribute("href"));
  else element.removeAttribute("href");
  const arrow = node("span", "about-link-arrow", "↗");
  arrow.setAttribute("aria-hidden", "true");
  element.replaceChildren(document.createTextNode(spec.label), arrow);
}
function sectionHeading(parent, content, headingId) {
  const title = node("h2", null, content.title);
  title.id = headingId;
  parent.append(node("p", "about-eyebrow", content.eyebrow), title);
  if (content.intro) parent.appendChild(node("p", null, content.intro));
}
function renderFeatures(parent, items) {
  for (const [index, item] of items.entries()) {
    const article = node("article", "about-feature");
    const sign = node("div", "about-feature-sign");
    sign.appendChild(glyph(item.icon || "spark"));
    if (item.label) sign.appendChild(node("p", "about-feature-label", item.label));
    const details = node("details", "about-feature-detail");
    if (index === 0) details.open = true;
    const summary = node("summary");
    const heading = node("h3", null, item.title);
    const indicator = glyph("chevron-down");
    indicator.classList.add("about-feature-toggle");
    summary.append(sign, heading, indicator);
    const body = node("div", "about-feature-body");
    body.appendChild(node("p", null, item.body));
    details.append(summary, body);
    article.appendChild(details);
    if (item.action) {
      const action = link(item.action);
      setAction(action, item.action);
      body.appendChild(action);
    }
    parent.appendChild(article);
  }
}

initMotion();
for (const placeholder of document.querySelectorAll("[data-brand]")) {
  placeholder.replaceChildren(createBrand({ variant: placeholder.dataset.brand }));
}
bindPointerScene(document.querySelector(".about-hero-visual"), {
  target: document.querySelector(".about-hero-scene"), maxTilt: 2, maxShift: 6,
});
// Image-heavy scenes start after their actual pixels can be painted. Cold or
// high-density captures must not spend their entrance while still downloading.
const decodeImages = (element) => Promise.all([...element.querySelectorAll("img")]
  .map((image) => image.decode().catch(() => {})));
whenVisible(document.querySelector(".about-hero-visual"), () => {
  animateSequence([
    { element: document.querySelector(".about-hero-wide"), kind: "flow", at: 0 },
    { element: document.querySelector(".about-hero-phone"), kind: "story", at: 100 },
    { element: document.querySelector(".about-hero-trace .about-trace"), kind: "trace", at: 160 },
  ], { channel: "about-opening" });
}, { channel: "about-opening-ready", ready: decodeImages(document.querySelector(".about-hero-visual")) });

// One continuous selection line belongs to the entire composition, not three
// disconnected button cards. Geometry follows text wrapping and author additions.
function selectionInk(controls) {
  let ink = controls.querySelector(".about-selection-ink");
  if (!ink) {
    ink = node("span", "about-selection-ink");
    ink.setAttribute("aria-hidden", "true");
    controls.appendChild(ink);
  }
  const selected = controls.querySelector('[aria-pressed="true"]');
  if (!selected) return;
  ink.style.width = `${selected.offsetWidth}px`;
  ink.style.transform = `translate(${selected.offsetLeft}px, ${selected.offsetTop + selected.offsetHeight - 3}px)`;
}
function observeSelection(controls) {
  selectionInk(controls);
  if (!("ResizeObserver" in window)) return;
  const observer = new ResizeObserver(() => selectionInk(controls));
  observer.observe(controls);
  for (const button of controls.querySelectorAll("button")) observer.observe(button);
  window.addEventListener("pagehide", () => observer.disconnect(), { once: true });
}
function playGlyph(button, channel) {
  animateElement(button?.querySelector("svg"), "complete", { channel });
  const path = button?.querySelector("svg path");
  if (path) {
    path.setAttribute("pathLength", "1");
    animateElement(path, "trace", { channel: `${channel}-trace` });
  }
}

sectionHeading(byId("features-heading-content"), everydayFeatures, "features-heading");
renderFeatures(byId("feature-list"), everydayFeatures.items);
sectionHeading(byId("engineering-heading-content"), engineering, "engineering-heading");
for (const item of engineering.items) {
  const details = node("details", "about-engineering-detail");
  const summary = node("summary", null, item.title);
  details.append(summary, node("p", null, item.body));
  byId("engineering-list").appendChild(details);
}
for (const item of engineering.links) byId("engineering-links").appendChild(link(item));
for (const item of questions) {
  const details = node("details");
  details.append(node("summary", null, item.title), node("p", null, item.body));
  byId("question-list").appendChild(details);
}
for (const [index, content] of extraSections.entries()) {
  const section = node("section", "about-frame about-section");
  const titleId = `extra-section-heading-${index + 1}`;
  const heading = node("div", "about-section-heading");
  const items = node("div", "about-feature-grid");
  section.setAttribute("aria-labelledby", titleId);
  sectionHeading(heading, content, titleId);
  renderFeatures(items, content.items);
  section.append(heading, items);
  byId("extra-sections").appendChild(section);
}

let currentStage = null;
function showStage(stage, announce = true) {
  if (!stage) return;
  if (stage === currentStage) {
    if (announce) playGlyph(byId("study-controls").querySelector('[aria-pressed="true"]'), "about-study-repeat");
    return;
  }
  const direction = currentStage && studyStages.indexOf(stage) < studyStages.indexOf(currentStage) ? "back" : "forward";
  cancelAnimationsWithin(byId("study-scene"));
  cancelAnimationsWithin(byId("study-controls"));
  currentStage = stage;
  for (const button of byId("study-controls").querySelectorAll("button")) {
    button.setAttribute("aria-pressed", String(button.dataset.studyStage === stage.id));
  }
  byId("study-step-label").textContent = `${String(studyStages.indexOf(stage) + 1).padStart(2, "0")} / ${stage.label}`;
  byId("study-title").textContent = stage.title;
  byId("study-description").textContent = stage.body;
  byId("study-detail").textContent = stage.detail;
  setAction(byId("study-action"), stage.action);
  // Real screenshots accompany the learner's action. The browser selects the
  // appropriate viewport capture; no gallery or screen-size selection exists.
  byId("study-wide-source").srcset = `assets/${stage.capture}-wide.webp`;
  byId("study-image").src = `assets/${stage.capture}-phone.webp`;
  byId("study-image").alt = stage.alt;
  byId("study-scene").dataset.stage = stage.id;
  if (announce) {
    byId("study-status").textContent = `${stage.label}. ${stage.title}`;
    playGlyph(byId("study-controls").querySelector('[aria-pressed="true"]'), "about-study-mark");
    const copy = document.querySelector(".about-study-copy");
    whenVisible(copy, () => {
      if (currentStage === stage) animateElement(copy, "reveal", { channel: "about-story-copy" });
    }, { channel: "about-story-copy-ready" });
    whenVisible(document.querySelector(".about-study-image-frame"), () => {
      if (currentStage !== stage) return;
      animateElement(document.querySelector(".about-study-image-frame"), "flow", { channel: "about-story", direction });
    }, { channel: "about-story-ready", ready: byId("study-image").decode().catch(() => {}) });
    selectionInk(byId("study-controls"));
  }
}
for (const [index, stage] of studyStages.entries()) {
  const button = node("button", "about-study-step");
  button.type = "button";
  button.dataset.studyStage = stage.id;
  button.setAttribute("aria-controls", "study-scene");
  const number = node("span", "about-step-number", String(index + 1).padStart(2, "0"));
  number.setAttribute("aria-hidden", "true");
  button.append(number, glyph(stage.icon || "book"), node("span", null, stage.label));
  button.addEventListener("click", () => showStage(stage));
  byId("study-controls").appendChild(button);
}
byId("study-controls").hidden = studyStages.length === 0;
showStage(studyStages[0], false);
observeSelection(byId("study-controls"));

let currentArchitecture = null;
function showArchitecture(item, announce = true) {
  if (!item) return;
  if (item === currentArchitecture) {
    if (announce) playGlyph(byId("architecture-controls").querySelector('[aria-pressed="true"]'), "about-architecture-repeat");
    return;
  }
  cancelAnimationsWithin(byId("architecture-panel"));
  cancelAnimationsWithin(byId("architecture-controls"));
  currentArchitecture = item;
  for (const button of byId("architecture-controls").querySelectorAll("button")) {
    button.setAttribute("aria-pressed", String(button.dataset.architecture === item.id));
  }
  byId("architecture-label").textContent = item.subtitle;
  byId("architecture-title").textContent = item.title;
  byId("architecture-body").textContent = item.body;
  byId("architecture-detail").textContent = item.detail;
  setAction(byId("architecture-action"), item.action);
  for (const layer of document.querySelectorAll("[data-layer]")) {
    layer.dataset.active = String(layer.dataset.layer === item.id);
  }
  if (announce) {
    byId("architecture-status").textContent = `${item.label}. ${item.title}`;
    const copy = document.querySelector(".about-architecture-copy");
    whenVisible(copy, () => {
      if (currentArchitecture === item) animateElement(copy, "reveal", { channel: "about-architecture-copy" });
    }, { channel: "about-architecture-copy-ready" });
    playGlyph(byId("architecture-controls").querySelector('[aria-pressed="true"]'), "about-architecture-mark");
    whenVisible(document.querySelector(".about-architecture-art"), () => {
      if (currentArchitecture !== item) return;
      animateSequence([
        { element: document.querySelector(`[data-layer="${CSS.escape(item.id)}"]`), kind: "flow", at: 0 },
        { element: document.querySelector(".about-architecture-thread"), kind: "trace", at: 80 },
      ], { channel: "about-architecture" });
    }, { channel: "about-architecture-ready" });
    selectionInk(byId("architecture-controls"));
  }
}
for (const item of architecture) {
  const button = node("button", "about-architecture-node");
  button.type = "button";
  button.dataset.architecture = item.id;
  button.setAttribute("aria-controls", "architecture-panel");
  const copy = node("span");
  copy.append(node("span", "about-architecture-name", item.label), node("span", "about-architecture-subtitle", item.subtitle));
  button.append(glyph(item.icon || "book"), copy);
  button.addEventListener("click", () => showArchitecture(item));
  byId("architecture-controls").appendChild(button);
}
showArchitecture(architecture[0], false);
observeSelection(byId("architecture-controls"));

// Each component owns its visible entrance. A tall phone section does not
// start the illustration while only the heading is on screen. The shared gate
// also waits for fonts, document visibility and two painted frames.
for (const heading of document.querySelectorAll(".about-section h2")) {
  whenVisible(heading, () => animateElement(heading, "reveal", { channel: "about-heading" }), { channel: "about-heading-ready" });
}
for (const feature of document.querySelectorAll(".about-feature")) {
  whenVisible(feature, () => playGlyph(feature.querySelector("summary"), "about-feature-entry"), { channel: "about-feature-ready" });
}
for (const artwork of document.querySelectorAll(".about-study-image-frame, .about-architecture-art, .about-closing-brand")) {
  whenVisible(artwork, () => {
    if (!artwork.getAnimations({ subtree: true }).length) animateElement(artwork, "flow", { channel: "about-art-entry" });
  }, { channel: "about-art-entry-ready", ready: decodeImages(artwork) });
}

for (const details of document.querySelectorAll("details")) {
  details.addEventListener("toggle", () => {
    if (details.open) {
      animateElement(details.querySelector(".about-feature-body") ?? details.querySelector(":scope > p"), "reveal", { channel: "about-disclosure" });
      playGlyph(details.querySelector("summary"), "about-disclosure-icon");
    } else cancelAnimationsWithin(details);
  });
}

fetch("../data/manifest.json")
  .then((response) => response.ok ? response.json() : Promise.reject())
  .then((manifest) => {
    if (!Array.isArray(manifest.topics)) return;
    const topics = manifest.topics;
    byId("corpus-topics").textContent = String(topics.length);
    byId("corpus-lessons").textContent = String(topics.reduce((sum, topic) => sum + (topic.lessonCount || 0), 0));
    byId("corpus-questions").textContent = String(topics.reduce((sum, topic) => sum + (topic.questionCount || 0), 0));
  }).catch(() => {});
byId("install-control").appendChild(createInstallControl());
initScrollRail({ scroller: document.scrollingElement, content: document.querySelector("main") });
if ("serviceWorker" in navigator) navigator.serviceWorker.register("../sw.js").catch(() => {});
