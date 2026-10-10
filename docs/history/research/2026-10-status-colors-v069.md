# Answer status colors — v0.69

Research and measured proposal, 4 October 2026 (Türkiye time). Scope: presentation
only. No lesson, question, explanation, answer key or scoring behavior changes.

## What is wrong with the current treatment

v0.68 assigns iris to a correct answer and apricot to an incorrect answer. Both
pass contrast checks, but passing contrast does not establish meaning. Iris also
appears in the brand's secondary actions; apricot appears in the mistake notebook
and attention details. Those roles make the result of answering feel ambiguous.
The existing neutral option surfaces are useful: the entire sentence need not
become a red or green rectangle to report a result.

Earlier conventional red/green feedback was also rejected. Returning to its
saturated fills and borders would repeat the same mistake. The proposal keeps
recognizable semantic families while adjusting chroma, luminosity and the amount
of colored area for this particular Sakura interface. It is a design hypothesis,
not a claim that every user universally understands these hues.

## Evidence reviewed

The live Radix, Carbon, Fluent and W3C documentation hosts returned proxy 403
responses in this environment. The following official source files were retrieved
successfully and read on 4 October. The measurements below are local calculations
and real Chromium renders of this application, not claims to have visually
inspected those inaccessible live sites.

| Official source | Relevant observation | Consequence here |
| --- | --- | --- |
| [Fluent status mapping](https://github.com/microsoft/fluentui/blob/master/packages/tokens/src/statusColorMapping.ts) | `success: green`, `warning: orange`, `danger: cranberry` are semantic aliases separate from brand. | A warning-like apricot is a poor default for an incorrect answer. Keep status and brand roles distinct. |
| [Fluent dark status tokens](https://github.com/microsoft/fluentui/blob/master/packages/tokens/src/alias/darkColorPalette.ts) and [light status tokens](https://github.com/microsoft/fluentui/blob/master/packages/tokens/src/alias/lightColorPalette.ts) | Foreground, background, border and interaction states receive distinct tonal values; success/danger have specific contrast overrides. | Do not put one hex value into text, fill and border roles indiscriminately. Measure the actual theme and background. |
| [Radix scale use cases](https://github.com/radix-ui/website/blob/master/data/colors/docs/palette-composition/understanding-the-scale.mdx) | Steps 1–2 are backgrounds, 3–5 component states, 6–8 borders, 9–10 solid fills, 11–12 text. | Status text needs a contrasting foreground; a quiet tint is a separate surface. This is not a reason to color a whole answer paragraph. |
| [Radix dark scales](https://github.com/radix-ui/colors/blob/main/src/dark.ts) and [light scales](https://github.com/radix-ui/colors/blob/main/src/light.ts) | Jade, teal, red, ruby and tomato expose full tonal ranges rather than a single “accessible color.” | Compare restrained variants on the actual plum-neutral planes. Do not copy a scale's text value and assume it works on another brand's surfaces. |
| [WCAG 1.4.1 — Use of Color](https://github.com/w3c/wcag/blob/main/understanding/20/use-of-color.html) | Visible shape or text must carry information in addition to color. Color contrast alone cannot establish an identifiable specific hue. | Preserve distinct check/cross shapes, visible Doğru/Yanlış verdicts, the correct-answer sentence and the existing screen-reader announcement. |

## Three candidates

All candidates were rendered through the application's actual `renderOptions`
and `renderAnswerFeedback` functions, using the unchanged `modals-t1` question and
its existing wrong answer. Raw `correctIndex` was normalized to `correctAnswer`,
as the real topic loader does. The same Inter sizes, neutral option borders and
reading width were used for all three. Dark and light specimens were inspected.

| Candidate | Dark correct / incorrect | Light correct / incorrect | Assessment |
| --- | --- | --- | --- |
| **A · jade / warm coral** | `#96cbb8` / `#e5aaa5` | `#2b6557` / `#9f3f48` | Recommended. Jade is clearly distinct from the pink brand; warm coral is less pink than the primary action and less orange than a warning. |
| B · teal / rose | `#8fc9c5` / `#e7a6b5` | `#1e6965` / `#9c3654` | Passes contrast, but rose error approaches the Sakura action hue too closely. |
| C · sage / clay | `#afc6a5` / `#e5b09c` | `#51683f` / `#94513c` | Passes contrast, but clay retains too much of the rejected apricot's attention/warning character; sage looks duller beside the brand. |

The recommended dark jade is approximately OKLCH `0.800 0.061 170.6°`; warm
coral is `0.792 0.070 24.3°`. For comparison, the official Radix dark jade text
step is approximately `0.785 0.156 167.1°`, and dark red text step
`0.780 0.128 22.1°`. The proposal preserves those semantic hue families with
substantially lower chroma, rather than neon status signals. These are descriptive
coordinates, not a color-vision safety threshold or a WCAG metric.

The Sakura dark action is approximately `0.770 0.110 357.8°`. Candidate B's error
hue is `3.8°`, only around six degrees from that brand action; A's is `24.3°`.
That is one reason to prefer A. Hue separation is supportive evidence only:
visible words and shapes still carry the result.

## Measurements

Ratios use WCAG's relative luminance formula with sRGB linearization. Opaque
surfaces include page, card, raised, editorial wash, brand tint and both status
tints. Aura measurements enumerate all 15 ordered single, double and triple
composites of the existing three fields at their maximum permitted alpha
(`0.10` dark, `0.05` light), without rounding intermediate RGB channels. The
values below are the lowest ratio in each set; colored short text must exceed
4.5:1 and essential glyphs 3:1. Main prose remains a separate neutral role.

| Candidate / theme | Correct, opaque | Incorrect, opaque | Correct, aura | Incorrect, aura |
| --- | ---: | ---: | ---: | ---: |
| **A · dark** | **8.02:1** | **7.39:1** | **7.26:1** | **6.69:1** |
| **A · light** | **5.67:1** | **5.36:1** | **5.43:1** | **5.13:1** |
| B · dark | 7.87:1 | 7.30:1 | 7.13:1 | 6.62:1 |
| B · light | 5.38:1 | 5.73:1 | 5.16:1 | 5.49:1 |
| C · dark | 7.92:1 | 7.63:1 | 7.21:1 | 6.94:1 |
| C · light | 5.17:1 | 5.02:1 | 4.95:1 | 4.81:1 |

Candidate A's status tint surfaces also preserve the existing neutral text and
control roles. Across its opaque surfaces, dark main/supporting text remain at
least 12.18:1 / 7.94:1, and essential boundaries 3.53:1. Light remains at least
11.92:1 / 5.67:1 / 3.36:1. Aurora bounds are unchanged: dark 11.03:1 / 7.18:1 /
3.19:1; light 11.42:1 / 5.43:1 / 3.22:1. The aura is not placed over opaque cards.

## Exact recommended tokens

| Token | Dark | Light |
| --- | --- | --- |
| `--ok` | `#96cbb8` | `#2b6557` |
| `--no` | `#e5aaa5` | `#9f3f48` |
| `--ok-tint` | `#202b28` | `#eaf3ef` |
| `--no-tint` | `#302326` | `#f8eceb` |

These are the only status tokens to change. Cherry, Sakura, iris accents and the
apricot attention role remain available for their existing non-verdict jobs.
An answer's correctness must not be communicated using `--tertiary`.

## Treatment and interaction

- Keep the English option text in `--ink`. Its content and size do not change
  when answered. Keep the already-reserved trailing status column to avoid
  rewrapping or moving the learner's next target.
- Use the semantic color on the check/cross and the short verdict. Keep the
  number readable. A small tint behind the key or the short verdict can connect
  it to its state; do not tint every line of an explanation or add another large
  bordered feedback card.
- Keep the visible word **Yanlış**, not a vague “try again” in a quiz that commits
  an answer once. An incorrect choice is recorded immediately; the learner needs
  an honest result plus the useful explanation already supplied by the content.
- A correct check may draw once, briefly; the incorrect cross should appear
  calmly. No wrong-answer shaking, flashing red border, growing sentence or
  disabled/low-contrast explanation. Motion never postpones scoring, the fixed
  action, focus or the announcement.
- A correct answer that was not selected still needs its check, so the learner
  can locate the answer independently of the colored verdict below.
- Forced-colors and reduced-motion must keep all words and shapes. Chromatic
  difference is not counted as a second non-color cue.

## Implementation acceptance

Update the three explicit palette blocks together, then run the actual-CSS
palette checker, including all surfaces, aura bounds and action gradients.
Verify correct, selected-wrong and untouched options at 320, 390 and desktop;
correctness must not change their geometry. Inspect neutral, correct and wrong
feedback in light/dark and forced-colors. Confirm no source material diff.
The candidate comparison is a design evaluation, not user research; the user's
next manual review remains the evidence for whether the emotional tone is right.

## Independent implementation review

After ADR 008 selected candidate A, a second browser pass inspected the actual
lesson pretest rather than a fabricated color chart. Twelve fresh outcomes
covered dark/light × 320/390/1440px × correct/incorrect. All option widths,
heights and English strings were identical before and after committing an
answer. Computed English text remained the neutral main text color, option
surfaces remained opaque card color, and shortcut keys remained secondary text
on transparent backgrounds. The earlier skinny colored ovals are gone.

The revealed check/cross and literal Doğru/Yanlış verdict use the selected
jade/coral tokens. Revisiting an answered option also exposes its Turkish
correctness and chosen-state description through `aria-describedby`, without
changing the English option's name. Two additional forced-color specimens
retained the distinct shapes and explicit verdict. A faint inherited SVG color
in the feedback heading was corrected to an explicit system-color override;
the follow-up browser check confirmed both its computed color and stroke resolve
to black `CanvasText` on the white forced-color canvas.

The actual stylesheet checker passed **4,524 contrast pairs**: 154 opaque,
330 atmosphere bounds and 4,040 action-gradient samples. Searches found no old
iris status token in the current palette. Apricot remains deliberately as
`--tertiary` for attention/decorative roles; computed answer/verdict colors do
not use it. Historical rules in the underlying stylesheet do not override the
new computed answer state.

The About page's primary-action hover also brightens its whole control by
1.025. An independent 101-stop sRGB calculation including that filter found a
minimum label contrast of **7.63:1 dark / 6.13:1 light**. Its pointer reflection
is a separate art-only effect: it must stay behind screenshots, away from live
captions and controls. At its maximum 14% alpha over the worst existing aura,
supporting text could fall to 5.49:1 dark / 4.44:1 light. The final geometry
therefore excludes text rather than treating that reflection as another safe
text background. A 200px lower inset gives zero intersection with live captions
or orbit labels at 320, 360, 375, 390, 430, 650, 768, 1000 and 1440px. The
tightest measured caption clearance is 15.98px at 360px. This is a boundary
condition for future About edits, including any future light presentation of
that currently dark page.

## Prioritized follow-up opportunities

1. **Observe the core return journey with target learners.** Give several
   intermediate learners an unfamiliar distinction, one incorrect answer and
   a return-to-lesson task. Record wrong turns, ability to explain the verdict,
   and whether they find the relevant article and motion setting. Test hue
   preference separately from answer comprehension; no visual pass substitutes
   for this evidence.
2. **Profile motion on physical phones.** Check a representative older Android
   device and iPhone Safari under low-power mode, enlarged text and keyboard
   opening. Measure input latency and long animation frames while changing
   menus, introductory scenes and quiz questions. Use the findings to simplify
   effects that cost responsiveness; desktop Chromium emulation cannot certify
   actual device smoothness.
3. **Check hierarchy during sustained reading.** Observe a longer lesson and a
   later resume. Ask users what the progress track means and where they would
   go next. Refine spacing, control wording or affordance prominence only when
   those observations show a problem. Preserve teaching text and avoid adding
   another dashboard, reward system or onboarding step by default.
