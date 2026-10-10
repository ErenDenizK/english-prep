import { writeFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import * as S from "./screens.mjs";
const require = createRequire("/opt/node22/lib/node_modules/playwright/");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");

const SCREENS = [["01-bugun",S.bugun],["02-konular",S.konular],["03-ders",S.ders],
  ["04-soru",S.soru],["05-cevap",S.cevap],["06-sonuc",S.sonuc],["07-profil",S.profil]];
mkdirSync("shots",{recursive:true});
const browser = await chromium.launch({ executablePath:"/opt/pw-browsers/chromium" });
for (const [name, fn] of SCREENS) {
  for (const theme of ["dark","light"]) {
    const s = fn();
    const file = `${name}-${theme}.html`;
    writeFileSync(file, S.shell(s.title, s.body, s.foot, { theme }));
    const page = await browser.newPage({ viewport:{width:390,height:844}, deviceScaleFactor:1 });
    await page.goto("file://" + process.cwd() + "/" + file, { waitUntil:"networkidle" });
    await page.screenshot({ path:`shots/${name}-${theme}.png` });
    await page.close();
  }
}
await browser.close();
console.log("14 ekran çizildi");
