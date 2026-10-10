#!/usr/bin/env python3
"""Independent v0.73 input-continuity review in an actual Chromium viewport.

The rail's gesture geometry is covered by scroll_rail_browser.py. These checks
cross page arrivals, native inputs, live scoring and the shared motion setting.
"""
import re
import unittest

from playwright.sync_api import expect, sync_playwright

from _harness import launch_chromium, make_parser

parser = make_parser(__doc__)
ARGS, TEST_ARGS = parser.parse_known_args()
BASE = ARGS.base_url.rstrip('/')


class MotionInputReview(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        cls.browser = launch_chromium(cls.pw, ARGS)

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()

    def setUp(self):
        self.errors = []
        self.context = self.browser.new_context(viewport={'width': 390, 'height': 844},
            color_scheme='dark', service_workers='block', reduced_motion='no-preference')
        self.context.add_init_script("localStorage.setItem('englishPrep.onboarded','true')")
        self.page = self.context.new_page()
        self.page.set_default_timeout(8000)
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [])

    def visit(self, path='index.html#egitim'):
        self.page.goto(BASE + '/' + path)
        self.page.evaluate('document.fonts.ready')

    def click_now(self, locator):
        """Use pointer coordinates without Playwright waiting for visual stability."""
        rect = locator.bounding_box()
        self.assertIsNotNone(rect)
        if rect['y'] < 0 or rect['y'] + rect['height'] > self.page.viewport_size['height']:
            locator.scroll_into_view_if_needed()
            rect = locator.bounding_box()
        self.page.mouse.click(rect['x'] + rect['width'] / 2,
                              rect['y'] + rect['height'] / 2)

    def finite_running(self):
        return self.page.evaluate('''() => document.getAnimations().filter(a =>
          a.playState === 'running' && Number.isFinite(a.effect.getComputedTiming().endTime)).length''')

    def test_rapid_navigation_then_native_menu_keeps_last_user_intent(self):
        for width, height in [(390, 844), (1440, 1000)]:
            with self.subTest(width=width):
                self.page.set_viewport_size({'width': width, 'height': height})
                self.visit()
                self.page.locator('#index-filter').wait_for()
                for view in ['test', 'egitim', 'test', 'egitim', 'test']:
                    self.click_now(self.page.locator(f'.nav__item[data-view="{view}"]'))
                    expect(self.page.locator(f'#view-{view}')).to_be_visible()
                expect(self.page).to_have_url(re.compile('#test$'))
                expect(self.page.locator('.view:visible')).to_have_count(1)
                trigger = self.page.locator('[aria-labelledby~="mixed-count-label"]')
                self.click_now(trigger)
                menu = self.page.locator('[role="listbox"]:visible')
                expect(menu).to_be_visible()
                first = menu.locator('[role="option"]').first
                label = first.locator('.listbox__option-label').inner_text()
                self.click_now(first)
                expect(trigger).to_contain_text(label)
                expect(trigger).to_have_attribute('aria-expanded', 'false')
                expect(trigger).to_be_focused()
                self.page.wait_for_timeout(1500)
                self.assertEqual(self.finite_running(), 0)

    def test_arriving_button_and_combobox_text_stay_inside_their_visible_control(self):
        self.visit()
        self.page.locator('#index-filter').wait_for()
        self.page.evaluate('''() => {
          window.__controlFrames = [];
          let count = 0;
          function sample() {
            if (!document.querySelector('#view-test').hidden) {
              for (const face of document.querySelectorAll('#test-panel .btn > .control-face, #test-panel .listbox__trigger > .control-face')) {
                const inner = face.getBoundingClientRect(), outer = face.parentElement.getBoundingClientRect();
                if (outer.bottom < 0 || outer.top > innerHeight) continue;
                window.__controlFrames.push({label:face.textContent.trim(), x:inner.x,
                  fits:inner.top >= outer.top - 1 && inner.bottom <= outer.bottom + 1});
              }
            }
            if (++count < 70) requestAnimationFrame(sample);
            else window.__controlFramesDone = true;
          }
          requestAnimationFrame(sample);
        }''')
        self.click_now(self.page.locator('.nav__item[data-view="test"]'))
        self.page.wait_for_function('window.__controlFramesDone')
        frames = self.page.evaluate('window.__controlFrames')
        self.assertGreater(len(frames), 30)
        self.assertEqual([frame for frame in frames if not frame['fits']], [])
        # A real rendered movement is required, not just an Animation object.
        action_x = [frame['x'] for frame in frames if frame['label'] == 'Teste başla']
        self.assertGreater(max(action_x) - min(action_x), 1)

    def test_profile_arrival_reset_cancel_and_transfer_cancel_preserve_records(self):
        self.page.add_init_script("localStorage.setItem('englishPrep.profileName','Deniz')")
        self.visit('index.html#test')
        self.page.locator('#profile-trigger').wait_for()
        self.click_now(self.page.locator('#profile-trigger'))
        expect(self.page.locator('#view-profil')).to_be_visible()
        self.page.locator('#profile-name').wait_for()
        before = self.page.evaluate('JSON.stringify({...localStorage})')
        reset = self.page.get_by_role('button', name='Geçmişi sıfırla', exact=True)
        reset.scroll_into_view_if_needed()
        self.click_now(reset)
        dialog = self.page.locator('#confirm-dialog')
        expect(dialog).to_be_visible()
        # The real target must work while its content is still arriving.
        self.click_now(self.page.get_by_role('button', name='Vazgeç', exact=True))
        expect(dialog).to_be_hidden()
        expect(reset).to_be_focused()
        backup = self.page.get_by_role('button', name='Yedek al', exact=True)
        backup.scroll_into_view_if_needed()
        self.click_now(backup)
        expect(self.page.locator('#backup-dialog')).to_be_visible()
        self.page.keyboard.press('Escape')
        expect(self.page.locator('#backup-dialog')).to_be_hidden()
        expect(backup).to_be_focused()
        self.assertEqual(self.page.evaluate('JSON.stringify({...localStorage})'), before)

    def test_double_answer_click_during_arrival_records_one_answer(self):
        self.visit('index.html#test')
        self.page.get_by_role('button', name='Teste başla', exact=True).wait_for()
        self.click_now(self.page.get_by_role('button', name='Teste başla', exact=True))
        option = self.page.locator('.option').first
        expect(option).to_be_visible()
        rect = option.bounding_box()
        self.page.mouse.dblclick(rect['x'] + rect['width'] / 2,
                                 rect['y'] + rect['height'] / 2, delay=30)
        expect(self.page.locator('.feedback')).to_be_visible()
        saved = self.page.evaluate("JSON.parse(sessionStorage.getItem('englishPrep.activeQuiz'))")
        attempt_id = saved['attemptId']
        self.assertEqual(saved['currentIndex'], 0)
        self.assertEqual(len([a for a in saved['selectedAnswers'] if a is not None]), 1)
        self.click_now(self.page.get_by_role('button', name='Sonraki soru', exact=True))
        expect(self.page.locator('.feedback')).to_have_count(0)
        self.assertEqual(self.page.evaluate("JSON.parse(sessionStorage.getItem('englishPrep.activeQuiz')).currentIndex"), 1)
        second = self.page.locator('.option').first
        expect(second).to_be_visible()
        self.click_now(second)
        saved = self.page.evaluate("JSON.parse(sessionStorage.getItem('englishPrep.activeQuiz'))")
        self.assertEqual(len([a for a in saved['selectedAnswers'] if a is not None]), 2)
        self.assertEqual(saved['attemptId'], attempt_id)

    def test_switching_motion_off_during_arrival_leaves_final_content_and_working_controls(self):
        self.visit('index.html#test')
        self.page.locator('#profile-trigger').wait_for()
        self.click_now(self.page.locator('#profile-trigger'))
        control = self.page.locator('[data-motion-control]')
        expect(control).to_be_visible()
        control.scroll_into_view_if_needed()
        self.click_now(control)
        expect(self.page.locator('html')).to_have_attribute('data-motion', 'off')
        self.assertEqual(self.finite_running(), 0)
        self.page.goto(BASE + '/index.html#egitim/tenses-present-perfect-vs-past-simple')
        expect(self.page.locator('.lesson')).to_be_visible()
        rail = self.page.locator('.scroll-rail__control')
        rail.focus()
        rail.press('End')
        expect(rail).to_have_attribute('aria-valuenow', '100')
        self.assertEqual(self.finite_running(), 0)
        expect(self.page.locator('.lesson')).to_be_visible()

    def test_reduced_motion_and_about_buttons_keep_all_final_states(self):
        # v0.77 About under reduced motion: every control reaches its final
        # state at once and nothing finite keeps running.
        self.page.emulate_media(reduced_motion='reduce')
        self.visit('about/')
        sentence = self.page.locator('#lens-forms [role="radio"]').nth(1)
        expect(sentence).to_be_visible()
        self.click_now(sentence)
        expect(sentence).to_have_attribute('aria-checked', 'true')
        self.click_now(self.page.locator('.ab-pager__item').nth(1))
        expect(self.page.locator('#lens-title')).to_have_text('Alışkanlık mı, şu an mı?')
        self.page.locator('#specimen').scroll_into_view_if_needed()
        self.click_now(self.page.locator('.ab-option').first)
        expect(self.page.locator('.ab-result__verdict')).to_be_visible()
        self.assertEqual(self.finite_running(), 0)
        hidden = self.page.evaluate('[...document.querySelectorAll("[data-reveal]")].filter((e) => getComputedStyle(e).opacity !== "1").length')
        self.assertEqual(hidden, 0)
        self.assertLessEqual(self.page.evaluate('document.documentElement.scrollWidth'), 390)


if __name__ == '__main__':
    unittest.main(argv=[__file__, *TEST_ARGS])
