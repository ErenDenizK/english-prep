/* Yedi ekran, iki tema. Gerçek içerikten beslenir. */
export const shell = (title, body, foot, opts = {}) => `<!doctype html>
<html lang="tr"${opts.theme === "light" ? ' data-theme="light"' : ""}>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<link rel="stylesheet" href="tokens.css"><link rel="stylesheet" href="base.css"><title>${title}</title></head>
<body>${body}${foot}</body></html>`;

const bar = (title, slot = "") =>
  `<header class="bar"><span class="bar__title">${title}</span><span class="bar__slot">${slot}</span></header>`;

const foot = (...btns) => `<footer class="foot">${btns.join("")}</footer>`;

/* ─ 01 · Bugün ─ */
const TOPICS = [
  ["Tenses",[4,3,4,2,4,3]],["Modals",[3,2,3,1,2,2]],["Passive Voice",[2,3,1,2,1,0]],
  ["Closest Meaning",[3,2,2,0,1,2]],["Connectors",[2,1,0,1,0,2]],["Quantifiers",[2,2,3,0,1,0]],
  ["Relative Clauses",[1,0,2,0,0,1]],["Gerunds",[2,1,0,1,0,0]],["Academic Nouns",[1,0,0,0,0,0]],
  ["Academic Verbs",[0,0,0,0,0,0]],
];
export const bugun = () => ({
  title: "Bugün",
  body: bar("Bugün", `<span class="t-meta quieter">Sınava 24 gün</span>`) + `
<main class="body body--fill">
  <section class="section">
    <div class="section__head"><span class="label">Kapsama</span><span class="t-meta quieter">6 hafta</span></div>
    <div class="mosaic">
      ${TOPICS.map(([n, cs]) => `<div class="mosaic__row"><span class="mosaic__name">${n}</span>
        ${cs.map(c => `<span class="cell" data-n="${c}"></span>`).join("")}</div>`).join("")}
    </div>
    <p class="t-body quiet" style="margin-top:var(--s-4)">
      Koyuluk, altı haftada kaç kez çalıştığın. Boş: hiç görmedin.</p>
  </section>

  <section class="section">
    <div class="section__head"><span class="label">Bugünün çalışması</span></div>
    <h2 class="t-title">Perfect Aspects</h2>
    <p class="t-body quiet" style="margin-top:var(--s-3)">Son yedi karşılaşmada en çok
      <b class="t-en" lang="en">been</b> ile <b class="t-en" lang="en">gone</b> karıştı.</p>
    <p class="t-body quiet" style="margin-top:var(--s-3)">
      8 soru · yaklaşık 10 dakika</p>
  </section>
</main>`,
  foot: foot(`<button class="btn btn--fill">Oturumu başlat</button>`),
});

/* ─ 02 · Konular ─ */
export const konular = () => ({
  title: "Konular",
  body: bar("Konular") + `
<main class="body body--fill">
  <section class="section">
    <div class="section__head"><span class="label">I. Oturum · 60 puan</span></div>
    ${[["Cloze test","10 soru · 15 puan","6/10"],["Closest meaning","10 soru · 15 puan","4/10"],
       ["Reading","14 soru · 21 puan","—"],["Paragraf tamamlama","6 soru · 9 puan","—"]]
      .map(([a,b,c]) => `<button class="row"><span class="row__main">
        <span class="t-body">${a}</span><br>
        <span class="t-body quiet">${b}</span>
      </span><span class="row__meta">${c}</span></button>`).join("")}
  </section>
  <section class="section">
    <div class="section__head"><span class="label">Konu başlıkları</span></div>
    ${TOPICS.slice(0,6).map(([n,cs]) => {
      const done = cs.filter(x=>x>0).length;
      return `<button class="row"><span class="row__main"><span class="t-body">${n}</span></span>
        <span class="row__meta">${done}/6</span></button>`;}).join("")}
  </section>
</main>`,
  foot: foot(`<button class="btn">Karışık test</button>`,`<button class="btn btn--fill">Devam et</button>`),
});

/* ─ 03 · Ders ─ diyagram karşı düzlemde, monokrom */
export const ders = () => ({
  title: "Ders",
  body: bar("Ders 3 / 6", `<span class="t-meta quieter">Perfect Aspects</span>`) + `
<main class="body">
  <span class="label" lang="en">Present Perfect vs Past Simple</span>
  <h1 class="t-title" style="margin:var(--s-3) 0 var(--s-5)" lang="en">Been vs Gone</h1>
  <p class="t-body quiet">İkisi de <b class="t-en" lang="en">go</b> fiilinin perfect hâli, ama farklı şey
    söylüyorlar. Kulağın bu farkı zaten kuruyor; burada sadece adı konuyor.</p>

  <!-- Levha YALNIZ grafik taşır: üstünde tek kelime yok.
       Ölçüldü: --on-plane metin barajını geçmiyor (Lc 72 / WCAG 4.30). -->
  <figure style="margin:var(--s-6) 0">
    <div class="plane" style="padding:var(--s-6) var(--s-5)">
      <svg viewBox="0 0 320 132" width="100%" height="132" role="img"
           aria-label="İki yolculuk: been giden ve dönen, gone giden ve kalan.">
        <g stroke="#0D1116" stroke-opacity=".5" stroke-width="1.5">
          <line x1="20" y1="40" x2="300" y2="40"/><line x1="20" y1="104" x2="300" y2="104"/>
        </g>
        <g fill="none" stroke="#F4F7FB" stroke-width="3" stroke-linecap="round">
          <path d="M40 40 C 116 6, 204 6, 280 40" stroke-dasharray="1 8"/>
          <path d="M40 104 C 116 72, 204 72, 280 74"/>
        </g>
        <circle cx="40"  cy="40"  r="8" fill="#F4F7FB"/>
        <circle cx="280" cy="40"  r="8" fill="none" stroke="#F4F7FB" stroke-width="3"/>
        <circle cx="40"  cy="104" r="8" fill="none" stroke="#F4F7FB" stroke-width="3"/>
        <circle cx="280" cy="74"  r="8" fill="#F4F7FB"/>
      </svg>
    </div>
    <figcaption style="margin-top:var(--s-4);display:grid;
                       grid-template-columns:auto auto 1fr;gap:var(--s-3) var(--s-4);align-items:baseline">
      <svg width="26" height="10" aria-hidden="true"><line x1="1" y1="5" x2="25" y2="5"
        stroke="currentColor" stroke-width="3" stroke-dasharray="1 8" stroke-linecap="round"/></svg>
      <b class="t-en" lang="en">has been</b><span class="quiet">gitti — ve döndü</span>
      <svg width="26" height="10" aria-hidden="true"><line x1="1" y1="5" x2="25" y2="5"
        stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>
      <b class="t-en" lang="en">has gone</b><span class="quiet">gitti — hâlâ orada</span>
      <svg width="26" height="10" aria-hidden="true"><circle cx="8" cy="5" r="4.5" fill="currentColor"/></svg>
      <span class="quiet" style="grid-column:2 / -1">dolu daire: şimdi burada</span>
    </figcaption>
  </figure>

  <p class="t-body quiet">Sınavda ayırt edici sinyal genellikle cümlenin devamında olur:
    <b class="t-en" lang="en">and she is back now</b> varsa <b class="t-en" lang="en">been</b>,
    <b class="t-en" lang="en">she is still there</b> varsa <b class="t-en" lang="en">gone</b>.</p>
</main>`,
  foot: foot(`<button class="btn">Geri</button>`,`<button class="btn btn--fill">Sıradaki</button>`),
});

/* ─ 04 · Soru ─ sessiz, sınav sadık: A/B/C/D + resmî yönerge */
const OPTS = ["has been","has gone","had been","was going"];
export const soru = () => ({
  title: "Soru",
  body: bar("Cloze test", `<span class="t-meta quieter">3 / 8</span>`) + `
<main class="body">
  <p class="t-body quiet" style="margin-bottom:var(--s-5)">
    Aşağıdaki cümlede boş bırakılan yere uygun düşen ifadeyi bulunuz.</p>
  <p class="t-title" lang="en" style="margin-bottom:var(--s-6)">
    She ____ to Ankara twice this year, and she is back now.</p>
  <div class="options" role="group" aria-label="Şıklar">
    ${OPTS.map((o,i) => `<button class="option" type="button">
      <span class="option__key" lang="en">${"ABCD"[i]}</span>
      <span class="t-en" lang="en">${o}</span></button>`).join("")}
  </div>
</main>`,
  foot: foot(`<button class="btn">Atla</button>`),
});

/* ─ 05 · Cevap ─ verdict hareketsiz */
export const cevap = () => ({
  title: "Cevap",
  body: bar("Cloze test", `<span class="t-meta quieter">3 / 8</span>`) + `
<main class="body">
  <!-- Yönerge cevaplandıktan SONRA da durur. Kaldırmak, öğrencinin az
       önce dokunduğu şıkkı 72px yukarı zıplatıyordu (ölçüldü). -->
  <p class="t-body quiet" style="margin-bottom:var(--s-5)">
    Aşağıdaki cümlede boş bırakılan yere uygun düşen ifadeyi bulunuz.</p>
  <p class="t-title" lang="en" style="margin-bottom:var(--s-6)">
    She ____ to Ankara twice this year, and she is back now.</p>
  <div class="options" role="group" aria-label="Şıklar">
    ${OPTS.map((o,i) => {
      const cls = i===0 ? " option--ok" : i===1 ? " option--no" : "";
      return `<button class="option${cls}" type="button" aria-disabled="true">
        <span class="option__key" lang="en">${"ABCD"[i]}</span>
        <span class="t-en" lang="en">${o}</span></button>`;}).join("")}
  </div>
  <div style="margin-top:var(--s-6);padding-top:var(--s-5);border-top:1px solid var(--rule)">
    <span class="label" style="color:var(--ink-2)">Yanlış · doğrusu A</span>
    <p class="t-body" style="margin-top:var(--s-3)"><b class="t-en" lang="en">has gone</b>
      hâlâ orada demek. Cümle <b class="t-en" lang="en">she is back now</b> diyor, yani döndü —
      bu <b class="t-en" lang="en">has been</b>.</p>
  </div>
</main>`,
  foot: foot(`<button class="btn btn--fill">Sıradaki soru</button>`),
});

/* ─ 06 · Sonuç ─ */
const SESSION = [1,1,0,1,1,1,0,1,1,0];
export const sonuc = () => ({
  title: "Sonuç",
  body: bar("Sonuç") + `
<main class="body">
  <div class="ring" style="margin-top:var(--s-4)">
    <svg viewBox="0 0 168 168"><circle class="ring__track" cx="84" cy="84" r="72"/>
      <circle class="ring__fill" cx="84" cy="84" r="72"
        stroke-dasharray="452" stroke-dashoffset="136"/></svg>
    <span class="ring__value">7 / 10</span>
  </div>
  <p class="t-head" style="text-align:center;margin-top:var(--s-5)">İyi gidiyor</p>
  <p class="t-body quiet" style="text-align:center;margin-top:var(--s-2)">
    %70 doğru · 8 dakika</p>

  <section class="section">
    <div class="section__head"><span class="label">Bu oturum</span></div>
    <div class="strip">${SESSION.map(v=>`<span class="strip__i strip__i--${v?"ok":"no"}"></span>`).join("")}</div>
  </section>

  <section class="section">
    <div class="section__head"><span class="label">Konuya göre</span></div>
    ${[["Tenses","2 / 4"],["Modals","3 / 3"],["Passive Voice","2 / 3"]]
      .map(([a,b])=>`<button class="row"><span class="row__main"><span class="t-body">${a}</span></span>
        <span class="row__meta">${b}</span></button>`).join("")}
  </section>
</main>`,
  foot: foot(`<button class="btn">Ana sayfa</button>`,`<button class="btn btn--fill">Yeni test</button>`),
});

/* ─ 07 · Profil ─ */
export const profil = () => ({
  title: "Profil",
  body: bar("Profil") + `
<main class="body body--fill">
  <section class="section">
    <div class="section__head"><span class="label">Hedefin</span></div>
    ${[["Sınav tarihi","20 Ekim"],["Günlük hedef","10 soru"],["Tema","Sistem"]]
      .map(([a,b])=>`<button class="row"><span class="row__main"><span class="t-body">${a}</span></span>
        <span class="row__meta">${b}</span></button>`).join("")}
  </section>
  <section class="section">
    <div class="section__head"><span class="label">Kayıt</span></div>
    <!-- Levha grafik taşır, metin taşımaz: --on-plane 17px/400'te Lc 72,
         gereken 82.5. Sayı levhanın üstünde değil, YANINDA duruyor. -->
    <div style="display:flex;align-items:center;gap:var(--s-5)">
      <div class="plane" style="flex:0 0 96px;height:96px;display:grid;place-items:center;padding:0">
        <svg viewBox="0 0 96 96" width="96" height="96" role="img" aria-label="Altmış kategorinin otuz yedisine değildi.">
          ${Array.from({length:60},(_,i)=>{const x=8+(i%10)*9, y=8+Math.floor(i/10)*15;
            return `<rect x="${x}" y="${y}" width="6" height="10" rx="1.5"
              fill="${i<37?"#F4F7FB":"none"}" stroke="#0D1116" stroke-opacity="${i<37?0:.45}" stroke-width="1.2"/>`;}).join("")}
        </svg>
      </div>
      <p class="t-body quiet" style="flex:1 1 auto">241 sorunun 87&rsquo;siyle karşılaştın.
        60 kategoriden 37&rsquo;sine değdin.</p>
    </div>
    <p class="t-body quiet" style="margin-top:var(--s-4)">
      Kategori başına dört soru var; bu, bir kategori için &ldquo;zayıfsın&rdquo; demeye yetmiyor.
      Sıralama var, iddia yok.</p>
  </section>
</main>`,
  foot: foot(`<button class="btn">Yedek al</button>`),
});
