# Should vs Ought To vs Had Better

The worked example for `docs/agents/category-spec.md`. Written on
2026-09-03 **after** the category had already shipped, because
`modals-t17` failed blind review three times running and the third
failure made the reason clear. Everything below is from evidence rather
than from imagination, which is the only reason it is worth reading.

---

## 1 · The discrimination

A learner who has this right can tell **whether a piece of advice carries
a consequence**: `had better` says *and if you don't, something bad
happens*, `should` says nothing of the sort. They can also build both
correctly — `had better` takes a bare infinitive, `ought` takes `to`, and
both negate in a place Turkish speakers do not expect.

### The honest bound — read this before writing anything

**This category cannot discriminate `should` from `ought to`, and no item
may be keyed on that distinction.**

That is not a style preference. The lesson itself says they are
*"neredeyse aynı"*. Three independent blind passes, over three different
rewrites of `modals-t17`, each rejected it: every context mild enough for
`should` accepts `ought to`, and every context that excludes `ought to`
excludes `should` too. An item keyed there punishes the learner who knows
that the two are interchangeable — which is the thing the lesson taught
them.

`had better` versus the other two **is** discriminable, but only when the
paragraph states or denies a consequence outright. A recommendation with
no stated stakes ("you should try that bakery") accepts `had better` as
enthusiasm, which is ordinary English and defeated two of the three
rewrites.

So the category has two testable axes and one untestable one:

| axis | testable | how |
| --- | --- | --- |
| consequence vs none | **yes** | the paragraph must state the consequence, or deny it in as many words |
| form (`to`, negation) | **yes** | and it is the exam's own favourite, per the lesson's opening |
| `should` vs `ought to` | **no** | do not key it, in either direction |

## 2 · Misconceptions

M1. *`had better` behaves like `ought`, so it takes `to`* → **had better
to see a doctor**. The commonest error in this category, and the one the
lesson leads with.

M2. *`ought` behaves like `should`, so it stands alone* → **ought
apologize**.

M3. *A modal negates by moving `not` to the front of the phrase* →
**hadn't better tell him**, for `had better not tell him`.

M4. *`had better` is just a stronger `should`, so it fits any advice* →
`had better` chosen for a recommendation with nothing at stake.

M5. *Advice modals are interchangeable with obligation modals* → `must`
chosen for a personal recommendation, or `don't have to` for
`shouldn't`.

M6. *`would rather` is an advice modal* → `would rather` for a
recommendation, where it actually expresses a preference between two
named alternatives.

Note on M1–M3 and dead options: these produce strings a fluent English
speaker discards on sight, and a fluent reviewer will call them dead.
They are not. They are the errors this audience makes, the lesson is
built on them, and `docs/agents/reviewer.md` now says so explicitly.

## 3 · The item plan

| # | keys | tests | decided by | punishes |
| --- | --- | --- | --- | --- |
| 1 | `should` | consequence vs none | meaning — the paragraph **denies** any consequence | M4, M6 |
| 2 | `had better` | consequence vs none | meaning — the paragraph **states** the consequence | M4, M5 |
| 3 | `should` or `had better` | form | form — `to` and bare infinitive | M1, M2 |
| 4 | `had better not` / `shouldn't` | negation | form — where `not` goes | M3 |

Both halves of the consequence axis are keyed (items 1 and 2). Two of the
four are decided by meaning rather than by a trigger. Items 3 and 4
spring the caveat the lesson leads with and which, in the shipped
version, no question tested at all.

`ought to` may appear as a **distractor** only where something other than
its meaning excludes it — a form error, or a negation. Never as a
meaning-based wrong answer against `should`.

## 4 · Context bank

Deliberately far from a university: the shipped topic had eighteen of its
72 paragraphs in a classroom.

1. A bakery recommendation, with the stakes explicitly denied.
2. An assignment that will not be accepted if it is late. *(consequence)*
3. A bicycle brake that has been squealing for a week. *(consequence)*
4. A neighbour's cat that is about to be let out near a road.
5. The eldest sibling and a family expectation. *(role duty — no consequence)*
6. A rental deposit and a photograph taken before moving in. *(consequence)*
7. A ferry that will be full by nine on a holiday morning. *(consequence)*
8. Salting a dish that guests have not tasted yet.
9. A phone left charging overnight on a bed.
10. A library book due in three days, with no fine attached. *(no consequence)*

Two are already in use: 1 (`modals-t17`) and 2 (`modals-t18`). Scenario 5
is `modals-t19`, which is the item that will have to move if the
`should`/`ought to` bound above is honoured — it is currently keyed
`ought to` against `must`, which is survivable, but it tests the
untestable axis from the other side.

**None of these may reuse a sentence from the lesson.** The lesson's own
examples are *"In my opinion, you should try that new bakery"* and *"As
the eldest, she ought to set a good example"* — and both are currently
questions in this category, nearly verbatim, which means a learner meets
each answer as a lesson example and again as a check a few blocks later.

## 5 · Difficulty recipe

In order:

1. The consequence is implied by the situation rather than stated —
   *"the ferry fills up by nine"* rather than *"or you won't get a seat"*.
2. The form error is in the option a learner is already drawn to on
   meaning, so knowing the meaning is not enough.
3. The deciding clause comes after the blank.

Not wanted, and not the same thing: an option nobody weighs, a rare word
in the paragraph, or a choice between two acceptable modals.

## 6 · Coverage ledger

As shipped, before this spec existed:

| form | key | distractor | absent |
| --- | --- | --- | --- |
| `should` | ✓ (t17) | ✓ | |
| `shouldn't` | ✓ (t20) | | |
| `ought to` | ✓ (t19) | ✓ | |
| `had better` | ✓ (t18) | ✓ | |
| `had better not` | | | **absent** |
| `ought not to` | | | **absent** |
| `had better to` (M1) | | | **absent** |
| `ought` + bare verb (M2) | | | **absent** |

Four of the eight forms the lesson teaches appear nowhere. Three of them
are the errors the lesson's three pitfalls are built on — so the lesson
spends its most emphatic block on a trap the practice never sets, and the
learner scores 4/4 with the belief intact.

That table took ten minutes to fill in and is the clearest single
statement of what is wrong with this category. It is the reason §6 is in
the template.
