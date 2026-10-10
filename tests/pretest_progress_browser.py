#!/usr/bin/env python3
"""Behavioral coverage for default-open preliminary practice and article bookmarks."""
import json
import unittest
from playwright.sync_api import expect, sync_playwright

from _harness import launch_chromium, make_parser

parser = make_parser(__doc__)
ARGS, TEST_ARGS = parser.parse_known_args()
BASE = ARGS.base_url.rstrip('/')
LESSON = 'closest-meaning-unless-vs-if-not-vs-otherwise'


class PretestProgressTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        cls.browser = launch_chromium(cls.pw, ARGS)

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()

    def setUp(self):
        self.context = self.browser.new_context(viewport={'width': 390, 'height': 844}, reduced_motion='reduce', service_workers='block')
        self.page = self.context.new_page()
        self.page.set_default_timeout(8000)
        self.errors = []
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [])

    def open_lesson(self):
        self.page.goto(BASE + '/index.html#egitim/' + LESSON)
        self.page.locator('[data-reading-start]').wait_for()
        self.page.evaluate('document.fonts.ready')
        self.page.wait_for_timeout(100)

    def saved(self):
        return self.page.evaluate("id => JSON.parse(localStorage.getItem('englishPrep.lessonProgress') || '{}')[id]", LESSON)

    def assert_unread(self):
        saved = self.saved()
        self.assertFalse(saved and saved.get('done'))
        self.assertLessEqual((saved or {}).get('read', 0), 0.001)
        self.assertIsNone(self.page.evaluate("localStorage.getItem('englishPrep.history')"))

    def test_answering_and_reading_pretest_does_not_count_as_article_progress(self):
        for width, height in [(320, 640), (390, 844), (1440, 960)]:
            with self.subTest(width=width):
                self.page.set_viewport_size({'width': width, 'height': height})
                self.page.goto(BASE + '/index.html')
                self.page.evaluate('localStorage.clear()')
                self.open_lesson()
                pretest = self.page.locator('.lesson-pretest')
                expect(pretest).to_have_attribute('open', '')
                self.assert_unread()
                # Pin a fully visible option before recording geometry: the
                # browser driver's scrolling must not count as answer reflow.
                correct_attempt = width == 390
                selected_index = self.page.evaluate('''async correctAttempt => {
                  const data = await (await fetch('./data/closest-meaning/closest-meaning.json')).json();
                  const options = [...document.querySelectorAll('.lesson-pretest .option')].map(n => n.dataset.option);
                  const question = data.questions.find(q => q.options.length === options.length && q.options.every(o => options.includes(o)));
                  const correct = question.options[question.correctIndex];
                  return options.findIndex(option => correctAttempt ? option === correct : option !== correct);
                }''', correct_attempt)
                self.assertGreaterEqual(selected_index, 0)
                option = pretest.locator('.option').nth(selected_index)
                option.scroll_into_view_if_needed()
                before = option.bounding_box()
                option.click()
                expect(pretest.locator('.feedback')).to_be_visible()
                after = pretest.locator('.option').nth(selected_index).bounding_box()
                self.assertAlmostEqual(before['y'], after['y'], delta=1)
                self.assertAlmostEqual(before['height'], after['height'], delta=1)
                expect(pretest).to_have_attribute('open', '')
                expect(pretest.locator('.option--picked.option--ok' if correct_attempt else '.option--picked.option--no')).to_have_count(1)
                self.assert_unread()
                # Read to the last line of the preliminary explanation while
                # leaving the first teaching paragraph below the reading line.
                self.page.evaluate('''() => {
                  const region = document.querySelector('#shell-scroll');
                  const first = document.querySelector('[data-reading-start]');
                  const top = first.getBoundingClientRect().top - region.getBoundingClientRect().top + region.scrollTop;
                  region.scrollTop = top - parseFloat(getComputedStyle(region).scrollPaddingTop) - 4;
                }''')
                self.page.wait_for_timeout(100)
                self.assert_unread()

    def test_skip_collapse_and_saved_body_fraction_resume_without_pretest(self):
        self.open_lesson()
        pretest = self.page.locator('.lesson-pretest')
        pretest.get_by_role('button', name='Derse geç', exact=True).click()
        expect(pretest).not_to_have_attribute('open', '')
        expect(self.page.locator('[data-reading-start]')).to_be_focused()
        self.assert_unread()
        expect(pretest.locator('.option--picked')).to_have_count(0)
        # An ordinary manual read, not a direct storage write, creates the
        # bookmark. The reported reading fraction must survive pretest removal.
        self.page.evaluate('''() => {
          const region = document.querySelector('#shell-scroll');
          region.scrollTop += (region.scrollHeight - region.clientHeight - region.scrollTop) * 0.42;
        }''')
        self.page.wait_for_timeout(150)
        previous = self.saved()['read']
        self.assertAlmostEqual(previous, 0.42, delta=0.005)
        self.page.goto(BASE + '/index.html#egitim')
        expect(self.page.locator('.study-intro__progress [role=progressbar]')).to_have_attribute('aria-valuenow', '42')
        self.assertNotIn('%', self.page.locator('.study-intro__summary').inner_text())
        self.page.set_viewport_size({'width': 1440, 'height': 960})
        self.open_lesson()
        expect(self.page.locator('.lesson-pretest')).to_have_count(0)
        restored = self.page.evaluate('''() => {
          const region = document.querySelector('#shell-scroll');
          const first = document.querySelector('[data-reading-start]');
          const start = first.getBoundingClientRect().top - region.getBoundingClientRect().top + region.scrollTop - parseFloat(getComputedStyle(region).scrollPaddingTop);
          return (region.scrollTop - start) / (region.scrollHeight - region.clientHeight - start);
        }''')
        self.assertAlmostEqual(restored, previous, delta=0.005)
        self.page.evaluate('document.querySelector("#shell-scroll").scrollTop = 1e9')
        self.page.wait_for_timeout(150)
        self.assertTrue(self.saved()['done'])
        self.page.reload()
        self.page.locator('[data-reading-start]').wait_for()
        expect(self.page.locator('.lesson-pretest')).to_have_count(0)
        self.assertLessEqual(self.page.evaluate('document.querySelector("#shell-scroll").scrollTop'), 1)

    def test_short_body_is_not_completed_while_long_pretest_is_above_it(self):
        def shorten_article(route):
            response = route.fetch()
            data = response.json()
            for lesson in data['lessons']:
                if lesson['category'] == 'Unless vs If Not vs Otherwise':
                    lesson['blocks'] = [{'type': 'text', 'body': 'Koşul ile sonucu birbirinden ayır.'}]
                    lesson['summary'] = 'Kısa bir karşılaştırma.'
            route.fulfill(response=response, body=json.dumps(data))
        self.page.route('**/data/closest-meaning/closest-meaning.json', shorten_article)
        self.page.set_viewport_size({'width': 1440, 'height': 960})
        self.open_lesson()
        expect(self.page.locator('.lesson-pretest')).to_have_attribute('open', '')
        self.assert_unread()
        self.page.locator('.lesson-pretest .option').first.click()
        self.page.wait_for_timeout(100)
        self.assert_unread()
        self.page.evaluate('document.querySelector("#shell-scroll").scrollTop = 1e9')
        self.page.wait_for_timeout(100)
        self.assertTrue(self.saved()['done'])


if __name__ == '__main__':
    unittest.main(argv=[__file__] + TEST_ARGS, verbosity=2)
