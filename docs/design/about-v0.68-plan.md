# About v0.68: product story and engineering portfolio

Research and implementation plan, 2026-10-04. Applies to `/about/` only.
The application remains the academic article-and-practice product described in
`docs/EXPERIENCE.md`. The portfolio does not introduce learner features or make
claims that the application cannot support.

## Problem and objective

The v0.67 page explains the proposition but has no actual application screens,
little evidence of its user journey, and almost no project depth. Its single
illustrative text card is easy to mistake for the whole product. The user now
wants a memorable brand entrance, a useful product tour, and an extensible
portfolio that can grow without breaking its layout.

Two audiences must be served in order:

1. A learner asks whether this app addresses the English concepts they confuse,
   how a session works, and whether they can start without setup.
2. A project reviewer asks what was designed and engineered, what is real, and
   where the implementation and verification evidence can be inspected.

The first screen should answer the first question; engineering depth belongs
later. Product copy must describe a benefit paired with an observable behavior,
not a list of CSS features or unsubstantiated learning outcomes.

## Evidence and source limits

The public W3C, MDN, web.dev and GOV.UK domains were blocked by this execution
environment (HTTP tunnel 403). Official sources below were read through their
public source repositories on 2026-10-04. These are source-based guidance,
not claims that those sites were visually inspected here. No participant study
or conversion experiment was conducted.

| Official source read | Relevant guidance | Consequence here |
| --- | --- | --- |
| [W3C WAI carousel overview](https://github.com/w3c/wai-tutorials/blob/master/content/carousels/index.md) | Carousels can hide discoverable content. Controls must be keyboard usable and selection changes understandable. | Visible named screen choices; meaningful headings and descriptions remain outside the image. No auto-rotation. |
| [W3C WAI animation guidance](https://github.com/w3c/wai-tutorials/blob/master/content/carousels/animations.md) | Motion needs user control; replacing controls can lose keyboard focus. | Update the existing viewer and preserve its buttons. Motion preferences stop decorative movement. A GIF is not necessary to communicate the flow. |
| [W3C WAI heading structure](https://github.com/w3c/wai-tutorials/blob/master/content/page-structure/headings.md) | Headings communicate page organization and can name regions. | One H1, H2 for each story section, H3 for features; regions named by their visible heading. |
| [MDN responsive images](https://github.com/mdn/content/blob/main/files/en-us/web/html/guides/responsive_images/index.md) | Art direction and resolution switching address different needs. Large desktop images shrunk onto a phone lose legibility and waste bandwidth. | Separate genuine mobile and desktop captures. A visible viewport choice; correct intrinsic dimensions, lazy loading and compressed image files. |
| [GOV.UK accordion](https://github.com/alphagov/govuk-design-system/blob/main/src/components/accordion/index.md) | Do not hide information everyone needs. Structured headings and reduced copy often remove a need for disclosure. | Core product flow and technical facts remain visible. Native details are reserved for secondary questions or expansion notes. |
| [MDN details element](https://github.com/mdn/content/blob/main/files/en-us/web/html/reference/elements/details/index.md) | Native summary/details carries built-in disclosure behavior and state. | Supplementary technical or install questions use native disclosure rather than a custom accordion. |

These sources constrain accessibility and delivery; they do not scientifically
determine a marketing headline or establish that a particular visual style
increases learning. The story order below is a reasoned product decision.

## Page architecture

### 1. A clear entrance

- Shared `ep.` wordmark with the agreed cherry/sakura accent, larger than the
  previous small utility logo. Full product name remains readable.
- Proposition: **Bildiğin İngilizce. Daha net ayrımlar.** Supporting copy names
  the audience and the article + explanation format, not an exam-score promise.
- One strong **Çalışmaya başla** action, one quieter **Uygulamayı keşfet** anchor.
- Short truthful context: free, no account, browser-local progress.
- Product image composition built from real screenshots after the app changes
  settle. An understated environment light can frame the devices; it must not
  pass over text or create a permanently distracting moving hero.
- Entry motion is brief, sequential and non-blocking. All content is visible
  when scripts fail and with reduced motion. The shared motion system determines
  timing, easing and pause behavior.

### 2. Interactive product tour

Visible screen choices: **Eğitim**, **Ders**, **Test**, **Sonuç**. Each choice has
an actual screenshot, a clear sentence about what the learner does, and a direct
link to the corresponding real entry where one exists. Results must not link to
a fabricated result session; its CTA goes to Test.

A separate **Telefon / Geniş ekran** control selects the viewport. All controls
remain visible and focus stays on the selection button. Buttons use
`aria-pressed`; no partial tab semantics or hidden keyboard contract. A short
polite status announces the newly selected screen and viewport. A selected
image is not itself an interactive application. Caption explicitly states that
progress/results are demonstration data and that these are web viewport
captures, not physical-device or iOS Safari verification.

Every main feature is described below in plain text, so a visitor who never
touches the viewer still gets the whole product story. The image chooser serves
inspection, not discoverability of essential information.

### 3. Follow one useful study session

Four compact feature stories, with distinct editorial rhythm rather than four
identical marketing boxes:

1. **Nerede ayrıldığını gör.** Scrolling article lessons contrast concepts,
   explain forms, show English examples and Turkish reasoning.
2. **Önce sezgini yokla.** The optional check at a lesson's beginning can be
   attempted or skipped; inline checks never gate reading or course progress.
3. **Cevabı değil, nedenini al.** Questions offer the explanation, relevant
   distractor note and transferable rule after selection. No score inflation
   or instant language-learning promise.
4. **Yanıldığın yere geri dön.** Mistake book, topic/category practice and
   direct links to relevant reading complete the loop. Graduation rule: two
   correct answers on separate days, with a later mistake resetting that item.

Corpus totals must come from `data/manifest.json` or a checked explicit source;
the current real corpus is 10 topics, 60 lessons, 241 questions. They describe
available material, not users, completion rates or validated learning impact.

### 4. A place that stays yours

Describe actual continuity: reading resume, refresh-safe quiz in the same tab,
local progress, export/import backup, optional installation, theme preference,
mobile and desktop layouts. Explain limits alongside benefits concisely:
progress is local, another device needs backup; offline availability depends on
content already opened and retained in cache; browser support controls install.

Future additions can append a feature object instead of changing grid indices
or hardcoded section counts. Cards use content-driven height and `minmax()`
columns. Long titles, more text and one extra item must be verified explicitly.

### 5. Engineering, with inspectable evidence

Introduce the implementation as a product constraint translated into an
architecture:

- Static HTML, CSS and ES modules, no build step or runtime package dependency.
- Typed JSON learning blocks rendered with DOM nodes and `textContent`; content
  schema + validator keep topic/lesson/question mappings consistent.
- localStorage for progress and saved preferences; validated session snapshots
  for same-tab test continuation; backup merges support recovery.
- Scope-separated service worker shell/content caches preserve the original
  app and visited material; caching is not a guarantee against browser eviction.
- Keyboard support, reduced motion, readable semantic roles, measured color
  pairs and responsive checks are concrete design/verification practices.
- Original v0.64 interface and original learning data are preserved.

Link to repository source, current design ADR, and current validation report.
Do not write permanently hardcoded test totals that become stale with the next
release. “Measured contrast” is not “WCAG certified”; Chromium viewport tests
are not physical iPhone validation. No fabricated testimonials, star ratings,
institutional endorsement, creator biography or engineering team.

Secondary details may explain data privacy, offline behavior, content provenance
and how to inspect the original. Core limitations are not hidden behind them.

### 6. A confident close

Repeat the product name and a concrete route into Education. Place the existing
honest install control here. End with repository and original-version links;
keep source/content provenance in readable secondary text. Avoid an empty
newsletter, false pricing CTA or nonfunctional contact form.

## Implementation contract

Owned files: `about/index.html`, `about/about.css`, `about/about.js`, new
`about/content.js`, `about/README.md`, and generated `about/media/*`. A capture
script can live in `tools/capture-about.py` if useful. Root owns shared app
palette, motion, manifest, service-worker version/cache updates and global
validation. No about implementation is started until root accepts this plan
and provides the chosen visual tokens/motion contract.

- Keep the hero, anchors and opening CTA in semantic HTML. Render extendable
  lists from `content.js` using explicit safe DOM builders, never `innerHTML`.
- Use a small documented schema: section title/intro/items, feature title/body,
  tour id/title/copy/mobile image/desktop image/action. Rendering cannot depend
  on exactly four entries or their numeric positions.
- Palette roles reuse the app decision. The portfolio can use the same colors
  at larger display sizes, but must not invent unrelated saturated tokens.
- Avoid an iframe of the app: it can modify real learner storage, starts an
  unnecessary application and makes focus/scroll behavior complex. Static
  captured screens provide genuine visual evidence without those side effects.
- Use viewport captures at 390×844 and a useful desktop size (e.g. 1440×1000).
  Call the first a phone viewport, not an iPhone-tested screenshot. Preserve
  actual app chrome; do not add a fake Apple status bar or browser claim.
- Store screenshots as WebP where supported by existing capture tooling, with
  explicit dimensions. Hero may eagerly load one asset; other images load only
  as needed. Do not precache every gallery screenshot in the app shell.
- A future video can be another documented media entry with poster, controls
  and captions/transcript. This release does not need an unpausable GIF or a
  decorative video to achieve a richer product presentation.
- All new essential JS/CSS modules must be added to the service-worker shell
  by root. Optional screenshot assets may be network cached when viewed.

## Verification criteria

1. At 320, 390, 768 and 1440px there is no horizontal overflow or clipped text;
   screenshot controls remain reachable at 200% zoom and with text spacing.
2. Keyboard-only use reaches every screenshot and viewport choice, returns a
   clear pressed state, preserves focus and announces the selected view once.
3. Reduced motion disables entrance/selection/ambient movement. Ordinary motion
   follows the shared pause/visibility rules; essential content never waits for
   a scroll animation to become visible.
4. All product links work below the `/english-prep/` deployment prefix.
5. Screenshot files exist, have genuine dimensions and final UI, and are labeled
   as demonstration state. No personal data appears in them.
6. Extra-long titles, double-length paragraphs and one appended feature do not
   break layout. The authoring guide shows one concrete addition example.
7. Contrast measurements cover about text, button states, tinted labels and
   visible focus. Screenshot pixels are product illustrations, not the sole
   source of any essential information.
8. A failed module does not remove the proposition or entry link. Installed/
   install-available/unavailable states remain truthful. About and app continue
   to use their existing scoped service worker safely.

## Pending integration decisions

- Final cherry/sakura token values and semantic success/review roles.
- Shared motion timings, reduced-motion/visibility/pause contract, and whether
  decorative atmosphere is enabled on the portfolio by default.
- Final main-app layout before deterministic screenshot capture.
- Root approval of owned implementation files and final content labels.
