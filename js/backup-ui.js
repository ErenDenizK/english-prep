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
import { animateElement, cancelAnimationsWithin } from "./interactions.js";

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
 * @returns {Promise<"shared"|"downloaded"|"canceled">}
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
        return "canceled";
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
  const heading = document.getElementById("restore-dialog-title");
  const description = document.getElementById("restore-dialog-text");
  const inputs = document.getElementById("restore-input");
  const fileInput = document.getElementById("restore-file");
  const textInput = document.getElementById("restore-text");
  const message = document.getElementById("restore-message");
  const cancel = document.getElementById("restore-cancel");
  const confirm = document.getElementById("restore-confirm");

  /** @type {object|null} the parsed backup, once step one has passed */
  let pending = null;
  let fileRead = 0;

  function reset() {
    fileRead += 1;
    pending = null;
    textInput.value = "";
    fileInput.value = "";
    message.textContent = "";
    inputs.hidden = false;
    confirm.disabled = false;
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
    if (!summary.ok) {
      if (summary.reason === "invalid") {
        pending = null;
        inputs.hidden = false;
        confirm.textContent = "Devam";
        message.textContent = "Yedeğin içeriği geçerli değil. Başka bir yedek dosyası seç ya da metnin tamamını yapıştır.";
      } else {
        confirm.textContent = "Tekrar dene";
        message.textContent = summary.rollbackFailed
          ? "Geri yükleme tamamlanamadı. Verilerin bir kısmı birleşmiş olabilir. Yedek dosyanı sakla; tarayıcı depolama iznini ve boş alanı kontrol edip tekrar dene."
          : "Geri yükleme kaydedilemedi; mevcut verilerin korundu. Tarayıcı depolama iznini ve boş alanı kontrol edip tekrar dene. Seçtiğin yedek hazır bekliyor.";
      }
      return;
    }
    dialog.close();
    onRestored(summary);
  }

  fileInput.addEventListener("change", async () => {
    const [file] = fileInput.files ?? [];
    if (!file) {
      return;
    }
    const reading = ++fileRead;
    confirm.disabled = true;
    try {
      const text = await file.text();
      if (reading !== fileRead) return;
      textInput.value = text;
      message.textContent = `${file.name} okundu.`;
    } catch {
      if (reading === fileRead) {
        message.textContent = "Dosya okunamadı. İçeriğini kopyalayıp aşağıya yapıştırabilirsin.";
      }
    } finally {
      if (reading === fileRead) confirm.disabled = false;
    }
  });
  textInput.addEventListener("input", () => {
    // A paste or edit wins over an older file read still in flight.
    fileRead += 1;
    confirm.disabled = false;
  });

  confirm.addEventListener("click", () => (pending ? apply() : review()));
  cancel.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right
          || event.clientY < box.top || event.clientY > box.bottom) {
        dialog.close();
      }
    }
  });
  dialog.addEventListener("close", () => {
    cancelAnimationsWithin(dialog);
    reset();
  });

  return {
    open() {
      reset();
      // A long dialog should start at its visible introduction. Focusing
      // its bottom action leaves focus off-screen in short windows.
      heading.tabIndex = -1;
      dialog.showModal();
      heading.focus({ preventScroll: true });
      dialog.scrollTop = 0;
      animateElement(dialog, "dialog");
    },
  };
}

/**
 * The sentence the learner sees after a restore. Written to be true when
 * nothing happened, which is the case a "Başarılı!" toast gets wrong.
 * @param {{newAttempts: number, newQuestions: number, advancedLessons: number, preferencesChanged?: boolean}} summary
 */
export function describeRestore(summary) {
  const parts = [];
  if (summary.newAttempts > 0) {
    parts.push(`${summary.newAttempts} test`);
  } else if (summary.newQuestions > 0) {
    parts.push(`${summary.newQuestions} soru yanıtı`);
  }
  if (summary.advancedLessons > 0) {
    parts.push(`${summary.advancedLessons} ders`);
  }
  if (parts.length === 0) {
    return summary.preferencesChanged
      ? "Profil tercihlerin geri yüklendi."
      : "Yedekte eklenecek yeni test ya da ders ilerlemesi yoktu.";
  }
  return `${parts.join(" ve ")} eklendi.${summary.preferencesChanged ? " Profil tercihlerin geri yüklendi." : ""}`;
}
