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

import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
// The app's own id rule, not a copy of it: the harness seeds lesson
// progress, and progress is stored against these ids.
import { lessonId } from "../js/topics.js";

const BASE = process.argv[2] ?? "http://localhost:8000";

/**
 * Height budgets, in 640px screens at 320, for the screens a learner
 * LANDS on. Opt-in per call site, and that is the whole design.
 *
 * The first version of this check applied one budget everywhere
 * `auditLayout` runs and immediately fired on the lesson reader, a check
 * screen and the results review — all of which are long by design: a
 * lesson is prose the learner chose to open, and the results screen
 * carries every question again with its explanation. A check that fires
 * on correct content is one nobody finishes reading, which is the same
 * argument this repo makes about reviewers, and it would have been the
 * second time this file learned it.
 *
 * So the budget is passed where length is a defect rather than a
 * property: the index and the topic screen, which are lists.
 */
const LANDING_BUDGET_SCREENS = 3;

/**
 * The topic screen gets its own, larger budget, because it is a different
 * kind of screen: the index is a list a learner scans on the way
 * somewhere, and length there is the defect the friend reported. This one
 * is orientation the learner chose to open, plus that topic's six lesson
 * rows. Still budgeted, because it is the obvious place for the next
 * unmeasured 768px to land.
 */
const TOPIC_BUDGET_SCREENS = 4;

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
/**
 * @param {{maxScreens?: number}} [options] - assert a height budget. Only
 *   for screens a learner lands on; see `LANDING_BUDGET_SCREENS`.
 */
async function auditLayout(page, label, width, { maxScreens } = {}) {
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
        height: Math.round(document.getElementById("shell-scroll")?.scrollHeight ?? 0),
      };
    },
    { minHit: MIN_HIT, minAxis: MIN_AXIS }
  );

  ok(!report.overflow, `${label}: yatay taşma yok${report.overflow ? ` (${report.overflow} > ${width})` : ""}`);
  ok(report.small.length === 0, `${label}: dokunma hedefleri yeterli${report.small.length ? ` — ${report.small.join("; ")}` : ""}`);

  // Vertical length — the axis this sweep never measured. It audited
  // horizontal overflow on every screen it visited and passed 1,051
  // checks while the Eğitim index grew by 768px, which is how the pile-up
  // came to be found by a friend using the app rather than by the build.
  // The unit is screens, because that is the unit the complaint arrives
  // in: "it never ends".
  if (maxScreens && width === 320 && report.height > 0) {
    const screens = report.height / 640;
    ok(
      screens <= maxScreens,
      `${label}: ${report.height}px = ${screens.toFixed(1)} ekran` +
        (screens > maxScreens ? ` — bütçe ${maxScreens}` : "")
    );
  }
}

/**
 * Index → topic → first lesson.
 *
 * The Eğitim index lists topics now, not lessons, so "click the first row
 * and you are in a lesson" stopped being true. Three sections assumed it
 * and broke at once, which is the argument for a helper: the next change
 * to the route has one place to land rather than three.
 */
async function openFirstLesson(page) {
  await page.waitForSelector("#index-list .row");
  await page.locator("#index-list .row").first().click();
  await page.waitForSelector("#lesson-bar .btn--primary");
  await page.locator("#lesson-bar .btn--primary").click();
  await page.waitForSelector("#lesson-reader .reader__top");
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
  await auditLayout(page, "Eğitim indeksi", viewport.width, { maxScreens: LANDING_BUDGET_SCREENS });

  // The journey now has a topic level: index → topic → lesson. That is
  // the routing the index change bought — a first row that used to open
  // a contrast the learner had no name for now opens the screen that
  // gives them the name, and hands them on.
  await page.locator("#index-list .row").first().click();
  await page.waitForSelector("#lesson-reader h1");
  ok(/#egitim\/konu\//.test(page.url()), "konu satırı konu ekranını açıyor");
  const introBar = page.locator("#lesson-bar .btn--primary");
  ok(await introBar.count() === 1, "konu ekranı ileri götüren bir eylem sunuyor");
  await auditLayout(page, "konu ekranı", viewport.width, { maxScreens: TOPIC_BUDGET_SCREENS });
  await introBar.click();

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
  // Case-insensitive: the sentence is built from the manifest, so a
  // section name sits mid-sentence or opens one depending on what has
  // shipped. That is the paragraph correcting itself, not a regression.
  ok(/okuma \(21 puan\)/i.test(profileText), "kapsanmayan bölümler puanıyla adlandırılıyor");
  ok(/dinleme/.test(profileText), "Session II'nin kapsanmadığı söyleniyor");

  // The roadmap. Its "what exists" line is counted from the manifest, so
  // the check compares it to the manifest rather than to a number — the
  // whole point of counting it is that shipping a topic updates it and
  // nothing else has to remember to.
  ok(profileText.includes("Neler var, neler geliyor"), "yol haritası Profil'de");
  const expected = await page.evaluate(async () => {
    const manifest = await (await fetch("data/manifest.json")).json();
    const live = manifest.topics.filter((topic) => !topic.comingSoon);
    return {
      topics: live.length,
      lessons: live.reduce((total, topic) => total + (topic.lessonCount ?? 0), 0),
      questions: live.reduce((total, topic) => total + (topic.questionCount ?? 0), 0),
    };
  });
  ok(
    profileText.includes(
      `Şu an ${expected.topics} konu, ${expected.lessons} ders, ${expected.questions} soru.`
    ),
    `var olan içerik manifestten sayılıyor (${expected.topics}/${expected.lessons}/${expected.questions})`
  );
  // A roadmap row must not look like a control: it would be promising a
  // screen that does not exist, which is the one thing it must not do.
  const roadmapRows = page.locator("#profile-container section", {
    hasText: "Neler var, neler geliyor",
  });
  ok((await roadmapRows.locator(".row").count()) > 0, "yol haritası satırları çiziliyor");
  ok(
    (await roadmapRows.locator("button.row, a.row").count()) === 0,
    "yol haritası satırları tıklanabilir görünmüyor"
  );
  // And no date is promised anywhere in it.
  const roadmapText = await roadmapRows.first().innerText();
  ok(
    !/\b(20\d\d|ocak|şubat|mart|nisan|mayıs|haziran|temmuz|ağustos|eylül|ekim|kasım|aralık)\b/i.test(
      roadmapText
    ),
    "yol haritası tarih sözü vermiyor"
  );

  // The banner that used to sit above every screen is gone, on every
  // screen: it cost 48px of the 320 fold on every arrival to say
  // something no learner could act on.
  ok((await page.locator("#dev-note").count()) === 0, "üstteki geliştirme bandı kalktı");

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

  // Driven from the ids rather than by clicking rows. The index lists
  // topics now, so "the nth row is the nth lesson" is no longer true —
  // and addressing each lesson by its own URL is what this section was
  // always really doing.
  const manifest = JSON.parse(await readFile(new URL("../data/manifest.json", import.meta.url), "utf8"));
  const lessonIds = manifest.topics
    .filter((topic) => !topic.comingSoon)
    .flatMap((topic) => (topic.lessons ?? []).map((lesson) => lessonId(topic.id, lesson.category)));
  ok(lessonIds.length > 0, `${lessonIds.length} ders bulundu`);
  await page.goto(`${BASE}/index.html#egitim`, { waitUntil: "networkidle" });

  for (const id of lessonIds) {
    // Set the hash rather than goto-then-reload. The app routes on
    // hashchange, so a reload is unnecessary — and it aborted the topic
    // file the previous navigation had already started fetching, which
    // reached the console as "TypeError: Failed to fetch" and looked
    // exactly like an app defect.
    await page.evaluate((hash) => {
      window.location.hash = hash;
    }, `egitim/${id}`);
    await page.waitForFunction(
      (wanted) => decodeURIComponent(window.location.hash) === `#${wanted}`,
      `egitim/${id}`
    );
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
    emptied.includes("bildiğin anlamına gelmez"),
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
  await openFirstLesson(first);
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
  await openFirstLesson(page);
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
      await openFirstLesson(trial);
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
  async function open(seed, argument) {
    const context = await browser.newContext({ viewport: { width: 320, height: 640 } });
    const page = await context.newPage();
    await page.goto(`${BASE}/index.html`, { waitUntil: "networkidle" });
    if (seed) await page.evaluate(seed, argument);
    await page.goto(`${BASE}/index.html#egitim`, { waitUntil: "networkidle" });
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForSelector("#view-egitim .surface, #view-egitim .row");
    return { context, page, text: await page.locator("#view-egitim").innerText() };
  }

  // 1 — never opened. No tour, and no progress bar reading zero.
  let view = await open(null);
  ok(view.text.includes("English Prep"), "ilk açılışta uygulamanın ne olduğu yazıyor");

  // The index is eight topic rows, not forty-eight lesson rows. It was
  // 5,332px — 8.3 screens — and a learner reported it as the topics
  // piling up; the lessons now live one level down, on the screen that
  // already explained them.
  const topicRows = await view.page.locator("#index-list .row").count();
  const liveTopics = await view.page.evaluate(async () => {
    const manifest = await (await fetch("data/manifest.json")).json();
    return manifest.topics.filter((topic) => !topic.comingSoon).length;
  });
  ok(topicRows === liveTopics, `indeks konu satırı gösteriyor (${topicRows}/${liveTopics})`);
  ok(
    await view.page.locator("#index-list .row").first().locator(".row__sub").count() === 1,
    "her konu satırı ne olduğunu tek satırda söylüyor"
  );

  // And what pays back the tap that costs: the learner who knew which
  // lesson he wanted goes from one tap to three without this.
  const filter = view.page.locator("#index-filter");
  ok(await filter.count() === 1, "ders filtresi indekste");
  await filter.fill("ilgi");
  await view.page.waitForTimeout(120);
  const lower = await view.page.locator("#index-list .row").count();
  await filter.fill("İLGİ");
  await view.page.waitForTimeout(120);
  const upper = await view.page.locator("#index-list .row").count();
  // toLowerCase() is wrong here and wrong only in Turkish: I/ı and İ/i
  // are different pairs, so a learner typing "ilgi" would not match
  // "İlgi" under the default mapping.
  ok(lower > 0 && lower === upper, `Türkçe büyük/küçük harf doğru katlanıyor (${lower}/${upper})`);
  await filter.fill("gecmis");
  await view.page.waitForTimeout(120);
  ok(
    (await view.page.locator("#index-list .row").count()) > 0,
    "diyakritiksiz yazım da eşleşiyor (gecmis → geçmiş)"
  );
  await filter.fill("zzzz");
  await view.page.waitForTimeout(120);
  ok(
    (await view.page.locator("#index-list").innerText()).includes("Eşleşen ders yok"),
    "sonuç yoksa öyle söyleniyor"
  );
  await filter.fill("");
  await view.page.waitForTimeout(120);
  ok(
    (await view.page.locator("#index-list .row").count()) === liveTopics,
    "filtre temizlenince konu listesi geri geliyor"
  );
  // Every lesson in this app is a contrast, so the index used to offer
  // "Relative Clauses" and then, one line down, "Who vs Whom vs Whose",
  // with nothing anywhere saying what a relative clause is. One Turkish
  // line per topic, read from the manifest.
  const glosses = await view.page.evaluate(async () => {
    const manifest = await (await fetch("data/manifest.json")).json();
    return manifest.topics.filter((topic) => !topic.comingSoon).map((topic) => topic.gloss ?? null);
  });
  ok(glosses.every(Boolean), `her konunun bir Türkçe tanıtım satırı var (${glosses.length})`);
  ok(
    glosses.every((gloss) => view.text.includes(gloss)),
    "tanıtım satırları Eğitim indeksinde çiziliyor"
  );
  ok(
    glosses.every((gloss) => gloss.length <= 110),
    `tanıtım satırları tek satırlık (en uzun ${Math.max(...glosses.map((g) => g.length))})`
  );
  ok(view.text.includes("bu telefonda kalıyor"), "veri nerede duruyor, ilk ekranda söyleniyor");
  ok(
    (await view.page.locator("#lesson-index .btn--primary").count()) === 1,
    "tek bir açık ilk eylem var"
  );
  ok(!view.text.includes("İlerlemen"), "sıfırı gösteren ilerleme çubuğu karşılama kartıyla birlikte çıkmıyor");
  // The whole complaint this round started from: every lesson is a
  // contrast, so opening one before the learner has the category drops
  // them into an argument about a word they have not met. Start means
  // start at the beginning.
  await auditLayout(view.page, "ilk açılış", 320, { maxScreens: LANDING_BUDGET_SCREENS });
  await view.page.locator("#lesson-index .btn--primary").click();
  await view.page.waitForSelector("#lesson-reader h1");
  ok(
    /#egitim\/konu\//.test(view.page.url()),
    "başla düğmesi ilk derse değil, konunun kendisine giriyor"
  );
  ok(
    (await view.page.locator("#lesson-bar .btn--primary").innerText()).trim() === "Derslere geç",
    "konu ekranı oradan derslere devrediyor"
  );
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
  await auditLayout(view.page, "aradan sonra dönüş", 320, { maxScreens: LANDING_BUDGET_SCREENS });
  await view.context.close();

  // 4 — back after a gap, having finished everything they started. There
  // is no lesson to resume, which does not make them a new learner: the
  // card must still offer a way forward, and it must not claim a place
  // they left off from.
  view = await open(
    new Function(
      `localStorage.setItem("englishPrep.lessonProgress", JSON.stringify({` +
        `"tenses-present-simple-vs-present-continuous": { read: 1, done: true } }));` +
        `localStorage.setItem("englishPrep.history", JSON.stringify({ attempts: [${JSON.stringify(
          attempt("PLACEHOLDER")
        ).replace('"PLACEHOLDER"', "new Date(Date.now() - 21 * 86400000).toISOString()")}] }));`
    )
  );
  ok(view.text.includes("Kısa bir hatırlatma"), "yarım ders yokken de dönüş kartı çıkıyor");
  ok(view.text.includes("Sıradaki derse geç"), "yarım ders yokken ileri giden bir yol var");
  ok(!view.text.includes("Kaldığın yer"), "olmayan bir kaldığın yer iddia edilmiyor");
  ok(/dersten \d+ tanesi tamamlandı/.test(view.text), "ilerleme kartın içinde, bir gerçek olarak duruyor");
  await auditLayout(view.page, "dönüş, yarım ders yok", 320, { maxScreens: LANDING_BUDGET_SCREENS });
  await view.context.close();

  // 5 — test history, no lesson finished, same day. This used to be a bar
  // reading zero for a learner who had done real work.
  view = await open(
    new Function(
      `localStorage.setItem("englishPrep.history", JSON.stringify({ attempts: [{` +
        `date: new Date().toISOString(), mode: "mixed",` +
        `topicBreakdown: { tenses: { correct: 1, total: 6 } },` +
        `categoryBreakdown: { "Present Simple vs Present Continuous": { correct: 1, total: 6 } },` +
        `questions: [0,1,2,3,4,5].map((i) => ({ id: "tenses-t" + i, topicId: "tenses",` +
        `category: "Present Simple vs Present Continuous", correct: i === 0 }))` +
        `}] }));`
    )
  );
  ok(view.text.includes("Sıradaki adım"), "test geçmişi olana ne yapacağı söyleniyor");
  ok(view.text.includes("Bu dersi aç"), "tek bir açık eylem var");
  ok(
    view.text.includes("Present Simple vs Present Continuous"),
    "en çok zorlandığı kategorinin dersi öneriliyor"
  );
  ok(
    view.text.indexOf("Bu dersi aç") < view.text.indexOf("tanesi tamamlandı"),
    "ilerleme sayısı düğmenin altında, başlık değil"
  );
  // A recommendation is not a gate: every lesson row stays open.
  ok(
    (await view.page.locator("#index-list .row").count()) > 1,
    "öneri kartı konu listesini kilitlemiyor"
  );
  await auditLayout(view.page, "sıradaki adım", 320, { maxScreens: LANDING_BUDGET_SCREENS });
  await view.context.close();

  // 6 — everything read and every question met. The one screen that used
  // to be a dead end.
  //
  // The store is built in Node, from the real manifest and the real
  // `lessonId`, and handed over as data: a seed that recomputed the id
  // from the category would be a second implementation of the rule that
  // decides where progress is stored, and it would agree with the app
  // right up until one of them changed.
  const manifest = JSON.parse(await readFile(new URL("../data/manifest.json", import.meta.url), "utf8"));
  const everything = { progress: {}, questions: [] };
  for (const topic of manifest.topics.filter((entry) => !entry.comingSoon)) {
    for (const lesson of topic.lessons ?? []) {
      everything.progress[lessonId(topic.id, lesson.category)] = { read: 1, done: true };
    }
    for (let i = 0; i < topic.questionCount; i += 1) {
      everything.questions.push({
        id: `${topic.id}-q${i}`,
        topicId: topic.id,
        category: "x",
        correct: true,
      });
    }
  }
  view = await open((seed) => {
    localStorage.setItem("englishPrep.lessonProgress", JSON.stringify(seed.progress));
    localStorage.setItem(
      "englishPrep.history",
      JSON.stringify({
        attempts: [
          {
            date: new Date().toISOString(),
            mode: "mixed",
            topicBreakdown: {},
            categoryBreakdown: {},
            questions: seed.questions,
          },
        ],
      })
    );
  }, everything);
  ok(view.text.includes("Dersleri bitirdin"), "her şeyi bitirene bir son ekranı var");
  ok(view.text.includes("Karışık testle tekrar et"), "çıkmaz sokak değil, bir eylem sunuluyor");
  ok(
    !/hazırsın|hazırlandın|başardın|tebrik/i.test(view.text),
    "sınava hazırsın denmiyor — banka sınavın küçük bir parçası"
  );
  // Scoped to the card, not to the whole view. The negative below is the
  // reason: the view also carries the topic glosses, and the one on
  // `closest-meaning` names the section this card must NOT list as
  // missing. Reading the whole view made the check pass by luck and fail
  // the moment an unrelated line mentioned a section by name.
  const doneCard = await view.page.locator("#view-egitim .surface").first().innerText();
  ok(/okuma \(21 puan\)/.test(doneCard), "kapsanmayan bölümler adıyla söyleniyor");
  ok(
    !/anlamca en yakın cümle/.test(doneCard),
    "kapsanan bölüm eksik diye sayılmıyor (manifestten okunuyor)"
  );
  await auditLayout(view.page, "hepsi bitti", 320, { maxScreens: LANDING_BUDGET_SCREENS });
  await view.context.close();
}

/**
 * Leaving a test that is under way.
 *
 * `Çık` was a plain link, so five answered questions went with one tap and
 * nothing was written down — the learner arrived back on the screen a
 * brand-new learner sees, because from storage's point of view they were
 * one. Then it was a link plus a confirmation dialog, which made the loss
 * loud instead of making it not a loss. It now records what was answered
 * and shows the score, so the check is that the work survives: an attempt
 * in the history, and the questions that were never reached not counted
 * as wrong.
 */
async function runQuizExit(browser) {
  const context = await browser.newContext({ viewport: { width: 320, height: 640 } });
  const page = await context.newPage();
  const exitButton = () => page.locator(".btn--quiet").first();

  async function startTest() {
    await page.goto(`${BASE}/index.html#test`, { waitUntil: "networkidle" });
    await page.waitForSelector("#test-panel .btn--primary");
    await page.locator("#test-panel .btn--primary").click();
    await page.waitForURL(/quiz\.html/);
    await page.waitForSelector(".option");
  }

  // Nothing answered is nothing to record, so it is still an exit.
  await startTest();
  ok((await exitButton().innerText()).trim() === "Çık", "hiç cevap yokken düğme çıkış diyor");
  await exitButton().click();
  await page.waitForURL(/index\.html/);
  ok(true, "hiç cevap verilmemişken doğrudan çıkılıyor");
  ok(
    (await page.evaluate(
      () => (JSON.parse(localStorage.getItem("englishPrep.history") ?? "{}").attempts ?? []).length
    )) === 0,
    "cevapsız çıkış geçmişe bir şey yazmıyor"
  );

  // Two answered out of ten, then out. The two are a two-question test.
  await startTest();
  const total = Number((await page.locator(".t-num").first().innerText()).split("/")[1].trim());
  ok(total > 2, `test iki sorudan uzun (${total})`);
  for (let i = 0; i < 2; i += 1) {
    await page.waitForSelector(".option");
    await page.locator(".option").first().click();
    await page.locator(".shell__bar .btn").first().click();
  }
  await page.waitForSelector(".option");
  ok(
    (await exitButton().innerText()).trim() === "Bitir",
    "cevap verildikten sonra çıkış erken bitirmeye dönüşüyor"
  );

  await exitButton().click();
  await page.waitForURL(/results\.html/);
  await page.waitForSelector(".t-display");
  const score = (await page.locator(".t-display").first().innerText()).trim();
  ok(
    score.endsWith("/ 2") || score.endsWith("/2"),
    `görülmeyen sorular yanlış sayılmıyor (${score})`
  );

  const history = await page.evaluate(
    () => JSON.parse(localStorage.getItem("englishPrep.history") ?? "{}").attempts ?? []
  );
  ok(history.length === 1, "yarıda bırakılan test geçmişe yazılıyor");
  ok(history[0]?.questions?.length === 2, "sadece cevaplanan sorular kaydediliyor");

  await context.close();
}

/**
 * The numbers on screen, and whether each one answers a question the app
 * can actually answer.
 *
 * All three of these shipped as numbers that meant nothing. "Yeni" marked
 * every topic on a store that had never seen any of them, and then the
 * first mixed test consumed all of them at once. The results breakdown
 * applied no evidence threshold at all, so a ten-question test produced
 * nine rows sorted worst-first, most of them 0/1, which reads as a
 * ranking. And the Test tab put a filled button on the mixed test even
 * when the mistake book — the better mode — was sitting above it.
 */
async function runHonestNumbers(browser) {
  const context = await browser.newContext({ viewport: { width: 320, height: 640 } });
  const page = await context.newPage();

  // 1 — a fresh store has no baseline, so nothing can be new relative to
  // it. "Yeni" is a comparison, not a decoration.
  await page.goto(`${BASE}/index.html#test`, { waitUntil: "networkidle" });
  await page.waitForSelector("#test-panel .row");
  ok(
    (await page.locator("#test-panel .chip--accent").count()) === 0,
    "ilk açılışta hiçbir konu Yeni diye işaretlenmiyor"
  );

  // And a topic the learner HAS seen, at an older version, is.
  await page.evaluate(() =>
    localStorage.setItem("englishPrep.seenVersions", JSON.stringify({ tenses: 1 }))
  );
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForSelector("#test-panel .row");
  const badges = await page.locator("#test-panel .chip--accent").count();
  ok(badges === 1, `eski sürümü görmüş konu Yeni diye işaretleniyor (${badges})`);

  // 2 — starting a mixed test must not burn the badge for every topic in
  // the app. Only what the learner was actually asked about counts.
  await page.locator("#test-panel .btn--primary").click();
  await page.waitForURL(/quiz\.html/);
  await page.waitForSelector(".option");
  const marked = await page.evaluate(
    () => Object.keys(JSON.parse(localStorage.getItem("englishPrep.seenVersions") ?? "{}")).length
  );
  ok(marked === 1, `test başlatmak her konuyu görülmüş saymıyor (${marked})`);

  // 3 — ten questions over eight topics is one or two each, and a list
  // sorted worst-first on one item reads as a finding.
  for (let i = 0; i < 10; i += 1) {
    await page.waitForSelector(".option");
    await page.locator(".option").first().click();
    await page.locator(".shell__bar .btn").first().click();
  }
  await page.waitForURL(/results\.html/);
  await page.waitForSelector(".t-display");
  const results = await page.locator("#results-container").innerText();
  ok(
    results.includes("bir sıralama, bir sonuç değil"),
    "az veriyle çıkan dökümün ne olmadığı söyleniyor"
  );
  // The rows themselves stay: drop the claim, not the data.
  ok(
    (await page.locator("#results-container .row").count()) > 1,
    "hedge satırları silmiyor — kendi testini görme hakkı duruyor"
  );

  // The other half of the badge rule: the baseline IS set, here, for
  // exactly the topics the questions came from. Compared against the
  // recorded attempt rather than against a number, so it stays true as
  // the bank grows and a ten-question test stops reaching every topic.
  const seenMatchesAttempt = await page.evaluate(() => {
    const attempts = JSON.parse(localStorage.getItem("englishPrep.history") ?? "{}").attempts ?? [];
    const met = Object.keys(attempts[attempts.length - 1]?.topicBreakdown ?? {}).sort();
    const seen = Object.keys(JSON.parse(localStorage.getItem("englishPrep.seenVersions") ?? "{}")).sort();
    return { met, seen };
  });
  ok(
    seenMatchesAttempt.met.length > 0 &&
      seenMatchesAttempt.met.every((topicId) => seenMatchesAttempt.seen.includes(topicId)),
    `sorusu çıkan konular görülmüş sayılıyor (${seenMatchesAttempt.met.length})`
  );

  // 4 — §7.2, one filled button per screen. The mistake book now has
  // questions in it, so it is the mode the screen recommends.
  await page.goto(`${BASE}/index.html#test`, { waitUntil: "networkidle" });
  await page.waitForSelector("#test-panel .surface");
  const filled = await page.locator("#test-panel .btn--primary").count();
  ok(filled === 1, `Test sekmesinde tek dolu düğme var (${filled})`);
  ok(
    (await page.locator("#test-panel .btn--primary").innerText()).trim() === "Yanlışları çalış",
    "dolu düğme daha iyi olan moda ait"
  );

  await context.close();
}

/**
 * The topic overview screen.
 *
 * Every lesson in this app is a contrast, which is right for the exam and
 * wrong for a first arrival: the index offered "Relative Clauses" and
 * then, one line down, "Who vs Whom vs Whose". This screen is what says
 * what the group IS — and it is a screen you choose to open rather than a
 * block in all 48 lessons, because the expertise-reversal literature says
 * the same support that helps a novice measurably hurts someone who
 * already has the schema.
 */
async function runTopicIntro(browser) {
  const context = await browser.newContext({ viewport: { width: 320, height: 640 } });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  const manifest = JSON.parse(await readFile(new URL("../data/manifest.json", import.meta.url), "utf8"));
  const live = manifest.topics.filter((topic) => !topic.comingSoon);
  const withIntro = live.filter((topic) => topic.hasIntro === true);
  ok(withIntro.length === live.length, `her konunun bir girişi var (${withIntro.length}/${live.length})`);

  await page.goto(`${BASE}/index.html#egitim`, { waitUntil: "networkidle" });
  await page.waitForSelector("#view-egitim .row");
  const ways = await page.locator("#index-list .row").count();
  ok(ways === live.length, `indekste her konu için bir giriş yolu var (${ways})`);

  // Every one of them, not just the first: an intro that renders for
  // `tenses` and throws for `quantifiers` is exactly the failure that
  // reaches a learner and never reaches a test.
  for (const topic of withIntro) {
    await page.goto(`${BASE}/index.html#egitim/konu/${topic.id}`, { waitUntil: "networkidle" });
    await page.waitForSelector("#lesson-reader h1");
    const text = await page.locator("#lesson-reader").innerText();

    const data = JSON.parse(
      await readFile(new URL(`../${topic.file}`, import.meta.url), "utf8")
    );
    ok(text.includes(data.intro.title), `${topic.id}: başlık çiziliyor`);
    ok(
      data.intro.parts.every((part) => text.includes(part.name)),
      `${topic.id}: parça listesi tam (${data.intro.parts.length})`
    );
    // The parts list is the part that earns the page — Mayer's
    // pre-training principle is a named-components list, not an essay.
    ok(
      (await page.locator("#lesson-reader .row").count()) === (topic.lessonCount ?? 0),
      `${topic.id}: dersleri de listeliyor`
    );
    ok(
      await page.title() === `${topic.title} — English Prep`,
      `${topic.id}: document.title güncelleniyor`
    );

    // §8: an English string inside a Turkish page needs lang="en", or
    // text-transform follows lang="tr" and SIMPLE becomes SİMPLE.
    const untagged = await page.evaluate(() => {
      const nodes = [...document.querySelectorAll("#lesson-reader .t-en")];
      return nodes.filter((node) => node.closest("[lang=en]") === null).length;
    });
    ok(untagged === 0, `${topic.id}: İngilizce dizeler lang="en" taşıyor`);
  }

  await auditLayout(page, "konu girişi", 320, { maxScreens: TOPIC_BUDGET_SCREENS });

  // Focused mode, and a way out of it.
  ok(await page.locator("#shell-header").isHidden(), "giriş ekranı odaklı modda");
  await page.locator(".shell__bar .btn").first().click();
  await page.waitForSelector("#view-egitim .row");
  ok(await page.locator("#shell-header").isVisible(), "geri dönünce başlık geri geliyor");

  // A hand-typed or stale id must not strand the learner on a dead screen.
  await page.goto(`${BASE}/index.html#egitim/konu/does-not-exist`, { waitUntil: "networkidle" });
  await page.waitForSelector("#view-egitim .row");
  ok(
    !page.url().includes("does-not-exist"),
    "bilinmeyen konu id'si indekse düşüyor, ölü ekrana değil"
  );

  ok(errors.length === 0, `konsol temiz${errors.length ? ` — ${[...new Set(errors)].join(" | ")}` : ""}`);
  await context.close();
}

/**
 * The topic boundary — the one journey in the app that had no design.
 *
 * Finishing the last lesson of a topic said "Ders bitti · Sıradaki ders",
 * exactly like finishing any other lesson, and the button walked from the
 * end of Tenses straight into `Must vs Have to vs Mustn't vs Don't Have
 * to`: a contrast, in a topic whose intro the learner had never seen.
 * That is the complaint this whole round began with, surviving in the
 * only place nobody had looked.
 */
async function runTopicBoundary(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();

  const manifest = JSON.parse(await readFile(new URL("../data/manifest.json", import.meta.url), "utf8"));
  const live = manifest.topics.filter((topic) => !topic.comingSoon);
  const first = live[0];
  const second = live[1];
  const lastOfFirst = lessonId(first.id, first.lessons[first.lessons.length - 1].category);
  const midOfFirst = lessonId(first.id, first.lessons[0].category);

  async function endCardOf(id) {
    await page.goto(`${BASE}/index.html#egitim/${id}`, { waitUntil: "networkidle" });
    await page.reload({ waitUntil: "networkidle" });
    await page.waitForSelector("#lesson-reader .reader__top");
    for (let i = 0; i < 40; i += 1) {
      const atEnd = await page.evaluate(() => {
        const region = document.getElementById("shell-scroll");
        const done = region.scrollTop + region.clientHeight >= region.scrollHeight - 4;
        region.scrollBy({ top: 900 });
        return done;
      });
      await page.waitForTimeout(50);
      if (atEnd) break;
    }
    return page.locator("#lesson-reader .surface").last();
  }

  // Mid-topic is unchanged: the boundary card must not fire everywhere.
  const mid = await (await endCardOf(midOfFirst)).innerText();
  ok(mid.includes("Ders bitti"), "konu ortasında kart 'Ders bitti' diyor");
  ok(!mid.includes("Konu bitti"), "konu ortasında konu-sonu kartı çıkmıyor");

  const end = await (await endCardOf(lastOfFirst)).innerText();
  ok(end.includes("Konu bitti"), "konunun son dersi bittiğinde kart bunu söylüyor");
  ok(end.includes(second.title), `sıradaki konu adıyla anılıyor (${second.title})`);
  // A fact, never a congratulation: this project states what happened and
  // never a readiness it cannot measure.
  ok(
    !/tebrik|harika|başardın|hazırsın/i.test(end),
    "konu sonu bir tebrik değil, olan biteni söylüyor"
  );

  await page.locator("#lesson-reader button", { hasText: "Sıradaki konu" }).click();
  await page.waitForSelector("#lesson-reader h1");
  ok(
    decodeURIComponent(page.url()).includes(`egitim/konu/${second.id}`),
    "sıradaki konuya geçiş, o konunun ilk karşılaştırmasına değil tanıtımına gidiyor"
  );

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
  //
  // A TOPIC test, not the mixed one. The mixed test draws from every live
  // topic, and since the restatement content shipped that includes items
  // with no blank at all — so "the blank is spoken" became a check that
  // failed on a perfectly good question. Tenses is cloze all the way
  // through, which is what this part of §8.4 is about.
  await page.goto(`${BASE}/index.html#test`, { waitUntil: "networkidle" });
  await page.waitForSelector("#test-panel .row");
  await page.locator("#test-panel .row", { hasText: "Tenses" }).first().click();
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

  console.log("\n=== Eğitim indeksinin altı hâli ===");
  await runIndexStates(browser);

  console.log("\n=== testten çıkış ===");
  await runQuizExit(browser);

  console.log("\n=== sayılar ne anlama geliyor ===");
  await runHonestNumbers(browser);

  console.log("\n=== konu girişleri ===");
  await runTopicIntro(browser);

  console.log("\n=== konu sınırı ===");
  await runTopicBoundary(browser);

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
