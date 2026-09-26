// The solve tool's two pure parts: which items a session puts in front of
// the solver, and what the log says afterwards. The interactive loop is
// not tested here — it is a person at a keyboard, and the thing worth
// protecting is the selection and the ledger.

import { test } from "node:test";
import assert from "node:assert/strict";

import { selectItems, report } from "../tools/solve.mjs";

const corpus = [
  { id: "a1", topicId: "alpha", category: "One" },
  { id: "a2", topicId: "alpha", category: "One" },
  { id: "a3", topicId: "alpha", category: "Two" },
  { id: "b1", topicId: "beta", category: "Three" },
];

const entry = (id, over = {}) => ({
  id,
  topicId: "alpha",
  solver: "deniz",
  date: "2026-09-06T00:00:00.000Z",
  chose: "x",
  key: "x",
  agreed: true,
  flagged: false,
  ...over,
});

test("selection", async (t) => {
  await t.test("skips what this solver has already solved", () => {
    const picked = selectItems(corpus, [entry("a1"), entry("a2")], {
      solver: "deniz",
      count: 10,
    });
    assert.deepEqual(
      picked.map((q) => q.id).sort(),
      ["a3", "b1"]
    );
  });

  await t.test("another solver's work does not count as this one's", () => {
    // Two people solving the same item independently is the point, not a
    // duplicate — an item both agree on is much better evidence than an
    // item one person agreed with.
    const picked = selectItems(corpus, [entry("a1", { solver: "doruk" })], {
      solver: "deniz",
      count: 10,
    });
    assert.equal(picked.length, 4);
  });

  await t.test("--all reopens solved items", () => {
    const picked = selectItems(corpus, [entry("a1"), entry("a2"), entry("a3"), entry("b1")], {
      solver: "deniz",
      all: true,
      count: 10,
    });
    assert.equal(picked.length, 4);
  });

  await t.test("scopes to a topic and to a category", () => {
    assert.deepEqual(
      selectItems(corpus, [], { topic: "beta", count: 10 }).map((q) => q.id),
      ["b1"]
    );
    assert.deepEqual(
      selectItems(corpus, [], { category: "One", count: 10 })
        .map((q) => q.id)
        .sort(),
      ["a1", "a2"]
    );
  });

  await t.test("honours the count", () => {
    assert.equal(selectItems(corpus, [], { count: 2 }).length, 2);
  });

  await t.test("asking for more than exists returns what exists", () => {
    assert.equal(selectItems(corpus, [], { count: 99 }).length, 4);
  });
});

test("the ledger", async (t) => {
  await t.test("counts an item once however many times it was solved", () => {
    const rep = report(corpus, [
      entry("a1", { date: "2026-09-06T00:00:00.000Z" }),
      entry("a1", { date: "2026-09-06T01:00:00.000Z" }),
    ]);
    assert.equal(rep.solved, 1);
    assert.equal(rep.remaining, 3);
  });

  await t.test("the latest solve wins, so a re-solve can clear a finding", () => {
    const rep = report(corpus, [
      entry("a1", { date: "2026-09-06T00:00:00.000Z", agreed: false, chose: "y" }),
      entry("a1", { date: "2026-09-06T02:00:00.000Z", agreed: true }),
    ]);
    assert.equal(rep.disagreed.length, 0);
    assert.equal(rep.bySolver.deniz.agreed, 1);
  });

  await t.test("two solvers on one item are two rows, one solved item", () => {
    const rep = report(corpus, [entry("a1"), entry("a1", { solver: "doruk", agreed: false })]);
    assert.equal(rep.solved, 1);
    assert.equal(rep.bySolver.deniz.solved, 1);
    assert.equal(rep.bySolver.doruk.solved, 1);
    assert.equal(rep.disagreed.length, 1);
  });

  await t.test("a flag on an agreed item is still reported", () => {
    // The whole reason the flag exists: the solver got it right and still
    // thinks another option is defensible. A score would discard this.
    const rep = report(corpus, [entry("a1", { agreed: true, flagged: true })]);
    assert.equal(rep.disagreed.length, 0);
    assert.equal(rep.flagged.length, 1);
    assert.equal(rep.flagged[0].id, "a1");
  });

  await t.test("remaining hours follow the item cost", () => {
    const rep = report(corpus, []);
    assert.equal(rep.remaining, 4);
    assert.equal(rep.remainingHours.toFixed(2), ((4 * 7) / 60).toFixed(2));
  });

  await t.test("an empty log reports the whole corpus as owing", () => {
    const rep = report(corpus, []);
    assert.equal(rep.solved, 0);
    assert.deepEqual(rep.bySolver, {});
  });
});
