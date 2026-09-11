# UI 3 — light, depth and motion

2026-09-10, the same day UI 2 shipped. The owner's verdict on it, in
substance: *it is ugly; be modern and visionary; take examples from the
polished, innovative mobile apps; everything should sparkle; research
properly — animations, lights, menu choices, onboarding, the user flow —
and plan every procedure I have not named myself.* He is right. UI 2
built the structure a product needs and then dressed it as a document:
one flat ground, no colour but the accent, no depth, no light, no
objects — every screen a column of paragraphs. Structure was the
prerequisite; this programme is the product on top of it.

Marks as elsewhere: [S] a source read; [?] unverifiable from here;
[≈] an estimate.

---

## 1 · What the polished apps have that this did not

Read on 2026-09-10, against the three emulated phones (`scratchpad/now`):

| they have | this had |
|---|---|
| **Objects.** A home screen is a hero, tiles, rings, a strip of figures — things with edges and mass. [S] Headspace's *Today* feed, Brilliant's course tiles, Revolut's card stack. | Paragraphs. The first screen was 190 words of body copy on one flat ground. |
| **Light.** Ambient gradient washes, a glow on the one primary action, translucent bars over content, a card that is a lighter plane with a lit top edge. [S] iOS 26 Liquid Glass reserves the material for the navigation layer and keeps text on solid layers; 2026 trend reports name aurora washes and glassmorphism as the premium register. | One accent colour and hairlines. |
| **Colour as identity.** A hue per topic, a gradient per brand moment, semantic tints that fill rather than outline. [S] Revolut confines its accents to illustration and its cobalt to one featured card. | Amber, and grey. |
| **Motion that answers.** Springs for things that move, ease-out for things that appear; pressed states that compress; a correct answer that *pops*; a score that counts up; a tab indicator that slides. [S] M3 Expressive's spring model; Emil Kowalski's rules — 150–300 ms, transform and opacity only, springs for physical motion, nothing over 400 ms, the more frequent the action the smaller the motion. | A crossfade and a 6 px rise. |
| **An arrival.** A first run that asks for the exam date, the daily goal and a name, and makes the home screen personal before it asks for anything. [S] Duolingo commits the learner to a goal before sign-up; every onboarding screen does one of six jobs — brand, segmentation, trust, activation, monetisation, retention. | A card of copy. |
| **A reason to come back.** A countdown to the exam, a lenient streak, a daily ring. [S] Headspace's streak forgives a missed day; exam-countdown apps exist because "23 days" motivates where a date does not. | Nothing. |

The mistake in UI 2 was not any one of these. It was reading "premium"
as *restraint* when the owner meant *craft*: the quiet document look is
a taste, and it is not his.

## 2 · What is kept

The three UI 2 contracts hold and are what makes this round safe to do
in a day: every screen is still bar · body · foot, every body is still
sections of one container each, and everything drawn is still a
component with a spec and a catalogue entry — the fourteen gain six.
The palette's *measured* values hold (`tools/palette.mjs` is extended,
not replaced), the type scale holds, the routing, storage, engine and
content are untouched, and `npm run check` plus the sweep remain the
requirement.

One UI 2 refusal is reversed, on the owner's instruction and with the
defect that justified it engineered out: **chrome is translucent
again.** v0.56 failed because its bars were too transparent (text
read through them) and its tab capsule was narrower than the content
under it. Here every bar is ≥ 82 % opaque before the blur — text
behind it becomes a tint, never a word — the scroll region pads itself
by the chrome's exact height so the first and last lines always clear
it, and the sweep measures both. The floating capsule is the iOS 26
pattern: content scrolls under it *and* is padded past it.

## 3 · The visual language

Written as tokens, because tokens are what a later feature can reach
for without redesigning.

- **Ground and light.** `--page` as before; behind it a fixed layer
  with two radial washes (`body::before`): the accent at low alpha
  top-left, a cool violet bottom-right in dark, a warm rose in light.
  The washes are the "aurora" — they move nothing and cost one paint.
- **Planes.** A card is a lighter plane in both themes now (light gets
  `--c-surface-up`, a warm white above the cream), with a 1 px `--line`
  edge, a lit top edge and a soft shadow `--shadow-1`. The hero is one
  step more: `--r-4` corners, an accent orb glowing in its corner
  (`.hero__orb`), the accent's shadow (`--shadow-glow`).
- **Accent as a pair of stops.** `--accent-2` is the second stop of
  `--grad-accent`; every filled control is the gradient with the glow
  under it. The second stop is solved in `tools/palette.mjs` so the
  label on it still meets its Lc; body text never sits on the gradient.
- **A hue per topic.** `.monogram` takes `--hue` and draws a gradient
  tile with the topic's initials in white — measured ≥ Lc 73 on every
  stop the app uses. Ten topics, ten hues, and a learner's eye finds
  *Modals* by colour before it reads.
- **Shape.** Cards 20 px, hero 24 px, controls a pill. Everything
  tappable compresses on press (`scale(0.97)`) on a spring.
- **Glass.** `--glass` is the solid fallback; under `@supports
  (backdrop-filter)` the bars become `--glass-blur` with an 18 px blur
  and 1.5 saturation. Never text on glass except the bar's own.

## 4 · Motion

Three easings, all derived (`scratchpad/ui3/spring.mjs` samples a
damped spring and emits `linear()`; the numbers in `:root` are its
output, so they can be regenerated rather than tuned by eye):

| name | spring | settles | used for |
|---|---|---|---|
| `--spring-gentle` | k 320, c 32 | 432 ms | a screen arriving, a card pressed, a progress fill |
| `--spring-bouncy` | k 260, c 18 | 768 ms | the tab indicator, a chip or choice selected |
| `--spring-pop` | k 500, c 22 | 628 ms | a correct answer, a ring reaching its value |

Transform and opacity only. Entrances stagger 40 ms per child, eight
deep. Exits are 170 ms ease-in. Under `prefers-reduced-motion` every
animation collapses to a fade or nothing, the confetti never draws, and
the count-up lands on its number. Haptics: one 12 ms pulse on an answer
where `navigator.vibrate` exists (Android; iOS ignores it) [S].

## 5 · The screens and the flow

**First run — `#hosgeldin`.** Four steps with a progress line, each one
question: *what this is* (the brand orb, one sentence, *Başla* / *Zaten
kullanıyorum*); *sınav ne zaman?* (a native date field, *bilmiyorum*
allowed); *günlük hedef* (three choice cards, 5 · 10 · 20 questions);
*adın ve görünüm* (name, optional; theme chips with live preview). It
writes `examDate`, `dailyGoal`, the name and the theme, sets
`onboarded`, and lands on Eğitim. A learner with any history is marked
onboarded on load and never sees it; the flow is reachable again from
Profil. It does not tour the interface — the research against tours
stands (`js/education.js`) — it asks for the three facts the home
screen is built from.

**Eğitim (home).** A hero: the greeting by name, the exam countdown,
today's ring against the daily goal, and *one* forward action whose
label and subtitle come from the same state machine the card had
(welcome / resume / next step / re-entry / all done) — one line each,
not a paragraph. A strip of three figures (seri · ders · doğruluk). The
search field. Topic tiles in a grid: monogram, name, progress bar,
count. The tier headings stay as section heads.

**Test.** The mixed test as the hero (count chips inline, the filled
action); the mistake book as a card with its figure; weak spots as rows
with monograms; topic rows with monogram, question count and accuracy.

**Profil.** An avatar hero (gradient circle with the initial, the name
field beneath it inline, the exam date and goal as editable rows); stat
tiles with mini rings; the weak lists; data; settings with a real
switch; about.

**Quiz.** The prompt on a card; options as cards with a letter badge,
gap between them; on select the row compresses, on verdict the right
one pops and the wrong one shakes; the feedback card slides up. The bar
and the action bar are glass; the progress line is a spring.

**Sonuç.** A ring that draws to the score while the number counts up;
a verdict line; breakdown rows with bars; confetti at ≥ 80 % (canvas,
1.6 s, reduced-motion off); the review as cards.

**Reader.** A tinted band from the topic's hue behind the title; check
blocks as cards; the end card as a small celebration with the next
step; the rest unchanged — a lesson is still something to read.

## 6 · The phases

| phase | ships | acceptance |
|---|---|---|
| **1 · Light and depth** | tokens (washes, planes, gradient, glass, springs), the overlay chrome with the floating capsule and its sliding indicator, cards and buttons restyled, stagger entrance, the six new components in the catalogue, the sweep's chrome section rewritten | every existing check green; bars measure ≥ 0.8 alpha; first and last content clear the chrome at 320 |
| **2 · Screens as a product** | the home hero and tiles, the Test hero, the Profil avatar hero and rings; `storage.js` gains exam date, daily goal, streak, today's count | index budget holds; PAIRS rows for every new text pair |
| **3 · Quiz and results feel** | option cards and their verdict motion, feedback entrance, haptic, the score ring, count-up, confetti | reduced motion: zero running animations, confetti never draws |
| **4 · Onboarding and reader** | `#hosgeldin`, its four steps, auto-skip; the reader's band, check cards, end card | the sweep walks the flow at 320; a learner with history never sees it |
| **5 · Spec and hand-off** | design-system §0/§7 updated for twenty components; CHANGELOG; three phones in both themes | a new feature is still placed, not invented |

## 7 · What this still refuses

- A third tab, a wider measure, a pane in the reader or the quiz.
- Text on glass other than the bar's own; a blur without its solid
  fallback; a capsule narrower than the content's padding.
- A gradient under body text (the second stop cannot carry Lc 75).
- Any motion over 800 ms, any animation of layout properties, any
  celebration the learner did not earn (confetti below 80 %).
- A streak that punishes: it counts days with any activity and forgives
  one missed day; it never nags and never notifies.
