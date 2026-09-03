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
app connect them: a learner who gets `"Perfect Aspects"` wrong on a test
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

A lesson is a short, paged, interactive walkthrough — closer to a textbook
section than a slide. It is a list of **steps** the learner moves through
one at a time.

```json
{
  "id": "tenses-l1",
  "order": 1,
  "category": "Present Simple vs Present Continuous",
  "title": "Rutin mi, şu an mı?",
  "summary": "Aynı fiilin iki hâli arasında seçim yaparken hangi sinyallere bakacağını öğren.",
  "steps": [ "..." ]
}
```

| Field | Notes |
| --- | --- |
| `id` | Unique; starts with `<topicId>-`. Progress is stored against it, so **never reuse or renumber an id** — that would silently reassign someone's progress to a different lesson. |
| `order` | Integers `1..n` within the topic, no gaps or duplicates. Sets the syllabus order. |
| `category` | From the topic's taxonomy, verbatim. |
| `title` | **Turkish**, learner-facing. The category is the grammar label; the title is the lesson's name. |
| `summary` | **Turkish**, one sentence. Shown on the lesson index, so it should say what the learner will get out of it. |
| `steps` | Non-empty. **At least one step must be a `check`** — a lesson without a question is a slideshow, and the validator rejects it. |

### Step type: `read`

```json
{
  "type": "read",
  "heading": "İki formun görevi farklı",
  "body": "Present Simple bir eylemin **genel olarak** doğru olduğunu söyler.\n\nPresent Continuous ise eylemin **şu anda** sürdüğünü söyler.",
  "examples": [
    { "sentence": "Water boils at 100 °C.", "note": "Değişmeyen gerçek → Present Simple" }
  ]
}
```

- `heading` — short, Turkish.
- `body` — Turkish. Paragraphs are separated by a blank line (`\n\n`).
  The only inline markup is `**bold**`, for the grammar form under
  discussion; markers must be balanced.
- `examples` — optional. Each is a clean, **isolated** English `sentence`
  (much simpler than a test paragraph — this is teaching, not testing)
  plus a short `note` naming the form and why it applies.

### Step type: `table`

```json
{
  "type": "table",
  "heading": "Sinyal kelimeler",
  "columns": ["Present Simple", "Present Continuous"],
  "rows": [
    ["every day, usually, often", "now, at the moment"]
  ]
}
```

Best used for the side-by-side signal-word comparisons that make a
contrast concrete. At least 2 columns; every row must have exactly as many
cells as there are columns.

### Step type: `check`

```json
{
  "type": "check",
  "prompt": "Right now, the students ____ in the exam hall.",
  "options": ["sit", "are sitting"],
  "correctIndex": 1,
  "explanation": "\"Right now\" konuşma anını işaret ediyor, bu yüzden Present Continuous."
}
```

An inline question the learner must answer before moving on. Not scored
and not recorded — it exists to make the lesson stick, not to grade.

- `prompt` — an English cloze sentence with at most one `____` blank, or a
  Turkish question about forms (`"Hangi cümle doğru?"`). Never more than
  one blank.
- `options` — **2 to 4** distinct strings. Two options is often the
  strongest choice right after teaching a binary contrast.
- `explanation` — Turkish. Shown after answering, either way. No `tip`
  here; the lesson has already stated the rule.

### Shape of a good lesson

The six Tenses lessons follow a pattern worth copying:

1. `read` — what the forms actually do, with 2–3 examples.
2. `table` — the signal words side by side.
3. `check` — a quick binary check on what was just taught.
4. `read` — the trap: the exception, or the case learners over-apply.
5. `check` — a harder 4-option check covering the trap.
6. `read` — **"Sınavda ne yaparsın"**: the concrete scanning procedure to
   use on a real exam question.

Five to seven steps is the right size. A lesson should be finishable in a
few minutes; split anything longer into two lessons.

---

## Before you hand content over

```bash
npm run validate    # schema, cross-file consistency, content bugs
npm test            # the app's own unit tests
```

`npm run validate` must print `✓ Content validation passed`. Warnings are
advisory but are usually worth fixing — a "paragraph is only N words"
warning almost always means the question is too easy for the real exam.
