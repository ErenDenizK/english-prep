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
  checkOptionNotes,
  checkScenarioReuse,
  checkLessonGiveaway,
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
  assert.match(r.text, /also appears in the question's own text/);
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


/* ---- The checks are about the stem, not about a field name ----
 *
 * A restatement keeps its stem in `sentence` rather than `paragraph`.
 * Every check above works on whichever the item has, so a new item type
 * costs one helper rather than four scattered branches — and these tests
 * are what stops that quietly reverting.
 */

const restatement = (overrides = {}) => ({
  id: "r-1",
  type: "restatement",
  topicId: "r",
  file: "data/r/r.json",
  category: "Third Conditional",
  sentence: "If the shipment had left on Monday, it would already have reached the depot in Ankara.",
  options: [
    "The shipment did not leave on Monday, so it has not reached the depot yet.",
    "The shipment left on Monday and reached the depot as planned.",
    "The shipment will reach the depot if it leaves on Monday.",
    "The shipment reached the depot even though it left after Monday.",
  ],
  correctIndex: 0,
  explanation:
    "Üçüncü tip koşul cümlesi gerçekleşmemiş bir geçmişi anlatır; 'The shipment left on Monday' tam tersini söyler.",
  tip: "Third conditional gerçekleşmemiş bir geçmişi ve onun gerçekleşmemiş sonucunu anlatır.",
  ...overrides,
});

test("two restatements on the same stem are reported", () => {
  const r = report();
  checkNearDuplicates(r, [
    restatement({ id: "r-1" }),
    restatement({ id: "r-2", sentence: restatement().sentence.replace("Ankara", "Konya") }),
  ]);
  assert.match(r.text, /"r-1" and "r-2" share \d+% of their wording/);
});

test("a restatement's scenario is counted like any other", () => {
  const r = report();
  checkScenarioReuse(
    r,
    ["Monday", "Tuesday", "Wednesday", "Thursday"].map((day, index) =>
      restatement({
        id: `r-${index}`,
        sentence: `If the shipment had left on ${day}, the depot manager would already have signed for it.`,
      })
    )
  );
  assert.match(r.text, /builds its questions on one scenario/);
  assert.match(r.text, /shipment/);
});

test("a restatement whose answer is lifted from its own stem is reported", () => {
  const r = report();
  checkOptionForms(
    r,
    "where",
    restatement({
      options: [
        "the shipment had left on Monday",
        "The shipment left on Monday and reached the depot as planned.",
        "The shipment will reach the depot if it leaves on Monday.",
        "The shipment reached the depot even though it left after Monday.",
      ],
      correctIndex: 0,
    })
  );
  assert.match(r.text, /also appears in the question's own text/);
});

/* ---- optionNotes ----
 *
 * The field is keyed by option TEXT because the engine shuffles options
 * and scores against the answer string. That decision is only worth
 * anything if the key set is actually checked against the option set, so
 * these tests pin the three ways a note can be wrong: a key that is not
 * an option, a key that IS the answer, and an empty gloss.
 */

function noted(optionNotes) {
  return {
    id: "t1",
    category: "Present Simple vs Present Continuous",
    paragraph: "Every morning she ____ to the library before her first class begins.",
    options: ["goes", "is going", "has gone", "went"],
    correctIndex: 0,
    explanation: "x",
    optionNotes,
  };
}

test("a note keyed to something that is not an option is an error", () => {
  const r = report();
  checkOptionNotes(r, "t1", noted({ "is gone": "Böyle bir seçenek yok." }));
  assert.equal(r.errors.length, 1);
  assert.match(r.text, /not an option/);
});

test("a note on the correct answer is an error", () => {
  const r = report();
  checkOptionNotes(r, "t1", noted({ goes: "Doğru cevap bu." }));
  assert.equal(r.errors.length, 1);
  assert.match(r.text, /correct answer/);
});

test("an empty gloss is an error", () => {
  const r = report();
  checkOptionNotes(r, "t1", noted({ "is going": "   " }));
  assert.equal(r.errors.length, 1);
});

test("an over-long gloss warns but does not block", () => {
  const r = report();
  checkOptionNotes(r, "t1", noted({ "is going": "ç".repeat(161) }));
  assert.equal(r.errors.length, 0);
  assert.equal(r.warnings.length, 1);
  assert.match(r.text, /competes with the explanation/);
});

test("a partial set of notes on real wrong options is clean", () => {
  const r = report();
  checkOptionNotes(
    r,
    "t1",
    noted({
      "is going": "Şu an sürmekte olan bir eylem; burada tekrar eden bir alışkanlık var.",
      went: "Geçmişte bitmiş bir eylem.",
    })
  );
  assert.equal(r.errors.length, 0);
  assert.equal(r.warnings.length, 0);
});

test("no optionNotes at all is clean — the field is optional", () => {
  const r = report();
  const question = noted(undefined);
  delete question.optionNotes;
  checkOptionNotes(r, "t1", question);
  assert.equal(r.errors.length, 0);
  assert.equal(r.warnings.length, 0);
});

test("an array is rejected — a parallel list is exactly what this field is not", () => {
  const r = report();
  checkOptionNotes(r, "t1", noted(["a", "b", "c", "d"]));
  assert.equal(r.errors.length, 1);
  assert.match(r.text, /keyed by option text/);
});

/* ---- A question built on a sentence from its own lesson ----
   docs/agents/question-author.md's rule, which had been enforced for the
   intro screen since intros shipped and never for the lesson itself. The
   sufficiency pass of 2026-09-04 found the consequence across the three
   oldest topics; this is the check that stops it growing, plus a ratchet
   over the real corpus so the backlog can only shrink. */

test("a lesson example that is a question's keyed sentence is caught", () => {
  const found = report();
  checkLessonGiveaway(
    found,
    "data/x/x.json",
    {
      category: "C",
      blocks: [{ type: "examples", items: [{ sentence: "She had her hair cut before the wedding.", note: "n" }] }],
    },
    [
      {
        id: "x-t1",
        category: "C",
        paragraph: "She ____ her hair cut before the wedding.",
        options: ["had", "did", "made", "took"],
        correctIndex: 0,
      },
    ]
  );
  assert.equal(found.errors.length, 0, "it is a warning, not an error, while a backlog exists");
  assert.equal(found.warnings.length, 1);
  assert.match(found.warnings[0].message, /x-t1/);
});

test("a contraction does not hide the giveaway", () => {
  const found = report();
  checkLessonGiveaway(
    found,
    "data/x/x.json",
    { category: "C", blocks: [{ type: "pitfall", wrong: "w", right: "I have already finished the assignment.", why: "y" }] },
    [
      {
        id: "x-t1",
        category: "C",
        paragraph: "I've ____ finished the assignment.",
        options: ["already", "yet", "since", "ago"],
        correctIndex: 0,
      },
    ]
  );
  assert.equal(found.warnings.length, 1);
});

test("a shared frame without the key is not a giveaway", () => {
  const found = report();
  checkLessonGiveaway(
    found,
    "data/x/x.json",
    { category: "C", blocks: [{ type: "examples", items: [{ sentence: "Send it by the end of the week.", note: "n" }] }] },
    [
      {
        id: "x-t1",
        category: "C",
        paragraph: "The form ____ by the end of the week.",
        options: ["must be submitted", "must submit", "submits", "submitting"],
        correctIndex: 0,
      },
    ]
  );
  assert.equal(found.warnings.length, 0);
});

test("the corpus backlog only shrinks", async () => {
  // A ratchet. It was 32 when the check was written on 2026-09-04, and 1
  // by the end of the same night: three repair rounds cleared tenses,
  // modals and passive-voice, and the check itself grew to read `text`
  // block prose, which found one more. The second tenses repair cleared
  // that last one, so the backlog is 0 and any new warning is a defect.
  // Lower this number when it drops; the check becomes an error once the
  // corpus has held at zero long enough for that to be a safe default.
  const CEILING = 0;
  const { readFile } = await import("node:fs/promises");
  const manifest = JSON.parse(
    await readFile(new URL("../data/manifest.json", import.meta.url), "utf8")
  );
  const found = report();
  for (const topic of manifest.topics.filter((entry) => !entry.comingSoon)) {
    const data = JSON.parse(await readFile(new URL(`../${topic.file}`, import.meta.url), "utf8"));
    for (const lesson of data.lessons ?? []) {
      checkLessonGiveaway(
        found,
        topic.file,
        lesson,
        data.questions.filter((question) => question.category === lesson.category)
      );
    }
  }
  assert.ok(
    found.warnings.length <= CEILING,
    `${found.warnings.length} questions are built on a sentence from their own lesson, ` +
      `up from ${CEILING}. A new one is a defect; lower the ceiling when the count drops.`
  );
  assert.equal(found.errors.length, 0);
});
