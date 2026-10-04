import { createInstallControl } from "../js/install.js";
import { initMotion, motionEnabled } from "../js/motion.js";
import { animateElement, animateSequence, cancelAnimationsWithin, whenVisible } from "../js/interactions.js";
import { initScrollRail } from "../js/scroll-rail.js";
import { createBrand } from "../js/brand.js";
import { icon } from "../js/icons.js";
import { folioChapters, studyStages, architecture, everydayFeatures, engineering, questions, extraSections } from "./content.js";

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
// Decoding and observation belong to the artwork, never to usable state.
const decodeImages = (element) => Promise.all([...element.querySelectorAll("img")]
  .map((image) => image.decode().catch(() => {})));

/** A directly inspectable product folio. State is synchronous; every animated
 * piece is expendable. Dragging has native-button alternatives and leaves
 * browser vertical scrolling and pinch zoom intact. No frame loop runs idle. */
function mountFolio(chapters) {
  const root = byId("study-folio");
  const stage = byId("folio-stage");
  const deck = byId("folio-deck");
  const tabs = byId("folio-tabs");
  const inspect = byId("folio-inspect");
  const rotate = byId("folio-rotate");
  if (!chapters.length) { root.hidden = true; return; }
  let current = 0;
  let expanded = false;
  let turned = false;
  let drag = null;
  let suppressClick = false;
  let revision = 0;
  const leaves = [];
  const buttons = [];
  const tone = (item) => ["accent", "secondary", "tertiary", "cool"].includes(item.tone) ? item.tone : "accent";
  for (const [index, item] of chapters.entries()) {
    const tab = node("button", "folio-tab");
    tab.type = "button";
    tab.dataset.folioChapter = item.id;
    tab.dataset.tone = tone(item);
    tab.setAttribute("aria-controls", "folio-deck folio-caption");
    const number = node("span", "folio-tab-number", String(index + 1).padStart(2, "0"));
    number.setAttribute("aria-hidden", "true");
    tab.append(number, node("span", null, item.label));
    tab.addEventListener("click", () => select(index));
    buttons.push(tab);
    tabs.appendChild(tab);

    const leaf = node("div", "folio-leaf");
    leaf.dataset.folioLeaf = item.id;
    leaf.dataset.tone = tone(item);
    const face = node("button", "folio-leaf-face");
    face.type = "button";
    face.dataset.folioFace = item.id;
    const top = node("span", "folio-sheet-top");
    top.append(glyph(item.icon), node("span", "folio-sheet-label", item.sheetTitle), node("span", "folio-sheet-number", String(index + 1).padStart(2, "0")));
    const view = node("span", "folio-window");
    const picture = node("picture");
    const source = node("source");
    source.media = "(min-width: 700px)";
    source.srcset = `assets/${item.capture}-wide.webp`;
    const image = node("img");
    image.src = `assets/${item.capture}-phone.webp`;
    image.width = 390; image.height = 844;
    image.alt = ""; // The button has an action name; real-media provenance is visible below.
    image.draggable = false;
    image.decoding = "async";
    if (index === 0) image.fetchPriority = "high";
    else image.loading = "lazy";
    picture.append(source, image); view.appendChild(picture);
    const foot = node("span", "folio-sheet-foot", item.sheetNote);
    const corner = node("span", "folio-sheet-corner"); corner.setAttribute("aria-hidden", "true");
    face.append(top, view, foot, corner);
    face.addEventListener("click", (event) => {
      if (suppressClick && event.detail > 0) { suppressClick = false; event.preventDefault(); return; }
      if (current === index) setExpanded(!expanded);
      else select(index);
    });
    leaf.appendChild(face); deck.appendChild(leaf); leaves.push(leaf);
  }
  document.querySelector(".folio-caption").id = "folio-caption";
  function paint() {
    root.dataset.chapter = chapters[current].id;
    root.dataset.tone = tone(chapters[current]);
    deck.dataset.expanded = String(expanded);
    deck.dataset.view = turned ? "angle" : "front";
    deck.style.setProperty("--folio-view-y", turned ? "-18deg" : "0deg");
    deck.style.setProperty("--folio-view-x", turned ? "7deg" : "0deg");
    for (const [index, leaf] of leaves.entries()) {
      const distance = (index - current + chapters.length) % chapters.length;
      const slot = distance === 0 ? 0 : distance % 2 ? -Math.ceil(distance / 2) : Math.ceil(distance / 2);
      leaf.style.setProperty("--folio-slot", String(slot));
      leaf.style.zIndex = String(chapters.length - Math.abs(slot));
      leaf.dataset.active = String(index === current);
      const face = leaf.querySelector("button");
      face.tabIndex = index === current || expanded ? 0 : -1;
      face.setAttribute("aria-label", index === current
        ? `${chapters[index].sheetTitle}. ${expanded ? "Katmanları birleştir" : "Katmanları aç"}`
        : `${chapters[index].sheetTitle} görünümünü öne getir`);
      face.setAttribute("aria-pressed", String(index === current));
      buttons[index].setAttribute("aria-pressed", String(index === current));
    }
    inspect.setAttribute("aria-pressed", String(expanded));
    inspect.querySelector("[data-folio-label]").textContent = expanded ? "Katmanları birleştir" : "Katmanları aç";
    rotate.setAttribute("aria-pressed", String(turned));
    rotate.querySelector("[data-folio-label]").textContent = turned ? "Öne dön" : "Döndür";
    byId("folio-count").textContent = `${String(current + 1).padStart(2, "0")}—${String(chapters.length).padStart(2, "0")}`;
  }
  function announce(text) { byId("folio-status").textContent = text; }
  function flourish(kind = "folio", direction = "forward") {
    const ticket = ++revision;
    const leaf = leaves[current];
    cancelAnimationsWithin(deck);
    whenVisible(leaf, () => {
      if (revision !== ticket) return;
      animateSequence([
        { element: leaf.querySelector(".folio-window"), kind, at: 0 },
        { element: leaf.querySelector("svg"), kind: "complete", at: 75 },
        { element: leaf.querySelector(".folio-sheet-corner"), kind: "unfold", at: 130 },
        { element: root.querySelector(".folio-thread"), kind: "trace", at: 160 },
      ], { channel: "folio-turn", direction });
    }, { channel: "folio-ready", ready: decodeImages(leaf), threshold: .1 });
  }
  function select(index, announceChange = true) {
    const previous = current;
    current = (index + chapters.length) % chapters.length;
    const item = chapters[current];
    byId("folio-label").textContent = `${String(current + 1).padStart(2, "0")} / ${item.label}`;
    byId("folio-heading").textContent = item.title;
    byId("folio-description").textContent = item.body;
    setAction(byId("folio-action"), item.action);
    paint();
    if (announceChange) {
      announce(`${item.label}. ${item.title}`);
      flourish("folio", current < previous ? "back" : "forward");
    }
  }
  function setExpanded(value) {
    expanded = value;
    paint();
    announce(expanded ? "Üç çalışma katmanı açık. Bir yaprağı seçerek incele." : `${chapters[current].label} önde. Katmanlar birleşti.`);
    flourish(expanded ? "fan" : "folio");
  }
  inspect.addEventListener("click", () => setExpanded(!expanded));
  rotate.addEventListener("click", () => {
    turned = !turned;
    paint();
    announce(turned ? "Dosya yan açıdan gösteriliyor. Öne dön düğmesiyle düz görünümü aç." : "Dosya önden gösteriliyor.");
    animateElement(rotate.querySelector(".folio-rotate-mark"), "complete", { channel: "folio-angle-mark" });
  });
  tabs.addEventListener("keydown", (event) => {
    let next;
    if (event.key === "ArrowRight") next = current + 1;
    else if (event.key === "ArrowLeft") next = current - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = chapters.length - 1;
    else return;
    event.preventDefault();
    select(next);
    buttons[current].focus({ preventScroll: true });
  });
  function resetDrag() {
    const pointer = drag?.id;
    drag = null;
    deck.dataset.dragging = "false";
    deck.style.setProperty("--folio-drag-x", "0deg");
    deck.style.setProperty("--folio-drag-y", "0deg");
    if (pointer !== undefined && stage.hasPointerCapture?.(pointer)) stage.releasePointerCapture(pointer);
  }
  stage.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
    suppressClick = false;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, active: false };
  });
  stage.addEventListener("pointermove", (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.active) {
      if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) { resetDrag(); return; }
      if (Math.abs(dx) < 8) return;
      drag.active = true;
      suppressClick = true;
      stage.setPointerCapture?.(event.pointerId);
      cancelAnimationsWithin(deck);
      deck.dataset.dragging = "true";
    }
    drag.dx = dx;
    if (motionEnabled()) {
      deck.style.setProperty("--folio-drag-y", `${Math.max(-16, Math.min(16, dx / 8))}deg`);
      deck.style.setProperty("--folio-drag-x", `${Math.max(-5, Math.min(5, -dy / 18))}deg`);
    }
  });
  stage.addEventListener("pointerup", (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    const turn = drag.active && Math.abs(drag.dx) >= 46;
    const direction = drag.dx < 0 ? 1 : -1;
    resetDrag();
    if (turn) select(current + direction);
  });
  stage.addEventListener("pointercancel", resetDrag);
  stage.addEventListener("lostpointercapture", () => { if (drag) resetDrag(); });
  stage.addEventListener("pointerleave", () => { if (drag && !drag.active) resetDrag(); });
  document.addEventListener("motion:change", (event) => {
    if (!event.detail.enabled || !event.detail.visible) { resetDrag(); revision++; cancelAnimationsWithin(deck); }
  });
  window.addEventListener("pagehide", resetDrag);
  window.addEventListener("blur", resetDrag);
  select(0, false);
  flourish("fan");
}
mountFolio(folioChapters);

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
