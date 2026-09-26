/* 320px tabanı: yatay taşma, dokunma hedefi, ayağın yerinde olması. */
import { createRequire } from "node:module";
const require = createRequire("/opt/node22/lib/node_modules/playwright/");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const dir = process.cwd() + "/";
const FILES=["01-bugun","02-konular","03-ders","04-soru","05-cevap","06-sonuc","07-profil"];
const browser = await chromium.launch({ executablePath:"/opt/pw-browsers/chromium" });
let bad=[];
for (const [w,h] of [[320,568],[390,844]]) for (const f of FILES) for (const t of ["dark","light"]) {
  const page = await browser.newPage({ viewport:{width:w,height:h} });
  await page.goto(`file://${dir}${f}-${t}.html`, { waitUntil:"networkidle" });
  const r = await page.evaluate((vw) => {
    const out = { overflow: document.documentElement.scrollWidth > vw,
                  scrollW: document.documentElement.scrollWidth, small: [], footVisible: false };
    const foot = document.querySelector(".foot");
    if (foot) { const fr = foot.getBoundingClientRect();
      out.footVisible = fr.bottom <= window.innerHeight + 1 && fr.top >= 0; }
    for (const el of document.querySelectorAll("button, a, [role=button]")) {
      const b = el.getBoundingClientRect();
      if (b.width && b.height && (b.width < 44 || b.height < 44))
        out.small.push(`${el.className||el.tagName} ${Math.round(b.width)}x${Math.round(b.height)}`);
    }
    return out; }, w);
  if (r.overflow) bad.push(`${w} ${f}-${t}: YATAY TASMA (${r.scrollW}px)`);
  if (!r.footVisible) bad.push(`${w} ${f}-${t}: ayak gorunmuyor`);
  for (const s of r.small) bad.push(`${w} ${f}-${t}: kucuk hedef ${s}`);
  await page.close();
}
await browser.close();
console.log(bad.length ? "SORUN:\n  " + bad.join("\n  ") : "✓ 320 ve 390: yatay taşma yok, ayak yerinde, her dokunma hedefi >=44px");
