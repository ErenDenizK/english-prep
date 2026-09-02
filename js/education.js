// Eğitim (teaching) tab: a fast, paginated tour through each topic's
// categories — a short rule plus simple examples, no scoring. Lives
// entirely inside index.html; lazily loaded the first time the tab is
// opened.

import { loadManifest, loadLessonsForTopics } from "./topics.js";

const container = document.getElementById("lesson-container");

const state = {
  lessons: [],
  index: 0,
  loaded: false,
};

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderDots() {
  const dots = el("div", "lesson-card__dots");
  state.lessons.forEach((_, index) => {
    const dot = el("span", index === state.index ? "lesson-card__dot lesson-card__dot--active" : "lesson-card__dot");
    dots.appendChild(dot);
  });
  return dots;
}

function renderLesson() {
  container.innerHTML = "";

  if (state.lessons.length === 0) {
    container.appendChild(el("p", "empty-state", "Henüz ders eklenmedi."));
    return;
  }

  const lesson = state.lessons[state.index];
  const card = el("div", "panel lesson-card");

  const eyebrow = el("p", "lesson-card__eyebrow", `${lesson.topicTitle} · ${state.index + 1}/${state.lessons.length}`);
  eyebrow.lang = "en"; // topic title is English; keeps the uppercase transform from Turkish-casing it
  card.appendChild(eyebrow);
  card.appendChild(el("h3", "lesson-card__category", lesson.category));
  card.appendChild(el("p", "lesson-card__rule", lesson.rule));

  const examples = el("ul", "lesson-card__examples");
  lesson.examples.forEach((example) => {
    const item = document.createElement("li");
    item.appendChild(el("span", "lesson-card__example-sentence", example.sentence));
    item.appendChild(el("span", "lesson-card__example-note", example.note));
    examples.appendChild(item);
  });
  card.appendChild(examples);

  const nav = el("div", "lesson-card__nav");

  const prevBtn = el("button", "btn btn--secondary", "Geri");
  prevBtn.type = "button";
  prevBtn.disabled = state.index === 0;
  prevBtn.addEventListener("click", () => {
    state.index -= 1;
    renderLesson();
  });
  nav.appendChild(prevBtn);

  nav.appendChild(renderDots());

  const nextBtn = el("button", "btn", state.index === state.lessons.length - 1 ? "Baştan Başla" : "İleri");
  nextBtn.type = "button";
  nextBtn.addEventListener("click", () => {
    state.index = state.index === state.lessons.length - 1 ? 0 : state.index + 1;
    renderLesson();
  });
  nav.appendChild(nextBtn);

  card.appendChild(nav);
  container.appendChild(card);
}

export async function initEducationTab() {
  if (state.loaded) {
    return;
  }
  state.loaded = true;

  try {
    const manifest = await loadManifest();
    const realTopics = manifest.topics.filter((topic) => !topic.comingSoon);
    state.lessons = await loadLessonsForTopics(realTopics);
    state.index = 0;
    renderLesson();
  } catch (error) {
    console.error(error);
    container.innerHTML = "";
    container.appendChild(el("p", "empty-state", "Dersler yüklenemedi. Sayfayı yenile."));
  }
}
