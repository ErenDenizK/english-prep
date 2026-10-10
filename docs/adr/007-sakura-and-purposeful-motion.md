# ADR 007 — Sakura palette, purposeful motion and product presentation

Date: 4 October 2026 (Türkiye time). Baseline: `c92be0c`, v0.67.
Status: implemented in v0.68; measured outcomes are in [VALIDATION.md](../VALIDATION.md).

## Context and evidence

The owner finds the neutral interface too monochrome, answer states too boxy,
resume percentages awkward, progress rings unhelpful, settings loosely grouped,
and the introduction/portfolio insufficiently considered. The explicit new
direction is cherry/sakura color, a living atmosphere across screens, restrained
but meaningful interaction motion, a short page-by-page introduction, and a
more complete expandable product/engineering portfolio.

Keep the academic article + topic practice model, source corpus, semantic text
roles, current learner storage and preserved original. This decision supersedes
ADR006's palette, finite atmosphere, opaque whole-reader canvas and single-page
introduction. It does not undo its typography or answer-geometry findings.

Evidence: [palette research](../research/2026-10-sakura-palette.md),
[motion research](../research/2026-10-motion-language.md),
[screen diagnosis](../history/audit/v0.68-interface-diagnosis.md), and
[portfolio plan](../history/design/about-v0.68-plan.md). These separate official-source
measurements, applicable accessibility requirements and product judgments.
Network-blocked live sources are not claimed as visually inspected products.

## Color and surfaces

Select candidate A: restrained plum neutrals, cherry/sakura brand, iris for
confirmed answers/completion, apricot for an incorrect attempt/retry. Alternatives
with more saturated purple surfaces competed with teaching text; brighter
aurora stops failed essential-edge contrast at the desired opacity. Darker,
chromatic light fields preserve hue while retaining usable boundaries.

| Role | Dark | Light |
| --- | --- | --- |
| Canvas | #141216 | #fbf7fa |
| Surface / raised | #1d1a20 / #28242c | #ffffff / #f0eaf0 |
| Primary / supporting text | #eee9ed / #c6bcc6 | #302831 / #625864 |
| Decorative / essential edge | #39313d / #847988 | #e2d8e2 / #887b88 |
| Brand primary / secondary stop | #ed96b4 / #dca2d8 | #a13462 / #854987 |
| On-primary | #301b27 | #ffffff |
| Sakura text / tint | #efb1cb / #30222d | #922e55 / #f6e7ed |
| Focus / secondary accent | #d4b5f8 / #c8b4e9 | #7848af / #7652a0 |
| Correct iris / tint | #bbb6f2 / #262432 | #654bb0 / #eeebf9 |
| Retry apricot / tint | #e9bb95 / #2f2725 | #92501f / #f7eee5 |

Color has a job: cherry identifies the brand and primary action; sakura marks
selected destinations and selected structural emphasis; iris identifies a
confirmed answer; apricot identifies an attempt to reconsider. Custom status
hues require visible marks and literal verdicts. They do not intrinsically mean
correct/incorrect. Do not color entire answer paragraphs or use the brand pink
as a generic error color.

Use neutral answer surfaces, small status markers and a quiet edge/accent rather
than four large colored rectangles. Preserve reserved mark space before and
after answering. Decorative cards do not all need bright outlines. Inputs and
focus retain an essential boundary. Hover should express locality with soft
rounded/inset treatment or title emphasis, not a full-width square slab.

Heading color is selective: section accents and short eyebrow/brand elements
may use sakura/iris; long instructional text retains stable primary ink. A richer
palette is not a reason to give every paragraph a different color.

## Atmosphere and motion

Use three independently positioned gradient fields, cherry #c65b88, iris
#785ca8 and apricot #c68571. Maximum per-field opacity: dark0.10 / light0.05.
Measure single, double and all triple source-over overlaps on the page, plus
all gradient action colors; never rely on one attractive screenshot. With
three dark fields fully overlapping, measured minima are text11.03:1,
support7.18:1, essential edge3.19:1 and focus7.41:1. Applying the fields over
raised cards would fail the chosen edge requirement; cards stay opaque.

The aura is visible on every screen, including the article/quiz canvas, with
stable foregrounds and bounded background colors. No animated text color,
full-screen blur, blend mode, hue rotation, particles, parallax or autoplay media.
Use small transforms and modest opacity drift over roughly28–36seconds.

Continuous decorative motion needs a real pause mechanism. One persistent
preference powers both a44px header control available during a quiz/lesson and
its Profile counterpart. The system reduced-motion preference always wins.
Pause when the document is hidden; a stopped aura remains a still atmospheric
background. On narrow headers, the back action can use an accessible icon-only
presentation while its actual label remains available to assistive technology.

| Interaction | Behavior |
| --- | --- |
| Answer commit, focus, input, selected state | Immediate; no animation delays scoring or action availability. |
| Press / hover | Approximately90–120ms feedback,1px or very small scale movement; no layout shift. |
| Menu and explanation reveal | Approximately160–180ms opacity/short displacement; open/focus immediately. |
| Route or tutorial step | Approximately220ms, small shared spatial direction; no double page crossfade or focus delay. |
| Meaningful completion | One local360–420ms meter/mark emphasis; actual numbers visible from the first frame, no confetti or score count-up. |
| Wrong answer | Neutral immediate explanation with an apricot marker; no punitive shake. |

Keep controls usable while motion runs. Disabling motion must preserve every
state/meaning and prevent scripted as well as CSS decoration.

## Progress, onboarding and settings

Move resume percentage out of the English category string. A labeled reading
position bar pairs a quiet numeric value with actual stored progress. Profile
uses comparable linear reading/accuracy metrics and plain cumulative figures.
The results summary emphasizes actual correct/answered counts with a restrained
bar; a one-question result must not imply broad proficiency.

Group settings into study behavior, appearance/motion, application information
and data management; use aligned rows and concise explanations. Preserve focus,
backup/reset semantics, explicit theme preferences and native install outcomes.

The introduction remains optional and replayable, but becomes a short narrated
flow: Education (topic → article → check), Test (answer → explanation → review),
then optional name/start. Show context through small UI previews and finite step
transitions. Keep skip/back available, preserve name on return, and never ask for
exam dates, goals or streaks. Deep links remain direct.

The unread lesson's pretest opens by default and is immediately skippable.
Teaching-content progress must exclude its variable height: locate the first
real teaching block, calculate/restore reading position against that range,
and ensure answering/collapsing a pretest cannot falsely complete the article.
The existing storage schema remains compatible.

## Portfolio and branding

Retain the ep. wordmark and make its sakura dot/identity more visible in entry
and tutorial contexts. About is a product and engineering narrative: actual
phone-width/wide screenshots, user-controlled screen selection, feature stories,
local data/offline/backup behavior, architecture and verification links. No
fabricated testimonials, usage metrics, phone-device testing or availability
promises. Use stable section components driven by editable content data, safe
DOM construction and an authoring guide. Longer/new sections must reflow.

## Acceptance

Measure all color roles and atmosphere bounds in both themes; audit320px,
390px, tablet and desktop; enlarged text/spacing; header control fit; contrast
without color semantics; immediate actions and invariant answer geometry;
keyboard onboarding and skip; persisted/reduced/hidden-document motion;
pretest progress/resume; real screenshots; About with long edited content;
PWA nested path and all old content. Existing tests that assumed one-step
onboarding, collapsed pretests or finite atmosphere must assert the new contract,
not be deleted. Record failures and corrections before Pages publication.


## Integration findings

The final review removed the native View Transition around SPA routing: it
stacked a browser snapshot on the existing CSS entry cue and briefly blocked
hit testing. Routes now commit synchronously with one finite CSS cue. The
motion preference governs both CSS and script effects. See the measured
[motion engineering review](../history/audit/v0.68-motion-engineering.md).

The enabled switch thumb uses `accent-ink`, because inherited white failed
non-text contrast on the dark pink gradient. Empty accuracy values use
supporting text rather than a confirmation color. New runtime modules are
included in the versioned shell cache; screenshot assets cache when visited.
