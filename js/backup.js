// Taking a learner's progress out of one browser and putting it into
// another.
//
// This is not a convenience feature. Everything the app knows about a
// learner lives in one browser's localStorage, and WebKit deletes
// script-written storage after seven days of browser use without an
// interaction on the origin — so on iOS Safari, "I came back after a
// couple of weeks" already means "my progress is gone". The documented
// escape is a home-screen install, and installing on iOS moves the app
// into a *separate* storage container, which destroys the progress on the
// way. Backup therefore has to exist before the app is allowed to suggest
// installing itself. See docs/research/onboarding.md.
//
// The merge functions here are pure, and tested the way quiz-engine is,
// because the one thing a restore must never do is lose something that
// was already there.

/** Bumped only if the payload shape changes incompatibly. */
export const BACKUP_VERSION = 1;

const MARKER = "english-prep";

/**
 * Merges histories. Resumable attempts use stable IDs; an older prefix can
 * advance to the longer copy without combining conflicting answers. Legacy
 * attempts still use their date and keep the first copy. Ordered by date so
 * everything downstream —
 * `getItemStats`, the accuracy window, "last score" — reads a coherent
 * timeline rather than one device's history followed by the other's.
 *
 * @param {{attempts: Array<object>}} mine
 * @param {{attempts: Array<object>}} theirs
 */
export function mergeHistory(mine, theirs) {
  const attempts = new Map();
  for (const attempt of [...(mine?.attempts ?? []), ...(theirs?.attempts ?? [])]) {
    if (attempt && typeof attempt.date === "string") {
      const key = typeof attempt.id === "string" && attempt.id ? `id:${attempt.id}` : `date:${attempt.date}`;
      const previous = attempts.get(key);
      if (!previous) {
        attempts.set(key, attempt);
      } else if (extendsAttempt(previous, attempt)
        && attempt.questions.length > previous.questions.length) {
        attempts.set(key, mergeAttempt(previous, attempt));
      }
    }
  }
  return {
    attempts: [...attempts.values()].sort((a, b) => a.date.localeCompare(b.date)),
  };
}

/** The same session, with an identical answered prefix and no lost answers. */
export function extendsAttempt(previous, next) {
  return typeof previous?.id === "string" && previous.id.length > 0 && previous.id === next?.id
    && Array.isArray(previous.questions) && Array.isArray(next.questions)
    && next.questions.length >= previous.questions.length
    && previous.questions.every((answer, index) => {
      const newer = next.questions[index];
      return answer && newer && ["id", "topicId", "category", "correct", "selected"]
        .every((field) => (answer[field] ?? null) === (newer[field] ?? null))
        && (!answer.answeredAt || !newer.answeredAt || answer.answeredAt === newer.answeredAt);
    });
}

/** Keep known answer times when extending a snapshot from an older build. */
export function mergeAttempt(previous, next) {
  return { ...previous, ...next, date: previous.date,
    questions: next.questions.map((answer, index) => ({
      ...answer,
      ...(!answer.answeredAt && previous.questions[index]?.answeredAt
        ? { answeredAt: previous.questions[index].answeredAt } : {}),
    })),
  };
}

/**
 * Lesson progress only ever moves forward — `recordLessonRead` refuses to
 * go backwards — so merging is a maximum, and "done" is sticky. That makes
 * a restore non-destructive by construction rather than by care.
 */
export function mergeLessonProgress(mine, theirs) {
  const merged = {};
  for (const source of [mine ?? {}, theirs ?? {}]) {
    for (const [lessonId, entry] of Object.entries(source)) {
      if (!entry || typeof entry !== "object") {
        continue;
      }
      const existing = merged[lessonId];
      // The timestamp is a maximum too, and for the same reason the read
      // position is: the later of two devices is the one that describes
      // when this learner was last here. Two records with no timestamp
      // merge to no timestamp, which stays "unknown".
      const at = Math.max(
        existing?.at ?? 0,
        typeof entry.at === "number" && Number.isFinite(entry.at) ? entry.at : 0
      );
      merged[lessonId] = {
        read: Math.max(existing?.read ?? 0, typeof entry.read === "number" ? entry.read : 0),
        done: existing?.done === true || entry.done === true,
        ...(at > 0 ? { at } : {}),
      };
    }
  }
  return merged;
}

/** Content-freshness marks: the higher number has seen more. */
export function mergeSeenVersions(mine, theirs) {
  const merged = { ...(mine ?? {}) };
  for (const [topicId, version] of Object.entries(theirs ?? {})) {
    if (Number.isInteger(version)) {
      merged[topicId] = Math.max(merged[topicId] ?? 0, version);
    }
  }
  return merged;
}

/**
 * Everything a learner would be sorry to lose, in one object.
 * @param {Record<string, unknown>} state - as read from storage
 */
export function buildBackup(state) {
  return {
    app: MARKER,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data: state,
  };
}

/**
 * Reads a backup file's text. Returns `{ok: false, reason}` rather than
 * throwing, because every failure here is something a person has to be
 * told in a sentence: the wrong file, a truncated paste, a file from some
 * other app.
 *
 * @param {string} text
 * @returns {{ok: true, backup: object} | {ok: false, reason: "empty"|"unreadable"|"foreign"|"newer"}}
 */
export function parseBackup(text) {
  const trimmed = typeof text === "string" ? text.trim() : "";
  if (!trimmed) {
    return { ok: false, reason: "empty" };
  }

  let parsed;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return { ok: false, reason: "unreadable" };
  }

  if (!parsed || typeof parsed !== "object" || parsed.app !== MARKER || !parsed.data) {
    return { ok: false, reason: "foreign" };
  }
  // A file from a future build may carry fields this one would silently
  // drop on the next save. Refusing is the honest failure.
  if (Number.isInteger(parsed.version) && parsed.version > BACKUP_VERSION) {
    return { ok: false, reason: "newer" };
  }

  return { ok: true, backup: parsed };
}

/**
 * What a restore would add, counted before anything is written, so the
 * learner can be shown it and say no.
 *
 * @param {{attempts: Array<object>}} mineHistory
 * @param {{attempts: Array<object>}} theirsHistory
 * @param {Record<string, object>} mineLessons
 * @param {Record<string, object>} theirsLessons
 */
export function summariseRestore(mineHistory, theirsHistory, mineLessons, theirsLessons) {
  const mineDates = new Set((mineHistory?.attempts ?? []).map((a) => a?.date));
  const newAttempts = (theirsHistory?.attempts ?? []).filter(
    (attempt) => attempt?.date && !mineDates.has(attempt.date)
  );

  const mergedLessons = mergeLessonProgress(mineLessons, theirsLessons);
  let advancedLessons = 0;
  for (const [lessonId, entry] of Object.entries(mergedLessons)) {
    const before = mineLessons?.[lessonId];
    if (!before || entry.read > (before.read ?? 0) || (entry.done && !before.done)) {
      advancedLessons += 1;
    }
  }

  return {
    newAttempts: newAttempts.length,
    newQuestions: newAttempts.reduce((sum, a) => sum + (a.questions?.length ?? 0), 0),
    advancedLessons,
  };
}
