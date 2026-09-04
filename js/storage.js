// Persists everything the app remembers about a learner in localStorage,
// so it survives across visits on the same device/browser:
//
//   - quiz attempt history (scores, per-topic and per-category breakdowns)
//   - Eğitim lesson progress (furthest step reached, and completion)
//   - a small local profile (optional display name)
//   - a silent "seen content" record, used only to power the
//     "new questions added" badge
//
// No login, no server — everything here lives entirely in this browser.

import {
  mergeHistory,
  mergeLessonProgress,
  mergeSeenVersions,
  summariseRestore,
} from "./backup.js";

const HISTORY_KEY = "englishPrep.history";
const SEEN_VERSIONS_KEY = "englishPrep.seenVersions";
const PROFILE_NAME_KEY = "englishPrep.profileName";
const LESSON_PROGRESS_KEY = "englishPrep.lessonProgress";
const SETTINGS_KEY = "englishPrep.settings";
/** Distinct questions that must have been met before a group is ranked. */
export const MIN_ITEMS_FOR_WEAK_ENTRY = 3;

/** And before the app is willing to *state* that something is a weakness. */
const MIN_ITEMS_FOR_WEAK_CLAIM = 6;

/**
 * Below this, current accuracy counts as not-yet-learned. Not 1: requiring
 * perfection made every category the learner had ever answered imperfectly
 * a "weakness", which meant a learner guessing at random was told they were
 * weak in everything, 99.6% of the time.
 */
const MASTERY = 0.8;

/**
 * Reads and JSON-parses a key, falling back to `fallback` for anything
 * that isn't usable: storage unavailable (private browsing), absent key,
 * corrupt JSON, or a value of the wrong shape. Practising without saved
 * progress is an acceptable degradation; crashing is not.
 */
function readJson(key, fallback, isValid) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    const parsed = JSON.parse(raw);
    return isValid(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be unavailable or over quota. The app keeps working;
    // this session's progress just isn't remembered.
  }
}

function removeKey(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Nothing to do if storage is unavailable.
  }
}

const isPlainObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

function loadHistory() {
  return readJson(HISTORY_KEY, { attempts: [] }, (value) => isPlainObject(value) && Array.isArray(value.attempts));
}

function saveHistory(history) {
  writeJson(HISTORY_KEY, history);
}

/**
 * Appends a completed attempt to local history.
 * @param {{date: string, mode: "mixed"|"topic", topicBreakdown: Record<string, {correct: number, total: number}>, categoryBreakdown: Record<string, {correct: number, total: number}>, questions: Array<{id: string, topicId: string, correct: boolean}>}} attempt
 */
export function recordAttempt(attempt) {
  const history = loadHistory();
  history.attempts.push(attempt);
  saveHistory(history);
}

export function getHistory() {
  return loadHistory().attempts;
}

function sumBreakdowns(attempts, breakdownKey) {
  const totals = {};
  for (const attempt of attempts) {
    for (const [key, stats] of Object.entries(attempt[breakdownKey] ?? {})) {
      if (!totals[key]) {
        totals[key] = { correct: 0, total: 0 };
      }
      totals[key].correct += stats.correct;
      totals[key].total += stats.total;
    }
  }
  return totals;
}

/**
 * Per-question history, derived rather than stored: every attempt already
 * carries its own `date` and the ids it covered, so "when did this learner
 * last see this question" needs no new field and no migration.
 *
 * `lastCorrect` is the outcome of the most recent answer, not a running
 * average — what the session builder needs to know is whether the learner
 * got it wrong *last time*, which is a different question from whether
 * they usually do.
 *
 * Each entry also carries the topic and category the question belonged to,
 * copied from the attempt record, so a caller can group items without
 * loading any content — storage.js does no fetching. `category` is absent
 * on attempts recorded before it was stored.
 *
 * @returns {Record<string, {seen: number, wrong: number, lastCorrect: boolean, last: number, topicId?: string, category?: string}>}
 */
export function getItemStats() {
  const stats = {};
  for (const attempt of getHistory()) {
    const at = Date.parse(attempt?.date ?? "");
    const when = Number.isNaN(at) ? 0 : at;
    for (const question of attempt?.questions ?? []) {
      if (typeof question?.id !== "string") {
        continue;
      }
      const entry = (stats[question.id] ??= { seen: 0, wrong: 0, lastCorrect: false, last: 0 });
      entry.seen += 1;
      if (typeof question.topicId === "string") {
        entry.topicId = question.topicId;
      }
      if (typeof question.category === "string") {
        entry.category = question.category;
      }
      if (!question.correct) {
        entry.wrong += 1;
      }
      // History is appended in order, but a restored backup could arrive
      // out of order, so the newest answer wins on timestamp rather than
      // on position.
      if (when >= entry.last) {
        entry.last = when;
        entry.lastCorrect = question.correct === true;
      }
    }
  }
  return stats;
}

/** Two correct answers, on two different days, and an item graduates. */
export const MISTAKE_BOOK_GRADUATION = 2;

/** A local calendar day, because "on separate days" is what a learner means. */
function dayKey(timestamp) {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

/**
 * Yanlış defteri — the questions this learner has got wrong and has not
 * yet earned their way out of.
 *
 * The rule: an item enters the book the moment it is answered wrong, and
 * leaves after **two correct answers on two separate days** since that
 * wrong answer. One correct answer straight after reading the explanation
 * proves only that the explanation was on screen; a second one the next
 * day is the first evidence of anything durable. Getting it wrong again
 * puts it straight back, and the count starts over.
 *
 * Derived, like getItemStats, from history the app has recorded since the
 * beginning — so every learner's book already has its contents and there
 * is nothing to migrate.
 *
 * @returns {Array<{id: string, topicId?: string, category?: string, wrong: number, lastWrong: number, correctDays: number}>}
 *   worst first: most wrong answers, then most recently wrong.
 */
export function getMistakeBook() {
  /** @type {Record<string, {wrong: number, lastWrong: number, days: Set<string>, topicId?: string, category?: string}>} */
  const items = {};

  // Oldest first, so "since the last wrong answer" is a single pass. A
  // restored backup can arrive out of order, hence the sort rather than
  // trusting the append order.
  const answers = [];
  for (const attempt of getHistory()) {
    const at = Date.parse(attempt?.date ?? "");
    const when = Number.isNaN(at) ? 0 : at;
    for (const question of attempt?.questions ?? []) {
      if (typeof question?.id === "string") {
        answers.push({ ...question, when });
      }
    }
  }
  answers.sort((a, b) => a.when - b.when);

  for (const answer of answers) {
    const entry = (items[answer.id] ??= { wrong: 0, lastWrong: 0, days: new Set() });
    if (typeof answer.topicId === "string") {
      entry.topicId = answer.topicId;
    }
    if (typeof answer.category === "string") {
      entry.category = answer.category;
    }
    if (answer.correct === true) {
      // Only counts towards graduating if the item is currently in the
      // book; a correct answer before the first mistake proves nothing
      // about the mistake that has not happened yet.
      if (entry.lastWrong > 0) {
        entry.days.add(dayKey(answer.when));
      }
    } else {
      entry.wrong += 1;
      entry.lastWrong = answer.when;
      entry.days.clear();
    }
  }

  return Object.entries(items)
    .filter(([, entry]) => entry.lastWrong > 0 && entry.days.size < MISTAKE_BOOK_GRADUATION)
    .map(([id, entry]) => ({
      id,
      topicId: entry.topicId,
      category: entry.category,
      wrong: entry.wrong,
      lastWrong: entry.lastWrong,
      correctDays: entry.days.size,
    }))
    .sort((a, b) => b.wrong - a.wrong || b.lastWrong - a.lastWrong);
}

/**
 * Aggregates correct/total counts per topic across all recorded attempts.
 * @returns {Record<string, {correct: number, total: number}>}
 */
export function getTopicTotals() {
  return sumBreakdowns(getHistory(), "topicBreakdown");
}

/**
 * Aggregates correct/total counts per grammar category across all
 * recorded attempts. Attempts recorded before category history existed
 * simply have no `categoryBreakdown` and are skipped for this one.
 * @returns {Record<string, {correct: number, total: number}>}
 */
export function getCategoryTotals() {
  return sumBreakdowns(getHistory(), "categoryBreakdown");
}

/**
 * Roughly one pass through a topic. Whole attempts, floor not cap, the
 * same way `ACCURACY_WINDOW` works — the two numbers on screen answer the
 * same question and so they are computed the same way.
 */
const TOPIC_ACCURACY_WINDOW = 20;

/**
 * How the learner is doing in one topic, lately.
 *
 * This used to return the most recent attempt's slice of the topic, which
 * is a different and much worse number. A ten-question mixed test touches
 * three topics, so it leaves every topic row reading `0/3` — directly
 * beside the row's own subtitle saying the topic has 24 questions. Two
 * fractions on one line, and the wrong one is the bigger type.
 *
 * Then it was a lifetime average, which fixed that and introduced the
 * other half of the same problem: Profil's headline is windowed, the topic
 * chip was not, and a learner who improved watched one number move while
 * the other sat still. Two percentages that disagree are worse than
 * either, because neither says which question it is answering. Both are
 * now "how are you doing lately", for the reasons in `getOverallStats`.
 *
 * Accumulated and returned as a ratio rather than a fraction, so the
 * caller has nothing to render that could be read as a question count.
 * `answered` is there for the threshold, not for display.
 *
 * @param {string} topicId
 * @returns {{correct: number, answered: number, accuracy: number} | null}
 *   null when the learner has not answered enough in this topic for the
 *   number to mean anything.
 */
export function getTopicAccuracy(topicId) {
  const attempts = getHistory();
  let correct = 0;
  let answered = 0;
  // Newest first, and over the attempt's own breakdown rather than its
  // per-question list: the breakdown is the one part of an attempt every
  // version of the app has written, so a history recorded before the
  // question list carried topic ids still counts.
  for (let i = attempts.length - 1; i >= 0 && answered < TOPIC_ACCURACY_WINDOW; i -= 1) {
    const slice = attempts[i].topicBreakdown?.[topicId];
    if (slice) {
      correct += slice.correct;
      answered += slice.total;
    }
  }

  if (answered < MIN_ITEMS_FOR_WEAK_ENTRY) {
    return null;
  }
  return { correct, answered, accuracy: correct / answered };
}

/**
 * Upper end of the 95% Wilson score interval for `correct` out of `total`.
 *
 * This is the honesty check on every claim the app makes about a learner.
 * Two wrong out of four is 50%, and it is also completely consistent with
 * someone who knows 80% of the material having a bad afternoon — the
 * Wilson upper bound for 2/4 is about 0.85, so the app has no business
 * saying that category is a weakness. The bound is what separates "this is
 * the one you got most wrong" (a ranking, which needs little evidence)
 * from "you don't know this" (a claim, which needs a lot).
 *
 * Wilson rather than the normal approximation because the normal one is
 * badly behaved at exactly the sample sizes this app has.
 */
function wilsonUpper(correct, total) {
  if (total === 0) {
    return 1;
  }
  const z = 1.96;
  const p = correct / total;
  const denominator = 1 + (z * z) / total;
  const centre = p + (z * z) / (2 * total);
  const margin = z * Math.sqrt((p * (1 - p)) / total + (z * z) / (4 * total * total));
  return Math.min(1, (centre + margin) / denominator);
}

/**
 * Ranks what the learner is currently getting wrong.
 *
 * Two things here are deliberately not what they were. It used to sum
 * every answer ever given and call anything short of perfect a weakness,
 * which was wrong twice over: a learner who answers the same four
 * questions three times has a "total" of twelve and has demonstrated four
 * things, and lifetime sums never recover — from 60% over a hundred
 * answers it takes sixty consecutive correct ones to read 75%, so the
 * number stops responding to the learner long before they stop improving.
 *
 * So: one observation per distinct question, and the one that counts is
 * the *most recent* answer to it. That is a direct answer to "what do you
 * get right today", it recovers as fast as the learner does, and it cannot
 * be inflated by repetition.
 *
 * @param {"topicId"|"category"} field - which grouping to rank
 * @param {number} limit
 */
function weakestEntries(field, limit) {
  const current = {};

  for (const stat of Object.values(getItemStats())) {
    const key = stat[field];
    // Attempts recorded before this field was stored cannot be grouped.
    // Skipping them costs a little history and is the only honest option:
    // guessing the group from the question id would be a different
    // statistic wearing this one's name.
    if (typeof key !== "string") {
      continue;
    }
    const entry = (current[key] ??= { correct: 0, total: 0 });
    entry.total += 1;
    if (stat.lastCorrect) {
      entry.correct += 1;
    }
  }

  return Object.entries(current)
    .map(([key, stats]) => ({
      key,
      correct: stats.correct,
      total: stats.total,
      accuracy: stats.correct / stats.total,
      // True only when the evidence rules out mastery, not merely when the
      // learner has got something wrong. Everything the app *says out loud*
      // about a weakness is gated on this; the ranking itself is not.
      confident:
        stats.total >= MIN_ITEMS_FOR_WEAK_CLAIM && wilsonUpper(stats.correct, stats.total) < MASTERY,
    }))
    .filter((entry) => entry.total >= MIN_ITEMS_FOR_WEAK_ENTRY && entry.accuracy < MASTERY)
    .sort((a, b) => a.accuracy - b.accuracy || b.total - a.total)
    .slice(0, limit);
}

/**
 * Returns the topics the learner is weakest in, based on cumulative
 * accuracy across all attempts. Topics with too little data are excluded
 * so a single unlucky question doesn't label a topic "weak".
 * @param {number} limit
 * @returns {Array<{topicId: string, correct: number, total: number, accuracy: number}>}
 */
export function getWeakTopics(limit = 3) {
  return weakestEntries("topicId", limit).map(({ key, ...rest }) => ({ topicId: key, ...rest }));
}

/**
 * Same idea as getWeakTopics, but at the finer grammar-category level
 * (e.g. "Present Perfect vs Past Simple") rather than whole-topic level.
 * @param {number} limit
 * @returns {Array<{category: string, correct: number, total: number, accuracy: number}>}
 */
export function getWeakCategories(limit = 5) {
  return weakestEntries("category", limit).map(({ key, ...rest }) => ({ category: key, ...rest }));
}

/**
 * @returns {{testsCompleted: number, totalQuestions: number, totalCorrect: number, accuracy: number|null}}
 */
/** How many recent answers the headline accuracy is measured over. */
const ACCURACY_WINDOW = 40;

/**
 * The counters are lifetime totals, because that is what a counter is for.
 * The accuracy is not.
 *
 * A lifetime average stops responding to the learner long before the
 * learner stops improving: from 60% over a hundred answers it takes sixty
 * consecutive correct ones to reach 75%, so someone who has genuinely
 * turned things around watches a number that will not move. Worse, it
 * falls when they attempt something hard, which punishes exactly the
 * behaviour the app wants. Windowed to the last few dozen answers it means
 * "how are you doing lately", which is both the more useful question and
 * the one a learner assumes it is answering.
 *
 * @returns {{testsCompleted: number, totalQuestions: number, totalCorrect: number,
 *            accuracy: number|null, accuracyWindow: number}}
 */
export function getOverallStats() {
  const attempts = getHistory();
  let totalQuestions = 0;
  let totalCorrect = 0;
  for (const attempt of attempts) {
    totalQuestions += attempt.questions.length;
    totalCorrect += attempt.questions.filter((q) => q.correct).length;
  }

  // Walk backwards through the history, newest attempt first, until the
  // window is full. Attempts are whole; the window is a floor, not a cap,
  // so a single long test is never chopped in half.
  const recent = [];
  for (let i = attempts.length - 1; i >= 0 && recent.length < ACCURACY_WINDOW; i -= 1) {
    recent.push(...(attempts[i].questions ?? []));
  }

  return {
    testsCompleted: attempts.length,
    totalQuestions,
    totalCorrect,
    accuracy: recent.length === 0 ? null : recent.filter((q) => q.correct).length / recent.length,
    accuracyWindow: recent.length,
  };
}

export function clearHistory() {
  removeKey(HISTORY_KEY);
}

function loadSeenVersions() {
  return readJson(SEEN_VERSIONS_KEY, {}, isPlainObject);
}

/**
 * @param {string} topicId
 * @returns {number} the content version the learner last saw (0 if never)
 */
/**
 * When the learner was last here, from the only timestamp the app stores:
 * `attempt.date`, written on every attempt in results.js and until now
 * read by nothing.
 *
 * Lesson progress carries no timestamp, so a learner who has only ever
 * read lessons has no last-activity date at all. That is why this returns
 * null rather than a fallback: a screen that changes on "it has been a
 * while" must only do so when the app actually knows, and guessing from
 * the absence of attempts would tell a brand-new learner they had been
 * away.
 *
 * @returns {number|null} epoch milliseconds, or null when unknown.
 */
export function getLastActivity() {
  let latest = null;
  for (const attempt of getHistory()) {
    const time = Date.parse(attempt.date);
    if (!Number.isNaN(time) && (latest === null || time > latest)) {
      latest = time;
    }
  }
  // Lessons count too. Without this a learner who reads and never tests
  // has no last activity at all, so the Eğitim index can never notice
  // they have been away — which is exactly the learner most likely to
  // have been. Records written before the timestamp existed have no `at`
  // and simply do not vote, the way a missing `read` reads as zero.
  for (const entry of Object.values(getAllLessonProgress())) {
    if (typeof entry.at === "number" && (latest === null || entry.at > latest)) {
      latest = entry.at;
    }
  }
  return latest;
}

/**
 * The gap after which the Eğitim index offers a way back in rather than a
 * plain "carry on from 73%".
 *
 * Ten days, and it is not a lapse. Cepeda et al. taught over 1,350 people
 * and reviewed them at gaps up to 3.5 months: the useful gap scales with
 * how far off the test is, and for an exam a couple of months out it lands
 * around one to two weeks. So a fortnight away is roughly what the
 * literature would have picked, and the screen must not treat it as
 * something to apologise for.
 */
export const RE_ENTRY_DAYS = 10;

export function getSeenVersion(topicId) {
  return loadSeenVersions()[topicId] ?? 0;
}

/**
 * Records that the learner has now seen a topic's current content
 * version, clearing its "new questions added" badge.
 * @param {string} topicId
 * @param {number} version
 */
export function markTopicSeen(topicId, version) {
  const seen = loadSeenVersions();
  seen[topicId] = version;
  writeJson(SEEN_VERSIONS_KEY, seen);
}

/**
 * @returns {string} the learner's chosen display name, or "" if unset
 */
export function getProfileName() {
  try {
    return localStorage.getItem(PROFILE_NAME_KEY) ?? "";
  } catch {
    return "";
  }
}

/**
 * @param {string} name
 */
export function setProfileName(name) {
  if (!name) {
    removeKey(PROFILE_NAME_KEY);
    return;
  }
  try {
    localStorage.setItem(PROFILE_NAME_KEY, name);
  } catch {
    // Storage may be unavailable; the name just won't persist this visit.
  }
}

/* ---- Eğitim lesson progress ----
   One record per lesson: how far into it the learner got, and whether
   they finished it. `step` is the furthest step *reached*, which is what
   makes "resume where you left off" possible without replaying a whole
   lesson. Keyed by lesson id, so reordering or renaming lessons never
   silently reassigns someone's progress to the wrong lesson. */

function loadLessonProgress() {
  return readJson(LESSON_PROGRESS_KEY, {}, isPlainObject);
}

/**
 * Lesson progress is a *read fraction*, not a step index: a lesson is one
 * scrolling page now, so how far through it you are is a position on that
 * page. Kept as a number 0…1 so it survives the lesson getting longer or
 * shorter when its content is edited — a stored step index would silently
 * point somewhere else after an author adds a block.
 *
 * @returns {Record<string, {read: number, done: boolean}>} progress for
 *   every lesson the learner has opened
 */
export function getAllLessonProgress() {
  const stored = loadLessonProgress();
  const normalized = {};
  for (const [lessonId, entry] of Object.entries(stored)) {
    if (isPlainObject(entry)) {
      normalized[lessonId] = {
        read: clampRead(entry.read),
        done: entry.done === true,
        // When this lesson was last touched. Absent on every record
        // written before the field existed, and absence is a legitimate
        // answer — "unknown", not "never" — so it stays undefined rather
        // than defaulting to now or to zero.
        ...(typeof entry.at === "number" && Number.isFinite(entry.at) ? { at: entry.at } : {}),
      };
    }
  }
  return normalized;
}

/** Anything unparseable, out of range or absent reads as "not started". */
function clampRead(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return 0;
  }
  return value >= 1 ? 1 : value;
}

/**
 * @param {string} lessonId
 * @returns {{read: number, done: boolean} | null} null if never opened
 */
export function getLessonProgress(lessonId) {
  return getAllLessonProgress()[lessonId] ?? null;
}

/**
 * Records how far down the lesson the learner has been. Only ever moves
 * forward, so scrolling back up does not undo progress.
 * @param {string} lessonId
 * @param {number} read - 0…1
 */
export function recordLessonRead(lessonId, read) {
  const value = clampRead(read);
  const progress = getAllLessonProgress();
  const existing = progress[lessonId];
  if (existing && existing.read >= value) {
    return;
  }
  progress[lessonId] = { read: value, done: existing?.done === true, at: Date.now() };
  writeJson(LESSON_PROGRESS_KEY, progress);
}

/**
 * @param {string} lessonId
 */
export function markLessonDone(lessonId) {
  const progress = getAllLessonProgress();
  progress[lessonId] = { read: 1, done: true, at: Date.now() };
  writeJson(LESSON_PROGRESS_KEY, progress);
}

/**
 * @param {string[]} lessonIds - the lessons that currently exist
 * @returns {number} how many of them the learner has completed
 */
export function countCompletedLessons(lessonIds) {
  const progress = getAllLessonProgress();
  return lessonIds.filter((lessonId) => progress[lessonId]?.done).length;
}

export function clearLessonProgress() {
  removeKey(LESSON_PROGRESS_KEY);
}

/* ---- Settings ----
   Learner-chosen behaviour, as opposed to learner progress. Kept in one
   object rather than a key each, so a new setting costs nothing and a
   backup carries them all. Everything here defaults to off: a setting the
   learner has never seen should not change what the app does. */

/** @returns {Record<string, boolean>} */
export function getSettings() {
  return readJson(SETTINGS_KEY, {}, isPlainObject);
}

/**
 * @param {string} name
 * @returns {boolean}
 */
export function getSetting(name) {
  return getSettings()[name] === true;
}

/**
 * @param {string} name
 * @param {boolean} value
 */
export function setSetting(name, value) {
  writeJson(SETTINGS_KEY, { ...getSettings(), [name]: value === true });
}

/* ---- Backup ----
   Everything above lives in one browser and can be deleted by that
   browser without asking. These two functions are how a learner takes it
   with them; the merge itself is pure and lives in js/backup.js. */

/**
 * The whole learner-owned state, raw. Reads through the same guarded
 * helpers as everything else, so a corrupt key exports as its empty
 * fallback rather than taking the export down.
 */
export function exportState() {
  return {
    history: loadHistory(),
    lessonProgress: loadLessonProgress(),
    seenVersions: readJson(SEEN_VERSIONS_KEY, {}, isPlainObject),
    profileName: getProfileName(),
    settings: getSettings(),
  };
}

/**
 * Merges a backup into what is already here and writes the result. Never
 * destructive: an attempt already recorded is kept as it stands, lesson
 * progress takes the further of the two, and a name already set is not
 * overwritten by an older one.
 *
 * @param {{data: object}} backup - already validated by parseBackup
 * @returns {{newAttempts: number, newQuestions: number, advancedLessons: number}}
 */
export function importState(backup) {
  const theirs = backup?.data ?? {};
  const mineHistory = loadHistory();
  const mineLessons = loadLessonProgress();

  const summary = summariseRestore(mineHistory, theirs.history, mineLessons, theirs.lessonProgress);

  saveHistory(mergeHistory(mineHistory, theirs.history));
  writeJson(LESSON_PROGRESS_KEY, mergeLessonProgress(mineLessons, theirs.lessonProgress));
  writeJson(
    SEEN_VERSIONS_KEY,
    mergeSeenVersions(readJson(SEEN_VERSIONS_KEY, {}, isPlainObject), theirs.seenVersions)
  );

  // A name is the one field with no sensible merge, so the device the
  // learner is holding wins and a restore only fills a blank.
  if (!getProfileName() && typeof theirs.profileName === "string") {
    setProfileName(theirs.profileName);
  }
  // The device being held wins on a preference, the same way the name
  // does; a restore only fills in what has never been chosen here.
  if (isPlainObject(theirs.settings)) {
    writeJson(SETTINGS_KEY, { ...theirs.settings, ...getSettings() });
  }

  return summary;
}

/**
 * Asks the browser not to evict this origin's storage. Chrome grants it on
 * engagement heuristics; WebKit's documented heuristic includes whether
 * the site has been added to the Home Screen, which is why the app can
 * ask and still be refused. Fire-and-forget: there is nothing useful to do
 * with a "no", and the backup above is the actual answer.
 */
export function requestPersistentStorage() {
  try {
    navigator.storage?.persist?.().catch(() => {});
  } catch {
    // Not available. Nothing to do.
  }
}

/* The "still in development" banner is gone: it sat above every screen,
   was the first thing a stranger read, cost 48px of the 320px fold on
   every arrival and said something no learner could act on. What it was
   trying to say now lives in Profil, as a list of what exists and what is
   coming, where there is room to say it properly. `englishPrep.devNoteDismissed`
   is left in storage rather than deleted — an unread key costs nothing,
   and clearing one on upgrade is a migration this app has no need of. */
