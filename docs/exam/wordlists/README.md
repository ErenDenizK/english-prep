# The prep school's published word lists

Primary source, supplied by the owner. Extract a new one with:

```bash
node tools/extract-wordlist.mjs <list.pdf> docs/exam/wordlists/<level>-<years>.json
```

## What is here

| File | Level | Groups | Entries |
| --- | --- | --- | --- |
| `elementary-2023-2024.json` | Elementary (A1–A2) | 30 | 1,126 |

Thirty thematic groups: *Meta Language*, *Linkers*, *Modal Verbs*,
*Classroom (Equipment)*, *Prepositions*, *Work/Job Related*, *Irregular
Verbs*, *Food & Drink*, *Body Parts*, and so on. The vocabulary is
`black / blue / brown`, `chin / ear / eye`, `can / could / would`,
`and / because / but`.

## What it settles, and what it does not

**It settles that the school publishes level-banded, thematically
grouped word lists.** That is new, and it matters more than the contents
of this particular file: it means there is a *published* answer to "which
words does this institution expect you to know", and one band of it is
now in the repo with a tool that reads the next one in a single command.

**It is not the syllabus for the proficiency exam.** This is the lowest
band. `docs/research/vocabulary.md` §2.3 excludes K1–K3 in their core
senses with the reason that the learner already has them, and this list
is almost entirely that. Nothing in it should become an item.

**It does, however, validate the vocabulary taxonomy by not overlapping
it.** All sixty target words in `docs/agents/kickoff-vocabulary.md` were
checked against every entry here, split on the source's own `/` and `–`
alternatives:

```
0 / 60 target words appear in the elementary list
```

Every one of the twelve semantic sets came back clean. That is a cheap,
real check that the two topics being authored sit above the band the
school treats as assumed knowledge — and it is a check worth re-running
against the *upper* list when it arrives, where a hit would mean the
opposite thing and would be worth acting on.

## What is still missing

**The list for the level the proficiency exam actually samples.** The
school publishes one per level, so there are presumably Pre-Intermediate,
Intermediate and Upper-Intermediate lists as well. The last of those is
the one that would change authoring decisions: `vocabulary.md` §2.2 says
AWL and AVL are *"inputs to choosing sets, not the syllabus"*, and an
institution's own published list for the exam's own level is a
straightforwardly better input than either.

It would not change the method — the unit stays a semantic set, not a
word, for the reasons in §2.2 — but it would change which sets are worth
six items.

## One known limitation of the extraction

When a group's entries run past the bottom of a column and continue in
the next one without the heading being repeated, they are attributed to
whichever heading was last seen in that column. Four entries in this file
land in the wrong group that way (`take a test/exam`, `take photos`,
`turn right`, `turn left` sit under *Question Words*). That is 4 of
1,126, it is inherent to a layout that does not mark group boundaries,
and it is recorded rather than papered over.
