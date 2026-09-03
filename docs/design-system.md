# Design system

The rules every screen in this app follows, and **why** each rule exists.
This file is the reference: if a screen disagrees with something here, the
screen is wrong. If a rule here turns out to be wrong, change it here
first, then change every screen — never let one screen quietly diverge.

Written for the `v0.11` visual overhaul, prompted by direct feedback that
the interface was "kutu içinde kutu, çok göz yoruyor" (box inside box,
very tiring on the eyes) and a request that the design be minimal,
legible, and deliberate rather than accidental.

---

## The problem this replaces

Before `v0.11`, essentially every element in the app was drawn as
`border: 1px solid var(--color-border)` over a transparent background.
That single habit produced two compounding problems:

**1. Boxes nested up to three deep.** On the Test screen: an accordion
tier (bordered) held topic cards (bordered) which held category chips and
badges (bordered). On the quiz screen: a question card (bordered) held
option buttons (bordered) which were followed by a feedback block
(bordered) containing a tip separated by another rule. Same on Profil, on
Results, and on the Eğitim index.

**2. No hierarchy.** Because a chip, a card, a section wrapper and a
button all drew the *same* 1px line in the *same* color, nothing looked
more or less important than anything else. The eye had no path to follow,
so it had to read everything at equal weight — which is precisely what
makes an interface tiring.

The fix is not "remove some borders." It is a different model for how
structure gets communicated at all.

---

## Rule 1 — Depth comes from lightness, not from outlines

**In a dark interface, elevation is expressed by making a surface
lighter, not by drawing a line around it.** Shadows read as harsh and
unnatural on dark grounds, and outlines add visual noise proportional to
how many things you have; lightness scales cleanly because the eye reads
"closer to me" without registering an extra graphic element.

The app has exactly three levels. Nothing needs a fourth:

| Level | Token | What lives here |
| --- | --- | --- |
| 0 | `--color-bg` | The page itself. Never bordered, never tinted. |
| 1 | `--color-surface` | Grouped and interactive things: topic cards, chapter rows, option buttons, stat tiles, list rows. Filled, **no border**. |
| 2 | `--color-surface-raised` | Only things genuinely floating above the page: the dropdown menu, the modal. |

A border is now allowed in exactly three situations, and no others:

- **Shell chrome** — the hairlines separating the header and the bottom
  nav from the scrolling content. These separate *regions*, not content.
- **State** — a correct/incorrect answer, a selected option, a focus
  ring. Here the line carries meaning, so it earns its ink.
- **A single accent rail** — the left edge of a callout. One per screen
  at most.

Everything else expresses itself with fill, space and type.

> Grounded in dark-UI elevation practice: surfaces layer upward from the
> darkest background, and each step up in elevation adds lightness.
> ([Uxcel: Mastering Elevation for Dark UI](https://uxcel.com/blog/mastering-elevation-for-dark-ui-a-comprehensive-guide-342),
> [Toptal: Principles of Dark UI Design](https://www.toptal.com/designers/ui/dark-ui-design))

## Rule 2 — Never wrap a list of boxes in another box

If a section contains a list of cards or rows, that section is **a
heading and some space** — not a bordered container. The wrapper adds a
line, an inset, and a nesting level while communicating nothing the
heading doesn't already communicate.

This is the rule that killed the `.topic-tier` accordion border, the
`.panel` wrapper around the Eğitim chapter list, and the `.panel` around
each Profil section.

> This is standard card guidance, not a preference: don't place a list of
> selectable cards within a wrapper card.
> ([Appian SAIL: Avoiding Clutter](https://docs.appian.com/suite/help/24.4/sail/ux-avoiding-clutter.html),
> [UX Design World: Designing UI Cards](https://uxdworld.com/designing-ui-cards/))

## Rule 3 — Space groups; lines separate only when space can't

Related things sit close, unrelated things sit far apart, and the gap
between two sections is always larger than the gap inside one. When that
holds, a divider is redundant.

The scale is a simple ramp, and only these values are used:

```
--space-1: 0.5rem    inside a component (label to value)
--space-2: 1rem      between components in a group
--space-3: 1.5rem    component padding
--space-4: 2rem      between one section and the next
--space-5: 3rem      between one major region and the next
```

> Combine content and whitespace effectively and you may not need borders
> or shadows at all; dividers are rarely the right tool inside a card.
> ([Ramotion: Card UI Design](https://www.ramotion.com/blog/card-ui-design/))

## Rule 4 — Type carries hierarchy, so it must be a real scale

Three sizes of heading, one body size, one small size, one micro size.
Section headings are the app's structural signposts, so they get a
consistent treatment everywhere: display face, muted color, small size,
letterspaced — an "eyebrow" that reads as a label rather than competing
with the content beneath it.

Grammar category names stay in **English** and always carry `lang="en"`.
Without it, a Turkish page's uppercase transform renders "Simple" as
"SİMPLE" (dotted Turkish İ). This is a correctness rule, not a style one.

## Rule 5 — Radius says what kind of object something is

`3px` reads as "an outlined box." A filled surface at `10px` reads as a
soft, physical object — which is what a card should feel like once it
isn't a rectangle of hairlines.

```
--radius:    10px    surfaces, cards, rows, inputs, buttons
--radius-sm:  6px    small inline things (chips, badges, tight controls)
--radius-pill: 999px pills and circular controls
```

## Rule 6 — Progress must be visible

A learner opening Eğitim should see at a glance what they've already read
and how much of a topic is left. Completion marks and counts are what
turn a flat list into a sense of momentum.

This is deliberately **passive tracking only** — reading a chapter marks
it read, and nothing is ever locked or gated. Chapter *locking* (a guided
path where chapter N+1 opens only after N) is a separate, still-deferred
feature; see the README roadmap. Showing progress and restricting access
are different things, and only the first one is built.

> Completion marks and progress counts drive the goal-gradient and
> endowed-progress effects: seeing steps already done measurably increases
> the motivation to finish the rest.
> ([UXPin: Progress Tracker Design](https://www.uxpin.com/studio/blog/design-progress-trackers/),
> [Eleken: Progress Indicator UX](https://www.eleken.co/blog-posts/progress-indicator-ux))

## Rule 7 — Onboarding is one screen, once, then gone

A first-time visitor gets a single focused welcome: what this app is, and
one obvious action to take. Not a multi-step tour, not a permanent banner
occupying the top of every screen on every visit.

The previous approach — a dismissible "still in development" note pinned
above every tab — violated this twice: it sat on top of the *content* on
every screen, and it stayed until manually dismissed. Its useful content
(what you can do here today) moved into the welcome screen, where it's
read once at the moment it's relevant.

Returning visitors go straight to the app. Their state is remembered:
Eğitim progress, stats, name.

> Onboarding should get the user to a first meaningful outcome as quickly
> as possible, with the fewest steps, and reveal the rest gradually.
> ([Eleken: Mobile App Onboarding Best Practices](https://www.eleken.co/blog-posts/mobile-app-onboarding-best-practices),
> [VWO: Mobile App Onboarding Guide](https://vwo.com/blog/mobile-app-onboarding-guide/))

## Rule 8 — Destructive actions confirm; nothing is lost silently

Leaving a quiz mid-session throws away every answer given so far, so it
asks first. Resetting history asks first. Anything that discards work the
learner has done asks first — and the confirm always names what is lost,
not just "are you sure".

---

## Layout invariants (do not break these)

These predate the visual overhaul and still hold. They exist because
earlier builds shifted sideways and jumped around while answering
questions, which was the single most-complained-about behavior.

- The app is a fixed-height flex column: header (`flex: 0 0 auto`),
  scrolling content (`flex: 1 1 auto`), bottom nav / action bar
  (`flex: 0 0 auto`). **`.app-content` is the only thing that scrolls.**
- `html, body { height: 100%; overflow: hidden; }` — the page frame never
  grows, so a scrollbar never appears or disappears and the layout never
  shifts horizontally.
- Answer feedback appends *below* the options; it never re-flows what is
  already on screen.
- `[hidden] { display: none !important; }` is set globally, because the
  UA `[hidden]` rule loses to any author rule of equal specificity (e.g.
  `.btn { display: inline-flex }`) and a hidden button would stay visible.
- Native `<select>` and `window.confirm` are not used — both render OS
  chrome that breaks the app illusion and can reflow the page.

## The palette

One committed theme, warm ink and amber. Not a light/dark toggle: a
single well-tuned theme is better than two mediocre ones, and the app has
no setting that would justify the choice.

```
--color-bg              #1c1b22   page
--color-surface         #26242d   level 1
--color-surface-raised  #302e39   level 2
--color-border          #3a3742   hairlines (chrome and state only)
--color-text            #efe9de   body
--color-text-muted      #a39cae   secondary, labels, eyebrows
--color-accent          #e6a13c   the single accent — actions, progress, emphasis
--color-success         #8aab7f   correct
--color-danger          #cf7b5d   incorrect, destructive
```

The accent is used sparingly and always means the same thing: *this is
the thing to act on, or the thing that changed*. When everything is
amber, nothing is.
