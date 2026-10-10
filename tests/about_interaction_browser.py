#!/usr/bin/env python3
"""/about/ (v0.77): the lens, the distinction map, the question anatomy, the
study loop, live craft proofs, motion preferences and responsive layout.

Serve the repository under /english-prep/ (as GitHub Pages does) or pass
--base-url. Learning data must never be written by this page.
"""
import json
import re
import unittest
from pathlib import Path
from playwright.sync_api import expect, sync_playwright

from _harness import launch_chromium, make_parser

parser = make_parser(__doc__)
ARGS, TEST_ARGS = parser.parse_known_args()
BASE = ARGS.base_url.rstrip('/')
ROOT = Path(__file__).resolve().parent.parent
MANIFEST = json.loads((ROOT / 'data' / 'manifest.json').read_text())


def lesson_id(topic, category):
    slug = re.sub(r'[^a-z0-9]+', '-', category.lower()).strip('-')
    return f'{topic}-{slug}'


ALL_LESSONS = {lesson_id(t['id'], l['category']) for t in MANIFEST['topics'] for l in t['lessons']}


class AboutInteractionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        cls.browser = launch_chromium(cls.pw, ARGS)

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()

    def setUp(self):
        self.context = None
        self.errors = []

    def tearDown(self):
        if self.context:
            self.context.close()
        self.assertEqual(self.errors, [])

    def open(self, width=1440, height=1000, reduced='no-preference', init=None, block_module=False):
        self.context = self.browser.new_context(viewport={'width': width, 'height': height},
                                                service_workers='block', reduced_motion=reduced)
        if init:
            self.context.add_init_script(init)
        self.page = self.context.new_page()
        self.page.set_default_timeout(8000)
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))
        self.page.on('console', lambda m: m.type == 'error' and not block_module and self.errors.append(m.text))
        if block_module:
            self.page.route('**/about/about.js', lambda route: route.abort())
        self.page.goto(BASE + '/about/')
        if not block_module:
            expect(self.page.locator('#lens-forms [role="radio"]')).to_have_count(2)
        return self.page

    def scroll_to(self, selector, block='center'):
        self.page.locator(selector).first.evaluate('(e, b) => e.scrollIntoView({block: b})', block)
        self.page.wait_for_timeout(500)

    # ---- The lens ----
    def test_lens_is_a_keyboard_radiogroup_whose_diagram_follows_the_meaning(self):
        page = self.open()
        radios = page.locator('#lens-forms [role="radio"]')
        expect(radios.nth(0)).to_have_attribute('aria-checked', 'true')
        expect(page.locator('#lens-stage')).to_have_attribute('data-state', 'closed')
        expect(page.locator('#lens-reading')).to_contain_text('Past Simple.')
        radios.nth(0).focus()
        page.keyboard.press('ArrowRight')
        expect(radios.nth(1)).to_be_focused()
        expect(radios.nth(1)).to_have_attribute('aria-checked', 'true')
        expect(radios.nth(0)).to_have_attribute('aria-checked', 'false')
        expect(page.locator('#lens-stage')).to_have_attribute('data-state', 'linked')
        expect(page.locator('#lens-reading')).to_contain_text('Present Perfect.')
        self.assertEqual(radios.nth(1).get_attribute('lang'), 'en')
        # Only the active state's marks are drawn.
        self.assertGreater(page.locator('#lens-stage [data-on].is-on').count(), 0)
        self.assertTrue(all('linked' in (n.get_attribute('data-on') or '').split()
                            for n in page.locator('#lens-stage [data-on].is-on').all()))
        href = page.locator('#lens-lesson').get_attribute('href')
        self.assertEqual(href, '../index.html#egitim/tenses-present-perfect-vs-past-simple')

    def test_every_pair_links_to_a_real_lesson_and_interaction_stops_autoplay(self):
        page = self.open()
        pager = page.locator('.ab-pager__item')
        expect(pager).to_have_count(3)
        seen = []
        for index in range(3):
            pager.nth(index).click()
            expect(pager.nth(index)).to_have_attribute('aria-pressed', 'true')
            href = page.locator('#lens-lesson').get_attribute('href')
            seen.append(href.split('#egitim/')[1])
        self.assertEqual(len(set(seen)), 3)
        self.assertTrue(set(seen) <= ALL_LESSONS, seen)
        expect(page.locator('#lens-title')).to_have_text('Yasak mı, serbest mi?')
        expect(page.locator('.ab-autoplay')).to_have_attribute('aria-pressed', 'false')
        state = page.locator('#lens-stage').get_attribute('data-state')
        page.wait_for_timeout(3400)
        self.assertEqual(page.locator('#lens-stage').get_attribute('data-state'), state, 'A touched lens stays put')

    def test_autoplay_walks_the_pairs_and_can_be_paused(self):
        page = self.open()
        page.wait_for_function('document.querySelector(".ab-autoplay").getAttribute("aria-pressed") === "true"', timeout=6000)
        page.wait_for_function('document.querySelector("#lens-stage").dataset.state !== "closed"', timeout=6000)
        page.locator('.ab-autoplay').click()
        expect(page.locator('.ab-autoplay')).to_have_attribute('aria-pressed', 'false')
        state = page.locator('#lens-stage').get_attribute('data-state')
        page.wait_for_timeout(3200)
        self.assertEqual(page.locator('#lens-stage').get_attribute('data-state'), state)

    # ---- The map ----
    def test_map_is_read_from_the_manifest_and_every_chip_opens_its_lesson(self):
        page = self.open()
        self.scroll_to('#map-grid', 'start')
        chips = page.locator('.ab-chip')
        expect(chips).to_have_count(len(ALL_LESSONS))
        hrefs = chips.evaluate_all('(nodes) => nodes.map((n) => n.getAttribute("href"))')
        ids = {h.split('#egitim/')[1] for h in hrefs}
        self.assertEqual(ids, ALL_LESSONS)
        expect(page.locator('.ab-topic')).to_have_count(len(MANIFEST['topics']))
        figures = page.locator('.ab-figure dd').all_text_contents()
        self.assertEqual(figures[:3], [str(len(MANIFEST['topics'])), str(len(ALL_LESSONS)),
                                       str(sum(t['questionCount'] for t in MANIFEST['topics']))])
        notes = sum(len(q.get('optionNotes', {})) for t in MANIFEST['topics']
                    for q in json.loads((ROOT / t['file']).read_text())['questions'])
        expect(page.locator('.ab-figure dd').nth(3)).to_have_text(str(notes))
        # Hover/focus previews the lesson's own question in place of the gloss.
        first = MANIFEST['topics'][0]
        chips.first.focus()
        expect(page.locator('.ab-topic__gloss').first).to_have_text(first['lessons'][0]['summary'])

    # ---- Anatomy ----
    def test_anatomy_answers_with_the_picked_options_own_note_and_writes_nothing(self):
        page = self.open()
        before = page.evaluate('JSON.stringify({...localStorage})')
        tenses = json.loads((ROOT / 'data/tenses/tenses.json').read_text())
        question = next(q for q in tenses['questions'] if q['id'] == 'tenses-t5')
        wrong = next(o for o in question['options'] if o in question['optionNotes'])
        self.scroll_to('#specimen')
        page.locator('.ab-option', has_text=re.compile(rf'^\s*\d\s*{re.escape(wrong)}\s*$')).click()
        expect(page.locator('.ab-result__verdict')).to_have_text('Bu değil.')
        expect(page.locator('.ab-result__note')).to_contain_text(question['optionNotes'][wrong])
        expect(page.locator('.ab-result__why')).to_contain_text(question['options'][question['correctIndex']])
        expect(page.locator('.ab-blank')).to_have_text(wrong)
        expect(page.locator('.ab-option.is-right')).to_have_count(1)
        page.get_by_role('button', name='Başka bir seçenek dene').click()
        expect(page.locator('.ab-result__hint')).to_be_visible()
        expect(page.locator('.ab-option').first).to_be_focused()
        right = question['options'][question['correctIndex']]
        page.locator('.ab-option', has_text=right).click()
        expect(page.locator('.ab-result__verdict')).to_have_text('Doğru.')
        lesson = page.locator('.ab-result__foot a').get_attribute('href').split('#egitim/')[1]
        self.assertIn(lesson, ALL_LESSONS)
        self.assertEqual(page.evaluate('JSON.stringify({...localStorage})'), before, 'About never writes learning data')

    def test_a_callout_for_a_part_that_does_not_exist_yet_reveals_it(self):
        page = self.open()
        self.scroll_to('#callouts')
        expect(page.locator('#specimen [data-part="tip"]')).to_have_count(0)
        page.locator('.ab-callout__button').nth(3).click()
        expect(page.locator('#specimen [data-part="tip"]')).to_have_count(1)
        expect(page.locator('#specimen')).to_have_attribute('data-highlight', 'tip')

    # ---- Flow ----
    def test_wide_device_follows_the_step_being_read(self):
        page = self.open()
        for step in ['apply', 'return', 'read']:
            self.scroll_to(f'.ab-step[data-step="{step}"]')
            expect(page.locator('#flow-device')).to_have_attribute('data-step', step)
            expect(page.locator(f'.ab-device__img.is-active[data-step="{step}"]')).to_have_count(1)
            expect(page.locator(f'.ab-step[data-step="{step}"]')).to_have_class(re.compile('is-active'))

    def test_phone_reads_inline_captures_with_alt_text_and_hides_the_device(self):
        page = self.open(390, 844)
        expect(page.locator('#flow-device')).to_be_hidden()
        images = page.locator('.ab-step__img')
        expect(images).to_have_count(3)
        for image in images.all():
            self.assertTrue(image.get_attribute('alt'))
        self.scroll_to('.ab-step[data-step="apply"] img')
        page.wait_for_function('document.querySelector(".ab-step[data-step=apply] img").complete')

    # ---- Craft ----
    def test_craft_proofs_are_computed_from_the_app_itself(self):
        page = self.open()
        self.scroll_to('#springs')
        expect(page.locator('.ab-chart__curve')).to_have_count(3)
        live = page.evaluate('''async () => {
          const { spring } = await import("../js/interactions.js");
          return ["soft", "lively", "bouncy"].map((n) => spring(n).duration + " ms");
        }''')
        self.assertEqual(page.locator('.ab-legend__ms').all_text_contents(), live)
        ratios = [float(t.split(':')[0].replace(',', '.')) for t in page.locator('.ab-swatch__ratio').all_text_contents()]
        self.assertEqual(len(ratios), 4)
        self.assertTrue(all(r >= 4.5 for r in ratios), ratios)
        page.get_by_role('button', name='Oynat').click()
        page.wait_for_timeout(900)
        moved = page.evaluate('[...document.querySelectorAll(".ab-lane__ball")].map((b) => getComputedStyle(b).transform)')
        self.assertTrue(all(t != 'none' for t in moved), moved)

    # ---- Motion preferences ----
    def test_reduced_motion_shows_everything_and_never_autoplays(self):
        page = self.open(reduced='reduce')
        self.assertFalse(page.evaluate('document.documentElement.classList.contains("reveal-ready")'))
        hidden = page.evaluate('[...document.querySelectorAll("[data-reveal]")].filter((e) => getComputedStyle(e).opacity !== "1").length')
        self.assertEqual(hidden, 0)
        page.wait_for_timeout(2500)
        expect(page.locator('.ab-autoplay')).to_have_attribute('aria-pressed', 'false')
        expect(page.locator('#lens-stage')).to_have_attribute('data-state', 'closed')
        self.scroll_to('#springs')
        expect(page.get_by_role('button', name='Oynat')).to_be_disabled()
        expect(page.locator('#manifesto-text')).to_have_attribute('data-lit', 'all')

    def test_the_app_motion_switch_is_respected_here(self):
        page = self.open(init="localStorage.setItem('englishPrep.motion','off')")
        self.assertFalse(page.evaluate('document.documentElement.classList.contains("reveal-ready")'))
        page.wait_for_timeout(2500)
        expect(page.locator('#lens-stage')).to_have_attribute('data-state', 'closed')

    def test_reveals_never_strand_content_when_the_module_fails(self):
        page = self.open(block_module=True)
        page.wait_for_timeout(3000)
        hidden = page.evaluate('[...document.querySelectorAll("[data-reveal]")].filter((e) => getComputedStyle(e).opacity !== "1").length')
        self.assertEqual(hidden, 0)
        expect(page.locator('#hero-title')).to_be_visible()

    def test_reveal_shows_sections_as_they_arrive(self):
        page = self.open()
        heading = page.locator('#harita .ab-section__head')
        self.assertEqual(heading.evaluate('(e) => getComputedStyle(e).opacity'), '0')
        self.scroll_to('#harita .ab-section__head')
        page.wait_for_function('getComputedStyle(document.querySelector("#harita .ab-section__head")).opacity === "1"')

    # ---- Layout ----
    def test_no_overflow_and_touch_targets_at_every_width(self):
        for width, height in [(320, 640), (390, 844), (768, 1024), (1440, 900)]:
            with self.subTest(width=width):
                page = self.open(width, height)
                page.evaluate('document.documentElement.classList.add("reveal-all")')
                self.scroll_to('.ab-footer')
                page.wait_for_timeout(300)
                self.assertLessEqual(page.evaluate('document.documentElement.scrollWidth'), width)
                small = page.evaluate('''() => [...document.querySelectorAll(
                    ".ab-button, .ab-sentence, .ab-pager__item, .ab-autoplay, .ab-option, .ab-callout__button, .ab-chip, .ab-faq__item summary, .ab-topnav a")]
                  .filter((e) => e.getClientRects().length)
                  .map((e) => [e.className || e.tagName, Math.round(e.getBoundingClientRect().height), Math.round(e.getBoundingClientRect().width)])
                  .filter(([, h, w]) => h < 44 || w < 44)''')
                self.assertEqual(small, [])
                self.context.close()
                self.context = None

    def test_faq_is_native_disclosure(self):
        page = self.open()
        self.scroll_to('#faq-list')
        first = page.locator('.ab-faq__item').first
        first.locator('summary').click()
        expect(first).to_have_attribute('open', '')


if __name__ == '__main__':
    unittest.main(argv=[__file__, *TEST_ARGS], verbosity=2)
