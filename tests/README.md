# Tests

Two kinds live here:

- `*.test.js`: unit tests on `node:test`, run by `npm test` (no browser, no dependencies).
- `*.py`: browser suites that drive the served app in Chromium through Playwright for Python.
  `_harness.py` holds their shared flags and launch; `run_all.py` runs them all.

The Node sweep `npm run verify` (`tools/verify-ui.mjs`) is separate: it uses Node Playwright,
found globally or through `PLAYWRIGHT_PATH`.

## Setup (once)

```bash
python3 -m venv .venv && . .venv/bin/activate
pip install -r tests/requirements.txt
python -m playwright install chromium   # skip if a Chromium is already there (see EP_BROWSER)
```

## Run all suites

```bash
npm run browser                          # = python3 tests/run_all.py
python3 tests/run_all.py aura rail       # only suites whose file name contains these
python3 tests/run_all.py -v              # print every suite's output, not only failures
```

The runner starts `python3 -m http.server` on the repository root at a free port (`--port` or
`EP_PORT` to fix it), runs each suite in turn, prints `PASS`/`FAIL` per file and exits non-zero if
any file failed. Pass `--base-url` (or `EP_BASE_URL`) to use a server you already started instead.
Run it with the Python that has Playwright installed (the venv above).

## Run one suite

```bash
npm run serve &                          # :8000
python3 tests/scroll_rail_browser.py     # defaults to http://127.0.0.1:8000/
python3 tests/scroll_rail_browser.py --base-url http://127.0.0.1:8123/ \
  --browser-path /opt/pw-browsers/chromium-1194/chrome-linux/chrome
python3 tests/scroll_rail_browser.py ScrollRailTests   # unittest arguments pass through
```

Every suite takes the same flags:

| Flag             | Environment   | Default                                          |
| ---------------- | ------------- | ------------------------------------------------ |
| `--base-url`     | `EP_BASE_URL` | `http://127.0.0.1:8000/`                         |
| `--browser-path` | `EP_BROWSER`  | none: the Chromium Playwright installed itself    |

The base URL may carry a path prefix (`http://127.0.0.1:8000/english-prep/`) to mimic GitHub
Pages. `transfer_browser.py` still accepts its older `--base`. `cross_surface_browser.py` also
takes `--axe`, `--axe-path` and `--axe-report`; without `--axe` its accessibility matrix is the
one expected skip.

## The suites

| File | Covers |
| --- | --- |
| `about_interaction_browser.py` | About: the lens, distinction map, question anatomy, keyboard and motion |
| `aura_browser.py` | Aurora atmosphere (pixel comparisons, needs Pillow) |
| `component_interactions_browser.py` | Native dialog, menu and answer-state regressions |
| `composition_browser.py` | Header geometry and result presentation at responsive sizes |
| `cross_surface_browser.py` | Resume, reset, reader thumb, transfer, About across surfaces; optional axe matrix |
| `editorial_smoke.py` | Broad regressions for the article-based app, incl. snapshots and cache namespaces |
| `input_continuity_browser.py` | Rapid input during arrivals, containment, double answers |
| `motion_event_boundaries_browser.py` | Motion never delays events, focus or answer targets |
| `motion_readiness_browser.py` | Fonts and data readiness before arrival, adaptive rail, captures (needs Pillow) |
| `onboarding_interaction_browser.py` | `#hosgeldin` first-run flow |
| `press_continuity_browser.py` | Press and release, keyboard activation, motion off |
| `pretest_progress_browser.py` | Open-by-default preliminary practice and article bookmarks |
| `quiz_resume_browser.py` | Quiz persistence and resume |
| `reading_system.py` | Guided introduction, motion and PWA checks |
| `scroll_rail_browser.py` | Scroll rail behaviour on the real app |
| `transfer_browser.py` | Backup export and import |
| `ux_refinements.py` | Field focus, reader navigation and report outcomes |

All of this is Chromium emulation, not a device test.
