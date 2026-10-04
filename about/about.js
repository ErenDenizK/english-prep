import { createInstallControl } from "../js/install.js";
import { initMotion, createMotionControl } from "../js/motion.js";
import { animateElement, animateSequence, cancelAnimationsWithin, bindPointerScene } from "../js/interactions.js";
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
byId("about-motion").appendChild(createMotionControl());
bindPointerScene(document.querySelector(".about-hero-visual"), {
  target: document.querySelector(".about-hero-scene"), maxTilt: 2, maxShift: 6,
});
// The three planes have one shared, cancellable entrance. Their final geometry
// is already in CSS: skipping or cancelling motion never leaves artwork hidden.
animateSequence([
  { element: document.querySelector(".about-hero-wide"), kind: "story", at: 0 },
  { element: document.querySelector(".about-hero-phone"), kind: "scene", at: 90 },
  { element: document.querySelector(".about-hero-trace .about-trace"), kind: "draw", at: 160 },
], { channel: "about-opening" });

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
  if (!stage || stage === currentStage) return;
  currentStage = stage;
  for (const button of byId("study-controls").children) {
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
    cancelAnimationsWithin(document.querySelector(".about-study-art"));
    cancelAnimationsWithin(byId("study-controls"));
    animateSequence([
      { element: document.querySelector(".about-study-image-frame"), kind: "scene", at: 0 },
      { element: byId("study-step-label"), kind: "reveal", at: 80 },
      { element: byId("study-controls").querySelector('[aria-pressed="true"] svg'), kind: "mark", at: 0 },
    ], { channel: "about-story" });
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

let currentArchitecture = null;
function showArchitecture(item, announce = true) {
  if (!item || item === currentArchitecture) return;
  currentArchitecture = item;
  for (const button of byId("architecture-controls").children) {
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
    cancelAnimationsWithin(document.querySelector(".about-architecture-art"));
    cancelAnimationsWithin(byId("architecture-controls"));
    animateSequence([
      { element: document.querySelector(`[data-layer="${CSS.escape(item.id)}"]`), kind: "scene", at: 0 },
      { element: document.querySelector(".about-architecture-thread"), kind: "draw", at: 80 },
      { element: byId("architecture-controls").querySelector('[aria-pressed="true"] svg'), kind: "mark", at: 0 },
    ], { channel: "about-architecture" });
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

// A one-shot observer sequences already-visible editorial elements. It does
// not control content visibility, scroll position, focus or semantic state.
function revealSection(section) {
  const heading = section.querySelector("h2");
  const steps = [{ element: heading, kind: "reveal", at: 0 }];
  animateSequence(steps, { channel: "about-section" });
}
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      if (entry.target.matches(".about-feature")) {
        animateSequence([
          { element: entry.target.querySelector(".about-feature-sign svg"), kind: "scene", at: 0 },
          { element: entry.target.querySelector("h3"), kind: "reveal", at: 70 },
        ], { channel: "about-feature" });
      } else if (entry.target.matches(".about-study-image-frame, .about-architecture-art, .about-closing-brand")) {
        // A tall phone section can start long before its illustration enters.
        // Observe the artwork itself, and let an in-flight user scene win.
        if (!entry.target.getAnimations({ subtree: true }).length) {
          animateElement(entry.target, "story", { channel: "about-art-entry" });
        }
      } else revealSection(entry.target);
      observer.unobserve(entry.target);
    }
  }, { threshold: 0, rootMargin: "0px 0px -8% 0px" });
  for (const section of document.querySelectorAll(".about-section, .about-feature, .about-study-image-frame, .about-architecture-art, .about-closing-brand")) observer.observe(section);
  window.addEventListener("pagehide", () => observer.disconnect(), { once: true });
}
for (const details of document.querySelectorAll("details")) {
  details.addEventListener("toggle", () => {
    if (details.open) {
      animateElement(details.querySelector(".about-feature-body") ?? details.querySelector(":scope > p"), "reveal", { channel: "about-disclosure" });
      animateElement(details.querySelector(".about-feature-sign svg"), "mark", { channel: "about-disclosure-icon" });
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
if ("serviceWorker" in navigator) navigator.serviceWorker.register("../sw.js").catch(() => {});
