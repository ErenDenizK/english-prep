// Drives the real app in a real browser and checks the things the unit
// tests structurally cannot: layout at four widths, touch-target sizes,
// horizontal overflow, console errors, and the accessibility contract in
// docs/design-system.md §8.
//
// This is not optional diligence. WCAG conformance is defined per *page*,
// and the spec is explicit that each responsive variation conforms
// separately — so a sweep at 320 / 390 / 768 / 1280 is the requirement
// itself. A quiz → results → review flow is a "complete process": every
// page in it conforms, or none of them do.
//
// Playwright is not a dependency of this project and never will be —
// `package.json` has none, deliberately. This script resolves it at run
// time and explains itself if it is missing, so `npm run check` stays
// dependency-free while `npm run verify` is available wherever a browser
// is. Serve the repo first (`npm run serve`).
//
//   node tools/verify-ui.mjs [baseUrl]

import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";

const BASE = process.argv[2] ?? "http://localhost:8000";

const VIEWPORTS = [
  { name: "320 (dar telefon)", width: 320, height: 640 },
  { name: "390 (telefon)", width: 390, height: 844 },
  { name: "768 (tablet)", width: 768, height: 1024 },
  { name: "1280 (masaüstü)", width: 1280, height: 900 },
];

// §8.1: 44 is the secondary-class minimum hit area, and 24 the absolute
// floor for a target's narrow axis. Anything below either is a failure.
const MIN_HIT = 44;
const MIN_AXIS = 24;

// Google Fonts is unreachable from the sandbox and the app no longer asks
// for it; a stray connection error from a cached service worker or a proxy
// is not an app fault.
const IGNORED_CONSOLE = /fonts\.googleapis|ERR_CONNECTION|ERR_NAME_NOT_RESOLVED/;

/**
 * Playwright is usually installed globally rather than in this repo, and a
 * global package is not on the ESM resolution path for a bare specifier —
 * so a plain import fails on exactly the machines where a browser *is*
 * available. Fall back to importing the package's CommonJS entry by path,
 * from the running Node's own global module directory or from
 * $PLAYWRIGHT_PATH. A CJS module reached that way puts everything on
 * `default` rather than on named exports, hence the two-way unwrap.
 */
async function loadChromium() {
  const globalModules = join(dirname(dirname(process.execPath)), "lib", "node_modules");
  const directories = [join(globalModules, "playwright"), process.env.PLAYWRIGHT_PATH].filter(Boolean);

  const specifiers = [
    "playwright",
    ...directories.flatMap((directory) => [
      pathToFileURL(join(directory, "index.js")).href,
      pathToFileURL(directory).href,
    ]),
  ];

  for (const specifier of specifiers) {
    try {
      const module = await import(specifier);
      const chromium = module.chromium ?? module.default?.chromium;
      if (chromium) {
        return chromium;
      }
    } catch {
      // Try the next candidate; only exhausting them all is worth a word.
    }
  }
  return null;
}

const chromium = await loadChromium();
if (!chromium) {
  console.error(
    "playwright bulunamadı. Bu betik bir tarayıcı gerektirir ve projenin\n" +
      "bağımlılığı değildir — package.json'da hiçbir bağımlılık yok ve\n" +
      "olmayacak. Kurulu olduğu bir ortamda çalıştır:\n" +
      "  npm i -D playwright && node tools/verify-ui.mjs\n" +
      "ya da kurulu olduğu dizini göster:\n" +
      "  PLAYWRIGHT_PATH=/usr/lib/node_modules/playwright npm run verify"
  );
  process.exit(2);
}

// Chromium already ships with this environment and PLAYWRIGHT_BROWSERS_PATH
// points at it, so an explicit binary path is only a fallback for a machine
// where the bundled download never ran.
const EXECUTABLE = process.env.CHROMIUM_PATH || undefined;

const failures = [];
let checks = 0;

function ok(condition, message) {
  checks += 1;
  if (condition) {
    console.log(`  ✓ ${message}`);
  } else {
    console.log(`  ✗ ${message}`);
    failures.push(message);
  }
}

/**
 * Horizontal overflow and undersized targets, measured in the page rather
 * than inferred from the CSS. Only visible controls count: a control
 * inside a `hidden` view has no box to measure.
 */
async function auditLayout(page, label, width) {
  const report = await page.evaluate(
    ({ minHit, minAxis }) => {
      const root = document.documentElement;
      const small = [];
      const selector = "a, button, input, select, textarea, [role=option], [role=combobox]";
      for (const node of document.querySelectorAll(selector)) {
        const box = node.getBoundingClientRect();
        if (box.width === 0 && box.height === 0) {
          continue;
        }
        if (box.height < minHit || box.width < minAxis) {
          const name = (node.getAttribute("aria-label") || node.textContent || "").trim();
          small.push(
            `${node.tagName.toLowerCase()}.${node.className} ` +
              `${Math.round(box.width)}×${Math.round(box.height)} "${name.slice(0, 24)}"`
          );
        }
      }
      return {
        overflow: root.scrollWidth > root.clientWidth ? `${root.scrollWidth}px` : null,
        small,
      };
    },
    { minHit: MIN_HIT, minAxis: MIN_AXIS }
  );

  ok(!report.overflow, `${label}: yatay taşma yok${report.overflow ? ` (${report.overflow} > ${width})` : ""}`);
  ok(report.small.length === 0, `${label}: dokunma hedefleri yeterli${report.small.length ? ` — ${report.small.join("; ")}` : ""}`);
}

/** Walks one full learner journey, auditing each screen it lands on. */
async function runFlow(page, viewport) {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error" && !IGNORED_CONSOLE.test(message.text())) {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => errors.push(String(error)));

  await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });
  await page.waitForSelector(".row");
  ok(await page.title() === "Eğitim — English Prep", "Eğitim varsayılan görünüm");
  await auditLayout(page, "Eğitim indeksi", viewport.width);

  await page.locator(".row").first().click();
  await page.waitForSelector("#lesson-reader .reader__top");
  ok(await page.locator("#shell-header").isHidden(), "okuyucuda başlık gizli (odaklı mod)");
  ok(await page.locator("#bottom-nav").isHidden(), "okuyucuda alt navigasyon gizli");
  ok(await page.locator("#lesson-bar").isHidden(), "okuyucuda alt eylem barı yok");
  ok(/#egitim\//.test(page.url()), "ders URL ile adreslenebilir");
  await auditLayout(page, "okuyucu", viewport.width);

  // A lesson is one scrolling page, so the way out and the position have
  // to stay on screen however far down it the learner is.
  await page.evaluate(() => document.getElementById("shell-scroll").scrollBy({ top: 1200 }));
  await page.waitForTimeout(150);
  const stickyBox = await page.locator("#lesson-reader .reader__top").boundingBox();
  ok(stickyBox !== null && stickyBox.y < 80, "okuyucu başlığı kaydırırken ekranda kaldı");
  const readout = await page.locator("#lesson-reader .reader__top .t-num").textContent();
  ok(/^%\d+$/.test(readout) && readout !== "%0", `okuma yüzdesi ilerledi (${readout})`);

  // An inline check: answering must not throw the learner's place away,
  // because the feedback they just earned is right where they are looking.
  await page.evaluate(() => document.getElementById("shell-scroll").scrollTo({ top: 0 }));
  await page.waitForTimeout(100);
  let sawCheck = false;
  for (let attempt = 0; attempt < 24; attempt += 1) {
    const options = page.locator("#lesson-reader .option");
    if (await options.count()) {
      await options.first().scrollIntoViewIfNeeded();
      await page.waitForTimeout(120);
      const before = await page.evaluate(() => document.getElementById("shell-scroll").scrollTop);
      await options.first().click();
      await page.waitForSelector("#lesson-reader .feedback");
      await page.waitForTimeout(120);
      const after = await page.evaluate(() => document.getElementById("shell-scroll").scrollTop);
      ok(Math.abs(after - before) < 4, `cevap kaydırma konumunu korudu (${before} → ${after})`);
      ok(
        await page.locator("#lesson-reader .feedback__verdict svg").count() > 0,
        "geri bildirimde glif var (renk tek kanal değil)"
      );
      await auditLayout(page, "kontrol sorusu", viewport.width);
      sawCheck = true;
      break;
    }
    await page.evaluate(() => document.getElementById("shell-scroll").scrollBy({ top: 400 }));
    await page.waitForTimeout(60);
  }
  ok(sawCheck, "derste kontrol sorusu göründü");

  // Reaching the end is what finishes a lesson — there is no button for it.
  await page.evaluate(() => {
    const region = document.getElementById("shell-scroll");
    region.scrollTo({ top: region.scrollHeight });
  });
  await page.waitForTimeout(250);
  ok(
    (await page.locator("#lesson-reader .reader__top .t-num").textContent()) === "%100",
    "sona inince okuma %100"
  );
  ok(await page.locator("#lesson-reader .surface").count() > 0, "ders sonu kartı göründü");
  await auditLayout(page, "ders sonu", viewport.width);

  await page.locator("#lesson-reader .reader__top button").first().click();
  await page.waitForSelector("#lesson-index .row");
  ok(
    (await page.locator("#lesson-index").textContent()).includes("1 tanesi tamamlandı"),
    "sona kadar okumak dersi tamamladı"
  );
  ok(await page.locator("#shell-header").isVisible(), "indekse dönünce başlık geri geldi");

  await page.locator('.nav__item[data-view="test"]').click();
  await page.waitForSelector("#test-panel .surface");
  await auditLayout(page, "Test sekmesi", viewport.width);

  await page.locator("#test-panel .btn--primary").click();
  await page.waitForURL(/quiz\.html/);
  await page.waitForSelector(".option");
  ok(
    (await page.locator("#quiz-bar").textContent()).includes("Bir seçenek seç"),
    "cevaplanmadan önce bar ipucu gösteriyor"
  );
  await auditLayout(page, "soru", viewport.width);

  const barBefore = await page.locator("#quiz-bar").boundingBox();
  await page.locator(".option").first().click();
  await page.waitForSelector(".feedback");
  const barAfter = await page.locator("#quiz-bar").boundingBox();
  ok(barBefore.y === barAfter.y, "testte cevap alt barı yerinden oynatmadı");
  await auditLayout(page, "cevaplanmış soru", viewport.width);

  for (let step = 0; step < 40; step += 1) {
    if (page.url().includes("results.html")) {
      break;
    }
    if (!(await page.locator(".option").count())) {
      break;
    }
    if (!(await page.locator(".option--ok, .option--no").count())) {
      await page.locator(".option").first().click();
      await page.waitForTimeout(50);
    }
    const advance = page.locator("#quiz-bar button");
    if (!(await advance.count())) {
      break;
    }
    await advance.click();
    await page.waitForTimeout(100);
  }

  await page.waitForURL(/results\.html/, { timeout: 5000 });
  await page.waitForSelector(".t-display");
  ok(true, "sonuç ekranına ulaşıldı");
  await auditLayout(page, "sonuç", viewport.width);

  await page.locator("#results-bar a").first().click();
  await page.waitForSelector("#profile-trigger");
  await page.locator("#profile-trigger").click();
  await page.waitForSelector("#profile-container .surface");
  await auditLayout(page, "Profil", viewport.width);

  // A v1 criterion: the app says which parts of the paper it does not
  // cover. A learner who does well here must not conclude something false
  // about the exam.
  const profileText = await page.locator("#profile-container").innerText();
  ok(profileText.includes("Sınavın hangi kısmı burada"), "kapsam bölümü Profil'de");
  ok(/okuma \(21 puan\)/.test(profileText), "kapsanmayan bölümler puanıyla adlandırılıyor");
  ok(/dinleme/.test(profileText), "Session II'nin kapsanmadığı söyleniyor");

  ok(errors.length === 0, `konsol temiz${errors.length ? ` — ${[...new Set(errors)].join(" | ")}` : ""}`);
}

/**
 * Opens every lesson there is, at one width, and audits each. The journey
 * above only ever sees the first lesson, and a block type that renders
 * badly in exactly one lesson — a `forms` block whose patterns are long, a
 * `contrast` with three sides — is precisely the failure that reaches a
 * learner and never reaches a test.
 */
async function runEveryLesson(page) {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error" && !IGNORED_CONSOLE.test(message.text())) {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => errors.push(String(error)));

  await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });
  await page.waitForSelector(".row");
  const lessons = await page.locator("#lesson-index .row").count();
  ok(lessons > 0, `${lessons} ders bulundu`);

  for (let index = 0; index < lessons; index += 1) {
    await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });
    await page.waitForSelector(".row");
    await page.locator("#lesson-index .row").nth(index).click();
    await page.waitForSelector("#lesson-reader .reader__top");

    const title = (await page.locator("#lesson-reader h1").textContent())?.trim() ?? `#${index}`;
    const blocks = await page.locator("#lesson-reader article > *").count();
    ok(blocks > 3, `${title}: ${blocks} blok çizildi`);

    // Scroll the whole lesson, auditing as it goes: an overflow can live
    // three screens down as easily as on the first one.
    for (let screen = 0; screen < 12; screen += 1) {
      await auditLayout(page, `${title} (ekran ${screen + 1})`, 390);
      const atEnd = await page.evaluate(() => {
        const region = document.getElementById("shell-scroll");
        const before = region.scrollTop;
        region.scrollBy({ top: region.clientHeight - 120 });
        return region.scrollTop === before;
      });
      await page.waitForTimeout(60);
      if (atEnd) {
        break;
      }
    }
  }

  ok(errors.length === 0, `her derste konsol temiz${errors.length ? ` — ${[...new Set(errors)].join(" | ")}` : ""}`);
}

/**
 * "Önce kendin düşün": the setting that hides the options until the
 * learner has committed to an answer. Checked end to end because it
 * changes the quiz's control flow, and a setting that silently stops
 * working is worse than one that was never offered.
 */
async function runThinkFirst(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();

  await page.goto(`${BASE}/index.html#profil`, { waitUntil: "networkidle" });
  await page.waitForSelector('[role="switch"]');
  const toggle = page.locator('[role="switch"]').first();
  ok((await toggle.getAttribute("aria-checked")) === "false", "ayar varsayılan olarak kapalı");
  await toggle.click();
  ok((await toggle.getAttribute("aria-checked")) === "true", "ayar açılabiliyor");

  await page.goto(`${BASE}/index.html#test`, { waitUntil: "networkidle" });
  await page.waitForSelector("#test-panel .btn--primary");
  await page.locator("#test-panel .btn--primary").click();
  await page.waitForURL(/quiz\.html/);
  await page.waitForSelector(".t-lead");

  ok((await page.locator(".option").count()) === 0, "şıklar başta gizli");
  ok(
    (await page.locator("#quiz-bar").textContent()).includes("Cevabı düşün"),
    "bar ne yapılacağını söylüyor"
  );
  await auditLayout(page, "şıklar gizliyken", 390);

  await page.locator("button", { hasText: "Şıkları göster" }).click();
  await page.waitForSelector(".option");
  ok((await page.locator(".option").count()) === 4, "şıklar istendiğinde geliyor");

  await page.locator(".option").first().click();
  await page.waitForSelector(".feedback");
  await page.locator("#quiz-bar button").click();
  await page.waitForTimeout(150);
  ok(
    (await page.locator(".option").count()) === 0,
    "sonraki soruda yeniden gizleniyor"
  );

  await context.close();
}

/**
 * "Bu soruda bir sorun var" — the one channel from a learner back to the
 * content, so it has to work on the device they are holding.
 *
 * Checked here rather than only in a unit test because everything that
 * can go wrong with it is in the browser: the clipboard permission, the
 * focus that a `disabled` would have thrown away, and the fact that a
 * label changing silently under a screen reader is a label nobody hears
 * change.
 */
async function runProblemReport(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const page = await context.newPage();

  await page.goto(`${BASE}/index.html#test`, { waitUntil: "networkidle" });
  await page.waitForSelector("#test-panel .btn--primary");
  await page.locator("#test-panel .btn--primary").click();
  await page.waitForURL(/quiz\.html/);
  await page.waitForSelector(".option");

  ok((await page.locator(".feedback__report").count()) === 0, "bildirim bağlantısı cevaptan önce yok");

  await page.locator(".option").first().click();
  await page.waitForSelector(".feedback");

  const report = page.locator(".feedback__report");
  ok((await report.count()) === 1, "cevaptan sonra bildirim bağlantısı çıkıyor");

  const box = await report.boundingBox();
  ok(box !== null && box.height >= 44, `bildirim hedefi ${Math.round(box?.height ?? 0)}px (>= 44)`);
  await auditLayout(page, "bildirim bağlantısıyla geri bildirim", 390);

  await report.focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(200);

  ok((await report.getAttribute("aria-disabled")) === "true", "kullanıldıktan sonra aria-disabled");
  ok((await page.locator(".feedback__report[disabled]").count()) === 0, "disabled kullanılmıyor");
  ok(
    await page.evaluate(() => document.activeElement?.classList.contains("feedback__report")),
    "odak düğmede kalıyor"
  );
  ok(
    (await page.locator("#live-region").textContent()).length > 0,
    "sonuç canlı bölgeden duyuruluyor"
  );

  const copied = await page.evaluate(() => navigator.clipboard.readText());
  ok(copied.includes("English Prep"), "panoya giden metin kendini tanıtıyor");
  ok(/Soru: [a-z-]+-t\d+/.test(copied), "metin soru numarasını taşıyor");
  ok(copied.includes("Uygulamanın doğru dediği:"), "metin doğru cevabı taşıyor");
  ok(copied.includes("Benim işaretlediğim:"), "metin öğrencinin seçtiğini taşıyor");

  await context.close();
}

/**
 * Yanlış defteri, end to end: get one wrong, see it appear, drill it, and
 * watch the graduation rule refuse to let it out on the same day.
 *
 * Driven through the real app rather than tested against the selector,
 * because the part that can break is the wiring — the id set travelling
 * in the request, and the empty state saying the true thing instead of
 * congratulating somebody who has only seen each question once.
 */
async function runMistakeBook(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();

  await page.goto(`${BASE}/index.html#test`, { waitUntil: "networkidle" });
  await page.waitForSelector("#test-panel .btn--primary");
  ok(
    !(await page.locator("#test-panel").textContent()).includes("Yanlış defteri"),
    "geçmiş yokken defter kartı hiç çıkmıyor"
  );

  // Plant one wrong answer and one correct one, yesterday.
  await page.evaluate(() => {
    const yesterday = new Date(Date.now() - 86_400_000).toISOString();
    localStorage.setItem(
      "englishPrep.history",
      JSON.stringify({ attempts: [
        {
          date: yesterday,
          mode: "mixed",
          topicBreakdown: { tenses: { correct: 1, total: 2 } },
          categoryBreakdown: {},
          questions: [
            { id: "tenses-t1", topicId: "tenses", category: "Present Simple vs Present Continuous", correct: false },
            { id: "tenses-t2", topicId: "tenses", category: "Present Simple vs Present Continuous", correct: true },
          ],
        },
      ] })
    );
  });
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForSelector("#test-panel");

  const panel = await page.locator("#test-panel").textContent();
  ok(panel.includes("Yanlış defteri"), "yanlıştan sonra defter kartı çıkıyor");
  ok(/Yanlış yaptığın 1 soru burada/.test(panel), "defter yalnızca yanlış olanı sayıyor");
  await auditLayout(page, "yanlış defteri", 390);

  await page.locator("button", { hasText: "Yanlışları çalış" }).click();
  await page.waitForURL(/quiz\.html/);
  await page.waitForSelector(".option");

  const drilled = await page.evaluate(
    () => JSON.parse(sessionStorage.getItem("englishPrep.quizRequest") ?? "{}")
  );
  ok(drilled.mode === "mistakes", "istek yanlış defteri modunda");
  ok(
    Array.isArray(drilled.ids) && drilled.ids.length === 1 && drilled.ids[0] === "tenses-t1",
    "yalnızca defterdeki soru gönderiliyor"
  );

  // Answer it correctly today: one correct answer must NOT graduate it.
  await page.evaluate(() => {
    const history = JSON.parse(localStorage.getItem("englishPrep.history"));
    history.attempts.push({
      date: new Date().toISOString(),
      mode: "mistakes",
      topicBreakdown: { tenses: { correct: 1, total: 1 } },
      categoryBreakdown: {},
      questions: [{ id: "tenses-t1", topicId: "tenses", correct: true }],
    });
    localStorage.setItem("englishPrep.history", JSON.stringify(history));
  });
  await page.goto(`${BASE}/index.html#test`, { waitUntil: "networkidle" });
  await page.waitForSelector("#test-panel");
  ok(
    /Yanlış yaptığın 1 soru burada/.test(await page.locator("#test-panel").textContent()),
    "tek doğru cevap soruyu defterden düşürmüyor"
  );

  // A second correct answer, on a second day, does.
  await page.evaluate(() => {
    const history = JSON.parse(localStorage.getItem("englishPrep.history"));
    history.attempts.push({
      date: new Date(Date.now() + 86_400_000).toISOString(),
      mode: "mistakes",
      topicBreakdown: { tenses: { correct: 1, total: 1 } },
      categoryBreakdown: {},
      questions: [{ id: "tenses-t1", topicId: "tenses", correct: true }],
    });
    localStorage.setItem("englishPrep.history", JSON.stringify(history));
  });
  // reload, not goto: navigating to the URL the page is already on is a
  // same-document navigation, so the module never re-runs and the panel
  // never re-renders. That cost twenty minutes once.
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForSelector("#test-panel");
  const emptied = await page.locator("#test-panel").textContent();
  ok(emptied.includes("bekleyen soru yok"), "ayrı iki günde iki doğru soruyu düşürüyor");
  ok(
    emptied.includes("bildiğin anlamına değil"),
    "boş defter bir tebrik değil — doğru olanı söylüyor"
  );
  ok(
    !(await page.locator("button", { hasText: "Yanlışları çalış" }).count()),
    "boş defterde çalışma düğmesi yok"
  );

  await context.close();
}

/**
 * docs/components.html — every primitive on one page, against the real
 * CSS. It was not checked by anything until a restatement's options went
 * on it: the case that breaks the Option row is four whole sentences at
 * 320px, and a component sheet nobody runs is a sheet that has already
 * drifted.
 */
async function runComponents(browser) {
  for (const width of [320, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    const errors = [];
    page.on("console", (message) => {
      if (message.type() === "error") {
        errors.push(message.text());
      }
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto(`${BASE}/docs/components.html`, { waitUntil: "networkidle" });
    await page.waitForSelector("#restatement-options .option");

    ok(
      (await page.locator("#restatement-options .option").count()) === 4,
      `${width}px: restatement seçenekleri çiziliyor`
    );
    ok(
      (await page.locator("#restatement .t-meta").textContent()).includes("anlamca en yakın"),
      `${width}px: restatement yönergesi görünüyor`
    );

    // The case the alignment change exists for: options that actually wrap.
    const wrapped = await page.evaluate(() => {
      const text = document.querySelector("#restatement-options .option__text");
      const range = document.createRange();
      range.selectNodeContents(text);
      return range.getClientRects().length;
    });
    ok(wrapped > 1, `${width}px: cümlelik seçenek gerçekten satır kırıyor (${wrapped} satır)`);

    await auditLayout(page, `bileşen sayfası ${width}px`, width);
    ok(errors.length === 0, `${width}px: konsol temiz${errors.length ? ` — ${errors[0]}` : ""}`);
    await context.close();
  }
}

/**
 * A learner's whole history moving from one browser to another. This is
 * the only operation in the app that can destroy something they cannot get
 * back, so it is checked end to end in two real browser contexts rather
 * than trusted to the unit tests on the merge functions.
 */
async function runBackupRoundTrip(browser) {
  const source = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const first = await source.newPage();
  await first.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });
  await first.waitForSelector(".row");

  // Read a lesson to the end and sit one whole test, so there is real
  // progress of both kinds to carry.
  await first.locator(".row").first().click();
  await first.waitForSelector("#lesson-reader .reader__top");
  await first.evaluate(() => {
    const region = document.getElementById("shell-scroll");
    region.scrollTo({ top: region.scrollHeight });
  });
  await first.waitForTimeout(250);
  await first.locator("#lesson-reader .reader__top button").first().click();
  await first.waitForSelector("#lesson-index .row");
  await first.locator('.nav__item[data-view="test"]').click();
  await first.waitForSelector("#test-panel .btn--primary");
  await first.locator("#test-panel .btn--primary").click();
  await first.waitForURL(/quiz\.html/);
  for (let step = 0; step < 30 && !first.url().includes("results"); step += 1) {
    if (!(await first.locator(".option--ok, .option--no").count())) {
      await first.locator(".option").first().click();
      await first.waitForTimeout(40);
    }
    const advance = first.locator("#quiz-bar button");
    if (!(await advance.count())) {
      break;
    }
    await advance.click();
    await first.waitForTimeout(90);
  }
  await first.waitForURL(/results\.html/);

  const backup = await first.evaluate(async () => {
    const storage = await import("/js/storage.js");
    const backupModule = await import("/js/backup.js");
    return JSON.stringify(backupModule.buildBackup(storage.exportState()));
  });
  ok(JSON.parse(backup).data.history.attempts.length === 1, "yedek gerçek ilerlemeyi taşıyor");
  await source.close();

  const target = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const second = await target.newPage();
  await second.goto(`${BASE}/index.html#profil`, { waitUntil: "networkidle" });
  await second.waitForSelector("#profile-container .surface");

  await second.locator("#profile-container button", { hasText: "Yedekten geri yükle" }).click();
  await second.waitForSelector("dialog#restore-dialog[open]");
  ok(
    await second.evaluate(() => document.activeElement.id) === "restore-cancel",
    "geri yükleme penceresinde odak güvenli eyleme düşüyor"
  );

  // Every way this can go wrong has to say which way it went wrong.
  await second.locator("#restore-text").fill("merhaba");
  await second.locator("#restore-confirm").click();
  ok(
    (await second.locator("#restore-message").textContent()).includes("okunamadı"),
    "okunamayan metin sebebiyle birlikte reddediliyor"
  );
  await second.locator("#restore-text").fill('{"app":"baska-uygulama","data":{}}');
  await second.locator("#restore-confirm").click();
  ok(
    (await second.locator("#restore-message").textContent()).includes("English Prep"),
    "başka bir uygulamanın dosyası reddediliyor"
  );

  await second.locator("#restore-text").fill(backup);
  await second.locator("#restore-confirm").click();
  ok(
    (await second.locator("#restore-confirm").textContent()).trim() === "Geri yükle",
    "yazmadan önce bir önizleme adımı var"
  );
  await second.locator("#restore-confirm").click();
  await second.waitForTimeout(400);

  const restored = await second.evaluate(() => ({
    attempts: JSON.parse(localStorage.getItem("englishPrep.history") || '{"attempts":[]}').attempts.length,
    lessons: Object.keys(JSON.parse(localStorage.getItem("englishPrep.lessonProgress") || "{}")).length,
  }));
  ok(restored.attempts === 1, "test geçmişi diğer tarayıcıya taşındı");
  ok(restored.lessons === 1, "ders ilerlemesi diğer tarayıcıya taşındı");

  // Idempotence: a learner who restores the same file twice must not end
  // up with two of everything.
  await second.locator("#profile-container button", { hasText: "Yedekten geri yükle" }).click();
  await second.waitForSelector("dialog#restore-dialog[open]");
  await second.locator("#restore-text").fill(backup);
  await second.locator("#restore-confirm").click();
  await second.locator("#restore-confirm").click();
  await second.waitForTimeout(400);
  const twice = await second.evaluate(
    () => JSON.parse(localStorage.getItem("englishPrep.history")).attempts.length
  );
  ok(twice === 1, "aynı yedeği iki kez yüklemek hiçbir şeyi çoğaltmıyor");
  ok(
    (await second.locator("#profile-container").textContent()).includes("hiçbir şey değişmedi"),
    "ve uygulama bunu dürüstçe söylüyor"
  );

  await target.close();
}

/**
 * Dersten önce — one question at the top of a lesson nobody has read.
 *
 * Checked at 320px, because that is where a block added above the lesson
 * body costs the most, and because the whole point of the mode is that it
 * is the first thing on the screen.
 */
async function runPretest(browser) {
  const context = await browser.newContext({ viewport: { width: 320, height: 640 } });
  const page = await context.newPage();

  await page.goto(`${BASE}/index.html#egitim`, { waitUntil: "networkidle" });
  await page.waitForSelector(".row");
  await page.locator(".row").first().click();
  await page.waitForSelector(".shell__scroll .option");

  const body = await page.locator(".shell__scroll").innerText();
  ok(body.includes("Önce bir dene"), "okunmamış ders bir ön testle açılıyor");
  ok(
    !/Önce bir dene\s*\n\s*Kontrol/.test(body),
    "ön test kendi başlığını kullanıyor, ikinci bir 'Kontrol' koymuyor"
  );
  ok(
    body.indexOf("Önce bir dene") < body.indexOf("Kontrol"),
    "ön test dersin gövdesinden önce geliyor"
  );

  // The rule the whole shell is built on: answering must not move the
  // thing the learner is looking at. Scrolled into view first, so the
  // measurement is of the answer and not of the driver's own scrolling.
  const option = page.locator(".option").first();
  await option.scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => document.querySelector(".shell__scroll").scrollTop);
  const boxBefore = await option.boundingBox();
  await option.click();
  await page.waitForSelector(".feedback");
  const after = await page.evaluate(() => document.querySelector(".shell__scroll").scrollTop);
  const boxAfter = await page.locator(".option").first().boundingBox();
  ok(before === after, `ön test cevaplanınca sayfa kaymıyor (${before} → ${after})`);
  ok(
    Math.abs(boxBefore.y - boxAfter.y) < 1,
    `cevaplanan şık yerinde kalıyor (${boxBefore.y.toFixed(1)} → ${boxAfter.y.toFixed(1)})`
  );
  await auditLayout(page, "ön test", 320);

  // The pretest and the check blocks must draw from ONE shuffle. Two
  // independent takers over a four-question pool put the pretest inside
  // the check set about half the time, and the learner answered a
  // question, read its explanation, scrolled three blocks and met it
  // again. Measured at 13 opens in 24 before the fix.
  {
    let collisions = 0;
    const opens = 8;
    for (let i = 0; i < opens; i += 1) {
      const fresh = await browser.newContext({ viewport: { width: 390, height: 844 } });
      const trial = await fresh.newPage();
      await trial.goto(`${BASE}/index.html#egitim`, { waitUntil: "networkidle" });
      await trial.waitForSelector(".row");
      await trial.locator(".row").first().click();
      await trial.waitForSelector(".shell__scroll .option");
      const stems = await trial
        .locator(".shell__scroll .t-lead, .shell__scroll .prose")
        .evaluateAll((els) =>
          els.map((e) => e.textContent.replace(/\s+/g, " ").trim()).filter((t) => t.includes("____"))
        );
      if (new Set(stems).size !== stems.length) collisions += 1;
      await fresh.close();
    }
    ok(collisions === 0, `ön test ile kontrol soruları çakışmıyor (${opens} açılışta ${collisions})`);
  }

  // It is a pretest, not a quiz: it appears once, and a lesson already
  // read opens on its own first words.
  await page.goto(`${BASE}/index.html#egitim`, { waitUntil: "networkidle" });
  await page.waitForSelector(".row, .card");
  await page.locator(".row, .card").first().click();
  await page.waitForSelector(".shell__scroll");
  ok(
    !(await page.locator(".shell__scroll").innerText()).includes("Önce bir dene"),
    "okunmuş ders ikinci açılışta ön test göstermiyor"
  );

  await context.close();
}

/**
 * The three states of the Eğitim index: never opened, mid-lesson, and
 * back after a gap. Checked at 320px, where a card the width of the
 * screen costs the most.
 */
async function runIndexStates(browser) {
  async function open(seed) {
    const context = await browser.newContext({ viewport: { width: 320, height: 640 } });
    const page = await context.newPage();
    await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });
    if (seed) await page.evaluate(seed);
    await page.goto(`${BASE}/index.html#egitim`, { waitUntil: "networkidle" });
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForSelector("#view-egitim .surface, #view-egitim .row");
    return { context, page, text: await page.locator("#view-egitim").innerText() };
  }

  // 1 — never opened. No tour, and no progress bar reading zero.
  let view = await open(null);
  ok(view.text.includes("English Prep"), "ilk açılışta uygulamanın ne olduğu yazıyor");
  ok(view.text.includes("bu telefonda kalıyor"), "veri nerede duruyor, ilk ekranda söyleniyor");
  ok(view.text.includes("İlk dersi aç"), "tek bir açık ilk eylem var");
  ok(!view.text.includes("İlerlemen"), "sıfırı gösteren ilerleme çubuğu karşılama kartıyla birlikte çıkmıyor");
  await auditLayout(view.page, "ilk açılış", 320);
  await view.page.locator("button", { hasText: "İlk dersi aç" }).click();
  await view.page.waitForSelector(".shell__scroll .option, .shell__scroll .prose");
  ok(true, "ilk dersi aç bir derse giriyor");
  await view.context.close();

  const partway = () => {
    localStorage.setItem(
      "englishPrep.lessonProgress",
      JSON.stringify({ "tenses-present-simple-vs-present-continuous": { read: 0.73, done: false } })
    );
  };
  const attempt = (date) => ({
    date,
    mode: "mixed",
    topicBreakdown: { tenses: { correct: 3, total: 5 } },
    categoryBreakdown: {},
    questions: [],
  });

  // 2 — mid-lesson, same day. The plain resume card, unchanged.
  view = await open(
    new Function(
      `(${partway.toString()})();` +
        `localStorage.setItem("englishPrep.history", JSON.stringify({ attempts: [${JSON.stringify(
          attempt("PLACEHOLDER")
        ).replace('"PLACEHOLDER"', "new Date().toISOString()")}] }));`
    )
  );
  ok(view.text.includes("Devam et"), "aynı gün dönüşte düz devam kartı çıkıyor");
  ok(!view.text.includes("hatırla"), "aynı gün dönüşte hatırlatma teklifi çıkmıyor");
  await view.context.close();

  // 3 — back after a gap. What is OFFERED changes; nothing is said about
  // the absence.
  view = await open(
    new Function(
      `(${partway.toString()})();` +
        `localStorage.setItem("englishPrep.history", JSON.stringify({ attempts: [${JSON.stringify(
          attempt("PLACEHOLDER")
        ).replace('"PLACEHOLDER"', "new Date(Date.now() - 21 * 86400000).toISOString()")}] }));` +
        `localStorage.setItem("englishPrep.seenVersions", JSON.stringify({ tenses: 1 }));`
    )
  );
  ok(view.text.includes("Önce 5 soruyla hatırla"), "aradan zaman geçince önce hatırlatma teklif ediliyor");
  ok(view.text.includes("Kaldığın yerden devam et"), "devam etme yolu duruyor");
  ok(/yeni sorular eklendi/.test(view.text), "dönene yeni içerik haberi veriliyor");
  // Scoped to the card. The lesson summaries below it say "her gün" for
  // perfectly good reasons of their own.
  const card = await view.page.locator("#view-egitim .surface").first().innerText();
  ok(
    !/\b\d+\s*gün\b|uzun zaman|bir süredir|geri döndün/i.test(card),
    "kaç gün geçtiği söylenmiyor, suçlayan bir söz yok"
  );
  await auditLayout(view.page, "aradan sonra dönüş", 320);
  await view.context.close();
}

/**
 * Leaving a test that is under way.
 *
 * `Çık` was a plain link, so five answered questions went with one tap,
 * nothing was written down, and the learner arrived back on the screen a
 * brand-new learner sees — because from storage's point of view they were
 * one. A link cannot ask; a button can.
 */
async function runQuizExit(browser) {
  const context = await browser.newContext({ viewport: { width: 320, height: 640 } });
  const page = await context.newPage();
  const exit = () => page.locator(".btn--quiet", { hasText: "Çık" }).first();

  async function startTest() {
    await page.goto(`${BASE}/index.html#test`, { waitUntil: "networkidle" });
    await page.waitForSelector("#test-panel .btn--primary");
    await page.locator("#test-panel .btn--primary").click();
    await page.waitForURL(/quiz\.html/);
    await page.waitForSelector(".option");
  }

  // Nothing answered is nothing to lose, so nothing to ask about.
  await startTest();
  await exit().click();
  await page.waitForURL(/index\.html/);
  ok(true, "hiç cevap verilmemişken çıkış sormadan çıkıyor");

  await startTest();
  for (let i = 0; i < 2; i += 1) {
    await page.waitForSelector(".option");
    await page.locator(".option").first().click();
    await page.locator(".shell__bar .btn").first().click();
  }
  await page.waitForSelector(".option");
  await exit().click();
  await page.waitForSelector("#exit-dialog[open]");
  ok(true, "cevap verdikten sonra çıkış onay istiyor");
  ok(
    (await page.evaluate(() => document.activeElement?.id)) === "exit-dialog-cancel",
    "odak en az yıkıcı eyleme düşüyor"
  );
  await page.locator("#exit-dialog-cancel").click();
  // Not waitForSelector: a closed <dialog> is hidden, and the default
  // wait is for visibility, so that can never resolve.
  await page.waitForFunction(() => !document.getElementById("exit-dialog").open);
  ok(page.url().includes("quiz.html"), "vazgeçince testte kalınıyor");

  await exit().click();
  await page.waitForSelector("#exit-dialog[open]");
  await page.locator("#exit-dialog-confirm").click();
  await page.waitForURL(/index\.html/);
  ok(true, "onaylayınca çıkılıyor");

  await context.close();
}

/** The parts of §8 that do not vary with the viewport. */
async function runAccessibility(page) {
  await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });
  await page.waitForSelector(".row");

  ok(await page.locator('nav[aria-label="Bölümler"]').count() === 1, "alt navigasyon bir landmark");
  ok(
    await page.locator('[role="tablist"], [role="tab"], [role="tabpanel"]').count() === 0,
    "tablist deseni kullanılmıyor"
  );
  ok(await page.locator("#live-region[role=status]").count() === 1, "tek kalıcı canlı bölge");

  await page.keyboard.press("Tab");
  const ring = await page.evaluate(() => getComputedStyle(document.activeElement).outlineWidth);
  ok(ring !== "0px", `klavye odağı görünür halka çiziyor (${ring})`);
  await page.mouse.click(10, 300);
  const pointerRing = await page.evaluate(() => getComputedStyle(document.activeElement).outlineWidth);
  ok(pointerRing === "0px", "işaretçi basışı halka çizmiyor (:focus-visible)");

  // §8.5 — a hash route is a navigation: title, focus and announcement.
  await page.locator('.nav__item[data-view="test"]').click();
  await page.waitForSelector("#test-panel .surface");
  ok(await page.title() === "Test — English Prep", "yönlendirme document.title'ı güncelliyor");
  ok(await page.evaluate(() => document.activeElement.id) === "view-test", "odak yeni görünüme taşınıyor");
  ok((await page.locator("#live-region").textContent()) === "Test", "görünüm adı duyuruluyor");

  // ...and paints nothing when it gets there. The view is the whole
  // screen, so a focus ring on it is a box around 1,400px of content
  // drawn over whatever sits at its edges — which is what a learner
  // reported as "menüye tıklayınca büyük sarı kutu". :focus-visible was
  // supposed to prevent it: its heuristic is per-engine and WebKit
  // matches it on a programmatically focused tabindex="-1" element, so
  // this never reproduced in Chromium and the CSS is asserted directly.
  ok(
    await page.evaluate(() => {
      const view = document.querySelector(".view:not([hidden])");
      view.focus();
      return getComputedStyle(view).outlineStyle === "none";
    }),
    "görünüm kabı odaklandığında çerçeve çizmiyor"
  );
  // And the suppression is scoped: a control a keyboard reached still
  // shows its ring, which is the half 2.4.7 is actually about.
  await page.keyboard.press("Tab");
  ok(
    await page.evaluate(() => {
      const active = document.activeElement;
      return active.matches(":focus-visible") && getComputedStyle(active).outlineStyle === "solid";
    }),
    "klavyeyle ulaşılan denetim odak halkasını koruyor"
  );

  // §8.2 — a select-only combobox, with focus staying on the trigger.
  await page.locator(".listbox__trigger").focus();
  await page.keyboard.press("ArrowDown");
  ok(await page.locator('.listbox__trigger[aria-expanded="true"]').count() === 1, "ArrowDown listbox'ı açıyor");
  ok(
    await page.evaluate(() => document.activeElement.classList.contains("listbox__trigger")),
    "odak tetikleyicide kalıyor"
  );
  ok(!!(await page.locator(".listbox__trigger").getAttribute("aria-activedescendant")), "aria-activedescendant izleniyor");
  await page.keyboard.press("2");
  ok((await page.locator(".listbox__option--active").textContent()) === "20", "yazarak arama çalışıyor");
  await page.keyboard.press("Escape");
  ok(
    (await page.locator(".listbox__trigger").textContent()).includes("10"),
    "Escape seçimi işlemeden kapatıyor"
  );

  // §8.3 — native <dialog>: focus containment, Escape, focus restore.
  await page.locator("#profile-trigger").click();
  await page.waitForSelector("#profile-container .surface");
  await page.locator("#profile-container .btn--secondary").last().click();
  await page.waitForSelector("dialog[open]");
  ok(
    await page.evaluate(() => document.activeElement.id) === "confirm-dialog-cancel",
    "odak en az yıkıcı eyleme düşüyor"
  );
  ok(
    await page.evaluate(() => document.querySelector("dialog[open]").contains(document.activeElement)),
    "odak dialog içinde tutuluyor"
  );
  await page.keyboard.press("Escape");
  ok(await page.locator("dialog[open]").count() === 0, "Escape dialogu kapatıyor");
  ok(
    await page.evaluate(() => (document.activeElement.textContent ?? "").includes("sıfırla")),
    "odak açan düğmeye dönüyor"
  );

  // §8.4 — a wrong answer names the English form, wrapped so the
  // synthesiser switches voice. And the options stay reachable.
  await page.goto(`${BASE}/index.html#test`, { waitUntil: "networkidle" });
  await page.waitForSelector("#test-panel .btn--primary");
  await page.locator("#test-panel .btn--primary").click();
  await page.waitForURL(/quiz\.html/);
  await page.waitForSelector(".option");

  ok(await page.locator(".blank .visually-hidden").count() > 0, "boşluk ekran okuyucuya sözle veriliyor");

  let announcedEnglish = false;
  for (let question = 0; question < 12 && !announcedEnglish; question += 1) {
    await page.locator(".option").first().click();
    await page.waitForSelector(".feedback");
    if (await page.locator(".feedback--no").count()) {
      announcedEnglish = /lang="en"/.test(await page.locator("#live-region").innerHTML());
      break;
    }
    const advance = page.locator("#quiz-bar button");
    if (!(await advance.count())) {
      break;
    }
    await advance.click();
    await page.waitForTimeout(100);
    if (page.url().includes("results.html")) {
      break;
    }
  }
  ok(announcedEnglish, "yanlış cevap duyurusu İngilizce formu lang=\"en\" ile sarıyor");

  /* The option row aligns to its first line rather than to its middle,
     because a restatement's options are whole sentences. Measured rather
     than eyeballed: a one-line option must still look centred, or every
     existing screen shifts. */
  const geometry = await page.evaluate(() => {
    const option = document.querySelector(".option");
    const key = option?.querySelector(".option__key");
    const text = option?.querySelector(".option__text");
    if (!option || !key || !text) {
      return null;
    }
    const range = document.createRange();
    range.selectNodeContents(text);
    const [firstLine] = range.getClientRects();
    const row = option.getBoundingClientRect();
    const chip = key.getBoundingClientRect();
    return {
      rowHeight: row.height,
      textTop: firstLine.top - row.top,
      textBottom: row.bottom - firstLine.bottom,
      keyOffset: chip.top + chip.height / 2 - (firstLine.top + firstLine.height / 2),
      lines: range.getClientRects().length,
    };
  });
  ok(geometry !== null, "seçenek satırı ölçülebiliyor");
  if (geometry) {
    ok(
      geometry.lines > 1 || Math.abs(geometry.textTop - geometry.textBottom) <= 1,
      `tek satırlık seçenek dikeyde ortalı (üst ${geometry.textTop.toFixed(1)}, alt ${geometry.textBottom.toFixed(1)})`
    );
    ok(
      Math.abs(geometry.keyOffset) <= 3,
      `numara ilk satırla hizalı (${geometry.keyOffset.toFixed(1)}px sapma)`
    );
  }

  ok(await page.locator('.option[aria-disabled="true"]').count() > 0, "cevaplanan seçenekler aria-disabled");
  ok(await page.locator(".option[disabled]").count() === 0, "hiçbir yerde disabled kullanılmıyor");
}

const browser = await chromium.launch({ executablePath: EXECUTABLE });

try {
  for (const viewport of VIEWPORTS) {
    console.log(`\n=== ${viewport.name} ===`);
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
    });
    const page = await context.newPage();
    await runFlow(page, viewport);
    await context.close();
  }

  console.log("\n=== önce kendin düşün ===");
  await runThinkFirst(browser);

  console.log("\n=== yanlış defteri ===");
  await runMistakeBook(browser);

  console.log("\n=== dersten önce (ön test) ===");
  await runPretest(browser);

  console.log("\n=== Eğitim indeksinin üç hâli ===");
  await runIndexStates(browser);

  console.log("\n=== testten çıkış ===");
  await runQuizExit(browser);

  console.log("\n=== bileşen sayfası ===");
  await runComponents(browser);

  console.log("\n=== soru bildirimi ===");
  await runProblemReport(browser);

  console.log("\n=== yedekleme ve geri yükleme ===");
  await runBackupRoundTrip(browser);

  console.log("\n=== her ders, 390px ===");
  const lessonContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await runEveryLesson(await lessonContext.newPage());
  await lessonContext.close();

  console.log("\n=== erişilebilirlik sözleşmesi (§8) ===");
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await runAccessibility(await context.newPage());
  await context.close();
} finally {
  await browser.close();
}

console.log(
  failures.length
    ? `\n✗ ${checks} kontrolden ${failures.length} tanesi başarısız:\n - ${failures.join("\n - ")}`
    : `\n✓ ${checks} kontrol, sorun yok`
);
process.exit(failures.length ? 1 : 0);
