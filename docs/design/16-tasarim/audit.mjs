/* Numunelerin kendi denetimi: her metin düğümünün gerçek rengi, gerçek
   zeminine karşı, APCA + WCAG ile. tools/color.mjs ile aynı matematik. */
import { createRequire } from "node:module";
import { apca, wcagContrast } from "../../../tools/color.mjs";
import { requiredLc } from "../../../tools/palette.mjs";
const require = createRequire("/opt/node22/lib/node_modules/playwright/");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const dir = process.cwd() + "/";
const FILES = ["01-bugun","02-konular","03-ders","04-soru","05-cevap","06-sonuc","07-profil"];

/* Projenin kendi APCA matrisi. Kaba bir katman tablosu değil. */
const tier = (px, w) => ({ lc: requiredLc(px, w), wcag: px >= 24 || (px >= 18.66 && w >= 700) ? 3.0 : 4.5 });
const browser = await chromium.launch({ executablePath:"/opt/pw-browsers/chromium" });
let checked = 0, fails = [], langMiss = [];
for (const f of FILES) for (const theme of ["dark","light"]) {
  const page = await browser.newPage({ viewport:{width:390,height:844} });
  await page.goto(`file://${dir}${f}-${theme}.html`, { waitUntil:"networkidle" });
  const rows = await page.evaluate(() => {
    const parse = (c) => { const m = c.match(/[\d.]+/g); return m ? m.slice(0,4).map(Number) : null; };
    const over = (fg, bg) => fg.length < 4 || fg[3] === 1 ? fg.slice(0,3)
      : [0,1,2].map(i => fg[i]*fg[3] + bg[i]*(1-fg[3]));
    const bgOf = (el) => { let n = el, stack = [];
      while (n && n !== document.documentElement) {
        const cs = getComputedStyle(n);
        if (cs.backgroundImage && cs.backgroundImage !== "none") return { grad: true };
        const p = parse(cs.backgroundColor);
        if (p && (p.length < 4 || p[3] > 0)) { stack.push(p); if (p.length < 4 || p[3] === 1) break; }
        n = n.parentElement; }
      let base = parse(getComputedStyle(document.body).backgroundColor).slice(0,3);
      for (let i = stack.length - 1; i >= 0; i--) base = over(stack[i], base);
      return { rgb: base }; };
    const hex = (c) => { const m = c.match(/\d+/g); if (!m) return null;
      return "#" + m.slice(0,3).map(v=>(+v).toString(16).padStart(2,"0")).join("").toUpperCase(); };
    const out = [];
    for (const el of document.querySelectorAll("body *")) {
      const direct = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      if (!direct) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") continue;
      out.push({ tag: el.tagName.toLowerCase(), cls: el.className || "",
        text: el.textContent.trim().slice(0,28),
        fg: hex(cs.color), bg: (()=>{const b=bgOf(el); return b.grad ? "GRAD" : hex(`rgb(${b.rgb.map(Math.round).join(",")})`);})(),
        px: parseFloat(cs.fontSize), w: parseInt(cs.fontWeight),
        upper: cs.textTransform === "uppercase",
        lang: el.closest("[lang]")?.getAttribute("lang") || "tr" });
    }
    return out;
  });
  for (const r of rows) {
    if (!r.fg || !r.bg || r.bg === "GRAD") continue;   // gradyan dolgu ayrı çözüldü
    checked++;
    const t = tier(r.px, r.w);
    const lc = Math.abs(apca(r.fg, r.bg)), w = wcagContrast(r.fg, r.bg);
    if (lc < t.lc || w < t.wcag)
      fails.push(`${f}-${theme}  ${r.px}px/${r.w} (gereken Lc ${t.lc})  ${r.fg} / ${r.bg}  Lc ${lc.toFixed(0)} WCAG ${w.toFixed(2)}  "${r.text}"`);
    const EN = /\b(test|meaning|reading|present|past|perfect|simple|aspects|cloze|modals|tenses|voice|passive)\b/i;
    if (r.upper && EN.test(r.text) && r.lang !== "en")
      langMiss.push(`${f}-${theme}  lang="${r.lang}" ama İngilizce ve büyük harf: "${r.text}"`);
  }
  await page.close();
}
await browser.close();
console.log(`${checked} metin/zemin çifti denetlendi.`);
console.log(fails.length ? `\nKONTRAST HATASI (${fails.length}):\n  ` + fails.join("\n  ") : "\n✓ kontrast: hepsi katmanının barını geçiyor");
console.log(langMiss.length ? `\nLANG HATASI (${langMiss.length}):\n  ` + langMiss.join("\n  ") : "✓ lang: büyük harfe çevrilen her İngilizce dizge işaretli");
