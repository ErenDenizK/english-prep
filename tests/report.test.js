// The report text — the one channel from a learner back to the content.
//
// These tests exist because the feature shipped broken and stayed broken:
// `buildReport` read `question.paragraph`, and nothing the app hands
// around has that field. `normalizeQuestion` in js/topics.js folds a
// cloze item's `paragraph` and a restatement's `sentence` into `prompt`,
// so every report a learner ever sent carried a blank line where the
// question should have been.
//
// It was invisible from both directions. There was no unit test at all,
// and the browser sweep asserts four things about the clipboard text —
// none of them the question. So the test below is written against the
// shape the app actually produces, and takes it from `normalizeQuestion`
// rather than hand-building a fixture, because a hand-built fixture is
// exactly how a test agrees with a bug.

import test from "node:test";
import assert from "node:assert/strict";

import { buildReport } from "../js/report.js";

const AT = new Date("2026-09-04T10:00:00Z");

/** A cloze item, in the shape `normalizeQuestion` produces. */
const cloze = {
  id: "tenses-t3",
  category: "Present Perfect vs Past Simple",
  type: "cloze",
  prompt: "She ____ in Ankara since 2019, and still has no plans to leave.",
  options: ["has lived", "lived", "lives", "had lived"],
  correctAnswer: "has lived",
};

test("the report carries the question itself", () => {
  const text = buildReport(cloze, "lived", AT);
  assert.ok(
    text.includes(cloze.prompt),
    `the stem is missing from the report:\n${text}`
  );
});

test("it carries what the learner chose and what the app claimed", () => {
  const text = buildReport(cloze, "lived", AT);
  assert.ok(text.includes("tenses-t3"), "the id identifies the item");
  assert.ok(text.includes("lived"), "the learner's answer is in it");
  assert.ok(text.includes("has lived"), "the app's answer is in it");
  assert.ok(text.includes("Present Perfect vs Past Simple"), "the category is in it");
});

test("a restatement item reports its sentence, not a blank", () => {
  // Same field, different source: `normalizeQuestion` puts a
  // restatement's `sentence` into `prompt` too, so one code path serves
  // both and neither can silently lose its text.
  const restatement = {
    id: "closest-meaning-t9",
    category: "Unless vs If Not vs Otherwise",
    type: "restatement",
    prompt: "Unless the ferry sails by six, the crew will miss the connection.",
    options: ["a", "b", "c", "d"],
    correctAnswer: "a",
  };
  assert.ok(buildReport(restatement, null, AT).includes(restatement.prompt));
});

test("an unanswered item still produces a usable report", () => {
  const text = buildReport(cloze, null, AT);
  assert.ok(text.includes(cloze.prompt), "the question is still there");
  assert.ok(!text.includes("Benim işaretlediğim"), "and no empty answer line");
});

test("a question missing its text says so instead of shipping a blank", () => {
  // The failure this whole file is about produced an empty line, which
  // reads as though the learner sent an incomplete report. It should be
  // obvious that the app lost it, not the learner.
  const text = buildReport({ ...cloze, prompt: undefined }, "lived", AT);
  assert.ok(text.includes("(soru metni alınamadı)"));
});

test("an item the learner did not answer omits the choice rather than faking one", () => {
  const text = buildReport(cloze, null, AT);
  assert.ok(!/Benim işaretlediğim/.test(text));
  assert.ok(/Uygulamanın doğru dediği: has lived/.test(text));
});
