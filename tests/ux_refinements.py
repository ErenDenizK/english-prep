#!/usr/bin/env python3
"""Focused UI regressions: field focus, reader navigation and report outcomes."""
import argparse
import re
import unittest
from playwright.sync_api import expect, sync_playwright

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base-url', default='http://127.0.0.1:8001')
parser.add_argument('--browser-path', default='/usr/bin/chromium')
ARGS, TEST_ARGS = parser.parse_known_args()
BASE = ARGS.base_url.rstrip('/')
LESSON = 'tenses-present-simple-vs-present-continuous'


class UXRefinementTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        cls.browser = cls.pw.chromium.launch(executable_path=ARGS.browser_path, args=['--no-sandbox'])

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()

    def setUp(self):
        self.context = self.browser.new_context(viewport={'width': 390, 'height': 844}, color_scheme='dark', reduced_motion='reduce', service_workers='block')
        self.page = self.context.new_page()
        self.page.set_default_timeout(8000)
        self.errors = []
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [])

    def open_check(self):
        self.page.goto(BASE + '/index.html#egitim/' + LESSON)
        self.page.locator('.lesson-pretest summary').click()
        option = self.page.locator('[data-check="-1"] .option').first
        option.focus()
        option.press('Enter')
        expect(self.page.locator('[data-check="-1"] .feedback')).to_be_visible()
        return self.page.locator('[data-check="-1"] .feedback__report')

    def test_profile_tab_change_and_caret_survive_derived_rerender(self):
        self.page.goto(BASE + '/index.html#profil')
        name = self.page.locator('#profile-name')
        name.fill('Ada')
        name.press('Tab')
        backup = self.page.get_by_role('button', name='Yedek al', exact=True)
        expect(backup).to_be_focused()
        expect(self.page.locator('#profile-container h1')).to_have_text('Ada')
        expect(backup).to_be_focused()
        name.fill('Ada Lovelace')
        name.evaluate('node => { node.focus(); node.setSelectionRange(4, 8, "backward"); node.dispatchEvent(new Event("change", {bubbles:true})); }')
        expect(self.page.locator('#profile-container h1')).to_have_text('Ada Lovelace')
        self.assertEqual(name.evaluate('node => [document.activeElement === node, node.selectionStart, node.selectionEnd, node.selectionDirection]'), [True, 4, 8, 'backward'])
        expect(self.page.locator('#profile-exam-date, #profile-goal-label')).to_have_count(0)
        # A user can move to a generated listbox before the async repaint.
        # Its internal value ID changes, but the persistent field label does not.
        name.evaluate('node => { node.value = "Ada L."; node.dispatchEvent(new Event("change", {bubbles:true})); document.querySelector("#profile-container [role=combobox]").focus(); }')
        expect(self.page.locator('#profile-container h1')).to_have_text('Ada L.')
        expect(self.page.locator('#profile-container [role="combobox"]')).to_be_focused()

    def test_answered_reader_check_retains_keyboard_position(self):
        self.open_check()
        chosen = self.page.locator('[data-check="-1"] .option--picked')
        expect(chosen).to_be_focused()
        expect(chosen).to_have_attribute('aria-disabled', 'true')
        expect(self.page.locator('.lesson-pretest')).to_have_attribute('open', '')
        self.page.keyboard.press('Tab')
        self.assertNotEqual(self.page.evaluate('document.activeElement.tagName'), 'BODY')

    def test_late_lesson_and_topic_loads_cannot_replace_profile_chrome(self):
        self.page.add_init_script('''const realFetch = window.fetch;
          window.__delayedDone = false; window.__delayedStarted = false;
          window.fetch = (...args) => realFetch(...args).then(async response => {
            if (String(args[0]).includes('data/tenses/')) {
              window.__delayedStarted = true;
              await new Promise(resolve => setTimeout(resolve, 450));
              window.__delayedDone = true;
            }
            return response;
          });''')
        for route in ['egitim/' + LESSON, 'egitim/konu/tenses']:
            with self.subTest(route=route):
                self.page.goto(BASE + '/index.html#egitim')
                expect(self.page.locator('#index-filter')).to_be_visible()
                self.page.evaluate('(route) => location.hash = route', route)
                self.page.wait_for_function('window.__delayedStarted')
                self.page.evaluate('location.hash = "profil"')
                expect(self.page.locator('#profile-name')).to_be_visible()
                self.page.wait_for_function('window.__delayedDone')
                self.page.wait_for_timeout(60)
                expect(self.page.locator('.bar__title')).to_have_text('Profil')
                expect(self.page.locator('#bottom-nav')).to_be_visible()
                expect(self.page.locator('#view-egitim')).to_be_hidden()
                self.assertFalse(self.page.locator('body').evaluate('node => node.classList.contains("is-reading")'))

    def test_report_cancel_and_failure_are_retryable_without_silent_copy(self):
        self.page.add_init_script('''window.__shareCalls = 0; window.__copies = 0;
          Object.defineProperty(navigator, 'share', {configurable:true, value: async () => {
            window.__shareCalls++;
            if (window.__shareCalls === 1) throw new DOMException('cancel', 'AbortError');
            throw new Error('unavailable');
          }});
          Object.defineProperty(navigator, 'clipboard', {configurable:true, value:{writeText:async () => {
            window.__copies++;
            if(window.__copies === 1) throw new Error('blocked');
          }}});''')
        report = self.open_check()
        report.click()
        expect(report).to_contain_text('Paylaşım iptal edildi.')
        self.assertEqual(self.page.evaluate('window.__copies'), 0)
        expect(report).not_to_have_attribute('aria-disabled', 'true')
        report.click()
        expect(report).to_contain_text('Kopyalanamadı.')
        expect(report).not_to_have_attribute('aria-disabled', 'true')
        report.click()
        expect(report).to_contain_text('Kopyalandı')
        self.assertEqual(self.page.evaluate('window.__shareCalls'), 3)
        self.assertEqual(self.page.evaluate('window.__copies'), 2)

    def test_cancelled_backup_does_not_claim_saved_or_shared(self):
        self.page.add_init_script('''Object.defineProperty(navigator, 'canShare', {configurable:true, value:() => true});
          Object.defineProperty(navigator, 'share', {configurable:true, value:async () => {throw new DOMException('cancel', 'AbortError');}});''')
        self.page.goto(BASE + '/index.html#profil')
        backup = self.page.get_by_role('button', name='Yedek al', exact=True)
        backup.click()
        expect(backup.locator('..').get_by_role('status')).to_have_text('Paylaşım iptal edildi.')

    def test_topic_labels_match_launched_test_instead_of_entire_pool(self):
        self.page.goto(BASE + '/index.html#test')
        topic = self.page.get_by_role('button', name=re.compile('^Tenses Test:'))
        expect(topic).to_contain_text('Test: 15 soru · Havuz: 25')
        topic.click()
        expect(self.page.locator('#question-stem')).to_be_visible()
        self.assertEqual(self.page.evaluate('JSON.parse(sessionStorage.getItem("englishPrep.activeQuiz")).order.length'), 15)

    def test_completed_review_has_unique_question_stem_ids(self):
        self.page.goto(BASE + '/index.html#test')
        self.page.get_by_role('combobox', name=re.compile('^Soru sayısı')).click()
        self.page.get_by_role('option', name='5', exact=True).click()
        self.page.get_by_role('button', name='Teste başla', exact=True).click()
        for _ in range(5):
            expect(self.page.locator('#question-stem')).to_be_visible()
            self.page.locator('.option').first.click()
            self.page.locator('#quiz-bar .btn--primary').click()
        expect(self.page.locator('.score')).to_be_visible()
        stems = self.page.locator('[id^="question-stem"]')
        expect(stems).to_have_count(5)
        ids = stems.evaluate_all('nodes => nodes.map(node => node.id)')
        self.assertEqual(len(ids), len(set(ids)))


if __name__ == '__main__':
    unittest.main(argv=['ux_refinements.py', *TEST_ARGS], verbosity=2)
