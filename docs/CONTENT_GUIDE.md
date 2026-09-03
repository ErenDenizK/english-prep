# Content guide

Everything in this app that a learner reads is data, not code. Adding a
topic, a lesson, or a question never requires touching JavaScript — you
write JSON and the app picks it up.

This file is the authoritative schema. `tools/validate-content.mjs`
enforces it; run `npm run validate` before handing content over, and treat
its output as the definition of "done".

---

## Layout

```
data/manifest.json          the topic index — what exists, and where
data/<topic>/<topic>.json   one file per topic: its lessons and questions
```

A topic file carries **both** its lessons (Eğitim tab) and its questions
(Test tab), because they share one thing that must never drift apart: the
**category taxonomy**.

---

## The category taxonomy

A *category* is the specific grammar contrast being taught or tested — for
example `"Present Perfect vs Past Simple"`, not `"Tenses"`.

One list of category names serves a whole topic. Both a lesson and a
question declare which category they belong to, and that is what lets the
app connect them — including pulling a lesson's check cards from that
category's questions: a learner who gets `"Perfect Aspects"` wrong on a test
sees a link straight to the `"Perfect Aspects"` lesson, from the results
screen and from their profile.

Three rules, all enforced by the validator:

1. Category names are written in **English** (they're grammar terms the
   learner needs to recognize on the real exam) and are used verbatim —
   no rephrasing, no pluralizing, no case changes.
2. Every lesson's `category` must be one that questions in the same topic
   actually use.
3. `manifest.json`'s `categories` array must match the set of categories
   used by that topic's questions exactly.

Real exam difficulty comes from confusing *similar* forms, so a category
should name a confusable pair or triad wherever the grammar allows it
(`"Present Simple vs Present Continuous"`), not a single form in isolation.

---

## Language rules

| What | Language | Why |
| --- | --- | --- |
| Practice sentences, example sentences, answer options | English | That's the exam. |
| Explanations, tips, lesson prose, summaries | Turkish | Teaching should happen in the learner's own language. |
| Category names, topic titles | English | Grammar terms to be recognized, not translated. |
| UI strings (in the HTML/JS, not here) | Turkish | The audience. |

---

## `data/manifest.json`

```json
{
  "topics": [
    {
      "id": "tenses",
      "title": "Tenses",
      "tier": "foundations",
      "file": "data/tenses/tenses.json",
      "questionCount": 24,
      "lessonCount": 6,
      "contentVersion": 1,
      "categories": ["Present Simple vs Present Continuous", "..."]
    }
  ]
}
```

| Field | Required | Notes |
| --- | --- | --- |
| `id` | yes | Lowercase slug. Prefixes every question and lesson id in the topic. |
| `title` | yes | English. Shown on topic cards. |
| `tier` | yes | One of the ids in `js/tiers.js`. A display grouping only — topics can be authored in any order. |
| `file` | live topics | Path to the topic file. |
| `questionCount` | live topics | Must equal the number of questions in the file. |
| `lessonCount` | no | Must equal the number of lessons in the file, if given. |
| `contentVersion` | no | Integer, starts at `1`. **Bump it whenever you add or materially change questions.** That's what raises the "Yeni sorular eklendi" badge on the topic card; starting a test clears it. Omit the field to opt a topic out of freshness tracking. |
| `categories` | no | Must match the topic's question categories exactly. |
| `lessons` | generated | **Do not author or edit this.** `npm run format` copies each lesson's `category` and `summary` into it, in order, and the validator fails if it drifts. It exists so the lesson list, the Test tab, Profil and the results screen can be built from this file alone — before it, drawing a list of eighteen lesson names downloaded 141 KB of question data to show 1.7 KB of information. |
| `comingSoon` | no | `true` marks a roadmap teaser: a disabled card, excluded from the mixed-test pool. Such an entry must **not** declare `file`, `questionCount` or `lessonCount`. Drop the flag once real content exists. |

---

## Topic file

```json
{
  "topicId": "tenses",
  "title": "Tenses",
  "level": "B2-C1",
  "note": "Free-text note about the set.",
  "lessons": [ "..." ],
  "questions": [ "..." ]
}
```

`topicId` and `title` must match the manifest entry.

---

## Questions (Test tab)

```json
{
  "id": "tenses-t1",
  "category": "Present Simple vs Present Continuous",
  "paragraph": "Every morning, Elif ____ to the university library before her first class starts. She says the quiet hours right after opening are the only time she can truly concentrate.",
  "options": ["goes", "is going", "has gone", "went"],
  "correctIndex": 0,
  "explanation": "'Every morning' alışkanlık bildiren bir zaman ifadesi, bu yüzden Present Simple kullanılır. 'is going' anlık bir eylem için kullanılırdı, ama burada tekrar eden bir alışkanlıktan bahsediliyor.",
  "tip": "Alışkanlık bildiren zaman zarfları (every day, usually, often) Present Simple'ı tetikler."
}
```

- **`id`** — unique across the whole app; start it with `<topicId>-`.
- **`category`** — from the topic's taxonomy, verbatim.
- **`paragraph`** — 1–3 sentences of realistic context with **exactly one**
  blank, written as exactly four underscores (`____`). A single
  decontextualized sentence is too easy and unlike the real exam: give the
  blank enough surrounding context (time expressions, cause and effect,
  narrative sequence) that choosing correctly actually requires reading
  the passage.
- **`options`** — exactly 4 strings, all distinct, usually different forms
  of the same verb. Order doesn't matter; the app shuffles them per
  attempt. The wrong options must be genuinely tempting.
- **`correctIndex`** — 0-based index into `options`.
- **`explanation`** — Turkish, always a full explanation: why the correct
  option fits *this* context, **and** why the closest wrong option doesn't
  — naming that option in its own words, so the learner who chose it is
  told what they chose. Never a one-liner. Three or four sentences is the
  shape; the validator warns under 40 characters and over 600, because
  past that it is the lesson again, in the one place a learner is least
  willing to read it.

  This is the field that decides whether a wrong answer teaches anything.
  Two thirds of the first corpus argued only for the key, which meant the
  learner who picked the distractor was told what was right and never told
  why what they chose was wrong.
- **`tip`** — Turkish, a short standalone rule the learner can carry to
  other questions. Distinct from the explanation: the explanation is
  situational, the tip is transferable.

---

## Restatement questions — the exam's "closest meaning"

A second item type, and the only one so far. It exists because it is a
quarter of the real paper: fifteen of Session I's sixty points
(`docs/exam-spec.md`).

```json
{
  "id": "closest-meaning-t1",
  "type": "restatement",
  "category": "Third Conditional",
  "sentence": "If the shipment had left on Monday, it would already have reached the depot in Ankara.",
  "options": [
    "The shipment did not leave on Monday, so it has not reached the depot yet.",
    "The shipment left on Monday and reached the depot as planned.",
    "The shipment will reach the depot if it leaves on Monday.",
    "The shipment reached the depot even though it left after Monday."
  ],
  "correctIndex": 0,
  "explanation": "...",
  "tip": "..."
}
```

Two fields differ from a cloze item, and nothing else does:

- **`type`** — `"restatement"`. Omitted means `"cloze"`, so every question
  written before this type existed is still valid, untouched.
- **`sentence`** replaces `paragraph`, and carries **no blank**. A
  restatement with a `paragraph`, or a cloze with a `sentence`, is a
  validator error: the blank is the whole difference between the two
  shapes, and mislabelling one as the other hides that.

`options` are four complete sentences rather than four forms of one verb.
`explanation` and `tip` work exactly as above.

### What makes a restatement item good

The exam's own distractors are the model, and they are **grammatically
fluent**: every option is a well-formed English sentence, and the wrong
ones are wrong about *meaning*. The sample paper's distractors do one of
these:

| Move | What it does |
| --- | --- |
| Reverse the causal direction | *X because Y* becomes *Y because X* |
| Change the modality | a certainty becomes a possibility, an obligation becomes advice |
| Swap what is compared | *A is less advanced than B* becomes *B is less advanced than A* |
| Move the event in time | a completed result becomes a future one |
| Drop or add a condition | an unfulfilled past becomes a real future one |

An option that is wrong because it is *ungrammatical* is not a
restatement distractor at all — it belongs in a cloze item, and here it is
a dead option a learner discards without reading.

The category names what the item **turns on**, not that it is a
restatement: `Third Conditional`, `Passive Reporting`, `Modal Perfects`.
That is what lets a wrong answer link to a lesson, which is the same rule
the whole taxonomy runs on.

### What the validator checks

| Rule | Level |
| --- | --- |
| `type` is `cloze`, `restatement`, or absent | error |
| a restatement has `sentence` and not `paragraph` | error |
| a cloze has `paragraph` and not `sentence` | error |
| `sentence` contains no `____` | error |
| `sentence` under 10 words | warning — nothing in it to restate |
| an option under 4 words | warning — not a paraphrase of anything |

The corpus-wide checks (near-duplicate stems, scenario over-use, the
answer appearing in the stem) all read whichever field the type uses, so
they apply unchanged.

---

## Lessons (Eğitim tab)

A lesson is **a page you scroll**, built out of typed blocks. Not a
sequence of screens, and no longer an article of named prose sections.

That change came from watching the article version on a phone. Its
`meaning` and `usage` were three-to-five-sentence Turkish paragraphs, and
the parts that actually win exam marks — the contrast between the two
forms, the signal words, the decision procedure — were buried inside them
as clauses. A block says what it *is*, so the app can give each one the
presentation it deserves: a contrast reads as a contrast, a signal word
reads as a signal word.

The blocks are **semantic, not presentational**. `contrast` means "these
two forms are being set against each other", not "draw two columns". How
that looks is still entirely the app's business, and it will change again.

One lesson per category, in the order they should be studied.

```json
{
  "category": "Present Perfect vs Past Simple",
  "summary": "Geçmiş kapandı mı, şimdiye mi uzanıyor?",
  "blocks": [
    { "type": "text", "body": "Bu ikisi sınavlarda en sık karıştırılan çifttir..." },
    { "type": "contrast", "sides": [
      { "label": "Past Simple", "gloss": "Belirli bir zamanda başlayıp bitmiş...", "example": "I visited Paris last summer." },
      { "label": "Present Perfect", "gloss": "Ne zaman olduğu önemli değil...", "example": "I have visited Paris three times." }
    ]},
    { "type": "check" }
  ]
}
```

| Field | Language | Notes |
| --- | --- | --- |
| `category` | English | From the topic's taxonomy, verbatim. Unique within the topic. |
| `summary` | Turkish | **One line, at most 70 characters.** It is the lesson's line on the index, where it is clipped to a single line — so write one, rather than a sentence that will be cut. Ideally the question the lesson answers: `"Geçmiş kapandı mı, şimdiye mi uzanıyor?"` |
| `blocks` | — | 6–14 blocks. Fewer is a stub; more is an article again. |

There is no `id` and no `order`: the id is derived from the topic and the
category (`tenses-present-perfect-vs-past-simple`), and the order is the
array order. So a content file carries no bookkeeping anyone could
renumber by accident — but it also means **renaming a category renames the
lesson**, and a learner's progress for it starts over. Renaming a category
is a taxonomy change: questions, manifest and lesson move together.

### The seven block types

Seven, and there will not be an eighth without a reason. A block
vocabulary decays the same way an icon set does: one more "just for this
lesson" at a time.

#### `text` — the connective tissue

```json
{ "type": "text", "body": "Türkçe'de 'gidiyorum' dediğinde..." }
```

Turkish. **At most 400 characters**, and the validator enforces it — a
`text` block that grows past that is the wall of prose this schema exists
to break up, and what it is really carrying is a `contrast` or a
`decision` that has not been written as one yet. Blank-line-separated
paragraphs are allowed inside it; `**bold**` works.

#### `contrast` — two or three forms set against each other

```json
{ "type": "contrast", "heading": "Aradaki fark",
  "sides": [
    { "label": "Past Simple", "gloss": "Geçmişte belirli bir zamanda başlayıp bitmiş; bugünle bağı vurgulanmıyor.", "example": "I visited Paris last summer." },
    { "label": "Present Perfect", "gloss": "Ne zaman olduğu belirsiz ya da önemsiz; önemli olan gerçekleşmiş olması.", "example": "I have visited Paris three times." }
  ]}
```

2 or 3 `sides`. `label` is English (the form's name), `gloss` is Turkish
and **one or two sentences** — a gloss that runs longer is a `text` block
wearing a costume. `example` is optional English but nearly always worth
having: a contrast the learner can see is worth three they have to imagine.
`heading` is optional Turkish.

This is the highest-value block in the schema, because every category in
this app is a confusable pair. If a lesson has no `contrast`, ask why.

#### `forms` — the structural patterns

```json
{ "type": "forms", "rows": [
  { "form": "Past Simple", "use": "Olumlu", "pattern": "S + V2", "example": "She visited." },
  { "form": "Past Simple", "use": "Olumsuz", "pattern": "S + didn't + V", "example": "She didn't visit." },
  { "form": "Present Perfect", "use": "Olumlu", "pattern": "S + have/has + V3", "example": "She has visited." }
]}
```

Deliberately **flat**: one row per pattern, grouped by `form` when it is
drawn. Nesting this by form would put three levels in a hand-written JSON
file, which is how content files acquire errors a validator has to catch
instead of a shape that prevents them.

`form` and `pattern` are English, `use` is Turkish, `example` is English.

**`use` is a slot, not a polarity.** `Olumlu` / `Olumsuz` / `Soru` is the
obvious filling when the block is a conjugation table, and it is not a
closed set: where the block is a *pattern* table — four ways of talking
about the future, six signal words and where each one sits in the sentence
— `use` names what the row is for (`Kesinleşmiş plan`, `Başlangıç
noktası`). Both are legitimate uses of the block. What matters is that the
rows in one block answer the same question, so the reader can line them
up; a block mixing polarities with purposes is two blocks.

Do **not** invent a row to square off the grid. `must` has no past,
`might` takes no requests: where a form genuinely lacks a row the other
forms have, the gap is the teaching, and filling it is a lie about
English.

Keep `pattern` terse and parallel across rows: it is set in the serif and
read as a formula.

#### `examples` — sentences with a reason

```json
{ "type": "examples", "items": [
  { "sentence": "I visited Paris last summer.", "note": "Belirli geçmiş zaman → Past Simple" },
  { "sentence": "Have you ever been to Japan?", "note": "Hayat boyu deneyim sorusu → Present Perfect" }
]}
```

3–6 clean, **isolated** English sentences — much simpler than a test
paragraph, because this is teaching, not testing. Every `note` is Turkish
and names the form *and* why. Cover every side of the contrast.

#### `pitfall` — one real mistake, one block

```json
{ "type": "pitfall",
  "wrong": "I have visited Paris last summer.",
  "right": "I visited Paris last summer.",
  "why": "'Last summer' belirli bir geçmiş zaman ifadesidir; belirli zaman ifadeleriyle Present Perfect kullanılmaz." }
```

The most valuable thing in a lesson: a real error a Turkish speaker makes,
not an invented one. `wrong` and `right` must differ in **exactly** the
thing being taught and nothing else — the validator checks they are not
identical, but only an author can check they differ in the right place.
2–3 per lesson, as separate blocks.

#### `decision` — what to do when you see it

```json
{ "type": "decision", "heading": "Sınavda ne yapacaksın",
  "rules": [
    { "signals": ["yesterday", "in 2020", "two days ago"], "then": "Past Simple" },
    { "signals": ["since", "for", "already", "yet", "ever"], "then": "Present Perfect" },
    { "condition": "Olayın ne zaman olduğu hiç belirtilmemişse", "then": "Present Perfect" }
  ]}
```

The procedure the learner carries into the exam. Each rule has **exactly
one** of:

- `signals` — an array of English trigger words or phrases. Drawn as
  chips, because that is how they are met: scanned for, not read.
- `condition` — a Turkish sentence, for a rule no word list captures.

and `then` — English, and usually a form name (`Past Simple`), but a
lesson whose whole subject is *which word goes in the gap* decides a word,
and `then: "since"` is the right answer there. What `then` must be is the
thing the learner writes down, in English, spelled identically everywhere
it appears in one lesson. Where a rule genuinely admits more than one
answer — *Must vs Can't vs Might/Could* has branches that do — a slash
form (`"Might / Could"`) is the honest `then`; inventing a single name for
two forms is not.

A lesson should end on one of these, and it is the block a learner will
come back for.

**A signal that appears in both branches is worse than no signal.** `for`
looks like a Present Perfect trigger until you meet *I lived there for
five years* — what actually decides it is whether the period is still
open. When the honest answer is a condition rather than a word list, write
the condition. A trigger that holds two thirds of the time trains a habit
that fails on exactly the questions an exam uses to separate students.

#### `check` — a question, here

```json
{ "type": "check" }
```

Has no content, and that is the point. The reader fills it from the
questions that share the lesson's category — shuffled once per opening,
each `check` taking the next one, so a learner does not meet the same two
questions every time. If a lesson asks for more checks than the category
has questions, the extra blocks render as nothing. Checks are **not
scored, not recorded, and never block progress**.

Place 2–3 of them, and place them where the learner has just been given
something worth trying — after a `contrast`, after the `pitfall`s. A check
as the first block is a quiz, not a lesson. The validator warns if a
lesson asks for more checks than its category has questions.

The practical consequence for question authoring: **a category's questions
have to work as teaching, not only as testing**, since some will be met
right after the rule is explained rather than in an exam run.

### What the validator enforces

Every block type also takes an optional `heading` (Turkish) — a label for
the block, for the cases where the type alone does not say enough.

| Field | Required | Checked as |
| --- | --- | --- |
| `category`, `summary`, `blocks` | yes | error |
| `summary` over 70 characters | — | **error** |
| `text.body` | yes | error |
| `text.body` over 400 characters | — | **error** |
| `contrast.sides` (2 or 3) | yes | error |
| `contrast.sides[].label`, `.gloss` | yes | error |
| `contrast.sides[].example` | no | — |
| two sides sharing a `label` | — | error |
| `forms.rows` (≥2), `.form`, `.use`, `.pattern` | yes | error |
| `forms.rows[].example` | no | — |
| `examples.items` (≥3), `.sentence`, `.note` | yes | error |
| `pitfall.wrong`, `.right`, `.why` | yes | error |
| `wrong` identical to `right` | — | error |
| `decision.rules` (≥2), `.then` | yes | error |
| exactly one of `.signals` / `.condition` per rule | yes | error |
| any other property on a `check` block | — | error |
| an unknown block `type` | — | error |
| fewer than 6 or more than 14 blocks | — | warning |
| more than 6 `examples.items` | — | warning |
| no `contrast` block in a lesson | — | warning |
| no `check` block in a lesson | — | warning |
| more `check` blocks than the category has questions | — | warning |
| a `check` as the first block | — | warning |
| a `gloss` over 200 characters | — | warning |
| Turkish prose that does not look Turkish | — | warning |

Character counts are JavaScript string length — UTF-16 code units, so `ğ`,
`ş` and `İ` each count as one. An **unknown property** on any block other
than `check` is currently ignored rather than rejected; do not rely on
that, and do not invent fields.

Two things the validator deliberately does **not** check, because only an
author can: whether a `pitfall`'s `wrong` and `right` differ in exactly
the thing being taught, and whether a `decision`'s signals really decide.
Both are where a lesson is won or lost.

**`then` is not linked to anything.** Nothing requires a `decision` rule's
`then` to match a `contrast` side's `label` — a decision can name a form
the lesson never set against another. Keep the spelling identical across
one lesson anyway; the learner is matching strings by eye.

**`**bold**` works in every Turkish prose field** — `text.body`, `gloss`,
`note`, `why`, `condition`, `summary` — and it is the *only* inline markup
there is. `*single asterisks*` render as literal asterisks; so does
everything else. Blank-line-separated paragraphs are honoured in
`text.body` only; everywhere else a field is one paragraph.

That shortness is deliberate. The app builds every node and sets
`textContent` — there is no `innerHTML` anywhere in it — so authored
content can never inject markup whatever a content file contains, and the
price of that guarantee is one bold marker and no more.

### A shape that works

Not a template. It is where to start when nothing suggests otherwise, and
several of the Tenses lessons depart from it for good reasons: a category
with four forms rather than two carries two `contrast` blocks along its
two real axes, and a lesson that needs both of them before anything is
worth trying puts its first `check` after `forms` instead.

```
text        why this pair is worth a lesson, and the confusion a Turkish
            speaker actually has
contrast    the two forms, side by side
forms       the structural patterns
check
examples    sentences that show the contrast doing its work
pitfall     ×2–3, each its own block
check
decision    the procedure to carry into the exam
```

---

## What the validator checks about the content itself

Everything above is schema: shape, required fields, lengths. Four more
checks look at what the questions actually *say*, and three of them can
only be answered by reading the whole corpus at once. They live in
`tools/content-checks.mjs` and each has tests around its threshold in
`tests/content-checks.test.js`.

| Check | Level | What it means |
| --- | --- | --- |
| **The explanation names a wrong option** | warning, rolled up per topic | The guide asks an explanation to say why the key fits *and* why the closest wrong option doesn't. An explanation that never mentions any wrong option cannot be doing the second half. The check looks for the option's own text, so it catches the absence of the move, not the quality of it. |
| **Banned option forms** | error / warning | An invented `-ed` past of an irregular verb (`leaved`, `teached`, `runned`) is an **error**: it ships a non-word. Two options identical once case and spacing are ignored, and a multi-word correct answer that also appears in the paragraph, are warnings. |
| **Near-duplicate stems** | warning | Two questions anywhere in the corpus sharing 30% of their wording as token trigrams. Also: two questions in the *same category* with an identical set of options. |
| **Scenario over-use** | warning | A content word in three quarters of one category's paragraphs, or in 15% of the whole corpus. Function words and the grammar's own vocabulary are excluded, so `would` across a modals topic is not a finding. |

None of the four can tell a good question from a bad one. They exist to
catch the four defects that are invisible while you are writing a single
item and obvious once somebody counts.

---

## Before you hand content over

```bash
npm run format      # canonical formatting, and regenerates the lesson index
npm run validate    # schema, cross-file consistency, content bugs
npm test            # the app's own unit tests
```

**Run `npm run format` after every content edit.** It is what keeps the
manifest's generated lesson index in step with the topic files, and
`npm run validate` fails if you forget.

`npm run validate` must print `✓ Content validation passed`. Warnings are
advisory but are usually worth fixing — a "paragraph is only N words"
warning almost always means the question is too easy for the real exam.
