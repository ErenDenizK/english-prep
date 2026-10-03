# Sakura, cherry, and a measured multi-accent palette

Research date: 2026-10-04. Starting interface: v0.67, `c92be0c`. This document is research and an implementation recommendation; the integrated application's validation is recorded separately.

The owner's feedback is specific: the blue-gray system feels too uniform, red/green answer rectangles feel unattractive, highlights interrupt the reading flow, and the brand lacks presence. The requested direction is cherry/pink/sakura with restrained atmosphere. Passing contrast previously did not resolve these aesthetic and structural problems. This round keeps the established type roles and changes the **distribution and jobs of color**, not the curriculum or the meaning of progress.

## What was inspected

Official sources were retrieved over the network. Measurements below are calculations of supplied source tokens and English Prep candidates, not computed styles of the public Radix/Primer/Material websites. No user preference, reading-speed, or color-vision study was conducted.

| System / evidence | Actual source observation | Applicable lesson |
| --- | --- | --- |
| [Radix dark scales](https://github.com/radix-ui/colors/blob/main/src/dark.ts), [scale roles](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale) | Mauve1/2/3 are `#121113`, `#1a191b`, `#232225`; mauve11/12 are `#b5b2bc`, `#eeeef0`. Crimson11/12 are `#ff92ad`, `#fdd3e8`; pink11 is `#ff8dcc`; iris11 is `#b1a9ff`. Steps 1–2 are background, 3–5 component fills, 6–8 borders, 9–10 solid accents, 11–12 text. | A coordinated palette contains different tone roles. A vivid brand swatch is not automatically an appropriate paragraph color, background, border, and button label. |
| [Radix palette composition](https://www.radix-ui.com/colors/docs/palette-composition/composing-a-palette) | A neutral scale close to the accent hue can make the system more cohesive; the guidance also cautions against strongly saturated dark grays when many colored components are present. App text can use neutral scales while marketing text can use accent scales. | Use near-neutral plum charcoal, not a purple wash over every article. Make the product story more expressive than sustained lesson prose. |
| [GitHub Primer foreground roles](https://github.com/primer/primitives/blob/main/src/tokens/functional/color/fgColor.json5), [background roles](https://github.com/primer/primitives/blob/main/src/tokens/functional/color/bgColor.json5), [dark primitive values](https://github.com/primer/primitives/blob/main/src/tokens/base/color/dark/dark.json5) | `default`, `muted`, `accent`, `success`, `attention`, `danger`, `done`, and `sponsors` are distinct roles. `done` uses purple (dark: `base.color.purple.4`), while `success` remains green and sponsors uses pink. Muted fills are separate from their foreground labels. | Completion need not always be green. Context, naming, and iconography make a semantic system coherent. This does **not** establish that purple is universally understood as a correct quiz answer. |
| [Material Web color roles](https://github.com/material-components/material-web/blob/main/docs/theming/color.md), [Material tonal-spot implementation](https://github.com/material-foundation/material-color-utilities/blob/main/typescript/scheme/scheme_tonal_spot.ts) | Primary, secondary, tertiary, error, neutral, container, outline, and corresponding on-colors have explicit roles. Tonal Spot is described as low-to-medium colorfulness with a related tertiary palette. | Three chromatic families can coexist without painting all UI with three equal accents. Every filled action needs a tested on-color; borders and text need separate contrast targets. |
| [WCAG use of color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html), [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) | A state needs an additional visual indication when hue communicates meaning; necessary component/state boundaries need sufficient contrast. Decorative boundaries are different from necessary boundaries. | Keep visible words and ✓ / ×. Do not rely on iris versus apricot being distinguishable by every person. Removing a decorative rectangle does not license an invisible interactive boundary. |

The raw official pages successfully retrieved for this research include Radix's `src/dark.ts` and `src/light.ts`, the two Radix documentation MDX files, Primer's functional foreground/background/border JSON5 files and dark primitive file, Material's color document, and W3C understanding documents. Early guessed repository paths returned 404; those nonexistent files are not evidence. Source revisions can change; the values quoted above are the retrieved snapshot, not a promise about future upstream versions.

## Three complete candidates

The three candidates use the same type and spacing roles. Their neutral and chromatic values were independently evaluated with the repository's `wcagContrast`, `apca`, and `hexToRgb` helpers. Values are sRGB, with no reliance on Display-P3 support. Candidate A's supporting ink was raised slightly during the aurora calculation; this is included in the final figures.

| Role | A: cherry + iris | B: ink + vivid rose | C: cocoa + rose |
| --- | --- | --- | --- |
| Canvas | `#141216` | `#10141c` | `#191415` |
| Surface / raised | `#1d1a20` / `#28242c` | `#191e28` / `#242b37` | `#231d1e` / `#2f282a` |
| Main / supporting text | `#eee9ed` / `#c6bcc6` | `#ebeef6` / `#b6c0d0` | `#f0e9e7` / `#c4b7b8` |
| Primary / secondary fill | `#ed96b4` / `#dca2d8` | `#f291bd` / `#bbadf4` | `#eaa1ad` / `#d7aed2` |
| On-primary | `#301b27` | `#271a2f` | `#342027` |
| Accent text | `#efb1cb` | `#f3b2d1` | `#f0bcc8` |
| Correct / retry marker | `#bbb6f2` / `#e9bb95` | `#b5b8ff` / `#edb895` | `#c3b3e8` / `#e8ba8c` |
| Essential boundary | `#847988` | `#7989a0` | `#8c7b7f` |
| Worst opaque body contrast | 12.18:1 | 12.26:1 | 11.55:1 |
| Worst opaque supporting contrast | 7.94:1 | 7.75:1 | 7.13:1 |
| Worst opaque boundary contrast | 3.53:1 | 4.00:1 | 3.46:1 |
| Worst filled-label contrast | 7.34:1 | 7.50:1 | 7.38:1 |

Opaque minima check canvas, card, raised, accent tint, correct tint, incorrect tint, and editorial wash. Filled labels are checked against both ends of the selected fill pair. APCA is a supplementary diagnostic, not a replacement for WCAG or a certification of the interface.

**Recommend A.** Its slightly plum neutrals join cherry, blossom, and iris without retaining B's distinctly blue backdrop. C is viable but more earthy and less clearly separated from the existing warm neutral reference. A's stronger pink is assigned to action and brand, not every heading. These are aesthetic/product judgments informed by the requested direction; the contrast table alone does not prove A looks better or is more comfortable.

## Production role map

The palette has four related jobs: cherry for intention/brand, blossom for quiet emphasis, iris for confirmed/completed states, and apricot for an answer that needs another look. It is **not** a requirement to put all four colors into each viewport.

| Token / role | Dark | Light |
| --- | --- | --- |
| `page` | `#141216` | `#fbf7fa` |
| `card` | `#1d1a20` | `#ffffff` |
| `raised` | `#28242c` | `#f0eaf0` |
| `ink` | `#eee9ed` | `#302831` |
| `ink-2`, `editorial-note` | `#c6bcc6` | `#625864` |
| `hairline` — decoration | `#39313d` | `#e2d8e2` |
| `edge` — necessary control boundary | `#847988` | `#887b88` |
| `accent` — cherry action/brand | `#ed96b4` | `#a13462` |
| `accent-2` — related blossom endpoint | `#dca2d8` | `#854987` |
| `accent-ink` — opaque filled action label | `#301b27` | `#ffffff` |
| `accent-text`, `editorial-mark` — blossom emphasis | `#efb1cb` | `#922e55` |
| `accent-tint` — selected surface, sparingly | `#30222d` | `#f6e7ed` |
| `focus` — visible interaction focus | `#d4b5f8` | `#7848af` |
| `ok` — correct/completed marker | `#bbb6f2` | `#654bb0` |
| `no` — incorrect/retry marker | `#e9bb95` | `#92501f` |
| `ok-tint` — exceptional small contained state | `#262432` | `#eeebf9` |
| `no-tint` — exceptional small contained state | `#2f2725` | `#f7eee5` |
| `editorial-wash` | `#211b24` | `#f6eff5` |
| `secondary` — iris heading/support accent | `#c8b4e9` | `#7652a0` |
| `tertiary` — attention accent | `#e9bb95` | `#92501f` |

Use `ink` for actual teaching paragraphs, English examples, questions, answer text, and ordinary titles. A form label can receive a small blossom accent or marker while keeping its semantic size/weight. An index section eyebrow may use blossom; secondary feature headings may use iris. A colored micro-label must not become the only way to discover a group. Long paragraphs never become low-contrast pastel captions.

Color should be visible at **brand dot, primary action, active navigation, progress fill, selected short headings, and local feedback markers**. The neutral surface area remains dominant. Arbitrary area rules such as “60/30/10” are not accessibility requirements and do not decide a useful interface by themselves; task hierarchy and actual screen distribution matter.

### Answer states and highlights

- Keep option text in `ink` before and after answering. Preserve identical line wrapping and reserve icon space so feedback cannot move the next target.
- Use `✓ Doğru cevap` in iris and `× Seçtiğin yanıt` or another explicit incorrect verdict in apricot. The precise wording should stay pedagogically consistent with the existing feedback block. Wrongness cannot be communicated only by the warmer hue.
- Prefer neutral option surfaces with a local marker or thin state accent to a full green/red fill. Borders needed to identify the answer button remain at least 3:1. Do not stack an outlined card, outlined answer, colored fill, and badge around the same sentence.
- A lesson highlight can be a short inline underline/marker or an open callout with space. Keep background boxes for genuinely separate interactions, such as the pre-check; visual emphasis alone is not a reason to nest another card.
- Progress is a task fact: display a bar with a clear textual numerator/denominator or lesson/page description. A bare `%42` beside a long title has weak hierarchy. Do not imply mastery from reading progress or a tiny quiz sample.
- Destructive actions still need explicit language and confirmation where already required. The chosen apricot is not permission to make “reset history” look like an ordinary brand action.

Iris/apricot are deliberate alternatives to conventional green/red. Primer provides precedent for purple completion, but the quiz mapping remains a custom system that must be learned from words and glyphs. Neither color psychology claims nor colorblind simulation substitute for those cues.

## Aurora: broader coverage without a washed-out reading plane

The owner explicitly requests moving atmosphere on all screens. This supersedes the v0.67 decision to suppress it in lessons/quizzes. It is possible without using brighter text or unreadably colored paragraph backgrounds.

Recommended stops:

| Lobe | sRGB color | Maximum dark opacity | Maximum light opacity |
| --- | --- | --- | --- |
| Cherry | `#c65b88` | 0.10 | 0.05 |
| Iris | `#785ca8` | 0.10 | 0.05 |
| Warm blossom | `#c68571` | 0.10 | 0.05 |

Use three diffuse lobes in different positions on an independent, pointer-inert canvas layer. Root text remains above the effect. Cards, raised controls, and their interactive hit areas stay opaque; the effect may appear on the page canvas of lessons and quizzes, not only the home corner. Do not place an additional identical aura layer above it: the bound is for **three maximum stops total**, not three per nested region.

A darker, more chromatic stop makes the hue perceptible without the luminance jump of a very pale stop. The initial brighter stops (`#e67ca7`, `#a794e5`, `#e6a38d`) at 0.10 would reduce the neutral boundary to 2.74:1 at full overlap and fail the required 3:1. Those stops are rejected for the chosen opacity.

Compute each channel with normal sRGB source-over compositing: `out = alpha * stop + (1 - alpha) * background`. Evaluate all six stacking orders of three stops at their maximum opacity, then apply WCAG luminance to the unrounded composite. A gradient's spatially separate peaks normally overlap less than this bound, so the test is conservative. No screen blend mode, additive blending, animated brightness, or opacity above the cap is covered by it.

| Pair at worst three-stop overlap | Dark at 0.10 | Light at 0.05 |
| --- | --- | --- |
| Main text | 11.03:1 | 11.42:1 |
| Supporting text | 7.18:1 | 5.43:1 |
| Essential boundary | 3.19:1 | 3.22:1 |
| Accent text | 7.44:1 | 6.13:1 |
| Correct marker | 6.98:1 | 5.28:1 |
| Retry marker | 7.56:1 | 4.97:1 |
| Focus | 7.41:1 | 5.03:1 |

Dark main/support APCA magnitudes at the conservative bound are approximately 89.3/62.9. Opaque body text is at least Lc90.8. These diagnostics support the distinction between primary reading text and shorter supporting text; APCA does not authorize shrinking the established reading sizes.

Important constraints from the calculations:

- The same 0.10 aura **over a card** would lower its boundary contrast to 2.92:1. Cards must remain opaque above the aura.
- A 0.10 aura in the light theme would lower its boundary contrast to 2.75:1 and its retry text to 4.25:1. Light mode needs the 0.05 cap, not a copied dark effect.
- A 0.12 dark opacity would reduce the existing supporting text below the selected 7:1 project target. Do not raise opacity without recomputing all permitted text/control pairs.
- If a fill is a two-endpoint gradient, sample intermediate sRGB values as well as endpoints in integrated checks; endpoints alone are not a general proof for arbitrary color interpolation.

Movement can change perceived hue by the overlap of the fixed lobes. This is preferable to hue-rotating the entire page or shifting text colors. Slow transform/opacity movement stays within the tested colors and alpha bounds. No animated blur, background-position repaint loop, or continuous JavaScript loop is necessary.

Because continuous decorative motion runs beyond five seconds beside content, [WCAG Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html) supports a real, immediately available pause/stop control; reduced-motion handling alone is not its replacement. The implementation should share the preference across pages, honor reduced motion, and pause while the document is hidden. The exact timing/easing contract belongs in the motion research/ADR.

## Validation needed after implementation

The numerical result is a palette recommendation, not a whole-app accessibility verdict. Read the final CSS tokens into the checker; test both themes, all permitted surfaces, all maximum aura orders, and any new gradient labels. Verify the actual rendered hierarchy at 320/390/768/1440px, normal and forced colors, reduced motion, and text enlargement. Inspect both answer outcomes, a long selected option, introductory pre-check, current-lesson progress, profile/settings, onboarding, results, and the about page. Confirm state meaning survives grayscale/color loss through the label and glyph.

Keep the existing 18/20px reading/question roles from ADR006. Do not use increased color as a substitute for proper proximity, line length, or heading semantics. The owner should be able to see both more character and a calmer reading flow; neither is established by a contrast score alone.

### Reproducible palette guard

`node tools/editorial-palette.mjs` reads the actual dark, explicit-light, and system-light declarations in `css/editorial.css`. It checks 154 opaque role pairs, 330 atmosphere pairs (15 single/double/triple orders × 11 roles × two themes), and 4,040 action-gradient samples. The gradient is explicitly interpolated in sRGB and sampled every 1%, including both endpoints, for both label contrast and control visibility against opaque/aura surfaces. These are **numeric color comparisons**, not thousands of separate browser or usability tests.

An optional CSS-file argument supports isolated negative fixtures. During implementation, eight deliberately invalid fixtures were rejected: unreadable body text, system/explicit-light mismatch, excess aura opacity, brighter failing aura stops, an unreadable gradient endpoint, an unaudited gradient color space, an extra root override, and a scoped token override. The valid fixture and actual candidate-A CSS passed. Browser verification must still confirm that the aura is below opaque cards, that the three fields use the audited caps, and that no extra blend or filter changes the composed colors.
