#!/usr/bin/env python3
"""Bounded scroll-rail behavior on the real app; serve the repository first."""
import argparse
import unittest

from playwright.sync_api import expect, sync_playwright

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base-url', default='http://127.0.0.1:8000')
parser.add_argument('--browser-path', default='/usr/bin/chromium')
ARGS, TEST_ARGS = parser.parse_known_args()
BASE = ARGS.base_url.rstrip('/')
LESSON = 'index.html#egitim/tenses-present-perfect-vs-past-simple'


class ScrollRailTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        cls.browser = cls.pw.chromium.launch(executable_path=ARGS.browser_path, args=['--no-sandbox'])

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()

    def setUp(self):
        self.context = self.browser.new_context(viewport={'width': 1440, 'height': 1000},
                                                service_workers='block', reduced_motion='no-preference')
        self.page = self.context.new_page()
        self.page.set_default_timeout(8000)
        self.errors = []
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [])

    def visit(self, path=LESSON):
        self.page.goto(BASE + '/' + path)
        if '#egitim/' in path:
            expect(self.page.locator('.lesson')).to_be_visible()
        # Same initializer also gives this test the supported cleanup API.
        self.page.evaluate('''async base => {
          const {initScrollRail}=await import(base+'/js/scroll-rail.js');
          window.__rail=initScrollRail();
        }''', BASE)
        self.page.wait_for_function("document.querySelector('.scroll-rail')?.dataset.mode")

    def scroll_top(self):
        return self.page.evaluate("(document.querySelector('#shell-scroll') || document.scrollingElement).scrollTop")

    def control(self):
        return self.page.get_by_role('scrollbar', name='Sayfada gezin')

    def test_desktop_reader_exposes_bounded_keyboard_scrollbar_and_real_landmarks(self):
        self.visit()
        bar = self.control()
        expect(bar).to_be_visible()
        expect(bar).to_have_attribute('aria-controls', 'shell-scroll')
        expect(bar).to_have_attribute('aria-orientation', 'vertical')
        expect(self.page.locator('.scroll-rail')).to_have_attribute('data-mode', 'staged')
        box = bar.bounding_box()
        self.assertGreaterEqual(box['width'], 44)
        self.assertGreater(box['y'], 70)
        self.assertLessEqual(box['height'], 320)
        self.assertLess(box['y'] + box['height'], 904)
        self.assertGreaterEqual(self.page.locator('.scroll-rail__mark').count(), 2)
        self.assertLessEqual(self.page.locator('.scroll-rail__mark').count(), 5)
        bar.focus()
        bar.press('PageDown')
        self.page.wait_for_function("document.querySelector('#shell-scroll').scrollTop > 500")
        expect(bar).not_to_have_attribute('aria-valuenow', '0')
        bar.press('End')
        expect(bar).to_have_attribute('aria-valuenow', '100')
        bar.press('Home')
        expect(bar).to_have_attribute('aria-valuenow', '0')
        self.assertEqual(self.scroll_top(), 0)

    def test_drag_moves_without_lag_escape_and_pointer_cancel_restore_start(self):
        self.visit()
        bar = self.control()
        bar.press('PageDown')
        self.page.wait_for_function("document.querySelector('#shell-scroll').scrollTop > 500")
        original = self.scroll_top()
        thumb = self.page.locator('.scroll-rail__thumb').bounding_box()
        x, y = thumb['x'] + thumb['width'] / 2, thumb['y'] + thumb['height'] / 2
        self.page.mouse.move(x, y)
        self.page.mouse.down()
        self.page.mouse.move(x, y + 45, steps=3)
        self.assertGreater(self.scroll_top(), original + 100)
        self.page.keyboard.press('Escape')
        self.assertAlmostEqual(self.scroll_top(), original, delta=2)
        self.page.mouse.up()
        thumb = self.page.locator('.scroll-rail__thumb').bounding_box()
        y = thumb['y'] + thumb['height'] / 2
        self.page.mouse.move(x, y)
        self.page.mouse.down()
        self.page.mouse.move(x, y + 40)
        bar.dispatch_event('pointercancel', {'pointerId': 1})
        self.assertAlmostEqual(self.scroll_top(), original, delta=2)
        self.page.mouse.up()
        self.assertIsNone(self.page.locator('.scroll-rail').get_attribute('data-dragging'))

    def test_wheel_and_track_click_do_not_intercept_or_change_routes(self):
        self.visit()
        original_url = self.page.url
        self.page.mouse.move(720, 450)
        self.page.mouse.wheel(0, 380)
        self.page.wait_for_function("document.querySelector('#shell-scroll').scrollTop > 300")
        expect(self.control()).not_to_have_attribute('aria-valuenow', '0')
        mark = self.page.locator('.scroll-rail__mark').last.bounding_box()
        self.page.mouse.click(mark['x'] + mark['width'] / 2, mark['y'] + mark['height'] / 2)
        self.page.wait_for_function("Number(document.querySelector('[role=scrollbar]').getAttribute('aria-valuenow')) > 60")
        self.assertEqual(self.page.url, original_url)

    def test_narrow_layout_is_passive_preserves_content_width_and_tracks_touch_scroll(self):
        for width in (320, 390, 640):
            with self.subTest(width=width):
                self.page.set_viewport_size({'width': width, 'height': 844})
                self.visit()
                expect(self.page.locator('.scroll-rail')).to_have_attribute('data-interactive', 'false')
                self.assertEqual(self.page.get_by_role('scrollbar').count(), 0)
                values = self.page.evaluate('''() => {
                  const rail=document.querySelector('.scroll-rail');
                  const scroller=document.querySelector('#shell-scroll');
                  const page=scroller.querySelector('.page');
                  return {width:page.getBoundingClientRect().width,rail:rail.getBoundingClientRect().width,
                    pointer:getComputedStyle(rail).pointerEvents,overflow:document.documentElement.scrollWidth,
                    viewport:innerWidth};
                }''')
                self.assertLessEqual(values['rail'], 6)
                self.assertEqual(values['pointer'], 'none')
                self.assertGreaterEqual(values['width'], min(width, 640) - 1)
                self.assertLessEqual(values['overflow'], values['viewport'])
                self.page.evaluate("document.querySelector('#shell-scroll').scrollTo({top:0,behavior:'instant'})")
                self.page.evaluate('() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))')
                before = self.page.locator('.scroll-rail__thumb').evaluate('(el)=>getComputedStyle(el).transform')
                self.page.evaluate("document.querySelector('#shell-scroll').scrollTop=450")
                self.page.wait_for_function("before => getComputedStyle(document.querySelector('.scroll-rail__thumb')).transform !== before", arg=before)

    def test_reduce_off_and_forced_colors_keep_scrolling_and_restore_native_fallback(self):
        self.visit()
        self.page.emulate_media(reduced_motion='reduce')
        self.control().press('End')
        expect(self.control()).to_have_attribute('aria-valuenow', '100')
        duration = self.page.locator('.scroll-rail__thumb').evaluate('(el)=>getComputedStyle(el).transitionDuration')
        # The existing reset layer caps transitions at .01ms; none is allowed
        # to become visible motion, irrespective of cascade-layer precedence.
        self.assertLessEqual(float(duration.rstrip('s')), .00001)
        self.page.evaluate("localStorage.setItem('englishPrep.motion','off')")
        self.page.reload()
        self.control().press('Home')
        expect(self.control()).to_have_attribute('aria-valuenow', '0')
        self.page.emulate_media(forced_colors='active')
        expect(self.page.locator('.scroll-rail')).not_to_be_visible()
        self.assertEqual(self.page.locator('#shell-scroll').evaluate('(el)=>getComputedStyle(el).scrollbarWidth'), 'auto')

    def test_coarse_pointer_uses_native_swipe_and_remains_passive_on_a_tablet(self):
        touch = self.browser.new_context(viewport={'width': 390, 'height': 844},
                                         is_mobile=True, has_touch=True, service_workers='block')
        page = touch.new_page()
        try:
            page.goto(BASE + '/' + LESSON)
            expect(page.locator('.lesson')).to_be_visible()
            expect(page.locator('.scroll-rail')).to_have_attribute('data-interactive', 'false')
            client = touch.new_cdp_session(page)
            client.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': 160, 'y': 700}]})
            for y in (640, 580, 520, 460, 400):
                client.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': 160, 'y': y}]})
            client.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
            page.wait_for_function("document.querySelector('#shell-scroll').scrollTop > 100")
            self.assertEqual(page.get_by_role('scrollbar').count(), 0)
            page.set_viewport_size({'width': 1024, 'height': 844})
            expect(page.locator('.scroll-rail')).to_have_attribute('data-interactive', 'false')
            self.assertEqual(page.get_by_role('scrollbar').count(), 0)
        finally:
            touch.close()

    def test_about_landmarks_resize_caption_dismissal_and_destroy_cleanup(self):
        self.visit('about/')
        bar = self.control()
        expect(bar).to_be_visible()
        self.assertLessEqual(self.page.locator('.scroll-rail__mark').count(), 6)
        bar.focus()
        expect(self.page.locator('.scroll-rail__caption')).to_be_visible()
        bar.press('Escape')
        expect(self.page.locator('.scroll-rail__caption')).not_to_be_visible()
        bar.press('End')
        expect(bar).to_have_attribute('aria-valuenow', '100')
        self.page.set_viewport_size({'width': 390, 'height': 844})
        expect(self.page.locator('.scroll-rail')).to_have_attribute('data-interactive', 'false')
        self.page.evaluate('window.__rail.destroy()')
        self.assertEqual(self.page.locator('.scroll-rail').count(), 0)
        self.assertEqual(self.page.locator('[data-scroll-rail-enhanced]').count(), 0)
        self.page.evaluate('window.scrollTo({top:0,behavior:"instant"})')
        self.assertEqual(self.scroll_top(), 0)

    def test_quiz_rail_is_continuous_and_never_changes_attempt(self):
        self.visit('index.html#test')
        self.page.evaluate('''async () => {
          const {startMixedTest}=await import('./js/quiz-launch.js');
          await startMixedTest(2);
        }''')
        expect(self.page.locator('#question-stem')).to_be_visible()
        self.page.wait_for_function("document.querySelector('.scroll-rail')?.dataset.mode === 'continuous'")
        self.assertEqual(self.page.locator('.scroll-rail__mark').count(), 0)
        original = self.page.evaluate("sessionStorage.getItem('englishPrep.activeQuiz')")
        # On a short viewport the question must be scrollable, but the rail
        # remains navigation within this question, never between questions.
        self.page.set_viewport_size({'width': 1440, 'height': 650})
        if self.control().is_visible():
            self.control().press('End')
            self.control().press('Home')
        self.assertEqual(self.page.evaluate("sessionStorage.getItem('englishPrep.activeQuiz')"), original)


if __name__ == '__main__':
    unittest.main(argv=[__file__, *TEST_ARGS])
