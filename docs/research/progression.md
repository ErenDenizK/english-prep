# Progression: does anything in this app have to come first?

Written 2026-09-05, against `6490c83` (v0.36), 10 topics, 60 lessons, 241
questions. **This document changes no code and no content.** It is a
measurement of the corpus and a costed answer to two claims the owner
made about it.

The claims, in his words:

> *"Tüm dersler temelden başlar ve eşit zorlukta eğitimler aslında, ama
> ilerleyen noktalarda sorular veya dersler birleşir ya da soru tipleri
> 'oyun modları' değişir — zorlaşma böyle olur. Ama bunu araştırmaya tabi
> tut: her ders ayrı bir makale, sınırlama yok mantığı güzel; eğer
> eğitimsel olarak bir sıra güdülmesi gerekmiyorsa iyi, ama bir dersi
> anlamak için bir öncekini anlamak gerekli ise o zaman konu karışır."*

**A.** The app's premise — `js/tiers.js` says the tiers are *"purely a
display grouping … not a required content-authoring order"*, the reader
locks nothing, every lesson is written as a self-contained page. Nobody
has ever checked that against the corpus.

**B.** His proposal for where difficulty should come from instead:
everything starts from the ground, and difficulty arrives later through
**combination** and through **format change** — *oyun modları*.

They are separable and they get separate answers.

---

## The short version

**A is true, and it is true in a way that is more interesting than "no
dependencies".** There is no chain. Across 60 lessons I found **six**
content edges and **two** notation edges, and the six content edges are
already neutralised — by *duplication*, not by independence. Five of the
six live in one topic. Of 241 questions, **119 of the 217 cloze items
carry no verb morphology at all** in their option sets: they are word
choices, and a word choice cannot presuppose a form the learner has not
met. The word-choice half of this app — `connectors`, `quantifiers`, 20
of 24 `relative-clauses` items, both vocabulary topics: five topics, 30
lessons, 114 of those 119 questions — has **zero** prerequisites, in either direction,
by any measure I could construct.

The two notation edges are real, small, and worth fixing this week.
**`V3` is used 176 times across 17 lessons in 7 topics and is defined
inside only 3 of them.** `V2` is used in 5 lessons across 3 topics and is
**never defined anywhere in the corpus**. In `tenses` — the `foundations`
tier, the topic a learner is most likely to open first — `V3` appears in
four lessons and the only gloss of it in the whole topic is inside an
`optionNotes` entry that shows up if and only if the learner picks one
particular wrong option on one particular question. This is the one
place where the app is quietly lying, and it is a vocabulary problem, not
a curriculum problem.

**B is already half-built, and the honest move is to recognise it rather
than invent a mechanism.** Nine of the sixty categories name an
intersection outright (`Modal Perfects in Passive`, `Preposition +
Relative Pronoun`, `Quantifier + Relative Pronoun`, …), all nine sit in
three topics, and **10 of `passive-voice`'s 24 items hold the passive
constant across all four options** and discriminate purely on a tense or a
modal the topic does not own. Combination needs no new block type, no new
question type and no code. It needs a name and an authoring rule.

**Format change is the exam's own sections, and calling them "coverage"
has undersold them.** `closest-meaning` already is one — a `type` field, a
different task, six categories, no new screens. The three that remain
(the ten-blank cloze *passage*, paragraph completion, reading) are on
`docs/roadmap.md` already. What this document adds is the argument that
they are simultaneously the difficulty mechanism he is asking for, which
is a second reason to build them and no reason to build anything else.

**Adaptivity is a third mechanism and it is worse than his two**, for
arithmetic rather than principle: with four items per category, an
adaptive draw is the same four items in a different order.

**The smallest honest change is content-only and takes three to four
hours**: define `V3` and `V2` where they are used, and make each topic's
`intro.lessons` sentence say the true thing about its own order. Four
topics already do exactly this. The mechanism exists, it is on the
mandatory path, and six topics have not used it.

---

## 1 · Claim A, measured

### 1.1 What I measured, and how

Everything below is computed over `data/manifest.json` and the ten topic
files. Four passes:

1. **Category names**, read for intersections — a category whose name
   fuses two grammatical objects.
2. **Lesson metalanguage.** For each of the 60 lessons, the fields where a
   grammatical *term* is used as a term (`summary`, `text.body`,
   `contrast.label` and `.gloss`, `forms.form`/`.use`/`.pattern`,
   `examples.note`, `pitfall.why`, `decision.condition`/`.then`, every
   `heading`) — deliberately excluding English example sentences, where
   `will` and `object` are words rather than terms. Then: which terms
   appear, and where each is *glossed* versus merely *used*.
3. **Question option sets.** For each of the 217 cloze items, the
   dimensions on which the four options actually differ — modal identity,
   perfect `have`, `be`/aspect, `-ing`, `to`-infinitive, or nothing at
   all. This is the operational test for "what does this item make you
   choose between", and it is the one that does not depend on my reading
   of the paragraph.
4. **Cross-lesson duplication.** Shared `decision.signals` sets and shared
   `contrast.label` / `forms.form` names between lessons in *different*
   topics.

The whole corpus, for scale: 241 questions (217 cloze, 24 restatement),
60 lessons, 60 categories, and 654 blocks — 172 `pitfall`, 120 `check`,
94 `text`, 85 `contrast`, 63 `decision`, 60 `forms`, 60 `examples`.

### 1.2 The corpus is two corpora, and only one of them can have edges

The option-set pass splits the app cleanly in half, and the split is not
one anybody designed:

| | Items | What the four options are |
| --- | --- | --- |
| **Word choice** | **119 of 217** | four different words; no verb morphology varies at all |
| **Form choice** | 98 of 217 | four forms of one verb: a modal, a perfect, a `be`, an `-ing`, a `to` |

The word-choice half is `connectors` (22 of 24), `quantifiers` (24 of 24),
`relative-clauses` (20 of 24), `academic-nouns-adjectives` (24),
`academic-verbs` (24), plus three `tenses` signal-word items and two
`passive-voice` items. **A word choice cannot have a prerequisite of the
kind the owner is worried about.** Choosing `Nevertheless` over `On the
other hand` does not require having read any other lesson; it requires
reading the paragraph. Five whole topics, half the app's lessons and
nearly half its questions are outside the question entirely.

Everything that follows is about the other 98 items and the 30 lessons
around them.

### 1.3 Nine categories are already intersections, and they are in three topics

The owner's *"birleşir"* intuition is in the content, unrecognised. Nine
of sixty category names fuse two grammatical objects:

| Category | = |
| --- | --- |
| `passive-voice` · Tense Forms in Passive | passive × the six tense contrasts |
| `passive-voice` · Passive with Modals | passive × deontic modals |
| `passive-voice` · Modal Perfects in Passive | passive × epistemic modals × perfect |
| `passive-voice` · Passive Reporting Structures | passive × reporting × infinitive |
| `passive-voice` · Causative: Have/Get Something Done | passive × causative × tense |
| `relative-clauses` · Preposition + Relative Pronoun | relative × preposition |
| `relative-clauses` · Quantifier + Relative Pronoun | relative × quantifier |
| `relative-clauses` · Reduced Relative Clauses: -ing vs -ed | relative × participle |
| `gerunds-infinitives` · Adjective + Infinitive vs Preposition + Gerund | verb pattern × preposition |

Five more are intersections in substance without saying so in the name:
`gerunds-infinitives` · Causative Verb Patterns, `closest-meaning` ·
Passive Reporting, `modals` · Modal Perfects, `quantifiers` · Most vs
Most Of vs The Most, and `tenses` · Time Expressions & Signal Words —
which `learner-model.md` §4.3 already flagged as *"not a peer of the
others at all … a cross-cutting cue that appears inside every tense
category"*, and it is right.

**All nine named intersections live in three topics. The other seven
contain none.** That is not a ladder; it is a cluster.

The item-level version is sharper. In `passive-voice`, **10 of 24 items
carry `be`/`been` in all four options** — the voice is held constant and
the only thing that varies is something the topic does not teach:

```
passive-voice-t1   is baked / was baked / has been baked / is being baked
                   → the choice is a tense, run through the passive
passive-voice-t9   must have been / can't have been / should have been / must be
                   → the choice is an epistemic modal, run through the passive
```

Four items in `Tense Forms in Passive`, four in `Modal Perfects in
Passive`, two in `Passive with Modals`. Two more in `Causative` (`had
had / had / have had / did have`) are pure tense discriminations wearing a
causative paragraph. **These are exactly the combined items the owner is
describing, and 14 of them already ship.**

### 1.4 The lessons stay self-contained by duplicating, not by being independent

This is the finding that decides the shape of the answer, and it is the
one I did not expect.

`passive-voice/Tense Forms in Passive` does not assume the tense
contrasts. It **re-teaches them**: its `forms` block lists all six tenses
with Turkish `use` glosses, and its `decision` block reproduces a full
tense signal-word procedure. Measured: it shares **six** signal words with
`tenses/Present Simple vs Present Continuous` (`always`, `at the moment`,
`currently`, `every morning`, `now`, `usually`) and **three** with
`tenses/Present Perfect vs Past Simple` (`already`, `recently`, `so far`),
and five of the form names in its `forms` block appear verbatim as
`contrast` side labels in three `tenses` lessons (`Present Simple`,
`Present Continuous`, `Past Simple`, `Past Continuous`, `Past Perfect`).

`passive-voice/Modal Perfects in Passive` does the same for the modals:
its `forms` block re-lists `must / may / might / could / can't / should
have been` with a Turkish gloss for each, and its `decision` block is a
complete epistemic-strength procedure. So does
`relative-clauses/Quantifier + Relative Pronoun`, whose `decision` block
restates the `neither` = exactly two, `none` = more than two rule from
`quantifiers/Either vs Neither vs Nor` — which is the only rule that kills
the distractor in `relative-clauses-t23`.

**So the promise is kept, and the mechanism is redundancy.** That is worth
naming for two reasons.

First, it means the honest answer to *"bir dersi anlamak için bir
öncekini anlamak gerekli mi?"* is **no, because the author wrote the
previous lesson again** — not because the material is independent. The
app is not lying to the learner. It is paying for the truth in duplicated
content.

Second, duplicated content drifts, and this project has already written
that down. `docs/CONTENT_GUIDE.md` refuses a decision procedure in a topic
`intro` on exactly this ground: *"That is the `decision` block, and a
duplicated procedure drifts."* There are now two whole procedures
duplicated across topic boundaries, where nothing checks them against each
other:

- **`have/get + object + V3`** is taught in full, with its own `contrast`,
  `forms` and `decision` blocks, in **both** `passive-voice/Causative` and
  `gerunds-infinitives/Causative Verb Patterns`.
- **`It is said that …` / `S is said to …`** is taught in full, with its
  own `contrast`, `forms` and `decision` blocks, in **both**
  `passive-voice/Passive Reporting Structures` and
  `closest-meaning/Passive Reporting`.

Neither is a prerequisite. Both are maintenance debt, and neither is
visible to `npm run check`.

### 1.5 The edges, named individually

Six content edges, two notation edges. This is the whole graph.

**Content edges — all six are already mitigated inside the importing
lesson.**

| | Importing lesson | Imports | Evidence | State |
| --- | --- | --- | --- | --- |
| E1 | `passive-voice` · Tense Forms in Passive | the six tense contrasts from `tenses` | 4/4 items hold voice constant; 9 shared signal words; 5 shared form labels | re-taught in full |
| E2 | `passive-voice` · Passive with Modals | deontic `must` / `have to` / `can` from `modals` L1–L2 | 2/4 items hold voice constant; shares `must` and `have to` labels with `modals` L1 | re-taught |
| E3 | `passive-voice` · Modal Perfects in Passive | the epistemic scale from `modals` L3, the form from `modals` L4 | 4/4 items hold voice constant and vary only the modal | re-taught in full |
| E4 | `passive-voice` · Causative | tense, from `tenses` | `t13`, `t16` discriminate on `had` / `has had` / `had had` / `will have` | re-taught (`forms` block is a tense table) |
| E5 | `relative-clauses` · Quantifier + Relative Pronoun | `neither` vs `none` from `quantifiers` L5 | it is the only rule that eliminates the distractor in `t23` | restated in its `decision` block |
| E6 | `relative-clauses` · Reduced Relative Clauses | the `-ing` / V3 participle contrast, which `passive-voice` owns | 15 uses of `V3` in one lesson | glossed only as `V3 (-ed)` — see below |

**Notation edges — these are the two that are not mitigated.**

| | Term | Used | Defined |
| --- | --- | --- | --- |
| E7 | **`V3`** | **176 times, in 17 lessons, across 7 topics** | inside **3** lessons — `passive-voice`/Tense Forms (a `text` and a `pitfall`), `modals`/Modal Perfects (a `pitfall`), `gerunds-infinitives`/Causative (a `contrast`) — plus one `intro.parts` entry in `passive-voice` |
| E8 | **`V2`** | 6 times, in 5 lessons, across 3 topics | **nowhere in the corpus** |

Four topics — `tenses`, `closest-meaning`, `connectors`,
`relative-clauses` — use `V3` and never define it in a lesson or in their
`intro`. The worst instance is the one at the bottom of the tier ladder:
**`tenses` uses `V3` in four of its six lessons** (`S + have/has + V3`,
`S + had + V3`, `have/has + already + V3`, …) and the only gloss of it
anywhere in that topic sits in the `optionNotes` value for the
option `"go"` on `tenses-t20` — *"'have' ile kurulan Perfect yapı fiilin
üçüncü hâlini (V3) ister"* — which the app shows if and only if the learner picks
that specific wrong option on that specific question.

Two things make this smaller than it looks and one makes it worse.

Smaller: it is a **notation** dependency, not a conceptual one. A B2
learner knows *gone* and *written*; what they may not know is that this
app writes them `V3`. And `forms.pattern` is set in the serif and read as
a formula, so an unglossed `V3` in a pattern row is a symbol in an
equation whose key is on another page. That is a real cost and a cheap
fix.

Worse: `relative-clauses/Reduced Relative Clauses` does gloss it, and
glosses it **wrong** — `V3 (-ed)` — which is precisely the equation
`passive-voice/Tense Forms in Passive` writes a `pitfall` block to break
(*"wrote değil written. Düzensiz fiillerde üçüncü sütunu ezbere bilmek
gerekir"*). One lesson's shorthand contradicts another lesson's warning,
and no tool can see it.

`öncül` (antecedent) is the counter-example and the model: used in 5
lessons, glossed in all 5, because `relative-clauses`'s `intro.parts`
carries *"Öncül — tarif edilen isim | the map"* and every lesson that uses
it sits under that intro. That is exactly the fix E7 and E8 need.

### 1.6 The app already declares its own order — in prose, on the mandatory path

This is the part nobody has noticed. Every topic's `intro.lessons` field
is one or two Turkish sentences about how its six lessons relate, and
`js/education.js:929` renders it under **"Bu konudaki dersler"** on
`#egitim/konu/<id>`. Since v0.35 the Eğitim index's topic rows route
*straight* to that screen (`renderTopicGroup` → `openIntroByHash`), so it
is not an optional detour any more: it is the only door between the index
and a lesson.

Read together, the ten sentences do not agree with each other, and four of
them state a prerequisite outright:

| Topic | What `intro.lessons` says |
| --- | --- |
| `modals` | **"İlk ders diğerlerinin varsaydığı temeldir."** |
| `quantifiers` | **"İlk iki ders diğerlerinin varsaydığı temeldir."** |
| `relative-clauses` | **"İlk ikisi diğer dördünün varsaydığı temeldir, o yüzden sırayla okumak işine yarar."** |
| `passive-voice` | "İlk üç ders zamanı taşımanın üç katmanıdır" — a layering claim |
| `gerunds-infinitives` | "İlk ders listeyi kurar, ikincisi anlamı değiştiren çiftleri alır" — implies, does not say |
| `tenses` | "Son ders … bağımsızdır ve önce de okunabilir" — denies, for one lesson |
| `closest-meaning` | **"Aralarında sıra yoktur; her biri kendi başına çalışılabilir."** |
| `academic-nouns-adjectives` | **"Aralarında sıra yok; biri ötekinin önkoşulu değil"** |
| `academic-verbs` | **"Aralarında sıra yok; biri ötekinin önkoşulu değil."** |
| `connectors` | says nothing about order |

**Four topics declare an internal order, four deny one, two are silent.**
I checked the four denials against the corpus and all four are true:
`closest-meaning`'s six categories share no forms and no signal words,
and the two vocabulary topics are 48 items of pure lexical choice with no
verb morphology anywhere. I checked the four declarations and all four are
true as well.

So the app's position on ordering is not *"there is no order"*. It is
*"there is an order in four topics and we say so in a sentence, and we
built nothing on it"*. That is a much better starting point than a blank
sheet, and it means the smallest honest change is an edit to six
sentences, not a schema.

### 1.7 The tiers predict almost nothing

Four of the five tiers are populated — `foundations` (1 topic),
`core-grammar` (4), `compound-structures` (3), `vocabulary` (2),
`advanced` (0) — and `vocabulary` is a content-kind label, not a rung.
Against the eight edges above:

- **3 edges run with the tier order.** `tenses` (foundations) → `passive-voice`
  (core); `quantifiers` (core) → `relative-clauses` (compound);
  `passive-voice` (core) → `relative-clauses` (compound).
- **3 are invisible**, because both ends sit in the same tier:
  `modals` → `passive-voice` (both core), and the two mutual duplications
  `passive-voice` ↔ `gerunds-infinitives` (both core) and
  `passive-voice` ↔ `closest-meaning`.
- **1 runs backwards across a tier boundary.** The only definition of
  `V3` a learner can reach on the mandatory path is in `passive-voice`'s
  `intro.parts` — `core-grammar` — and `tenses`, in `foundations`, needs
  it.

`connectors` is instructive: it imports nothing, exports nothing, and is
filed in `compound-structures`, one rung above `quantifiers`, which does
export. The tier is a statement about how compound the *grammar* is, and
compound grammar is not the same thing as dependent material.

This sharpens, rather than reverses, the note already parked in
`docs/research/visual-longevity.md` §5.3: the tier labels make a
difficulty claim the app refuses to make. They also make a *dependency*
claim, and the corpus supports it in three cases out of eight. One of the
three facts in that parked note is now stale, and should be corrected
before the tier-hue lever is reopened: since v0.35 **both** tabs group by
tier (`js/home.js:381`, `js/education.js:787`), so the "one of the two
main screens does not draw it" objection no longer holds. The other two
stand.

### 1.8 Verdict on A

**The premise is true. It is not true by construction, and it is not true
everywhere.**

- No chain exists. Nothing in this corpus is more than one edge deep, and
  no lesson is unreachable without another.
- Half the app — the 119 word-choice items across five topics — is
  outside the question entirely.
- Six content edges exist, all six inside three topics, and all six are
  already neutralised by the importing lesson re-teaching what it imports.
  The cost of that is two fully duplicated procedures across topic
  boundaries and nothing checking them.
- Two notation edges are **not** neutralised, and one of them points from
  the top of the ladder back down to its bottom.
- Four of ten topics already declare an internal order in prose, on a
  screen every learner now passes through, and nothing reads it.

The graph is a shallow forest with eight edges, not a curriculum. So the
right instrument is a **note**, exactly as the owner's own instinct
suggested — not a sequence, not a gate, and not a `requires` array with a
resolver behind it.

---

## 2 · The tension I was asked not to dodge

The mixed test is argued from **interleaving**, and the argument is in
`js/home.js:172-177` in the learner's own copy: *"Sorular tüm konulardan
karışık gelir, yani hangi kuralın gerektiğini de kendin bulursun."*
Behind it is Rohrer, Dedrick & Stershic's classroom RCT and Brunmair &
Richter's *g* = 0.42, with the moderator that matters here — interleaving
pays most when the categories are *similar and confusable*, which is a
description of this taxonomy. A prerequisite order pushes the other way,
toward blocking.

**They coexist because they act on different objects, and neither has to
lose.**

Interleaving is a property of the **draw** — the order items arrive in
during a practice session, which is the Test tab. Prerequisite structure
is a property of the **first encounter** — the order material is taught,
which is the Eğitim tab. They only collide if prerequisites are turned
into a draw filter, and nothing in this document proposes that. The
measurement in `what-else.md` §3 is the reason to leave the draw alone: at
0.12 adjacent same-category items per test, with 89% of tests containing
none, the draw is already close to maximally interleaved, and
`quality-of-life.md` §6 names touching `orderForPractice` as the most
dangerous available change. Nothing here touches it.

The deeper reconciliation is Bjork's own distinction, and it is the spine
of the answer.

**A desirable difficulty is one the learner can overcome.** Spacing,
testing, interleaving, generation — conditions that depress performance
during practice and raise it at delay. A difficulty a learner *cannot*
overcome because they lack the prerequisite is not a weaker version of the
same thing; it is a different thing, and the literature calls it
undesirable — the learner produces no retrieval, only a misconception.
(This paragraph rests on a search summary, not on a read source — see §10.)

Applied here, the distinction sorts the corpus cleanly:

- **A learner who does not know what `V3` means is facing an undesirable
  difficulty.** They cannot reason about `S + have/has + V3`; they can
  only guess. This is E7 and E8, and it is why they are the only two
  findings I would fix this week.
- **A learner meeting `Modal Perfects in Passive` without having read
  `Modal Perfects` is facing a desirable one** — provided the lesson
  re-teaches the modal scale, which it does. They have to derive the modal
  from the paragraph instead of recalling it from three days ago, and that
  is more retrieval, not less.

So the owner's *"combination"* difficulty is the first kind and the app
should want more of it. His worry — *"bir dersi anlamak için bir öncekini
anlamak gerekli ise o zaman konu karışır"* — is the second kind, and it
turns out to be two notational terms rather than a curriculum.

One caveat on the interleaving side, because the same distinction cuts
both ways. The nearest studies to this app suggest interleaving's benefit
depends on the learner already having *some* purchase on each category;
Pan et al. (2019) on Spanish preterite/imperfect found no benefit within a
session or at two days and a substantial one at a week, and the
expertise/prior-knowledge moderator is live in this literature. That is an
argument for the mixed test's *copy* — which already tells the learner
that a low score on day two describes the draw and not them — and not for
gating it. (Also a search summary; §10.)

---

## 3 · Claim B, part one: combination

### 3.1 It needs nothing from the schema

The question the brief asks — *does a combined item need a new block type,
a new question type, or only new content in the existing shapes?* — has a
measured answer: **only new content, and 14 of them already ship.**

A combined item, in this app, is a cloze question whose four options hold
the category's own axis constant and vary an axis another category owns.
`passive-voice-t9` is one. `relative-clauses-t23` is one. Neither needed a
schema change, because the schema already says *"options — exactly 4
strings … usually different forms of the same verb"* and says nothing
about how many dimensions may separate them.

A combined *lesson* likewise: `Modal Perfects in Passive` is six blocks of
ordinary `contrast`, `forms`, `pitfall` and `decision`, and its subject is
the intersection of two other lessons. No eighth block type. The
`CONTENT_GUIDE` is right that there should not be one.

**So the honest move is to recognise what exists rather than to invent a
mechanism.** Concretely, three things, in increasing cost:

**(a) Say it in the two places that already render prose.** `passive-voice`'s
`intro.lessons` currently says *"İlk üç ders zamanı taşımanın üç
katmanıdır"* — which is true about the topic's internal shape and silent
about the fact that all three import from `tenses` and `modals`. One
sentence there, and one in `relative-clauses`, names five of the six
content edges. **Content only, no code, ~1 hour**, and the field is
already on the mandatory path.

**(b) Write the rule down for the next author.** `docs/agents/category-spec.md`
exists because *"every finding worth acting on in the first review was
invisible inside one item and obvious across four"*, and the same is true
here: a combination is invisible inside one item and obvious across a
category. The rule to add to `docs/agents/question-author.md` is one
paragraph: *when a category's name fuses two things, at least one of its
four items should hold this category's own axis constant and make the
learner supply the imported one — and the lesson must re-teach the
imported axis in its own `forms` or `decision` block.* That is a
description of what the best existing content already does, promoted to a
rule. **~1 hour, no code, ships nothing today, shapes the eleventh topic.**

**(c) An `assumes` field.** A per-lesson `assumes: ["Modal Perfects",
"Tense Forms in Passive"]`, copied into the manifest by
`tools/format-content.mjs` the way `lessons` already is, validated for
category existence, rendered as one line at the top of the reader with a
link, gating nothing. This is `learning-design.md` §4's proposal and
`learner-model.md` §4.3's, and `v1-plan.md:438` records it as the owner's
call. **My recommendation is: not yet.** Cost is schema + validator +
formatter + renderer + a `verify-ui.mjs` case ≈ **6–8 hours**, and it
buys, for six edges, what (a) buys for the same six in one hour. If (a)
ships and the sentences turn out to be doing real work, (c) is the
mechanised version of a thing already known to work. If (a) ships and
nobody notices, (c) would not have been noticed either.

`docs/research/orientation.md` §7.4 reached the same conclusion from the
other direction — *"the prerequisite information should live there in
prose rather than as a separate field, and the field should not be built
twice"* — and it was written before the index started routing through
that screen, which only strengthens it.

### 3.2 Where combination has room to grow

Two categories out of sixty are the *reason* combination looks like a
difficulty knob rather than an accident, and they are the two the roadmap
already wants:

- **`so / such`** (roadmap item 6, half a day) is a natural combination
  target: `so … that` already lives in `closest-meaning/Too vs Enough vs
  So...That`, and the cloze blank 7 the paper actually tests is
  `so smooth` vs `such a smooth`. Authoring it as a combination of an
  existing category rather than a new island is free.
- **Paragraph completion** (roadmap item 7) is combination by
  construction: its distractors are on-topic and grammatical and fail on
  coherence, which means the learner has to use everything at once.

Beyond those, the ceiling on combination is the same ceiling everything
else in this app hits: **four items per category.** A category that spends
one of its four on a combined item has three left for the thing it
teaches. `docs/roadmap.md` item 8 (four items to six where a category is
weak-flagged most often) is the unlock, and it is already on the list.

---

## 4 · Claim B, part two: format change, and what "oyun modu" means here

### 4.1 The app already shipped one, and it is the cost model

`closest-meaning` is not a grammar topic. It is a **format**: 24 items
with `type: "restatement"`, `sentence` instead of `paragraph`, four
complete sentences instead of four forms of a verb, six categories that
name what each item *turns on*. It shipped as a topic, on the existing
screens, with **two schema fields** and no new engine work.

That is the precedent and it should be the template. It also means the
answer to *"can format change be content rather than code?"* is: it was,
once, and it worked.

### 4.2 The formats he wants are the paper's own sections

`docs/exam-spec.md` describes four Session I tasks. The app renders three
of them as the same one-blank-one-paragraph card, and the roadmap lists
the gap as *coverage*. It is also, exactly, the *oyun modu* mechanism —
and framing it only as coverage has undersold it.

| Format | What it is | Content or code? | Cost | Verdict |
| --- | --- | --- | --- | --- |
| **Restatement** | one sentence, four paraphrases | content + 2 schema fields | **shipped** | the precedent |
| **The cloze *passage*** | one ~450-word text, ten numbered blanks, options printed together | **code**: a passage type owning an ordered list of blanks, plus a reader that fits a 450-word text and a blank in a fixed-height 320px shell | ~2 days code + schema, then 4–6 h per passage | **format rehearsal, and the most valuable of the three.** The paper's unit is the passage; the app's is the card, and `exam-spec.md` §4 says so outright. Deferred in `practice-modes.md` §10 behind the mock exam — the point here is that it is worth building for format rehearsal alone, before any timing |
| **Paragraph completion** | ~120 words, one sentence removed, four candidates; the gap is not always in the middle | schema + content | ~1 day schema, ~2 h per item (roadmap item 7) | **format rehearsal.** 9 points, no coverage, already ranked |
| **Reading** | two 700-word texts, seven items each, paragraphs numbered | schema + content | 2.5–3.5 h review per passage, single-use | **out of v1**, and correctly so |

**None of these is a new idea and I am not proposing one.** What I am
adding is the argument that they answer the owner's question as well as
the coverage question: a learner who has met a category as a single-blank
card, then again as one of ten blanks in a continuous text, then again as
a sentence to restate, has met it three times under three demands. That is
transfer-appropriate variation, it costs no new grammar, and it is what
his "oyun modları" actually names.

The ordering follows from that: **paragraph completion before the cloze
passage**, because it is a day of schema against two days of code and it
closes a scored section the app has zero of, and because the fixed-height
shell is a genuine engineering constraint on the passage that has not been
measured yet (`reading.md` measured a 770-word passage at 7.7 screens and
refused a split view on that basis; a 450-word cloze is smaller but the
same problem).

### 4.3 The formats that are novelty, not rehearsal

Named so they are not re-proposed, and all already settled elsewhere:

- **Typed answers.** Refused in `what-else.md` §3 on two grounds — the
  paper is four-option multiple choice throughout, and an answer
  normaliser marks correct learners wrong. Upheld.
- **Matching / drag-to-pair.** `practice-modes.md` §2.1: there is nothing
  to match in a paragraph cloze, and it is a dragging interaction WCAG
  2.5.7 requires an alternative for. Upheld.
- **`Neden yanlış?` elimination**, **`Emin misin?` confidence**.
  Deferred in `practice-modes.md` §10 against content cost, not refused.
  Both are real retrieval-mode changes; neither is format rehearsal, and
  the paper does not do them. Leave deferred.
- **Timed anything.** Refused repeatedly, most recently
  `quality-of-life.md` §6. Not reopened.

The line I would draw, and it is the same line `practice-modes.md` §3
draws for motivation: **a format earns its place if the paper does it.**
Everything else is a retrieval-mode argument that has to win on
learning-outcome evidence, and none of the remaining candidates has it.

---

## 5 · The mechanism he did not raise: difficulty from the engine

`orderForPractice` already tiers a pool: never answered, then last answer
wrong, then least recently seen, shuffled within tiers. Is adaptivity a
third mechanism?

**It is a mechanism, and it is worse than his two, for arithmetic.**

With four items per category, "adaptive difficulty" has nothing to select
from. To make an item harder or easier the engine needs items of differing
difficulty *within* a category, and there are four, all written to one
spec, with no per-item difficulty signal — and none can be estimated,
because the app has no analytics and six users. `docs/roadmap.md` puts
adaptive difficulty and item scheduling behind **15–20 items per
category** against 4 today, `what-else.md` §3 upholds it, and
`quality-of-life.md` §6 names a change to `orderForPractice` as the single
most dangerous edit available. I agree with all three and add nothing.

There is one engine-side move that is *not* adaptive difficulty and that
this document's measurement would enable, and it is worth naming so it can
be judged on its own:

> **Route a wrong answer along an edge.** *"Modal Perfects in Passive'de
> zorlanıyorsun. Önce Modal Perfects'e bak."*

`learner-model.md` §4.3 argues for it and its argument is good: the claim
is **authored**, so it is correct on day one with zero learner data, which
is exactly what a six-item corpus cannot produce statistically. But it
needs the edges as machine-readable data — option (c) in §3.1, 6–8 hours —
and it competes with a results screen that already links each weak
category to its own lesson (`js/results.js:97-114`). The gain is
redirecting a learner from the lesson they failed to the lesson under it,
for **six** edges, five of which are in one topic. **I would not build it
now**, and I would revisit it if and only if §3.1(a) ships and the prose
version proves it is a thing learners act on.

---

## 6 · Ranked and costed

Content work and code work separated, because the brief asks and because
they queue differently — content goes through the review pipeline,
code goes through `npm run verify`.

| # | Work | Kind | Cost | Answers |
| --- | --- | --- | --- | --- |
| 1 | **Define `V3` and `V2` where they are used.** An `intro.parts` entry for `tenses`, `closest-meaning`, `connectors` and `relative-clauses`, the way `passive-voice` already carries *"V3 — ana fiilin üçüncü hâli, hiç değişmez"* and `relative-clauses` already carries *"Öncül — tarif edilen isim"*. And fix `relative-clauses`'s `V3 (-ed)`, which contradicts `passive-voice`'s own `pitfall`. | content | **~1–2 h** | A (E7, E8) |
| 2 | **Make six `intro.lessons` sentences say the true thing.** `passive-voice` and `relative-clauses` name what they import; `connectors` and `gerunds-infinitives` say whether their six have an order; `tenses` and the rest are already right. Four topics already do this and it renders today. | content | **~1–2 h** | A (E1–E6), B(i) |
| 3 | **Write the combination rule into `docs/agents/question-author.md` and `category-spec.md`.** One paragraph promoting what `passive-voice` already does into an instruction. | content/docs | **~1 h** | B(i) |
| 4 | **`so / such` as a combination**, folded into `closest-meaning` beside `Too vs Enough vs So...That` rather than made an island. | content | **~0.5 day** (already roadmap item 6) | B(i), coverage |
| 5 | **Paragraph completion**: schema, category spec, then items. | code + content | **~1 day schema, ~2 h/item** (already roadmap item 7) | B(ii), coverage |
| 6 | **The cloze passage**: a passage type owning ordered blanks, and a reader for it at 320px. | code + content | **~2 days + 4–6 h/passage** | B(ii) — the strongest format rehearsal available |
| 7 | *Not now:* an `assumes` field, rendered, gating nothing. | code + content | ~6–8 h | A, and §5's routing |
| 8 | *Not now:* engine-side adaptivity. | code | — | blocked at 15–20 items/category |

Items 1–3 are **four hours of content work, no code, no sweep**, and they
are the entire honest answer to claim A.

---

## 7 · What changes, for the learner and for the author

**For the learner, items 1–3 change almost nothing visible, and that is
the point.** One more entry in a topic's parts list; one sharper sentence
under "Bu konudaki dersler". No lock, no badge, no new screen, no arrival
taxed. What changes is that a learner who opens `tenses` first — the most
likely first action in the app — meets `S + have/has + V3` with the key to
the notation on the same screen instead of two topics away.

**For the author, they change more, and this is the half that decays if it
is only in a document.** A prerequisite the schema does not express is a
rule the next authoring session breaks, and this repository has already
proved that twice — the `check`-block giveaway (49 of 72 questions, caught
only by a reviewer, now a validator ratchet) and the five `decision`
blocks that hand a learner a distractor. Neither was visible to
`npm run check`.

So the honest accounting of items 1–3 is:

- Item 1 (`V3`, `V2`) is **durable without tooling**, because the fix is a
  gloss in `intro.parts` and a new topic that omits it produces a
  paragraph a reviewer reads. It could also be ratcheted: a corpus check
  in `tools/content-checks.mjs` that warns when a lesson uses `V3` or `V2`
  and neither it nor its topic `intro` glosses the term is about **20
  lines** and follows the pattern of the four checks already there. That
  is the version I would write, because it is the only way the fix
  survives the eleventh topic.
- Item 2 (`intro.lessons`) is **not durable without tooling**, and cannot
  be made so cheaply — no validator can tell whether a Turkish sentence
  correctly describes a dependency. This is the argument *for* the
  `assumes` field, and it is the only argument for it I find strong. It is
  not strong enough for six edges today.
- Item 3 (the authoring rule) is durable in exactly the way
  `docs/agents/` is durable: it works if the supervisor pastes the brief,
  and not otherwise.

---

## 8 · What I would refuse

**Locked paths and forced sequences.** A lesson that will not open until
another is read. Refused on three separate grounds, any one of which is
sufficient. (1) The graph does not justify it: eight edges over sixty
lessons, six of them already neutralised inside the importing lesson, and
five of the six in one topic. (2) Learner control over *sequence* has been
measured and it is not the instructional variable: Karich, Burns & Maki
pooled the educational-technology literature at *g* = 0.05 — near zero,
near zero across moderators — which cuts both ways. Free choice buys
little learning; taking it away buys little either, and it costs the
learner opening the app at all. `learning-design.md` §4 already landed on
**"a strong default and no lock"** and I am not reversing it. (3) It
contradicts a settled product position: *"lesson checks never gate
progress — an unanswered one reads 'Atla'"* (CLAUDE.md). A gate on a
lesson is the same decision one level up.

**Level gates and unlock mechanics.** *"Finish Tenses to unlock Passive
Voice."* Refused, and not primarily on the graph. An unlock is a
**completion-contingent reward**, which is the exact contingency
`practice-modes.md` §4.1 and `visual-longevity.md` §6 both cite Deci,
Koestner & Ryan on at *d* ≈ −0.36, and `visual-longevity.md` §6 refuses
the whole family — including cosmetic unlocks — in those words. It would
also be a claim about the learner ("you are not ready for this") made by
an app that knows only what happened in one browser, which the project has
been careful never to make. And it is dishonest about the corpus: 119 of
217 items have no prerequisite of any kind, so most of what a gate locked
would be locked for nothing.

**A progress bar, a percentage complete, or a "curriculum" framing.** The
owner has never asked for gamification, and `roadmap.md`'s v1 refusals
already exclude *"no number that goes up"*. A curriculum framing implies a
completion state; the app's honest position is that a lesson is read or
not read, and `getTopicAccuracy` is a measurement rather than a score. The
test `visual-longevity.md` §6 states applies here unchanged: **can the
artefact fall?** A read-count cannot, so it is a drawing of what happened.
A "level" can, and it would be a claim.

**A `requires` array shipped before the prose version is tried.** Not a
refusal of the idea — `learning-design.md`, `learner-model.md` and
`v1-plan.md:438` all want it and it is on the owner's list. A refusal of
building 6–8 hours of schema, validator, formatter, renderer and sweep for
six edges, when four topics already carry the same information in a field
that renders today and nobody has checked whether it does the job.

**A placement or diagnostic test.** Upheld from `learning-design.md` §4
and `roadmap.md`: one item per category is 60 questions, a quarter of the
corpus, burnt before any teaching. The edges are authored knowledge; they
need no diagnosis.

**Reordering the tiers to match the dependency graph.** Tempting after
§1.7 and wrong. The tiers are a display grouping on two tabs, the graph
has eight edges, and moving `passive-voice` above `modals` to encode one
invisible edge would make the labels claim a precision they do not have —
which is the objection `visual-longevity.md` §5.3 already parked the tier
hues on. If the tiers are ever revisited, the question to ask first is
whether four groups (one of them a group of one) are grouping anything.

**Any visual expression of any of this.** The per-tier colour lever is
deferred and the owner's stated reason was risk to the design's
integrity. Nothing above needs a colour, a shape, an icon or a motion.

---

## 9 · What would have to be true for me to be wrong

Per recommendation, and stated so it is checkable rather than rhetorical.

**On item 1 (`V3` / `V2`).** I would be wrong if Turkish prep-school
teaching uses `V1/V2/V3` so universally that every learner arrives knowing
it, in which case 176 unglossed uses cost nothing and the fix is two hours
of noise. **This is settleable in one message to any of the five users**
and I could not settle it from here: it is a fact about Turkish classroom
convention, not about the repository. It is the single cheapest test in
this document. If the answer is "everyone knows V3", item 1 drops to
fixing one contradiction (`V3 (-ed)`) and nothing else.

**On item 2 (`intro.lessons`).** I would be wrong if learners do not read
the intro screen — if they tap the topic row, scroll past `Genel bakış`
and go straight to a lesson row. The screen is on the mandatory path but
its prose is not: the lesson rows sit below it. This is measurable only by
watching someone use it, which the project does by asking, and which
`visual-longevity.md` §7 already recommends for the tier question. If the
prose is not read, item 2 is worthless *and* option (c) — a rendered
`assumes` line at the top of the reader — becomes the only version that
works, which would move it up rather than off the list.

**On §1.4 (duplication, not dependence).** I read the importing lessons
and judged that their re-teaching is *sufficient* — that
`Modal Perfects in Passive`'s `forms` block really does give a learner who
has never opened `modals` what they need. That is a content judgement by a
session that also holds the key, which is the thing
`docs/agents/reviewer.md` exists to distrust. **The honest test is a
sufficiency pass** on those six lessons by a session that has not read
this document, asking one question: *can a learner who has read only this
lesson answer its four questions?* If the answer is no for any of the six,
that edge is real, it is a prerequisite rather than a duplication, and
option (c) gets stronger by one edge.

**On §1.2 (the word-choice half has no dependencies).** I would be wrong
if a dependency exists that has no morphological trace — for instance if
`connectors/Time & Sequence` needs Past Perfect to make sense of
`By then`. It uses `had + V3` in its own prose and glosses neither. This
is the one place my option-set method is blind, and the finding it would
overturn is "five topics have zero edges", not "the graph is shallow".

**On §4 (formats are the paper's sections).** I would be wrong if the
friction on the real cloze is reading speed rather than format — which is
open question 4 in `what-else.md` §5 and still unanswered. If it is
reading speed, the cloze passage buys stamina rather than format
rehearsal, and paragraph completion beats it by more than I said.

**On §5 (adaptivity is worse).** I would be wrong if items per category
reach 15–20, which is roadmap item 8 and explicitly planned. The refusal
is a threshold, not a principle, and both prior arms say so in the same
words.

---

## 10 · What I could not verify

**`WebFetch` is blocked in this environment; `WebSearch` works.** Every
claim below rests on a search-index summary or on memory, not on a source
I read. They are marked because the difference matters and because
`docs/research/README.md` says every file here must mark it.

- **Bjork's desirable/undesirable difficulty distinction** (§2). Read from
  search summaries of secondary sources — the framing that a difficulty
  becomes undesirable when the learner lacks the prerequisite knowledge to
  overcome it appears consistently across them, but I did not read Bjork &
  Bjork (2011) or Bjork (1994). The distinction is doing structural work
  in this document and deserves one confirming read before anything
  expensive is built on it. It is not, however, load-bearing for items
  1–3, which stand on the corpus measurement alone.
- **Karich, Burns & Maki (2014), *g* = 0.05 for learner control** (§8).
  Quoted from `docs/research/learning-design.md:241-247`, which itself
  says its citations rest on search summaries. I did not independently
  verify the effect size.
- **Rohrer/Dedrick/Stershic, Brunmair & Richter, Pan et al. (2019)** (§2).
  All quoted from `learning-design.md` and `practice-modes.md`. Not
  re-verified here; I use them only to state what the app's existing
  argument is, not to add a new claim.
- **Prior-knowledge and expertise-reversal moderators on interleaving**
  (§2, closing caveat). Search summary only, and the literature it
  summarises is mixed. I state it as a caveat and build nothing on it.
- **Gagné's learning hierarchies and the instructional-sequence
  literature.** Searched, and the summaries report mixed results with the
  "strong prerequisite" hypothesis supported mainly for intellectual
  skills, and several studies finding no sequence effect for mature adult
  learners. I did not use it in the argument, because the summaries were
  too thin to lean on and the corpus measurement made it unnecessary. It
  is recorded so the next session does not repeat the search.

**Not verified in the repository, and worth knowing:**

- I did not run `npm run verify` or `npm run check`. This document changes
  nothing, so neither was required, but no claim here has been checked
  against the running app in a browser — only against the data files and
  the source.
- **A documentation drift I noticed and did not fix.** `CLAUDE.md` and
  `docs/CONTENT_GUIDE.md` both describe the topic intro as *"reached from
  a 'Bu konu nedir?' button under the topic's heading on the Eğitim
  index"*. Since v0.35 the index's topic rows route straight to it
  (`js/education.js:835`, `openIntroByHash`) and there is no such button.
  It matters for §1.6 and §3.1(a), whose whole cost argument is that the
  screen is now unavoidable.
- **One stale fact in a parked note.** `visual-longevity.md` §5.3's second
  reason for deferring the tier hues — *"the two tabs disagree about
  whether `tier` is structure at all"* — was true when written and is not
  now: v0.35 grouped the Eğitim index by tier too. The other two reasons
  stand, and one of them is strengthened by §1.7.

---

## 11 · My own view

The brief said: if the corpus has no real prerequisites, say the app
should keep its promise and stop implying an order; if it does, say what
the smallest honest change is. The corpus gave a third answer, so here is
what I actually think.

**The app is not implying an order it cannot support. It is *stating* one,
in four topics, in prose, on a screen every learner now walks through —
and then doing nothing with it.** That is not a lie. It is the most
honest thing in the repository on this subject, and it was written by
authors who could see the dependency from inside the topic. The problem is
not that the app claims too much; it is that four topics say something
true and six say nothing, and no reader could tell which silence means
"there is no order" and which means "nobody wrote a sentence".

So the smallest honest change is **not to build anything**. It is:

1. **Define `V3` and `V2` where they are used** — four `intro.parts`
   entries, one contradiction fixed, and a twenty-line corpus check so it
   survives the eleventh topic. This is the only place I found where a
   learner can genuinely be stuck for a reason the app created, and it is
   two hours.
2. **Make all ten `intro.lessons` sentences answer the same question.**
   Four already do. Two more should say what they import; two should say
   whether they have an internal order; the last two are already right.
   Two hours, and every word of it renders today.
3. **Write the combination rule down** for the next authoring session, so
   that what `passive-voice` did by instinct the eleventh topic does on
   purpose.

That is four hours of content work and no code, and it closes claim A
completely.

On claim B, my view is that the owner has the mechanism right and has
been reading his own roadmap too modestly. **Combination is not something
to add — it is the best thing already in the corpus**, concentrated in
`passive-voice` and `relative-clauses`, unnamed, and produced by authors
who were solving a coverage problem. Naming it costs an hour and makes it
repeatable. **Format change is not something to invent either — it is
paragraph completion and the cloze passage**, both already on the roadmap
as coverage, and the argument of this document is that they are worth more
than their coverage line says, because they are the only difficulty
mechanism available to an app whose categories all sit at the same level
by design and whose engine cannot get harder with four items in the pool.

And the thing I would most want said back to him, because it is his own
question answered rather than deflected: **"her ders ayrı bir makale,
sınırlama yok" is a promise this corpus keeps, and it keeps it by writing
the previous lesson again.** That is fine — it is arguably the right
trade for a phone app read on a bus a week before an exam. But it is not
free, it has produced two whole procedures duplicated across topic
boundaries with nothing checking them against each other, and it is the
reason the answer to *"bir dersi anlamak için bir öncekini anlamak
gerekli mi?"* is **no** rather than **there was never anything to
depend on**.
