// App-level constants that more than one screen needs to agree on.
// Anything a content author would change lives in data/, not here.

/** Questions drawn for a single-topic test, clamped to what the topic has. */
export const TOPIC_TEST_DEFAULT_COUNT = 15;

/** Pre-selected question count for the mixed test on the home screen. */
export const MIXED_TEST_DEFAULT_COUNT = "10";

/**
 * Names of the learner-chosen settings, so a typo in one screen cannot
 * silently disagree with another.
 */
export const SETTINGS = {
  /** Hide the answer options until the learner has committed to a guess. */
  THINK_FIRST: "thinkFirst",
};
