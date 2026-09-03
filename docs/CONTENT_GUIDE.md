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
| `categories` | no | Must match the topic's question categories exactly. Shown as preview chips on the topic card. |
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
  option fits *this* context, **and** why the closest wrong option doesn't.
  Never a one-liner.
- **`tip`** — Turkish, a short standalone rule the learner can carry to
  other questions. Distinct from the explanation: the explanation is
  situational, the tip is transferable.

---

## Lessons (Eğitim tab)

A lesson is authored as a **short article**, not as a sequence of screens.
You write named sections; the app decides how they are paced into the
reader's steps and where to slot in check questions (see
`js/education.js`). That split is deliberate — presentation can change
without touching a single content file, and it has already changed more
than once.

One lesson per category, in the order they should be studied.

```json
{
  "category": "Present Perfect vs Past Simple",
  "intro": "Bu ikisi, sınavlarda en sık karıştırılan zaman çiftlerinden biridir...",
  "form": "Past Simple — Olumlu: S + V2 → 'She visited.' ... Present Perfect — Olumlu: S + have/has + V3 → 'She has visited.'",
  "meaning": "Past Simple, geçmişte belirli bir zamanda başlayıp biten bir olayı anlatır...",
  "usage": "Past Simple 'yesterday, last year, in 2020' gibi belirli bir geçmiş nokta veren ifadelerle kullanılır...",
  "examples": [
    { "sentence": "I visited Paris last summer.", "note": "Belirli geçmiş zaman → Past Simple" },
    { "sentence": "I have visited Paris three times.", "note": "Ne zaman önemli değil → Present Perfect" }
  ],
  "commonMistakes": [
    {
      "wrong": "I have visited Paris last summer.",
      "right": "I visited Paris last summer.",
      "why": "'Last summer' belirli bir geçmiş zaman ifadesidir; belirli zaman ifadeleriyle Present Perfect kullanılmaz."
    }
  ],
  "recap": "Belirli bir geçmiş zaman ifadesi görürsen Past Simple; since/for/already/yet gibi bir ifade görürsen Present Perfect."
}
```

| Field | Language | Notes |
| --- | --- | --- |
| `category` | English | From the topic's taxonomy, verbatim. Unique within the topic. |
| `intro` | Turkish | Two or three sentences: why this pair is worth a lesson, ideally naming the confusion a Turkish speaker actually has. Also used as the lesson's preview line on the index, so the first sentence has to stand alone. |
| `form` | mixed | The structural patterns — `S + have/has + V3 → 'She has visited.'` — positive, negative and question for each form. Rendered in monospace, so keep it terse and parallel. |
| `meaning` | Turkish | What each form actually *says*. Not usage rules yet: the idea behind the form. |
| `usage` | Turkish | When each is used in practice — above all the signal words that decide it in an exam. |
| `examples` | English + Turkish notes | 4–6 clean, **isolated** sentences (much simpler than a test paragraph — teaching, not testing). Each `note` names the form and why: `"Alışkanlık → Present Simple"`. Cover both/all forms in the contrast. |
| `commonMistakes` | English + Turkish `why` | 2–3 entries of `{ wrong, right, why }`. The most valuable part of the lesson: real errors a Turkish speaker makes, not invented ones. `wrong` and `right` should differ in exactly the thing being taught. |
| `recap` | Turkish | One or two sentences the learner could carry into the exam — a decision procedure ("see X → use Y"), not a summary of the article. |

Every field is required. There is no `id` and no `order`: the id is
derived from the topic and the category (`tenses-present-perfect-vs-past-simple`),
and the order is the array order. That means a content file carries no
bookkeeping a contributor could renumber by accident — but it also means
**renaming a category renames the lesson**, and a learner's progress for
it starts over. Renaming a category is a taxonomy change: it has to be
made in the questions, the manifest and the lesson together.

### Check questions

You do not author them. The reader pulls check cards from the questions
that share the lesson's category, so a category never needs two parallel
bodies of content kept in sync. They are not scored, not recorded, and
never block progress — an unanswered check simply reads "Atla".

The practical consequence for authoring: **a category's questions need to
work as teaching, not only as testing**, since some of them will be met
right after the rule is explained rather than in an exam run.

---

## Before you hand content over

```bash
npm run validate    # schema, cross-file consistency, content bugs
npm test            # the app's own unit tests
```

`npm run validate` must print `✓ Content validation passed`. Warnings are
advisory but are usually worth fixing — a "paragraph is only N words"
warning almost always means the question is too easy for the real exam.
