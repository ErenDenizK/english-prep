# About v0.71 — a continuous study theatre

## Problem and decision

The previous composition separated three bordered buttons, an isolated screenshot,
a caption and copy. Architecture repeated that pattern. On mobile this produced
small independent pieces rather than one recognisable, responsive scene. More
animation on those pieces alone would amplify the separation.

The study chapters now share a single surface and a continuous chapter rail.
Architecture follows the same grammar: one board, controls in its top edge,
connected drawing and explanation in its body. Border/radius describe the whole
composition; selected controls use a tinted area and a single moving line.
Native buttons remain independently focusable, at least 76 CSS px high, with
immediate pressed state. The line follows measured control geometry rather than
assuming three fixed widths; additional authored stages and wrapped labels work.

The phone story keeps its actual screenshot immediately below the chapter rail,
then the explanatory copy. Wide layouts use a coordinated two-column scene.
No screenshot gallery, auto-advancing demo, learning-data mutation or invented
product screen is introduced. Real UI copy, screenshots and actions remain editable.

## Research and limits

Retrieved on 2026-10-04:

- [W3C disclosure pattern](https://github.com/w3c/aria-practices/blob/main/content/patterns/disclosure/disclosure-pattern.html):
  keyboard activation and disclosure state belong to the control. We retain native
  `details`/`summary` semantics and do not wait for animation before opening.
- [MDN image decode documentation](https://github.com/mdn/content/blob/main/files/en-us/web/api/htmlimageelement/decode/index.md):
  `decode()` resolves when image data is ready; a replaced source can reject.
  Each selection waits for its image and catches decode failures; cancellation
  and selected-stage identity prevent stale async effects.
- [MDN interpolate-size documentation](https://github.com/mdn/content/blob/main/files/en-us/web/css/reference/properties/interpolate-size/index.md):
  opt-in interpolation between a length and intrinsic size allows authored copy
  of arbitrary length. Enhancement is scoped to About disclosures and guarded
  with CSS support detection. Unsupported browsers retain native disclosures.

Direct Duolingo, Material, Chrome and WAI product/documentation hosts returned
proxy 403 during this review. No live visual measurements of those sites are
claimed. The grouping choice is a design judgement based on the user's screenshots
and measured local compositions; the shared motion research records its evidence.

## Timing and interaction

- Selection state, copy and links update synchronously.
- Selected icon articulates with the shared completion and 1100ms trace roles.
- Screenshot flow begins only after decoding, fonts and actual frame visibility;
  the 1100ms flow cannot expire during a cold download or above the viewport.
- The shared scheduler cancels superseded selections and respects saved motion
  off, reduced motion, page visibility and real input priority.
- The selection line transitions over 620ms, independently of stable text.
- Native disclosure height opens/closes over 480ms where supported. Shared body
  and glyph cues give an immediate acknowledgement without blocking interaction.
- Fine-pointer hero response remains bounded at two degrees/six pixels; touch
  and keyboard expose all features. No idle JavaScript frame loop is added.

The footer links to application settings. It has no motion switch; settings are
the sole preference control. OS reduced motion and the shared saved preference
still govern this page.

## Validation

Focused browser coverage checks 320/390/768/1440 widths, doubled text, long authored
additions, keyboard focus, touch selection, source links, native disclosures,
shared preference, bounded pointer lifecycle, artwork visibility and delayed image
decode under rapid selection. Local 390px measurements: Study 1204px, feature list
1266px, zero horizontal overflow (before final high-density media refresh).
