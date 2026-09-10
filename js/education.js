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

import {
  loadManifest,
  loadLessonsForTopics,
  loadTopicFile,
  lessonIndex,
  uncoveredSections,
  sectionListPhrase,
} from "./topics.js";
import {
  getAllLessonProgress,
  getLastActivity,
  getLessonProgress,
  recordLessonRead,
  markLessonDone,
  countCompletedLessons,
  getHistory,
  getItemStats,
  getSeenVersion,
  getWeakCategories,
  shouldOfferBackup,
  dismissBackupNudge,
  RE_ENTRY_DAYS,
  getProfileName,
  getOverallStats,
  getStreak,
  getTodayCount,
  getDailyGoal,
  daysToExam,
} from "./storage.js";
import { shuffle, isCorrectAnswer } from "./quiz-engine.js";
import { renderAnswerFeedback, answerAnnouncement } from "./feedback.js";
import { renderPrompt } from "./prompt.js";
import { renderOptions } from "./answers.js";
import { startTopicTest, startCategoryPractice, startMixedTest } from "./quiz-launch.js";
import { TOPIC_INTRO_PREFIX } from "./config.js";
import { TIER_ORDER, TIER_LABELS } from "./tiers.js";
import { el, clear, pane, appendProse, appendInline, sectionHeading, failureCard, textButton } from "./dom.js";
import { icon } from "./icons.js";
import { ring, monogram, hueOf } from "./widgets.js";
import { announce, scrollToTop, createActionBar, createBar } from "./shell.js";

const bottomNav = document.getElementById("bottom-nav");
const bar = createBar("shell-header");
const indexContainer = document.getElementById("lesson-index");
const readerContainer = document.getElementById("lesson-reader");
const actionBar = createActionBar("lesson-bar");

const state = {
  /** @type {Array<object>|null} */
  lessons: null,
  /** How many questions the app has in total — the denominator behind
   * "you have seen all of them", and the only thing the index needs from
   * the manifest that the lesson list does not already carry. */
  questionCount: 0,
  /** The scored sections still not practisable, as a Turkish phrase. */
  uncovered: "",
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
      state.questionCount = manifest.topics
        .filter((topic) => !topic.comingSoon)
        .reduce((total, topic) => total + (topic.questionCount ?? 0), 0);
      state.uncovered = sectionListPhrase(uncoveredSections(manifest.topics));
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

/**
 * The home hero: who this is, how today is going, and the one thing to do
 * next. Every state the index knows — never opened, half a lesson,
 * tested but nothing read, away for a fortnight, everything done — fills
 * the same shape (docs/ui3-plan.md §5), so the screen is one object with
 * a changing offer rather than five different cards.
 *
 * `surface` as well as `hero`: a hero IS the screen's card, and the
 * sweep's checks on "the card" keep pointing at it.
 *
 * @param {{eyebrow: string, line?: string, lineLang?: string, primary: {label: string, onClick: () => void},
 *          secondary?: {label: string, onClick: () => void}, facts?: string[], quiet?: string}} spec
 */
function renderHero(spec) {
  const card = el("section", "surface hero");
  card.appendChild(el("span", "hero__orb"));

  const head = el("div", "hero__head");
  const titles = el("div", "stack stack--snug");
  titles.appendChild(el("p", "t-label", spec.eyebrow));
  const name = getProfileName().trim();
  titles.appendChild(el("h2", "t-title", name ? `Merhaba, ${name}` : "Merhaba"));
  head.appendChild(titles);

  // Today against the goal. The ring is the day's one number; the goal
  // is what the learner said they would do (Profil, or the first run).
  const goal = getDailyGoal();
  const today = getTodayCount();
  const done = today >= goal;
  head.appendChild(
    ring({
      ratio: goal === 0 ? 0 : today / goal,
      label: `${today}/${goal}`,
      tone: done ? "ok" : "accent",
      describedAs: `Bugün ${today} soru, hedef ${goal}`,
    })
  );
  card.appendChild(head);

  // The exam and the streak, as chips — only when there is something to
  // say. A countdown nobody set and a streak of nought are both silence.
  const chips = el("div", "cluster");
  const days = daysToExam();
  if (days !== null && days >= 0) {
    const chip = el("span", "chip chip--accent");
    chip.appendChild(icon("calendar", { size: 18 }));
    chip.appendChild(document.createTextNode(days === 0 ? "Sınav bugün" : `Sınava ${days} gün`));
    chips.appendChild(chip);
  }
  const streak = getStreak();
  if (streak.days >= 1) {
    const chip = el("span", "chip chip--ok");
    chip.appendChild(icon("flame", { size: 18 }));
    chip.appendChild(document.createTextNode(`${streak.days} gün seri`));
    chips.appendChild(chip);
  }
  if (done) {
    const chip = el("span", "chip chip--ok");
    chip.appendChild(icon("spark-fill", { size: 18 }));
    chip.appendChild(document.createTextNode("Günlük hedef tamam"));
    chips.appendChild(chip);
  }
  if (chips.childElementCount > 0) {
    card.appendChild(chips);
  }

  if (spec.line) {
    const line = el("p", "t-body", spec.line);
    if (spec.lineLang) {
      line.lang = spec.lineLang;
    }
    card.appendChild(line);
  }

  const actions = el("div", "stack stack--tight");
  const primary = el("button", "btn btn--primary", spec.primary.label);
  primary.type = "button";
  primary.addEventListener("click", spec.primary.onClick);
  actions.appendChild(primary);
  if (spec.secondary) {
    actions.appendChild(textButton(spec.secondary.label, spec.secondary.onClick, icon));
  }
  card.appendChild(actions);

  for (const fact of spec.facts ?? []) {
    card.appendChild(el("p", "t-meta t-num", fact));
  }
  if (spec.quiet) {
    card.appendChild(el("p", "t-quiet", spec.quiet));
  }
  return card;
}

/**
 * Three figures under the hero: the streak, the lessons, the accuracy.
 * Tiles, so each is an object; the labels say which question each
 * number answers, as Profil's do.
 */
function renderStatStrip(lessons, completed) {
  const stats = getOverallStats();
  const streak = getStreak();
  const grid = el("div", "stats");
  grid.id = "home-stats";

  const tile = (value, label, iconName) => {
    const cell = el("div", "stat");
    const value_ = el("div", "stat__value t-num");
    if (iconName) {
      const mark = el("span", "cluster");
      mark.appendChild(icon(iconName, { size: 22 }));
      mark.appendChild(document.createTextNode(value));
      value_.appendChild(mark);
    } else {
      value_.textContent = value;
    }
    cell.appendChild(value_);
    cell.appendChild(el("div", "stat__label", label));
    return cell;
  };

  grid.appendChild(tile(String(streak.days), "gün seri", "flame"));
  grid.appendChild(tile(`${completed} / ${lessons.length}`, "ders bitti"));
  grid.appendChild(
    tile(
      stats.accuracy === null ? "—" : `%${Math.round(stats.accuracy * 100)}`,
      stats.accuracyWindow > 0 ? `son ${stats.accuracyWindow} soruda` : "doğruluk"
    )
  );
  return grid;
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
  return renderHero({
    eyebrow: "Kaldığın yer",
    line: `${lesson.category} · %${Math.round(entry.read * 100)}`,
    lineLang: "en",
    primary: { label: "Devam et", onClick: () => openLessonByHash(lesson.id) },
    facts: [lesson.topicTitle],
  });
}

/**
 * What a learner sees the first time, in place of a progress bar reading
 * zero and a counter saying 0 of 18.
 *
 * Not a tour. The strongest evidence against one is a 70-participant
 * between-subjects test across four iOS apps in which the group that read
 * the first-launch tutorial rated the app HARDER to use than the group
 * that skipped it — 4.92 against 5.49 — and NN/g's summary of the wider
 * work, that tutorials interrupt, do not improve task performance and are
 * quickly forgotten. The one form that survives is help attached to a
 * feature at the moment someone first reaches for it, which is not a
 * first-run flow at all.
 *
 * Three reasons specific to this app, on top of that. There are two
 * destinations and the nav already says their names in Turkish. The
 * interface is twelve primitives on purpose, and an interface that needs
 * a tour has a design problem the tour would be hiding. And a first-run
 * step is a tax on every arrival, charged to the person least invested,
 * between a link and the thing they came for.
 *
 * So this is the empty state doing its job: what the app is, one obvious
 * first action, and the privacy fact that is otherwise buried in Profil.
 * It disappears the moment there is any progress, and it REPLACES the
 * progress summary rather than sitting above it — a bar reading zero and
 * a card saying "start here" are two ways of saying the same nothing.
 */
function renderWelcome(firstLesson) {
  // The topic, not its first lesson: every lesson here is a contrast,
  // and dropping a learner into one before they have the category is
  // dropping them into an argument about a word they have not met. The
  // topic screen says what a tense IS and then hands them on.
  const primary = firstLesson
    ? {
        label: `${firstLesson.topicTitle} ile başla`,
        onClick: () =>
          firstLesson.hasIntro ? openIntroByHash(firstLesson.topicId) : openLessonByHash(firstLesson.id),
      }
    : { label: "Kısa bir testle başla", onClick: () => startMixedTest(5).catch(console.error) };
  return renderHero({
    eyebrow: "Başlamak için",
    // What the app is, in one line, and the privacy fact otherwise buried
    // in Profil. Not the brand: the manifest and the first-run flow say
    // it, and this card's job is to say what to do.
    line: "Yeterlik sınavı için dersler ve paragraf soruları. Hesap yok; her şey bu telefonda kalır.",
    primary,
    secondary: firstLesson
      ? { label: "Ya da kısa bir testle başla", onClick: () => startMixedTest(5).catch(console.error) }
      : undefined,
    quiet: firstLesson ? "Önce bu konunun ne olduğu, sonra altı ders." : undefined,
  });
}

/**
 * The resume card, for someone who has been away.
 *
 * A fortnight off is not a lapse to apologise for: for an exam a couple of
 * months out it is roughly the spacing the literature would have chosen.
 * So this changes WHAT IS OFFERED and says nothing about the absence — it
 * never names a number of days and never uses a word that implies fault.
 * It reads as a menu, not as a greeting from someone who was waiting.
 *
 * The second button is the one that matters. Coming back to a lesson you
 * left at 73% means re-reading something you no longer remember choosing;
 * five questions takes ninety seconds and tells you what you still have.
 *
 * And there is one genuinely good thing to tell a returner that is not a
 * verdict on them: new content. It is news about the app, and it is the
 * only message that gets better the longer they were gone.
 */
function renderReEntryCard(lesson, entry, news, nextUnread, totals) {
  // The weakest category when there is one, the abandoned lesson's own
  // category otherwise, and a short mixed test when the app knows neither.
  const weakest = getWeakCategories(1)[0] ?? null;
  const category = lesson ? lesson.category : weakest?.category ?? null;
  const recall = () => {
    const start = category ? startCategoryPractice(category, 5) : startMixedTest(5);
    start.catch(console.error);
  };

  if (lesson) {
    return renderHero({
      eyebrow: "Kaldığın yer",
      line: `${lesson.category} · %${Math.round(entry.read * 100)}`,
      lineLang: "en",
      primary: { label: "Önce 5 soruyla hatırla", onClick: recall },
      secondary: { label: "Kaldığın yerden devam et", onClick: () => openLessonByHash(lesson.id) },
      facts: [lesson.topicTitle],
      quiet: news ?? undefined,
    });
  }
  // Someone who finishes what they start, and came back: no place they
  // left off, so the next unread lesson is the way on. No count of days
  // away, no "welcome back" — a returner is not apologised to.
  return renderHero({
    eyebrow: "Kısa bir hatırlatma",
    line: "Beş soru, doksan saniye. Neyin durduğunu okumaktan daha hızlı gösterir.",
    primary: { label: "5 soruyla başla", onClick: recall },
    secondary: nextUnread
      ? { label: "Sıradaki derse geç", onClick: () => openLessonByHash(nextUnread.id) }
      : undefined,
    facts: [
      ...(nextUnread ? [`${nextUnread.topicTitle} · ${nextUnread.category}`] : []),
      `${totals.lessons} dersten ${totals.completed} tanesi tamamlandı`,
    ],
    quiet: news ?? undefined,
  });
}

/**
 * The next-step card: the state the Eğitim index spends most of its life
 * in, and the one it used to have nothing for.
 *
 * A learner who has taken tests but finished no lesson used to land on a
 * bar reading zero and the line "18 dersten 0 tanesi tamamlandı" — a
 * number that is true, means nothing, and represents none of the work
 * they have actually done. Everything the app knew about them was on two
 * other screens.
 *
 * So the card answers "what now" with the one thing the app is in a
 * position to know: the category they have got most wrong, and the lesson
 * that teaches it. The progress line survives, below the button, as a
 * fact rather than as the headline.
 *
 * It suggests and never locks. Every lesson row below stays open and in
 * the same order — a recommendation is not a gate, which is what
 * `docs/education-notes.md` settled and what `practice-modes.md` refuses
 * under "unlock progression".
 */
function renderNextStepCard(lessons, progress, completed) {
  const weakest = getWeakCategories(1)[0] ?? null;
  const weakLesson = weakest ? lessons.find((lesson) => lesson.category === weakest.category) : null;
  const target = weakLesson ?? lessons.find((lesson) => !progress[lesson.id]?.done) ?? null;
  if (!target) {
    return null;
  }
  // The weak category's lesson is often one already read — the app knows
  // a category is weak because it was tested, and it gets tested after
  // the lesson. What is next there is practice, not a re-read.
  const rereading = weakLesson !== null && Boolean(progress[weakLesson.id]?.done);

  return renderHero({
    eyebrow: "Sıradaki adım",
    line: rereading
      ? `${target.category}: dersi okudun ama son testlerde en çok burada zorlandın. Sırada okumak değil, soru çözmek var.`
      : weakLesson
        ? `${target.category}: son testlerde en çok burada zorlandın. Ders, aynı soruları tekrar çözmekten daha çok işe yarar.`
        : `${target.category} — buradan devam edebilirsin.`,
    primary: {
      label: rereading ? "Bu kategoriden pratik yap" : "Bu dersi aç",
      onClick: () => {
        if (rereading) {
          startCategoryPractice(target.category).catch(console.error);
        } else {
          openLessonByHash(target.id);
        }
      },
    },
    facts: [`${target.topicTitle} · ${lessons.length} dersten ${completed} tanesi tamamlandı`],
  });
}

/**
 * Everything read, every question met.
 *
 * This screen used to be a dead end: a full bar, a full list of ticks and
 * nothing offered. What is honest to say here is short — from here on it
 * is revision, and revision teaches less than a first pass — and it has
 * to be a statement about the app rather than a verdict on the learner.
 * There is deliberately no "you are ready": the bank is a fraction of the
 * paper, and the closing line says which parts of the exam are missing
 * rather than leaving %100 to be read as coverage.
 */
function renderAllDoneCard(lessons, missingSections) {
  const missing = `${missingSections.charAt(0).toLocaleUpperCase("tr")}${missingSections.slice(1)} burada yok.`;
  return renderHero({
    eyebrow: "Dersleri bitirdin",
    line:
      `${lessons.length} dersin hepsini okudun ve bankadaki soruların hepsini gördün. ` +
      "Buradan sonrası tekrar — gördüğün bir soruyu yeniden çözmek, ilk seferki kadar öğretmez.",
    primary: { label: "Karışık testle tekrar et", onClick: () => startMixedTest(20).catch(console.error) },
    quiet: missing,
  });
}

/**
 * "Passive Voice'a yeni sorular eklendi" — read BEFORE the card renders
 * its buttons, because every launcher in quiz-launch.js marks every live
 * topic as seen on its way out. Reading it later would delete the news at
 * the moment of showing it.
 */
function newContentNote(lessons) {
  const fresh = [];
  const seen = new Set();
  for (const lesson of lessons) {
    if (seen.has(lesson.topicId)) continue;
    seen.add(lesson.topicId);
    if (
      typeof lesson.contentVersion === "number" &&
      getSeenVersion(lesson.topicId) > 0 &&
      getSeenVersion(lesson.topicId) < lesson.contentVersion
    ) {
      fresh.push(lesson.topicTitle);
    }
  }
  if (fresh.length === 0) {
    return null;
  }
  if (fresh.length === 1) {
    return `${fresh[0]} konusuna yeni sorular eklendi.`;
  }
  if (fresh.length === 2) {
    return `${fresh.join(" ve ")} konularına yeni sorular eklendi.`;
  }
  // Naming two of four and stopping reads as "those two", which is less
  // true than the count and no shorter.
  return `${fresh.length} konuya yeni sorular eklendi.`;
}

/**
 * @param {{sub?: boolean}} [options] - `sub: false` drops the summary
 *   line. The topic screen does: its prose has just described the six
 *   lessons, each lesson opens on the same summary as its lead, and six
 *   two-line subs were 240px of a five-screen page saying it a third
 *   time. In search results the summary is what a hit is matched on, so
 *   there it stays.
 */
function renderLessonRow(lesson, status, { sub = true } = {}) {
  const row = el("button", "row");
  row.type = "button";
  row.addEventListener("click", () => openLessonByHash(lesson.id));

  row.appendChild(el("span", "row__lead t-num t-meta", String(lesson.order)));

  const main = el("span", "row__main");
  main.appendChild(englishTitle("span", "row__title t-en", lesson.category));
  if (sub) {
    main.appendChild(el("span", "row__sub", lesson.summary ?? ""));
  }
  row.appendChild(main);

  const trail = el("span", "row__trail");
  if (status.done) {
    // A check glyph in the ok ink, at the icon size the set is drawn for,
    // where a "Tamamlandı" chip used to sit: the chip plus the chevron
    // doubled the trail and broke the row at 320. The glyph is its own
    // channel — the shape, not the colour, says finished — and the row
    // keeps the chevron because it still opens.
    const done = el("span", "ink-ok");
    done.setAttribute("aria-label", "Tamamlandı");
    done.setAttribute("role", "img");
    done.appendChild(icon("check", { size: 20 }));
    trail.appendChild(done);
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

  // A split needs both of its columns to have something in them; one line
  // of "there is nothing here" is not a two-column screen.
  indexContainer.classList.remove("split");

  if (lessons.length === 0) {
    indexContainer.appendChild(el("p", "t-quiet", "Henüz ders eklenmedi."));
    return;
  }

  const progress = getAllLessonProgress();
  const completed = countCompletedLessons(lessons.map((lesson) => lesson.id));
  const untouched = completed === 0 && Object.keys(progress).length === 0 && getHistory().length === 0;

  const resumable = lessons.find((lesson) => {
    const entry = progress[lesson.id];
    return entry && !entry.done && entry.read > 0.02;
  });
  // Only when the app actually knows. A learner who has only ever read
  // lessons had no timestamp anywhere until `recordLessonRead` started
  // writing one, and guessing from an absent timestamp would tell someone
  // who has never left that they had been away.
  //
  // Computed OUT here, not inside the resumable branch: coming back after
  // three weeks is a fact about the learner, not about whether they
  // happened to abandon a lesson on the way out.
  const last = getLastActivity();
  const away = last !== null && Date.now() - last > RE_ENTRY_DAYS * 86_400_000;
  const seenEverything =
    state.questionCount > 0 &&
    completed === lessons.length &&
    Object.keys(getItemStats()).length >= state.questionCount;

  // Exactly one card, always, and its content is a function of what the
  // app knows. It used to be three mutually exclusive branches plus a bare
  // progress line for everyone who fell through — which was most
  // returners, and which is how a learner with real test history came to
  // land on a bar reading zero.
  //
  // Order matters: the more specific a state is, the earlier it is tested.
  // Finishing everything outranks having been away, because a returner who
  // has nothing left to read should not be sent to look for it.
  const card = untouched
    ? renderWelcome(lessons[0] ?? null)
    : seenEverything
      ? renderAllDoneCard(lessons, state.uncovered)
      : away
        ? renderReEntryCard(
            resumable ?? null,
            resumable ? progress[resumable.id] : null,
            newContentNote(lessons),
            lessons.find((lesson) => !progress[lesson.id]?.done) ?? null,
            { lessons: lessons.length, completed }
          )
        : resumable
          ? renderResumeCard(resumable, progress[resumable.id])
          : renderNextStepCard(lessons, progress, completed);

  // Two columns on a wide window, one everywhere else, and the same nodes
  // in the same order either way: what to do next in the pane, and the
  // whole syllabus beside it instead of a screen further down. On a phone
  // this is exactly the stack it has always been — see `pane` in
  // js/dom.js and `.split` in css/style.css.
  const aside = pane();
  const main = pane();

  // A screen this app can reach only by running out of both suggestions
  // and lessons. The summary is what it always was.
  aside.appendChild(card ?? renderProgressSummary(lessons, completed));
  aside.appendChild(renderStatStrip(lessons, completed));

  const nudge = renderBackupNudge();
  if (nudge) {
    aside.appendChild(nudge);
  }

  main.appendChild(renderIndexFilter(lessons, progress));
  const list = el("div");
  list.id = "index-list";
  list.appendChild(renderTopicIndex(lessons, progress));
  main.appendChild(list);

  indexContainer.classList.add("split");
  indexContainer.append(aside, main);
}

/**
 * One line, once, saying that a backup exists.
 *
 * Everything a learner does lives in one browser's localStorage. The app
 * has always been able to export it and has never said so anywhere but a
 * button in Profil — a screen someone revising for an exam has no reason
 * to open. Over a month of daily use, a phone left in a taxi or a browser
 * cleared by someone else is not an edge case.
 *
 * It waits until there are three attempts, because before that there is
 * nothing worth losing and the line would be noise charged to someone
 * still deciding whether to bother. It disappears for ever when
 * dismissed: a reminder that comes back is a nag, and this project has no
 * streaks, no notifications and nothing that taxes an arrival.
 */
function renderBackupNudge() {
  if (!shouldOfferBackup()) {
    return null;
  }

  const row = el("div", "note");
  // Two lines at 320 beside the 48px button, measured; the longer
  // sentence it replaced was three at body size.
  row.appendChild(el("p", "t-quiet", "İlerlemen yalnızca bu tarayıcıda; Profil'den yedek al."));

  const dismiss = el("button", "btn btn--quiet btn--icon");
  dismiss.type = "button";
  dismiss.setAttribute("aria-label", "Bu notu kapat");
  dismiss.appendChild(icon("close", { size: 20 }));
  dismiss.addEventListener("click", () => {
    dismissBackupNudge();
    row.remove();
    announce("Not kapatıldı.");
  });
  row.appendChild(dismiss);

  return row;
}

/**
 * Turkish-safe folding for the filter.
 *
 * `toLowerCase()` is wrong here and wrong in a way that only bites
 * Turkish: it maps `I` to `i` when the Turkish pair is `I`/`ı` and
 * `İ`/`i`, so a learner typing `ilgi` would not match `İlgi`. Diacritics
 * fold too, because a phone keyboard set to English cannot produce `ş`
 * and the learner should not have to.
 */
function fold(text) {
  return text
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c");
}

/**
 * What pays back the tap the topic index costs.
 *
 * Turning 48 lesson rows into 8 topic rows takes the learner who knew
 * exactly which lesson he wanted from one tap to three. That learner is
 * the one who uses the app most, so the structural change is only honest
 * if he can still get there in one move: typing two letters puts the
 * lesson rows back, filtered, and the topic level disappears.
 *
 * A `field`, not a search screen. There is nothing to search but 48
 * strings the app already has in memory.
 */
function renderIndexFilter(lessons, progress) {
  // A section like any other: a head — the one line at runtime that says
  // what the app is for — and one container, the search field. The tier
  // groups below are sections of their own, so the field is neither a
  // stray control above a list nor a sentence between two headings.
  const wrap = el("section", "stack stack--tight");
  wrap.appendChild(sectionHeading("Konular", "Her konu, önce ne olduğunu anlatır; dersler içinde."));

  const field = el("input", "field");
  field.type = "search";
  field.id = "index-filter";
  field.placeholder = "Ders ara";
  field.setAttribute("aria-label", "Dersler arasında ara");
  field.autocomplete = "off";

  field.addEventListener("input", () => {
    const query = fold(field.value.trim());
    const host = document.getElementById("index-list");
    if (!host) {
      return;
    }
    clear(host);
    if (query.length === 0) {
      host.appendChild(renderTopicIndex(lessons, progress));
      return;
    }
    // Category and summary, because those are the two things a learner
    // could be remembering: the English name of the contrast, or the
    // Turkish question the lesson answers.
    const hits = lessons.filter(
      (lesson) =>
        fold(lesson.category).includes(query) ||
        fold(lesson.summary ?? "").includes(query) ||
        fold(lesson.topicTitle).includes(query)
    );
    const section = el("section", "stack stack--tight");
    section.appendChild(
      sectionHeading(
        "Arama",
        hits.length === 0
          ? "Eşleşen ders yok."
          : `${hits.length} ders eşleşti.`
      )
    );
    if (hits.length) {
      const rows = el("div");
      for (const lesson of hits) {
        rows.appendChild(renderLessonRow(lesson, statusOf(lesson, progress)));
      }
      section.appendChild(rows);
    }
    host.appendChild(section);
    announce(hits.length === 0 ? "Eşleşen ders yok." : `${hits.length} ders eşleşti.`);
  });

  wrap.appendChild(field);
  return wrap;
}

/**
 * Eight topic rows, not forty-eight lesson rows.
 *
 * The index used to list every lesson in the app, flat. That was a
 * deliberate decision — `docs/education-notes.md` records the index
 * "going flat" instead of gaining a topic level — and it outgrew itself:
 * measured at 320 it was **5,332px, 8.3 screens**, two and a half times
 * the next-longest screen, and a learner reported it as the topics
 * piling up. It grows with the content: 60 rows once the vocabulary
 * topics ship.
 *
 * The destination already existed. `#egitim/konu/<topicId>` renders the
 * topic's orientation AND its six lesson rows, so making the index a
 * list of topics costs no new screen, no schema change and no storage
 * change — the lessons simply live one level down, where the thing that
 * explains them already is.
 *
 * What this costs is the learner who knew exactly which lesson he
 * wanted: one tap became three. `renderIndexFilter` is what pays that
 * back, and the two must ship together or this is a regression for the
 * person who uses the app most.
 */
function renderTopicIndex(lessons, progress) {
  const section = el("section", "stack stack--loose");

  // Grouped the way the Test tab groups, which until now it was not: the
  // same ten topics were four headed groups on one tab and one flat list
  // of ten identical rows on the other. Flat is also what a learner
  // reported as the topics piling up.
  //
  // A grouping, never an order. `js/tiers.js` says the tiers are "purely
  // a display grouping", the reader locks nothing, and the next-step
  // card routes by weakness rather than by tier — so these headings say
  // where a topic is filed, not what to read first.
  const tiersPresent = TIER_ORDER.filter((tier) =>
    lessons.some((lesson) => lesson.tier === tier)
  );
  const groups =
    tiersPresent.length > 1
      ? tiersPresent.map((tier) => ({
          heading: TIER_LABELS[tier] ?? tier,
          lessons: lessons.filter((lesson) => lesson.tier === tier),
        }))
      : [{ heading: "Konular", lessons }];

  for (const group of groups) {
    section.appendChild(renderTopicGroup(group.heading, group.lessons, progress));
  }

  return section;
}

function renderTopicGroup(heading, lessons, progress) {
  const block = el("section", "stack stack--tight");
  block.appendChild(el("h2", "t-label", heading));

  // Tiles, not rows: a topic is an object with a colour, a name and a
  // bar, and two abreast is what a phone holds.
  const grid = el("div", "tiles");
  const topicIds = [...new Set(lessons.map((lesson) => lesson.topicId))];
  for (const topicId of topicIds) {
    const inTopic = lessons.filter((lesson) => lesson.topicId === topicId);
    const done = inTopic.filter((lesson) => progress[lesson.id]?.done).length;
    const title = inTopic[0].topicTitle;

    const tile = el("button", "tile");
    tile.type = "button";
    // Monogram and count on one line, the name under them, the bar last:
    // three rows, so two tiles abreast fit a 320px phone's budget.
    const head = el("span", "tile__head");
    head.appendChild(monogram(topicId, title));
    const meta = el("span", "tile__meta");
    if (done === inTopic.length) {
      const finished = el("span", "ink-ok cluster");
      finished.setAttribute("aria-label", "Tamamlandı");
      finished.setAttribute("role", "img");
      finished.appendChild(icon("check", { size: 18 }));
      meta.appendChild(finished);
      meta.appendChild(el("span", "t-num", `${inTopic.length} ders`));
    } else {
      meta.appendChild(el("span", "t-num", `${done} / ${inTopic.length}`));
    }
    head.appendChild(meta);
    tile.appendChild(head);
    tile.appendChild(englishTitle("span", "tile__title t-en", title));
    tile.appendChild(progressBar(inTopic.length === 0 ? 0 : done / inTopic.length));

    tile.addEventListener("click", () => openIntroByHash(topicId));
    grid.appendChild(tile);
  }
  block.appendChild(grid);

  return block;
}

/* ---- Topic intro ---- */

/**
 * The topic screen: what this group of six lessons IS, before any of them
 * offers to distinguish three things inside it.
 *
 * Every lesson in this app is a contrast, which is the right shape for
 * the exam and the wrong shape for a first arrival — the index offered
 * "Relative Clauses" and then, one line down, "Who vs Whom vs Whose",
 * with nothing anywhere saying what a relative clause is.
 *
 * It is a SCREEN and not a block inside every lesson, and that is the
 * whole design. `docs/research/orientation.md` settles it on the
 * expertise-reversal literature: across 60 studies, giving support to
 * novices helped (+0.505) while giving the same support to people who
 * already had the schema HURT them (−0.428). The effect is asymmetrical,
 * so one screen a learner can choose to open is licensed and forty-eight
 * unavoidable paragraphs are not. Someone who knows what a relative
 * clause is never has to see this, and pays nothing for its existence.
 *
 * Its shape is not free prose either. Mayer's pre-training principle —
 * the strongest thing in that literature, median d = 0.92 — is about
 * knowing the NAMES AND CHARACTERISTICS of the main concepts, which in
 * the experiments is a parts list. The coherence principle pulls the
 * other way: added interesting-but-inessential material measurably hurt
 * across 50 studies. So `parts` is the part that earns the page, and
 * everything else is one or two sentences.
 *
 * The typed fields are also what lets the English carry `lang="en"`. A
 * Turkish prose field cannot: `js/dom.js` builds text nodes and bold
 * spans and has no `lang` handling, so English inside one inherits the
 * page's `lang="tr"` and `text-transform: uppercase` turns "SIMPLE" into
 * "SİMPLE". The lessons already solve this by putting English in
 * structural slots; an intro written as one prose blob could not.
 */
function renderIntro(topic, lessons, progress) {
  // The overview is prose and the lessons are rows, so on a wide window
  // this is the one split that runs the other way round: the reading
  // column stays first and keeps the measure, and the six lesson rows —
  // which is what the learner came here to choose from, and which used to
  // sit a screen and a half below the fold — move up beside it.
  const screen = el("div", "stack stack--loose split split--main-first animate-in");
  const page = pane();
  const intro = topic.intro;

  // The bar names the topic and carries the way back and the count;
  // nothing on the page has to.
  const done = lessons.filter((lesson) => progress[lesson.id]?.done).length;
  const topicTitle = lessons[0]?.topicTitle ?? null;
  bar.set({
    title: topicTitle ? { text: topicTitle, lang: "en" } : intro.title,
    lead: { label: "Konular", onClick: showIndexByHash },
    trail: `${done} / ${lessons.length}`,
  });

  const head = el("div", "stack stack--tight");
  head.appendChild(el("p", "t-label", "Genel bakış"));
  head.appendChild(el("h1", "t-title", intro.title));
  page.appendChild(head);

  const what = el("div", "stack stack--tight");
  appendProse(what, intro.what, "t-body");
  page.appendChild(what);

  if (intro.examples?.length) {
    const list = el("ul", "stack stack--tight");
    for (const item of intro.examples) {
      const entry = el("li", "stack stack--tight");
      entry.appendChild(englishTitle("p", "t-lead t-en", item.en));
      if (item.note) {
        const note = el("p", "t-quiet");
        appendInline(note, item.note);
        entry.appendChild(note);
      }
      list.appendChild(entry);
    }
    page.appendChild(list);
  }

  if (intro.parts?.length) {
    const section = el("section", "stack stack--tight");
    section.appendChild(el("h2", "t-label", intro.partsHeading ?? "Parçaları"));
    const list = el("ul", "items");
    for (const part of intro.parts) {
      const entry = el("li", "stack stack--snug");
      // Body, not the one-line tier: the name in 600, the gloss after it
      // at 400. As a bold 15px line between serif examples this was the
      // hardest-to-read thing on the screen, and the owner said so.
      const name = el("p", "t-body");
      name.appendChild(el("strong", null, part.name));
      if (part.gloss) {
        name.appendChild(document.createTextNode(` — ${part.gloss}`));
      }
      entry.appendChild(name);
      if (part.en) {
        // Body, not meta: an example is a sentence, and English serif has
        // no weight that clears the ground at 15px.
        entry.appendChild(englishTitle("p", "t-body t-en", part.en));
      }
      list.appendChild(entry);
    }
    section.appendChild(list);
    page.appendChild(section);
  }

  for (const [heading, body] of [
    ["İngilizcenin istediği seçim", intro.choice],
    ["Bu konudaki dersler", intro.lessons],
    ["Sınavda", intro.exam],
  ]) {
    if (!body) continue;
    const section = el("section", "stack stack--tight");
    section.appendChild(el("h2", "t-label", heading));
    appendProse(section, body, "t-body");
    page.appendChild(section);
  }

  // The lesson rows, so this is a topic page and not a leaflet. They are
  // the same rows as the index, built by the same function: a second
  // implementation of a lesson row is a second thing to keep in step.
  const list = el("section", "stack stack--tight");
  list.appendChild(el("h2", "t-label", "Dersler"));
  const rows = el("div");
  for (const lesson of lessons) {
    rows.appendChild(renderLessonRow(lesson, statusOf(lesson, progress), { sub: false }));
  }

  // And a way to test the topic, from the screen that introduces it. It
  // was reachable from the Test tab's topic rows and from the end of a
  // lesson, so a learner revising a topic from Eğitim had to cross to the
  // other tab and find the row again — the one launcher this app has that
  // is reachable from one half of it and not the other.
  //
  // A row rather than a button, and last: the bar already carries this
  // screen's filled action (§7.2), and the offer belongs after the
  // lessons rather than beside them. When every lesson here is finished
  // the bar itself becomes the test — so the row would be the same action
  // twice, and it steps out.
  if (lessons.some((lesson) => !progress[lesson.id]?.done)) {
    rows.appendChild(renderTopicTestRow(topic.topicId, topic.questions?.length ?? 0));
  }

  list.appendChild(rows);

  const lessonPane = pane();
  lessonPane.appendChild(list);
  screen.append(page, lessonPane);

  return screen;
}

/**
 * @param {string} topicId - the topic file's own `topicId`. The file has
 *   no `id`, and reading one gave a row that silently did nothing: the
 *   launcher returns false for an unknown topic rather than throwing.
 * @param {number} questionCount - the file's own count, not the
 *   manifest's copy of it
 */
function renderTopicTestRow(topicId, questionCount) {
  const row = el("button", "row");
  row.type = "button";

  const lead = el("span", "row__lead");
  lead.appendChild(icon("target", { size: 20 }));
  row.appendChild(lead);

  const main = el("span", "row__main");
  main.appendChild(el("span", "row__title", "Bu konudan test çöz"));
  main.appendChild(el("span", "row__sub t-num", `${questionCount} soru`));
  row.appendChild(main);

  row.addEventListener("click", () => {
    // Loudly, because the failure mode here is silence: the launcher
    // returns false for a topic the manifest does not have, and the first
    // version of this row read the wrong field and did nothing at all.
    startTopicTest(topicId)
      .then((started) => {
        if (!started) {
          console.error(`renderTopicTestRow: manifestte olmayan konu "${topicId}"`);
        }
      })
      .catch(console.error);
  });
  return row;
}

/**
 * @param {string} topicId - from the URL hash, so it may be stale or
 *   hand-typed; anything unknown falls back to the index without leaving
 *   a dead entry in the history.
 */
export async function openTopicIntro(topicId) {
  let lessons;
  let manifest;
  try {
    lessons = await ensureLessons();
    manifest = await loadManifest();
  } catch (error) {
    // A topic file that will not load used to fall through to the index
    // with the hash still on #egitim/konu/<id> — nothing visible happened
    // and the URL lied about where the learner was. Say so, and put the
    // hash back where the screen actually is.
    console.error(error);
    history.replaceState(null, "", "#egitim");
    await showLessonIndex();
    indexContainer.prepend(failureCard("Konu", () => openTopicIntro(topicId)));
    return;
  }

  const entry = manifest.topics.find((item) => item.id === topicId && !item.comingSoon);
  if (!entry) {
    history.replaceState(null, "", "#egitim");
    await showLessonIndex();
    return;
  }

  let topic;
  try {
    topic = await loadTopicFile(entry);
  } catch (error) {
    console.error(error);
    await showLessonIndex();
    return;
  }

  // A topic whose file carries no intro is not an error and must not cost
  // the learner a dead screen: the manifest flag and the file can drift
  // while a topic is being written.
  if (!topic?.intro) {
    history.replaceState(null, "", "#egitim");
    await showLessonIndex();
    return;
  }

  state.reader = null;
  setReaderChrome(true);
  clear(readerContainer);
  readerContainer.appendChild(
    renderIntro(
      topic,
      lessons.filter((lesson) => lesson.topicId === topicId),
      getAllLessonProgress()
    )
  );
  scrollToTop();

  document.title = `${entry.title} — English Prep`;
  announce(`${entry.title} genel bakış.`);

  // A primary, because a screen that ends in lesson rows and offers only a
  // way backwards routes nobody. The forward action opens the first lesson
  // the learner has not finished in THIS topic — which on a first visit is
  // lesson 1, and on a return is where they actually stopped.
  //
  // Once there is no such lesson, it stops being a reading action: the
  // fallback used to be lesson 1, so a learner who had read the whole
  // topic was offered its first page again under a label that says
  // forward. What is actually forward there is the topic's test.
  const progress = getAllLessonProgress();
  const inTopic = lessons.filter((lesson) => lesson.topicId === topicId);
  const next = inTopic.find((lesson) => !progress[lesson.id]?.done) ?? null;
  const forward = next
    ? { label: "Derse başla", level: "primary", onClick: () => openLessonByHash(next.id) }
    : {
        // "Teste başla", beside "Derse başla": the screen is one topic,
        // so the test needs no naming — and the long form did not fit
        // beside the retreat at 320 at body size.
        label: "Teste başla",
        level: "primary",
        onClick: () => {
          startTopicTest(topicId).catch(console.error);
        },
      };
  actionBar.set([
    { label: "Konulara dön", level: "secondary", onClick: showIndexByHash },
    ...(inTopic.length > 0 ? [forward] : []),
  ]);
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
  const list = el("ul", "items");
  for (const side of block.sides) {
    const item = el("li", "stack stack--snug");
    item.appendChild(englishTitle("p", "t-lead t-en", side.label));
    const gloss = el("p", "t-body");
    appendInline(gloss, side.gloss);
    item.appendChild(gloss);
    if (side.example) {
      item.appendChild(englishTitle("p", "t-body t-en", side.example));
    }
    list.appendChild(item);
  }
  return list;
}

/**
 * The structural patterns — a reference the learner scrolls back to
 * rather than a paragraph they read once. It used to be the reader's one
 * card, on the argument that a reference should be findable; but
 * findability is a heading's job, not a fill's, and the fill made the
 * least important block in the teaching half the first thing with any
 * mass on the page (docs/research/beta1-hierarchy.md §3.3). Homogeneous
 * content is rows (§7.1): a labelled group per form, a hairline between
 * groups. Grouped by form here rather than in the data: the schema keeps
 * rows flat so a content file never nests three deep.
 */
function renderFormsBlock(block) {
  const card = el("div", "items");
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
      const line = el("div", "stack stack--snug");
      const pattern = el("p", "t-body t-en");
      pattern.lang = "en";
      pattern.appendChild(document.createTextNode(row.pattern));
      line.appendChild(pattern);
      const meta = el("p", "t-meta");
      meta.appendChild(document.createTextNode(row.use));
      line.appendChild(meta);
      if (row.example) {
        // Its own line at body: it was a serif span inside the meta
        // line, which set an English sentence at 15/400 — the one pair
        // no ink clears on either ground.
        line.appendChild(englishTitle("p", "t-body t-en", row.example));
      }
      group.appendChild(line);
    }
    card.appendChild(group);
  }
  return card;
}

/**
 * Sentence first, then its reason. The note is the teaching, so it reads
 * at body; as a meta line it was a caption under the thing it explained.
 */
function renderExamplesBlock(block) {
  const list = el("ul", "items");
  for (const item of block.items) {
    const entry = el("li", "stack stack--snug");
    entry.appendChild(englishTitle("p", "t-lead t-en", item.sentence));
    const note = el("p", "t-body");
    appendInline(note, item.note);
    entry.appendChild(note);
    list.appendChild(entry);
  }
  return list;
}

/**
 * Wrong above right, with the verdict on a glyph as well as a colour —
 * neither red nor green clears the contrast bar as text on this ground,
 * and colour alone would say nothing in greyscale.
 */
function renderPitfallBlock(block) {
  const wrap = el("div", "stack stack--snug");

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
  const why = el("p", "t-body");
  appendInline(why, block.why);
  wrap.appendChild(why);
  return wrap;
}

/**
 * Consecutive pitfalls are one block, not three. The corpus writes them
 * in runs — 172 pitfalls in 60 lessons, 50 runs of three — and none of
 * them carries a heading, so the reader met ✕ ✓ why, 32px, ✕ ✓ why, 32px,
 * ✕ ✓ why, 32px, *Kontrol*: four sections at one beat with nothing to
 * say where the practice ends. A rendering decision, which is what the
 * block vocabulary is for: the files say `pitfall` three times and the
 * page says *Sık yapılan hatalar* once.
 */
function renderPitfallRun(blocks) {
  const wrap = el("section", "stack stack--tight block block--pitfall block--labelled");
  wrap.appendChild(el("h3", "t-label", blocks.length > 1 ? "Sık yapılan hatalar" : "Sık yapılan hata"));
  const list = el("ul", "items");
  for (const block of blocks) {
    const item = el("li");
    item.appendChild(renderPitfallBlock(block));
    list.appendChild(item);
  }
  wrap.appendChild(list);
  return wrap;
}

/**
 * What to do when you see it. Signal words are chips because that is how
 * they are met in an exam — scanned for, not read — and a condition is a
 * sentence because no word list captures it.
 */
function renderDecisionBlock(block) {
  const list = el("ul", "items");

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

    // Indented under its triggers by the arrow's width. Flush left, the
    // outcome sat 16px below its triggers and 16px above the next rule's,
    // and half the time read as a heading for the chips beneath it — the
    // one block where a learner can take the wrong rule away.
    const line = el("p", "cluster decision__outcome");
    const arrow = el("span");
    arrow.appendChild(icon("arrow-right", { size: 20 }));
    line.appendChild(arrow);
    line.appendChild(englishTitle("span", "t-lead t-en", outcome));
    item.appendChild(line);

    list.appendChild(item);
  }

  return list;
}

/* The pretest is not one of the lesson's blocks, so it needs a key of its
 * own in the answers Map, which is otherwise keyed by block index. -1 is
 * the one value an index can never take. */
const PRETEST_INDEX = -1;

/**
 * An inline check. Answering re-renders only this block, not the page:
 * rebuilding the whole lesson would throw the learner's scroll position
 * away at the exact moment they want to read the feedback.
 */
function renderCheckBlock(question, blockIndex, { label = "Kontrol" } = {}) {
  const wrap = el("div", "stack");
  wrap.dataset.check = String(blockIndex);

  // The pretest supplies its own heading and passes null, so the block
  // does not read "Önce bir dene" and then "Kontrol" two lines later.
  if (label) {
    wrap.appendChild(el("p", "t-label", label));
  }

  // A lesson can hold a pretest and two checks at once, so the stem's id
  // is per block or three groups would point at the same paragraph.
  const stemId = `question-stem-${blockIndex}`;
  wrap.appendChild(renderPrompt(question, { idSuffix: String(blockIndex) }));

  const answered = state.reader.answers.has(blockIndex);
  const selected = state.reader.answers.get(blockIndex) ?? null;

  wrap.appendChild(
    renderOptions(question, {
      selected,
      answered,
      labelledBy: stemId,
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
        wrap.replaceWith(renderCheckBlock(question, blockIndex, { label }));
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

/**
 * Dersten önce — one question at the top of a lesson nobody has opened
 * yet, before a word of it has been taught.
 *
 * Not a quiz. The learner is *expected* to get it wrong, and the framing
 * says so, because the value is in the attempt rather than in the answer:
 * a failed retrieval before study leaves the later reading better
 * retained than the same reading without it. It is the same effect the
 * "cevabı önce düşün" setting is built on, applied where this app already
 * has the machinery — `check` blocks carry no authored prose, they are
 * filled from the lesson's own category at render time, so putting one at
 * the front costs no content and changes no schema.
 *
 * It appears once. On a re-read the lesson opens normally: a pretest on
 * material you have already read is just a quiz in the wrong place.
 *
 * Like every check, it never gates anything. Scrolling past it without
 * answering is a supported way to read a lesson.
 */
function renderPretestBlock(question) {
  const wrap = el("section", "stack stack--tight");
  wrap.appendChild(el("h3", "t-label", "Önce bir dene"));
  wrap.appendChild(renderCheckBlock(question, PRETEST_INDEX, { label: null }));

  // The reason goes UNDER the question, not over it.
  //
  // Above it, three sentences of rationale pushed the first tappable
  // option below the 320px fold — on the very first interaction the app
  // ever asks for, from someone who has not yet decided it is worth the
  // trouble. The learner does not need to be sold on the pretesting
  // effect before answering; they need it explained if they get it wrong,
  // which is exactly where this now sits.
  wrap.appendChild(
    el(
      "p",
      "t-quiet",
      "Bu dersi henüz okumadın, bilmiyorsan sorun değil: asıl işe yarayan " +
        "denemenin kendisi. Tahmin edip yanılmak, sonra okuduğunu daha iyi " +
        "aklında tutmanı sağlıyor."
    )
  );
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

/**
 * @param {number} [checkNumber] - this check's ordinal in the lesson,
 *   so two checks read *Kontrol 1* and *Kontrol 2* rather than the same
 *   word twice.
 */
function renderBlock(block, index, nextCheck, checkNumber = 0) {
  // The wrapper says what the block is, so the stylesheet can give the
  // contrast its band and every labelled block its 48px of air without
  // the renderers knowing about either.
  const wrap = el("section", `stack stack--tight block block--${block.type}`);

  if (block.type === "check") {
    const question = nextCheck();
    // A lesson can ask for more checks than its category has questions.
    // Rendering nothing is the honest answer; the validator warns about it
    // at authoring time, which is where it can actually be fixed.
    if (!question) {
      return null;
    }
    wrap.classList.add("block--labelled", "block--check");
    wrap.appendChild(renderCheckBlock(question, index, { label: `Kontrol ${checkNumber}` }));
    return wrap;
  }

  const render = BLOCK_RENDERERS[block.type];
  if (!render) {
    // Content newer than this build. Skipping it beats throwing away the
    // whole lesson around it.
    console.warn(`unknown lesson block type "${block.type}" — skipped`);
    return null;
  }

  if (block.heading) {
    wrap.classList.add("block--labelled");
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
    bar.setProgress(read);

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

/**
 * The reader's bar: the way back, the lesson's name, its place in the
 * topic ("2 / 6" — the number a learner looks up for), and the reading
 * position along the bottom edge.
 */
function setReaderBar() {
  const lesson = currentLesson();
  const inTopic = state.lessons.filter((entry) => entry.topicId === lesson.topicId);
  const position = inTopic.indexOf(lesson) + 1;
  bar.set({
    title: { text: lesson.category, lang: "en" },
    lead: { label: "Dersler", onClick: showIndexByHash },
    trail: `${position} / ${inTopic.length}`,
    progress: 0,
  });
}

function renderLesson() {
  const lesson = currentLesson();
  // The SAME taker the pretest was drawn from, not a second one. Two
  // independent shuffles of a four-question pool, taking one and then two,
  // put the pretest inside the check set about half the time — measured at
  // 13 collisions in 24 opens — so the learner answered a question, read
  // its explanation, scrolled three blocks and met it again.
  const nextCheck = state.reader.nextCheck;
  // Decided once per opening rather than per render: answering the pretest
  // re-renders it, and a progress record written in between must not make
  // the block it is inside disappear from under the learner.
  const pretest = state.reader.pretest;

  clear(readerContainer);
  setReaderBar();
  const page = el("article", "stack stack--loose animate-in lesson");

  const heading = el("header", "stack stack--tight lesson__head");
  heading.style.setProperty("--hue", String(hueOf(lesson.topicId)));
  heading.appendChild(englishTitle("p", "t-label", lesson.topicTitle));
  heading.appendChild(englishTitle("h1", "t-display t-en", lesson.category));
  if (lesson.summary) {
    heading.appendChild(el("p", "t-lead", lesson.summary));
  }
  page.appendChild(heading);

  if (pretest) {
    page.appendChild(renderPretestBlock(pretest));
  }

  let checkNumber = 0;
  for (let index = 0; index < lesson.blocks.length; ) {
    const block = lesson.blocks[index];
    if (block.type === "pitfall") {
      const run = [];
      while (index < lesson.blocks.length && lesson.blocks[index].type === "pitfall") {
        run.push(lesson.blocks[index]);
        index += 1;
      }
      page.appendChild(renderPitfallRun(run));
      continue;
    }
    if (block.type === "check") {
      checkNumber += 1;
    }
    const node = renderBlock(block, index, nextCheck, checkNumber);
    if (node) {
      page.appendChild(node);
    }
    index += 1;
  }

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
  // Finishing the last lesson of a topic is a different event from
  // finishing any other lesson, and the app had no concept of it: the
  // card said "Sıradaki ders" either way and the button walked straight
  // from the end of Tenses into `Must vs Have to vs Mustn't vs Don't
  // Have to` — a contrast, in a topic whose intro the learner had never
  // seen. That is the whole complaint this round began with, surviving
  // in the one journey nobody had designed.
  const crossesTopic = nextLesson !== null && nextLesson.topicId !== lesson.topicId;

  const card = el("section", "surface hero block--end");
  card.appendChild(el("span", "hero__orb"));
  const head = el("div", "stack stack--tight");
  const eyebrow = el("p", "t-label cluster");
  eyebrow.appendChild(icon("spark-fill", { size: 18 }));
  eyebrow.appendChild(document.createTextNode(crossesTopic ? "Konu bitti" : "Ders bitti"));
  head.appendChild(eyebrow);
  head.appendChild(
    el(
      "p",
      "t-body",
      crossesTopic
        ? // A fact, not a congratulation: it says what was finished and
          // what comes next, and names the next topic so the learner is
          // choosing rather than being carried.
          `${lesson.topicTitle} konusundaki derslerin sonuncusuydu. ` +
            `Sırada ${nextLesson.topicTitle} var — önce onun ne olduğuna bakabilirsin.`
        : "Öğrendiğini pekiştirmenin en hızlı yolu birkaç soru çözmek. Ya da sıradaki derse geç."
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

  if (crossesTopic) {
    // Into the next topic's overview when it has one, and only into its
    // first lesson when it does not: the point is that a topic boundary
    // is where the orientation is worth most, not where it is skipped.
    const onward = el("button", "btn btn--primary", `Sıradaki konu: ${nextLesson.topicTitle}`);
    onward.type = "button";
    onward.addEventListener("click", () => {
      markLessonDone(lesson.id);
      if (nextLesson.hasIntro) {
        openIntroByHash(nextLesson.topicId);
      } else {
        openLessonByHash(nextLesson.id);
      }
    });
    card.appendChild(onward);
  } else if (nextLesson) {
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

function openIntroByHash(topicId) {
  window.location.hash = `egitim/${TOPIC_INTRO_PREFIX}${topicId}`;
}

function setReaderChrome(active) {
  // The bar stays — it is the reader's way out and its position — and
  // the tab bar steps aside: a lesson is something to read.
  bottomNav.hidden = active;
  indexContainer.hidden = active;
  readerContainer.hidden = !active;
  if (active) {
    scrollRegion.addEventListener("scroll", handleReaderScroll, { passive: true });
  } else {
    scrollRegion.removeEventListener("scroll", handleReaderScroll);
    bar.setProgress(null);
  }
  // A class rather than `hidden`, because focused mode is a state of the
  // whole shell and CSS is what knows which parts step out of the way.
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
    indexContainer.classList.remove("split");
    indexContainer.appendChild(failureCard("Dersler", () => showLessonIndex()));
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
    // Two things this used to get wrong, and both mattered more than the
    // failure itself.
    //
    // It called setReaderChrome(true), which hides the header, the nav
    // AND the action bar — so a learner whose connection dropped got an
    // apology on a screen with no controls on it at all, and the only
    // way out was the browser's back button.
    //
    // And it left `state.reader` pointing at whatever was open before,
    // so the scroll handler stayed live: one scroll on that dead screen
    // called markLessonDone on the PREVIOUS lesson. A failed fetch was
    // writing a completion for a lesson the learner had not finished.
    console.error(error);
    state.reader = null;
    setReaderChrome(false);
    clear(indexContainer);
    indexContainer.appendChild(
      failureCard("Ders", () => openLesson(lessonId), { label: "Derslere dön", onClick: showIndexByHash })
    );
    return;
  }

  // A lesson nobody has opened gets one question before it starts. Read
  // from the stored progress rather than from `read`, because the reader
  // records a read fraction as soon as it paints — so by the time the
  // first scroll handler runs, every lesson looks started.
  // state.lessons, not `lessons`: the latter is the index, which carries
  // names and progress but no blocks and no checkPool. The loaded lesson
  // was merged into state.lessons just above.
  const lesson = state.lessons[lessonPosition];
  const seen = getLessonProgress(lesson.id);
  const unread = !seen || (!seen.done && (seen.read ?? 0) <= 0.02);
  // One taker for the whole opening. The pretest takes the first question
  // and the check blocks take the ones after it, so no question is met
  // twice on one page.
  const nextCheck = takeChecks(lesson);
  state.reader = {
    lessonIndex: lessonPosition,
    answers: new Map(),
    nextCheck,
    pretest: unread ? nextCheck() : null,
  };
  setReaderChrome(true);
  // The intro sets the title and the reader did not, so the tab read
  // "Eğitim" for every lesson.
  document.title = `${lesson.category} — English Prep`;
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
