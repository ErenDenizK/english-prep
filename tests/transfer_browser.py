#!/usr/bin/env python3
"""User-reviewed data transfer: native API outcomes are simulated, downloads real."""
import argparse
import json
from pathlib import Path
import unittest
from playwright.sync_api import sync_playwright, expect


class TransferBrowser(unittest.TestCase):
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
        self.errors = []
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))
        self.page.add_init_script('''localStorage.setItem('englishPrep.onboarded', '1');
          localStorage.setItem('englishPrep.profileName', 'Ada');
          localStorage.setItem('englishPrep.lessonProgress', JSON.stringify({sample:{read:0.5,done:false}}));''')

    def tearDown(self):
        self.context.close()
        self.assertEqual(self.errors, [])

    def open_transfer(self):
        self.page.goto(ARGS.base.rstrip('/') + '/index.html#profil')
        self.page.get_by_role('button', name='Yedek al', exact=True).click()
        expect(self.page.locator('#backup-dialog')).to_be_visible()

    def test_review_then_download_valid_backup_without_changing_local_state(self):
        self.page.add_init_script("Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>false});")
        self.open_transfer()
        expect(self.page.locator('#backup-preview-counts')).to_contain_text('1 ders kaydı')
        expect(self.page.get_by_role('button', name='Dosyayı paylaş', exact=True)).to_be_hidden()
        before = self.page.evaluate('JSON.stringify({...localStorage})')
        with self.page.expect_download() as event:
            self.page.get_by_role('button', name='Dosyayı indir', exact=True).click()
        data = json.loads(Path(event.value.path()).read_text())
        self.assertEqual(data['app'], 'english-prep')
        self.assertEqual(data['version'], 1)
        self.assertEqual(data['data']['profileName'], 'Ada')
        self.assertEqual(data['data']['lessonProgress']['sample']['read'], 0.5)
        self.assertEqual(self.page.evaluate('JSON.stringify({...localStorage})'), before)
        expect(self.page.locator('#backup-export-status')).to_contain_text('İndirme başlatıldı')
        self.page.get_by_role('button', name='Kapat', exact=True).click()
        expect(self.page.get_by_role('button', name='Yedek al', exact=True)).to_be_focused()
        expect(self.page.locator('#backup-export-text')).to_have_value('')

    def test_canceled_and_failed_shares_stay_in_review_without_automatic_download(self):
        self.page.add_init_script('''window.calls=0;
          Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>true});
          Object.defineProperty(navigator,'share',{configurable:true,value:async()=>{
            window.calls++;
            if(window.calls===1)throw new DOMException('dismissed','AbortError');
            throw new DOMException('blocked','NotAllowedError');
          }});''')
        downloads = []
        self.page.on('download', lambda event: downloads.append(event))
        self.open_transfer()
        share = self.page.get_by_role('button', name='Dosyayı paylaş', exact=True)
        share.click()
        expect(self.page.locator('#backup-export-status')).to_contain_text('Paylaşım yapılmadı')
        share.click()
        expect(self.page.locator('#backup-export-status')).to_contain_text('Paylaşım açılamadı')
        self.assertEqual(downloads, [])
        self.assertEqual(self.page.evaluate('window.calls'), 2)
        expect(self.page.locator('#backup-dialog')).to_be_visible()

    def test_blocked_clipboard_exposes_selected_manual_text_at_320px(self):
        self.page.set_viewport_size({'width':320,'height':568})
        self.page.add_init_script('''Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new Error('denied')}}});''')
        self.open_transfer()
        self.page.get_by_role('button', name='Yedek metnini kopyala', exact=True).click()
        text = self.page.locator('#backup-export-text')
        expect(text).to_be_visible()
        expect(text).to_be_focused()
        selected = text.evaluate('node=>[node.selectionStart,node.selectionEnd,node.value.length]')
        self.assertEqual(selected, [0, selected[2], selected[2]])
        expect(self.page.locator('#backup-export-status')).to_contain_text('Otomatik kopyalama kullanılamıyor')
        self.assertTrue(self.page.locator('#backup-dialog').evaluate('n=>n.scrollWidth<=n.clientWidth+1'))
        self.page.keyboard.press('Escape')
        expect(self.page.locator('#backup-dialog')).to_be_hidden()
        expect(self.page.get_by_role('button', name='Yedek al', exact=True)).to_be_focused()

    def test_late_share_resolution_cannot_update_reopened_snapshot(self):
        self.page.add_init_script('''Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>true});
          Object.defineProperty(navigator,'share',{configurable:true,value:()=>new Promise(resolve=>window.finishShare=resolve)});''')
        self.open_transfer()
        self.page.get_by_role('button', name='Dosyayı paylaş', exact=True).click()
        self.page.get_by_role('button', name='Kapat', exact=True).click()
        self.page.get_by_role('button', name='Yedek al', exact=True).click()
        self.page.evaluate('window.finishShare()')
        expect(self.page.locator('#backup-export-status')).to_have_text('')
        expect(self.page.get_by_role('button', name='Dosyayı paylaş', exact=True)).to_have_attribute('aria-disabled','false')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--base', default='http://127.0.0.1:8182/english-prep')
    parser.add_argument('--browser-path', default='/usr/bin/chromium')
    ARGS, rest = parser.parse_known_args()
    unittest.main(argv=[__file__, *rest])
