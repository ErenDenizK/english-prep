# Motion v0.76 — choreography

Current page-entry and answer motion. Supersedes the page-opening parts of
[motion-v073](../history/design/motion-v073.md) and [ADR 013](../adr/013-restore-page-entry-and-browser-space.md);
button press/release, the scroll rail, the aurora tempo, onboarding artwork and
the About folio are unchanged. Decision record: [ADR 014](../adr/014-choreographed-entrances.md).

## What was wrong

Every v0.72–v0.75 entrance went through `whenVisible`: the new screen was
painted in its **final** layout, the code then waited for fonts and two more
frames, and only then moved the content 12 px sideways and back — with no
opacity change. The learner saw *appear → twitch → settle*. That one sequence
is why page openings felt cheap in both the 360 ms (v0.72) and the 620 ms
(v0.73) versions: the length was never the problem, the late start was.

## The rule now

1. **Start before the first paint.** A screen's cascade is created in the same
   task that commits its DOM (`compose` / `composeScreen` in
   `js/interactions.js`). Each animation uses `fill: backwards`, so the first
   painted frame is already frame 0 of the entrance. Nothing is painted final
   and then moved.
2. **One vector per screen.** Every part of one cascade moves the same way:
   - tab siblings (Eğitim ⇄ Test) slide 28 px in the direction of travel (`enter`);
   - drill-ins (topic, lesson, Profil, results, onboarding copy) rise 18 px (`rise`);
   - a new question's prompt slides 40 px (`prompt`); its options only fade, because an answer target never travels.
3. **Real springs, no runtime loop.** Three damped springs are simulated once
   at module load and sampled into CSS `linear()` easings (60 points per
   second). Browsers without `linear()` get an expo-out curve of the same
   settling time.

   | Spring | k / c | Settles | Overshoot | Used by |
   | --- | --- | --- | --- | --- |
   | soft | 420 / 36 | ~380 ms | none | rise, headline, title, settle, grow |
   | lively | 380 / 30 | ~450 ms | ~2 % | enter, prompt, menu, dialog |
   | bouncy | 600 / 30 | ~450 ms | ~8 % | pop (keys, avatar, results node) |

4. **Short cascades.** At most eight visible parts, spread over at most
   220 ms; the whole screen has landed by ~0.6 s and most of the travel by
   ~0.35 s. Offscreen parts are never animated — they are already final.
5. **Granularity is found, not configured.** `collectParts` walks the screen:
   tall wrappers are opened, painted surfaces (cards) travel whole with their
   contents, prose/controls/artwork are atomic. A new screen gets a good
   cascade with no per-screen selector list.
6. **Opacity only on the way in.** Entrances end at opacity 1 and leave no
   fill behind; the authored CSS is the final state. Reading text is never
   dimmed after it has arrived.

## Screen by screen

| Place | Motion |
| --- | --- |
| Bar title | Rises 6 px and fades in whenever the screen name changes |
| Eğitim / Test tabs | Visible parts slide in from the travel direction, 36 ms apart; nav indicator and icon pop as before |
| Topic overview, lesson | Visible parts rise; a resumed lesson does not animate |
| Profil | Sections rise; the avatar pops inside its card |
| New question | Prompt slides in; option boxes fade in place, 30 ms apart; number keys pop after them |
| Answer | Wrong pick shakes once, the right answer swells, the explanation rises; the page scrolls (smoothly) only enough to show the verdict's first lines and never past the options |
| Results (fresh) | Score card rises, signature draws, bar grows to its ratio (the figure is final from frame one — no count-up), verdict and breakdowns follow |
| Results (revisit) | The same quiet rise as any screen |
| Dialogs / menus | Panel fades and lifts (menus are never scaled, the listbox measures them); backdrop fades |
| Between documents | No view transition (see below). The aurora is in each page's HTML, so there is no flat black first frame, and it keeps one wall clock so its colours continue |

## Safety

- Real input wins: `pointerdown`/`focusin` cancel any entrance on the target or
  its ancestors, which snaps them to their final state. Options are inert once
  answered, so the shake/swell never moves something about to be tapped; the
  next action lives in the fixed bar.
- Profil's motion switch, OS reduced motion, a hidden page and `pagehide`
  cancel every entrance (final layout immediately).

## Tried and rejected

- **Cross-document view transitions** (`@view-transition { navigation: auto }`).
  While the snapshot animates, Chromium sends pointer events to the root, so
  a tap on a quiz option in the first ~280 ms after arrival was lost
  (`tests/v073_review_browser.py`, `tests/v070_motion_browser.py`).
- **Options sliding with the prompt.** A press settles a moving box at once,
  but the pointerup can land outside it and the click is lost.
- **A count-up score.** The figure would read "0 / 10" for a moment; values
  never wait for decoration.
- No animation writes state, focus or scroll except the explicit verdict scroll.

## Verification

- `tests/interactions.test.js` — springs are bounded, entrances start at
  opacity 0 with `fill: backwards` and end at 1, cascades fit the span,
  motion-off composes nothing.
- `tools/verify-ui.mjs` waits for finite animations before measuring layout
  stability (Playwright's stability wait would otherwise re-scroll mid-entrance).
- Frames were inspected by pausing every animation and seeking it to
  0/50/100/160/240/340/500 ms at 390×844 and 320×640.
