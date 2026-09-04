// How much of the paper the app says it covers.
//
// The claim on the Profil screen used to be two section point totals in a
// sentence about coverage — "paragraf içindeki dilbilgisi ve kelime
// boşlukları (15 puan) ve anlamca en yakın cümle (15 puan)" — which reads
// as 30 of Session I's 60 when it means "these are the two sections it
// practises, some of the time". Meanwhile `exam-spec.md` still carried
// the ~7-of-100 table it shipped with at three topics.
//
// So the count is derived now, and these tests are about the derivation
// rather than the number: it has to move when a topic ships, it has to
// name what is missing, and it must never quietly over-report.

import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { CLOZE_BLANKS, clozeCoverage } from "../js/topics.js";

const manifest = JSON.parse(
  await readFile(new URL("../data/manifest.json", import.meta.url), "utf8")
);

test("the map is the sample passage: ten blanks", () => {
  assert.equal(CLOZE_BLANKS.length, 10);
});

test("two blanks are vocabulary, which no grammar topic can cover", () => {
  const vocabulary = CLOZE_BLANKS.filter((blank) => blank.topicId === null);
  assert.equal(vocabulary.length, 2);
});

test("nothing is covered by a topic that has not shipped", () => {
  const none = clozeCoverage([]);
  assert.equal(none.covered, 0);
  assert.equal(none.total, 10);
});

test("a coming-soon topic does not count as coverage", () => {
  const soon = clozeCoverage([{ id: "modals", comingSoon: true }]);
  assert.equal(soon.covered, 0);
});

test("two blanks test modals, so shipping one topic covers both", () => {
  const modals = clozeCoverage([{ id: "modals" }]);
  assert.equal(modals.covered, 2);
});

test("what is missing is named once, not once per blank", () => {
  const missing = clozeCoverage([]).missing;
  assert.equal(new Set(missing).size, missing.length);
  assert.ok(missing.includes("kelime bilgisi"));
});

test("against the real manifest: seven of ten, and the three left named", () => {
  const actual = clozeCoverage(manifest.topics);
  assert.equal(actual.covered, 7);
  assert.deepEqual(actual.missing, ["kelime bilgisi", "so / such"]);
});

test("coverage never exceeds the passage", () => {
  const doubled = clozeCoverage([...manifest.topics, ...manifest.topics]);
  assert.ok(doubled.covered <= doubled.total);
});
