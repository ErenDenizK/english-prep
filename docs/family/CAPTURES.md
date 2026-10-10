# Captures for the portfolio's embassy

How English Prep makes what the family kit's [`presentation.md`](kit/presentation.md) asks of an
app: `world.json`, the screen masters and the signature clip. Development tooling only; nothing
here ships to learners, and the portfolio's lead reviews and copies the folder (the app never
pushes to the portfolio).

## Run

```bash
npm run serve &                                   # or any static server on the working tree
node tools/capture-portfolio.mjs                  # default base http://localhost:8000
node tools/make-world.mjs                         # records the captures in world.json
```

- Playwright is not a dependency: it is found globally (`npm root -g`) or at `$PLAYWRIGHT_PATH`;
  Chromium from Playwright or `$CHROMIUM_PATH` (e.g. `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`).
- `ffmpeg` on PATH encodes the clip; without it the frames stay in
  `captures/portfolio/.signature-frames/` with `encode.sh` beside them.
- Flags: `--no-clip` (stills only, under a minute), `--keep-frames` (keep the clip's PNG frames).
  `CAPTURE_RATE` sets the slow-down (default `0.02`; the clip takes about six minutes).
- Shoot from a clean tree: the manifest records the app commit, and a dirty build is not used as
  `world.json`'s `source.commit`.

## What it produces

Everything lands in `captures/portfolio/` (gitignored), named as the kit names files
(presentation.md §4). The portfolio's `content/projects/english-prep/captures/` takes them as
they are; `world.json`'s `captures[].files` already point there.

| Kit size | Files | View |
|---|---|---|
| Wide 1440 × 900 @2 | `english-prep-egitim-1440x900@2x.png` (hero), `-question-`, `-about-` | Eğitim with one lesson part-read; a question answered correctly (Sakura, check, *Doğru*); About's top |
| Tablet 1180 × 820 @2, touch | `english-prep-{egitim,question,about}-1180x820@2x.png` | the same set |
| Phone 390 × 844 @2, touch | `english-prep-{lesson,question,about}-390x844@2x.png` | a lesson (Present Perfect vs Past Simple); the answered question; About's top |
| Signature, wide @2 | `english-prep-signature-1440x900@2x-poster.png`, `.av1.mp4`, `.hevc.mp4`, `.h264.mp4` | 7 s: rest, the pointer arrives, press (.945 in 120 ms), release (380 ms through 1.035), the Sakura *Doğru*, rest |
| | `manifest.json` | per file: id, viewport, DPR, bytes, build `{ commit, version }`; the shot date and clip settings |

**Stills** are lossless PNG from `page.screenshot`, dark theme, reduced motion (the aurora as its
three still pools, so every frame repeats), a fresh context per size, service workers blocked.
The reading progress and the quiz session are seeded through the app's own modules
(`js/storage.js`, `js/session-state.js`), so nothing is mocked.

**The clip** runs with motion on. The page's animations are slowed to 2 % through CDP
(`Animation.setPlaybackRate`), lossless 2× frames are taken with `Page.captureScreenshot` at
clip scale 2, and the frames are resampled to 60 fps of real time. `Page.startScreencast` was
tried first: Chromium caps screencast frames at CSS pixels (1440 × 900 whatever the DPR), which
halves the text, so it is not used. The app's answer flow has no timers, so slowing the
animation clock slows everything the eye sees. The poster is the first frame, a rest pose.

**Encodes** (when the encoder exists; `ffmpeg -encoders`): AV1 10-bit (`libsvtav1` preset 4, CRF
28; `libaom-av1` as fallback), HEVC Main 10 tagged `hvc1` (`libx265` slow, CRF 20), H.264 High
(`libx264` slow, CRF 18). All are BT.709 primaries and matrix, limited range, the RGB → YUV matrix
set explicitly (`scale=out_color_matrix=bt709`), no audio, `+faststart`. The transfer is tagged
**sRGB** (`-color_trc iec61966-2-1`, transfer 13), not the kit's `bt709`: Safari brightens
bt709-tagged UI captures (the portfolio's media note). `ffprobe` shows
`color_transfer=iec61966-2-1` on all three.

## `world.json`

`node tools/make-world.mjs` writes [`world.json`](world.json) on the kit's schema
([`kit/world.schema.json`](kit/world.schema.json)) from `css/editorial.css`,
`css/interactions.css`, `js/interactions.js`, `about/index.html` and `sw.js`;
`tests/family-world.test.js` validates it against the schema with a small built-in validator,
runs the kit's `checkField` on `light`, and fails when the tokens drift.

- `source.commit`, `source.version`, `source.date` and each capture's `shot` are left out of the
  drift comparison (a commit cannot hold its own hash). With a manifest, `source.commit` is the
  app commit the captures were shot from (the newest commit that changed a shipped file);
  without one, the last commit that touched a token file.
- `motion.press` carries the release ("the release is the spring", kit motion.md §2). English
  Prep's release is a keyframe that overshoots (.945 → 1.035 → 1), so it is not `settle`; the
  spring given is fitted to peak and rest when the release does and is listed in
  `source.estimated`. `settle`, `glide`, `pop` are the app's own springs (soft, lively, bouncy).
- Captions and alt texts live with the shot list in `tools/capture-portfolio.mjs` (`SHOTS`).
