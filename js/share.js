// A user-reviewed, immutable transfer snapshot. The v1 backup/restore contract
// stays in backup.js. Native sharing, downloading and copying are separate
// choices: canceling one must never silently start another.
import { buildBackup } from "./backup.js";

export function prepareBackupTransfer(state) {
  const json = JSON.stringify(buildBackup(state), null, 2);
  const backup = JSON.parse(json);
  const attempts = Array.isArray(backup.data.history?.attempts)
    ? backup.data.history.attempts : [];
  const lessons = Object.values(backup.data.lessonProgress ?? {})
    .filter((entry) => entry && typeof entry === "object");
  return {
    json,
    filename: `english-prep-${backup.exportedAt.slice(0, 10)}.json`,
    summary: {
      attempts: attempts.length,
      answers: attempts.reduce((sum, attempt) => sum + (attempt?.questions?.length ?? 0), 0),
      lessons: lessons.length,
      completed: lessons.filter((entry) => entry.done === true).length,
      profileName: backup.data.profileName || "",
      bytes: new TextEncoder().encode(json).byteLength,
      exportedAt: backup.exportedAt,
    },
  };
}

export function backupFile(transfer) {
  return new File([transfer.json], transfer.filename, { type: "application/json" });
}

export function canShareBackup(file, platform = navigator) {
  try {
    return typeof platform.share === "function" && platform.canShare?.({ files: [file] }) === true;
  } catch {
    return false;
  }
}

/** Called directly from a click, before yielding transient user activation. */
export async function shareBackupFile(file, platform = navigator) {
  if (!canShareBackup(file, platform)) return "unsupported";
  try {
    await platform.share({ files: [file], title: "English Prep yedeği" });
    // Resolution means OS handoff on some platforms, not delivery or saving.
    return "handed-off";
  } catch (error) {
    return error?.name === "AbortError" ? "canceled" : "failed";
  }
}

export function downloadBackupFile(file) {
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  link.hidden = true;
  document.body.appendChild(link);
  try {
    link.click();
  } finally {
    link.remove();
    // Safari may need the object after click dispatch; preserve it briefly.
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }
  return "download-started";
}

export async function copyBackupText(text, platform = navigator) {
  try {
    if (!platform.clipboard?.writeText) return "manual";
    await platform.clipboard.writeText(text);
    return "copied";
  } catch {
    return "manual";
  }
}
