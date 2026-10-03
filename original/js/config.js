// App-level constants that more than one screen needs to agree on.
// Anything a content author would change lives in data/, not here.

/** Questions drawn for a single-topic test, clamped to what the topic has. */
export const TOPIC_TEST_DEFAULT_COUNT = 15;

/** Pre-selected question count for the mixed test on the home screen. */
export const MIXED_TEST_DEFAULT_COUNT = "10";

/**
 * The route namespace for a topic's overview screen: `#egitim/konu/<id>`.
 *
 * A prefix rather than a bare topic id, because a lesson id is
 * `<topicId>-<slug>` and lives in the same slot — without a namespace,
 * `#egitim/modals` would be ambiguous the moment a topic and a lesson
 * could share a spelling. Both the router and the links use this, so the
 * two cannot drift.
 */
export const TOPIC_INTRO_PREFIX = "konu/";

/**
 * Names of the learner-chosen settings, so a typo in one screen cannot
 * silently disagree with another.
 */
export const SETTINGS = {
  /** Hide the answer options until the learner has committed to a guess. */
  THINK_FIRST: "thinkFirst",
  /**
   * How many questions the mixed test and the mistake book were last set
   * to. Not booleans, so they go through `getChoice`/`setChoice` — see
   * the note there. Someone revising re-picks a count on every arrival
   * otherwise, ten or more times across a week.
   */
  MIXED_COUNT: "mixedCount",
  MISTAKE_COUNT: "mistakeCount",
};
