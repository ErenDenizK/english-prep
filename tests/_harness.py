"""Shared setup for the Python browser suites (tests/README.md).

Every suite takes the same two flags, with defaults from the environment:

  --base-url      EP_BASE_URL, else http://127.0.0.1:8000/
  --browser-path  EP_BROWSER, else unset: Playwright launches the Chromium it
                  installed itself (PLAYWRIGHT_BROWSERS_PATH is honoured).

Not a test file: the leading underscore keeps it out of tests/run_all.py.
Each suite imports it from its own directory, so `python3 tests/<file>.py`
works from anywhere.
"""
import argparse
import os

DEFAULT_BASE_URL = 'http://127.0.0.1:8000/'


def make_parser(description=None):
    """An argument parser carrying the shared flags; suites add their own."""
    parser = argparse.ArgumentParser(description=description)
    parser.add_argument('--base-url', default=os.environ.get('EP_BASE_URL') or DEFAULT_BASE_URL,
                        help='where the app is served (env EP_BASE_URL)')
    parser.add_argument('--browser-path', default=os.environ.get('EP_BROWSER') or None,
                        help='Chromium binary; omit for Playwright\'s own (env EP_BROWSER)')
    return parser


def parse(description=None, parser=None):
    """Parse the shared flags and hand the rest to unittest: (ARGS, TEST_ARGS)."""
    return (parser or make_parser(description)).parse_known_args()


def launch_chromium(pw, args):
    """Launch Chromium the same way in every suite."""
    options = {'args': ['--no-sandbox']}
    if args.browser_path:
        options['executable_path'] = args.browser_path
    return pw.chromium.launch(**options)
