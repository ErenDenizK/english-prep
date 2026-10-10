#!/usr/bin/env python3
"""Native dialog, menu and answer-state regressions; serve the app first."""
import re
import unittest

from playwright.sync_api import expect, sync_playwright

from _harness import launch_chromium, make_parser

parser = make_parser(__doc__)
ARGS, TEST_ARGS = parser.parse_known_args()
BASE = ARGS.base_url.rstrip('/')


class ComponentInteractionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        cls.browser = launch_chromium(cls.pw, ARGS)

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.pw.stop()

    def setUp(self):
        self.context = self.browser.new_context(
            viewport={'width': 390, 'height': 844}, service_workers='block', reduced_motion='no-preference')
        self.page = self.context.new_page()
        self.page.set_default_timeout(8000)
        self.errors = []
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [], 'Uncaught application errors')

    def visit(self, path):
        self.page.goto(BASE + '/' + path)

    def test_dialog_padding_is_not_backdrop_and_cancellation_restores_focus(self):
        self.visit('index.html#profil')
        reset = self.page.get_by_role('button', name='Geçmişi sıfırla', exact=True)
        reset.click()
        dialog = self.page.locator('#confirm-dialog')
        expect(dialog).to_be_visible()
        expect(self.page.get_by_role('button', name='Vazgeç', exact=True)).to_be_focused()
        self.page.wait_for_function("!document.querySelector('#confirm-dialog').getAnimations().some(a => a.playState === 'running')")
        box = dialog.bounding_box()
        self.page.mouse.click(box['x'] + 6, box['y'] + 6)
        expect(dialog).to_be_visible()
        self.page.keyboard.press('Escape')
        expect(dialog).not_to_be_visible()
        expect(reset).to_be_focused()
        reset.click()
        self.page.mouse.click(4, 4)
        expect(dialog).not_to_be_visible()
        expect(reset).to_be_focused()

    def test_menu_active_option_does_not_change_committed_check_until_enter(self):
        for width, height in [(320, 740), (390, 844), (1440, 1000)]:
            with self.subTest(width=width):
                self.page.set_viewport_size({'width': width, 'height': height})
                self.visit('index.html#test')
                trigger = self.page.locator('[aria-labelledby~="mixed-count-label"]')
                trigger.click()
                menu = self.page.locator('[role="listbox"]:visible')
                selected = menu.locator('[aria-selected="true"]')
                current = selected.locator('.listbox__option-label').inner_text()
                self.assertEqual(menu.locator('.listbox__option-mark svg').count(), 1)
                trigger.press('ArrowDown')
                self.assertEqual(selected.locator('.listbox__option-label').inner_text(), current)
                active_id = trigger.get_attribute('aria-activedescendant')
                next_value = self.page.locator('#' + active_id + ' .listbox__option-label').inner_text()
                self.assertNotEqual(next_value, current)
                bounds = menu.bounding_box()
                self.assertGreaterEqual(bounds['x'], 0)
                self.assertLessEqual(bounds['x'] + bounds['width'], width)
                self.assertLessEqual(bounds['y'] + bounds['height'], height)
                trigger.press('Enter')
                expect(trigger).to_have_attribute('aria-expanded', 'false')
                expect(trigger).to_contain_text(next_value)
                expect(trigger).to_be_focused()
                trigger.click()
                expect(menu.locator('[aria-selected="true"] .listbox__option-label')).to_have_text(next_value)
                trigger.press('Escape')
                expect(trigger).to_contain_text(next_value)

    def test_restore_dialog_padding_keeps_uncommitted_input(self):
        self.visit('index.html#profil')
        opener = self.page.get_by_role('button', name='Yedekten geri yükle', exact=True)
        opener.click()
        dialog = self.page.locator('#restore-dialog')
        expect(dialog).to_be_visible()
        expect(self.page.locator('#restore-dialog-title')).to_be_focused()
        self.page.locator('#restore-text').fill('A draft that has not been imported')
        self.page.wait_for_function("!document.querySelector('#restore-dialog').getAnimations().some(a => a.playState === 'running')")
        box = dialog.bounding_box()
        self.page.mouse.click(box['x'] + 6, box['y'] + 6)
        expect(dialog).to_be_visible()
        expect(self.page.locator('#restore-text')).to_have_value('A draft that has not been imported')
        self.page.keyboard.press('Escape')
        expect(dialog).not_to_be_visible()
        expect(opener).to_be_focused()
        opener.click()
        self.page.mouse.click(4, 4)
        expect(dialog).not_to_be_visible()

    def test_answer_state_is_available_without_changing_english_option_names(self):
        self.visit('index.html#egitim/tenses-present-perfect-vs-past-simple')
        options = self.page.locator('.lesson-pretest .option')
        options.first.wait_for()
        selected_text = options.first.locator('.option__text').inner_text()
        options.first.click()
        group = self.page.locator('.lesson-pretest .options')
        correct = group.locator('.option--ok')
        chosen = group.locator('.option--picked')
        description_id = correct.get_attribute('aria-describedby')
        self.assertTrue(description_id)
        expect(self.page.locator('#' + description_id)).to_contain_text('Doğru cevap.')
        chosen_description = chosen.get_attribute('aria-describedby')
        expect(self.page.locator('#' + chosen_description)).to_contain_text('Senin cevabın.')
        expect(chosen.locator('.option__text')).to_have_text(selected_text)
        expect(chosen.locator('.option__text')).to_have_attribute('lang', 'en')
        # Status descriptions must be outside the button so its original
        # English answer remains the name and Turkish stays a description.
        self.assertEqual(group.locator('.option .answer-state').count(), 0)
        self.assertTrue(chosen.evaluate("e => e.getAttribute('aria-disabled') === 'true'"))
        expect(chosen).to_be_focused()

    def test_answer_commit_does_not_restart_whole_question_entry(self):
        self.visit('index.html#test')
        self.page.get_by_role('button', name='Teste başla', exact=True).click()
        self.page.locator('#question-stem').wait_for()
        self.assertEqual(self.page.locator('#quiz-container > .quiz-step--enter').count(), 1)
        self.page.locator('.option').first.click()
        expect(self.page.locator('.feedback')).to_be_visible()
        self.assertEqual(self.page.locator('#quiz-container > .animate-in').count(), 0)
        self.page.get_by_role('button', name='Sonraki soru', exact=True).click()
        self.assertEqual(self.page.locator('#quiz-container > .quiz-step--enter').count(), 1)
        self.assertEqual(self.page.locator('.feedback').count(), 0)

    def test_motion_off_keeps_menu_and_dialog_fully_usable(self):
        self.page.add_init_script("localStorage.setItem('englishPrep.motion', 'off')")
        self.visit('index.html#test')
        trigger = self.page.locator('[aria-labelledby~="mixed-count-label"]')
        trigger.click()
        menu = self.page.locator('[role="listbox"]:visible')
        self.assertFalse(menu.evaluate("e => e.getAnimations({subtree:true}).some(a => a.playState === 'running')"))
        trigger.press('End')
        trigger.press('Enter')
        expect(trigger).to_contain_text('Tümü')
        trigger.click()
        # Freeze the opening frame and click the outermost first-row edge.
        # Bounding rectangles alone would miss a clip-path removing hit area.
        menu.evaluate('''root => root.getAnimations({subtree:true}).forEach(a => {
          a.pause(); a.currentTime = 0;
        })''')
        first = menu.locator('[role="option"]').first
        expected = first.locator('.listbox__option-label').inner_text()
        box = first.bounding_box()
        self.page.mouse.click(box['x'] + box['width'] / 2, box['y'] + 1)
        expect(trigger).to_have_attribute('aria-expanded', 'false')
        expect(trigger).to_contain_text(expected)
        self.visit('index.html#profil')
        self.page.get_by_role('button', name='Geçmişi sıfırla', exact=True).click()
        dialog = self.page.locator('#confirm-dialog')
        self.assertFalse(dialog.evaluate("e => e.getAnimations({subtree:true}).some(a => a.playState === 'running')"))
        self.page.get_by_role('button', name='Vazgeç', exact=True).click()
        expect(dialog).not_to_be_visible()

    def test_popup_assembles_visible_labels_without_moving_option_hitboxes(self):
        self.page.add_init_script('''(() => {
          const animate = Element.prototype.animate;
          window.partEffects = [];
          Element.prototype.animate = function(frames, timing) {
            window.partEffects.push({className:this.className, id:this.id, frames, timing});
            return animate.call(this, frames, timing);
          };
        })();''')
        self.visit('index.html#test')
        trigger = self.page.locator('[aria-labelledby~="mixed-count-label"]')
        trigger.click()
        menu = self.page.locator('[role="listbox"]:visible')
        effects = self.page.evaluate('partEffects.filter(e => String(e.className).startsWith("listbox__"))')
        labels = [e for e in effects if e['className'] == 'listbox__option-label']
        self.assertGreaterEqual(len(labels), 2)
        self.assertLessEqual(len(labels), 4)
        self.assertEqual(len({e['timing']['delay'] for e in labels}), len(labels))
        self.assertLessEqual(max(e['timing']['delay'] for e in labels), 105)
        surface = [e for e in effects if e['className'] == 'listbox__menu']
        self.assertTrue(surface)
        self.assertTrue(all('transform' not in frame for frame in surface[-1]['frames']))
        self.assertFalse(any(e['className'] == 'listbox__option' for e in effects))
        before = menu.locator('[role="option"]').evaluate_all('''items => items.map(item => {
          const r = item.getBoundingClientRect(); return [r.x, r.y, r.width, r.height];
        })''')
        menu.evaluate('''async root => {
          await Promise.allSettled(root.getAnimations({subtree:true}).map(a => a.finished));
        }''')
        after = menu.locator('[role="option"]').evaluate_all('''items => items.map(item => {
          const r = item.getBoundingClientRect(); return [r.x, r.y, r.width, r.height];
        })''')
        self.assertEqual(before, after)
        trigger.press('End')
        trigger.press('Enter')
        expect(trigger).to_contain_text('Tümü')

    def test_dialog_parts_open_independently_and_cancel_without_waiting(self):
        self.visit('index.html#profil')
        self.page.get_by_role('button', name='Geçmişi sıfırla', exact=True).evaluate('(button) => button.click()')
        dialog = self.page.locator('#confirm-dialog')
        expect(self.page.get_by_role('button', name='Vazgeç', exact=True)).to_be_focused()
        targets = dialog.evaluate('''root => root.getAnimations({subtree:true}).map(a => ({
          id:a.effect.target.id, className:a.effect.target.className,
          frames:a.effect.getKeyframes(), delay:a.effect.getTiming().delay
        }))''')
        self.assertTrue(any(t['id'] == 'confirm-dialog-title' for t in targets))
        self.assertEqual(len([t for t in targets if t['className'] == 'dialog__action-label']), 2)
        surface = next(t for t in targets if t['id'] == 'confirm-dialog')
        self.assertTrue(all('transform' not in frame for frame in surface['frames']))
        self.page.evaluate('''() => {
          window.cancelledDialogEffects = document.querySelector('#confirm-dialog').getAnimations({subtree:true});
          document.querySelector('#confirm-dialog-cancel').click();
        }''')
        expect(dialog).not_to_be_visible()
        self.page.wait_for_function('cancelledDialogEffects.every(a => a.playState === "idle")')
        self.page.get_by_role('button', name='Geçmişi sıfırla', exact=True).click()
        self.assertEqual(dialog.locator('.dialog__action-label .dialog__action-label').count(), 0)
        self.page.keyboard.press('Escape')


if __name__ == '__main__':
    unittest.main(argv=['component_interactions_browser.py'] + TEST_ARGS)
