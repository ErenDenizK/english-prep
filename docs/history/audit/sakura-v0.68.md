# Four review passes — v0.68

4 October 2026 (Türkiye time). Baseline: `c92be0c` (v0.67).
These are engineering/design review passes, not participant usability testing.

1. **Evidence and diagnosis.** Separate agents inspected the submitted defects,
   app components, semantic palette and motion precedents. Three color systems
   were compared against Radix/Primer/Material roles; Fluent/Material/Carbon
   timing values were interpreted for this academic app. See
   [ADR007](../../adr/007-sakura-and-purposeful-motion.md) for accepted choices,
   alternatives and source links. Teaching text roles from ADR006 remain.
2. **Integrated visual pass.** Examined 320/390/1440 layouts: neutral answer
   surfaces, soft topic hover bounds, meaningful linear metrics, grouped settings
   and three manually advanced tutorial pages. Removed a duplicated tutorial
   label and shortened introductory copy so its first CTA fits 390×844 without
   shrinking text. Pretest skip remains directly reachable; real body position
   excludes the preliminary question and its expanding explanation.
3. **Behavior and independent review.** Browser regressions caught the new
   modules missing from first-visit offline cache. Motion review found two
   concurrent route animations and a native snapshot blocking hit testing.
   Color review found a white switch thumb only 2.06–2.18:1 on the new track.
   Fixed all three. Also corrected inherited centered score geometry, named the
   motion setting, and ensured it reflows at enlarged text sizes. Portfolio
   review fixed the hero images overlapping following content at tablet width.
4. **Final verification.** The uninterrupted comprehensive sweep passed 3,600
   checks. Targeted article/quiz/backup/PWA/tour/motion checks and 50 automated
   accessibility scans passed within their scope. Real screenshots at 390×844
   and 1440×1000 populate the editable About gallery. All source teaching
   material and the preserved interfaces are unchanged. Details and remaining
   device/testing limits belong in [VALIDATION](../../VALIDATION.md).

## Visual/interaction outcomes

| Area | What changed and why |
| --- | --- |
| Brand / chrome | Real `ep.` mark with sakura dot, consistent action gradient, 44px motion control; narrow back labels collapse visually without losing accessible names. |
| Library / resume | Rounded, inset hover treatment; actual lesson title separated from labeled reading position. |
| Article | Academic scrolling content retained; terms/form labels selectively colored, unboxed teaching highlights; open optional pretest does not claim reading progress. |
| Options / feedback | Neutral text and surface, reserved mark column, iris/apricot localized states, literal verdicts. No shaking or delayed scoring. |
| Profile / results | Stable actual numbers, linear metrics and honest empty state; one question does not imply mastery; study/appearance/application/data groups. |
| Introduction | Education → Test → optional name, skip/back, explicit focus and short directional cue. No new dates, goals or streaks. |
| Atmosphere | Three low-opacity fields across routes, 28/34/42s transform/opacity cycles, persistent pause and OS override; cards remain opaque. |
| About / PWA | Real manual screenshot gallery, feature and engineering sections, extensible plain-text data, truthful cache/install boundaries and reproducible brand assets. |
