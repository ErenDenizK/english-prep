// App-level constants that more than one screen needs to agree on.
// Anything a content author would change lives in data/, not here.

/** Questions drawn for a single-topic test, clamped to what the topic has. */
export const TOPIC_TEST_DEFAULT_COUNT = 15;

/** Pre-selected question count for the mixed test on the home screen. */
export const MIXED_TEST_DEFAULT_COUNT = "10";

/**
 * Check questions embedded in a lesson, drawn from that category's Test
 * pool. They are never scored and never gate progress, so this is a
 * pacing choice rather than an assessment one.
 */
export const CHECKS_PER_LESSON = 2;

/** Category chips shown on a topic card before collapsing into "+n more". */
export const MAX_VISIBLE_CATEGORY_CHIPS = 3;
