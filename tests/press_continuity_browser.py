#!/usr/bin/env python3
"""Press continuity; v0.74 restores the earlier page entrance."""
import time
import unittest
from playwright.sync_api import sync_playwright, expect

from _harness import launch_chromium, make_parser

parser = make_parser(__doc__)
ARGS, REST = parser.parse_known_args()
BASE = ARGS.base_url.rstrip('/')

OBSERVE = '''(() => {
 const original = Element.prototype.animate;
 window.__effects=[];
 Element.prototype.animate=function(frames,timing){
   const animation=original.call(this,frames,timing);
   window.__effects.push({target:this,animation,frames,timing,at:performance.now(),font:document.fonts.status});
   return animation;
 };
})()'''

class Motion73(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw=sync_playwright().start()
        cls.browser=launch_chromium(cls.pw, ARGS)
    @classmethod
    def tearDownClass(cls):
        cls.browser.close(); cls.pw.stop()
    def setUp(self):
        self.context=self.browser.new_context(viewport={'width':390,'height':844},reduced_motion='no-preference',color_scheme='dark',service_workers='block')
        self.context.add_init_script(OBSERVE)
        self.page=self.context.new_page();self.page.set_default_timeout(9000)
        self.errors=[];self.page.on('pageerror',lambda e:self.errors.append(str(e)))
    def tearDown(self):
        self.context.close();self.assertEqual(self.errors,[])
    def visit(self,route):
        self.page.goto(BASE+'/index.html#'+route)
    def settle(self):
        self.page.wait_for_function("!document.getAnimations().some(a=>a.playState==='running'&&Number.isFinite(a.effect.getComputedTiming().endTime))")
    def test_held_press_rebounds_after_release_without_moving_anchor_or_delaying_popup(self):
        self.visit('test');trigger=self.page.locator('[aria-labelledby~="mixed-count-label"]')
        trigger.wait_for();self.settle();trigger.scroll_into_view_if_needed()
        before=trigger.bounding_box();x=before['x']+before['width']/2;y=before['y']+before['height']/2
        self.page.mouse.move(x,y);self.page.mouse.down();self.page.wait_for_timeout(150)
        during=trigger.bounding_box()
        self.assertEqual(before,during,'Pointer target must stay in place during press')
        scale=trigger.locator('.control-face').evaluate('(e)=>new DOMMatrix(getComputedStyle(e).transform).a')
        self.assertLess(scale,.97,'The held control should visibly compress')
        self.page.mouse.up()
        expect(trigger).to_have_attribute('aria-expanded','true')
        self.assertEqual(before,trigger.bounding_box(),'Popup positioning uses unchanged trigger rectangle')
        self.assertTrue(trigger.locator('.control-face').evaluate('(e)=>e.getAnimations().some(a=>a.playState==="running")'))
        self.settle();self.assertEqual(trigger.locator('.control-face').evaluate('(e)=>getComputedStyle(e).transform'),'none')
        trigger.press('Escape');expect(trigger).to_have_attribute('aria-expanded','false')
    def test_first_icon_press_and_keyboard_activation_keep_native_navigation(self):
        self.visit('test');trigger=self.page.locator('#profile-trigger');trigger.wait_for()
        box=trigger.bounding_box();self.page.mouse.click(box['x']+box['width']/2,box['y']+box['height']/2)
        expect(self.page.locator('#profile-name')).to_be_visible()
        # Keyboard opens the existing native dialog immediately, not at the
        # end of a release timer; its native focus containment still applies.
        backup=self.page.get_by_role('button',name='Yedek al',exact=True)
        backup.focus();self.page.evaluate('window.__effects=[]');self.page.keyboard.press('Enter')
        self.assertEqual(self.page.evaluate("window.__effects.filter(e=>e.timing.duration===380&&e.target.closest('button')?.textContent==='Yedek al').length"),1,'One continuous keyboard release, not a restarted duplicate')
        expect(self.page.locator('#backup-dialog')).to_be_visible()
        self.page.keyboard.press('Escape');expect(self.page.locator('#backup-dialog')).not_to_be_visible()
        expect(backup).to_be_focused()
    def test_cold_data_uses_the_restored_route_after_content_and_fonts_are_ready(self):
        def delayed(route):
            time.sleep(.45);route.continue_()
        self.context.route('**/data/manifest.json',delayed)
        self.visit('test')
        # v0.76 (ADR 014): the tab cascade starts in the task that commits the
        # loaded content, from its first keyframe (opacity 0, 28px sideways),
        # so it can neither run before the data exists nor paint final-then-move.
        self.page.wait_for_function('window.__effects.some(e=>/^translateX\\(-?28px\\)$/.test(e.frames[0].transform||""))')
        measured=self.page.evaluate('''() => {
          const effects=window.__effects.filter(e=>/^translateX\\(-?28px\\)$/.test(e.frames[0].transform||''));
          return {effects:effects.map(e=>({opacity:e.frames[0].opacity,fill:e.timing.fill,at:e.at})),
            obsolete:window.__effects.some(e=>e.timing.duration===620||e.frames[0].transform==='translateX(12px)'),
            ready:Math.max(...performance.getEntriesByType('resource').filter(r=>r.name.endsWith('/data/manifest.json')).map(r=>r.responseEnd))};
        }''')
        self.assertTrue(measured['effects'])
        self.assertFalse(measured['obsolete'],'Neither earlier page-entry variant remains')
        self.assertGreater(measured['ready'],350,'Controlled cold request actually delayed rendering')
        for effect in measured['effects']:
            self.assertEqual(effect['opacity'],0)
            self.assertEqual(effect['fill'],'backwards')
            self.assertGreaterEqual(effect['at'],measured['ready'])
    def test_motion_off_cancels_held_press_and_arrivals_while_input_continues(self):
        self.visit('test');trigger=self.page.locator('[aria-labelledby~="mixed-count-label"]');trigger.wait_for();self.settle()
        box=trigger.bounding_box();self.page.mouse.move(box['x']+20,box['y']+20);self.page.mouse.down()
        self.page.evaluate("async()=>{const m=await import('./js/motion.js');m.setMotionEnabled(false)}")
        self.page.mouse.up();expect(trigger).to_have_attribute('aria-expanded','true')
        self.assertEqual(trigger.locator('.control-face').evaluate('(e)=>getComputedStyle(e).transform'),'none')
        self.assertFalse(self.page.evaluate("document.getAnimations().some(a=>a.playState==='running'&&Number.isFinite(a.effect.getComputedTiming().endTime))"))
        trigger.press('Escape');self.page.locator('#profile-trigger').click();expect(self.page.locator('#profile-name')).to_be_visible()
        self.assertFalse(self.page.evaluate("document.getAnimations().some(a=>a.playState==='running'&&Number.isFinite(a.effect.getComputedTiming().endTime))"))
    def test_reduced_motion_does_not_start_composition_or_press_bounce(self):
        self.page.emulate_media(reduced_motion='reduce');self.visit('test')
        self.page.locator('#profile-trigger').click();expect(self.page.locator('#profile-name')).to_be_visible()
        self.assertEqual(self.page.evaluate('window.__effects.length'),0)

if __name__=='__main__':unittest.main(argv=[__file__]+REST)
