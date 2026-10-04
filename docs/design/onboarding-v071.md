# v0.71 · One connected introduction scene

4 October 2026. Scope: the optional introduction only. Lessons, questions,
progress rules and preserved versions are unchanged.

## Observation and decision

The previous composition put a preview heading, three separate selector
surfaces, an illustration, a caption and an Education/Test legend into five
successive strips. Each part was understandable, but the relationship depended
on reading down the whole stack. The owner's screenshots identified this
fragmentation and requested a more continuous animated experience.

The new composition groups the mode identity, continuous selector, larger
illustration and caption inside one study window. The window is an opaque
existing `card` surface. Its selector shares a single baseline and moving
accent marker; the individual choices have no permanent card backgrounds.
Proximity and a common containing surface express the relationship. This is a
design hypothesis checked against the actual screen, not a participant-study
finding. The redundant two-mode legend is removed; the existing three-page
structure and concise navigation sentence still explain the two modes and
where Profile lives.

The illustration grows from 104 px to 128 px at phone widths. On short screens
it uses 96 px, so the larger drawing does not turn the tour into a long desktop
composition squeezed into a phone. Copy and illustration form one block;
controls retain independent 44 px or larger hit areas.

## Evidence and limits

The shared [motion research](../research/2026-10-motion-v071.md) documents the
accessible official Rive sources and their Duolingo references. The Duolingo
blog/video hosts were blocked by the environment, so no measured Duolingo
frame timing, rendered comparison or direct inspection is claimed. The useful
transfer is explicit interaction states, interruptibility and articulation of
related drawing parts. There is no mascot, score simulation or gamification.

The [W3C Animation from Interactions explanation](https://raw.githubusercontent.com/w3c/wcag/main/understanding/21/animation-from-interactions.html)
was retrieved successfully for this pass. It supports the retained reduction
contract. The NNGroup common-region article URL returned a proxy 403; it is not
presented as an inspected source. The 1,100 ms timing and card composition are
our choices for this app, not values prescribed by those sources.

## Timing and interaction contract

- Page text, navigation, selected state and captions commit immediately. No
  control waits for artwork and no paragraph fades out or scales.
- The shared `whenVisible` service waits for font readiness and the actual
  artwork's intersection before starting its initial presentation. Heading
  movement is registered separately, so a heading at the top cannot consume
  an illustration's animation while the drawing is below the fold.
- Sheets, rows and selection marks use the shared 1,100 ms `flow` preset;
  meaningful decorative paths use `trace` at the same duration. Offsets of
  0–160 ms articulate the related parts. The longest current composition is
  1,260 ms, while pointer feedback and selection commit immediately.
- The selector's marker crosses the shared baseline over the existing scene
  duration. Selecting the current stop again deliberately replays only its
  illustration. It does not replace the caption, move focus or advance a page.
- Each new selection cancels outgoing effects and pending arrivals. Back,
  Next and Skip cancel the outgoing panel or whole tour. There is no queue,
  automatic advance, idle JavaScript loop or local motion setting.
- Shared app-off, OS-reduced and hidden-page handling leaves the complete
  static illustration. The only motion toggle now lives in Profile settings.

The optional name, blank-name completion, keyboard buttons, direct entry into
the main app, saved scene choice on Back and lack of learning-storage writes
remain unchanged. One explanatory UI caption was shortened to prevent an
extra line moving the primary action at 320 px; no educational text changed.

## Four review passes

1. Inspected the old DOM, supplied screenshot and interaction semantics before
   editing. Chose one containing study window rather than adding more controls.
2. Integrated shared visibility readiness and articulated motion. State and
   focus remain synchronous; repeated selection has an intentional response.
3. Captured the actual dark phone screen and measured 320, 390, 768 and 1440 px
   viewports. Fixed the 24 px primary-action jump caused by the long caption.
4. Checked finite effects, slow-font readiness, rapid navigation, every drawing,
   repeated selection, optional name, stored-off, OS reduction and 200% text.

Chromium measurements after fonts settled, reduced motion enabled:

| Viewport | Education tour | Test tour | Primary-action shift across its three scenes |
| --- | ---: | ---: | ---: |
| 320 × 568 | 649 px | 669 px | 0 px |
| 390 × 844 | 690 px | 690 px | 0 px |
| 768 × 1024 | 698 px | 698 px | 0 px |
| 1440 × 900 | 702 px | 702 px | 0 px |

The 390 px Education tour was 682 px before this pass, an 8 px increase while
consolidating its layout and enlarging the drawing. The short screen scrolls
naturally; Next remains reachable. There is no horizontal overflow in these
cases or at 200% text. All measured visible buttons meet the 44 px target.

`tests/onboarding_interaction_browser.py`: **8 tests passed** in Chromium on
the integrated v0.71 checkout. The new font-readiness test deliberately holds
the font-ready promise longer than the animation duration, verifies that no
illustration effect has been consumed, then releases readiness and observes
fresh long effects. Repeated-selection coverage checks focus and caption
stability as well as replay. The three onboarding-specific reading-system tests also passed, covering
keyboard selection, optional name, Back behavior and learning-storage isolation.

These are local browser measurements and automated behavior checks. Physical
Safari/iPhone verification and participant judgments of motion quality remain
outside this evidence.
