// Eğitim tab — a staged, interactive lesson experience rather than a
// slideshow. Two screens:
//
//   Index   every lesson in syllabus order, each with its own progress,
//           an overall progress bar, and a "resume where you left off"
//           card. Grouped under topic headings once more than one topic
//           has lessons.
//   Reader  a focused mode (app header and tab bar step out of the way,
//           same as the quiz screen) that pages through one lesson's
//           steps — prose, comparison tables, and inline check questions
//           — then hands the learner on to the next lesson or to a test
//           on the same topic.
//
// Which of the two is showing is driven by the URL hash and routed by
// js/home.js, so the device back button leaves a lesson rather than the
// app.

import { loadManifest, loadLessonsForTopics } from "./topics.js";
import {
  getAllLessonProgress,
  getLessonProgress,
  recordLessonStep,
  markLessonDone,
  countCompletedLessons,
} from "./storage.js";
import { startTopicTest } from "./quiz-launch.js";
import { el, clear, appendProse, appendBlanked } from "./dom.js";

const siteHeader = document.getElementById("site-header");
const tabBar = document.getElementById("tab-bar");
const appContent = document.getElementById("app-content");
const indexContainer = document.getElementById("lesson-index");
const readerContainer = document.getElementById("lesson-reader");
const bottomBar = document.getElementById("lesson-bottom-bar");
const bottomBarInner = bottomBar.querySelector(".bottom-bar__inner");

const state = {
  /** @type {Array<object>|null} flat, syllabus-ordered, topic-tagged */
  lessons: null,
  /** @type {Promise<Array<object>>|null} */
  loading: null,
  /** @type {{lessonIndex: number, stepIndex: number, answers: Map<number, number>}|null} */
  reader: null,
};

/* ---- Loading ---- */

function loadLessons() {
  return loadManifest()
    .then((manifest) => loadLessonsForTopics(manifest.topics.filter((topic) => !topic.comingSoon)))
    .then((lessons) => {
      state.lessons = lessons;
      state.loading = null;
      return lessons;
    })
    .catch((error) => {
      // Clear the in-flight promise so leaving the tab and coming back
      // actually retries instead of replaying the same failure forever.
      state.loading = null;
      throw error;
    });
}

function ensureLessons() {
  if (state.lessons) {
    return Promise.resolve(state.lessons);
  }
  state.loading ??= loadLessons();
  return state.loading;
}

/* ---- Shared chrome ---- */

function setBottomBarActions(actions) {
  clear(bottomBarInner);
  for (const action of actions) {
    const button = el("button", `btn${action.variant ? ` btn--${action.variant}` : ""}`, action.label);
    button.type = "button";
    if (action.disabled) {
      button.disabled = true;
    } else {
      button.addEventListener("click", action.onClick);
    }
    bottomBarInner.appendChild(button);
  }
  bottomBar.hidden = actions.length === 0;
}

function hideBottomBar() {
  bottomBar.hidden = true;
  clear(bottomBarInner);
}

function scrollToTop() {
  appContent.scrollTo({ top: 0 });
}

function progressTrack(ratio) {
  const track = el("div", "progress-track");
  const fill = el("div", "progress-track__fill");
  fill.style.width = `${Math.round(Math.min(Math.max(ratio, 0), 1) * 100)}%`;
  track.appendChild(fill);
  return track;
}

function renderLoadError(container) {
  clear(container);
  container.appendChild(el("p", "empty-state", "Dersler yüklenemedi. Sayfayı yenile."));
}

/* ---- Index screen ---- */

function statusOf(lesson, progress) {
  const entry = progress[lesson.id];
  if (entry?.done) {
    return { kind: "done", label: "Tamamlandı" };
  }
  if (entry) {
    return { kind: "started", label: `Adım ${Math.min(entry.step + 1, lesson.steps.length)} / ${lesson.steps.length}` };
  }
  return { kind: "new", label: `${lesson.steps.length} adım` };
}

function renderOverview(lessons, progress) {
  const completed = countCompletedLessons(lessons.map((lesson) => lesson.id));
  const panel = el("section", "panel");

  panel.appendChild(
    el("p", "lesson-overview__count", `${lessons.length} dersten ${completed} tanesi tamamlandı`)
  );
  panel.appendChild(progressTrack(lessons.length === 0 ? 0 : completed / lessons.length));
  panel.appendChild(
    el(
      "p",
      "lesson-overview__hint",
      "Konuları sırayla oku, her dersin sonunda kendini kontrol et. İlerlemen bu cihazda saklanır."
    )
  );

  return panel;
}

function renderResumeCard(lesson, entry) {
  const panel = el("section", "panel panel--accent");
  panel.appendChild(el("p", "lesson-card__eyebrow", "Kaldığın yer"));
  panel.appendChild(el("h3", "lesson-resume__title", lesson.title));
  panel.appendChild(
    el("p", "lesson-resume__meta", `Adım ${Math.min(entry.step + 1, lesson.steps.length)} / ${lesson.steps.length}`)
  );

  const button = el("button", "btn", "Devam Et");
  button.type = "button";
  button.addEventListener("click", () => openLessonByHash(lesson.id));
  panel.appendChild(button);

  return panel;
}

function renderLessonRow(lesson, status) {
  const row = el("button", "lesson-row");
  row.type = "button";
  row.addEventListener("click", () => openLessonByHash(lesson.id));

  row.appendChild(el("span", "lesson-row__order", String(lesson.order)));

  const main = el("span", "lesson-row__main");
  const eyebrow = el("span", "lesson-row__category", lesson.category);
  // English grammar term inside a lang="tr" page: without this, the CSS
  // uppercase transform Turkish-cases it ("SİMPLE" instead of "SIMPLE").
  eyebrow.lang = "en";
  main.appendChild(eyebrow);
  main.appendChild(el("span", "lesson-row__title", lesson.title));
  main.appendChild(el("span", "lesson-row__summary", lesson.summary));
  row.appendChild(main);

  row.appendChild(el("span", `lesson-row__status lesson-row__status--${status.kind}`, status.label));

  return row;
}

function renderIndex() {
  const lessons = state.lessons;
  clear(indexContainer);
  hideBottomBar();

  if (lessons.length === 0) {
    indexContainer.appendChild(el("p", "empty-state", "Henüz ders eklenmedi."));
    return;
  }

  const progress = getAllLessonProgress();
  indexContainer.appendChild(renderOverview(lessons, progress));

  const resumable = lessons.find((lesson) => {
    const entry = progress[lesson.id];
    return entry && !entry.done && entry.step > 0;
  });
  if (resumable) {
    indexContainer.appendChild(renderResumeCard(resumable, progress[resumable.id]));
  }

  const topicIds = [...new Set(lessons.map((lesson) => lesson.topicId))];
  const list = el("div", "lesson-list");

  for (const topicId of topicIds) {
    const inTopic = lessons.filter((lesson) => lesson.topicId === topicId);
    // With a single topic the heading would just restate the tab — same
    // reasoning as the home screen skipping its tier accordion.
    if (topicIds.length > 1) {
      const heading = el("h2", "lesson-list__topic", inTopic[0].topicTitle);
      heading.lang = "en";
      list.appendChild(heading);
    }
    for (const lesson of inTopic) {
      list.appendChild(renderLessonRow(lesson, statusOf(lesson, progress)));
    }
  }

  indexContainer.appendChild(list);
}

/* ---- Reader: steps ---- */

function renderExamples(examples) {
  const list = el("ul", "example-list");
  for (const example of examples) {
    const item = document.createElement("li");
    const sentence = el("span", "example-list__sentence", example.sentence);
    sentence.lang = "en";
    item.appendChild(sentence);
    item.appendChild(el("span", "example-list__note", example.note));
    list.appendChild(item);
  }
  return list;
}

function renderTable(step) {
  const scroller = el("div", "table-scroll");
  const table = el("table", "compare-table");

  const head = document.createElement("thead");
  const headRow = document.createElement("tr");
  for (const column of step.columns) {
    headRow.appendChild(el("th", null, column));
  }
  head.appendChild(headRow);
  table.appendChild(head);

  const body = document.createElement("tbody");
  for (const row of step.rows) {
    const tr = document.createElement("tr");
    row.forEach((cell, index) => {
      const td = el("td", null, cell);
      // Read by CSS on narrow screens, where each row stacks into a card
      // and every cell needs to carry its own column label.
      td.dataset.label = step.columns[index];
      tr.appendChild(td);
    });
    body.appendChild(tr);
  }
  table.appendChild(body);

  scroller.appendChild(table);
  return scroller;
}

function renderCheckFeedback(step, selectedIndex) {
  const correct = selectedIndex === step.correctIndex;
  const feedback = el("div", `feedback ${correct ? "feedback--correct" : "feedback--incorrect"}`);
  // Announced to screen readers: the visual state change (green/red
  // options) is otherwise invisible to anyone not looking at the screen.
  feedback.setAttribute("role", "status");

  feedback.appendChild(
    el(
      "strong",
      null,
      correct ? "Doğru!" : `Doğru değil — doğru cevap: "${step.options[step.correctIndex]}".`
    )
  );
  feedback.appendChild(el("p", "feedback__explanation", step.explanation));

  return feedback;
}

function renderCheckStep(step, stepIndex, card) {
  card.appendChild(el("p", "lesson-step__kicker", "Kontrol"));

  const prompt = el("p", "question-card__prompt");
  appendBlanked(prompt, step.prompt);
  card.appendChild(prompt);

  const optionsWrap = el("div", "options");
  const answered = state.reader.answers.has(stepIndex);
  const selectedIndex = state.reader.answers.get(stepIndex);

  step.options.forEach((option, index) => {
    const button = el("button", "option-btn");
    button.type = "button";
    button.appendChild(el("span", "option-btn__key", `${index + 1}.`));
    button.appendChild(document.createTextNode(option));

    if (answered) {
      button.disabled = true;
      if (index === step.correctIndex) {
        button.classList.add("option-btn--correct");
      } else if (index === selectedIndex) {
        button.classList.add("option-btn--incorrect");
      }
    } else {
      button.addEventListener("click", () => {
        state.reader.answers.set(stepIndex, index);
        renderStep();
      });
    }

    optionsWrap.appendChild(button);
  });
  card.appendChild(optionsWrap);

  if (answered) {
    card.appendChild(renderCheckFeedback(step, selectedIndex));
  }
}

function renderStepCard(step, stepIndex) {
  const card = el("div", "panel lesson-step");

  if (step.type === "check") {
    renderCheckStep(step, stepIndex, card);
    return card;
  }

  card.appendChild(el("h3", "lesson-step__heading", step.heading));

  if (step.type === "table") {
    card.appendChild(renderTable(step));
    return card;
  }

  const body = el("div", "lesson-step__body");
  appendProse(body, step.body);
  card.appendChild(body);

  if (step.examples?.length) {
    card.appendChild(renderExamples(step.examples));
  }

  return card;
}

/* ---- Reader: frame ---- */

function currentLesson() {
  return state.lessons[state.reader.lessonIndex];
}

function renderReaderNav(lesson, trailingText) {
  const nav = el("div", "quiz-nav");

  const back = el("button", "quiz-nav__exit", "← Dersler");
  back.type = "button";
  back.addEventListener("click", showIndexByHash);
  nav.appendChild(back);

  nav.appendChild(el("p", "quiz-progress", trailingText));
  return nav;
}

function renderLessonHeading(lesson) {
  const wrap = el("div", "lesson-reader__heading");
  const eyebrow = el("p", "lesson-card__eyebrow", lesson.category);
  eyebrow.lang = "en";
  wrap.appendChild(eyebrow);
  wrap.appendChild(el("h2", "lesson-reader__title", lesson.title));
  return wrap;
}

function renderStep() {
  const lesson = currentLesson();
  const { stepIndex } = state.reader;
  const step = lesson.steps[stepIndex];
  const isLastStep = stepIndex === lesson.steps.length - 1;

  recordLessonStep(lesson.id, stepIndex);

  clear(readerContainer);
  readerContainer.appendChild(renderReaderNav(lesson, `${stepIndex + 1} / ${lesson.steps.length}`));
  readerContainer.appendChild(progressTrack((stepIndex + 1) / lesson.steps.length));
  readerContainer.appendChild(renderLessonHeading(lesson));
  readerContainer.appendChild(renderStepCard(step, stepIndex));

  // A check step must actually be answered before moving on — that's the
  // difference between a lesson and a slideshow. The disabled button says
  // why it's disabled rather than leaving the learner guessing, and Geri
  // stays live so nobody is ever stuck.
  const awaitingAnswer = step.type === "check" && !state.reader.answers.has(stepIndex);

  setBottomBarActions([
    {
      label: "Geri",
      variant: "secondary",
      onClick: () => {
        if (stepIndex === 0) {
          showIndexByHash();
        } else {
          state.reader.stepIndex -= 1;
          renderStep();
        }
      },
    },
    {
      label: awaitingAnswer ? "Bir seçenek seç" : isLastStep ? "Dersi Bitir" : "İleri",
      disabled: awaitingAnswer,
      onClick: () => {
        if (isLastStep) {
          renderCompletion();
        } else {
          state.reader.stepIndex += 1;
          renderStep();
        }
      },
    },
  ]);

  scrollToTop();
}

function renderCompletion() {
  const lesson = currentLesson();
  markLessonDone(lesson.id, lesson.steps.length - 1);

  const nextLesson = state.lessons[state.reader.lessonIndex + 1] ?? null;
  const completed = countCompletedLessons(state.lessons.map((entry) => entry.id));

  clear(readerContainer);
  readerContainer.appendChild(renderReaderNav(lesson, `${state.lessons.length} dersten ${completed}`));

  const panel = el("section", "panel lesson-complete");
  panel.appendChild(el("p", "lesson-card__eyebrow", "Ders tamamlandı"));
  panel.appendChild(el("h2", "lesson-complete__title", lesson.title));
  panel.appendChild(
    el(
      "p",
      "lesson-complete__body",
      nextLesson
        ? "Öğrendiklerini test etmek için bu konudan soru çözebilir ya da sıradaki derse geçebilirsin."
        : "Bu konudaki dersleri bitirdin. Şimdi kendini test etmenin tam sırası."
    )
  );
  panel.appendChild(progressTrack(completed / state.lessons.length));
  readerContainer.appendChild(panel);

  const actions = [
    {
      label: "Bu Konudan Test Çöz",
      variant: "secondary",
      onClick: () => startTopicTest(lesson.topicId),
    },
  ];
  actions.push(
    nextLesson
      ? { label: "Sıradaki Ders", onClick: () => openLessonByHash(nextLesson.id) }
      : { label: "Derslere Dön", onClick: showIndexByHash }
  );
  setBottomBarActions(actions);

  scrollToTop();
}

/* ---- Keyboard shortcuts (reader only) ---- */

function handleKeydown(event) {
  if (!state.reader || event.metaKey || event.ctrlKey || event.altKey) {
    return;
  }
  // A focused bottom-bar button already activates on Enter natively;
  // handling it here as well would advance two steps at once.
  if (bottomBar.contains(event.target)) {
    return;
  }

  const lesson = currentLesson();
  const step = lesson.steps[state.reader.stepIndex];

  if (step?.type === "check" && !state.reader.answers.has(state.reader.stepIndex)) {
    const choice = Number(event.key);
    if (Number.isInteger(choice) && choice >= 1 && choice <= step.options.length) {
      event.preventDefault();
      state.reader.answers.set(state.reader.stepIndex, choice - 1);
      renderStep();
      return;
    }
  }

  const buttons = bottomBarInner.querySelectorAll("button");
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    buttons[0]?.click();
  } else if (event.key === "ArrowRight" || event.key === "Enter") {
    const primary = buttons[buttons.length - 1];
    if (primary && !primary.disabled) {
      event.preventDefault();
      primary.click();
    }
  }
}

document.addEventListener("keydown", handleKeydown);

/* ---- Navigation (hash-driven, so the back button works) ---- */

function showIndexByHash() {
  window.location.hash = "egitim";
}

function openLessonByHash(lessonId) {
  window.location.hash = `egitim/${lessonId}`;
}

function setReaderChrome(active) {
  siteHeader.hidden = active;
  tabBar.hidden = active;
  indexContainer.hidden = active;
  readerContainer.hidden = !active;
}

/** Leaves reader mode and restores the app header and tab bar. */
export function closeReader() {
  state.reader = null;
  setReaderChrome(false);
  hideBottomBar();
}

export async function showLessonIndex() {
  closeReader();
  try {
    await ensureLessons();
    renderIndex();
  } catch (error) {
    console.error(error);
    renderLoadError(indexContainer);
  }
}

/**
 * @param {string} lessonId - from the URL hash, so it may be stale or
 *   hand-typed; an unknown id falls back to the index without leaving a
 *   dead entry in the history.
 */
export async function openLesson(lessonId) {
  let lessons;
  try {
    lessons = await ensureLessons();
  } catch (error) {
    console.error(error);
    closeReader();
    renderLoadError(indexContainer);
    return;
  }

  const lessonIndex = lessons.findIndex((lesson) => lesson.id === lessonId);
  if (lessonIndex === -1) {
    history.replaceState(null, "", "#egitim");
    await showLessonIndex();
    return;
  }

  const lesson = lessons[lessonIndex];
  const entry = getLessonProgress(lessonId);
  const resumeStep = entry && !entry.done ? Math.min(entry.step, lesson.steps.length - 1) : 0;

  state.reader = { lessonIndex, stepIndex: resumeStep, answers: new Map() };
  setReaderChrome(true);
  renderStep();
}
