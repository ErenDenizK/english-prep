# Color and ambient motion: measured alternatives

Research date: **4 October 2026**. This document recommends a direction; it is not a claim that implementation, device testing, or user testing has occurred. Scope: English Prep's mobile-first academic reading and topic-test application, dark theme first. The uncommitted draft present at the start of this research was a prototype, not an accepted decision.

## Recommendation

Use a cool, nearly neutral dark foundation with three surface levels, two clearly assigned neutral text roles, one blue-gray interactive accent, and separate subdued correct/incorrect colors. Choose the measured **A** palette below, with supporting text **`#b4bcc3`**, not the prototype's `#c7cccf`. Keep long teaching prose, English examples, answer sentences and answer explanations in the primary text color. Supporting annotations and short metadata may use the supporting color; a change of language alone does not justify a color change. Hierarchy must also come from type size, weight, space and semantic grouping, not progressively dimmer text.

A very faint aurora can provide identity around the application. Prefer a **single 3.6-second, 8px settling movement**, then a static background. This answers the request for a little movement without adding a persistent animation setting to a simple study app. Disable it for reduced motion and forced colors, and keep it outside opaque reading/quiz surfaces. These particular duration, displacement and alpha values are design choices to verify, not values prescribed by research.

## What was actually inspected

The following are real implementations or official guidance. Their source was read and numerical values were extracted. **The product comparisons are source-derived measurements, not live rendered-screen measurements.** Fetching a site's HTML alone does not establish its final theme or CSS. No participant study, eye-tracking measurement, device battery test or comparative reading-speed experiment was conducted.

| Comparison | Source and measured roles | What transfers to this app | What does not |
| --- | --- | --- | --- |
| **VS Code Dark Modern**, a mature information-dense desktop application | [Official theme JSON](https://raw.githubusercontent.com/microsoft/vscode/main/extensions/theme-defaults/themes/dark_modern.json), with explicit editor `#1f1f1f`, chrome `#181818`, primary `#cccccc`, supporting `#9d9d9d`, link `#4daafc`. | Neutral reading surface; chrome and content have distinct levels; readable supporting text and a separate interactive accent. | A code editor is not an academic lesson reader. Syntax colors, density and line-number dimming do not belong in teaching prose. |
| **GitHub Primer**, used by a production web application | Published [@primer/primitives 11.10.0](https://registry.npmjs.org/@primer/primitives/-/primitives-11.10.0.tgz), files `dist/css/functional/themes/dark.css` and `dark-dimmed.css`; source [base dark palette](https://raw.githubusercontent.com/primer/primitives/main/src/tokens/base/color/dark/dark.json5). Dark: page `#0d1117`, primary `#f0f6fc`, muted `#9198a1`. Dimmed: page `#212830`, primary `#d1d7e0`, muted `#9198a1`. | Semantic names for default, muted, accent, success, danger; different foreground/background pairs; quiet state fills distinct from strong action fills. Its two dark variants show there is no single universal dark background or white level. | GitHub's saturated success/danger colors must not be copied wholesale into large answer sentences. “Dimmed” is a theme variant, not proof of reduced fatigue for every learner. |
| **JupyterLab**, an academic/notebook work environment | [Official dark-theme variables](https://raw.githubusercontent.com/jupyterlab/jupyterlab/main/packages/theme-dark-extension/style/variables.css). Layout levels `#111`, `#212121`, `#424242`; content white and 70%-white supporting text; separate UI and content text tokens. | Explicit distinction between UI chrome and the material being read; separate roles are more useful than one universal text style. | Notebook cells, code, data grids and 13px dense controls serve a different task. The app should not inherit its UI density or all-white long prose automatically. |

Product pair contrast was recalculated using this repository's `wcagContrast` and `apca` functions in `tools/color.mjs`. Alpha text was composited over the listed surface before measurement, rounded to 8-bit sRGB. APCA is supplementary diagnostic output, **not** a WCAG 2 conformance rule or a substitute for font-size/weight assessment.

| Source-derived pair | Foreground / background | WCAG ratio | APCA magnitude |
| --- | --- | ---: | ---: |
| VS Code primary | `#cccccc` / `#1f1f1f` | 10.26:1 | 73.7 |
| VS Code supporting | `#9d9d9d` / `#1f1f1f` | 6.08:1 | 47.3 |
| VS Code link | `#4daafc` / `#1f1f1f` | 6.65:1 | 51.6 |
| Primer dark primary | `#f0f6fc` / `#0d1117` | 17.39:1 | 100.9 |
| Primer dark supporting | `#9198a1` / `#0d1117` | 6.50:1 | 45.8 |
| Primer dimmed primary | `#d1d7e0` / `#212830` | 10.28:1 | 78.6 |
| Primer dimmed supporting | `#9198a1` / `#212830` | 5.11:1 | 43.0 |
| Jupyter content primary | `#ffffff` / `#212121` | 16.10:1 | 105.6 |
| Jupyter content supporting, 70%-white | effective `#bcbcbc` / `#212121` | 8.48:1 | 64.0 |
| Jupyter UI supporting, 54%-white | effective `#999999` / `#212121` | 5.65:1 | 44.9 |

The useful finding is **role differentiation**, not an average hex value. All three separate context, content and action. Their substantially different primary contrast values also caution against claiming that a particular contrast ratio alone proves reading comfort.

## Principles and their limits

- [Material color roles](https://raw.githubusercontent.com/material-components/material-web/main/docs/theming/color.md) distinguish surfaces, foregrounds on those surfaces, outlines and semantic actions. Every application role needs a defined foreground/background pair, including selected and feedback states. A background token alone is not a palette.
- [Microsoft color guidance](https://raw.githubusercontent.com/MicrosoftDocs/windows-dev-docs/docs/hub/apps/design/signature-experiences/color.md) describes a calming neutral foundation, sparing accent use, lighter important dark-theme surfaces, and ambient-light effects. It does **not** establish that all dark interfaces reduce eye strain. A white page can be uncomfortable in darkness; a black one can be difficult in outdoor glare. A tested light option should remain available while dark is refined first.
- [WCAG contrast minimum](https://raw.githubusercontent.com/w3c/wcag/main/understanding/20/contrast-minimum.html) requires 4.5:1 for normal text and 3:1 for qualifying large text. This proposal uses an additional **product target** of at least 7:1 for primary and supporting text across the intended dark surfaces. Contrast is necessary, not sufficient: stroke weight, text size, line length and spacing still matter.
- [WCAG non-text contrast](https://raw.githubusercontent.com/w3c/wcag/main/understanding/21/non-text-contrast.html) requires meaningful control/state information to contrast sufficiently with adjacent colors. It does not require every divider or text-labeled button perimeter to be a bright 3:1 outline. Reserve the strong edge for an essential input boundary or state. Removing unnecessary article rules is compatible with accessibility.
- Color cannot be the sole correctness signal. Use a check/cross and a literal **Doğru/Yanlış** label, preserving readable neutral answer text. This supports color-vision differences and keeps a wrong answer from turning into a large red paragraph.

## Two viable candidate systems

Both candidates were measured; B is a legitimate alternative, not a deliberately failing comparison. A extends the supplied restrained dark references. B uses a warmer graphite foundation and a sage accent compatible with a more book-like direction.

| Role | A — cool neutral, recommended | B — warm graphite/sage |
| --- | --- | --- |
| Page / card / raised | `#121416` / `#1b1e21` / `#262a2e` | `#171615` / `#211f1d` / `#2c2926` |
| Primary text | `#e4e6e7` | `#e9e5df` |
| Supporting text | `#b4bcc3` | `#c4bdb5` |
| Decorative hairline | `#343a40` | `#393530` |
| Essential control edge | `#737e86` | `#847c73` |
| Filled action / its text | `#c4d7e7` / `#18232c` | `#c8d2ba` / `#21291c` |
| Link, focus, selected marker | `#b8cee1` | `#c8d2ba` |
| Selected tint | `#242c33` | `#2b3027` |
| Correct marker / tint | `#a4c3af` / `#202b28` | `#aac4b0` / `#242d27` |
| Wrong marker / tint | `#d9a8ae` / `#2b2528` | `#d5aaaa` / `#302526` |

The minima below examine page, card, raised, selected, correct and wrong surfaces for primary/supporting text, control edges and focus/accent text. State markers are measured on their own tint; filled-action text is measured on its fill. A component audit must still evaluate any other actual surface introduced during implementation.

| Contract | A minimum | B minimum |
| --- | ---: | ---: |
| Primary text | 11.31:1 | 10.77:1 |
| Supporting text | 7.36:1 | 7.26:1 |
| Essential edge | 3.41:1 | 3.29:1 |
| Link/focus/accent text | 8.73:1 | 8.61:1 |
| Correct marker on correct tint | 7.65:1 | 7.59:1 |
| Wrong marker on wrong tint | 7.27:1 | 7.16:1 |
| Filled-action label | 10.81:1 | 9.57:1 |

**Why choose A:** its blue-gray interaction accent is distinguishable in hue from correct feedback's green. B's sage accent is closer to correct green, increasing the need to distinguish navigation/selection from successful answers by structure. Both pass the specified numerical targets. A's advantage is semantic assignment and compatibility with the desired restrained dark identity, not proven superior learning performance.

**Why change the prototype's supporting color:** the initial `#c7cccf` is mathematically readable but too close to primary text for the intended supporting role. Candidate readings on the worst surface (`#242c33`) are:

| Supporting alternative | WCAG ratio | APCA magnitude | Decision |
| --- | ---: | ---: | --- |
| Prototype `#c7cccf` | 8.74:1 | 71.1 | Too little visual separation for this role. |
| `#adb7bf` | 6.95:1 | 58.6 | Passes AA, misses the chosen 7:1 margin. |
| **`#b4bcc3`** | **7.36:1** | **61.6** | Recommended compromise; use alongside type and spacing distinctions. |
| `#a8b1b8` | 6.50:1 | 55.3 | Better reserved for optional information if ever needed; not necessary here. |

An explanation required to understand a lesson remains primary text even if it is Turkish, follows an English example, or happens to be visually smaller. A minor timestamp or count is supporting. This semantic rule prevents a new palette from reproducing the original readability problem.

## Smooth test feedback

Smoothness is not achieved by fading all colors toward each other. Preserve an unambiguous state while reducing its visual area and chroma:

1. Answer sentences use stable primary text before and after submission. Do not recolor the whole sentence green/red.
2. Correct/wrong markers and short result labels use semantic color. Add text/icon differentiation, not color alone.
3. Use the measured dark tints for a quiet fill. Candidate A's correct and wrong tints have OKLCH chroma approximately **0.0162** and **0.0104**, with lightness **0.2776** and **0.2723**. Similar perceived lightness avoids making one response an unexpectedly bright box. Marker chroma is approximately **0.0437** and **0.0581**.
4. Retain one clear state indicator. Avoid accumulating saturated border + filled key badge + full colored sentence + colored explanation panel.
5. Reveal feedback without moving the next control or shaking a long reading block. Fast control feedback can use existing short transitions; the answer itself should be committed immediately.

These are design deductions from semantic color roles and the actual task. They are not claims that a particular chroma number has been clinically shown to be “smooth.”

## Aurora: limits, compositing and motion

There is no evidence here that an aurora improves study outcomes. Its role is small-scale visual identity. It must not become the most dynamic object while a student is reading.

- Two fixed radial gradients using **`#81a9ca`** and **`#769e92`**, each with **maximum alpha 0.06**; transparent outer stops. Place them near opposite outer corners, away from the central reading measure. A bounded pseudo-element is sufficient; no video, canvas, WebGL, image dependency or perpetual JavaScript loop.
- This alpha is a ceiling, not a requirement to fill the screen at that value. The largest visible region should be near-black; the center should stay subdued. The gradient should extend to transparency before reaching most reading content.
- Reading and quiz surfaces must be opaque or the aurora must be hidden there. CSS stacking should ensure the pseudo-element cannot overlay text; `pointer-events: none` and no focusable node.
- A one-time **3.6s transform from 8px displacement to rest**, with gentle ease-out, is enough. Do not animate hue, radial-gradient stops, blur/filter, layout or background size. Do not restart it on hash navigation, scrolling, hover or answering. Once settled, it is static.
- `prefers-reduced-motion: reduce`: render the static gradient without the settling animation. `forced-colors: active`: remove the decoration. Print should also omit it. Light mode need not receive an aurora in this dark-first iteration.
- Avoid permanent `will-change`. A very large composited layer still consumes memory; “CSS-only” does not mean free. The finite animation naturally stops work; any implementation that remains active must be reconsidered and profiled.

**Conservative compositing bound.** For a channel, `C = alpha × foreground + (1 − alpha) × background`. On page `#121416`, one full blue stop becomes `#191d21`; one full sage stop becomes `#181c1d`. The conservative case where both maximum-alpha stops overlap becomes **`#1e2528`** when rounded for display. The verification tool retains unrounded sRGB channel values through both stacking orders, then computes contrast. Against the worse full-overlap order, primary text remains **12.44:1**, recommended supporting text **8.10:1**, essential edge **3.75:1** and focus **9.61:1**. Thus the proposed glow cannot invalidate these pairs even on non-reading chrome, assuming no additional opacity/blend layers. A blend mode, larger alpha or extra layer invalidates this bound and needs remeasurement.

[WCAG Pause, Stop, Hide](https://raw.githubusercontent.com/w3c/wcag/main/understanding/20/pause-stop-hide.html) addresses automatically starting movement lasting more than five seconds alongside other content. A continuously moving aurora should have an independent stop/pause mechanism; reduced-motion alone should not be treated as blanket justification for endless decorative movement. The finite proposal avoids that extra control. [Animation from Interactions](https://raw.githubusercontent.com/w3c/wcag/main/understanding/21/animation-from-interactions.html), a AAA criterion, explains why nonessential interaction-triggered motion needs an off path and supports reduced-motion handling.

[MDN's rendering-cost guidance](https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/performance/guides/animation_performance_and_frame_rate/index.md) distinguishes layout/paint properties from compositor-handled transform and opacity. [Its CSS/JavaScript animation guide](https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/performance/guides/css_javascript_animation_performance/index.md) describes off-main-thread transforms when a layer is promoted. This supports the chosen properties, not an unmeasured assertion of 60fps or zero battery impact. [Fluent timing guidance](https://raw.githubusercontent.com/MicrosoftDocs/windows-dev-docs/docs/hub/apps/design/motion/timing-and-easing.md) specifies short 83/167/250ms interaction durations; those should not be misrepresented as prescribing the duration of ambient decoration.

## Required implementation verification

Verify the final CSS palette rather than this document's proposed values; measure every emitted role on its actual surface, including feedback and the aurora maximum. Inspect before/after screenshots at 320px, common mobile width and desktop. Check that answer text never changes color unexpectedly through inherited selectors. Ensure focus remains visible without relying on decorative hairlines.

For motion, inspect computed animation duration/iteration count, confirm it is finished after four seconds, confirm navigation does not restart it, and compare reduced-motion/forced-color behavior. Reading/quiz screenshots should show a constant background beneath text. Use browser performance traces if the effect causes a repaint or layout; do not claim an energy or frame-rate result without that measurement. Then review the overall hierarchy with the typography research: a passing contrast spreadsheet does not substitute for a readable screen.

## Access record and limits

Successful reads: the official VS Code and JupyterLab raw source; Primer's official package metadata, versioned tarball and raw base-color source; W3C, Material and Microsoft sources; the two MDN sources. GitHub's root HTML was accessible but was not used as a rendered-theme measurement. Raycast and Jupyter live sites returned proxy 403, so their live UI was not measured. Guessed old Primer paths and old web.dev animation paths returned 404; they are not evidence. GitHub API tree requests returned proxy 403; the network policy was not bypassed. The supplied Raycast/design exports remain aesthetic references, not measured usability evidence.

The source files on mutable branches may change; access date is given above. Primer is pinned to 11.10.0. Numeric calculations are based on extracted colors and the repository's zero-dependency color functions. The final choice still needs visual assessment in real application content and user feedback; neither this research nor automated contrast testing can certify subjective comfort or the feeling of quality.

Implementation audit added after the design decision: `node tools/editorial-palette.mjs` reads the CSS colors and actual aurora alpha, retains explicit/system light equivalence checks, and passed **148 pairs (112 opaque + 36 aurora bounds)** against the current draft. It enforces the chosen 7:1 dark supporting-text target separately from light mode's 4.5:1 minimum. This is a token/compositing check, not a rendered-screen or performance result.
