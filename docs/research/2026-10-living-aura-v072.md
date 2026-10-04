# v0.72 — an atmosphere that actually changes on screen

Research and browser inspection: 4 October 2026. The owner's observation was
correct: a moving transform in source code is not evidence that the effect is
visibly alive. This revision changes the atmosphere's composition, color roles
and observed intensity. It does not change any teaching material.

## Evidence used

The following official sources were retrieved and read:

- [MDN: opacity](https://developer.mozilla.org/en-US/docs/Web/CSS/opacity)
  ([retrieved source](https://github.com/mdn/content/blob/main/files/en-us/web/css/reference/properties/opacity/index.md))
  explicitly says opacity applies to an element **as a whole, including its
  contents**. This supports the single, flattened group cap used below. It is
  not equivalent to putting the same opacity on nine independent layers.
- [MDN: CSS and JavaScript animation performance](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/CSS_JavaScript_animation_performance)
  ([retrieved source](https://github.com/mdn/content/blob/main/files/en-us/web/performance/guides/css_javascript_animation_performance/index.md))
  discusses compositor-friendly transforms and the limits of assuming one
  animation technology is always faster. Our choice is CSS transform/opacity,
  with no idle JavaScript loop, animated blur, hue filter or gradient repaint.
- [MDN: will-change](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)
  ([retrieved source](https://github.com/mdn/content/blob/main/files/en-us/web/css/reference/properties/will-change/index.md))
  warns that indiscriminate use consumes resources and can worsen performance.
  No permanent `will-change` promotion is added to the nine pigment layers.
- [WCAG 2.2: Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
  ([retrieved source](https://github.com/w3c/wcag/blob/main/understanding/20/pause-stop-hide.html))
  informs the persistent pause mechanism for continuously moving decoration.
  The single existing Profile setting pauses every cluster and pigment; hidden
  documents pause them, and the OS reduced-motion preference removes motion.
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
  ([retrieved source](https://github.com/mdn/content/blob/main/files/en-us/web/css/reference/at-rules/@media/prefers-reduced-motion/index.md))
  supports honoring the user's operating-system preference. The static fallback
  still places a different pigment at each anchor.

Direct W3C specification/Understanding page access returned proxy 403, so the
retrieved WCAG repository source is the evidence. Guessed compositing and
web.dev repository paths returned 404 and are not cited as inspected evidence.
There is no participant study, physical-device frame-rate certification or
claim that a competitor uses these exact times/colors.

## Diagnosis and decision

v0.71 had one fixed pigment per large diffuse field, a per-field alpha of 0.10
in dark mode, and 16/21/27-second alternating drift cycles. Most visible pixels
were far from the radial peak. The fields could move considerably while barely
changing what the learner actually saw.

v0.72 has **three bounded clusters**, each containing cherry, iris and lagoon.
Every anchor changes through all three colors. Drifting and color progression
have independent phases, so the entire screen does not become pink, then blue,
then pink in lockstep.

| Role | Dark value / timing | Reason |
| --- | --- | --- |
| Cherry pigment | `#a04278` | Connects the environment to the Sakura brand. |
| Iris pigment | `#6350a5` | A distinctly cooler violet interval. |
| Lagoon pigment | `#28798a` | Blue-green counterpoint to the warm primary action. |
| Flattened atmosphere cap | `0.42` dark / `0.09` light | Visible local peaks with a continuously bounded background. |
| Cluster drift | 7.8 / 9.4 / 11 seconds, alternate | Changes position within an ordinary reading interval. |
| Full pigment cycle | 10.8 / 12.6 / 14.4 seconds | A new dominant color approximately every 3.6–4.8 seconds. |
| Main reading ink | `#eee9ed`, unchanged | Content is the stable foreground. |
| Supporting ink | `#d2c9d3` | Slightly brighter to preserve ≥7:1 over the stronger atmosphere. |
| Control boundary | `#95899b` | Preserves ≥3:1 at the brightest allowed composite. |
| Cool label / tint | `#a4d3db` / `#1e3038` | A measured second accent rather than pink everywhere. |

The primary action and confirmation identity remain Sakura. Home's context
label is cool; topic/support roles can use iris. Paragraphs are neutral. A very
small static cool/iris halo belongs only to a few large titles; it never makes
paragraphs glow, pulse or change hue. Opaque controls and answer surfaces retain
their readable local backgrounds.

The strongest effect is distributed around the periphery and into the open
layout, not behind every card. It is deliberately more apparent than v0.71,
while the underlying luminance remains low. Pause leaves the current motion
frame; reduced motion uses three different stationary color pools.

## Continuous contrast argument

`opacity: var(--aurora-opacity)` is on `.ambient`, **after all nine pigment
layers are flattened**. Each child is a fixed sRGB pigment-to-transparent
radial gradient, composited with ordinary source-over. There is no blend mode,
animated brightness, `hue-rotate()` or external color source.

Let `P` be the page's sRGB vector, `Cᵢ` one of the three pigments, and `a` the
parent cap. Every possible final background lies in the convex hull of:

```
P, (1 − a)P + aC₁, (1 − a)P + aC₂, (1 − a)P + aC₃
```

This includes any number of overlaps, repeated pigments, gradient falloff,
intermediate child opacity and partially transparent parts of the group. It
cannot accumulate as nine independent `0.42` overlays over the page.

WCAG's sRGB luminance function is convex, so its maximum over this hull is at
one of the vertices. For light-on-dark text, those vertices give the continuous
worst case. For dark-on-light text, a component-wise minimum of all vertices
provides a conservative lower luminance bound. The validator checks that each
foreground stays on the appropriate luminance side of the entire interval;
otherwise the continuous proof is rejected. A triangular pigment grid and four
alpha levels additionally report intermediate colors, but do not substitute
for that continuous bound.

`tools/editorial-palette.mjs` measures the actual CSS tokens and verifies the
single parent cap. Tests reject removing that cap, adding a hue filter, and an
unreadably strong atmosphere. With the current palette, **67,650 contrast pairs
pass**, including action gradients, answer transitions and conservative full-alpha title halos.
The cool halo retains ≥7.04:1 for its neutral title even before blur reduces its
local alpha. Across every allowed
dark atmosphere composite:

| Role | Minimum WCAG contrast |
| --- | ---: |
| Main prose | 9.66:1 |
| Supporting text and reading notes | 7.19:1 |
| Cool accent | 7.12:1 |
| Sakura labels | 6.52:1 |
| Control boundaries | 3.49:1 |
| Focus indicator | 6.49:1 |

These are mathematical color bounds, not a blanket certification of every
page, antialiasing, content layout or font size. Decorative hairlines do not
carry control boundaries. New pigments, filters or blend modes require another
compositing proof.

## Rendered acceptance, not source-code movement

The comparison used the **real home screen at 390 × 844 CSS pixels**, with
v0.71's committed motion module and CSS served as the baseline, and the new
files as the candidate. Fonts and finite entry animations had settled. Only
existing CSS animation timelines were paused and sought to reproducible times;
no content, colors, layout or opacity were changed for the captures.

Between the rendered 0- and 2-second frames:

- v0.71: **0%** of viewport pixels changed by at least 12 in any RGB channel;
  its largest channel change was 7.
- v0.72: **46.3%** of viewport pixels changed by at least 12 in a channel;
  the largest channel change was 22.

The threshold is an engineering acceptance signal, not a universal perceptual
standard. More importantly, visual inspection of the 0/2/4/6-second phone
frames and the 1440 × 1000 desktop frames shows clear, differently located
cherry, violet and blue-green pools. Fixed blank regions at the upper, right
and lower parts of the real phone screen each visit **all three hue families**
within 12 seconds. This prevents a passing result from merely moving an almost
invisible single-color gradient.

`tests/aura_browser.py` reproduces those local pixel checks, requires substantial
visible two-second change, and verifies all 12 CSS timelines pause for settings,
visibility and reduced motion. It also checks 320/390/1440 layouts, the light
cap, forced colors and non-intercepting decoration. `tests/reading_system.py`
keeps its cross-route motion checks with the revised faster drift floor.

Browser validation uses local Chromium. Battery cost, GPU memory and long
reading comfort still require physical-device evaluation. Nine static gradient
layers are a conscious compositor/memory tradeoff; avoiding blur, filter,
per-frame JavaScript and permanent `will-change` limits the work, but is not a
claim of zero rendering cost.
