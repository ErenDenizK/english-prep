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

    def test_folio_turns_inspects_and_returns_to_front_with_keyboard(self):
        self.open()
        tabs = self.page.locator('#folio-tabs')
        read = tabs.locator('[data-folio-chapter="read"]')
        read.focus()
        read.press('ArrowRight')
        selected = tabs.locator('[data-folio-chapter="apply"]')
        expect(selected).to_be_focused()
        expect(selected).to_have_attribute('aria-pressed', 'true')
        expect(self.page.locator('#folio-heading')).to_have_text('Sezgini yokla.')
        expect(self.page.locator('#folio-action')).to_have_attribute('href', '../index.html#test')
        expect(self.page.locator('.folio-leaf[data-active="true"]')).to_have_count(1)
        expect(self.page.locator('[data-folio-leaf="apply"]')).to_have_attribute('data-active', 'true')
        selected.press('End')
        expect(tabs.locator('[data-folio-chapter="return"]')).to_be_focused()
        inspect = self.page.locator('#folio-inspect')
        inspect.focus()
        inspect.press('Space')
        expect(inspect).to_be_focused()
        expect(self.page.locator('#folio-deck')).to_have_attribute('data-expanded', 'true')
        expect(self.page.locator('.folio-leaf-face[tabindex="0"]')).to_have_count(3)
        face = self.page.locator('[data-folio-face="read"]')
        face.focus()
        face.press('Enter')
        expect(face).to_be_focused()
        expect(self.page.locator('#study-folio')).to_have_attribute('data-chapter', 'read')
        rotate = self.page.locator('#folio-rotate')
        rotate.focus()
        rotate.press('Enter')
        expect(self.page.locator('#folio-deck')).to_have_attribute('data-view', 'angle')
        expect(rotate).to_have_text('↻Öne dön')
        rotate.press('Enter')
        expect(self.page.locator('#folio-deck')).to_have_attribute('data-view', 'front')
        inspect.click()
        expect(self.page.locator('.folio-leaf-face[tabindex="0"]')).to_have_count(1)
        expect(self.page.locator('#folio-deck')).to_have_attribute('data-expanded', 'false')

    def test_folio_drag_is_bounded_cancelable_and_does_not_move_copy(self):
        self.open()
        stage = self.page.locator('#folio-stage')
        stage.scroll_into_view_if_needed()
        self.page.wait_for_timeout(1300)
        heading = self.page.locator('#folio-heading').bounding_box()
        box = stage.bounding_box()
        x, y = box['x'] + box['width'] * .65, box['y'] + box['height'] * .5
        self.page.mouse.move(x, y)
        self.page.mouse.down()
        self.page.mouse.move(x - 110, y + 12, steps=8)
        expect(self.page.locator('#folio-deck')).to_have_attribute('data-dragging', 'true')
        angle = self.page.locator('#folio-deck').evaluate('e=>parseFloat(e.style.getPropertyValue("--folio-drag-y"))')
        self.assertLessEqual(abs(angle), 16)
        self.assertGreater(abs(angle), 5)
        self.assertEqual(heading, self.page.locator('#folio-heading').bounding_box())
        self.page.mouse.up()
        expect(self.page.locator('#study-folio')).to_have_attribute('data-chapter', 'apply')
        expect(self.page.locator('#folio-deck')).to_have_attribute('data-dragging', 'false')
        self.page.mouse.move(x, y)
        self.page.mouse.down()
        self.page.mouse.move(x - 70, y, steps=5)
        self.page.evaluate("window.dispatchEvent(new Event('blur'))")
        expect(self.page.locator('#folio-deck')).to_have_attribute('data-dragging', 'false')
        self.page.mouse.up()
        expect(self.page.locator('#study-folio')).to_have_attribute('data-chapter', 'apply')

    def test_folio_reduced_motion_is_complete_and_never_writes_learning_data(self):
        self.page.emulate_media(reduced_motion='reduce')
        self.open()
        before = self.page.evaluate('JSON.stringify({...localStorage})')
        self.page.locator('[data-folio-chapter="apply"]').click()
        self.page.locator('#folio-inspect').click()
        self.page.locator('#folio-rotate').click()
        expect(self.page.locator('#folio-deck')).to_have_attribute('data-view', 'angle')
        expect(self.page.locator('#folio-deck')).to_have_attribute('data-expanded', 'true')
        expect(self.page.locator('#folio-heading')).to_have_text('Sezgini yokla.')
        self.assertEqual(self.page.locator('#study-folio').evaluate('e=>e.getAnimations({subtree:true}).length'), 0)
        self.assertEqual(before, self.page.evaluate('JSON.stringify({...localStorage})'))

    def test_motion_preference_lives_only_in_settings_and_is_respected_here(self):
        self.open()
        expect(self.page.locator('[data-motion-control]')).to_have_count(0)
        expect(self.page.locator('.about-motion-settings a')).to_have_attribute('href', '../index.html#profil')
        self.page.evaluate('localStorage.setItem("englishPrep.motion", "off")')
        self.page.reload()
        expect(self.page.locator('html')).to_have_attribute('data-motion', 'off')
        self.page.locator('[data-study-stage="apply"]').click()
        self.assertEqual(self.page.locator('.about-study-art').evaluate('e => e.getAnimations({subtree:true}).length'), 0)
        self.page.evaluate('localStorage.removeItem("englishPrep.motion")')
        self.page.emulate_media(reduced_motion='reduce')
        self.page.reload()
        expect(self.page.locator('html')).to_have_attribute('data-motion', 'off')
        self.page.locator('[data-architecture="continuity"]').click()
        self.assertEqual(self.page.locator('.about-architecture-art').evaluate('e => e.getAnimations({subtree:true}).length'), 0)
        expect(self.page.locator('#architecture-body')).to_contain_text('sessionStorage')

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
        launch = self.page.locator('.about-header-actions a').bounding_box()
        self.assertLess(launch['height'], 100, 'Enlarged masthead action must wrap as a whole row, not single characters')
        self.assertLessEqual(launch['x'] + launch['width'], 320)

    def test_touch_does_not_require_or_trigger_pointer_effects(self):
        touch = self.browser.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True, service_workers='block')
        try:
            page = touch.new_page()
            page.goto(BASE + '/about/')
            expect(page.locator('[data-study-stage]')).to_have_count(3)
            self.assertEqual(page.locator('#folio-stage').evaluate('e=>getComputedStyle(e).touchAction'), 'pan-y pinch-zoom')
            page.locator('[data-folio-chapter="apply"]').tap()
            expect(page.locator('#folio-heading')).to_have_text('Sezgini yokla.')
            page.locator('#folio-inspect').tap()
            expect(page.locator('#folio-deck')).to_have_attribute('data-expanded', 'true')
            page.locator('[data-study-stage="apply"]').tap()
            expect(page.locator('#study-title')).to_have_text('Bir seçeneğin ötesine geç.')
        finally:
            touch.close()

    def test_mobile_story_and_feature_density_preserve_readable_copy(self):
        self.page.set_viewport_size({'width': 390, 'height': 844})
        self.open()
        self.page.wait_for_timeout(1200)
        study = self.page.locator('#urun').bounding_box()
        features = self.page.locator('#ozellikler').bounding_box()
        self.assertLess(study['height'], 1300)
        self.assertLess(features['height'], 1450)
        image = self.page.locator('.about-study-art').bounding_box()
        copy = self.page.locator('.about-study-copy').bounding_box()
        self.assertLess(image['y'], copy['y'], 'The selected visual should be next to its controls on phones')
        self.assertGreaterEqual(float(self.page.locator('#study-description').evaluate('e => parseFloat(getComputedStyle(e).fontSize)')), 16)
        for button in self.page.locator('[data-study-stage]').all():
            self.assertGreaterEqual(button.bounding_box()['height'], 44)
        first = self.page.locator('#feature-list details').first
        expect(first).to_have_attribute('open', '')
        feature = self.page.locator('#feature-list details').nth(2)
        summary = feature.locator('summary')
        summary.focus()
        summary.press('Enter')
        expect(summary).to_be_focused()
        expect(feature.locator('.about-feature-body')).to_be_visible()
        expect(feature.locator('.about-feature-body')).to_contain_text('Diğer cihazda geri yükleyerek')
        expect(feature.locator('.about-feature-body')).to_contain_text('Otomatik eşitleme yok.')
        self.assertGreater(feature.locator('.about-feature-body').evaluate('e => e.getAnimations().length'), 0)
        self.assertEqual(feature.locator('.about-feature-label').evaluate('e => e.getAnimations().length'), 0)
        summary.press('Space')
        expect(feature).not_to_have_attribute('open', '')

    def test_native_disclosure_closes_semantically_before_height_settles(self):
        self.page.set_viewport_size({'width': 390, 'height': 844})
        self.open()
        feature = self.page.locator('#feature-list details').nth(2)
        summary = feature.locator('summary')
        summary.click()
        self.page.wait_for_timeout(650)
        height = feature.evaluate('e=>parseFloat(getComputedStyle(e,"::details-content").height)')
        summary.click()
        expect(feature).not_to_have_attribute('open', '')
        if self.page.evaluate('CSS.supports("interpolate-size", "allow-keywords")'):
            self.page.wait_for_function("""(height) => {
              const value = parseFloat(getComputedStyle(document.querySelectorAll('#feature-list details')[2], '::details-content').height);
              return value > 0 && value < height;
            }""", arg=height)
            closing = feature.evaluate('e=>parseFloat(getComputedStyle(e,"::details-content").height)')
            self.assertGreater(closing, 0)
            self.assertLess(closing, height)
            self.page.wait_for_function("""() => parseFloat(getComputedStyle(document.querySelectorAll('#feature-list details')[2], '::details-content').height) === 0""")
        summary.focus()
        summary.press('Enter')
        expect(summary).to_be_focused()
        expect(feature).to_have_attribute('open', '')

    def test_story_motion_waits_for_pixels_and_latest_selection_wins(self):
        self.page.add_init_script("""(() => {
          const decode = HTMLImageElement.prototype.decode;
          HTMLImageElement.prototype.decode = function() {
            if (this.id === 'study-image' && this.getAttribute('src').includes('test-phone')) {
              return new Promise(resolve => { window.__releaseStudy = () => decode.call(this).catch(() => {}).then(resolve); });
            }
            return decode.call(this);
          };
        })()""")
        self.open()
        self.page.locator('.about-study-image-frame').scroll_into_view_if_needed()
        self.page.wait_for_timeout(1500)
        self.page.evaluate("""() => {
          for (const stage of ['apply', 'return', 'read', 'apply'])
            document.querySelector(`[data-study-stage="${stage}"]`).click();
        }""")
        expect(self.page.locator('#study-image')).to_have_attribute('src', 'assets/test-phone.webp')
        expect(self.page.locator('#study-title')).to_have_text('Bir seçeneğin ötesine geç.')
        self.page.wait_for_timeout(250)
        self.assertEqual(self.page.locator('.about-study-image-frame').evaluate('e=>e.getAnimations().filter(a=>a.effect.getKeyframes().some(k=>k.transform)).length'), 0)
        self.page.evaluate('window.__releaseStudy()')
        self.page.wait_for_function("document.querySelector('.about-study-image-frame').getAnimations().filter(a=>a.effect.getKeyframes().some(k=>k.transform)).length === 1")
        durations = self.page.locator('.about-study-image-frame').evaluate('e=>e.getAnimations().filter(a=>a.effect.getKeyframes().some(k=>k.transform)).map(a=>a.effect.getTiming().duration)')
        self.assertTrue(all(1000 <= duration <= 1400 for duration in durations), durations)
        self.page.emulate_media(reduced_motion='reduce')
        expect(self.page.locator('html')).to_have_attribute('data-motion', 'off')
        self.assertEqual(self.page.evaluate('document.getAnimations().filter(a=>Number.isFinite(a.effect.getComputedTiming().endTime)).length'), 0)
        expect(self.page.locator('#study-action')).to_have_attribute('href', '../index.html#test')

    def test_chapter_rail_stays_inside_one_scene_and_repeat_click_has_a_glyph_cue(self):
        self.page.set_viewport_size({'width': 390, 'height': 844})
        self.open()
        expect(self.page.locator('.about-study-theatre #study-controls')).to_have_count(1)
        expect(self.page.locator('.about-study-theatre #study-scene')).to_have_count(1)
        expect(self.page.locator('.about-architecture-board #architecture-controls')).to_have_count(1)
        self.page.locator('[data-study-stage="apply"]').click()
        self.page.wait_for_timeout(1400)
        self.page.locator('[data-study-stage="apply"]').click()
        self.assertGreater(self.page.locator('[data-study-stage="apply"] svg').evaluate('e=>e.getAnimations().length'), 0)
        positions = self.page.evaluate("""() => {
          const controls=document.querySelector('#study-controls');
          const selected=controls.querySelector('[aria-pressed="true"]');
          const ink=controls.querySelector('.about-selection-ink');
          return {selected:selected.offsetLeft, transform:ink.style.transform, width:parseFloat(ink.style.width), expected:selected.offsetWidth};
        }""")
        self.assertEqual(positions['width'], positions['expected'])
        self.assertTrue(positions['transform'].startswith(f"translate({positions['selected']}px,"), positions)

    def test_artwork_entry_waits_for_the_artwork_to_enter_the_viewport(self):
        self.open()
        frame = self.page.locator('.about-study-image-frame')
        self.assertEqual(frame.evaluate('e=>e.getAnimations().length'), 0)
        frame.evaluate('e=>e.scrollIntoView({block:"center"})')
        self.page.wait_for_function("document.querySelector('.about-study-image-frame').getAnimations().some(a => a.effect.getTiming().duration >= 800)")
        self.page.wait_for_timeout(1450)
        self.assertEqual(frame.evaluate('e=>e.getAnimations().length'), 0)
        frame.evaluate('e=>e.scrollIntoView({block:"center"})')
        self.page.wait_for_timeout(100)
        self.assertEqual(frame.evaluate('e=>e.getAnimations().length'), 0, 'One visible scene must not replay on ordinary scrolling')

    def test_custom_architecture_marks_follow_real_selection_and_reduce_motion(self):
        self.open()
        self.page.locator('[data-architecture="interface"]').click()
        expect(self.page.locator('[data-layer="interface"]')).to_have_attribute('data-active', 'true')
        expect(self.page.locator('[data-layer][data-active="true"]')).to_have_count(1)
        self.page.emulate_media(reduced_motion='reduce')
        self.page.locator('[data-architecture="continuity"]').click()
        expect(self.page.locator('[data-layer="continuity"]')).to_have_attribute('data-active', 'true')
        self.assertEqual(self.page.locator('.about-architecture-art').evaluate('e=>e.getAnimations({subtree:true}).length'), 0)
        expect(self.page.locator('#architecture-body')).to_contain_text('sessionStorage')

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
