# Type and color audit — dark-first refinement

2026-10-03. Baseline measured before the second visual refinement; pass 2 remeasured after integration. The baseline and candidate sections preserve the reasoning, while the implementation evidence below records what actually changed. The source articles, question bank, and scoring are outside this audit's scope.

## Pass 2 — implemented and remeasured

The same 48 screen/theme/viewport combinations were inspected again after the parent applied the refinement. The changes address the main readability findings without changing the educational material:

| Role | Baseline | Measured after pass 2, at 390px |
| --- | --- | --- |
| Index eyebrow | 10px/400, monospace | 12px/600, Inter; short decorative exception to the caption scale |
| Index summary | 14px/25.9px | 15px/25.5px |
| Corpus labels | 11px/500 | 13px/500 |
| Curriculum description | 13px/22.1px | 15px/24px |
| Navigation | 13px/500 | 14px/550 |
| Primary action | 14px/500 | 15px/550, 22px leading |
| Native field | 15px/26.25px | 16px/24px |
| Turkish article summary | Source Serif 4, 21px/31.5px | Inter, 18px/28.8px |
| Article body | 17px/32.3px | 17px/30.09px; retained at 17px on 320px viewport |
| Article section heading | 11px uppercase | 16px/600, 25.6px leading, sentence case, primary ink |
| Answer explanation | 16px/30.4px | 17px/30.09px |
| Profile helper | 13px/21.45px | 14px/22.4px |

The dark canvas/card/raised surfaces and secondary ink use the recommended `#111316 / #191c20 / #24282d / #d0d2cc`. Across all audited surfaces including semantic tints, secondary ink now has a minimum **9.20:1 and Lc 74.5**, compared with the baseline **7.47:1 and Lc 62.7**. Primary ink remains unchanged. The paper theme remains available and all **112** editorial contrast pairs still pass; its minimum secondary ratio is **4.92:1**. Dark and light article screenshots were inspected after integration. This confirms these sampled states, not universal perceptual comfort or full WCAG conformance.

One remaining cascade detail was sent to the parent: nested inline-check headings (`.lesson .block--check [data-check] > .t-label`) remain 13px uppercase while sibling article section headings are now 16px sentence case. The parent can apply the same instructional heading role to those nodes. Long quiz category names also remain uppercase metadata; sentence case is a possible refinement for scanning. Neither issue changes article content or interaction behavior.

## Method and limits

Chromium with the actual app served on HTTP; explicit dark and light preferences; 320×844, 390×844, and 1440×900 viewports. Forty-eight state captures cover the study index, topic introduction, article, profile, test setup, active question, answered question, and results. Service workers were blocked to avoid measuring a cached stylesheet. Computed font family, size, weight, line-height, letter-spacing, foreground, nearest opaque background, and element dimensions were recorded. Representative screenshots were inspected at 390 and 1440 pixels. These are browser measurements, not user research or a whole-app accessibility certification.

The baseline measurement record is `/tmp/english-prep-type-audit/baseline.json`, and pass 2 is `/tmp/english-prep-type-audit/snapshot.json`; the reproducible inspection script is `/tmp/english-prep-type-audit.py`. Color values below were measured using `tools/color.mjs` (`wcagContrast` and absolute `apca`). APCA is additional evidence about perceptual contrast, not a WCAG 2 conformance rule. Color contrast does not establish that a small font is comfortable to read.

## Baseline findings

1. **The small supporting text is the weak point.** The present color pairs pass WCAG AA, but several instructional headings are 11px and supporting sentences are 12–14px. On dark surfaces, the secondary ink reaches only approximately Lc 63–66. Making text both smaller and less prominent weakens the hierarchy needed to skim an academic article. The repository's earlier [type audit](type-contrast.md) documents the owner's same complaint; this iteration should avoid repeating it.
2. **Reading width already works.** At 390px, the first article paragraph has 36–46 characters on full lines; at 1440px it has 61–69. At 320px it has 31–39. These counts were measured from character `Range` rectangles, including spaces. The desktop text column is 592px. Preserve that measure instead of stretching articles across the display.
3. **The hierarchy has many incidental sizes.** The extension uses individual 10/11/12/13/14/15/16/17/18/19/20/21/22/23/24/26/28/30/32/34/38/40px declarations. Some are legitimate language or display roles, but many are one-pixel component adjustments. A role should specify family, size, weight, leading, tracking, and color together.
4. **Dark mode is currently a companion, not the first-run experience.** Before the theme change in this round, a device set to light opens the light palette. A dark-first product needs an explicit default policy in the blocking script and live module, while preserving stored choices.
5. **A quieter palette does not require faint text.** Primary prose already has excellent contrast. Keep that ink and improve supporting text; change surface hue and hierarchy for the desired visual character. Do not reduce body contrast to make the screen appear more restrained.

## Measured baseline typography

Values are from the 390px dark capture unless stated otherwise. The same roles appear in both themes; color changes separately.

| Role / actual selector | Family | Size / weight / leading | Finding |
| --- | --- | --- | --- |
| Index eyebrow `.study-intro__eyebrow` | system monospace | 10px / 400 / 17px, 1.4px tracking | Smallest visible label; website-style ornament has taken precedence over app legibility. |
| Index title | Inter | 34px / 450 / 40.12px | Clear display level; keep display use restrained. |
| Index summary | Inter | 14px / 400 / 25.9px | Long supporting sentence should use a readable body-support role. |
| Index explanatory footer | Inter | 12px / 500 / 20.4px | “Tüm dersler açık…” is useful product guidance, not incidental metadata. |
| Corpus labels | Inter | 11px / 500 / 18.15px | Short, but unnecessarily small beside 23px figures. |
| Curriculum title / description | Inter | 17px / 500 / 23.8px; 13px / 400 / 22.1px | Good title distinction; description needs more readable size and ink. |
| Generic section labels `.t-label` | Inter | 11px / 550 / 18.7px, 1.1px tracking | Used for genuine article hierarchy and long category names as well as metadata. Split those roles. |
| Navigation | Inter | 13px / 500 / 20px | Raise to a stable 14px UI role. |
| Header title / Back label | Inter | 14px / 550 / 22px; 12px / 500 / 22px | Back is an action, not a caption; 320px variant falls to 11px. |
| Native fields | Inter | 15px / 400 / 26.25px | Use at least 16px for native inputs; sub-16px input text risks iOS focus zoom. Real Safari verification remains necessary. |
| Listbox trigger | Inter | 15px / 600 / 24–26.25px | Same control role should not have two unrelated leading values. |
| Buttons | Inter | 14px / 500 / 22px | Target heights are sufficient; align labels with a 15px/600 action role. |
| Article title | Inter | 32px / 450 / 40px | Readable; 28px at 320, 40px desktop. |
| Turkish article summary | Source Serif 4 | 21px / 400 / 31.5px | Inconsistent with the proposed semantic division of Turkish explanation vs English study material. Inter 18px/28px would clarify the role. |
| Turkish article prose | Inter | 17px / 400 / 32.3px | Comfortable width; 1.9 leading is loose. Candidate 17px/30px, desktop 18px/32px. |
| Narrowest article prose | Inter | 16px / 400 / 30.4px at 320px | Avoid shrinking the learning text just because the viewport is narrow; prefer 17px with existing 16px gutters. |
| English answer options | Source Serif 4 | 19px / 400 / 31.35px | Keep clear serif distinction; text has strong contrast. |
| English signal chips | Source Serif 4 | 19px / 500 / 33.25px | 500 is not an authored font face in the supplied static serif family. Prefer regular 400 for examples; reserve 600 for deliberate emphasis. |
| Optional pretest disclosure | Inter | 13px / 400 / 24px | Native disclosure works; make the action 14–15px and retain its optional nature. |
| Answer rationale | Inter | 16px / 400 / 30.4px | This is teaching content. Bring it to the same 17px/30px reading role as articles. |
| Profile row / helper | Inter | 15px / 500 / 24.75px; 13px / 400 / 21.45px | Settings have meaningful descriptions; avoid shrinking their meaning into metadata. |
| Profile stat label | Inter | 11px / 450 / 18.15px | Thin, small labels are hard to skim beside large numerals. |

The smallest labels are not WCAG failures solely because of their pixel size. The recommendation is a product readability decision, supported by the measured role/color combinations and the owner's previous feedback.

## Candidate type roles

Keep Inter for controls and Turkish explanation; retain Source Serif 4 for English prompts, examples, options, and forms. Both are self-hosted. Decorative monospaced labels are optional; do not introduce a third downloaded font for them.

| Role | Candidate treatment | Use |
| --- | --- | --- |
| Display | Inter 32–36px / 500 / 1.15–1.2 | One dominant title in a screen. |
| Title | Inter 24–28px / 550 / 1.25 | Topic and panel titles. |
| Section heading | Inter 16px / 600 / 24px, sentence case | Actual instructional sections; do not uppercase long lesson headings. |
| Reading body | Inter 17px / 400 / 30px; 18px/32px wide | Article and feedback explanation. |
| English reading | Source Serif 4, 21–22px / 400 / 1.6–1.7 | Question paragraph and English examples; 19–20px options. |
| Supporting body | Inter 15px / 400–500 / 24–26px | Topic descriptions, hints, settings explanations. |
| Action / field | Inter 15px / 600 / 22px; native fields 16px / 400 | Navigation and controls. |
| Caption | Inter 13px / 600 / 20px | Short counters and metadata; use strong ink rather than another dim gray. |

These are role candidates rather than an instruction to make every text block larger. Preserve hierarchy by grouping related content and choosing the correct role; shorten presentation copy when it crowds a phone. Authored educational content must remain intact.

## Measured colors and a candidate dark palette

The current primary ink `#f0eee7` on current page/card/raised gives **15.78 / 14.31 / 12.54:1**, with **Lc 95.9 / 94.8 / 93.1**. There is no evidence that this body ink needs to become whiter.

The current secondary `#bdbeb4` gives **9.76 / 8.85 / 7.75:1**, but **Lc 66.1 / 65.1 / 63.3**. The latter is the useful warning when the same ink is applied to 12–14px supporting prose. A WCAG token pass cannot validate that size/color pairing by itself.

For a more neutral dark surface system, retain warm ink and use slightly cool charcoal containers. This is a visual-direction choice informed by the references, not a claim that cool charcoal improves learning.

| Token | Current dark | Candidate dark | Rationale |
| --- | --- | --- | --- |
| Page | `#141513` | `#111316` | Neutral near-black foundation instead of olive charcoal. |
| Card | `#1d1f1b` | `#191c20` | Distinct opaque plane for controls/content. |
| Raised | `#272a24` | `#24282d` | Selected and inset regions; no heavy blur. |
| Main ink | `#f0eee7` | `#f0eee7` | Already strong, warm, and readable. |
| Secondary ink | `#bdbeb4` | `#d0d2cc` | More margin for small supporting roles. |
| Accent text | `#edab85` | `#efbc99` | Warm punctuation; keep to concise semibold labels and headings. |
| Control boundary | `#7b8172` | `#838993` | Contrast margin across elevated planes. |
| Focus | `#f1bb93` | `#f1c9a5` | Obvious focus without a neon glow. |
| Section wash | `#22271e` | `#20252a` | Quiet academic contrast block. |

Candidate measurements on page/card/raised, in that order:

| Pair | WCAG 2 ratio | Absolute APCA Lc |
| --- | --- | --- |
| Main ink | 16.03 / 14.73 / 12.77 | 96.1 / 95.2 / 93.3 |
| Secondary ink | 12.20 / 11.21 / 9.72 | 78.1 / 77.2 / 75.4 |
| Accent text | 10.92 / 10.03 / 8.70 | 71.7 / 70.8 / 69.0 |
| Control boundary | 5.29 / 4.86 / 4.21 | 38.2 / 37.3 / 35.5 |
| Focus indicator | 12.08 / 11.10 / 9.63 | 77.6 / 76.7 / 74.9 |

An optional semantic pair adjustment was also measured: correct `#a6d7b6` on `#1c3026` gives **8.68:1, Lc 71.2**; incorrect `#efa5a4` on `#35232a` gives **7.43:1, Lc 60.7**. Semantic feedback must keep words and check/cross marks. Do not use status colors for decorative hierarchy elsewhere.

The current light palette can remain a quiet paper alternative. If supporting text is strengthened there, `#50564c` on the existing page `#f5f3ed` and raised `#eae8df` should be remeasured in the palette checker before adoption. One separately measured lower-glare surface candidate is page `#f1f0e9`, card `#f8f7f2`, raised `#e6e6dc`: with secondary `#50564c`, these give **6.62 / 7.05 / 6.02:1** and **Lc 77.2 / 81.4 / 71.1**. This is an alternative, not a requirement to change the light palette during a dark-first refinement.

## Cascade and component consistency

- The extension is unlayered; all ordinary declarations in it beat declarations inside the inherited stylesheet's layers. Higher specificity inside an older layer does not protect semantic state styles. The earlier ring-tone regression came from exactly this rule. Current explicit `.ring--ok` / `.ring--no` overrides repair it; retain those during cleanup.
- Define complete type roles as tokens and apply them consistently. Avoid relying on a global `.t-label` to represent a tiny eyebrow, long quiz category, field label, and article section heading simultaneously.
- The current `.lesson .t-en` blanket rule changes many English contexts, including chips and headings. Keep title/label/example/option overrides explicit; measure the computed result rather than trusting the declared utility.
- Global font tokens do not describe most of the extension because component rules hardcode sizes and weights. Reducing that duplication would make the four-pass refinement maintainable without rewriting the source layout.
- Existing 48–52px action heights and generous option targets are useful. Keep them as the fixed interaction geometry while changing label typography. Verify the quiz action bar stays still before/after answering.
- Hairlines are decorative separators. Controls that require a boundary must use the measured edge token; a barely visible card outline cannot substitute for an input affordance.
- Preserve reduced-motion handling. Typography/contrast improvements should not introduce staggered entrances, looping ambient animation, or feedback movement that competes with reading.

## Dark-first preference policy and implementation

Implemented in this round in `js/theme.js` and the three root HTML first-paint scripts:

- Missing, invalid, or unavailable preference defaults to **dark**.
- Existing stored `light` and `dark` values remain authoritative.
- Choosing **Sistem** stores the explicit string `system`. It follows the OS on initial paint and during the visit; the resolved browser `theme-color` and `color-scheme` also update.
- Reading a preference never writes a new one. If storage is blocked or full, a changed choice still lasts for the current document.
- The original application copy retains its original source theme behavior. An absent old preference cannot identify whether a person once chose System or simply never selected a theme; the dark-first default applies to that ambiguous state as requested.

`node --test tests/theme.test.js` passes ten behavioral tests, including the identical pre-stylesheet bootstrap across all entry pages, stored-choice precedence, explicit System persistence, live OS changes, blocked/full storage, and idempotent listener setup. Browser verification remains the final check once the parent's palette refinement is applied.

## Reference interpretation and sources

The broader verified source ledger is [2026-10 UI principles](../research/2026-10-ui-principles.md), including platform-to-web caveats and the distinction between user research, guidelines, and reference styling.

- Supplied [Raycast / Origin](../reference/design_origin/DESIGN.md): near-black surfaces, neutral actions, one warm accent, Inter role separation. Its 10–11px website labels and decorative hero gradients are not academic-app requirements.
- Supplied [Monopo](../reference/design_monopo/DESIGN.md): strong type hierarchy and controlled negative space. Do not import monumental marketing-page scale.
- Supplied [Home](../reference/design_home/DESIGN.md) and [Ventriloc](../reference/design_ventriloc/DESIGN.md): quiet divisions, warm light surfaces, precise corner treatment. Keep these as visual references rather than functional specifications.
- [Material Web typography source](https://raw.githubusercontent.com/material-components/material-web/main/docs/theming/typography.md): a role combines family, size, weight, and line-height; display/headline/title/body/label are distinct roles.
- [Material Web color source](https://raw.githubusercontent.com/material-components/material-web/main/docs/theming/color.md): semantic surface/container/outline roles and paired foreground colors.
- [Microsoft typography source](https://raw.githubusercontent.com/MicrosoftDocs/windows-dev-docs/docs/hub/apps/design/signature-experiences/typography.md): regular body, stronger title hierarchy, left alignment, and a roughly 50–60-character measure. Native XAML sizes are not universal web minimums.
- [W3C Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html): foreground/background requirements and the caution that thin strokes can appear fainter despite passing a mathematical ratio.
- [W3C Visual Presentation](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html): user color control, non-justified text, and an 80-character maximum measure at AAA. This audit does not claim whole-page AAA conformance.

The external guideline sources were verified by the research agent from official source repositories where direct sites were blocked. No finding here establishes a universally superior serif family, dark palette, or reading speed. Final acceptance requires inspecting the integrated app and retaining user choice.
