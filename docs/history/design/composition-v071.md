# Stable header and result composition, v0.71

Measured on 4 October 2026 in Linux Chromium against the actual static app.
The scope is presentation; no lesson, question, explanation, score calculation
or learning-storage contract changes.

## Evidence and principles

The old header used `auto minmax(0, 1fr) auto`. Consequently, its title was
centred between the different-width edge controls rather than in the screen.
A 390 px profile moved the title 43.53 px right; the reader moved it 38.20 px.
This was an actual layout defect, not an animation preference.

Sources checked:

- [MDN: grid-template-columns](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns),
  retrieved from the [official MDN source](https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/css/reference/properties/grid-template-columns/index.md).
  Fractional tracks distribute remaining space; `minmax(0, …)` avoids an
  automatic content minimum forcing the long title to widen its track.
- [WCAG: Consistent Navigation](https://www.w3.org/WAI/WCAG22/Understanding/consistent-navigation.html),
  read from its [official source](https://raw.githubusercontent.com/w3c/wcag/main/understanding/20/consistent-navigation.html),
  explains predictable repeated navigation. It does not require mathematical
  title centring; that is the chosen design correction for this app.
- [WCAG: Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html),
  read from its [official source](https://raw.githubusercontent.com/w3c/wcag/main/understanding/22/target-size-minimum.html),
  specifies 24 CSS px or qualifying spacing/exceptions. Our retained mobile
  44 × 44 px back control is a more generous product choice, not a claim that
  WCAG's minimum is 44 px.

The public W3C pages were blocked by this environment's proxy, so the official
GitHub sources above were used. These checks do not claim user testing or a
comparative live product audit.

## Header

The two outer tracks are symmetric. On phones each reserves 3.5 rem, which
keeps the compact `ep.` mark, back target and quiz count in stable slots. The
middle track takes the remainder. Below 768 px the visible back label is
replaced by its icon; its complete existing `aria-label` stays intact. At
larger sizes the full `english prep.` mark and back labels remain visible.

The title keeps a relative line height so enlarged text does not get cut by
the old fixed 22 px line box. Long names ellipsize inside their own track,
while the full lesson title is available in the content. No width measurement,
resize event loop, extra shell markup or JavaScript centring is needed.

| Width | Old library offset | Old Profile offset | Old reader offset | New offsets |
| --- | ---: | ---: | ---: | ---: |
| 320 px | −3.09 px | +22.00 px | +6.63 px | 0.00 px |
| 390 px | −3.09 px | +43.53 px | +38.20 px | 0.00 px |
| 768 px | +36.95 px | +43.53 px | +38.20 px | 0.00 px |
| 1440 px | +36.95 px | +43.53 px | +38.20 px | 0.00 px |

The Test library also measures 0.00 px in the new layout. Real quiz interaction
checks the long `Connectors & Discourse Markers` title before and after `Çık`
becomes `Bitir`, with no change to its centre or edge-control overlap.

## Result folio

The former separated paper/connector/end symbols occupied 112 × 42 px next
to the topic. They are now one 56 × 56 px folded-page composition beside the
test identity and its literal completion state. The line artwork has three
paths and one small node, allowing the existing cancellable choreography to
remain expressive without splitting the summary into several decorations.

A completed all-correct result gets a check. A completed result requiring
review points toward its explanation. An early finish has a return arrow.
The SVG is decorative; the words and exact score communicate the outcome.
A zero-correct result therefore has neither a misleading success check nor a
large pink success number. The count uses the existing neutral text token at
32 px, down from 40 px, beside a 14 px descriptive label and a 6 px proportional
track. These are distinct semantic type roles, not uniform typography.

The result summary measures 237.17 px high at 320, 390 and 1440 px, compared
with the preceding version's 276–282 px. This makes the explanation easier to
reach without compressing its reading typography. The Home typography is not
arbitrarily changed: the reported measurable defect was its shared header.

The final result, review, actions and storage decisions still appear
immediately. `claimCompletionPresentation()` runs after the complete DOM has
been created, before the new `whenVisible()` gate. Only presentation waits for
fonts, visibility and two painted frames. Reloading a result still avoids
replaying the longer completion cue; the result-recorded flag is not used as
a presentation marker.

## Validation

`tests/composition_browser.py` contains five real-browser tests:

1. Four view families at 320/390/768/1440 px: exact centring, no overlap,
   no horizontal overflow, retained accessible navigation names.
2. 320 px at 200% text: reader/back action and compact brand remain usable.
3. Real two-question topic tests at all four widths: the changing exit/finish
   action preserves header geometry.
4. Real-bank 0/1 and 1/1 result fixtures at all four widths: immediate score,
   accessible proportional value, neutral number, distinct artwork, unchanged
   value after reload and no unintended learning-history write.
5. Partial result at 320 px, a long test name and 200% text: the identity
   reflows next to its folio without score or layout corruption.

All five passed against the integrated working tree. JavaScript syntax and
`git diff --check` passed. Visual inspection covered the 320 px zero-correct
result and the 390 px partial result. Physical iPhone/Safari behaviour is not
certified by these desktop-browser measurements.
