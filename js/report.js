// "Bu soruda bir sorun var" — the one channel from a learner back to the
// content.
//
// There is no backend, no account and no analytics, so a report cannot be
// posted anywhere. It does not need to be: this app is distributed by
// pasting a URL into a group chat, and a report can go back the same way.
// The button builds the text and hands it to the share sheet, or to the
// clipboard, and the learner pastes it wherever they already talk to
// whoever wrote the question.
//
// Why it is worth the fifty lines: six friends sitting the real exam are
// the only pretest panel this project can ever have. Every published
// question here was written by a language model and reviewed by another
// one, and `docs/content-review.md` is the record of what that missed. A
// learner who stops on an item and thinks "that's wrong" is the most
// reliable detector in the whole pipeline, and until now there was
// nowhere for them to say so.
//
// No email address, deliberately. The repository is public and a mailto:
// in a page served from GitHub Pages is an address in a scraper's list by
// the end of the week.

/**
 * The report text. Pure, and separate from the sharing, so it can be
 * tested and so the two ways of delivering it cannot drift.
 *
 * It carries what somebody would need to find the item again: the id,
 * what the learner chose, and what the app said. No version number — the
 * quoted answer text identifies the content revision well enough, and if
 * the item is later rewritten the mismatch is itself informative.
 *
 * @param {{id: string, category: string, prompt: string, correctAnswer: string}} question
 * @param {string|null} selected - what the learner chose, if anything
 * @param {Date} [now]
 * @returns {string}
 */
export function buildReport(question, selected, now = new Date()) {
  const lines = [
    "English Prep — soru bildirimi",
    "",
    `Soru: ${question.id}`,
    `Konu: ${question.category}`,
  ];
  if (selected) {
    lines.push(`Benim işaretlediğim: ${selected}`);
  }
  lines.push(`Uygulamanın doğru dediği: ${question.correctAnswer}`);
  // `prompt`, not `paragraph`. `normalizeQuestion` in js/topics.js folds a
  // cloze item's `paragraph` and a restatement's `sentence` into one
  // field, so nothing the app hands around has `paragraph` on it — this
  // line shipped a blank where the question should be, in the one feature
  // whose entire job is to carry the question to whoever can fix it.
  lines.push("", question.prompt ?? "(soru metni alınamadı)", "", "Sorun ne? (buraya yaz)", "");
  lines.push(`— ${now.toLocaleDateString("tr-TR")}`);
  return lines.join("\n");
}

/**
 * Offers the report to the learner. Share sheet first, because on a phone
 * that is what actually reaches the group chat; clipboard second, which
 * is what a desktop wants.
 *
 * A cancelled share sheet is a decision, not a failure, and must not fall
 * through to a silent clipboard write the learner did not ask for — the
 * same rule js/backup-ui.js follows for the backup file.
 *
 * @returns {Promise<"shared"|"copied"|"failed">}
 */
export async function sendReport(text) {
  if (navigator.share) {
    try {
      await navigator.share({ text });
      return "shared";
    } catch (error) {
      if (error?.name === "AbortError") {
        return "shared";
      }
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    return "copied";
  } catch {
    return "failed";
  }
}

/** What the button says once it has done something. */
export const REPORT_RESULT = {
  shared: "Bildirim hazır — paylaştığın yere yapıştır.",
  copied: "Kopyalandı — sohbete yapıştırabilirsin.",
  failed: "Kopyalanamadı. Soru numarası: ",
};
