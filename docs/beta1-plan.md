# Beta1 — the plan

2026-09-09. Synthesised from three arms that ran in parallel on the
owner's direction — *reading still not fixed, "minimalizm ve sığ
arasında", the orange does not contrast on white, brown-and-orange goes
shallow over time, rethink the whole UI professionally for a fully
presentable app* — plus what I measured and looked at myself
(`docs/audit/beta1-firsthand.md`).

| Arm | File | One sentence |
|---|---|---|
| Palette | `docs/research/beta1-palette.md` | The interface was one hue; a slate ground and an amber *pair* give it a second channel. **Shipped in v0.45.** |
| Hierarchy | `docs/research/beta1-hierarchy.md` | One quiet style does every job and it is the bold one; a scale with real steps and a weight axis that points up. |
| Audit | `docs/audit/beta1-ui.md` | 386 captures; ten A-class findings a stranger would judge, about twelve hours. |

This file is the build order. Where it disagrees with an arm it says
so and why.

**Status, end of 2026-09-09: all six rounds shipped** — v0.46 (round
one), v0.47 (the scale), v0.48 (the reader), v0.49 (the other screens),
v0.50 (the sweep learns the light theme), v0.51 (the design system
catches up). What §5 lists as "done means" holds except the last line,
which is the owner's: the slate on an OLED at night and the light button
on his own phone. Departures from the arms, decided while building: the
mistake book's figure is a title-size stat rather than the display,
because a tab screen has the brand at 22 and a card title at 28 and the
cap is four; the pane heading of §6.3 item 15 was not built — the panes
already start on one baseline and every pane but the index's list opens
with a label, so the item had no defect left to fix; the intro height
budget is 5.25 screens, measured, for the two-line row sub.

---

## 1 · The diagnosis, in one paragraph

The owner's three complaints were one fact. Every non-semantic token in
both themes sat in an eleven-degree hue band around the amber, so
hierarchy and depth had a single channel — lightness — and on a dark
ground APCA had already spent most of it. Then v0.41–0.42, fixing the
small-type contrast honestly, moved every secondary tier to 15/600 and
made *quiet*, *label* and *subtitle* the same style: that one style is
83% of the characters on the index and 98% of Profil. So the app is
one hue, one weight, and a scale whose middle has no steps. "Stuck
between minimalism and shallowness" is a precise description of a
monochrome interface with a flat type system. Neither is a matter of
taste and both are measurable, which is why both can be fixed.

---

## 2 · What is already done

- **v0.44** — stray asterisks in 21 strings; `*emphasis*` now renders
  as `<em>` and the validator rejects unbalanced marks.
- **v0.45** — the palette. Slate ground (H 255), OKLCH surfaces, amber
  pair (`#f1af5d` dark, `#a55d0c` with the page as ink on light), every
  ground hex outside the stylesheet moved, icons redrawn. Both themes
  pass every token and every size pairing. Looked at on the index and
  the topic overview.

Two things only a real phone can settle, from the palette arm's own
list: whether the slate reads *blue* on an OLED at night (then C 0.010
or H 240), and whether the light button reads *brown* (then H 50–55, a
redder terracotta, nearer `no`).

---

## 3 · The build, in order

Each round ships alone, passes `npm run check` and `npm run verify`,
and gets looked at in both themes before the next starts. `test` is
what Pages serves; a push is a deploy.

### Round 1 — A-class fixes that need no scale (½ day)

From the audit, the ones a stranger would judge and that do not depend
on the type system:

1. **Remove the two admissions of unfinishedness**: the first-run
   card's *"Uygulama hâlâ yazılıyor…"* and the whole Profil roadmap
   section (chips, reviewer statistics, `data/roadmap.json`'s note).
   The honesty section — what the app covers and does not — stays; it
   is a different sentence.
2. **The all-done card's sentence fragment**: `renderAllDoneCard` is
   handed a list phrase (*"okuma (21 puan) ve paragraf tamamlama (9
   puan)"*) where it needs a sentence.
3. **The intro bar**: *"Derslere dön" / "Derslere geç"* become two
   different verbs and nouns — the back action is *"Konulara dön"*, the
   forward one *"İlk derse geç"* — and the back action stops wrapping at
   320.
4. **A topic file that fails to load** gets the failure card the lesson
   route already has, instead of a silent fall-through with the hash
   left on `#egitim/konu/<id>`.
5. **The results hedge printed twice** — once per breakdown — prints
   once.
6. **`700` → `600`** everywhere. Source Sans has no 700; Chromium
   renders the 600 face, but the fallback during swap is a real 700, so
   the label lightens as the webfont lands.
7. **The Test tab's permanent, actionless empty-book card** becomes a
   sentence under the mixed-test card until the book has an entry.

### Round 2 — the scale (½ day) — hierarchy §6.1

This is the one that answers the owner's report.

- Tokens: **`--t-meta 15/20 · --t-body 18/28 · --t-lead 22/28 ·
  --t-title 28/32 · --t-display 36/40`**. `--t-ui` deleted (buttons and
  rows use body); 16, 17 and 19 gone. Ratios 1.20–1.29 between every
  adjacent step. `--s-10: 64px`.
- **Weight points up.** 400 reads, 600 heads, labels and emphasis.
  Nothing quieter than body is heavier than body, except a one-line
  label.
- **`--c-text-2` is legal at exactly two pairs**: 15/600 anywhere, and
  18/400 on surface-0/1 only (not on surface-2 — measured 75/75 there).
  Every quiet *sentence* is 18/400 text-2 on surface-0/1 or it is
  body; **meta is one line, a sentence is never meta.**
- `.btn--primary` label 18/600, measured into `PAIRS` against the amber
  in both themes. If it fails, the label goes to 20, not to a new face.
- `PAIRS` rewritten for the new pairs before any CSS changes — the
  instrument first, as with every round since v0.42.
- A per-screen cap of **four rendered sizes**, enforced in
  `verify-ui.mjs`.

**A disagreement, decided.** The hierarchy arm deletes `--t-ui`. I keep
one 15px token and call it `--t-meta`, because the nav labels and the
chips are the two places 15px is right and neither is "meta". The
token's name is the only thing at stake and it costs nothing to keep
the smaller vocabulary. What matters — 15px only at 600, no 16/17/19 —
is taken whole.

### Round 3 — the reader (1 day) — hierarchy §6.2

The lesson is the product and it renders every block as the same
`surface` with a label. In order of what a learner meets:

- **Contrast** — the whole point of every lesson — becomes the one
  full-bleed `surface-1` band (`.bleed`, radius 0), 22px serif side
  labels, 48 above and below. It is the most important thing on the
  page and it should look like it.
- **Forms** → rows with hairlines; the card goes.
- **Consecutive pitfalls** → one labelled group (172 pitfalls, always
  in runs, never labelled today).
- **Decision** → rows with hairlines, the outcome indented under its
  triggers. This fixes a real misreading the arm caught on
  `lesson-end-390-light.png`, where an outcome read as a trigger.
- **Checks** numbered, stems at lead; *"2 / 6"* replaces the percentage.
- Rhythm: 48 above every labelled block, 64 before the end card, 24
  between items inside a list-shaped block.

Nothing touches content, schema, validator or manifest. The block
vocabulary was the last schema change and this round proves it: every
change is rendering.

### Round 4 — the other screens (½ day) — hierarchy §6.3 + audit B

- Every explanatory paragraph currently in `.t-meta` → body or the
  18/400 quiet pair (results review, Profil, the lesson end, the Test
  cards' notes). The results review sets seven-line explanations in
  the 15/600 tier today — the worst reading surface in the app.
- Stat values → `--t-title`; the results score → `--t-display`; the
  mistake book gets a Stat.
- Row: title at body (serif 400 when English), **sub clamped to two
  lines**, min-height 56. The index gloss is the row's only explanation
  and it truncates with an ellipsis at 390 today.
- *"Ya da kısa bir testle başla"* → a text button on the keyline.
- Panes get a tracked heading aligned to the reading column's first
  baseline; the two columns start on one baseline.
- Audit B items that fit here: slash spacing, the theme control as a
  row beside the think-first switch rather than its own section, the
  lesson reader setting `document.title`, one error surface with one
  vocabulary.

### Round 5 — the sweep learns the light theme (½ day)

`npm run verify` runs dark only. A colour mode multiplies almost none of
the geometry checks, so the cheap and honest addition is: every screen
the flow lands on is also loaded once with `data-theme="light"` and
audited for console errors, overflow and the accessibility contract.
The light theme has been looked at by eye on four screens; that is not
the requirement, the sweep is.

### Round 6 — the design system catches up (½ day)

`docs/design-system.md` is the binding spec and it is now wrong in
named places (hierarchy §6.4 lists them by section): *Scope* says dark
only; §1 describes warm neutrals; §2.2 lists 15/400 text-1 as legal
(the tool says 15/400 needs Lc 100 and nothing reaches it — that row is
mine, from v0.41, and it is stale); §7.1 says a row sub is one line
always. Rewrite those sections against what shipped, and close §11.2.
Also `CLAUDE.md`'s Design paragraph and `app1-final.md` §7 (*"a theme
toggle — out"* shipped in v0.43).

---

## 4 · What beta1 refuses

Taken from the three arms and kept as a list so the next session does
not spend a round rediscovering them:

- A third weight (500 cannot be checked by `npm run color`; 700 costs
  14 KB for a job size does better) and an italic face.
- Borders, icons or a colour per block type; a card around the
  contrast; tabs or paged screens in the reader.
- A wider measure; a pane in the reader or the quiz.
- All-caps labels; meta at 400 on dark below 18px; body at 17.
- Gradients, glassmorphism, a second accent, a duller amber to stop it
  "floating" — one accent, one job, fewer marks if it is too many.
- Reading passages and paragraph completion — the owner said they are
  not required for beta1.

---

## 5 · Done means

- Rounds 1–6 shipped, each verified, each looked at in both themes.
- Nothing on any screen says the app is unfinished.
- `npm run color` green for both themes and every pair; the per-screen
  size cap holds; the sweep covers light.
- The design system describes the app that exists.
- The owner has looked at the slate and the light button on his own
  phone and either kept them or turned the two named knobs.

Roughly **three and a half days** of work by the arms' own estimates,
which have been about right so far.
