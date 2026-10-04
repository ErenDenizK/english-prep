# Independent presentation audit — v0.71

4 October 2026. Starting release: `cfa4089` (v0.70). This pass concerns interface
presentation and scrolling. It does not change articles, questions, explanations,
answer scoring or the preserved versions. [ADR 010](../adr/010-living-scenes-and-navigation.md)
records the decisions; [validation](../VALIDATION.md) records the combined release
checks from all agents.

## 1. Reproduce the reported problems

A controlled 2.1-second font request delay reproduced the premature entrance:
home effects began around 229ms and ended around 589ms, while Inter completed
around 2154ms. Onboarding began around 196ms, ahead of first contentful paint at
236ms, and its font completed around 2143ms. These are local browser timings under
a deliberate test delay, not production network measurements. Simply stretching
the old entrance would not make it reliably visible.

Independent header geometry also reproduced the horizontal drift. At 390px,
Education/Test titles sat about 3.1px left of center, Profile 43.5px right, and the
lesson title 38.2px right. Different side controls were changing the center of the
remaining space. The corrected equal outer tracks center the title on the header.

## 2. Test readiness without making interaction wait

`tests/v071_motion_browser.py` contains eight browser tests, all passing against
the final local interface in Chromium with service workers blocked:

| Test | Evidence |
| --- | --- |
| Cold typography | With an 850ms delayed font response, onboarding effects start only after the real Inter response completes; the observed targets are visible and the font status is loaded. |
| Image readiness and replacement | Delayed real About captures are decoded and visible before their entrance. A rapid Apply → Return selection cancels the older decode callback; only the current scene starts. |
| Visibility and input priority | An offscreen scene does not consume its entrance. It starts once after entering view. A real pointer event cancels an unresolved arrival before its readiness promise resolves. |
| One preference | Education, Test, onboarding and About expose no motion toggle. Profile exposes one; its saved off state reaches About with no running finite effects or aurora animation. |
| Stable mobile chrome | Twelve combinations of 320/390/768px and Education/Test/Profile/lesson keep the title centered within 1px, side controls separate, header height stable and horizontal overflow absent. |
| Real capture density | All four phone captures contain 1170×2532 pixels; all four wide captures contain 2880×2000 pixels. The browser selects the phone/wide family at the actual responsive breakpoint. |
| Native narrow scrolling | The narrow rail is passive and absent from the accessibility tree. Ordinary wheel and Page Down continue to scroll the article; no horizontal overflow appears. |
| Desktop rail | A 44px control supports End/Home/Page Down, drag and Escape rollback. Its accessible percentage agrees with native scroll position after the next paint. Forced colors restores the native scrollbar. |

A test initially sampled the accessible rail value in the same instant as the
native scroll changed, before the scheduled paint. Waiting for that next value
update corrected the observation; no artificial input delay was added to the app.
The other agent suites separately exercise rapid menus, answers, lesson progress,
result recording, reduced motion, hidden pages and restored quiz sessions.

## 3. Audit semantics, then correct a real defect

Axe-core 4.10.3 scanned 24 states at 320px and 1440px: About hero, both alternative
study stages, both alternative architecture layers, expanded disclosures, all
three onboarding pages, Profile settings, a lesson and the Test library. Tags
included WCAG 2 A/AA, WCAG 2.1 AA, WCAG 2.2 AA and best practices.

The first pass found the new desktop scrollbar outside a landmark in nine
states. Its fixed visual placement is retained, but an appropriately named
navigation landmark now contains it. The repeated 24-state pass reports **zero
definite violations**. Passive narrow rails remain hidden from accessibility
APIs rather than adding a navigation landmark with no controls.

Axe still returned **301 incomplete node checks**: 297 contrast cases and four
closed-popup `aria-controls` references. These are not counted as passes. The
four popup IDs were checked against actual DOM targets: the targets exist and
are intentionally hidden while their comboboxes are collapsed. Gradient contrast
requires the separately executed numerical palette checks; an automated semantic
scan cannot certify the moving background or preference for its appearance.

## 4. Preserve content and state

A SHA-256 manifest taken before this pass covered **85 files** across `data/`,
`original/` and `legacy/`. The final comparison found the same files and identical
bytes, with no additions, removals or modifications. Screenshot demonstration
progress is generated in isolated browser contexts; it does not alter material.

The adaptive rail scrolls the existing surface and uses existing section
landmarks. It does not select quiz answers, jump questions, mark lessons complete,
intercept the reading area's wheel events or introduce scroll snapping. The
mobile indicator preserves the reading column instead of placing a wide drag
hitbox over text. [Rail design](../design/scroll-rail-v071.md) documents its bounds
and cleanup behavior.

## Manual follow-up on the owner's devices

1. Open the introduction with motion on, select each diagram, move between pages
   immediately and skip while artwork is still moving. Judge its pace while
   reading rather than waiting for every stroke.
2. Browse About on a phone and a computer. Change study stages before a capture
   has finished loading, expand features and return to the current stage.
3. Read a long article normally. On desktop, hover/focus the rail, drag it, cancel
   a drag with Escape and select a section. On a phone, use ordinary scrolling.
4. Compare a completed, incomplete and zero-correct test result; the presentation
   should remain honest about the result, with no success cue for an error.
5. Disable motion in Profile and revisit both the introduction and About. Try the
   operating system's reduced-motion setting as well.

This is desktop Chromium automation with emulated viewports and selected media
preferences. It does not establish physical iPhone/Safari behavior, VoiceOver or
TalkBack usability, prolonged reading comfort, battery consumption or universal
animation preference. The source research and the atmosphere's controlled pixel
measurements are documented in [motion research](../research/2026-10-motion-v071.md).
