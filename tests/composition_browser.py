#!/usr/bin/env python3
"""Header geometry and honest result presentation at real responsive sizes.

These checks render actual application components and score real-bank questions.
They do not modify teaching material or assert physical-device certification.
"""
import argparse
import unittest
from playwright.sync_api import expect, sync_playwright

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base-url', default='http://127.0.0.1:8000')
parser.add_argument('--browser-path', default='/usr/bin/chromium')
ARGS, TEST_ARGS = parser.parse_known_args()
BASE = ARGS.base_url.rstrip('/')
LESSON = 'tenses-present-perfect-vs-past-simple'

GEOMETRY = '''() => {
  const rect = q => {const r=document.querySelector(q).getBoundingClientRect();
    return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,center:r.left+r.width/2}};
  return {viewport:innerWidth,document:document.documentElement.scrollWidth,
    title:rect('.bar__title'),lead:rect('.bar__lead'),trail:rect('.bar__trail'),
    header:rect('#shell-header'),scroll:rect('#shell-scroll')};
}'''


class CompositionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        cls.browser = cls.pw.chromium.launch(executable_path=ARGS.browser_path, args=['--no-sandbox'])

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()

    def setUp(self):
        self.context = self.browser.new_context(viewport={'width': 390, 'height': 844},
            color_scheme='dark', reduced_motion='reduce', service_workers='block')
        self.page = self.context.new_page()
        self.page.set_default_timeout(8000)
        self.errors = []
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [])

    def assert_header_geometry(self):
        geometry = self.page.evaluate(GEOMETRY)
        self.assertLessEqual(abs(geometry['title']['center'] - geometry['viewport'] / 2), .6, geometry)
        self.assertLessEqual(geometry['lead']['right'], geometry['title']['left'] + .6, geometry)
        self.assertGreaterEqual(geometry['trail']['left'], geometry['title']['right'] - .6, geometry)
        self.assertLessEqual(geometry['document'], geometry['viewport'] + 1, geometry)
        return geometry

    def test_titles_keep_one_center_through_library_profile_and_reader(self):
        for width in [320, 390, 768, 1440]:
            self.page.set_viewport_size({'width': width, 'height': 900})
            for route, selector in [('egitim', '#index-list .tile'), ('test', '#test-panel .practice-card'),
                                    ('profil', '.profile-identity'), ('egitim/' + LESSON, '.lesson__head')]:
                with self.subTest(width=width, route=route):
                    self.page.goto(BASE + '/index.html#' + route)
                    expect(self.page.locator(selector).first).to_be_visible()
                    self.page.evaluate('document.fonts.ready')
                    self.assert_header_geometry()
                    # The actual click target and accessible destination remain.
                    back = self.page.locator('.bar__lead > .btn')
                    if back.count():
                        self.assertTrue(back.get_attribute('aria-label'))
                        self.assertGreaterEqual(back.bounding_box()['width'], 44)
                    else:
                        expect(self.page.locator('.bar__lead [aria-label="English Prep"]')).to_be_visible()

    def test_mobile_header_retains_full_control_names_with_enlarged_text(self):
        self.page.set_viewport_size({'width': 320, 'height': 700})
        self.page.goto(BASE + '/index.html#egitim/' + LESSON)
        expect(self.page.locator('.lesson__head')).to_be_visible()
        self.page.add_style_tag(content='html { font-size: 200%; }')
        self.assert_header_geometry()
        expect(self.page.get_by_role('button', name='Dersler', exact=True)).to_be_visible()
        back = self.page.get_by_role('button', name='Dersler', exact=True)
        back.click()
        expect(self.page.locator('#index-filter')).to_be_visible()
        self.assert_header_geometry()
        self.assertLessEqual(self.page.locator('.bar__lead .brand-mark').bounding_box()['height'],
                             self.page.locator('#shell-header').bounding_box()['height'])

    def test_quiz_header_stays_centred_when_exit_becomes_finish(self):
        for width in [320, 390, 768, 1440]:
            with self.subTest(width=width):
                self.page.set_viewport_size({'width': width, 'height': 900})
                self.page.goto(BASE + '/index.html#test')
                self.page.evaluate('''() => {
                  setTimeout(async () => {
                    const {startTopicTest}=await import('./js/quiz-launch.js');
                    await startTopicTest('connectors', 2);
                  }, 0);
                }''')
                expect(self.page.locator('#question-stem')).to_be_visible()
                expect(self.page.get_by_role('button', name='Çık', exact=True)).to_be_visible()
                before = self.assert_header_geometry()
                self.page.locator('.option').first.click()
                expect(self.page.get_by_role('button', name='Bitir', exact=True)).to_be_visible()
                after = self.assert_header_geometry()
                self.assertEqual(before['title']['center'], after['title']['center'])

    def make_result(self, correct=False, partial=False):
        self.page.goto(BASE + '/index.html#test')
        expect(self.page.locator('#test-panel')).to_be_visible()
        success = self.page.evaluate('''async ({correct,partial}) => {
          const {scoreSession} = await import('./js/quiz-engine.js');
          const {setQuizResult} = await import('./js/session-state.js');
          const data = await (await fetch('./data/tenses/tenses.json')).json();
          const source = data.questions[0];
          const question = {...source, topicId:'tenses', prompt:source.prompt ?? source.paragraph,
            correctAnswer:source.options[source.correctIndex]};
          const selected = correct ? question.correctAnswer : question.options.find(o=>o!==question.correctAnswer);
          return setQuizResult({...scoreSession([question],[selected]),
            id:'composition-'+correct+'-'+partial, date:'2026-10-04T09:00:00.000Z',
            mode:'topic', topicTitles:{tenses:'Tenses'}, recorded:true, partial});
        }''', {'correct': correct, 'partial': partial})
        self.assertTrue(success)
        self.page.goto(BASE + '/results.html')
        expect(self.page.locator('.score')).to_be_visible()

    def test_zero_and_correct_scores_keep_value_and_use_distinct_honest_artwork(self):
        for width in [320, 390, 768, 1440]:
            for correct in [False, True]:
                with self.subTest(width=width, correct=correct):
                    self.page.set_viewport_size({'width': width, 'height': 900})
                    self.make_result(correct)
                    self.assert_header_geometry()
                    expect(self.page.locator('.score .metric__value')).to_have_text('1 / 1' if correct else '0 / 1')
                    expect(self.page.locator('.score [role="progressbar"]')).to_have_attribute('aria-valuenow', '100' if correct else '0')
                    expect(self.page.locator('.score__signature')).to_have_attribute('data-symbol', 'confirmed' if correct else 'review')
                    expect(self.page.locator('.score__status')).to_have_text('Test tamamlandı')
                    colors = self.page.evaluate('''() => ({number:getComputedStyle(document.querySelector('.score .metric__value')).color,
                        text:getComputedStyle(document.querySelector('.score__mode')).color})''')
                    self.assertEqual(colors['number'], colors['text'], colors)
                    value = self.page.locator('.score .metric__value').inner_text()
                    self.page.reload()
                    expect(self.page.locator('.score .metric__value')).to_have_text(value)
                    self.assertIsNone(self.page.evaluate('localStorage.getItem("englishPrep.history")'))

    def test_partial_folio_and_long_identity_reflow_without_a_score_change(self):
        self.page.set_viewport_size({'width': 320, 'height': 700})
        self.make_result(correct=False, partial=True)
        expect(self.page.locator('.score__signature')).to_have_attribute('data-symbol', 'return')
        expect(self.page.locator('.score__status')).to_have_text('Test erken bitirildi')
        self.page.locator('.score__mode').evaluate("e=>e.textContent='Connectors & Discourse Markers'")
        self.page.add_style_tag(content='html { font-size: 200%; }')
        self.assert_header_geometry()
        signature = self.page.locator('.score__signature').bounding_box()
        identity = self.page.locator('.score__identity').bounding_box()
        self.assertLessEqual(signature['x'] + signature['width'], identity['x'])
        expect(self.page.locator('.score .metric__value')).to_have_text('0 / 1')


if __name__ == '__main__':
    unittest.main(argv=[__file__] + TEST_ARGS)
