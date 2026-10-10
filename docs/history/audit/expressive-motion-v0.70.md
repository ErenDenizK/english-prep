# Four passes — expressive motion, v0.70

4 October 2026. Baseline `c134dcc` (v0.69). Teaching material, source archive and
preserved versions are outside the change. [ADR009](../../adr/009-expressive-study-motion.md)
records the decisions; [VALIDATION](../../VALIDATION.md) records executed totals.

## 1. Measure the missing character

The earlier Education, Test, Profile and lesson views mostly shared one 220ms
fade. A lesson becoming complete wrote its progress without a distinctive visual
event. Menus had useful mechanics, but the same understated treatment did not
explain a larger transition. Simply lengthening that fade would not solve it.

Six agents reviewed shared motion, onboarding, mobile About, answer surfaces,
Profile/results and interaction QA. Official Material, Carbon, Fluent and MDN
sources informed productive versus expressive roles, easing and cancellation.
Blocked live product sites were disclosed. No competitor usability measurement
or participant study was invented.

## 2. Design and build related movements

Quick controls use 100/220ms; navigation 360ms; expressive scenes/completions/art
use 560/720/900ms. Small illustrated objects settle and strokes draw, while
reading text stays fully opaque. Real state and focus are already committed.
Bounded sequences have no timer callbacks that mutate the app.

Onboarding articulates six useful diagrams; Profile has an opening composition
that does not replay while editing. A genuine new lesson completion draws a
paper-to-check mark once. Results use a related signature with a return path for
partial sessions. About changes from a tall phone document to a compact hero,
contextual real screenshots, expandable features and an interactive architecture
diagram. Its original 390px study section fell from 1,430px to 1,201px; features
from 2,231px to 1,314px. Text sizes did not shrink to achieve those reductions.

Three answer treatments were rendered in the real component. Sakura/periwinkle
was selected with separate foreground, full opaque fill and boundary tokens.
Neutral prose, literal verdicts and check/cross shapes preserve meaning without
hue. One light border initially failed and was darkened before acceptance.

## 3. Interrupt the interface, find real defects

The independent pass deliberately interacts before effects finish:

- A normal quiz records history before opening results. Using `recorded` to infer
  whether the result had been presented suppressed the new animation on the real
  journey. A separate tab-local presentation marker now handles replay without
  changing learning persistence.
- Scaling a short landscape popup mixed transformed rectangles with unscaled
  scroll coordinates and clipped the active item. The popup now translates only.
- A moving route shifted the popup anchor during a queued focus-scroll event.
  Focus or pointer input now settles its animated ancestors before interaction;
  the popup trigger also keeps its rectangle during press/release. Sixteen rapid
  native/fallback trials then had no unexpected closure.
- About's disclosure initially animated the summary label. The effect now belongs
  to the body the user opened, with a specific regression check.
- Two result effects competed because a legacy CSS selector was more specific.
  The old metric-track effect is explicitly disabled for choreographed results.
- Tall phone layouts could finish artwork entry before the artwork was visible.
  The observer now tracks the actual artwork, with a voluntary scene selection
  taking priority over automatic entry.

The old verifier asserted an `animate-in` class. It now observes an actual finite
animation on visible incoming content. The behavior remains tested while its
implementation moves from a shared CSS fade to the cancellation registry.

## 4. Verify the final composition

Actual engine timings measured onboarding at 720–880ms and About at up to900ms.
All finite effects settled; rapid scene changes left only the final composition.
Motion-off and hidden-page handling canceled WAAPI effects and stopped the three
ambient fields. Stationary screens scheduled no additional JS animation frames
in the sampled interval. This is not a hardware frame-rate or battery claim.

Recheck both themes, short landscape menus, 320px reflow, enlarged text, actual
answer geometry, normal quiz→result→reload, article-only progress, offline routes,
and content integrity. Eight actual screenshots were regenerated after the final
interface changes. The full report gives counts, methods and remaining limits.

## A short manual review route

1. Open **Profil → Uygulamayı tanı** with motion on. Explore all six scenes,
   go Back, skip, and type a name without waiting for the drawing.
2. Open a lesson and reach its real end. Notice the signature once; reopening
   that completed lesson should not repeat the completion event.
3. Answer correctly and incorrectly. Judge the entire colored surfaces at your
   actual screen brightness; do not infer preference from contrast numbers alone.
4. Finish a short test, then refresh results. The first arrival has a closing
   composition; the repeated result remains quiet and history stays unchanged.
5. Focus a menu immediately after changing screens; test End/Home/Enter/Escape.
   The menu should remain usable during what would have been its entry motion.
6. Open About on a phone: switch the study step, expand features and select each
   architecture layer. Try the same actions with keyboard and reduced motion.

Physical Safari/iPhone/older Android testing, extended reading observations and
VoiceOver/TalkBack sessions remain useful follow-ups. No such study is claimed.
