# ADR 009 — A visible motion language for study

Date: 4 October 2026. Baseline: `c134dcc`, v0.69.
Status: implemented; executed evidence is in [VALIDATION](../VALIDATION.md).

## Problem and research

The owner finds the previous motion insufficient and asks for expressive
onboarding, profile and lesson/test completion; a mobile-first portfolio; and
colored answer surfaces, including pink for a correct answer. Teaching material
must remain unchanged. This supersedes ADR008's restrained timing and neutral
answer backgrounds, while retaining its cancellation, native-input and focus
contracts. Prior design choices are hypotheses, not reasons to reject feedback.

The baseline browser inspection found mostly the same 220ms fade on Education,
Test, Profile and lessons. Lesson completion had no event-specific cue. About's
390px hero used 1,010px, its study section 1,430px and feature list 2,231px.
Changing only durations would leave the missing visual relationships unresolved.

[Motion research](../history/research/2026-10-motion-v070.md) examines official Material,
Fluent and Carbon implementations, including productive/expressive roles,
emphasized easing, springs and sequencing. Live Linear/Raycast and several guide
hosts were proxy-blocked; source access is distinguished from live observation.
[Answer studies](../research/2026-10-answer-surfaces-v070.md) compare three actual
component treatments. No participant study or universally optimal timing is claimed.

## Two tempos, one grammar

| Role | Duration | Application |
| --- | --- | --- |
| Immediate response | 100ms | Press, control response; state and focus commit now |
| Local reveal | 220ms | Menus, feedback marks, disclosure |
| Navigation | 360ms | One directional scene entry; persistent chrome stays stable |
| Scene | 560ms | Profile grouping, product-art transition |
| Completion | 720ms | Genuine lesson/result signature and decorative path drawing |
| Story | 900ms | Articulated onboarding/product artwork; never a wait before an action |

Ordinary surfaces decelerate without a playful bounce. Illustrated objects and
small confirmation glyphs can overshoot modestly before settling. Sequences
connect related objects using bounded offsets; they are not paragraph cascades.
All text, final numbers and controls exist immediately. No animation callback
changes scoring, persistence, navigation or availability.

Use CSS for hover/press/focus/selected states and the shared WAAPI registry for
finite events. Add a cancellable sequence API with per-element offsets; a new
scene cancels old and delayed effects. No invisible placeholders, JavaScript
idle loops, route snapshots, simulated loading or input delays. OS reduction,
saved motion-off and hidden-page state remove decorative motion. Aurora remains
bounded under the existing measured opacity limits and footer/Profile preference.

## Apply the grammar to real events

- Onboarding: six illustrated states assemble/draw on initial entry and voluntary
  selection. Three pages remain skippable; name optional; no learning writes.
- Education/Test libraries: a brief coordinated entrance on arrival, never on
  typing or answer commit. Header navigation stays available.
- Lesson: heading orientation on a fresh open, stable resumed prose, a drawn
  signature once the existing unfinished→done event occurs. Reopening a completed
  lesson does not replay a reward. Following the next action never waits.
- Quiz: a new question can enter; answering keeps the passage and option geometry
  fixed. Color and new verdict marks respond locally.
- Profile: opening reveals identity, summary and settings in a short composition;
  name edits and settings changes do not rerun it.
- Results: real final values appear immediately; a custom paper→review signature
  gives the end of a session a distinct cadence. No count-up, false mastery or
  punishment for an incorrect answer.

## Answer surfaces

Select Sakura correct / periwinkle incorrect from three real dark/light renders.
Pink is a brand-specific confirmation here, not a universal semantic claim.
Whole opaque answer surfaces and measured edges carry the new colors, while
English text remains neutral. Literal Doğru/Yanlış, check/cross and accessible
descriptions remain essential. The production checker must measure all new
surface/foreground/focus/edge pairs; grayscale meaning and geometry are reviewed.

## Portfolio from the phone outward

About uses a compact mobile hero, articulated real-device artwork, controls near
their related screenshots and naturally sized explanatory copy. No separate
gallery returns. Feature details are progressively disclosed through native
controls, keeping meaningful headings available. Architecture gains a small
interactive diagram. Tablet/desktop extend the composition rather than shrink a
desktop site into a phone. Pointer response stays decorative; touch and keyboard
expose every feature. Text never follows the mouse.

## Verification

Check actual animation boundaries and interruption, not merely CSS declarations:
rapid navigation, scene replacement, menu commit during movement, Profile typing,
first completion versus reopen, reduced/off/hidden state, 320px and 200% text,
unchanged answer geometry, content hashes, quiz resume and pretest progress.
Use fresh real portfolio screenshots. Retain explicit physical-device and
participant-study limitations. Record final measurements and any corrections.
