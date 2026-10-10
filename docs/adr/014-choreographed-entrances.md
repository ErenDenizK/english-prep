# ADR 014 — Choreographed entrances that start before the first paint

Accepted, 8 October 2026. Supersedes the page-opening decision of ADR 013.

## Context

The owner asked for a livelier, more polished ("canlı / şaşalı") motion
system ahead of presenting the app in a portfolio. Inspection showed that
every entrance since v0.72 painted the final screen first and moved it a
few frames later, which reads as a twitch whatever the duration.

## Decision

- Entrances are created in the same task as the DOM they present and begin
  from their first keyframe (`fill: backwards`), including opacity.
- One movement vector per screen: sideways between tabs, upward for
  drill-ins, sideways for a question's prompt (options fade in place).
- Easing comes from three simulated springs sampled into CSS `linear()`.
- A screen's visible parts are discovered by `collectParts`; cards travel
  whole.
- Answers get a verdict gesture (shake / swell / rise) and a bounded smooth
  scroll that keeps the options on screen.
- The aurora is part of every page's first paint with a shared clock.
  Cross-document view transitions were tried and removed: they swallow
  taps during the snapshot animation.

Kept: button press/release, scroll rail, aurora palette and tempo,
onboarding artwork, About folio, the motion switch and reduced motion.

## Consequences

- Option rectangles never move on entry (they fade in place); they move
  only on the verdict, when they are already inert. The next action is in
  the fixed bar.
- `whenVisible` remains for artwork (onboarding, About, completion
  drawings) where waiting for an image or font is the point.
- Layout-stability checks must wait for finite animations before measuring.

Details: [motion v0.76](../design/motion-v076.md).
