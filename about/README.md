# Editing the English Prep product page

`/about/` is a static product and engineering story. No build, package install
or CMS is needed. Serve the repository and open `about/` to preview edits.

| File | Purpose |
| --- | --- |
| `index.html` | Metadata, hero, section placement, static fallback, final invitation and footer. |
| `content.js` | Study stages, architecture, features, engineering details, questions and extra sections. |
| `about.js` | Safe DOM rendering and accessible story/architecture selection. |
| `about.css` | Responsive portfolio layout using the app's measured color tokens. |
| `assets/` | Genuine application viewport captures with demonstration data. |

Use plain strings. `textContent` renders the copy; HTML/Markdown intentionally
appears literally. Turkish is the portfolio language. Real English grammar
names may appear where useful.

## Edit the study story

There is no screenshot gallery or screen-size selector. Three learner actions
explain the product: read, apply and return. Their real screenshots support the
story. `studyStages` is editable and accepts additional stages:

```js
{
  id: "read",                         // Unique, stable selector
  label: "Oku",                       // Short button label
  icon: "book",                       // Name in ../js/icons.js
  capture: "article",                 // Existing actual capture pair
  title: "Kulağına doğru gelenin nedenini bul.",
  body: "Bu adımda kullanıcının ne yaptığını anlat.",
  detail: "İsteğe bağlı kısa bir ayrıntı veya önemli sınır.",
  alt: "Ekran görüntüsünün sade açıklaması",
  action: { label: "Bir derse göz at", href: "../index.html#egitim/..." },
},
```

Controls are ordinary buttons with pressed state. Enter/Space and touch work;
focus stays on the chosen control. The image and copy update immediately, and
a short status announces the selected stage. No automatic rotation, artificial
quiz demo, iframe, swiping requirement or application-storage mutation exists.
Always link to a real action; results cannot be opened without a real session.

The browser chooses `assets/<capture>-phone.webp` below 700px and the corresponding
`assets/<capture>-wide.webp` above that threshold through a native `picture`.
The phone image is a 390×844 web viewport; wide is 1440×1000. These dimensions are
not a claim of physical iPhone/Safari testing. The phone image is deliberately
cropped to a square illustration immediately below its controls; its top remains
legible and the explanatory copy follows. The desktop story places copy beside
the wide capture. All essential claims remain in ordinary page copy.

Actual capture pairs: `education`, `article`, `test`, `results`. The hero uses
Education and Article; story uses Article, Test and Results. Keep both files
when adding a new capture. If dimensions change, update the `source`/`img`
attributes and frame ratio in `index.html` and `about.css`.

```bash
python3 tools/capture-portfolio.py --base-url http://127.0.0.1:8000
```

The capture script uses Python Playwright/Pillow only as developer tools. Use
its demonstration fixture, never personal history. Do not replace captures with
invented UI or learning content. Images cache when visited; they are optional
media, not mandatory service-worker startup assets.

## Edit architecture

`architecture` contains selectable explanatory nodes. Each has `id`, `label`,
`icon`, `subtitle`, `title`, `body`, `detail` and a real source `action`. Appending
an entry adds a button and corresponding panel content; no renderer change is
needed. Keep ids unique and explanations factual. The selected node has a clear
pressed state and a source link. Core local-data/offline limits remain visible
in feature copy, even if the visitor never changes architecture selection.

`engineering.items` supplies compact native disclosures below this diagram.
These are the place for supplementary technical detail. `engineering.links`
points to source, design decisions and current validation. Avoid hardcoded test
counts that will become stale after the next release.

## Add a feature or section

Append to `everydayFeatures.items`:

```js
{
  label: "Kısa kategori", icon: "bookmark",
  title: "Kullanıcının elde ettiği yarar.",
  body: "Uygulamanın gerçekten yaptığı şeyin açıklaması.",
  action: { label: "İlgili bölümü aç", href: "../index.html#egitim" },
},
```

The action is optional. Each feature is an article containing a native `details`
disclosure: the full category/title forms its summary and the full body/action
remains available through touch, Enter or Space. The first feature starts open;
opening another does not close it. The grid grows from one to two/three columns.
No fixed text height, truncation or item count is assumed. Unknown icon names fall back
to the shared spark; choose a meaningful existing icon when possible. All links
must be relative or HTTP(S). Do not add unimplemented claims or invented usage
figures/testimonials.

`extraSections` extends the page between features and engineering:

```js
export const extraSections = [{
  eyebrow: "Yeni bölüm", title: "Bölüm başlığı.", intro: "Kısa giriş.",
  items: [
    { label: "Etiket", title: "Alt başlık", body: "Açıklama.", icon: "book" },
    { title: "İkinci alt başlık", body: "Başka bir açıklama." },
  ],
}];
```

The renderer supplies unique heading IDs. Questions accept `{title, body}`
objects in `questions` and use native `details`. Long copy wraps; appended items
reflow without a layout rewrite. If corpus totals change, update static HTML
fallbacks; live totals are read from `data/manifest.json`.

## Branding and motion

The masthead/footer use the full `english prep.` wordmark; the closing invitation
uses compact `ep.`. Both use `../js/brand.js`, one type treatment and a cherry dot.
The system is documented in [ADR 009](../docs/adr/009-expressive-study-motion.md).
Shared `interactions.js` handles finite effects and pointer-scene lifecycle;
`motion.js` owns the preference, background and reduced-motion behavior.

The hero's decorative image plane responds only to a fine hover pointer, with
at most 2 degrees tilt and 6px displacement. No paragraph, headline or click target
moves in response to the pointer. The reflection is bounded behind the artwork.
Touch scroll/zoom stay native. There is no permanent JavaScript animation loop.

The opening has a shared composition: a 900ms artwork entrance, a 560ms phone
settle and a 720ms normalized SVG trace, offset by at most 160ms. Study selection
uses a 560ms local scene; the architecture's selected layer settles while its
connection traces. The real state, copy, link and selected button update first.
Rapid selections cancel the preceding artwork and selection marks. Feature
and technical disclosures have immediate native open/close with a 220ms body
cue; headings and icons have one-shot visible-entry choreography.

The visibility observer watches each large illustration separately, so a tall
phone section cannot finish its artwork entrance before the art comes into
view. Artwork with a running user-selected scene is not given a competing entry.
Content is never initially hidden. All effects use shared `animateSequence` or
`animateElement`, rather than a private registry, timer or spring loop. The **Hareket** preference is in the footer, not the
header. It persists, stops local effects and follows OS reduced motion. A hidden
page pauses decoration. Do not introduce autoplay carousels or moving text.

## Before publishing

- Check 320, 390, 768 and 1440px, enlarged text and a long appended item.
- Tab through story and architecture buttons; confirm focus, selected label,
  displayed content and source/action links agree.
- Confirm there is no screenshot gallery/viewport chooser or header pause.
- Check a feature disclosure with touch and keyboard, then rapid story changes.
  The last selected stage must win with no accumulated scene animations.
- Scroll to the product illustration and check its one-shot entry starts when
  the illustration enters, not when the distant section heading enters.
- Test fine-pointer response, pointer leave and touch scrolling. Turn motion off,
  reload, and enable OS reduced motion; the content must remain usable.
- Check current captures, alt text, image loading and the `/english-prep/` prefix.
- Run `tests/about_interaction_browser.py` and the app's required checks.
- Keep local-data, caching and install limits honest. Automated Chromium checks
  are not accessibility certification or proof of physical-device behavior.

New JS/CSS modules must be included in `sw.js` by the release owner. Update the
release version together with the app; do not change the preserved original.
