# Exam vocabulary — Bilkent and YTÜ, side by side

What the two papers this app now serves actually test lexically, which
words that implies, whether the twelve drafted sets are aimed at them, and
what should change today.

**The short version.** The two exams are not the same paper and they are
not the same size problem. On YTÜ's İYS vocabulary is a handful of points
inside a grammar cloze; on Bilkent's exam — which is no longer called COPE
— **there is a discrete Vocabulary section worth roughly a fifth of the
multiple-choice paper**, and the gateway before it is 200 items of
grammar and vocabulary. So `docs/research/vocabulary.md`'s central
judgement ("vocabulary is not a missing section") is right for the owner
and wrong for his friend.

Three findings change what should be built:

1. **Bilkent publishes its own lexical syllabus, level by level, and the
   upper lists are derivational-family tables with a collocation column.**
   Five word lists, all downloadable, `HEADWORD | VERB | NOUN | ADJECTIVE
   | ADVERB | COLLOCATION`. That is a published, institution-specific
   answer to "which words, in which forms" for exactly the level the exam
   samples — better than AWL, AVL or NGSL/NAWL, which are inputs to it.
2. **The elementary word list already in this repo is almost certainly
   Bilkent's, not YTÜ's** (§2.2). Its group names and their order match
   Bilkent's published `ELEMENTARY-LEVEL-WORDLIST-2023-2024.pdf`. If that
   is right, `docs/exam/wordlists/README.md` is mis-attributed and the
   "0 of 60" check means something slightly different from what it says.
3. **`vocabulary.md` §2.3 refuses word formation and collocation because
   the YTÜ sample papers contain neither.** Bilkent's own published
   vocabulary syllabus is *organised around both*. The refusals were
   correct on the evidence available; they do not survive the second
   paper, and one of them — word formation — is the largest gap between
   the drafts and what Doruk sits.

And the drafts themselves: **ship them, do not replace them.** Five of
the twelve sets contain words I could confirm by name in Bilkent's
published upper-level lists, and the drafted item shape is the same shape
as a real Bilkent PAE vocabulary item.

---

## 0 · What I could actually verify

**Nothing was fetched.** Every direct fetch in this session was refused by
the egress proxy with `host_not_allowed` — `prep.bilkent.edu.tr`,
`ybd.yildiz.edu.tr`, `en.wikipedia.org`, Scribd, Studocu, Course Hero,
every mirror and every text-extraction relay I tried. The proxy status
endpoint records the denials. So:

- **Every external claim below comes from a web-search index summary of a
  page or a PDF, not from the document itself.** Where a number decides
  something I ran a second, differently-worded search and say whether it
  came back the same.
- **I have not seen either exam's paper.** The owner has YTÜ's; nobody
  here has Bilkent's.
- The URLs I cite are real and were returned by the index with matching
  titles and, for the word lists, matching first entries. They are
  fetchable from a normal machine. **That is the single most useful thing
  in this document: the owner can download all of it in ten minutes.**
- Measurements of this repository are exact and were taken by running
  code.

This is the same limitation `docs/research/README.md` records for the
2026-09-03 round. It has not improved.

---

## 1 · What the two exams test lexically

### 1.1 Bilkent's exam is not called COPE any more

It is the **Proficiency in Academic English exam (PAE)**. Multiple prep
sources state the rename in terms — *"the exam used to be called COPE and
is now known as PAE"*
([The English Navigator](https://theenglishnavigator.com/en/pae-2/);
[Bilkent Prep — PAE](http://prep.bilkent.edu.tr/en/pae/)). The friend's
"COPE" and the official "PAE" are the same exam. Everything Bilkent
publishes is under PAE, which is why searching for COPE returns the
Cambridge/Michigan exams of the same acronym instead.

**It targets CEFR B2.** Bilkent's own Pre-Faculty course (PREP 151/155),
the level immediately before the exam, is described as CEFR B2, and PAE
Stage 2 is described as targeting B2 as the minimum for academic study
([PREP 151 Pre-Faculty Course](http://prep.bilkent.edu.tr/en/prep-151-pre-faculty-course/)).

### 1.2 PAE Stage 1 — the gateway is 200 items of grammar and vocabulary

> *"PAE Stage 1 is a multiple choice exam consisting of 200 questions of
> different levels of difficulty. The questions are designed to test a
> student's knowledge of grammar and vocabulary. **Each question has five
> options.**"*
> — search summary of the official
> [PAE Guide](http://prep.bilkent.edu.tr/wp-content/uploads/2026/JANUARY%202026%20PAE%20GUIDE%20ENGLISH.pdf)

Turkish prep sources add that **≈120 correct of 200** takes a candidate
through to Stage 2, and that there is correction for guessing at
**0.25 points per wrong answer**
([INEX / Bilkent Hazırlık](https://www.bilkenthazirlik.com/pae-sinavi/);
[AchieveUni](https://achieveuni.com/bilkent-pae-sinavi/)). The 120 figure
came back in one search only and is a prep school's number, not Bilkent's
— treat the threshold as approximate; the 200 items and the five options
came back in two.

Two things follow immediately, and neither is true of YTÜ:

- **Half of a 200-item screening paper is vocabulary** (inference: the
  guide says "grammar and vocabulary" without a split, so "roughly half"
  is my reading of an undivided pair, not a published number).
- **Five options, not four.**

### 1.3 PAE Stage 2 Part A — a discrete Vocabulary section

Stage 2 Part A has four sections, all multiple-choice and — on the
evidence of the sampled item in this section — five-option:
**Reading, Grammar, Vocabulary, Listening**. Part B is
Writing and Speaking, sat on a different day, and only by candidates who
pass Part A ([Bilkent Prep — PAE](http://prep.bilkent.edu.tr/en/pae/)).

Official-guide language, via search summary:

> *"The grammar exam consists of two texts and all questions are multiple
> choice. The vocabulary exam consists of two texts and all questions are
> multiple choice."*
> *"The Reading, Grammar and Vocabulary Exam is 1 hour and 45 minutes."*
> *"In the Reading, Grammar and Vocabulary papers … there is a penalty for
> wrong answers — for every four incorrect answers, one point will be
> deducted from the overall score of that section."*

Item counts. These come from Turkish prep-school pages, **not** from the
official guide, and the same four numbers came back in two independently
worded searches
([INEX](https://www.bilkenthazirlik.com/pae-sinavi/),
[temadil](https://temadil.com/blog/277/bilkent-universitesi-ingilizce-yeterlik-sinavi-(pae))):

| Stage 2 Part A section | Items | Shape |
| --- | --- | --- |
| Reading | 35 | 3 texts |
| Grammar | 15 | 2–3 cloze texts |
| **Vocabulary** | **20** | **2 cloze texts** |
| Listening | ~30 | 2 parts, heard once |
| Total | ~100 | |

**Vocabulary is one item in five on Part A.** For comparison,
`docs/research/vocabulary.md` §1.1 counts four vocabulary items in about a
hundred points on YTÜ's paper.

**And the item is the app's item.** A practice set indexed from Bilkent
materials gives a vocabulary text with numbered blanks and five options
each ([Course Sidekick](https://www.coursesidekick.com/english/29208675)):

```
… the city council ____(1)____ access to those areas last year …
    the council decided to ____(2)____ a committee …
    The committee has recently offered a/an ____(3)____ plan …

1  facilitated / prohibited / regarded / initiated / invaded
2  dismiss / suspend / convene / surround / constrain
3  comprehensive / pile / shallow / idle / restless
```

That is four or five same-band, mostly same-part-of-speech words from one
neighbourhood, decided by the paragraph. It is `docs/research/vocabulary.md`
§2.2's unit, on a real paper, with one more option. `suspend` and
`constrain` are both in the drafted sets.

Note what the third set does that this project's rules forbid: `pile`
is a noun among four adjectives, and is eliminable on grammar alone. The
real paper is *looser* than the app's authoring rules, not tighter. That
is an argument for keeping the app's rule, not relaxing it.

### 1.4 YTÜ İYS — and where the web disagrees with our own papers

`docs/exam-spec.md` is the only primary source in this project, taken from
the two sample papers the owner supplied: Session I is **40 items, each
1.5 points, 60 points** — cloze 10, closest meaning 10, reading 14,
paragraph completion 6. I am not overwriting it. But three independent
prep-school accounts describe something different, and one of them
describes a *change*, so this needs recording rather than smoothing.

| Claim | Source | Agrees with `exam-spec.md`? |
| --- | --- | --- |
| 40 items, 1.5 points each, two reading texts × 7 questions | [İstanbul Dil Akademisi](https://istdilakademisi.com/ytu-iys-sinav-icerigi-cikmis-sorular-hazirlik-atlama) | **yes**, exactly |
| Session I is out of **50**, with a **25** barrier into Session II; pass is **60/100** | [konusarakogren](https://www.konusarakogren.com/blog/ingilizce-hazirlik-atlamayildiz-teknik-universitesi/), [YTÜ Kampüs](https://www.ytukampus.com/konu/ytu-hazirlik-sistemi-ve-iys-formati-degisti/) | no — 40 × 1.5 = 60, not 50 |
| The format **changed**: cloze became **two 10-item tests = 20 items**, closest meaning fell to **5**, reading items are **1.25** points | [İstanbul Dil Akademisi — "Yeni YTÜ İYS Formatı"](https://istdilakademisi.com/ytu-iys-yildiz-teknik-hazirlik-atlama/ytu-iys-formati-degisti-yeni-iys-sinav-formati) | no — our papers show 10 cloze, 10 closest meaning |
| Listening rose **15 → 25** and **note-taking was added** | same | **partly** — our Session II *has* note-taking, but totals 20 |
| "Use of English measures grammar and vocabulary: **15 grammar and 15 vocabulary** questions" | [akademik.com.tr](https://www.akademik.com.tr/yildiz-teknik-universitesi-hazirlik-atlama-kursu) | no, and incompatible with the two above |

These do not reconcile, and I am not going to invent an arithmetic that
makes them. What can be said:

- **The note-taking sheet in our Session II is described elsewhere as a
  recent addition.** So the owner's papers are at least partly the new
  format, which makes the "the format changed" account relevant rather
  than historical.
- **If the cloze section really is 20 blanks now, that doubles the
  section the app is strongest at.** The app covers 8 of the 10 blank
  types in `docs/roadmap.md`'s table; twice as many blanks is twice the
  return on the same content.
- **One prep school reports the vocabulary share of an actual sitting**:
  *"Cloze Test bölümünde 20 sorudan 5 tanesi kelime sorusu olarak
  sorulmuş, diğer sorular gramer tabanlıdır"* — five of twenty cloze
  blanks were vocabulary
  ([İstanbul Dil Akademisi](https://istdilakademisi.com/ytu-iys-sinav-icerigi-cikmis-sorular-hazirlik-atlama)).
  That is the same one-in-four ratio as our sample paper's 2-of-10, on a
  section twice the size. **The proportion holds; the absolute number
  roughly doubles.**

**The action is not to rewrite `exam-spec.md`.** It is one question to the
owner: *what date is on your sample papers, and does the YTÜ
announcements page describe a different Session I?* The page to check is
[YENİ İNGİLİZCE YETERLİK SINAVI (İYS) BİLGİLENDİRMESİ](https://ybd.yildiz.edu.tr/sayfa/5/YEN%C4%B0-%C4%B0NG%C4%B0L%C4%B0ZCE-YETERL%C4%B0K-SINAVI-(%C4%B0YS)-B%C4%B0LG%C4%B0LEND%C4%B0RMES%C4%B0/225).

YTÜ's own prep levels run **A1, A2, B1, B1+**, and a pass on İYS is
treated as B2 — so the exam sits a band above where the teaching stops,
which is the usual shape and is worth knowing when judging difficulty.

### 1.5 What each paper rewards, plainly

| | **YTÜ İYS** (owner) | **Bilkent PAE** (Doruk) |
| --- | --- | --- |
| Discrete vocabulary section | **no** | **yes — 20 items, ~20% of Part A** |
| Vocabulary elsewhere | ~5 of 20 cloze blanks; 1 in-context item per reading text | in-context items in reading; 200-item Stage 1 gateway is grammar *and* vocabulary |
| Options per item | 4 | **5** |
| Wrong answers penalised | **no** (nothing on the papers or in prep accounts) | **yes** — ¼ point |
| Grammar tested as | one cloze section (10 or 20 blanks) + restatement | one cloze section, 15 items, 2–3 texts |
| Restatement / closest meaning | **yes**, 5 or 10 items | **not mentioned in any source** |
| Paragraph completion | **yes**, 6 items | **not mentioned in any source** |
| Published lexical syllabus | none found | **five level word lists** (§2.1) |
| CEFR target | B2 (pass ≈ BB) | B2 |
| Pass | 60/100 overall, ≥25/50 Session I | ~120/200 Stage 1; Part A before Part B |

**The two learners need opposite advice in exactly one place, and it is
free to give.** On YTÜ, never leave an item blank. On Bilkent, a blind
guess among five is expected-value zero (0.2 × 1 − 0.8 × 0.25 = 0) and
only pays after eliminating at least one option. That is two sentences of
Turkish and it is worth more per hour than any content in this document.

**And the app already serves the wrong half for Doruk.** `closest-meaning`
is 24 shipped questions against a section that does not appear anywhere
in Bilkent's published description. Not wasted — restatement practice is
grammar practice — but it should not be sold to him as exam coverage.

---

## 2 · Which words

### 2.1 Bilkent publishes its own lexical syllabus, and it is the right target

This is the answer to the brief's question, and it is better than any of
the candidate lists.

Bilkent's prep programme publishes **one word list per level**, five
levels, updated per academic year. The curriculum booklet says why they
exist: *"the lexical strand is specified through the level wordlists based
on the Bilkent University Preparatory Program Corpus"*
([Curriculum Booklet](http://prep.bilkent.edu.tr/data/htu-inst/Curriculum.Booklet.pdf)).
So they are not a study aid bolted on afterwards — they *are* the
declared vocabulary syllabus of the programme the exam certifies.

The two that matter, by title as the index returned them:

| List | Columns, per the indexed title | URL |
| --- | --- | --- |
| Upper-Intermediate 2023-24 | `HEADWORD VERB NOUN ADJECTIVE ADVERB COLLOCATION` | [PDF](http://prep.bilkent.edu.tr/wp-content/uploads/2023/09/UPPER-INTERMEDIATE-LEVEL-WORDLIST-2023-2024.pdf) |
| Upper-Intermediate 2024-25 | `HEADWORD VERB NOUN ADJECTIVE ADVERB … 1 Abandon` | [PDF](http://prep.bilkent.edu.tr/en/wp-content/uploads/2024/09/2024-2025-UPPER-INTERMEDIATE-LEVEL-WORDLIST-Updated-27.06.24.pdf) |
| **Pre-Faculty 2023-24** — the level the exam sits on | `HEADWORD VERB NOUN ADJECTIVE ADVERB …` | [PDF](http://prep.bilkent.edu.tr/en/wp-content/uploads/2023/09/PRE-FACULTY-LEVEL-WORDLIST-2023-2024.pdf) |
| Intermediate 2023-24 | `NOUN ADJECTIVE ADVERB **AFFIX** COLLOCATION` | [PDF](http://prep.bilkent.edu.tr/en/wp-content/uploads/2023/09/INTERMEDIATE-LEVEL-WORDLIST-2023-2024.pdf) |
| Pre-Intermediate 2023-24 | `HEADWORD VERB NOUN …` | [PDF](http://prep.bilkent.edu.tr/en/wp-content/uploads/2023/09/PRE-INTERMEDIATE-LEVEL-WORDLIST-2023-2024.pdf) |
| Elementary 2023-24 | thematic groups | [PDF](http://prep.bilkent.edu.tr/wp-content/uploads/2023/09/ELEMENTARY-LEVEL-WORDLIST-2023-2024.pdf) |

Three things about the shape of those tables, and each is a finding:

1. **The unit of the list is a word family, not a word.** One row is a
   headword with its verb, noun, adjective and adverb forms. That is a
   published institutional statement that the derivational family is what
   the learner is expected to know.
2. **There is a `COLLOCATION` column.** Search returned two entries
   verbatim: `Constrain / constraint`, collocation *"constraint on"*; and
   `reluctant`, with *"be reluctant to"* and *"reluctance to"*. Both are
   dependent-preposition patterns, not arbitrary idiom.
3. **The Intermediate list has an `AFFIX` column.** Derivational
   morphology is taught explicitly, by suffix.

Size, from search summaries and therefore approximate: the Pre-Faculty
list is described as **"over 300 entries"**; the Upper-Intermediate list
is longer. Confirmed entries by name and, where the index gave them,
number: `Abandon` (Upper-Int #1), `Absorb`, `Abuse`, `Accelerate`,
`Accomplish`, `Account`, `Acquire`; and in Pre-Faculty, `Abortion`,
`Absolute`, `Abstract`, `Accompany`, `Accountable`, `Accumulate`,
`consensus` (#119), `Conservative` (#120), `Constrain/constraint` (#123),
`reluctant`.

**Extract them with the tool that already exists — but it needs work
first.** `tools/extract-wordlist.mjs` and its Python half are written for
the *elementary* layout: four columns of single words with bold group
headings, bucketed by x-position with a wrapped-heading rule. The upper
lists are a different table — six columns, no group headings, one row per
family, cells that contain more than one word. The x-position bucketing
carries over; the heading logic is inert and the row model has to change
from "cluster of words at one y" to "one family row across six columns".
Call it **3–4 hours**, and it buys every future band check for free.

### 2.2 The elementary list in this repo is Bilkent's, not YTÜ's

`docs/exam/wordlists/README.md` calls it *"the prep school's published
word lists"*, and everything downstream — `docs/agents/drafts/README.md`,
the brief for this arm — reads it as YTÜ's. I think that is wrong.

The evidence:

- The repo file's title is `ELEMENTARY LEVEL WORDLIST (2023-2024 ACADEMIC
  YEAR)`. Bilkent publishes `ELEMENTARY-LEVEL-WORDLIST-2023-2024.pdf`,
  same year, same naming convention as its other four lists.
- A search summary of Bilkent's elementary list names its categories as
  *"personal information, time/days/months/seasons, animals,
  pronouns/determiners"* and, separately, *"terminology, education, and
  prepositions"*. The repo file's groups 5, 6, 8, 9, 10 and 11 are
  `Basic Study Terminology/Education`, `Prepositions`, `Personal
  information/family`, `Time/Days/Months/Seasons`, `Animals`,
  `Pronoun / Determiner` — **the same names in the same order**.
- YTÜ names its levels A1 / A2 / B1 / B1+, not "Elementary". Bilkent
  names its levels Elementary → Pre-Faculty.
- I found no YTÜ-published word list at any level, in Turkish or English
  search. What exists for YTÜ is prep-school lists compiled from past
  papers (§2.4).

**Labelled as inference**, because I could open neither PDF. It is one
minute to settle: the owner opens the Bilkent URL above and compares the
first page.

If it is right, three consequences:

1. `docs/exam/wordlists/README.md`'s framing needs correcting, and its
   "what is still missing" section is already answered — the higher bands
   exist and are linked in §2.1.
2. The **"0 of 60 target words appear in the elementary list"** check is
   still a real check, but it says *"these words sit above Bilkent's
   assumed knowledge"*, not YTÜ's. That is if anything the more useful
   claim, since Bilkent is the exam with the vocabulary section.
3. The far more valuable check — *do the 60 words appear in Bilkent's
   Upper-Intermediate and Pre-Faculty lists?* — is one extraction away,
   and there a **hit is confirmation**, not a problem. On the five words
   I could confirm by hand it already looks like a hit.

### 2.3 YTÜ has no equivalent, and what stands in for it

No official YTÜ word list surfaced. What exists is prep-school material
built from past papers, and it is worth knowing about even though nothing
should be authored from it:

- [YTÜ İYS Kelime Listesi](https://istdilakademisi.com/materyal/ytu-ingilizce-yeterlilik-sinavi-iys-kelimeleri)
  — several sets, described as *"prepared by examining previous years'
  exams with special attention to synonyms … because YTÜ İYS Near Meaning
  and Reading questions are mostly prepared using these types of words"*.
- [A phrasal-verb list](https://istdilakademisi.com/materyal/ytu-iys-kelime-listesi-phrasal-verbs)
  described as *"compiled from Phrasal Verbs that have appeared in İYS
  exams"*.

That second one is a direct challenge to a refusal in
`docs/research/vocabulary.md` §2.3 — see §4.3.

### 2.4 AWL, AVL, NGSL+NAWL: inputs, and how they rank now

`vocabulary.md` §2.2 settled this: *"AWL and AVL are inputs to choosing
sets, not the syllabus."* That holds, and Bilkent's own lists slot in
above all of them. Ranked for this project:

| | Use it for | Why not as the syllabus |
| --- | --- | --- |
| **Bilkent Pre-Faculty + Upper-Intermediate lists** | choosing sets, and checking that every option in a set is in band | it *is* an institution's syllabus — for one of the two exams. Useless for YTÜ except as a proxy |
| **AVL** (Gardner & Davies, 2014) | deciding whether a neighbourhood is worth six items; it is lemma-based, so it tells you the part of speech, which is what a same-POS set needs ([Applied Linguistics 35(3)](https://academic.oup.com/applij/article/35/3/305/146569)) | 3,000 lemmas; no exam samples it as a list |
| **AWL** (Coxhead, 2000) | the same, coarser; 570 families, ~10% of academic text ([TESOL Quarterly 34(2)](https://onlinelibrary.wiley.com/doi/abs/10.2307/3587951)) | word families hide the part of speech |
| **NGSL + NAWL** (Browne, Culligan & Phillips, 2013) | a sanity check on frequency band: 2,800 + 963 words giving ~92% coverage of a 288-million-word academic corpus, 5 points better than GSL+AWL ([NGSL Project](https://www.newgeneralservicelist.com/new-academic-word-list); [EAP Foundation](https://www.eapfoundation.com/vocab/academic/nawl/)) | same objection, plus nothing ties either exam to it |

**The evidence that these exams sample the academic band is not a
frequency study — it is Bilkent's own syllabus and the items themselves.**
`prohibited / initiated / facilitated`, `suspend / convene / constrain`,
`comprehensive / shallow / idle` from the PAE sample; `consumerism /
gratitude / conflict / generosity` and `appreciate / devastate / smuggle /
emerge` from YTÜ's. Both papers mix core academic vocabulary with general
mid-frequency abstract vocabulary in the same item, which is exactly what
`vocabulary.md` §2.1 concluded, and neither is predicted by a single list.

**One band the papers sample and no list gives you**: high-frequency words
in secondary or figurative senses — YTÜ's `steer`, and the reading
in-context items on both papers. §3.4.

---

## 3 · Are the twelve drafted sets right?

Read: `docs/agents/kickoff-vocabulary.md`, and both draft files
(`docs/agents/drafts/academic-verbs/questions.json`,
`docs/agents/drafts/academic-nouns-adjectives/questions.json` — 24 items
each, `optionNotes` on all of them).

### 3.1 The aim is right, and I can partly prove it

The sets are B2 academic near-neighbour groups, same part of speech, four
options decided by a paragraph. That is the shape of a real Bilkent PAE
vocabulary item (§1.3) and of the two YTÜ cloze vocabulary blanks
(`docs/exam-spec.md`). No set is technical, none is K1–K3-only, none is
below the band.

**Five sets contain a word I confirmed by name in Bilkent's published
upper-level lists**, which is as close to external validation as this
round can get without the extraction:

| Set | Confirmed member | Where |
| --- | --- | --- |
| `Sustain & Restrict` | `abandon` | Upper-Intermediate, entry 1 |
| `Cause & Consequence` | `accelerate` | Upper-Intermediate, early entries |
| `Constraint & Requirement` | `constraint` | Pre-Faculty #123, collocation *constraint on* |
| `Evidence & Inference` | `consensus` | Pre-Faculty #119 |
| `Stance & Disposition` | `reluctant` | Pre-Faculty, *be reluctant to* |

And two more members appear as options in the sampled PAE vocabulary
item itself: `suspend` (`Sustain & Restrict`) and `constrain`
(`Constraint & Requirement`).

Alphabetical bias is doing some of that work — search surfaces the front
of a list — so read it as "no set is off-band", not as "five of twelve
are proven". The extraction in §2.1 turns it into a real number.

### 3.2 The two sets I would look at first

Not "wrong" — I have not reviewed the items, and the review passes exist
precisely because my judgement here is not a substitute for them. These
are where I would point the reviewer.

**`Allocate & Withhold (allocate / distribute / assign / withhold /
retain)`.** It is two sets pretending to be one: `allocate / distribute /
assign` are giving-out verbs, `withhold / retain` are holding-back verbs.
Every item therefore has at least two options that a competent reader
eliminates on polarity alone, before any lexical discrimination happens —
which is the "dead option in a new costume" failure that
`kickoff-vocabulary.md` rule 2 names, arriving by a different route. It is
also the most administrative neighbourhood of the twelve and the hardest
to select with a general-interest paragraph. If a set has to be replaced,
this one.

**`Change & Emergence (emerge / evolve / shift / decline / fade)`.**
`fade` is a K1–K3 word in its core sense, which `vocabulary.md` §2.3
excludes by name, and it sits beside four academic-band members — a
frequency-band mix that rule 2 forbids *within* an item. The draft's own
first item (`academic-verbs-t1`) shows the risk: `emerged` keyed against
`declined / faded / evolved`, where the paragraph supplies a direction of
change and the item is arguably decided by polarity rather than by
knowing what `emerge` means. Defensible — it is exactly the exam's
move — but it is the set where "the paragraph selects it" is thinnest.

### 3.3 What is missing, and this is the important part

Ranked by how much the two papers reward it.

**1 · Word formation / derivational families. The single biggest gap.**
`vocabulary.md` §2.3 refused a word-formation category on the ground that
*"there is not a single word-formation item on either sample paper"* —
true, and true of YTÜ. It does not survive Bilkent. Bilkent's published
lexical syllabus **is a table of derivational families**, one row per
headword with verb, noun, adjective and adverb columns, and its
Intermediate list adds an `AFFIX` column (§2.1). A 200-item grammar-and-
vocabulary screening paper with five options per item is the natural home
for `analyse / analysis / analytical / analytically` in a gap.

`vocabulary.md` §2.3 already worked out what such an item is, and it is
the reason this is cheap: *"if a paper ever does test it, the item is
`analyse / analysis / analytical / analytically` in a gap: an ordinary
cloze. It needs no schema either way."* It needs a topic, six categories,
a category spec and twenty-four items. **No code.** And Schmitt &
Zimmerman's finding that learners typically know two or three of a
family's four word classes, adverbs and adjectives hardest, is the
evidence that it is worth teaching rather than assuming
([TESOL Quarterly 36(2)](https://onlinelibrary.wiley.com/doi/abs/10.2307/3588328)).

**2 · Dependent prepositions and complementation patterns.** The narrow
half of "collocation", and it should not be refused with the wide half.
`vocabulary.md` §2.3 refuses collocation items because *"the three wrong
options break no rule and the explanation can only say 'bu böyle
söylenir'"*. That is unanswerable for `make / do / take / have a
decision`. It is **not** true of `constraint **on**`, `reluctant **to**`,
`implication **for**`, `criterion **for**`, `consensus **on**` — which are
governed by the head word, are explainable in one Turkish sentence, are
printed in Bilkent's own `COLLOCATION` column, and are already half-taught
by the twelve drafted sets since the words are the drafted words. This is
a *category inside the existing topics*, not a new topic: three or four
categories of four items.

**3 · The polysemy half of the target band, which the kickoff dropped.**
`vocabulary.md` §5.1 recommended six sets: *"four sets of academic and
mid-frequency abstract vocabulary organised by semantic field, and two
sets of high-frequency polysemy (`steer`, `address`, `hold`, `draw`,
`raise`, `run`) which is the reading item's actual content."*
`kickoff-vocabulary.md` commissioned twelve sets and **all twelve are of
the first kind**. The polysemy half — half the target band by §2.1's own
table, and the content of the vocabulary-in-context items on *both*
papers — is not covered by either draft, and the kickoff does not say it
decided against it. That is a deviation from the plan, not an oversight in
the drafts, and it should be decided rather than inherited. §3.4 says why
it is still not simply "author two more sets".

**4 · Two facts, not content: five options, and negative marking.** §1.5.

**Not missing:** a Bilkent-specific *word* set. Nothing I found suggests
the two papers sample different neighbourhoods. What differs is how much
vocabulary is worth, the option count and the penalty — none of which is
solved by writing different words.

### 3.4 The one thing that stays deferred, and it is unchanged

`vocabulary.md` §3.2 designed `type: "synonym"` for the
vocabulary-in-context item, priced it at half a day to a day of code, and
deferred it — not because it is expensive but because it belongs to the
reading round: *"authored standalone on a 40-word paragraph it is a
materially easier and differently-shaped item."*

Bilkent changes nothing here. Its in-context items also live inside a
reading passage, in a 35-item reading section. The deferral holds, and so
does the one early decision it asks for: **the reading schema must let a
paragraph carry a marked span.** Nothing in this round makes that
cheaper to retrofit later.

---

## 4 · Beyond single words

### 4.1 Word formation — tested by Bilkent's syllabus, schema-free

Covered in §3.3. The point for this section: **the existing question
schema expresses it with no change at all.** `docs/CONTENT_GUIDE.md`'s
cloze is a paragraph with one `____`, four distinct options and a keyed
`correctIndex`; the four options being four forms of one root breaks no
rule the validator has. `optionNotes` is keyed by option text, so
`analysis` / `analytical` / `analytically` each get their own gloss.

The only thing to check is `tools/content-checks.mjs`'s near-duplicate and
key-in-stem rules, which `vocabulary.md` §3.1 already walked through for
vocabulary items and found inert or helpful.

### 4.2 Collocation — split the refusal in two

Covered in §3.3. Schema: also unchanged. A dependent-preposition item is a
cloze whose blank falls on the preposition or on the head word.

**But keep the wide refusal.** `docs/agents/question-author.md` rule 2 —
*"an option a competent teacher would accept is a wrong option"* — is
what makes `make/do/take a decision` unauthorable here, and
`docs/content-review.md` measured sixteen of the first seventy-two items
failing on exactly that axis. The narrow category survives the rule
because the wrong preposition after `constraint` is not something a
teacher accepts; the wrong verb before `a decision` often is.

### 4.3 Phrasal verbs — still no, and now for a better-stated reason

`vocabulary.md` §2.3 refuses them on two grounds: no item on either sample
paper, and Garnier & Schmitt's finding that phrasal verbs average **5.6
senses**, so an item keyed on one sense is arguable
([LTR 19(6)](https://journals.sagepub.com/doi/10.1177/1362168814559798)).

The second ground is untouched. The first is now contested: a prep school
publishes an İYS phrasal-verb list *"compiled from phrasal verbs that have
appeared in İYS exams"* (§2.3). That is second-hand, from a business with
an interest in there being more to teach, and it contradicts the only
primary source this project has.

**So: do not build, and restate the refusal honestly.** It now rests on
"no paper we have seen contains one, and they are expensive to key
fairly", not on "these exams do not test them". The owner has the papers;
the check is a grep of his own PDFs, and if it comes back positive the
PHaVE List's top 150 verbs cover ~83% of occurrences and the job is small.
Nothing on the Bilkent side pushes for it at all — every option in the
sampled PAE vocabulary item is a single Latinate verb or adjective.

### 4.4 Would any of this need a new item type?

**No.** Word formation, dependent prepositions and semantic sets are all
`type: "cloze"` as `docs/CONTENT_GUIDE.md` defines it. The only vocabulary
item type this project has ever needed is `synonym` (§3.4), and it is
deferred to the reading round for reasons this document does not change.

**One constant would have to change if the app ever wanted to mirror the
Bilkent paper**, and I recommend against it:
`tools/validate-content.mjs:36` is `const OPTIONS_PER_QUESTION = 4`, used
as both `min` and `max`. Making it five is a one-line change in the
validator and roughly nothing in `js/answers.js`, which renders whatever
it is given. The cost is not the code — it is **241 shipped and drafted
items each needing a fifth option**, authored to fill a slot, which is the
dead-option failure `question-author.md` rule 4 exists to stop. Say the
difference to the learner instead of engineering it.

---

## 5 · How much is enough

### 5.1 The target

Two constraints set it, and they happen to agree:

- **`js/storage.js`'s `MIN_ITEMS_FOR_WEAK_CLAIM = 6`.** Every one of the
  app's 48 shipped categories has four questions (193 questions / 48
  categories = 4.02), so `confident` is structurally unreachable
  everywhere — `vocabulary.md` §6, measured. Six items per category is
  the floor at which a vocabulary category says something the app cannot
  currently say about any category.
- **`docs/roadmap.md`**: mastery levels need ~8–10 items per category,
  adaptive difficulty and scheduling ~15–20.

So the honest ladder:

| | Sets × items | Items | Words | What it buys |
| --- | --- | --- | --- | --- |
| Drafted today | 12 × 4 | **48** | 60 | the format proved; no category reaches the confidence floor |
| **Recommended target** | **20 × 6** | **120** | ~100 | every category clears `MIN_ITEMS_FOR_WEAK_CLAIM`; ~⅓ of Bilkent's Pre-Faculty list; enough fields that a wrong answer routes somewhere useful |
| Stretch | 24 × 8 | 192 | ~120 | mastery levels become defensible per `roadmap.md` |
| Adaptive | 20 × 15–20 | 300–400 | ~100 | `roadmap.md`'s threshold — and the same 100 words, met 3–4 times each |

**Twenty sets of six is the number.** Below about ten sets a learner meets
too few semantic fields for the category breakdown to mean anything; above
about twenty-five the fields get narrow and each new set costs the same as
the first. Six rather than four because six is where the app's own
arithmetic stops hedging — and because a five-word set has, as
`docs/agents/drafts/README.md` records, only five possible option sets, so
the sixth item is where a set is honestly exhausted rather than padded.

Against 48 drafted: **the drafts are 40% of the target.** The gap is 8 new
sets and 2 more items on each of the 12 existing categories.

### 5.2 The ceiling, stated honestly

120 items is about 100 words. Bilkent's published list for the single
level immediately before its exam is **over 300 headwords**, each with
four derivational forms and a collocation, and the Upper-Intermediate list
below it is longer. So at the recommended target the app covers roughly a
third of one level of one university's list.

And that is the *small* denominator. The one `vocabulary.md` §1.2
establishes is thousands of word families: 4,000–5,000 for adequate
comprehension, 8,000 for unassisted
([Laufer & Ravenhorst-Kalovski 2010](https://files.eric.ed.gov/fulltext/EJ887873.pdf);
[Nation 2006](https://www.researchgate.net/publication/239928724_How_Large_a_Vocabulary_Is_Needed_for_Reading_and_Listening)).
Nothing in this document moves that, and nothing in this app can.

**What 120 items can honestly claim**, and it is worth saying in these
words: *it trains the item, not the lexicon.* On YTÜ that is ~5 of 20
cloze blanks plus two in-context reading items — call it 7–9 points of
100, and the app would be practising the exact skill they test. On
Bilkent it is the 20-item Vocabulary section's *method* — same-band
near-neighbours decided by a text — against a syllabus the app covers a
third of.

**Doruk should be told both halves.** The app will make him better at the
Bilkent vocabulary item. It will not close the list, and the list is
downloadable from his own prep school in one click (§2.1). Those two
sentences together are the honest version; either alone is a lie.

### 5.3 What it costs

Supervisor hours, using `docs/research/vocabulary.md` §5.1's own measured
rates: 7 minutes of genuine review per item, 22% of items defective ×
~2 rework cycles, ~45 minutes per lesson including the sufficiency pass,
~1 hour per category spec. Authoring sessions are cheap; this is the
review, which is what the project is actually short of.

| Work | Items | Hours |
| --- | --- | --- |
| Both review passes on the 48 drafted items + 12 lessons, and ship | 48 | **~18** |
| 12 existing categories from 4 → 6 items | +24 | ~5 |
| 8 new semantic sets at 6 items (specs, items, lessons) | +48 | ~23 |
| A word-formation topic, 6 categories × 4 | +24 | ~15 |
| Dependent prepositions, 3 categories × 4, folded into the existing topics | +12 | ~8 |
| Extend `tools/extract-wordlist.mjs` for the 6-column layout, extract both Bilkent upper lists | — | ~4 (code) |

---

## Supervisor's notes, 2026-09-04

Three corrections to this document, made after acting on it. They are
here rather than edited into the text above so that what the arm found
and what turned out to be true stay separable.

**Item 1 is done, and the arm was right.** The elementary list is
Bilkent's. Confirmed two ways: the file's own title string is identical
to BUSEL's published
[`ELEMENTARY-LEVEL-WORDLIST-2023-2024.pdf`](http://prep.bilkent.edu.tr/wp-content/uploads/2023/09/ELEMENTARY-LEVEL-WORDLIST-2023-2024.pdf)
(September 2023) and the thirty group names match in order; and the
provenance chain is that it arrived with the files a friend sitting the
**Bilkent** exam shared. `docs/exam/wordlists/README.md` and
`docs/agents/drafts/README.md` are corrected and the JSON is renamed
`bilkent-elementary-2023-2024.json`. The "0 of 60" check now reads as
what it is: evidence about Doruk's paper, not the owner's.

**Items 2 and 3 are blocked, not skipped.** `prep.bilkent.edu.tr` is not
in this development environment's egress allowlist, so neither the
upper-level lists nor the PAE guide can be fetched from here — by curl or
by any fetching tool. Two ways round it, both the owner's to choose:
allow the host in the environment's network settings, or download the
three PDFs by hand and drop them into `docs/exam/`, after which
`tools/extract-wordlist.py` is one command away from needing only its
six-column pass. **Until then, §7 of the category spec stays a judgement
rather than a lookup, and any new vocabulary set is commissioned without
the band check the arm recommends doing first.** That is a real cost and
it is the reason recommendation 6 is not started here.

**Item 8 carries a stale finding.** It reports `entries.some((entry) =>
entry.confident)` in `js/home.js` and `js/profile.js`, from
`vocabulary.md` §6. Both are already `.every` (`js/home.js:218`,
`js/profile.js:483`), with a comment at each site explaining why — the
defect was found and fixed before this arm ran. The arm inherited the
claim from the older document instead of reading the code. Nothing to do;
recorded so the next reader does not "fix" it back. `vocabulary.md` §6
should be read with the same caution.

---

## 6 · Recommendation

Ordered. Everything before item 5 is a day's work in total for the first
four and needs no authoring session.

**1 · Settle the provenance of the word list. ~30 minutes, today.**
Open [Bilkent's elementary list](http://prep.bilkent.edu.tr/wp-content/uploads/2023/09/ELEMENTARY-LEVEL-WORDLIST-2023-2024.pdf)
and compare page one with `docs/exam/wordlists/elementary-2023-2024.json`.
If it matches, fix `docs/exam/wordlists/README.md` and the sentence in
`docs/agents/drafts/README.md` that reads the "0 of 60" check as a YTÜ
result. A mis-attributed primary source is the kind of error that gets
built on.

**2 · Download the two upper Bilkent lists and the January 2026 PAE guide.
~10 minutes.** URLs in §2.1 and §1.2. This also answers the owner's
complaint that the PDFs Doruk shared were not useful — these are the
official ones, and the guide is the only place the section weightings can
be confirmed rather than inferred from prep-school pages.

**3 · Extend the extractor and run the band check. ~4 hours.**
Six-column, no-headings, one-family-per-row layout. Then re-run the 60-word
check against Upper-Intermediate and Pre-Faculty, where a hit is
confirmation. Do this **before** commissioning any new sets: it turns
"§7 band declaration" in the category spec from a judgement into a lookup.

**4 · Ask the owner one question about his own papers.** What date is on
them, and does the cloze section have 10 blanks or 20? §1.4. If it is 20,
the whole grammar corpus just doubled in value and `docs/roadmap.md`'s
cloze table should say so.

**5 · Ship the two drafts. ~18 hours. Do not revise, do not replace.**
Run both review passes as written and serve them. The case: the item
shape matches a real Bilkent PAE vocabulary item; five of twelve sets
contain a word confirmed in Bilkent's published upper-level syllabus; and
`docs/roadmap.md` already places them next. Two notes for the reviewer,
not blockers — look hardest at `Allocate & Withhold` and at whether
`Change & Emergence` items are decided by lexis or by polarity (§3.2).

**6 · A word-formation topic. ~15 hours, zero code.** Six categories,
four items each, options being four forms of one root. This is the one
recommendation that reverses a standing refusal, and it reverses it on
evidence: Bilkent's published lexical syllabus is a derivational-family
table with an affix column. It is also the most Doruk-specific thing on
this list. Write the category spec against the extracted Pre-Faculty
list — the families are already tabulated there.

**7 · Three dependent-preposition categories. ~8 hours.** Folded into
`academic-nouns-adjectives` and `academic-verbs` rather than made a topic.
`constraint on`, `reluctant to`, `implication for`, `criterion for`,
`consensus on` — all already in the drafted sets, all in Bilkent's
`COLLOCATION` column. Keep the wide collocation refusal intact (§4.2).

**8 · 4 → 6 items on the twelve vocabulary categories. ~5 hours.** These
become the first categories in the app that can produce a confident weak
claim. `vocabulary.md` §6 records a defect to fix in the same round:
`js/home.js:205` and `js/profile.js:328` both use
`entries.some((entry) => entry.confident)`, so one qualifying category
flips the hint for a list that is mostly four-item hedges. One hour.

**9 · Two sentences of Turkish, worth more per hour than anything above.**
Bilkent penalises wrong answers and gives five options; YTÜ does neither.
So: on YTÜ never leave a blank; on Bilkent guess only after eliminating an
option. Where they live is a question for the owner — the honest-sentences
pattern in `vocabulary.md` §4.3 is the precedent.

---

## What I would refuse

**Shipping any of these word lists as content.** `vocabulary.md`'s refusal
holds and is now more tempting, because Bilkent's are real, official, free
and level-matched. It is still content-shaped work the pipeline cannot
review, the app cannot practise and the validator cannot check. Use them
to *choose* and to *check* sets. The correct place for one in this
repository is `docs/exam/wordlists/`, as a research input, which is
exactly where the first one went.

**A "Bilkent mode", a per-university content fork, or two manifests.**
The words are the same, the item is the same, the band is the same. What
differs is option count, negative marking and section weight — three
facts, statable in three sentences. A fork doubles the review debt, and
review debt is the thing this project is measurably worst at:
`docs/agents/drafts/README.md` records five repair-introduced defects
across the last grammar round, each caught only by an independent
re-audit.

**Five-option items.** §4.4. One constant in the validator, and 241
existing items each needing a fifth option authored to fill a slot. A
distractor written because a slot exists is the dead option
`question-author.md` rule 4 refuses, and it would arrive 241 times.

**Rewriting `docs/exam-spec.md` from prep-school web pages.** It is the
only primary source in this project. Three commercial sites disagree with
it and with each other (§1.4); one of them may well be describing a newer
paper. The resolution is the owner's PDFs and YTÜ's own announcement page,
not a majority vote among search summaries.

**Phrasal verbs, still.** §4.3 — but the refusal is now "no paper we have
seen has one", not "these exams do not test them", and the difference
matters because one prep school claims otherwise and the owner can check
in a minute.

**Arbitrary collocation.** `make / do / take / have a decision` and
everything like it. Unchanged from `vocabulary.md` §2.3: the wrong options
break no rule, and sixteen of the first seventy-two items in this app
already failed on exactly that axis.

**Any claim that the app prepares a learner for Bilkent's Vocabulary
section.** Twenty items, ~20% of Part A, against a published syllabus of
300+ families for the level below it. At the recommended target the app
holds ~100 words. Saying "vocabulary: covered" would be the progress bar
over a fake denominator that `vocabulary.md` refuses, wearing a second
university's crest.

**A vocabulary-size estimate, a flashcard mode, a separate Kelime tab, or
a progress bar over a word count.** All four already refused in
`vocabulary.md` §7, all four for reasons nothing in this round touches.

**Anything built on a number in this document that has not been checked
against a PDF.** Every count in §1.2, §1.3 and §1.4 is a search-index
summary. The section weightings decide how much of the app's remaining
budget goes to vocabulary, which is exactly the class of decision the
`docs/research/README.md` caveat says to confirm first.

---

## Open questions for the owner

1. **Is the repo's elementary word list Bilkent's?** (§2.2) One minute to
   settle, and it changes what a downstream check means.
2. **What date is on the İYS sample papers, and is the cloze 10 blanks or
   20?** (§1.4) If 20, the grammar corpus just became twice as valuable
   and the roadmap's coverage table understates the app.
3. **Does Doruk sit PAE Stage 1, Stage 2, or both?** Stage 1 is 200
   grammar-and-vocabulary items with five options and a guessing penalty;
   Stage 2's vocabulary is 20 items in two texts. They are different
   preparation problems and only the second is the app's shape.
4. **Word formation: a topic, or nothing?** (§3.3) It reverses a standing
   refusal on evidence from the second exam only. It is ~15 hours and no
   code, and it is the most Bilkent-specific content this app could
   write. This is a judgement about whom the app is for, which is the
   owner's and not a research arm's.
5. **The polysemy sets the kickoff dropped.** (§3.3) `vocabulary.md` §5.1
   asked for two of six sets to be high-frequency polysemy; the kickoff
   commissioned twelve sets and none of them are. Was that a decision?
6. **Where do the two strategy sentences live?** (§1.5) They are the
   highest-value output of this round per hour and the app has nowhere
   obvious to put exam-specific advice.

---

## Sources

Read as **web-search index summaries**, not as the documents themselves —
every direct fetch in this session was refused by the egress proxy (§0).
Where a number decides something, the text says whether a second search
returned it.

**Bilkent — official**
- [PAE — Bilkent University English Language Preparatory Program](http://prep.bilkent.edu.tr/en/pae/)
- [Proficiency in Academic English Exam (PAE) Stage 1 and 2 Guide, January 2026](http://prep.bilkent.edu.tr/wp-content/uploads/2026/JANUARY%202026%20PAE%20GUIDE%20ENGLISH.pdf) · [October 2025](http://prep.bilkent.edu.tr/wp-content/uploads/2025/OCTOBER%202025%20PAE%20GUIDE%20ENGLISH.pdf) · [Turkish, Ocak 2026](http://prep.bilkent.edu.tr/wp-content/uploads/2026/OCAK%202026%20PAE%20KILAVUZU%20TURKCE.pdf)
- [PREP 151/155 Pre-Faculty Course](http://prep.bilkent.edu.tr/en/prep-151-pre-faculty-course/) — CEFR B2
- [English Language Preparatory Program Curriculum booklet](http://prep.bilkent.edu.tr/data/htu-inst/Curriculum.Booklet.pdf) — six strands, five levels, the lexical strand specified by the level wordlists
- **Word lists:** [Pre-Faculty 2023-24](http://prep.bilkent.edu.tr/en/wp-content/uploads/2023/09/PRE-FACULTY-LEVEL-WORDLIST-2023-2024.pdf) · [Upper-Intermediate 2023-24](http://prep.bilkent.edu.tr/wp-content/uploads/2023/09/UPPER-INTERMEDIATE-LEVEL-WORDLIST-2023-2024.pdf) · [Upper-Intermediate 2024-25](http://prep.bilkent.edu.tr/en/wp-content/uploads/2024/09/2024-2025-UPPER-INTERMEDIATE-LEVEL-WORDLIST-Updated-27.06.24.pdf) · [Intermediate 2023-24](http://prep.bilkent.edu.tr/en/wp-content/uploads/2023/09/INTERMEDIATE-LEVEL-WORDLIST-2023-2024.pdf) · [Pre-Intermediate 2023-24](http://prep.bilkent.edu.tr/en/wp-content/uploads/2023/09/PRE-INTERMEDIATE-LEVEL-WORDLIST-2023-2024.pdf) · [Elementary 2023-24](http://prep.bilkent.edu.tr/wp-content/uploads/2023/09/ELEMENTARY-LEVEL-WORDLIST-2023-2024.pdf)

**Bilkent — secondary**
- [INEX / Bilkent Hazırlık — PAE Sınavı Hakkında](https://www.bilkenthazirlik.com/pae-sinavi/) — Stage 1 200 items, ~120 to pass, 0.25 penalty
- [temadil — Bilkent Üniversitesi İngilizce Yeterlik Sınavı (PAE)](https://temadil.com/blog/277/bilkent-universitesi-ingilizce-yeterlik-sinavi-(pae)) — Stage 2A item counts
- [The English Navigator — PAE in Ankara](https://theenglishnavigator.com/en/pae-2/) — the COPE → PAE rename
- [Course Sidekick — Bilkent vocabulary practice](https://www.coursesidekick.com/english/29208675) — the five-option vocabulary cloze item quoted in §1.3

**YTÜ**
- [YTÜ Yabancı Diller Yüksekokulu — Yeni İYS bilgilendirmesi](https://ybd.yildiz.edu.tr/sayfa/5/YEN%C4%B0-%C4%B0NG%C4%B0L%C4%B0ZCE-YETERL%C4%B0K-SINAVI-(%C4%B0YS)-B%C4%B0LG%C4%B0LEND%C4%B0RMES%C4%B0/225) — not retrievable here; the page to check
- [İstanbul Dil Akademisi — YTÜ İYS Sınav İçeriği](https://istdilakademisi.com/ytu-iys-sinav-icerigi-cikmis-sorular-hazirlik-atlama) — 40 items × 1.5; "5 of 20 cloze blanks were vocabulary"
- [İstanbul Dil Akademisi — Yeni YTÜ İYS Formatı](https://istdilakademisi.com/ytu-iys-yildiz-teknik-hazirlik-atlama/ytu-iys-formati-degisti-yeni-iys-sinav-formati) — the format-change account
- [YTÜ Kampüs — YTÜ Hazırlık Sistemi ve İYS Formatı Değişti](https://www.ytukampus.com/konu/ytu-hazirlik-sistemi-ve-iys-formati-degisti/) — 50 + 50, 25 barrier, listening 15 → 25 with note-taking
- [konusarakogren — YTÜ hazırlık atlama](https://www.konusarakogren.com/blog/ingilizce-hazirlik-atlamayildiz-teknik-universitesi/) — sessions and the 60 pass mark
- [akademik.com.tr — YTÜ İYS](https://www.akademik.com.tr/yildiz-teknik-universitesi-hazirlik-atlama-kursu) — the "15 grammar + 15 vocabulary" account that fits nothing else
- [İstanbul Dil Akademisi — YTÜ İYS kelime listesi](https://istdilakademisi.com/materyal/ytu-ingilizce-yeterlilik-sinavi-iys-kelimeleri) and [phrasal verbs](https://istdilakademisi.com/materyal/ytu-iys-kelime-listesi-phrasal-verbs)

**Word lists and vocabulary research** *(all except NGSL/NAWL already
cited in `docs/research/vocabulary.md`)*
- [Coxhead (2000). A New Academic Word List. *TESOL Quarterly* 34(2)](https://onlinelibrary.wiley.com/doi/abs/10.2307/3587951)
- [Gardner & Davies (2014). A New Academic Vocabulary List. *Applied Linguistics* 35(3)](https://academic.oup.com/applij/article/35/3/305/146569)
- [Browne, Culligan & Phillips — the New Academic Word List](https://www.newgeneralservicelist.com/new-academic-word-list) and [the NGSL](https://www.newgeneralservicelist.com/new-general-service-list); [EAP Foundation summary of NAWL coverage](https://www.eapfoundation.com/vocab/academic/nawl/)
- [Nation (2006). How Large a Vocabulary Is Needed for Reading and Listening?](https://www.researchgate.net/publication/239928724_How_Large_a_Vocabulary_Is_Needed_for_Reading_and_Listening)
- [Laufer & Ravenhorst-Kalovski (2010). *Reading in a Foreign Language* 22(1)](https://files.eric.ed.gov/fulltext/EJ887873.pdf)
- [Schmitt & Zimmerman (2002). Derivative Word Forms: What Do Learners Know? *TESOL Quarterly* 36(2)](https://onlinelibrary.wiley.com/doi/abs/10.2307/3588328)
- [Garnier & Schmitt (2015). The PHaVE List. *Language Teaching Research* 19(6)](https://journals.sagepub.com/doi/10.1177/1362168814559798)

**In this repository — measured, not cited**
- `docs/exam-spec.md` — the only primary source; 40 items × 1.5, four vocabulary items in ~100 points
- `docs/research/vocabulary.md` §1.2, §2.1–2.4, §3.1–3.3, §5.1, §6, §7 — the frame this document extends and, in two places, contradicts
- `docs/agents/kickoff-vocabulary.md` — the twelve sets and their four extra rules
- `docs/agents/drafts/academic-verbs/questions.json`, `docs/agents/drafts/academic-nouns-adjectives/questions.json` — 24 items each, `optionNotes` throughout
- `docs/exam/wordlists/elementary-2023-2024.json` — 30 groups, 1,126 entries; group names and order compared against Bilkent's published list in §2.2
- `tools/extract-wordlist.mjs`, `tools/extract-wordlist.py` — written for the four-column thematic layout; the six-column family layout needs a second row model
- `tools/validate-content.mjs:36` — `OPTIONS_PER_QUESTION = 4`, used as both min and max
- `js/storage.js` — `MIN_ITEMS_FOR_WEAK_CLAIM = 6` against 193 questions in 48 categories (4.02 each)
- `docs/roadmap.md` — 8–10 items per category for mastery, 15–20 for adaptive
- `docs/content-review.md` — 16 of 72 items with a second defensible answer; three of the first six rewrites rejected
