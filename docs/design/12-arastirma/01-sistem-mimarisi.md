# How a professional design system is actually structured

Arm 1 of the 2026-09-15 research round. Scope: token architecture,
where tokens live, theming, component API design, governance — and
what each of those means for a zero-dependency static app maintained
by one person.

The short version, up front: **this app already has a professional
design-system architecture.** Three token tiers, a 21-entry component
catalogue with a real spec table, a CI contrast solver, a browser
sweep that fails on an undocumented component. What it does not have
is the one thing the industry built tooling for — a machine link
between the token source and the shipped CSS — and that gap has
already produced a live WCAG 1.4.11 failure that CI reports as
passing (§6). The recommendation is 24 lines of Node, not a build
step.

---

## 1 · Token architecture

### 1.1 The W3C format is stable now, and it changed under everyone

The Design Tokens Community Group shipped its **first stable version,
2025.10, on 2025-10-28**, backed by 40+ organisations including Adobe,
Figma, Google, Microsoft, Shopify and Salesforce. The repo's own
README states the version string plainly: "The most recent stable
release is version 2025.10", at `designtokens.org/TR/2025.10/`, with a
third editors' draft of 2025-07-21 alongside and an experimental
preview at `/TR/drafts/` that carries the warning that "nothing in it
should be implemented."
([design-tokens/community-group README](https://raw.githubusercontent.com/design-tokens/community-group/main/README.md),
[announcement](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/))

The shape is: every token is an object with a required `$value` and an
optional `$type`; groups are plain nested objects; `$type` is inherited
down a group; aliases are `{group.token}` path references;
`$description` and `$extensions` carry human and tool metadata.

The trap for a hand-authored file is **colour**. In 2025.10 a `color`
`$value` is no longer a hex string — it is an object with `colorSpace`,
`components`, optional `alpha` and an optional `hex` fallback:

```json
{ "$type": "color",
  "$value": { "colorSpace": "srgb", "components": [0, 0.4, 0.8],
              "hex": "#0066cc" } }
```

Seven colour spaces are admitted by the colour module (srgb, hsl, hwb,
lab, lch, oklab, oklch); Style Dictionary v5 implements fourteen,
including `oklch` and `oklab` with automatic hex fallback for
out-of-gamut values. Real tools shipped against the old string form
and broke — see
[penpot#9305](https://github.com/penpot/penpot/issues/9305),
"Token color $value accepts only hex strings — DTCG 2025.10 requires
the object format."

**What this means here.** DTCG's canonical colour form is a *worse*
authoring format than what this repo already has. `tools/palette.mjs`
stores `{ L, C, H, need: { lc, wcag, ui } }` — coordinates *plus the
contrast requirement the token must meet*. DTCG has no slot for
`need`; it would go in `$extensions`, i.e. outside anything a DTCG tool
understands. Converting to DTCG would make the file longer, make it
unreadable by hand, and would not let any tool check the one property
this palette exists to guarantee. **Reject DTCG as the source format**
for this project. Worth knowing for interop, not worth adopting.

### 1.2 The three-tier model, and who actually uses it

| System | Tiers, verbatim | Example names, verbatim |
|---|---|---|
| Material 3 | `md.ref.*` → `md.sys.*` → component (the third tier is *not* prefixed `comp`) | `md.sys.color.primary`, `--md-sys-color-surface` |
| IBM Carbon v11 | primitive → theme token; naming is `[element]-[role]-[order]-[state]` | `$layer-01`, `$text-primary`, `$border-subtle-01`, `$support-error` |
| GitHub Primer | base → functional → component/pattern | `--fgColor-default`, `--bgColor-muted`, `--bgColor-accent-emphasis`, `--borderColor-default` |
| Atlassian | foundation · property · modifier | `color.icon.success`, `elevation.surface.raised`, `elevation.shadow.overlay`, `space.100` |
| Shopify Polaris | `color-[category]-[semantic]-[state]`, with real component tokens | `color-bg-fill-brand-hover`, `color-text-critical`, `color-button-gradient-bg-fill`, `color-avatar-bg-fill` |
| Adobe Spectrum | palette → alias → component-set | `accent-background-color-default`, `blue-subtle-background-color-default`, `focus-indicator-color` |
| Salesforce SLDS | `COMPONENT_ELEMENT_CATEGORY_PROPERTY_ATTRIBUTE_STATE`; `--slds-g-*` global, `--slds-c-*` component | `--slds-g-color-surface-container-1` |

Sources:
[material-web theming docs](https://github.com/material-components/material-web/blob/main/docs/theming/README.md),
[Carbon v11 migration guide](https://carbondesignsystem.com/migrating/guide/design/),
[Primer token names](https://primer.style/product/primitives/token-names/),
[Atlassian tokens overview](https://atlassian.design/foundations/tokens/design-tokens),
[Polaris base colour tokens](https://raw.githubusercontent.com/Shopify/polaris/main/polaris-tokens/src/themes/base/color.ts),
[Spectrum `color-aliases.json`](https://raw.githubusercontent.com/adobe/spectrum-design-data/main/packages/tokens/src/color-aliases.json),
[SLDS styling hooks](https://developer.salesforce.com/docs/platform/lwc/guide/create-components-css-custom-properties.html).

**Which scales and which does not.**

- **Atlassian and Primer scale best.** Three or four short slots,
  purpose-first, theme-independent. `color.icon.success` is readable
  at a glance and survives a repaint of the whole palette. Atlassian
  even publishes a lifecycle — a token is marked deprecated in one
  minor, soft-deleted (functional but erroring) in the next, and
  deleted in the next major.
- **Carbon scales only because it is bounded.** The numeric suffix
  survives in v11 *only* for layering (`-00`, `-01`, `-02`, `-03`);
  every other numeral was replaced with an adjective because numbers
  don't say what a token is for. Four layers is a ceiling, and that
  ceiling is what makes it work.
- **Polaris does not scale at the component tier.** It ships tokens
  like `color-button-gradient-bg-fill` and `color-video-thumbnail-*`:
  one component's private decision promoted to a global name. This is
  the tier that multiplies — a 200-token semantic set can become
  2,000+ once every component gets its own.
- **SLDS does not scale, and Salesforce knows it.** A six-slot name
  (`COMPONENT_ELEMENT_CATEGORY_PROPERTY_ATTRIBUTE_STATE`) is not
  writable from memory, and SLDS 2 *dropped component hooks
  altogether* — `--slds-c-*` is unsupported and orgs using it are told
  to stay on SLDS 1 themes.
- **Spectrum is the outlier and worth noticing: it is not DTCG.** Its
  files use a custom `"$schema"` per token plus `value` and a `sets`
  object, not `$type`/`$value`:

  ```json
  "accent-background-color-default": {
    "$schema": ".../token-types/color-set.json",
    "sets": { "light": { "value": "{accent-color-900}" },
              "dark":  { "value": "{accent-color-800}" } } }
  ```

  Adobe co-signed DTCG and still does not author in it.

**What this means here.** The app has, right now, in
`css/style.css`:

- **19 primitives** (`--c-surface-0…2`, `--c-surface-up`,
  `--c-text-1…3`, `--c-accent`, `--c-accent-2`, `--c-accent-text`,
  `--c-on-accent`, `--c-ok`, `--c-no`, the three tints, `--c-focus`,
  `--c-hairline`, `--c-edge`)
- **18 semantic** (`--page`, `--card`, `--raised`, `--ink`, `--ink-2`,
  `--accent`, `--accent-ink`, `--grad-accent`, `--focus`, `--ok`,
  `--no`, the tints, `--hairline`, `--edge`)
- **10 component** (`--target`, `--bar-h`, `--nav-h`, `--nav-inset`,
  `--btn-h`, `--btn-h-primary`, `--row-min`, `--foot-pad`,
  `--ring-size`, `--ring-stroke`)
- plus 15 space/radius, 12 type, 13 motion, 6 layout, 13 light/material
  tokens. **110 distinct custom properties, 214 declarations, 516
  `var()` uses in 1,987 lines.**

That is the three-tier model, complete, with a component tier that is
*dimensions only* — exactly the tier Polaris got wrong by filling it
with colours. `docs/design-system.md` §9.3 says "Two token tiers,
primitive → semantic. Most systems need no third." **That sentence is
now false about its own stylesheet**, and it is false in the good
direction: the third tier exists and is correctly scoped. Fix the doc,
keep the code.

The naming is closest to Atlassian's: short, purpose-first, and a
component never names a primitive. The one weakness is that the
semantic tier has no consistent grammar — `--ink` / `--ink-2` is a
different pattern from `--accent-ink` (there, `ink` means *on-accent*).
A newcomer reading `--accent-ink` will guess wrong. That is a rename,
not an architecture change.

---

## 2 · Where tokens live: JSON source vs CSS directly

The industry answer is JSON → build → platforms, because a design
system ships to iOS, Android, Figma and the web at once. This app
ships to exactly one platform. The question is only whether the
tooling still pays.

**Measured cost, this machine, today:**

| Tool | Version | Package size | Install |
|---|---|---|---|
| `style-dictionary` | 5.5.3 | 4,378,469 B unpacked, 701 files, 13 direct deps | **106 packages, 62 MB `node_modules`, 4,743 files** |
| `@terrazzo/cli` + `plugin-css` | 2.7.1 | 204,930 B unpacked, 64 files | **68 packages, 62 MB** (it pulls `vite`) |
| `class-variance-authority` | 0.7.1 | 22,073 B, 9 files, 1 dep (`clsx`) | 2 packages |

(Sizes from the npm registry metadata; install figures from
`npm install` in a scratch directory, `du -sh node_modules`.)

Style Dictionary v5 is genuinely good: DTCG 2025.10 native, 14 colour
spaces, `oklch`/`oklab` transformers with hex fallback, CSS/SCSS/iOS/
Android/Flutter outputs, `.tokens.json` as the new extension
([zeroheight migration notes](https://help.zeroheight.com/hc/en-us/articles/48049028236187-Migrating-to-Style-Dictionary-v5-in-tokens-automation),
[Style Dictionary DTCG page](https://styledictionary.com/info/dtcg/)).
Terrazzo is the DTCG-first alternative and is 20× smaller as a
package, but not as an install.

**What this buys and what it costs here.**

Buys: one authoring file; oklch→hex fallback generated rather than
typed; theme sets generated rather than duplicated; interop with
Figma via Tokens Studio.

Costs, concretely:

1. **62 MB and 106 transitive packages enter a repo whose
   `package.json` has zero dependencies and whose CLAUDE.md forbids a
   runtime dependency.** Every one is a supply-chain surface for a
   file that runs in CI on every push.
2. **A generated `css/style.css` cannot carry the comments it
   currently carries.** The tokens layer is ~150 lines of prose
   explaining *why* C 0.014 and H 255 — the reasoning that six
   rejected rounds produced. Style Dictionary's CSS format emits a
   header comment and nothing else. That prose is the most valuable
   artefact in the file.
3. **The generated file must then be committed anyway**, because
   GitHub Pages serves the repo as-is. So the build step buys no
   deployment simplification; it only adds a step that can be
   forgotten.
4. It solves a problem — multi-platform output — that does not exist
   here and, per `docs/app2/`, will not exist in app 2 either (also
   web).

**Verdict: reject Style Dictionary, Terrazzo and Tokens Studio for
this project.** The 5 % of the value that matters — *the shipped CSS
provably equals the measured palette* — is 24 lines of Node with no
dependencies, and §6 shows it catching a real bug.

---

## 3 · Theming

### 3.1 The mechanisms, and what serious systems pick

- **Class swap** (`.theme-dark`) — oldest, still common; loses to
  specificity fights and cannot express "follow the OS".
- **`data-theme` / data attributes** — the current default. GitHub
  Primer uses paired attributes (`data-color-mode` plus
  `data-light-theme` / `data-dark-theme`) because it ships more than
  two themes: light, dark, dimmed, high-contrast and colour-blind
  variants, generated as `overrides` in `primer/primitives`
  ([README](https://raw.githubusercontent.com/primer/primitives/main/README.md)).
- **`color-scheme`** — not a theming mechanism but the *declaration*
  one; it is what makes form controls, scrollbars and the UA's own
  colours follow. Required for `light-dark()` to resolve.
- **`@media (prefers-color-scheme / prefers-contrast /
  prefers-reduced-motion)`** — the user's side of the contract.
- **`forced-colors: active`** — Windows High Contrast and friends.
  The UA replaces the palette with system keywords (`Canvas`,
  `CanvasText`, `LinkText`, `ButtonFace`) and also flips
  `prefers-color-scheme` to match
  ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors)).
  System colours are Baseline *widely available* (since July 2015).
- **`light-dark()`** — one CSS function, two colours, resolved from
  the element's used `color-scheme`.

### 3.2 `light-dark()`: current support, with a source

**Baseline newly available since May 2024.** First supporting
versions: **Chrome 123** (2024-03-19), **Edge 123** (2024-03-22),
**Firefox 120** (2023-11-21), **Safari 17.5** (2024-05-13). It is
projected to reach **Baseline widely available on 2026-11-13** — about
two months from today.
([web.dev](https://web.dev/articles/light-dark),
[web-features explorer](https://web-platform-dx.github.io/web-features-explorer/features/light-dark/),
[caniuse](https://caniuse.com/mdn-css_types_color_light-dark))

### 3.3 What this app does, and the cost of not using `light-dark()`

The stylesheet already implements `data-theme` + `prefers-color-scheme`
+ `prefers-contrast: more` + `forced-colors: active`, with preference
overrides *redefining tokens rather than rules* (§9.3). That is the
same contract as Primer's, minus the extra themes. There is no gap in
the mechanism.

There is a gap in the **cost**. Measured:

- The light palette is written **twice, 33 declarations each** — once
  under `@media (prefers-color-scheme: light) :root:not([data-theme=
  "dark"])`, once under `:root[data-theme="light"]`. The two blocks
  are byte-identical.
- The `prefers-contrast: more` light overrides are written **twice,
  5 declarations each**.
- **38 of 214 custom-property declarations in the file (17.8 %) exist
  only because there is no build step.**
- **28 of the 33 light declarations are pure colours** and would
  collapse into `light-dark()`. Three would not: `--shadow-1`,
  `--shadow-2` (whole shadow values) and `--orb` (a gradient). Those
  need the colour extracted into its own token first.

So `light-dark()` would remove roughly 33 duplicated lines. **Do not
adopt it yet, and the reason is arithmetic, not taste.** A phone on
Chrome < 123 gets an *invalid* declaration — the custom property is
invalid at computed-value time and the colour disappears entirely, not
degrading to anything. Guarding with `@supports (color: light-dark(#000,
#fff))` means writing the fallback block anyway, which costs the 33
lines back and adds a `@supports` block. The saving only exists once
the fallback can be dropped, i.e. after Baseline widely available
(2026-11-13). The exam is ~6 weeks out. **Revisit in December, not
now.**

One asymmetry worth fixing regardless: **the dark theme ships OKLCH
(one `@supports` block, 16 redeclarations) and the light theme ships
hex only.** `oklch()` is Baseline. Either both or neither — and "both"
means the light theme's authored coordinates finally live in the
stylesheet rather than only in `tools/palette.mjs`.

---

## 4 · Component API design

### 4.1 Slots vs props, and the variant explosion

Polaris's `Button` — a design system's simplest component — carries
**30+ props** in one interface: `size`, `variant` (5 values), `tone`,
`textAlign`, `disclosure`, `children`, `icon`, plus 9 event handlers,
5 `aria*` props and 4 link props
([Button.tsx](https://raw.githubusercontent.com/Shopify/polaris/main/polaris-react/src/components/Button/Button.tsx)).
This is what "props for everything" looks like at scale, and it is why
the field moved two ways at once: **compound components** (a parent
plus named children sharing context, so `Card.Header` is a slot rather
than a `header` prop) and **CVA-style variant maps** (a declarative
`{ variant, size }` → class table, 22 KB, one dependency).

The constraint that actually keeps a system coherent is not the API
style, it is a **stated ceiling**. Examples:

- Atlassian publishes a **five-level elevation model** — sunken,
  default, raised, overlay, plus an overflow shadow — and every
  surface must be one of them.
- Carbon bounds layering at **four** sets (`-00` … `-03`) and replaced
  every other numeral with an adjective.
- SLDS 2 removed the component tier entirely rather than let it grow.

This app's "**at most one card level and nothing framed inside a
framed thing**" is the same species of rule, and it is stricter than
all three. That is defensible for a five-screen app and should be
stated as a number in the doc the way Atlassian states five.

### 4.2 What a real component spec carries

| System | Fields |
|---|---|
| Polaris | frontmatter `title`, `shortDescription`, `category`, `webComponent name`, `type`; then Best practices · Component vs alternative · Content guidelines · Related components · Accessibility · Navigation · Labeling · Keyboard support ([button.mdx](https://raw.githubusercontent.com/Shopify/polaris/main/polaris.shopify.com/content/components/actions/button.mdx)) |
| Spectrum | options (variant, style, size, orientation, iconography, selection, error) · behaviours (focus, wrapping, truncation, overflow, animation) · usage guidelines · content standards · keyboard interactions · accessibility · internationalization/RTL · theming ([spectrum.adobe.com](https://spectrum.adobe.com/page/menu/)) |
| Primer | plus a **lifecycle**: alpha (usable in production, breaking changes expected; no external deps; works in all colour modes; design reviewed) → beta (secondary features, common use cases documented, SSR-compatible) → stable (no breaking changes for ≥ 1 month) ([Primer component lifecycle](https://primer.style/design/guides/component-lifecycle/)) |
| HashiCorp | a **47-item** new-component checklist: 2 pre-flight, 24 design, 21 engineering ([NEW-COMPONENT-CHECKLIST.md](https://github.com/hashicorp/design-system/blob/main/packages/components/NEW-COMPONENT-CHECKLIST.md)) |

**What this means here.** `docs/design-system.md` §7 already carries a
21-row table with **anatomy · sizes · states · tokens · accessibility**
— five of the seven fields Spectrum publishes. The two missing are
*when not to use it* (Polaris's "Best practices" / "X versus Y") and
*content guidelines* (what the Turkish label may say, how long it may
be). Both matter more in this app than in Polaris, because the copy is
Turkish, the practice text is English, and the §7 rows already note
things like "labels never wrap".

And `tools/verify-ui.mjs` (line ~1380) already enforces what no
document can: **every class the components layer declares must appear
on `docs/components.html`**, at 390px, in both themes. That is a
stronger governance mechanism than a 47-item checklist, because it
cannot be skipped.

---

## 5 · Governance for a solo project

**Pure overhead below roughly five people.** Every one of these exists
to coordinate humans who cannot talk to each other:

- A versioned, published token package with semver. There is no
  consumer to version against.
- A deprecation lifecycle (Atlassian's active → deprecated →
  soft-deleted → deleted across three releases). One person can
  grep-and-replace 516 `var()` uses in a minute.
- A contribution checklist of 47 items across two disciplines you are
  both of.
- Alpha/beta/stable component maturity labels. With 21 components and
  one consumer, "shipped" and "not shipped" are the only two states.
- Figma↔code sync (Tokens Studio, variables, DTCG round-trip). There
  is no Figma file.
- Adoption metrics and design-system-as-product dashboards. Sparkbox's
  surveys find that success correlates with **a partially or fully
  dedicated maintenance team** — ~80 % of respondents whose system
  succeeded had one
  ([2018](https://designsystemssurvey.seesparkbox.com/2018/),
  [2022](https://designsystemssurvey.sparkbox.com/2022/)). Those
  findings are about staffing a team. They do not transfer.

**Pays for itself on day one, at any team size including one:**

1. **A machine check that the shipped artefact equals the specified
   one.** §6. This is the entire justification for token tooling,
   separable from the tooling.
2. **A catalogue the build fails without.** Already present. It is
   what stops the 22nd component from being invented inline.
3. **A solver rather than an eyedropper for colour.**
   `tools/palette.mjs` computes tokens from OKLCH coordinates against
   a stated contrast requirement, in both WCAG 2 and APCA, for 38
   size×weight pairings. Its own header records that the first draft
   "passed WCAG everywhere and failed APCA everywhere, and no one
   would have seen it." That is the ROI, measured, in this repo.
4. **A naming grammar written down.** Free. Prevents the semantic tier
   from drifting into a second primitive tier.
5. **One page showing every component in every state in both themes.**
   `docs/components.html`, 445 lines. Cheaper than reading 1,987 lines
   of CSS.

The honest asymmetry: for a team, a design system's value is
*coordination*; for one person, it is *memory and proof*. Build the
proof mechanisms; skip the coordination mechanisms entirely.

---

## 6 · The finding: CI measures a palette the app does not ship

`tools/palette.mjs` holds the authored spec — OKLCH coordinates and
the contrast each token must hold. **It never reads
`css/style.css`.** (Verified: the only `readFile` of the stylesheet in
`tools/` is in `verify-ui.mjs`, for the component-catalogue sweep.) So
every primitive exists in three hand-maintained copies: the JS spec,
the CSS hex fallback, and the CSS `oklch()` redeclaration inside
`@supports (color: oklch(0.5 0.1 75))` — which, since `oklch()` is
Baseline, is **the value that actually ships**.

Comparing all 15 measured primitives against that `@supports` block:

```
MISMATCH hairline  css=(0.31,  0.012, 255)  palette.mjs=(0.320, 0.012, 255)
MISMATCH edge      css=(0.545, 0.012, 255)  palette.mjs=(0.564, 0.012, 255)
compared 15  mismatches 2
```

`--c-edge` is the control boundary, and §1 requires it to hold **3:1
against every surface** (WCAG 2.2 SC 1.4.11 Non-text Contrast).
Measured with the repo's own `tools/color.mjs`:

| | hex | vs `surface-0` | vs `surface-1` | vs `surface-2` |
|---|---|---|---|---|
| spec (what CI measures) | `#71767D` | 4.14 | 3.70 | **3.12 ✓** |
| shipped (`oklch(0.545 …)`) | `#6B7177` | 3.84 | 3.43 | **2.89 ✗** |

**The app ships a control edge at 2.89:1 on `--c-surface-2` while
`npm run color` reports 3.12:1 and passes.** The hex fallback is
correct; the declaration that wins is not. (`--c-hairline` also drifted
but is exempt from 1.4.11, so it is cosmetic.)

The fix for the *class* of bug — not the instance — is 24 lines and
69 ms, with zero dependencies:

```js
import { tokens, surfaces } from "./palette.mjs";
import { oklch } from "./color.mjs";
// for each primitive: assert the hex declaration and the oklch
// declaration in css/style.css both resolve to the measured value.
```

Prototyped and run against the current stylesheet; it exits 1 with
exactly the two lines above. This is the single highest-value change
in this entire research round, and it is smaller than any paragraph
describing it.

---

## Öneri

**Do not adopt a design-system stack. Close the one gap in the one you
have.**

### Now (before the exam, ~2 hours total)

1. **Fix `--c-edge` and `--c-hairline`** in the `@supports` block so
   the shipped values are `oklch(0.564 0.012 255)` and
   `oklch(0.320 0.012 255)`. This is a live WCAG 1.4.11 failure.
2. **Add `tools/token-check.mjs`** (~24 lines, zero deps) and wire it
   into `npm run color` or `npm run check`. It asserts that every
   primitive's hex *and* `oklch()` declaration in `css/style.css`
   resolves to what `palette.mjs` computed. This is the entire benefit
   of Style Dictionary, at 0.04 % of its install size.
3. **Extend it to the light theme** by moving the light OKLCH
   coordinates out of `palette.mjs`'s prose and into the same
   structure, then checking the two light blocks against each other as
   well — the 33-line duplication becomes machine-verified instead of
   trusted.
4. **Correct `docs/design-system.md` §9.3.** It says two tiers; the
   stylesheet has three (19 primitive · 18 semantic · 10 component),
   and the third tier is dimensions-only, which is the *right* answer.
   Say so, and state the ceiling ("the component tier carries no
   colour") as a rule, the way Atlassian states five elevation levels.

### Next round (after the exam)

5. **Rename for one grammar.** `--ink` / `--ink-2` / `--accent-ink`
   uses `ink` in two senses. Atlassian's `foundation.property.modifier`
   is the model: `--ink`, `--ink-quiet`, `--ink-on-accent`. Mechanical:
   516 `var()` uses, one pass, the sweep catches misses.
6. **Add two fields to the §7 component table**: *when not to use it*
   and *content guidelines* (Turkish label length, English practice
   text). Polaris and Spectrum both publish these and this app needs
   them more, because it is bilingual by design.
7. **Revisit `light-dark()` after 2026-11-13**, when Baseline widely
   available lets the `@supports` fallback be dropped. Saves ~33
   duplicated declarations. Before that date it saves nothing, because
   the fallback must be written anyway. Prerequisite: extract the
   colours out of `--shadow-1`, `--shadow-2` and `--orb`, which are
   the 3 of 33 light declarations that `light-dark()` cannot express.

### File layout, if anything moves at all

Nothing should move. `css/style.css` stays one file in cascade layers;
`tools/palette.mjs` stays the token source; the new checker is the
bridge. The only structural addition worth considering later is
splitting the tokens layer into `css/tokens.css` imported by
`style.css` — and even that is a loss, because `@import` costs a round
trip on a phone and the layer order is declared in one place today.

### Deliberately NOT built

- **DTCG JSON as the source format.** It cannot express `need: { lc:
  90, wcag: 7.0 }`, which is the only reason `palette.mjs` exists, and
  its 2025.10 colour object is worse to hand-author than OKLCH
  coordinates.
- **Style Dictionary / Terrazzo / Tokens Studio.** 62 MB and 106
  packages, into a repo with zero dependencies, to solve
  multi-platform output for a one-platform app.
- **A component tier that carries colour.** Polaris's
  `color-button-gradient-bg-fill` is the failure mode; SLDS 2 deleted
  its component tier rather than maintain it.
- **CVA, variant tables, compound-component APIs.** They are React
  answers to a React problem. There are 21 components rendered by
  `js/dom.js` node builders; a variant is a class.
- **Token versioning, deprecation lifecycles, maturity labels,
  contribution checklists, adoption metrics.** Coordination machinery
  for teams that cannot talk. One person, one consumer, one branch.
- **A fourth theme.** Primer maintains 8+ because GitHub has 100M
  users. Two themes plus `prefers-contrast` plus `forced-colors` is
  already the full accessibility contract.

---

## Doğrulanamayanlar

- **`w3.org`, `designtokens.org`, `developer.mozilla.org`,
  `caniuse.com`, `primer.style`, `styledictionary.com` and
  `spectrum.adobe.com` are all blocked by this environment's egress
  proxy.** Facts sourced from them came via `raw.githubusercontent.com`
  (the repos themselves), the npm registry, or web search summaries.
  The URLs are cited so they can be re-checked by hand. [?]
- **The exact clause list of DTCG 2025.10.** The spec text itself was
  unreachable; the version string, date, and colour-object shape are
  from the community-group README, the W3C announcement summary, and
  the penpot issue that broke on it. The full `$type` enumeration
  (`color`, `dimension`, `fontFamily`, `fontWeight`, `duration`,
  `cubicBezier`, `number`, `strokeStyle`, `border`, `transition`,
  `shadow`, `gradient`, `typography`) is from prior knowledge and
  secondary summaries, not from the normative text. [?]
- **Tokens Studio pricing.** The plugin is free with a Pro tier and a
  14-day platform trial; no per-editor figure was retrievable. It does
  not affect the recommendation (rejected on the build-step ground,
  not on cost). [?]
- **Browser-version distribution among Turkish students' phones.** No
  data. The `light-dark()` timing recommendation rests on the Baseline
  widely-available date (2026-11-13), not on measured traffic — this
  app has no analytics, by design, so it never will. [?]
- **The 2.89:1 figure is computed with `tools/color.mjs`'s own WCAG 2
  implementation**, against the sRGB conversion of
  `oklch(0.545 0.012 255)`. A browser's own OKLCH→sRGB rounding could
  move the last digit. It cannot move it above 3.00. [?]
- **`--c-edge` was not re-measured under APCA** for the shipped value,
  because §1 states its requirement as WCAG 3:1 (`need: { ui: 3.0 }`),
  which is what 1.4.11 asks for. [?]
- **Whether the two `@supports`-block mismatches are a deliberate
  late-stage hand-tune or an uncorrected transcription.** Git history
  was not examined. Either way the checker is the answer: a deliberate
  change should have moved `palette.mjs` too. [?]
