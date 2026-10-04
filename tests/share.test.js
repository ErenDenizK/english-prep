import test from "node:test";
import assert from "node:assert/strict";
import { parseBackup, BACKUP_VERSION } from "../js/backup.js";
import {
  prepareBackupTransfer, backupFile, canShareBackup, shareBackupFile, copyBackupText,
} from "../js/share.js";

test("reviewed transfer keeps the complete restore contract and freezes the exported snapshot", async () => {
  const state = {
    history: { attempts: [{ date: "2026-10-01T10:00:00Z", questions: [{ id: "q1", correct: false }] }] },
    lessonProgress: { one: { read: 0.45, done: false }, two: { read: 1, done: true } },
    profileName: "İrem", settings: { thinkFirst: true }, seenVersions: { tenses: 2 },
    examDate: "2027-01-01", dailyGoal: 10,
  };
  const original = structuredClone(state);
  const transfer = prepareBackupTransfer(state);
  state.profileName = "Changed after preview";
  state.history.attempts[0].questions.push({ id: "q2" });
  const parsed = parseBackup(transfer.json);
  assert.equal(parsed.ok, true);
  assert.equal(parsed.backup.version, BACKUP_VERSION);
  assert.deepEqual(parsed.backup.data, original);
  assert.deepEqual([transfer.summary.attempts, transfer.summary.answers, transfer.summary.lessons, transfer.summary.completed], [1, 1, 2, 1]);
  assert.equal(transfer.summary.bytes, Buffer.byteLength(transfer.json, "utf8"));
  const file = backupFile(transfer);
  assert.equal(file.type, "application/json");
  assert.match(file.name, /^english-prep-\d{4}-\d{2}-\d{2}\.json$/);
  assert.equal(await file.text(), transfer.json);
});

test("capability checks validate files and handle blocked platform policy", () => {
  const file = backupFile(prepareBackupTransfer({}));
  let checked;
  assert.equal(canShareBackup(file, { share() {}, canShare(data) { checked = data; return true; } }), true);
  assert.deepEqual(checked, { files: [file] });
  assert.equal(canShareBackup(file, { share() {}, canShare() { throw new Error("blocked"); } }), false);
  assert.equal(canShareBackup(file, { canShare: () => true }), false);
});

test("canceling native sharing neither retries nor falls through to another channel", async () => {
  const file = backupFile(prepareBackupTransfer({}));
  let calls = 0;
  const result = await shareBackupFile(file, {
    canShare: () => true,
    async share() { calls += 1; throw new DOMException("dismissed", "AbortError"); },
    clipboard: { writeText() { assert.fail("sharing must not silently copy"); } },
  });
  assert.equal(result, "canceled");
  assert.equal(calls, 1);
});

test("sharing separates unsupported, failed and OS handoff outcomes without claiming delivery", async () => {
  const file = backupFile(prepareBackupTransfer({}));
  assert.equal(await shareBackupFile(file, {}), "unsupported");
  assert.equal(await shareBackupFile(file, { canShare: () => true, async share() { throw new Error("unavailable"); } }), "failed");
  let sent;
  assert.equal(await shareBackupFile(file, { canShare: () => true, async share(data) { sent = data; } }), "handed-off");
  assert.equal(sent.files[0], file);
  assert.equal("url" in sent, false);
  assert.equal("text" in sent, false);
});

test("clipboard denial keeps manual transfer available and successful copy contains exact backup", async () => {
  const { json } = prepareBackupTransfer({ profileName: "Ada" });
  let actual;
  assert.equal(await copyBackupText(json, { clipboard: { async writeText(value) { actual = value; } } }), "copied");
  assert.equal(actual, json);
  assert.equal(await copyBackupText(json, {}), "manual");
  assert.equal(await copyBackupText(json, { clipboard: { async writeText() { throw new Error("denied"); } } }), "manual");
});
