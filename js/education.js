// Eğitim — the app's home, and its teaching half. Two screens:
//
//   Index   every lesson across every topic. It opens with what to do
//           next, not with a table of contents: overall progress, then the
//           lesson you were in the middle of, then the list. Deliberately
//           not a locked linear path — this is a study tool, and someone
//           who wants one specific rule should not have to walk through
//           five chapters to reach it.
//   Reader  a focused mode (the header and the nav step out of the way, as
//           on the quiz screen) that paces one lesson.
//
// A lesson is authored as an article — intro, form, meaning, usage,
// examples, common mistakes, recap (see docs/CONTENT_GUIDE.md). This
// module turns those sections into the reader's steps and slots in check
// questions drawn from the same category's Test pool. So the content side
// writes prose, not screens, and the app decides how it is paced.

import { loadManifest, loadLessonsForTopics } from "./topics.js";
import {
  getAllLessonProgress,
  getLessonProgress,
  recordLessonStep,
  markLessonDone,
  countCompletedLessons,
} from "./storage.js";
import { shuffle, isCorrectAnswer } from "./quiz-engine.js";
import { renderAnswerFeedback, answerAnnouncement } from "./feedback.js";
import { renderOptions } from "./answers.js";
import { startTopicTest } from "./quiz-launch.js";
import { el, clear, appendProse, appendBlanked } from "./dom.js";
import { icon } from "./icons.js";
import { announce, scrollToTop, createActionBar } from "./shell.js";
import { CHECKS_PER_LESSON } from "./config.js";

const shellHeader = document.getElementById("shell-header");
const bottomNav = document.getElementById("bottom-nav");
const indexContainer = document.getElementById("lesson-index");
const readerContainer = document.getElementById("lesson-reader");
const actionBar = createActionBar("lesson-bar");

const state = {
  /** @type {Array<object>|null} */
  lessons: null,
  /** @type {Promise<Array<object>>|null} */
  loading: null,
  /** @type {{lessonIndex: number, stepIndex: number, steps: Array<object>, answers: Map<number, string>}|null} */
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
      // Drop the in-flight promise so leaving the tab and coming back
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

/* ---- Turning an authored article into reader steps ---- */

/**
 * `meaning` and `usage` are merged into one step on purpose: separately
 * they are two short prose pages in a row, which makes paging feel like
 * clicking through nothing. Checks land after the examples and after the
 * common-mistakes step — the two points where the learner has just been
 * given something worth trying.
 */
function buildSteps(lesson) {
  const steps = [];
  const checks = shuffle(lesson.checkPool ?? []).slice(0, CHECKS_PER_LESSON);
  let nextCheck = 0;

  const addCheck = () => {
    if (nextCheck < checks.length) {
      steps.push({ kind: "check", heading: "Kontrol", question: checks[nextCheck] });
      nextCheck += 1;
    }
  };

  if (lesson.intro) {
    steps.push({ kind: "prose", heading: "Giriş", body: lesson.intro });
  }
  if (lesson.form) {
    steps.push({ kind: "form", heading: "Yapı", body: lesson.form });
  }

  const explanation = [lesson.meaning, lesson.usage].filter(Boolean).join("\n\n");
  if (explanation) {
    steps.push({ kind: "prose", heading: "Anlam ve kullanım", body: explanation });
  }

  if (lesson.examples?.length) {
    steps.push({ kind: "examples", heading: "Örnekler", examples: lesson.examples });
    addCheck();
  }
  if (lesson.commonMistakes?.length) {
    steps.push({ kind: "mistakes", heading: "Sık yapılan hatalar", mistakes: lesson.commonMistakes });
    addCheck();
  }
  if (lesson.recap) {
    steps.push({ kind: "prose", heading: "Özet", body: lesson.recap });
  }

  return steps;
}

/** First sentence of the intro — a one-line preview for the index. */
function previewOf(lesson) {
  const source = lesson.intro ?? lesson.recap ?? "";
  const [first] = source.split(/(?<=[.!?])\s+/);
  return first ?? "";
}

/* ---- Shared pieces ---- */

function progressBar(ratio) {
  const track = el("div", "progress");
  const fill = el("div", "progress__fill");
  fill.style.width = `${Math.round(Math.min(Math.max(ratio, 0), 1) * 100)}%`;
  track.appendChild(fill);
  return track;
}

function englishTitle(tag, className, text) {
  const node = el(tag, className, text);
  // A grammar term inside an otherwise-Turkish page. Without this the CSS
  // uppercase transform follows lang="tr" and "Simple" becomes "SİMPLE".
  node.lang = "en";
  return node;
}

/* ---- Index ---- */

function statusOf(lesson, progress, stepCount) {
  const entry = progress[lesson.id];
  if (entry?.done) {
    return { done: true, label: "Tamamlandı" };
  }
  if (entry) {
    return { done: false, label: `${Math.min(entry.step + 1, stepCount)}/${stepCount}` };
  }
  return { done: false, label: `${stepCount} adım` };
}

function renderProgressSummary(lessons, completed) {
  const block = el("section", "stack stack--tight");
  block.appendChild(el("h2", "t-label", "İlerlemen"));
  block.appendChild(progressBar(lessons.length === 0 ? 0 : completed / lessons.length));
  block.appendChild(
    el("p", "t-meta", `${lessons.length} dersten ${completed} tanesi tamamlandı`)
  );
  return block;
}

/**
 * The one thing on the screen that is a card. It is heterogeneous — a
 * label, an English title, a Turkish counter and an action — which is
 * exactly the case a surface is for; the lesson list below it is
 * homogeneous, so it is rows.
 */
function renderResumeCard(lesson, entry, stepCount) {
  const card = el("section", "surface stack");

  const head = el("div", "stack stack--tight");
  head.appendChild(el("p", "t-label", "Kaldığın yer"));
  head.appendChild(englishTitle("h2", "t-title t-en", lesson.category));
  head.appendChild(
    el(
      "p",
      "t-meta t-num",
      `${lesson.topicTitle} · ${Math.min(entry.step + 1, stepCount)}/${stepCount}`
    )
  );
  card.appendChild(head);

  const button = el("button", "btn btn--primary", "Devam et");
  button.type = "button";
  button.addEventListener("click", () => openLessonByHash(lesson.id));
  card.appendChild(button);

  return card;
}

function renderLessonRow(lesson, status) {
  const row = el("button", "row");
  row.type = "button";
  row.addEventListener("click", () => openLessonByHash(lesson.id));

  row.appendChild(el("span", "row__lead t-num t-meta", String(lesson.order)));

  const main = el("span", "row__main");
  main.appendChild(englishTitle("span", "row__title t-en", lesson.category));
  main.appendChild(el("span", "row__sub", previewOf(lesson)));
  row.appendChild(main);

  const trail = el("span", "row__trail");
  if (status.done) {
    // No tick inside the chip: the set is drawn with a 2px absolute stroke
    // and a chip-sized icon would render it at 1.2px, which is exactly how
    // an icon set starts going soft. The green tint is the second channel.
    trail.appendChild(el("span", "chip chip--ok", "Tamamlandı"));
  } else {
    trail.appendChild(el("span", "t-num", status.label));
  }
  trail.appendChild(icon("chevron-right", { size: 20 }));
  row.appendChild(trail);

  return row;
}

function renderIndex() {
  const lessons = state.lessons;
  clear(indexContainer);
  actionBar.hide();

  if (lessons.length === 0) {
    indexContainer.appendChild(el("p", "t-meta", "Henüz ders eklenmedi."));
    return;
  }

  const progress = getAllLessonProgress();
  const stepCounts = new Map(lessons.map((lesson) => [lesson.id, buildSteps(lesson).length]));
  const completed = countCompletedLessons(lessons.map((lesson) => lesson.id));

  indexContainer.appendChild(renderProgressSummary(lessons, completed));

  const resumable = lessons.find((lesson) => {
    const entry = progress[lesson.id];
    return entry && !entry.done && entry.step > 0;
  });
  if (resumable) {
    indexContainer.appendChild(
      renderResumeCard(resumable, progress[resumable.id], stepCounts.get(resumable.id))
    );
  }

  const topicIds = [...new Set(lessons.map((lesson) => lesson.topicId))];
  for (const topicId of topicIds) {
    const inTopic = lessons.filter((lesson) => lesson.topicId === topicId);
    const section = el("section", "stack stack--tight");
    // With one topic the heading would label the only group there is.
    if (topicIds.length > 1) {
      section.appendChild(englishTitle("h2", "t-label", inTopic[0].topicTitle));
    } else {
      section.appendChild(el("h2", "t-label", "Dersler"));
    }
    const list = el("div");
    for (const lesson of inTopic) {
      list.appendChild(renderLessonRow(lesson, statusOf(lesson, progress, stepCounts.get(lesson.id))));
    }
    section.appendChild(list);
    indexContainer.appendChild(section);
  }
}

/* ---- Reader: step bodies ---- */

function renderProse(text) {
  const body = el("div", "prose");
  appendProse(body, text, "t-body");
  return body;
}

/**
 * The structural pattern of a tense — the one place on a lesson step where
 * a card earns its keep, because it is a reference the learner will scroll
 * back to rather than a paragraph they read once.
 */
function renderForm(text) {
  const card = el("div", "surface");
  card.appendChild(renderProse(text));
  return card;
}

function renderExamples(examples) {
  const list = el("ul", "stack");
  examples.forEach((example, index) => {
    const item = el("li", "stack stack--tight");
    if (index > 0) {
      item.appendChild(el("span", "divider"));
    }
    item.appendChild(englishTitle("p", "t-lead t-en", example.sentence));
    item.appendChild(el("p", "t-meta", example.note));
    list.appendChild(item);
  });
  return list;
}

/**
 * Wrong above right, both in the serif, with the verdict carried by a
 * glyph as well as by colour — neither red nor green clears the contrast
 * bar as text on this ground, and colour alone would say nothing in
 * greyscale.
 */
function renderMistakes(mistakes) {
  const list = el("ul", "stack stack--loose");

  const line = (kind, sentence) => {
    const row = el("p", "cluster");
    const mark = el("span", kind === "ok" ? "ink-ok" : "ink-no");
    mark.appendChild(icon(kind === "ok" ? "check" : "close", { size: 20 }));
    row.appendChild(mark);
    row.appendChild(englishTitle("span", "t-body t-en", sentence));
    return row;
  };

  for (const mistake of mistakes) {
    const item = el("li", "stack stack--tight");
    item.appendChild(line("no", mistake.wrong));
    item.appendChild(line("ok", mistake.right));
    item.appendChild(el("p", "t-meta", mistake.why));
    list.appendChild(item);
  }

  return list;
}

function renderCheck(step, stepIndex) {
  const question = step.question;
  const answered = state.reader.answers.has(stepIndex);
  const selected = state.reader.answers.get(stepIndex) ?? null;

  const block = el("div", "stack");

  const prompt = el("p", "t-lead t-en");
  prompt.lang = "en";
  appendBlanked(prompt, question.prompt);
  block.appendChild(prompt);

  block.appendChild(
    renderOptions(question, {
      selected,
      answered,
      onSelect: (option) => {
        state.reader.answers.set(stepIndex, option);
        announce(...answerAnnouncement(question, isCorrectAnswer(question, option)));
        renderStep({ keepScroll: true });
      },
    })
  );

  if (answered) {
    // No tip: the lesson has just spent several steps stating the rule.
    block.appendChild(
      renderAnswerFeedback(question, isCorrectAnswer(question, selected), { withTip: false })
    );
  }

  return block;
}

function renderStepBody(step, stepIndex) {
  switch (step.kind) {
    case "check":
      return renderCheck(step, stepIndex);
    case "form":
      return renderForm(step.body);
    case "examples":
      return renderExamples(step.examples);
    case "mistakes":
      return renderMistakes(step.mistakes);
    default:
      return renderProse(step.body);
  }
}

/* ---- Reader: frame ---- */

const currentLesson = () => state.lessons[state.reader.lessonIndex];

function renderReaderTop(trailingText) {
  const strip = el("div", "cluster cluster--spread");

  const back = el("button", "btn btn--quiet", "Dersler");
  back.type = "button";
  back.prepend(icon("arrow-left", { size: 20 }));
  back.addEventListener("click", showIndexByHash);
  strip.appendChild(back);

  strip.appendChild(el("p", "t-meta t-num", trailingText));
  return strip;
}

function renderStep({ keepScroll = false } = {}) {
  const lesson = currentLesson();
  const { stepIndex, steps } = state.reader;
  const step = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  recordLessonStep(lesson.id, stepIndex);

  clear(readerContainer);
  const page = el("div", "stack stack--loose");
  page.appendChild(renderReaderTop(`${stepIndex + 1} / ${steps.length}`));
  page.appendChild(progressBar((stepIndex + 1) / steps.length));

  const heading = el("div", "stack stack--tight");
  heading.appendChild(englishTitle("p", "t-label", lesson.category));
  heading.appendChild(el("h2", "t-title", step.heading));
  page.appendChild(heading);

  page.appendChild(renderStepBody(step, stepIndex));
  readerContainer.appendChild(page);

  // A check is never a gate. Leaving it unanswered is a legitimate choice
  // — someone re-reading a lesson for one rule should not have to sit an
  // exercise to get past it — so the forward control stays live and just
  // says what it will do.
  const skippingCheck = step.kind === "check" && !state.reader.answers.has(stepIndex);

  actionBar.set([
    {
      // No arrow here: the strip at the top already carries one, and two
      // back arrows on one screen is two answers to the same question.
      label: "Geri",
      level: "secondary",
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
      label: skippingCheck ? "Atla" : isLastStep ? "Dersi bitir" : "İleri",
      level: "primary",
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

  // Answering a check re-renders the same step; scrolling back to the top
  // there would throw the learner away from the feedback they just earned.
  if (!keepScroll) {
    scrollToTop();
  }
}

function renderCompletion() {
  const lesson = currentLesson();
  markLessonDone(lesson.id, state.reader.steps.length - 1);

  const nextLesson = state.lessons[state.reader.lessonIndex + 1] ?? null;
  const completed = countCompletedLessons(state.lessons.map((entry) => entry.id));

  clear(readerContainer);
  const page = el("div", "stack stack--loose");
  page.appendChild(renderReaderTop(`${state.lessons.length} dersten ${completed}`));

  const card = el("section", "surface stack");
  const head = el("div", "stack stack--tight");
  head.appendChild(el("p", "t-label", "Ders tamamlandı"));
  head.appendChild(englishTitle("h2", "t-title t-en", lesson.category));
  head.appendChild(
    el(
      "p",
      "t-body",
      "Öğrendiğini pekiştirmenin en hızlı yolu birkaç soru çözmek. Ya da sıradaki derse geç."
    )
  );
  card.appendChild(head);
  card.appendChild(progressBar(completed / state.lessons.length));
  page.appendChild(card);
  readerContainer.appendChild(page);

  announce(`Ders tamamlandı. ${state.lessons.length} dersten ${completed} tanesi bitti.`);

  actionBar.set([
    {
      label: "Test çöz",
      level: "secondary",
      onClick: () => startTopicTest(lesson.topicId).catch(console.error),
    },
    nextLesson
      ? { label: "Sıradaki ders", level: "primary", onClick: () => openLessonByHash(nextLesson.id) }
      : { label: "Derslere dön", level: "primary", onClick: showIndexByHash },
  ]);

  scrollToTop();
}

/* ---- Keyboard shortcuts (reader only) ---- */

function handleKeydown(event) {
  if (!state.reader || event.metaKey || event.ctrlKey || event.altKey) {
    return;
  }
  // A focused action-bar button already activates on Enter natively;
  // handling it here as well would advance two steps at once.
  if (actionBar.contains(event.target)) {
    return;
  }

  const step = state.reader.steps[state.reader.stepIndex];
  if (step?.kind === "check" && !state.reader.answers.has(state.reader.stepIndex)) {
    const choice = Number(event.key);
    if (Number.isInteger(choice) && choice >= 1 && choice <= step.question.options.length) {
      event.preventDefault();
      const option = step.question.options[choice - 1];
      state.reader.answers.set(state.reader.stepIndex, option);
      announce(...answerAnnouncement(step.question, isCorrectAnswer(step.question, option)));
      renderStep({ keepScroll: true });
      return;
    }
  }

  const buttons = actionBar.buttons();
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    buttons[0]?.click();
  } else if (event.key === "ArrowRight" || event.key === "Enter") {
    event.preventDefault();
    buttons[buttons.length - 1]?.click();
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
  shellHeader.hidden = active;
  bottomNav.hidden = active;
  indexContainer.hidden = active;
  readerContainer.hidden = !active;
  // The dev note sits above the views rather than inside one, so it needs
  // hiding too or it survives into the reader's focused mode. A class, not
  // `hidden`: that attribute belongs to the dismissal logic in home.js,
  // and two owners would fight over it.
  document.body.classList.toggle("is-reading", active);
}

/** Leaves reader mode and restores the app header and bottom nav. */
export function closeReader() {
  state.reader = null;
  setReaderChrome(false);
  actionBar.hide();
}

export async function showLessonIndex() {
  closeReader();
  try {
    await ensureLessons();
    renderIndex();
  } catch (error) {
    console.error(error);
    clear(indexContainer);
    indexContainer.appendChild(el("p", "t-meta", "Dersler yüklenemedi. Sayfayı yenile."));
  }
}

/**
 * @param {string} lessonId - comes from the URL hash, so it may be stale or
 *   hand-typed; an unknown id falls back to the index without leaving a
 *   dead entry in the history.
 */
export async function openLesson(lessonId) {
  let lessons;
  try {
    lessons = await ensureLessons();
  } catch (error) {
    console.error(error);
    await showLessonIndex();
    return;
  }

  const lessonIndex = lessons.findIndex((lesson) => lesson.id === lessonId);
  if (lessonIndex === -1) {
    history.replaceState(null, "", "#egitim");
    await showLessonIndex();
    return;
  }

  const steps = buildSteps(lessons[lessonIndex]);
  const entry = getLessonProgress(lessonId);
  const resumeStep = entry && !entry.done ? Math.min(entry.step, steps.length - 1) : 0;

  state.reader = { lessonIndex, stepIndex: resumeStep, steps, answers: new Map() };
  setReaderChrome(true);
  announce(lessons[lessonIndex].category);
  renderStep();
}
