# Editing the English Prep product page

`/about/` is a static product and engineering story. No build, package install
or CMS is needed. Serve the repository and open `about/` to preview edits.

| File | Purpose |
| --- | --- |
| `index.html` | Metadata, hero, section placement, static fallback, final invitation and footer. |
| `content.js` | Hero folio, study stages, architecture, features, engineering details, questions and extra sections. |
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
The phone image represents a 390×844 web viewport; wide represents 1440×1000.
Captures are rendered at 3× phone and 2× wide device pixel ratio
(1170×2532 and 2880×2000 pixels);
HTML dimensions remain the logical viewport sizes to reserve stable layout. These dimensions are
not a claim of physical iPhone/Safari testing. The phone image is deliberately
cropped to a square illustration immediately below its controls; its top remains
legible and the explanatory copy follows. The desktop story places copy beside
the wide capture. All essential claims remain in ordinary page copy.

Actual capture pairs: `education`, `article`, `test`, `results`. The folio and story use
Article, Test and Results; Education remains available for app/README presentation. Keep both files
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
The baseline is documented in [ADR 009](../docs/adr/009-expressive-study-motion.md);
[the current composition](../docs/design/about-v072.md) explains the scene update.
Shared `interactions.js` handles finite effects and cancellable arrivals;
`motion.js` owns the preference, background and reduced-motion behavior.

The hero is a study folio with three physical leaves, edited through
`folioChapters` in `content.js`. Each defines an id, label, existing capture,
short sheet title/note, ordinary heading/body and a real application action.
Available semantic tones are `accent` (sakura), `cool` (lagoon), `secondary`
(iris) and `tertiary` (apricot). Headlines and explanations remain neutral;
the selected leaf uses its tone for its edge, index and small category label.

Selecting a tab brings its real screen to the front and changes the product
explanation immediately. Tapping the front leaf or “Katmanları aç” fans the
three layers apart; exposed leaves can be selected directly. “Döndür” gives
a deliberate side angle, then “Öne dön” restores the front. These are native
buttons, including all drag alternatives; arrow keys/Home/End also move among
tabs. Controls stay outside the moving deck and focus remains on the control.

Optional horizontal dragging on the deck turns one leaf after a 46px movement;
below that threshold the object settles back. The transient angle is bounded
at 16° horizontal/5° vertical. A vertical intention, pointer cancellation,
lost capture, blur, hidden page or preference change releases the drag without
turning. `touch-action: pan-y pinch-zoom` preserves browser scroll and zoom.
There is no hover-only action, autoplay carousel or idle JavaScript frame loop.
All meaningful states remain complete with motion disabled; a user-selected
angle changes instantly instead of animating. The ordinary title/caption
never rotate with the decorative capture.

Study and architecture each form one continuous board. Their controls are
chapters of the same scene: no separate button cards or screenshot gallery.
The shared selection line follows actual button geometry, including wrapped
labels and additional authored stages. Labels, links and pressed state update
immediately, while illustrations follow a softer 1100ms flow and SVG trace.
Clicking the selected chapter again acknowledges the action through its glyph.

The active folio leaf waits for its screenshot to decode. Each story selection waits for
the selected picture to decode and for its actual frame to intersect the viewport;
`whenVisible` also waits for fonts and painted frames. Rapid changes cancel
pending and active effects. A stale decoded image cannot animate the latest
selection. Copy is never hidden and the application link is usable throughout.

Native feature, technical and FAQ disclosures preserve browser keyboard/focus
behavior. Supported browsers progressively enhance their intrinsic height with
`interpolate-size` and `::details-content`, including closing; other browsers
retain an immediate complete disclosure and finite body/icon cue. No content
height is hardcoded. Reduced motion and the saved preference disable every cue.

The motion preference is available **only in application settings**. The footer
links there rather than adding another on/off control. The shared preference
and OS reduced motion apply to this page; a hidden page pauses decoration.
Do not introduce autoplay carousels or continuously moving paragraphs.

## Before publishing

- Check 320, 390, 768 and 1440px, enlarged text and a long appended item.
- Tab through story and architecture buttons; confirm focus, selected label,
  displayed content and source/action links agree.
- Confirm there is no screenshot gallery/viewport chooser or motion toggle outside settings.
- Check a feature disclosure with touch and keyboard, then rapid story changes.
  The last selected stage must win with no accumulated scene animations.
- Scroll to the product illustration and check its one-shot entry starts when
  the illustration enters, not when the distant section heading enters.
- Test folio chapter buttons, layer fan, angle/front return, dragging/cancellation and native touch scrolling. Turn motion off in application settings,
  reload, and enable OS reduced motion; the content must remain usable.
- Check current captures, alt text, image loading and the `/english-prep/` prefix.
- Run `tests/about_interaction_browser.py` and the app's required checks.
- Keep local-data, caching and install limits honest. Automated Chromium checks
  are not accessibility certification or proof of physical-device behavior.

New JS/CSS modules must be included in `sw.js` by the release owner. Update the
release version together with the app; do not change the preserved original.

### Feature disclosure layout

Feature summaries keep their label, heading and chevron in separate grid cells
inside the shared `.control-face` animation wrapper. Copy remains in
`everydayFeatures` / `extraSections`; no manual line breaks are needed. Phone
layouts have one column, widths from 700px have two. The summary has a minimum
height, not a fixed maximum, so longer titles and larger text can grow.
