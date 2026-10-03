#!/usr/bin/env python3
"""One-page introduction and PWA regressions against a real static server.

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

    def test_introduction_has_two_modes_and_only_an_optional_name(self):
        self.page.goto(BASE + '/index.html#hosgeldin')
        intro = self.page.locator('#onboard-container')
        expect(intro.locator('h2')).to_have_text(['Eğitim', 'Test'])
        expect(intro.locator('input')).to_have_count(1)
        expect(intro.locator('input')).not_to_have_attribute('required', '')
        expect(intro.locator('button')).to_have_count(1)
        intro.get_by_role('button', name='Uygulamayı aç', exact=True).click()
        expect(self.page.locator('#index-filter')).to_be_visible()
        self.assertTrue(self.page.url.endswith('#egitim'))
        self.assertEqual(self.page.evaluate('localStorage.getItem("englishPrep.onboarded")'), '1')
        self.assertLessEqual(self.page.evaluate('document.documentElement.scrollWidth'), 320)

    def test_name_is_optional_trimmed_and_reused_in_profile(self):
        self.page.goto(BASE + '/index.html#hosgeldin')
        name = self.page.locator('#onboard-name')
        name.fill('  Ada  ')
        name.press('Enter')
        expect(self.page.locator('#index-filter')).to_be_visible()
        self.page.locator('#profile-trigger').click()
        expect(self.page.locator('#profile-name')).to_have_value('Ada')
        expect(self.page.locator('#profile-container h1')).to_have_text('Ada')
        expect(self.page.locator('#profile-exam-date, #profile-goal-label')).to_have_count(0)
        expect(self.page.locator('#profile-container')).not_to_contain_text('Gün seri')

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
        expect(self.page.get_by_role('link', name='Dersleri keşfet')).to_be_visible()

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

    def test_ambient_motion_settles_once_and_never_changes_the_reading_surface(self):
        self.page.emulate_media(reduced_motion='no-preference')
        self.page.goto(BASE + '/index.html#egitim')
        expect(self.page.locator('#index-filter')).to_be_visible()
        motion = self.page.evaluate('''() => {
          const animation = document.getAnimations().find(item => item.animationName === 'ambient-settle');
          window.__ambientOnArrival = animation;
          return animation ? animation.effect.getTiming() : null;
        }''')
        self.assertIsNotNone(motion)
        self.assertEqual(motion['iterations'], 1)
        self.assertEqual(motion['duration'], 3600)
        self.page.wait_for_timeout(4000)
        self.assertEqual(self.page.evaluate('window.__ambientOnArrival.playState'), 'finished')
        self.page.evaluate('location.hash = "test"')
        expect(self.page.locator('#test-panel')).to_be_visible()
        self.assertTrue(self.page.evaluate('''() => {
          const current = document.getAnimations().find(item => item.animationName === 'ambient-settle');
          return current === window.__ambientOnArrival && current.playState === 'finished';
        }'''))
        self.page.evaluate('(lesson) => { location.hash = "egitim/" + lesson; }', LESSON)
        expect(self.page.locator('.lesson')).to_be_visible()
        opaque = '''() => {
          const canvas = document.createElement('canvas');
          canvas.width = canvas.height = 1;
          const context = canvas.getContext('2d');
          context.fillStyle = getComputedStyle(document.querySelector('#shell-scroll')).backgroundColor;
          context.fillRect(0, 0, 1, 1);
          return context.getImageData(0, 0, 1, 1).data[3];
        }'''
        self.assertEqual(self.page.evaluate(opaque), 255)
        self.open_tenant_question()
        self.assertEqual(self.page.evaluate(opaque), 255)
        self.page.emulate_media(reduced_motion='reduce')
        self.assertEqual(self.page.evaluate('getComputedStyle(document.body, "::before").animationName'), 'none')
        self.assertFalse(self.page.evaluate('''document.getAnimations().some(animation =>
          animation.animationName === 'ambient-settle' && animation.playState === 'running')'''))


if __name__ == '__main__':
    unittest.main(argv=['reading_system.py', *TEST_ARGS], verbosity=2)
