// Unit tests for the four content checks.
//
// These exist because the checks are thresholded, and a threshold nobody
// tests is a threshold that quietly stops firing. Each test plants exactly
// one defect and asserts it is caught; each has a companion asserting that
// the clean version is left alone. False positives matter as much as
// misses here — a validator that cries wolf is one people stop reading,
// which is the same failure the reviewer brief is built around.

import test from "node:test";
import assert from "node:assert/strict";
import {
  checkExplanationsNameDistractors,
  checkNearDuplicates,
  checkOptionForms,
  checkScenarioReuse,
} from "../tools/content-checks.mjs";

/** A stand-in for the validator's Report. */
function report() {
  const errors = [];
  const warnings = [];
  return {
    errors,
    warnings,
    error: (where, message) => errors.push({ where, message }),
    warn: (where, message) => warnings.push({ where, message }),
    get text() {
      return [...errors, ...warnings].map((entry) => entry.message).join("\n");
    },
  };
}

const question = (overrides = {}) => ({
  id: "t-1",
  topicId: "t",
  file: "data/t/t.json",
  category: "A vs B",
  paragraph:
    "The council announced the decision on Tuesday, and by Friday almost nobody in the neighbourhood ____ about it.",
  options: ["knew", "has known", "was knowing", "knows"],
  correctIndex: 0,
  explanation: "Geçmişte kapanmış bir zaman aralığı olduğu için Past Simple kullanılır; 'has known' burada olmaz.",
  tip: "Belirli geçmiş zaman ifadeleriyle Present Perfect kullanılmaz.",
  ...overrides,
});

/* ---- 1 · the explanation must name a distractor ---- */

test("an explanation that names a wrong option passes", () => {
  const r = report();
  checkExplanationsNameDistractors(r, "data/t/t.json", [question()]);
  assert.equal(r.warnings.length, 0);
});

test("an explanation that only argues for the key is reported", () => {
  const r = report();
  checkExplanationsNameDistractors(r, "data/t/t.json", [
    question({ explanation: "Geçmişte kapanmış bir zaman aralığı olduğu için Past Simple kullanılır." }),
  ]);
  assert.equal(r.warnings.length, 1);
  assert.match(r.text, /never name a wrong option/);
  assert.match(r.text, /t-1/);
});

test("the report rolls the ids into one warning rather than one each", () => {
  const r = report();
  const silent = { explanation: "Sadece doğru şıkkı savunan bir açıklama." };
  checkExplanationsNameDistractors(r, "data/t/t.json", [
    question({ id: "t-1", ...silent }),
    question({ id: "t-2", ...silent }),
    question({ id: "t-3", ...silent }),
  ]);
  assert.equal(r.warnings.length, 1);
  assert.match(r.text, /3 of 3/);
});

/* ---- 2 · banned option forms ---- */

test("an invented -ed past of an irregular verb is an error", () => {
  const r = report();
  checkOptionForms(r, "where", question({ options: ["leaves", "will leave", "is leaving", "leaved"] }));
  assert.equal(r.errors.length, 1);
  assert.match(r.text, /"leaved", which is not an English word/);
});

test("the doubled-consonant spelling of the same error is caught", () => {
  const r = report();
  checkOptionForms(r, "where", question({ options: ["ran", "runned", "has run", "was running"] }));
  assert.equal(r.errors.length, 1);
  assert.match(r.text, /runned/);
});

test("a real -ed verb that happens to share a stem with an irregular is left alone", () => {
  const r = report();
  // "founded" is the past of "found" (to establish), not an invented past
  // of "find" — and "hanged" and "lied" are the same trap.
  checkOptionForms(
    r,
    "where",
    question({ options: ["founded", "hanged", "lied", "answered"], correctIndex: 0 })
  );
  assert.equal(r.errors.length, 0);
});

test("two options differing only in case or spacing are reported", () => {
  const r = report();
  checkOptionForms(r, "where", question({ options: ["had better", "Had  better", "should", "ought to"] }));
  assert.equal(r.warnings.length, 1);
  assert.match(r.text, /the same once case and spacing are ignored/);
});

test("the correct answer appearing in the paragraph is reported", () => {
  const r = report();
  checkOptionForms(
    r,
    "where",
    question({
      paragraph: "She has been writing all morning, and she ____ since breakfast without a single break.",
      options: ["has been writing", "wrote", "writes", "had written"],
      correctIndex: 0,
    })
  );
  assert.equal(r.warnings.length, 1);
  assert.match(r.text, /also appears in the paragraph/);
});

test("a single-word answer recurring in the paragraph is not reported", () => {
  // One word is too weak a signal: "knew" turning up elsewhere in a
  // hundred-word paragraph is coincidence, not a giveaway.
  const r = report();
  checkOptionForms(
    r,
    "where",
    question({ paragraph: "Nobody knew the rule, and by Friday almost nobody ____ about the change either." })
  );
  assert.equal(r.warnings.length, 0);
});

/* ---- 3 · near-duplicate stems ---- */

test("two questions built on the same scenario are reported", () => {
  const stem =
    "The council announced the decision on Tuesday, and by Friday almost nobody in the neighbourhood ____ about it.";
  const r = report();
  checkNearDuplicates(r, [
    question({ id: "t-1", paragraph: stem }),
    question({ id: "t-2", paragraph: stem.replace("Friday", "Saturday") }),
  ]);
  assert.match(r.text, /"t-1" and "t-2" share \d+% of their wording/);
});

test("two unrelated questions are not reported", () => {
  const r = report();
  checkNearDuplicates(r, [
    question({ id: "t-1" }),
    question({
      id: "t-2",
      paragraph: "Fresh bread ____ every morning at this bakery, using a recipe three generations old.",
      options: ["is baked", "was baked", "has been baked", "is being baked"],
    }),
  ]);
  assert.equal(r.warnings.length, 0);
});

test("an identical option set inside one category is reported", () => {
  const r = report();
  checkNearDuplicates(r, [
    question({ id: "t-1", paragraph: "One entirely separate sentence about a bakery and its ____ ovens." }),
    question({
      id: "t-2",
      paragraph: "Another quite different sentence concerning a railway timetable and its ____ platforms.",
      options: ["knows", "knew", "was knowing", "has known"],
    }),
  ]);
  assert.match(r.text, /offer an identical set of options within "A vs B"/);
});

test("an identical option set across two categories is not reported", () => {
  const r = report();
  checkNearDuplicates(r, [
    question({ id: "t-1", paragraph: "One entirely separate sentence about a bakery and its ____ ovens." }),
    question({
      id: "t-2",
      category: "C vs D",
      paragraph: "Another quite different sentence concerning a railway timetable and its ____ platforms.",
      options: ["knows", "knew", "was knowing", "has known"],
    }),
  ]);
  assert.equal(r.warnings.length, 0);
});

/* ---- 4 · scenario over-use ---- */

test("a category whose questions all share a setting is reported", () => {
  const r = report();
  checkScenarioReuse(
    r,
    ["Monday", "Tuesday", "Wednesday", "Thursday"].map((day, index) =>
      question({
        id: `t-${index}`,
        paragraph: `On ${day} the professor reminded the seminar that the assignment ____ before the deadline.`,
      })
    )
  );
  assert.match(r.text, /builds its questions on one scenario/);
  assert.match(r.text, /professor/);
});

test("a category with varied settings is not reported", () => {
  const r = report();
  checkScenarioReuse(r, [
    question({ id: "t-1", paragraph: "The bakery on the corner ____ its bread before sunrise every day." }),
    question({ id: "t-2", paragraph: "Rescue teams ____ the northern trail long after the storm passed." }),
    question({ id: "t-3", paragraph: "My cousin ____ the ferry timetable before booking anything at all." }),
    question({ id: "t-4", paragraph: "Nobody ____ the announcement, so the platform stayed completely empty." }),
  ]);
  assert.equal(r.warnings.length, 0);
});

test("a category too small to mean anything is skipped", () => {
  const r = report();
  checkScenarioReuse(r, [
    question({ id: "t-1", paragraph: "On Monday the professor reminded the seminar the assignment ____ soon." }),
    question({ id: "t-2", paragraph: "On Tuesday the professor reminded the seminar the assignment ____ soon." }),
  ]);
  assert.equal(r.warnings.length, 0);
});

test("grammar vocabulary is not counted as a scenario", () => {
  // "would" across a modals category is the topic, not a rut, and a check
  // that reported it would be switched off within a week.
  const r = report();
  checkScenarioReuse(r, [
    question({ id: "t-1", paragraph: "The baker would never ____ dough that had been left out overnight." }),
    question({ id: "t-2", paragraph: "Rescue teams would ____ the northern ridge before any storm arrived." }),
    question({ id: "t-3", paragraph: "A ferry timetable would ____ nothing about the weather on the crossing." }),
    question({ id: "t-4", paragraph: "Nobody at the courthouse would ____ a verdict before the jury returned." }),
  ]);
  assert.equal(r.warnings.length, 0);
});
