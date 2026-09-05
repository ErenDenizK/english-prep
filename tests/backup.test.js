// Unit tests for backup merging.
//
// These carry more weight than most: a restore is the one operation in the
// app that can destroy something a learner cannot get back. Every test
// here is a way that could happen.

import test from "node:test";
import assert from "node:assert/strict";
import {
  mergeHistory,
  mergeLessonProgress,
  mergeSeenVersions,
  parseBackup,
  buildBackup,
  summariseRestore,
  BACKUP_VERSION,
} from "../js/backup.js";

const at = (date, questions = 1) => ({
  date,
  mode: "mixed",
  topicBreakdown: {},
  categoryBreakdown: {},
  questions: Array.from({ length: questions }, (_, i) => ({ id: `q${i}`, topicId: "t", correct: true })),
});

/* ---- History ---- */

test("merging histories keeps everything from both sides", () => {
  const mine = { attempts: [at("2026-01-01T00:00:00.000Z"), at("2026-03-01T00:00:00.000Z")] };
  const theirs = { attempts: [at("2026-02-01T00:00:00.000Z")] };

  assert.deepEqual(
    mergeHistory(mine, theirs).attempts.map((a) => a.date),
    [
      "2026-01-01T00:00:00.000Z",
      "2026-02-01T00:00:00.000Z",
      "2026-03-01T00:00:00.000Z",
    ],
    "and puts them in one timeline, not one device after the other"
  );
});

test("restoring the same backup twice does not duplicate anything", () => {
  const mine = { attempts: [at("2026-01-01T00:00:00.000Z")] };
  const once = mergeHistory(mine, mine);
  const twice = mergeHistory(once, mine);

  assert.equal(once.attempts.length, 1);
  assert.equal(twice.attempts.length, 1);
});

test("a restored copy never replaces the local original", () => {
  const local = { ...at("2026-01-01T00:00:00.000Z"), recorded: true };
  const stale = { ...at("2026-01-01T00:00:00.000Z") };

  const merged = mergeHistory({ attempts: [local] }, { attempts: [stale] });
  assert.equal(merged.attempts[0].recorded, true, "a field the local copy has is not dropped");
});

test("merging survives a missing, empty or malformed side", () => {
  const mine = { attempts: [at("2026-01-01T00:00:00.000Z")] };
  assert.equal(mergeHistory(mine, undefined).attempts.length, 1);
  assert.equal(mergeHistory(undefined, mine).attempts.length, 1);
  assert.equal(mergeHistory(mine, { attempts: [null, {}, at("x")] }).attempts.length, 2);
  assert.deepEqual(mergeHistory(undefined, undefined), { attempts: [] });
});

/* ---- Lesson progress ---- */

test("lesson progress takes the further of the two, and done is sticky", () => {
  const mine = { l1: { read: 0.8, done: false }, l2: { read: 1, done: true } };
  const theirs = { l1: { read: 0.3, done: true }, l2: { read: 0.2, done: false }, l3: { read: 0.5, done: false } };

  assert.deepEqual(mergeLessonProgress(mine, theirs), {
    l1: { read: 0.8, done: true },
    l2: { read: 1, done: true },
    l3: { read: 0.5, done: false },
  });
});

test("a lesson finished on the other device cannot be un-finished by this one", () => {
  const merged = mergeLessonProgress({ l1: { read: 0.1, done: false } }, { l1: { read: 0.1, done: true } });
  assert.equal(merged.l1.done, true);
});

test("malformed lesson entries are skipped rather than written through", () => {
  assert.deepEqual(mergeLessonProgress({ l1: "nope" }, { l2: { read: "x", done: 1 } }), {
    l2: { read: 0, done: false },
  });
});

test("the later timestamp wins, and two records without one stay without one", () => {
  const merged = mergeLessonProgress(
    { l1: { read: 0.5, done: false, at: 100 }, l2: { read: 1, done: true } },
    { l1: { read: 0.2, done: false, at: 900 }, l2: { read: 1, done: true } }
  );
  assert.equal(merged.l1.at, 900);
  // "Unknown" must survive a merge as unknown. Defaulting it to 0 or to
  // now would make a restore claim a date that never happened.
  assert.equal("at" in merged.l2, false);
});

/* ---- Seen versions ---- */

test("seen versions take the higher mark, and ignore nonsense", () => {
  assert.deepEqual(mergeSeenVersions({ tenses: 2 }, { tenses: 5, modals: 1, bad: "3" }), {
    tenses: 5,
    modals: 1,
  });
});

/* ---- Reading a file ---- */

test("a backup round-trips", () => {
  const state = { history: { attempts: [at("2026-01-01T00:00:00.000Z")] }, profileName: "Deniz" };
  const text = JSON.stringify(buildBackup(state));
  const result = parseBackup(text);

  assert.equal(result.ok, true);
  assert.equal(result.backup.version, BACKUP_VERSION);
  assert.equal(result.backup.data.profileName, "Deniz");
});

test("every way a paste can go wrong has its own reason", () => {
  assert.deepEqual(parseBackup("   "), { ok: false, reason: "empty" });
  assert.deepEqual(parseBackup(undefined), { ok: false, reason: "empty" });
  assert.deepEqual(parseBackup("{ this is not json"), { ok: false, reason: "unreadable" });
  assert.deepEqual(parseBackup('{"app":"something-else","data":{}}'), { ok: false, reason: "foreign" });
  assert.deepEqual(parseBackup('{"app":"english-prep"}'), { ok: false, reason: "foreign" });
  assert.deepEqual(
    parseBackup(JSON.stringify({ app: "english-prep", version: BACKUP_VERSION + 1, data: {} })),
    { ok: false, reason: "newer" },
    "a file from a newer build is refused rather than silently truncated"
  );
});

test("a truncated paste is refused, not half-applied", () => {
  const full = JSON.stringify(buildBackup({ history: { attempts: [at("2026-01-01T00:00:00.000Z")] } }));
  assert.deepEqual(parseBackup(full.slice(0, full.length - 20)), { ok: false, reason: "unreadable" });
});

/* ---- Telling the learner what will happen ---- */

test("the preview counts what would be added, not what exists", () => {
  const mine = { attempts: [at("2026-01-01T00:00:00.000Z", 5)] };
  const theirs = {
    attempts: [at("2026-01-01T00:00:00.000Z", 5), at("2026-02-01T00:00:00.000Z", 10)],
  };

  assert.deepEqual(
    summariseRestore(mine, theirs, { l1: { read: 0.5, done: false } }, { l1: { read: 0.9, done: false }, l2: { read: 0.2, done: false } }),
    { newAttempts: 1, newQuestions: 10, advancedLessons: 2 }
  );
});

test("restoring a backup you already have promises nothing", () => {
  const mine = { attempts: [at("2026-01-01T00:00:00.000Z", 5)] };
  const lessons = { l1: { read: 0.5, done: true } };

  assert.deepEqual(summariseRestore(mine, mine, lessons, lessons), {
    newAttempts: 0,
    newQuestions: 0,
    advancedLessons: 0,
  });
});
