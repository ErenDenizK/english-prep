# Premium — the light palette, the structure, the motion

2026-09-09, on the owner's direction after beta1 shipped: *the light
palette is "tamamen çöp"* — eye-straining, hard to read, try cream tones,
measure with more than one tool; *the reader's middle section is hard to
read* and sub-headings could be a different colour; *the bar's unequal
buttons look broken*; and the whole thing is *"not premium"* — research
what studios and Apple do, structure, ambient background, motion, and
build it top-tier. This file is the research and the decisions; the
rounds are logged in `CHANGELOG.md` from v0.54.

Marks: [S] a source read; [?] unverifiable from here; [≈] an estimate.

---

## 1 · The light palette — paper, not a white screen

### 1.1 What was wrong

The first light theme (v0.43) was a cool near-white (`#F8FAFD`, OKLCH L
0.985, hue 255) with a cool near-black (`#161A1F`) solved to Lc 90 — the
same "preferred" body contrast as dark, on the brightest ground a phone
can show. The owner used it on his phone and reported exactly what the
literature predicts for that combination: glare and fatigue.

- Off-white grounds lower overall luminance while keeping contrast; the
  advice across the design and optometry sources is an RGB value
  *slightly below* pure white with a rich (not pure) black
  ([Design for ducks](https://designforducks.com/colors-effect-on-readability-and-vision-fatigue/),
  [Lost Among Notes](https://blog.silvela.org/post/2026-03-31-bright-backgrounds/)) [S].
- APCA: **Lc 90 is the preferred level for fluent body text and Lc 75
  the floor; light mode has no maximum contrast**, and halation is a
  dark-mode phenomenon
  ([APCA easy intro](https://git.apcacontrast.com/documentation/APCAeasyIntro),
  [Somers interview](https://medium.com/@colleengratzer/how-apca-changes-accessible-contrast-with-andrew-somers-3d47627a5e16)) [S].
  So there is no requirement to sit *at* the maximum, and "optimal for
  sustained reading, not maximal" is APCA's own phrasing.

### 1.2 The decision

Cream at hue 85 — the hue of paper under warm light — two lightness
steps below the old page, with a warm dark ink:

| token | old | new | OKLCH |
|---|---|---|---|
| surface-0 | `#F8FAFD` | **`#F6F1E7`** | 0.960 / 0.014 / 85 |
| surface-1 | `#EEF1F5` | **`#EEE8DD`** | 0.933 / 0.016 / 85 |
| surface-2 | `#E4E8ED` | **`#E5DFD3`** | 0.905 / 0.018 / 85 |
| text-1 | `#161A1F` | **`#211B14`** | 0.225 / 0.016 / 70 |
| text-2 | `#474D55` | **`#413A31`** | 0.352 / 0.018 / 70 |
| accent | `#A55D0C` | **`#A05801`** | 0.535 / 0.125 / 60 |
| accent-text | `#6B420E` | **`#623200`** | 0.372 / 0.090 / 60 |

`text-1`'s token requirement is **Lc 85** on light rather than 90. It
measures 85 against `surface-2` (the darkest cream — the listbox menu,
a control on a card), 88 against `surface-1` and 90 against the page,
which is where prose sits. Every size pairing clears the APCA font
matrix by the same margins as before (18/400 needs 75). The dark theme
is untouched: the owner looked at the slate on an OLED and kept it.

Two consequences of a warm ground, decided:
- The accent (hue 60) and the ground (hue 85) are now in one hue family
  on light, which was the diagnosis of "shallow" on dark (beta1-palette
  §1). It does not recur here, because on light the accent is a
  saturated *dark* on a pale ground — depth and hierarchy come from
  lightness in the direction the eye expects — and the burnt amber on
  cream is the classic ink-on-paper pairing. It was looked at.
- `--c-on-accent` is the page (`#F6F1E7`), so the amber had to darken
  a step (L 0.55 → 0.535) to keep WCAG 4.5 on the fill: 4.79, APCA 73.

### 1.3 Measured with two tools

`tools/color.mjs` is the project's own implementation of APCA and WCAG
2. It was cross-checked against the reference `apca-w3` (Myndex) and
`colorjs.io` in a scratch directory — not added to the repository,
which has no dependencies — on six pairs across both themes:

| pair | apca-w3 | ours | colorjs WCAG | ours |
|---|---|---|---|---|
| dark text-1 / surface-2 | 91.3 | 91.3 | 12.03 | 12.03 |
| dark text-2 / surface-2 | 76.3 | 76.3 | 9.58 | 9.58 |
| dark on-accent / accent | 67.0 | 67.0 | 9.91 | 9.91 |
| old light text-1 / surface-2 | 90.4 | 90.4 | 14.20 | 14.20 |
| old light text-2 / surface-2 | 75.5 | 75.5 | 6.93 | 6.93 |
| old light on-accent / accent | 76.3 | 76.3 | 4.82 | 4.81 |

Agreement to 0.1 Lc and 0.01 in ratio. `npm run color` is therefore
the reference for this repository, and its light table is the one in
§1.2. (colorjs ΔE2000 between ink and ground: 82.7 on the old light,
which is near the top of the scale — the numerical face of "harsh".)

---

## 2 · Structure and motion — what the field does in 2026

### 2.1 Materials and floating navigation

- **iOS 26 Liquid Glass** puts the navigation layer — tab bar, toolbars
  — on a translucent, blurred material that floats over content; the
  content stays opaque and primary, the controls sit *above* it, and
  the active tab is a capsule highlight
  ([STRV](https://www.strv.com/blog/how-to-apply-liquid-glass-to-your-app),
  [Mobivery](https://mobivery.com/en/liquid-glass-effect/)) [S]. The
  rule that survives translation to the web: **glass is for the chrome,
  never for content** — lists, cards and prose stay solid.
- On the web this is `backdrop-filter: blur()` with a translucent
  surface and a hairline, behind `@supports`, with a solid fallback and
  `prefers-reduced-transparency` honoured. What it costs: the sweep's
  contrast measurement assumes a solid ground, so the bar's *own*
  surface must stay opaque enough that its labels clear their pairs
  against the worst content that can scroll under it — measured, not
  assumed (§3).

### 2.2 Ambient background

- "Aurora"/soft-gradient grounds are the 2026 shorthand for premium
  ([Envato](https://elements.envato.com/learn/ux-ui-design-trends),
  [Muzli](https://muz.li/blog/whats-changing-in-mobile-app-design-ui-patterns-that-matter-in-2026/)) [S],
  and the same sources warn against visual theatrics: *calm interfaces*
  is the other half of the trend.
- For an app whose whole job is reading, the ambient layer has to be
  below the contrast floor: a radial glow of the accent's hue at very
  low alpha at the top of the page, drifting slowly, and **no text ever
  sits on the bright part of it** — the glow lives behind the header
  and fades out before the first line. The pairs check measures against
  the surface tokens; the glow's peak must not move the ground's
  lightness by more than the margin the weakest pair has (dark: text-2
  at Lc 76 against 75 — one point, so on dark the glow must be
  *invisible* under text, which means it lives above the content, not
  behind it).

### 2.3 Motion

- Apple's HIG: motion should keep people oriented, give feedback, and
  never be there for its own sake; quick and precise; **every animation
  has a reduced-motion alternative** (crossfade or none)
  ([HIG Motion](https://developer.apple.com/design/human-interface-guidelines/motion),
  [App Store reduced-motion criteria](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria/)) [S].
- Material 3 Expressive (May 2025) moved to a spring-based system with
  *spatial* and *effect* springs at three speeds, published as
  parameters so they map to CSS `linear()` easings
  ([M3 motion](https://m3.material.io/styles/motion/),
  [Android Authority](https://www.androidauthority.com/google-material-3-expressive-features-changes-availability-supported-devices-3556392/)) [S].
  The "standard" scheme is the one for a reading app — comfortable, no
  bounce.
- **Same-document View Transitions are Baseline** as of late 2025:
  Chrome 111+, Safari 18+ (iOS 18+), Firefox 144+
  ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using),
  [TestMu](https://www.testmuai.com/learning-hub/view-transitions-api-browser-support/)) [S].
  This app's routing is a hash change in one document, which is exactly
  the case: `document.startViewTransition(() => render())` gives a
  crossfade between tabs and between index → topic → lesson with no
  library, and the browser skips it when the API is missing.
- Durations: 100–500 ms is the range the field agrees on; this app's
  tokens are `--d-micro` (pressed states) and one route transition
  around 220 ms with a standard ease; nothing bounces.

### 2.4 What "premium" is, stripped of the word

Across the sources and the apps they cite (Linear, Things, Apple's own
first-party apps), it comes down to four properties, all measurable:
**one type scale with real steps** (done in beta1), **a chrome layer
that is visibly a layer** (the blurred bars), **rhythm that is
geometric not arithmetic** (done in the reader), and **motion that is
consistent everywhere and absent when asked** (the view transitions and
the reduced-motion rule). Gradients, glass on content, bounce and a
second accent are what the same sources list as the failure modes.

---

## 3 · The rounds

1. **v0.54 — the light palette** (§1). Shipped.
2. **The reader's middle, the labels, the bar** — the intro's parts list
   at body size; `.t-label` in the accent's text colour so a section
   opens with a mark the eye can find, measured into `PAIRS`; the bar's
   two buttons equal.
2. **v0.55 — the reader's middle, the labels, the bar.** Shipped.
3. **v0.56 — structure and motion.** Shipped: the chrome layer (header,
   tab bar, action bar, the reader's strip) translucent and blurred over
   the content with the solid fallbacks; the tab bar a floating capsule;
   the header's light; cards at 16px; the route crossfade through
   `startViewTransition`; `.animate-in` on every arriving screen; the
   progress fill eased. Not done from the plan, on purpose: a stagger on
   list rows (a screen that arrives in pieces reads as slow, and the
   crossfade already says "new screen"), and any entrance on the
   feedback band (§5 of the design system: answering must appear, not
   perform). `PAIRS` measures every chrome label over the amber; the
   sweep checks the blur, the clearances, the capsule, no running
   animation under reduced motion, and the drift under no-preference.
