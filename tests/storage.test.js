// Unit tests for the persistence layer. storage.js is where "how am I
// doing?" is actually computed, so its aggregation rules (what counts as
// a weak spot, what a corrupt store falls back to) are worth pinning down.
//
// localStorage is stubbed in-memory before storage.js is imported, which
// is why the import below is dynamic: static imports are evaluated before
// any module body runs, and the stub has to exist first.

import test from "node:test";
import assert from "node:assert/strict";

function installLocalStorage() {
  const entries = new Map();
  globalThis.localStorage = {
    getItem: (key) => (entries.has(key) ? entries.get(key) : null),
    setItem: (key, value) => entries.set(key, String(value)),
    removeItem: (key) => entries.delete(key),
    clear: () => entries.clear(),
  };
  return entries;
}

const entries = installLocalStorage();
const storage = await import("../js/storage.js");

function attempt({ topics = {}, categories = {}, questions = [], date = "2026-01-01T00:00:00.000Z", mode = "mixed" }) {
  return { date, mode, topicBreakdown: topics, categoryBreakdown: categories, questions };
}

const answers = (correct, wrong) => [
  ...Array.from({ length: correct }, (_, i) => ({ id: `c${i}`, topicId: "tenses", correct: true })),
  ...Array.from({ length: wrong }, (_, i) => ({ id: `w${i}`, topicId: "tenses", correct: false })),
];

test.beforeEach(() => entries.clear());

test("an empty store reports empty stats rather than throwing", () => {
  assert.deepEqual(storage.getHistory(), []);
  assert.deepEqual(storage.getTopicTotals(), {});
  assert.deepEqual(storage.getCategoryTotals(), {});
  assert.deepEqual(storage.getWeakTopics(), []);
  assert.equal(storage.getTopicAccuracy("tenses"), null);
  assert.deepEqual(storage.getOverallStats(), {
    testsCompleted: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    accuracy: null,
    accuracyWindow: 0,
    accuracyFromBook: 0,
  });
});

test("totals accumulate across attempts, per topic and per category", () => {
  storage.recordAttempt(
    attempt({
      topics: { tenses: { correct: 3, total: 4 } },
      categories: { "Future Forms": { correct: 3, total: 4 } },
    })
  );
  storage.recordAttempt(
    attempt({
      topics: { tenses: { correct: 1, total: 2 }, modals: { correct: 2, total: 2 } },
      categories: { "Future Forms": { correct: 0, total: 1 }, Obligation: { correct: 2, total: 2 } },
    })
  );

  assert.deepEqual(storage.getTopicTotals(), {
    tenses: { correct: 4, total: 6 },
    modals: { correct: 2, total: 2 },
  });
  assert.deepEqual(storage.getCategoryTotals(), {
    "Future Forms": { correct: 3, total: 5 },
    Obligation: { correct: 2, total: 2 },
  });
});

test("attempts recorded before category history existed are skipped, not fatal", () => {
  const legacy = attempt({ topics: { tenses: { correct: 1, total: 2 } } });
  delete legacy.categoryBreakdown;
  storage.recordAttempt(legacy);

  assert.deepEqual(storage.getCategoryTotals(), {});
  assert.deepEqual(storage.getTopicTotals(), { tenses: { correct: 1, total: 2 } });
});

test("topic accuracy spans attempts, not just the last one", () => {
  storage.recordAttempt(attempt({ topics: { tenses: { correct: 1, total: 5 } } }));
  storage.recordAttempt(attempt({ topics: { tenses: { correct: 4, total: 5 } } }));

  assert.deepEqual(storage.getTopicAccuracy("tenses"), { correct: 5, answered: 10, accuracy: 0.5 });
  assert.equal(storage.getTopicAccuracy("articles"), null);
});

test("the topic percentage is windowed, so an improving learner sees it move", () => {
  // Twenty-four answers at 25%, then twenty at 100%. A lifetime average
  // would read 59% and keep the learner looking at their worst week;
  // Profil's headline is windowed for exactly that reason, and two
  // percentages on screen that disagree are worse than either.
  for (let i = 0; i < 6; i += 1) {
    storage.recordAttempt(attempt({ topics: { tenses: { correct: 1, total: 4 } } }));
  }
  for (let i = 0; i < 5; i += 1) {
    storage.recordAttempt(attempt({ topics: { tenses: { correct: 4, total: 4 } } }));
  }

  assert.equal(storage.getTopicAccuracy("tenses").accuracy, 1);
});

test("the window is a floor, so one long test is never chopped in half", () => {
  storage.recordAttempt(attempt({ topics: { tenses: { correct: 0, total: 4 } } }));
  storage.recordAttempt(attempt({ topics: { tenses: { correct: 12, total: 24 } } }));

  // The 24-answer attempt alone fills the window, so the older one is out
  // — but the long attempt is counted whole rather than trimmed to 20.
  assert.deepEqual(storage.getTopicAccuracy("tenses"), {
    correct: 12,
    answered: 24,
    accuracy: 0.5,
  });
});

/* A ten-question mixed test touches three topics, so the old
 * last-attempt-wins reading left a 24-question topic showing "0/3" beside
 * its own subtitle saying it has 24 questions. The fraction is gone from
 * the screen, and the number behind it is no longer the last slice. */
test("a mixed test's slice of a topic does not become that topic's score", () => {
  storage.recordAttempt(attempt({ topics: { "passive-voice": { correct: 8, total: 10 } } }));
  storage.recordAttempt(
    attempt({
      mode: "mixed",
      topics: { tenses: { correct: 2, total: 4 }, "passive-voice": { correct: 0, total: 3 } },
    })
  );

  const passive = storage.getTopicAccuracy("passive-voice");
  assert.equal(passive.answered, 13);
  assert.equal(passive.correct, 8);
});

/* Below the threshold the app says nothing rather than reporting a
 * percentage computed from two answers. */
test("a topic answered fewer than three times reports no accuracy at all", () => {
  storage.recordAttempt(attempt({ mode: "mixed", topics: { modals: { correct: 0, total: 2 } } }));
  assert.equal(storage.getTopicAccuracy("modals"), null);

  storage.recordAttempt(attempt({ mode: "mixed", topics: { modals: { correct: 1, total: 1 } } }));
  assert.deepEqual(storage.getTopicAccuracy("modals"), { correct: 1, answered: 3, accuracy: 1 / 3 });
});

/** One answered question, as an attempt records it. */
const answered = (id, topicId, category, correct) => ({ id, topicId, category, correct });

test("weakness is measured over distinct questions, not over answers", () => {
  // The same three questions, answered twice: once badly, once well. The
  // old rule summed every answer and would have called this 3/6. What the
  // learner can do *now* is 3/3.
  storage.recordAttempt(
    attempt({
      date: "2026-01-01T00:00:00.000Z",
      topics: { tenses: { correct: 0, total: 3 } },
      questions: [
        answered("tenses-t1", "tenses", "A", false),
        answered("tenses-t2", "tenses", "A", false),
        answered("tenses-t3", "tenses", "A", false),
      ],
    })
  );
  storage.recordAttempt(
    attempt({
      date: "2026-01-08T00:00:00.000Z",
      topics: { tenses: { correct: 3, total: 3 } },
      questions: [
        answered("tenses-t1", "tenses", "A", true),
        answered("tenses-t2", "tenses", "A", true),
        answered("tenses-t3", "tenses", "A", true),
      ],
    })
  );

  assert.deepEqual(storage.getWeakTopics(), [], "improving stops being a weakness immediately");
});

test("weak spots need enough distinct questions, and are ranked worst-first", () => {
  const q = (topic, n, correct) => answered(`${topic}-t${n}`, topic, "A", correct);
  storage.recordAttempt(
    attempt({
      topics: {
        weak: { correct: 1, total: 4 },
        middling: { correct: 3, total: 4 },
        perfect: { correct: 4, total: 4 },
        thin: { correct: 0, total: 2 },
      },
      questions: [
        q("weak", 1, true), q("weak", 2, false), q("weak", 3, false), q("weak", 4, false),
        q("middling", 1, true), q("middling", 2, true), q("middling", 3, true), q("middling", 4, false),
        q("perfect", 1, true), q("perfect", 2, true), q("perfect", 3, true), q("perfect", 4, true),
        // Only two distinct questions: too little to rank at all.
        q("thin", 1, false), q("thin", 2, false),
      ],
    })
  );

  assert.deepEqual(
    storage.getWeakTopics().map((entry) => entry.topicId),
    ["weak", "middling"]
  );
  assert.equal(storage.getWeakTopics(1).length, 1, "respects the limit");
  assert.equal(storage.getWeakTopics()[0].accuracy, 0.25);
});

test("a ranking is offered on thin evidence; a claim is not", () => {
  const q = (n, correct) => answered(`t-t${n}`, "t", "A", correct);
  // Two of four wrong. Worth ranking, and nowhere near enough to assert
  // that the learner does not know it — the Wilson upper bound is ~0.85.
  storage.recordAttempt(
    attempt({ topics: { t: { correct: 2, total: 4 } }, questions: [q(1, true), q(2, true), q(3, false), q(4, false)] })
  );
  const [thin] = storage.getWeakTopics();
  assert.equal(thin.accuracy, 0.5);
  assert.equal(thin.confident, false, "four questions cannot rule out mastery");

  // Eight distinct questions, two right. Now the evidence carries a claim.
  storage.clearHistory();
  const many = Array.from({ length: 8 }, (_, i) => q(i + 1, i < 2));
  storage.recordAttempt(attempt({ topics: { t: { correct: 2, total: 8 } }, questions: many }));
  assert.equal(storage.getWeakTopics()[0].confident, true);
});

test("guessing gets you a ranking, never a verdict", () => {
  // The old rule was `accuracy < 1`, so any imperfect group was declared a
  // weakness — which meant someone answering at random was told they were
  // weak in everything. The protection is not a kinder threshold, because
  // a ranking of what you got most wrong is legitimately useful on thin
  // evidence. It is that the app will not *state* a weakness until the
  // evidence rules mastery out.
  const q = (n, correct) => answered(`t-t${n}`, "t", "A", correct);
  storage.recordAttempt(
    attempt({ topics: { t: { correct: 1, total: 4 } }, questions: [q(1, true), q(2, false), q(3, false), q(4, false)] })
  );
  const [ranked] = storage.getWeakTopics();
  assert.equal(ranked.accuracy, 0.25, "still ranked, and ranked correctly");
  assert.equal(ranked.confident, false, "but four questions carry no verdict");
});

test("something the learner is nearly always right about is not a weak spot", () => {
  const q = (n, correct) => answered(`t-t${n}`, "t", "A", correct);
  const eight = Array.from({ length: 8 }, (_, i) => q(i + 1, i < 7));
  storage.recordAttempt(attempt({ topics: { t: { correct: 7, total: 8 } }, questions: eight }));
  assert.deepEqual(storage.getWeakTopics(), [], "7 of 8 is above the mastery line");
});
test("weak categories use the same rules at category level", () => {
  const q = (n, category, correct) => answered(`tenses-t${n}`, "tenses", category, correct);
  storage.recordAttempt(
    attempt({
      categories: { "Perfect Aspects": { correct: 1, total: 4 }, "Future Forms": { correct: 4, total: 4 } },
      questions: [
        q(1, "Perfect Aspects", true), q(2, "Perfect Aspects", false),
        q(3, "Perfect Aspects", false), q(4, "Perfect Aspects", false),
        q(5, "Future Forms", true), q(6, "Future Forms", true),
        q(7, "Future Forms", true), q(8, "Future Forms", true),
      ],
    })
  );

  assert.deepEqual(
    storage.getWeakCategories().map((entry) => entry.category),
    ["Perfect Aspects"]
  );
});

test("attempts recorded before categories were stored are skipped, not guessed at", () => {
  storage.recordAttempt(
    attempt({
      categories: { "Perfect Aspects": { correct: 0, total: 4 } },
      // The old per-question shape: no category field.
      questions: [
        { id: "tenses-t1", topicId: "tenses", correct: false },
        { id: "tenses-t2", topicId: "tenses", correct: false },
        { id: "tenses-t3", topicId: "tenses", correct: false },
      ],
    })
  );

  assert.deepEqual(storage.getWeakCategories(), [], "no category on the record, no category ranking");
  assert.deepEqual(
    storage.getWeakTopics().map((entry) => entry.topicId),
    ["tenses"],
    "the topic is still on the record, so that ranking survives"
  );
});
test("overall stats count questions, not attempts", () => {
  storage.recordAttempt(attempt({ questions: answers(3, 1) }));
  storage.recordAttempt(attempt({ questions: answers(1, 5) }));

  assert.deepEqual(storage.getOverallStats(), {
    testsCompleted: 2,
    totalQuestions: 10,
    totalCorrect: 4,
    // Ten answers is inside the window, so recent and lifetime agree here.
    accuracy: 0.4,
    accuracyWindow: 10,
    accuracyFromBook: 0,
  });
});

test("clearHistory wipes scores but leaves the seen-content record alone", () => {
  storage.recordAttempt(attempt({ topics: { tenses: { correct: 1, total: 1 } } }));
  storage.markTopicSeen("tenses", 3);

  storage.clearHistory();

  assert.deepEqual(storage.getHistory(), []);
  assert.equal(storage.getSeenVersion("tenses"), 3, "content freshness is not learner progress");
});

test("the display name round-trips and clears on empty", () => {
  assert.equal(storage.getProfileName(), "");

  storage.setProfileName("Eren");
  assert.equal(storage.getProfileName(), "Eren");

  storage.setProfileName("");
  assert.equal(storage.getProfileName(), "");
});

test("seen content versions default to 0 and round-trip per topic", () => {
  assert.equal(storage.getSeenVersion("tenses"), 0);

  storage.markTopicSeen("tenses", 2);
  storage.markTopicSeen("modals", 1);

  assert.equal(storage.getSeenVersion("tenses"), 2);
  assert.equal(storage.getSeenVersion("modals"), 1);
});

test("lesson progress only ever moves forward", () => {
  assert.equal(storage.getLessonProgress("tenses-l1"), null);

  storage.recordLessonRead("tenses-l1", 0.2);
  storage.recordLessonRead("tenses-l1", 0.7);
  storage.recordLessonRead("tenses-l1", 0.4);

  const progress = storage.getLessonProgress("tenses-l1");
  assert.equal(progress.read, 0.7);
  assert.equal(progress.done, false);
});

test("a read fraction is clamped to 0…1 however it arrives", () => {
  storage.recordLessonRead("tenses-l1", 4);
  assert.equal(storage.getLessonProgress("tenses-l1").read, 1);

  // A read of 0 still records the lesson as opened — the index shows a
  // lesson you have been into differently from one you have not.
  storage.recordLessonRead("tenses-l2", -1);
  assert.equal(storage.getLessonProgress("tenses-l2").read, 0);
  assert.equal(storage.getLessonProgress("tenses-l2").done, false);

  storage.recordLessonRead("tenses-l3", Number.NaN);
  assert.equal(storage.getLessonProgress("tenses-l3").read, 0);
  assert.equal(storage.getLessonProgress("tenses-l3").done, false);
});

test("lesson progress carries when it happened, and a record without one stays unknown", () => {
  const before = Date.now();
  storage.recordLessonRead("tenses-l1", 0.3);
  const at = storage.getLessonProgress("tenses-l1").at;
  assert.ok(at >= before && at <= Date.now());

  storage.markLessonDone("tenses-l2");
  assert.ok(typeof storage.getLessonProgress("tenses-l2").at === "number");

  // A record written before the field existed. Absence is a real answer —
  // "unknown", not "never" — so it must not be invented on read.
  localStorage.setItem(
    "englishPrep.lessonProgress",
    JSON.stringify({ "tenses-l9": { read: 1, done: true } })
  );
  assert.equal("at" in storage.getLessonProgress("tenses-l9"), false);
});

test("a learner who has only ever read lessons still has a last activity", () => {
  // The whole point of the timestamp: before it, getLastActivity read
  // only the attempt history, so someone who reads and never tests could
  // never be noticed as having been away.
  assert.equal(storage.getLastActivity(), null);

  const before = Date.now();
  storage.recordLessonRead("tenses-l1", 0.5);
  const activity = storage.getLastActivity();
  assert.ok(activity >= before && activity <= Date.now());
});

test("the later of a test and a lesson is the last activity", () => {
  storage.recordLessonRead("tenses-l1", 0.5);
  const afterLesson = storage.getLastActivity();

  storage.recordAttempt({
    date: new Date(Date.now() + 60_000).toISOString(),
    mode: "mixed",
    topicBreakdown: {},
    questions: [],
  });
  assert.ok(storage.getLastActivity() > afterLesson);
});

test("completing a lesson marks it read to the end", () => {
  storage.recordLessonRead("tenses-l1", 0.3);
  storage.markLessonDone("tenses-l1");

  assert.equal(storage.getLessonProgress("tenses-l1").read, 1);
  assert.equal(storage.getLessonProgress("tenses-l1").done, true);

  // Re-reading a finished lesson must not un-finish it.
  storage.recordLessonRead("tenses-l1", 0.1);
  assert.equal(storage.getLessonProgress("tenses-l1").done, true);
});

test("completed lessons are counted only for lessons that still exist", () => {
  storage.markLessonDone("tenses-l1");
  storage.markLessonDone("tenses-l2");
  storage.markLessonDone("removed-lesson");
  storage.recordLessonRead("tenses-l3", 0.5);

  assert.equal(storage.countCompletedLessons(["tenses-l1", "tenses-l2", "tenses-l3"]), 2);
  assert.equal(storage.countCompletedLessons([]), 0);
});

test("clearLessonProgress wipes lesson progress but not scores", () => {
  storage.markLessonDone("tenses-l1");
  storage.recordAttempt(attempt({ topics: { tenses: { correct: 1, total: 1 } } }));

  storage.clearLessonProgress();

  assert.deepEqual(storage.getAllLessonProgress(), {});
  assert.equal(storage.getHistory().length, 1);
});

test("a corrupt store degrades to empty instead of crashing", () => {
  entries.set("englishPrep.history", "{not json");
  entries.set("englishPrep.lessonProgress", "[1,2,3]");
  entries.set("englishPrep.seenVersions", "42");

  assert.deepEqual(storage.getHistory(), []);
  assert.deepEqual(storage.getAllLessonProgress(), {});
  assert.equal(storage.getSeenVersion("tenses"), 0);
});

test("malformed lesson entries are normalized rather than trusted", () => {
  entries.set(
    "englishPrep.lessonProgress",
    JSON.stringify({
      good: { read: 0.5, done: true },
      negative: { read: -5, done: false },
      wrongTypes: { read: "3", done: "yes" },
      // Written by a build before lessons became one scrolling page. The
      // shape is gone, so the entry reads as unstarted rather than as a
      // read fraction of 2.
      legacyStep: { step: 2, done: true },
      notAnObject: "nope",
    })
  );

  assert.deepEqual(storage.getAllLessonProgress(), {
    good: { read: 0.5, done: true },
    negative: { read: 0, done: false },
    wrongTypes: { read: 0, done: false },
    legacyStep: { read: 0, done: true },
  });
});

test("an unavailable localStorage never breaks a read or a write", () => {
  const working = globalThis.localStorage;
  globalThis.localStorage = {
    getItem: () => {
      throw new Error("SecurityError");
    },
    setItem: () => {
      throw new Error("QuotaExceededError");
    },
    removeItem: () => {
      throw new Error("SecurityError");
    },
  };

  try {
    assert.deepEqual(storage.getHistory(), []);
    assert.equal(storage.getProfileName(), "");
    assert.equal(storage.getLessonProgress("tenses-l1"), null);
    assert.doesNotThrow(() => storage.recordAttempt(attempt({})));
    assert.doesNotThrow(() => storage.markLessonDone("tenses-l1", 1));
    assert.doesNotThrow(() => storage.setProfileName("Eren"));
    assert.doesNotThrow(() => storage.clearHistory());
  } finally {
    globalThis.localStorage = working;
  }
});

test("headline accuracy is recent, not lifetime", () => {
  const answers = (n, correct) =>
    Array.from({ length: n }, (_, i) => answered(`q${Math.random()}${i}`, "t", "A", correct));

  // A bad start, then fifty in a row correct. A lifetime average would
  // still read 62%; what the learner can do now is 100%.
  storage.recordAttempt(attempt({ date: "2026-01-01T00:00:00.000Z", questions: answers(30, false) }));
  storage.recordAttempt(attempt({ date: "2026-02-01T00:00:00.000Z", questions: answers(50, true) }));

  const stats = storage.getOverallStats();
  assert.equal(stats.totalQuestions, 80, "the counter is still a lifetime total");
  assert.equal(stats.accuracy, 1, "the accuracy is not");
  assert.equal(stats.accuracyWindow, 50);
});

test("the accuracy window never chops an attempt in half", () => {
  storage.recordAttempt(attempt({ questions: Array.from({ length: 100 }, (_, i) => answered(`q${i}`, "t", "A", i < 60)) }));
  const stats = storage.getOverallStats();
  assert.equal(stats.accuracyWindow, 100, "one long test counts whole");
  assert.equal(stats.accuracy, 0.6);
});

test("accuracy is null before anything has been answered", () => {
  assert.equal(storage.getOverallStats().accuracy, null);
  assert.equal(storage.getOverallStats().accuracyWindow, 0);
});

/* ---- Yanlış defteri ----
 *
 * The graduation rule is the whole design, so it is the whole test: an
 * item leaves the book after two correct answers on two separate days,
 * and one wrong answer puts it straight back with the count reset. These
 * are the cases where a learner would notice the app got it wrong.
 */

const one = (id, correct, date) =>
  attempt({ date, questions: [{ id, topicId: "tenses", category: "A vs B", correct }] });

test("an item enters the book the moment it is answered wrong", () => {
  storage.recordAttempt(one("q1", false, "2026-01-01T09:00:00.000Z"));
  const book = storage.getMistakeBook();
  assert.equal(book.length, 1);
  assert.equal(book[0].id, "q1");
  assert.equal(book[0].wrong, 1);
  assert.equal(book[0].correctDays, 0);
});

test("a question never answered wrong is not in the book", () => {
  storage.recordAttempt(one("q1", true, "2026-01-01T09:00:00.000Z"));
  assert.deepEqual(storage.getMistakeBook(), []);
});

test("one correct answer does not graduate an item", () => {
  storage.recordAttempt(one("q1", false, "2026-01-01T09:00:00.000Z"));
  storage.recordAttempt(one("q1", true, "2026-01-02T09:00:00.000Z"));
  assert.equal(storage.getMistakeBook().length, 1);
  assert.equal(storage.getMistakeBook()[0].correctDays, 1);
});

test("two correct answers on the SAME day do not graduate an item", () => {
  // The point of the rule: answering again ten seconds after reading the
  // explanation proves the explanation was on screen, nothing more.
  storage.recordAttempt(one("q1", false, "2026-01-01T09:00:00.000Z"));
  storage.recordAttempt(one("q1", true, "2026-01-02T09:00:00.000Z"));
  storage.recordAttempt(one("q1", true, "2026-01-02T09:00:30.000Z"));
  assert.equal(storage.getMistakeBook().length, 1);
});

test("two correct answers on separate days graduate an item", () => {
  storage.recordAttempt(one("q1", false, "2026-01-01T09:00:00.000Z"));
  storage.recordAttempt(one("q1", true, "2026-01-02T09:00:00.000Z"));
  storage.recordAttempt(one("q1", true, "2026-01-03T09:00:00.000Z"));
  assert.deepEqual(storage.getMistakeBook(), []);
});

test("getting it wrong again puts it back and resets the count", () => {
  storage.recordAttempt(one("q1", false, "2026-01-01T09:00:00.000Z"));
  storage.recordAttempt(one("q1", true, "2026-01-02T09:00:00.000Z"));
  storage.recordAttempt(one("q1", false, "2026-01-03T09:00:00.000Z"));
  storage.recordAttempt(one("q1", true, "2026-01-04T09:00:00.000Z"));
  const book = storage.getMistakeBook();
  assert.equal(book.length, 1);
  assert.equal(book[0].wrong, 2);
  assert.equal(book[0].correctDays, 1, "the day before the second mistake must not count");
});

test("correct answers before the first mistake do not count towards graduating", () => {
  storage.recordAttempt(one("q1", true, "2026-01-01T09:00:00.000Z"));
  storage.recordAttempt(one("q1", true, "2026-01-02T09:00:00.000Z"));
  storage.recordAttempt(one("q1", false, "2026-01-03T09:00:00.000Z"));
  assert.equal(storage.getMistakeBook()[0].correctDays, 0);
});

test("the book is ordered worst first", () => {
  storage.recordAttempt(one("often", false, "2026-01-01T09:00:00.000Z"));
  storage.recordAttempt(one("often", false, "2026-01-02T09:00:00.000Z"));
  storage.recordAttempt(one("once", false, "2026-01-03T09:00:00.000Z"));
  storage.recordAttempt(one("older", false, "2026-01-01T08:00:00.000Z"));
  const ids = storage.getMistakeBook().map((entry) => entry.id);
  assert.equal(ids[0], "often", "more wrong answers first");
  assert.deepEqual(ids.slice(1), ["once", "older"], "then most recently wrong");
});

test("the book carries topic and category so a caller need not load content", () => {
  storage.recordAttempt(one("q1", false, "2026-01-01T09:00:00.000Z"));
  assert.equal(storage.getMistakeBook()[0].topicId, "tenses");
  assert.equal(storage.getMistakeBook()[0].category, "A vs B");
});

test("a backup restored out of order still graduates correctly", () => {
  // History is appended in order, but merged history is not, so the pass
  // sorts by timestamp rather than trusting position.
  storage.recordAttempt(one("q1", true, "2026-01-03T09:00:00.000Z"));
  storage.recordAttempt(one("q1", false, "2026-01-01T09:00:00.000Z"));
  storage.recordAttempt(one("q1", true, "2026-01-02T09:00:00.000Z"));
  assert.deepEqual(storage.getMistakeBook(), [], "two later corrects on separate days");
});

test("an empty store has an empty book rather than throwing", () => {
  assert.deepEqual(storage.getMistakeBook(), []);
});

/* ---- The weakness claim, and what the content lets it say ----
 *
 * `confident` gates the difference between "these are your weakest" and
 * "you cannot do these". It needs six distinct items in one category, and
 * every category in the app ships four or five — so the confident branch
 * is unreachable by construction today. These tests pin both halves, so
 * that if a category ever grows past six the behaviour is a decision
 * rather than a surprise.
 */

test("a category is not claimed as a weakness on four items", () => {
  for (let i = 0; i < 4; i += 1) {
    storage.recordAttempt(
      attempt({
        date: `2026-02-0${i + 1}T09:00:00.000Z`,
        questions: [{ id: `q${i}`, topicId: "tenses", category: "A vs B", correct: false }],
      })
    );
  }
  const [entry] = storage.getWeakCategories();
  assert.equal(entry.category, "A vs B");
  assert.equal(entry.total, 4, "it is still ranked");
  assert.equal(entry.confident, false, "but not claimed");
});

test("six distinct items in one category do support the claim", () => {
  for (let i = 0; i < 6; i += 1) {
    storage.recordAttempt(
      attempt({
        date: `2026-02-0${i + 1}T09:00:00.000Z`,
        questions: [{ id: `q${i}`, topicId: "tenses", category: "A vs B", correct: false }],
      })
    );
  }
  assert.equal(storage.getWeakCategories()[0].confident, true);
});

test("answering the same four questions again does not manufacture evidence", () => {
  // Six *distinct* items, not six answers: re-answering the same four
  // questions is the same four data points, and the threshold has to
  // count questions rather than attempts or it inflates itself.
  for (let round = 0; round < 3; round += 1) {
    for (let i = 0; i < 4; i += 1) {
      storage.recordAttempt(
        attempt({
          date: `2026-03-0${round + 1}T09:00:00.000Z`,
          questions: [{ id: `q${i}`, topicId: "tenses", category: "A vs B", correct: false }],
        })
      );
    }
  }
  const [entry] = storage.getWeakCategories();
  assert.equal(entry.total, 4);
  assert.equal(entry.confident, false);
});

test("finishing a lesson twice does not write twice", () => {
  // The reader calls markLessonDone from a scroll handler, so holding at
  // the bottom of a lesson used to serialise the whole progress map on
  // every animation frame — eighty writes in eighty frames.
  let writes = 0;
  const real = localStorage.setItem;
  localStorage.setItem = (...args) => {
    writes += 1;
    return real(...args);
  };
  try {
    storage.markLessonDone("tenses-l1");
    const after = writes;
    for (let i = 0; i < 20; i += 1) {
      storage.markLessonDone("tenses-l1");
    }
    assert.equal(writes, after, "repeat calls wrote to storage");
  } finally {
    localStorage.setItem = real;
  }
});

test("finishing again does not move the timestamp", () => {
  // `at` means when the learner finished this lesson. Scrolling past the
  // end a week later is not finishing it again.
  storage.markLessonDone("tenses-l2");
  const first = storage.getLessonProgress("tenses-l2").at;
  storage.markLessonDone("tenses-l2");
  assert.equal(storage.getLessonProgress("tenses-l2").at, first);
});

/* ---- Remembered choices ----
   A count is not a boolean, and `setSetting` coerces to one on purpose.
   These are the second pair of accessors over the same settings object,
   so the rule worth pinning is the one that makes them safe: the caller
   declares what it can honour, and anything else reads as the fallback. */

const COUNTS = ["5", "10", "20", "all"];

test("an unset choice reads as its fallback", () => {
  assert.equal(storage.getChoice("mixedCount", COUNTS, "10"), "10");
});

test("a chosen value comes back", () => {
  storage.setChoice("mixedCount", "20", COUNTS);
  assert.equal(storage.getChoice("mixedCount", COUNTS, "10"), "20");
});

test("a value the caller cannot honour is never written", () => {
  storage.setChoice("mixedCount", "999", COUNTS);
  assert.equal(storage.getChoice("mixedCount", COUNTS, "10"), "10");
});

test("a stored value the list no longer offers reads as the fallback", () => {
  // The mistake book's list is as long as the book: someone who picked
  // twenty and has since worked down to eight questions must not be
  // handed a count the screen cannot show.
  storage.setChoice("mistakeCount", "20", COUNTS);
  assert.equal(storage.getChoice("mistakeCount", ["5", "all"], "all"), "all");
});

test("a hand-edited store cannot make the app act on nonsense", () => {
  localStorage.setItem("englishPrep.settings", JSON.stringify({ mixedCount: { n: 20 } }));
  assert.equal(storage.getChoice("mixedCount", COUNTS, "10"), "10");
});

test("a remembered choice does not disturb the boolean settings", () => {
  storage.setSetting("thinkFirst", true);
  storage.setChoice("mixedCount", "5", COUNTS);
  assert.equal(storage.getSetting("thinkFirst"), true);
  assert.equal(storage.getChoice("mixedCount", COUNTS, "10"), "5");
});

test("a remembered choice rides the backup", () => {
  storage.setChoice("mixedCount", "20", COUNTS);
  assert.equal(storage.exportState().settings.mixedCount, "20");
});

/* ---- What is in the accuracy window ----
   `mode` has been on every attempt since the beginning and nothing had
   ever read it back out of history. The mistake book is by construction
   the learner's hardest items, so a week of running it drags the headline
   number down — the failure getOverallStats' own docstring names about
   lifetime averages, arriving by another route. The number is not
   filtered; it is labelled. */

test("an accuracy window with no book runs says so with a zero", () => {
  storage.recordAttempt(attempt({ questions: answers(3, 1), mode: "mixed" }));
  assert.equal(storage.getOverallStats().accuracyFromBook, 0);
});

test("book answers inside the window are counted", () => {
  storage.recordAttempt(attempt({ questions: answers(3, 1), mode: "mixed" }));
  storage.recordAttempt(attempt({ questions: answers(2, 3), mode: "mistakes" }));
  const stats = storage.getOverallStats();
  assert.equal(stats.accuracyFromBook, 5);
  assert.equal(stats.accuracyWindow, 9);
});

test("counting them does not change the accuracy itself", () => {
  storage.recordAttempt(attempt({ questions: answers(2, 2), mode: "mistakes" }));
  const stats = storage.getOverallStats();
  assert.equal(stats.accuracy, 0.5);
});

test("the chosen option is written down, not only whether it was right", () => {
  storage.recordAttempt(
    attempt({ questions: [{ id: "q1", topicId: "tenses", correct: false, selected: "went" }] })
  );
  assert.equal(storage.getHistory()[0].questions[0].selected, "went");
});
