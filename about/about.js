// /about/ — the product's thesis, shown rather than described.
// No innerHTML: every node is built here and text is set with textContent.
// Learning data is never written: this page only reads ../data.
import { initMotion, motionEnabled } from "../js/motion.js";
import { spring } from "../js/interactions.js";
import { initScrollRail } from "../js/scroll-rail.js";
import { createInstallControl } from "../js/install.js";
import { lessonId } from "../js/topics.js";
import { icon } from "../js/icons.js";
import { TIER_ORDER, TIER_LABELS } from "../js/tiers.js";
import { pairs, manifesto, anatomy, flow, craft, questions } from "./content.js";

const SVG = "http://www.w3.org/2000/svg";
const DATA = new URL("../data/", import.meta.url);
const byId = (id) => document.getElementById(id);

function node(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined && text !== null) element.textContent = text;
  return element;
}
function shape(tag, attributes = {}, className) {
  const element = document.createElementNS(SVG, tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, String(value));
  if (className) element.setAttribute("class", className);
  return element;
}
function svgRoot(viewBox, label) {
  const root = shape("svg", { viewBox, focusable: "false" });
  if (label) {
    root.setAttribute("role", "img");
    root.setAttribute("aria-label", label);
  } else {
    root.setAttribute("aria-hidden", "true");
  }
  return root;
}
function svgText(x, y, text, className, anchor = "middle") {
  const element = shape("text", { x, y, "text-anchor": anchor }, className);
  element.textContent = text;
  return element;
}
const appLink = (hash) => `../index.html${hash}`;
// Charter rule 4 (docs/PRINCIPLES.md §6): arrows are icons, never
// characters. The static links name theirs in index.html as
// <span data-icon="…">, filled here; without the module they read as words.
const linkIcon = (name) => icon(name, { size: 16 });
function initIcons() {
  for (const slot of document.querySelectorAll("span[data-icon]")) slot.replaceWith(linkIcon(slot.dataset.icon));
}
const canMove = () => motionEnabled() && !document.hidden;

async function json(path) {
  const response = await fetch(new URL(path, DATA));
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${path}`);
  return response.json();
}

/* ---------------------------------------------------------------------
 * Reveal. The head script hid [data-reveal] before first paint only when
 * motion is allowed; here each one is shown as it approaches the viewport.
 * Spring easings come from the app's own simulation (js/interactions.js).
 * ------------------------------------------------------------------- */
function initReveal() {
  const root = document.documentElement;
  clearTimeout(window.__aboutRevealFallback);
  root.style.setProperty("--ab-spring", spring("lively").easing);
  root.style.setProperty("--ab-spring-soft", spring("soft").easing);
  root.style.setProperty("--ab-spring-bouncy", spring("bouncy").easing);
  if (!root.classList.contains("reveal-ready")) return;
  const showAll = () => root.classList.add("reveal-all");
  document.addEventListener("motion:change", (event) => { if (!event.detail.enabled) showAll(); });
  const observer = new IntersectionObserver((entries) => {
    // Siblings that arrive in the same frame cascade instead of popping as one.
    const arriving = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target)
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
    arriving.forEach((element, index) => {
      element.style.setProperty("--i", String(index));
      element.classList.add("is-in");
      observer.unobserve(element);
    });
  }, { rootMargin: "0px 0px -6% 0px", threshold: 0 });
  for (const element of document.querySelectorAll("[data-reveal]")) observer.observe(element);
}

/* ---------------------------------------------------------------------
 * 1 · The lens: one pair of correct sentences, one diagram that changes
 * with the meaning. Both halves are right; that is the whole point.
 * ------------------------------------------------------------------- */
function timelineDiagram(pair) {
  const root = svgRoot("0 0 360 150");
  root.classList.add("ab-diagram");
  const axis = shape("path", { d: "M20 98H334" }, "ab-d-axis");
  const arrow = shape("path", { d: "M326 92l8 6-8 6" }, "ab-d-axis");
  root.append(axis, arrow);
  root.append(svgText(28, 128, "geçmiş", "ab-d-label", "start"));
  root.append(svgText(268, 128, "şimdi", "ab-d-label ab-d-label--now"));
  root.append(shape("path", { d: "M268 82v32" }, "ab-d-now"));
  const parts = [];
  const add = (element, states) => { element.dataset.on = states; parts.push(element); root.appendChild(element); return element; };
  if (pair.id === "perfect") {
    add(shape("path", { d: "M100 80v36M132 80v36", pathLength: 1 }, "ab-d-stroke ab-d-closed"), "closed");
    add(svgText(116, 70, "kapandı", "ab-d-note"), "closed");
    add(shape("path", { d: "M116 90C156 26 228 26 266 88", pathLength: 1 }, "ab-d-stroke ab-d-link"), "linked");
    add(svgText(192, 30, "sonucu şimdide", "ab-d-note ab-d-note--accent"), "linked");
    add(shape("circle", { cx: 268, cy: 98, r: 11 }, "ab-d-halo"), "linked");
    add(shape("circle", { cx: 116, cy: 98, r: 7 }, "ab-d-event"), "closed linked");
  } else {
    [44, 88, 132, 176, 220, 268, 312].forEach((x, index) => {
      const dot = add(shape("circle", { cx: x, cy: 98, r: 5 }, "ab-d-event ab-d-repeat"), "habit");
      dot.style.setProperty("--k", String(index));
    });
    add(svgText(176, 70, "düzenli olarak · genel olarak", "ab-d-note"), "habit");
    add(shape("rect", { x: 222, y: 87, width: 92, height: 22, rx: 11 }, "ab-d-band"), "ongoing");
    add(svgText(268, 70, "şu sıralar", "ab-d-note ab-d-note--accent"), "ongoing");
  }
  return { root, parts };
}

function pathDiagram() {
  const root = svgRoot("0 0 360 150");
  root.classList.add("ab-diagram");
  const parts = [];
  const add = (element, states) => { element.dataset.on = states; parts.push(element); root.appendChild(element); return element; };
  root.append(shape("circle", { cx: 34, cy: 80, r: 7 }, "ab-d-event"));
  root.append(svgText(34, 112, "sen", "ab-d-label"));
  root.append(shape("path", { d: "M42 80H140" }, "ab-d-axis"));
  // Upper: tell. Lower: don't tell.
  root.append(shape("path", { d: "M140 80C176 80 196 40 236 40H300" }, "ab-d-axis ab-d-branch"));
  root.append(shape("path", { d: "M140 80C176 80 196 120 236 120H300" }, "ab-d-axis ab-d-branch"));
  root.append(svgText(312, 44, "söyle", "ab-d-label", "start"));
  root.append(svgText(312, 124, "söyleme", "ab-d-label", "start"));
  add(shape("path", { d: "M140 80C176 80 196 120 236 120H300", pathLength: 1 }, "ab-d-stroke ab-d-open"), "blocked optional");
  add(shape("path", { d: "M140 80C176 80 196 40 236 40H300", pathLength: 1 }, "ab-d-stroke ab-d-open"), "optional");
  add(shape("path", { d: "M206 28l20 24M226 28l-20 24" }, "ab-d-block"), "blocked");
  add(svgText(216, 20, "yasak", "ab-d-note ab-d-note--warn"), "blocked");
  add(svgText(216, 20, "serbest", "ab-d-note ab-d-note--accent"), "optional");
  add(svgText(258, 146, "serbest", "ab-d-note ab-d-note--accent"), "optional");
  add(svgText(258, 146, "tek yol", "ab-d-note"), "blocked");
  return { root, parts };
}

function initLens() {
  const forms = byId("lens-forms");
  const stage = byId("lens-stage");
  const reading = byId("lens-reading");
  const pager = byId("lens-pager");
  const kicker = byId("lens-kicker");
  const title = byId("lens-title");
  const lesson = byId("lens-lesson");
  if (!forms || !stage) return;
  let pairIndex = 0;
  let formIndex = 0;
  let diagram = null;
  let timer = null;
  let touched = false;

  const pagerButtons = pairs.map((pair, index) => {
    const button = node("button", "ab-pager__item");
    button.type = "button";
    button.append(node("span", "ab-pager__n", String(index + 1).padStart(2, "0")), node("span", "ab-pager__q", pair.question));
    button.addEventListener("click", () => { stop(); showPair(index, { focus: false }); });
    pager.appendChild(button);
    return button;
  });
  const autoplay = node("button", "ab-autoplay");
  autoplay.type = "button";
  autoplay.setAttribute("aria-label", "Ayrımları otomatik göster");
  autoplay.append(node("span", "ab-autoplay__icon"));
  autoplay.addEventListener("click", () => { if (timer) stop(); else { touched = false; play(); } });
  pager.appendChild(autoplay);

  function radios() { return [...forms.querySelectorAll('[role="radio"]')]; }

  function showForm(index, { focus = false } = {}) {
    const pair = pairs[pairIndex];
    formIndex = index;
    const form = pair.forms[index];
    radios().forEach((radio, i) => {
      const on = i === index;
      radio.setAttribute("aria-checked", String(on));
      radio.tabIndex = on ? 0 : -1;
      radio.classList.toggle("is-on", on);
    });
    if (focus) radios()[index]?.focus();
    stage.dataset.state = form.state;
    for (const part of diagram.parts) part.classList.toggle("is-on", part.dataset.on.split(" ").includes(form.state));
    reading.replaceChildren(node("strong", null, `${form.name}. `), document.createTextNode(form.reading));
  }

  function showPair(index, { focus = false } = {}) {
    pairIndex = (index + pairs.length) % pairs.length;
    const pair = pairs[pairIndex];
    kicker.textContent = `Ayrım ${pairIndex + 1} / ${pairs.length}`;
    title.textContent = pair.question;
    lesson.href = appLink(`#egitim/${lessonId(pair.topic, pair.category)}`);
    pagerButtons.forEach((button, i) => button.setAttribute("aria-pressed", String(i === pairIndex)));
    forms.replaceChildren(...pair.forms.map((form, i) => {
      const radio = node("button", "ab-sentence");
      radio.type = "button";
      radio.setAttribute("role", "radio");
      radio.lang = "en";
      radio.append(document.createTextNode(form.before), node("mark", "ab-sentence__focus", form.focus), document.createTextNode(form.after));
      const name = node("span", "ab-sentence__name", form.name);
      name.lang = "en";
      radio.append(name);
      radio.addEventListener("click", () => { stop(); showForm(i); });
      return radio;
    }));
    diagram = pair.diagram === "path" ? pathDiagram(pair) : timelineDiagram(pair);
    stage.dataset.diagram = pair.diagram;
    stage.replaceChildren(diagram.root);
    // The new diagram's first state is drawn without transition, then lives.
    stage.classList.add("is-switching");
    showForm(0, { focus });
    requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.remove("is-switching")));
  }

  forms.addEventListener("keydown", (event) => {
    const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    stop();
    showForm((formIndex + keys[event.key] + 2) % 2, { focus: true });
  });

  // Auto-play walks every pair once (both halves), only while the lens is
  // on screen and motion is allowed. Any interaction stops it; a button
  // restarts it (WCAG 2.2.2: moving content can be paused).
  let visible = false;
  function tick() {
    if (!visible || !canMove()) return;
    if (formIndex === 0) showForm(1);
    else if (pairIndex < pairs.length - 1) showPair(pairIndex + 1);
    else { stop(); return; }
  }
  function play() {
    if (touched || !canMove()) return;
    clearInterval(timer);
    timer = setInterval(tick, 2800);
    autoplay.setAttribute("aria-pressed", "true");
    autoplay.dataset.playing = "true";
  }
  function stop() {
    touched = true;
    clearInterval(timer);
    timer = null;
    autoplay.setAttribute("aria-pressed", "false");
    autoplay.dataset.playing = "false";
  }
  for (const type of ["pointerdown", "keydown", "focusin"]) {
    byId("lens").addEventListener(type, (event) => { if (!autoplay.contains(event.target)) stop(); });
  }
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.4 }).observe(byId("lens"));
  document.addEventListener("motion:change", (event) => { if (!event.detail.enabled) stop(); });

  showPair(0);
  autoplay.setAttribute("aria-pressed", "false");
  if (canMove()) setTimeout(play, 1600);
}

/* ---------------------------------------------------------------------
 * 2 · Manifesto: lit word by word with reading progress.
 * ------------------------------------------------------------------- */
function initManifesto() {
  const text = byId("manifesto-text");
  if (!text) return;
  const words = [];
  const lines = manifesto.map((line) => {
    const element = node("span", "ab-manifesto__line");
    line.split(" ").forEach((word, index) => {
      if (index) element.appendChild(document.createTextNode(" "));
      const span = node("span", "ab-word", word);
      words.push(span);
      element.appendChild(span);
    });
    return element;
  });
  text.replaceChildren(...lines.flatMap((line, i) => (i ? [document.createTextNode(" "), line] : [line])));
  let frame = null;
  const update = () => {
    frame = null;
    if (!canMove()) { text.dataset.lit = "all"; return; }
    delete text.dataset.lit;
    const box = text.getBoundingClientRect();
    const view = window.innerHeight;
    const progress = Math.min(1, Math.max(0, (view * 0.82 - box.top) / (box.height + view * 0.25)));
    const lit = Math.round(progress * words.length);
    words.forEach((word, index) => word.classList.toggle("is-lit", index < lit));
  };
  const schedule = () => { if (frame === null) frame = requestAnimationFrame(update); };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  document.addEventListener("motion:change", schedule);
  update();
}

/* ---------------------------------------------------------------------
 * 3 · The map, straight from data/manifest.json.
 * ------------------------------------------------------------------- */
function figure(list, value, label) {
  const wrap = node("div", "ab-figure");
  const term = node("dt", null, label);
  const amount = node("dd", null, value);
  wrap.append(amount, term);
  list.appendChild(wrap);
  return amount;
}

async function initMap() {
  const grid = byId("map-grid");
  const figures = byId("map-figures");
  let manifest;
  try {
    manifest = await json("manifest.json");
  } catch {
    grid.replaceChildren(node("p", "ab-quiet", "Ders listesi şu an yüklenemedi. Uygulamada tüm dersler açık."));
    return null;
  }
  const topics = manifest.topics;
  const lessons = topics.reduce((sum, topic) => sum + topic.lessons.length, 0);
  const asked = topics.reduce((sum, topic) => sum + (topic.questionCount ?? 0), 0);
  figure(figures, String(topics.length), "konu");
  figure(figures, String(lessons), "makale dersi");
  figure(figures, String(asked), "açıklamalı soru");
  const notes = figure(figures, "—", "yanlış seçenek notu");

  const order = new Map(TIER_ORDER.map((tier, index) => [tier, index]));
  const sorted = [...topics].sort((a, b) => (order.get(a.tier) ?? 99) - (order.get(b.tier) ?? 99));
  const cards = sorted.map((topic, topicIndex) => {
    const card = node("article", "ab-topic");
    card.style.setProperty("--hue", String((topicIndex * 37) % 360));
    card.style.setProperty("--i", String(topicIndex));
    const head = node("header", "ab-topic__head");
    head.append(node("p", "ab-topic__tier", TIER_LABELS[topic.tier] ?? ""));
    const name = node("h3", "ab-topic__title", topic.title);
    name.lang = "en";
    head.append(name);
    const preview = node("p", "ab-topic__gloss", topic.gloss);
    const chips = node("ul", "ab-topic__chips");
    for (const entry of topic.lessons) {
      const item = node("li");
      const chip = node("a", "ab-chip");
      chip.href = appLink(`#egitim/${lessonId(topic.id, entry.category)}`);
      const label = node("span", "ab-chip__label", entry.category);
      label.lang = "en";
      chip.append(label);
      chip.title = entry.summary;
      const show = () => { preview.textContent = entry.summary; preview.classList.add("is-question"); };
      const reset = () => { preview.textContent = topic.gloss; preview.classList.remove("is-question"); };
      chip.addEventListener("pointerenter", show);
      chip.addEventListener("focus", show);
      chip.addEventListener("pointerleave", reset);
      chip.addEventListener("blur", reset);
      // The summary is the lesson's question; give it to assistive tech too.
      const summary = node("span", "ab-sr", ` — ${entry.summary}`);
      chip.append(summary);
      item.appendChild(chip);
      chips.appendChild(item);
    }
    card.append(head, preview, chips);
    card.dataset.reveal = "";
    return card;
  });
  grid.replaceChildren(...cards);
  observeLate(cards);

  // The option-note figure needs every topic file; fetch it only when the map
  // is near, since the rest of the page does not depend on it.
  const near = new IntersectionObserver(async ([entry]) => {
    if (!entry.isIntersecting) return;
    near.disconnect();
    try {
      const files = await Promise.all(topics.map((topic) => json(topic.file.replace(/^data\//, ""))));
      const count = files.reduce((sum, file) => sum + (file.questions ?? [])
        .reduce((inner, question) => inner + Object.keys(question.optionNotes ?? {}).length, 0), 0);
      notes.textContent = String(count);
    } catch {
      notes.parentElement.remove();
    }
  }, { rootMargin: "400px 0px" });
  near.observe(grid);
  return manifest;
}

// Nodes created after the first observer pass still reveal on approach.
let lateObserver = null;
function observeLate(elements) {
  if (!document.documentElement.classList.contains("reveal-ready")) return;
  lateObserver ??= new IntersectionObserver((entries) => {
    const arriving = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target);
    arriving.forEach((element, index) => {
      element.style.setProperty("--i", String(index));
      element.classList.add("is-in");
      lateObserver.unobserve(element);
    });
  }, { rootMargin: "0px 0px -6% 0px" });
  elements.forEach((element) => lateObserver.observe(element));
}

/* ---------------------------------------------------------------------
 * 4 · Anatomy: one real question, answerable, with its parts named.
 * ------------------------------------------------------------------- */
async function initAnatomy(manifestPromise) {
  const specimen = byId("specimen");
  const callouts = byId("callouts");
  if (!specimen) return;
  const manifest = await manifestPromise;
  const topic = manifest?.topics.find((entry) => entry.id === anatomy.topic);
  let question = null;
  try {
    const file = topic ? await json(topic.file.replace(/^data\//, "")) : null;
    question = file?.questions.find((entry) => entry.id === anatomy.questionId) ?? null;
  } catch { /* handled below */ }
  if (!question) {
    byId("soru").hidden = true;
    return;
  }

  specimen.replaceChildren();
  const tag = node("p", "ab-specimen__tag");
  const category = node("span", "ab-specimen__category", question.category);
  category.lang = "en";
  tag.append(node("span", null, "Uygulamadan bir soru · "), category);
  const prompt = node("p", "ab-specimen__prompt");
  prompt.lang = "en";
  prompt.dataset.part = "context";
  const [before, after = ""] = question.paragraph.split(/_{2,}/);
  const blank = node("span", "ab-blank");
  blank.setAttribute("aria-label", "boşluk");
  prompt.append(document.createTextNode(before), blank, document.createTextNode(after));

  const options = node("div", "ab-options");
  options.dataset.part = "options";
  options.setAttribute("role", "group");
  options.setAttribute("aria-label", "Seçenekler");
  const result = node("div", "ab-result");
  result.setAttribute("aria-live", "polite");
  const correct = question.options[question.correctIndex];

  const buttons = question.options.map((option, index) => {
    const button = node("button", "ab-option");
    button.type = "button";
    const key = node("span", "ab-option__key", String(index + 1));
    key.setAttribute("aria-hidden", "true");
    const text = node("span", "ab-option__text", option);
    text.lang = "en";
    button.append(key, text);
    button.addEventListener("click", () => choose(option));
    options.appendChild(button);
    return button;
  });

  function idle() {
    result.replaceChildren(node("p", "ab-result__hint", "Bir seçenek seç. Cevabın kaydedilmez; bu yalnızca bir örnek."));
  }

  function choose(option) {
    const right = option === correct;
    blank.textContent = option;
    blank.classList.toggle("is-right", right);
    blank.classList.toggle("is-wrong", !right);
    buttons.forEach((button, index) => {
      const value = question.options[index];
      button.classList.toggle("is-right", value === correct);
      button.classList.toggle("is-wrong", value === option && !right);
      button.classList.toggle("is-picked", value === option);
      button.setAttribute("aria-pressed", String(value === option));
    });
    const verdict = node("p", `ab-result__verdict ${right ? "is-right" : "is-wrong"}`, right ? "Doğru." : "Bu değil.");
    const parts = [verdict];
    if (!right && question.optionNotes?.[option]) {
      const note = node("div", "ab-result__note");
      note.dataset.part = "notes";
      const label = node("p", "ab-result__label");
      const name = node("span", null, option);
      name.lang = "en";
      label.append(document.createTextNode("Neden "), name, document.createTextNode(" değil?"));
      note.append(label, node("p", null, question.optionNotes[option]));
      parts.push(note);
    }
    const why = node("div", "ab-result__why");
    if (right) why.dataset.part = "notes";
    const answer = node("p", "ab-result__label");
    const value = node("span", null, correct);
    value.lang = "en";
    answer.append(document.createTextNode("Doğru cevap: "), value);
    why.append(answer, node("p", null, question.explanation));
    parts.push(why);
    if (question.tip) {
      const tip = node("p", "ab-result__tip");
      tip.dataset.part = "tip";
      tip.append(node("strong", null, "İpucu. "), document.createTextNode(question.tip));
      parts.push(tip);
    }
    const foot = node("div", "ab-result__foot");
    const go = node("a", "ab-link", "Bu ayrımın dersini aç ");
    go.href = appLink(`#egitim/${lessonId(anatomy.topic, question.category)}`);
    go.dataset.part = "lesson";
    go.append(linkIcon("arrow-up-right"));
    const again = node("button", "ab-link ab-link--button", "Başka bir seçenek dene");
    again.type = "button";
    again.addEventListener("click", () => {
      blank.textContent = "";
      blank.className = "ab-blank";
      buttons.forEach((button) => { button.className = "ab-option"; button.removeAttribute("aria-pressed"); });
      idle();
      buttons[0].focus();
    });
    foot.append(go, again);
    parts.push(foot);
    result.replaceChildren(...parts);
    result.classList.remove("is-new");
    void result.offsetWidth;
    result.classList.add("is-new");
  }

  specimen.append(tag, prompt, options, result);
  idle();

  // Callouts name the parts. Hover or focus lights the part they name.
  callouts.replaceChildren(...anatomy.callouts.map((callout, index) => {
    const item = node("li", "ab-callout");
    const button = node("button", "ab-callout__button");
    button.type = "button";
    button.append(node("span", "ab-callout__n", String(index + 1)), node("span", "ab-callout__title", callout.title));
    const body = node("p", "ab-callout__body", callout.body);
    const light = () => { specimen.dataset.highlight = callout.part; };
    const dim = () => { delete specimen.dataset.highlight; };
    button.addEventListener("pointerenter", light);
    button.addEventListener("pointerleave", dim);
    button.addEventListener("focus", light);
    button.addEventListener("blur", dim);
    button.addEventListener("click", () => {
      // Parts 3–5 exist after an answer; show one rather than point at nothing.
      if (!specimen.querySelector(`[data-part="${callout.part}"]`)) {
        const wrong = question.options.find((option) => option !== correct && question.optionNotes?.[option]);
        choose(wrong ?? correct);
      }
      light();
      specimen.querySelector(`[data-part="${callout.part}"]`)?.scrollIntoView({ block: "nearest", behavior: canMove() ? "smooth" : "auto" });
    });
    item.append(button, body);
    return item;
  }));
}

/* ---------------------------------------------------------------------
 * 5 · The loop: steps scroll past a device whose screen follows them.
 * ------------------------------------------------------------------- */
function initFlow() {
  const list = byId("flow-steps");
  const screen = byId("flow-screen");
  const device = byId("flow-device");
  if (!list) return;
  const image = (step, className) => {
    const img = node("img", className);
    img.src = `assets/${step.capture}-phone.webp`;
    img.width = 390;
    img.height = 844;
    img.alt = step.alt;
    img.loading = "lazy";
    img.decoding = "async";
    return img;
  };
  const items = flow.map((step) => {
    const item = node("li", "ab-step");
    item.dataset.step = step.id;
    item.dataset.reveal = "";
    const head = node("p", "ab-step__head");
    head.append(node("span", "ab-step__n", step.step), node("span", "ab-step__label", step.label));
    const link = node("a", "ab-link", "Uygulamada aç ");
    link.href = step.href;
    link.append(linkIcon("arrow-up-right"));
    const shot = node("figure", "ab-step__shot");
    shot.append(image(step, "ab-step__img"));
    item.append(head, node("h3", "ab-step__title", step.title), node("p", "ab-step__body", step.body), link, shot);
    return item;
  });
  list.replaceChildren(...items);
  observeLate(items);
  // The sticky device carries decorative copies (the inline figures carry
  // the alt text). display:none keeps its lazy images from loading on phones.
  screen.replaceChildren(...flow.map((step, index) => {
    const img = image(step, "ab-device__img");
    img.alt = "";
    img.dataset.step = step.id;
    if (index === 0) img.classList.add("is-active");
    return img;
  }));
  const activate = (id) => {
    items.forEach((item) => item.classList.toggle("is-active", item.dataset.step === id));
    screen.querySelectorAll("img").forEach((img) => img.classList.toggle("is-active", img.dataset.step === id));
    device.dataset.step = id;
  };
  activate(flow[0].id);
  const observer = new IntersectionObserver((entries) => {
    const hit = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (hit) activate(hit.target.dataset.step);
  }, { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.01] });
  items.forEach((item) => observer.observe(item));
}

/* ---------------------------------------------------------------------
 * 6 · Craft, with proofs computed on this page.
 * ------------------------------------------------------------------- */
function initSprings() {
  const card = byId("springs");
  if (!card) return;
  const copy = craft.springs;
  const copyColumn = node("div", "ab-springs__copy");
  const viz = node("div", "ab-springs__viz");
  copyColumn.append(node("p", "ab-card__kicker", "Hareket"), node("h3", null, copy.title), node("p", null, copy.body));
  const names = Object.keys(copy.names);
  const curves = names.map((name) => ({ name, ...spring(name) }));
  const longest = Math.max(...curves.map((curve) => curve.duration));
  // A narrower drawing on phones keeps the axis labels legible when scaled.
  const W = window.matchMedia("(max-width: 600px)").matches ? 360 : 560; const H = 200; const pad = { l: 36, r: 12, t: 16, b: 30 };
  const x = (ms) => pad.l + (ms / longest) * (W - pad.l - pad.r);
  const y = (value) => H - pad.b - (value / 1.25) * (H - pad.t - pad.b);
  const chart = svgRoot(`0 0 ${W} ${H}`, "Üç yay eğrisi: yumuşak, canlı ve esnek; zamana göre konum.");
  chart.classList.add("ab-chart");
  chart.append(shape("path", { d: `M${pad.l} ${y(1)}H${W - pad.r}` }, "ab-chart__rest"));
  chart.append(shape("path", { d: `M${pad.l} ${y(0)}H${W - pad.r}M${pad.l} ${pad.t}V${y(0)}` }, "ab-chart__axis"));
  chart.append(svgText(pad.l - 8, y(1) + 4, "1", "ab-chart__tick", "end"));
  chart.append(svgText(pad.l - 8, y(0) + 4, "0", "ab-chart__tick", "end"));
  chart.append(svgText(W - pad.r, H - 8, `${longest} ms`, "ab-chart__tick", "end"));
  for (const [index, curve] of curves.entries()) {
    const step = 1000 / 60;
    const d = curve.samples.map((value, i) => `${i ? "L" : "M"}${x(Math.min(i * step, curve.duration)).toFixed(1)} ${y(value).toFixed(1)}`).join("");
    const path = shape("path", { d, pathLength: 1 }, `ab-chart__curve ab-chart__curve--${index}`);
    chart.append(path);
  }
  const legend = node("ul", "ab-legend");
  const lanes = node("div", "ab-lanes");
  lanes.setAttribute("aria-hidden", "true");
  const balls = curves.map((curve, index) => {
    const item = node("li", `ab-legend__item ab-legend__item--${index}`);
    item.append(node("span", "ab-legend__swatch"), node("span", null, copy.names[curve.name]), node("span", "ab-legend__ms", `${curve.duration} ms`));
    legend.append(item);
    const lane = node("div", `ab-lane ab-lane--${index}`);
    const ball = node("span", "ab-lane__ball");
    lane.append(ball);
    lanes.append(lane);
    return { ball, lane, curve };
  });
  const play = node("button", "ab-button ab-button--small ab-button--ghost", "Oynat");
  play.type = "button";
  const note = node("p", "ab-card__note");
  let forward = true;
  const run = () => {
    if (!canMove()) return;
    for (const { ball, lane, curve } of balls) {
      const travel = lane.clientWidth - ball.offsetWidth - 8;
      const [from, to] = forward ? [0, travel] : [travel, 0];
      ball.animate([{ transform: `translateX(${from}px)` }, { transform: `translateX(${to}px)` }],
        { duration: curve.duration, easing: curve.easing, fill: "forwards" });
    }
    forward = !forward;
  };
  play.addEventListener("click", run);
  const paint = () => {
    const allowed = canMove();
    play.disabled = !allowed;
    note.textContent = allowed ? "Oynat: aynı yaylarla üç top. Fark, aşmada ve oturmada." : "Hareket kapalı olduğu için oynatma devre dışı.";
  };
  document.addEventListener("motion:change", paint);
  paint();
  const controls = node("div", "ab-springs__controls");
  controls.append(play, note);
  copyColumn.append(legend, controls);
  viz.append(chart, lanes);
  card.append(copyColumn, viz);
  // Once, when the chart is first seen: draw the curves and send the balls.
  new IntersectionObserver(([entry], observer) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    card.classList.add("is-drawn");
    setTimeout(run, 500);
  }, { threshold: 0.5 }).observe(chart);
}

function luminance(hex) {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return null;
  const channel = (offset) => {
    const value = parseInt(match[1].slice(offset, offset + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
}

function initContrast() {
  const card = byId("contrast");
  if (!card) return;
  const copy = craft.contrast;
  card.append(node("p", "ab-card__kicker", "Renk"), node("h3", null, copy.title), node("p", null, copy.body));
  const styles = getComputedStyle(document.documentElement);
  const list = node("ul", "ab-swatches");
  for (const pair of copy.pairs) {
    const fg = styles.getPropertyValue(pair.fg).trim();
    const bg = styles.getPropertyValue(pair.bg).trim();
    const a = luminance(fg); const b = luminance(bg);
    if (a === null || b === null) continue;
    const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    const item = node("li", "ab-swatch");
    const sample = node("span", "ab-swatch__sample", "Aa");
    sample.style.color = fg;
    sample.style.background = bg;
    sample.setAttribute("aria-hidden", "true");
    const text = node("span", "ab-swatch__label", pair.label);
    const value = node("span", "ab-swatch__ratio", `${ratio.toFixed(1).replace(".", ",")}:1`);
    const grade = node("span", "ab-swatch__grade", ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : "—");
    item.append(sample, text, value, grade);
    list.append(item);
  }
  card.append(list);
}

function initPipeline() {
  const card = byId("pipeline");
  if (!card) return;
  const copy = craft.pipeline;
  card.append(node("p", "ab-card__kicker", "İçerik"), node("h3", null, copy.title), node("p", null, copy.body));
  const list = node("ol", "ab-pipeline__steps");
  copy.steps.forEach((step, index) => {
    const item = node("li", "ab-pipeline__step");
    item.style.setProperty("--k", String(index));
    item.append(node("span", "ab-pipeline__n", String(index + 1)), node("strong", null, step.title), node("span", null, step.body));
    list.append(item);
  });
  card.append(list);
}

function initFacts() {
  const wrap = byId("facts");
  if (!wrap) return;
  wrap.replaceChildren(...craft.facts.map((fact) => {
    const item = node("div", "ab-fact");
    const figureLine = node("p", "ab-fact__figure");
    figureLine.append(node("span", "ab-fact__value", fact.figure), node("span", "ab-fact__unit", fact.unit));
    item.append(figureLine, node("p", "ab-fact__body", fact.body));
    return item;
  }));
}

function initPrivacy() {
  const card = byId("privacy");
  if (!card) return;
  const copy = craft.privacy;
  const text = node("div", "ab-privacy__copy");
  const proof = node("p", "ab-privacy__proof");
  proof.append(...copy.evidence.map(({ label, href }) => {
    const link = node("a", "ab-link", `${label} `);
    link.href = href;
    link.append(linkIcon("arrow-up-right"));
    return link;
  }));
  text.append(node("p", "ab-card__kicker", "Veri"), node("h3", null, copy.title), node("p", null, copy.body), proof);
  const art = svgRoot("0 0 420 170", "Veri yalnızca bu cihazdaki tarayıcıda; yedek dosyasıyla başka bir cihaza taşınabilir, sunucu yok.");
  art.classList.add("ab-privacy__art");
  art.append(shape("rect", { x: 20, y: 30, width: 150, height: 110, rx: 14 }, "ab-p-device"));
  art.append(svgText(95, 58, "bu cihaz", "ab-d-label"));
  art.append(shape("rect", { x: 40, y: 72, width: 110, height: 44, rx: 8 }, "ab-p-store"));
  art.append(svgText(95, 99, "ilerlemen", "ab-d-note ab-d-note--accent"));
  art.append(shape("rect", { x: 300, y: 50, width: 100, height: 80, rx: 12 }, "ab-p-device"));
  art.append(svgText(350, 76, "diğer cihaz", "ab-d-label"));
  art.append(shape("path", { d: "M172 92C214 92 250 92 296 92", pathLength: 1 }, "ab-p-link"));
  art.append(shape("path", { d: "M288 86l8 6-8 6" }, "ab-p-arrow"));
  art.append(shape("rect", { x: 200, y: 100, width: 70, height: 26, rx: 6 }, "ab-p-file"));
  art.append(svgText(235, 118, "yedek", "ab-d-note"));
  art.append(shape("path", { d: "M205 22c0-10 14-14 20-6 4-8 18-6 18 4 8 0 10 12 2 14h-38c-8 0-10-12-2-12z" }, "ab-p-cloud"));
  art.append(shape("path", { d: "M208 8l38 30" }, "ab-p-cross"));
  art.append(svgText(226, 54, "sunucu yok", "ab-d-note"));
  card.append(text, art);
}

/* ---------------------------------------------------------------------
 * 7 · Questions and close.
 * ------------------------------------------------------------------- */
function initFaq() {
  const list = byId("faq-list");
  if (!list) return;
  list.replaceChildren(...questions.map((entry) => {
    const details = node("details", "ab-faq__item");
    const summary = node("summary", null);
    summary.append(node("span", null, entry.title), node("span", "ab-faq__mark"));
    summary.lastChild.setAttribute("aria-hidden", "true");
    details.append(summary, node("p", null, entry.body));
    return details;
  }));
}

function initMasthead() {
  const masthead = byId("masthead");
  let frame = null;
  const paint = () => { frame = null; masthead.dataset.scrolled = String(window.scrollY > 12); };
  window.addEventListener("scroll", () => { if (frame === null) frame = requestAnimationFrame(paint); }, { passive: true });
  paint();
}

/* ---- Boot. ---- */
initMotion();
initIcons();
initReveal();
initMasthead();
initLens();
initManifesto();
const manifest = initMap();
initAnatomy(manifest);
initFlow();
initSprings();
initContrast();
initPipeline();
initFacts();
initPrivacy();
initFaq();
byId("install-control")?.appendChild(createInstallControl());
initScrollRail({ scroller: document.scrollingElement, content: document.querySelector("main") });
if ("serviceWorker" in navigator) navigator.serviceWorker.register("../sw.js").catch(() => {});
