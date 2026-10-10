# Typography evidence and alternatives — 4 October 2026

Status: research before the next implementation decision. This report does **not** approve the uncommitted v0.67 prototype or establish that one font is universally easier to read.

## The question to solve

The owner reports difficult reading across articles, tests, and answer explanations. The supplied examples interleave an English serif sentence, a Turkish sans-serif explanation, a colored uppercase label, a smaller heading, and repeated rules. The problem is not established by counting font families. Two families can form a coherent hierarchy; one family can still produce a confusing screen.

The required distinction is between **navigation, heading, teaching prose, language example, response option, feedback, and incidental metadata**. A change of language is not automatically a change of hierarchy. In a paragraph explaining one answer, English and Turkish are both teaching content. Making each language change also change family, size, leading, and color is a design choice that needs justification; it is not an academic requirement.

The starting reference is shipped commit `b1d49cc` (v0.66). Research and controlled specimens below are independent of the uncommitted prototype.

## Method and evidence limits

Five relevant comparisons were inspected in their official frontend sources: OpenStax's REX textbook reader, Wikipedia's Vector reading interface, Hypothesis's annotation client, GOV.UK Frontend, and the US Web Design System. The first three are reading/learning products; the last two are mature systems for sustained information and task completion. GOV.UK and USWDS are not English-learning apps. Hypothesis is a compact annotation panel, not a full-width textbook.

Direct requests to OpenStax, Wikipedia, Hypothesis, GOV.UK, USWDS, and Khan Academy were blocked by the environment's network proxy. Consequently, the comparison numbers are **source-derived values**, not computed-style measurements from the deployed products. Official GitHub source endpoints returned HTTP 200 and were read. No screenshots of inaccessible live products, production font loading, current release configuration, or observed learning outcomes are claimed.

OpenStax was inspected at `ce7bcf6c832a1346f52feb1c18183cdf02c09280`; Hypothesis at `b4d085a2f893aa6de3b61d8b8bc3ae4d0f24fc1a`. Other linked source branches are mutable; values are the versions retrieved on the access date. Local evidence is in `/tmp/ep67-type-evidence/`, including the access ledger and controlled browser specimen results. Temporary evidence paths are not product dependencies.

## What the comparable products actually specify

| Comparison | Extracted family and hierarchy | Size, leading, spacing or measure | What transfers; what does not |
| --- | --- | --- | --- |
| **OpenStax REX**, textbook reading | Global `Neue Helvetica W01`, Helvetica/Arial fallback. Generic book content inherits this family; particular student samples and annotations use IBM Plex Sans. Generic content H2/H3/H4 are deliberately different levels. | Root is 62.5%; generic content is **16px/23px**, H2 **32/35**, H3 **24/23**, H4 **18px**. Content font size and leading multiply `--content-text-scale`; content pane max width is 82.5rem = **825px** at the assumed 10px root. | It distinguishes the reader's controls from book typography and supports changing text size. The measurements apply to the generic fallback, specifically excluding `data-dynamic-style="true"` book styling; they are not the typography of every OpenStax book. Its 825px maximum and tight 24/23 heading are **not** targets for this narrow bilingual app. |
| **Wikipedia Vector 2022**, reference reading | Body uses the base sans stack; H1/H2 explicitly switch to the serif stack. H3/H4 use bold body family. Family changes follow **heading role**, not every foreign-language phrase. | H1 **1.8em**, H2 **1.5em**, H3 **1.2em**; three content-size preferences have explicit leading **1.5714 / 1.625 / 1.55**. Paragraph margin is **0.5em top / 1em bottom**. Root stays **100%**. | A two-family system can remain coherent when the second family occurs at predictable structural boundaries. Size preferences and stable paragraph rhythm are relevant. Exact pixel sizes depend on imported tokens and selected mode; they were not inferred without resolving those tokens. Wikipedia's wide reference layout is not a model for the app shell. |
| **Hypothesis**, academic annotation | Helvetica Neue/Helvetica/Arial/Lucida Grande UI and annotation prose. Markdown headings use a deliberate minor-third progression rather than arbitrary per-component increments. | Client base **13px/1.4**; mobile inputs **16px/1.4**. Markdown H1/H2/H3/H4 are **2.074/1.728/1.44/1.2em**; heading top margin **1.3333em**, bottom **0.6667em**; ordinary paragraph margins **0.6667em**. Markdown prose overrides leading with `leading-snug`, so the client's 1.4 is not falsely reported as its final prose leading. | Heading spacing encodes grouping and the single family does not flatten hierarchy. **Reject 13px as the lesson-body target**: annotation-panel density and short comments differ from sustained bilingual instruction. The annotation font can also be host-configured. |
| **GOV.UK Frontend**, sustained instructions/forms | One screen family, GDS Transport with Arial/sans fallback. Regular **400**, bold **700**. Body and section titles use named roles, not language-specific families. | Body **19/25** at mobile and tablet; small body **16/20**. Medium heading **21/25 mobile → 24/30 tablet**; large heading **27/30 → 36/40**. Root recommendation **16px effective**, ideally leave root unset to honor the user. Contextual top spacing is added when a heading follows prose. | A single family is a valid mature-system strategy with clear weight/size/spacing hierarchy. GOV.UK's comparatively compact 1.316 body leading is evidence of one system's choice, not a universal optimum to copy into English Prep. |
| **USWDS**, information and task interface | Default **Source Sans Pro body/UI**, **Merriweather headings**; mono is reserved for code. Font roles are separate from family definitions. | Body default role `sm` = scale 5 = **16px** equivalent, leading token 5 = **1.62**; H1/H2/H3 **40/32/22px** equivalent. Default text measure **68ex**, narrow **44ex**, wide **88ex**. Prose uses body family; heading and paragraph spacing differ. | Supports two families by structural role and an independently chosen text measure. `ex` is a glyph metric, **not a literal character count**. USWDS font-size normalization means token equivalents should not be treated as live computed values for every substituted font. |

Sources actually read:

- OpenStax [global typography](https://github.com/openstax/rex-web/blob/ce7bcf6c832a1346f52feb1c18183cdf02c09280/src/index.css), [generic book content](https://github.com/openstax/rex-web/blob/ce7bcf6c832a1346f52feb1c18183cdf02c09280/generic-styles/index.less), [content dimensions](https://github.com/openstax/rex-web/blob/ce7bcf6c832a1346f52feb1c18183cdf02c09280/src/app/content/components/constants.ts), and [content pane](https://github.com/openstax/rex-web/blob/ce7bcf6c832a1346f52feb1c18183cdf02c09280/src/app/content/components/Page/PageContent.tsx).
- Wikipedia [typography](https://raw.githubusercontent.com/wikimedia/mediawiki-skins-Vector/master/resources/skins.vector.styles/typography.less), [ratios and root](https://raw.githubusercontent.com/wikimedia/mediawiki-skins-Vector/master/resources/skins.vector.styles/variables.less), and [reading preferences](https://raw.githubusercontent.com/wikimedia/mediawiki-skins-Vector/master/resources/skins.vector.styles/CSSCustomProperties.less).
- Hypothesis [sidebar tokens](https://github.com/hypothesis/client/blob/b4d085a2f893aa6de3b61d8b8bc3ae4d0f24fc1a/src/styles/sidebar/sidebar.css), [annotation renderer](https://github.com/hypothesis/client/blob/b4d085a2f893aa6de3b61d8b8bc3ae4d0f24fc1a/src/sidebar/components/Annotation/AnnotationBody.tsx), and [Markdown typography](https://raw.githubusercontent.com/hypothesis/annotation-ui/main/src/StyledText.css).
- GOV.UK [family and weights](https://raw.githubusercontent.com/alphagov/govuk-frontend/main/packages/govuk-frontend/src/govuk/settings/_typography-font.scss), [responsive scale](https://raw.githubusercontent.com/alphagov/govuk-frontend/main/packages/govuk-frontend/src/govuk/settings/_typography-responsive.scss), and [role application and spacing](https://raw.githubusercontent.com/alphagov/govuk-frontend/main/packages/govuk-frontend/src/govuk/core/_typography.mixin.scss).
- USWDS [typography settings](https://raw.githubusercontent.com/uswds/uswds/develop/packages/uswds-core/src/styles/settings/_settings-typography.scss) and [prose component](https://raw.githubusercontent.com/uswds/uswds/develop/packages/usa-prose/src/styles/_usa-prose.scss).

## Controlled measurements using the app's actual font files

A separate Chromium specimen loaded the repository's self-hosted Inter, Source Serif 4, and Source Sans 3 files directly. It did not load the proposed app stylesheet. All families were measured at 17/18/19/21px, 400 weight, 1.65 leading and 288/358/592px content widths. The sample was the owner's English question (“The tenants must repair the damage…”) and a Turkish explanation. Character `Range` rectangles grouped rendered lines; canvas `actualBoundingBoxAscent` measured the rasterized lowercase `x` at that browser's scale. This is a reproducible layout test, **not a reading-speed or eye-tracking study**.

| Sample at 358px width | Lowercase x raster ascent | English lines | Paragraph height at 1.65 leading |
| --- | ---: | ---: | ---: |
| Inter 18px | 10px | 3 | 89.1px |
| Source Serif 4 18px | 9px | 4 | 118.8px |
| Source Serif 4 21px | 11px | 4 | 138.6px |
| Inter 21px | 12px | 4 | 138.6px |

A CSS font size is not perceived character size. The supplied serif has a smaller x-height than Inter at equal nominal size; simply setting both to 18px is **not** a principled optical match. Conversely, keeping every serif example at 21px increases line and scroll cost compared with the 18px sans specimen. This is a tradeoff, not proof that serif is illegible.

At 18px Inter and 592px measure the English specimen's first full line has **68 characters**, the Turkish specimen's **65**. At 358px the English full lines have **42–43**, and at 288px **28–33**. Those narrow-screen counts are a consequence of reflow, not an accessibility failure. Answer options have less inner width after numbering and padding and require a separate integrated measurement.

The specimen also shows why assigning a new family without checking actual wraps is unsafe. A local font name and intended size are insufficient: measure actual font loading, Turkish glyph coverage, line breaks, text block height, and fallback behavior before claiming improvement.

## Alternatives to evaluate in the architecture decision

### A. One working family, multiple explicit roles — preferred candidate

Use the existing Inter throughout the actual study flow. Keep the hierarchy in size, weight, leading, grouping, and restrained color roles. English example blocks remain distinguishable through their location, spacing, and a clear semantic introduction when already present in the content. Preserve `lang="en"`; do not confuse typographic unification with deleting language semantics.

Why this fits: the owner alternates between short English examples and Turkish explanations repeatedly, including inline mixed-language answer rationales. A stable working family avoids a typeface/size change on every alternation. GOV.UK demonstrates that one family can sustain a strong hierarchy; OpenStax and Hypothesis offer relevant sans reading implementations. This is an inference for this product, supported by the owner's specific discomfort, **not proof that Inter outperforms serif in learning**.

### B. Sans working body, serif only at structural titles — viable alternative

Keep Inter for explanations, examples, answers, UI and feedback; reserve Source Serif 4 for one page or product title. Wikipedia and USWDS show this role-based pairing. It can preserve an academic/editorial identity without repeatedly changing texture inside the lesson. Risks: source serif has only a shipped 400 weight; a bold display treatment must not silently synthesize a missing font. This alternative also adds a font dependency for a small amount of text.

### C. Serif reading lane, sans interface — viable but higher integration risk

Set **both English and Turkish sustained reading** in the serif, keeping controls/metadata/section headings sans. This is more coherent than assigning the family solely by language, but requires deliberate Turkish glyph/fallback testing, sufficient optical size, and carefully rendered inline emphasis. It changes the app's existing body texture most and the owner specifically reports discomfort with the present serif examples. It should not be chosen merely because “academic equals serif.”

### D. Preserve language-driven switching while tightening scale — least preferred here

It retains the familiar English/translation distinction but leaves the repeated texture changes visible in the screenshots. It could work if every example and explanation formed a clearly grouped unit and inline explanations stopped changing family. It is the most conservative code change, but weakly addresses the reported experience.

## Candidate hierarchy, not a mandate to make all text 18px

Choose the family alternative separately from this role map. These values are a candidate to verify against the actual content, not a copied guideline or a universal rule.

| Role | Candidate size / leading / weight | Color and spacing contract |
| --- | --- | --- |
| Page/display title | 30/36 mobile, up to 36/42 wide, 600 | Primary ink; one dominant title per screen; ordinary pages do not need an oversized marketing hero. |
| Topic or major panel title | 24/31, 600 | Primary ink; clearly below page title and above local instructional headings. |
| Instructional section | 20/28, 600 | Primary ink; around 32px before / 12px after, with first-section adjustments. Related content sits closer to its heading than to the previous section. |
| Learning prose and answer explanation | 18/29–30, 400 | Primary reading ink; stable width; paragraph separation around 16px. Do not dim a teaching explanation just because it follows an example. |
| English example or answer option | 18/28–30, 400; isolated formula may use 500 | Primary reading ink. Group with its explanation at 8–12px; separate the next example unit at 24px. No automatic all-caps or accent color. Question stems may warrant 20/31 when short enough; long stems must be measured. |
| Supporting explanation and settings help | 16/25, 400 | Secondary ink with robust contrast; not for full lesson paragraphs or feedback rationale. |
| Control/nav/field | 16/22–24, 500–600 | Strong ink, fixed minimum target geometry; native fields remain at least 16px at default scaling. |
| Short metadata/counter | 14/20, 500 | Secondary ink; no essential instruction or multi-sentence paragraph. |

No fixed maximum number of type sizes per app is supported by this evidence. The useful constraint is that each size has a stable semantic job. One screen can have several roles without becoming noisy if the grouping is clear. Conversely, three barely different sizes with unrelated colors can be ambiguous.

Useful separations should survive a grayscale capture. Do not encode “example,” “rule,” “heading,” “note,” and “wrong” through five unrelated colors. Status color communicates answer outcome, not the importance of the entire answer paragraph. Rules and examples that already occupy distinct blocks generally need space more than repeated borders. The user's disliked left-side letter ornaments add no teaching information and should not be a substitute for a heading.

## Acceptance measurements before calling it an improvement

1. Capture the owner's exact Unless lesson and restatement test states, plus a long cloze question, at 320/390/768/1440 widths. Record actual loaded font, size, weight, leading, width, foreground/background, lines per paragraph, and section gaps. Use baseline `b1d49cc` and candidate side by side.
2. Inspect header hierarchy and adjacent example/explanation groups. Verify that a unit has a smaller internal gap than the gap to the next unit; remove borders only where grouping remains unambiguous.
3. Count line wraps and scroll cost of complete answer options and the feedback block, not only body text on an empty specimen. Check that answering does not move the fixed action target.
4. Test user font-size enlargement, 200% zoom, 320px reflow, and WCAG text-spacing overrides. A nominal 18px cannot establish accessibility if controls clip when the user's font setting grows.
5. Recompute text contrast on **every actual status/container surface**, using the chosen font role. WCAG 2's AA ratio is a minimum; APCA is supplementary diagnostic evidence, not a WCAG 2 pass/fail rule. Neither predicts the owner's reading comfort.
6. Review Turkish `İ ı Ğ ğ Ş ş` and English punctuation with fonts loaded and blocked. Retain sentence case and correct language attributes; do not use letter spacing as an attempted cure for body readability.
7. Final acceptance needs the owner's review of the integrated candidate. Browser measurements can disprove clipping, crowding, or missing contrast; they cannot prove this person finds it comfortable to read.

The W3C [text spacing](https://raw.githubusercontent.com/w3c/wcag/main/understanding/21/text-spacing.html), [reflow](https://raw.githubusercontent.com/w3c/wcag/main/understanding/21/reflow.html), and [contrast](https://raw.githubusercontent.com/w3c/wcag/main/understanding/20/contrast-minimum.html) sources were read in this round's shared research. They specify testable accessibility behavior, not a prescribed font family or body pixel size. Material's [type-role documentation](https://raw.githubusercontent.com/material-components/material-web/main/docs/theming/typography.md) independently supports treating family, size, weight, and leading as one role contract.

## Integrated browser comparison before the decision

Three alternatives were then injected into the **real Unless lesson** in Chromium, without changing application files. Baseline v0.66 was served on port 8011 and the current prototype on 8010. Each used a clean context, a deterministic question/option sequence, the dark theme, blocked service workers, reduced motion, and 390×900 / 1440×900 viewports. Screenshots of the title, forms, examples, and the same incorrect-answer feedback were visually inspected. The prototype's blanket typography was overridden with the candidate role contracts described above.

- **A:** Inter throughout the working content. Page title 30/36 mobile, 36/42 desktop; section 20/28; body/example 18/30; form group label 16/24 at 600; short “Başta gelen koşul” helper 16/25; feedback status 16/24; counter/metadata 14/20. Body remains 400, formula is 500.
- **B:** Identical to A except the H1 is Source Serif 4 at 32/40, weight 400. There is no family switching inside the study material.
- **C:** A's headings, controls, and short helpers; both English and Turkish sustained reading switch to Source Serif 4 at 21/32. This is an approximately optically sized serif alternative, not an equal-pixel comparison.

A/B/C use the same prototype palette, shell, padding, and grouping, so their content-height differences are useful typography tradeoffs. **Baseline versus candidate is not an isolated font experiment**: the prototype also removes rules and nested feedback padding. The baseline palette differs, so these images do not establish that one palette is better. No participant reading-time or comprehension test was run.

| Measured region | v0.66 baseline | A: working sans | B: serif H1 only | C: serif reading |
| --- | ---: | ---: | ---: | ---: |
| Complete lesson with same check answered, mobile height | 9,031px | 8,550px | 8,558px | 10,064px |
| Same lesson, desktop height | 6,927px | 6,192px | 6,190px | 6,916px |
| Forms region, mobile height | 1,123px | 1,106px | 1,106px | 1,206px |
| Forms region, desktop height | 977px | 926px | 926px | 982px |
| Five example/explanation pairs, mobile height | 785px | 692px | 692px | 856px |
| Same examples, desktop height | 556px | 452px | 452px | 536px |
| Main feedback explanation, mobile lines / height | 14 / 421px | 13 / 390px | 13 / 390px | 16 / 512px |
| Selected-option explanation, mobile lines / height | 9 / 253px | 6 / 180px | 6 / 180px | 8 / 256px |

The mobile feedback column is **260px baseline versus 302px in A/B/C**. This 42px recovery from nested framing/padding is a substantial contributor to the reduced wrapping, independent of family choice. It is evidence to inspect container geometry whenever “font readability” is reported. Simply swapping fonts while preserving the narrower nested box would miss this cause.

Visual observations and measured tradeoffs:

1. **A restores explicit hierarchy while keeping a stable reading texture.** The 20px semibold “Üç kalıp, aynı sahne” heading and 16px semibold `unless` group label have different jobs; the formula is 18px medium, short structural helper 16px regular secondary ink, and example 18px regular primary ink. This is visibly different from the prototype's single 18px role applied to everything. The helper becomes larger than baseline's 14px without materially expanding the forms region.
2. **Grouping carries meaningful separation without every divider.** Example-to-explanation gaps are 8px rather than baseline 4px; successive example units have 28px clear separation. Forms have 8px internal spacing, 16px between forms within a language pattern, and 28px between pattern groups. Those computed distances distinguish a pair, a local form, and the next group. Long teaching explanations remain in the full body role.
3. **B is a credible visual alternative, not a measured reading improvement.** Its serif page title occupies two mobile lines and one desktop line, as A does. It adds 8px to the mobile title region and removes 2px on desktop, while forms, examples, and feedback metrics are exactly A's. The title looks more editorial; selecting it would be a brand-direction choice. The current single-family preference need not be defended by claiming that a second family always hurts reading.
4. **C costs space at the selected optical size.** Against A with otherwise identical geometry, the mobile lesson grows about 17.7%, and the main feedback explanation grows from 13 to 16 lines. The first Turkish example explanation uses three mobile lines instead of two. Its coherent serif texture is viable in principle, but the larger footprint places less of each question/explanation pair on screen. Existing inline `strong` also needs a real serif bold font or an explicit alternative; only the regular serif face is shipped, so the browser otherwise synthesizes emphasis.
5. **A's feedback still needs semantic review.** A cleaner text texture does not by itself make “Doğru cevap,” the overall explanation, and the selected-option note unambiguous. These should retain distinct labels and grouping without making the answer itself green/red. The exact supplied restatement item was used, so the observed width recovery and wraps apply to the owner's reported case.

The outcome supports **A as the lowest-complexity working-content candidate**, with B still available for the later branding pass. It does not establish superior reading speed or comfort. C is not rejected for being serif; it currently needs more space and an additional legitimate emphasis face. Broader integration still needs the acceptance measurements above, including narrow 320px answers, enlarged text, and the other lesson block types.

Reproduction files: `/tmp/ep67-type-evidence/integrated-alternatives.py` and `integrated-alternatives.json`. Screenshots follow `alternative-{baseline,A,B,C}-{390,1440}-{top,forms,examples,feedback}.png` in the same directory. The earlier standalone specimen script is `specimen.py`. These are review artifacts; no app CSS, content, or behavior was changed by this experiment.
