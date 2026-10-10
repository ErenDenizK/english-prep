#!/usr/bin/env python3
"""Optional-tour geometry and finite-motion checks against a static server.

The existing reading_system.py covers navigation, optional name, keyboard
scene selection and storage isolation. These checks cover rendering concerns
that its reduced-motion-only context cannot observe.
"""
import unittest
from playwright.sync_api import expect, sync_playwright

from _harness import launch_chromium, make_parser

parser = make_parser(__doc__)
ARGS, TEST_ARGS = parser.parse_known_args()
BASE = ARGS.base_url.rstrip('/')


class OnboardingInteractionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        cls.browser = launch_chromium(cls.pw, ARGS)

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()

    def setUp(self):
        self.context = self.browser.new_context(viewport={'width': 390, 'height': 844}, color_scheme='dark')
        self.page = self.context.new_page()
        self.page.set_default_timeout(8000)
        self.errors = []
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [])

    def open_tour(self):
        self.page.goto('about:blank')
        self.page.goto(BASE + '/index.html#hosgeldin')
        expect(self.page.locator('.onboard-flow__choices')).to_be_visible()
        self.page.evaluate('document.fonts.ready')

    def assert_no_overflow(self):
        overflow = self.page.locator('#onboard-container').evaluate('''root =>
          [...root.querySelectorAll('*')].filter(e => {
            const r = e.getBoundingClientRect();
            return r.width && (r.left < -.5 || r.right > innerWidth + .5);
          }).map(e => e.className.baseVal || e.className)
        ''')
        self.assertEqual(overflow, [])

    def decorative_animations(self):
        return self.page.locator('#onboard-container').evaluate('''root =>
          root.getAnimations({subtree: true}).filter(a => a.playState === 'running')
            .map(a => ({name:a.animationName || '', duration:a.effect.getTiming().duration,
              delay:a.effect.getTiming().delay, iterations:a.effect.getTiming().iterations}))
        ''')

    def wait_for_art_motion(self):
        self.page.wait_for_function("""() => {
          const root = document.querySelector('.onboard-flow__scene');
          return root && root.getAnimations({subtree:true}).some(a => a.playState === 'running');
        }""")

    def test_scenes_keep_action_geometry_stable_at_mobile_and_desktop_widths(self):
        self.page.emulate_media(reduced_motion='reduce')
        for width, height in [(320, 568), (390, 844), (768, 1024), (1440, 900)]:
            with self.subTest(width=width):
                self.page.set_viewport_size({'width': width, 'height': height})
                self.open_tour()
                for tour_step in range(3):
                    self.assert_no_overflow()
                    expect(self.page.locator('.onboard__top [data-motion-control]')).to_have_count(0)
                    targets = self.page.locator('#onboard-container button:visible').evaluate_all('''buttons =>
                      buttons.map(b => ({text:b.textContent.trim(), height:b.getBoundingClientRect().height,
                        width:b.getBoundingClientRect().width}))
                    ''')
                    for target in targets:
                        self.assertGreaterEqual(target['height'], 44, target)
                        self.assertGreaterEqual(target['width'], 44, target)
                    if tour_step < 2:
                        positions = []
                        for scene in range(3):
                            self.page.locator('.onboard-flow__choice').nth(scene).evaluate('(button) => button.click()')
                            positions.append(self.page.locator('.onboard__actions').evaluate('''actions =>
                              actions.getBoundingClientRect().top - document.querySelector('.onboard__tour').getBoundingClientRect().top
                            '''))
                        self.assertLessEqual(max(positions) - min(positions), .5)
                        self.page.locator('.onboard__actions .btn--primary').click()
                self.page.get_by_role('button', name='Uygulamayı aç', exact=True).click()
                expect(self.page.locator('#index-filter')).to_be_visible()

    def test_200_percent_text_keeps_every_page_and_primary_action_reachable(self):
        self.page.set_viewport_size({'width': 320, 'height': 568})
        self.page.emulate_media(reduced_motion='reduce')
        self.open_tour()
        self.page.add_style_tag(content='html { font-size: 200% !important; }')
        for step in range(3):
            with self.subTest(step=step):
                self.assert_no_overflow()
                self.page.locator('.onboard__actions .btn--primary').click()
        expect(self.page.locator('#index-filter')).to_be_visible()

    def test_scene_animation_is_finite_interruptible_and_never_delays_the_choice(self):
        self.open_tour()
        self.page.locator('.onboard-flow__choice').nth(1).click()
        expect(self.page.locator('.onboard-flow')).to_have_attribute('data-scene', 'article')
        self.wait_for_art_motion()
        self.assertTrue(self.decorative_animations())
        for animation in self.decorative_animations():
            self.assertLessEqual(animation['duration'] + animation['delay'], 1280)
            self.assertEqual(animation['iterations'], 1)
        self.page.locator('.onboard-flow__choices').evaluate('''group => {
          const choices = group.querySelectorAll('button');
          choices[2].click(); choices[0].click(); choices[1].click();
        }''')
        expect(self.page.locator('.onboard-flow')).to_have_attribute('data-scene', 'article')
        expect(self.page.locator('.onboard-flow__drawing')).to_have_count(1)
        self.page.evaluate('''async () => {
          const {setMotionEnabled} = await import('./js/motion.js');
          setMotionEnabled(false);
        }''')
        self.assertEqual(self.decorative_animations(), [])
        self.page.locator('.onboard-flow__choice').nth(2).click()
        expect(self.page.locator('.onboard-flow')).to_have_attribute('data-scene', 'check')
        self.assertEqual(self.decorative_animations(), [])

    def test_initial_entry_has_articulated_motion_and_page_navigation_interrupts_it(self):
        self.open_tour()
        self.wait_for_art_motion()
        animations = self.decorative_animations()
        self.assertGreaterEqual(len(animations), 4)
        self.assertGreaterEqual(max(a['duration'] + a['delay'] for a in animations), 700)
        self.assertGreaterEqual(len({a['delay'] for a in animations}), 3)
        self.page.evaluate('''() => {
          window.previousOnboardAnimations = document.querySelector('.onboard__panel').getAnimations({subtree:true});
          document.querySelector('.onboard__actions .btn--primary').click();
        }''')
        expect(self.page.locator('#onboard-step-title')).to_have_text('Cevabı seç. Nedenini öğren.')
        expect(self.page.locator('#onboard-step-title')).to_be_focused()
        self.assertTrue(self.page.evaluate('previousOnboardAnimations.every(a => a.playState === "idle")'))
        self.wait_for_art_motion()
        self.assertTrue(self.decorative_animations())
        # Immediate back must reverse the new presentation, not enqueue work.
        self.page.locator('.onboard__actions .btn--quiet').evaluate('(button) => button.click()')
        expect(self.page.locator('#onboard-step-title')).to_have_text('Bildiğin İngilizceyi netleştir.')
        self.page.get_by_role('button', name='Tanıtımı geç', exact=True).click()
        expect(self.page.locator('#index-filter')).to_be_visible()

    def test_every_scene_settles_and_the_closing_brand_never_delays_name_input(self):
        self.open_tour()
        for step in range(2):
            for scene in range(3):
                self.page.locator('.onboard-flow__choice').nth(scene).evaluate('(button) => button.click()')
                self.wait_for_art_motion()
                # Await the actual finite effects, including delayed group entries.
                self.page.locator('.onboard-flow__scene').evaluate('''async root => {
                  await Promise.allSettled(root.getAnimations({subtree:true}).map(a => a.finished));
                }''')
                self.assertEqual(self.page.locator('.onboard-flow__scene').evaluate(
                    'root => root.getAnimations({subtree:true}).filter(a => a.playState === "running").length'), 0)
                offsets = self.page.locator('.onboard-flow__stroke').evaluate_all(
                    'paths => paths.map(path => getComputedStyle(path).strokeDashoffset)')
                self.assertTrue(all(offset == '0px' for offset in offsets), offsets)
            self.page.locator('.onboard__actions .btn--primary').click()
        expect(self.page.locator('.onboard__wordmark')).to_contain_text('english prep')
        self.page.locator('#onboard-name').fill('Deniz')
        expect(self.page.locator('#onboard-name')).to_have_value('Deniz')
        self.page.get_by_role('button', name='Uygulamayı aç', exact=True).click()
        expect(self.page.locator('#index-filter')).to_be_visible()

    def test_slow_font_readiness_does_not_consume_the_illustration(self):
        self.page.add_init_script("""(() => {
          const load = document.fonts.load.bind(document.fonts);
          const ready = new Promise(resolve => { window.releaseTourFonts = resolve; });
          document.fonts.load = (...args) => Promise.all([load(...args), ready]).then(result => result[0]);
        })();""")
        self.open_tour()
        self.page.wait_for_timeout(1300)
        self.assertEqual(self.decorative_animations(), [])
        expect(self.page.get_by_role('button', name='Testi tanı', exact=True)).to_be_enabled()
        self.page.evaluate('window.releaseTourFonts()')
        self.wait_for_art_motion()
        effects = self.decorative_animations()
        self.assertTrue(any(effect['duration'] >= 1000 for effect in effects), effects)
        self.page.get_by_role('button', name='Tanıtımı geç', exact=True).click()
        expect(self.page.locator('#index-filter')).to_be_visible()

    def test_repeated_selection_replays_only_art_and_preserves_focus_and_caption(self):
        self.open_tour()
        control = self.page.get_by_role('button', name='Ders', exact=True)
        control.focus()
        control.press('Enter')
        self.wait_for_art_motion()
        self.page.locator('.onboard-flow__scene').evaluate("""async root => {
          await Promise.allSettled(root.getAnimations({subtree:true}).map(a => a.finished));
        }""")
        caption = self.page.locator('.onboard-flow__caption').inner_text()
        control.press('Enter')
        self.wait_for_art_motion()
        expect(control).to_be_focused()
        expect(control).to_have_attribute('aria-pressed', 'true')
        expect(self.page.locator('.onboard-flow__caption')).to_have_text(caption)
        expect(self.page.locator('.onboard-flow__drawing')).to_have_count(1)
        expect(self.page.locator('#onboard-container [data-motion-control]')).to_have_count(0)

    def test_system_reduction_and_stored_off_keep_scenes_and_brand_static(self):
        for preference in ['system', 'stored']:
            with self.subTest(preference=preference):
                self.page.emulate_media(reduced_motion='reduce' if preference == 'system' else 'no-preference')
                self.open_tour()
                if preference == 'stored':
                    self.page.evaluate('localStorage.setItem("englishPrep.motion", "off")')
                    self.page.reload()
                    expect(self.page.locator('.onboard-flow__choices')).to_be_visible()
                for step in range(3):
                    if step < 2:
                        self.page.locator('.onboard-flow__choice').nth(2).click()
                    self.assertEqual(self.decorative_animations(), [])
                    if step < 2:
                        self.page.locator('.onboard__actions .btn--primary').click()
                expect(self.page.locator('.onboard__wordmark')).to_contain_text('english prep')
                self.assertEqual(self.decorative_animations(), [])

    def test_articulated_scenes_use_distinct_parts_while_copy_stays_still(self):
        self.open_tour()
        for step in range(2):
            for scene in range(3):
                self.page.locator('.onboard-flow__choice').nth(scene).evaluate('(button) => button.click()')
                self.wait_for_art_motion()
                kinds = self.page.locator('.onboard-flow__scene [data-onboard-motion]').evaluate_all(
                    'parts => [...new Set(parts.map(p => p.dataset.onboardMotion))]')
                self.assertGreaterEqual(len(kinds), 3, kinds)
                self.assertNotIn('flow', kinds)
                self.assertEqual(self.page.locator('#onboard-step-title').evaluate(
                    'e => e.getAnimations().length'), 0)
                self.assertEqual(self.page.locator('.onboard__description').evaluate(
                    'e => e.getAnimations().length'), 0)
                self.assertGreater(self.page.locator('.onboard-flow__secondary').count(), 0)
            self.page.locator('.onboard__actions .btn--primary').click()


if __name__ == '__main__':
    unittest.main(argv=[__file__] + TEST_ARGS)
