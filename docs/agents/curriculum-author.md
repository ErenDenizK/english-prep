# Brief: Curriculum author

> Paste this whole file into a fresh Claude session that has the
> `english-prep` repository, with the kickoff block filled in.

## Kickoff (fill this in before sending)

```
Topic id:      
Topic title:   
Tier:          
Level:         

Categories (use these names verbatim, do not add or rename):
  1. 
  2. 
  ...

Lessons: 1 per category, in the order listed above
```

---

## Your job

Write the `lessons` array for the topic above: the Eğitim tab's content.

The app is a static, mobile-first study aid for Turkish university
students sitting an English prep-school proficiency exam — YTÜ İYS and
similar, at B2–C1. They already know the paradigms; what costs them marks
is choosing between two forms that both look plausible under time
pressure. Every category in this app names such a pair or triad on
purpose. You are not writing a grammar reference. You are writing the
thing a student reads on a phone, on the bus, the week before the exam,
to stop getting one specific contrast wrong.

Read `docs/CONTENT_GUIDE.md` first — it is the authoritative schema, and
`tools/validate-content.mjs` enforces it. This brief tells you how to
write well against it; where the two ever disagree, the guide wins.

Deliver **one file**: `data/<topicId>/<topicId>.lessons.json`, containing
a single JSON array of lesson objects — one per category, in the
kickoff's order. Do not touch `data/manifest.json`, the app code, or the
topic's questions; a separate session is writing those.

## A lesson is a page of blocks, not an article

This is the part that changed, and it changed for a reason worth
carrying with you.

Lessons used to be authored as an article: named prose sections called
`intro`, `meaning`, `usage`, `recap`. What that produced, read on a
phone, was three-to-five-sentence Turkish paragraphs in which the parts
that actually win exam marks — the contrast between the two forms, the
signal words, the procedure to run when you meet the question — sat
buried as clauses in the middle of a paragraph.

So a lesson is now **a page you scroll, built out of typed blocks**. Each
block declares what it *is*, and the app gives it the presentation it
deserves: a contrast is drawn as a contrast, signal words are drawn as
chips because that is how they are met — scanned for, not read.

The blocks are semantic, not presentational. `contrast` means "these two
forms are being set against each other", not "draw two columns". How any
of it looks is the app's business and will change again, so do not write
around an imagined layout.

The failure this schema exists to prevent has one shape: an author who
reaches for `text` every time has written the article again, in JSON. If
your lesson is five `text` blocks and an `examples`, you have not used
the schema — you have escaped it.

## Shape

```json
{
  "category": "…",
  "summary": "…",
  "blocks": [ … ]
}
```

`category` is English, copied verbatim from the kickoff, once per lesson.

`summary` is Turkish, **one line, at most 70 characters**. It is the
lesson's line on the index and is clipped to a single line there, so
write a line, not the first sentence of a paragraph. The best ones are
the question the lesson answers: `"Geçmiş kapandı mı, şimdiye mi
uzanıyor?"`.

`blocks` is 6–14 blocks. Below six is a stub; above fourteen is an
article again.

There is no `id` and no `order`: the id is derived from the topic and the
category, and the order is the array order.

## The seven blocks, and when to reach for each

### `text` — connective tissue only

```json
{ "type": "text", "body": "Türkçede 'gidiyorum' dediğinde bunun alışkanlık mı yoksa şu an mı olduğunu bağlamdan anlarız; İngilizce bu ikisini kesin çizgilerle ayırır." }
```

Turkish, at most 400 characters, and the validator enforces the limit.

Reach for it to open a lesson — to name the confusion this pair causes a
Turkish speaker specifically, often because Turkish makes a distinction
English doesn't or the reverse — and occasionally to hinge one part of
the page to the next. That is close to the whole list.

If a `text` block is straining against 400 characters, do not trim it.
Ask what it is really carrying. Almost always the answer is a `contrast`
or a `decision` that has not been written as one yet, and the fix is to
promote it, not to shorten it.

### `contrast` — the two or three forms set against each other

```json
{ "type": "contrast", "heading": "Aradaki fark",
  "sides": [
    { "label": "Past Simple", "gloss": "Geçmişte belirli bir zamanda başlayıp bitmiş; bugünle bağı vurgulanmıyor.", "example": "I visited Paris last summer." },
    { "label": "Present Perfect", "gloss": "Ne zaman olduğu belirsiz ya da önemsiz; önemli olan gerçekleşmiş olması.", "example": "I have visited Paris three times." }
  ]}
```

Two or three sides. `label` is the English form name, `gloss` is Turkish
and one or two sentences, `example` is an English sentence and optional
in the schema but nearly always worth having.

This is the highest-value block you have, because every category in this
app *is* a confusable pair. Every lesson should have one, and it should
come early — usually the second block. If you cannot write one, either
the category is not really a contrast (raise that) or you have not yet
worked out what the difference is (keep working).

Be honest with yourself here: **a good gloss in one or two sentences is
harder to write than a paragraph.** The paragraph lets you circle the
idea; the gloss makes you name it. A gloss that runs to four sentences is
a `text` block wearing a costume, and the giveaway is usually that it has
started explaining *when* the form is used instead of *what it says* —
which is the `decision` block's job, further down the page.

Where the forms allow it, write the examples on one scene so the
difference is the only variable: `I was writing the email when she
called.` next to `I had written the email before she called.` teaches
more than two unrelated sentences do.

### `forms` — the structural patterns

```json
{ "type": "forms", "rows": [
  { "form": "Past Simple", "use": "Olumlu", "pattern": "S + V2", "example": "She visited." },
  { "form": "Past Simple", "use": "Olumsuz", "pattern": "S + didn't + V", "example": "She didn't visit." },
  { "form": "Present Perfect", "use": "Olumlu", "pattern": "S + have/has + V3", "example": "She has visited." }
]}
```

One row per pattern, deliberately flat — the app groups by `form` when it
draws them, so you do not nest. `form` and `pattern` are English, `use`
is Turkish (`Olumlu`, `Olumsuz`, `Soru`), `example` is English.

This block is reference, not teaching: no explanation goes in it. Cover
the same set of `use` values for every form in the lesson, and keep the
patterns terse and parallel — they are set as formulas and read down the
column, so `S + didn't + V` beside `S + hadn't + V3` reads, while a
`pattern` that turns into a sentence does not.

### `examples` — sentences with a reason

```json
{ "type": "examples", "items": [
  { "sentence": "I visited Paris last summer.", "note": "Belirli geçmiş zaman → Past Simple" },
  { "sentence": "Have you ever been to Japan?", "note": "Hayat boyu deneyim sorusu → Present Perfect" }
]}
```

Three to six isolated English sentences, each much simpler than a test
paragraph — this is teaching, not testing, and a sentence carrying two
ideas teaches neither. Every `note` is Turkish and names the form *and*
the reason, in that compressed `sebep → Form` style.

Place it after the contrast, and make it earn its place: cover every side
of the contrast, one idea per sentence, and include the case that is
usually got wrong rather than only the clean ones.

### `pitfall` — one real mistake, one block

```json
{ "type": "pitfall",
  "wrong": "I have visited Paris last summer.",
  "right": "I visited Paris last summer.",
  "why": "'Last summer' belirli bir geçmiş zaman ifadesidir; belirli zaman ifadeleriyle Present Perfect kullanılmaz." }
```

Two or three per lesson, each its own block. Use errors Turkish speakers
genuinely make — the ones that come from Turkish doing something else, or
from over-applying a rule they have just learned. An invented error
teaches nothing, because nobody was going to make it.

The validator checks that `wrong` and `right` are not identical. It
cannot check the thing that matters: that they differ in **exactly one
place, and that place is what the lesson is teaching**. The app stacks
them, so the learner's eye goes to the difference — and every extra
difference is noise that hides the real one.

```
wrong: "When I arrived, she already left."
right: "When I arrived, she had already left."      ← one change, the lesson's change

wrong: "When I came, she already left."
right: "By the time I arrived, she had already left."   ← passes the validator, teaches nothing
```

### `decision` — what to do when you see it

```json
{ "type": "decision", "heading": "Sınavda ne yapacaksın",
  "rules": [
    { "signals": ["yesterday", "in 2020", "two days ago"], "then": "Past Simple" },
    { "signals": ["since", "for", "already", "yet", "ever"], "then": "Present Perfect" },
    { "condition": "Olayın ne zaman olduğu hiç belirtilmemişse", "then": "Present Perfect" }
  ]}
```

Each rule carries **exactly one** of `signals` (English trigger words,
drawn as chips) or `condition` (one Turkish sentence, for a rule no word
list captures), plus `then`, the English form name that follows.

A lesson should end on one of these. It is the block a learner comes back
for the night before the exam, and it is the only part of the page that
tells them what to *do* rather than what is true.

Which is why it is easy to write a worthless one. **A `signals` list is
only worth putting on the page if those words really decide the
answer.** `before` and `after` do not force Past Perfect; `always` does
not force Present Simple; a signal that holds two-thirds of the time
trains a habit that fails on exactly the questions the exam uses to
separate students. When a trigger is not reliable, either drop it or
write the real rule as a `condition` — "İki geçmiş olaydan hangisinin
önce olduğunu belirtmen gerekiyorsa" is longer than a chip and worth
more. Three or four rules that always hold beat eight that mostly do.

**And a word list must be checked against the items, not against your own
examples.** This is the failure mode that has cost this project the most.
One audit found twelve signal-shaped rules across six lessons — a
`signals` array, or a closed list of words inside a `condition` — of
which **eight missed the exact token their own category's items use**.
Both countability lists in one lesson contained none of the four nouns
that lesson's questions turn on. The agreement rules listed `has, is,
was` and `have, are, were` and omitted `had`, which half a category uses.
A determiner list omitted `its`, which was the single word one item was
built on. An adverb list had `almost` and `nearly` and not
`practically` — the only one of the three that appears in the corpus.

Every one of those lists was written from the lesson's own examples. The
questions were never consulted, so the rule tested the lesson instead of
the language.

**The one signal rule in that lesson set that worked was scoped by
position rather than by membership**: *"boşluğun **hemen önünde** too,
so, as ya da how varsa"*. The scoping is what saved it — the same
lesson's own example sentence contains a result-clause `so`, and an
unscoped list would have fired on it. Its unscoped twin, one rule below,
is what broke that category.

So: prefer a stated condition to a list; when a list really is right,
scope it to a position — immediately before the blank, inside the blank's
own clause — and before you hand the file over, check every word in every
list against the paragraphs your questions actually use.

### `check` — a question, here

```json
{ "type": "check" }
```

No content, and that is the point: the reader fills it from the questions
that share this lesson's category, so a category never needs two parallel
bodies of content kept in sync. Checks are not scored, not recorded, and
never block progress.

Place two or three, and place them where the learner has just been handed
something worth trying — after the `contrast`, after the `pitfall`s. A
`check` as the first block is a quiz, not a lesson, and two checks in a
row is a test the learner did not ask for. Do not ask for more checks
than the category has questions (the kickoff usually says four).

## A shape that works

Not a template — a lesson that needs a different order should have one —
but this is where the Tenses lessons settled, and it is a reasonable
place to start:

```
text        why this pair is worth a lesson, and the confusion a Turkish
            speaker actually has
contrast    the forms, side by side
forms       the structural patterns
check
examples    sentences that show the contrast doing its work
pitfall     ×2–3, each its own block
check
decision    the procedure to carry into the exam
```

## Language

- `summary`, `text.body`, `contrast.heading`, `contrast.sides[].gloss`,
  `forms.rows[].use`, `examples.items[].note`, `pitfall.why`,
  `decision.heading`, `decision.rules[].condition`: **Turkish**.
- `contrast.sides[].example`, `forms.rows[].pattern` and `.example`,
  `examples.items[].sentence`, `pitfall.wrong` and `.right`,
  `decision.rules[].signals`: **English**.
- Form names — `contrast.sides[].label`, `forms.rows[].form`,
  `decision.rules[].then` — stay **English**, always: `Past Perfect`,
  never `Geçmişte Bitmiş Zaman`. The student has to recognize the term on
  the exam paper.
- `category`: English, verbatim from the kickoff.

Teaching happens in the learner's language; the language being learned
appears as itself. Do not translate an English example sentence into the
`note` — the note says *why*, not what it means.

## A complete lesson

This is one of the Tenses lessons written to the standard above. Read it
before you write your first one.

```json
{
  "category": "Past Simple vs Past Continuous vs Past Perfect",
  "summary": "Hangisi önce bitti, hangisi sürüyordu?",
  "blocks": [
    { "type": "text", "body": "Türkçede üç geçmiş de var: 'aradı', 'arıyordu', 'aramıştı'. Sorun bunları bilmemek değil, sınavda tek bir paragrafa bakıp hangisinin gerektiğine saniyeler içinde karar vermek. İngilizce bu kararı çoğu zaman cümledeki **ikinci olaya** göre verdirir: olay tek başına mı duruyor, başka bir şey olurken mi sürüyordu, yoksa başka bir şeyden önce mi bitmişti?" },

    { "type": "contrast", "heading": "Üçü ne anlatır",
      "sides": [
        { "label": "Past Simple", "gloss": "Geçmişte olmuş ve bitmiş tek bir olay. Anlatının ana çizgisini bu taşır.", "example": "I wrote the email at eight." },
        { "label": "Past Continuous", "gloss": "Başka bir olay araya girdiğinde hâlâ sürmekte olan eylem; arka planı kurar, kendisi bitmiş olmak zorunda değildir.", "example": "I was writing the email when she called." },
        { "label": "Past Perfect", "gloss": "Geçmişteki bir andan da önce tamamlanmış eylem. İki geçmiş olaydan hangisinin önce olduğunu göstermek için vardır.", "example": "I had written the email before she called." }
      ]},

    { "type": "forms", "rows": [
      { "form": "Past Simple", "use": "Olumlu", "pattern": "S + V2", "example": "She called." },
      { "form": "Past Simple", "use": "Olumsuz", "pattern": "S + didn't + V", "example": "She didn't call." },
      { "form": "Past Simple", "use": "Soru", "pattern": "Did + S + V?", "example": "Did she call?" },
      { "form": "Past Continuous", "use": "Olumlu", "pattern": "S + was/were + V-ing", "example": "She was calling." },
      { "form": "Past Continuous", "use": "Olumsuz", "pattern": "S + wasn't/weren't + V-ing", "example": "She wasn't calling." },
      { "form": "Past Continuous", "use": "Soru", "pattern": "Was/Were + S + V-ing?", "example": "Was she calling?" },
      { "form": "Past Perfect", "use": "Olumlu", "pattern": "S + had + V3", "example": "She had called." },
      { "form": "Past Perfect", "use": "Olumsuz", "pattern": "S + hadn't + V3", "example": "She hadn't called." },
      { "form": "Past Perfect", "use": "Soru", "pattern": "Had + S + V3?", "example": "Had she called?" }
    ]},

    { "type": "check" },

    { "type": "examples", "items": [
      { "sentence": "The lecture started at nine.", "note": "Tek, bitmiş olay → Past Simple" },
      { "sentence": "I was taking notes when the projector failed.", "note": "Kesintiye uğrayan arka plan → Past Continuous" },
      { "sentence": "While she was studying, her roommate was cooking.", "note": "Aynı anda süren iki eylem → iki Past Continuous" },
      { "sentence": "By the time I arrived, the lecture had started.", "note": "Varıştan önce bitmiş → Past Perfect" },
      { "sentence": "She realised that she had left her ID at home.", "note": "Fark etme anından önce olmuş → Past Perfect" }
    ]},

    { "type": "pitfall",
      "wrong": "Last night I was watching a film with my sister.",
      "right": "Last night I watched a film with my sister.",
      "why": "Türkçede 'izliyordum' demek doğal, ama İngilizcede tamamlanmış bir olay Past Simple ister. Past Continuous ancak eylem başka bir olay tarafından kesiliyorsa ya da arka plan olarak kuruluyorsa gelir." },

    { "type": "pitfall",
      "wrong": "While I studied, my phone rang.",
      "right": "While I was studying, my phone rang.",
      "why": "'While' süregelen bir arka plan ister; kesilen eylem Past Continuous'ta, kesen olay Past Simple'da olur." },

    { "type": "pitfall",
      "wrong": "When I arrived, she already left.",
      "right": "When I arrived, she had already left.",
      "why": "Ayrılma, varıştan önce olup bitmiş. İki geçmiş olayın sırasını Past Simple göstermez; önce olanı Past Perfect'e almak gerekir." },

    { "type": "check" },

    { "type": "decision", "heading": "Sınavda ne yapacaksın",
      "rules": [
        { "signals": ["yesterday", "last night", "in 2019", "two days ago"], "then": "Past Simple" },
        { "signals": ["while", "as", "at 9 o'clock last night"], "then": "Past Continuous" },
        { "signals": ["by the time", "by 2010", "it was the first time"], "then": "Past Perfect" },
        { "condition": "Bir olay olurken başka bir olay onu kesiyorsa, kesilen (uzun) eylem", "then": "Past Continuous" },
        { "condition": "İki geçmiş olaydan hangisinin daha önce olduğunu belirtmen gerekiyorsa, önce olan", "then": "Past Perfect" }
      ]}
  ]
}
```

Ten blocks. Notice what is *not* in it: no paragraph explaining what the
contrast block already shows, no note translating an example sentence, no
`decision` rule built on a signal that only usually holds.

## You do not write check questions

The reader pulls them from the questions sharing the lesson's category.
One thing follows that is worth knowing: some of that category's test
questions will be met right after your explanation rather than in an exam
run. If a question would only make sense to someone who has already
finished the whole topic, say so to the supervisor — that is a note for
the question author, not something to work around here.

## Your category must already exist in the topic's questions

The app links a wrong answer on the results screen to the lesson that
teaches it, and it does that by matching the `category` string. So a
lesson whose `category` no question uses is a dead end, and the validator
rejects it.

Renaming a category is therefore a taxonomy change, not an edit: the
lesson id is derived from topic + category, a learner's progress is
stored against that id, and questions, manifest and lesson would all have
to move together while existing progress resets. Never rename on your own
initiative — raise it and stop.

## Before you hand it over

```bash
npm run validate
```

It must print `✓ Content validation passed`. It won't see your file until
the supervisor merges it, so validate by temporarily assembling the topic
file locally, or ask the supervisor to run it. Either way these are the
things it checks, so check them yourself:

- every `category` from the kickoff, verbatim, used once, and used by
  that topic's questions;
- `summary` present and within 70 characters;
- 6–14 blocks, every block a known `type` with that type's fields;
- no `text` body over 400 characters;
- `contrast` with 2–3 sides, `examples` with 3–6 items, each `decision`
  rule carrying exactly one of `signals` / `condition`;
- `wrong` and `right` not identical;
- no more `check` blocks than the category has questions;
- Turkish fields actually in Turkish, English fields actually in English.

Passing that is the floor, not the bar. Then read one lesson end to end
as a student who is about to sit the exam, and ask three things. Would
the `contrast` glosses, on their own, let you choose correctly? Does each
`pitfall` differ in exactly one place? If the `decision` block were the
only thing you remembered, would it change what you do on the paper? If
the answer to the last one is no, the lesson has explained the grammar
and taught nothing.

## Out of scope

Don't edit `js/`, `css/`, `*.html`, `data/manifest.json`, or the
questions array. There are seven block types and there will not be an
eighth without a reason — a block vocabulary decays the same way an icon
set does, one "just for this lesson" at a time. If a lesson genuinely
needs something the seven cannot carry, say so and stop rather than
forcing it into a `text` block; adding a type means changing the
validator and the reader too, and that is the supervisor's call.
