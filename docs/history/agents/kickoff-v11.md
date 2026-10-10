# Kickoff: four topics the paper rewards and the app does not have

Written 2026-09-04. The taxonomy below is **fixed input** for both the
question author and the curriculum author of each topic, per
`docs/agents/README.md`. Nobody invents, renames or drops a category.

## Why these four

From `docs/exam-spec.md`, verified against the owner's own sample papers.
Of the ten blanks in the sample cloze, the app currently covers two. The
rest test discourse markers, comparatives, `so/such`, relative pronouns,
quantifiers, a causative `make + object + bare infinitive`, and
vocabulary. These four topics take the biggest bite out of that list.

**Categories already in use elsewhere may not be reused.** The
`closest-meaning` topic owns *Despite vs Although vs However*, *Unless vs
If Not vs Otherwise*, *As...As vs Comparatives vs The More...The More*,
*Too vs Enough vs So...That*, *Third Conditional vs Mixed Conditional*
and *Passive Reporting*. The four topics below deliberately steer clear:
comparatives and concession are covered there as **restatement** items,
and duplicating them as cloze items would put two lessons with the same
name in the same index.

---

## 1 · Connectors & Discourse Markers

```
Topic id:      connectors
Topic title:   Connectors & Discourse Markers
Tier:          compound-structures
Level:         B2-C1
Questions:     4 per category (24), type: "cloze"
Lessons:       1 per category (6)
```

Categories, verbatim:

1. `Addition vs Similarity: Moreover / Similarly / Likewise`
2. `Contrast vs Concession: However / Nevertheless / On the Other Hand`
3. `Result vs Purpose: Therefore / Thus / So That / In Order To`
4. `Exemplification vs Restatement: For Instance / Namely / In Other Words`
5. `Time & Sequence: Meanwhile / Subsequently / By Then`
6. `Emphasis & Summary: Above All / In Short / Overall`

**The discrimination, and the honest bound.** The sample paper's own
discourse-marker blank offered `Similarly / Nevertheless / In spite of /
Since` — four markers of four *different* logical functions. So the skill
is reading the relation between two sentences and choosing the function,
not ranking near-synonyms. **Do not key on `moreover` against
`furthermore`, or `therefore` against `thus`.** Those are register
differences, and an item keyed there punishes the learner who knows they
are interchangeable. Where a category names two markers of the same
function, one of them is a distractor for the *other* function's items.

---

## 2 · Relative Clauses

```
Topic id:      relative-clauses
Topic title:   Relative Clauses
Tier:          compound-structures
Level:         B2-C1
Questions:     4 per category (24), type: "cloze"
Lessons:       1 per category (6)
```

Categories, verbatim:

1. `Who vs Whom vs Whose`
2. `Defining vs Non-defining: That vs Which`
3. `Where vs When vs Why vs Which`
4. `Preposition + Relative Pronoun: In Which / For Whom / Of Which`
5. `Reduced Relative Clauses: -ing vs -ed`
6. `Quantifier + Relative Pronoun: Some Of Which / All Of Whom`

**The honest bound.** In everyday English `whom` is receding and `that`
often replaces `which` in defining clauses. This app teaches the exam's
register, and the exam tests the formal rule — but an item must be keyed
where the formal rule genuinely decides (after a preposition, in a
non-defining clause), never on a preference a competent speaker would
dispute.

---

## 3 · Quantifiers & Determiners

```
Topic id:      quantifiers
Topic title:   Quantifiers & Determiners
Tier:          core-grammar
Level:         B2-C1
Questions:     4 per category (24), type: "cloze"
Lessons:       1 per category (6)
```

Categories, verbatim:

1. `A Few vs Few vs A Little vs Little`
2. `Much vs Many vs A Lot Of vs Plenty Of`
3. `Some vs Any vs No vs None`
4. `Each vs Every vs Both vs All`
5. `Either vs Neither vs Nor`
6. `Most vs Most Of vs The Most`

**The honest bound.** `a lot of` and `plenty of` overlap heavily in the
affirmative; key that category on countability and on the
question/negative environments, not on which sounds better. Category 1 is
the strongest in the topic because the `a`-versus-no-`a` contrast is a
genuine meaning difference — a few means *some*, few means *almost none*
— and it is the one Turkish gives no help with.

---

## 4 · Gerunds & Infinitives

```
Topic id:      gerunds-infinitives
Topic title:   Gerunds & Infinitives
Tier:          core-grammar
Level:         B2-C1
Questions:     4 per category (24), type: "cloze"
Lessons:       1 per category (6)
```

Categories, verbatim:

1. `Verb + Gerund vs Verb + Infinitive`
2. `Both, With a Meaning Change: Remember / Stop / Try / Regret`
3. `Causative Verb Patterns: Make / Let / Have / Get`
4. `Adjective + Infinitive vs Preposition + Gerund`
5. `Infinitive of Purpose vs For + Gerund`
6. `Used To vs Be Used To vs Get Used To`

**Why this one is here.** The sample cloze's third blank was a causative
`make + object + bare infinitive`, and category 3 covers it directly.
Category 2 is the highest-value teaching in the topic: *stop smoking* and
*stop to smoke* are different events, and Turkish marks neither
difference.

**The honest bound.** Category 1 is a memory list, not a rule, and an
item there tests whether the learner has met that verb. Keep the verbs
frequent, and put the reasoning load in categories 2, 3 and 5.

---

## What both authors must do

- Write to the schema in `docs/CONTENT_GUIDE.md`, `type: "cloze"`.
- Read the five rules in `docs/agents/question-author.md`. Each exists
  because it names a defect that reached shipped content.
- **Fill in §1–§6 of `docs/agents/category-spec.md` for your topic before
  writing content.** Every finding worth acting on in the first review was
  invisible inside one item and obvious across four; the spec is what
  makes the next review possible. `docs/agents/closest-meaning-spec.md`
  is a worked example.
- Expect a blind review. Five independent readers have now sat the last
  topic, and the content changed after every one of them.
