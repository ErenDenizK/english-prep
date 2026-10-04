# Filled answer surfaces — v0.70

Research, comparison and implementation, 4 October 2026 (Türkiye time).
Scope: presentation only. No teaching text, option order, answer key, scoring or
storage behavior changes. This deliberately revisits v0.69's status treatment
following the owner's request for stronger full-row color and a pink-correct
experiment. The previous neutral answer cards are not a product requirement.

## Evidence and interpretation

The following official source documents were retrieved and read on 4 October.
These are source-document reviews, not claims to have conducted user research or
visually inspected every corresponding live application.

| Source | Evidence | Application to this product |
| --- | --- | --- |
| [WCAG 1.4.1, Use of Color](https://github.com/w3c/wcag/blob/main/understanding/20/use-of-color.html) | Meaning needs another visible cue such as shape or text; using color is encouraged when complemented by those cues. A specific hue cannot be identified by a contrast ratio alone. | Keep the check/cross, literal **Doğru / Yanlış**, correct-answer sentence and accessible state descriptions. Pink is permissible; pink is not universally understood as correct. |
| [WCAG 1.4.11, Non-text Contrast](https://github.com/w3c/wcag/blob/main/understanding/21/non-text-contrast.html) | Essential control/state indicators need 3:1 contrast against adjacent colors. | Measure both sides of a colored option border, its glyph and the focus outline. A readable sentence does not establish a readable boundary. |
| [Radix, Understanding the scale](https://github.com/radix-ui/website/blob/master/data/colors/docs/palette-composition/understanding-the-scale.mdx) | Component backgrounds, borders, solid fills and text occupy different tonal roles. Soft tinted controls are a supported treatment. | Give the full answer row an opaque tint, a distinct softer border, and a contrasting short verdict. Keep long English sentences neutral. |
| [Carbon, Notification usage](https://github.com/carbon-design-system/carbon-website/blob/main/src/pages/components/notification/usage.mdx) | Feedback should consider context and emotional tone. Carbon conventionally maps success to green and failure to red, using icons as well. | A conventional mapping is useful prior evidence, not a requirement to repeat colors this owner rejected. An incorrect study answer is feedback in a learning task, not a critical system failure. Its honest label stays **Yanlış**. |
| [Fluent status aliases](https://github.com/microsoft/fluentui/blob/master/packages/tokens/src/statusColorMapping.ts) | Success, warning and danger are separate semantic roles. | Keep `ok`/`no` aliases separate from the brand tokens even where success intentionally belongs to the Sakura family. Do not derive every state from one primary hex value. |

None of these sources establishes that this particular audience prefers pink.
The choice below combines the owner's stated direction, real component
comparisons, accessibility constraints and visual judgment. Manual feedback from
learners remains necessary to validate its emotional effect and learnability.

## Three actual-component candidates

Each candidate was rendered in dark and light using the app's unchanged
`modals-t1` question, `renderOptions` and `renderAnswerFeedback`. The specimens
used the same typography, full-row opaque tints, neutral English text and reserved
check/cross column. The experiment changes color, not content or geometry.

| Candidate | Correct treatment | Incorrect treatment | Decision |
| --- | --- | --- | --- |
| **A · Sakura / periwinkle** | Pink surface and check connect an understood distinction to the existing Sakura identity. | A cooler periwinkle surface and cross distinguish the recorded incorrect choice without a punitive red rectangle. | **Selected after reviewing both real dark/light specimens.** Stronger brand connection and visibly different surface families; words and shapes carry semantics. |
| B · Jade / berry | Full muted jade surface, a larger use of v0.69's semantic family. | Berry surface close to the brand's pink. | Technically viable, but it keeps much of the rejected green-answer character and spends the signature pink on the wrong choice. |
| C · Lilac / ochre | Full lilac surface, supported by the secondary palette. | Warm ochre surface. | Technically viable, but it resembles the earlier iris/apricot direction and gives incorrect answers an attention/warning character the owner had already questioned. |

Minimum neutral prose / supporting-text contrast across each candidate's opaque
surfaces, calculated before selecting A:

| Candidate | Dark prose / support | Light prose / support |
| --- | ---: | ---: |
| A | 11.43:1 / 7.44:1 | 11.89:1 / 5.65:1 |
| B | 11.06:1 / 7.21:1 | 11.92:1 / 5.67:1 |
| C | 11.00:1 / 7.17:1 | 11.89:1 / 5.65:1 |

The raw local specimens are `candidate-dark.png` and `candidate-light.png` in
`/tmp/ep70-answer-surfaces/`; these are working evidence, not product assets.
The production tokens and validator below preserve the chosen implementation
without relying on those temporary files.

## Selected roles

| Token | Dark | Light, including system light |
| --- | --- | --- |
| `--ok` — correct check and short verdict | `#eeb4d1` | `#953b67` |
| `--no` — incorrect cross and short verdict | `#b6c6ed` | `#405f94` |
| `--ok-tint` — complete correct answer surface | `#392532` | `#fae5ef` |
| `--no-tint` — complete incorrect answer surface | `#252d42` | `#eaf0ff` |
| `--ok-edge` — correct boundary | `#bb8ca4` | `#b16b8d` |
| `--no-edge` — incorrect boundary | `#8d9bbd` | `#657fac` |

The background is opaque: moving atmosphere never passes over the English
answer. It occupies the complete existing answer rectangle, so the result is
more visible without adding another card or highlight. The border is softer
than the semantic text color; the correct border is approximately a 72% sRGB
mix of verdict color over its fill. The light incorrect border was deliberately
darkened beyond that mix after measurement: the first `#7088b2` proposal fell to
**2.88:1** against the worst permitted atmosphere. The final `#657fac` reaches
**3.25:1** there. That adjustment is evidence-driven, not a visual preference
presented as a rule.

Answer sentences and shortcut numbers keep their existing neutral roles.
Unselected incorrect alternatives remain neutral. The selected incorrect row
and the correct row receive color; the explanation remains normal reading
prose. No shake, moving hitbox, pulsing wrong state or fading sentence accompanies
this treatment. A finite glyph cue may reinforce the immediate committed result.
A correct row is still marked when the learner selected another option.

## Measurements and acceptance

Ratios use WCAG relative luminance with sRGB linearization and unrounded
intermediate channels. All three existing aura fields are bounded at their
existing 0.10 dark / 0.05 light per-field opacity. The validator enumerates all
15 permitted ordered overlaps; the selected answer fills themselves are opaque.

| Final state | Neutral sentence on fill | Shortcut on fill | Glyph on fill | Border on own fill | Focus on fill |
| --- | ---: | ---: | ---: | ---: | ---: |
| Dark correct | 11.80:1 | 7.69:1 | 8.14:1 | 4.98:1 | 7.92:1 |
| Dark incorrect | 11.43:1 | 7.44:1 | 8.02:1 | 4.93:1 | 7.68:1 |
| Light correct | 11.89:1 | 5.65:1 | 5.65:1 | 3.27:1 | 5.24:1 |
| Light incorrect | 12.49:1 | 5.94:1 | 5.61:1 | 3.55:1 | 5.50:1 |

Across all surrounding opaque and atmosphere planes, the limiting final border
contrast is **4.66:1 dark / 3.14:1 light**. Main/supporting text across the entire
permitted palette and atmosphere still reaches **11.03:1 / 7.18:1 dark** and
**11.42:1 / 5.43:1 light**. These numerical thresholds establish contrast, not
comprehensive usability or color-vision certification.

The [production validator](../../tools/editorial-palette.mjs) now also checks the
semantic boundaries, glyphs and 101 sRGB samples between neutral/hover surfaces
and each answer tint, including prose, shortcut, focus and boundary roles. These
samples bound that explicit interpolation model; they do not claim to measure
every browser's animation interpolation or the complete motion system. Current
answer rendering commits the final state immediately. The shared motion system
is reviewed separately. The validator passes **7,848 contrast pairs**: 154
opaque, 330 atmosphere, 4,040 primary-action gradient and 3,324 answer checks.
Two [negative fixtures](../../tests/answer-palette.test.js) prove it rejects an
answer boundary that disappears into its tint even when its glyph stays legible.

A production-CSS Chromium check covers dark/light × 320/390/1440px ×
correct/incorrect: **12 actual pretest outcomes**, preserving option dimensions,
English strings, chosen-button focus and zero horizontal overflow. Turkish
`aria-describedby` state descriptions remain outside the English option name.
Two grayscale and two forced-color specimens retain the check/cross and literal
verdict. Grayscale demonstrates why hue is not relied upon: the surfaces become
similar gray values while the verdicts remain distinguishable. It is not a
substitute for testing with people who have color-vision differences or on
physical displays.


## Final surface-motion integration

The result, verdict and glyph commit immediately. Its opaque surface and border
then interpolate for 220ms from the neutral row to the selected tokens; row/text
opacity remains1 and the row never transforms. Actual production CSS keyframes
were confirmed active, after removing inherited `animation: none !important`
from the old answer rules. Global motion-off/OS reduction remains authoritative.

An independent Chromium audit sought seven timeline positions for each outcome
and theme:28 actual frames,140 contrast pairs. Text minima were11.43:1 dark and
11.89:1 light; boundary minima4.15:1 and3.27:1. All dimensions remained constant.
Four off/reduced cases revealed final colors immediately; two forced-color cases
preserved boundaries/check/cross. This browser sampling supplements the checker’s
101-position sRGB model; it does not claim exhaustive cross-browser color rendering.
