// The screen half of backup and restore. The merging itself is pure and
// lives in js/backup.js; this file is about handing a file to a person and
// taking one back from them.
//
// Two decisions worth knowing about.
//
// **Restoring is two steps, not one.** Choose the file, then read what it
// would add, then commit. A restore is the only action in this app that
// could destroy something a learner cannot get back, and although the
// merge is non-destructive by construction, "trust me" is not what a
// person needs to see at that moment.
//
// **Pasting is a first-class path, not a fallback.** The share sheet and
// the download both depend on browser APIs that behave differently on
// every platform this app runs on; a textarea depends on nothing. Someone
// who cannot make the file work can always select all, copy, and paste it
// into the other phone.

import { el } from "./dom.js";
import { exportState, importState } from "./storage.js";
import { buildBackup, parseBackup } from "./backup.js";

const FILE_NAME = "english-prep-yedek.json";

const REASONS = {
  empty: "Önce bir dosya seç ya da yedek metnini yapıştır.",
  unreadable: "Bu metin okunamadı. Yedeğin tamamını kopyaladığından emin ol.",
  foreign: "Bu bir English Prep yedeği değil.",
  newer: "Bu yedek uygulamanın daha yeni bir sürümünden. Önce uygulamayı yenile.",
};

/**
 * Offers the learner their own data as a file. Tries the share sheet
 * first, because on a phone that is what reaches the other device — it
 * opens WhatsApp, AirDrop, Files, mail. Falls back to a download, which is
 * what a desktop wants anyway.
 *
 * @returns {Promise<"shared"|"downloaded">}
 */
export async function downloadBackup() {
  const json = JSON.stringify(buildBackup(exportState()), null, 2);
  const file = new File([json], FILE_NAME, { type: "application/json" });

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "English Prep yedeği" });
      return "shared";
    } catch (error) {
      // A cancelled share sheet is a decision, not a failure, and must not
      // fall through to a download the learner did not ask for.
      if (error?.name === "AbortError") {
        return "shared";
      }
    }
  }

  const url = URL.createObjectURL(file);
  const link = el("a");
  link.href = url;
  link.download = FILE_NAME;
  link.click();
  // Revoking immediately can cancel the download on some engines; a turn
  // of the event loop is enough and the object is small.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
  return "downloaded";
}

/**
 * Wires the restore dialog. Returns an `open()` the caller can attach to a
 * button; the dialog itself is in index.html so the platform gives the top
 * layer, the backdrop, focus containment and Escape for free.
 *
 * @param {{ onRestored: () => void }} config
 */
export function createRestoreDialog({ onRestored }) {
  const dialog = document.getElementById("restore-dialog");
  const description = document.getElementById("restore-dialog-text");
  const inputs = document.getElementById("restore-input");
  const fileInput = document.getElementById("restore-file");
  const textInput = document.getElementById("restore-text");
  const message = document.getElementById("restore-message");
  const cancel = document.getElementById("restore-cancel");
  const confirm = document.getElementById("restore-confirm");

  /** @type {object|null} the parsed backup, once step one has passed */
  let pending = null;

  function reset() {
    pending = null;
    textInput.value = "";
    fileInput.value = "";
    message.textContent = "";
    inputs.hidden = false;
    confirm.textContent = "Devam";
    description.textContent =
      "Yedek dosyanı seç, ya da içeriğini aşağıya yapıştır. Mevcut ilerlemen silinmez — iki taraf birleştirilir.";
  }

  /** Step one: read what the learner gave us, and say what it would do. */
  function review() {
    const result = parseBackup(textInput.value);
    if (!result.ok) {
      message.textContent = REASONS[result.reason];
      return;
    }

    pending = result.backup;
    inputs.hidden = true;
    confirm.textContent = "Geri yükle";
    description.textContent = summarise(pending);
    message.textContent = "";
  }

  /**
   * What the learner is about to accept. The exact counts come *after* the
   * merge, from importState's own return value, rather than being
   * predicted here — a preview that disagrees with the outcome is worse
   * than no preview.
   */
  function summarise(backup) {
    const taken = backup.exportedAt ? new Date(backup.exportedAt) : null;
    const when =
      taken && !Number.isNaN(taken.valueOf())
        ? taken.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
        : null;
    return when
      ? `${when} tarihli yedek. Geri yüklersen bu cihazdaki ilerlemenle birleştirilecek; hiçbir şey silinmeyecek.`
      : "Geri yüklersen bu cihazdaki ilerlemenle birleştirilecek; hiçbir şey silinmeyecek.";
  }

  /** Step two: actually write it, and say what changed. */
  function apply() {
    const summary = importState(pending);
    dialog.close();
    onRestored(summary);
  }

  fileInput.addEventListener("change", async () => {
    const [file] = fileInput.files ?? [];
    if (!file) {
      return;
    }
    try {
      textInput.value = await file.text();
      message.textContent = `${file.name} okundu.`;
    } catch {
      message.textContent = "Dosya okunamadı. İçeriğini kopyalayıp aşağıya yapıştırabilirsin.";
    }
  });

  confirm.addEventListener("click", () => (pending ? apply() : review()));
  cancel.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
  dialog.addEventListener("close", reset);

  return {
    open() {
      reset();
      dialog.showModal();
      cancel.focus();
    },
  };
}

/**
 * The sentence the learner sees after a restore. Written to be true when
 * nothing happened, which is the case a "Başarılı!" toast gets wrong.
 * @param {{newAttempts: number, newQuestions: number, advancedLessons: number}} summary
 */
export function describeRestore(summary) {
  const parts = [];
  if (summary.newAttempts > 0) {
    parts.push(`${summary.newAttempts} test`);
  }
  if (summary.advancedLessons > 0) {
    parts.push(`${summary.advancedLessons} ders`);
  }
  if (parts.length === 0) {
    return "Yedekte bu cihazda olmayan bir şey yoktu — hiçbir şey değişmedi.";
  }
  return `${parts.join(" ve ")} eklendi.`;
}
