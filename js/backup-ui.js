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
import { parseBackup } from "./backup.js";
import { animateElement, cancelAnimationsWithin } from "./interactions.js";
import { presentDialog } from "./modal.js";
import {
  prepareBackupTransfer, backupFile, canShareBackup,
  shareBackupFile, downloadBackupFile, copyBackupText,
} from "./share.js";

const REASONS = {
  empty: "Önce bir dosya seç ya da yedek metnini yapıştır.",
  unreadable: "Bu metin okunamadı. Yedeğin tamamını kopyaladığından emin ol.",
  foreign: "Bu bir English Prep yedeği değil.",
  newer: "Bu yedek uygulamanın daha yeni bir sürümünden. Önce uygulamayı yenile.",
};

/** A reviewable snapshot, then one explicitly chosen transfer mechanism. */
export function createBackupDialog({ onResult = () => {} } = {}) {
  const dialog = el("dialog", "dialog transfer-dialog");
  dialog.id = "backup-dialog";
  dialog.setAttribute("aria-labelledby", "backup-dialog-title");
  dialog.setAttribute("aria-describedby", "backup-dialog-description");
  const content = el("div", "stack");
  const intro = el("div", "stack stack--tight");
  const heading = el("h2", "t-title", "İlerlemeni yanında götür");
  heading.id = "backup-dialog-title";
  heading.tabIndex = -1;
  const description = el("p", "t-body", "Yedeği diğer cihazda Profil → Yedekten geri yükle ile aç. Mevcut ilerlemeyle birleştirilir.");
  description.id = "backup-dialog-description";
  intro.append(heading, description);

  const preview = el("div", "transfer-preview");
  const label = el("p", "t-label", "Bu dosyada");
  const counts = el("p", "transfer-preview__counts");
  counts.id = "backup-preview-counts";
  const included = el("p", "t-meta", "");
  const limits = el("p", "t-quiet", "Dosya şifreli değildir; gönderdiğin kişi kayıtlarını okuyabilir.");
  preview.append(label, counts, included, limits);

  const details = el("details", "transfer-details");
  const summary = el("summary", "t-label", "İçeriği gör / elle kopyala");
  const fields = el("p", "t-quiet", "Derslerin okuma konumu ve tamamlanması; test cevapları ve tarihleri; adın, çalışma ayarların ve varsa eski hedef/sınav tercihlerin. Ders metinleri bu dosyada yer almaz. Açık test oturumu, görünüm ve hareket tercihleri taşınmaz.");
  const textLabel = el("label", "visually-hidden", "Yedek metni");
  textLabel.htmlFor = "backup-export-text";
  const text = el("textarea", "field field--multiline transfer-text");
  text.id = "backup-export-text";
  text.readOnly = true;
  text.spellcheck = false;
  text.rows = 5;
  text.setAttribute("autocapitalize", "off");
  const select = el("button", "btn btn--secondary", "Metnin tümünü seç");
  select.type = "button";
  select.addEventListener("click", () => {
    text.focus({ preventScroll: true });
    text.select();
  });
  const detailsBody = el("div", "stack stack--tight transfer-details__body");
  detailsBody.append(fields, textLabel, text, select);
  details.append(summary, detailsBody);
  details.addEventListener("toggle", () => {
    if (details.open) animateElement(detailsBody, "reveal", { channel: "transfer-detail" });
    else cancelAnimationsWithin(detailsBody);
  });

  const channels = el("div", "transfer-actions dialog__actions");
  const share = el("button", "btn btn--primary", "Dosyayı paylaş");
  const download = el("button", "btn btn--secondary", "Dosyayı indir");
  const copy = el("button", "btn btn--secondary", "Yedek metnini kopyala");
  for (const button of [share, download, copy]) button.type = "button";
  channels.append(share, download, copy);
  const support = el("p", "t-quiet");
  const status = el("p", "t-meta transfer-status");
  status.id = "backup-export-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  const footer = el("div", "dialog__actions");
  const close = el("button", "btn btn--quiet", "Kapat");
  close.type = "button";
  footer.append(close);
  content.append(intro, preview, details, channels, support, status);
  dialog.append(content, footer);
  document.body.appendChild(dialog);

  let transfer;
  let file;
  let generation = 0;
  let busy = false;
  const setBusy = (value) => {
    busy = value;
    for (const button of [share, download, copy]) {
      button.setAttribute("aria-disabled", String(value));
    }
    channels.setAttribute("aria-busy", String(value));
  };
  const notify = (message) => {
    status.textContent = message;
    animateElement(status, "reveal", { channel: "transfer-status" });
    onResult(message);
  };
  share.addEventListener("click", async () => {
    if (busy) return;
    const current = generation;
    setBusy(true);
    const result = await shareBackupFile(file);
    if (current !== generation || !dialog.open) return;
    setBusy(false);
    notify({
      "handed-off": "Dosya paylaşım sistemine verildi. Kaydedildiğini seçtiğin uygulamadan kontrol edebilirsin.",
      canceled: "Paylaşım yapılmadı. İstersen yeniden deneyebilirsin.",
      unsupported: "Bu tarayıcıda dosya paylaşımı kullanılamıyor. Dosyayı indirebilir ya da metni kopyalayabilirsin.",
      failed: "Paylaşım açılamadı. Yeniden dene, dosyayı indir ya da metni kopyala.",
    }[result]);
  });
  download.addEventListener("click", () => {
    if (busy) return;
    try {
      downloadBackupFile(file);
      notify("İndirme başlatıldı. Dosyanı tarayıcının İndirilenler bölümünde kontrol edebilirsin.");
    } catch {
      notify("İndirme başlatılamadı. Yedek metnini kopyalayabilirsin.");
    }
  });
  copy.addEventListener("click", async () => {
    if (busy) return;
    const current = generation;
    setBusy(true);
    const result = await copyBackupText(transfer.json);
    if (current !== generation || !dialog.open) return;
    setBusy(false);
    if (result === "copied") notify("Yedek metni kopyalandı. Diğer cihazda geri yükleme alanına yapıştırabilirsin.");
    else {
      details.open = true;
      text.focus({ preventScroll: false });
      text.select();
      notify("Otomatik kopyalama kullanılamıyor. Seçili metni cihazının Kopyala komutuyla alabilirsin.");
    }
  });
  close.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right
        || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => {
    // Native close is queued. A rapid reopen already owns a fresh snapshot.
    if (dialog.open) return;
    generation += 1;
    setBusy(false);
    cancelAnimationsWithin(dialog);
    // Do not leave a private export in the inactive page's DOM.
    text.value = "";
    transfer = null;
    file = null;
  });

  return {
    open() {
      if (dialog.open) return;
      generation += 1;
      transfer = prepareBackupTransfer(exportState());
      file = backupFile(transfer);
      const data = transfer.summary;
      counts.textContent = `${data.attempts} test · ${data.answers} yanıt · ${data.lessons} ders kaydı`;
      const size = data.bytes < 1024 ? `${data.bytes} B` : `${(data.bytes / 1024).toLocaleString("tr-TR", { maximumFractionDigits: 1 })} KB`;
      included.textContent = `${data.completed} ders tamamlanmış. ${data.profileName ? `Adın (${data.profileName}) ve çalışma tercihlerin dahil.` : "Çalışma tercihlerin dahil."} ${size}.`;
      text.value = transfer.json;
      details.open = false;
      status.textContent = "";
      setBusy(false);
      const supported = canShareBackup(file);
      share.hidden = !supported;
      download.classList.toggle("btn--primary", !supported);
      download.classList.toggle("btn--secondary", supported);
      support.textContent = supported
        ? "Paylaşacağın uygulamayı sen seçersin. English Prep bir sunucuya yedek göndermez."
        : "Bu tarayıcıda dosya paylaşımı kullanılamıyor; indirme ve metinle aktarım kullanılabilir.";
      dialog.showModal();
      heading.focus({ preventScroll: true });
      dialog.scrollTop = 0;
      presentDialog(dialog);
    },
  };
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
      presentDialog(dialog);
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
