# `optionNotes` — Modals

2026-09-04. Scope: `data/modals/modals.json` only.

**72 notes written** — three per item, on all 24 items, covering every wrong
option. No note on any key. Longest is 143 characters (t1 `have to`, t6
`should`), shortest 89, median 127; 71 of 72 sit between 100 and 143. No note
is repeated. `npm run format && npm run check` clean — 0 errors, 0 warnings.

## What the notes turn on

Modals fail on **strength**, not on form, and the notes were written to name
exactly one of the three strengths the lessons separate:

- **zorunluluk** — who imposes it (`must` = konuşmacının kendi koyduğu,
  `have to` = dışarıdan gelen kural), and, in the negative, whether it is a
  **yasak** (`mustn't`) or a **gereksizlik** (`don't have to`, `needn't`).
- **izin / rica**, and its tone ladder (gündelik · kibar · resmî).
- **çıkarım** on the kesinlik skalası — kanıta dayanan kesinlik (`must`),
  imkânsızlık (`can't`), zayıf ihtimal (`might` / `could`) — plus `should`,
  which the lesson defines as **beklenti**, not çıkarım.

Every note uses those words, which are the lessons' own. The recurring shape
is: what the option would assert here, then the one clause of *this* paragraph
that refuses it — `nobody is forcing me`, `strictly forbidden`, `she'll provide
printed copies`, `I'm not sure yet`, `always this crowded`, `I just saw her
car leaving`, `nothing depends on it`, `she won't accept it at all`, `when she
was only five`, `despite the terrible traffic`, `once you finish this course`.

Only two notes argue form rather than meaning, because in those two options
form is what decides: **t13 `might`** (bare `might` cannot take a V3 — the
pattern is modal + have + V3) and **t20 `mustn't have`** (not a pattern the
language builds). Everything else is a strength argument.

## Items where writing the notes showed the item is weak

Reported, not fixed.

### Two distractors that are one distractor

- **t3 — `don't have to` / `don't need to` / `may not need to`.** All three
  options say the same thing: gereklilik yok. `don't have to` and `don't need
  to` are exact synonyms — the corpus says so itself, in the `tip` on **t4**:
  "'don't have to' veya 'don't need to' kullanılır". `may not need to` is the
  same idea with a hedge on top. So the item has one distractor written three
  times, and a learner who knows only that `mustn't` = yasak can answer it
  without reading the options. The three notes had to be made distinct
  sentences (serbestlik vs ihtiyaç vs hedged gereksizlik) for a difference the
  item does not really contain.
- **t20 — `don't have to` / `needn't`.** `needn't` *is* `don't have to` with a
  modal auxiliary; the lesson does not distinguish them and neither can a
  note. The item's third option, `mustn't have`, is not a form at all. So the
  learner faces one real distractor plus one duplicate plus one impossible
  string, which is the thinnest option set in the topic.
- **t11 — `must` / `have to`.** Both assert near-certainty and both are
  defeated by exactly the same clause (`but I'm not really expecting anything
  today`). They differ in register, not in what the paragraph rejects.
  Compounding it: `It has to be the courier` is standard deduction in American
  English, so the item's implicit claim — that `have to` cannot do çıkarım —
  is not the reason it fails. The note argues strength instead, which is the
  honest ground.

### An option a competent teacher would accept

- **t2 — `must`.** "According to the university's regulations, every student
  must submit a health report" is entirely natural, and is close to how a
  regulation is worded in its own voice. The must/have-to source-of-obligation
  split is a teaching heuristic, not a rule that makes `must` wrong. The item's
  own `explanation` concedes it — "Anlamca 'must'a yakın olsa da … sınavlarda
  'have to' tercih edilir" — which is an argument from exam convention, not
  from the paragraph. This is the weakest key in the topic; the note had to be
  written as "kuralı koyan üniversitenin yönetmeliği", which is true but does
  not make `must` ungrammatical.
- **t19 — `must`.** "As the eldest sibling, she must set a good example" is
  acceptable English and carries the same responsibility reading the key does.
  The item asks the learner to prefer `ought to` on tone alone, and the
  `explanation` never argues against `must` at all — it rules out only `had
  better`. If the item is revised, either the paragraph needs something that
  actively excludes a speaker-imposed obligation, or `must` should leave the
  set.
- **t6 — `must`.** Read as necessity rather than certainty, "The meeting must
  be postponed to next week if the director doesn't manage to finish reviewing
  the budget" is natural: the conditional supplies the necessity. The item
  intends an ihtimal frame and the `explanation` treats `must` only as
  kesinlik. The note argues kesinlik-vs-koşul, which holds under the intended
  reading, but the necessity reading is not excluded by anything in the
  paragraph.
- **t18 — `ought to`** is a softer case: not acceptable-as-equal, but not
  wrong-in-kind either. It is a genuine tavsiye modal that merely lacks the
  urgency the threat clause calls for. The note says that, and only that.

### A category whose own contrast is never tested

- **Can vs Could vs May vs Might (t5–t8).** The lesson's two axes are the
  politeness ladder (`can` · `could` · `may`) and the ihtimal pair (`may` vs
  `might`). Neither axis appears in any option set. t5's distractors are
  `Must` / `Should` / `Will`; t8's are `Must` / `Shall` / `Need`; t6 puts `may`
  against `must` / `should` / `can`; t7 puts `might` against `must` / `have to`
  / `can't`. In all four, the key is the only option that can do the job at
  all, so the learner never has to choose between two modals that both can —
  which is the entire lesson. Every note in this category ends up arguing "bu
  kelime izin/ihtimal işi yapmaz", never "bu ton yanlış" or "bu ihtimal fazla
  güçlü". A category-spec-level finding, invisible inside any one item.

### Mixed failure modes inside one item

- **t13 — `might`.** Two options fail on meaning (çıkarımın yönü) and the third
  fails on form: `might` cannot take `forgotten` without `have`. A learner who
  picks it learns nothing about the kesinlik skalası the item is teaching. The
  `explanation` already flags this, so it is a known shape rather than a
  surprise — but it means the item really offers two meaning distractors, not
  three.

### Option recycling across a category

- **Must vs Can't vs Might/Could (t9–t12)** draws all four items from the same
  small pool (`must`, `might`, `can't`, `should`, plus one `mustn't` and one
  `have to`). `should` appears as a distractor in both t9 and t12 and is
  defeated by the same property both times (beklenti, not kanıt); `must` is
  the wrong option in t10 and t11 and `can't` in t9 and t11. The notes are
  worded differently and are anchored to different evidence clauses, but the
  reasoning a learner meets is the same three sentences four times. Not a
  defect in any single item; worth knowing before the category is extended.

## Contradictions with existing `explanation` / `tip`

None. Three places where the note had to go past what the item says:

- **t2, t19, t6** — the `explanation` in each argues only against the options
  it considers close, and is silent on the one a teacher would accept
  (`must`, twice; `can` in t19). The notes cover them anyway, which is what
  the field is for, but they are covering a gap in the item's own reasoning.
- **t20** — the `explanation` calls `mustn't have` "standart bir yapı
  değildir" and stops. The note says why the string cannot be built at all
  (`mustn't` does not combine with `have + V3`), which is the fault the
  learner can act on, and matches the lesson's fourth `pitfall`.
- **t8 `Shall` / `Need`** — neither appears in the lesson or in the item's
  `explanation`, which discusses only `Must`. The notes name what each word
  actually does (`Shall I / Shall we` teklif; `need` gereklilik) rather than
  calling them wrong.

## Wording conventions followed

English forms are quoted with single quotes, matching every `explanation` and
`tip` in this file. No `**bold**` — the shipped topics this file sits beside
(`relative-clauses`, `quantifiers`) do not use it in notes, and a 120-character
sentence does not need a second level of emphasis. No note restates the key,
none refers to another option, and none says "yanlış": each says what the
option would mean here and which clause of the paragraph refuses it.
