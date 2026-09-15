# Supervisor's verification log — round two

Arms are not taken at their word. Round one had three claims that did
not survive checking, and one of them would have changed the type scale
for the wrong reason. This file records what was checked, what held, and
what did not. It grows as arms return.

---

## Arm 2 — the exam artifact

### Claim: options are numbered, the exam letters them. **Holds.**

`js/answers.js:56`:

```js
button.appendChild(el("span", "option__key t-num", String(index + 1)));
```

So the badge reads `1 2 3 4`. Checked the claim about the exam
independently through the arm's own quoted snippets; ÖSYM-family items
letter `A) B) C) D)`. The gap is real.

### But: the digit is load-bearing, and the arm did not see it.

`js/quiz.js:332–335`:

```js
const choice = Number(event.key);
if (Number.isInteger(choice) && choice >= 1 && choice <= 4) {
  event.preventDefault();
  document.querySelectorAll(".option")[choice - 1]?.click();
}
```

The badge is not decoration and not a label: **it is the keyboard
shortcut, shown rather than hidden.** The comment in `answers.js` says
so, and this is a deliberate accessibility choice — a hidden affordance
only a mouse user could guess at was rejected.

So "letter the options A–D" is not a one-line label change. It is one
of three moves, and they are not equivalent:

1. **Badge becomes A–D, shortcut moves to the A/S/D/F or A–D keys.**
   Keeps the correspondence. Costs: `quiz.js` key handling, the
   `verify-ui.mjs` rows that assert on the badge, and any lesson-check
   path that shares `answers.js`.
2. **Badge becomes A–D, shortcut stays 1–4.** Breaks the
   correspondence the comment exists to protect — the learner sees `A`
   and must know to press `1`. Rejected on its own terms.
3. **Badge shows both.** Doubles the badge's width at 320px, which is
   the width the whole shell is verified at first.

None of these is obviously right, and the choice is a product decision
rather than a design one. Recorded as open. The fidelity argument is
sound; its cost was understated.

Note also that the shortcut is a desktop affordance and the exam
fidelity argument is strongest on a phone, where there is no keyboard —
but the app is swept at 1280 as well as 320, so the shortcut is real
for part of the audience either way.

### Claim: the app's Turkish rubric is in the wrong register. **Holds.**

`js/prompt.js:16`:

```js
[QUESTION_TYPE.RESTATEMENT]: "Aşağıdaki cümleye anlamca en yakın seçeneği bul.",
```

Two differences from the exam's own formula, both real:

- **`bul` vs `bulunuz`.** The exam uses the formal plural imperative
  throughout. `bul` is the informal singular — the register a friend
  uses, not the register the paper uses.
- **`seçeneği` vs `cümleyi`.** The exam names the object sought. On a
  closest-meaning item that object is a sentence, not an "option";
  `seçeneği` describes the UI, `cümleyi` describes the task.

This is the cheapest fidelity available in the whole document: one
string, no layout, no byte cost, and it is the sentence the learner
reads before every restatement item. Worth noting that `CLAUDE.md`'s
language convention already says UI strings are Turkish and that the
app should use terms students recognize — this is that rule applied to
the rubric, which nobody had done.

Also worth checking when this is acted on: `INSTRUCTION` currently has
**one** entry, for `RESTATEMENT` only. Cloze items get no instruction
at all, deliberately ("a gap in a passage explains itself"). If exam
rubrics are adopted, that decision should be restated rather than
silently reversed.

### Claim: the section order matches the exam. **Holds, and is worth keeping.**

The arm found the exam's order — cloze → closest meaning → reading →
paragraph completion — independently of this repo, and it matches what
`js/topics.js` already carries. That is a piece of fidelity the app got
right without arguing for it, which is worth writing down so a future
round does not reorder the tabs for visual reasons.

### On the TAP literature: the arm corrected round one, and is right to.

`12-arastirma/06-rakip-analizi.md` leaned on Morris/Bransford/Franks
1977 to argue for visual fidelity. Arm 2 points out that paper is about
**encoding–retrieval task match**, not visual chrome, and adds the
outshining hypothesis — that strong noncontextual cues suppress
context-match effects. A four-option recognition item is full of
noncontextual cues. So the visual-fidelity lever is smaller than round
one implied.

This is the correct direction of travel: it weakens an argument this
project would have liked to be true. Recorded as a correction to
round one, not to arm 2.

---

## Arm 3 — non-text area (still running; specimens checked in flight)

The arm is building specimens in both themes, as asked. Two measured
defects in the first pair, and one finding that came out of checking
them which is larger than either.

### The specimen's plate breaks the contrast bar. **Confirmed.**

Sampled `03-ornekler/01-grammar-diagram-dark.png` at the plate:
`#6F6156`, CIE L\* 42.2. Measured with `tools/color.mjs`:

| ink | Lc | WCAG | Lc ≥ 90 and WCAG ≥ 7 |
|---|---:|---:|---|
| `text-1` `#F4F7FB` | 80 | 5.55 | **fails** |
| pure white | 85 | 5.97 | **fails** |

So the 29.4 % mid-tone that specimen scores is bought by putting text on
a surface that would fail `npm run color` and the sweep.

### And the window is far narrower than anyone assumed. **New.**

Solving for the overlap between "counts as mid-tone" (CIE L\* ≥ 30) and
"can carry body text at this project's bar":

| ink | text-bearing ceiling | overlap with the mid-tone band |
|---|---:|---:|
| `text-1`, L 0.975 | CIE L\* 30.4 | **0.4 points** |
| pure white | CIE L\* 36.8 | **6.8 points** |

In the light theme there is no overlap at all — the text floor is L\* 89
and the band ends at 70 (`08-iki-tema-asimetrisi.md`).

**A mid-tone region can either carry text or be mid-tone, essentially
not both.** That is the sharpest constraint this round has produced and
it was found by auditing a specimen rather than by reasoning. It splits
the taxonomy the arm is building into two kinds that are not
interchangeable:

- mid-tone that carries text — a 6.8-point sliver, dark theme only,
  near-white ink only, and unavailable in light;
- mid-tone that carries none — unbounded, and the only kind that works
  in both themes.

The second is the one the rejection condition can actually be met with.

### Turkish İ bug reproduced in the specimen. **Confirmed.**

`<div class="eyebrow">Present Perfect vs Past Simple` carries no
`lang="en"`, and the specimen's CSS uppercases it. The rendered PNG
reads **PAST SİMPLE** with the dotted İ — the exact trap `CLAUDE.md`
documents. Relayed to the arm.

### What the specimens do get right

Worth recording, because it is the first evidence in nine rounds that
the mid-tone problem is solvable at all:

- The diagram is the first time this app's "X vs Y" pedagogy has been
  **drawn** rather than described. `been` and `gone` as two journeys
  against a NOW marker is a real teaching object, not ornament.
- The dark and light pairs measure within one point of each other on
  mid-tone (29.4 / 30.3 and 6.5 / 6.7). That is the theme-independence
  the counter-plane requires, demonstrated rather than asserted.
- Neither specimen clears all three rejection conditions alone: the
  diagram passes mid-tone (29.4 %) and event area (38.7 %) but carries
  no measurable colour family in light; the record strip passes the
  colour family (H60 at 2.6 / 2.8 %) and fails mid-tone (6.5 / 6.7 %
  against a 10 % floor). The combination result is the finding, not
  either specimen.

---

## Arm 5 — the record

### Claim: `selected` is stored and never read. **Confirmed.**

`js/quiz.js:115` writes it into every stored attempt:

```js
selected: question.selectedAnswer ?? null,
```

and `js/storage.js` contains **zero** occurrences of `.selected`
(`grep -c` returns 0). So the exact wrong option the learner chose has
been on disk since v0.34 and no aggregator has ever looked at it.

That matters more than it sounds. This repo's `question-author.md`
requires every distractor to be defensible, and the corpus carries
`optionNotes` explaining what each one tempts. With `selected` already
recorded, the app can say *which* wrong answer was chosen and what that
choice reveals — with no schema change and no migration. It is the
cheapest thing in either round.

### Claim: no category can ever earn an unhedged weakness claim. **Confirmed.**

`js/storage.js:43` sets `MIN_ITEMS_FOR_WEAK_CLAIM = 6`, and line 427
gates the confident flag on `stats.total >= MIN_ITEMS_FOR_WEAK_CLAIM`.
Reading lines 400–414, `total` increments once per distinct question id
in `getItemStats()`, so it is bounded by how many questions the grouping
actually has.

Measured from `data/`:

```
toplam soru 241, kategori 60
kategori başına soru dağılımı: {"4": 59, "5": 1}
en büyük kategori: 5 soru
```

Five is less than six. **No category in this app can reach the
threshold at any accuracy, ever, under the current corpus.** Profil's
"az veriyle sıralandı" hedge is therefore permanent, not interim — and
nobody knew that. It turns `app1-final.md` §7's content debt from a
scheduling note into a display-honesty one.

### The arm's open question #4, closed here — and it inverts.

The arm could not check whether the state fills land in the mid-tone
band and left the exact command to run. Ran it:

| token | dark | | light | |
|---|---|---|---|---|
| `ok` | `#7CCD8E` | L\* 0.760 | `#1F8944` | **L\* 0.502 ✓** |
| `no` | `#E97871` | **L\* 0.633 ✓** | `#D14B48` | **L\* 0.508 ✓** |
| `accent` | `#F1AF5D` | L\* 0.762 | `#A05801` | **L\* 0.449 ✓** |
| `accent-2` | `#F69C51` | L\* 0.722 | `#B44200` | **L\* 0.437 ✓** |
| `focus` | `#F4DAB2` | L\* 0.883 | `#825023` | **L\* 0.389 ✓** |

**In the light theme every state colour is already mid-tone. In the
dark theme only `no` is.**

So the arm's §6 arithmetic — a 60-cell heat grid filling ~10.5 % and
clearing the 10 % bar — holds in **light** and fails in **dark**, where
a grid of `ok` and `accent` fills at L\* 0.76 contributes almost
nothing to the band.

And that is the exact mirror of `08-iki-tema-asimetrisi.md`. The light
theme cannot take mid-tone from its surfaces but gets it free from its
accent pair; the dark theme can take some from its surfaces and gets
none from its accents. Neither theme has a single mechanism that works
for both, which is now true from two independent directions.

The practical consequence for the dark theme: if coloured marks are to
carry mid-tone there, the state colours would have to be re-solved
darker — and they were solved against a 3:1 requirement on the page,
so darkening them is not free. That trade was not on anyone's list
before this check.

---

## Arm 1 — surface and depth

### Claim: the app has no hover or pressed surface tokens. **Confirmed.**

```
grep -c "--c-[a-z-]*hover|--c-[a-z-]*press|--c-[a-z-]*active" css/style.css
0
```

Seventeen `:hover` / `:active` rules exist, and they reuse existing
tokens (`var(--raised)`, `var(--accent-tint)`) rather than declaring
interaction states of their own. Radix spends three of its twelve steps
on exactly this, and Carbon and Atlassian both carry the tokens.

The arm's larger point is worth stating in its own words rather than
mine: **none of `00-v4-olcumu.md`'s three metrics could ever have caught
this**, because all three are measured from static screenshots and a
hover state does not appear in one. That is a real limit of the
measurement programme this round has been leaning on, and it is the
first time anyone has named one.

Whether it explains the "shallow" complaint better than step count does
is an argument, not a measurement, and it is recorded as such.

### Claim: `css/style.css` already uses the Atlassian high-contrast strategy. **Confirmed.**

Lines 280–308. Under `prefers-contrast: more` the surfaces are **not
touched**; what changes is `--c-text-2` (collapsed to `--c-text-1`),
`--c-text-3`, `--c-hairline`, `--c-edge` and `--line`. Freeze the
ladder, raise the ink and the borders — which is what `@atlaskit/tokens`
does in its increased-contrast theme. Worth having: this was a decision
made without a precedent and now has one.

### Claim: the references' dark ladders top out at L\* 29–30, matching the proposed L\* 30.3 ceiling. **Holds directionally; the precision is overstated.**

This is the arm's headline and I could not reproduce its exact figures.
I ran an independent, deliberately cruder pass — 1.2 % area floor, a
simple max-minus-min channel test for neutrality, plateaus merged within
2 L\*:

| reference | neutral plateaus | dark tier (L\* ≤ 45) tops at |
|---|---|---:|
| 8 midnightreads | L\* 0 (2.2 %), 24 (59.9 %), 85 (1.8 %) | **24** |
| 10 wearable | L\* 10 (77.0 %), 24 (1.5 %), 37 (1.2 %) | **37** |
| 1 traffic | L\* 6, 16, 21, 24, then 56 (4.2 %), 64 (4.6 %) | **24** |
| 3 log | L\* 4 (47.1 %), 90 (8.8 %) | **4** |
| 4 wallet | L\* 4 (35.5 %), 80 (19.5 %), 93 (6.5 %) | **4** |

So my pass finds 2 and 3 dark plateaus where the arm found 5 and 4, and
tops of 24 and 37 where it reported 29 and 30. My method is the cruder
one and the disagreement is most likely mine, not the arm's — but the
claim should be read as **a bracket, not a match**: two independent
methods put the reference dark ceiling somewhere in L\* 24–37, and the
proposed surface-4 at L\* 30.3 sits inside that bracket. That is real
corroboration and it is weaker than "landing almost exactly on".

Recorded because overstating a corroboration is the specific failure
this round is trying to avoid, and because the arm was otherwise
careful enough to flag its own unrun checks.

### An unlooked-for result in the same table

Two of the owner's five references carry large **neutral mid-tone**
plateaus that are not surfaces: traffic at L\* 56 and 64 (4.2 % and
4.6 %), wallet at L\* 80 (19.5 %). These are the counter-planes
`02-references.md` named and never located. They are neutral, so the
hue-family metric never saw them; they are mid-tone, so `midtone.py`
counts them; and they carry no text at those lightnesses, which is
consistent with the 0.4-point text/mid-tone overlap measured under arm
3 above.

Three independent measurements now say the same thing: **the mid-tone
is non-text area, and in the references it often is not even
chromatic.**

---

## Arm 3, final — and the single most useful measurement of the round

### Claim: our nine screens contain no connected mid-tone region at all. **Confirmed, exactly.**

I wrote an independent flood-fill over the mid-tone mask (CIE L\* 30–70,
4-connected, 0.03 % area floor) and ran it on
`docs/design/11-ui/shots/*.png`. My numbers match the arm's to the
fragment:

| screen | mid-tone regions | ≥ 0.5 % |
|---|---:|---:|
| 1 Bugün · 2 Konular · 3 Konu · 4 Ders · 5 Soru · 7 Sonuç · 9 Deneme | **0** | 0 |
| 6 Cevap | 4 | 0 |
| 8 İlk açılış | 4 | 0 |

The eight fragments that exist measure 0.06–0.20 % of frame with aspect
ratios of 42 : 1, 109 : 1, 162 : 1, 62 : 1, 62 : 1, 50 : 1 — card
outlines and a focus ring.

**So the 2.2 % mid-tone UI v4 scores is almost entirely anti-aliasing on
strokes and letter edges.** Not one filled region anywhere in the app.

This reframes nine rounds of rejection in a sentence: the deficit was
never a missing surface value. The ladder in `07-karar.md` already
reaches L\* 30.3. **Nothing in this app is drawn as a field.** Every
screen is type, rules and outlines on a ground — which is exactly what
"structure dressed as a document" meant in the UI 2 post-mortem, and
nobody had a number for it until now.

### Claim: specimen B′ clears all three rejection conditions in both themes. **Confirmed.**

Measured with `measure-screens.py` and `midtone.py`:

| specimen | mid-tone | event | hue family |
|---|---:|---:|---|
| A grammar diagram, dark | 18.1 % | 27.5 % | H60 0.8 % ✗ |
| A grammar diagram, light | 19.5 % | 25.5 % | H60 0.5 % ✗ |
| B record strip v1, dark | 6.5 % ✗ | 15.1 % ✗ | H60 2.6 % |
| B′ record strip v2, dark | **15.1 %** | **23.7 %** | **H60 8.0 %** |
| B′ record strip v2, light | **15.3 %** | **22.9 %** | **H60 8.2 %** |

B′ is the first artefact in nine rounds to clear all three gates, and it
does it in both themes within 0.2 points of itself. The v1 → v2 change
was arithmetic — cell count and fill ratio — not taste, which is worth
recording because it means the gates are tunable rather than lucky.

### But B′ is a measurement, not a design. Said plainly, with a number.

Ink distribution down the frame, 12 horizontal bands, share of pixels
more than L\* 8 from the ground:

```
  y   0- 70   % 3.4
  y  70-140   %45.7  ██████████████████
  y 140-211   %56.4  ██████████████████████
  y 211-281   %53.8  █████████████████████
  y 281-351   %45.5  ██████████████████
  y 351-422   % 7.0
  y 422-492   %16.1
  y 492-562   % 6.0
  y 562-633   % 0.0
  y 633-703   % 0.0
  y 703-773   % 0.0
  y 773-844   %60.5  ████████████████████████
```

**211 px — a quarter of the screen — is completely empty**, and the
mosaic takes the top third at 45–56 % density. The composition is
top-heavy with a dead quarter above the action.

Looking at it rather than measuring it, three more things are wrong and
should be said before anyone mistakes this for a proposal: the mosaic's
colours do not legibly encode anything (ten columns above four category
labels that do not map onto them); the browns read muddy, which is the
same complaint the owner made about the glass in round eight; and the
record is the loudest object on the entrance, above the task the learner
came to do.

None of that invalidates the specimen. Its job was to answer *can the
three conditions be met simultaneously by non-text area, in both
themes*, and the answer is yes. Whether this particular object is any
good is a different question and today the answer is no.

That distinction is the one to hold on to: **this round proved the gates
are reachable. It has not produced a design, and presenting it as one
would be the ninth rejection.**

---

## Arm 7 — space, grid and rhythm

### Claim: the spacing scale is disciplined and is not the neglected axis. **Holds.**

I ran my own audit over the layout layer onward — every `padding`,
`margin`, `gap` and `border-radius` declaration:

```
toplam 123, var() kullanan 106, kullanmayan 17
```

My count differs from the arm's (123 / 17 against its 130 / 2) because
we scoped and matched differently, but the conclusion survives
inspection: of my seventeen, **every one is defensible**.

```
  4  border-radius: 50%        gerçek daire, jeton olamaz
  3  margin: 0 auto            ortalama
  2  padding-top: env(safe-area-inset-top, 0px)
  1  padding-bottom: env(safe-area-inset-bottom, 0px)
  2  padding-inline: 0     1  padding: 0     1  padding-block: 0
  1  margin-inline: 0      1  border-radius: inherit
  1  gap: 0.35em
```

Explicit zeros, true circles, platform insets and one relative `0.35em`.
That is the whole list. **No `spacing-check.mjs` exists** — unlike
colour, which has `npm run color` in CI — and the discipline held
anyway, across eight rounds that rewrote everything else.

So the axis nobody examined turns out to be the healthy one. That is a
real negative finding and it is worth as much as a positive: it removes
a suspect. The arm's suggestion of a cheap enforcement check is
reasonable insurance, not a repair.

### Claim: the wide frame measures 968px against a documented 1000px. **Does not hold — two different things were compared.**

The CSS is arithmetically correct:

```css
--w-page: 640px;      --w-aside: 320px;      --s-8: 40px;
--w-wide: calc(var(--w-page) + var(--s-8) + var(--w-aside)); /* 1000px */
```

640 + 40 + 320 = 1000. And `design-system.md` §7.3 is consistent with
it — it says the reading column is `--w-page`, **640px, of which 608px
is content**, and §0 line 51 gives the gutter as 16.

The arm measured **608** + 40 + 320 = **968**, i.e. it took the column's
*content* width and added it to the pane's *box* width. The missing
32px is the column's own two 16px gutters, which the documentation
names on the same line it gives the 640.

No documentation gap. Recorded because it is the second arm claim this
round that did not survive checking, and because a "documentation is
wrong" finding is exactly the kind that gets acted on without being
re-derived.

### The finding in this arm worth acting on

Not the scale — the **budget**. The arm measured a realistic
99-word paragraph-completion stem rendering at **784px across 28 lines
at 320px width**, which puts all four options roughly **620px below the
fold**. Block B of `app1-final.md` is a screen where the learner cannot
see the question and its options at the same time on the smallest
phone, and no amount of spacing discipline fixes that — it is a
question about how that item type is presented at all.

That belongs in front of whoever builds Block B, and it was found by
measuring rather than by designing.

---

## Arm 6 — the drawn layer

### Claim: the §6 icon contract is violated almost everywhere. **Confirmed.**

`docs/design-system.md:718–720` is unambiguous:

> **Stroke width is absolute, not scaled.** Rendering a 24px icon at
> 20px turns a 2px stroke into 1.67px and the set goes soft. Icons
> render at their design size, or they get redrawn.

And `js/icons.js` sets the root once:

```js
const DEFAULT_SIZE = 24;
viewBox: "0 0 24 24",
"stroke-width": "2",
```

`viewBox` is fixed while `width`/`height` are what `size` changes, so
the stroke scales with the box. Counted every call site outside
`icons.js`:

| size passed | calls |
|---:|---:|
| 20 | 14 |
| 18 | 5 |
| 22 | 2 |
| **24** | **2** |
| 28 | 1 |
| 64 | 1 |

**Two of twenty-five calls render an icon at its design size**, and both
are the bottom nav. Everything else renders a stroke of 1.5px (at 18),
1.67px (at 20), 1.83px (at 22), 2.33px (at 28) or 5.33px (at 64) — the
exact failure the rule was written to forbid, including the worked
example in the rule's own sentence.

This has been true across UI 2, UI 3 and every round since, and the
sweep never caught it: `verify-ui.mjs` measures text sizes and weights,
not rendered stroke widths. That is the second blind spot this round has
found in the verification programme, after arm 1's point that a hover
state cannot appear in a screenshot.

Worth being precise about what the finding is and is not. It is not
that the icons look wrong — nobody has complained about them. It is
that **the specification and the code disagree, and the specification
lost silently.** Either the rule is wrong (a single master genuinely
scaling is what Feather and Lucide do, and they ship at multiple sizes)
or the code is, and that is a decision, not a bug report.

### And a process failure that is mine, not the arm's

The arm reports that its in-progress specimen files were swept into
commit `b79bd5d` by a concurrent `git add`, although it never ran git
itself. That is correct, and it was me: the brief told every arm not to
commit, and I was committing whatever landed under `13-detay/` each
turn to keep the working tree clean for a repository hook.

Recorded because it matters for reading the history: some specimen
files in this round's commits were captured mid-write, and one
(`01-grammar-diagram.html`) had to be deleted a commit later when its
arm replaced it with a dark/light pair. No arm violated its brief.

---

*(Arm 4, reading typography, still running at the time of writing.)*
