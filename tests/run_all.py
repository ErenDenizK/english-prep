#!/usr/bin/env python3
"""Run every Python browser suite against one local server (tests/README.md).

Starts `python3 -m http.server` on the repository root (a free port unless
--port is given, or none at all when --base-url is given), runs each
tests/*.py suite in turn with the shared --base-url/--browser-path flags,
prints one line per file and exits non-zero if any file failed.

  python3 tests/run_all.py                    # all suites
  python3 tests/run_all.py aura scroll_rail   # only files whose name contains these
"""
import argparse
import os
from pathlib import Path
import re
import socket
import subprocess
import sys
import time
import urllib.request

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent


def suites(filters):
    files = sorted(p for p in HERE.glob('*.py') if not p.name.startswith('_') and p.name != Path(__file__).name)
    if filters:
        files = [p for p in files if any(f in p.stem for f in filters)]
    return files


def free_port():
    with socket.socket() as s:
        s.bind(('127.0.0.1', 0))
        return s.getsockname()[1]


def wait_for(url, server, seconds=15):
    deadline = time.monotonic() + seconds
    while time.monotonic() < deadline:
        if server.poll() is not None:
            raise SystemExit(f'http.server exited with {server.returncode}')
        try:
            with urllib.request.urlopen(url, timeout=1):
                return
        except OSError:
            time.sleep(0.2)
    raise SystemExit(f'{url} did not answer within {seconds} s')


def summary(output):
    """unittest's own verdict: (ran, failures+errors, skipped)."""
    ran = re.findall(r'^Ran (\d+) tests? in', output, re.M)
    verdict = re.findall(r'^(OK|FAILED)(?: \((.*)\))?$', output, re.M)
    counts = dict(re.findall(r'(\w+)=(\d+)', verdict[-1][1])) if verdict else {}
    bad = int(counts.get('failures', 0)) + int(counts.get('errors', 0))
    return (int(ran[-1]) if ran else 0), bad, int(counts.get('skipped', 0))


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('filters', nargs='*', help='substrings of suite names to run')
    parser.add_argument('--base-url', default=os.environ.get('EP_BASE_URL') or None,
                        help='use an already running server instead of starting one')
    parser.add_argument('--browser-path', default=os.environ.get('EP_BROWSER') or None)
    parser.add_argument('--port', type=int, default=int(os.environ.get('EP_PORT') or 0) or None,
                        help='port for the server this runner starts (default: a free one)')
    parser.add_argument('--timeout', type=int, default=600, help='seconds allowed per suite')
    parser.add_argument('-v', '--verbose', action='store_true', help='print every suite\'s output')
    args = parser.parse_args()

    files = suites(args.filters)
    if not files:
        raise SystemExit('no suite matches ' + ' '.join(args.filters))

    server = None
    base = args.base_url
    if not base:
        port = args.port or free_port()
        server = subprocess.Popen(
            [sys.executable, '-m', 'http.server', str(port), '--bind', '127.0.0.1', '--directory', str(ROOT)],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        base = f'http://127.0.0.1:{port}/'
        wait_for(base + 'index.html', server)

    flags = ['--base-url', base]
    if args.browser_path:
        flags += ['--browser-path', args.browser_path]
    print(f'{len(files)} suites against {base}' + (f' with {args.browser_path}' if args.browser_path else ''), flush=True)

    failed, totals = [], [0, 0, 0]
    try:
        for path in files:
            started = time.monotonic()
            try:
                result = subprocess.run([sys.executable, str(path), *flags], cwd=ROOT, capture_output=True,
                                        text=True, timeout=args.timeout)
                output, code = result.stdout + result.stderr, result.returncode
            except subprocess.TimeoutExpired as error:
                output, code = f'{error.stdout or ""}{error.stderr or ""}\ntimed out after {args.timeout} s', -1
            ran, bad, skipped = summary(output)
            ok = code == 0 and ran > 0
            totals[0] += ran - bad - skipped
            totals[1] += bad
            totals[2] += skipped
            note = f'{ran} ran' + (f', {bad} failed' if bad else '') + (f', {skipped} skipped' if skipped else '')
            print(f'{"PASS" if ok else "FAIL"}  {path.name:<40} {note:<26} {time.monotonic() - started:6.1f} s', flush=True)
            if not ok:
                failed.append(path.name)
            if args.verbose or not ok:
                print(output.rstrip(), flush=True)
    finally:
        if server:
            server.terminate()
            server.wait()

    print(f'\n{totals[0]} passed, {totals[1]} failed, {totals[2]} skipped in {len(files)} suites')
    if failed:
        print('failed: ' + ', '.join(failed))
        sys.exit(1)


if __name__ == '__main__':
    main()
