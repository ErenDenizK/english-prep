# Motion and interaction

Research arm 4 of the design-system round. 2026-09-15.

The question this arm was given is narrow on purpose. Motion has
already failed here once: the owner's verdict on the UI 3 round was
*"uyumsuz animasyonlar"*. That round added motion — nine animated
things, three derived springs — without ever deciding what motion was
for. This document tries to decide that first and only then pick
numbers.

Everything below is either a value read out of a shipped design
system's source, a measurement taken in this repository, or a cited
study. Anything I could not verify is in **Doğrulanamayanlar** at the
end, and anything shaky in the body carries `[?]`.

---

## 0 · What this app ships today, measured

I read the numbers out of `css/style.css` and re-derived the springs
from their stated `k` and `c` rather than trusting the comment.

Footprint: 1,986 lines of CSS, of which motion is 14 `transition`
declarations, 7 `animation` declarations, 6 `@keyframes` blocks and
456 bytes of `linear()` spring tokens. `js/celebrate.js` is 3,236
bytes of confetti.

The three springs, solved as a unit-mass damped oscillator with
`ζ = c / (2√k)`:

| token | k | c | ζ | settles (±0.1 %) | overshoot |
| --- | --- | --- | --- | --- | --- |
| `--spring-gentle` | 320 | 32 | 0.894 | 476 ms | 0.2 % |
| `--spring-bouncy` | 260 | 18 | 0.558 | 779 ms | 12.1 % |
| `--spring-pop` | 500 | 22 | 0.492 | 567 ms | 16.9 % |

(Measured 2026-09-15 by integrating the closed-form step response;
the numbers agree with the `--d-spring-*` durations the file already
declares — 432 / 768 / 628 ms — so the sampler was not wrong, the
choice was.)

Three facts fall out of that table before any external source is
needed:

1. `--spring-bouncy` — 779 ms, 12 % overshoot — is bound to **the tab
   indicator and selected chips**. That is the most frequently touched
   motion in the app, and it is the longest and bounciest one.
2. `--spring-pop` overshoots **17 %** and is bound to a correct
   answer's option card, next to a 420 ms shake on a wrong one.
3. The entrance stagger runs eight children at 40 ms intervals on top
   of a 476 ms spring, so the last item of a list finishes **756 ms**
   after the screen arrives.

No production system in §1 has a token that long or that bouncy for
anything a user touches repeatedly. That, and not the individual
curves, is what "uyumsuz" is describing: the motion budget is spent
inversely to frequency.

---

## 1 · What serious design systems actually specify

I avoided the documentation sites (several are blocked from this
environment anyway) and read the token sources.

### 1.1 Material 3 / M3 Expressive

M3 Expressive replaced duration+easing with **springs**, expressed as
`dampingRatio` (ζ) and `stiffness` (k) with mass fixed at 1. Two
schemes, six tokens each, split into **spatial** (position, size,
shape — allowed to overshoot) and **effects** (colour, opacity — never
overshoot). Values verbatim from
`androidx/compose/material3/tokens/ExpressiveMotionTokens.kt` and
`StandardMotionTokens.kt` on `androidx-main`:

| scheme | token | ζ | k |
| --- | --- | --- | --- |
| Expressive | spatial fast | 0.6 | 800 |
| Expressive | spatial default | 0.8 | 380 |
| Expressive | spatial slow | 0.8 | 200 |
| Expressive | effects fast | 1.0 | 3800 |
| Expressive | effects default | 1.0 | 1600 |
| Expressive | effects slow | 1.0 | 800 |
| Standard | spatial fast | 0.9 | 1400 |
| Standard | spatial default | 0.9 | 700 |
| Standard | spatial slow | 0.9 | 300 |
| Standard | effects fast/default/slow | 1.0 | 3800 / 1600 / 800 |

Solved into the units a CSS author thinks in (same integration as
§0):

| token | period | settles | overshoot |
| --- | --- | --- | --- |
| M3E spatial fast | 222 ms | 360 ms | 9.5 % |
| M3E spatial default | 322 ms | 435 ms | 1.5 % |
| M3E spatial slow | 444 ms | 599 ms | 1.5 % |
| M3E effects default | 157 ms | 231 ms | 0 % |
| M3 std spatial default | 237 ms | 317 ms | 0.2 % |

Two things worth stealing regardless of whether we use springs:

- **Every effects token is critically damped (ζ = 1.0).** Google's own
  expressive system does not let colour or opacity overshoot, ever.
  This app's `--spring-gentle` is used on `background-color` in five
  places; that is a category error by M3's own taxonomy.
- Even M3 Expressive's *bounciest* token settles in **360 ms**. This
  app's bouncy token is **2.2× longer**.

The legacy M3 duration/easing set survives in `MotionTokens.kt`:
short 50 / 100 / 150 / 200, medium 250 / 300 / 350 / 400, long 450 /
500 / 550 / 600, extra-long 700 / 800 / 900 / 1000 ms; emphasized
`cubic-bezier(0.2, 0, 0, 1)`, emphasized-decelerate
`cubic-bezier(0.05, 0.7, 0.1, 1)`, emphasized-accelerate
`cubic-bezier(0.3, 0, 0.8, 0.15)`, standard `(0.2, 0, 0, 1)`,
standard-decelerate `(0, 0, 0, 1)`, standard-accelerate `(0.3, 0, 1,
1)`.

Note that this app's `--ease-standard: cubic-bezier(0.2, 0, 0, 1)` and
`--ease-out: cubic-bezier(0, 0, 0, 1)` are already exactly M3's
standard and standard-decelerate. That part was fine.

Source:
[ExpressiveMotionTokens.kt](https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ExpressiveMotionTokens.kt),
[MotionTokens.kt](https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/MotionTokens.kt),
[Motion – Material Design 3](https://m3.material.io/styles/motion/).

### 1.2 IBM Carbon

Carbon keeps duration and easing separate and crosses them with a
**productive / expressive** mode axis. Verbatim from
`packages/motion/src/dtcg/motion.json` on `main`:

| duration token | ms | stated use |
| --- | --- | --- |
| `fast-01` | **70** | micro-interactions: button, toggle |
| `fast-02` | **110** | fade in of small elements |
| `moderate-01` | **150** | default transition speed |
| `moderate-02` | **240** | expansion, system communication, toast |
| `slow-01` | **400** | large expansion, important notifications |
| `slow-02` | **700** | background dimming, hero transitions |

| easing | productive | expressive |
| --- | --- | --- |
| standard | `cubic-bezier(0.2, 0, 0.38, 0.9)` | `cubic-bezier(0.4, 0.14, 0.3, 1)` |
| entrance | `cubic-bezier(0, 0, 0.38, 0.9)` | `cubic-bezier(0, 0, 0.3, 1)` |
| exit | `cubic-bezier(0.2, 0, 1, 0.9)` | `cubic-bezier(0.4, 0.14, 1, 1)` |

Older Carbon (v10, still in `packages/styles/scss/_motion.scss`) had a
simpler set: `$ease-in: cubic-bezier(0.25, 0, 1, 1)`, `$ease-out:
cubic-bezier(0, 0, 0.25, 1)`, `$standard-easing: cubic-bezier(0.5, 0,
0.1, 1)`, `$transition-base: 250ms`, `$transition-expansion: 300ms`.

Carbon 2026 has also added **motion surfaces** — five named composites
(`disclosure`, `contextual`, `stretch`, `expand`, `invoke`) that bundle
duration + easing + keyframes per *intent*, and whose `shared-element`
kind explicitly names View Transitions as one of its mechanisms.
This is the architecture worth copying: the token is
`surface.contextual`, not `150ms ease-out`.

Source:
[motion.json](https://raw.githubusercontent.com/carbon-design-system/carbon/main/packages/motion/src/dtcg/motion.json),
[surfaces.json](https://raw.githubusercontent.com/carbon-design-system/carbon/main/packages/motion/src/dtcg/surfaces.json),
[Motion – Carbon](https://carbondesignsystem.com/elements/motion/overview/).

### 1.3 Atlassian

Read out of `@atlaskit/tokens@17.0.0`
(`dist/cjs/artifacts/palettes-raw/motion-palette.js` and
`tokens-raw/atlassian-motion.js`).

Durations: 0, **50, 100, 150, 200, 250, 400, 600 ms**, exposed
semantically as `instant` 0, `xxshort` 50, `xshort` 100, `short` 150,
`medium` 200, `long` 250, `xlong` 400, `xxlong` 600.

Curves — only four, plus one spring:

| token | value |
| --- | --- |
| `motion.easing.out.bold` | `cubic-bezier(0, 0.4, 0, 1)` |
| `motion.easing.out.practical` | `cubic-bezier(0.4, 1, 0.6, 1)` |
| `motion.easing.in.practical` | `cubic-bezier(0.6, 0, 0.8, 0.6)` |
| `motion.easing.inout.bold` | `cubic-bezier(0.4, 0, 0, 1)` |
| `motion.easing.spring` | a 65-stop `linear()`, peak **1.024** |

The composites are the interesting part, because they show the
*asymmetry* rule in numbers:

| token | duration | curve | keyframes |
| --- | --- | --- | --- |
| `motion.listitem.pressed` | 100 ms | out.practical | colour only |
| `motion.button.pressed` | 150 ms | out.practical | colour only |
| `motion.popup.enter.top` | 150 ms | out.practical | slide 8px + fade |
| `motion.popup.exit.top` | 100 ms | in.practical | slide 8px + fade |
| `motion.modal.enter` | 250 ms | inout.bold | scale 95 → 100 |
| `motion.modal.exit` | 200 ms | in.practical | scale 100 → 95 |
| `motion.panel.enter` | 250 ms | out.bold | slide 100 % |

Note: **a press is a colour change, not a transform.** Atlassian does
not scale buttons on press. And its named spring overshoots by
**2.4 %**, not 12 % or 17 %.

Source: `@atlaskit/tokens` on npm (17.0.0),
[Atlassian motion](https://atlassian.design/foundations/motion).

### 1.4 Salesforce Lightning

The oldest and bluntest of the four — six durations, named by feel,
from `design-tokens/dist/primitive.json` in
`@salesforce-ux/design-system@2.264.1`:

`DURATION_INSTANTLY` 0s · `DURATION_IMMEDIATELY` **0.05s** ·
`DURATION_QUICKLY` **0.1s** · `DURATION_PROMPTLY` **0.2s** ·
`DURATION_SLOWLY` **0.4s** · `DURATION_PAUSED` 3.2s.

There are **no easing tokens at all**. Grepping the shipped SCSS, the
most common timing functions are `linear` (used with
`$duration-quickly` for borders and background colours) and
`ease-in-out`; a handful of hand-rolled béziers survive in components.
A system this large gets by with six durations and the CSS keywords.

### 1.5 Apple

Apple publishes no numeric motion tokens. HIG's guidance is
directional: motion should "keep people oriented, provide clear
feedback in response to their actions", "prefer quick, precise
animations", "avoid gratuitous or excessive animation", and — the one
that matters for §5 — when Reduce Motion is on, **"replace motion with
cross-fades or static transitions"**, not with nothing.
([Motion — HIG](https://developer.apple.com/design/human-interface-guidelines/motion))

Material 1 gave the mobile/desktop split that is still quoted:
**200–300 ms on phones**, ~400–450 ms on tablets (+30 % because
objects travel further), **150–200 ms on desktop**, −30 % on wearables.
([m1.material.io/motion/duration-easing](https://m1.material.io/motion/duration-easing.html))

### 1.6 The convergence

Strip the branding and four independent systems agree on a
five-or-six-step duration ladder in the same places:

| tier | Carbon | Atlassian | SLDS | M3 legacy |
| --- | --- | --- | --- | --- |
| press / state | 70 | 100 | 100 | 100 |
| small enter | 110–150 | 150 | 100–200 | 150 |
| default | 150 | 200 | 200 | 200–250 |
| container enter | 240 | 250 | 200 | 300 |
| large / screen | 400 | 400 | 400 | 400–500 |

**For this app:** there is no argument anywhere in this table for a
768 ms tab indicator. The whole industry's *slowest routine* token is
400 ms, and that is reserved for full panels.

---

## 2 · Spring vs easing

### 2.1 The physics, and what each parameter buys

A unit-mass damped spring has two free parameters: stiffness `k`
(natural frequency ω₀ = √k, so **k sets speed**) and damping ratio
ζ = c / (2√k) (**ζ sets character**). Overshoot of the first peak is
`exp(−ζπ/√(1−ζ²))`, which is the only number a designer actually
perceives:

| ζ | first overshoot | reads as |
| --- | --- | --- |
| 1.00 | 0 % | flat, mechanical, "arrived" |
| 0.90 | 0.2 % | imperceptible bounce — M3 Standard |
| 0.80 | 1.5 % | just alive — M3 Expressive default |
| 0.70 | 4.6 % | noticeably springy |
| 0.60 | 9.5 % | playful — M3 Expressive's *most* bouncy |
| 0.50 | 16.3 % | toy-like; this app's `--spring-pop` |

Settling time is roughly `4 / (ζω₀)`, so **halving ζ roughly doubles
the time the element is still moving** at the same stiffness. That is
the trap the UI 3 round fell into: it reached for character by
lowering ζ, and paid for it in duration.

### 2.2 When a spring is right

The one property a spring has that a bézier does not is **velocity
continuity under interruption**. A spring retargeted mid-flight
carries its current velocity; a `@keyframes` animation restarts from
zero. So a spring is right when:

- the motion is **continuous with a gesture** — drag, swipe-to-dismiss,
  a sheet the finger is still holding;
- the motion can be **interrupted and reversed** at any moment;
- the element is meant to read as a physical object with mass
  (Dynamic Island, a pull-to-refresh).

A spring is wrong when the motion is short, discrete, one-shot and
un-interruptible — which describes **every animation in this app**.
Nothing here is dragged. Nothing here is reversible mid-flight.
([Kowalski, Animation Standards](https://github.com/emilkowalski/skills/blob/main/skills/review-animations/STANDARDS.md))

This is the core finding of this arm. **This app has no gestures, so
it has no use for springs.** The UI 3 round derived three springs and
then spent them on crossfades and colour changes — motion that a
bézier expresses more cheaply and, at these durations,
indistinguishably.

### 2.3 Expressing a spring in CSS in 2026

If a spring *were* wanted: `linear()` with sampled stops is the pure-CSS
way, and it is well past the support question.

| feature | Baseline | Chrome | Firefox | Safari |
| --- | --- | --- | --- | --- |
| `linear()` easing | **widely available 2026-06-11** (newly available 2023-12-11) | 113 | 112 | 17.2 |
| Web Animations API | widely available 2023-03-16 | 84 | 75 | 14 |
| individual transforms | widely available 2025-02-05 | 104 | 72 | 14.1 |
| `prefers-reduced-motion` | widely available 2022-07-15 | 74 | 63 | 10.1 |

(from `web-features@3.38.0`, `package/data.json`, queried
2026-09-15 — the machine-readable source behind Baseline.)

So `linear()` is not the problem; it reached Baseline **Widely
Available on 2026-06-11**, three months ago. The problem is that a
`linear()` string is a *frozen* spring — it has a fixed duration and
cannot absorb velocity, so it is a bézier with extra bytes. This
app's three tokens cost 456 bytes to buy exactly nothing a
`cubic-bezier()` would not have bought.

WAAPI (`element.animate()`) is the alternative and gives real
interruptibility, but this app has no runtime dependency budget for a
spring solver and no gesture to solve for.

**For this app:** delete the `linear()` springs. Not because they are
unsupported — because they are a solution to a problem this app does
not have.

---

## 3 · Duration

### 3.1 The thresholds, and what they actually say

Nielsen's three limits, consolidating Miller (1968) and Card,
Robertson & Mackinlay (1991):

- **0.1 s** — the limit for feeling the system reacted *instantaneously*;
  "no special feedback is necessary except to display the result".
- **1.0 s** — the limit for the user's flow of thought to stay
  uninterrupted, though the delay is noticed.
- **10 s** — the limit for keeping attention on the dialogue.

([NN/g, Response Time Limits](https://www.nngroup.com/articles/response-times-3-important-limits/);
Card, S. K., Robertson, G. G. & Mackinlay, J. D., *The information
visualizer: an information workspace*, CHI '91, 181–188.)

The 0.1 s limit is routinely misread as "animations must be under 100
ms". It is not about animation at all — it is about **when the
response begins**. An animation that *starts* within one frame of the
tap satisfies it no matter how long it runs. What a long animation
violates is the *1 s* limit, and it violates it for the interaction
that follows.

**For this app:** the practical budget is that a learner tapping an
option must see the verdict begin within ~100 ms (it does — feedback
is built synchronously in `js/feedback.js`, no `setTimeout`), and the
whole verdict must be *legible and done* well inside 1 s, because the
next thing the learner does is read it.

### 3.2 Why phone durations differ

Material's rationale is geometric, not perceptual: bigger screen →
longer travel → longer duration to hold constant velocity. Phones get
200–300 ms; desktop 150–200 ms; tablets +30 %.

There is a second, stronger reason specific to this product. The
brief says: **~6 weeks before the exam, on a phone, mostly standing,
in 5–10 minute sessions.** In a 7-minute session at ~40 s per question
a learner answers roughly **10 questions**. Ten verdicts. Ten option
lists appearing. Kowalski's frequency table puts "tens of times a day"
in the *"remove or drastically reduce"* row, and that is exactly where
answer feedback lands.

### 3.3 The numbers production systems actually use

| moment | Carbon | Atlassian | SLDS | Kowalski |
| --- | --- | --- | --- | --- |
| press feedback | 70 ms | 100–150 ms | 100 ms | 100–160 ms |
| small element enters | 110 ms | 150 ms | 100 ms | 125–200 ms |
| default state change | 150 ms | 200 ms | 200 ms | 150–250 ms |
| container / modal | 240 ms | 250 ms | 200 ms | 200–500 ms |
| screen / panel | 400 ms | 400 ms | 400 ms | — |

Kowalski's ceiling is blunt: **"UI animations stay under 300 ms"**, and
"a 180 ms dropdown feels more responsive than a 400 ms one". Also
**never `ease-in` on UI** — it delays the exact moment the user is
watching; `ease-out` at 200 ms *feels* faster than `ease-in` at 200 ms.

**For this app:** every current duration except `--d-micro` (120 ms) is
above the table. `--d-enter` 260 ms is defensible; `--d-view` 300 ms is
at the ceiling; the three spring durations (432 / 628 / 768 ms) are
over it by 1.4× to 2.6×.

---

## 4 · What motion is for

Four honest categories, with what the evidence says about each.

### 4.1 Feedback — "something responded". Keep.

This is the one category with a clear mechanism behind it. Nielsen's
0.1 s limit is precisely a feedback requirement. Apple's HIG frames
motion as "clear feedback in response to their actions". The cheapest
correct implementation is not an animation at all — it is *rendering
the result inside one frame*.

Verdict: **essential, but usually satisfied without animation.** A
state change that lands in 100 ms *is* the feedback. An animation on
top of it is decoration wearing feedback's clothes.

### 4.2 Continuity — "where did this come from". Keep, narrowly.

This is the category with real experimental support, and it is
consistently from information-visualisation rather than app UI:

- Heer & Robertson, *Animated Transitions in Statistical Data
  Graphics*, InfoVis 2007 (IEEE TVCG 13(6):1240–1247): two controlled
  experiments found appropriately designed animated transitions
  **significantly improve graphical perception** at both syntactic and
  semantic levels.
  ([paper](https://idl.cs.washington.edu/files/2007-AnimatedTransitions-InfoVis.pdf))
- Bederson & Boltman (1999): animated transitions in a family-tree
  explorer improved subjects' ability to **reconstruct the tree from
  memory**. (Cited in Heer & Robertson.)

Both results are about *object constancy under a re-layout* — the same
data points moving to new positions. Neither is a result about
crossfading between two unrelated screens.

Verdict: **helps when the same object persists across the change.**
Fades between unrelated screens are not continuity; they are a
transition-shaped decoration.

### 4.3 Affordance — "this is draggable". Not applicable here.

Real category (a peeking sheet, a rubber-banding edge) but this app has
no gestures. Nothing to build.

### 4.4 Decoration. Be honest: most of it.

Tversky, Morrison & Bétrancourt, *Animation: can it facilitate?*,
IJHCS 57(4):247–262 (2002) is the strongest counterweight in the
literature, and it is from the learning domain this app lives in.
Reviewing the animation-for-learning corpus, they found students in
animated conditions **did not outperform** equivalent static or text
conditions; where animation appeared to win, the animated version had
smuggled in extra information or interactivity. In one study animation
users finished *training* faster but the *test* slower, and after a
week the text group improved while the animation group declined.
([paper](https://hci.stanford.edu/courses/cs448b/papers/Tversky_AnimationFacilitate_IJHCS02.pdf))

Verdict: yes — **most app motion is decoration**, and in a learning
product the null hypothesis should be that it does nothing and costs
attention. In this app's current set, by my count: the eight-deep
stagger, the 4 s breathing orb, the ring's spring, the tab indicator's
bounce and the confetti are decoration. The option verdict and the
screen crossfade are not.

---

## 5 · Accessibility

### 5.1 What `prefers-reduced-motion` should actually do

The near-universal implementation — which this app ships at
`css/style.css:384` — is the nuclear reset:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

This is defensible as a safety net and wrong as a design. The
preference means *reduce*, not *remove*: Apple's guidance is to
"replace motion with **cross-fades** or static transitions", and WCAG
2.3.3 exempts animation that is "essential to the functionality or the
information being conveyed". Opacity, colour and small (< ~8 px)
movements are not vestibular triggers; **motion across large screen
areas is.**

The honest rule is: under `reduce`, keep anything that carries
meaning, express it as a crossfade or an instant state change, and
drop anything that travels, scales, spins or parallaxes.

This app already does the good half of that — `.animate-in` degrades
to a plain `fade` under `reduce` (`style.css:1948`), and
`js/celebrate.js` and `countUp()` check `motionWelcome()` before
running. The blanket `!important` reset then also flattens things it
did not need to.

### 5.2 What actually triggers people

Val Head's *Designing Safer Web Animation For Motion Sensitivity* (A
List Apart, issue 428) names the categories:

- **Parallax** — different objects at different speeds; "almost
  universally listed as a trigger by the motion sensitive".
- **Large-scale motion relative to screen size** — a full-screen wipe
  or transition "is likely to be triggering".
- Scaling / zoom and spinning / vortex effects are the other two
  routinely named. `[?]` — I could not re-read the article directly
  from this environment (see Doğrulanamayanlar) and am relying on
  quotations of it.

Prevalence, which is the number that makes this non-theoretical:
Agrawal et al., *Disorders of balance and vestibular function in US
adults: NHANES 2001–2004*, Arch Intern Med 169(10):938–944 (2009) —
**35.4 % of US adults aged 40+** (≈69 million) had vestibular
dysfunction. ([PubMed](https://pubmed.ncbi.nlm.nih.gov/19468085/))

This app's audience is ~20-year-olds, so that figure overstates the
local risk. It does not make it zero, and the cost of compliance here
is approximately nothing.

### 5.3 WCAG 2.2 SC 2.3.3

> Motion animation triggered by interaction can be disabled, unless
> the animation is essential to the functionality or the information
> being conveyed.

Level **AAA**, unchanged from WCAG 2.1.
([Understanding SC 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html))

Note what it does *not* say: it does not require you to remove
animation, only to let it be disabled. Honouring
`prefers-reduced-motion` is the accepted mechanism. The app already
passes this; `tools/verify-ui.mjs` asserting "zero running animations
under reduce" is a stricter bar than the SC, which is fine but should
be understood as the project's own rule rather than WCAG's.

There is a second, more commonly relevant criterion nearby: **SC 2.2.2
Pause, Stop, Hide (Level A)** applies to anything moving automatically
for more than 5 s. The `breathe` animation on `.onboard__orb` is
`4s … infinite` — it runs indefinitely without a control. It is under
`prefers-reduced-motion: no-preference`, which is the usual accepted
mitigation, but an infinite decorative loop is the one animation here
that touches a Level **A** criterion. `[?]` — whether a 4 % scale
pulse counts as "moving" for 2.2.2 is arguable; the safer reading is
to delete it, which §7 does anyway.

---

## 6 · The two moments that matter here

### 6.1 A learner answers and finds out

**The evidence on feedback timing is about the feedback, not the
animation.**

- Van der Kleij, Feskens & Eggen, *Effects of Feedback in a
  Computer-Based Learning Environment on Students' Learning Outcomes:
  A Meta-Analysis*, Review of Educational Research 85(4), 2015 — 40
  studies, 70 effect sizes. **Elaborated feedback (an explanation)
  g ≈ 0.49**, versus **correct-answer feedback 0.32** and
  **knowledge-of-result ("right/wrong") 0.05**. Effect sizes were
  *negatively* affected by delayed feedback.
  ([SAGE](https://journals.sagepub.com/doi/abs/10.3102/0034654314564881))
- Kulik & Kulik, *Timing of Feedback and Verbal Learning*, RER 58(1),
  1988 — 53 studies. **Applied studies using real quizzes and real
  materials favour immediate feedback**; laboratory acquisition studies
  favour delayed. This app is the applied case.
  ([SAGE](https://journals.sagepub.com/doi/10.3102/00346543058001079))
- Shute, *Focus on Formative Feedback*, RER 78(1), 2008: formative
  feedback should be nonevaluative, supportive, **timely** and
  specific.

Read together: the thing that carries the learning effect is the
**explanation**, at nearly ten times the effect size of "Doğru /
Yanlış". Anything that delays the explanation is negative. An
animation on the verdict delays the explanation by its own duration.

And the same literature contains the direct warning about animating
the learning itself — Tversky et al. (§4.4).

So for moment (a):

- **Immediate is correct** and the app already does it — the feedback
  block is constructed and inserted synchronously on tap.
- The verdict must be **legible during the motion**, which rules out
  anything that moves the text. The current `rise-in` translates the
  feedback block 14 px and scales it from 0.98 over a **476 ms**
  spring; for roughly the first 150 ms of that the explanation — the
  part with the effect size — is unreadable and moving.
- The `pop` on the correct option (17 % overshoot) and the 420 ms
  `shake` on the wrong one animate the *option*, not the explanation,
  which is the right target: it is object-level feedback ("this one"),
  it is brief, and it is spatially local. But 17 % overshoot is
  celebration, not identification, and a shake is a well-known
  motion-sensitivity irritant even at 5 px. `[?]` — I found no study
  measuring answer-verdict animation against reading speed in an
  assessment UI; this is inference from §3.1 and §4.4, not a
  measurement.

There is a design trap worth naming. Animating "correct" more than
"wrong" makes the app an evaluator rather than a coach, which cuts
against `CLAUDE.md`'s "refine, not teach from zero" and against
Shute's "nonevaluative". The confetti is the extreme case of this.

### 6.2 A screen changes

**Same-document** view transitions — `document.startViewTransition()`,
which `js/home.js:589` already calls — became **Baseline newly
available on 2025-10-14** (Chrome 111, Safari 18, Firefox 144).
**Cross-document** view transitions — the CSS-only
`@view-transition { navigation: auto; }` — are **not Baseline**:
Chrome/Edge 126, Safari 18.2 / iOS 18.2, **no Firefox** as of
`web-features@3.38.0` (2026-09). `view-transition-class` is Baseline
2025-10-14; element-scoped view transitions are Chrome-only (147).

Is it usable on GitHub Pages? **Yes, mechanically.** Cross-document
transitions need only same-origin navigation and an opt-in at-rule in
both documents; there is no server requirement, no JS, and no build
step, which fits this project's non-negotiables exactly. It degrades
to a normal navigation where unsupported. That matters here because
the app *is* a multi-page app at one seam: `quiz-launch.js` does
`window.location.href = "quiz.html"`, and `quiz.html → results.html`
is a second document swap.

But the §4.2 evidence says continuity motion earns its keep when **an
object persists**. Between the Eğitim list and a lesson, or between
the quiz and results, nothing persists visually. A crossfade across
two unrelated full screens is the exact shape Val Head names as
triggering (large-area motion) and the exact shape Tversky's review
says carries no information. A crossfade is cheap and inoffensive at
150–200 ms; a shared-element morph across documents would be
expensive, Chrome/Safari-only, and would be animating a relationship
that isn't there.

**For this app:** keep the same-document crossfade the router already
does, shorten it, and add the cross-document at-rule only for the
`quiz.html → results.html` step, where the learner's mental model
genuinely is "the same session continuing". Do not attempt shared
elements.

---

## Öneri

### 1 · The token set

Nine tokens. No springs, no `linear()`, no per-component values.

```css
/* Durations — the ladder §1.6 shows four systems agree on. */
--d-instant:  0ms;    /* under reduce, and for anything under the finger */
--d-press:  100ms;    /* a colour/tint change on the thing being touched */
--d-state:  160ms;    /* an option becoming right or wrong; a chip filling */
--d-enter:  220ms;    /* a block appearing: feedback, a check, a sheet */
--d-exit:   140ms;    /* exits are shorter than entrances, always */
--d-screen: 180ms;    /* the route crossfade — both halves, so 180ms total */

/* Curves — M3's standard set, which the app already half-uses. */
--ease-out:      cubic-bezier(0, 0, 0, 1);       /* things appearing */
--ease-standard: cubic-bezier(0.2, 0, 0, 1);     /* things moving on-screen */
--ease-in:       cubic-bezier(0.3, 0, 1, 1);     /* things leaving. Rare. */
```

Notes on the choices:

- **No token over 220 ms except the screen crossfade**, and that one is
  180 ms because it is two 180 ms halves overlapping, not 300 ms of
  blank.
- `--d-press` 100 ms matches Atlassian `listitem.pressed` and SLDS
  `DURATION_QUICKLY`; Carbon would say 70 ms. 100 ms is the safer
  phone number.
- `--ease-in` exists only so exits have a curve; per Kowalski it must
  never be used on something entering.
- The ratio `--d-exit : --d-enter` ≈ 0.64 mirrors Atlassian's
  200 : 250 and 100 : 150.
- Three curves is the floor that still expresses enter / move / exit.
  SLDS ships with zero and survives; four systems ship with three to
  six. Three.

If a future round *does* add gestures, the spring to add is one, and
its parameters should be **ζ = 0.8, k = 380** — M3 Expressive's
default spatial token, 1.5 % overshoot, 435 ms — not anything derived
fresh.

### 2 · The animations to ship — three

**(a) Press.** `background-color` and `border-color` over
`--d-press --ease-out` on `:active` for every option, card and button.
No transform. Reason: it is the 0.1 s feedback requirement (§3.1),
it is what all four systems do (§1.3), and a colour change cannot
cause vestibular trouble or move the button under the finger — which
is also this project's own fixed-shell rule.

**(b) The verdict.** On answering: the chosen option and the correct
option take their state colours over `--d-state --ease-out`, and the
feedback block appears with **opacity only** over
`--d-enter --ease-out`. No rise, no scale, no pop, no shake.
Reason: the explanation is the part with the effect size (g ≈ 0.49 vs
0.05, §6.1) and it must be readable from the first frame. Identify
the right answer with colour and the glyph that `feedback.js` already
draws; do not celebrate it.

**(c) The screen crossfade.** `::view-transition-old/new(root)` at
`--d-screen --ease-standard`, opacity only, for `#egitim ↔ #test ↔
#profil` and for lesson entry — the same-document path already in
`home.js`. Plus `@view-transition { navigation: auto; }` in
`quiz.html` and `results.html` for that one document swap. Reason:
§6.2 — the session continues across it, it costs ~5 lines of CSS, it
needs no JS or build step, and it no-ops in Firefox.

That is the whole system: **one colour change, one opacity change, one
crossfade.** Everything else in the app becomes an instant state
change, which is not an absence of motion — a state that lands within
one frame *is* the feedback Nielsen's 0.1 s limit asks for.

### 3 · Under `prefers-reduced-motion: reduce`

Keep (a) and (b) — they are colour and opacity, not motion, and they
carry the verdict. Reduce (c) to `--d-instant`. Delete the blanket
`* { animation-duration: 0.01ms !important }` reset: with only three
animations left, each can state its own reduced form, which is what
Apple's "replace with a cross-fade" actually asks for. Keep the
sweep's existing assertion that nothing *travels* under `reduce`.

### 4 · The refusals

Each of these is currently shipped or was proposed; each should be
explicitly out.

| refuse | why |
| --- | --- |
| **The three `linear()` springs** | Nothing in this app is dragged or interruptible, so a spring buys only overshoot (§2.2). 456 bytes for a bézier. |
| **The 8-deep staggered entrance** | Last item lands 756 ms after arrival (§0); pure decoration by §4.4; makes every screen feel slower than it is. |
| **Bounce/overshoot anywhere** | 12 % on the tab indicator and 17 % on a correct answer, against M3 Expressive's ceiling of 9.5 % on its *bounciest* token (§1.1). |
| **The `shake` on a wrong answer** | 420 ms of translation on the element the learner is reading, in an app for someone whose instinct is often right (`CLAUDE.md`). It scolds. Colour says "wrong" in 160 ms. |
| **`scale()` press feedback** | Scaling a 44 px target under the finger; Atlassian, Carbon and SLDS all press with colour only (§1.3). |
| **Confetti** | Evaluative celebration (§6.1) in a product whose stated stance is "refine, not congratulate progress from nothing". 3,236 bytes of canvas for it. |
| **`breathe` on the onboarding orb** | 4 s infinite loop with no control — the only thing here near a Level **A** criterion (SC 2.2.2, §5.3). |
| **The 700 ms count-up** | Delays a number the learner came to read; §3.1's 1 s flow limit is spent on a value that was already computed. |
| **Cross-document shared-element morphs** | Chrome/Safari-only, and there is no persisting object to morph (§6.2). |
| **Scroll-driven animation** | Not Baseline (Chrome 115, Safari 26, no Firefox — `web-features@3.38.0`), and §4.4. |
| **Loading/skeleton animation** | There is no wait to cover: content is local JSON. The one peer-reviewed result on animation speed and perceived waiting (Ding et al., JCR 2025, convex effect, moderate speed wins) is measured over 7–30 s waits and **does not transfer** to an app with none. |

### 5 · How to tell if this worked

`tools/verify-ui.mjs` already walks every screen. Two assertions to
add, both cheap and both mechanical:

1. No computed `transition-duration` or `animation-duration` above
   **250 ms** anywhere, in either motion setting.
2. No element's animation touches a property other than `opacity`,
   `background-color`, `border-color` or `color`. (After this round
   there should be no `transform` animation at all.)

If a later round wants a transform back, it has to argue past those
two lines, which is the point.

---

## Doğrulanamayanlar

- **Apple HIG motion page.** `developer.apple.com` renders client-side
  and returned no body through this environment's fetcher; the
  guidance in §1.5 and §5.1 is quoted from search-result extracts of
  that page, not read off it. The specific phrases ("prefer quick,
  precise animations", "replace motion with cross-fades or static
  transitions") are consistent across several secondary sources but I
  did not see them in situ.
- **`m3.material.io`, `carbondesignsystem.com`, `atlassian.design`,
  `alistapart.com`, `webkit.org`, `www.w3.org`, `nngroup.com`,
  `developer.mozilla.org` are all blocked by this session's egress
  policy.** Every token value in §1.1–1.4 was therefore read from the
  *source of record* instead (androidx on `raw.githubusercontent.com`,
  `@carbon/motion` and `@atlaskit/tokens` and
  `@salesforce-ux/design-system` from npm), which I consider stronger
  than the docs. But the *prose* guidance around those tokens —
  Carbon's "productive vs expressive" rationale, M3's spring
  narrative — is second-hand.
- **Val Head's trigger list (§5.2).** Parallax and large-area motion
  are directly quoted in secondary sources; **zoom/scale and
  spin/vortex as named categories are `[?]`** — widely repeated, not
  verified against the article.
- **WCAG SC 2.3.3 text.** Quoted from three independent secondary
  sources that agree verbatim; the W3C Understanding document itself
  was unreachable. The **AAA** level and the "essential" exemption are
  not in doubt.
- **No study measures verdict animation against reading speed in an
  assessment UI.** §6.1's central recommendation — that animating the
  feedback block delays the part of it that carries the learning
  effect — is an inference from Nielsen's thresholds plus Van der
  Kleij's effect sizes plus Tversky's review. It is reasoning, not
  a result. It would be cheap to test locally with `npm run solve`
  timings if anyone wants to.
- **The "77 % of people prefer animated feedback" and "30 % of users
  find excessive animations distracting" figures** circulate widely
  and are attributed to NN/g and Google respectively. I could not
  trace either to a primary source and have **excluded both** rather
  than cite them.
- **Firefox's cross-document view-transition status.** `web-features`
  lists no Firefox version, and search results say Nightly has partial
  support behind a flag. The safe planning assumption is "absent";
  whether it ships during this app's ~6-week horizon is `[?]` and
  does not change the recommendation, since the feature degrades to a
  plain navigation.
- **`breathe` and SC 2.2.2.** Whether a 4 s, 4 % scale pulse is
  "moving content" for a Level A criterion is a judgement call I could
  not resolve against a normative source. §7 deletes it on §4.4
  grounds regardless.
- **Perceived-character table in §2.1.** The overshoot percentages are
  exact (closed-form), but the right-hand "reads as" column is my
  characterisation calibrated against where M3, Atlassian and
  Kowalski draw their own lines — not a perceptual study.
