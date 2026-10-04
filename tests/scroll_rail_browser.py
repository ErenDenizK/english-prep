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
        self.page.evaluate("() => document.fonts.ready.then(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))))")

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
        expect(bar).not_to_have_attribute('aria-valuenow', '0')
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

    def test_compact_target_is_44px_but_resting_visual_stays_in_outer_gutter(self):
        for width in (320, 390, 640):
            with self.subTest(width=width):
                self.page.set_viewport_size({'width': width, 'height': 844})
                self.visit()
                rail = self.page.locator('.scroll-rail')
                expect(rail).to_have_attribute('data-interactive', 'true')
                expect(rail).to_have_attribute('data-compact', 'true')
                expect(self.control()).to_be_visible()
                values = self.page.evaluate('''() => {
                  const rail=document.querySelector('.scroll-rail');
                  const control=rail.querySelector('.scroll-rail__control');
                  const thumb=rail.querySelector('.scroll-rail__thumb');
                  const grip=rail.querySelector('.scroll-rail__grip');
                  const scroller=document.querySelector('#shell-scroll');
                  return {width:scroller.querySelector('.page').getBoundingClientRect().width,
                    gripWidth:thumb.getBoundingClientRect().width,gripHeight:thumb.getBoundingClientRect().height,
                    visual:grip.getBoundingClientRect().toJSON(),track:rail.querySelector('.scroll-rail__track').getBoundingClientRect().toJSON(),
                    surface:getComputedStyle(thumb).backgroundColor,shadow:getComputedStyle(grip).boxShadow,controlPointer:getComputedStyle(control).pointerEvents,
                    thumbPointer:getComputedStyle(thumb).pointerEvents,overflow:document.documentElement.scrollWidth,
                    viewport:innerWidth,right:innerWidth-rail.getBoundingClientRect().right};
                }''')
                self.assertEqual(values['gripWidth'], 44)
                self.assertEqual(values['gripHeight'], 44)
                self.assertEqual(values['surface'], 'rgba(0, 0, 0, 0)')
                self.assertLessEqual(values['visual']['width'], 12)
                self.assertGreaterEqual(values['visual']['left'], width - 16)
                self.assertGreaterEqual(values['track']['left'], width - 16)
                self.assertEqual(values['shadow'], 'none')
                self.assertEqual(values['controlPointer'], 'none')
                self.assertEqual(values['thumbPointer'], 'auto')
                self.assertGreaterEqual(values['right'], 8)
                self.assertGreaterEqual(values['width'], min(width, 640) - 1)
                self.assertLessEqual(values['overflow'], values['viewport'])
                self.assertEqual(self.page.locator('.scroll-rail__caption').count(), 0)

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

    def test_touch_grab_deforms_releases_and_keeps_native_swipe_elsewhere(self):
        touch = self.browser.new_context(viewport={'width': 390, 'height': 844},
                                         is_mobile=True, has_touch=True, service_workers='block')
        page = touch.new_page()
        try:
            page.goto(BASE + '/' + LESSON)
            expect(page.locator('.lesson')).to_be_visible()
            rail = page.locator('.scroll-rail')
            expect(rail).to_have_attribute('data-compact', 'true')
            client = touch.new_cdp_session(page)
            client.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': 160, 'y': 700}]})
            for y in (640, 580, 520, 460, 400):
                client.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': 160, 'y': y}]})
            client.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
            page.wait_for_function("document.querySelector('#shell-scroll').scrollTop > 100")
            page.evaluate("document.querySelector('#shell-scroll').scrollTo({top:400,behavior:'instant'})")
            page.wait_for_timeout(300)
            before = page.evaluate("document.querySelector('#shell-scroll').scrollTop")
            box = page.locator('.scroll-rail__thumb').bounding_box()
            x, y = box['x'] + 22, box['y'] + 22
            client.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': x, 'y': y}]})
            expect(rail).to_have_attribute('data-expanded', 'true')
            expect(rail).to_have_attribute('data-pressed', 'true')
            for dy in (10, 20, 35):
                client.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': x - 8, 'y': y + dy}]})
            expect(rail).to_have_attribute('data-dragging', 'true')
            self.assertGreater(page.evaluate("document.querySelector('#shell-scroll').scrollTop"), before + 100)
            client.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
            expect(rail).to_have_attribute('data-phase', 'release')
            self.assertIsNone(rail.get_attribute('data-dragging'))
            page.touchscreen.tap(160, 200)
            expect(rail).to_have_attribute('data-expanded', 'false')
        finally:
            touch.close()

    def test_touch_tap_opens_and_landmark_or_empty_track_have_distinct_feedback(self):
        self.page.set_viewport_size({'width': 390, 'height': 844})
        self.visit()
        rail = self.page.locator('.scroll-rail')
        self.page.locator('.scroll-rail__thumb').click()
        expect(rail).to_have_attribute('data-expanded', 'true')
        self.page.wait_for_timeout(400)
        self.assertLessEqual(self.page.locator('.scroll-rail__grip').bounding_box()['width'], 8)
        self.assertEqual(self.control().evaluate('(el)=>getComputedStyle(el).pointerEvents'), 'none')
        self.assertEqual(self.control().evaluate("(el)=>getComputedStyle(el,'::after').pointerEvents"), 'auto')
        self.assertEqual(self.control().evaluate("(el)=>getComputedStyle(el,'::after').width"), '16px')
        self.assertEqual(self.control().evaluate('(el)=>getComputedStyle(el).backgroundColor'), 'rgba(0, 0, 0, 0)')
        # Section stops jump to existing authored block offsets, not made-up pages.
        mark = self.page.locator('.scroll-rail__mark').last.bounding_box()
        self.page.mouse.click(mark['x'] + 3, mark['y'] + 3)
        expect(rail).to_have_attribute('data-action', 'stage')
        expect(rail).to_have_attribute('data-phase', 'jump')
        self.page.wait_for_function("document.querySelector('#shell-scroll').scrollTop > 100")
        self.page.wait_for_timeout(900)
        gap = self.page.evaluate('''() => {
          const rail=document.querySelector('.scroll-rail'),rect=rail.getBoundingClientRect();
          const thumb=rail.querySelector('.scroll-rail__thumb').getBoundingClientRect();
          const ys=[...rail.querySelectorAll('.scroll-rail__mark')].map(el=>el.getBoundingClientRect().y+2);
          for(let y=rect.y+24;y<rect.bottom-24;y+=2) {
            if(ys.every(v=>Math.abs(v-y)>21)&&(y<thumb.top||y>thumb.bottom)) return {x:rect.right-4,y};
          }
        }''')
        self.assertIsNotNone(gap)
        self.page.mouse.click(gap['x'], gap['y'])
        expect(rail).to_have_attribute('data-action', 'position')
        expect(rail).to_have_attribute('data-phase', 'jump')
        self.page.mouse.click(160, 200)
        expect(rail).to_have_attribute('data-expanded', 'false')

    def test_side_pinch_is_continuous_small_and_settles_without_scroll_lag(self):
        for width in (390, 1440):
            with self.subTest(width=width):
                self.page.set_viewport_size({'width': width, 'height': 1000})
                self.visit()
                self.control().press('PageDown')
                self.page.wait_for_timeout(400)
                before = self.scroll_top()
                grip = self.page.locator('.scroll-rail__grip')
                box = grip.bounding_box()
                x, y = box['x'] + box['width'] / 2, box['y'] + box['height'] / 2
                original_path = self.page.locator('.scroll-rail__track').get_attribute('d')
                self.page.mouse.move(x, y)
                self.page.mouse.down()
                self.page.mouse.move(x - 20, y)
                self.page.wait_for_timeout(100)
                first = float(self.page.locator('.scroll-rail').evaluate("el=>el.style.getPropertyValue('--rail-pull')"))
                self.assertGreater(first, 3)
                self.assertLess(first, 14.01)
                self.assertAlmostEqual(self.scroll_top(), before, delta=2)
                self.assertNotEqual(self.page.locator('.scroll-rail__track').get_attribute('d'), original_path)
                self.assertLessEqual(grip.bounding_box()['width'], 8.1)
                self.page.wait_for_timeout(100)
                held = float(self.page.locator('.scroll-rail').evaluate("el=>el.style.getPropertyValue('--rail-pull')"))
                self.assertGreaterEqual(held, first)
                self.page.wait_for_timeout(180)
                self.assertGreaterEqual(grip.bounding_box()['width'], 7.8)
                self.page.mouse.up()
                self.page.wait_for_timeout(60)
                released = float(self.page.locator('.scroll-rail').evaluate("el=>el.style.getPropertyValue('--rail-pull')"))
                self.assertGreater(released, .1)
                self.assertLess(released, held)
                self.page.wait_for_function("!document.querySelector('.scroll-rail').dataset.deforming")
                self.assertEqual(self.page.locator('.scroll-rail').evaluate("el=>el.style.getPropertyValue('--rail-pull')"), '0.000')
                self.assertAlmostEqual(self.scroll_top(), before, delta=2)
                # No idle animation or repeating rail timeline remains after release.
                self.assertEqual(self.page.locator('.scroll-rail').evaluate("el=>el.getAnimations({subtree:true}).filter(a=>a.playState==='running').length"), 0)
                self.assertEqual(self.page.locator('.scroll-rail__pulse').count(), 0)
                # Let go before the press deformation has finished: return must
                # start from the painted intermediate value, never a full bow.
                box = grip.bounding_box()
                self.page.mouse.move(box['x'] + box['width'] / 2, box['y'] + box['height'] / 2)
                self.page.mouse.down()
                self.page.wait_for_timeout(35)
                early = float(self.page.locator('.scroll-rail').evaluate("el=>el.style.getPropertyValue('--rail-pull')"))
                self.assertGreater(early, 0)
                self.assertLess(early, 5)
                self.page.mouse.up()
                self.page.wait_for_timeout(35)
                early_return = float(self.page.locator('.scroll-rail').evaluate("el=>el.style.getPropertyValue('--rail-pull')"))
                self.assertLess(early_return, early + .2)
                self.page.wait_for_function("!document.querySelector('.scroll-rail').dataset.deforming")
                self.page.emulate_media(reduced_motion='reduce')
                box = grip.bounding_box()
                self.page.mouse.move(box['x'] + box['width'] / 2, box['y'] + box['height'] / 2)
                self.page.mouse.down()
                self.page.mouse.move(box['x'] - 16, box['y'] + box['height'] / 2)
                self.page.wait_for_timeout(80)
                self.assertEqual(self.page.locator('.scroll-rail').evaluate("el=>el.style.getPropertyValue('--rail-pull')"), '0.000')
                self.page.mouse.up()
                self.page.emulate_media(reduced_motion='no-preference')

    def test_multitouch_cancels_drag_without_preventing_second_pointer(self):
        touch = self.browser.new_context(viewport={'width': 390, 'height': 844},
                                         is_mobile=True, has_touch=True, service_workers='block')
        page = touch.new_page()
        try:
            page.goto(BASE + '/' + LESSON)
            expect(page.locator('.lesson')).to_be_visible()
            expect(page.locator('.scroll-rail')).to_have_attribute('data-interactive', 'true')
            expect(page.locator('.scroll-rail__thumb')).to_be_visible()
            page.evaluate("() => document.fonts.ready.then(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))))")
            client = touch.new_cdp_session(page)
            thumb = page.locator('.scroll-rail__thumb').bounding_box()
            x, y = thumb['x'] + 22, thumb['y'] + 22
            client.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'id': 1, 'x': x, 'y': y}]})
            client.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'id': 1, 'x': x, 'y': y + 35}]})
            expect(page.locator('.scroll-rail')).to_have_attribute('data-dragging', 'true')
            client.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [
                {'id': 1, 'x': x, 'y': y + 35}, {'id': 2, 'x': 160, 'y': 300}]})
            self.assertIsNone(page.locator('.scroll-rail').get_attribute('data-dragging'))
            expect(page.locator('.scroll-rail')).to_have_attribute('data-expanded', 'false')
            self.assertAlmostEqual(page.evaluate("document.querySelector('#shell-scroll').scrollTop"), 0, delta=2)
            client.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
        finally:
            touch.close()

    def test_about_landmarks_have_no_captions_keyboard_stages_and_destroy_cleanup(self):
        self.visit('about/')
        bar = self.control()
        expect(bar).to_be_visible()
        self.assertLessEqual(self.page.locator('.scroll-rail__mark').count(), 6)
        bar.focus()
        self.assertEqual(self.page.locator('.scroll-rail__caption').count(), 0)
        bar.press('Shift+ArrowDown')
        self.page.wait_for_function('window.scrollY > 100')
        expect(self.page.locator('.scroll-rail')).to_have_attribute('data-action', 'stage')
        bar.press('End')
        expect(bar).to_have_attribute('aria-valuenow', '100')
        self.page.set_viewport_size({'width': 390, 'height': 844})
        expect(self.page.locator('.scroll-rail')).to_have_attribute('data-compact', 'true')
        bar.focus()
        bar.press('ArrowUp')
        expect(self.page.locator('.scroll-rail')).to_have_attribute('data-expanded', 'true')
        bar.press('Escape')
        expect(self.page.locator('.scroll-rail')).to_have_attribute('data-expanded', 'false')
        self.page.evaluate('window.__rail.destroy()')
        self.assertEqual(self.page.locator('.scroll-rail').count(), 0)
        self.assertEqual(self.page.locator('[data-scroll-rail-enhanced]').count(), 0)
        self.page.evaluate('window.scrollTo({top:0,behavior:"instant"})')
        self.assertEqual(self.scroll_top(), 0)

    def test_about_desktop_rail_uses_real_gutter_and_never_covers_folio(self):
        for width in (700, 1024, 1200, 1440):
            with self.subTest(width=width):
                self.page.set_viewport_size({'width': width, 'height': 1000})
                self.visit('about/')
                expect(self.page.locator('.scroll-rail')).to_have_attribute('data-compact', 'false')
                rect = self.page.evaluate('''() => {
                  const rail=document.querySelector('.scroll-rail').getBoundingClientRect();
                  const folio=document.querySelector('#study-folio').getBoundingClientRect();
                  const frames=[...document.querySelectorAll('main .about-frame')];
                  const edge=Math.max(...frames.map(el=>el.getBoundingClientRect().right-parseFloat(getComputedStyle(el).paddingRight)));
                  return {railLeft:rail.left,folioRight:folio.right,contentEdge:edge,width:rail.width};
                }''')
                self.assertGreaterEqual(rect['railLeft'] - rect['folioRight'], 8)
                self.assertGreaterEqual(rect['railLeft'] - rect['contentEdge'], 8)
                self.assertEqual(rect['width'], 44)

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
