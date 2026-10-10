# v0.69 · An introduction you can explore

Accepted and implemented, 4 October 2026. Scope: the optional `#hosgeldin` route,
presentation and interaction only. Lesson and question material is untouched.

## What the current screen actually does

The v0.68 introduction has three user-paced pages: Education, Test and an
optional name. It preserves an important property: a first visit opens the
application, not a required tour. The intro can be opened from the entry card
or Profile. Keep that behavior, skip, back, optional name and local storage.

The two explanatory pages contain three static icon-and-text rows. Their
only interaction is Next. This explains a process but does not let someone
explore it, and their repeated row geometry looks like another settings list.

Chromium measurements against the current checkout at
`http://127.0.0.1:8012/english-prep/#hosgeldin`:

| Viewport | Tour height | Preview height | Next button top |
| --- | ---: | ---: | ---: |
| 320 × 568 | 744.6 px | 285.6 px | 720.6 px |
| 390 × 844 | 752.6 px | 285.6 px | 728.6 px |
| 1440 × 900 | 701.7 px | 263.2 px | 697.7 px |

These are baseline measurements, not claimed results for the proposal. The
short-screen problem is lengthy repeated description, not a font that needs
to become smaller. Native scrolling remains valid for short viewports and
enlarged text; do not solve it with a fixed-height crop or a sticky overlay.

## Evidence that constrains the design

Official source files were read from their public repositories on 4 October
2026. These are interaction/accessibility references, not a user study or a
claim that a style increases learning outcomes.

- [WAI-ARIA Button pattern](https://github.com/w3c/aria-practices/blob/main/content/patterns/button/button-pattern.html):
  buttons activate with Enter and Space; toggle state uses `aria-pressed`
  with a stable accessible name. A small scene selector can use native
  buttons without adopting an incomplete tab/arrow-key contract.
- [WCAG 2.5.8 Target Size](https://github.com/w3c/wcag/blob/main/understanding/22/target-size-minimum.html):
  the minimum criterion is 24 CSS px or its spacing exceptions. This app
  retains its stronger 44 px touch target for every scene choice and action.
- [WCAG 2.3.3 Animation from Interactions](https://github.com/w3c/wcag/blob/main/understanding/21/animation-from-interactions.html):
  nonessential interaction movement must be suppressible. The miniature is
  fully understandable with all animation removed. Global motion preference
  and the OS reduction setting apply.
- [Existing motion research](../../research/2026-10-motion-language.md):
  state/focus commit immediately; control feedback is short; narrative
  transitions are finite; repeated actions must not enqueue delayed changes.

## Proposed experience

### Page 1 · Education

Use a concise heading, one explanatory sentence and an explorable miniature.
Three controls select **Konu**, **Ders** and **Kontrol**. A custom drawn SVG
shows the corresponding part of the real workflow: topic rows, a scrolling
article with an emphasized passage, or an optional in-lesson check. A short
caption describes the actual behavior, including that the check is optional.

The illustration is a diagram, clearly named **Akış önizlemesi**. Its line
shapes are not fabricated questions, student results or teaching material.
The caption carries all meaningful information. An illustrated two-mode
navigation identifies Education as one of the application's two sections.

### Page 2 · Test

The same component offers **Soru**, **Açıklama** and **Tekrar**. Its scenes
show choosing an answer, inspecting its reason and returning to difficult
concepts. No pretend correct/incorrect answer is scored and no tutorial
action writes lesson, history or mistake-book storage.

The diagram highlights Test in the same two-mode navigation. The surrounding
copy explains topic and mixed practice without introducing gamification.

### Page 3 · Your space

Use the full **english prep.** wordmark as a quiet final signature. Preserve
the optional given-name input, browser-local progress statement, honest
backup reference and immediate **Uygulamayı aç** action. A small two-node
Education/Test drawing connects the start action to the structure just seen.
No new personal information, dates, target or reminder settings.

### Shared behavior

- Keep the compact **ep.** mark at the top of each page and the visible
  **Tanıtımı geç** button. Remove the top motion button per the user's request;
  the shared motion setting remains in Profile.
- The scene selector consists of real buttons in a named group, with one
  `aria-pressed="true"`. The selected caption is announced politely. Focus
  remains on the button that was activated.
- Scene state persists when moving forward/back within one tour. Main page
  changes focus the page heading immediately and reset scroll to the top.
- Next, Back and Skip always work without using the miniature. There is no
  timer, automatic advancement, mandatory exercise or completion gate.
- Finite stage feedback uses the common motion tokens. A small line/path or
  sheet cue explains the transition; prose stays stationary. No bounce,
  flashing, cursor-following effect, auto-playing demonstration or loop.
- Replacing the current scene cancels its prior animation by removing that
  scene. No timers run after leaving the route. Data and focus never wait
  for `animationend`.
- Show the actual page count and a simple three-part progress indicator.
  Use spacing and typographic roles before adding more outlines or colors.

## Composition and implementation boundary

Use the existing single-column reading measure, with a compact flow preview
instead of three repeated prose rows. On short screens reduce discretionary
spacing and illustration height, keeping UI type at 16 px and controls at
44 px. Let exceptionally short screens or enlarged text scroll naturally.
The target is a useful reduction from the baseline 745 px height at 320 px;
it is not a promise that every text size fits one viewport.

Implementation ownership: `js/onboarding.js` and a new scoped
`css/onboarding.css`. Root includes that sheet after the shared system and
adds it to the service-worker shell. No framework, canvas or runtime
dependency. SVG nodes are created with `createElementNS`; no `innerHTML`.
Brand and diagram strokes use existing semantic tokens, never new
unmeasured foreground colors.

Component names:

```
.onboard__tour                  existing page structure
.onboard__panel                 existing page/focus region
.onboard__wordmark              full name in the closing page
.onboard-flow                   complete interactive diagram
.onboard-flow__choices          named native button group
.onboard-flow__choice           44 px pressed-state choice
.onboard-flow__scene            drawing, aria-hidden
.onboard-flow__caption          textual explanation / polite status
.onboard-flow__navigation       decorative two-mode navigation map
.onboard-flow__stroke           finite SVG path cue
.onboard-flow__paper            finite small sheet transform
```

## Verification before shipping

Measure all three pages at 320 × 568, 390 × 844 and 1440 × 900, plus a
320 px width with enlarged text. No horizontal overflow, clipped copy,
unreachable action, touch target under 44 px or focus outline clipping.
Activate every scene with pointer and keyboard; check pressed state, live
caption, persistent selection on Back, immediate Next and skip from each
page. Blank optional name must still finish. Tutorial scenes must leave
lesson/history/mistake data byte-for-byte unchanged. With reduced motion or
the app preference off there must be no decorative animation. Run the
existing onboarding contract and automated accessibility checks, then
inspect actual light/dark screenshots rather than treating numeric checks
as the final visual review.

## Implementation and measurement results

The shared `createBrand` builder now provides the top compact mark and final
full wordmark. Each of the six scene illustrations is assembled from SVG
nodes, with semantic colors inherited from the application. A finite sheet
entry, line drawing and selected-state cue respond to the user's choice;
the closing brand dot settles once. There are no tutorial loops or timers.
All meaningful text is available on the first frame.

The measured final tour heights are **649 px at 320 × 568** (96 px less than
the baseline), **682 px at 390 × 844** (71 px less) and **698 px at 1440 ×
900**. The final optional-name page measures 511, 503 and 514 px respectively.
The 320 px short screen still scrolls: its action is reachable without an
overlay or clipped text. All six scene changes keep the main action's
position stable at default text size. The diagram gets smaller on short
screens; body and control type does not.

At 200% root text size, the three scene choices wrap to one column. The full
wordmark remains inside its measure, and Back/Next can wrap to separate rows.
That last rule fixes a real intrinsic-width overflow found after adding the
forward arrow to the primary action; the action's text is not shrunk.

`tests/onboarding_interaction_browser.py` adds four checks covering geometry
at 320/390/768/1440 px, 200% text, immediate rapid choices, finite animation,
live cancellation, stored-off state and OS reduced motion. All four passed.
The existing `reading_system.py` suite owns keyboard choice semantics,
optional name, page/back/skip behavior and learning-storage isolation.

An additional axe-core 4.10.3 run inspected all three pages in both themes at
320 and 1440 px: **12 cases, zero reported violations**. Gradient contrast is
reported by axe as requiring manual review, not as a verified pass; the
shared palette checker owns those measured composite bounds. Actual dark and
light screenshots were inspected after the geometry fixes. These are
Chromium viewport checks, not a claim of physical iPhone testing.
