// Eğitim tab — a staged, interactive walk through the syllabus. Two
// screens:
//
//   Index   every lesson across every topic, grouped by topic and
//           skimmable: tap any row to jump straight into it, with an
//           overall progress bar and a "pick up where you left off" card.
//           Deliberately not a locked linear path — this is a study tool,
//           and someone who wants one specific rule should not have to
//           walk through five chapters to reach it.
//   Reader  a focused mode (the header and bottom nav step out of the
//           way, as the quiz screen does) that pages through one lesson
//           a step at a time.
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
import { shuffle } from "./quiz-engine.js";
import { renderAnswerFeedback } from "./feedback.js";
import { startTopicTest } from "./quiz-launch.js";
import { el, clear, appendProse, appendBlanked } from "./dom.js";
import { CHECKS_PER_LESSON } from "./config.js";

const siteHeader = document.getElementById("site-header");
const bottomNav = document.getElementById("bottom-nav");
const appContent = document.getElementById("app-content");
const indexContainer = document.getElementById("lesson-index");
const readerContainer = document.getElementById("lesson-reader");
const bottomBar = document.getElementById("lesson-bottom-bar");
const bottomBarInner = bottomBar.querySelector(".bottom-bar__inner");

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

/* ---- Shared chrome ---- */

function setBottomBarActions(actions) {
  clear(bottomBarInner);
  for (const action of actions) {
    const button = el("button", `btn${action.variant ? ` btn--${action.variant}` : ""}`, action.label);
    button.type = "button";
    button.addEventListener("click", action.onClick);
    bottomBarInner.appendChild(button);
  }
  bottomBar.hidden = actions.length === 0;
}

function hideBottomBar() {
  bottomBar.hidden = true;
  clear(bottomBarInner);
}

function progressTrack(ratio) {
  const track = el("div", "progress-track");
  const fill = el("div", "progress-track__fill");
  fill.style.width = `${Math.round(Math.min(Math.max(ratio, 0), 1) * 100)}%`;
  track.appendChild(fill);
  return track;
}

/* ---- Index screen ---- */

function statusOf(lesson, progress, stepCount) {
  const entry = progress[lesson.id];
  if (entry?.done) {
    return { kind: "done", label: "Tamamlandı" };
  }
  if (entry) {
    return { kind: "started", label: `Adım ${Math.min(entry.step + 1, stepCount)} / ${stepCount}` };
  }
  return { kind: "new", label: `${stepCount} adım` };
}

function renderOverview(lessons, completed) {
  const panel = el("section", "panel");
  panel.appendChild(
    el("p", "lesson-overview__count", `${lessons.length} dersten ${completed} tanesi tamamlandı`)
  );
  panel.appendChild(progressTrack(lessons.length === 0 ? 0 : completed / lessons.length));
  panel.appendChild(
    el(
      "p",
      "lesson-overview__hint",
      "İstediğin dersten başlayabilirsin; sıra zorunlu değil. İlerlemen bu cihazda saklanır."
    )
  );
  return panel;
}

function renderResumeCard(lesson, entry, stepCount) {
  const panel = el("section", "panel panel--accent");
  panel.appendChild(el("p", "lesson-card__eyebrow", "Kaldığın yer"));

  const title = el("h3", "lesson-resume__title", lesson.category);
  title.lang = "en";
  panel.appendChild(title);
  panel.appendChild(
    el("p", "lesson-resume__meta", `${lesson.topicTitle} · Adım ${Math.min(entry.step + 1, stepCount)} / ${stepCount}`)
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
  const title = el("span", "lesson-row__title", lesson.category);
  // English grammar term inside a lang="tr" page.
  title.lang = "en";
  main.appendChild(title);
  main.appendChild(el("span", "lesson-row__summary", previewOf(lesson)));
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
  const stepCounts = new Map(lessons.map((lesson) => [lesson.id, buildSteps(lesson).length]));

  indexContainer.appendChild(
    renderOverview(lessons, countCompletedLessons(lessons.map((lesson) => lesson.id)))
  );

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
  const list = el("div", "lesson-list");

  for (const topicId of topicIds) {
    const inTopic = lessons.filter((lesson) => lesson.topicId === topicId);
    if (topicIds.length > 1) {
      const heading = el("h2", "lesson-list__topic", inTopic[0].topicTitle);
      heading.lang = "en";
      list.appendChild(heading);
    }
    for (const lesson of inTopic) {
      list.appendChild(renderLessonRow(lesson, statusOf(lesson, progress, stepCounts.get(lesson.id))));
    }
  }

  indexContainer.appendChild(list);
}

/* ---- Reader: step bodies ---- */

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

function renderMistakes(mistakes) {
  const list = el("ul", "mistake-list");
  for (const mistake of mistakes) {
    const item = document.createElement("li");

    const wrong = el("p", "mistake-list__line mistake-list__line--wrong");
    wrong.appendChild(el("span", "mistake-list__mark", "✕"));
    const wrongText = el("span", "mistake-list__sentence", mistake.wrong);
    wrongText.lang = "en";
    wrong.appendChild(wrongText);
    item.appendChild(wrong);

    const right = el("p", "mistake-list__line mistake-list__line--right");
    right.appendChild(el("span", "mistake-list__mark", "✓"));
    const rightText = el("span", "mistake-list__sentence", mistake.right);
    rightText.lang = "en";
    right.appendChild(rightText);
    item.appendChild(right);

    item.appendChild(el("p", "mistake-list__why", mistake.why));
    list.appendChild(item);
  }
  return list;
}

function renderCheck(step, stepIndex, card) {
  const question = step.question;
  const answered = state.reader.answers.has(stepIndex);
  const selected = state.reader.answers.get(stepIndex);

  const prompt = el("p", "question-card__prompt");
  appendBlanked(prompt, question.prompt);
  card.appendChild(prompt);

  const optionsWrap = el("div", "options");
  question.options.forEach((option, index) => {
    const button = el("button", "option-btn");
    button.type = "button";
    button.appendChild(el("span", "option-btn__key", `${index + 1}.`));
    button.appendChild(document.createTextNode(option));

    if (answered) {
      button.disabled = true;
      if (option === question.correctAnswer) {
        button.classList.add("option-btn--correct");
      } else if (option === selected) {
        button.classList.add("option-btn--incorrect");
      }
    } else {
      button.addEventListener("click", () => {
        state.reader.answers.set(stepIndex, option);
        renderStep();
      });
    }
    optionsWrap.appendChild(button);
  });
  card.appendChild(optionsWrap);

  if (answered) {
    // No tip here: the lesson has just spent several steps stating the rule.
    card.appendChild(renderAnswerFeedback(question, selected === question.correctAnswer, { withTip: false }));
  }
}

function renderStepCard(step, stepIndex) {
  const card = el("div", "panel lesson-step");

  if (step.kind === "check") {
    card.appendChild(el("p", "lesson-step__kicker", step.heading));
    renderCheck(step, stepIndex, card);
    return card;
  }

  card.appendChild(el("h3", "lesson-step__heading", step.heading));

  switch (step.kind) {
    case "form": {
      const body = el("div", "lesson-step__body lesson-step__body--form");
      appendProse(body, step.body);
      card.appendChild(body);
      break;
    }
    case "examples":
      card.appendChild(renderExamples(step.examples));
      break;
    case "mistakes":
      card.appendChild(renderMistakes(step.mistakes));
      break;
    default: {
      const body = el("div", "lesson-step__body");
      appendProse(body, step.body);
      card.appendChild(body);
    }
  }

  return card;
}

/* ---- Reader: frame ---- */

const currentLesson = () => state.lessons[state.reader.lessonIndex];

function renderReaderNav(trailingText) {
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
  const eyebrow = el("p", "lesson-card__eyebrow", lesson.topicTitle);
  eyebrow.lang = "en";
  wrap.appendChild(eyebrow);
  const title = el("h2", "lesson-reader__title", lesson.category);
  title.lang = "en";
  wrap.appendChild(title);
  return wrap;
}

function renderStep() {
  const lesson = currentLesson();
  const { stepIndex, steps } = state.reader;
  const step = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  recordLessonStep(lesson.id, stepIndex);

  clear(readerContainer);
  readerContainer.appendChild(renderReaderNav(`${stepIndex + 1} / ${steps.length}`));
  readerContainer.appendChild(progressTrack((stepIndex + 1) / steps.length));
  readerContainer.appendChild(renderLessonHeading(lesson));
  readerContainer.appendChild(renderStepCard(step, stepIndex));

  // A check is never a gate. Leaving it unanswered is a legitimate
  // choice — someone re-reading a lesson for one rule shouldn't have to
  // sit an exercise to get past it — so the forward control stays live
  // and just says what it will do.
  const skippingCheck = step.kind === "check" && !state.reader.answers.has(stepIndex);

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
      label: skippingCheck ? "Atla" : isLastStep ? "Dersi Bitir" : "İleri",
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

  appContent.scrollTo({ top: 0 });
}

function renderCompletion() {
  const lesson = currentLesson();
  markLessonDone(lesson.id, state.reader.steps.length - 1);

  const nextLesson = state.lessons[state.reader.lessonIndex + 1] ?? null;
  const completed = countCompletedLessons(state.lessons.map((entry) => entry.id));

  clear(readerContainer);
  readerContainer.appendChild(renderReaderNav(`${state.lessons.length} dersten ${completed}`));

  const panel = el("section", "panel lesson-complete");
  panel.appendChild(el("p", "lesson-card__eyebrow", "Ders tamamlandı"));
  const title = el("h2", "lesson-complete__title", lesson.category);
  title.lang = "en";
  panel.appendChild(title);
  panel.appendChild(
    el(
      "p",
      "lesson-complete__body",
      "Öğrendiğini pekiştirmenin en hızlı yolu birkaç soru çözmek. Ya da sıradaki derse geç."
    )
  );
  panel.appendChild(progressTrack(completed / state.lessons.length));
  readerContainer.appendChild(panel);

  setBottomBarActions([
    {
      label: "Bu Konudan Test Çöz",
      variant: "secondary",
      onClick: () => startTopicTest(lesson.topicId),
    },
    nextLesson
      ? { label: "Sıradaki Ders", onClick: () => openLessonByHash(nextLesson.id) }
      : { label: "Derslere Dön", onClick: showIndexByHash },
  ]);

  appContent.scrollTo({ top: 0 });
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

  const step = state.reader.steps[state.reader.stepIndex];
  if (step?.kind === "check" && !state.reader.answers.has(state.reader.stepIndex)) {
    const choice = Number(event.key);
    if (Number.isInteger(choice) && choice >= 1 && choice <= step.question.options.length) {
      event.preventDefault();
      state.reader.answers.set(state.reader.stepIndex, step.question.options[choice - 1]);
      renderStep();
      return;
    }
  }

  const buttons = bottomBarInner.querySelectorAll("button");
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
  siteHeader.hidden = active;
  bottomNav.hidden = active;
  indexContainer.hidden = active;
  readerContainer.hidden = !active;
  // The dev note sits above the views rather than inside one, so it needs
  // hiding too or it survives into the reader's focused mode. A class,
  // not `hidden`: that attribute belongs to the dismissal logic in
  // home.js, and two owners would fight over it.
  document.body.classList.toggle("is-reading", active);
}

/** Leaves reader mode and restores the app header and bottom nav. */
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
    clear(indexContainer);
    indexContainer.appendChild(el("p", "empty-state", "Dersler yüklenemedi. Sayfayı yenile."));
  }
}

/**
 * @param {string} lessonId - comes from the URL hash, so it may be stale
 *   or hand-typed; an unknown id falls back to the index without leaving
 *   a dead entry in the history.
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
  renderStep();
}
