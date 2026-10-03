# Editing the English Prep product page

`/about/` is a static page. There is no build, package installation or CMS.
Run the app's normal local HTTP server and open `about/` to preview changes.

## Where to edit

| File | Purpose |
| --- | --- |
| `index.html` | Page title/description, hero, main section placement, final invitation, footer and no-JavaScript fallback. |
| `content.js` | Product tour copy, study stories, features, engineering explanations, questions and optional new sections. |
| `about.js` | Shared rendering and accessible screenshot selection. Routine copy changes do not require editing this. |
| `about.css` | Responsive portfolio layout. App palette and atmosphere come from `../css/editorial.css`. |
| `assets/` | Real application viewport captures, not mock screen contents. |

Use plain text strings in `content.js`. Text is inserted with `textContent`; HTML
and Markdown markup will intentionally display literally. Turkish copy belongs
in this page; existing English grammar titles can be named where relevant.

## Add a feature

Append another object to `everydayFeatures.items`:

```js
{
  label: "Kısa kategori",
  title: "Kullanıcının elde ettiği yarar.",
  body: "Uygulamanın gerçekten yaptığı şeyi anlatan bir veya iki cümle.",
  action: { label: "İlgili bölümü aç", href: "../index.html#egitim" },
},
```

The action is optional. The grid automatically wraps one, two or three columns;
it has no fixed item count or fixed text height. Longer titles and descriptions
wrap instead of being truncated. A link may be relative or HTTP(S). Never add
unimplemented feature claims, guessed usage figures or fabricated testimonials.

## Add a complete section

Append to `extraSections` at the bottom of `content.js`:

```js
export const extraSections = [
  {
    eyebrow: "Yeni bölümün kısa etiketi",
    title: "Bölüm başlığı.",
    intro: "Bu bölümün ne anlattığını açıklayan giriş.",
    items: [
      { label: "İsteğe bağlı etiket", title: "Alt başlık", body: "Açıklama." },
      { title: "İkinci alt başlık", body: "Başka bir açıklama." },
    ],
  },
];
```

The renderer supplies a unique section heading ID. Additional sections appear
between the feature list and engineering narrative. To write more engineering
content, simply append to `engineering.items`; to add a secondary question,
append a `{ title, body }` object to `questions`. Questions use native HTML
`details` and work with keyboard controls without a custom accordion script.

## Product tour and images

Each `tourScreens` entry has a unique `id`, label, title, body, detail, action and
image description (`alt`). Its two images are named:

```
assets/<id>-phone.webp   390 × 844
assets/<id>-wide.webp    1440 × 1000
```

Current IDs: `education`, `article`, `test`, `results`. Add both captures before
adding a new entry. If capture dimensions change, update `viewportSpecs` in
`about.js` and corresponding static fallback/hero dimensions in `index.html`.
The phone image shows a phone-size web viewport; do not label it as verified
physical iPhone/Safari behavior unless that was actually tested.

Use real local application captures with demonstration data. Never capture a
person's private history. `tools/capture-portfolio.py` controls the fixture and
asset generation. Run it against a local HTTP server, using its `--base-url`
option if your server uses a different address. The capture script uses Python
Playwright and Pillow as developer tools; neither is an application dependency.
The gallery labels progress/results as demonstration state.
Do not replace screenshots with HTML imitations of features that do not exist.

```bash
python3 tools/capture-portfolio.py --base-url http://127.0.0.1:8000
```

Images do not auto-rotate. The screen and viewport buttons retain focus and
announce selection; all product benefits are also visible as ordinary text.
An iframe is deliberately avoided because it would run a second copy of the
application against a visitor's real local progress. GIFs are not required. If
video is added later, include user controls, a poster and equivalent text.

## Palette, motion and future releases

The shared palette and motion decision is
`docs/adr/007-sakura-and-purposeful-motion.md`. The portfolio reads its tokens
from the actual app stylesheet. Avoid adding arbitrary hex colors for prose or
controls in `about.css`; new semantic pairs need measurement with the app's
contrast tooling.

The shared `motion.js` module supplies the header toggle and three ambient
fields. It respects reduced motion, a saved preference, and hidden-page state.
Finite entry and gallery effects are canceled when motion is stopped; controls
and content remain available immediately. Do not add autoplay carousels,
parallax or hidden-until-scroll content.

When adding a JS or CSS file, add it to the main `sw.js` shell list and bump the
release version with the release owner. Gallery images are optional media; they
should not all be precached as mandatory app startup assets. Keep the live
`data/manifest.json` counts accurate. If the material changes, also update the
three corpus-count fallbacks in `index.html`.

## Before publishing edits

- Inspect 320px, 390px, tablet and wide views, plus enlarged text.
- Follow every new link from `/english-prep/about/`, not just from domain root.
- Try the screenshot choices with Tab, Enter and Space; pressed state and image
  caption should agree, and focus should stay on the activated control.
- Turn off motion and enable the OS reduced-motion preference.
- Add an extra item and a long title temporarily; look for overflow and clipping.
- Check that asset dimensions, alternate text and screenshot contents match.
- Keep PWA/offline/local-data limits accurate. Measured accessibility checks do
  not imply independent certification or physical-device testing.
