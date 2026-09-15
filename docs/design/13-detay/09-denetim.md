# Supervisor's verification log — round two

Arms are not taken at their word. Round one had three claims that did
not survive checking, and one of them would have changed the type scale
for the wrong reason. This file records what was checked, what held, and
what did not. It grows as arms return.

---

## Arm 2 — the exam artifact

### Claim: options are numbered, the exam letters them. **Holds.**

`js/answers.js:56`:

```js
button.appendChild(el("span", "option__key t-num", String(index + 1)));
```

So the badge reads `1 2 3 4`. Checked the claim about the exam
independently through the arm's own quoted snippets; ÖSYM-family items
letter `A) B) C) D)`. The gap is real.

### But: the digit is load-bearing, and the arm did not see it.

`js/quiz.js:332–335`:

```js
const choice = Number(event.key);
if (Number.isInteger(choice) && choice >= 1 && choice <= 4) {
  event.preventDefault();
  document.querySelectorAll(".option")[choice - 1]?.click();
}
```

The badge is not decoration and not a label: **it is the keyboard
shortcut, shown rather than hidden.** The comment in `answers.js` says
so, and this is a deliberate accessibility choice — a hidden affordance
only a mouse user could guess at was rejected.

So "letter the options A–D" is not a one-line label change. It is one
of three moves, and they are not equivalent:

1. **Badge becomes A–D, shortcut moves to the A/S/D/F or A–D keys.**
   Keeps the correspondence. Costs: `quiz.js` key handling, the
   `verify-ui.mjs` rows that assert on the badge, and any lesson-check
   path that shares `answers.js`.
2. **Badge becomes A–D, shortcut stays 1–4.** Breaks the
   correspondence the comment exists to protect — the learner sees `A`
   and must know to press `1`. Rejected on its own terms.
3. **Badge shows both.** Doubles the badge's width at 320px, which is
   the width the whole shell is verified at first.

None of these is obviously right, and the choice is a product decision
rather than a design one. Recorded as open. The fidelity argument is
sound; its cost was understated.

Note also that the shortcut is a desktop affordance and the exam
fidelity argument is strongest on a phone, where there is no keyboard —
but the app is swept at 1280 as well as 320, so the shortcut is real
for part of the audience either way.

### Claim: the app's Turkish rubric is in the wrong register. **Holds.**

`js/prompt.js:16`:

```js
[QUESTION_TYPE.RESTATEMENT]: "Aşağıdaki cümleye anlamca en yakın seçeneği bul.",
```

Two differences from the exam's own formula, both real:

- **`bul` vs `bulunuz`.** The exam uses the formal plural imperative
  throughout. `bul` is the informal singular — the register a friend
  uses, not the register the paper uses.
- **`seçeneği` vs `cümleyi`.** The exam names the object sought. On a
  closest-meaning item that object is a sentence, not an "option";
  `seçeneği` describes the UI, `cümleyi` describes the task.

This is the cheapest fidelity available in the whole document: one
string, no layout, no byte cost, and it is the sentence the learner
reads before every restatement item. Worth noting that `CLAUDE.md`'s
language convention already says UI strings are Turkish and that the
app should use terms students recognize — this is that rule applied to
the rubric, which nobody had done.

Also worth checking when this is acted on: `INSTRUCTION` currently has
**one** entry, for `RESTATEMENT` only. Cloze items get no instruction
at all, deliberately ("a gap in a passage explains itself"). If exam
rubrics are adopted, that decision should be restated rather than
silently reversed.

### Claim: the section order matches the exam. **Holds, and is worth keeping.**

The arm found the exam's order — cloze → closest meaning → reading →
paragraph completion — independently of this repo, and it matches what
`js/topics.js` already carries. That is a piece of fidelity the app got
right without arguing for it, which is worth writing down so a future
round does not reorder the tabs for visual reasons.

### On the TAP literature: the arm corrected round one, and is right to.

`12-arastirma/06-rakip-analizi.md` leaned on Morris/Bransford/Franks
1977 to argue for visual fidelity. Arm 2 points out that paper is about
**encoding–retrieval task match**, not visual chrome, and adds the
outshining hypothesis — that strong noncontextual cues suppress
context-match effects. A four-option recognition item is full of
noncontextual cues. So the visual-fidelity lever is smaller than round
one implied.

This is the correct direction of travel: it weakens an argument this
project would have liked to be true. Recorded as a correction to
round one, not to arm 2.

---

*(Arms 1, 3, 4, 5, 6 and 7 still running at the time of writing.)*
