#!/usr/bin/env python3
"""Guided introduction, motion and PWA checks against a real static server.

Installation outcomes use synthetic browser events; this does not assert that
Chromium installed an OS application. Offline checks clear the ordinary HTTP
cache so only the app's durable caches can make the result pass.
"""
import argparse
import re
import unittest
from playwright.sync_api import expect, sync_playwright

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base-url', default='http://127.0.0.1:8010')
parser.add_argument('--browser-path', default='/usr/bin/chromium')
ARGS, TEST_ARGS = parser.parse_known_args()
BASE = ARGS.base_url.rstrip('/')
LESSON = 'closest-meaning-unless-vs-if-not-vs-otherwise'


class ReadingSystemTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        cls.browser = cls.pw.chromium.launch(executable_path=ARGS.browser_path, args=['--no-sandbox'])

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()

    def setUp(self):
        self.context = self.browser.new_context(viewport={'width': 320, 'height': 568}, color_scheme='dark', reduced_motion='reduce')
        self.page = self.context.new_page()
        self.page.set_default_timeout(8000)
        self.errors = []
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [])

    def tour_name_step(self):
        self.page.get_by_role('button', name='Testi tanı', exact=True).click()
        self.page.get_by_role('button', name='Devam et', exact=True).click()
        expect(self.page.locator('#onboard-name')).to_be_visible()

    def test_introduction_explains_two_modes_without_blocking_direct_entry(self):
        self.page.goto(BASE + '/index.html#egitim')
        expect(self.page.locator('#index-filter')).to_be_visible()
        expect(self.page.locator('#onboard-container')).to_be_hidden()
        self.assertIsNone(self.page.evaluate('localStorage.getItem("englishPrep.onboarded")'))
        self.page.goto(BASE + '/index.html#hosgeldin')
        intro = self.page.locator('#onboard-container')
        heading = intro.get_by_role('heading', level=1)
        expect(heading).to_have_text('Bildiğin İngilizceyi netleştir.')
        expect(intro.locator('.onboard__progress')).to_have_text('1 / 3 · Eğitim')
        expect(intro.locator('.onboard-flow__choice')).to_have_count(3)
        expect(intro.locator('.onboard__top [data-motion-control]')).to_have_count(0)
        expect(intro.locator('input')).to_have_count(0)
        expect(intro.get_by_role('button', name='Geri', exact=True)).to_be_hidden()
        expect(intro.get_by_role('button', name='Tanıtımı geç', exact=True)).to_be_visible()
        intro.get_by_role('button', name='Testi tanı', exact=True).press('Enter')
        expect(heading).to_have_text('Cevabı seç. Nedenini öğren.')
        expect(heading).to_be_focused()
        expect(intro.locator('.onboard__progress')).to_have_text('2 / 3 · Test')
        expect(intro.locator('.onboard-flow__choice')).to_have_count(3)
        expect(intro.locator('input')).to_have_count(0)
        intro.get_by_role('button', name='Geri', exact=True).click()
        expect(heading).to_have_text('Bildiğin İngilizceyi netleştir.')
        expect(heading).to_be_focused()
        self.tour_name_step()
        expect(heading).to_have_text('Hazırsan başlayalım.')
        expect(heading).to_be_focused()
        expect(intro.locator('input')).to_have_count(1)
        expect(intro.locator('input')).not_to_have_attribute('required', '')
        intro.get_by_role('button', name='Uygulamayı aç', exact=True).click()
        expect(self.page.locator('#index-filter')).to_be_visible()
        self.assertTrue(self.page.url.endswith('#egitim'))
        self.assertEqual(self.page.evaluate('localStorage.getItem("englishPrep.onboarded")'), '1')
        self.assertLessEqual(self.page.evaluate('document.documentElement.scrollWidth'), 320)

    def test_introduction_scenes_are_optional_keyboard_controls_without_learning_side_effects(self):
        self.page.emulate_media(reduced_motion='no-preference')
        self.page.goto(BASE + '/index.html#hosgeldin')
        progress_before = self.page.evaluate('''() => ({
          history: localStorage.getItem('englishPrep.history'),
          lessons: localStorage.getItem('englishPrep.lessonProgress'),
          quiz: sessionStorage.getItem('englishPrep.activeQuiz'),
          result: sessionStorage.getItem('englishPrep.quizResult')
        })''')
        intro = self.page.locator('#onboard-container')
        heading = intro.get_by_role('heading', level=1)
        for page, scenes in [
            (0, [('Ders', 'article'), ('Kontrol', 'check'), ('Konu', 'topics')]),
            (1, [('Açıklama', 'reason'), ('Tekrar', 'return'), ('Soru', 'question')]),
        ]:
            for label, scene in scenes:
                choice = intro.get_by_role('button', name=label, exact=True)
                choice.focus()
                choice.press('Space')
                expect(choice).to_be_focused()
                expect(choice).to_have_attribute('aria-pressed', 'true')
                expect(intro.locator('.onboard-flow__choice[aria-pressed="true"]')).to_have_count(1)
                expect(intro.locator('.onboard-flow')).to_have_attribute('data-scene', scene)
                self.assertTrue(intro.locator('.onboard-flow__caption').inner_text().strip())
            if page == 0:
                intro.get_by_role('button', name='Kontrol', exact=True).click()
                intro.get_by_role('button', name='Testi tanı', exact=True).click()
                expect(heading).to_be_focused()
        intro.get_by_role('button', name='Geri', exact=True).click()
        expect(heading).to_be_focused()
        expect(intro.get_by_role('button', name='Kontrol', exact=True)).to_have_attribute('aria-pressed', 'true')
        progress_after = self.page.evaluate('''() => ({
          history: localStorage.getItem('englishPrep.history'),
          lessons: localStorage.getItem('englishPrep.lessonProgress'),
          quiz: sessionStorage.getItem('englishPrep.activeQuiz'),
          result: sessionStorage.getItem('englishPrep.quizResult')
        })''')
        self.assertEqual(progress_before, progress_after)
        # Exploring the diagram neither advances the page nor gates Skip.
        expect(intro.locator('.onboard__progress')).to_have_text('1 / 3 · Eğitim')
        intro.get_by_role('button', name='Tanıtımı geç', exact=True).click()
        expect(self.page.locator('#index-filter')).to_be_visible()

    def test_name_is_optional_trimmed_and_reused_in_profile(self):
        self.page.goto(BASE + '/index.html#hosgeldin')
        self.tour_name_step()
        name = self.page.locator('#onboard-name')
        name.fill('  Ada  ')
        self.page.get_by_role('button', name='Geri', exact=True).click()
        self.page.get_by_role('button', name='Devam et', exact=True).click()
        expect(name).to_have_value('  Ada  ')
        name.press('Enter')
        expect(self.page.locator('#index-filter')).to_be_visible()
        self.page.locator('#profile-trigger').click()
        expect(self.page.locator('#profile-name')).to_have_value('Ada')
        expect(self.page.locator('#profile-container h1')).to_have_text('Ada')
        expect(self.page.locator('#profile-exam-date, #profile-goal-label')).to_have_count(0)
        expect(self.page.locator('#profile-container')).not_to_contain_text('Gün seri')

    def test_tour_can_be_skipped_from_every_page(self):
        for step in range(3):
            with self.subTest(step=step):
                self.page.goto(BASE + '/index.html#hosgeldin')
                if step >= 1:
                    self.page.get_by_role('button', name='Testi tanı', exact=True).click()
                if step == 2:
                    self.page.get_by_role('button', name='Devam et', exact=True).click()
                self.page.get_by_role('button', name='Tanıtımı geç', exact=True).click()
                expect(self.page.locator('#index-filter')).to_be_visible()
                self.assertTrue(self.page.url.endswith('#egitim'))

    def test_unread_pretest_starts_open_and_can_be_skipped_without_an_answer(self):
        self.page.goto(BASE + '/index.html#egitim/' + LESSON)
        pretest = self.page.locator('.lesson-pretest')
        expect(pretest).to_have_attribute('open', '')
        expect(pretest.locator('.feedback')).to_have_count(0)
        pretest.get_by_role('button', name='Derse geç', exact=True).click()
        expect(pretest).not_to_have_attribute('open', '')
        expect(self.page.locator('[data-reading-start]')).to_be_focused()
        expect(pretest.locator('.option--picked')).to_have_count(0)
        self.assertFalse(self.page.evaluate('''lesson =>
          JSON.parse(localStorage.getItem('englishPrep.lessonProgress') || '{}')[lesson]?.done === true
        ''', LESSON))

    def test_manifest_keeps_the_preexisting_installed_identity(self):
        self.page.goto(BASE + '/index.html')
        identity = self.page.evaluate('''async () => {
          const url = new URL('manifest.webmanifest', location.href);
          const manifest = await (await fetch(url)).json();
          return { id: new URL(manifest.id, url).href,
            previousDefault: new URL(manifest.start_url, url).href,
            shortcuts: manifest.shortcuts.map(item => new URL(item.url, url).hash) };
        }''')
        self.assertEqual(identity['id'], identity['previousDefault'])
        self.assertEqual(identity['shortcuts'], ['#egitim', '#test'])

    def offer_install(self, outcome):
        self.page.evaluate('''outcome => {
          const event = new Event('beforeinstallprompt', {cancelable: true});
          event.prompt = async () => {
            window.__promptCalls = (window.__promptCalls || 0) + 1;
            if (outcome === 'throws') throw new Error('blocked');
          };
          event.userChoice = Promise.resolve({outcome});
          window.dispatchEvent(event);
        }''', outcome)

    def test_install_outcomes_are_honest_and_do_not_repeat_consumed_prompts(self):
        for outcome, expected in [
            ('accepted', 'Yükleme isteği tarayıcıya iletildi.'),
            ('dismissed', 'Yükleme iptal edildi.'),
            ('throws', 'Yükleme açılamadı.'),
        ]:
            with self.subTest(outcome=outcome):
                self.page.goto('about:blank')
                self.page.goto(BASE + '/index.html#profil')
                control = self.page.locator('.install-control')
                expect(control).to_be_visible()
                button = control.get_by_role('button', name='Uygulamayı yükle', exact=True)
                expect(button).to_be_hidden()
                expect(control).to_contain_text('Çevrimdışı erişim, daha önce açtığın içerikle sınırlıdır.')
                self.offer_install(outcome)
                expect(button).to_be_visible()
                button.click()
                expect(button).to_be_hidden()
                expect(control.get_by_role('status')).to_contain_text(expected)
                self.assertEqual(self.page.evaluate('window.__promptCalls'), 1)

    def test_installed_event_does_not_tell_the_user_to_install_again(self):
        self.page.goto(BASE + '/index.html#profil')
        control = self.page.locator('.install-control')
        expect(control).to_be_visible()
        self.offer_install('accepted')
        self.page.evaluate('window.dispatchEvent(new Event("appinstalled"))')
        expect(control.get_by_role('button')).to_be_hidden()
        expect(control.get_by_role('status')).to_contain_text('English Prep yüklendi.')
        self.page.locator('#profile-name').fill('Ada')
        self.page.locator('#profile-name').press('Tab')
        expect(self.page.locator('#profile-container h1')).to_have_text('Ada')
        expect(control.get_by_role('status')).to_contain_text('English Prep yüklendi.')

    def test_first_read_is_durable_without_the_http_cache(self):
        self.page.goto(BASE + '/index.html#egitim/' + LESSON)
        expect(self.page.locator('.lesson')).to_be_visible()
        self.page.wait_for_function('navigator.serviceWorker.controller !== null')
        cached = self.page.evaluate('''async () => {
          const scope = new URL('./', location.href);
          const cache = await caches.open(`english-prep:${encodeURIComponent(scope.pathname)}:content`);
          return (await cache.keys()).map(request => new URL(request.url).pathname);
        }''')
        self.assertTrue(any(path.endswith('/data/manifest.json') for path in cached), cached)
        self.assertTrue(any('/data/closest-meaning/' in path for path in cached), cached)
        self.assertFalse(any('/data/tenses/' in path for path in cached), cached)
        cdp = self.context.new_cdp_session(self.page)
        cdp.send('Network.enable')
        cdp.send('Network.clearBrowserCache')
        self.context.set_offline(True)
        self.page.reload()
        expect(self.page.locator('.lesson')).to_be_visible()
        expect(self.page.locator('.lesson')).to_contain_text('Unless vs If Not vs Otherwise')
        self.page.goto(BASE + '/about/')
        expect(self.page.get_by_role('heading', level=1)).to_be_visible()
        expect(self.page.get_by_role('link', name='Çalışmaya başla', exact=True)).to_be_visible()
        # The portfolio's cached content module and controls work offline too;
        # a static hero alone would hide a missing ES-module dependency.
        expect(self.page.locator('#study-controls [data-study-stage]')).to_have_count(3)
        expect(self.page.locator('[data-tour-screen], [data-tour-viewport]')).to_have_count(0)
        apply = self.page.locator('[data-study-stage="apply"]')
        apply.click()
        expect(apply).to_have_attribute('aria-pressed', 'true')
        expect(apply).to_be_focused()
        expect(self.page.locator('#study-title')).to_have_text('Bir seçeneğin ötesine geç.')
        expect(self.page.locator('#study-image')).to_have_attribute('src', 'assets/test-phone.webp')
        expect(self.page.locator('#study-wide-source')).to_have_attribute('srcset', 'assets/test-wide.webp')
        continuity = self.page.locator('[data-architecture="continuity"]')
        continuity.click()
        expect(continuity).to_have_attribute('aria-pressed', 'true')
        expect(continuity).to_be_focused()
        expect(self.page.locator('#architecture-title')).to_have_text('Kaldığın yerin de bir mimarisi var.')
        expect(self.page.locator('#architecture-body')).to_contain_text('localStorage')
        expect(self.page.locator('#engineering-heading')).to_be_visible()

    def test_unavailable_cache_storage_does_not_block_online_reading(self):
        self.page.add_init_script('''CacheStorage.prototype.open = async () => {
          throw new DOMException('Storage unavailable', 'QuotaExceededError');
        };''')
        self.page.goto(BASE + '/index.html#egitim/' + LESSON)
        expect(self.page.locator('.lesson')).to_be_visible()
        expect(self.page.locator('.lesson')).to_contain_text('Unless vs If Not vs Otherwise')

    def open_tenant_question(self):
        # Use the shipped question and a normal, validated mistakes request.
        # Browser storage chooses identities, never the correct-answer key.
        bank = self.page.request.get(BASE + '/data/closest-meaning/closest-meaning.json').json()
        question = next(item for item in bank['questions'] if item['id'] == 'closest-meaning-t5')
        self.page.goto(BASE + '/index.html#test')
        self.page.evaluate('''id => {
          sessionStorage.removeItem('englishPrep.activeQuiz');
          sessionStorage.removeItem('englishPrep.quizResult');
          sessionStorage.setItem('englishPrep.quizRequest', JSON.stringify({
            mode: 'mistakes', topicIds: ['closest-meaning'], ids: [id], count: 1
          }));
        }''', question['id'])
        self.page.goto(BASE + '/quiz.html')
        expect(self.page.locator('#question-stem')).to_have_text(question['sentence'])
        expect(self.page.locator('.option')).to_have_count(len(question['options']))
        self.page.evaluate('document.fonts.ready')
        return question

    def test_long_options_keep_their_geometry_when_feedback_is_revealed(self):
        geometry = '''nodes => nodes.map(node => ({
          text: node.querySelector('.option__text').textContent,
          height: node.getBoundingClientRect().height,
          textWidth: node.querySelector('.option__text').getBoundingClientRect().width
        }))'''
        for width in [320, 390, 1440]:
            with self.subTest(width=width):
                self.page.set_viewport_size({'width': width, 'height': 900})
                question = self.open_tenant_question()
                options = self.page.locator('.option')
                before = options.evaluate_all(geometry)
                wrong = next(option for index, option in enumerate(question['options']) if index != question['correctIndex'])
                options.filter(has=self.page.locator('.option__text', has_text=re.compile('^' + re.escape(wrong) + '$'))).click()
                expect(self.page.locator('.feedback')).to_be_visible()
                expect(self.page.locator('.option--no')).to_have_count(1)
                expect(self.page.locator('.option--ok')).to_have_count(1)
                after = options.evaluate_all(geometry)
                self.assertEqual([item['text'] for item in after], [item['text'] for item in before])
                for old, new in zip(before, after):
                    self.assertAlmostEqual(old['height'], new['height'], delta=0.5, msg=new['text'])
                    self.assertAlmostEqual(old['textWidth'], new['textWidth'], delta=0.5, msg=new['text'])

    def test_lesson_roles_remain_distinct_with_readable_supporting_text(self):
        self.page.goto(BASE + '/index.html#egitim/' + LESSON)
        expect(self.page.locator('.lesson')).to_be_visible()
        self.page.evaluate('document.fonts.ready')
        roles = self.page.evaluate('''() => {
          const selectors = { section: '.block--forms h2', pattern: '.lesson-pattern',
            use: '.lesson-use', body: '.lesson-example' };
          const roles = Object.fromEntries(Object.entries(selectors).map(([role, selector]) => {
            const style = getComputedStyle(document.querySelector(selector));
            return [role, { size: parseFloat(style.fontSize), font: style.fontFamily }];
          }));
          return { roles, interLoaded: [...document.fonts].some(font =>
            font.family === 'Inter' && font.status === 'loaded') };
        }''')
        self.assertTrue(roles['interLoaded'])
        for role in roles['roles'].values():
            self.assertTrue(role['font'].startswith('Inter'), role)
        sizes = {name: role['size'] for name, role in roles['roles'].items()}
        self.assertGreater(sizes['section'], sizes['body'])
        self.assertGreaterEqual(sizes['use'], 16)
        self.assertLess(sizes['use'], sizes['pattern'])
        overflow = self.page.evaluate('''() => ({
          page: document.documentElement.scrollWidth > innerWidth,
          reader: document.querySelector('#shell-scroll').scrollWidth > document.querySelector('#shell-scroll').clientWidth
        })''')
        self.assertEqual(overflow, {'page': False, 'reader': False})

    def assert_ambient_running(self):
        expect(self.page.locator('.ambient')).to_have_attribute('aria-hidden', 'true')
        expect(self.page.locator('.ambient__field')).to_have_count(3)
        self.assertTrue(self.page.locator('.ambient__field').evaluate_all('''nodes =>
          nodes.every(node => node.getAnimations().some(animation =>
            animation.effect.getTiming().iterations === Infinity &&
            animation.effect.getTiming().duration >= 28000 && animation.playState === 'running'))
        '''))

    def test_ambient_motion_is_available_across_routes_and_pauses_persistently(self):
        self.page.emulate_media(reduced_motion='no-preference')
        self.page.goto(BASE + '/index.html#egitim')
        expect(self.page.locator('#index-filter')).to_be_visible()
        self.assert_ambient_running()
        self.page.evaluate('window.__ambientOnArrival = document.querySelector(".ambient")')
        for route, selector in [('test', '#test-panel'), ('egitim/' + LESSON, '.lesson')]:
            self.page.evaluate('(route) => { location.hash = route; }', route)
            expect(self.page.locator(selector)).to_be_visible()
            self.assertTrue(self.page.evaluate('document.querySelector(".ambient") === window.__ambientOnArrival'))
            self.assert_ambient_running()
            expect(self.page.locator('#shell-header [data-motion-control]')).to_have_count(0)
            expect(self.page.locator('.motion-footer [data-motion-control]')).to_have_count(1)
        # Foreground answer cards remain opaque even though the canvas has aura.
        self.open_tenant_question()
        self.assert_ambient_running()
        self.assertTrue(self.page.locator('.option').evaluate_all('''nodes => nodes.every(node => {
          const canvas = document.createElement('canvas');
          canvas.width = canvas.height = 1;
          const context = canvas.getContext('2d');
          context.fillStyle = getComputedStyle(node).backgroundColor;
          context.fillRect(0, 0, 1, 1);
          return context.getImageData(0, 0, 1, 1).data[3] === 255;
        })'''))
        expect(self.page.locator('#shell-header [data-motion-control]')).to_have_count(0)
        control = self.page.locator('.motion-footer [data-motion-control]')
        control.scroll_into_view_if_needed()
        expect(control).to_have_attribute('aria-pressed', 'true')
        question = self.page.locator('#question-stem').inner_text()
        route = self.page.url
        session = self.page.evaluate('sessionStorage.getItem("englishPrep.activeQuiz")')
        scroll = self.page.locator('#shell-scroll').evaluate('node => node.scrollTop')
        control.click()
        expect(control).to_have_attribute('aria-pressed', 'false')
        expect(self.page.locator('html')).to_have_attribute('data-motion', 'off')
        self.assertEqual(self.page.evaluate('localStorage.getItem("englishPrep.motion")'), 'off')
        expect(self.page.locator('#question-stem')).to_have_text(question)
        self.assertEqual(self.page.url, route)
        self.assertEqual(self.page.evaluate('sessionStorage.getItem("englishPrep.activeQuiz")'), session)
        self.assertEqual(self.page.locator('#shell-scroll').evaluate('node => node.scrollTop'), scroll)
        self.assertFalse(self.page.locator('.ambient__field').evaluate_all('''nodes =>
          nodes.some(node => node.getAnimations().some(animation => animation.playState === 'running'))
        '''))
        self.page.reload()
        expect(self.page.locator('html')).to_have_attribute('data-motion', 'off')
        self.page.goto(BASE + '/index.html#profil')
        expect(self.page.locator('#shell-header [data-motion-control]')).to_have_count(0)
        controls = self.page.locator('[data-motion-control]')
        expect(controls).to_have_count(2)
        self.assertEqual(controls.evaluate_all('nodes => nodes.map(node => node.getAttribute("aria-pressed"))'), ['false', 'false'])
        self.page.locator('#profile-container [data-motion-control]').click()
        self.assertEqual(controls.evaluate_all('nodes => nodes.map(node => node.getAttribute("aria-pressed"))'), ['true', 'true'])
        self.assert_ambient_running()
        # The OS setting wins without erasing the learner's own preference.
        self.page.emulate_media(reduced_motion='reduce')
        expect(self.page.locator('html')).to_have_attribute('data-motion', 'off')
        self.assertEqual(self.page.evaluate('localStorage.getItem("englishPrep.motion")'), 'on')
        self.assertEqual(controls.evaluate_all('nodes => nodes.map(node => node.getAttribute("aria-disabled"))'), ['true', 'true'])
        self.assertFalse(self.page.locator('.ambient__field').evaluate_all('''nodes =>
          nodes.some(node => node.getAnimations().some(animation => animation.playState === 'running'))
        '''))
        self.page.emulate_media(reduced_motion='no-preference')
        expect(self.page.locator('html')).to_have_attribute('data-motion', 'on')
        self.assert_ambient_running()

    def test_hidden_document_pauses_without_changing_the_saved_preference(self):
        self.page.emulate_media(reduced_motion='no-preference')
        self.page.goto(BASE + '/index.html#egitim')
        expect(self.page.locator('#index-filter')).to_be_visible()
        self.assert_ambient_running()
        saved = self.page.evaluate('localStorage.getItem("englishPrep.motion")')
        # Exercise the browser visibility event boundary deterministically.
        # This is a synthetic hidden-tab transition, not an OS lifecycle claim.
        self.page.evaluate('''() => {
          Object.defineProperty(document, 'hidden', {configurable: true, get: () => true});
          document.dispatchEvent(new Event('visibilitychange'));
        }''')
        expect(self.page.locator('html')).to_have_attribute('data-page-visible', 'false')
        expect(self.page.locator('html')).to_have_attribute('data-motion', 'on')
        self.assertEqual(self.page.evaluate('localStorage.getItem("englishPrep.motion")'), saved)
        self.assertFalse(self.page.locator('.ambient__field').evaluate_all('''nodes =>
          nodes.some(node => node.getAnimations().some(animation => animation.playState === 'running'))
        '''))
        self.page.evaluate('''() => {
          delete document.hidden;
          document.dispatchEvent(new Event('visibilitychange'));
        }''')
        expect(self.page.locator('html')).to_have_attribute('data-page-visible', 'true')
        self.assert_ambient_running()


if __name__ == '__main__':
    unittest.main(argv=['reading_system.py', *TEST_ARGS], verbosity=2)
