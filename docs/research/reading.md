# Reading

The v1.1 arm on the exam's largest uncovered section. **21 of the paper's
~100 points, and the app covers none of it** — larger than the cloze (15)
and the restatement (15) sections put together, and the only section
whose unit is not a single item.

Everything here is measured against `docs/exam-spec.md`, which was written
from the owner's own YTÜ SFL sample papers, and against this repository.
Where a number could be taken rather than estimated, it was taken: the
rendering figures below come from Playwright driving the real
`quiz.html` with the real stylesheet at the real viewports, and the
payload figures from building a real passage unit and compressing it.
The passage used as a stimulus is a 770-word original written for this
arm, in the shape the sample papers use — seven paragraphs, Roman
numerals, B2–C1 register.

**The network caveat that applies to every arm of the 2026-09-03 round
applies here too**, and worse: this environment's egress proxy blocks the
publishers, so the reading-assessment literature below rests on what could
actually be fetched. Each claim says which. Nothing expensive should be
built on an unfetched citation.

---

## 1 · The verdict, up front

Three findings, in the order they matter.

**1 · The schema is the easy part.** A passage is an ordered list of
paragraphs plus a set of items that cite them, and it fits the house
style with one new question `type` and one new manifest array. The cost
of loading it is small and *stays* small — 13.0 KB on disk per passage,
~3.0 KB over the wire — **provided one passage is one file.** Ten
passages in one topic file would cost 130 KB to open any one of them,
which re-creates the exact defect stage 0 removed six days ago.

**2 · The screen is the hard part, and one of the three obvious designs
is arithmetically dead.** A 770-word passage renders **3,848 px tall at
320 px wide**, which is **7.7 screens** on a 320×568 phone. One
paragraph of it — the longest, 124 words — is **572 px**, and the
focused-mode scroll region at 320×568 is **500 px**. So a single
paragraph does not fit a single screen, and a split view showing passage
and question at once is not a layout problem to be solved, it is
impossible at the app's own floor. That leaves two designs, and the
recommendation is §3.4.

**3 · Reading is the cheapest section per item to author and the
dearest per unit** — seven items share one passage read — but the passage
itself is the expensive half, and the review pass the house requires does
not shrink. §5 puts one reviewed passage at **2.5–3.5 hours** and the
section at **10 passages / 70 items** before it is worth practising
against. That is **25–35 hours**, which is not a week.

And the answer to the question that decides everything: **no. Not before
an exam a week away.** §6 says so plainly and says what to do instead.

---

## 2 · The schema

### 2.1 What the paper forces

Four properties come straight off the sample papers and none of them are
optional:

| From the paper | What it forces |
| --- | --- |
| Two texts of ~700 words | The passage is a **unit**, not a field on a question |
| Paragraphs numbered in Roman numerals | Paragraphs are **addressable**, in order |
| "According to paragraph III, …" | An item **cites** a paragraph, and the numeral appears **inside the stem's own wording** |
| "In paragraph V, the word *steer* is closest in meaning to" | An item can **point at a word in the passage**, which the paper marks in italic |

The fourth one is the one nobody has costed. Two of the seven question
types (vocabulary-in-context and reference) are not answerable unless the
learner can find the word being asked about, and on paper it is italicised
for them. Seven items share one passage and only one of them is about
`steer`, so the emphasis is a property of the **item**, not of the
passage text — which means the passage renderer has to be able to
highlight a word on behalf of whichever question is on screen. Nothing in
the app does anything like this today.

### 2.2 The shape

Following `docs/CONTENT_GUIDE.md`'s conventions rather than inventing new
ones.

**In `data/manifest.json`, a new top-level array beside `topics`:**

```json
{
  "topics": [ "..." ],
  "passages": [
    {
      "id": "urban-heat",
      "title": "The Urban Heat Island",
      "file": "data/reading/urban-heat.json",
      "level": "B2-C1",
      "words": 770,
      "questionCount": 7,
      "contentVersion": 1,
      "categories": ["Detail", "Negative Detail", "Inference",
                     "Vocabulary in Context", "Reference",
                     "Paragraph Main Idea", "Author's Purpose"]
    }
  ]
}
```

**One passage per file, `data/reading/<id>.json`:**

```json
{
  "passageId": "urban-heat",
  "title": "The Urban Heat Island",
  "paragraphs": [
    "Cities have always been warmer than the countryside…",
    "The mechanism is less exotic than the name suggests…"
  ],
  "questions": [
    {
      "id": "urban-heat-q4",
      "type": "reading",
      "cites": 4,
      "category": "Negative Detail",
      "stem": "According to paragraph {p}, which one of the following is NOT TRUE about reflective surfaces?",
      "options": [ "…", "…", "…", "…" ],
      "correctIndex": 2,
      "explanation": "…",
      "tip": "…"
    }
  ]
}
```

Five decisions in that, each with a reason.

**`paragraphs` is an array of plain strings and the numeral is derived.**
Not authored. This is the same rule the lesson ids already run on —
"content files carry no bookkeeping field anyone could renumber by
accident" (`js/topics.js`) — and it matters more here, because an authored
numeral that drifts from the array order silently mis-points seven items
at once. `ROMAN[index]` in the renderer, and the validator caps a passage
at as many paragraphs as the numeral table has.

**`cites` is an index, and the stem carries `{p}`.** The exam's own
wording puts the numeral inside the sentence, and recognising that
phrasing is part of what the app is for, so the stem should not be
reworded into a chip and a bare question. One substitution before
`textContent`, which keeps the no-`innerHTML` guarantee intact. The
validator's job is the pair: `{p}` present if and only if `cites` is, and
`cites` inside the paragraph count. An item with no paragraph reference
(author's purpose, main idea of the whole text) simply has neither field.

**A word target is a third field, not markup in the passage.**

```json
{ "type": "reading", "cites": 5, "target": { "word": "steer", "nth": 1 },
  "category": "Vocabulary in Context",
  "stem": "In paragraph {p}, the word {w} is closest in meaning to ………" }
```

`nth` because a word recurs; the renderer marks that occurrence in the
passage while the item is on screen, and substitutes the word into the
stem. The alternative — `**bold**` inside the paragraph text, which the
content schema already supports — fails because the emphasis belongs to
one of seven items sharing that paragraph.

**Reading lives outside the topic files, and that is load-bearing in three
places.**

1. *Loading.* §2.3.
2. *The `checkPool` bug the v1 plan predicted.* `loadLessonsForTopics()`
   groups a topic's questions by category and hands them to the lesson
   reader as inline checks. A reading item pulled out of its passage into
   a lesson check is unanswerable — the learner is asked what paragraph IV
   says with no paragraph IV on the page. Keeping passages out of
   `topic.file` makes that impossible **by construction** rather than by a
   guard somebody has to remember. This is the strongest single argument
   for the separate index.
3. *The taxonomy rule.* `CONTENT_GUIDE.md` rule 2 says every lesson's
   category must be used by a question **in the same topic**. Reading-skill
   lessons ("Vocabulary in Context", "Inference") would sit in a
   `reading-skills` topic whose questions live in ten passage files, so
   that rule has to be widened from *same topic* to *same topic, or any
   passage* — a validator change, and the only schema-adjacent thing in
   this proposal that touches existing rules.

**`type: "reading"` rather than reusing `cloze`.** The precedent is
already set: `restatement` was added as a discriminator with `sentence`
replacing `paragraph` and nothing else changing. Reading adds `stem`,
`cites`, `target` and a `passageId` that arrives from the file, and
`js/topics.js`'s `normalizeQuestion` gains one branch. `prompt` — the
field the whole app renders through — becomes the substituted stem, so
`js/prompt.js`, `js/answers.js`, `js/feedback.js` and the results review
keep working untouched.

### 2.3 What it costs to load — measured

The stimulus passage (770 words, 7 paragraphs) plus 7 items with
exam-length options and full Turkish explanations, formatted the way
`npm run format` formats content:

| | |
| --- | --- |
| Passage text alone | 4,715 B |
| Seven items | 7,064 B (**1,009 B per item**) |
| One passage file, formatted | **13,013 B** |
| gzip | 2,950 B |
| brotli | 2,222 B |

For scale, from the same measurement run: a current topic file is 51–58 KB
raw and ~15 KB gzipped for 24–25 questions and 6 lessons; `data/manifest.json`
is 3,884 B raw, 1,177 B gzipped, and since stage 0 it is the *only*
content file the home screen fetches.

So, the two shapes:

| Shape | Cost to open one passage | Cost at 10 passages |
| --- | --- | --- |
| One file per passage | **13 KB** (~3 KB gz) | 13 KB; manifest grows ~1.2 KB |
| All passages in one topic file | 130 KB | 130 KB, every time |

The second column is the whole argument. `docs/research/architecture-and-scale.md`
measured the old home screen downloading 141 KB to render 1.7 KB, fixed it
on 2026-09-03, and the fix is worth 141 KB and ~600 ms on a phone. Putting
ten passages in one file would spend most of that back on the first
learner who opens a reading text. **One passage, one file** is not
fastidiousness; it is the only shape that keeps the stage-0 win.

The manifest cost is the honest counter-argument and it is small: each
passage entry above is ~230 B formatted, so ten passages add ~2.3 KB to a
3.9 KB manifest that every screen loads. That is a 60% increase in the
one file on the critical path, for a section worth a fifth of the paper.
It can be trimmed by dropping `categories` from the passage entries
(the results screen needs category→lesson, not category→passage), which
takes it to ~120 B each.

### 2.4 What has to change in code

Honest inventory, from reading the files rather than guessing:

| File | Change | Size |
| --- | --- | --- |
| `js/topics.js` | `loadPassageIndex()`, `loadPassage()`, a `reading` branch in `normalizeQuestion`, `{p}`/`{w}` substitution | ~60 lines |
| `js/quiz-engine.js` | `buildReadingSession()` — the pool is passages, the seven items inside one stay in authored order | ~30 lines, plus tests |
| `js/quiz.js` | passage presentation (§3), and the item index within a passage | the real work |
| `js/results.js` | the review currently shows `prompt` alone; a reading stem without its paragraph is unreviewable, so the passage has to travel in the session result | ~20 lines |
| `js/storage.js` | **nothing.** An attempt persists `{id, topicId, category, correct}` only — passage text never reaches `localStorage` | 0 |
| `js/session-state.js` | nothing; it is `sessionStorage` and a 4.7 KB passage is free there | 0 |
| `tools/validate-content.mjs` | a passage schema, the `{p}`/`cites` pair, the target-word-exists check, the widened lesson-category rule | ~120 lines |
| `tools/format-content.mjs` | passage formatting, and the passage index in the manifest | ~40 lines |

Nothing here is hard except the third row, which is §3.

---

## 3 · The screen

This is the hard part, and it is hard for a reason that turns out to be
arithmetic rather than taste.

### 3.1 What a passage actually measures

Playwright, real `quiz.html`, real `css/style.css`, the 770-word stimulus
rendered as seven `.t-body.t-en` paragraphs with `t-label` numerals, the
focused-mode action bar visible:

| | 320×568 | 320×640 | 390×844 | 768×1024 |
| --- | --- | --- | --- | --- |
| Scroll region (`clientHeight`) | **500 px** | 572 px | 776 px | 956 px |
| Action bar | 68 px | 68 px | 68 px | 68 px |
| Passage, rendered | **3,848 px** | 3,848 px | 3,198 px | 2,054 px |
| …in screens | **7.70** | 6.73 | 4.12 | 2.15 |
| Tallest single paragraph (124 words) | **572 px** | 572 px | 468 px | 260 px |
| Measure | 288 px (~36 ch) | 288 px | 358 px | 608 px |

And one reading **item** — a 15-word stem, four options of 14–18 words
each, the shape the sample paper uses:

| | 320×568 | 390×844 |
| --- | --- | --- |
| Stem | 112 px | 84 px |
| Four options | **424 px** (124/100/100/100) | 400 px |
| Unanswered, total | **672 px** = 1.34 screens | 776 px = 1.00 screens |
| Feedback block | 306 px | 240 px |
| Answered, total | 1,010 px = 2.02 screens | 892 px |

Three facts fall out of that table and they decide the design.

**One paragraph does not fit one screen.** 572 px into 500 px, at the
viewport width the project verifies first. Not the whole passage — one
paragraph of it.

**One item does not fit one screen either.** 672 px into 500 px, before
any feedback. Reading options are complete sentences, not four forms of a
verb: `docs/CONTENT_GUIDE.md` already recorded this for restatement items
("a CSS pass so a four-line option survives 320px") and reading options
are the same length or longer.

**Therefore a split view is not a design problem.** Showing the cited
paragraph and its item at the same time needs 572 + 672 = **1,244 px** at
320×568, into 500 px, and 468 + 776 = **1,244 px** at 390×844, into
776 px. It fails by a factor of two and a half on the phone the app is
verified at, and by a factor of 1.6 on a modern one. It is only viable at
768 and up, which is exactly backwards for a mobile-first app, and it
would need two independently scrolling regions — the one thing
`css/style.css`'s base layer says out loud that the shell does not have.
**Refused, on measurement.**

### 3.2 What the shell allows

From `js/shell.js` and `css/style.css`:

- one scrolling region, `#shell-scroll`, `overscroll-behavior: contain`,
  `scroll-padding-bottom` already set for 2.4.11;
- a fixed-height action bar (`min-height: 52px + 2×--s-3` = 68 px
  measured) that is deliberately *outside* the scroll, so answering never
  moves the button;
- a native `<dialog>` primitive (`js/modal.js`) that already gets the top
  layer, the backdrop, focus containment, Escape and inert-everything-else
  from the platform;
- a lesson reader (`js/education.js`) that is a long scrolling page with
  inline answerable checks, a scroll-fraction progress indicator, and a
  measured fix for the browser's scroll anchoring stealing 162 px when
  feedback is inserted.

Every one of those is reusable. The dialog is the piece that matters.

### 3.3 The four candidates

**A · Split view.** Refused above, on measurement.

**B · Passage, then questions, with no way back.** The learner reads
7.7 screens, the passage goes away, seven items follow. Cheapest to build
— it is the current Test screen with a preamble — and it measures the
wrong thing. The assessment literature on *text availability* is
consistent that removing the text moves the construct toward memory:
readers in a text-unavailable condition are pushed into memorising rather
than searching, and the text-available condition is the one that
correlates as it should with verbal ability and language scores
([Frontiers in Education, 2025](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2025.1524561/full);
[Learning and Instruction, 2017](https://www.sciencedirect.com/science/article/abs/pii/S0361476X17300255)
— **neither could be fetched from this environment; both summaries come
from the search index**). The real paper puts the text on the facing page.
An app that hides it is not practice for that paper, it is a memory test
with the same words in it. **Refused.**

**C · Read first, then a returnable passage sheet.** The passage is a
page you scroll — the reader's own model, already built and verified —
with the action bar reading "Sorulara geç". Then the seven items run one
per screen in the normal Test screen, each carrying one control that
opens the passage as a full-height native `<dialog>`, scrolled to the
paragraph the item cites, with the target word marked if it has one.
Escape or the close button returns, and the item is exactly where it was
because the page underneath never moved.

**D · Paragraph-paged passage.** The same as C, but the passage is
presented as seven paged screens rather than one scroll — one Roman
numeral per screen, which the exam's own structure hands you for free.
There is evidence for it: on small screens, expository text is understood
better when paged than when scrolled, and readers who page do more
*strategic backtracking* than readers who scroll, because scrolling
fragments the contextual continuity a small viewport already strains
([summarised research on smartphone paging vs scrolling](https://ieeexplore.ieee.org/document/6150537),
[screen-size effects](https://link.springer.com/article/10.1007/s11145-022-10328-9)
— **again search-index summaries; neither source was reachable**). Against
it: the lesson reader deliberately *left* a paged model twice, and
`docs/CONTENT_GUIDE.md` records why — "a lesson is a page you scroll, not
a sequence of screens" — so reintroducing paging for a different content
type splits the app's reading model in two.

**E · One long page: passage, then the seven items inline.** The lesson
reader's exact shape, questions as `check` blocks. Genuinely tempting,
because every hard part is already solved in `js/education.js`. It fails
on three things. The page is 3,848 + 7 × ~1,010 ≈ **10,900 px at 320 px,
22 screens**, and returning to paragraph IV from question 5 is a scroll
of six screens with nothing to bring you back. It abandons the Test
screen's model — one item, commit, feedback, advance — which is the model
the timed feedback-deferred block in the v1 plan is written against. And
seven items on one page leaves the action bar with nothing to do, which
is the bar the whole no-layout-shift rule hangs off.

### 3.4 What I would build

**C, with D folded in as a scroll position rather than as a mode.**

Concretely:

1. **Screen one is the passage**, as a scrolling page with the Roman
   numerals as `t-label` block labels — the reader's model, not a new one.
   The action bar holds one primary action, "Sorulara geç". Nothing gates
   it: a learner who wants the questions first gets them, the same way an
   unanswered lesson check reads "Atla".
2. **Screens two to eight are the items**, in the current Test screen,
   unchanged — same options, same feedback block, same keyboard 1–4,
   same fixed bar. A counter reads "Soru 3 / 7" as it already does.
3. **Above the stem sits one control**: "Paragraf IV" for an item that
   cites one, "Metni aç" for the two that do not. It opens the sheet.
4. **The sheet is a native `<dialog>`**, full height, its own scrolling
   body, opened **scrolled to the cited paragraph** with the target word
   marked. Close returns focus to the control that opened it, which the
   platform does for free.
5. **The sheet remembers where it was left** per passage, so the second
   lookup on an item does not start over.

Why the cited paragraph rather than the top: at 320 px the alternative is
7.7 screens of thumb under every lookup, and the small-screen evidence in
D says that scrolling is precisely where a phone reader loses the thread.
It is *more* help than the paper gives — on paper you find paragraph IV
yourself — and that is a deliberate trade, made because this is practice
rather than a mock. **It should be one flag**, so the timed exam-rehearsal
block the v1 plan already decided to build can open the sheet at the top
instead and the fidelity is recovered where fidelity is the point.

### 3.5 What the sheet owes, and it is not free

The design system's own rule — "prefer the platform; where you can't, owe
it the full contract" — applies. The existing `.dialog` is a 22rem
confirmation box with `padding: var(--s-6)` and no scrolling body. A
passage sheet is a second variant of the same primitive and it owes:

- **A focusable scroll container.** A scrollable region that is not
  keyboard-focusable cannot be scrolled by keyboard at all; the sheet's
  body needs `tabindex="-1"` and to be where focus lands on open, so
  arrow keys work. This is the one part `<dialog>` does *not* hand over.
- **`overscroll-behavior: contain`** on the sheet body, or a flick at the
  top of the passage scrolls the question behind it.
- **Height that survives landscape.** §8.3 and §8.6: at ~380 px of
  height, a sheet sized at 90vh with a sticky header leaves almost no
  text. Size it from the viewport with a floor, and test at 640×360.
- **`scroll-padding` inside the sheet**, for the same 2.4.11 reason the
  main region already has it.
- **No swipe-to-dismiss without a tap equivalent** (2.5.8/2.5.7).
- **1.4.12 text-spacing at 320 with the sheet open** — the sharpest test
  the design system names, and a sheet is the easiest place to fail it.
- **The colour work is already done.** `--c-surface-2` is the overlay
  surface and every text token was solved against it as the worst case
  (§1.2–1.3), so a 770-word passage on the sheet needs no new values and
  `npm run color` has nothing to say.

And `tools/verify-ui.mjs` gains a reading leg — passage, sheet open, sheet
closed, item, feedback — at all four widths, because a screen the sweep
does not walk is a screen with no conformance claim.

---

## 4 · The seven question types, and which the pipeline can actually write

`docs/exam-spec.md` lists seven, and treats them as one job. They are not
one job. Sorted by how confident I am that the pipeline in
`docs/agents/` produces them at shippable quality:

| Type | Per text | Verdict | The defect it is prone to |
| --- | --- | --- | --- |
| **Reference** | ~1 | **Safe** | Too easy; the referent is often the only plural noun in reach |
| **Vocabulary in context** | ~1 | **Safe, but it is not a reading item** | Answerable from word knowledge alone |
| **Detail** | 2–3 | **Safe with one rule** | Word-matching: the key is a verbatim lift |
| **Paragraph main idea** | ~1 | **Needs a spec** | "Too narrow" distractors that are defensible |
| **Negative detail (NOT TRUE)** | ~1 | **High risk** | Four assertions to verify, not one |
| **Author's purpose** | ≤1 | **High risk** | Answerable without reading the text |
| **Inference** | 1–2 | **Human adjudication, every item** | Plausible-but-not-entailed |

### 4.1 The pipeline already has the right instrument, by accident

`docs/agents/reviewer.md`'s **Pass B** asks the reviewer to quote the
shortest span that decides the answer and then say whether the item is
"still answerable with that span deleted". That was designed to catch
trigger-word grammar items. Pointed at a reading item it becomes exactly
the standard measure of **passage dependency** — answer the item with the
passage withheld — and it needs no new machinery, only a stimulus file
that ships the items without the text.

This matters because passage independence is the documented failure of
this item type, not a hypothetical one. Test takers score above chance on
reading items with the passages removed, and a substantial share of
multiple-choice reading items can be answered from world knowledge alone
([summarised evidence](https://www.researchgate.net/publication/230293474_Passage_dependency_in_ESL_reading_comprehension_tests);
[arXiv 2307.01076](https://arxiv.org/html/2307.01076v1) — **neither
fetchable from this environment**). The instrument for catching it is a
blind pass with the text withheld, and this project already runs blind
passes as a matter of course. **That is the single strongest argument
that reading is authorable here at all**: the one defect the type is
famous for is the one defect this pipeline is already built to find.

Two of the reviewer's defect classes need re-definition first, and
quietly breaking them is how a pipeline stops working:

- **D12, "answer visible in the paragraph", inverts.** For a cloze item
  the answer appearing in the passage is a defect. For a reading item the
  answer being *in the passage* is the whole point. The reading form of
  D12 is narrower: the key is a **verbatim lift**, so the item is solved
  by string matching rather than by reading. The paper's own items
  paraphrase; ours must.
- **D10, "context does not carry", inverts too.** The reading analogue is
  the opposite failure — the item is answerable *without* the context.
  It should be recorded as its own class, and it is the most valuable
  column in the whole review for this type.

### 4.2 Type by type

**Reference** — the referent is in the text, so a miskey cannot survive a
blind pass. Author it, review it cheaply, cap it at one per passage. The
one real risk is triviality: if only one candidate in reach agrees in
number, the item tests nothing. The distractors have to be *reachable*
noun phrases, and the spec should say so.

**Vocabulary in context** — authorable, and the pipeline will produce a
lot of it, and most of it will not be a reading item. TOEFL moved its
vocabulary measurement inside the passages, and the finding on those
items is that they still behave as relatively **passage-independent**
([Language Assessment Quarterly](https://www.tandfonline.com/doi/abs/10.1080/15434300701776138)
— search-index summary only). The design rule that makes one real:
**the target word must have two or more common senses, and the
distractors must be its other genuine senses** — so that only the
paragraph decides which. An author agent left alone will pick a word
whose dictionary sense *is* the answer, and the item will pass every check
in this repository while testing vocabulary.

That is not worthless — the app has no vocabulary content at all, and the
v1 plan wants 180 items of it — but it should be **counted against the
vocabulary budget, not the reading budget**, or the section will look
finished before it is.

**Detail** — the workhorse, 2–3 per text. One rule carries it: the key
paraphrases and no option lifts a distinctive phrase from the sentence it
comes from. `tools/content-checks.mjs` already computes token-trigram
overlap for near-duplicate stems, so the same machinery can flag a key
that overlaps its source sentence too heavily. That is a real, cheap,
corpus-wide check and it is the one automated addition I would actually
build for this type.

**Paragraph main idea** — needs a `docs/agents/category-spec.md` before
any are written, because its defect is invisible in one item and obvious
across four: the distractors have to come from a **named list of moves**
— too narrow (one detail from the paragraph), too broad (the topic of the
whole text), the neighbouring paragraph's topic, and an on-topic idea the
paragraph never takes up. Left to invent them, an author writes four
paraphrases of the same idea at different lengths and the item becomes a
style judgement, which is D3.

**Negative detail** — the highest-risk type that still belongs on the
list. A NOT TRUE item is **four assertions to verify rather than one**:
three options must be true *of the cited paragraph* and one false, and a
"true" option that is only nearly true — right claim, wrong scope; right
fact, wrong paragraph — produces two defensible answers. The exam uses
about one per text and so should we, and the adjudication in the
supervisor's loop has to be **per option**, which is four times the
reading for one item's worth of credit.

**Author's purpose** — at most one per text, and the one type where a
test-wise student can score without reading. The options are usually four
rhetorical verbs, and if the neutral-describing one is always the key, a
learner learns *that* instead. `docs/agents/reviewer.md` already names
this class of finding precisely — "a **role** that always falls to the
same kind of option … survives shuffling" — so the check exists; it just
has to be run across passages rather than within one.

**Inference** — the type the exam uses to separate students, and the one
place I would not trust the loop without a human on every item. An
inference item is sound when the conclusion is unstated **and entailed**;
it fails when the conclusion is stated (it is then a detail item wearing
the word "infer") or when it is merely plausible (two defensible answers,
or a world-knowledge item). Generating them is a recognised hard case with
dedicated methods proposed for it
([Automatic Generation of Inference Making Questions, BEA 2025](https://arxiv.org/pdf/2506.08260)
— not fetchable here), and the general finding on LLM-written reading
items is that acceptable-quality generation is achievable while
**discrimination** — whether the item separates strong from weak students
— is the property the models are worst at estimating
([Säuberli & Clematide, LREC-COLING 2024](https://aclanthology.org/2024.readi-1.3/);
[item-discrimination study](https://arxiv.org/pdf/2606.18709) — summaries
only). Discrimination is exactly what an inference item is for.

### 4.3 The passage is itself a content artefact, and nobody has costed it

Seven items are the visible half. The other half is a 700-word original
expository text that is at B2–C1, is about something a Turkish
undergraduate has no specialist knowledge of (or the items become world
knowledge), divides into six to eight paragraphs that each carry a
distinct idea (or main-idea items have nothing to ask), contains at least
one genuinely polysemous word and one reachable ambiguous pronoun (or two
of the seven types have no material), and is **original** — a published
text cannot go into a public app, and a paraphrased one is worse because
nobody can check it.

The stimulus passage in this document took about forty minutes to write to
that standard, and it is the easy half of the job.

Two things the validator can check for free and should: **word count**
(600–800) and **paragraph count** (6–8, and no more than the numeral
table). Both are the kind of constraint that is obvious in aggregate and
invisible while writing one.

---

## 5 · What it costs to author, and how many before it is worth anything

### 5.1 The per-passage cost, re-derived

`docs/research/content-pipeline.md` §7.2 estimates that "a passage costs
maybe 45 minutes of review for seven items" and calls it the best ratio
of any type. I do not think that survives contact with the work, and this
arm's job is to say so.

The pipeline's own unit is **90 minutes of supervisor attention per 12–15
items**, or 6–8 minutes an item, on the assumption that an item is a
sentence with four options and can be adjudicated on its own. A reading
item cannot: adjudicating it means holding the cited paragraph, and a
NOT TRUE item means verifying four assertions against it. Walking the
same twelve-step loop with a passage in it:

| Step | Who | Cost |
| --- | --- | --- |
| Choose a topic and write the 700-word text | agent draft, supervisor corrects | **30–45 min** |
| Author 7 items against the type spec | author agent | agent time |
| `npm run format`, `npm run validate` | supervisor | 2 min |
| Blind pass, both option orders | reviewer 1 | agent time |
| **Blind pass with the passage withheld** (§4.1) | reviewer 2 | agent time |
| Adversarial/rubric pass | reviewer 3 | agent time |
| **Take the passage cold**: read 770 words, answer 7 | supervisor | **15 min** |
| Adjudicate flags — per *option* on NOT TRUE, per item on inference | supervisor | **45–60 min** |
| Return rejects, judge the rewrites | supervisor | 15 min |
| Read 7 Turkish explanations | supervisor | 10 min |
| Merge, manifest, `contentVersion`, batch record | supervisor | 15 min |
| `npm run check`, `serve` + `verify` | supervisor | 10 min |

**≈ 2.5–3.5 hours of the supervisor's own attention per passage**, or
**21–30 minutes per item** — three to four times the grammar figure, not
the fraction the pipeline arm assumed. The direction of its claim is right
(seven items share one passage read) and the size is wrong, because it
counted the shared read and not the shared *verification*.

Two things pull it down with practice: the first passage is the dearest,
and once the seven type specs exist (§4) the adjudication is against a
written standard rather than a reconstructed one. Steady state is
plausibly 2 hours. The seven type specs themselves are **4–6 hours,
front-loaded**, on the same argument `content-pipeline.md` makes for
category specs and with the same expected payback.

The 40 minutes it took to write this document's stimulus passage is real
evidence for the first row, and it is a *floor*: that text was written
with no obligation to support a reference item, a polysemous target word
and two entailed-but-unstated inferences.

### 5.2 A reading passage is single-use, and this is the finding that decides it

A cloze item can be met again after a gap and still teach something. A
**passage cannot**: once a learner has read 700 words about urban heat
islands, they remember it, and all seven of its items are spent at once.
The v1 plan's binding constraint — four questions per category, so
`correct` starts measuring item memory instead of grammar — applies to
reading in its harshest form. **Every passage is one sitting.**

So the question "how many passages before the section is worth practising
against" has an arithmetic answer. The paper has **two texts**. Therefore:

| Passages | What the learner gets |
| --- | --- |
| 2 | One exam-shaped reading sitting. A demonstration, not practice. |
| 6 | Three sittings — enough to see whether the second is better than the first |
| **10** | **Five sittings, 70 items** — the v1 plan's own "ship" figure |
| 20 | A term's worth |

**Ten passages, ≈ 25–35 hours** including the specs. That is the number,
and it is three to four months at the four-hours-a-week the pipeline arm
assumes — not because the writing is slow but because the verification is.

### 5.3 And seven items on one passage are not seven observations

Worth recording before anyone builds the results screen for this. Items
sharing a stimulus are a **testlet**, and their responses are locally
dependent: a learner who happens to know something about urban heat
islands, or who simply misreads paragraph III, moves several items at
once. Ignoring that dependence **overestimates reliability**, and the
standard remedy is to treat the bundle as a single polytomous score rather
than as *n* independent items (Thissen et al. 1989; Wainer & Wang 2000 on
86 TOEFL testlets; Wainer & Thissen 1996 —
[survey of the literature](https://onlinelibrary.wiley.com/doi/10.1111/jedm.12432),
[NCES, item clustering](https://nces.ed.gov/whatsnew/pdf/assessingthepsych.pdf);
**neither fetchable from here**).

Two consequences for this app, both cheap and both easy to get wrong:

1. **Profil's weak-category statistic must not treat a passage as seven
   observations.** The v1 plan already had to repair that statistic once
   (`MIN_ATTEMPTS_FOR_WEAK_ENTRY = 3` labelling a random guesser weak
   99.6% of the time). Letting one bad passage post seven wrong answers
   into "Inference" would reintroduce the same class of error by a new
   route. Count a passage's contribution as closer to one observation
   than to seven — the simplest honest version is to require weak-entry
   evidence from **more than one passage** before naming a reading skill
   as a weakness.
2. **The results screen should show the passage score as a passage
   score** — "The Urban Heat Island: 5/7" — rather than folding seven
   items into a category breakdown that then looks better-evidenced than
   it is.

### 5.4 The comparison the brief asks for, made honestly

Thirty hours of the owner's attention buys one of these:

| Spend | What it produces | What it is worth |
| --- | --- | --- |
| **10 reading passages** | 70 items, **21 points**, entirely uncovered today | Consumed as it is used: 5 sittings and then it is gone |
| **~240 single-blank items** in the grammar the paper *actually* rewards | discourse markers, relative clauses, conditionals, comparatives, quantifiers, `so/such` | Carries the cloze section (15 pts) *and* much of restatement (15 pts), and is re-usable across sittings |
| **~240 restatement items** | 15 points | 24× more than the section needs — nobody should spend it this way |
| **5–6 reading-skill lessons, no passages** | the seven question types, the elimination procedure, in Turkish | **≈ 6 hours**, usable immediately, and see §6 |

The middle row is the uncomfortable one. Reading is the larger section and
it is at zero, but the grammar row produces a pool that keeps working
while the reading row produces five sittings that are then spent. If the
owner has **one** block of thirty hours and no more, the grammar row is
the better buy. If reading is going to be built at all, it has to be
built as an ongoing supply — a passage or two a month — rather than as a
project that finishes.

---

## 6 · Is it feasible before an exam a week away? No.

Plainly: **no, and it should not be attempted.**

The arithmetic is not close. Reading needs **25–35 hours of the owner's
own reviewing attention** (§5) and **roughly two days of code** (§2.4 and
§3), and the two cannot be run in parallel because there is one person.
That is before the real-device pass the README makes a precondition for
anything reaching `main`. A week is not that, and the week before a
proficiency exam is a week of *revision hours*, which are the same hours.

Three further reasons, each independent of the first:

**A half-built reading section is worse than none.** Two passages is one
sitting, which is a demonstration of a feature rather than practice for a
section. And every hour of a shortened schedule comes out of review, which
is exactly where `docs/research/content-pipeline.md` found the pipeline
fails — the one controlled comparison in the literature has
teacher-plus-AI items carrying *more* flaws than teacher-only items,
because the review got less engagement. A rushed reading passage is the
highest-surface-area place in this corpus to put an unreviewed defect: one
bad passage is seven wrong items and a paragraph of false Turkish
explanation.

**A phone is the wrong medium for this particular week.** The
screen-inferiority effect is small but consistent, is concentrated in
**expository** text — which is exactly what an exam reading passage is —
and is *worse under time pressure*, which is exactly what an exam is
([Delgado et al. 2018 meta-analysis, g ≈ −0.21 overall and ≈ −0.27 for
expository text](https://www.researchgate.net/publication/324993558_Comparison_of_reading_performance_on_screen_and_on_paper_A_meta-analysis);
[time-pressure study](https://www.sciencedirect.com/science/article/abs/pii/S0959475220306915)
— **search-index summaries; the sources were not reachable from here**).
The owner already possesses the two highest-fidelity reading practice
items that exist for this exam: the sample papers, on paper, with the text
on the facing page. Nothing this app could ship in a week would beat them.

**The point-per-hour ranking says something else first.** See below.

### 6.1 What to do with the week instead

In order, and every one of them is hours rather than days:

1. **Ship the closest-meaning content that is already written and
   reviewed.** It is sitting in `docs/agents/drafts/closest-meaning/` —
   24 questions and 6 lessons, both blind passes 24/24 on the key, blocked
   on **two false lesson claims and four over-wide absolutes**, with the
   repair list written out item by item in that directory's README. This
   is **15 of the paper's 100 points**, the code for it shipped on
   2026-09-03, and what stands between it and the learner is an afternoon
   of adjudication. Nothing else available this week is worth a quarter of
   as much.
2. **Do the reading section on paper, timed, from the sample papers.**
   Twice. That is the actual reading practice, and it costs no
   engineering.
3. **Leave the app doing what it already does well** — unseen-first
   ordering and the mistake book both shipped in stage 0, and the three
   grammar topics carry the modal blanks and part of the restatement
   section.
4. **Do not merge anything to `main` in exam week** that has not had the
   real-device pass. The branch discipline exists for exactly this week.

### 6.2 Two exam facts this arm turned up, and neither is verified

While checking the exam from outside the sample papers, Turkish
preparation-course pages consistently describe the İYS as **40 questions
at 1.5 points in Session I, with two reading texts** — which independently
matches `docs/exam-spec.md`, taken from the papers themselves. The same
pages add three things `exam-spec.md` lists as unknown:

- a **pass mark of 60/100**, and
- a **Session I threshold of 25** below which the candidate does not sit
  Session II, and
- a writing task of **≥250 words, one topic chosen from four**, with the
  listening note-taking half being **7 questions at 2 points** (= 14,
  which is exactly the figure `exam-spec.md` derived from the paper).

**None of it is verified.** These are commercial preparation sites read
through a search index; the official YTÜ School of Foreign Languages pages
are blocked by this environment's egress proxy, as they were for the
2026-09-03 round. The internal consistency is encouraging and is not
evidence. **It is an hour's work for the owner, who can reach those
pages**, and it matters: if the Session I threshold of 25 is real, then
reading's 21 points sit inside the 60 that decide whether Session II
happens at all, and the case for building it after the exam gets
stronger, not weaker.

---

## 7 · Build, defer, refuse

**One thing goes right, and it is worth naming before the costs.** The v1
plan's binding constraint is four questions per category. Reading escapes
it by construction: each passage contributes roughly one item to most of
the seven skill categories, so ten passages give **about ten items per
category** — two and a half times the density the grammar topics have
today, reached on the first pass rather than after a year. Reading is the
only section in the plan where the per-category arithmetic is healthy from
the start.

### Would build, in this order, after the exam

1. **The passage schema, validator and formatter** (§2.2, §2.4). One
   passage proves it; a second one is content, not engineering. Half a day
   to a day. Includes the two free validator checks — word count 600–800,
   paragraph count 6–8 — and the widened lesson-category rule.
2. **The passage sheet** (§3.4), built at 320 px first and added to
   `tools/verify-ui.mjs` in the same change. This is the day of real work.
3. **The seven type specs** (§4), 4–6 hours, *before* the second passage.
   The same argument `content-pipeline.md` makes for category specs, and
   the same expected payback: every finding worth acting on in the first
   review was invisible inside one item and obvious across four.
4. **The reading-form defect classes** in `docs/agents/reviewer.md` — the
   inverted D12 and D10 (§4.1), plus the passage-withheld blind pass as a
   stimulus format. An hour, and it is what makes the rest trustworthy.
5. **The testlet guard** (§5.3) in `js/storage.js` and on the results
   screen, shipping *with* the first passage rather than after it. It is
   ten lines and it prevents the weak-category statistic breaking a second
   time.
6. **One corpus check**: a key that overlaps its own source sentence too
   heavily. `tools/content-checks.mjs` already computes token-trigram
   overlap; this is the same measure pointed at a new pair.
7. **Reading-skill lessons**, five or six, shipping with passages 1–2 —
   not before, because a lesson's `check` blocks draw from its category's
   questions and a lesson with no questions is a lesson with no checks.
   Strategy instruction is the best-evidenced cheap thing in this whole
   arm: L2 strategy instruction runs around *d* = 0.49 overall
   ([Plonsky 2011](https://onlinelibrary.wiley.com/doi/10.1111/j.1467-9922.2011.00663.x))
   and multi-strategy L2 *reading* interventions considerably higher
   ([Yapp et al.](https://journals.sagepub.com/doi/full/10.1177/1362168820985236))
   — **both summaries from the search index, neither source reachable**.
8. **Then a passage or two a month, indefinitely.** §5.2: a passage is
   single-use, so this is a supply, not a project.

### Would defer

- **Paged passage presentation** (design D as a mode). The evidence
  favours it on small screens and the app deliberately left paging twice.
  Defer until somebody reads a real passage on a real phone and says the
  scroll is the problem — and then it is a presentation change with no
  content cost, which is precisely what the block vocabulary was designed
  to make possible.
- **Anything about widths above 390.** The measurements say a split view
  becomes possible at 768. The app is verified at 320 first and its users
  hold phones.
- **The timed, feedback-deferred block** applied to reading. The v1 plan
  already decided it ships with exam-shaped content; reading *is* exam-
  shaped content, so this is where it eventually lands — but after six
  passages exist, not before, or the rehearsal has nothing to rehearse.

### Would refuse

- **A split view, at any width the app supports.** Refused on
  measurement, not on taste: 1,244 px of content into a 500 px region at
  320×568, and into 776 px at 390×844.
- **Passage-then-questions with no way back.** It changes what the
  section measures (§3.3 B).
- **Published texts.** A copied passage cannot go into a public app, and
  a paraphrased one is worse: nobody can check it against anything.
- **Generating passages at volume without the human read.** This is the
  content-pipeline arm's central finding applied to the highest-surface
  item in the corpus. One unreviewed passage is seven wrong items.
- **Treating a passage's seven items as seven independent observations**
  anywhere a number is shown to a learner (§5.3).
- **A second scrolling region in the shell that is not a modal.** The
  one-scrolling-region rule is what makes the "answering never moves the
  button" guarantee checkable at all.

---

## 8 · Open questions for the owner

1. **Is reading a supply or a project?** §5.2 is the whole decision. Ten
   passages is five sittings and then it is spent; if there is no
   appetite for a passage or two a month after that, the 25–35 hours buys
   five evenings of practice and the grammar the paper actually rewards is
   the better spend. **This question should be answered before any of §7
   is started, not after.**
2. **Confirm the three exam facts in §6.2** from the official YTÜ pages,
   which you can reach and this environment cannot: the pass mark, the
   Session I threshold, and the durations. If the threshold of 25 in
   Session I is real, reading's 21 points sit inside the gate and that
   changes the ranking of everything in the v1 plan.
3. **Should the passage sheet open at the cited paragraph, or at the
   top?** Opening at the paragraph is more help than the paper gives.
   §3.4 proposes it as the default with a flag, on the grounds that this
   is practice rather than a mock — but it is a judgement about what the
   app is for, and that is yours.
4. **What are the reading categories called?** They are the results
   screen's link from a wrong answer to a lesson, and renaming one later
   resets progress for it — the taxonomy is settled once. The seven stem
   types (§4) is the obvious answer and is not the only one: *Detail* and
   *Negative Detail* could be one category, and *Reference* could sit
   inside *Vocabulary in Context*.
5. **What should the passages be about?** They have to be topics a
   Turkish undergraduate has no specialist knowledge of, or the items
   become world-knowledge items — but a text about nothing anyone cares
   about is read worse. This is a content judgement and there is no rule
   for it.
6. **How many hours a week, honestly?** The pipeline arm asked this and
   reading is the section whose answer depends on it most. At four hours
   a week reading is three to four months. At one evening a week it does
   not finish.
7. **Is there a second reader?** For a grammar item the supervisor's ten
   minutes is enough. For a passage, the person who has read the text
   three times is the worst possible judge of whether its inference items
   are entailed or merely plausible.

---

## What could not be verified

Every claim about this repository was measured in it. Every claim about
the exam comes from `docs/exam-spec.md`, which was written from the
owner's own papers, except §6.2, which is marked.

**Every citation to the research literature in this file is a
search-index summary.** This environment's egress proxy blocked every
primary source attempted — PMC, arXiv, ACL Anthology, Frontiers, ERIC,
lrec-conf, the University of Valencia, and both the official YTÜ domains.
That is the same caveat the 2026-09-03 round carried and it has not
improved. The claims it affects, and their weight in the argument:

| Claim | Used for | If it were wrong |
| --- | --- | --- |
| Removing the text shifts the construct toward memory | Refusing design B | The refusal weakens; the design is still worse |
| Small screens: paging > scrolling for expository text | Deferring design D | Nothing changes — D is already deferred |
| Screen inferiority, worse for expository and under time pressure | "Use the paper papers this week" | Advice becomes neutral rather than positive |
| Reading MCQs are often passage-independent | §4.1, the review instrument | The instrument is still free and still worth running |
| Testlet items are locally dependent; reliability is overestimated | §5.3, the Profil guard | The guard is cheap and conservative either way |
| Strategy instruction *d* ≈ 0.49–0.91 | Ranking the reading-skill lessons | Their ranking falls; they are still the cheapest thing here |

None of the load-bearing decisions — the schema, the refusal of the split
view, the per-passage cost, and the "no" in §6 — rests on any of them.
Those rest on measurement.
