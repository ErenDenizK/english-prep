# Who owns this, and what the repository currently says

2026-09-05. Written because `architecture.md` §3 turned on a fact
nobody had checked, and the check came back worse than expected.

**Not legal advice.** Nothing here is verified against Turkish law and
the session that wrote it had no way to look anything up. It is a map of
the decisions and what each one costs, so that the owner can make them
deliberately instead of by default — which is what is happening now.

---

## 1. What the repository says today

Verified against the GitHub API on 2026-09-05:

- `ErenDenizK/english-prep` is **public**.
- There is **no `LICENSE` file**, and no licence statement anywhere else.

The default position when a work is published with no licence is that
**all rights are reserved** — nobody is granted permission to copy,
modify or redistribute it. Publishing on GitHub additionally grants,
under GitHub's own terms, the right to view the repository and to fork
it *within GitHub*. That is the whole of what anyone may lawfully do
with it.

**This is not the same as being protected.** "All rights reserved" is a
statement about what a court would say, months later, in a jurisdiction
someone has to be sued in. What is true *today* is that 852 KB of
reviewed content — 241 questions, 60 lessons, 723 option notes — can be
downloaded by anyone who finds the repository, in one command, and
re-hosted anywhere in the world at zero cost.

---

## 2. There are two assets here and they want opposite licences

Almost every argument about licensing this project gets confused by
treating it as one thing. It is two, and they point in opposite
directions.

**The code** — `js/`, `css/`, `tools/`, `tests/`, the design system, the
validator, the blind-review tooling, the Playwright sweep. Roughly 6,700
lines of JavaScript with zero dependencies.

Its value to the owner is almost entirely **as evidence that he built
it**. He has said as much: *"maksat proje ve tecrübe olması"* — the
point is the project and the experience. A permissive licence on the
code costs nothing (nobody is going to out-compete him by reusing his
validator) and buys something real: the repository becomes citable,
linkable and usable as a portfolio piece without a reader having to
wonder whether they are allowed to read it.

**The content** — `data/`. This is the commercial asset, and
`architecture.md` §7 argues it is the *only* one: the pipeline in
`docs/agents/` is slow by construction, which is precisely why a
better-funded competitor cannot cheaply reproduce what it produces.
A permissive licence here gives that away.

**The conclusion is a split licence**, which is an ordinary,
well-trodden arrangement — code under an OSI licence, content under a
restrictive one — and it only works if it is stated **per directory and
unambiguously**. A repository with one `LICENSE` file at the root and a
paragraph of intent further down has, in practice, licensed everything
under that file.

---

## 3. The options

| For | Option | What it means | Cost |
|---|---|---|---|
| Code | MIT | anyone may use it, must keep the notice | none that matters here |
| Code | Apache-2.0 | MIT plus an explicit patent grant and a NOTICE file | slightly more paperwork, slightly more respectable |
| Code | AGPL | derivatives that are *served* must publish source | deters reuse, including reuse he might later want |
| Content | all rights reserved (say so, in a file) | status quo, made explicit | free, and honest |
| Content | CC BY-NC-ND 4.0 | may be shared with credit, not commercially, not modified | a named, understood standard; permits a teacher to hand it out |
| Content | CC BY-SA | may be reused commercially if shared alike | gives away the asset |

**Recommendation:** `LICENSE` at the root carrying **MIT** and saying in
its first line that it covers everything *except* `data/`; a
`data/LICENSE` carrying either an explicit all-rights-reserved notice or
**CC BY-NC-ND 4.0**; and one paragraph in the README pointing at both.
Between the two content options, the difference is whether a prep-school
teacher may legally print ten questions for a class — which, for an app
whose reach plan is *"three schools"*, is probably a feature rather than
a leak.

---

## 4. What a licence does not do

Worth stating plainly, because licence choice attracts more attention
than it deserves and solves less than people expect.

- It does not stop a student from sharing an unlock code. That is
  `architecture.md` §3 and `shipping.md`'s counter-argument section, and
  no licence touches it.
- It does not stop anyone from scraping `data/` or training on it.
- It is enforceable only by someone willing to enforce it, in a
  jurisdiction where the infringer can be reached. Against a stranger
  abroad this is theoretical.

What it *does* do is settle, cheaply and in advance, what happens when
someone reasonable asks — a school, a collaborator, a buyer, or the
owner himself in two years wondering whether he can put this in a
commercial product. That is a real benefit and it is the reason to
bother.

---

## 5. The one time-sensitive item

The owner has said his friend — who tested the app and sat the Bilkent
exam — may work on this with him.

**Whoever writes a lesson or a question owns the copyright in what they
wrote, by default, from the moment they write it.** Not the repository
owner, not the person who commissioned it. That means:

- a later decision to sell the app, relicense the corpus, or move
  content into a private repository needs the agreement of **everyone
  who contributed content**, individually;
- and the moment to get that agreement is *before* they contribute,
  when it is a friendly sentence, rather than after, when it is a
  negotiation.

The lightweight form is one short written note, agreed by message and
kept in the repository, saying that contributions are licensed to the
project under the same terms as the rest of it and may be relicensed by
the owner. Big projects do this with a Contributor Licence Agreement;
at this scale a paragraph in `CONTRIBUTING.md` that a contributor
acknowledges is the proportionate version.

This is the only item in this document with a deadline, and the deadline
is "before the second author commits anything to `data/`".

---

## 6. Also unresolved, and cheaper

- **AI-authored content.** Much of `data/` was drafted by model
  sessions and reviewed by others. Whether — and to what extent — such
  text attracts copyright at all differs by jurisdiction and is
  genuinely unsettled. It is not a reason to do anything differently
  today, but it is a reason not to build a plan whose only defence is
  copyright in the corpus. The defence that actually holds is that the
  *pipeline* is hard to reproduce, not that the output is hard to copy.
- **The repository's own presentation.** It has no description, no
  topics and no About text on GitHub. Those are set in the web UI, not
  in the repository, so they cannot be set from here — but they are the
  first thing anyone sees, and the README now says what they should say.

---

## 7. What is being asked of the owner

Three decisions, in order of urgency:

1. **The contributor note**, before his friend writes any content (§5).
2. **Whether `data/` is all-rights-reserved or CC BY-NC-ND** (§3) —
   this decides whether a teacher may hand out questions.
3. **MIT or Apache-2.0 for the code** (§3) — genuinely minor; MIT unless
   he wants the patent clause.

No files have been added. Adding a `LICENSE` is a public, effectively
permanent statement about someone else's work, and it is his to make.
