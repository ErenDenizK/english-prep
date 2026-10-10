#!/usr/bin/env python3
"""Quiz persistence regressions. Run against a local HTTP server."""
import json
from pathlib import Path
import re
import unittest

from playwright.sync_api import expect, sync_playwright

from _harness import launch_chromium, make_parser

parser = make_parser(__doc__)
ARGS, TEST_ARGS = parser.parse_known_args()
BASE = ARGS.base_url.rstrip('/')
ROOT = Path(__file__).resolve().parents[1]
MANIFEST = json.loads((ROOT / 'data/manifest.json').read_text())
TOPICS = [t for t in MANIFEST['topics'] if not t.get('comingSoon')]
QUESTIONS = {}
for topic in TOPICS:
    for q in json.loads((ROOT / topic['file']).read_text())['questions']:
        QUESTIONS[q['id']] = {**q, 'topicId': topic['id'], 'correctAnswer': q['options'][q['correctIndex']]}


class QuizResumeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        cls.browser = launch_chromium(cls.pw, ARGS)

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()

    def setUp(self):
        self.context = self.browser.new_context(viewport={'width': 390, 'height': 844}, reduced_motion='reduce', service_workers='block', timezone_id='Europe/Istanbul')
        self.page = self.context.new_page()
        self.page.set_default_timeout(8000)
        self.errors = []
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [])

    def stored(self, key, kind='sessionStorage'):
        return self.page.evaluate('([kind,key]) => JSON.parse(window[kind].getItem(key))', [kind, key])

    def active(self):
        return self.stored('englishPrep.activeQuiz')

    def history(self):
        return (self.stored('englishPrep.history', 'localStorage') or {'attempts': []})['attempts']

    def launch(self, mode='mixed', count=5):
        self.page.goto(BASE + '/index.html#test')
        expect(self.page.locator('#test-panel')).to_contain_text('Karışık test')
        topic = TOPICS[0]
        category = QUESTIONS[next(iter(QUESTIONS))]['category']
        self.page.evaluate('''async ({mode,count,topic,category}) => {
          const launch = await import('./js/quiz-launch.js');
          if (mode === 'mixed') await launch.startMixedTest(count);
          else if (mode === 'topic') await launch.startTopicTest(topic, count);
          else if (mode === 'category') await launch.startCategoryPractice(category, count);
          else await launch.startMistakeBook(count);
        }''', {'mode': mode, 'count': count, 'topic': topic['id'], 'category': category})
        expect(self.page.locator('#question-stem')).to_be_visible()

    def answer(self, correct=True):
        snapshot = self.active()
        question = snapshot['order'][snapshot['currentIndex']]
        right = QUESTIONS[question['id']]['correctAnswer']
        answer = right if correct else next(value for value in question['options'] if value != right)
        self.page.locator('.option').nth(question['options'].index(answer)).click()
        expect(self.page.locator('.feedback__verdict')).to_have_text('Doğru' if correct else 'Yanlış')

    def test_wrong_feedback_refresh_and_pagehide_resume_finish_once(self):
        self.launch()
        self.answer(correct=False)
        saved = self.active()
        self.page.reload()
        expect(self.page.locator('.feedback__verdict')).to_have_text('Yanlış')
        self.assertEqual(self.active(), saved)
        self.assertEqual(len(self.history()), 1)
        self.page.reload()
        expect(self.page.locator('.feedback__verdict')).to_have_text('Yanlış')
        self.assertEqual(self.active(), saved)
        self.assertEqual(len(self.history()), 1)

        self.page.goto(BASE + '/index.html#test')
        self.page.go_back()
        expect(self.page.locator('.feedback__verdict')).to_have_text('Yanlış')
        self.assertEqual(self.active(), saved)
        self.page.get_by_role('button', name='Sonraki soru', exact=True).click()
        unanswered = self.active()
        self.page.reload()
        expect(self.page.locator('.option')).to_have_count(4)
        self.assertEqual(self.active(), unanswered)
        self.assertEqual(self.active()['currentIndex'], 1)
        for index in range(1, 5):
            self.answer()
            self.page.get_by_role('button', name='Sonuçları gör' if index == 4 else 'Sonraki soru', exact=True).click()
        expect(self.page).to_have_url(re.compile('/results.html$'))
        expect(self.page.locator('.score')).to_contain_text('4 / 5')
        self.assertIsNone(self.active())
        self.assertEqual(len(self.history()), 1)
        self.assertEqual(len(self.history()[0]['questions']), 5)
        self.assertEqual(self.history()[0]['id'], saved['attemptId'])
        self.page.reload()
        expect(self.page.locator('.score')).to_contain_text('4 / 5')
        self.assertEqual(len(self.history()), 1)
        self.assertEqual(len(self.history()[0]['questions']), 5)

    def test_explicit_launch_replaces_even_an_identical_request(self):
        self.launch()
        self.answer(correct=False)
        old = self.active()
        self.launch()
        fresh = self.active()
        self.assertNotEqual(old['attemptId'], fresh['attemptId'])
        self.assertEqual(fresh['currentIndex'], 0)
        self.assertEqual(fresh['selectedAnswers'], [None] * 5)
        self.assertEqual(len(self.history()), 1)
        self.assertEqual(self.history()[0]['id'], old['attemptId'])

    def test_think_first_reveal_survives_refresh(self):
        self.page.goto(BASE + '/index.html#test')
        self.page.evaluate("localStorage.setItem('englishPrep.settings', JSON.stringify({thinkFirst:true}))")
        self.launch()
        expect(self.page.get_by_role('button', name='Şıkları göster')).to_be_visible()
        self.page.reload()
        expect(self.page.get_by_role('button', name='Şıkları göster')).to_be_visible()
        self.page.get_by_role('button', name='Şıkları göster').click()
        revealed = self.active()
        self.page.reload()
        expect(self.page.locator('.option')).to_have_count(4)
        self.assertEqual(self.active(), revealed)

    def test_topic_and_category_requests_restore_their_scoped_order(self):
        for mode in ['topic', 'category']:
            with self.subTest(mode=mode):
                self.launch(mode=mode)
                saved = self.active()
                self.assertEqual(saved['request']['mode'], mode)
                self.page.reload()
                expect(self.page.locator('.option')).to_have_count(4)
                self.assertEqual(self.active(), saved)

    def test_mistake_book_request_restores_without_reselecting_ids(self):
        self.launch(count=5)
        self.answer(correct=False)
        self.page.get_by_role('button', name='Bitir', exact=True).click()
        expect(self.page).to_have_url(re.compile('/results.html$'))
        self.launch(mode='mistakes', count='all')
        saved = self.active()
        self.assertEqual(saved['request']['mode'], 'mistakes')
        self.assertEqual(len(saved['order']), 1)
        self.page.reload()
        expect(self.page.locator('.option')).to_have_count(4)
        self.assertEqual(self.active(), saved)

    def test_malformed_request_and_result_return_to_home_without_crash(self):
        self.page.goto(BASE + '/index.html#test')
        self.page.evaluate("sessionStorage.setItem('englishPrep.quizRequest', '{broken')")
        self.page.goto(BASE + '/quiz.html')
        expect(self.page).to_have_url(re.compile('/index.html$'))
        self.page.evaluate("sessionStorage.setItem('englishPrep.quizResult', JSON.stringify({mode:'mixed'}))")
        self.page.goto(BASE + '/results.html')
        expect(self.page).to_have_url(re.compile('/index.html$'))

    def test_malformed_active_snapshot_starts_a_safe_new_session(self):
        self.launch()
        old = self.active()['attemptId']
        self.page.add_init_script("sessionStorage.setItem('englishPrep.activeQuiz', '{broken')")
        self.page.reload()
        expect(self.page.locator('.option')).to_have_count(4)
        self.assertNotEqual(self.active()['attemptId'], old)
        self.assertEqual(self.active()['selectedAnswers'], [None] * 5)

    def test_resume_across_local_midnight_preserves_each_answer_day(self):
        self.page.add_init_script('''(() => {
          const OriginalDate = Date;
          const now = () => Number(sessionStorage.getItem('test.clock') || OriginalDate.now());
          window.Date = class extends OriginalDate {
            constructor(...args) { super(...(args.length ? args : [now()])); }
            static now() { return now(); }
          };
        })()''')
        self.page.goto(BASE + '/index.html#test')
        first = '2026-10-02T20:59:00.000Z'  # 23:59 in Istanbul
        second = '2026-10-02T21:01:00.000Z'  # 00:01 on the following local day
        self.page.evaluate("at => sessionStorage.setItem('test.clock', Date.parse(at))", first)
        self.launch(count=2)
        self.answer(correct=False)
        self.page.reload()
        expect(self.page.locator('.feedback__verdict')).to_have_text('Yanlış')
        self.page.evaluate("at => sessionStorage.setItem('test.clock', Date.parse(at))", second)
        self.page.get_by_role('button', name='Sonraki soru', exact=True).click()
        self.answer(correct=True)
        self.assertEqual(self.active()['answeredAt'], [first, second])
        self.page.get_by_role('button', name='Sonuçları gör', exact=True).click()
        expect(self.page).to_have_url(re.compile('/results.html$'))
        history = self.history()
        self.assertEqual(len(history), 1)
        self.assertEqual(history[0]['date'], first)
        self.assertEqual([q['answeredAt'] for q in history[0]['questions']], [first, second])
        self.assertEqual([q['answeredAt'] for q in self.stored('englishPrep.quizResult')['questionResults']], [first, second])
        counts = self.page.evaluate('''async ([first,second]) => {
          const storage = await import('./js/storage.js');
          return {before:storage.getTodayCount(Date.parse(first)), after:storage.getTodayCount(Date.parse(second)),
            streak:storage.getStreak(Date.parse(second))};
        }''', [first, second])
        self.assertEqual(counts['before'], 1)
        self.assertEqual(counts['after'], 1)
        self.assertEqual(counts['streak'], {'days': 2, 'activeToday': True})

    def test_results_retries_a_one_time_history_write_failure_with_same_id(self):
        self.launch(count=2)
        self.answer(correct=False)
        self.page.reload()  # save a one-answer prefix first
        expect(self.page.locator('.feedback__verdict')).to_have_text('Yanlış')
        attempt_id = self.active()['attemptId']
        self.page.get_by_role('button', name='Sonraki soru', exact=True).click()
        self.answer()
        self.page.evaluate('''() => {
          const set = Storage.prototype.setItem;
          let failed = false;
          Storage.prototype.setItem = function(key,value) {
            if (this === localStorage && key === 'englishPrep.history' && !failed) {
              failed = true;
              throw new DOMException('Test quota failure', 'QuotaExceededError');
            }
            return set.call(this,key,value);
          };
        }''')
        self.page.get_by_role('button', name='Sonuçları gör', exact=True).click()
        expect(self.page).to_have_url(re.compile('/results.html$'))
        expect(self.page.locator('.score')).to_contain_text('1 / 2')
        self.assertEqual(len(self.history()), 1)
        self.assertEqual(self.history()[0]['id'], attempt_id)
        self.assertEqual(len(self.history()[0]['questions']), 2)
        self.assertFalse(self.history()[0]['partial'])
        self.assertTrue(self.stored('englishPrep.quizResult')['recorded'])

    def test_results_keeps_failed_handoff_pending_until_storage_recovers(self):
        self.page.add_init_script('''(() => {
          const set = Storage.prototype.setItem;
          Storage.prototype.setItem = function(key,value) {
            if (this === localStorage && key === 'englishPrep.history'
              && sessionStorage.getItem('test.failHistoryWrites') === '1') {
              throw new DOMException('Test quota failure', 'QuotaExceededError');
            }
            return set.call(this,key,value);
          };
        })()''')
        self.launch(count=2)
        self.answer(correct=False)
        self.page.reload()
        expect(self.page.locator('.feedback__verdict')).to_have_text('Yanlış')
        attempt_id = self.active()['attemptId']
        self.page.get_by_role('button', name='Sonraki soru', exact=True).click()
        self.answer()
        self.page.evaluate("sessionStorage.setItem('test.failHistoryWrites','1')")
        self.page.get_by_role('button', name='Sonuçları gör', exact=True).click()
        expect(self.page).to_have_url(re.compile('/results.html$'))
        expect(self.page.locator('.score')).to_contain_text('1 / 2')
        self.assertFalse(self.stored('englishPrep.quizResult')['recorded'])
        expect(self.page.locator('.results-save-warning')).to_contain_text('kaydedilemedi')
        self.assertEqual(len(self.history()), 1)
        self.assertEqual(len(self.history()[0]['questions']), 1)
        self.page.evaluate("sessionStorage.removeItem('test.failHistoryWrites')")
        self.page.reload()
        expect(self.page.locator('.score')).to_contain_text('1 / 2')
        self.assertTrue(self.stored('englishPrep.quizResult')['recorded'])
        expect(self.page.locator('.results-save-warning')).to_have_count(0)
        self.assertEqual(len(self.history()), 1)
        self.assertEqual(self.history()[0]['id'], attempt_id)
        self.assertEqual(len(self.history()[0]['questions']), 2)


if __name__ == '__main__':
    unittest.main(argv=['quiz_resume_browser.py', *TEST_ARGS])
