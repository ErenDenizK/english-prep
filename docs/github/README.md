# Repository presentation assets

The landing README is product-first, while the development guide holds the full
content and engineering rationale. Runtime and documentation links target
`test` explicitly so this presentation also works on the historical `main`
branch without replacing its original application.

| Asset | Purpose | Source |
| --- | --- | --- |
| `brand.svg`, `brand-compact.svg` | Static wordmark and Read → Apply → Return drawing | Authored vector shapes; no external fonts, scripts or resources |
| `study-flow.webp` | Real article, question and result in one scene | Production `about/assets/*-phone.webp`, framed in a browser at 2× |
| `workspace-wide.webp` | Responsive desktop study library | Unmodified production 2× `education-wide.webp` |
| `interaction.gif` | Optional short introduction demo | Actual app clicks and frames, isolated 390 × 844 browser |
| `introduction.webp` | Static alternative to the motion preview | Same actual browser at 2×, before recording |
| `folio.gif`, `folio.webp` | Interactive About folio and static alternative | Actual pointer interactions, fixed element crop and 2× static capture |
| `social-preview.png` | Repository social sharing card | Browser-rendered vector brand; 1280 × 640, under 1 MB |
| `metadata.json` | Dimensions, capture routes and provenance | Generated with the media |

Screenshots contain teaching material from the existing bank and isolated
**demonstration progress**. They are browser captures, not a physical iPhone test,
a mock app, a learning-outcome measurement or a retouched interface. The browser
composition places real images in a frame; it does not redraw their contents.

## Regenerate

From a checkout of the `test` branch, start the repository's static server:

```bash
npm run serve
```

In a second terminal, with development-only Python Playwright, Chromium and
Pillow and FFmpeg installed:

```bash
python3 tools/capture-portfolio.py --base-url http://127.0.0.1:8000
python3 docs/github/capture.py --base-url http://127.0.0.1:8000
```

For video capture, Playwright also needs its FFmpeg helper (`python3 -m playwright install ffmpeg`). The system `ffmpeg` command performs GIF encoding.

Both commands accept `--browser-path`. The second also accepts `--only static`
or `--only motion` for a focused capture. These dependencies are for development
media generation; none ship with the app.

`brand.svg` is hand-authored and stays static. A screenshot figure remains crisp
at 2× export, while the actual source phone captures are 3×. The animated preview
is intentionally 1× to keep a short demonstration reasonably sized. The GIF samples a native browser video at 10 frames per second, avoiding
screenshot-encoding pauses and any claim of device-frame-rate performance.
The encoder explicitly preserves the recorder’s full color range; a control
swatch measured source RGB (29, 26, 32) and decoded GIF RGB (29, 26, 31), rather than
the incorrectly darkened (14, 11, 17) from automatic range interpretation. GIF encoding cannot reproduce the production interface's complete
color depth, touch behavior or motion quality; try the app for that.

Keep the GIF inside the closed README disclosure. GitHub images cannot expose
the application's reduced-motion control. The static article/question/result
figure and introduction frame provide alternatives.

The [research and presentation plan](presentation-plan.md) records the official
GitHub Markdown references and their scope. Every local README media reference
must stay inside `docs/github/`; live and source links stay absolute.

## Review before publication

Check that captures match the release, text and controls are not clipped, the
GIF shows real state changes, and links work from both branches. A GitHub image
cache may delay a replacement under the same path; the repository always retains
the underlying media source. The code owner's authored name is **ErenDenizK**;
never invent a legal name or unverified contributor credit.

## Repository social preview

`social-preview.png` follows [GitHub's official dimensions and size guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview).
It is prepared for **Settings → General → Social preview → Edit → Upload an image**.
Committing the file does not configure the repository setting automatically.
Use this authored card for repository shares; it is separate from the application's
web manifest and the About page's social metadata.
