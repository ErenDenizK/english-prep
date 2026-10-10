# UI 2 — the rebuild

2026-09-10. The owner's verdict on the beta1 and "premium" rounds
(v0.46–v0.56), in substance: *the improvement asked for did not arrive,
the new features were faulty, the structure is still visibly wrong; do
not improve what is there — start over, keep the good systems, and lay a
base that development can continue from.* He is right on each count,
and this file is the programme that answers it.

Marks as elsewhere: [S] a source read; [?] unverifiable from here;
[≈] an estimate.

---

## 1 · Why increments stopped working

Six rounds in five days each fixed the thing named in the last piece of
feedback — a scale, a reader, a palette, a chrome — and each one was
measured green before it shipped. The screens still did not add up,
because nothing above the component level was ever *designed*. There
is no rule for what a screen is. Each of the seven screens grew its own
top (a brand header, a strip with a back button, a strip with a
counter, nothing), its own way of grouping (cards, rows, prose, bands)
and its own bottom (a tab bar, an action bar, a card of buttons). Every
new feature therefore invented its structure on arrival, and the sum
reads as improvised even where every part is correct. v0.56 was the
end of that road: three features added at the chrome level, each fine
on its own terms, each breaking the page because the page had no
terms.

Checked on three emulated phones on 2026-09-10 (`scratchpad/audit2`):
text showing through the translucent bars wherever the blur was not
composited; rows running out from under a floating tab capsule
narrower than the content; a header glow reading as a smudge. Reverted
in v0.57. The lesson is not "be more careful"; it is that the chrome
and the page need a contract, and there was none.

## 2 · What is kept, because it works

These were built by measurement and have held under every round:

- **The palette** — two themes solved in OKLCH against APCA and WCAG,
  cross-checked against the reference implementations, re-measured in
  CI (`tools/palette.mjs`). The values move only if the tool says so.
- **The type scale** — 36 · 28 · 22 · 18 · 15, weight axis pointing up,
  15 only at 600 and only for a line, at most four sizes on a screen.
- **The lesson block vocabulary** and its rendering as four parts —
  boundary, reference, practice, rule — with the contrast as the one
  band.
- **The engine underneath**: hash routing in one document, storage,
  the quiz engine, the validator, the content, the service worker, the
  focused-mode rule (reader and quiz hide the tabs), the two-tab
  navigation with Profil in the bar.
- **The verification**: `npm run check`, the browser sweep, the pairs
  check. The sweep is the requirement; the rebuild adds the checks the
  new contracts need and removes none.

What goes: every visual decision taken per screen. The stylesheet is
rewritten from a blank file against the contracts below; the screens
are recomposed on them; the JavaScript keeps its logic and changes only
what it renders.

## 3 · The base structure

Three contracts, and everything on a screen is an instance of one.

### 3.1 The screen

Every screen — the three tabs, the topic screen, the reader, the quiz,
the results — has the same anatomy, and declares it:

```
screen
  bar    leading · title · trailing        opaque, 56px, hairline below
  body   the one scroll region             sections, gutter 16, measure 608
  foot   tabs | actions | none             opaque, hairline above
```

- **The bar always has a title.** Root tabs are titled by their tab —
  *Eğitim*, *Test*, *Profil* — and a child screen by what it is: the
  topic's name, the lesson's category, *Test* with a counter, *Sonuç*.
  The brand is not a title; it appears where the app introduces
  itself (the first-run card, Profil's *İçerik hakkında*, the manifest)
  and nowhere else in the chrome. Android's app anatomy and Material's
  top app bar both put the screen's name here, and Apple's navigation
  bar does the same; the point is that a person always knows where
  they are, which is the definition of structure.
- **Leading** is a back action on a child screen, named for where it
  goes (*Konular*, *Dersler*), and empty on a root. **Trailing** holds
  one thing: the profile control on roots, a counter or progress on
  children, nothing on the quiz (its exit is the leading slot).
- **Foot** is the tab bar on roots, the action bar where the screen has
  a forward action (topic, quiz, results), and nothing in the reader —
  the reader's forward actions are at its end, where a reader arrives
  at them. This is the rule the app already lives by; it is written
  down now.
- **Opaque bars, in the column.** Content never passes under chrome
  (§1). Android's edge-to-edge guidance (*"the body must continue under
  navigation and system bar regions"*, [Android app anatomy][aa]) is
  right for a platform that guarantees the blur; the web does not, and
  a reading app cannot gamble its labels on a filter [S].

[aa]: https://developer.android.com/design/ui/mobile/guides/layout-and-content/app-anatomy

### 3.2 The section

A body is a vertical sequence of sections. A section is a head and one
container, and there are exactly four containers:

| container | what it holds | separation |
|---|---|---|
| **list** | homogeneous rows | hairline between rows, none around |
| **card** | one heterogeneous group with an action | surface-1 fill, 16px radius |
| **prose** | paragraphs and inline marks | space only |
| **band** | one raised block inside prose (the contrast) | surface-1, full-bleed, no radius |

The head is a label (15/600, the accent's text colour, tracked) with an
optional one-line hint; 48 above it, 8 below. A section never contains
a section; a card never contains a card; a list is never inside a card.
Where a screen today has "a card, then a search field, then a sentence,
then a labelled list", the rebuild asks which section each is and gives
it a head or removes it.

### 3.3 The component

Fourteen, each with a written spec (anatomy, sizes, states, tokens,
accessibility) and a place on the catalogue page, and no fifteenth
without a spec first:

Bar · TabBar · ActionBar · Button (filled / tonal / text / icon) ·
Row · Card · SectionHead · Stat · Chip · Field · Listbox · Dialog ·
Progress · Feedback · Option.

Components reference **semantic tokens only**, never primitives — the
layering the design-system literature agrees on (primitive → semantic →
component; [Atlassian][at], [Contentful][ct]) [S] — so a theme is a
semantic layer and a component never knows which theme it is in. The
existing tokens are renamed into that layering without changing a
value: `--c-surface-0` becomes `--page`, `--c-surface-1` `--card`,
`--c-text-1` `--ink`, and so on, with the old names kept as aliases
until every rule is moved.

[at]: https://atlassian.design/foundations/tokens/design-tokens
[ct]: https://www.contentful.com/blog/design-token-system/

### 3.4 Motion, theme, verification

- **Motion** is three things and no fourth: the route crossfade
  (`startViewTransition`, skipped under reduced motion), the entrance of
  an arriving screen, the eased progress fill. Pressed states scale;
  hover changes surface. Feedback appears; it does not perform.
- **Theme** is the semantic token layer, dark and paper, chosen in
  Profil or by the phone. No value changes in this rebuild.
- **Verification** grows a fourth section: *anatomy*. On every screen
  the sweep lands on it asserts a bar with a title, a body that starts
  below the bar and ends above the foot, opaque chrome, and at most one
  container kind per section. The pairs check gains the bar title.

## 4 · The phases

Each ships alone on `test`, green in `npm run check` and the sweep,
looked at on three emulated phones in both themes before the next
starts. Estimates are working days [≈].

| phase | ships | acceptance |
|---|---|---|
| **1 · Foundation and shell** (1) | `css/style.css` rewritten from a blank file: tokens in three layers, reset, the screen anatomy, the four containers, the fourteen components with their existing class names, utilities. `js/shell.js` gains `setBar({ title, back, trailing })`; every screen sets its bar; the brand leaves the chrome. | Every existing check green; the sweep's new anatomy section green on all seven screens; no `.surface`/`.row` rule left that a screen overrides. |
| **2 · Components** (1) | Each component rebuilt to its spec with every state; `docs/components.html` regenerated as the catalogue, one section per component, in both themes. | A component's states are enumerable from the catalogue; the sweep audits the catalogue at 320 and 390. |
| **3 · Screens** (1½) | The seven screens recomposed on the section grammar: Eğitim root, topic, reader, Test root, quiz, results, Profil. Ad-hoc exceptions removed (the search field's placement, the lesson-end card, Profil's essay order, the quiz's counter). | The intro budget and index budget hold; every section has a head or is the screen's first; nothing on a screen is outside a section. |
| **4 · Spec and hand-off** (½) | `docs/design-system.md` rewritten as the specification of *this* system — anatomy, sections, components, tokens, motion, theme, verification — so the next feature is placed rather than invented; CLAUDE.md's Design paragraph; `docs/redesign-plan.md` and `docs/beta1-plan.md` marked historical. | A new feature can be described entirely as "which screen, which section, which container, which components". |

Roughly four days [≈]. **Shipped 2026-09-10 as v0.58 (phase 1), v0.59
(phase 2), v0.60 (phase 3) and v0.61 (phase 4)** — the acceptance in
each row holds, and design-system §0 is now the specification of the
structure. The owner's verdict on the result was that it was ugly, and
`docs/ui3-plan.md` (v0.62) is the answer: the same structure, given
light, depth and motion. §5's first refusal — translucent chrome — is
reversed there, with the defect that justified it engineered out.

## 5 · What this refuses

- Translucent chrome, floating chrome, ambient light — until the day a
  blur is guaranteed everywhere the app runs, which is not the web.
- A wider measure, a pane in the reader or the quiz, a third tab, a
  large-title bar that collapses (a second bar type before the first is
  finished).
- Any change to content, schema, routing, storage, the palette's values
  or the type scale, in this programme.
- Adding a component without its spec and its catalogue entry.
