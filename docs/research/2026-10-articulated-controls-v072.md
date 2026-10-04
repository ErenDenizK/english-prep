# v0.72 — Objects assemble; reading surfaces stay still

Date: 4 October 2026. Scope: onboarding diagrams, select menus and native
confirmation/transfer dialogs. This changes presentation only.

The requested Duolingo reference is useful for its responsive, articulated
objects. The previous iteration applied one long lateral/rotating `flow` effect
to most drawing groups; adding more copies of the same effect did not make the
parts feel more intentional. A select menu only moved as a single rectangle.

## Sources actually read

- [Rive: state-machine layers](https://github.com/rive-app/rive-docs/blob/main/editor/state-machine/layers.mdx)
  was retrieved over verified HTTPS. It separates simultaneous behaviors into
  layers, for example movement and hover/selected states, and identifies property
  conflicts when layers affect the same object. The applicable principle here
  is independent parts with distinct jobs, not a requirement to install Rive.
- [Rive: transitions](https://github.com/rive-app/rive-docs/blob/main/editor/state-machine/transitions.mdx)
  was retrieved over verified HTTPS. It separates paths, conditions, properties
  and actions. Here the actual application transition commits immediately;
  decorative transitions are interruptible consequences of that event.
- The official [Duolingo animation-principles page](https://design.duolingo.com/animation/animation-principles)
  was requested, but this environment returned a proxy 403. We do not claim to
  have measured the current Duolingo app, copied its timing, or observed its
  proprietary animation implementation. The previous [v0.71 research](2026-10-motion-v071.md)
  records the verified official case-study links and their access limits.

## Choreography decisions

| Event | Independent parts | Immediate behavior |
| --- | --- | --- |
| Open a select | Stable popup with an outside shadow response, up to four visible labels with 35ms offsets, selected check settles separately | Final popup/row geometry, committed check and active option already exist; focus remains on the combobox |
| Open a native dialog | Stable surface with an outside shadow response, title, explanation, individual action labels | `showModal`, safe initial focus and native backdrop boundaries already work |
| Choose a topic scene | Rows arrive in order, dots acknowledge, text-like strokes draw, side connector completes | Native pressed button and caption update now |
| Open the article scene | Back sheet fans, front sheet unfolds, separate paragraph strokes draw, underline grows, direction mark settles | The selected scene/caption already exist |
| View an answer scene | Sheet unfolds, option rows assemble, the selected strip grows, answer symbol traces | No teaching question or answer is fabricated or stored |
| Open a real quiz question | Prompt shadow, category label and option shortcut glyphs respond independently | English passage, option boxes, score and selection geometry remain stationary |
| View an explanation | Paper unfolds, successive strokes connect the explanation, supporting dot settles | Real explanatory caption remains fully opaque and stationary |
| Return to study | Separate sheets assemble, two directions trace around them | No navigation or learning record is changed by the diagram |

Menus deliberately do not translate or scale their option boxes. Browser
measurements and pointer targets therefore use the same stable geometry while
the labels move inside it. Opening is not delayed until the sequence finishes;
Escape, selection and outside dismissal cancel it immediately. Rendering an
updated active option cancels outgoing detached label effects.

An early panel mask proposal was rejected during review: `clip-path` preserves
the bounding rectangle but can still clip the pointer hit area. The final shell
response changes only an outside shadow/outline. A regression freezes the
opening frame and performs a real pointer click one pixel inside the first
option's upper edge, so this check covers hit testing as well as geometry.

The dialog helper wraps only button contents in reusable presentation spans.
Names, listeners, button types and the native focus/inert behavior stay on the
existing buttons. It does not move the dialog box, including the rectangle used
to distinguish padding clicks from actual backdrop clicks.

Onboarding headings, explanatory copy and captions no longer receive the old
whole-copy lateral entry. The diagrams now use different `item`, `unfold`, `fan`,
`signal`, `rule` and `trace` roles. All delays remain bounded by the shared 180ms
cap; the longest illustration is 1100ms plus that cap. The visible/readiness
scheduler, input-priority cancellation, hidden-page cancellation, saved motion
preference and operating-system reduction remain shared infrastructure.

The same rule now applies to the real quiz. A late question arrival must not
translate its answer buttons; input-priority cancellation alone would still
move a target when a finger reaches it. The question and option containers stay
fixed, and only their supporting presentation parts animate. Revealing hidden
choices establishes the requested first-option focus before queuing those parts,
so intentional application focus does not accidentally cancel the new sequence.

Color supports the drawing's structure: the selection uses the cherry accent;
connectors and direction cues use the existing secondary token. These are
already-defined palette roles, not new unaudited colors. Forced colors use
CanvasText for both. There are no continuous loops in these controls.

## Validation

Behavioral coverage checks stationary popup hitboxes during the finite sequence,
bounded visible-item cascade, native dialog initial focus and interruption,
three distinct animation roles in every onboarding scene, stationary copy,
rapid choices, repeat-selection replay, delayed fonts, 200% text, short/normal
mobile and desktop geometry, and saved/OS motion reduction. Numerical counts and
execution results belong in the release validation record after the final run.
