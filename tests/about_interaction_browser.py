#!/usr/bin/env python3
"""About story, real media, pointer lifecycle, motion preferences and editing."""
import argparse
from pathlib import Path
import unittest
from playwright.sync_api import expect, sync_playwright

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base-url', default='http://127.0.0.1:8012/english-prep')
parser.add_argument('--browser-path', default='/usr/bin/chromium')
ARGS, TEST_ARGS = parser.parse_known_args()
BASE = ARGS.base_url.rstrip('/')


class AboutInteractionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        cls.browser = cls.pw.chromium.launch(executable_path=ARGS.browser_path, args=['--no-sandbox'])

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()

    def setUp(self):
        self.context = self.browser.new_context(viewport={'width': 1440, 'height': 1000}, service_workers='block')
        self.page = self.context.new_page()
        self.page.set_default_timeout(8000)
        self.errors = []
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [])

    def open(self):
        self.page.goto(BASE + '/about/')
        expect(self.page.locator('[data-study-stage]')).to_have_count(3)

    def test_study_choices_are_real_actions_and_keep_keyboard_focus(self):
        self.open()
        expect(self.page.locator('#tour-screen-controls, #tour-viewport-controls, .about-tour-figure')).to_have_count(0)
        for stage, capture, title in [
            ('apply', 'test', 'Bir seçeneğin ötesine geç.'),
            ('return', 'results', 'Sonucu bir sonraki adıma bağla.'),
            ('read', 'article', 'Kulağına doğru gelenin nedenini bul.'),
        ]:
            control = self.page.locator(f'[data-study-stage="{stage}"]')
            control.focus()
            control.press('Enter')
            expect(control).to_be_focused()
            expect(control).to_have_attribute('aria-pressed', 'true')
            expect(self.page.locator('[data-study-stage][aria-pressed="true"]')).to_have_count(1)
            expect(self.page.locator('#study-title')).to_have_text(title)
            expect(self.page.locator('#study-image')).to_have_attribute('src', f'assets/{capture}-phone.webp')
            expect(self.page.locator('#study-wide-source')).to_have_attribute('srcset', f'assets/{capture}-wide.webp')
            self.assertIn(BASE + '/index.html#', self.page.locator('#study-action').evaluate('(e) => e.href'))
            self.page.wait_for_function('(capture) => document.querySelector("#study-image").currentSrc.endsWith(capture + "-wide.webp") && document.querySelector("#study-image").complete', arg=capture)

    def test_architecture_choices_explain_actual_layers(self):
        self.open()
        button = self.page.locator('[data-architecture="continuity"]')
        button.focus()
        button.press('Space')
        expect(button).to_be_focused()
        expect(button).to_have_attribute('aria-pressed', 'true')
        expect(self.page.locator('#architecture-title')).to_have_text('Kaldığın yerin de bir mimarisi var.')
        expect(self.page.locator('#architecture-body')).to_contain_text('localStorage')
        expect(self.page.locator('#architecture-detail')).to_contain_text('Otomatik cihaz eşitlemesi yok')
        expect(self.page.locator('#architecture-action')).to_have_attribute('href', 'https://github.com/ErenDenizK/english-prep/blob/test/js/storage.js')

    def test_pointer_is_bounded_event_driven_and_does_not_move_copy(self):
        self.open()
        self.page.wait_for_timeout(450)
        self.page.evaluate('''() => {
          window.__frames = 0;
          const original = window.requestAnimationFrame;
          window.requestAnimationFrame = function(callback) { window.__frames++; return original.call(this, callback); };
        }''')
        text_before = self.page.locator('#title').bounding_box()
        box = self.page.locator('.about-hero-visual').bounding_box()
        self.page.mouse.move(box['x'] + box['width'] * .96, box['y'] + box['height'] * .08)
        expect(self.page.locator('.about-hero-scene')).to_have_attribute('data-scene-active', 'true')
        values = self.page.locator('.about-hero-scene').evaluate('''e => ['rotate-x','rotate-y','shift-x','shift-y'].map(key => parseFloat(e.style.getPropertyValue('--scene-' + key)))''')
        self.assertTrue(all(abs(value) <= 2 for value in values[:2]), values)
        self.assertTrue(all(abs(value) <= 6 for value in values[2:]), values)
        self.assertEqual(text_before, self.page.locator('#title').bounding_box())
        self.page.wait_for_timeout(250)
        frames = self.page.evaluate('window.__frames')
        self.assertGreater(frames, 0)
        self.page.wait_for_timeout(250)
        self.assertEqual(frames, self.page.evaluate('window.__frames'), 'Pointer scene must not run an idle rAF loop')
        self.page.mouse.move(4, 4)
        expect(self.page.locator('.about-hero-scene')).to_have_attribute('data-scene-active', 'false')
        self.assertEqual(self.page.locator('.about-hero-scene').evaluate('e => e.style.getPropertyValue("--scene-shift-x")'), '0px')

    def test_footer_preference_persists_and_stops_decoration(self):
        self.open()
        expect(self.page.locator('header [data-motion-control]')).to_have_count(0)
        toggle = self.page.locator('footer [data-motion-control]')
        expect(toggle).to_have_count(1)
        toggle.click()
        expect(self.page.locator('html')).to_have_attribute('data-motion', 'off')
        self.assertEqual(self.page.evaluate('localStorage.getItem("englishPrep.motion")'), 'off')
        self.page.reload()
        expect(self.page.locator('html')).to_have_attribute('data-motion', 'off')
        self.page.locator('[data-study-stage="apply"]').click()
        self.assertEqual(self.page.locator('.about-study-art').evaluate('e => e.getAnimations().length'), 0)
        self.page.emulate_media(reduced_motion='reduce')
        expect(self.page.locator('footer [data-motion-control]')).to_have_attribute('aria-disabled', 'true')

    def test_responsive_media_and_no_overflow_across_supported_widths(self):
        for width in [320, 390, 768, 1440]:
            with self.subTest(width=width):
                self.page.set_viewport_size({'width': width, 'height': 900})
                self.open()
                source = 'article-phone.webp' if width < 700 else 'article-wide.webp'
                self.page.locator('#study-image').scroll_into_view_if_needed()
                self.page.wait_for_function('(source) => {const i=document.querySelector("#study-image"); return i.currentSrc.endsWith(source) && i.complete && i.naturalWidth > 0}', arg=source)
                self.assertLessEqual(self.page.evaluate('document.documentElement.scrollWidth-innerWidth'), 1)
                self.assertEqual(self.page.locator('#study-image').get_attribute('alt'), 'Present Perfect ve Past Simple ayrımını anlatan gerçek makale dersi')
        self.page.set_viewport_size({'width': 320, 'height': 900})
        self.page.add_style_tag(content='html { font-size: 200% !important; }')
        self.assertLessEqual(self.page.evaluate('document.documentElement.scrollWidth-innerWidth'), 1)

    def test_touch_does_not_require_or_trigger_pointer_effects(self):
        touch = self.browser.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True, service_workers='block')
        try:
            page = touch.new_page()
            page.goto(BASE + '/about/')
            expect(page.locator('[data-study-stage]')).to_have_count(3)
            page.locator('.about-hero-visual').dispatch_event('pointermove', {'pointerType': 'touch', 'clientX': 250, 'clientY': 350})
            expect(page.locator('.about-hero-scene')).to_have_attribute('data-scene-active', 'false')
            page.locator('[data-study-stage="apply"]').tap()
            expect(page.locator('#study-title')).to_have_text('Bir seçeneğin ötesine geç.')
        finally:
            touch.close()

    def test_authored_long_additions_reflow_without_renderer_changes(self):
        source = (Path(__file__).parents[1] / 'about/content.js').read_text()
        additions = '''
        studyStages.push({...studyStages[0], id:'extra', label:'Ek çalışma adımı ve daha uzun başlığı', title:'Daha uzun bir başlık yeni bir düzen gerektirmeden yerini bulur.', body:'Düzenlenebilir uzun açıklama. '.repeat(12)});
        everydayFeatures.items.push({label:'Yeni özellik',title:'Daha uzun ve ayrıntılı bir özellik başlığı',body:'Açıklama. '.repeat(25),icon:'book'});
        extraSections.push({eyebrow:'Ek bölüm',title:'Sonradan eklenen bölüm',intro:'Düzenlenebilir giriş.',items:[{title:'Yeni parça',body:'Ek açıklama.'}]});
        '''
        self.page.route('**/about/content.js', lambda route: route.fulfill(status=200, content_type='text/javascript', body=source + additions))
        self.page.set_viewport_size({'width': 320, 'height': 900})
        self.page.goto(BASE + '/about/')
        expect(self.page.locator('[data-study-stage]')).to_have_count(4)
        self.page.locator('[data-study-stage="extra"]').click()
        expect(self.page.locator('#study-title')).to_have_text('Daha uzun bir başlık yeni bir düzen gerektirmeden yerini bulur.')
        expect(self.page.locator('#feature-list article')).to_have_count(9)
        expect(self.page.locator('#extra-sections h2')).to_have_text('Sonradan eklenen bölüm')
        self.assertLessEqual(self.page.evaluate('document.documentElement.scrollWidth-innerWidth'), 1)


if __name__ == '__main__':
    unittest.main(argv=['about_interaction_browser.py'] + TEST_ARGS)
