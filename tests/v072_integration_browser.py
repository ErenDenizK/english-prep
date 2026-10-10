#!/usr/bin/env python3
"""Independent cross-surface v0.72 checks; optional targeted axe matrix."""
import argparse
import re
import json
from pathlib import Path
import unittest

from playwright.sync_api import expect, sync_playwright

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base-url', default='http://127.0.0.1:8182/english-prep')
parser.add_argument('--browser-path', default='/usr/bin/chromium')
parser.add_argument('--axe', action='store_true')
parser.add_argument('--axe-path', default='/tmp/english-prep-a11y/node_modules/axe-core/axe.min.js')
parser.add_argument('--axe-report', default='/tmp/ep72-integration-axe.json')
ARGS, TEST_ARGS = parser.parse_known_args()
BASE = ARGS.base_url.rstrip('/')


class IntegrationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        cls.browser = cls.pw.chromium.launch(executable_path=ARGS.browser_path, args=['--no-sandbox'])

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()

    def setUp(self):
        self.errors = []
        self.context = None
        self.new_context()

    def new_context(self, **options):
        if self.context:
            self.context.close()
        self.context = self.browser.new_context(**{
            'viewport': {'width': 390, 'height': 844}, 'color_scheme': 'dark',
            'service_workers': 'block', **options,
        })
        self.context.add_init_script('''localStorage.setItem('englishPrep.onboarded', 'true');
          localStorage.setItem('englishPrep.profileName', 'Deniz QA');''')
        self.page = self.context.new_page()
        self.page.set_default_timeout(8000)
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [])

    def visit(self, path):
        self.page.goto(BASE + '/' + path)
        self.page.evaluate('document.fonts.ready')

    def test_desktop_resume_remains_at_its_starting_height_while_syllabus_scrolls(self):
        self.new_context(viewport={'width': 1440, 'height': 1000}, reduced_motion='reduce')
        self.visit('index.html#egitim')
        aside = self.page.locator('#lesson-index > .study-aside')
        expect(aside).to_be_visible()
        first = aside.bounding_box()['y']
        positions = []
        for top in [120, 300, 600]:
            self.page.locator('#shell-scroll').evaluate('(node, top) => node.scrollTop = top', top)
            self.page.wait_for_timeout(50)
            positions.append(aside.bounding_box()['y'])
        self.assertTrue(all(abs(y - first) <= 1 for y in positions), [first, *positions])
        self.assertGreater(self.page.locator('#shell-scroll').evaluate('node => node.scrollTop'), 100)

    def test_reset_is_a_real_target_and_cancel_preserves_data_and_focus(self):
        self.visit('index.html#profil')
        reset = self.page.get_by_role('button', name='Geçmişi sıfırla', exact=True)
        dimensions = reset.evaluate('''node => {
          const r = node.getBoundingClientRect(), s = getComputedStyle(node);
          return {height:r.height, width:r.width, border:parseFloat(s.borderTopWidth), style:s.borderTopStyle};
        }''')
        self.assertGreaterEqual(dimensions['height'], 44)
        self.assertGreaterEqual(dimensions['width'], 44)
        self.assertGreaterEqual(dimensions['border'], 1)
        self.assertEqual(dimensions['style'], 'solid')
        before = self.page.evaluate('JSON.stringify({...localStorage})')
        reset.click()
        expect(self.page.get_by_role('button', name='Vazgeç', exact=True)).to_be_focused()
        self.page.keyboard.press('Escape')
        expect(self.page.locator('#confirm-dialog')).to_be_hidden()
        expect(reset).to_be_focused()
        self.assertEqual(self.page.evaluate('JSON.stringify({...localStorage})'), before)

    def test_mobile_reader_thumb_drag_and_outside_swipe_use_the_same_native_position(self):
        self.new_context(is_mobile=True, has_touch=True)
        self.visit('index.html#egitim/tenses-present-perfect-vs-past-simple')
        self.page.locator('.lesson').wait_for()
        rail = self.page.locator('.scroll-rail')
        expect(rail).to_have_attribute('data-interactive', 'true')
        expect(rail).to_have_attribute('data-compact', 'true')
        grip = rail.locator('.scroll-rail__thumb').bounding_box()
        client = self.context.new_cdp_session(self.page)
        x, y = grip['x'] + grip['width'] / 2, grip['y'] + grip['height'] / 2
        client.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': x, 'y': y}]})
        for delta in [12, 28, 44]:
            client.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': x - 12, 'y': y + delta}]})
        expect(rail).to_have_attribute('data-dragging', 'true')
        dragged = self.page.locator('#shell-scroll').evaluate('node => node.scrollTop')
        self.assertGreater(dragged, 100)
        client.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
        expect(rail).not_to_have_attribute('data-dragging', 'true')
        # Native touch-pan outside the bounded grip still moves the same shell.
        client.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': 150, 'y': 670}]})
        for yy in [625, 570, 510, 450]:
            client.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': 150, 'y': yy}]})
        client.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
        self.page.wait_for_function('(before) => document.querySelector("#shell-scroll").scrollTop > before + 40', arg=dragged)
        expect(rail).to_have_attribute('data-expanded', 'false')
        self.assertIn('#egitim/tenses-present-perfect-vs-past-simple', self.page.url)

    def test_transfer_preview_is_private_until_a_channel_is_chosen_and_clears_on_cancel(self):
        requests, downloads = [], []
        self.visit('index.html#profil')
        self.page.on('request', lambda request: requests.append(request.url))
        self.page.on('download', lambda download: downloads.append(download))
        opener = self.page.get_by_role('button', name='Yedek al', exact=True)
        before = self.page.evaluate('JSON.stringify({...localStorage})')
        opener.click()
        dialog = self.page.locator('#backup-dialog')
        expect(dialog).to_be_visible()
        expect(self.page.locator('#backup-dialog-title')).to_be_focused()
        expect(dialog).to_contain_text('Deniz QA')
        self.assertIn('Deniz QA', self.page.locator('#backup-export-text').input_value())
        dialog.locator('summary').click()
        expect(self.page.locator('#backup-export-text')).to_be_visible()
        self.page.keyboard.press('Escape')
        expect(dialog).to_be_hidden()
        expect(opener).to_be_focused()
        # Native dialog dispatches its close event in a queued task; that event
        # owns sensitive-DOM cleanup, independently of decorative animation.
        expect(self.page.locator('#backup-export-text')).to_have_value('')
        self.assertEqual(downloads, [])
        self.assertEqual(requests, [])
        self.assertEqual(self.page.evaluate('JSON.stringify({...localStorage})'), before)

    def test_about_keyboard_controls_remain_complete_with_reduced_motion(self):
        # v0.77 About: the lens, its pager and the anatomy question are fully
        # keyboard-operable, and reduced motion leaves nothing running.
        self.new_context(reduced_motion='reduce')
        self.visit('about/')
        radios = self.page.locator('#lens-forms [role="radio"]')
        radios.first.focus()
        self.page.keyboard.press('ArrowDown')
        expect(radios.nth(1)).to_be_focused()
        expect(radios.nth(1)).to_have_attribute('aria-checked', 'true')
        expect(self.page.locator('#lens-stage')).to_have_attribute('data-state', 'linked')
        third = self.page.locator('.ab-pager__item').nth(2)
        third.focus()
        self.page.keyboard.press('Enter')
        expect(third).to_have_attribute('aria-pressed', 'true')
        expect(third).to_be_focused()
        expect(self.page.locator('#lens-lesson')).to_have_attribute('href', re.compile(r'#egitim/modals-'))
        option = self.page.locator('.ab-option').nth(1)
        option.focus()
        self.page.keyboard.press('Enter')
        expect(self.page.locator('.ab-result__verdict')).to_be_visible()
        animations = self.page.evaluate("""document.getAnimations().filter(a => a.playState === 'running'
          && Number.isFinite(a.effect.getComputedTiming().endTime)).length""")
        self.assertEqual(animations, 0)

    @unittest.skipUnless(ARGS.axe, 'Pass --axe to run the 36-state accessibility matrix')
    def test_targeted_accessibility_matrix(self):
        self.assertTrue(Path(ARGS.axe_path).is_file(), ARGS.axe_path)
        results = []

        def audit(label):
            if not self.page.evaluate('Boolean(window.axe)'):
                self.page.add_script_tag(path=ARGS.axe_path)
            result = self.page.evaluate('''async () => {
              const result = await axe.run(document, {runOnly: {type:'tag', values:['wcag2a','wcag2aa','wcag21aa','wcag22aa','best-practice']}});
              const compact = item => ({id:item.id, impact:item.impact, help:item.help,
                nodes:item.nodes.map(n => ({target:n.target, summary:n.failureSummary}))});
              return {violations:result.violations.map(compact), incomplete:result.incomplete.map(compact)};
            }''')
            results.append({'state': label, **result})
            Path(ARGS.axe_report).write_text(json.dumps(results, ensure_ascii=False, indent=2))

        for width, height, scheme in [(390, 844, 'dark'), (390, 844, 'light'), (1440, 1000, 'dark')]:
            self.new_context(viewport={'width': width, 'height': height}, color_scheme=scheme, reduced_motion='reduce')
            self.page.add_init_script(f'localStorage.setItem("englishPrep.theme", "{scheme}")')
            key = f'{width}-{scheme}'
            self.visit('index.html#egitim')
            self.page.locator('#index-filter').wait_for()
            audit(key + '-home')
            self.visit('index.html#test')
            self.page.locator('[aria-labelledby~="mixed-count-label"]').click()
            audit(key + '-menu')
            self.visit('index.html#egitim/tenses-present-perfect-vs-past-simple')
            self.page.locator('.lesson').wait_for()
            self.page.locator('.scroll-rail__control').focus()
            audit(key + '-reader-rail')
            self.visit('index.html#profil')
            self.page.get_by_role('button', name='Yedek al', exact=True).wait_for()
            audit(key + '-profile')
            self.page.get_by_role('button', name='Geçmişi sıfırla', exact=True).click()
            audit(key + '-reset-dialog')
            self.page.keyboard.press('Escape')
            self.page.get_by_role('button', name='Yedek al', exact=True).click()
            audit(key + '-transfer-preview')
            self.page.locator('#backup-dialog summary').click()
            audit(key + '-transfer-expanded')
            self.visit('about/')
            self.page.locator('[data-folio-chapter="read"]').wait_for()
            audit(key + '-about')
            self.page.locator('#folio-inspect').click()
            self.page.locator('#folio-rotate').click()
            audit(key + '-about-open-angle')
            for chapter in ['apply', 'return']:
                self.page.locator(f'[data-folio-chapter="{chapter}"]').click()
                audit(key + '-about-folio-' + chapter)
            self.page.locator('[data-study-stage="apply"]').click()
            audit(key + '-about-study')
        violations = [(r['state'], v['id'], v['nodes']) for r in results for v in r['violations']]
        print(f'\nAxe: {len(results)} states, {len(violations)} violation records, '
              f'{sum(len(i["nodes"]) for r in results for i in r["incomplete"])} incomplete nodes; {ARGS.axe_report}')
        self.assertEqual(violations, [])


if __name__ == '__main__':
    unittest.main(argv=[__file__, *TEST_ARGS])
