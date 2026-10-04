# Profile and result motion, v0.70

Design and browser research: 4 October 2026, Türkiye time. Scope is application
presentation. Lessons, questions, explanations, grading, history and storage
contracts remain unchanged.

## Evidence before design

The existing screens were measured in Linux Chromium at 390 × 844 CSS px,
with service workers blocked and reduced motion disabled. Profile had a single
220 ms `editorial-enter` animation on its parent view. Its identity card was
342 × 294.8 px, and its metric group was 342 × 195.2 px. Results had one
360 ms `metric-settle` effect on the entire progress track; the score section
measured 342 × 262.4 px. Neither screen told an ordered visual story.

Source inspection identified a separate implementation risk: Profile is
rendered again after a name change, restore or reset. Attaching a longer entrance
to every render would move the field while editing and make a settings change
look like another navigation.

Primary sources retrieved for this work:

- [Material Web motion tokens, v0.192](https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-sys-motion.scss)
  separate 50–200 ms short, 250–400 ms medium, 450–600 ms long and
  700–1000 ms extra-long roles, with standard and emphasized easing. This
  supports distinct roles, not a claim that every interface needs a long effect.
- [MDN: Element.animate](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate),
  retrieved from the official MDN content repository, documents a returned
  animation object and independent effects on an element. This permits finite,
  cancellable decoration after semantic state has already committed.
- The repository's [v0.69 interaction research](../research/2026-10-interaction-motion-v069.md)
  supplies the earlier reduced-motion, lifecycle, visibility and pointer findings.

The Carbon website, Linear features page and Raycast homepage were attempted
but blocked by the environment's network policy. This document does not claim
a live comparative study of those products or participant preference testing.

## Design decisions

The shared v0.70 grammar uses immediate input, a 220 ms reveal, a 360 ms route,
a 560 ms scene and a 720 ms completion signature. Those exact values are design
choices. A longer effect belongs to a meaningful change in context or a small
decorative mark; it does not make every paragraph arrive more slowly.

### Profile: one arrival, then stable settings

`initProfileTab({ enter: true })` presents the first visible sections in a
45 ms sequence, bounded to four groups. Their text remains fully opaque and
their controls work throughout the 360 ms movement. The identity avatar has a
720 ms settle beginning at 60 ms, so the personal mark can be expressive while
the user reads the screen normally. No offscreen settings or coverage paragraphs
are animated later on scroll.

Internal renders use `enter: false`. Before replacing old content, the shared
service cancels its finite effects. Focusing an input also cancels presentation,
so the caret never travels while the user types. Theme selection, reset and
restore keep their existing immediate behavior and focus restoration.

### Results: a run ends, the next reading step begins

A hand-authored SVG signature accompanies the existing test title: a paper
outline, a short connector and a completion mark. A partial run uses a return
arrow. It is decorative and hidden from assistive technology; the actual score,
verdict and review already carry the meaning. The mark means the run has ended,
not that every answer was correct.

Only a newly presented result draws the three strokes at 0/30/60 ms
and settles its small connector dot at 80 ms. The longest effect ends at
800 ms. The final numeric score, proportional fill, review and buttons are
present immediately. There is no count-up, circular chart, confetti, failure
shake or effect tied to obtaining a particular grade. At most two already
visible breakdown groups receive a short reveal; the long review stays still.

Recording and presentation are deliberately separate. The quiz normally saves
the attempt before navigating to results, so its `recorded` flag cannot identify
a fresh presentation. Integrated QA caught this distinction after an initial
fixture-only check. A tab-scoped `englishPrep.resultPresented` marker identifies
the last presented attempt using its ID, date, count and partial status. It is
claimed only after the final result DOM and actions exist, including when motion
is off. It is unrelated to the scoring/history storage contract.

Reloading the same result gives only a 220 ms eyebrow entrance, so it does not
repeatedly celebrate or duplicate the attempt. A failed history save remains
governed by the existing warning and retry rules. If presentation storage itself
is unavailable, a direct quiz handoff can still receive the cue using same-origin
referrer and navigation information; other cases retain the complete static UI.

### Final state is authored, not stored in an effect

All SVG strokes and the final metric exist without JavaScript animation support.
The shared `animateSequence` registry owns cancellation on preference changes,
OS reduction, page hiding and outgoing view cleanup. No completion callback
changes application state, no idle animation frame loop is introduced, and no
motion preference changes the result. CSS does not animate the same score track
as this choreography.

## Validation

JavaScript syntax and whitespace checks passed. Integrated measurements used
Linux headless Chromium, service workers blocked, and actual application DOM:

| Observation | Result |
| --- | --- |
| Profile at 390 × 844 | Three visible section effects at 360 ms, offsets 0/45/90 ms; identity mark 720 ms at 60 ms. |
| Name edit and Tab during arrival | Focus moved to the next button; zero finite animations remained; the edit did not add an entrance call. |
| Actual one-question quiz → results | The immediate score was `1 / 1`, accessible progress was `100`, and history contained exactly one question/attempt while the 720 ms signature ran. |
| Reload after that real quiz | No effect of 500 ms or longer; history unchanged. Covered in `tests/v070_motion_browser.py`. |
| Actual-bank full/partial specimens at 320/390/1440 px | Immediate `4 / 5` and `1 / 2` scores, matching 80/50 progress, correct complete/partial artwork, and unchanged history after each reload. |
| Width and final geometry | No horizontal overflow on either screen at any of the three widths. Profile's 390 px identity and metric heights remained 294.8/195.2 px. |
| Score height | 276.0 px at 320; 282.0 px at 390 and 1440. The signature adds 19.6 px to the old 390 px score block. |
| 320 px with 200% text | The actual “Connectors & Discourse Markers” title reflowed without horizontal overflow or collision with its 96 px signature. |
| Decorative SVG transform | Computed `fill-box`, origin `3px 3px` on its 6 px dot; it settles around its own center rather than the canvas corner. |
| Browser errors in responsive specimens | None. |

Visual inspection covered the 320 px result and the 1440 px partial result,
including the distinction between a completed run and returning from a partial
one. A stylesheet specificity issue initially left the legacy metric-track
animation active; the override was strengthened so the static metric and the
decorative signature have separate, unambiguous ownership.

These observations do not certify physical iPhone/Safari performance, battery
use or a participant preference for the chosen choreography.
