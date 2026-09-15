# Reading typography, in detail, for this exact page

Research arm 4 of the second round. 2026-09-15. The question this arm
was given: not typography in general, but typography for *this*
content — Turkish UI prose with English sentences embedded inside it,
on a 320–608px column, in a dark theme, read by someone whose ear for
English is good and whose eye has never been taught the grammar.

**Method.** Every number below is either measured here against this
repo's own `data/**/*.json`, `js/*.js` and `fonts/*.woff2` (in Node, or
in Chromium 141.0.7390.37 via Playwright, `executablePath:
"/opt/pw-browsers/chromium"`), built here with `fontTools` 4.64 /
`pyftsubset` against font files fetched today, or cited via `WebSearch`
with the source named. Reproduction scripts live in the session
scratchpad, not in this repo. **Nothing outside this file was changed,
and nothing in the app was touched.** Markers follow `00-brief.md`:
**[S]** read at source or measured here, **[≈]** inferred but
consistent, **[?]** unverified.

---

## 0 · The short version

1. **The corpus is genuinely code-switched, not just bilingual by
   screen.** 54.2% of the 2,530 Turkish-labelled strings in `data/`
   contain at least one embedded English word, and 88.6% of those
   sit mid-string, not at an edge. §1.
2. **The app's `lang="en"` convention is applied at the block level
   and stops exactly at the sentence boundary.** A whole English
   sentence or a whole grammar-form label gets its own line, its own
   `lang="en"`, its own serif face. An English word quoted *inside* a
   Turkish sentence — which is the majority case, not the exception —
   gets none of that: no `lang`, no font change, nothing. This is the
   central finding of this document. §2.
3. **`hyphens: auto` is provably inert in this test environment for
   every language tried, Turkish included** — and the reason is
   documented: Windows, Linux and ChromeOS builds of Chromium ship
   *zero* hyphenation dictionaries; only Android and macOS/iOS pull
   from the OS. Whether Android's set includes Turkish could not be
   confirmed. §1.4.
4. **The already-shipped safety net (`overflow-wrap: break-word`)
   does the real work, dictionary or not**, and it does not care about
   `lang`. That is good news and bad news at once: it prevents
   overflow, but it will break an unmarked English word using
   Turkish's own general wrapping behaviour, not English's. §1.4.
5. **The cloze blank measurably does not disturb the 18/28 line box.**
   Styled span, plain word, or literal underscores — identical line
   tops, identical container height, measured in Chromium. §3.
6. **A real, working, corpus-complete variable Source Sans 3 was
   built today**, by merging Google's `latin` and `latin-ext` variable
   slices and transplanting the five Turkish glyphs — verified
   rendering and interpolating correctly at wght 400, 550 and 600 in
   Chromium. Cost: **21,764 bytes**, smaller than both the prior arm's
   figure and the two shipped statics. §4.
7. **Neither an italic nor a bold serif currently has anywhere to go.**
   `<em>` is already de-italicized to weight 600 by rule; `<strong
   class="t-en">` resolves to weight 400 (verified against the real
   cascade — the class beats the element on specificity, so this is
   *not* a synthetic-bold bug, a claim this document drafted and then
   disproved against its own measurement). Both live exclusively in
   the sans. The serif has never once been asked for anything but
   upright 400. §4.
8. **A live glyph gap exists**: U+2192 (→) is used 292 times across
   `data/` and is in none of the three shipped font files. It falls
   back silently today; the fix costs approximately zero bytes. §4.5.
9. **The five-size scale does not run out for the three named
   upcoming screens** (reading passage, error notebook, timed mock),
   and the reason is not luck — it is that the product's own already-
   decided restraint (a quiet status line, not a hero clock) keeps
   every new role inside the register the meta/ui tier was built for.
   §5.

---

## 1 · The bilingual line, measured

### 1.1 Extraction

Every `paragraph`, `option`, `example`, `sentence` and `.en` field in
`data/**/*.json` was pooled as "English" (3,055 strings); every
`explanation`, `tip`, `optionNotes` value, `gloss`, `summary`, `note`,
lesson `body` and intro field was pooled as "Turkish" (2,530 strings).
`row.pattern` (the notation row, e.g. `S + have/has + nesne + V3`) was
excluded from both pools and is treated separately in §1.3, because it
turned out not to belong to either.

### 1.2 Word length and diacritic density

```
English word length   n=20204  mean 4.41  median 4  p90  8  max 18
Turkish word length    n=35981  mean 5.85  median 5  p90  9  max 18
  (embedded English tokens excluded — method below)
Turkish tokens carrying a diacritic (çğıöşü, ÇĞİÖŞÜ): 46.9% (16,867/35,981)
```

Turkish words run about a third longer on average than the English
words in the same corpus (5.85 vs 4.41 characters) — expected, since
Turkish is agglutinative and English here is mostly short function and
content words in simple B2–C1 sentences. Combined with §5.1 of
`03-renk-tipografi.md` (Turkish sans: 7.187 px/char at 18px; English
serif: 8.193 px/char), a Turkish line carries *more* characters in the
same width but each word is longer, so word-wrap has fewer legal break
points per line than raw CPL would suggest — a fact that matters
directly for §1.4.

**Method for "embedded English", stated precisely** so the number can
be checked: a token in a Turkish-pool string counts as embedded
English if (a) it carries no Turkish diacritic, (b) it is not on a
20-word Turkish stopword list (bu, ve, ile, de, için, …), and (c) it
matches — case-insensitive, whole word — a token that also appears in
this corpus's own English pool. This is a corpus-internal method, not
a dictionary lookup: it will not catch an English word that happens
never to appear in this app's own English fields, and it will treat a
genuine loanword the same as a quoted form, which is arguably correct
for this app's purpose (§4 in the reviewer's brief calls both
"notation," and both need the same visual answer).

```
Turkish strings: 2,530
  containing ≥1 embedded English token: 1,371  (54.2%)
Embedded English tokens found: 6,067
  distinct token types: 707
  falling mid-string (not at the very start or end): 5,376  (88.6%)
Embedded-English characters ÷ total Turkish-field characters: 10.72%
```

Sample of the actual distinct tokens caught, by frequency — `the`
(179), `to` (160), `olumsuz`/`olumlu` are Turkish and correctly
excluded, `of` (95), `have` (92), `present` (67), `past` (58),
`perfect` (56), `been` (47), `simple` (41), `continuous` (24),
`modal` (23), `passive` (18). These are overwhelmingly grammar
metalanguage — exactly the category `CLAUDE.md` says needs a label,
not an explanation — and quoted verb forms (`is working`, `must`,
`have to`), not stray words. A representative full sentence, real,
from `data/tenses/tenses.json`:

> *"'Right now' ve 'don't interrupt him' tam şu anda sürmekte olan,
> geçici bir eylemi işaret ediyor; bu yüzden Present Continuous 'is
> working' gerekir."*

Three separate English fragments in one Turkish sentence, one of them
(`Present Continuous`) a bare grammar label with no quote marks at
all. This is the median case, not an outlier — `[S]`, corpus measured
directly, script at
`/tmp/.../scratchpad/arm4/{extract,analyze,tokens}.mjs`.

### 1.3 A third category the brief did not anticipate: the notation row

`docs/CONTENT_GUIDE.md`'s `forms` block carries a `pattern` field —
`S + have/has + nesne + V3`, `Unless + olumlu cümle, ana cümle` — and
it is rendered as one string, wholesale, with `lang="en"` and the
serif face (`js/education.js:1235-1237`). Of 362 `pattern` rows in the
shipped corpus, **16 (4.4%) contain a bare Turkish placeholder word**
— `nesne`, `ana`, `olumlu`, `cümle`, `araç` — with no diacritic-only
detection possible for four of them, confirmed by hand: `S + have/has
+ nesne + V3`, `Ana cümle + unless + olumlu cümle`, `S + be + V3 +
with + araç`. `[S]`, counted directly:
`grep -c 'row.pattern' data/*/*.json` plus the script above.

This is small — 16 rows, not 6,067 tokens — but it is a different
*kind* of mixing than §1.2's embedded quote: it is the app's own
metalinguistic notation itself switching languages mid-symbol, inside
a string the renderer treats as monolingual English. `CLAUDE.md`'s
own principle — *notation must be explained, the language itself
usually must not* — did not anticipate notation that is itself
bilingual. Filed as a real, if minor, gap in §2's recommendation.

### 1.4 Hyphenation, `hyphens: auto`, and what actually breaks a line

The app ships no `hyphens` rule today; `.prose` sets
`overflow-wrap: break-word` only. The brief asks whether `hyphens:
auto` would help at a narrow column and do the right thing for both
languages at once. Tested directly, isolating each property:

```
                                    hyphens:auto alone   overflow-wrap alone
Turkish word "karşılaştırılabilirliğinden" (27 chars)
  at a 90px content box (box 108px incl. padding):
    scrollWidth                        190px                 106px
    → NO break                        → fits, broken

English word "reconstruction" (14 chars),
embedded unmarked in a lang="tr" ancestor, same box:
    scrollWidth                        118px                 106px
    → NO break                        → fits, broken

Control — same test with lang="en", lang="de", lang="fr",
words "internationalization", "Donaudampfschifffahrt",
"anticonstitutionnellement": all four languages, zero breaks.
```

`hyphens: auto` produced **zero hyphenation events in every language
tested**, Turkish, English, German and French alike, in this
Chromium/Linux environment. `[S]`, measured directly,
`/tmp/.../scratchpad/arm4/fontbuild/hy4.mjs`, `hy5.mjs`.

This is not a Turkish-specific finding and the reason is documented:
per a Chromium blink-dev thread and MDN compat-data issue threads
surfaced by `WebSearch` — *"Windows, Linux, and Chrome OS do not
provide system hyphenation dictionaries accessible to Chrome"*, while
*"on Android, Blink uses dictionaries built into the OS"* (7
dictionaries on Android M MR1, 33 on Android N) and *"on Mac, Blink
uses dictionaries built into the OS through Core Foundation"* (23 on
macOS 10.11.6). `[≈]`, WebSearch-surfaced summary of Chromium source
comments in `third_party/hyphenation-patterns`, not read at source —
I could not reach `chromium.googlesource.com` to confirm the file
directly (blocked, consistent with the brief's network map). Separate
sources agree Chromium's *own* bundled dictionaries (as opposed to
Android/macOS system ones) cover only English, German, Bulgarian and
French. **Whether Android's OS-level set includes Turkish is
unconfirmed** — filed in `## Doğrulanamayanlar`.

What *did* work, reliably, in every test, was `overflow-wrap:
break-word` — already shipped on `.prose`. It forced the 27-character
Turkish word and the 14-character English word to fit their box in
every case, with no dictionary and no `lang` dependency. This is the
practical finding: **`hyphens: auto` is a "nice if the platform has
it, silently nothing if it doesn't" enhancement, and the app should
not design around it being present.** `overflow-wrap: break-word` is
the actual safety net today, and it has a property the brief
specifically asked about — it does **not** respect language boundaries
at all. It will break an embedded English word exactly where it
overflows, using no rule, English or Turkish. That is the honest
answer to "does it do the right thing for both languages
simultaneously": it does the same *crude* thing for both, which is
strictly better than doing the *wrong specific* thing (a Turkish
hyphen inside an English word) but is not hyphenation.

**On the specific hazard the brief asks about** — an English word
getting Turkish syllable breaks — the CSS mechanism is well-specified
independent of what this one sandbox could demonstrate: hyphenation
dictionary selection follows the nearest `lang` value up the tree via
`:lang()`, so an unmarked English run inside a `lang="tr"` ancestor
*would* be hyphenated against the Turkish dictionary wherever one
exists on the platform (`[S]`, CSS Text Module Level 3, `hyphens`
property definition — cited from memory of the spec's own wording, not
re-fetched this session since `w3.org` is blocked; the mechanism is
uncontested and matches every implementation note found via
`WebSearch`). I could not produce the actual broken glyph in this
sandbox because no dictionary was present for *any* language to break
with. What I *can* say with the corpus data from §1.2: **this hazard
is not hypothetical exposure** — 6,067 embedded English tokens exist
today with no nested `lang="en"`, so on any platform where Turkish
hyphenation is available, all 6,067 are exposed to it, most of them
(88.6%) sitting where a line break could plausibly land on them.

A worked real-corpus example at the app's actual narrowest column
(288px, 18px Source Sans 3, `hy4.mjs`/render of the sentence in §1.2)
shows the wrap points landing on word spaces, not mid-word, purely
because these embedded fragments are short multi-word quotes with
ordinary spaces around them:

```
'Right now' ve 'don't interrupt him'
tam şu anda sürmekte olan, geçici bir
eylemi işaret ediyor; bu yüzden
Present Continuous 'is working'
gerekir.
```

No English fragment breaks mid-word here — line 4 begins exactly on
"Present" by coincidence of width, not by any hyphenation rule. The
real residual risk is a single **long** unmarked English word (the
corpus's English max is 18 characters; embedded tokens average ~5.2
characters but are not capped) landing at a line's edge on a device
that *does* have a Turkish dictionary. §2's recommendation addresses
this directly by removing the precondition (the missing `lang`) rather
than by depending on `hyphens: auto`, which this section has shown
cannot be relied on either way.

**Rivers**: not applicable, measured as a non-finding. `text-align` is
`left`/`start` everywhere prose is set (`css/style.css` lines 771, 949,
1202, 1451, 1479); the app never justifies text. Rivers are a
justification artefact and this app has no justification anywhere to
produce one in.

---

## 2 · How the English should be marked

### 2.1 The app's own convention, precisely, as shipped

Three renderers already implement a convention, and it is consistent
at its own level:

| Source | Renderer | Marking |
| --- | --- | --- |
| Cloze paragraph, restatement | `js/prompt.js` `renderPrompt` | own `<p>`, `lang="en"`, serif (`t-lead t-en` / `t-body t-en`) |
| Contrast side label, example | `js/education.js` `renderContrastBlock` via `englishTitle()` | own `<p>`, `lang="en"`, serif |
| Forms notation `pattern` | `js/education.js` `renderFormsBlock` | own `<p>`, `lang="en"`, serif — see §1.3's caveat |
| Answer callout, option-note key term | `js/feedback.js`, `js/results.js` | `<strong>`/`<span class="t-en">`, `lang="en"`, serif |
| **Everything else** — `explanation`, `tip`, `gloss`, lesson `body`, `optionNotes` values, all routed through `appendInline` (`js/dom.js`) | `js/dom.js` `appendInline` | **nothing.** `**bold**` and `*em*` are the only two marks it resolves; a bare English word passes through as an untagged, unstyled Turkish-language text node. |

Verified directly: `appendInline`'s own source (`js/dom.js:29-61`) —
it splits on `**…**` and `*…*` only, and every other substring becomes
a plain `document.createTextNode`. There is no per-word language
detection anywhere in the renderer. `[S]`.

**The consequence, stated in the terms of §1**: 54.2% of the corpus's
Turkish strings pass through exactly this code path with embedded
English inside them, and every one of those 6,067 tokens renders
today as if it were Turkish — same font, same weight, no `lang`
attribute, and (per §1.4) exposed to Turkish hyphenation wherever a
platform has it. The block-level convention is real and is applied
correctly everywhere it is used. It simply does not reach the case
that the corpus shows is the *majority* case.

### 2.2 What serious bilingual typesetting actually does

Four traditions, checked:

- **Interlinear/linguistic glossing.** The Leipzig Glossing Rules
  (Max Planck Institute for Evolutionary Anthropology & Leipzig
  University; `eva.mpg.de/lingua/pdf/Glossing-Rules.pdf`, blocked from
  direct fetch — `WebSearch`-surfaced summary): the object-language
  example text, whether inline or in a numbered display, is
  conventionally **set in italics**, with the interlinear gloss below
  it in roman, grammatical abbreviations in small caps. `[≈]`.
- **Bilingual dictionaries.** Oxford's own author guidelines
  (`oxfordreference.com`, `WebSearch`-surfaced): *"roman type for key
  encyclopedic information — dates, language labels, translations or
  other-language equivalents — enclosed in parentheses; italic type
  for abbreviated parts of speech."* The target-language headword
  itself is typically **bold**; the gloss/translation is roman. `[≈]`.
- **Bilingual literary editions.** The Loeb Classical Library does not
  mark language inline *at all* — it separates the two languages
  **spatially**, original on the left page, translation on the facing
  page (`designersandbooks.com/blog/loeb-classical-library-design`,
  `WebSearch`-surfaced). There is no inline typographic device to
  borrow from Loeb; its entire solution is a layout this app's
  paragraph-in-a-sentence format cannot offer. `[≈]`, and it is the
  most load-bearing negative finding of this section: the most
  respected bilingual convention in print **does not solve this
  problem inline**, because print has room to solve it spatially.
- **ELT coursebooks.** Searched specifically for Oxford/Cambridge ELT
  design conventions on marking target-language material inside
  L1-language instruction text. No usable primary source was
  reachable or found via `WebSearch` in the time available. **Marked
  unverified** rather than guessed — see `## Doğrulanamayanlar`.

### 2.3 What survives on a 320px dark phone

- **Italic**: rejected already, independently, by this app's own CSS
  — `em { font-style: normal; font-weight: 600; }` — and correctly so:
  no italic face ships (§4.3), and italic at 18px on a low-chroma dark
  background is a known-poor performer for exactly the halation
  reasons `03-renk-tipografi.md` §3.1 already measured for maximal
  polarity contrast. Leipzig's convention does not survive the trip
  to this screen.
- **Bold**: already the language the app uses for a *different*
  distinction (`<strong>`/`<em>` = "important," weight 600, always in
  the sans register per §4's finding that no markdown emphasis mark
  ever lands inside an English field). Reusing bold for "this is
  English" would collide with the meaning it already carries.
- **Spatial separation (Loeb)**: does not apply — there is no facing
  page inside one Turkish sentence.
- **A colour tint**: available in principle (`--ink-2`/`--ink-3` exist
  as separate tokens already), but would need a fourth *simultaneous*
  visual channel on a screen that `07-karar.md` already spent on the
  answer verdict (four redundant channels: glyph, word, tint, spelled-
  out answer — `js/feedback.js`'s own header comment). Adding a tint
  for "this is English" risks being read as a second verdict signal on
  the one screen where verdict tints already mean something specific.
  Not recommended without a design pass this arm was not asked for.
- **A font-family switch to the serif**: the one device that (a) the
  app already uses at the block level, (b) needs **zero additional
  font weight**, because Source Serif 4 400 is already loaded on any
  page that has a lesson or a question on it, and (c) is the one
  convention in §2.2 that Oxford's own dictionary guidance
  independently supports — a font change is exactly how "roman vs.
  italic vs. bold" traditions solve this in print, and the sans/serif
  pairing already *is* this app's roman/italic-equivalent axis (per
  `03-renk-tipografi.md` §6.1: "the serif is English, the sans is
  Turkish, so the typeface tells the learner which language they are
  looking at before they read a word").

**The finding, stated as a recommendation**: extending `.t-en` +
`lang="en"` from the block level down to the *word* level inside
`appendInline` is not a new visual device — it is applying the
device the app already committed to, to the 54.2% of strings the
current implementation misses. It costs no new font file. It fixes
the CSS `text-transform: uppercase` hazard (`03-renk-tipografi.md`
§5.4) for every one of the 6,067 tokens that currently lack `lang`.
It removes the §1.4 hyphenation exposure by giving each token its own
`lang` scope regardless of what the ambient Turkish dictionary would
otherwise have done to it. And it is directly measurable:
`appendInline` already tokenizes on a regex for `**`/`*`; a third
pattern — match against a small allow-list built at build time from
each topic's own English fields, the same corpus-internal method used
to produce §1.2's numbers — is the mechanical shape of the fix. This
document does not design that regex; it establishes that the gap is
real, common, and answered by a device already paid for.

---

## 3 · Line height at 18/28, with a blank in the line

### 3.1 The blank, measured

Three variants of the same cloze sentence (`data/tenses/tenses.json`
`tenses-t2`, real corpus string) were rendered at `--t-body` 18/28,
serif, in Chromium: the shipped `.blank` (inline-block, `width:
4.5ch`, `border-bottom: 2px solid var(--accent)`, containing an
absolutely-positioned `.visually-hidden` label), a plain word in its
place, and four literal underscores.

```
line-box tops (px, container padding 8px):  18, 46, 74, 102   — all three, identical
container scrollHeight (px):                128                — all three, identical
.blank's own box, relative to container:    top 55  bottom 57  height 2px
```

`[S]`, measured directly,
`/tmp/.../scratchpad/arm4/blanktest.mjs`. The reasoning behind the
null result is in the box model, not luck: `.blank`'s only visible
box is a 2px `border-bottom` — its content (`"boşluk"`, for the
synthesiser) is `position: absolute`, out of flow, so it contributes
nothing to the inline-block's own height. An empty inline-block with
no in-flow content and only a bottom border is 2px tall and, by the
CSS default `vertical-align: baseline`, that 2px box hangs *above*
the text baseline rather than adding to line height below it. At
28px line-height on an 18px face, 2px is far inside the existing
descender/ascender headroom (`03-renk-tipografi.md` §5.3 measured
4.5px of headroom above the ink at this exact tier). **The blank is,
by construction, invisible to the line box.** This closes the
question cleanly rather than leaving it a plausible-sounding worry.

### 3.2 18/28 against the actual research

`03-renk-tipografi.md` did not cover leading research directly; this
arm searched specifically for it.

- **Rello, Pielot & Marcos, "Make It Big! The Effect of Font Size and
  Line Spacing on Online Readability"**, CHI 2016 (28 participants
  with dyslexia; font sizes 10–26pt × line spacings 0.8/1.0/1.4/1.8,
  eye-tracked). Finding, as summarised by `WebSearch` from the paper's
  own abstract and citing pages (`semanticscholar.org`,
  `dl.acm.org`): **font size drove readability far more than line
  spacing did**; only the widest spacing tested (1.8×) showed worse
  comprehension than the tightest (0.8×), and the paper's own
  recommendation is *"fonts of size 18 or larger… default line
  spacing"* for easy comprehension. `[≈]`, not read at the primary
  source (ACM/CHI proceedings were not reachable), but the finding is
  corroborated across three independent secondary listings.
- Applied here: `--t-body` is 18/28, a ratio of **1.556** — inside
  Rello et al.'s tested 1.0–1.8 band, well clear of the 1.8 outlier
  that under-performed, and at a font size (18px) their own paper
  names as the comprehension floor. This is not proof the app's ratio
  is optimal — the study is general-population/dyslexia, English,
  not bilingual and not Turkish — but it is a real, named,
  cross-checked source that the app's existing choice sits inside the
  range the closest available research calls safe, and it does not
  contradict `03-renk-tipografi.md`'s independent diacritic-headroom
  argument for the same tier (§5.3 there: 4.5px headroom, the
  tier `03` called "fine").
- **Duchnicky & Kolers (1983)**, *Human Factors* — reading rate on
  scrolling VDT text as a function of line length and window height
  (`researchgate.net`, `WebSearch`-surfaced): full-width lines read
  25% faster than one-third-width lines; comprehension did not vary
  with window size, only reading rate did. This is a line-*length*
  and *window-height* study, not a leading study; cited here only to
  be clear it does **not** answer the leading question and should not
  be mistaken for evidence about line-height itself. Included to
  close a search path, not to support a claim.
- **No study addresses Turkish diacritics and line-height together.**
  Searched with different terms than `03-renk-tipografi.md` used
  (`Rello`, `Duchnicky`, general "leading reading speed"); found
  nothing Turkish-specific either time. This confirms rather than
  narrows the prior arm's own `## Doğrulanamayanlar` entry — carried
  forward below, not re-litigated as new.

**Conclusion for 18/28**: the tier is not merely undisturbed by the
blank (§3.1); it sits inside the one directly-relevant empirical
band this search could locate, at the font size that same research
calls the comprehension floor. No change recommended.

---

## 4 · The variable-font question, resolved with bytes

### 4.1 Building a corpus-complete variable Source Sans 3

`03-renk-tipografi.md` measured a variable-sans instance at 24,912
bytes but did not confirm it carried the five Turkish glyphs — Google
serves the *variable* Source Sans 3 pre-sliced by script
(`unicode-range: latin` / `latin-ext` / …), and the five Turkish
glyphs (`Ğ ğ İ Ş ş`) live in `latin-ext`, not `latin`. Fetched both
slices today (`fonts.googleapis.com/css2` with a Chrome 130 UA to get
the true variable-range `woff2`, `fonts.gstatic.com` for the files —
both reachable, `[S]`):

```
latin  variable slice (wght 200–900): 28,740 bytes, has fvar/gvar, no Turkish glyphs
latin-ext variable slice:             60,088 bytes, has fvar/gvar, HAS Turkish glyphs
```

`fontTools.merge` cannot combine two variable-font subsets (its
`VarStore` merger raises `AttributeError: type object 'VarStore' has
no attribute 'mergeMap'` — confirmed directly, this is not a config
error). Instead the five needed glyphs were traced to their real
dependencies — `Gbreve` = `G` + `uni0306.c`; `gbreve` = `g` +
`uni0306`; `Idotaccent` = `I` + `uni0307.c`; `uni015E`/`uni015F` = `S`/
`s` + `uni0327.c`/`uni0327` — and the **8 glyphs actually missing**
from `latin` (`uni0306.c`, `uni0306`, `uni0307.c` plus the 5
composites; the cedilla marks and base letters were already present)
were transplanted glyph-by-glyph (`glyf`, `hmtx`, `gvar`, `cmap`)
from `latin-ext` into `latin` with a 30-line `fontTools` script.

**Verified, not assumed**: rendered the augmented font in Chromium at
`wght` 400, 550 and 600 — all five Turkish letters render correctly
at all three weights, including the untested-by-construction
intermediate 550, proving the transplanted `gvar` deltas interpolate
correctly rather than merely existing:

> Ğğ İıŞş Öö Üü Çç — 400/550/600 — *Present Continuous* (all three
> render identically well; screenshot at
> `/tmp/vf_render_check.png`, not part of this repo)

Then, matching `css/fonts.css`'s own documented flags exactly:
partial-instanced to `wght=400:600` with `fonttools varLib.instancer`
(keeping it variable, not pinning a single weight), then
`pyftsubset --flavor=woff2 --notdef-outline --unicodes=<same range
fonts.css uses, +5 Turkish codepoints> --layout-features=ccmp,locl,
kern,liga,clig,calt,rlig,rclt,mark,mkmk,tnum,onum`:

```
Corpus-complete variable Source Sans 3, wght 400:600:  21,764 bytes
```

`[S]`, fully reproducible, script at
`/tmp/.../scratchpad/arm4/fontbuild/{transplant.py, hy... }` — note
this is **2,948 bytes smaller** than `03-renk-tipografi.md`'s reported
24,912, and both point the same direction; the difference is most
likely a different `fonttools` build/flag set between sessions, not a
disagreement about the conclusion. Flagged for whoever ships this to
re-measure at ship time rather than trust either number blindly.

### 4.2 Reproducibility check, extended

`03-renk-tipografi.md` §6.2 found the shipped static serif 400
reproduces byte-identically from today's Google Fonts. Re-confirmed
independently here (`md5sum` match, `c9faa1ff073d6a6d77b4c8881ff46f09`
both sides) and extended to two files that document did not build:

```
Source Serif 4, italic, weight 400, subset with the project's flags:  19,312 bytes
Source Serif 4, upright, weight 600, subset with the project's flags: 20,204 bytes
```

`[S]`, both fetched via the default-UA CSS2 request (which, unlike
the variable-font case, returns one unsliced multi-script static TTF
per weight/style — confirmed by checking its `cmap` contains the five
Turkish codepoints directly, no merge needed for statics) and
subset with the exact flag string from `css/fonts.css`.

### 4.3 Candidate payloads, and what each buys

```
A. Current shipped:  sans400 14,444 + sans600 14,456 + serif400 19,116 = 48,016 B (48.0 KB)
B. Variable sans (400:600) + static serif400:      21,764 + 19,116     = 40,880 B (39.9 KB)
C. B + serif italic 400:                            40,880 + 19,312    = 60,192 B (58.8 KB)
D. B + serif upright 600:                            40,880 + 20,204    = 61,084 B (59.7 KB)
E. B + italic + serif 600:                                              80,396 B (78.5 KB)
```

**B saves 7,136 bytes (14.9%)** and buys every weight between 400 and
600 for the sans in one file — matching `03-renk-tipografi.md`'s
conclusion, now confirmed to carry full Turkish coverage. **Recommend
B.**

**C and D were checked against what the page actually asks the serif
to do, not against what a type system in the abstract might want**,
and the answer is: nothing, right now.

- `em { font-style: normal; font-weight: 600; }` — italic is switched
  off by explicit rule (`css/style.css:1840-1843`), and `appendInline`
  (the only renderer that resolves `*em*` markup) is called
  exclusively on Turkish-pool fields (§2.1's table), which render in
  the **sans**, not the serif. `<em>` never reaches the serif face at
  all today. C buys a face the CSS has already declined to use.
- `<strong class="t-en">` — checked directly against the *real*
  cascade rather than assumed (this document initially drafted a
  "synthetic bold" finding here and disproved it against its own
  measurement before publishing): `.t-en { font-weight: 400 }` is a
  class selector (specificity 0-1-0) and beats `strong, b {
  font-weight: 600 }` (0-0-1) regardless of source order. Rendered in
  a real page against the real stylesheet and read with
  `getComputedStyle`: **`fontWeight: "400"`**. `[S]`, measured,
  `/tmp/.../scratchpad/arm4/fontbuild/realcascade.html`. The serif has
  never once been asked for weight 600 in the shipped app. D buys a
  weight nothing currently requests.

**Recommend against C, D and E as this page stands.** If a future
design decision wants bolder emphasis specifically on an English
key-term (a legitimate thing to want — `.option-note`'s key term is
currently the same weight as its own explanation, with only the
font-family carrying the distinction), D is the enabling change and
its cost is now measured: 20,204 bytes for real weight 600, against a
synthetic bold the browser is not currently even being asked to fake.

### 4.4 Glyph coverage — scanned, not assumed

Every character actually appearing in `data/**/*.json` was
enumerated (18 distinct non-ASCII characters; comment-only characters
in `js/*.js` were excluded as they are never rendered) and checked
against each shipped font file's `cmap`:

```
· Ç Ö Ü â ç é î ö ü ğ İ ı Ş ş — 2014 …    — all present, all 3 files
→  U+2192 RIGHTWARDS ARROW                 — MISSING, all 3 files
```

**292 occurrences** across the corpus (`grep -ro '→' data/*/*.json |
wc -l`), all inside lesson `examples` blocks' `note` field (e.g. *"İki
değer arasındaki pay → margin"*), rendered through `appendInline` —
the same code path as §2. Rendered a real instance in Chromium
against the real stylesheet: the browser falls through the font stack
silently and shows the arrow from a system fallback face; no visible
`.notdef` box, no crash, but a different typeface's arrow glyph than
the one carrying the rest of the sentence, on whichever font that
platform's fallback chain resolves to — not guaranteed consistent
across Android/iOS/desktop, and not verified on either here.

The fix costs, measured, effectively nothing: subsetting the same
source TTF with and without `U+2192` added to the `--unicodes` list
produced **14,440 bytes vs 14,444** — the arrow-inclusive file was 4
bytes *smaller*, inside woff2 compression noise, because Source Sans
3 already ships the sibling glyphs `U+2191`/`U+2193` (up/down arrow)
in the same range and →'s outline rides along essentially free.
`[S]`, measured,
`/tmp/.../scratchpad/arm4/fontbuild/sans400-{no,with}arrow.woff2`.
**This is a live gap, not a design preference, and the brief's own
framing is correct: fix it regardless of the variable/static
decision above.**

---

## 5 · The one thing the scale cannot express

`docs/app1-final.md` Block D names the screens still to build: a
**reading passage with seven questions** (D/C1, "two texts, seven
questions each"), an **error-tracking screen** (D1, "a place to
examine past mistakes"), and a **mock exam, under time** (D2). Tested
the five-size scale — 36/44 · 28/36 · 22/28 · 18/28 · 17/24 — against
each, by checking what role each screen actually needs against what
the app has already built with the same role.

- **Reading passage.** The passage itself is more `--t-body` (18/28)
  English prose, structurally identical in kind to a cloze
  paragraph's `t-lead`/`t-body t-en` treatment already shipped — no
  new size. A "question 3 of 7" progress indicator is the same role
  the app already renders at `--t-meta`/`--t-ui` (17/24 as of this
  round's recommendation) for the existing quiz's "N of M" trail
  (`js/shell.js:118`, `el("p", "t-meta t-num", spec.trail)`) and for
  the home ring's centre value (`.ring__value`, also meta/ui —
  confirmed in `03-renk-tipografi.md`'s own `PAIRS` audit). No new
  size.
- **Error-tracking screen.** Structurally a list of past mistakes —
  the same shape as the already-shipped results review and weak-spot
  list, both built entirely from the five sizes. No new role
  identified.
- **Mock exam under time.** The one screen with a plausible new
  role — a countdown. But `07-karar.md` §2 already settled this, and
  settled it *before* this arm's question was asked: *"sınav sayacı
  bir durum mesajı, canlı bir tıklayıcı değil"* — the exam counter is
  a status message, not a live interactive widget, and the same
  document's §"Reddedilen dil: Duolingo" rejects exactly the
  large-numeral, hero-clock treatment that *would* need a sixth size.
  A status message is precisely the register `--t-meta`/`--t-ui` (17,
  600, one line) was built for.

**The scale does not run out, and the reason is not an accident of
arithmetic — it is that the product has already, deliberately, refused
the one kind of screen (a prominent hero timer) that would need a
size this scale does not have.** This is a closed question conditional
on that decision holding: if a future owner decision reverses "the
counter is a quiet status line," that reversal — not this document —
is what would reopen the type scale, and the addition at that point
would be a single large display-weight numeral tier, not a
restructuring of the five.

---

## Öneri

1. **Extend `lang="en"` + the serif face from the block level to the
   word level inside `appendInline`.** This is §2's finding and the
   single highest-leverage change in this document: 54.2% of Turkish
   strings, 6,067 tokens, 88.6% of them mid-string, currently render
   with no language marking at all. The mechanism to reuse is already
   paid for — `.t-en` exists, the serif face is already loaded on
   every screen with a question or a lesson on it, and `appendInline`
   already tokenizes the string; this only adds a third pattern next
   to `**bold**` and `*em*`. The corpus-internal method used to
   measure §1.2 (each topic file's own English fields form the
   allow-list) is a candidate approach a build step could use, but
   designing that patch is outside this arm's remit.
2. **Fix the `row.pattern` mixed-notation cases** (§1.3, 16 of 362
   rows) — either by teaching the 4-5 recurring Turkish placeholder
   words (`nesne`, `ana cümle`, `olumlu`, `cümle`, `araç`) their own
   nested `lang="tr"` span inside the otherwise-`lang="en"` pattern,
   or, more simply, by treating `pattern` as mixed content routed
   through the same word-level tokenizer as recommendation 1 rather
   than through `englishTitle()`'s whole-string assumption.
3. **Do not adopt `hyphens: auto`, and do not remove
   `overflow-wrap: break-word`.** §1.4: the former is inert on the
   desktop/Linux Chromium test path and unverified on Android for
   Turkish specifically; the latter is the actual, working,
   cross-platform safety net already shipped. If `hyphens: auto` is
   added later as a platform-dependent enhancement, pair it with the
   word-level `lang="en"` marking from recommendation 1 first — that
   is what removes the hazard the brief was right to worry about,
   not the hyphenation property itself.
4. **18/28 for `--t-body` needs no change.** §3: the blank does not
   perturb it (measured, not assumed), and the ratio sits inside the
   one directly-relevant empirical band this search could find
   (Rello et al. 2016) at the font size that same source calls the
   comprehension floor.
5. **Switch the sans to the variable font, corpus-complete.** §4:
   21,764 bytes, verified to carry and correctly interpolate all
   five Turkish glyphs at 400/550/600, saving 7,136 bytes (14.9%)
   against the two shipped statics and gaining every intermediate
   weight. The build script exists in the scratchpad and should be
   redone at ship time — the 2,948-byte gap against
   `03-renk-tipografi.md`'s figure was not resolved and should not
   silently propagate into a shipped number.
6. **Do not add serif italic or serif 600 now.** §4.3: measured at
   +19,312 and +20,204 bytes respectively, and neither face is asked
   for anywhere in the shipped app today — italic is switched off by
   an explicit CSS rule, and `<strong class="t-en">` resolves to
   weight 400 by cascade specificity, verified against the real
   stylesheet. If a future design wants a bolder English key-term
   (a legitimate, different request), the cost of the enabling change
   is now on record at 20,204 bytes.
7. **Add U+2192 (→) to the subset unicode-range.** §4.4: a live
   glyph gap, 292 live occurrences, currently silently falling back to
   an unverified system font on every platform. Measured cost:
   effectively zero (±4 bytes, inside compression noise), because the
   sibling arrow glyphs are already present.
8. **Close the type-scale question for this round.** §5: the three
   named upcoming screens (reading passage, error notebook, timed
   mock) all map onto sizes the app already has, conditional on the
   already-made decision that the exam counter stays a quiet status
   line rather than becoming a hero clock. No sixth size is needed
   unless that specific decision is revisited.

---

## Doğrulanamayanlar

- **[?] Whether Android's OS-level hyphenation dictionary set
  includes Turkish.** Confirmed (via `WebSearch`-surfaced summaries
  of Chromium documentation, not read at source — `chromium.
  googlesource.com` was unreachable) that Android N ships 33
  OS-level hyphenation dictionaries and Chromium on Android pulls
  from them, unlike Windows/Linux/ChromeOS which ship none. Whether
  Turkish is among Android's 33 (or iOS/macOS's 23) was not
  confirmed. This is the single most consequential unresolved
  question in §1.4: it determines whether the hazard described there
  is live on the app's actual primary platform (a phone) at all, on
  the fraction of learners on Android. A machine with a real Android
  or iOS Chrome/Safari, not a headless Linux Chromium, would resolve
  this directly by rendering an unmarked long English word inside
  Turkish `lang="tr"` prose and checking for a hyphen.
- **[?] ELT coursebook typographic convention for target-language
  material inside L1 instructional text.** Searched specifically
  (§2.2); no usable primary or secondary source was found via
  `WebSearch` in the time available, and the publisher sites
  (`elt.oup.com`, Cambridge) returned only catalogue pages, not
  style guidance. This is a real gap in §2's survey — it is the
  single closest real-world analogue to this app's actual situation
  (a learner's own-language explanation quoting the target language),
  closer than dictionaries or linguistics glossing, and it went
  unanswered.
- **[≈] The Leipzig Glossing Rules' italic convention** and **the
  Oxford Reference dictionary style guidance**, both cited from
  `WebSearch`-surfaced summaries rather than the primary documents
  (`eva.mpg.de` and `typotheque.com`'s Collins-dictionary design
  article were both blocked by the egress proxy on direct fetch).
  The specific wording quoted in §2.2 is as surfaced by the search
  tool, not independently re-verified against the PDF/article text.
- **[?] The 2,948-byte gap between this document's variable-sans
  measurement (21,764B) and `03-renk-tipografi.md`'s (24,912B).**
  Both were built from Google Fonts' CSS2 API against "today's" font
  files, on different dates in the same research round, most likely
  against the same font version (Source Sans 3 v19 per both
  documents) but possibly different `fonttools`/`pyftsubset`
  versions or flag details not fully specified in either document.
  Not resolved here; flagged so a ship-time rebuild trusts neither
  number blindly and re-measures.
- **[?] Whether the partial-instance + glyph-transplant build in §4.1
  is safe to actually ship**, as opposed to being safe to *measure*.
  The transplant script copies `glyf`/`hmtx`/`gvar`/`cmap` entries but
  does not update the `HVAR` table's glyph-to-variation-index mapping
  for the eight transplanted glyphs, so their *advance width* may not
  vary across the weight axis even though their *outlines* correctly
  interpolate (verified visually in §4.1; width-interpolation was not
  separately checked). For a research measurement of bytes this does
  not matter; for a shipped font it could cause a very slight
  metric mismatch at intermediate weights on the five Turkish
  letters specifically. Flagged as a to-check, not a to-avoid.
- **Turkish-specific line-height research**: still not found, by
  either this arm's search terms or `03-renk-tipografi.md`'s.
  Carried forward, not re-discovered.
- **Not checked at all**: real-device rendering of any measurement in
  this document (everything here is headless-Chromium or Node); the
  variable font's behaviour under a real browser's font-matching for
  `format("woff2-variations")` versus plain `format("woff2")`
  (§4.1's test page used the former, matching modern Chromium/Safari,
  but Firefox's exact requirement was not checked); and whether the
  707 distinct "embedded English" token types found in §1.2 include
  any false positives from the corpus-internal detection method
  (spot-checked, not exhaustively audited — the method is stated
  precisely enough in §1.2 that a full audit is mechanical, not
  designed here).
