# ADR 006 — Reading hierarchy, semantic color, and restrained atmosphere

Date: 2026-10-04. Status: accepted for implementation; integrated validation is recorded separately. Supersedes the typography/color/motion decisions in the v0.66 Margin summary, not the content schema or study flow.

## Problem and evidence

The owner finds lessons, answers, and explanations difficult to read. The request is **not** to make every element identical. It is to make their different jobs clear and comfortable, with a dark-first academic identity. The first unshipped experiment made all teaching roles 18px and flattened their hierarchy; it is rejected as the design specification.

Starting point: shipped `b1d49cc`. The curriculum remains 10 topics, 60 continuous articles, 241 questions, and 723 option notes. Teaching content is not rewritten for presentation.

Research precedes this decision:

- [Typography evidence](../research/2026-10-04-typography-evidence.md): official OpenStax, Wikipedia, Hypothesis, GOV.UK and USWDS implementations; controlled browser measurements of the actual bundled fonts; alternatives and evidence limits.
- [Color and motion evidence](../research/2026-10-04-color-motion-evidence.md): semantic palettes, candidate contrast calculations, motion constraints and product comparisons.
- [Screen hierarchy audit](../research/2026-10-04-screen-hierarchy.md): actual baseline and prototype screens, block grouping and render findings.
- [Earlier principles research](../research/2026-10-ui-principles.md): W3C reflow, text spacing, contrast, focus, target size and reduced-motion requirements.

Comparable live sites were blocked by the environment proxy. Their reported values come from official source code, **not live-site computed styles**. English Prep and the font specimens were measured in Chromium. These are layout and contrast measurements, not a controlled study of reading speed or user preference.

At 390px, the baseline Unless forms use a 13px colored form name, 14px supporting instruction and 19px serif patterns/examples. At wide width the latter become 21px. The issue is the combined, repeated change in family, size, color and rhythm. A one-size prototype removes that noise but also removes the distinction between a heading, pattern and annotation.

## Alternatives and tradeoffs

| Alternative | Benefit | Cost / decision |
| --- | --- | --- |
| A: Inter working family, explicit semantic hierarchy | Stable texture in bilingual explanations; loaded variable weights; predictable optical size; strong hierarchy through role and proximity | Selected. Needs disciplined sizes, weights and spacing; one family alone does not establish readability. |
| B: Inter working text, Source Serif only for page titles | Coherent editorial identity; family changes only at structural boundaries, as in Wikipedia/USWDS | Viable, but adds a second texture/font for very little instructional benefit here. Not chosen for this round. |
| C: Source Serif for both languages in the reading lane | Separates sustained reading from controls without language-driven switching | Viable in another direction; smaller x-height requires optical matching and increases wraps in narrow answer rows. Not chosen. |
| D: Retain language-driven family switching | Smallest conceptual change | Repeats the specific texture transition in the owner's examples; weakest response to the complaint. |
| Uniform 18px for all teaching elements | Superficial consistency | Rejected: section headings, form labels, instructions and examples become peers. |

The independent 358px specimen renders the supplied question in 3 lines / 89px with Inter18 and 4 lines / 139px with Source Serif21 at the same leading ratio. This establishes wrap cost, not superiority of sans-serif. Equal CSS sizes also have unequal measured x-heights. Neither “academic means serif” nor “one family is always best” is justified.

## Typography decision

Use self-hosted Inter for the working interface. Preserve English `lang` attributes. **Language is not a typographic role.** Existing generic classes can remain compatible, but specific teaching relationships receive semantic classes; no blanket `.block p, .block .t-meta` rule may flatten every descendant.

Values below assume a 16px root; implement relative sizes and honor user enlargement.

| Job | Size / leading / weight | Tone / grouping |
| --- | --- | --- |
| Page title | 30/36 mobile, 36/43 wide; 600 | Primary ink; one dominant title. |
| Major panel title | 24/31; 600 | Primary; below page title. |
| Instructional section heading | 20/28; 600 | Primary; 36–48px between sections, 12px to its content. |
| Form/group label | 16/24; 600 | Primary; sentence case. Do not turn it into metadata or a colored eyebrow. |
| Pattern | 18/30; 500 | Primary; recognizable through weight and location. |
| Lesson prose, example, option, rationale | 18/30; 400 | Primary; mixed-language inline text inherits the same role. |
| Question stem | 20/32; 400 | Primary; stronger than its options, including narrow screens. |
| Short annotation, contextual instruction, help | 16/25–26; 400 | Supporting ink; never apply to a long explanation just because it follows an example. |
| Control / input | 16/24; 600 controls, 400 input | Strong ink; 44–52px minimum targets, able to grow. |
| Counter / short metadata | 14/20–22; 400–600 | Supporting ink; not teaching paragraphs. |

A reading column remains bounded at approximately 592px inner width on wide screens. Article and quiz have no desktop side pane. The actual character count depends on the font/content; `ch` does not guarantee a literal character count.

Proximity, not a border after every sentence, carries structure: example and explanation 8px; independent example units 28px; form rows 16px; sections 40px mobile / 48px wide. Necessary controls retain visible boundaries. Remove topic initials and ornamental mini progress bars; keep actual counts and progress facts. Sentence case is preferred over tracked uppercase teaching labels.

## Color decision

Select the cool neutral candidate A. Warm graphite/sage also passes contrast, but sage as the primary accent moves too close to semantic correct-green. Slate-blue emphasis has a clearer separate job. Hue is an aesthetic/product choice; contrast calculations do not prove it is more comfortable.

| Role | Dark token |
| --- | --- |
| Canvas / surface / raised | `#121416` / `#1b1e21` / `#262a2e` |
| Main / supporting ink | `#e4e6e7` / `#b4bcc3` |
| Decorative line / essential boundary | `#343a40` / `#737e86` |
| Primary fill / its label | `#c4d7e7` / `#18232c` |
| Accent text / focus | `#b8cee1` |
| Accent surface | `#242c33` |
| Correct / incorrect marker | `#a4c3af` / `#d9a8ae` |
| Correct / incorrect surface | `#202b28` / `#2b2528` |

Supporting text is deliberately distinct from main ink, rather than the near-main `#c7cccf` experiment. Its worst measured role pairing is 7.36:1; the darker alternative `#adb7bf` is 6.95:1. Long teaching prose stays in main ink (minimum 11.31:1). These stronger targets are project choices beyond the normal-text WCAG AA minimum, not universal comfort thresholds. APCA is supplementary diagnostic evidence.

Answers keep the same primary text across default/correct/incorrect states. Only a quiet fill and icon/short verdict encode outcome; words and glyphs preserve meaning without color. Neutral essential boundaries avoid large saturated red/green rectangles. Control focus remains more prominent than decorative separators.

Keep explicit light/System preferences and a neutral, contrast-checked light counterpart. Dark is the primary design and review target; do not erase an existing preference to force it.

## Atmosphere and motion decision

A faint blue/teal radial atmosphere can add depth to the app canvas. It must not become a moving text background. Use an independent decorative pseudo-element, no assets, no canvas, no animated blur, no layout animation, and no interaction hitbox. Keep article/quiz reading backgrounds opaque or suppress the aura there. About can share the same visual language after the study UI is verified.

Use **one 3.6-second settle of at most 8px**, then remain static. No looping, route-triggered restart, pulsation, scroll parallax or added settings flow. This is a deliberate compromise between the requested subtle movement and the product's simplicity. Infinite >5-second movement would need a pause/stop mechanism; reduced-motion support alone would not replace that obligation. Reduced-motion and forced-colors users receive no decorative motion. No nonessential animation should remain running after settling.

Each gradient stop is capped at 6% opacity. Bound the simultaneous overlap mathematically and check actual rendered backgrounds. With blue `#81a9ca` and teal `#769e92` over `#121416`, the conservative combined background is approximately `#1e2528`; reading ink and control boundaries remain well above their required thresholds. The production checker must include this bound, not merely the opaque tokens.

## Product simplification and branding

Retain the two modes: Eğitim and Test, with Profil in the header. Optional onboarding is one short introduction explaining these modes and an optional name. Remove exam-date, daily-goal, streak and absence-reminder UI. Preserve old storage/backup compatibility without advertising those controls.

After the study interface passes review, use an `ep.` wordmark with the same type and restrained accent. Add a compact, editable `/about/` product/project page, install guidance and native install control when supported. No automatic install interruption or claim of universal offline availability. Preserve `/original/` and the source archive.

## Validation and reconsideration

Inspect four passes: semantic roles/proximity; palette and answer states; responsive interaction/reflow; branding/PWA/integration. Record actual findings and corrections, not four copies of the same screenshot.

Required checks: source content unchanged, `npm run check`, repository browser sweep, actual Unless forms/examples/pitfalls and incorrect feedback at320/390/768/1440, long cloze, keyboard/focus, text-spacing/enlargement, reduced motion, final animation count, install outcomes and offline nested `/about/` path. Keep quantitative checks separate from visual judgment. Reconsider this direction if the owner's review still finds it tiring; passing contrast does not override lived reading experience.
