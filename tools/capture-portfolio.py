#!/usr/bin/env python3
"""Regenerate actual About screenshots from a locally served app.
Requires development-only Python Playwright, Chromium and Pillow. No app deps.
Run: python3 tools/capture-portfolio.py --base-url http://127.0.0.1:8000
The isolated demo context uses the real bank, scoring and DOM; no mock screens.
"""
import argparse
from io import BytesIO
from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base-url', default='http://127.0.0.1:8000')
parser.add_argument('--browser-path', default='/usr/bin/chromium')
args = parser.parse_args()
base = args.base_url.rstrip('/')
output = Path(__file__).resolve().parents[1] / 'about' / 'assets'
output.mkdir(exist_ok=True)
lesson = 'tenses-present-perfect-vs-past-simple'

with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path=args.browser_path)
    for size, width, height in [('phone', 390, 844), ('wide', 1440, 1000)]:
        context = browser.new_context(viewport={'width': width, 'height': height}, device_scale_factor=1,
                                      color_scheme='dark', reduced_motion='reduce', service_workers='block')
        page = context.new_page()
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(base + '/index.html')
        page.wait_for_selector('#index-list .tile')
        page.evaluate('''async id => {
          const {recordLessonRead} = await import('./js/storage.js');
          localStorage.setItem('englishPrep.theme','dark');
          localStorage.setItem('englishPrep.onboarded','1');
          recordLessonRead(id, .42);
        }''', lesson)
        page.reload()

        def capture(name):
            page.evaluate('document.fonts.ready')
            page.wait_for_timeout(150)
            image = Image.open(BytesIO(page.screenshot()))
            image.save(output / f'{name}-{size}.webp', format='WEBP', quality=90, method=6)
            print(f'{name}-{size}.webp: {width}×{height}', flush=True)

        page.wait_for_selector('.study-intro__progress')
        capture('education')
        page.goto(base + '/index.html#egitim/' + lesson)
        page.wait_for_selector('[data-reading-start]')
        page.evaluate('document.fonts.ready')
        page.wait_for_timeout(100)
        page.evaluate("document.querySelector('#shell-scroll').scrollTop=0")
        capture('article')
        # Preserve deterministic, valid question order through the same session
        # boundary used by resume. All question text comes from the real bank.
        correct = page.evaluate('''async () => {
          const {loadManifest, loadQuestionsForTopics} = await import('./js/topics.js');
          const state = await import('./js/session-state.js');
          const topic = (await loadManifest()).topics.find(t => t.id === 'modals');
          const bank = await loadQuestionsForTopics([topic]);
          const session = [...bank].sort((a,b) => a.prompt.length-b.prompt.length || a.id.localeCompare(b.id)).slice(0,5);
          const request = {mode:'topic',topicIds:['modals'],count:5};
          if (!state.setQuizRequest(request) || !state.setActiveQuiz(state.createQuizSnapshot({
            attemptId:'portfolio-demo', date:new Date().toISOString(), request, session,
            selectedAnswers:session.map(() => null), currentIndex:0, optionsHidden:false,
          },bank))) throw new Error('Invalid demo session');
          window.portfolioSession = session;
          return session[0].correctAnswer;
        }''')
        page.goto(base + '/quiz.html')
        page.wait_for_selector('.option')
        page.locator('.option').filter(has=page.locator('.option__text', has_text=correct)).first.click()
        page.wait_for_selector('.feedback')
        page.evaluate("document.querySelector('#shell-scroll').scrollTop=0")
        capture('test')
        # Score five actual questions with four correct answers. These are demo
        # results, clearly identified as such on the portfolio page.
        page.evaluate('''async () => {
          const {loadManifest,loadQuestionsForTopics} = await import('./js/topics.js');
          const {scoreSession} = await import('./js/quiz-engine.js');
          const {setQuizResult} = await import('./js/session-state.js');
          const topic = (await loadManifest()).topics.find(t=>t.id==='modals');
          const bank=await loadQuestionsForTopics([topic]);
          const session=[...bank].sort((a,b)=>a.prompt.length-b.prompt.length||a.id.localeCompare(b.id)).slice(0,5);
          const answers=session.map((q,i)=>i===0?q.options.find(o=>o!==q.correctAnswer):q.correctAnswer);
          if(!setQuizResult({...scoreSession(session,answers), date:new Date().toISOString(), mode:'topic',topicTitles:{modals:topic.title}, recorded:true})) throw new Error('Invalid demo result');
        }''')
        page.goto(base + '/results.html')
        page.wait_for_selector('.score__metric')
        capture('results')
        if errors:
            raise RuntimeError(errors)
        context.close()
    browser.close()
