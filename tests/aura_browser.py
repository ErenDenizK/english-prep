#!/usr/bin/env python3
"""Atmosphere acceptance: visible local pigment changes and motion lifecycle.

Seeks real CSS timelines for deterministic rendered frames; it does not change
colors, app content, geometry or opacity. Native scroll/learning are untouched.
"""
import argparse
from io import BytesIO
import unittest
from PIL import Image, ImageChops
from playwright.sync_api import expect, sync_playwright

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base-url', default='http://127.0.0.1:8000')
parser.add_argument('--browser-path', default='/usr/bin/chromium')
ARGS, TEST_ARGS = parser.parse_known_args()
BASE = ARGS.base_url.rstrip('/')


def pigment(pixel):
    r, g, b = pixel
    if g - r >= 7:
        return 'lagoon'
    if b - r >= 8 and b - g >= 8:
        return 'iris'
    if r - g >= 10 and r >= b - 2:
        return 'cherry'
    return 'blend'


class AtmosphereTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        cls.browser = cls.pw.chromium.launch(executable_path=ARGS.browser_path,
                                            args=['--no-sandbox'])

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()

    def setUp(self):
        self.context = self.browser.new_context(viewport={'width':390,'height':844},
            color_scheme='dark', reduced_motion='no-preference', service_workers='block')
        self.context.add_init_script('localStorage.setItem("englishPrep.onboarded","1")')
        self.page = self.context.new_page()
        self.errors = []
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [])

    def visit(self, route='#egitim'):
        self.page.goto(BASE + '/' + route)
        expect(self.page.locator('.ambient__field')).to_have_count(3)
        expect(self.page.locator('.ambient__pigment')).to_have_count(9)
        self.page.wait_for_function('document.fonts.status === "loaded"')

    def test_three_exposed_regions_visit_all_three_pigments_and_change_visibly(self):
        self.visit()
        self.page.wait_for_timeout(1300)
        frames = []
        # The owner requested 20% less speed in v0.73. The same scene travels
        # through its previous phases over 1.25× the time, without dimming it.
        for time in range(0, 15001, 2500):
            self.page.evaluate('''time => {
              for (const animation of document.getAnimations()) {
                if (animation.effect.target.closest('.ambient')) {
                  animation.pause(); animation.currentTime=time;
                }
              }
            }''', time)
            self.page.wait_for_timeout(40)
            frames.append(Image.open(BytesIO(self.page.screenshot())).convert('RGB'))
        # Blank margins on the actual application, not a isolated demo canvas.
        # Multiple corners must genuinely change hue, not merely alpha/position.
        # Stay beyond the rail's outer edge; x=378 now samples the visible
        # scrollbar rather than the atmosphere on a 390px screen.
        for position in [(100,80),(387,300),(300,650)]:
            samples = [frame.getpixel(position) for frame in frames]
            seen = {pigment(pixel) for pixel in samples}
            self.assertTrue({'cherry','iris','lagoon'} <= seen, (position,samples,seen))
        difference = ImageChops.difference(frames[0], frames[1])
        changed = sum(1 for pixel in difference.get_flattened_data() if max(pixel) >= 12)
        self.assertGreater(changed/(390*844), .20,
                           'Motion must remain visible over 2.5 seconds, not tiny meanRGB noise')

    def test_all_twelve_timelines_pause_for_settings_hidden_and_reduced_motion(self):
        self.visit('#profil')
        self.page.wait_for_function('''document.getAnimations().filter(a=>
          a.effect.target.closest('.ambient')&&a.playState==='running').length===12''')
        self.page.locator('[data-motion-control]').click()
        expect(self.page.locator('html')).to_have_attribute('data-motion','off')
        paused = self.page.evaluate('''async () => {
          const animations=document.getAnimations().filter(a=>a.effect.target.closest('.ambient'));
          await Promise.all(animations.map(a=>a.ready));
          return animations.map(a=>({state:a.playState,time:a.currentTime}));
        }''')
        self.assertEqual(len(paused),12)
        self.assertTrue(all(a['state']=='paused' for a in paused),paused)
        self.page.wait_for_timeout(140)
        times = self.page.evaluate('''document.getAnimations().filter(a=>
          a.effect.target.closest('.ambient')).map(a=>a.currentTime)''')
        self.assertEqual(times,[a['time'] for a in paused])
        self.page.locator('[data-motion-control]').click()
        self.page.evaluate('''() => {
          Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});
          document.dispatchEvent(new Event('visibilitychange'));
        }''')
        expect(self.page.locator('html')).to_have_attribute('data-page-visible','false')
        self.assertEqual(self.page.evaluate('''document.getAnimations().filter(a=>
          a.effect.target.closest('.ambient')&&a.playState==='running').length'''),0)
        self.page.evaluate('''() => {
          Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});
          document.dispatchEvent(new Event('visibilitychange'));
        }''')
        self.page.wait_for_function('''document.getAnimations().filter(a=>
          a.effect.target.closest('.ambient')&&a.playState==='running').length===12''')
        self.page.emulate_media(reduced_motion='reduce')
        expect(self.page.locator('html')).to_have_attribute('data-motion','off')
        self.assertEqual(self.page.evaluate('''document.getAnimations().filter(a=>
          a.effect.target.closest('.ambient')&&a.playState==='running').length'''),0)
        # Reduced static artwork still has a distinct tone at each anchor.
        resting = self.page.locator('.ambient__field').evaluate_all('''nodes=>nodes.map(n=>
          [...n.children].filter(p=>Number(getComputedStyle(p).opacity)===1).map(p=>p.className))''')
        self.assertIn('ambient__pigment--cherry',resting[0][0])
        self.assertIn('ambient__pigment--iris',resting[1][0])
        self.assertIn('ambient__pigment--lagoon',resting[2][0])

    def test_the_composite_cap_is_shared_without_intercepting_input_or_growing_layout(self):
        self.visit()
        for width in [320,390,1440]:
            self.page.set_viewport_size({'width':width,'height':844})
            geometry=self.page.locator('.ambient').evaluate('''e=>({
              opacity:getComputedStyle(e).opacity,pointer:getComputedStyle(e).pointerEvents,
              width:document.documentElement.scrollWidth,viewport:innerWidth,
              colors:[...e.querySelectorAll('.ambient__pigment')].every(p=>getComputedStyle(p).backgroundImage!=='none')})''')
            self.assertEqual(geometry['opacity'],'0.42')
            self.assertEqual(geometry['pointer'],'none')
            self.assertTrue(geometry['colors'])
            self.assertLessEqual(geometry['width'],geometry['viewport']+1)
        self.page.emulate_media(color_scheme='light')
        self.page.evaluate("document.documentElement.dataset.theme='light'")
        self.assertEqual(self.page.locator('.ambient').evaluate('e=>getComputedStyle(e).opacity'),'0.09')
        self.page.emulate_media(forced_colors='active')
        expect(self.page.locator('.ambient')).not_to_be_visible()


if __name__ == '__main__':
    unittest.main(argv=[__file__]+TEST_ARGS)
