# Research

Written research that decisions are made from, kept because the reasoning
has to outlive the session that did it. Each file states what was found,
what it would cost to act on, and what the author would *not* do — a
recommendation with no discarded alternatives is a wish list.

These are inputs to a plan, not the plan. `docs/redesign-plan.md` is the
plan of record for the interface rebuild; **`docs/v1-plan.md` is the one
this round produced.** Read that for the decisions; read these for the
evidence behind them.

The six arms of the 2026-09-03 round:

| | |
| --- | --- |
| `the-exam.md` | what YTÜ's İYS actually contains, and how little of it the app covers |
| `learning-design.md` | the teaching loop, desirable difficulties, curriculum sequencing |
| `learner-model.md` | what to record, what can honestly be inferred from it, what to show |
| `practice-modes.md` | practice modes worth having, and the motivational mechanics to refuse |
| `onboarding.md` | first run, identity without accounts, and keeping a learner's data |
| `content-pipeline.md` | producing and reviewing hundreds of items without the quality collapsing |
| `architecture-and-scale.md` | measured: what the app costs to open, and where that goes as content grows |

**A caveat that applies to all of them except the last.** This
environment's network egress blocked the publishers, the browser vendors'
documentation and every Turkish university domain, so most citations rest
on search-index summaries rather than on the sources themselves. Each file
says so in its own words and marks which claims are affected. Treat a
number that matters as needing one confirming look before anything
expensive is built on it.

Every file here is bound by the same constraints the app is: no build
step, no runtime dependencies, no backend, no accounts, static hosting,
localStorage only, mobile-first, WCAG 2.2 AA, Turkish UI. A proposal that
needs one of those to change has to say so and say what it costs.
