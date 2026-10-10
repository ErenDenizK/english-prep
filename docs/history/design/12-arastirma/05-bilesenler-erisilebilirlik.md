# Components and accessibility

Research arm 5 of six. 2026-09-15. Written against the brief in
`00-brief.md`: every claim is either a link or a measurement taken in
this repository today; anything unverified is marked `[?]`; every
finding ends by saying what it means for *this* app.

## 0 · What was measured, and how

Three kinds of evidence appear below.

**Bundle sizes.** Installed from npm into a scratch directory and
bundled with `esbuild` 0.28.2 (`--bundle --minify --format=esm`,
`process.env.NODE_ENV="production"`, `react`/`react-dom` marked
external so the number is the *library's own* cost), then compressed
with `gzip -9`. Versions are named in §3 so the numbers can be
re-derived. Nothing was installed into this project.

**Browser behaviour.** Measured in headless Chromium through the
global Playwright 1.56.1 this repo already uses for
`tools/verify-ui.mjs` — rendered text via `innerText`, accessibility
tree via `page.accessibility.snapshot()` and the CDP
`Accessibility.getFullAXTree` domain.

**Platform availability.** From the `web-features` package (3.38.0),
the dataset behind Baseline, read locally rather than quoted from
memory.

Repository baseline, for every ratio in this document:

| Measured in this repo | Bytes | gzip -9 |
| --- | --- | --- |
| All 27 modules in `js/`, minified | 101,444 | **32,062** |
| `js/listbox.js` alone, minified | 2,837 | 1,255 |
| `js/modal.js` alone, minified | 498 | 260 |
| `js/answers.js` alone, minified | 882 | 499 |
| `js/feedback.js` alone, minified | 1,691 | 782 |
| `js/dom.js` alone, minified | 1,913 | 818 |
| `js/shell.js` alone, minified | 2,178 | 978 |
| `js/widgets.js` alone, minified | 3,305 | 1,487 |
| `css/*.css` | 60,198 | 14,444 |
| `fonts/` | 48,016 | — |
| `data/` | 798,250 | — |

So the whole application's JavaScript is **31.3 KB gzipped**. Hold
that number; §3 spends it.

---

## 1 · The component inventory a learning app needs

The inventory below is derived from what this product actually shows —
`data/` holds 241 questions across 10 topics with the block types
`text, contrast, forms, check, examples, pitfall, decision`, and
`docs/app1-final.md` §3 commits to paragraph completion (Block B),
reading with seven questions per passage (Block C) and a timed mock
exam (Block D2). Everything here is one of those, present or planned.

A note that governs the whole table: **most of these are not ARIA
widgets.** The APG is a catalogue of *composite widgets* — things with
a roving tabindex and their own keyboard model. A lesson block, a
results breakdown and a reading passage are documents, and the correct
"pattern" for a document is HTML structure plus WCAG 1.3.1. Reaching
for an APG pattern where structure would do is the most common way a
design system makes a page less accessible, not more.

| # | What it is in this product | Correct pattern | Role / state / property |
| --- | --- | --- | --- |
| 1 | **Question with a cloze blank and four options** (`js/answers.js`) | Not a listbox, not a menu. Either the [Radio Group pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) with a separate commit action, or a plain **group of buttons** — §2 decides | `role="group"` (or `<fieldset>`) named by the stem via `aria-labelledby`; four `<button>`. If radios: `role="radiogroup"` + `role="radio"` + `aria-checked` + roving `tabindex` |
| 2 | **The blank itself** (`appendBlanked`, `js/dom.js`) | Text, not a control | A `<span>` with a visually hidden word; never a run of `_` — a screen reader reads those one at a time. Already correct here |
| 3 | **Answer state: verdict + explanation** (`js/feedback.js`) | Not a widget. A **status message**, [WCAG 4.1.3](https://www.w3.org/WAI/WCAG22/Understanding/status-messages) | One persistent `role="status"` node whose `textContent` is replaced; `aria-live="polite"`; focus never moves into it |
| 4 | **Options once answered** | Read-only-with-verdict; §2 | `aria-disabled="true"` (stays focusable) *or* roles removed; never the HTML `disabled` attribute |
| 5 | **Reading passage with seven numbered questions** (Block C, not built) | Document structure + [Landmark Regions](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/). No APG widget fits | Passage in a `<section aria-labelledby>` with a heading; each question is its own group; the question points at the passage with `aria-describedby`, and the passage must remain reachable on a 320px screen without losing the question |
| 6 | **Paragraph completion** (Block B, not built) | Same as #1 — four options, one blank — but the blank is a whole sentence | Identical semantics to #1; only the stem's length changes. This is an argument for #1 being one component, not two |
| 7 | **Lesson of typed blocks** (`js/education.js`) | Prose. Headings and landmarks | `<h2>`/`<h3>` in the body outline, `<section>` per block; English inside Turkish gets `lang="en"` (§5). Not tabs, not an accordion, not a carousel |
| 8 | **`check` block inside a lesson** | #1 embedded in a document | Same group, same live region. This is why `answers.js` and `feedback.js` are shared modules today, and that is right |
| 9 | **Progress: ring, bar, daily goal** (`js/widgets.js`, `.progress`) | Not `role="progressbar"` unless it tracks a *task in progress*. A completed fraction is an image or text | `role="img"` with the fraction spoken, or `aria-hidden` plus a real sentence nearby. `progressbar` requires `aria-valuenow`/`min`/`max` and is meant for indeterminate work |
| 10 | **Topic index / lesson list** (`js/home.js`, `js/education.js`) | A list of links or buttons. Not a listbox, not a grid | `<ul>`/`<li>` with one `<a>` or `<button>` per row; the whole row is the target |
| 11 | **Results breakdown** (`js/results.js`) | A table if it is rows × columns; otherwise a definition list | `<table>` with `<th scope>`; per-category rows link to the lesson that teaches the category |
| 12 | **Timed mock exam** (Block D2, not built) | The timer is a status message, not a live ticker | `role="status"`, updated at coarse intervals (minutes, not seconds — a live region firing every second is unusable); a per-question count as text. [WCAG 2.2.1 Timing Adjustable](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable) applies unless the time limit is *essential*, and for an exam simulation it is arguably essential — write down which |
| 13 | **Question-count control** (`js/listbox.js`) | [Select-Only Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) | `role="combobox"` + `aria-expanded` + `aria-controls` on the trigger, `role="listbox"`/`option`, DOM focus stays on the trigger, `aria-activedescendant` tracks the active option. Already correct here |
| 14 | **Confirmation** (`js/modal.js`) | [Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), on native `<dialog>` | `role="dialog"`, `aria-modal="true"`, named by its title; focus to the least destructive action; focus returns to the invoker |

That is fourteen things, against twenty-one components in
`docs/design-system.md` §7. The two lists are not in conflict: §7
counts *visual* components (Chip, Monogram, Ring, Tile), this one
counts *semantic* ones. **A design system needs both indices and
should say which is which** — §6 returns to this.

**What this means for this app.** Nine of the fourteen already exist
and eight of those nine are built correctly. The gaps are #1 (§2), #5
and #12 (not built yet), and #9, where a completion ring must not
become a `progressbar`.

---

## 2 · The four-option question

This is the app's most important widget and the one place where the
current implementation is, on the evidence, wrong.

### 2.1 What the app does today

`js/answers.js` puts `role="radiogroup"` on the wrapper and renders
four `<button>` children, with a comment explaining the choice:

> `radiogroup` rather than `radio` children, because these are buttons
> that commit an answer and do not come back — arrow keys moving a
> selection would promise an undo the app does not have.

The *reasoning* is sound. The *markup* is not.

### 2.2 Measured: what a screen reader actually gets

I rendered exactly this markup in Chromium and dumped the
accessibility tree.

```
role=radiogroup name="She ____ to school."
  role=button name="goes"    checked=undefined
  role=button name="go"      checked=undefined  disabled=true
role=group name="She ____ to school."
  role=button name="goes"
role=radiogroup name="She ____ to school."
  role=radio  name="goes"    checked=false
  role=radio  name="go"      checked=true
```

Three things follow.

1. **The children are exposed as plain buttons.** They carry no
   `checked` state and no membership in the group beyond containment.
   The APG's [Radio Group
   pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) is
   explicit that the `radiogroup` role "contains or owns radio
   buttons" and that `role="radio"` is "applied to each button".
   ARIA's normative rule on allowed children is that **"If the list is
   not empty, authors MUST only add accessibility children with
   allowed roles"** ([ARIA source,
   w3c/aria](https://github.com/w3c/aria/blob/main/index.html)). A
   `radiogroup` of buttons breaks a MUST.
2. **The "1 of 4" in the code comment is not delivered.** That
   announcement comes from the platform computing set position for
   `radio` children of a `radiogroup`. Buttons get nothing. The
   comment in `js/answers.js` describes a benefit the markup does not
   produce.
3. **`role="group"` gives the one benefit that was actually wanted.**
   The third fixture above shows `role="group"` taking the same
   accessible name from `aria-labelledby`. Grouping and naming — which
   is the WCAG 1.3.1 requirement in §8.7 of the design system — is
   delivered by `group`. `radiogroup` adds only a contract the markup
   then breaks.

**So the fix is one line**: `role="group"`, not `role="radiogroup"`,
keeping the buttons. Everything the comment defends survives; the
invalid contract goes.

### 2.3 The real design question: buttons or radios?

Radio group and button group are two different interaction models, and
the difference is not cosmetic.

**Radios, then a commit button.** This is the GOV.UK model. Its
[radios component](https://github.com/alphagov/govuk-design-system/blob/main/src/components/radios/index.md)
says "Use the radios component when users can only select one option
from a list" and "Group radios together in a `<fieldset>` with a
`<legend>` that describes them", and its
[question-pages pattern](https://github.com/alphagov/govuk-design-system/blob/main/src/patterns/question-pages/index.md)
says "Asking just one question per question page helps users
understand what you're asking them to do, and focus on the specific
question and its answer" — followed by a Continue button. Carbon says
the same for keyboard: "A group of radio buttons takes a single tab
stop… The user changes the selected radio button using the arrow
keys"
([Carbon](https://github.com/carbon-design-system/carbon-website/blob/main/src/pages/components/radio-button/accessibility.mdx)).

Cost in this app: **two taps instead of one**, and a second control in
the action bar. In 5–10 minute sessions on a phone, standing up, that
is 40 extra taps in a 40-question mock. It also breaks the shell rule
that answering must not move the control the learner is reaching for,
because the action bar would change from hint to button.

**Buttons in a named group.** One tap commits. No arrow-key model to
implement, no roving tabindex, no promise of a selection that can be
changed. Every option is its own tab stop — for four options that is
four tab stops instead of one, which is the real cost, and it is small.

**What the sector does.** H5P's Multiple Choice — the most widely
deployed open-source quiz widget — chooses radios: it sets
`role = singleAnswer ? 'radiogroup' : 'group'` on the list and
`role: 'radio'` with `aria-checked` and roving tabindex on each
option, then a separate Check button
([h5p/h5p-multi-choice, `js/multichoice.js`](https://github.com/h5p/h5p-multi-choice/blob/master/js/multichoice.js)).
1EdTech's QTI 3 models the same shape in the standard: a
`choiceInteraction` with `max-choices` — selection first, submission
second ([QTI 3
accessibility](https://www.1edtech.org/standards/qti/accessibility)).

**Recommendation for this product: keep one-tap buttons, fix the
role.** The two-step model is correct for a government form, where a
wrong answer is a wrong record and undo matters. It is wrong for a
drill whose entire value is the feedback that arrives the instant you
commit, and where `app1-final.md` §7 has already refused anything that
adds ceremony. The accessible-name requirement is met by `group`; the
selection semantics radios would add are semantics this app
deliberately does not have.

### 2.4 After the answer: read-only with a verdict

Three options, all defensible, all shipped by someone:

| Option | Who does it | Effect |
| --- | --- | --- |
| HTML `disabled` | most quiz widgets | drops out of the tab sequence; **also drops out of WCAG 1.4.11**, whose exception is "except for inactive components" ([SC 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast)) — so the verdict colours are no longer required to reach 3:1 |
| `aria-disabled="true"`, stays focusable | **this app today** | focusable, readable, still in the contrast contract |
| roles removed entirely | H5P, on check: `removeAttr('role')`, `aria-disabled="true"`, `tabindex="-1"` on every option *and* the group | options become text; reachable in browse mode, not by Tab |

The APG's [Keyboard Interface
practice](https://github.com/w3c/aria-practices/blob/main/content/practices/keyboard-interface/keyboard-interface-practice.html)
frames the trade-off exactly: "Allowing keyboard users to skip
disabled elements usually reduces the number of key presses required
to complete a task. However, screen reader users are far less likely
to discover disabled elements that are not focusable." Its convention
is to keep focusability with `aria-disabled` "when the disabled
element needs to remain discoverable".

An answered option is the single most important thing on the screen —
it is *the content*, not a dead control. So **the current choice is
right** and should be written into the spec as a rule with this
citation, not left as a comment in one module.

One measured nuance: Chromium maps `aria-disabled="true"` to
`disabled: true` in the accessibility tree (the snapshot above). So
the "disabled controls are exempt from contrast" argument in
design-system §8.1/§3 is weaker than it reads — an auditor could argue
the exemption applies either way. The *practical* reasons (focusable,
discoverable, legible) stand on their own and are the ones to cite.

### 2.5 Announcing the verdict without stealing focus

[SC 4.1.3 Status Messages
(AA)](https://www.w3.org/WAI/WCAG22/Understanding/status-messages):
"status messages can be programmatically determined through role or
properties such that they can be presented to the user by assistive
technologies **without receiving focus**."

The app's implementation is the textbook one and needs no change: a
single persistent `role="status"` node in the shell whose children are
replaced (`announce()` in `js/shell.js`), `polite`, never `assertive`,
never focused. The two details worth carrying into the spec because
they are easy to lose:

- **Persistent, not injected.** A live region created together with
  its content is frequently missed. `js/shell.js` says this; make it a
  rule with the citation.
- **The announcement must carry as much as the screen shows.**
  `answerAnnouncement()` in `js/feedback.js` speaks the verdict, the
  correct answer, the explanation *and* the note for the option the
  learner chose. A screen-reader user told less than the screen shows
  has been given a different app.
- **`lang="en"` on the English fragments inside the announcement** —
  §5, and already implemented via the `{en}` part shape.

Widely-repeated advice to use `role="alert"`/`aria-live="assertive"`
for quiz feedback (e.g. [QuizAPI's
guide](https://quizapi.io/blog/quiz-accessibility-wcag-compliance))
is wrong for this product and the app is right to refuse it:
`assertive` interrupts a learner who is still hearing the option they
chose. W3C's COGA
[*Making Content Usable*](https://github.com/w3c/coga/blob/main/content-usable/index.html)
pattern **O4p10 status-feedback** asks for "rapid feedback or visual
cues to show when an event is successfully triggered" — rapid, not
interrupting.

**What this means for this app.** One line changes in `js/answers.js`
(`radiogroup` → `group`), one comment gets corrected, and three
existing behaviours get promoted from comments to specified rules.

---

## 3 · Headless component libraries

### 3.1 What they genuinely solve

The honest case for them is not "accessibility" in the abstract. It is
a long tail of platform bugs that nobody discovers from a
specification. React Aria's `usePress` is the clearest artefact: 1,198
lines, six comments citing specific browser bug URLs. Verbatim, from
[`packages/react-aria/src/interactions/usePress.ts`](https://github.com/adobe/react-spectrum/blob/main/packages/react-aria/src/interactions/usePress.ts):

- "macOS has a bug where keyup events are not fired while the Meta key
  is down." — three tracker links, Chromium, WebKit and Mozilla.
- "iOS safari fires pointer events from VoiceOver with incorrect
  coordinates/target. Ignore and let the onClick handler take care of
  it instead." — `bugs.webkit.org/show_bug.cgi?id=222627`.
- "iOS and Android do not focus or fire onClick after a long press. We
  work around this by triggering a click ourselves after a timeout…
  The timeout must be at least 32ms, because Safari on iOS delays the
  click event on non-form elements without certain ARIA roles (for
  hover emulation)."
- "Safari does not call onPointerCancel when a drag starts, whereas
  Chrome and Firefox do."
- "touchAction: 'manipulation' is supposed to be equivalent, but in
  Safari it causes onPointerCancel not to fire on scroll." —
  `bugs.webkit.org/show_bug.cgi?id=240917`.

Note which of these matter here. The iOS-VoiceOver pointer-coordinate
bug and the long-press/click bug are **touch, mobile, screen-reader
bugs** — precisely this app's platform. The Meta-key one is not.

Beyond press handling, the recurring wins are: focus containment and
restoration, typeahead in a listbox (this app implements it, including
the repeat-a-character cycle and Turkish-aware
`toLocaleLowerCase("tr")`), RTL arrow-key inversion, and
`aria-activedescendant` bookkeeping.

**But look at what this app builds on.** Of that list, the app already
gets focus containment, focus restoration, Escape, the top layer and
inert-everything-else *from the platform*, because `js/modal.js` uses
native `<dialog>` — Baseline **Widely available since 2024-09-14**
(`web-features` 3.38.0), with `inert` itself widely available since
2025-10-11. RTL is not a requirement: the UI is Turkish and the
content is English. The remaining genuinely-hard widget is the
listbox, and it is one file of 235 lines.

### 3.2 What they cost, measured

All figures below are the library's own code, React excluded, minified
and gzipped, importing only the parts a quiz app needs (a radio group,
a modal dialog and a select).

| Library | Version | min KB | **gzip KB** |
| --- | --- | ---: | ---: |
| `react` + `react-dom` (baseline, nothing else) | 19.3.0 | 217.4 | **67.2** |
| `@radix-ui/react-{radio-group,dialog,select}` | 1.4.7 / 1.1.23 / 2.3.7 | 103.1 | **34.9** |
| `@headlessui/react` | 2.2.10 | 118.8 | **41.2** |
| `@ark-ui/react` | 5.39.2 | 136.7 | **42.3** |
| `@zag-js/{radio-group,dialog,select}` (no React) | 1.44.0 | 139.6 | **43.7** |
| `@base-ui-components/react` | 1.0.0-rc.0 | 153.8 | **52.6** |
| `react-aria-components` | 1.21.1 | 185.2 | **59.0** |

Per primitive, which is the number that decides:

| Primitive | gzip KB | The file it would replace here | gzip KB | Ratio |
| --- | ---: | --- | ---: | ---: |
| Radix `Select` | 30.7 | `js/listbox.js` | 1.26 | **24×** |
| Radix `Dialog` | 13.3 | `js/modal.js` | 0.26 | **52×** |
| Radix `RadioGroup` | 10.1 | `js/answers.js` | 0.50 | **20×** |
| Zag `dialog` + vanilla adapter | 19.8 | `js/modal.js` | 0.26 | **78×** |
| Zag `select` + vanilla adapter | 31.8 | `js/listbox.js` | 1.26 | **25×** |
| Zag `radio-group` + vanilla adapter | 11.8 | `js/answers.js` | 0.50 | **24×** |

And the totals that matter for the brief's real question:

- The whole app's JavaScript today: **31.3 KB gzipped.**
- React + ReactDOM alone: **67.2 KB** — **2.1×** the entire app,
  before one component exists.
- React + Radix's three primitives: **102.1 KB** — **3.3×** the app's
  current JS, to replace ~2.0 KB of it.
- Melt UI is Svelte-only and was not measured; it would also require a
  compiler, which `00-brief.md` lists as the constraint under review
  and which this app does not have. `[?]` on its size.

### 3.3 Lock-in

Bundle size is recoverable; API shape is not. Three observations.

- **Every library except Zag is framework-coupled by peer dependency.**
  Measured from the installed `package.json` files:
  `@radix-ui/react-radio-group` declares `react` and `react-dom`
  peers; `@ark-ui/react` declares `react >=18`; `@zag-js/radio-group`
  declares **no peer dependencies at all** — its core is a framework
  agnostic state machine ("A minimal implementation of xstate fsm for
  UI machines", per `@zag-js/core`), with `@zag-js/vanilla` 1.44.0 as
  the DOM adapter.
- **The ecosystem is churning.** Base UI was started in 2024 by people
  from Radix, MUI and Floating UI and reached v1.0 in December 2025
  ([mui/base-ui](https://github.com/mui/base-ui)); shadcn/ui now
  offers Radix *or* Base UI at init. A component library is a
  multi-year dependency and this particular corner of the ecosystem
  has re-formed once in two years.
- **The cost is not the install, it is the rewrite.** Adopting React
  means rewriting `js/education.js` (1,888 lines), `js/storage.js`
  (1,071), `js/profile.js` (688) and `js/home.js` (714) — 8,285 lines
  of ES modules — to buy correctness in ~2 KB of widget code.

### 3.4 Is there a framework-free equivalent worth using?

Yes, but the answer is smaller than a library. Measured:

| Framework-free | Version | min KB | gzip KB | What it buys here |
| --- | --- | ---: | ---: | --- |
| `a11y-dialog` | 8.1.5 | 4.7 | 1.7 | nothing — native `<dialog>` already does it |
| `@github/combobox-nav` | 3.0.2 | 4.8 | 1.5 | the arrow/typeahead half of `listbox.js` |
| `focus-trap` + `tabbable` | 8.2.2 / 6.5.0 | 26.3 | 9.3 | nothing — `<dialog>` + `inert` do it |
| `@floating-ui/dom` | 1.8.0 | 21.3 | 8.3 | popup collision handling, if a menu ever needs to flip |
| `@zag-js/*` + vanilla adapter | 1.44.0 | see above | 11.8–31.8 | full widget state machines, no framework |

And two platform features that cost **0 KB**:

- **Native `<dialog>`** — Baseline Widely available 2024-09-14. Already
  used.
- **Customisable `<select>`** (`appearance: base-select`) — this would
  delete `js/listbox.js` entirely. `web-features` 3.38.0 reports
  Baseline **false**, Chrome/Edge 135+ only, no Firefox, **no Safari**.
  Not adoptable for a phone-first app on iOS. Worth re-checking in a
  year; the entire reason `listbox.js` exists is that the native
  control opens OS chrome.
- `popover` is Baseline newly available (2025-01-27) and CSS anchor
  positioning is Baseline **false** with no shipping support recorded,
  so the listbox's absolute positioning stays hand-rolled.

**Rejection, stated plainly.** For a set of three custom widgets, on a
phone, at 31.3 KB of total JavaScript, with no build step, on GitHub
Pages — **no headless library in this survey pays for itself.** The
cheapest credible option (Radix's three primitives) costs 3.3× the
app's entire JavaScript payload and requires a framework, a build step
and a rewrite of 8,285 lines, to replace 2.0 KB of code that the
measurement in §2 shows is already correct in two cases out of three.
The hand-rolled approach is defensible *at this size* — and the reason
it is defensible is not that hand-rolling is easy, it is that
`js/modal.js` is 260 bytes because it delegated to the platform, and
`js/listbox.js` is 1.26 KB because it implemented one well-specified
contract once.

The honest caveat: this conclusion is size-dependent. At forty
components with menus, date pickers, comboboxes with filtering and
drag-and-drop, it inverts. `docs/app2/` is where that question belongs.

---

## 4 · Focus, keyboard and touch

### 4.1 The real numbers for target size

Four different numbers get quoted as "the 44px rule". They are four
different requirements.

| Source | Number | Status |
| --- | --- | --- |
| [WCAG 2.2 SC 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) | **24 × 24 CSS px** | **AA** — the conformance floor |
| [WCAG 2.1/2.2 SC 2.5.5 Target Size (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced) | **44 × 44 CSS px** | AAA |
| Apple Human Interface Guidelines | 44 × 44 pt | platform guidance, not a legal floor |
| Material Design | 48 × 48 dp | platform guidance |

SC 2.5.8, verbatim from the
[normative source](https://github.com/w3c/wcag/blob/main/guidelines/sc/22/target-size-minimum.html):

> The size of the target for pointer inputs is at least 24 by 24 CSS
> pixels, except when:
> **Spacing:** Undersized targets are positioned so that if a 24 CSS
> pixel diameter circle is centered on the bounding box of each, the
> circles do not intersect another target or the circle for another
> undersized target;
> **Equivalent:** The function can be achieved through a different
> control on the same page that meets this criterion;
> **Inline:** The target is in a sentence or its size is otherwise
> constrained by the line-height of non-target text;
> **User Agent Control:** … **Essential:** …

Two details that matter and are usually missed. The Understanding
document says the test is geometric — "it must be conceptually
possible to draw a solid 24 by 24 CSS pixel square, aligned to the
horizontal and vertical axis such that the square is completely within
the target" — and it gives rounded corners as a failing case: "The
rounded corners do not leave sufficient space to draw a 24 by 24px
square inside the target, making the target undersized." This app's
buttons are pills at `--r` radius; a nominally-24px pill can fail.
SC 2.5.5 (AAA) has **no spacing exception** — only Equivalent, Inline,
User Agent Control and Essential.

**Hit target vs visual size.** SC 2.5.8 measures the *target*, not the
ink. Material states this directly: "The icon for the control does not
have to be the full size, but can use padding to increase the visual
space." So a 20px icon inside a 48px button is conformant and is the
correct way to keep a dense screen legible — extend the target with
padding or a pseudo-element, never shrink the button to match the
glyph.

**What this means for this app.** `docs/design-system.md` §8.1 already
specifies 48 primary / 44 secondary / 24 absolute floor and explains
that 48 clears AAA, Material and Apple at once. That is correct and
better than the requirement. `css/style.css` declares `min-height:
44px` in two places (lines 1167, 1289) and nothing at 48 — worth a
check that the 48s come from padding and line-height rather than being
absent, since `npm run audit` already measures rows and filled
buttons. The rounded-corner caveat is not in §8.1 as a *test* and
should be, because the app's shapes are pills.

### 4.2 `:focus-visible` and focus-ring design

`:focus-visible` is Baseline **Widely available since 2024-09-14**
(`web-features` 3.38.0; Chrome/Edge 86, Firefox 85, Safari 15.4). The
Selectors 4 definition is "an E element that has user input focus, and
the UA has determined that a focus ring or other indicator should be
drawn for that element"
([csswg-drafts/selectors-4](https://github.com/w3c/csswg-drafts/blob/main/selectors-4/Overview.bs)).
There is no compatibility reason left to ship a `:focus` fallback or a
JavaScript `focus-visible` polyfill.

The contrast requirements for the ring:

- **AA, [SC 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast)**: "Visual
  information required to identify user interface components and
  states" must reach **3:1** against adjacent colours. A focus ring is
  a state indicator.
- **AAA, [SC 2.4.13 Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance)**: an
  area "at least as large as the area of a 2 CSS pixel thick perimeter
  of the unfocused component" with "a contrast ratio of at least 3:1
  between the same pixels in the focused and unfocused states."
- **AA, [SC 2.4.11 Focus Not Obscured
  (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum)**: the
  Understanding document names sticky footers among "typical types of
  content that can overlap focused items" and names `scroll-padding`
  as the fix.

**What this means for this app.** `css/style.css` line 1859 already
does `:focus-visible { outline: 2px solid var(--focus); outline-offset:
2px }` — 2px is exactly the AAA perimeter figure, and the offset is
what makes the ring survive a lit card. Two things to make explicit in
the spec rather than leave implicit:

- `--focus` is a *single* token (line 153, `--focus: var(--c-focus)`).
  A ring that must clear 3:1 against *both* `--page` and `--card` and
  `--raised`, in both themes, is four contrast pairs, not one. If
  those rows are not in `PAIRS` in `tools/palette.mjs`, the ring is
  the one colour in the system not solved against a requirement.
- Line 1221 sets `.field:focus-visible { outline: none }` and line
  1304 re-adds an inset 2px ring. That is fine, but it is the pattern
  that most often regresses to a bare `outline: none`. It should be a
  named rule ("a control may move its ring inside, never remove it"),
  with the components page showing the focused state of every control
  — which is what §6 recommends anyway.

### 4.3 Touch

The app's `:focus-visible`-only ring is the right answer to the "thumb
tap paints an outline" problem, and design-system §8.5 says so. The
remaining touch hazards, from the `usePress` evidence in §3.1, are all
**iOS** ones: the VoiceOver pointer-event coordinate bug, the missing
click after a long press, and `touch-action: manipulation` suppressing
`pointercancel` on scroll in Safari. This app uses plain `click`
listeners on real `<button>` elements, which is precisely why those
bugs mostly do not reach it — every one of them is a hazard of
*synthesising* press semantics from pointer events. **The fact that
`js/answers.js` binds `click` on a `<button>` rather than
`pointerdown` on a `<div>` is what makes hand-rolling safe here, and
it should be written down as a rule**, because it is the rule that a
future "make the option feel snappier" change would break.

---

## 5 · Turkish-language accessibility

### 5.1 The dotted-I trap, measured

CSS Text 3 makes casing language-sensitive, normatively: "If (and only
if) the content language of the element is, according to the rules of
the document language, known, then any appropriate language-specific
rules must be applied as well", and it calls out Turkish by name —
"this mapping must only take effect if the content language is Turkish
written in its modern Latin-based writing system"
([csswg-drafts/css-text-3](https://github.com/w3c/csswg-drafts/blob/main/css-text-3/Overview.bs)).
The mappings come from Unicode's `SpecialCasing.txt`.

I measured Chromium's behaviour directly, with `text-transform:
uppercase` and `innerText`:

| Markup | Rendered |
| --- | --- |
| `<p lang="tr">iyi ışık indir</p>` | `İYİ IŞIK İNDİR` |
| `<p lang="en">simple indir</p>` | `SIMPLE INDIR` |
| `<p lang="tr">simple <span lang="en">simple</span></p>` | `SİMPLE SIMPLE` |
| `<p>simple iyi</p>` (inherits `lang="tr"` from `<html>`) | `SİMPLE İYİ` |

So the convention in `CLAUDE.md` is confirmed, and the third row is
the proof: inside a Turkish page, an English word without `lang="en"`
uppercases to `SİMPLE`, and with it to `SIMPLE`. `text-transform`
itself is Baseline widely available since 2018-01-29, and the
language-sensitive part is what varies — Chromium is correct here;
WebKit and Gecko were not re-tested in this environment `[?]`, though
the spec text is normative for all three.

### 5.2 `lang` correctness and voice switching

[SC 3.1.2 Language of Parts
(AA)](https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts):
"The human language of each passage or phrase in the content can be
programmatically determined except for proper names, technical terms,
words of indeterminate language, and words or phrases that have become
part of the vernacular of the immediately surrounding text."

That exception is load-bearing for this app and deserves a decision
written down. "Present Perfect" in a Turkish sentence is a **technical
term**; "*Test*" and "*Profil*" are Turkish words. But the app's own
audience definition says the learner has "competence without the
labels", so grammar terms are *being taught* — they are content in
English, not vernacular. Marking them is both the safer reading and
the one that makes `text-transform` behave (§5.1). **The rule to write
down: any English string that is content gets `lang="en"`; Turkish
loanwords that are simply Turkish do not.**

Screen readers switch synthesiser voice on `lang` only if (a) the
option is enabled and (b) a voice for that language is installed.
NVDA's user guide documents automatic language switching as a speech
setting that depends on synthesiser support
([NVDA 2025.3.2 User
Guide](https://download.nvaccess.org/releases/2025.3.2/documentation/userGuide.html)).
The failure mode is therefore *graceful*: a missing Turkish or English
voice means the fragment is read with the wrong phonology, not that it
is skipped. Marking it up can only help.

`js/shell.js`'s `announce()` already carries `{en}` parts into
`lang="en"` spans inside the live region, which is the one place this
is easy to forget — an announcement is built from fragments and a live
region is re-read wholesale. Keep it.

### 5.3 What is *not* a Turkish problem

Worth saying so the spec does not over-engineer: Turkish is
left-to-right, uses Latin script and needs no special shaping. The RTL
support that headless libraries advertise (§3.1) buys this product
nothing. The real Turkish costs are three: the casing map above,
`toLocaleLowerCase("tr")` in type-ahead (already correct in
`js/listbox.js`), and word length — Turkish is agglutinative and
labels run long, which is a 320px layout problem, not an
accessibility one.

---

## 6 · Component documentation

### 6.1 What a professional component spec contains

Three real systems, and their actual section structure. GOV.UK's
[radios page](https://github.com/alphagov/govuk-design-system/blob/main/src/components/radios/index.md),
headings in order, verbatim:

```
When to use this component
When not to use this component
How it works
If you're asking one question on the page
If you're asking more than one question on the page
Inline radios
Radio items with hints
Radio items with a text divider
Conditionally revealing a related question
Smaller radios
Error messages
Research on this component
```

IBM Carbon splits the same material across two pages. Usage
([source](https://github.com/carbon-design-system/carbon-website/blob/main/src/pages/components/radio-button/usage.mdx)):

```
Live demo
Overview
  When to use
  When not to use
Formatting
  Anatomy
  Alignment
  Placement
Content
  Main elements
  Overflow content
  Further guidance
Behaviors
  States
  Interactions (Mouse, Keyboard)
AI presence
Related
References
Feedback
```

Accessibility
([source](https://github.com/carbon-design-system/carbon-website/blob/main/src/pages/components/radio-button/accessibility.mdx)):

```
What Carbon provides
Keyboard interaction
Labeling and states
Development considerations
```

And Carbon's anatomy section is worth quoting for its shape, because
it is a *numbered parts list*, not prose: "1. Group label (optional):
Describes the group of options or provides guidance for making a
selection. 2. Radio button input: Indicates the state of a radio
button… 3. Radio button label: Describes the information you want to
select or unselect."

The union of the two — and the thing this project should copy — is
seven headings:

1. **What it is** and where it appears (which screens, which section).
2. **When to use / when not to** — with the alternative named.
3. **Anatomy** — a numbered parts list, not a paragraph.
4. **Variants and sizes** — every one that exists, none that do not.
5. **States** — every state, and the rule for each.
6. **Accessibility** — role/state/property, keyboard, and the
   citation.
7. **Content** — what the label may say, in which language, and how
   long it may be.

GOV.UK adds an eighth this project should steal outright: **"Research
on this component"** — what was tried, what failed, what a real user
did. This repo already generates that material (`docs/content-review.md`,
`docs/audit/`, the owner's rejection of six visual rounds) and
currently spends it in plan documents that nobody reads twice.

### 6.2 What this project has and what is missing

`docs/design-system.md` §7 is a **21-row table, one line each** on
anatomy · sizes · states · tokens · accessibility. `docs/components.html`
is a live catalogue — every component, every state, both themes, built
against the real CSS, and the sweep fails when a components-layer class
has no entry.

That combination is genuinely better than most design systems at the
two things systems usually fail: the catalogue cannot drift from the
code, and the tokens are solved rather than chosen. What it lacks is
the *prose*: a one-line table row cannot hold "when not to use",
"what was tried", or the citation behind a rule. The evidence is
§2 of this document — the wrong role survived in `js/answers.js`
because its justification lived in a code comment, where no reviewer
compares it to the APG.

So the gap is not a new artefact. It is a **third face on the existing
two**: table (index) → catalogue (proof) → page (reasoning). And the
page only needs to exist for components that have a decision in them.
Fourteen of the twenty-one — Chip, Monogram, Ring, Avatar, Tile, Stat,
Progress and the rest — are fully described by the table row they
already have.

---

## Öneri

**1 · Fix the one measured defect first, before any design work.**
In `js/answers.js`, `role="radiogroup"` → `role="group"`, keep the
four `<button>` children and the `aria-labelledby` to the stem. It is
a one-line change; it removes an ARIA MUST violation; and the
accessible name and grouping that the comment defends are preserved
(measured, §2.2). Correct the comment at the same time: the markup
does not produce "1 of 4", and it never did. Add a case to
`tools/verify-ui.mjs` asserting the options group is `role="group"`
with an accessible name equal to the stem, so it cannot regress.

**2 · Keep one-tap commit. Reject the radios-plus-Continue model.**
GOV.UK and H5P are both right for their products and wrong for this
one: this app's whole value is feedback at the instant of commitment,
and `app1-final.md` §7 has already refused added ceremony. Write the
rejection down with its reason, so the next reviewer who finds the
APG radio pattern does not reopen it.

**3 · Specify the fourteen semantic components, not twenty-one visual
ones.** §1's table is the inventory. It is a different axis from
design-system §7 and both should exist: §7 says what a thing looks
like, this says what a thing *is*. The two entries that are not yet
decided — the reading passage with seven attached questions (Block C)
and the timed mock (Block D2) — should be specified *before* the
schema work starts, because §1 shows the passage is a document-structure
problem, not a widget problem, and the timer is a status message, not
a live ticker.

**4 · Hand-roll. Do not adopt a headless library.** Measured: the
entire app's JavaScript is 31.3 KB gzipped; React + ReactDOM alone is
67.2 KB (2.1×) and React + Radix's three primitives is 102.1 KB
(3.3×), to replace 2.0 KB of code. The framework-free options fare no
better per widget (Zag's vanilla dialog is 19.8 KB against
`js/modal.js`'s 260 bytes, 78×). This is a rejection with a
size-dependent expiry date: it holds for ~14 components on a phone
with no build step, and it inverts somewhere north of forty.

**5 · Steal the two rules that make hand-rolling safe**, and put them
in the spec as rules rather than comments:
- *Delegate to the platform wherever the platform is correct.*
  `js/modal.js` is 260 bytes because `<dialog>` is Baseline widely
  available (2024-09-14) and brings the top layer, `::backdrop`,
  focus containment, Escape and `inert`.
- *Never synthesise press semantics.* Bind `click` on a real
  `<button>`. Every iOS bug catalogued in `usePress` (§3.1) is a
  hazard of building a button out of pointer events.

**6 · Three small accessibility additions to design-system §8:**
- §8.1 gains the *geometric* target test and the rounded-corner
  caveat, verbatim from the Understanding document — the app's shapes
  are pills, so this is the failure mode it is actually exposed to.
- §8.1 gains the correct provenance of the numbers: 24 is AA
  (2.5.8), 44 is AAA (2.5.5), 44pt is Apple, 48dp is Material.
- A new focus-ring row: `--focus` must clear 3:1 (SC 1.4.11) against
  `--page`, `--card` and `--raised` in both themes; add those rows to
  `PAIRS` in `tools/palette.mjs` if they are not there. And a named
  rule: a control may move its ring inside, never remove it.

**7 · Write the Turkish `lang` rule down as a decision, not a
convention.** Measured in Chromium (§5.1): an unmarked English word in
a Turkish page uppercases to `SİMPLE`. The rule is "English content
gets `lang="en"`; Turkish loanwords do not", and the reason it is a
decision rather than an obvious call is SC 3.1.2's technical-terms
exception, which would let the app skip it. It should not, and the
audience definition in `CLAUDE.md` is why: these terms are what is
being taught.

**8 · The component spec's shape.** Seven headings — What it is /
When to use and not use / Anatomy as a numbered parts list / Variants
and sizes / States / Accessibility with the citation / Content — plus
GOV.UK's eighth, **Research on this component**. Write pages only for
components that contain a decision; the other fourteen keep their
one-line table row. The page is the third face of what already
exists: design-system §7 is the index, `docs/components.html` is the
proof, the page is the reasoning. The `answers.js` defect is the
argument for it: a justification that lives only in a code comment is
never checked against its source.

---

## Doğrulanamayanlar

- **`posinset` / `setsize` for radios.** Chromium's CDP
  `Accessibility.getFullAXTree` returned no `posinset`/`setsize` for
  *either* `role="radio"` children or `<input type="radio">` in my
  fixture, so I could not directly demonstrate the "1 of 4" that
  screen readers speak; it is computed at the platform mapping layer.
  What I *did* measure is that radios expose `checked` and buttons in
  a `radiogroup` expose nothing — which is sufficient for the finding,
  but the positional claim itself is `[?]`.
- **Non-Chromium Turkish casing.** §5.1 was measured only in headless
  Chromium. CSS Text 3 makes the behaviour normative, and it is
  long-standing, but WebKit and Gecko were not tested here — and
  WebKit is the engine that matters most for this audience. `[?]`
  Worth a single manual check on an iPhone.
- **Screen-reader voice switching in practice.** NVDA documents
  automatic language switching; I could not reach comparative
  2025–2026 test data for JAWS, VoiceOver or TalkBack with a Turkish
  primary voice and English fragments. `[?]`
- **Melt UI, and Svelte/Vue-coupled libraries generally.** Not
  measured — they need a compiler, which is the constraint under
  review, so a size number would not have changed the recommendation.
  `[?]` on their bundle cost.
- **The `aria-disabled` contrast-exemption argument.** Chromium maps
  `aria-disabled="true"` to AX `disabled: true`, so the design
  system's claim that `aria-disabled` keeps an answered option inside
  WCAG 1.4.11's contract (while HTML `disabled` would exempt it) is
  not clearly supported. The behavioural reasons are sound; the
  contrast-conformance reason is `[?]` and should not be the one
  cited.
- **Real-device verification of anything here.** Every browser
  measurement in this document is headless Chromium on Linux. The
  app's audience is on phones; `docs/design-system.md` §11 already
  keeps a list of things to confirm on real devices and §4.1's
  rounded-corner target test belongs on it.
- **Egress limits on sourcing.** `w3.org`, `developer.mozilla.org`,
  `design-system.service.gov.uk`, `react-spectrum.adobe.com`,
  `h5p.org` and `bundlephobia.com` were all blocked from this
  environment. Where a W3C document is cited above, the quoted text
  was read from the specification's own source repository on GitHub
  and the link points at the canonical W3C URL; the GitHub source is
  named in the link text where the two differ. Nothing above is
  quoted from memory, but a reader re-checking a quotation should
  expect the canonical page to be authoritative if they disagree.
