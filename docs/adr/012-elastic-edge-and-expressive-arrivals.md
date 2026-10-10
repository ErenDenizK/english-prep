# ADR 012 — An elastic edge and expressive arrivals

Accepted 4 October 2026. Baseline: v0.72 (`5b48cd0`).

The owner's new drawing and feedback refine the existing design: keep the aura,
slow it slightly, replace the expanding scrollbar box with a thin edge that can
be gently pinched inward, and make button presses and page arrivals visibly
expressive. Earlier reports document previous decisions; they do not prohibit
this requested change or establish an optimum amount of motion.

## Aura: retain its character at 80% speed

Multiply both durations and negative phase offsets by 1.25. This preserves the
initial composition and complete paths while reducing their temporal speed by
20%. Drift becomes 9.75 / 11.75 / 13.75 seconds; pigment cycles become
13.5 / 15.75 / 18 seconds. Color, opacity, spatial reach and the three-color
relationships stay the same. Their existing contrast envelope therefore remains
valid. This is a timing refinement, not another palette redesign.

The existing atmosphere check samples the same phases over 15 seconds instead
of 12 and still requires visible change over a short interval. Its right-edge
sample sits beyond the scrollbar, so the measurement observes background color
rather than the rail's foreground stroke. Pause assertions await the browser's
CSS animation pause operation before comparing frozen times.

## Rail: one thin, deformable line

The reference shows a local bend at the contact point, not a larger panel.
Mobile and desktop therefore share a narrow line, a slender colored thumb and
a compact inward deformation. The thumb's actual vertical position follows
native scrolling directly. Only the horizontal bend and local emphasis soften
through an interruptible, frame-time-based response. Release returns to the
resting line without a separate pop, circular burst or squared-off well.

Continuous drag and intentional section destinations remain distinct operations:
no automatic snapping is added to ordinary reading. Invisible input geometry
must stay local on mobile; the thin visible affordance must not cover text or
verdict marks. Keyboard, tap, pointer cancellation, reduced motion and native
scrolling remain complete. The [component design](../design/scroll-rail-v073.md)
records the implemented geometry and verification.

## Presses and pages: animation is part of the interaction

The previous small translation and short color cues did not provide the feeling
requested. Buttons now need a clear down-and-release response, and a newly
opened screen needs a composed arrival with a visible rhythm between heading,
context and actions. These effects may be stronger than the preceding release.
A single tiny icon cue is not a substitute for a page transition.

Final content and semantic state are committed immediately. The presentation can
then move while controls remain usable. Interruption is part of the design:
rapid repeated selection, an early click, a hidden tab or a motion preference
change must not leave a pressed control, obsolete entrance or delayed action.
The shared language and its measured implementation are in
[motion-v073.md](../history/design/motion-v073.md).

## Boundaries

No lesson, question, answer rule or stored learning record changes. Reading
position, correct/incorrect meaning and native navigation retain their purpose.
The user can compare or revert the new motion through Git history. Testing
checks that the experience is usable and the requested motion is actually
visible; it does not turn the previous aesthetic into an immutable requirement.
