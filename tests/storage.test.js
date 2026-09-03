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

test("weak spots need enough data, exclude perfect scores, and sort worst-first", () => {
  storage.recordAttempt(
    attempt({
      topics: {
        // 1/4 — clearly weak
        weak: { correct: 1, total: 4 },
        // 2/4 — weak, but less so
        middling: { correct: 2, total: 4 },
        // perfect: not a weak spot no matter how many attempts
        perfect: { correct: 5, total: 5 },
        // only 2 answers: too little data to label
        thin: { correct: 0, total: 2 },
      },
    })
  );

  assert.deepEqual(
    storage.getWeakTopics().map((entry) => entry.topicId),
    ["weak", "middling"]
  );
  assert.equal(storage.getWeakTopics(1).length, 1, "respects the limit");
  assert.equal(storage.getWeakTopics()[0].accuracy, 0.25);
});

test("weak categories use the same rules at category level", () => {
  storage.recordAttempt(
    attempt({
      categories: {
        "Perfect Aspects": { correct: 1, total: 5 },
        "Future Forms": { correct: 4, total: 4 },
      },
    })
  );

  assert.deepEqual(
    storage.getWeakCategories().map((entry) => entry.category),
    ["Perfect Aspects"]
  );
});

test("overall stats count questions, not attempts", () => {
  storage.recordAttempt(attempt({ questions: answers(3, 1) }));
  storage.recordAttempt(attempt({ questions: answers(1, 5) }));

  assert.deepEqual(storage.getOverallStats(), {
    testsCompleted: 2,
    totalQuestions: 10,
    totalCorrect: 4,
    accuracy: 0.4,
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

  storage.recordLessonStep("tenses-l1", 0);
  storage.recordLessonStep("tenses-l1", 3);
  storage.recordLessonStep("tenses-l1", 1);

  assert.deepEqual(storage.getLessonProgress("tenses-l1"), { step: 3, done: false });
});

test("completing a lesson keeps the furthest step and marks it done", () => {
  storage.recordLessonStep("tenses-l1", 2);
  storage.markLessonDone("tenses-l1", 5);

  assert.deepEqual(storage.getLessonProgress("tenses-l1"), { step: 5, done: true });

  // Re-reading a finished lesson must not un-finish it.
  storage.recordLessonStep("tenses-l1", 1);
  assert.equal(storage.getLessonProgress("tenses-l1").done, true);
});

test("completed lessons are counted only for lessons that still exist", () => {
  storage.markLessonDone("tenses-l1", 5);
  storage.markLessonDone("tenses-l2", 5);
  storage.markLessonDone("removed-lesson", 5);
  storage.recordLessonStep("tenses-l3", 2);

  assert.equal(storage.countCompletedLessons(["tenses-l1", "tenses-l2", "tenses-l3"]), 2);
  assert.equal(storage.countCompletedLessons([]), 0);
});

test("clearLessonProgress wipes lesson progress but not scores", () => {
  storage.markLessonDone("tenses-l1", 5);
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
      good: { step: 2, done: true },
      negative: { step: -5, done: false },
      wrongTypes: { step: "3", done: "yes" },
      notAnObject: "nope",
    })
  );

  assert.deepEqual(storage.getAllLessonProgress(), {
    good: { step: 2, done: true },
    negative: { step: 0, done: false },
    wrongTypes: { step: 0, done: false },
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
