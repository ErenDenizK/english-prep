// Learner-facing difficulty tiers used to group topic cards on the home
// screen. Purely a display grouping — see the architecture plan for why
// this is not a required content-authoring order. A topic's `tier` field
// in data/manifest.json must be one of these ids.

export const TIER_ORDER = [
  "foundations",
  "core-grammar",
  "compound-structures",
  "advanced",
  "vocabulary",
];

export const TIER_LABELS = {
  foundations: "Foundations",
  "core-grammar": "Core Grammar",
  "compound-structures": "Compound Structures",
  advanced: "Advanced",
  vocabulary: "Vocabulary",
};
