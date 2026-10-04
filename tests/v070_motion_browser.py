#!/usr/bin/env python3
"""Event-boundary motion regressions; use a real HTTP app, without service workers.

Observe actual animation objects rather than waiting for effects before input.
Visibility is simulated in one test; this is not physical-device certification.
"""
import argparse
import json
from pathlib import Path
import re
import unittest

from playwright.sync_api import expect, sync_playwright

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base-url', default='http://127.0.0.1:8000')
parser.add_argument('--browser-path', default='/usr/bin/chromium')
ARGS, TEST_ARGS = parser.parse_known_args()
BASE = ARGS.base_url.rstrip('/')
ROOT = Path(__file__).resolve().parents[1]
LESSON = 'tenses-present-perfect-vs-past-simple'
QUESTIONS = {}
for topic in json.loads((ROOT / 'data/manifest.json').read_text())['topics']:
    if not topic.get('comingSoon'):
        for question in json.loads((ROOT / topic['file']).read_text())['questions']:
            QUESTIONS[question['id']] = question

OBSERVE_MOTION = '''(() => {
  const original = Element.prototype.animate;
  window.__motionCalls = [];
  Element.prototype.animate = function (frames, options) {
    const animation = original.call(this, frames, options);
    window.__motionCalls.push({target: this, animation, frames,
      duration: typeof options === 'number' ? options : options?.duration,
      at: performance.now()});
    return animation;
  };
})()'''


class EventMotionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        cls.browser = cls.pw.chromium.launch(
            executable_path=ARGS.browser_path, args=['--no-sandbox'])

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()

    def setUp(self):
        self.context = self.browser.new_context(
            viewport={'width': 390, 'height': 844}, reduced_motion='no-preference',
            color_scheme='dark', service_workers='block')
        self.context.add_init_script(OBSERVE_MOTION)
        self.page = self.context.new_page()
        self.page.set_default_timeout(8000)
        self.errors = []
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [], 'Uncaught application errors')

    def visit(self, path='index.html#egitim'):
        self.page.goto(BASE + '/' + path)

    def settle(self):
        self.page.wait_for_function('''() => !document.getAnimations().some(a =>
          a.playState === 'running' && Number.isFinite(a.effect.getComputedTiming().endTime))''')

    def launch(self, count=2):
        self.visit('index.html#test')
        expect(self.page.locator('#test-panel')).to_contain_text('Karışık test')
        self.page.evaluate('''async count => {
          const {startMixedTest} = await import('./js/quiz-launch.js');
          await startMixedTest(count);
        }''', count)
        expect(self.page.locator('#question-stem')).to_be_visible()

    def snapshot(self):
        return self.page.evaluate("JSON.parse(sessionStorage.getItem('englishPrep.activeQuiz'))")

    def choice(self, correct=True):
        active = self.snapshot()
        question = active['order'][active['currentIndex']]
        original = QUESTIONS[question['id']]
        answer = original['options'][original['correctIndex']]
        if not correct:
            answer = next(option for option in question['options'] if option != answer)
        return question['options'].index(answer)

    def assert_no_overflow(self):
        geometry = self.page.evaluate('''() => ({width: innerWidth,
          document: document.documentElement.scrollWidth,
          shell: document.querySelector('#shell-scroll').scrollWidth,
          available: document.querySelector('#shell-scroll').clientWidth})''')
        self.assertLessEqual(geometry['document'], geometry['width'] + 1, geometry)
        self.assertLessEqual(geometry['shell'], geometry['available'] + 1, geometry)

    def test_menu_can_commit_and_close_during_entry_without_pending_effects(self):
        for width, height in [(320, 640), (390, 844), (1440, 1000)]:
            with self.subTest(width=width):
                self.page.set_viewport_size({'width': width, 'height': height})
                self.visit('index.html#test')
                trigger = self.page.locator('[aria-labelledby~="mixed-count-label"]')
                trigger.wait_for()
                trigger.scroll_into_view_if_needed()
                measured = trigger.evaluate('''trigger => {
                  const key = key => trigger.dispatchEvent(new KeyboardEvent('keydown', {key,bubbles:true}));
                  trigger.focus();
                  const states = [];
                  for (let i=0; i<8; i++) {
                    key('ArrowDown');
                    const menu = document.getElementById(trigger.getAttribute('aria-controls'));
                    states.push({open: !menu.hidden, expanded: trigger.getAttribute('aria-expanded'),
                      focus: document.activeElement === trigger});
                    key('End');
                    key(i % 2 ? 'Escape' : 'Enter');
                    states.push({closed: menu.hidden, focus: document.activeElement === trigger});
                  }
                  return {states, value: trigger.textContent,
                    activeEffects: window.__motionCalls.filter(c => c.target.matches('.listbox__menu') &&
                      c.animation.playState === 'running').length};
                }''')
                for index, state in enumerate(measured['states']):
                    self.assertTrue(state['focus'], measured)
                    self.assertTrue(state['open'] if index % 2 == 0 else state['closed'], measured)
                self.assertIn('Tümü', measured['value'])
                self.assertEqual(measured['activeEffects'], 0)
                self.assert_no_overflow()

    def test_dialog_focus_and_escape_are_not_deferred_until_entry_finishes(self):
        self.visit('index.html#profil')
        opener = self.page.get_by_role('button', name='Geçmişi sıfırla', exact=True)
        opener.wait_for()
        opener.scroll_into_view_if_needed()
        initial = opener.evaluate('''button => {
          button.focus(); button.click();
          const dialog = document.querySelector('#confirm-dialog');
          return {open: dialog.open, focus: document.activeElement.textContent,
            running: window.__motionCalls.some(c => dialog.contains(c.target) && c.animation.playState === 'running')};
        }''')
        self.assertTrue(initial['open'])
        self.assertEqual(initial['focus'], 'Vazgeç')
        self.assertTrue(initial['running'], 'Test must interrupt a live entrance')
        self.page.keyboard.press('Escape')
        expect(self.page.locator('#confirm-dialog')).not_to_be_visible()
        expect(opener).to_be_focused()
        self.assertFalse(self.page.evaluate('''window.__motionCalls.some(c =>
          c.target.closest('#confirm-dialog') && c.animation.playState === 'running')'''))

    def test_focus_settles_moving_menu_anchor_before_queued_scroll_events(self):
        for fallback in [False, True]:
            with self.subTest(fallback=fallback):
                if fallback:
                    self.context.add_init_script(
                        "Object.defineProperty(HTMLElement.prototype, 'showPopover', {value:undefined})")
                self.page.set_viewport_size({'width': 768, 'height': 360})
                self.visit('index.html#test')
                if fallback:
                    self.page.reload()
                trigger = self.page.locator('[aria-labelledby~="mixed-count-label"]')
                trigger.wait_for()
                self.settle()
                measured = trigger.evaluate('''async trigger => {
                  // A route can still be entering when a fast learner focuses
                  // the menu. Make that boundary deterministic, not CPU-speed dependent.
                  const {animateElement}=await import('./js/interactions.js');
                  const host=trigger.closest('.practice-card');
                  const incoming=animateElement(host,'route');
                  await new Promise(requestAnimationFrame);
                  trigger.focus();
                  trigger.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true}));
                  trigger.dispatchEvent(new KeyboardEvent('keydown',{key:'End',bubbles:true}));
                  const before={x:trigger.getBoundingClientRect().x,
                    scroll:document.querySelector('#shell-scroll').scrollTop};
                  for(let i=0;i<4;i++) await new Promise(requestAnimationFrame);
                  return {incoming:incoming.playState,
                    open:trigger.getAttribute('aria-expanded'),
                    before,after:{x:trigger.getBoundingClientRect().x,
                      scroll:document.querySelector('#shell-scroll').scrollTop}};
                }''')
                self.assertEqual(measured['incoming'], 'idle', measured)
                self.assertEqual(measured['open'], 'true', measured)
                self.assertAlmostEqual(measured['before']['x'], measured['after']['x'], delta=.1)
                self.assertEqual(measured['before']['scroll'], measured['after']['scroll'])
                # Genuine user scrolling must still dismiss an anchored menu.
                self.page.locator('#shell-scroll').evaluate('e => e.scrollTop+=20')
                expect(trigger).to_have_attribute('aria-expanded', 'false')

    def test_answers_commit_immediately_and_keep_all_hitboxes_still(self):
        for width, height in [(320, 740), (390, 844), (1440, 1000)]:
            with self.subTest(width=width):
                self.page.set_viewport_size({'width': width, 'height': height})
                self.launch()
                for index, correct in enumerate([False, True]):
                    self.settle()
                    option = self.choice(correct)
                    measured = self.page.evaluate('''index => {
                      const geometry = () => [...document.querySelectorAll('.option')].map(e => {
                        // Existing feedback deliberately scrolls into view.
                        // Measure layout coordinates separately from that scroll.
                        const b=e.getBoundingClientRect();
                        return [b.x,b.y+document.querySelector('#shell-scroll').scrollTop,b.width,b.height];
                      });
                      const before=geometry();
                      const barBefore=document.querySelector('#quiz-bar').getBoundingClientRect().y;
                      document.querySelectorAll('.option')[index].click();
                      return {before, after:geometry(),
                        barBefore,barAfter:document.querySelector('#quiz-bar').getBoundingClientRect().y,
                        verdict:document.querySelector('.feedback__verdict')?.textContent,
                        picked:document.querySelectorAll('.option--picked').length,
                        locked:[...document.querySelectorAll('.option')].every(e=>e.getAttribute('aria-disabled')==='true'),
                        paragraphAnimations:document.getAnimations().filter(a=>a.effect.target.matches('#question-stem, #question-stem *') && a.playState==='running').length,
                        snapshot:JSON.parse(sessionStorage.getItem('englishPrep.activeQuiz'))};
                    }''', option)
                    self.assertEqual(measured['verdict'], 'Doğru' if correct else 'Yanlış')
                    self.assertEqual(measured['picked'], 1)
                    self.assertTrue(measured['locked'])
                    self.assertIsNotNone(measured['snapshot']['selectedAnswers'][index])
                    self.assertEqual(measured['paragraphAnimations'], 0)
                    self.assertAlmostEqual(measured['barBefore'], measured['barAfter'], delta=1)
                    for before, after in zip(measured['before'], measured['after']):
                        for start, end in zip(before, after):
                            self.assertAlmostEqual(start, end, delta=1)
                    self.assert_no_overflow()
                    if index == 0:
                        self.page.get_by_role('button', name='Sonraki soru', exact=True).evaluate('e => e.click()')
                        expect(self.page.locator('.feedback')).to_have_count(0)

    def test_results_have_final_score_and_history_while_completion_is_running(self):
        self.launch(count=1)
        self.page.locator('.option').nth(self.choice()).evaluate('e => e.click()')
        self.page.get_by_role('button', name='Sonuçları gör', exact=True).evaluate('e => e.click()')
        self.page.wait_for_url('**/results.html')
        expect(self.page.locator('.score')).to_be_visible()
        measured = self.page.evaluate('''() => ({
          value:document.querySelector('.score__metric .metric__value').textContent,
          progress:document.querySelector('.score [role="progressbar"]').getAttribute('aria-valuenow'),
          history:JSON.parse(localStorage.getItem('englishPrep.history')).attempts,
          active:sessionStorage.getItem('englishPrep.activeQuiz'),
          expressive:window.__motionCalls.filter(c=>c.duration>=500).map(c=>({duration:c.duration,state:c.animation.playState}))
        })''')
        self.assertEqual(measured['value'], '1 / 1')
        self.assertEqual(measured['progress'], '100')
        self.assertEqual(len(measured['history']), 1)
        self.assertEqual(len(measured['history'][0]['questions']), 1)
        self.assertIsNone(measured['active'])
        # v0.71 commits the score/history immediately, then waits for real
        # font readiness and two visible paint frames before presentation.
        self.page.wait_for_function("window.__motionCalls.some(c => c.duration >= 500 && c.animation.playState === 'running')")
        expect(self.page.locator('.score__metric .metric__value')).to_have_text('1 / 1')
        self.assertEqual(self.page.evaluate("JSON.parse(localStorage.getItem('englishPrep.history')).attempts"), measured['history'])
        self.page.reload()
        expect(self.page.locator('.score__metric .metric__value')).to_have_text('1 / 1')
        history = self.page.evaluate("JSON.parse(localStorage.getItem('englishPrep.history')).attempts")
        self.assertEqual(history, measured['history'])
        self.assertEqual(self.page.evaluate('window.__motionCalls.filter(c => c.duration >= 500).length'), 0,
                         'Reloading an existing result must not repeat its completion reward')

    def test_preference_os_and_hidden_page_cancel_live_effects_without_hiding_ui(self):
        self.visit('index.html#profil')
        self.page.locator('#profile-name').wait_for()
        for reason in ['preference', 'system', 'visibility']:
            with self.subTest(reason=reason):
                self.page.emulate_media(reduced_motion='no-preference')
                result = self.page.evaluate('''async reason => {
                  const motion = await import('./js/motion.js');
                  const effects = await import('./js/interactions.js');
                  Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});
                  document.dispatchEvent(new Event('visibilitychange'));
                  motion.setMotionEnabled(true);
                  const target=document.querySelector('#profile-container .hero__figure');
                  const effect=effects.animateElement(target,'complete');
                  window.__interruptedEffect=effect;
                  const running=effect?.playState;
                  if(reason==='preference') motion.setMotionEnabled(false);
                  if(reason==='visibility') {
                    Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});
                    document.dispatchEvent(new Event('visibilitychange'));
                  }
                  return {running,state:effect?.playState};
                }''', reason)
                self.assertEqual(result['running'], 'running')
                if reason == 'system':
                    self.page.emulate_media(reduced_motion='reduce')
                    self.page.wait_for_function("document.documentElement.dataset.motion === 'off'")
                self.assertEqual(self.page.evaluate('window.__interruptedEffect.playState'), 'idle')
                self.assertFalse(self.page.evaluate('''document.getAnimations().some(a =>
                  a.playState==='running' && Number.isFinite(a.effect.getComputedTiming().endTime))'''))
                expect(self.page.locator('#profile-name')).to_be_visible()

    def test_lesson_completion_cue_is_once_and_never_animates_teaching_paragraphs(self):
        self.visit('index.html#egitim/' + LESSON)
        expect(self.page.locator('.lesson')).to_be_visible()
        self.settle()
        self.page.evaluate('window.__motionCalls = []')
        self.page.locator('#shell-scroll').evaluate('e => e.scrollTop=e.scrollHeight')
        self.page.wait_for_function('''lesson =>
          JSON.parse(localStorage.getItem('englishPrep.lessonProgress')||'{}')[lesson]?.done === true''', arg=LESSON)
        measured = self.page.evaluate('''() => ({
          completion:window.__motionCalls.filter(c=>c.target.closest('.block--end')).map(c=>c.duration),
          prose:window.__motionCalls.filter(c=>c.target.closest('[data-reading-start], .block--text, .block--examples, .block--pitfall')).length
        })''')
        self.assertTrue(any(duration >= 500 for duration in measured['completion']), measured)
        self.assertEqual(measured['prose'], 0)
        original_count = len(measured['completion'])
        self.settle()
        self.page.locator('#shell-scroll').evaluate('e => e.scrollTop=0')
        self.page.evaluate('() => new Promise(requestAnimationFrame)')
        self.page.locator('#shell-scroll').evaluate('e => e.scrollTop=e.scrollHeight')
        self.page.evaluate('() => new Promise(requestAnimationFrame)')
        count = self.page.evaluate("window.__motionCalls.filter(c=>c.target.closest('.block--end')).length")
        self.assertEqual(count, original_count)
        self.page.reload()
        expect(self.page.locator('.lesson')).to_be_visible()
        self.settle()
        self.page.locator('#shell-scroll').evaluate('e => e.scrollTop=e.scrollHeight')
        self.page.evaluate('() => new Promise(requestAnimationFrame)')
        self.assertEqual(self.page.evaluate("window.__motionCalls.filter(c=>c.target.closest('.block--end')).length"), 0)

    def test_profile_name_commit_preserves_keyboard_position_without_replaying_entry(self):
        self.visit('index.html#profil')
        name = self.page.locator('#profile-name')
        name.wait_for()
        self.settle()
        name.focus()
        name.fill('Ada')
        expected = name.evaluate('''input => {
          const controls=[...document.querySelectorAll('#profile-container input, #profile-container button, #profile-container a[href]')]
            .filter(e=>e.getClientRects().length && !e.disabled && e.tabIndex>=0);
          const next=controls[controls.indexOf(input)+1];
          window.__motionCalls=[];
          return next.textContent;
        }''')
        name.press('Tab')
        expect(self.page.locator('#profile-container h1')).to_have_text('Ada')
        self.assertEqual(self.page.evaluate('document.activeElement.textContent'), expected)
        self.assertEqual(self.page.evaluate('window.__motionCalls.length'), 0)
        self.assertEqual(self.page.locator('#profile-name').input_value(), 'Ada')

    def test_rapid_route_interruptions_leave_only_latest_view_and_no_outgoing_effects(self):
        self.visit('index.html#test')
        expect(self.page.locator('#test-panel')).to_contain_text('Karışık test')
        for route in ['profil', 'egitim', 'test', 'profil', 'test', 'egitim', 'profil']:
            self.page.evaluate('route => {location.hash=route}', route)
            expect(self.page.locator('#view-' + route)).to_be_visible()
        expect(self.page.locator('#profile-name')).to_be_visible()
        state = self.page.evaluate('''() => ({
          visible:[...document.querySelectorAll('.view')].filter(e=>!e.hidden).map(e=>e.id),
          stale:window.__motionCalls.filter(c=>c.animation.playState==='running' &&
            (!c.target.isConnected || c.target.closest('[hidden]'))).length,
          focus:document.activeElement.id
        })''')
        self.assertEqual(state['visible'], ['view-profil'])
        self.assertEqual(state['stale'], 0, state)
        self.assertEqual(state['focus'], 'view-profil')


if __name__ == '__main__':
    unittest.main(argv=['v070_motion_browser.py'] + TEST_ARGS)
