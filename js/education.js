// Eğitim — the app's home, and its teaching half. Two screens:
//
//   Index   every lesson across every topic. It opens with what to do
//           next, not with a table of contents: overall progress, then the
//           lesson you were in the middle of, then the list. Deliberately
//           not a locked linear path — this is a study tool, and someone
//           who wants one specific rule should not have to walk through
//           five chapters to reach it.
//   Reader  a focused mode (the header and the nav step out of the way, as
//           on the quiz screen) holding one lesson as one scrolling page.
//
// The reader used to page through a lesson one step at a time, and a step
// that held a single sentence left two thirds of the phone empty while
// still asking for a tap. A lesson is now a page you scroll, built from
// typed blocks the content declares (docs/CONTENT_GUIDE.md) — a contrast,
// a set of forms, a pitfall, a decision procedure, a check. The blocks are
// semantic, so everything below about how they *look* is this file's
// business alone and can change without touching a content file.
//
// Progress is a read fraction rather than a step index, because that is
// what a scrolling page has, and because it stays meaningful when an
// author adds a block to a lesson someone is halfway through.

import { loadManifest, loadLessonsForTopics, lessonIndex } from "./topics.js";
import {
  getAllLessonProgress,
  getLessonProgress,
  recordLessonRead,
  markLessonDone,
  countCompletedLessons,
} from "./storage.js";
import { shuffle, isCorrectAnswer } from "./quiz-engine.js";
import { renderAnswerFeedback, answerAnnouncement } from "./feedback.js";
import { renderPrompt } from "./prompt.js";
import { renderOptions } from "./answers.js";
import { startTopicTest } from "./quiz-launch.js";
import { el, clear, appendProse, appendInline } from "./dom.js";
import { icon } from "./icons.js";
import { announce, scrollToTop, createActionBar } from "./shell.js";

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
  /** @type {{lessonIndex: number, answers: Map<number, string>}|null} */
  reader: null,
};

/* ---- Loading ---- */

/**
 * The index screen needs names and progress, not content, so it loads the
 * manifest and stops there. Opening a lesson is what fetches a topic file
 * — see `openLesson`. That split is the difference between a 141 KB home
 * screen and a 1.7 KB one, and it grows with the content.
 */
function loadLessons() {
  return loadManifest()
    .then((manifest) => {
      const lessons = lessonIndex(manifest);
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

function statusOf(lesson, progress) {
  const entry = progress[lesson.id];
  if (entry?.done) {
    return { done: true, label: "Tamamlandı" };
  }
  if (entry && entry.read > 0.02) {
    return { done: false, label: `%${Math.round(entry.read * 100)}` };
  }
  return { done: false, label: null };
}

function renderProgressSummary(lessons, completed) {
  const block = el("section", "stack stack--tight");
  block.appendChild(el("h2", "t-label", "İlerlemen"));
  block.appendChild(progressBar(lessons.length === 0 ? 0 : completed / lessons.length));
  block.appendChild(el("p", "t-meta", `${lessons.length} dersten ${completed} tanesi tamamlandı`));
  return block;
}

/**
 * The one thing on the screen that is a card. It is heterogeneous — a
 * label, an English title, a Turkish counter and an action — which is
 * exactly the case a surface is for; the lesson list below it is
 * homogeneous, so it is rows.
 */
function renderResumeCard(lesson, entry) {
  const card = el("section", "surface stack");

  const head = el("div", "stack stack--tight");
  head.appendChild(el("p", "t-label", "Kaldığın yer"));
  head.appendChild(englishTitle("h2", "t-title t-en", lesson.category));
  head.appendChild(el("p", "t-meta t-num", `${lesson.topicTitle} · %${Math.round(entry.read * 100)}`));
  card.appendChild(head);

  card.appendChild(progressBar(entry.read));

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
  main.appendChild(el("span", "row__sub", lesson.summary ?? ""));
  row.appendChild(main);

  const trail = el("span", "row__trail");
  if (status.done) {
    // No tick inside the chip: the set is drawn with a 2px absolute stroke
    // and a chip-sized icon would render it at 1.2px, which is exactly how
    // an icon set starts going soft. The green tint is the second channel.
    trail.appendChild(el("span", "chip chip--ok", "Tamamlandı"));
  } else if (status.label) {
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
  const completed = countCompletedLessons(lessons.map((lesson) => lesson.id));

  indexContainer.appendChild(renderProgressSummary(lessons, completed));

  const resumable = lessons.find((lesson) => {
    const entry = progress[lesson.id];
    return entry && !entry.done && entry.read > 0.02;
  });
  if (resumable) {
    indexContainer.appendChild(renderResumeCard(resumable, progress[resumable.id]));
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
      list.appendChild(renderLessonRow(lesson, statusOf(lesson, progress)));
    }
    section.appendChild(list);
    indexContainer.appendChild(section);
  }
}

/* ---- Reader: the blocks ---- */

/**
 * The check pool for one opening of a lesson. Shuffled once, then each
 * `check` block takes the next one — so a learner who re-reads a lesson
 * does not meet the same two questions every time, and two checks in one
 * lesson are never the same question.
 */
function takeChecks(lesson) {
  const pool = shuffle(lesson.checkPool ?? []);
  let taken = 0;
  return () => (taken < pool.length ? pool[taken++] : null);
}

function renderTextBlock(block) {
  const body = el("div", "prose");
  appendProse(body, block.body, "t-body");
  return body;
}

/**
 * Two or three forms set against each other. Stacked rather than columned:
 * at 320px two columns give each side about 140px, which is not a measure
 * anyone can read a grammar gloss in. The label carries the distinction,
 * and a hairline carries the boundary.
 */
function renderContrastBlock(block) {
  const list = el("ul", "stack");
  block.sides.forEach((side, index) => {
    const item = el("li", "stack stack--tight");
    if (index > 0) {
      item.appendChild(el("span", "divider"));
    }
    item.appendChild(englishTitle("p", "t-lead t-en", side.label));
    const gloss = el("p", "t-body");
    appendInline(gloss, side.gloss);
    item.appendChild(gloss);
    if (side.example) {
      item.appendChild(englishTitle("p", "t-body t-en", side.example));
    }
    list.appendChild(item);
  });
  return list;
}

/**
 * The structural patterns — the one block that earns a card, because it is
 * a reference the learner scrolls back to rather than a paragraph they
 * read once. Grouped by form here rather than in the data: the schema
 * keeps rows flat so a content file never nests three deep.
 */
function renderFormsBlock(block) {
  const card = el("div", "surface stack");
  const byForm = new Map();
  for (const row of block.rows) {
    if (!byForm.has(row.form)) {
      byForm.set(row.form, []);
    }
    byForm.get(row.form).push(row);
  }

  for (const [form, rows] of byForm) {
    const group = el("div", "stack stack--tight");
    group.appendChild(englishTitle("p", "t-label", form));
    for (const row of rows) {
      const line = el("div", "stack");
      line.style.gap = "0";
      const pattern = el("p", "t-body t-en");
      pattern.lang = "en";
      pattern.appendChild(document.createTextNode(row.pattern));
      line.appendChild(pattern);
      const meta = el("p", "t-meta");
      meta.appendChild(document.createTextNode(row.use));
      if (row.example) {
        meta.appendChild(document.createTextNode(" · "));
        const example = el("span", "t-en", row.example);
        example.lang = "en";
        meta.appendChild(example);
      }
      line.appendChild(meta);
      group.appendChild(line);
    }
    card.appendChild(group);
  }
  return card;
}

function renderExamplesBlock(block) {
  const list = el("ul", "stack");
  block.items.forEach((item, index) => {
    const entry = el("li", "stack stack--tight");
    if (index > 0) {
      entry.appendChild(el("span", "divider"));
    }
    entry.appendChild(englishTitle("p", "t-lead t-en", item.sentence));
    const note = el("p", "t-meta");
    appendInline(note, item.note);
    entry.appendChild(note);
    list.appendChild(entry);
  });
  return list;
}

/**
 * Wrong above right, with the verdict on a glyph as well as a colour —
 * neither red nor green clears the contrast bar as text on this ground,
 * and colour alone would say nothing in greyscale.
 */
function renderPitfallBlock(block) {
  const wrap = el("div", "stack stack--tight");

  const line = (kind, sentence) => {
    const row = el("p", "cluster");
    const mark = el("span", kind === "ok" ? "ink-ok" : "ink-no");
    mark.appendChild(icon(kind === "ok" ? "check" : "close", { size: 20 }));
    row.appendChild(mark);
    row.appendChild(englishTitle("span", "t-body t-en", sentence));
    return row;
  };

  wrap.appendChild(line("no", block.wrong));
  wrap.appendChild(line("ok", block.right));
  const why = el("p", "t-meta");
  appendInline(why, block.why);
  wrap.appendChild(why);
  return wrap;
}

/**
 * What to do when you see it. Signal words are chips because that is how
 * they are met in an exam — scanned for, not read — and a condition is a
 * sentence because no word list captures it.
 */
function renderDecisionBlock(block) {
  const list = el("ul", "stack");

  const trigger = (rule) => {
    if (rule.signals) {
      const chips = el("div", "cluster");
      for (const signal of rule.signals) {
        const chip = el("span", "chip t-en", signal);
        chip.lang = "en";
        chips.appendChild(chip);
      }
      return chips;
    }
    const condition = el("p", "t-body");
    appendInline(condition, rule.condition);
    return condition;
  };

  // Consecutive rules with the same outcome are one entry with two ways in.
  // A word list and a condition that both land on `will` are two routes to
  // one answer, and printing "→ will" twice in a row reads as a mistake.
  for (let index = 0; index < block.rules.length; ) {
    const outcome = block.rules[index].then;
    const item = el("li", "stack stack--tight");

    do {
      item.appendChild(trigger(block.rules[index]));
      index += 1;
    } while (index < block.rules.length && block.rules[index].then === outcome);

    const line = el("p", "cluster");
    const arrow = el("span");
    arrow.appendChild(icon("arrow-right", { size: 20 }));
    line.appendChild(arrow);
    line.appendChild(englishTitle("span", "t-lead t-en", outcome));
    item.appendChild(line);

    list.appendChild(item);
  }

  return list;
}

/**
 * An inline check. Answering re-renders only this block, not the page:
 * rebuilding the whole lesson would throw the learner's scroll position
 * away at the exact moment they want to read the feedback.
 */
function renderCheckBlock(question, blockIndex) {
  const wrap = el("div", "stack");
  wrap.dataset.check = String(blockIndex);

  wrap.appendChild(el("p", "t-label", "Kontrol"));

  wrap.appendChild(renderPrompt(question));

  const answered = state.reader.answers.has(blockIndex);
  const selected = state.reader.answers.get(blockIndex) ?? null;

  wrap.appendChild(
    renderOptions(question, {
      selected,
      answered,
      onSelect: (option) => {
        state.reader.answers.set(blockIndex, option);
        announce(...answerAnnouncement(question, isCorrectAnswer(question, option), option));
        // Pin the scroll position across the swap. The feedback is added
        // *below* the options, so nothing the learner is looking at has
        // moved — but the browser's own scroll anchoring picks an anchor
        // near the top of the viewport, and when that anchor sits below
        // the insertion it "helpfully" scrolls down by the height of the
        // new content. Measured at 162px on a 320px screen, which is the
        // whole verdict line sliding out from under the reader's eyes.
        const top = scrollRegion.scrollTop;
        wrap.replaceWith(renderCheckBlock(question, blockIndex));
        scrollRegion.scrollTop = top;
      },
    })
  );

  if (answered) {
    // No tip: the lesson has just said the rule at length.
    wrap.appendChild(
      renderAnswerFeedback(question, isCorrectAnswer(question, selected), { withTip: false, selected })
    );
  }

  return wrap;
}

const BLOCK_RENDERERS = {
  text: renderTextBlock,
  contrast: renderContrastBlock,
  forms: renderFormsBlock,
  examples: renderExamplesBlock,
  pitfall: renderPitfallBlock,
  decision: renderDecisionBlock,
};

function renderBlock(block, index, nextCheck) {
  const wrap = el("section", "stack stack--tight");

  if (block.type === "check") {
    const question = nextCheck();
    // A lesson can ask for more checks than its category has questions.
    // Rendering nothing is the honest answer; the validator warns about it
    // at authoring time, which is where it can actually be fixed.
    return question ? renderCheckBlock(question, index) : null;
  }

  const render = BLOCK_RENDERERS[block.type];
  if (!render) {
    // Content newer than this build. Skipping it beats throwing away the
    // whole lesson around it.
    console.warn(`unknown lesson block type "${block.type}" — skipped`);
    return null;
  }

  if (block.heading) {
    wrap.appendChild(el("h3", "t-label", block.heading));
  }
  wrap.appendChild(render(block));
  return wrap;
}
/* ---- Reader: the page ---- */

const currentLesson = () => state.lessons[state.reader.lessonIndex];

const scrollRegion = document.getElementById("shell-scroll");

/** 0…1: how far down the lesson the bottom of the viewport has reached. */
function readFraction() {
  const scrollable = scrollRegion.scrollHeight - scrollRegion.clientHeight;
  // A lesson shorter than the viewport has nothing to scroll, so opening
  // it *is* reading all of it.
  return scrollable <= 0 ? 1 : Math.min(scrollRegion.scrollTop / scrollable, 1);
}

let progressFill = null;
let readout = null;
let scrollTicking = false;

/**
 * Close enough to the bottom to count as read. Not 1: the last pixel is
 * unreachable on plenty of devices — a hairline of rounding, a rubber-band
 * scroll that settles a pixel short — and a learner who has read the whole
 * lesson should not be told they have not.
 */
const READ_THRESHOLD = 0.98;

/**
 * The position indicator, and the progress record. Both are driven from
 * one scroll listener on an animation frame — on a phone a scroll event
 * fires far more often than the screen refreshes, and doing layout work
 * per event is how a reading surface starts to feel cheap.
 */
function handleReaderScroll() {
  if (!state.reader || scrollTicking) {
    return;
  }
  scrollTicking = true;
  requestAnimationFrame(() => {
    scrollTicking = false;
    if (!state.reader) {
      return;
    }
    const read = readFraction();
    const percent = Math.round(read * 100);
    if (progressFill) {
      progressFill.style.width = `${percent}%`;
    }
    if (readout) {
      readout.textContent = `%${percent}`;
    }

    const lesson = currentLesson();
    // Reaching the end *is* finishing. There is no "Dersi bitir" button to
    // press, because a button that only confirms what the scroll position
    // already proved is a tap asked for nothing.
    if (read >= READ_THRESHOLD) {
      markLessonDone(lesson.id);
    } else {
      recordLessonRead(lesson.id, read);
    }
  });
}

function renderReaderTop() {
  const top = el("div", "reader__top bleed");

  const strip = el("div", "cluster cluster--spread");
  const back = el("button", "btn btn--quiet", "Dersler");
  back.type = "button";
  back.prepend(icon("arrow-left", { size: 20 }));
  back.addEventListener("click", showIndexByHash);
  strip.appendChild(back);
  strip.appendChild(el("p", "t-meta t-num", "%0"));
  top.appendChild(strip);

  const track = progressBar(0);
  top.appendChild(track);

  progressFill = track.firstElementChild;
  readout = strip.lastElementChild;
  return top;
}

function renderLesson() {
  const lesson = currentLesson();
  const nextCheck = takeChecks(lesson);

  clear(readerContainer);
  const page = el("article", "stack stack--loose");
  page.appendChild(renderReaderTop());

  const heading = el("header", "stack stack--tight");
  heading.appendChild(englishTitle("p", "t-label", lesson.topicTitle));
  heading.appendChild(englishTitle("h1", "t-display t-en", lesson.category));
  if (lesson.summary) {
    heading.appendChild(el("p", "t-lead", lesson.summary));
  }
  page.appendChild(heading);

  lesson.blocks.forEach((block, index) => {
    const node = renderBlock(block, index, nextCheck);
    if (node) {
      page.appendChild(node);
    }
  });

  page.appendChild(renderLessonEnd(lesson));
  readerContainer.appendChild(page);

  // No action bar. A lesson is something to read, and a filled amber slab
  // pinned under every screen of it is the loudest thing on a surface
  // whose whole job is to be quiet. The way out is the sticky header; the
  // things to do next are at the end, where you arrive at them.
  actionBar.hide();
}

/**
 * The end of the page, not a separate screen. Reaching the bottom of a
 * lesson is the natural moment to offer the next thing, and making it a
 * screen of its own would mean a tap to see two buttons.
 */
function renderLessonEnd(lesson) {
  const nextLesson = state.lessons[state.reader.lessonIndex + 1] ?? null;

  const card = el("section", "surface stack");
  const head = el("div", "stack stack--tight");
  head.appendChild(el("p", "t-label", "Ders bitti"));
  head.appendChild(
    el(
      "p",
      "t-body",
      "Öğrendiğini pekiştirmenin en hızlı yolu birkaç soru çözmek. Ya da sıradaki derse geç."
    )
  );
  card.appendChild(head);

  const test = el("button", "btn btn--secondary", "Bu konudan test çöz");
  test.type = "button";
  test.addEventListener("click", () => {
    markLessonDone(lesson.id);
    startTopicTest(lesson.topicId).catch(console.error);
  });
  card.appendChild(test);

  if (nextLesson) {
    const next = el("button", "btn btn--primary", "Sıradaki ders");
    next.type = "button";
    next.addEventListener("click", () => {
      markLessonDone(lesson.id);
      openLessonByHash(nextLesson.id);
    });
    card.appendChild(next);
  } else {
    const back = el("button", "btn btn--primary", "Derslere dön");
    back.type = "button";
    back.addEventListener("click", () => {
      markLessonDone(lesson.id);
      showIndexByHash();
    });
    card.appendChild(back);
  }

  return card;
}

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
  if (active) {
    scrollRegion.addEventListener("scroll", handleReaderScroll, { passive: true });
  } else {
    scrollRegion.removeEventListener("scroll", handleReaderScroll);
    progressFill = null;
    readout = null;
  }
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

  const lessonPosition = lessons.findIndex((lesson) => lesson.id === lessonId);
  if (lessonPosition === -1) {
    history.replaceState(null, "", "#egitim");
    await showLessonIndex();
    return;
  }

  // Only now is the topic file worth fetching — and only this lesson's.
  try {
    const manifest = await loadManifest();
    const topic = manifest.topics.find((entry) => entry.id === lessons[lessonPosition].topicId);
    const full = await loadLessonsForTopics([topic]);
    const loaded = full.find((lesson) => lesson.id === lessonId);
    if (!loaded) {
      throw new Error(`lesson ${lessonId} is in the manifest index but not in ${topic?.file}`);
    }
    // Keep the index entry's position so "next lesson" still walks the
    // whole syllabus rather than one topic.
    state.lessons = lessons.map((lesson) => (lesson.id === lessonId ? { ...lesson, ...loaded } : lesson));
  } catch (error) {
    console.error(error);
    clear(readerContainer);
    readerContainer.appendChild(el("p", "t-meta", "Ders yüklenemedi. Bağlantını kontrol edip tekrar dene."));
    setReaderChrome(true);
    return;
  }

  state.reader = { lessonIndex: lessonPosition, answers: new Map() };
  setReaderChrome(true);
  announce(lessons[lessonPosition].category);
  renderLesson();

  // Pick up where they stopped reading. Deferred a frame because the page
  // has only just been appended and its scroll height is not settled yet;
  // a finished lesson opens at the top, since re-reading one starts at the
  // beginning rather than at the end.
  const entry = getLessonProgress(lessonId);
  const resumeAt = entry && !entry.done ? entry.read : 0;
  requestAnimationFrame(() => {
    if (!state.reader) {
      return;
    }
    const scrollable = scrollRegion.scrollHeight - scrollRegion.clientHeight;
    scrollRegion.scrollTo({ top: scrollable * resumeAt });
    handleReaderScroll();
  });
}
