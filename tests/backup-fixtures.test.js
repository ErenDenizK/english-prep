// Golden backups: files written by older builds, kept byte for byte, so a
// cleanup of storage.js can never stop a learner restoring what they saved.
// "Never lose learner data" (CLAUDE.md, hard rules): the v1 backup format
// and the old fields (examDate, dailyGoal, devNoteDismissed, attempts with
// no id, category or answer time) stay readable.
//
//   backup-v1-first.json   the first export (v0.2x): no settings, no exam
//                          date, an attempt from before categories existed
//   backup-v1-ui3.json     the UI 3 era (v0.62): settings, examDate,
//                          dailyGoal, lesson timestamps, chosen options
//   backup-v1-resume.json  resumable sessions: attempt ids, partial,
//                          per-answer answeredAt, a null exam date

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const entries = new Map();
globalThis.localStorage = {
  getItem: (key) => (entries.has(key) ? entries.get(key) : null),
  setItem: (key, value) => entries.set(key, String(value)),
  removeItem: (key) => entries.delete(key),
};
const storage = await import("../js/storage.js");
const { parseBackup, buildBackup, mergeLessonProgress } = await import("../js/backup.js");

const FIXTURES = ["backup-v1-first", "backup-v1-ui3", "backup-v1-resume"];
const fixture = (name) => readFileSync(new URL(`./fixtures/${name}.json`, import.meta.url), "utf8");

test.beforeEach(() => entries.clear());

for (const name of FIXTURES) {
  test(`${name}: restores onto a fresh device with nothing lost`, () => {
    const parsed = parseBackup(fixture(name));
    assert.equal(parsed.ok, true);
    const theirs = parsed.backup.data;

    const result = storage.importState(parsed.backup);
    assert.equal(result.ok, true);
    assert.equal(result.newAttempts, theirs.history.attempts.length);

    const sorted = [...theirs.history.attempts].sort((a, b) => a.date.localeCompare(b.date));
    // Stored exactly as saved; getHistory() only adds read-time defaults.
    assert.deepEqual(JSON.parse(entries.get("englishPrep.history")).attempts, sorted);
    assert.equal(storage.getHistory().length, sorted.length);
    assert.deepEqual(storage.getAllLessonProgress(), mergeLessonProgress({}, theirs.lessonProgress));

    const state = storage.exportState();
    assert.deepEqual(state.seenVersions, theirs.seenVersions);
    assert.equal(state.profileName, theirs.profileName);
    assert.deepEqual(state.settings, theirs.settings ?? {});
    // Read for backup compatibility: no screen shows them, but a file that
    // carries them must hand them on to the next export.
    assert.equal(state.examDate, theirs.examDate ?? null);
    assert.equal(state.dailyGoal, theirs.dailyGoal ?? storage.DAILY_GOAL_DEFAULT);

    // Every reader copes with the oldest shapes.
    assert.ok(storage.getOverallStats().totalQuestions > 0);
    assert.ok(Object.keys(storage.getItemStats()).length > 0);
    assert.ok(Array.isArray(storage.getMistakeBook()));
    assert.ok(Array.isArray(storage.getWeakCategories()));
  });

  test(`${name}: export, restore elsewhere and export again is the identity`, () => {
    storage.importState(parseBackup(fixture(name)).backup);
    const first = storage.exportState();

    const text = JSON.stringify(buildBackup(first));
    entries.clear();
    const again = parseBackup(text);
    assert.equal(again.ok, true);
    assert.equal(storage.importState(again.backup).ok, true);
    assert.deepEqual(storage.exportState(), first);

    // A second restore of the same file adds nothing.
    const repeat = storage.importState(again.backup);
    assert.equal(repeat.ok, true);
    assert.equal(repeat.newAttempts, 0);
    assert.equal(repeat.newQuestions, 0);
    assert.equal(repeat.advancedLessons, 0);
    assert.equal(repeat.preferencesChanged, false);
  });
}

test("old storage keys on the device survive a restore, and its own choices win", () => {
  entries.set("englishPrep.devNoteDismissed", "1");
  entries.set("englishPrep.onboarded", "1");
  entries.set("englishPrep.backupNudgeDismissed", "1");
  entries.set("englishPrep.examDate", "2027-01-10");
  entries.set("englishPrep.dailyGoal", "5");
  entries.set("englishPrep.profileName", "Deniz");

  const result = storage.importState(parseBackup(fixture("backup-v1-ui3")).backup);
  assert.equal(result.ok, true);

  assert.equal(entries.get("englishPrep.devNoteDismissed"), "1");
  assert.equal(entries.get("englishPrep.onboarded"), "1");
  assert.equal(entries.get("englishPrep.backupNudgeDismissed"), "1");
  assert.equal(storage.getExamDate(), "2027-01-10", "the device being held wins");
  assert.equal(storage.getDailyGoal(), 5);
  assert.equal(storage.getProfileName(), "Deniz");
  assert.equal(storage.shouldOfferBackup(), false);
});

test("a first-era file's devNoteDismissed is accepted and not written back", () => {
  storage.importState(parseBackup(fixture("backup-v1-first")).backup);
  assert.equal(entries.has("englishPrep.devNoteDismissed"), false);
  assert.equal("devNoteDismissed" in storage.exportState(), false);
});
