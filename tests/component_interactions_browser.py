#!/usr/bin/env python3
"""Native dialog, menu and answer-state regressions; serve the app first."""
import argparse
import re
import unittest

from playwright.sync_api import expect, sync_playwright

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base-url', default='http://127.0.0.1:8000')
parser.add_argument('--browser-path', default='/usr/bin/chromium')
ARGS, TEST_ARGS = parser.parse_known_args()
BASE = ARGS.base_url.rstrip('/')


class ComponentInteractionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pw = sync_playwright().start()
        cls.browser = cls.pw.chromium.launch(executable_path=ARGS.browser_path, args=['--no-sandbox'])

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
        self.visit('index.html#profil')
        self.page.get_by_role('button', name='Geçmişi sıfırla', exact=True).click()
        dialog = self.page.locator('#confirm-dialog')
        self.assertFalse(dialog.evaluate("e => e.getAnimations({subtree:true}).some(a => a.playState === 'running')"))
        self.page.get_by_role('button', name='Vazgeç', exact=True).click()
        expect(dialog).not_to_be_visible()


if __name__ == '__main__':
    unittest.main(argv=['component_interactions_browser.py'] + TEST_ARGS)
