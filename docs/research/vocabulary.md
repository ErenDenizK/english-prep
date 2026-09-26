# Vocabulary

What the app should do about the one content type it has never had, and
which of the obvious answers — a word list, a flashcard deck, a word
formation section — it should not build.

**The short version.** Vocabulary is not a missing *section*. On the
verified paper it is **six of about a hundred points** directly: two of
the ten cloze blanks and one vocabulary-in-context question in each of
the two reading texts. Everything else people mean when they say the app
needs vocabulary — that reading is unanswerable without range, that a
paraphrase you cannot read you cannot choose — is real but is a
**coverage** problem, and coverage is measured in thousands of word
families. The published thresholds put adequate reading comprehension at
4,000–5,000 word families and unassisted comprehension at 8,000; the 180
items `docs/v1-plan.md` budgets for vocabulary are, at the most generous
reading, 180 words. **No amount of item authoring moves a learner across
a lexical threshold.** An app that promises otherwise is lying with a
progress bar.

What 180 items *can* do is three things, and they are worth doing:

1. **Teach the item, not the lexicon.** Both of the paper's vocabulary
   blanks pit four same-part-of-speech words from one semantic field
   against each other, decided by the paragraph. That is a discrimination
   skill and it is trainable at this volume.
2. **Cover the band the paper actually samples.** The sample's own
   vocabulary items sit on general mid-frequency and Academic Word List
   territory (`conflict`, `emerge`, `appreciate`, `consume`), not on
   technical vocabulary and not on the first 2,000. That is a small
   enough target to aim at.
3. **Break the four-items-per-category ceiling** that
   `docs/v1-plan.md` calls the binding constraint on everything. It binds
   because a grammar contrast has two sides and runs out of honest
   discriminations at four items. A six-word semantic set does not: it
   has six keyable positions, every word serves as a distractor in the
   other five items, and meeting the same word in a second context is
   *desirable* here where meeting the same grammar item again is item
   memory. Vocabulary is the first content type in this app that can
   honestly carry ten items in a category — which is the threshold
   `practice-modes.md` §10 sets for mastery levels and spaced scheduling.

And two refusals up front, because they are the ideas most likely to be
proposed: **no flashcard mode** (the retrieval it trains is form→meaning
recall; the exam pays for meaning-selection in context, and the app's own
evidence base already says why), and **no word formation section** (there
is not one word-formation item on either sample paper — the README pairs
it with vocabulary on an assumption nobody has checked against a paper).

---

## 0 · What I could actually verify

The same limitation every arm of the last round hit, and it has not
improved: **this session's egress proxy blocks direct page fetches.**
`www.wgtn.ac.nz`, `www.lextutor.ca`, `www.eapfoundation.com`,
`en.wikipedia.org` and `simple.wiktionary.org` all returned proxy
denials, including for the plain-text word lists. So:

- **Every citation below is from a web-search index summary of an
  abstract or a first-party page, not from the source itself.** Where a
  number matters I checked it appeared in more than one summary, and I
  say so where it did not.
- **I could not read the AWL headword list.** The sublist numbers I give
  for four sample-paper words come from search summaries and should be
  re-checked against
  [the Victoria University list](https://www.wgtn.ac.nz/lals/resources/academicwordlist/sublist)
  before anything is authored against them. Nothing in my recommendation
  turns on the exact sublist; the *band* does, and the band is visible
  from the words themselves.
- **I have not seen the sample papers.** Everything I say about the exam
  comes from `docs/exam-spec.md`, which the owner's own papers back.
  Where I disagree with the brief I was given, it is because that
  document disagrees with it — see §1.1.

Measurements of this repository are exact and were taken by running code,
not estimated.

---

## 1 · What the paper actually asks of vocabulary

### 1.1 The direct marks, counted

From `docs/exam-spec.md`, which is the verified specification:

| Where | Items | Points | What it is |
| --- | --- | --- | --- |
| Cloze blank 5 | 1 | 1.5 | `consumerism / gratitude / conflict / generosity` |
| Cloze blank 10 | 1 | 1.5 | `appreciate / devastate / smuggle / emerge` |
| Reading, text 1 | ~1 | 1.5 | "the word *steer* is closest in meaning to ………" |
| Reading, text 2 | ~1 | 1.5 | same shape |
| **Total** | **4** | **6** | of roughly 100 |

Six points. For comparison, the restatement section the app is about to
ship is fifteen, and reading is twenty-one.

**A correction to the brief I was given.** I was told the paper's
"closest meaning" section is "largely lexical". `docs/exam-spec.md` says
the opposite, in terms: *"This is not a vocabulary item: the distractors
are grammatically fluent and differ in meaning, usually by reversing a
causal direction, changing a modality, or swapping which of two things is
being compared."* Every structure it lists as what the section turns on —
future perfect, third conditional, passive reporting, modal perfects,
`unless`, correlative comparatives, `as … as`, `enough to`, concession —
is grammatical. `docs/agents/closest-meaning-spec.md` was written on that
reading and its six categories are all structures. I am not going to
overturn a specification written from the actual papers on the strength
of a sentence in a brief. **Restatement is not a lexical section**, and
vocabulary should not be justified by it.

That does not make vocabulary unimportant. It makes its importance
*indirect*, which is a different argument that has to be made on its own
evidence — §1.2.

### 1.2 The indirect claim, and the number that kills the easy version of it

The honest case for vocabulary is that reading (21 points), paragraph
completion (9), restatement (15) and listening (20) are all gated by
whether the learner can read the words in front of them. That case is
correct and it is well evidenced. It is also much bigger than an app.

The thresholds, as published:

- Nation (2006) concludes that **8,000–9,000 word families** are needed
  for the 98% coverage that supports unassisted comprehension of written
  text, and 6,000–7,000 for spoken text.
  ([How Large a Vocabulary Is Needed for Reading and Listening?](https://www.researchgate.net/publication/239928724_How_Large_a_Vocabulary_Is_Needed_for_Reading_and_Listening))
- Laufer & Ravenhorst-Kalovski (2010) put **4,000–5,000 word families**
  at 95% coverage — their "adequate comprehension" threshold — and 8,000
  at 98%.
  ([Reading in a Foreign Language 22(1)](https://files.eric.ed.gov/fulltext/EJ887873.pdf))
- Coxhead's AWL is **570 word families covering about 10%** of academic
  text, which on top of the ~80% the general service list gives reaches
  roughly **90% coverage** of academic writing.
  ([A New Academic Word List, TESOL Quarterly 34(2)](https://onlinelibrary.wiley.com/doi/abs/10.2307/3587951);
  [AWL sublists](https://www.wgtn.ac.nz/lals/resources/academicwordlist/sublist))

Now the arithmetic. A Turkish prep-school student sitting a B1–B2
proficiency exam is plausibly somewhere between 2,000 and 3,500 word
families — I could not verify a Turkish-population figure and am not
going to invent one, so treat that as a range, not a finding. The gap to
"adequate" is on the order of **1,500–2,500 word families**.

Against that, the measured rate of deliberate word-pair learning is
**9 to 58 items per hour, averaging about 34**, and Nation's own
recommended annual target is around **1,000 word families a year**.
([Learning English vocabulary from word cards: a research synthesis, *Frontiers in Psychology* 2022](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2022.984211/full))
Even taken at the optimistic end, closing a 2,000-family gap is dozens of
hours of nothing but word learning, and word cards do not produce word
*families* — see §2.3.

**So the deferral in the README was right for a reason it did not
state.** Vocabulary was deferred because the cloze schema could not
express it. The better reason is that the version of "add vocabulary"
everyone imagines — get the learner's vocabulary up — is not a thing 180
JSON objects can do, and building it as though it were produces an app
that reports progress on a quantity it is not moving.

What *is* in range is everything in §1.3.

### 1.3 What the paper's own items turn on

Look at the two cloze blanks as items rather than as words.

**Blank 5** — `consumerism / gratitude / conflict / generosity`. Four
abstract nouns. Three of them are ordinary B1 vocabulary a prep student
knows the Turkish for. The item is not "do you know *gratitude*"; it is
"which of four things you can already gloss does this paragraph say".

**Blank 10** — `appreciate / devastate / smuggle / emerge`. Four verbs,
same shape. `smuggle` is the only one that is genuinely lower-frequency,
and it is the option a learner discards fastest.

By the search-index summaries — unverified against the list itself —
`conflict` and `emerge` are AWL sublist 5, `appreciate` sublist 8, and
`consume` (the root of `consumerism`) sublist 2. `gratitude`,
`generosity`, `devastate` and `smuggle` are not AWL: they are general
mid-frequency vocabulary. So the paper samples **a mixture of core
academic vocabulary and general mid-frequency words**, in the same item.
Neither list on its own predicts the options.

**The reading item is a different task.** *"In paragraph V, the word
`steer` is closest in meaning to ………"* — `steer` is a high-frequency
word. It is on the paper because of its **figurative sense**, and the
learner has to derive that sense from the paragraph. This is
sense-disambiguation of a word they already "know", not range.

That is the finding that decides the rest of this document:

> **Neither vocabulary item on this paper is a test of whether you have
> met a rare word. Both are tests of whether you can make a paragraph
> decide between meanings.** One does it with four candidates for a gap;
> the other with one word in place and four candidate glosses.

Which is, conveniently, the same skill the app's existing item format
already trains — and Little, Bjork, Bjork & Angello's result that
multiple-choice practice **with competitive alternatives** improves later
recall of related untested material, because the learner retrieves
reasons to reject each distractor, is the direct evidence that the format
earns its keep here.
([Little et al. 2012](https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/07/Little_EBjork_RBjork_Angello_2012.pdf),
already cited in `practice-modes.md` §2.1.)

---

## 2 · What should be tested, and what should not

### 2.1 The frame: bands, not lists

Schmitt & Schmitt's reassessment sets the boundaries this section uses:
**high-frequency is the first 3,000 word families, mid-frequency is
3,001–9,000, low-frequency is beyond that.**
([A reassessment of frequency and vocabulary size in L2 vocabulary teaching](https://www.semanticscholar.org/paper/A-reassessment-of-frequency-and-vocabulary-size-in-Schmitt-Schmitt/b032abfe15a34dbd444d3b8ae5cc478033c0958e))
Against that frame, and against §1.3:

| Band | Where it shows up on the paper | Worth items? |
| --- | --- | --- |
| K1–K3, core senses | everywhere; the learner has it | **No** |
| K1–K3, **figurative and secondary senses** | the reading vocabulary-in-context item (`steer`) | **Yes** |
| AWL / core academic (570 families) | cloze blank options, the reading texts' argument vocabulary | **Yes** |
| Mid-frequency general abstract vocabulary | cloze blank options (`gratitude`, `devastate`) | **Yes** |
| Technical / subject vocabulary | not sampled — the texts are general-interest | **No** |
| Low-frequency (beyond K9) | not sampled | **No** |

So the target is a **band with two halves**: the academic core, and the
secondary senses of words the learner already has. Neither is a list you
can download and neither is very large.

### 2.2 The unit is a semantic set, not a word

This is the design decision the whole arm rests on, so it is worth
stating separately.

The exam's vocabulary blank is **four same-part-of-speech words from one
semantic neighbourhood, one of which the paragraph selects**. Authoring
against a word *list* produces the wrong item: you pick `emerge`, then
you have to invent three distractors, and the honest ones are its
neighbours anyway. Authoring against a **set** — six verbs of change and
appearance, say — produces four items for the price of one context bank,
every option in every item is a real candidate, and the lesson writes
itself as a `contrast`.

It also produces a category name of exactly the shape the taxonomy
already uses. `docs/agents/question-author.md`'s own worked example is
`Deduction & Certainty (must be / can't be / might be)`. A vocabulary
category is `Change & Emergence (emerge / evolve / shift / decline /
fade)` — same shape, same job, and it links a wrong answer to a lesson
the same way.

**AWL and AVL are inputs to choosing sets, not the syllabus.** Use them to
decide which neighbourhoods are worth six items; do not ship a sublist.
Gardner & Davies' AVL is the better input where the two disagree, because
it is built on lemmas rather than word families and therefore tells you
the part of speech — which for this item type is the thing you need,
since every option in a set must share one.
([New Academic Vocabulary List, *Applied Linguistics* 35(3)](https://academic.oup.com/applij/article/35/3/305/146569))

### 2.3 What I would exclude, with the reason

**Phrasal verbs.** Not one item on either sample paper. And they are
expensive to test fairly: Garnier & Schmitt report phrasal verbs average
**5.6 meaning senses**, which is why their PHaVE List had to be built
around senses rather than forms at all.
([Language Teaching Research 19(6)](https://journals.sagepub.com/doi/10.1177/1362168814559798))
An item keyed on one sense of a five-sense verb is an item a good student
can argue with. If a paper turns up that tests them, the list to author
from already exists and is small — the top 150 phrasal verbs with their
main senses cover about 83% of occurrences — so this is cheap to revisit
and wrong to do speculatively.

**Collocations.** Also not on the paper, and they fail this project's own
authoring rule. `docs/agents/question-author.md` rule 2: *"An option a
competent teacher would accept is a wrong option. Not 'less natural than
the key' — accepted."* A collocation item (`make / do / take / have a
decision`) is *entirely* built on less-natural options: the three wrong
ones break no rule, and the Turkish explanation can only say "bu böyle
söylenir", which is not teaching and is not transferable. Sixteen of the
first 72 items already failed on precisely this axis. Building a whole
category on the defect is not a good idea.

**Technical and subject vocabulary.** Both the AWL and the AVL exclude it
by construction, and the sample reading texts are general-interest. A
learner cannot prepare for the technical vocabulary of a text they have
not seen; that is what the 2% at 98% coverage is *for*.

**K1–K3 in their core senses.** The learner has them. An item on
`important` teaches nothing and consumes a review slot. The exception is
the whole of the vocabulary-in-context task — `steer`, `address`,
`hold`, `draw` — which is a high-frequency word in a sense the learner
does not have, and is therefore in scope.

**Word formation as a section.** The README pairs "Vocabulary / Word
Formation" as one deferred feature. **There is not a single
word-formation item on either sample paper** — no blank asks for the
right derivative, and the ten cloze blanks are accounted for one by one
in `docs/exam-spec.md`. The pairing is an assumption from general
prep-exam folklore, and the paper does not support it.

That does *not* mean derivational morphology is worthless here. Schmitt &
Zimmerman found learners typically know two or three of the four word
classes for a given family, with adjective and adverb forms hardest, and
concluded that teachers should not "assume that learners will absorb the
derivative forms of a word family automatically from exposure".
([Derivative Word Forms: What Do Learners Know?, *TESOL Quarterly* 36(2)](https://onlinelibrary.wiley.com/doi/abs/10.2307/3588328))
That is an argument for **showing the family in the lesson**, which the
existing `forms` block does for free — one row per class, `use` naming
the class, `pattern` the suffix, `example` a sentence — and no argument at
all for a topic, a category or an item type.

And if a paper ever does test it, the item is `analyse / analysis /
analytical / analytically` in a gap: **an ordinary cloze**. It needs no
schema either way. So word formation is not "the same item type as
vocabulary or a different one" — on this exam it is not an item type.

**Word lists as a deliverable.** A "500 kelime" page is content-shaped
work that the app cannot practise, cannot review with its own pipeline,
and cannot check. The pipeline in `docs/agents/` reviews *items*. A list
has nothing to review.

### 2.4 One authoring rule that falls straight out of §1.3

**All four options must sit in the same frequency band.** Blank 10's
weakest option is `smuggle`, and it is weak precisely because it is the
one word a learner may never have met — which makes "I don't recognise
it" a surface cue for eliminating it, exactly the failure
`question-author.md` rule 4 names for grammar items. An option nobody
recognises is a dead option in a new costume.

This is the vocabulary equivalent of the "one item in four decided by
meaning, not a trigger word" rule, and it belongs in the category spec's
difficulty recipe.

---

## 3 · The schema

Three questions, answered in order: does the cloze item need a new type
(no), does the vocabulary-in-context item need one (yes, and it should
still not be built yet), and does anything need a new *field* (one thing
does, and it is not vocabulary-specific).

### 3.1 The vocabulary blank is a `cloze`. It needs nothing.

```json
{
  "id": "vocabulary-t3",
  "category": "Change & Emergence (emerge / evolve / decline / fade)",
  "paragraph": "The neighbourhood association had almost stopped meeting by the time the new tram line was announced. Within a year, membership ____ again, and the hall was too small for the crowd that turned up.",
  "options": ["revived", "emerged", "declined", "faded"],
  "correctIndex": 0,
  "explanation": "Dernek zaten vardı ve toplantıları azalmıştı; sonra tekrar canlandı. 'Revive' bir şeyin yeniden güç kazanmasıdır, tam da bu. 'Emerged' ilk kez ortaya çıkmak demektir — ama paragraf derneğin önceden var olduğunu söylüyor, o yüzden 'emerge' burada yanlış yönü gösterir.",
  "tip": "'Emerge' ilk kez görünmek, 'revive' ise yeniden canlanmaktır; ikisini paragrafın öncesinde o şeyin var olup olmadığı ayırır."
}
```

Nothing in that object is new. `CONTENT_GUIDE.md` says options are
*"usually different forms of the same verb"* — usually, not required —
and the validator has no rule that reads them as verb forms. I checked
each corpus-wide check against a vocabulary item:

| Check | Behaviour on a vocabulary item |
| --- | --- |
| banned option forms (invented `-ed` pasts) | inert — the options are different lemmas |
| two options identical ignoring case | works, and is the rule you want |
| multi-word key also appearing in the paragraph | works; single-word keys rarely trip it |
| near-duplicate stems (30% trigram overlap) | works, and matters *more* here, because a set of six words tempts an author into six paragraphs about the same scenario |
| scenario over-use | same, and this is the one I would watch |
| explanation must name a wrong option | works, and see §3.3 |

So `docs/v1-plan.md` stage 2 item 5 is right that vocabulary "needs no
schema change at all" — **for this half of it.** It is wrong about the
other half, and about the cost, which is §4.

**The category naming rule carries over unchanged.** A vocabulary
category names the discrimination, in the same shape as
`Deduction & Certainty (must be / can't be / might be)`. That is what
makes a wrong answer link to a lesson from the results screen and from
Profil, which is the mechanism the whole app runs on, and it means the
`contrast`, `examples`, `pitfall` and `decision` blocks all work with no
changes: a `contrast` between two near-synonyms is exactly what the block
was built for, and the `forms` block will carry the derivational family
(§2.3) with `use` naming the word class.

### 3.2 The vocabulary-in-context item does need a third type — and should still wait

Designed concretely, in the guide's own shape:

```json
{
  "id": "reading-p2-q5",
  "type": "synonym",
  "category": "Vocabulary in Context",
  "paragraph": "Rather than banning the technology outright, the committee tried to steer the debate towards questions of consent, which it judged more likely to produce a workable rule.",
  "target": "steer",
  "options": ["guide", "prohibit", "record", "postpone"],
  "correctIndex": 0,
  "explanation": "…",
  "tip": "…"
}
```

Two fields differ from a cloze and nothing else does:

- **`type`** — `"synonym"`.
- **`target`** — the word under test. It must appear in `paragraph`
  exactly once, and `paragraph` must contain no `____`. Those two rules
  are the whole point: the learner sees the word *in place*, which is
  what makes the task sense-disambiguation rather than gap-filling.

**Why it cannot be squeezed into an existing type.** Blanking the target
and calling it a cloze changes what is tested: with the word removed, the
item becomes "which meaning does this paragraph want", which is §3.1's
item. The thing `steer` tests is that you can take a word you already
know and let the paragraph pick the sense — you cannot test that with the
word absent. And a restatement is barred by the validator from carrying a
`paragraph` at all, for the reason `CONTENT_GUIDE.md` gives: *"the blank
is the whole difference between the two shapes, and mislabelling one as
the other hides that."* The same sentence rules out the tempting hack of
marking the target with `**bold**` inside a cloze paragraph — it would
make a synonym item indistinguishable from a cloze to the validator, to
the corpus checks and to the results screen.

**What it would actually cost, measured against the code.** Less than the
brief assumes:

| File | Change |
| --- | --- |
| `js/topics.js:69` | one more branch on `type` for `prompt`, plus carrying `target` |
| `js/quiz-engine.js:139` | one more field in the result projection |
| `js/prompt.js` | one `INSTRUCTION` entry, and render the marked span |
| `js/dom.js` | `appendTargeted(parent, text, target)` — a sibling of `appendBlanked`, ~15 lines, still `textContent` only |
| `css/style.css` | one rule for the marked span |
| `tools/validate-content.mjs` | a branch: `target` present, appears once, no `____`, no `sentence` |
| `tools/content-checks.mjs` | exempt `target` from the "key appears in the stem" warning |

Call it half a day to a day. The results review gets it free, because
`renderPrompt` is already shared by three screens.

**So why not build it.** Because of where the item lives on the paper.
It is question five of seven on a **700-word text divided into
Roman-numbered paragraphs**, and the stem cites the paragraph
(`docs/exam-spec.md`). Authored standalone on a 40-word paragraph it is a
materially easier and differently-shaped item: the learner has forty
words of scaffolding instead of seven hundred, and no competing sense
anywhere else in the text. Meanwhile `docs/v1-plan.md` stage 2 item 3
builds the passage unit anyway — 21 points, the largest section — and
vocabulary-in-context is **one of the seven question types that round has
to support regardless**. Building `synonym` standalone now means either
building it twice or discovering it does not compose with the passage
unit.

> **Recommendation: fold the third type into the reading round, and put
> one requirement on the reading schema now** — a passage paragraph must
> be able to carry a *marked span*, not merely be addressable by number.
> That is the only decision that has to be made early, and it costs
> nothing to make it early.

### 3.3 The one field that is genuinely missing, and it is not vocabulary's

For a grammar item, one explanation naming the closest distractor is
enough, because the other two options usually fail for the same reason.
For a vocabulary set item **each wrong option is a different word with a
different meaning**, and a learner who chose `gratitude` needs to be told
what `gratitude` means — not what `consumerism` means.

The current schema measurably does not have room. Across the 73 shipped
questions:

```
explanation length (73 items): min 125, median 428, mean 365, p75 467, max 520
validator warns above 600
```

Three short Turkish glosses with a "why not here" clause is 180–240
characters. Added to the median explanation that is **608–668** — over
the cap. At the 75th percentile it is 647–707. The field is full for at
least half the corpus and it would be full for essentially every
vocabulary item, because a vocabulary explanation starts longer: it has
to establish what the *key* means before it can argue that the paragraph
selects it.

**This is the same field `practice-modes.md` §8.4 asks for.** "Neden
yanlış?" — one line per distractor, three per question — is listed in
`docs/v1-plan.md` as an open question for the owner, priced at 291 notes
against the existing corpus. Vocabulary is the content type where it
stops being an enhancement and becomes the minimum honest explanation.
**Decide it once, for both.**

Concretely:

```json
"optionNotes": {
  "emerged": "İlk kez ortaya çıkmak. Dernek zaten vardı.",
  "declined": "Azalmak — paragrafın söylediğinin tersi.",
  "faded": "Yavaşça sönmek; yine ters yön."
}
```

**Keyed by the option text, not an array parallel to `options`** — and
the codebase already argues for this. `js/topics.js` scores against a
`correctAnswer` *string* rather than an index, with the comment that it is
*"stable even after the options are shuffled for display"*, and
`js/quiz-engine.js:82` does exactly that: `options: shuffle(question.options)`.
A parallel array would be silently permuted apart from its options on
every attempt unless the shuffle were changed to move pairs. A keyed
object survives untouched, and the validator can require its key set to
equal the option set minus the key — an alignment error becomes
impossible rather than invisible.

The honest cost of the general form: for restatement items the keys are
whole sentences, which is ugly in a JSON file. If the owner wants one
field for all three types, that ugliness is the price; if vocabulary is
the only type that gets it, the keys are single words and it reads well.

---

## 4 · The practice format: what the learner actually does

### 4.1 The answer is "the screens that already exist"

A vocabulary item is a four-option multiple-choice question in a
paragraph. The Test screen renders it, the results screen breaks it down
by category, Profil surfaces it as a weak category, "Pratik Yap" scopes a
test to it, and an Eğitim lesson pulls it into a `check` block. **Every
one of those works on the day the JSON lands, with no code.**

That is the recommendation. What follows is the case against the two
things people will propose instead, and the one calendar fact the app
should tell the learner.

### 4.2 Flashcards: the precondition is now met, and the mode still fails

`practice-modes.md` §2.1 calls flashcards *"the correct tool for
vocabulary and for anything with a one-to-one mapping"* and defers them
in §10 until "vocabulary content exists". This arm is the one that would
unblock that. It should not.

**First, the strongest evidence for flashcards, stated fairly**, because
the usual objection to them is wrong. Elgort's experiments had learners
deliberately study 48 pseudowords from cards and then measured lexical
decision under form priming, masked repetition priming and automatic
semantic priming. All three effects appeared: the deliberately learned
items were processed **with a higher degree of automaticity than nonwords
and than low-frequency real L2 words**, after roughly four hours of study
spread across a week. Deliberate card learning produces genuine lexical
representations, not a fragile list.
([Deliberate Learning and Vocabulary Acquisition in a Second Language, *Language Learning* 61(2)](https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1467-9922.2010.00613.x))

So the reason not to build a deck is not that decks are shallow. It is
four other things:

1. **The retrieval is the wrong one.** A card teaches `emerge → ortaya
   çıkmak` and another teaches `revive → yeniden canlanmak`. The two
   words never meet. The exam item is precisely the meeting: four words
   whose glosses you have, one paragraph that decides. Form→meaning
   recall does not train the discrimination the paper pays for, and §1.3
   is the evidence that the paper pays for the discrimination.
2. **A deck needs a word list, and §2.3 refuses shipping one.** The
   moment there is a deck there is pressure to fill it from a sublist,
   and 570 unreviewed cards would be the largest unreviewed artefact in
   the repository by an order of magnitude.
3. **A deck without a scheduler is a list with buttons, and the
   scheduler is already refused.** `docs/v1-plan.md` refuses "FSRS, BKT,
   item-level spaced repetition, SM-2's self-graded quality" and states
   that *"the schedulable unit here is the category, not the item"*. A
   flashcard mode is an item-level scheduler by another name.
4. **Self-grading is the refused control.** SM-2-style "how well did you
   know that" is named in the refusals, and the app declined the
   retrospective confidence button for related reasons on 2026-09-04.

**What to steal from Elgort instead.** Her result is about *deliberate,
repeated, spaced encounters across about a week*. That shape is
deliverable through the existing Test screen the moment a category holds
enough items that the same word recurs in a different paragraph — which
is §5's whole argument for authoring in sets. It is a property of the
content, not a mode.

### 4.3 A week versus three months — the only genuinely different advice

This is the question the brief asks and it has a clean answer from the
spacing literature.

Cepeda, Vul, Rohrer, Wixted & Pashler taught over 1,350 people a set of
facts, varied the gap before review and the delay before test, and mapped
the ridgeline. **The optimum gap was about 20–40% of the test delay for a
one-week delay, falling to about 5–10% for a one-year delay.**
([Spacing Effects in Learning: A Temporal Ridgeline of Optimal Retention, *Psychological Science* 19(11)](https://journals.sagepub.com/doi/10.1111/j.1467-9280.2008.02209.x))

**One week out.** 20–40% of seven days is **1.5 to 3 days**. So: two or
three separate sessions across the week, not one long night and not a
session every day. That is one sentence of Turkish on the Test tab and
costs nothing to say.

And the content advice for a week is blunt: **stop trying to learn new
words.** §1.2's arithmetic says a week of deliberate learning at a
realistic 20–34 items an hour cannot touch a 1,500-family gap. What a
week can buy:

- the **item skill** — four candidates, one paragraph, eliminate three;
- the **secondary senses** of words already known, which is the reading
  section's vocabulary item and needs no new range at all;
- whatever sets are already in the app, met twice rather than once.

**Three months out.** The interpolation between Cepeda's two anchors —
and it *is* an interpolation, not a reported figure — puts the gap
somewhere around one to two weeks between encounters with the same
material. More usefully: three months is long enough for coverage to
move, but only at volume. Nation's own recommended target is about
**1,000 word families a year**, so three focused months is on the order
of 250 families — real, and still a fraction of the gap in §1.2.

The uncomfortable corollary: **the thing that would help a three-month
learner most is reading volume, and this app cannot host it.** At 98%
coverage, roughly one unknown word in fifty, context reliably
disambiguates and incidental learning works; below about 95% it does not,
which is Laufer's lexical threshold and the reason "just read more" is
advice that fails the learners who need it most.
([Kremmel et al.'s replication of Hu & Nation, *Language Learning* 2023](https://onlinelibrary.wiley.com/doi/10.1111/lang.12622))
An honest app says this in a sentence rather than implying its 180 items
are the answer.

### 4.4 Two things that fall out for free

**Vocabulary items belong in the mixed test, not in a vocabulary mode.**
Interleaving is the mode with the cleanest classroom RCT behind it
(`practice-modes.md` §2.1) and the app already has it. A separate
"Kelime" mode would block the interleaving and add a tab for no gain.

**The unseen-first draw shipped in stage 0 already does the right thing
here, for a different reason than it was built for.** For a grammar item,
meeting it a second time is item memory and the draw exists to avoid it.
For a vocabulary item, meeting the *word* a second time in a different
paragraph is the desired event — and because the draw prefers unseen
*items*, the second encounter it serves is a second context. This is the
one place in the app where the repetition the engine avoids and the
repetition the learner needs are not in conflict.

---

## 5 · The authoring cost, and what a vocabulary category spec looks like

### 5.1 The number in the plan is roughly half the job

`docs/v1-plan.md` prices vocabulary at *"~2–3 days of code, 180 items to
ship"*, and stage 3 prices the whole content programme at "six to eight
minutes of genuine review per item", giving 50–65 hours for 490 items.

**That figure counts only per-item review.** It omits three things the
project's own pipeline requires, and the first content review measured
all three:

- **the category spec**, about an hour each (`docs/agents/category-spec.md`);
- **the lesson**, one per category, plus the lesson-sufficiency pass;
- **rework**, and the measured rate is not small. `docs/content-review.md`
  found **16 of 72 items had a second defensible answer** — 22% — and
  **three of the first six rewrites were rejected** on blind re-review,
  one of them for trading a defect for a worse one.

Costed properly, 180 vocabulary items look like this. Code is excluded;
this is supervisor time, and the authoring sessions themselves are cheap.

| | Sets of 10 (18 categories) | Sets of 4 (45 categories) |
| --- | --- | --- |
| Category specs @ 1 h | 18 h | 45 h |
| Item review, 180 @ 7 min | 21 h | 21 h |
| Rework: 22% defective × ~2 cycles | ~13 h | ~13 h |
| Lessons, ~45 min each incl. sufficiency pass | ~14 h | ~34 h |
| Assembly, `format`, `validate`, repair | ~3 h | ~3 h |
| **Total** | **~69 h** | **~116 h** |

Two things to take from the table. First, **the real number is 60–80
hours, not "2–3 days of code"** — the code is the small half, exactly as
`docs/v1-plan.md` says everywhere else and then forgets in this one row.
Second, **authoring in sets of ten rather than fours saves about forty
hours**, entirely in specs and lessons, which is the concrete payoff of
§2.2 and the reason that section is not merely a taxonomy preference.

**What I would actually ship first.** Not 180. Six sets of ten — sixty
items, six categories, six lessons — at roughly **25 hours**, chosen so
that the sets cover the two halves of §2.1: four sets of academic and
mid-frequency abstract vocabulary organised by semantic field, and two
sets of high-frequency polysemy (`steer`, `address`, `hold`, `draw`,
`raise`, `run`) which is the reading item's actual content. That is a
shippable topic, it proves the format against the pipeline, and if it
turns out the sets do not carry ten items honestly, the project has lost
25 hours and not 70.

### 5.2 The category spec, adapted

`docs/agents/category-spec.md` is six sections and it mostly transfers.
Three of them change, and one is new. Everything below is what a
supervisor would actually write in the file.

**§1 The discrimination** — unchanged in form, harder in substance. For a
set the discrimination is the *axis* the set varies on, not a list of
glosses: *"can tell whether the thing existed before the sentence's time
frame"* separates `emerge` from `revive` and `expand`. The **honest
bound** matters more here than anywhere in the app: near-synonyms are
often genuinely interchangeable, and the bound is the list of pairs in
this set that must never be keyed against each other. Write it before
item one, or every item three will be arguable.

**§2 Misconceptions** — the content changes completely. For grammar they
are rule errors; for vocabulary they are **L1 mapping errors**, and they
are the most Turkish-specific thing in the whole content pipeline:

```
M1. Turkish "geliştirmek" covers both develop and improve → picks
    "develop" where the sentence says something already good got better.
M2. A single memorised gloss is treated as the whole meaning: "emerge =
    ortaya çıkmak" → picked for anything that becomes visible, including
    things that were already there.
M3. False friend: "sempatik" ≠ sympathetic.
M4. The word is known only in its literal sense → the figurative use in
    the paragraph is not recognised.
```

The existing rule holds without change: **every distractor cites a
misconception by number**, and a distractor that cites nothing is
decoration. It is if anything more load-bearing here, because "a word
that means something else" is an infinitely available distractor and
nothing except this rule stops an author reaching for one.

**§3 The item plan** — eight to twelve rows, not four, and three rules
replace the grammar version's three:

- **Every word in the set keys at least once.** A word that only ever
  appears as a distractor is never taught, and the learner's only
  information about it is that it was wrong twice.
- **At least two items are decided by evidence in a different sentence
  from the blank.** The vocabulary equivalent of "not decided by the
  trigger word next to the gap".
- **At least one item is keyed *against* the obvious Turkish gloss** —
  the item where M1 or M2 produces a confident wrong answer. This is the
  direct analogue of "one item punishes the rule", and for vocabulary it
  is the only item in the set that is worth much.

**§4 Context bank** — twelve to twenty scenarios rather than eight to
twelve, and the domain constraint bites harder. A semantic set drags an
author into one domain: give someone six verbs of change and every
paragraph will be about technology. The existing rules carry over
unchanged and both matter more: no scenario from the lesson, and no two
items sharing a scenario.

**§5 Difficulty recipe** — what makes a *vocabulary* item hard, in order:
the deciding evidence sits in a different sentence; two options are both
true of the situation but only one is what the sentence *says*; the key
is the less frequent member of the set and the frequent one is plausible.
And what makes one artificially hard, which is not wanted: an option
outside the set's frequency band (§2.4), an option decided by
collocation rather than meaning (§2.3), a paragraph whose *other*
vocabulary is harder than the item.

**§6 Coverage ledger** — becomes a word-by-word table, and the rule
tightens: every word in the set must appear **as key at least once and as
a distractor at least twice**. A word appearing once, as the key, is a
flashcard with a paragraph around it.

**§7 The band declaration — new.** One line: which frequency band this
set sits in, and the check that no option falls outside it. This is what
makes §2.4 enforceable by a reviewer who is not the author, and it is
the only addition the template needs.

**Cost of the template change:** the template is shared with grammar
topics, so this is either a second template or a section marked "for
vocabulary categories". I would write it as one page of deltas beside the
existing file rather than forking it — the six sections and their reasons
are the same, and a fork drifts.

---

## 6 · One consequence nobody has costed: ten items per category unlocks a claim the app cannot currently make

Measured, not inferred. `js/storage.js` gates every statement the app
makes about a weakness on `MIN_ITEMS_FOR_WEAK_CLAIM = 6`, and `total`
there counts **distinct questions**, not answers:

```js
const MIN_ITEMS_FOR_WEAK_CLAIM = 6;
…
confident: stats.total >= MIN_ITEMS_FOR_WEAK_CLAIM && wilsonUpper(...) < MASTERY
```

Every category in the app has four questions; one has five. **So
`confident` is structurally unreachable for every category that exists**,
and both places that consume it — `js/home.js:205` and
`js/profile.js:328` — permanently render the hedged string, *"Şimdilik az
veriyle sıralandı."* The app is being honest, and it is being honest
about an arithmetic dead end rather than about a data shortage.

A ten-item vocabulary category would be **the first category in the app
that can ever produce a confident weakness claim.** That is a larger
argument for §2.2 than the forty hours: it is the only route on the table
to a category-level statement that is not a hedge, and
`docs/v1-plan.md` names exactly this — *"`getWeakCategories()` cannot
tell a lucky guess from secure knowledge"* — as the thing the refused
confidence control was supposed to fix.

**And it carries a defect to fix at the same time.** Both consumers use
`entries.some((entry) => entry.confident)`, so **one** qualifying category
flips the hint for the entire list. If vocabulary categories are the only
ones with six or more items, the app will say "this is a ranking you can
act on" about a list that is mostly four-item hedges. That is a one-line
fix — the hint belongs per entry, or the string has to be weakened — and
it should be made in the same round the first ten-item category ships,
not discovered afterwards.

---

## 7 · What I would build, defer and refuse

### Build

| | Cost | |
| --- | --- | --- |
| **Six sets of ten as a `vocabulary` topic**, using `type: "cloze"` unchanged — four sets of academic/mid-frequency abstract vocabulary by semantic field, two of high-frequency polysemy | **~25 h content, zero code** | §5.1 |
| **The vocabulary deltas to `docs/agents/category-spec.md`** — L1-mapping misconceptions, the 8–12-row item plan, the band declaration, the tightened coverage ledger | ~2 h, one page | §5.2 |
| **Decide `optionNotes` once**, for vocabulary and for "Neden yanlış?" together; keyed by option text, because the engine shuffles options and scores by string | ~half a day of code, then a real authoring job | §3.3 |
| **Fix the `some(...)` hint** in `home.js` and `profile.js` before the first ten-item category ships | ~an hour | §6 |
| **Two sentences of Turkish**: two or three sessions across a week rather than one long night; and that range comes from reading, not from this app | hours | §4.3 |

### Defer

| | Until |
| --- | --- |
| **`type: "synonym"`** — the vocabulary-in-context item | the reading round builds the passage unit. Put one requirement on that schema **now**: a paragraph must be able to carry a *marked span*, not merely be addressable by number |
| **Category-level mastery / scheduling** (`practice-modes.md` §2.3, §10) | one ten-item category exists and has been used — this arm is what unblocks the threshold, and the mechanic should be judged against a real category, not a projected one |
| **Phrasal verbs** | a sample paper shows one. If it does, the PHaVE List's 150 verbs cover ~83% of occurrences and the job is small |
| **Word-formation items** | same. And when it happens it is a `cloze`, not a new type |
| **The remaining 120 of the planned 180 items** | the first sixty have been through the blind pipeline and the sets held ten items honestly |

### Refuse

**A flashcard or deck mode.** §4.2. Not because decks are shallow —
Elgort's evidence says the opposite — but because form→meaning recall is
not the retrieval the paper pays for, because a deck needs a word list
this document refuses to ship, because item-level scheduling and
self-graded quality are already refused in `docs/v1-plan.md`, and because
the deck would arrive as the largest unreviewed artefact in the
repository.

**Shipping a word list as content.** AWL sublists, "500 kelime", any
page of words with glosses. The pipeline in `docs/agents/` reviews items;
a list has nothing to review, cannot be practised in the app's own
format, and cannot fail a validator. It is content-shaped work that
teaches nothing.

**Collocation items.** §2.3. Zero marks on the paper, and every
distractor is wrong only by being unidiomatic — which is exactly the
defect `docs/agents/question-author.md` rule 2 was written to stop, and
which sixteen of the first seventy-two items already committed.

**Any vocabulary-size estimate shown to the learner.** "Kelime dağarcığın
~3.200 kelime" is the placement test again in a new costume, and
`docs/v1-plan.md` already refuses that on reliability grounds: a
four-item category subtest reaches α = 0.24. A size test needs a properly
sampled instrument across frequency bands, which is more items than the
whole app has, and a number that looks precise and is not is worse than
no number.

**A separate "Kelime" tab or mode.** §4.4. It would break the
interleaving the mixed test already provides — the mode with the
cleanest classroom RCT behind it — and add a navigation decision the
owner has twice settled.

**Technical, subject-specific and low-frequency vocabulary.** §2.3. Not
sampled by the paper, excluded by construction from both academic word
lists, and unlearnable in advance for a text nobody has seen.

**A progress bar over a target word count.** There is no honest
denominator. §1.2 is the reason: the denominator that matters is
thousands of families and the app holds tens.

---

## 8 · Where this leaves vocabulary in the plan

**I am not arguing to move it up.** `docs/v1-plan.md` stage 2 ranks
vocabulary fifth of six, behind restatement, the timed block, reading
passages and reading-skill lessons. On marks that ordering is right and
this arm confirms it: vocabulary is six direct points, reading is
twenty-one and restatement fifteen, and the grammar the cloze section
actually tests — discourse markers, relative clauses, quantifiers,
comparatives, `so/such` — is worth more than vocabulary and costs the
same to author.

What this arm changes is three things about vocabulary *when it is
reached*:

1. **What it is.** Not range, which the app cannot move. Sets of
   confusable near-neighbours decided by a paragraph, plus the secondary
   senses of words the learner already has.
2. **What it costs.** 60–80 hours for the planned 180 items, not "2–3
   days of code" — and 25 hours for a defensible first sixty.
3. **What it unlocks.** The first honest ten-item category in the app,
   which is the threshold two other deferred features are waiting on.

And one decision has to be made early even though the work is late:
**the reading schema must let a paragraph carry a marked span.** That is
free to decide now and expensive to retrofit.

---

## 9 · Open questions for the owner

1. **Is `optionNotes` worth its authoring cost?** (§3.3) It is the same
   decision as "Neden yanlış?", which `docs/v1-plan.md` already has open.
   For vocabulary it is not optional — three glosses do not fit in a
   600-character explanation, measured — so the answer decides whether
   vocabulary items ship with complete feedback or with a note that only
   explains one of the three wrong words.
2. **Sixty vocabulary items, or a hundred grammar items on the cloze
   section's real syllabus?** They cost about the same. On marks the
   grammar wins. I would still write the vocabulary sets second rather
   than never, because they are the only content that produces a
   ten-item category — but that is a judgement about what the app should
   become, not about this year's exam, and it is the owner's.
3. **Does a topic with uneven category sizes bother you?** Every category
   in the app has four questions. A vocabulary topic would have ten, and
   the mixed test's category breakdown, Profil's weak list and the
   `confident` hint all behave differently as a result (§6). This is the
   first real asymmetry in the content model and it is a taste decision
   as much as a technical one.
4. **Should the app say out loud that it cannot give you vocabulary
   range?** §4.3's honest sentence — that range comes from reading
   volume, and this app is not that — is correct and slightly
   demoralising. `practice-modes.md` §12 asked the same shape of question
   about showing the pool size. Same instinct here: say it.
5. **Bilkent's sample papers, again.** (`docs/v1-plan.md`, blocked.) If
   another university's paper has a word-formation section or a phrasal
   verb item, two of this document's refusals become build items and the
   spec work is small. Nothing here should be treated as settled for an
   exam nobody has seen.
6. **Is there a real learner with a week?** §4.3 gives genuinely
   different advice for one week and three months, and the difference is
   large enough to be worth a sentence in the app. It needs one fact
   nobody has recorded: when each of the six users actually sits the
   paper.

---

## Sources

Read as web-search index summaries of abstracts and first-party pages,
**not as full texts** — every direct fetch was blocked by this session's
egress proxy (§0). Where a number matters, it appeared in more than one
summary; where it did not, the text says so.

**Vocabulary size, coverage and thresholds**
- [Nation (2006). How Large a Vocabulary Is Needed For Reading and Listening? *Canadian Modern Language Review* 63(1)](https://www.researchgate.net/publication/239928724_How_Large_a_Vocabulary_Is_Needed_for_Reading_and_Listening)
- [Laufer & Ravenhorst-Kalovski (2010). Lexical threshold revisited. *Reading in a Foreign Language* 22(1)](https://files.eric.ed.gov/fulltext/EJ887873.pdf)
- [Kremmel et al. (2023). Unknown Vocabulary Density and Reading Comprehension: Replicating Hu and Nation (2000). *Language Learning*](https://onlinelibrary.wiley.com/doi/10.1111/lang.12622)
- [Schmitt & Schmitt (2014). A reassessment of frequency and vocabulary size in L2 vocabulary teaching. *Language Teaching*](https://www.semanticscholar.org/paper/A-reassessment-of-frequency-and-vocabulary-size-in-Schmitt-Schmitt/b032abfe15a34dbd444d3b8ae5cc478033c0958e)

**Word lists**
- [Coxhead (2000). A New Academic Word List. *TESOL Quarterly* 34(2)](https://onlinelibrary.wiley.com/doi/abs/10.2307/3587951)
- [AWL sublists — Victoria University of Wellington](https://www.wgtn.ac.nz/lals/resources/academicwordlist/sublist) *(blocked; sublist numbers in §1.3 are from search summaries and are unverified)*
- [Gardner & Davies (2014). A New Academic Vocabulary List. *Applied Linguistics* 35(3)](https://academic.oup.com/applij/article/35/3/305/146569)
- [Garnier & Schmitt (2015). The PHaVE List. *Language Teaching Research* 19(6)](https://journals.sagepub.com/doi/10.1177/1362168814559798)

**Learning, deliberate study and word families**
- [Elgort (2011). Deliberate Learning and Vocabulary Acquisition in a Second Language. *Language Learning* 61(2)](https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1467-9922.2010.00613.x)
- [Learning English vocabulary from word cards: a research synthesis. *Frontiers in Psychology* (2022)](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2022.984211/full)
- [Schmitt & Zimmerman (2002). Derivative Word Forms: What Do Learners Know? *TESOL Quarterly* 36(2)](https://onlinelibrary.wiley.com/doi/abs/10.2307/3588328)

**Spacing, testing and item format** *(all also cited in `practice-modes.md`)*
- [Cepeda, Vul, Rohrer, Wixted & Pashler (2008). Spacing Effects in Learning: A Temporal Ridgeline of Optimal Retention. *Psychological Science* 19(11)](https://journals.sagepub.com/doi/10.1111/j.1467-9280.2008.02209.x)
- [Little, E. Bjork, R. Bjork & Angello (2012). Multiple-Choice Tests Exonerated, at Least of Some Charges (PDF)](https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/07/Little_EBjork_RBjork_Angello_2012.pdf)

**In this repository** — measured, not cited
- `docs/exam-spec.md` — the four vocabulary items on the sample paper
- `docs/content-review.md` — 16 of 72 items with a second defensible answer; three of the first six rewrites rejected
- `js/storage.js:26–29, 322–355` — `MIN_ITEMS_FOR_WEAK_CLAIM = 6` against four-item categories
- `js/quiz-engine.js:82, 139`; `js/topics.js:64–71`; `js/prompt.js`; `js/dom.js` — the cost of a third item type
- `data/*/*.json` — 73 questions, 18 categories, explanation length mean 365 / median 428 / max 520 characters
