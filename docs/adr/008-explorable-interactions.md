# ADR 008 — Explorable interfaces and a shared interaction language

Date: 4 October 2026 (Türkiye time). Baseline: `9e68e84`, v0.68.
Status: implemented. Executed checks are recorded in [VALIDATION](../VALIDATION.md).

## Scope and evidence

The owner requests a more fluid and interactive app and introduction, purposeful
custom icons, both `ep.` and `english prep.` marks, removal of the top motion
button, revised correct/incorrect colors, and an About page that uses screenshots
inside its product story rather than a separate screenshot gallery. Teaching
material must remain unchanged. This supersedes ADR007's header control, status
hues and gallery; its measured background/typographic system remains.

Evidence is separated into [status color research](../research/2026-10-status-colors-v069.md),
[interaction research](../research/2026-10-interaction-motion-v069.md),
[component audit](../audit/v0.69-component-review.md),
[onboarding proposal](../design/onboarding-v069.md), and
[About proposal](../design/about-v069.md). Official sources, local measurements
and design judgments are explicitly distinguished; no learner study is claimed.

## Color communicates an answer, brand communicates identity

Replace iris confirmation/apricot error with measured low-chroma jade/coral
status roles. Iris and apricot can remain decorative palette accents, without
being the explanation of an answer. Keep answer text and surfaces neutral;
short literal verdicts, correct-answer text and ✓/× marks carry meaning even
without color. Hidden descriptions also expose the state when someone returns
to an answered option with assistive technology. Do not recolor entire English
paragraphs, restore full red/green panels or equate one answer with mastery.

The status research records three alternatives and final dark/light tokens.
The existing checker must verify the chosen values against opaque surfaces and
all bounded background compositions. Decorative status/brand swatches never
stand in for actual browser inspection of the answer component.

## Motion architecture

Use one shared finite-effect module alongside the existing persistent motion
preference. A cancellation registry replaces independent ad-hoc animation
lifecycles. New effects replace the previous effect on the same target/channel,
and are canceled when motion is disabled, the OS requests reduction, the page
is hidden, or their region is removed. No state, focus, scoring, data writes,
navigation or action availability waits for an animation to finish.

| Role | Cue | Timing |
| --- | --- | --- |
| Press / selected control | Small local press/release; selection visible immediately | about100ms |
| Popup / new feedback | Short opacity/displacement, menu from its actual attachment edge | about160–180ms |
| Route / tutorial scene | One finite local entrance; cancel prior cue on rapid navigation | about220ms |
| Confirmed local completion | Small glyph/track emphasis, values already final | about360ms |
| Reader, input and search | Stable prose/input, immediate changes; no paragraph cascade or typing delay | no decorative replay |

Use CSS for hover, focus, press, indicator and chevron states. Use WAAPI for
explicit finite events and cancellation. Keep native dialog/popover behavior,
keyboard focus, hit testing and disclosure semantics. The browser's full-page
View Transition remains unused because its old snapshot blocked interaction.

Prevent the entire quiz from fading again after an answer. Only the newly
revealed feedback and small status glyph receive a cue. Answer/control geometry
must stay identical. A wrong answer never shakes, flashes or punishes the user.
Do not animate the height of article blocks or restored reading position.

## Motion preference and atmosphere

Remove the visible top pause control from app, introduction and About. Keep
Profile's labeled setting, a quiet shared control at the bottom of the app's
scrolling content (also reachable during reading/testing), and About's footer
preference. These are the same persisted setting; the OS reduced-motion request
always wins. Continuous decoration remains pausable without losing study state.

Retain the three bounded background fields and opaque controls. Pointer response
is for the About artwork only: at most2deg tilt/6px translation, fine hover input,
one scheduled frame per input frame, no idle animation loop. Text does not chase
the cursor. A local decorative reflection stays inside artwork, never adding an
unmeasured fourth light field behind live teaching text. Touch and keyboard have
complete feature access without simulating hover or requiring device sensors.

## Brand, icons and menus

A shared DOM wordmark provides compact, full and responsive variants, with a
stable accessible name and palette-colored dot. Compact chrome can use `ep.`;
roomier headers and introductory signatures use `english prep.`. Neither mark
requires an external font or image dependency.

Extend the existing24px monoline SVG family only for identifiable jobs such as
resume, device layout, learning route and local backup. Icons support labels;
selecting a menu option adds a reserved check glyph. Chevron orientation follows
actual popup state. Avoid ornamenting every paragraph with icons or new borders.

Fix the confirmed dialog defect: clicks inside its padding must not count as a
backdrop click. Native Escape/focus containment and immediate close remain.

## Explorable introduction and portfolio

Onboarding remains optional, three pages, user-paced and skippable. Education
and Test each contain a compact miniature with three native pressed-state
controls. Custom diagrams explain topic→article→check and answer→reason→return.
They do not fabricate learning questions, write progress or require a correct
response. Keep a name optional on the final page. Scene choices survive Back.

About merges the dedicated screen gallery and duplicated study flow into one
Read→Apply→Return product story. Its actual responsive screenshots support the
selected explanation, with no screen×viewport chooser or separate SS section.
Architecture choices expose actual content/interface/local-continuity decisions.
Every visible control changes meaningful content or follows a real destination.
Plain-text content arrays and extra sections remain editable and resilient.

## Verification

Preserve `data/`, `original/` and `legacy/` byte for byte. Recheck320px and short
viewports, keyboard/OS reduction, enlarged text, option geometry, menu placement,
native dialog outcomes, quiz resume, pretest progress, offline shell modules,
rapid repeated interactions, pointer cleanup and local animation cancellation.
Audit correct/incorrect meaning and both themes. Regenerate genuine screenshots
after the final interface changes. Save remaining product opportunities in a
backlog without silently adding content or claiming user research was performed.
