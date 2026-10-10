#!/usr/bin/env node
// Cold-solving: the one step in this project's quality pipeline that
// cannot be delegated.
//
// `blind-corpus.mjs` unkeys a set for a review *session*. This does the
// same for a person, in a terminal, one item at a time — because the
// defect classes that matter here survive everything except somebody
// answering the question without seeing the key. `npm run check` cannot
// see an item with two defensible answers; the model that wrote the item
// cannot either; and a reviewer reading a whole topic file finds fewer of
// them than a solver meeting the item cold, because by item four they are
// reading the author rather than the question.
//
//   npm run solve                        # 8 unsolved items, whole corpus
//   npm run solve -- --topic modals      # scope to one topic
//   npm run solve -- --count 20 --solver deniz
//   npm run solve -- --all               # include items already solved
//   npm run solve -- --report            # the ledger, no solving
//
// Answering: a/b/c/d. Append `?` — `b?` — to say "I chose b, but another
// option is defensible too". That flag is the finding this exists to
// collect and is worth more than the score. `s` skips, `q` saves and
// quits.
//
// TWO DELIBERATE DIFFERENCES FROM blind-corpus.mjs
//
// The category is hidden by default. blind-corpus shows it because a
// reviewer works through one topic file and that context is unavoidable
// anyway. A solver meets items in mixed order, which is what the app's
// own mixed test does — and a category name like "Must vs Have to vs
// Mustn't vs Don't Have to" *lists the options*, handing over most of the
// discrimination the item exists to test. `--show-category` restores it.
//
// And the explanation is revealed after the answer rather than withheld.
// The solver is not being measured; the corpus is. Reading the reasoning
// is how a second solver learns what this corpus considers a good
// explanation, and it costs nothing once the answer is recorded.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { createInterface } from "node:readline";
import { blindQuestion } from "./blind-corpus.mjs";

const LOG_PATH = "docs/audit/solve-log.json";
const LOG_VERSION = 1;

/** Minutes of attention one item costs, from the pipeline measurements
 *  cited in docs/business/vision.md §4. Used only to turn a count into an
 *  hour figure somebody can put in a calendar. */
const MINUTES_PER_ITEM = 7;

/* -- Loading ---------------------------------------------------------- */

export function loadCorpus(read = readFileSync) {
  const manifest = JSON.parse(read("data/manifest.json", "utf8"));
  const questions = [];
  for (const topic of manifest.topics) {
    if (topic.comingSoon) continue;
    const file = JSON.parse(read(`data/${topic.id}/${topic.id}.json`, "utf8"));
    for (const question of file.questions) {
      questions.push({ ...question, topicId: topic.id });
    }
  }
  return questions;
}

export function loadLog(read = readFileSync, exists = existsSync) {
  if (!exists(LOG_PATH)) return { version: LOG_VERSION, entries: [] };
  try {
    const parsed = JSON.parse(read(LOG_PATH, "utf8"));
    return Array.isArray(parsed?.entries) ? parsed : { version: LOG_VERSION, entries: [] };
  } catch {
    // A corrupt log must not cost the session its work. The log is
    // append-only and every entry is one item, so losing it is annoying;
    // refusing to run is worse.
    return { version: LOG_VERSION, entries: [] };
  }
}

/* -- Selection -------------------------------------------------------- */

/**
 * The items to put in front of the solver: unsolved first, shuffled.
 *
 * Shuffled because solving a topic file top to bottom is exactly how a
 * solver starts predicting the author instead of reading the item, which
 * is the failure this whole tool exists to avoid.
 *
 * @param {Array<object>} questions
 * @param {Array<object>} entries - the log's entries
 * @param {{topic?: string, category?: string, count?: number, all?: boolean, solver?: string}} opts
 */
export function selectItems(questions, entries, opts = {}) {
  const solvedBy = new Set(
    entries.filter((e) => !opts.solver || e.solver === opts.solver).map((e) => e.id)
  );
  let pool = questions;
  if (opts.topic) pool = pool.filter((q) => q.topicId === opts.topic);
  if (opts.category) pool = pool.filter((q) => q.category === opts.category);
  if (!opts.all) pool = pool.filter((q) => !solvedBy.has(q.id));

  const order = [...pool];
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order.slice(0, opts.count ?? 8);
}

/* -- The ledger ------------------------------------------------------- */

/**
 * What the log says about the corpus.
 *
 * The interesting numbers are not the score. They are `disagreed` — the
 * solver picked something other than the key, so either the key is wrong
 * or the item does not discriminate — and `flagged`, where the solver
 * agreed with the key and still thought another option was defensible.
 * That is the same defect seen from the other side, and it is the one a
 * scoring system would throw away.
 */
export function report(questions, entries) {
  const latest = new Map();
  for (const entry of entries) {
    const key = `${entry.id}::${entry.solver}`;
    const prev = latest.get(key);
    if (!prev || entry.date > prev.date) latest.set(key, entry);
  }
  const rows = [...latest.values()];
  const solvedIds = new Set(rows.map((r) => r.id));
  const bySolver = {};
  for (const row of rows) {
    const seen = (bySolver[row.solver] ??= { solved: 0, agreed: 0 });
    seen.solved += 1;
    if (row.agreed) seen.agreed += 1;
  }
  const remaining = questions.length - solvedIds.size;
  return {
    total: questions.length,
    solved: solvedIds.size,
    remaining,
    remainingHours: (remaining * MINUTES_PER_ITEM) / 60,
    bySolver,
    disagreed: rows.filter((r) => !r.agreed),
    flagged: rows.filter((r) => r.flagged),
  };
}

/* -- CLI -------------------------------------------------------------- */

function parseArgs(argv) {
  const opts = { count: 8, solver: process.env.USER || "solver" };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--report") opts.report = true;
    else if (arg === "--all") opts.all = true;
    else if (arg === "--show-category") opts.showCategory = true;
    else if (arg === "--topic") opts.topic = argv[++i];
    else if (arg === "--category") opts.category = argv[++i];
    else if (arg === "--count") opts.count = Number(argv[++i]);
    else if (arg === "--solver") opts.solver = argv[++i];
    else {
      console.error(`Bilinmeyen argüman: ${arg}`);
      process.exit(1);
    }
  }
  return opts;
}

const LETTERS = "abcdefghij";
const ESC = String.fromCharCode(27);
const dim = (s) => `${ESC}[2m${s}${ESC}[0m`;
const bold = (s) => `${ESC}[1m${s}${ESC}[0m`;
const green = (s) => `${ESC}[32m${s}${ESC}[0m`;
const red = (s) => `${ESC}[31m${s}${ESC}[0m`;

function printReport(rep) {
  console.log(`\n${bold("Soğuk çözüm defteri")}\n`);
  console.log(`  külliyat        ${rep.total} soru`);
  console.log(`  çözülmüş        ${rep.solved}`);
  console.log(`  kalan           ${rep.remaining}  (~${rep.remainingHours.toFixed(1)} saat)`);
  for (const [solver, seen] of Object.entries(rep.bySolver)) {
    const pct = seen.solved ? ((100 * seen.agreed) / seen.solved).toFixed(0) : "—";
    console.log(`  ${solver.padEnd(14)}  ${seen.solved} çözüm, anahtarla uyum %${pct}`);
  }
  if (rep.disagreed.length) {
    console.log(`\n${bold("Anahtarla uyuşmayanlar")} — ya yanlış anahtarlanmış ya ayırt etmiyor:`);
    for (const row of rep.disagreed) {
      console.log(
        `  ${red("x")} ${row.id}  ${dim(`${row.solver}: "${row.chose}", anahtar "${row.key}"`)}`
      );
    }
  }
  if (rep.flagged.length) {
    console.log(`\n${bold("İkinci savunulabilir cevap işaretlenenler")}:`);
    for (const row of rep.flagged) {
      console.log(`  ${dim("?")} ${row.id}  ${dim(row.solver)}`);
    }
  }
  if (rep.solved && !rep.disagreed.length && !rep.flagged.length) {
    console.log(`\n${green("Çözülen sorularda bulgu yok.")}`);
  }
  console.log("");
}

/**
 * A prompt that survives the input ending.
 *
 * `rl.question` never calls back once stdin closes, so a Ctrl-D — or a
 * piped session running out of lines — left the loop awaiting a promise
 * that would never settle, and the session's answers were never written.
 * Closing the input is a legitimate way to stop, so it is treated as `q`:
 * save and quit.
 */
function ask(rl, prompt) {
  return new Promise((resolve) => {
    let settled = false;
    const onClose = () => {
      if (settled) return;
      settled = true;
      resolve("q");
    };
    rl.once("close", onClose);
    rl.question(prompt, (answer) => {
      settled = true;
      rl.off("close", onClose);
      resolve(answer);
    });
  });
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const questions = loadCorpus();
  const log = loadLog();

  if (opts.report) {
    printReport(report(questions, log.entries));
    return;
  }

  const items = selectItems(questions, log.entries, opts);
  if (items.length === 0) {
    console.log("\nBu kapsamda çözülecek soru kalmadı. `--all` hepsini yeniden açar.\n");
    return;
  }

  console.log(`\n${bold(`${items.length} soru`)} ${dim(`- çözücü: ${opts.solver}`)}`);
  console.log(
    dim("a/b/c/d ile cevapla · 'b?' = başka bir şık da savunulabilir · s atla · q kaydet ve çık\n")
  );

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  let answered = 0;

  for (const [index, question] of items.entries()) {
    const { blind, key } = blindQuestion(question);
    console.log(dim(`-- ${index + 1}/${items.length}  ${question.id}`));
    if (opts.showCategory) console.log(dim(`   ${question.category}`));
    console.log(`\n${blind.paragraph ?? blind.sentence}\n`);
    blind.options.forEach((option, i) => console.log(`   ${LETTERS[i]})  ${option}`));

    let raw = "";
    let choice = -1;
    while (choice === -1) {
      raw = (await ask(rl, "\n> ")).trim().toLowerCase();
      if (raw === "q" || raw === "s") break;
      const at = LETTERS.indexOf(raw.replace("?", ""));
      if (at >= 0 && at < blind.options.length) choice = at;
      else console.log(dim("   a-d, ya da s / q"));
    }
    if (raw === "q") break;
    if (raw === "s") {
      console.log(dim("   atlandı\n"));
      continue;
    }

    const chose = blind.options[choice];
    const answer = key.answer;
    const agreed = chose === answer;
    const flagged = raw.endsWith("?");

    console.log(
      agreed ? `\n   ${green("anahtarla aynı")}` : `\n   ${red(`anahtar: "${answer}"`)}`
    );
    if (question.explanation) console.log(`   ${dim(question.explanation)}`);
    if (flagged) console.log(`   ${dim("ikinci savunulabilir cevap olarak işaretlendi")}`);
    console.log("");

    log.entries.push({
      id: question.id,
      topicId: question.topicId,
      solver: opts.solver,
      date: new Date().toISOString(),
      chose,
      key: answer,
      agreed,
      flagged,
    });
    answered += 1;
  }

  rl.close();

  if (answered > 0) {
    mkdirSync(dirname(LOG_PATH), { recursive: true });
    writeFileSync(LOG_PATH, `${JSON.stringify(log, null, 2)}\n`);
    console.log(`${answered} soru kaydedildi -> ${LOG_PATH}`);
  }
  printReport(report(questions, log.entries));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await main();
}
