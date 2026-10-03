import { createInstallControl } from "../js/install.js";
import { initMotion, motionEnabled, createMotionControl } from "../js/motion.js";
import { tourScreens, learningStory, everydayFeatures, engineering, questions, extraSections } from "./content.js";

const node = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};
const link = ({ label, href }, className = "about-text-link") => {
  const element = node("a", className, label);
  // Authored data accepts web links and relative app links, never script URLs.
  const url = new URL(href, location.href);
  if (["https:", "http:"].includes(url.protocol)) element.href = href;
  return element;
};
const byId = (id) => document.getElementById(id);

function sectionHeading(parent, content, headingId) {
  const eyebrow = node("p", "about-eyebrow", content.eyebrow);
  const title = node("h2", null, content.title);
  title.id = headingId;
  parent.append(eyebrow, title);
  if (content.intro) parent.appendChild(node("p", null, content.intro));
}

function renderFeatures(parent, items) {
  for (const item of items) {
    const article = node("article");
    if (item.label) article.appendChild(node("p", "about-feature-label", item.label));
    article.append(node("h3", null, item.title), node("p", null, item.body));
    if (item.action) article.appendChild(link(item.action));
    parent.appendChild(article);
  }
}

sectionHeading(byId("story-heading-content"), learningStory, "story-heading");
for (const [index, item] of learningStory.items.entries()) {
  const row = node("li");
  row.dataset.tone = ["sakura", "iris", "apricot"].includes(item.tone) ? item.tone : "sakura";
  const number = node("span", "about-story-number", String(index + 1).padStart(2, "0"));
  number.setAttribute("aria-hidden", "true");
  const copy = node("div");
  copy.append(node("h3", null, item.title), node("p", null, item.body));
  row.append(number, copy);
  byId("story-list").appendChild(row);
}
sectionHeading(byId("features-heading-content"), everydayFeatures, "features-heading");
renderFeatures(byId("feature-list"), everydayFeatures.items);
sectionHeading(byId("engineering-heading-content"), engineering, "engineering-heading");
renderFeatures(byId("engineering-list"), engineering.items);
for (const item of engineering.links) byId("engineering-links").appendChild(link(item));
for (const item of questions) {
  const detail = node("details");
  detail.append(node("summary", null, item.title), node("p", null, item.body));
  byId("question-list").appendChild(detail);
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

// Finite effects never delay a state change. Shared preference and visibility
// events cancel local effects as well as pausing the shared background field.
initMotion();
byId("about-motion").appendChild(createMotionControl({ compact: true }));
const effects = new Set();
function reveal(element, duration = 180) {
  if (!motionEnabled() || document.hidden || !element.animate) return;
  const effect = element.animate([
    { opacity: 0.65, transform: "translateY(5px)" },
    { opacity: 1, transform: "translateY(0)" },
  ], { duration, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
  effects.add(effect);
  effect.finished.then(() => effects.delete(effect), () => effects.delete(effect));
}
document.addEventListener("motion:change", (event) => {
  if (event.detail.enabled && event.detail.visible) return;
  for (const effect of effects) effect.cancel();
});
reveal(document.querySelector(".about-hero-copy"), 220);

const viewportSpecs = {
  phone: { label: "Telefon", caption: "Telefon görünümü", width: 390, height: 844 },
  wide: { label: "Geniş ekran", caption: "Geniş ekran görünümü", width: 1440, height: 1000 },
};
let selectedScreen = tourScreens[0];
let selectedViewport = "phone";
const screenControls = byId("tour-screen-controls");
const viewportControls = byId("tour-viewport-controls");
const figure = document.querySelector(".about-tour-figure");
const image = byId("tour-image");

function showScreen(announce = true) {
  if (!selectedScreen) return;
  const spec = viewportSpecs[selectedViewport];
  const source = `assets/${selectedScreen.id}-${selectedViewport}.webp`;
  for (const button of screenControls.children) {
    button.setAttribute("aria-pressed", String(button.dataset.tourScreen === selectedScreen.id));
  }
  for (const button of viewportControls.children) {
    button.setAttribute("aria-pressed", String(button.dataset.tourViewport === selectedViewport));
  }
  byId("tour-title").textContent = selectedScreen.title;
  byId("tour-description").textContent = selectedScreen.body;
  byId("tour-detail").textContent = selectedScreen.detail;
  const action = byId("tour-action");
  const actionData = link(selectedScreen.action);
  action.textContent = `${selectedScreen.action.label} ↗`;
  action.href = actionData.href;
  figure.dataset.viewport = selectedViewport;
  image.src = source;
  image.width = spec.width;
  image.height = spec.height;
  image.alt = `${selectedScreen.alt}. ${spec.caption}.`;
  byId("tour-full-image").href = source;
  byId("tour-open-image").href = source;
  byId("tour-caption").textContent = `${selectedScreen.label} · ${spec.caption} · ${spec.width} × ${spec.height}`;
  if (announce) {
    byId("tour-status").textContent = `${selectedScreen.label}, ${spec.caption.toLocaleLowerCase("tr")}. ${selectedScreen.title}`;
    reveal(image);
  }
}

for (const screen of tourScreens) {
  const button = node("button", null, screen.label);
  button.type = "button";
  button.dataset.tourScreen = screen.id;
  button.setAttribute("aria-controls", "tour-image tour-title tour-description");
  button.addEventListener("click", () => {
    if (selectedScreen === screen) return;
    selectedScreen = screen;
    showScreen();
  });
  screenControls.appendChild(button);
}
for (const [id, spec] of Object.entries(viewportSpecs)) {
  const button = node("button", null, spec.label);
  button.type = "button";
  button.dataset.tourViewport = id;
  button.setAttribute("aria-controls", "tour-image");
  button.addEventListener("click", () => {
    if (selectedViewport === id) return;
    selectedViewport = id;
    showScreen();
  });
  viewportControls.appendChild(button);
}
screenControls.hidden = false;
viewportControls.hidden = false;
showScreen(false);

// The displayed material count follows the actual content index. The HTML
// remains an accurate release fallback if offline data was not cached yet.
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
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("../sw.js").catch(() => {});
}
