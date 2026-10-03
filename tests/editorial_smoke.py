#!/usr/bin/env python3
"""Browser regressions for the article-based app. Start npm run serve first."""
import argparse
import json
from pathlib import Path
import re
import sys
import unittest
from urllib.parse import quote, urlsplit

from playwright.sync_api import expect, sync_playwright

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base-url', default='http://127.0.0.1:8000')
parser.add_argument('--browser-path', default='/usr/bin/chromium')
ARGS, TEST_ARGS = parser.parse_known_args()
BASE = ARGS.base_url.rstrip('/')
TOPICS = [t for t in json.loads((ROOT/'data/manifest.json').read_text())['topics'] if not t.get('comingSoon')]
DATA = {t['id']: json.loads((ROOT/t['file']).read_text()) for t in TOPICS}
QUESTIONS = {}
LESSONS = []
for topic in TOPICS:
    data = DATA[topic['id']]
    for q in data['questions']:
        prompt = q.get('paragraph', q.get('prompt', q.get('sentence')))
        QUESTIONS[prompt] = {**q, 'topicId': topic['id'], 'correctAnswer': q['options'][q['correctIndex']]}
    for lesson in data['lessons']:
        slug = re.sub('[^a-z0-9]+', '-', lesson['category'].lower()).strip('-')
        LESSONS.append({**lesson, 'topicId': topic['id'], 'id': topic['id']+'-'+slug})


def norm(text):
    return re.sub(r'\s+', '', text.replace('*', ''))


def strings(value):
    if isinstance(value, str):
        yield value
    elif isinstance(value, list):
        for entry in value:
            yield from strings(entry)
    elif isinstance(value, dict):
        for key, entry in value.items():
            if key != 'type':
                yield from strings(entry)


class EditorialBrowserTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        cls.browser = cls.pw.chromium.launch(executable_path=ARGS.browser_path, args=['--no-sandbox'])

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()

    def setUp(self):
        self.context = self.browser.new_context(viewport={'width': 390, 'height': 844}, reduced_motion='reduce', service_workers='block')
        self.page = self.context.new_page()
        self.page.set_default_timeout(8000)
        self.errors = []
        self.check_geometry = False
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [], 'Uncaught application errors')

    def visit(self, path='index.html#egitim'):
        self.page.goto(BASE+'/'+path)

    def storage(self, key, kind='localStorage'):
        return self.page.evaluate('([kind,key]) => JSON.parse(window[kind].getItem(key))', [kind,key])

    def history(self):
        return (self.storage('englishPrep.history') or {'attempts': []})['attempts']

    def open_lesson(self, lesson=LESSONS[0]):
        self.visit('index.html#egitim/'+lesson['id'])
        expect(self.page.locator('#lesson-reader h1')).to_have_text(lesson['category'])
        expect(self.page.locator('#lesson-reader .lesson')).to_be_visible()

    def choose_count(self, label, count):
        combo = self.page.get_by_role('combobox', name=re.compile('^'+re.escape(label)))
        combo.click()
        self.page.get_by_role('option', name=str(count), exact=True).click()

    def start_mixed(self, count=5):
        self.visit('index.html#test')
        self.choose_count('Soru sayısı', count)
        self.page.get_by_role('button', name='Teste başla', exact=True).click()
        expect(self.page.locator('#question-stem')).to_be_visible()

    def current_question(self):
        prompt = self.page.locator('#question-stem').text_content().replace('boşluk', '____')
        self.assertIn(prompt, QUESTIONS)
        return QUESTIONS[prompt]

    def answer(self, correct=True):
        q = self.current_question()
        choice = q['correctAnswer'] if correct else next(v for v in q['options'] if v != q['correctAnswer'])
        before = self.page.locator('#quiz-bar').bounding_box()
        self.page.locator('.option').filter(has=self.page.locator('.option__text', has_text=re.compile('^'+re.escape(choice)+'$'))).click()
        expect(self.page.locator('.feedback')).to_be_visible()
        text = norm(self.page.locator('.feedback').text_content())
        self.assertIn(norm(q['explanation']), text)
        if not correct and q.get('optionNotes', {}).get(choice):
            self.assertIn(norm(q['optionNotes'][choice]), text)
        expect(self.page.locator('.option[aria-disabled="true"]')).to_have_count(4)
        after = self.page.locator('#quiz-bar').bounding_box()
        if self.check_geometry:
            self.assertAlmostEqual(before['y'], after['y'], delta=1)
        return {**q, 'selectedAnswer': choice, 'correct': correct}

    def complete(self, correct=lambda index: index % 2 == 0):
        readout = self.page.locator('#shell-header .strip__readout').inner_text()
        total = int(readout.split('/')[-1].strip())
        answered = []
        for index in range(total):
            expect(self.page.locator('#shell-header .strip__readout')).to_have_text(f'{index+1} / {total}')
            answered.append(self.answer(correct(index)))
            self.page.locator('#quiz-bar .btn--primary').click()
        self.page.wait_for_url('**/results.html')
        expect(self.page.locator('#results-container .score')).to_be_visible()
        result = self.storage('englishPrep.quizResult', 'sessionStorage')
        self.assertEqual(result['totalCount'], total)
        self.assertEqual(result['correctCount'], sum(q['correct'] for q in answered))
        self.assertEqual([q['id'] for q in result['questionResults']], [q['id'] for q in answered])
        expect(self.page.locator('#results-container article')).to_have_count(total)
        review = norm(self.page.locator('#results-container').text_content())
        for q in answered:
            self.assertIn(norm(q['explanation']), review)
        return answered, result

    def assert_geometry(self):
        box = self.page.evaluate('''() => ({width:innerWidth, doc:document.documentElement.scrollWidth,
            body:document.body.scrollWidth, shell:document.querySelector('#shell-scroll').scrollWidth,
            shellWidth:document.querySelector('#shell-scroll').clientWidth})''')
        self.assertLessEqual(max(box['doc'], box['body']), box['width']+1, box)
        self.assertLessEqual(box['shell'], box['shellWidth']+1, box)
        self.assertEqual(self.page.evaluate('window.scrollY'), 0)

    def test_library_all_topic_intros_and_every_article_preserves_content(self):
        self.page.set_viewport_size({'width': 320, 'height': 720})
        self.visit()
        expect(self.page.locator('#index-list .tile')).to_have_count(len(TOPICS))
        self.assertNotIn('hosgeldin', self.page.url)
        for topic in TOPICS:
            with self.subTest(topic=topic['id']):
                self.visit('index.html#egitim/konu/'+topic['id'])
                expect(self.page.locator('#lesson-reader h1')).to_have_text(DATA[topic['id']]['intro']['title'])
                expect(self.page.locator('#lesson-reader .row')).to_have_count(topic['lessonCount']+1)
                for part in DATA[topic['id']]['intro']['parts']:
                    self.assertIn(part['name'], self.page.locator('#lesson-reader').text_content())
                self.assert_geometry()
        types = set()
        for lesson in LESSONS:
            with self.subTest(lesson=lesson['id']):
                self.open_lesson(lesson)
                rendered = norm(self.page.locator('#lesson-reader .lesson').text_content())
                for block in lesson['blocks']:
                    types.add(block['type'])
                    for fragment in strings(block):
                        self.assertIn(norm(fragment), rendered, f"Missing {block['type']} content: {fragment[:90]}")
                # All article blocks exist together, and no answer is needed to reach the end.
                self.assertGreater(self.page.locator('.lesson > .block').count(), 3)
                self.assertEqual(self.page.locator('.lesson > .block[hidden]').count(), 0)
                self.page.locator('#shell-scroll').evaluate('(el) => el.scrollTo(0, el.scrollHeight)')
                self.page.wait_for_function("JSON.parse(localStorage.getItem('englishPrep.lessonProgress') || '{}')["+json.dumps(lesson['id'])+"]?.done === true")
                self.assert_geometry()
        self.assertTrue({'contrast', 'forms', 'pitfall', 'examples', 'decision', 'check'}.issubset(types))
        self.assertEqual(len(self.storage('englishPrep.lessonProgress')), len(LESSONS))
        self.assertEqual(self.history(), [], 'Unscored lesson checks must not create scored attempts')

    def test_inline_checks_are_non_gating_and_preserve_scroll(self):
        self.open_lesson()
        expect(self.page.locator('#bottom-nav')).to_be_hidden()
        expect(self.page.locator('#lesson-bar')).to_be_hidden()
        pretest = self.page.locator('.lesson-pretest')
        expect(pretest).not_to_have_attribute('open', '')
        pretest.locator('summary').click()
        pretest.locator('.option').first.click()
        expect(pretest).to_have_attribute('open', '')
        expect(pretest.locator('.feedback')).to_be_visible()
        pretest.locator('summary').click()
        check = self.page.locator('.block--check').first
        option = check.locator('.option').first
        option.scroll_into_view_if_needed()
        before = self.page.locator('#shell-scroll').evaluate('(el) => el.scrollTop')
        option.click()
        expect(check.locator('.feedback')).to_be_visible()
        after = self.page.locator('#shell-scroll').evaluate('(el) => el.scrollTop')
        self.assertAlmostEqual(before, after, delta=3)
        unanswered = self.page.locator('.block--check .option:not([aria-disabled])').count()
        self.assertGreater(unanswered, 0)
        self.page.locator('#shell-scroll').evaluate('(el) => el.scrollTo(0, el.scrollHeight)')
        self.page.wait_for_function("JSON.parse(localStorage.getItem('englishPrep.lessonProgress') || '{}')["+json.dumps(LESSONS[0]['id'])+"]?.done === true")
        expect(self.page.locator('.block--end')).to_be_visible()
        self.assertEqual(self.history(), [])
        self.page.get_by_role('button', name='Sıradaki ders', exact=True).click()
        expect(self.page.locator('#lesson-reader h1')).to_have_text(LESSONS[1]['category'])

    def test_mixed_results_history_and_exact_mistake_book(self):
        self.start_mixed(5)
        answered, result = self.complete()
        self.assertEqual(result['mode'], 'mixed')
        self.assertEqual(len(self.history()), 1)
        self.page.reload()
        expect(self.page.locator('#results-container .score')).to_be_visible()
        self.assertEqual(len(self.history()), 1)
        mistake_ids = {q['id'] for q in answered if not q['correct']}
        self.visit('index.html#test')
        self.page.get_by_role('button', name='Yanlışları çalış', exact=True).click()
        expect(self.page.locator('#question-stem')).to_be_visible()
        request = self.storage('englishPrep.quizRequest', 'sessionStorage')
        self.assertEqual(request['mode'], 'mistakes')
        self.assertEqual(set(request['ids']), mistake_ids)
        reviewed, review_result = self.complete(correct=lambda _: True)
        self.assertEqual({q['id'] for q in reviewed}, mistake_ids)
        self.assertEqual(review_result['correctCount'], len(mistake_ids))
        self.assertEqual(len(self.history()), 2)
        book = self.page.evaluate("async () => (await import('./js/storage.js')).getMistakeBook()")
        self.assertEqual({q['id'] for q in book}, mistake_ids, 'One day of correct answers must not prematurely graduate mistakes')

    def test_single_topic_then_category_practice(self):
        self.visit('index.html#egitim/konu/tenses')
        self.page.locator('#lesson-reader .row').last.click()
        expect(self.page.locator('#question-stem')).to_be_visible()
        answered, result = self.complete(correct=lambda _: False)
        self.assertEqual(result['mode'], 'topic')
        self.assertEqual(result['totalCount'], 15)
        self.assertEqual({q['topicId'] for q in answered}, {'tenses'})
        self.visit('index.html#test')
        weak = self.page.locator('#test-panel section').filter(has=self.page.get_by_role('heading', name='En çok zorlandıkların', exact=True)).last
        row = weak.locator('button.row').first
        expect(row).to_be_visible()
        category = row.locator('.row__title').inner_text()
        row.click()
        expect(self.page.locator('#question-stem')).to_be_visible()
        category_answers, category_result = self.complete(correct=lambda _: True)
        self.assertEqual(category_result['mode'], 'category')
        self.assertEqual({q['category'] for q in category_answers}, {category})
        self.assertGreaterEqual(len(category_answers), 4)
        self.assertEqual(len(self.history()), 2)

    def test_early_finish_records_only_answered_questions(self):
        self.start_mixed(10)
        self.answer(True)
        self.page.locator('#quiz-bar .btn--primary').click()
        self.answer(False)
        self.page.get_by_role('button', name='Bitir', exact=True).click()
        expect(self.page.locator('#results-container .score')).to_be_visible()
        result = self.storage('englishPrep.quizResult', 'sessionStorage')
        self.assertTrue(result['partial'])
        self.assertEqual((result['correctCount'], result['totalCount']), (1,2))
        self.assertEqual(len(self.history()), 1)

    def test_profile_name_theme_backup_restore_and_safe_reset(self):
        self.start_mixed(5)
        self.complete(correct=lambda _: True)
        self.visit('index.html#profil')
        self.page.locator('#profile-name').fill('Deniz')
        self.page.locator('#profile-name').press('Tab')
        self.page.wait_for_function("localStorage.getItem('englishPrep.profileName') === 'Deniz'")
        self.page.get_by_role('combobox', name=re.compile('^Görünüm')).click()
        self.page.get_by_role('option', name='Açık', exact=True).click()
        expect(self.page.locator('html')).to_have_attribute('data-theme', 'light')
        self.page.reload()
        expect(self.page.locator('#profile-name')).to_have_value('Deniz')
        expect(self.page.locator('html')).to_have_attribute('data-theme', 'light')
        with self.page.expect_download() as download:
            self.page.get_by_role('button', name='Yedek al', exact=True).click()
        backup = Path(download.value.path()).read_text()
        self.assertEqual(len(json.loads(backup)['data']['history']['attempts']), 1)
        self.page.get_by_role('button', name='Geçmişi sıfırla', exact=True).click()
        expect(self.page.locator('#confirm-dialog-cancel')).to_be_focused()
        self.page.locator('#confirm-dialog-cancel').click()
        self.assertEqual(len(self.history()), 1)
        self.page.get_by_role('button', name='Geçmişi sıfırla', exact=True).click()
        self.page.locator('#confirm-dialog-confirm').click()
        self.page.wait_for_function("localStorage.getItem('englishPrep.history') === null")
        self.assertEqual(self.history(), [])
        self.page.get_by_role('button', name='Yedekten geri yükle', exact=True).click()
        self.page.locator('#restore-text').fill('invalid backup')
        self.page.locator('#restore-confirm').click()
        expect(self.page.locator('#restore-message')).to_contain_text('okunamadı')
        self.page.locator('#restore-text').fill(backup)
        self.page.locator('#restore-confirm').click()
        expect(self.page.locator('#restore-confirm')).to_have_text('Geri yükle')
        self.page.locator('#restore-confirm').click()
        expect(self.page.locator('#restore-dialog')).not_to_be_visible()
        self.assertEqual(len(self.history()), 1)

    def test_root_and_original_service_workers_coexist_offline(self):
        self.context.close()
        self.context = self.browser.new_context(viewport={'width':390,'height':844}, reduced_motion='reduce', service_workers='allow')
        self.page = self.context.new_page()
        self.page.set_default_timeout(12000)
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))
        for prefix in ['', 'original/']:
            self.visit(prefix+'index.html#egitim/'+LESSONS[0]['id'])
            skip = self.page.get_by_role('button',name='Zaten kullanıyorum, atla',exact=True)
            if skip.is_visible():
                skip.click()
                self.visit(prefix+'index.html#egitim/'+LESSONS[0]['id'])
            expect(self.page.locator('#lesson-reader h1')).to_have_text(LESSONS[0]['category'])
            self.page.evaluate('async () => (await navigator.serviceWorker.ready).scope')
            self.page.wait_for_function('(wanted) => navigator.serviceWorker.controller?.scriptURL === wanted', arg=BASE+'/'+prefix+'sw.js')
            self.page.reload()
            expect(self.page.locator('#lesson-reader h1')).to_have_text(LESSONS[0]['category'])
            self.page.wait_for_function("""async (url) => {
                for (const name of await caches.keys()) {
                    if (name.endsWith(':content') && await (await caches.open(name)).match(url)) return true;
                }
                return false;
            }""", arg=BASE+'/'+prefix+TOPICS[0]['file'])
        registrations = self.page.evaluate('async () => (await navigator.serviceWorker.getRegistrations()).map(r=>r.scope)')
        self.assertCountEqual(registrations, [BASE+'/',BASE+'/original/'])
        cache_names = self.page.evaluate('caches.keys()')
        root_namespace = 'english-prep:'+quote(urlsplit(BASE+'/').path, safe='')+':'
        original_namespace = 'english-prep:'+quote(urlsplit(BASE+'/original/').path, safe='')+':'
        self.assertIn(root_namespace+'content', cache_names)
        self.assertIn(original_namespace+'content', cache_names)
        cached_assets = self.page.evaluate("""async (namespace) => {
            const urls = [];
            for (const name of await caches.keys()) {
                if (name.startsWith(namespace+'shell:')) {
                    urls.push(...(await (await caches.open(name)).keys()).map(r=>r.url));
                }
            }
            return urls;
        }""", root_namespace)
        self.assertIn(BASE+'/css/editorial.css',cached_assets)
        self.assertIn(BASE+'/assets/fonts/InterVariable.woff2',cached_assets)
        self.context.set_offline(True)
        for prefix in ['', 'original/']:
            self.visit(prefix+'index.html#egitim/'+LESSONS[0]['id'])
            self.page.reload()
            expect(self.page.locator('#lesson-reader h1')).to_have_text(LESSONS[0]['category'])
            self.assertIn(norm(LESSONS[0]['blocks'][0]['body']),norm(self.page.locator('.lesson').text_content()))
            self.assert_geometry()
        self.context.set_offline(False)

    def test_preserved_original_version_and_shared_history(self):
        self.visit('original/index.html#egitim')
        skip = self.page.get_by_role('button', name='Zaten kullanıyorum, atla', exact=True)
        if skip.is_visible():
            skip.click()
        expect(self.page.locator('#index-list .tile')).to_have_count(len(TOPICS))
        self.page.locator('#index-list .tile').first.click()
        expect(self.page.locator('#lesson-reader h1')).to_have_text(DATA[TOPICS[0]['id']]['intro']['title'])
        self.visit('original/index.html#test')
        self.choose_count('Soru sayısı', 5)
        self.page.get_by_role('button', name='Teste başla', exact=True).click()
        expect(self.page.locator('#question-stem')).to_be_visible()
        self.complete(correct=lambda _: True)
        self.assertIn('/original/results.html', self.page.url)
        self.assertEqual(len(self.history()), 1)
        self.visit('index.html#profil')
        expect(self.page.locator('#profile-name')).to_be_visible()
        self.assertEqual(len(self.history()), 1)
        self.assertIn('5', self.page.locator('#profile-container').inner_text())

    def test_responsive_both_themes_through_article_quiz_and_review(self):
        self.check_geometry = True
        for width in [320,390,768,1440]:
            for theme in ['dark','light']:
                with self.subTest(width=width, theme=theme):
                    self.page.set_viewport_size({'width':width, 'height':900})
                    self.visit()
                    self.page.evaluate('(theme) => localStorage.setItem("englishPrep.theme", theme)', theme)
                    self.page.reload()
                    expect(self.page.locator('#index-list .tile')).to_have_count(len(TOPICS))
                    expect(self.page.locator('html')).to_have_attribute('data-theme', theme)
                    self.assert_geometry()
                    for route, selector in [('index.html#test','#topic-list .row'),('index.html#profil','#profile-name'),('index.html#egitim/konu/tenses','#lesson-reader h1')]:
                        self.visit(route)
                        expect(self.page.locator(selector).first).to_be_visible()
                        self.assert_geometry()
                    self.open_lesson()
                    self.assert_geometry()
                    self.page.locator('#shell-scroll').evaluate('(el) => el.scrollTo(0,el.scrollHeight)')
                    self.assert_geometry()
                    self.visit('index.html#test')
                    mixed_combo = self.page.locator('[aria-labelledby~="mixed-count-label"]')
                    mixed_combo.click()
                    self.page.get_by_role('option',name='5',exact=True).click()
                    self.page.get_by_role('button',name='Teste başla',exact=True).click()
                    expect(self.page.locator('#question-stem')).to_be_visible()
                    self.assert_geometry()
                    self.complete(correct=lambda i:i>0)
                    self.assert_geometry()


if __name__ == '__main__':
    unittest.main(argv=[sys.argv[0], *TEST_ARGS], verbosity=2)
