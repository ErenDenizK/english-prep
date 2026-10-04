#!/usr/bin/env python3
"""Generate repository presentation media from the actual English Prep UI.

First regenerate production screenshots with tools/capture-portfolio.py. Then:
python3 docs/github/capture.py --base-url http://127.0.0.1:8000

Development-only: Python Playwright, Chromium, FFmpeg and Pillow. No app dependencies.
The media browser is isolated, blocks service workers and never writes a user's
progress. Frames come from actual browser recordings; timing is preserved, not synthesized.
"""
import argparse
from datetime import datetime, timezone
from io import BytesIO
import json
from pathlib import Path
import time
import subprocess
import shutil
import tempfile
from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base-url', default='http://127.0.0.1:8000')
parser.add_argument('--browser-path', default='/usr/bin/chromium')
parser.add_argument('--only', choices=['all', 'static', 'motion'], default='all')
args = parser.parse_args()
base = args.base_url.rstrip('/')
report = {'generatedAt': datetime.now(timezone.utc).isoformat(),
          'source': 'App previews use actual UI and isolated demonstration state; brand artwork is authored.',
          'baseUrl': 'Local static server serving this repository', 'assets': []}

# This composition adds framing and labels around the existing real captures.
# It does not recreate, retouch or replace the application screenshot contents.
COMPOSITION = '''<!doctype html><html lang="en"><meta charset="utf-8">
<style>
@font-face { font-family:Inter; src:url("FONT") format("woff2"); font-weight:100 900; }
* { box-sizing:border-box; }
html,body { margin:0; width:1200px; height:1100px; overflow:hidden; }
body { font-family:Inter,system-ui,sans-serif; color:#eee9ed; padding:48px;
 background:radial-gradient(ellipse at 8% 86%,#322033 0,transparent 51%),
 radial-gradient(ellipse at 92% 10%,#1d3139 0,transparent 45%),#141216; }
.eyebrow { color:#a4d3db; font-size:14px; letter-spacing:.04em; margin:0 0 12px; font-weight:580; }
h1 { font-size:34px; line-height:1.2; font-weight:650; letter-spacing:-1.2px; margin:0 0 32px; }
.stages { display:grid; grid-template-columns:repeat(3,1fr); gap:28px; }
h2 { display:flex; gap:12px; font-size:19px; align-items:center; margin:0 0 17px; font-weight:590; }
h2 span { font-size:12px; font-variant-numeric:tabular-nums; color:#c6bcc6; }
.stage:nth-child(1) h2 { color:#a4d3db; }
.stage:nth-child(2) h2 { color:#efb1cb; }
.stage:nth-child(3) h2 { color:#c8b4e9; }
.frame { margin:0; width:100%; border:1px solid #57485c; border-radius:18px; overflow:hidden; background:#141216; box-shadow:0 20px 36px #0002; }
img { display:block; width:100%; height:auto; }
.caption { font-size:15px; line-height:1.5; margin:19px 0 0; color:#d2c9d3; }
footer { color:#a69caa; font-size:12px; margin-top:26px; }
</style>
<p class="eyebrow">A SMALL LOOP, WITH A CLEAR NEXT STEP.</p>
<h1>Understand the difference. Put it to use.</h1>
<main class="stages">
<section class="stage"><h2><span>01</span> Read</h2><figure class="frame"><img src="BASE/about/assets/article-phone.webp" alt="Actual article screen"></figure><p class="caption">A complete article.<br>Room to follow the argument.</p></section>
<section class="stage"><h2><span>02</span> Apply</h2><figure class="frame"><img src="BASE/about/assets/test-phone.webp" alt="Actual question screen"></figure><p class="caption">Choose with context.<br>See what the answer means.</p></section>
<section class="stage"><h2><span>03</span> Return</h2><figure class="frame"><img src="BASE/about/assets/results-phone.webp" alt="Actual result screen"></figure><p class="caption">A result with direction.<br>Revisit the distinction.</p></section>
</main><footer>REAL APPLICATION SCREENS · DEMONSTRATION PROGRESS · NO DEVICE MOCKUPS</footer></html>'''

with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path=args.browser_path)
    if args.only in ['all', 'static']:
        context = browser.new_context(viewport={'width':1200,'height':1100}, device_scale_factor=2,
                                      reduced_motion='reduce', service_workers='block')
        page = context.new_page()
        page.goto(base + '/index.html')
        # set_content is a development capture surface, never production rendering.
        page.set_content(COMPOSITION.replace('BASE', base).replace('FONT', base+'/assets/fonts/InterVariable.woff2'))
        page.evaluate('''async () => { await document.fonts.ready;
          await Promise.all([...document.images].map(image => image.decode())); }''')
        measurements = page.locator('.frame img').evaluate_all('''images=>images.map(i=>({
          source:i.src.split('/').pop(),width:i.naturalWidth,height:i.naturalHeight}))''')
        assert all(i['width'] >= 1170 and i['height'] >= 2532 for i in measurements), measurements
        assert page.locator('footer').evaluate('e=>e.getBoundingClientRect().bottom') < 1100, 'Composition clips its footer'
        static = Image.open(BytesIO(page.screenshot()))
        static.save(OUT / 'study-flow.webp',format='WEBP',quality=94,method=6)
        report['assets'].append({'file':'study-flow.webp','width':static.width,'height':static.height,
                                 'viewport':[1200,1100], 'density':2, 'sourceCaptures':measurements})
        context.close()
        shutil.copyfile(ROOT/'about/assets/education-wide.webp',OUT/'workspace-wide.webp')
        with Image.open(OUT/'workspace-wide.webp') as wide:
            assert wide.size == (2880,2000),wide.size
            report['assets'].append({'file':'workspace-wide.webp','width':wide.width,'height':wide.height,
                'viewport':[1440,1000],'density':2,'sourceCapture':'education-wide.webp'})
        context=browser.new_context(viewport={'width':1280,'height':640},device_scale_factor=1,
                                    reduced_motion='reduce',service_workers='block')
        page=context.new_page()
        page.goto(base+'/index.html')
        page.set_content('''<!doctype html><meta charset="utf-8"><style>
          @font-face{font-family:Inter;src:url("FONT")}*{box-sizing:border-box}
          html,body{margin:0;width:1280px;height:640px;overflow:hidden;background:#141216;color:#eee9ed;font-family:Inter,system-ui,sans-serif}
          img{display:block;width:1280px;height:auto;margin:55px 0 0}
          footer{margin:12px 60px 0;border-top:1px solid #39313d;padding-top:30px;display:flex;justify-content:space-between;color:#d2c9d3;font-size:19px}
          strong{color:#eee9ed;font-weight:550}span:last-child{color:#a4d3db}
          </style><img src="BASE/docs/github/brand.svg" alt="English Prep">
          <footer><span><strong>60</strong> lessons · <strong>241</strong> questions · <strong>10</strong> topics</span><span>by ErenDenizK</span></footer>'''
          .replace('BASE',base).replace('FONT',base+'/assets/fonts/InterVariable.woff2'))
        page.evaluate('''async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()))}''')
        page.screenshot(path=str(OUT/'social-preview.png'))
        assert (OUT/'social-preview.png').stat().st_size < 1_000_000
        report['assets'].append({'file':'social-preview.png','width':1280,'height':640,
                                'role':'Optional GitHub repository social preview'})
        context.close()

    if args.only in ['all', 'motion']:
        def gif_from_video(video, target, duration, crop=None):
            # Native browser recording avoids screenshot encoding pauses during
            # interaction. One full-frame palette prevents gradient flicker while
            # preserving the unmoving neutral text and reading surfaces.
            # Playwright records full-range JPEG-derived frames into VP8 without
            # a reliable range tag. Convert explicitly to RGB before palette
            # generation (a range tag alone is ignored by this palette path).
            # Dark surfaces and neutral text retain their production values.
            graph = (f"crop={crop['width']}:{crop['height']}:{crop['x']}:{crop['y']}," if crop else '')
            graph += 'scale=in_range=full:out_range=full,format=rgb24,fps=10,split[a][b];[a]palettegen=max_colors=192:stats_mode=full[p];[b][p]paletteuse=dither=none:diff_mode=rectangle'
            subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y',
                '-sseof',f'-{duration:.3f}','-i',str(video),'-filter_complex',graph,
                '-loop','0',str(OUT/target)],check=True)
            with Image.open(OUT/target) as image:
                durations=[]
                for frame in range(image.n_frames):
                    image.seek(frame)
                    durations.append(image.info.get('duration',0))
                return {'file':target,'width':image.width,'height':image.height,
                        'frames':image.n_frames,'durationMs':sum(durations)}

        with tempfile.TemporaryDirectory(prefix='english-prep-presentation-') as temporary:
            context = browser.new_context(viewport={'width':390,'height':844},device_scale_factor=2,
                color_scheme='dark',service_workers='block',record_video_dir=temporary,
                record_video_size={'width':390,'height':844})
            page=context.new_page()
            errors=[]
            page.on('pageerror',lambda error:errors.append(str(error)))
            page.goto(base+'/index.html#hosgeldin')
            page.wait_for_selector('.onboard-flow__choices')
            page.evaluate('document.fonts.ready')
            page.wait_for_timeout(1250)
            poster=Image.open(BytesIO(page.screenshot()))
            poster.save(OUT/'introduction.webp',format='WEBP',quality=94,method=6)
            started=time.monotonic()
            page.wait_for_timeout(650)
            for scene in [1,2,0]:
                page.locator('.onboard-flow__choice').nth(scene).click()
                page.wait_for_timeout(1300)
            page.locator('.onboard__actions .btn--primary').click()
            page.wait_for_timeout(1400)
            for scene in [1,2]:
                page.locator('.onboard-flow__choice').nth(scene).click()
                page.wait_for_timeout(1300)
            page.wait_for_timeout(650)
            duration=time.monotonic()-started
            video=page.video.path()
            context.close()
            assert not errors,errors
            info=gif_from_video(video,'interaction.gif',duration)
            info.update({'sourceRoute':'/index.html#hosgeldin',
                'sequence':['Education: topic','article','check','topic','Test: question','explanation','review']})
            report['assets'].append(info)
            report['assets'].append({'file':'introduction.webp','width':780,'height':1688,'density':2,
                'sourceRoute':'/index.html#hosgeldin','role':'Static motion-demo alternative'})

            context=browser.new_context(viewport={'width':1200,'height':1000},device_scale_factor=2,
                color_scheme='dark',service_workers='block',record_video_dir=temporary,
                record_video_size={'width':1200,'height':1000})
            page=context.new_page()
            page.on('pageerror',lambda error:errors.append(str(error)))
            page.goto(base+'/about/')
            page.wait_for_selector('#study-folio')
            page.evaluate('''async () => { await document.fonts.ready;
              await Promise.all([...document.querySelectorAll('#study-folio img')].map(image => image.decode())); }''')
            page.wait_for_timeout(1400)
            bounds=page.locator('#study-folio').bounding_box()
            clip={'x':round(bounds['x']),'y':round(bounds['y']),
                  'width':round(bounds['width']),'height':round(bounds['height'])}
            assert clip['y']+clip['height'] <= 1000,clip
            poster=Image.open(BytesIO(page.screenshot(clip=clip)))
            poster.save(OUT/'folio.webp',format='WEBP',quality=94,method=6)
            started=time.monotonic()
            page.wait_for_timeout(650)
            for selector,delay in [('#folio-inspect',1100),('[data-folio-chapter=apply]',1300),
                ('#folio-rotate',900),('[data-folio-chapter=return]',1300),('#folio-rotate',900),
                ('#folio-inspect',1100)]:
                page.locator(selector).click()
                page.wait_for_timeout(delay)
                current=page.locator('#study-folio').bounding_box()
                assert abs(current['height']-bounds['height']) < 2,'Folio changes size; update capture framing'
            page.wait_for_timeout(650)
            duration=time.monotonic()-started
            video=page.video.path()
            context.close()
            assert not errors,errors
            info=gif_from_video(video,'folio.gif',duration,clip)
            info.update({'sourceRoute':'/about/',
                'sequence':['Rest','Open folio','Apply','Rotate','Return','Face front','Close folio']})
            report['assets'].append(info)
            report['assets'].append({'file':'folio.webp','width':clip['width']*2,'height':clip['height']*2,'density':2,
                'sourceRoute':'/about/','role':'Static folio-demo alternative'})
    browser.close()

# Merge partial runs so the record stays complete during asset iteration.
metadata = OUT/'metadata.json'
if args.only != 'all' and metadata.exists():
    old=json.loads(metadata.read_text())
    names={asset['file'] for asset in report['assets']}
    report['assets'] += [asset for asset in old['assets'] if asset['file'] not in names]
for asset in report['assets']:
    asset['bytes']=(OUT/asset['file']).stat().st_size
metadata.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False,indent=2))
