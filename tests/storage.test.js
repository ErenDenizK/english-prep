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

function attempt({ topics = {}, categories = {}, questions = [], date = "2026-01-01T00:00:00.000Z" }) {
  return { date, mode: "mixed", topicBreakdown: topics, categoryBreakdown: categories, questions };
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
  assert.equal(storage.getLastTopicScore("tenses"), null);
  assert.deepEqual(storage.getOverallStats(), {
    testsCompleted: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    accuracy: null,
    accuracyWindow: 0,
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

test("getLastTopicScore returns the most recent attempt that covers the topic", () => {
  storage.recordAttempt(attempt({ topics: { tenses: { correct: 1, total: 5 } } }));
  storage.recordAttempt(attempt({ topics: { tenses: { correct: 4, total: 5 } } }));
  storage.recordAttempt(attempt({ topics: { modals: { correct: 2, total: 2 } } }));

  assert.deepEqual(storage.getLastTopicScore("tenses"), { correct: 4, total: 5 });
  assert.deepEqual(storage.getLastTopicScore("modals"), { correct: 2, total: 2 });
  assert.equal(storage.getLastTopicScore("articles"), null);
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

  assert.deepEqual(storage.getLessonProgress("tenses-l1"), { read: 0.7, done: false });
});

test("a read fraction is clamped to 0…1 however it arrives", () => {
  storage.recordLessonRead("tenses-l1", 4);
  assert.equal(storage.getLessonProgress("tenses-l1").read, 1);

  // A read of 0 still records the lesson as opened — the index shows a
  // lesson you have been into differently from one you have not.
  storage.recordLessonRead("tenses-l2", -1);
  assert.deepEqual(storage.getLessonProgress("tenses-l2"), { read: 0, done: false });

  storage.recordLessonRead("tenses-l3", Number.NaN);
  assert.deepEqual(storage.getLessonProgress("tenses-l3"), { read: 0, done: false });
});

test("completing a lesson marks it read to the end", () => {
  storage.recordLessonRead("tenses-l1", 0.3);
  storage.markLessonDone("tenses-l1");

  assert.deepEqual(storage.getLessonProgress("tenses-l1"), { read: 1, done: true });

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
