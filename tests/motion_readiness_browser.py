#!/usr/bin/env python3
"""Real-browser readiness, adaptive rail and high-density presentation checks.

Use a local HTTP origin. Network delays are controlled test conditions, not
claims about production latency; no service-worker cache hides cold starts.
"""
import json
from pathlib import Path
import time
import unittest

from PIL import Image
from playwright.sync_api import expect, sync_playwright

from _harness import launch_chromium, make_parser

parser = make_parser(__doc__)
ARGS, TEST_ARGS = parser.parse_known_args()
BASE = ARGS.base_url.rstrip('/')
ROOT = Path(__file__).resolve().parents[1]
LESSON = 'tenses-present-perfect-vs-past-simple'
OBSERVE = '''(() => {
  const original = Element.prototype.animate;
  window.__motionCalls = [];
  Element.prototype.animate = function(frames, options) {
    const animation = original.call(this, frames, options);
    const bounds = this.getBoundingClientRect();
    window.__motionCalls.push({target:this, animation, frames,
      duration:typeof options === 'number' ? options : options?.duration,
      at:performance.now(), fonts:document.fonts.status,
      visible:bounds.bottom > 0 && bounds.top < innerHeight,
      images:[...this.querySelectorAll('img')].map(i=>({complete:i.complete,width:i.naturalWidth}))});
    return animation;
  };
})()'''


class VisibleMotionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        cls.browser = launch_chromium(cls.pw, ARGS)

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()

    def setUp(self):
        self.context = self.browser.new_context(
            viewport={'width': 390, 'height': 844}, color_scheme='dark',
            reduced_motion='no-preference', service_workers='block')
        self.context.add_init_script(OBSERVE)
        self.page = self.context.new_page()
        self.page.set_default_timeout(9000)
        self.errors = []
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [], 'Uncaught application errors')

    def visit(self, path='index.html#egitim'):
        self.page.goto(BASE + '/' + path)

    def settle(self):
        self.page.wait_for_function('''() => !document.getAnimations().some(a =>
          a.playState==='running' && Number.isFinite(a.effect.getComputedTiming().endTime))''')

    def assert_no_overflow(self):
        bounds = self.page.evaluate('''() => ({width:innerWidth,
          document:document.documentElement.scrollWidth,
          shell:document.querySelector('#shell-scroll')?.scrollWidth,
          available:document.querySelector('#shell-scroll')?.clientWidth})''')
        self.assertLessEqual(bounds['document'], bounds['width'] + 1, bounds)
        if bounds['shell'] is not None:
            self.assertLessEqual(bounds['shell'], bounds['available'] + 1, bounds)

    def test_cold_font_cannot_consume_onboarding_arrival_before_it_is_ready(self):
        # Chromium keeps painting while this controlled request is delayed.
        def delayed_font(route):
            time.sleep(.85)
            route.continue_()
        self.context.route('**/*.woff2', delayed_font)
        self.visit('index.html#hosgeldin')
        expect(self.page.locator('.onboard')).to_be_visible()
        self.page.wait_for_function('''() => window.__motionCalls.some(c =>
          c.target.closest('.onboard') && c.duration >= 500)''')
        measured = self.page.evaluate('''() => ({
          fontEnd:Math.max(...performance.getEntriesByType('resource')
            .filter(r=>r.name.endsWith('.woff2')).map(r=>r.responseEnd)),
          events:window.__motionCalls.filter(c=>c.target.closest('.onboard')).map(c=>({
            at:c.at,fonts:c.fonts,visible:c.visible,duration:c.duration}))})''')
        self.assertGreater(measured['fontEnd'], 800, measured)
        self.assertTrue(measured['events'], measured)
        for event in measured['events']:
            self.assertEqual(event['fonts'], 'loaded', measured)
            self.assertGreaterEqual(event['at'], measured['fontEnd'], measured)
            self.assertTrue(event['visible'], measured)

    def test_waiting_arrival_requires_visibility_and_real_input_cancels_it(self):
        self.visit('index.html#profil')
        self.page.locator('#profile-name').wait_for()
        self.page.evaluate('''async () => {
          const {whenVisible,animateElement}=await import('./js/interactions.js');
          const host=document.createElement('div');
          host.id='qa-arrival';
          host.style.cssText='position:fixed;top:2000px;left:30px;width:100px;height:80px';
          const button=document.createElement('button');button.textContent='QA';host.append(button);
          document.body.append(host);
          window.__arrivalRuns=0;
          whenVisible(host,()=>{window.__arrivalRuns++;animateElement(host,'story')});
        }''')
        self.page.wait_for_timeout(120)
        self.assertEqual(self.page.evaluate('window.__arrivalRuns'), 0)
        self.page.locator('#qa-arrival').evaluate("e=>e.style.top='100px'")
        self.page.wait_for_function('window.__arrivalRuns===1')
        self.page.evaluate('''async () => {
          const {whenVisible}=await import('./js/interactions.js');
          const host=document.querySelector('#qa-arrival');
          window.__lateRuns=0;
          const ready=new Promise(resolve=>window.__releaseArrival=resolve);
          whenVisible(host,()=>window.__lateRuns++,{ready,channel:'late'});
          host.querySelector('button').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));
          window.__releaseArrival();
        }''')
        self.page.wait_for_timeout(140)
        self.assertEqual(self.page.evaluate('window.__lateRuns'), 0,
                         'A late font/image must not move the control after real input')

    def test_settings_are_the_only_motion_toggle_and_preference_reaches_about(self):
        for path in ['index.html#egitim', 'index.html#test', 'index.html#hosgeldin', 'about/']:
            with self.subTest(path=path):
                self.visit(path)
                expect(self.page.locator('[data-motion-control]:visible')).to_have_count(0)
        self.visit('index.html#profil')
        control = self.page.locator('[data-motion-control]')
        expect(control).to_have_count(1)
        control.click()
        expect(self.page.locator('html')).to_have_attribute('data-motion', 'off')
        self.visit('about/')
        expect(self.page.locator('html')).to_have_attribute('data-motion', 'off')
        running = self.page.evaluate('''document.getAnimations().filter(a=>a.playState==='running'
          && (Number.isFinite(a.effect.getComputedTiming().endTime)
          || a.effect.target.closest('.ambient'))).length''')
        self.assertEqual(running, 0)
        expect(self.page.locator('.ab-hero h1')).to_be_visible()

    def test_mobile_header_center_and_edge_controls_stay_stable_between_routes(self):
        self.page.emulate_media(reduced_motion='reduce')
        for width in [320, 390, 768]:
            with self.subTest(width=width):
                self.page.set_viewport_size({'width':width,'height':844})
                heights = []
                for path, title in [('#egitim','Eğitim'),('#test','Test'),('#profil','Profil'),
                                    ('#egitim/'+LESSON,'Present Perfect vs Past Simple')]:
                    self.visit('index.html'+path)
                    expect(self.page.locator('.bar__title')).to_have_text(title)
                    geometry = self.page.locator('#shell-header').evaluate('''header=>{
                      const b=header.getBoundingClientRect(), t=header.querySelector('.bar__title').getBoundingClientRect();
                      const l=header.querySelector('.bar__lead').getBoundingClientRect(), r=header.querySelector('.bar__trail').getBoundingClientRect();
                      return {height:b.height,titleCenter:t.x+t.width/2,center:b.x+b.width/2,
                        overlapLeft:l.right-t.left,overlapRight:t.right-r.left};}''')
                    self.assertAlmostEqual(geometry['titleCenter'], geometry['center'], delta=1, msg=geometry)
                    self.assertLessEqual(geometry['overlapLeft'], 1, geometry)
                    self.assertLessEqual(geometry['overlapRight'], 1, geometry)
                    heights.append(geometry['height'])
                    self.assert_no_overflow()
                self.assertLessEqual(max(heights)-min(heights), 1, heights)

    def test_high_density_captures_are_real_pixels_and_browser_uses_matching_family(self):
        for family, minimum in [('phone',(780,1688)),('wide',(2880,2000))]:
            for name in ['education','article','test','results']:
                with self.subTest(capture=name+'-'+family):
                    with Image.open(ROOT/'about/assets'/f'{name}-{family}.webp') as image:
                        self.assertGreaterEqual(image.width, minimum[0])
                        self.assertGreaterEqual(image.height, minimum[1])
        # v0.77 About shows the phone captures: inline on phones, in the
        # sticky device on wide screens. Both must be the real 2x pixels.
        self.visit('about/')
        for width, selector in [(390,'.ab-step[data-step="apply"] .ab-step__img'),(1440,'.ab-device__img.is-active')]:
            self.page.set_viewport_size({'width':width,'height':1000})
            self.page.locator('.ab-step[data-step="apply"]').scroll_into_view_if_needed()
            self.page.wait_for_function('''selector=>{
              const i=document.querySelector(selector);return i&&i.complete&&i.naturalWidth>=780&&i.currentSrc.includes('-phone.webp');
            }''', arg=selector)
            self.assert_no_overflow()

    def test_adaptive_rail_leaves_narrow_native_scrolling_and_keyboard_reading_intact(self):
        self.page.emulate_media(reduced_motion='reduce')
        self.visit('index.html#egitim/'+LESSON)
        rail = self.page.locator('.scroll-rail')
        expect(rail).to_be_visible()
        expect(rail).to_have_attribute('data-interactive','true')
        expect(rail).to_have_attribute('data-compact','true')
        expect(self.page.locator('.scroll-rail [role="scrollbar"]')).to_have_count(1)
        self.assertGreaterEqual(self.page.locator('.scroll-rail__thumb').bounding_box()['width'],44)
        scroll = self.page.locator('#shell-scroll')
        before = scroll.evaluate('e=>e.scrollTop')
        self.page.mouse.move(190,400)
        self.page.mouse.wheel(0,450)
        self.page.wait_for_function('document.querySelector("#shell-scroll").scrollTop>100')
        after = scroll.evaluate('e=>e.scrollTop')
        self.assertGreater(after,before+100)
        self.page.keyboard.press('Home')
        scroll.focus()
        self.page.keyboard.press('PageDown')
        self.page.wait_for_function('document.querySelector("#shell-scroll").scrollTop>100')
        self.assert_no_overflow()

    def test_desktop_rail_keyboard_drag_escape_and_reduced_motion_keep_position_truthful(self):
        self.page.set_viewport_size({'width':1440,'height':1000})
        self.page.emulate_media(reduced_motion='reduce')
        self.visit('index.html#egitim/'+LESSON)
        control = self.page.locator('.scroll-rail [role="scrollbar"]')
        expect(control).to_be_visible()
        expect(control).to_have_attribute('aria-orientation','vertical')
        self.assertGreaterEqual(control.bounding_box()['width'], 44)
        control.focus()
        self.page.keyboard.press('End')
        self.page.wait_for_function('''()=>{
          const c=document.querySelector('.scroll-rail [role="scrollbar"]');
          return Number(c?.getAttribute('aria-valuenow'))>=99;
        }''')
        self.page.keyboard.press('Home')
        self.page.wait_for_function('''()=>Number(document.querySelector('.scroll-rail [role="scrollbar"]').getAttribute('aria-valuenow'))===0''')
        box=control.bounding_box()
        self.page.mouse.move(box['x']+box['width']/2,box['y']+12)
        self.page.mouse.down()
        self.page.mouse.move(box['x']+box['width']/2,box['y']+box['height']*.7,steps=6)
        self.page.wait_for_function('document.querySelector("#shell-scroll").scrollTop>100')
        self.page.keyboard.press('Escape')
        self.page.mouse.up()
        self.page.wait_for_function('document.querySelector("#shell-scroll").scrollTop<2')
        self.page.keyboard.press('PageDown')
        self.page.wait_for_function('document.querySelector("#shell-scroll").scrollTop>100')
        self.page.wait_for_function('''()=>Number(document.querySelector('.scroll-rail [role="scrollbar"]').getAttribute('aria-valuenow'))>0''')
        measured=self.page.evaluate('''()=>{
          const s=document.querySelector('#shell-scroll'),c=document.querySelector('.scroll-rail [role="scrollbar"]');
          return {value:Number(c.getAttribute('aria-valuenow')),actual:100*s.scrollTop/(s.scrollHeight-s.clientHeight),
            controls:c.getAttribute('aria-controls'),id:s.id};}''')
        self.assertAlmostEqual(measured['value'],measured['actual'],delta=1,msg=measured)
        self.assertEqual(measured['controls'],measured['id'])
        self.page.emulate_media(forced_colors='active')
        expect(self.page.locator('.scroll-rail')).not_to_be_visible()
        self.assertNotEqual(self.page.locator('#shell-scroll').evaluate('e=>getComputedStyle(e).scrollbarWidth'),'none')


if __name__ == '__main__':
    unittest.main(argv=[__file__]+TEST_ARGS)
