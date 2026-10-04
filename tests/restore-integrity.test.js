import test from "node:test";
import assert from "node:assert/strict";
import { buildBackup } from "../js/backup.js";
import { exportState, importState } from "../js/storage.js";
import { createRestoreDialog, describeRestore, downloadBackup } from "../js/backup-ui.js";

const key = (name) => `englishPrep.${name}`;
let entries;
let reads;
let writes;
let failRead;
let failWrite;

test.beforeEach(() => {
  entries = new Map();
  reads = 0;
  writes = [];
  failRead = () => false;
  failWrite = () => false;
  globalThis.localStorage = {
    getItem(name) {
      reads += 1;
      if (failRead(name, reads)) throw new DOMException("Storage blocked", "SecurityError");
      return entries.get(name) ?? null;
    },
    setItem(name, value) {
      writes.push([name, String(value)]);
      if (failWrite(name, String(value))) throw new DOMException("Storage full", "QuotaExceededError");
      entries.set(name, String(value));
    },
    removeItem(name) { entries.delete(name); },
  };
});

const save = (name, value) => entries.set(key(name), JSON.stringify(value));
const read = (name) => JSON.parse(entries.get(key(name)));
const answer = (id, correct = true) => ({ id, topicId: "tenses", category: "Past", selected: 0, correct });
const attempt = (id, questions, date = "2026-10-01T12:00:00.000Z") => ({ id, date, mode: "topic", questions });

test("restore advances valid session prefixes, merges lessons and preserves explicit preferences", () => {
  const first = answer("q1");
  const partial = attempt("session-1", [first]);
  save("history", { attempts: [partial] });
  save("lessonProgress", { "lesson-1": { read: 0.8, done: true, at: 10 } });
  save("seenVersions", { tenses: 3 });
  save("settings", { theme: "dark", fontSize: "large" });
  entries.set(key("profileName"), "Local name");
  entries.set(key("examDate"), "2026-11-02");
  entries.set(key("dailyGoal"), "10");

  const result = importState(buildBackup({
    history: { attempts: [attempt("session-1", [first, answer("q2", false)]),
      attempt("session-2", [answer("q3")], "2026-10-02T12:00:00.000Z")] },
    lessonProgress: { "lesson-1": { read: 0.5, done: false, at: 20 }, "lesson-2": { read: 0.4 } },
    seenVersions: { tenses: 2, modals: 1 },
    settings: { theme: "light", fontSize: "small", contrast: "high" },
    profileName: "Backup name", examDate: "2027-01-01", dailyGoal: 20,
  }));

  assert.deepEqual(result, { ok: true, newAttempts: 1, newQuestions: 2, advancedLessons: 1, preferencesChanged: true });
  assert.deepEqual(read("history").attempts.map((item) => item.questions.length), [2, 1]);
  assert.deepEqual(read("lessonProgress"), {
    "lesson-1": { read: 0.8, done: true, at: 20 }, "lesson-2": { read: 0.4, done: false },
  });
  assert.deepEqual(read("seenVersions"), { tenses: 3, modals: 1 });
  assert.deepEqual(read("settings"), { theme: "dark", fontSize: "large", contrast: "high" });
  assert.equal(entries.get(key("profileName")), "Local name");
  assert.equal(entries.get(key("examDate")), "2026-11-02");
  assert.equal(entries.get(key("dailyGoal")), "10");
});

test("restore fills missing preferences including daily goal without changing backup version", () => {
  const backup = buildBackup({ profileName: "Ada", examDate: "2026-12-01", dailyGoal: 20 });
  assert.equal(backup.version, 1);
  assert.equal(importState(backup).ok, true);
  assert.equal(exportState().dailyGoal, 20);
  assert.equal(entries.get(key("profileName")), "Ada");
  assert.equal(entries.get(key("examDate")), "2026-12-01");
  assert.equal(entries.has(key("history")), false, "older omitted fields stay omitted");
  assert.match(describeRestore({ newAttempts: 0, newQuestions: 0, advancedLessons: 0, preferencesChanged: true }), /Profil tercihlerin/);

  entries.set(key("dailyGoal"), "invalid");
  assert.equal(importState(buildBackup({ dailyGoal: 5 })).ok, true);
  assert.equal(exportState().dailyGoal, 5);
  importState(buildBackup({ dailyGoal: 99 }));
  assert.equal(exportState().dailyGoal, 5);
});

test("a quota failure after two writes restores exact prior raw values and removes newly created keys", () => {
  entries.set(key("history"), '{ "attempts" : [] }');
  save("seenVersions", { tenses: 1 });
  entries.set("another-app.setting", "untouched");
  const before = new Map(entries);
  failWrite = (name) => name === key("seenVersions");

  const result = importState(buildBackup({
    history: { attempts: [attempt("new", [answer("q1")])] },
    lessonProgress: { "lesson-1": { read: 0.5 } }, seenVersions: { tenses: 2 },
  }));

  assert.deepEqual(result, { ok: false, reason: "storage", rollbackFailed: false });
  assert.deepEqual(entries, before);
  assert.equal(writes.length, 4, "history and lesson, failed mark, then exact history rollback");
});

test("denied initial reads cause zero writes rather than merging into empty fallbacks", () => {
  save("history", { attempts: [attempt("local", [answer("local-q")])] });
  const before = new Map(entries);
  failRead = () => true;
  const result = importState(buildBackup({ history: { attempts: [attempt("remote", [answer("remote-q")])] } }));
  assert.deepEqual(result, { ok: false, reason: "storage", rollbackFailed: false });
  assert.equal(writes.length, 0);
  assert.deepEqual(entries, before);
});

test("an unchanged restore succeeds without writes even when storage is full", () => {
  save("history", { attempts: [attempt("local", [answer("q1")])] });
  save("lessonProgress", { "lesson-1": { read: 0.5, done: false } });
  save("seenVersions", { tenses: 2 });
  save("settings", { theme: "dark" });
  entries.set(key("profileName"), "Ada");
  entries.set(key("examDate"), "2026-12-01");
  entries.set(key("dailyGoal"), "10");
  const backup = buildBackup(exportState());
  const before = new Map(entries);
  failWrite = () => true;

  assert.deepEqual(importState(backup), {
    ok: true, newAttempts: 0, newQuestions: 0, advancedLessons: 0, preferencesChanged: false,
  });
  assert.equal(writes.length, 0);
  assert.deepEqual(entries, before);
});

test("a failed rollback is reported and never claims a complete restore", () => {
  const local = attempt("local", [answer("local-q")]);
  const remote = attempt("remote", [answer("remote-q")]);
  save("history", { attempts: [local] });
  const originalHistory = entries.get(key("history"));
  failWrite = (name, value) => name === key("lessonProgress")
    || (name === key("history") && value === originalHistory);

  const result = importState(buildBackup({
    history: { attempts: [remote] }, lessonProgress: { "lesson-1": { read: 0.4 } },
  }));

  assert.deepEqual(result, { ok: false, reason: "storage", rollbackFailed: true });
  assert.deepEqual(read("history").attempts, [local, remote], "the learner's existing answer remains present");
  assert.equal(entries.has(key("lessonProgress")), false);
});

test("malformed payloads and serialization failures fail before mutating anything", () => {
  for (const data of [null, [], { history: { attempts: {} } }, { lessonProgress: [] }, { settings: "bad" }]) {
    assert.deepEqual(importState({ data }), { ok: false, reason: "invalid", rollbackFailed: false });
  }
  const cyclic = {};
  cyclic.self = cyclic;
  assert.deepEqual(importState({ data: { history: { attempts: [] }, settings: cyclic } }), {
    ok: false, reason: "invalid", rollbackFailed: false,
  });
  assert.equal(writes.length, 0);
});

test("the result describes restored answers when an existing session advances", () => {
  const first = answer("q1");
  save("history", { attempts: [attempt("same-session", [first])] });
  const result = importState(buildBackup({ history: {
    attempts: [attempt("same-session", [first, answer("q2")])],
  } }));
  assert.equal(result.ok, true);
  assert.equal(result.newAttempts, 0);
  assert.equal(result.newQuestions, 1);
  assert.equal(describeRestore(result), "1 soru yanıtı eklendi.");
});

test("distinct stable sessions created at the same timestamp are counted separately", () => {
  save("history", { attempts: [attempt("session-1", [answer("q1")])] });
  const result = importState(buildBackup({ history: { attempts: [attempt("session-2", [answer("q2")])] } }));
  assert.equal(result.newAttempts, 1);
  assert.equal(result.newQuestions, 1);
});

function restoreDialog() {
  const ids = ["restore-dialog", "restore-dialog-title", "restore-dialog-text", "restore-input", "restore-file",
    "restore-text", "restore-message", "restore-cancel", "restore-confirm"];
  const nodes = Object.fromEntries(ids.map((id) => {
    const listeners = new Map();
    return [id, {
      value: "", textContent: "", hidden: false, disabled: false, open: false, scrollTop: 80,
      addEventListener(type, fn) { listeners.set(type, [...(listeners.get(type) ?? []), fn]); },
      async emit(type, event = {}) {
        await Promise.all((listeners.get(type) ?? []).map((fn) => fn(event)));
      },
      showModal() { this.open = true; },
      close() { this.open = false; void this.emit("close"); },
      focus(options) { this.focusOptions = options; },
      // This fixture exercises restore persistence, not visual choreography.
      // The real dialog's headings/actions are covered in browser tests.
      querySelector() { return null; },
      querySelectorAll() { return []; },
    }];
  }));
  globalThis.document = { getElementById: (id) => nodes[id] };
  const restored = [];
  const control = createRestoreDialog({ onRestored: (summary) => restored.push(summary) });
  return { nodes, restored, control };
}

test("the restore dialog keeps a failed backup ready and only announces success after retry persists it", async () => {
  const { nodes, restored, control } = restoreDialog();
  const dialog = nodes["restore-dialog"];
  const confirm = nodes["restore-confirm"];
  control.open();
  assert.equal(dialog.scrollTop, 0);
  assert.equal(nodes["restore-dialog-title"].tabIndex, -1);
  assert.deepEqual(nodes["restore-dialog-title"].focusOptions, { preventScroll: true });
  assert.equal(nodes["restore-cancel"].focusOptions, undefined);
  nodes["restore-text"].value = JSON.stringify(buildBackup({ dailyGoal: 20 }));
  await confirm.emit("click");
  assert.equal(nodes["restore-input"].hidden, true);
  failWrite = () => true;
  await confirm.emit("click");
  assert.equal(dialog.open, true);
  assert.equal(restored.length, 0);
  assert.equal(confirm.textContent, "Tekrar dene");
  assert.match(nodes["restore-message"].textContent, /depolama iznini ve boş alanı/);
  assert.equal(nodes["restore-input"].hidden, true);

  failWrite = () => false;
  await confirm.emit("click");
  assert.equal(dialog.open, false);
  assert.equal(restored.length, 1);
  assert.equal(restored[0].ok, true);
  assert.equal(entries.get(key("dailyGoal")), "20");
});

test("a stale file read cannot repopulate a reopened dialog", async () => {
  const { nodes, control } = restoreDialog();
  let finish;
  control.open();
  nodes["restore-file"].files = [{ name: "old.json", text: () => new Promise((resolve) => { finish = resolve; }) }];
  const reading = nodes["restore-file"].emit("change");
  assert.equal(nodes["restore-confirm"].disabled, true);
  nodes["restore-dialog"].close();
  control.open();
  finish("old contents");
  await reading;
  assert.equal(nodes["restore-text"].value, "");
  assert.equal(nodes["restore-message"].textContent, "");
  assert.equal(nodes["restore-confirm"].disabled, false);
});

test("pasted content wins over an older asynchronous file read", async () => {
  const { nodes, control } = restoreDialog();
  let finish;
  control.open();
  nodes["restore-file"].files = [{ name: "old.json", text: () => new Promise((resolve) => { finish = resolve; }) }];
  const reading = nodes["restore-file"].emit("change");
  nodes["restore-text"].value = "new pasted contents";
  await nodes["restore-text"].emit("input");
  finish("old file contents");
  await reading;
  assert.equal(nodes["restore-text"].value, "new pasted contents");
  assert.equal(nodes["restore-confirm"].disabled, false);
});

test("canceled native backup sharing is reported as canceled without starting a download", async () => {
  const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  let shared = 0;
  Object.defineProperty(globalThis, "navigator", { configurable: true, value: {
    canShare: () => true,
    async share() { shared += 1; throw new DOMException("Canceled", "AbortError"); },
  } });
  globalThis.document = { createElement() { assert.fail("Cancel must not start a download"); } };
  try {
    assert.equal(await downloadBackup(), "canceled");
    assert.equal(shared, 1);
  } finally {
    if (originalNavigator) Object.defineProperty(globalThis, "navigator", originalNavigator);
    else delete globalThis.navigator;
  }
});
