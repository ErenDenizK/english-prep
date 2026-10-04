# ADR 010 — Living scenes and adaptive navigation

Date: 4 October 2026. Baseline: `cfa4089` (v0.70).

The owner requests softer, more noticeable motion inspired by Duolingo, cohesive
About/onboarding scenes, higher-resolution real captures, stable mobile chrome
and an experimental branded scrollbar. Teaching material and scoring stay fixed.
This supersedes ADR009's footer motion controls and immediate artwork starts.

## Diagnose before changing the language

A controlled 2.1-second font delay reproduced a real startup defect: home effects
started around 229ms and ended around 589ms, while Inter completed around 2154ms.
Onboarding began around 196ms, ahead of first contentful paint around 236ms.
A longer effect alone would still finish too early on a slower connection.

Header measurements found the center shifted by up to 43.5px on a 390px viewport
as asymmetric leading/trailing controls changed. Equal outer grid tracks solve
that geometry without changing labels, navigation or the available reading area.
The mobile back action retains its full accessible name with an icon-only face.

[Motion research](../research/2026-10-motion-v071.md) records the actual sources
retrieved and access limits. Duolingo's official animation pages were requested
but proxy-blocked. Rive's official repository identifies Duolingo's animation
case study; its available technical documentation supports state-based,
interruptible transitions. No proprietary Duolingo timing, live-app measurements
or universal optimum is claimed. Our 1100ms illustration role is a product choice
validated in this interface, alongside existing fast 100/220/360ms control roles.

## One scene, meaningful parts

About's study story and architecture use a shared containing surface and an
integrated chapter rail. Onboarding groups mode identity, flow choices, diagram
and caption in one study window. Shared boundaries, proximity and connected
artwork make the relationship legible; another isolated card for every element
would recreate the reported fragmentation. Text and controls remain available
throughout. Art can overshoot slightly and settle; reading text never bounces.

`whenVisible` in the shared interaction module waits for the actual Inter font,
optional image decode, intersection and two rendering frames. It schedules
presentation only. Navigation, semantic state, focus and scores commit first.
Replacement, direct input, motion-off, page hiding and teardown cancel pending
as well as active effects. A canceled event never returns after a late font or
image resolves. There is no JavaScript idle animation loop or artificial loading.

Each normal click responds immediately. Illustrated choices additionally trigger
a coherent finite flow/trace sequence, including repeated deliberate selections.
Native disclosure behavior, touch and keyboard remain complete without motion.

## Living atmosphere within measured limits

Keep the three audited cherry/iris/apricot tones and opacity ceilings. Larger
viewport-relative travel and different 16/21/27-second rhythms vary their local
mixture, creating color change without unchecked hue rotation. Gradient falloffs
finish inside each layer to avoid visible rectangular edges. Only transform and
opacity animate; text surfaces and answer rows retain their contrast contracts.

The only motion toggle is in Profile settings, as requested. About provides a
settings link. OS reduced motion wins over the saved preference, and hidden
pages pause. No route, onboarding or footer adds another toggle.

## Adaptive rail, ordinary scrolling

A bounded track expresses continuous position; existing lesson headings and
About sections add meaningful stops. Tests remain continuous: the rail must
never change question, score, completion or answer state. Wheel, touch and
native navigation remain the actual scrolling mechanisms; there is no snapping
or intercepted wheel behavior.

A 44px interactive rail requires a measured 52px right-hand whitespace allowance
and a fine pointer. There it supports drag, pointer cancellation, keyboard
Arrow/Page/Home/End and an ARIA scrollbar relationship. On narrow/touch screens,
a thin passive branded indicator accompanies native finger scrolling. This
avoids a 44px invisible hitbox over article text or an extra floating menu on a
320px phone. Forced colors and unsuccessful enhancement retain native controls.
See [rail design](../design/scroll-rail-v071.md) for exact implementation.

## Real high-density media and evidence

Capture the working app at 390×844 CSS pixels with 3× density and 1440×1000 with 2×
density; retain logical image dimensions to prevent layout shifts. All eight
WebPs depict real material and clearly identified demonstration progress.
Image decode joins scene readiness so higher density cannot consume its motion.

Validate slow fonts/assets, rapid replacements, off/reduced/hidden modes, native
menus, keyboard/drag rails, short/wide/mobile geometry, 200% text, image density,
color calculations, unchanged material and the normal study→test→result journey.
[Validation](../VALIDATION.md) records executed checks and honest limits; desktop
Chromium emulation is not a physical iPhone or battery certification.
