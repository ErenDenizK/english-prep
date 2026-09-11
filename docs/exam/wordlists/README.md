# Published prep-school word lists

Primary source. Extract a new one with:

```bash
node tools/extract-wordlist.mjs <list.pdf> docs/exam/wordlists/<school>-<level>-<years>.json
```

## What is here

| File | School | Level | Groups | Entries |
| --- | --- | --- | --- | --- |
| `bilkent-elementary-2023-2024.json` | Bilkent (BUSEL) | Elementary (A1–A2) | 30 | 1,126 |

Thirty thematic groups: *Meta Language*, *Linkers*, *Modal Verbs*,
*Classroom (Equipment)*, *Prepositions*, *Work/Job Related*, *Irregular
Verbs*, *Food & Drink*, *Body Parts*, and so on. The vocabulary is
`black / blue / brown`, `chin / ear / eye`, `can / could / would`,
`and / because / but`.

## Whose list this is, and why that was wrong for a while

**It is Bilkent's, not YTÜ's**, and this file said otherwise until
2026-09-04. It arrived among the files a friend sitting the **Bilkent**
exam shared with the owner, and it is
[`ELEMENTARY-LEVEL-WORDLIST-2023-2024.pdf`](http://prep.bilkent.edu.tr/wp-content/uploads/2023/09/ELEMENTARY-LEVEL-WORDLIST-2023-2024.pdf),
published by BUSEL in September 2023 — same title string, same thirty
group names in the same order. YTÜ does not name its levels
"Elementary"; it uses A1 / A2 / B1 / B1+.

That matters because the repo is now serving two learners sitting two
different papers, and a check run against the wrong institution's list
proves something other than what it claims.

## What it settles, and what it does not

**It settles that Bilkent publishes a level-banded lexical syllabus.**
That is the useful finding, and a bigger one than this particular file:
`docs/research/exam-vocabulary.md` traces the upper-level lists, which
are `HEADWORD | VERB | NOUN | ADJECTIVE | ADVERB | COLLOCATION` tables —
a published answer to "which words, in which forms, with which
collocations does this institution expect", for the exam that actually
has a discrete vocabulary section.

**It is not the syllabus for either proficiency exam.** This is the
lowest band. `docs/research/vocabulary.md` §2.3 excludes K1–K3 in their
core senses because the learner already has them, and this list is almost
entirely that. Nothing in it should become an item.

**It does still validate the vocabulary taxonomy by not overlapping it,
for Bilkent.** All sixty target words in `docs/agents/kickoff-vocabulary.md`
were checked against every entry here, split on the source's own `/` and
`–` alternatives:

```
0 / 60 target words appear in the Bilkent elementary list
```

Every one of the twelve semantic sets came back clean. Read it as what it
is: evidence that the two drafted topics sit above what **Bilkent**
treats as assumed knowledge. It says nothing about YTÜ, and the earlier
version of this file claimed it did.

## What is still missing

**Bilkent's upper lists**, which is where a hit would mean the opposite
thing and would be worth acting on — and which are published and
findable; `docs/research/exam-vocabulary.md` has the URLs and the reason
`tools/extract-wordlist.py` needs work before it can read their
six-column layout.

**Anything published by YTÜ.** No level-banded list has been found for
the owner's own exam, which leaves `docs/exam-spec.md`'s two sample
papers as the only primary source for it.

## One known limitation of the extraction

When a group's entries run past the bottom of a column and continue in
the next one without the heading being repeated, they are attributed to
whichever heading was last seen in that column. Four entries in this file
land in the wrong group that way (`take a test/exam`, `take photos`,
`turn right`, `turn left` sit under *Question Words*). That is 4 of
1,126, it is inherent to a layout that does not mark group boundaries,
and it is recorded rather than papered over.
