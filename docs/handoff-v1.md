# English Prep — v1 handoff

Durum belgesi, 8 Ekim 2026, **v0.76** (`test` dalı). Bu belge uygulamayı
devralacak kişiye (sahibi, bir sonraki Claude oturumu ya da bir geliştirici)
"şu an ne var, nasıl çalışıyor, v1'e ne kaldı" sorularının tek yerden cevabını
verir. Ayrıntılar bağlantılı belgelerdedir; çelişki olursa **CLAUDE.md** ve
bağlantı verdiği güncel tasarım belgeleri geçerlidir.

> Sürüm notu: `x.y` düzeninde `x` yalnızca sahibin kararıyla `1` olur.
> Bu belge "v1'e hazırlık" durumunu anlatır; v1.0 ilan etmez.

---

## 1 · Ürün tek paragrafta

Türk üniversitelerinin hazırlık yeterlik sınavlarına (YTÜ İYS tarzı, Bilkent
benzeri) hazırlanan, **İngilizcesi kulaktan gelmiş ama akademik iskeleti
olmayan** öğrenciler için statik, mobil öncelikli bir web uygulaması.
İki içerik modu vardır: **Eğitim** (makale biçiminde, her biri bir "X vs Y"
ayrımını anlatan 60 ders) ve **Test** (241 açıklamalı soru, anında geri
bildirim, yanlış defteri). Bunlara ek olarak başlıktan açılan **Profil**
(kimlik, istatistik, ayarlar, yedekleme) ve `/about/` tanıtım sayfası vardır.
Hesap, sunucu ve analitik yoktur; her şey öğrencinin tarayıcısında
(`localStorage`) saklanır. GitHub Pages'ten `test` dalı yayınlanır.

| | |
| --- | --- |
| Konular / dersler / sorular | 10 / 60 / 241 |
| Birim testleri | 247 (node:test), hepsi yeşil |
| Tarayıcı taraması (`npm run verify`) | ~3.600 kontrol, 4 genişlik, hepsi yeşil |
| Tarayıcı senaryo testleri (`tests/*_browser.py` vb.) | 17 dosya, Playwright (Python) |
| Çalışma zamanı bağımlılığı | 0 (derleme adımı yok) |

## 2 · Dallar ve yayın

| Dal | Rolü | Kim push'lar |
| --- | --- | --- |
| `test` | **Canlı site.** GitHub Pages bunu yayınlar. Tüm geliştirme burada. | Doğrulanmış işler doğrudan |
| `main` | **Sahibin sürüm dalı.** Yalnızca sahibin "v1" ve sonrası dediği tam sürümler, **elle**. | Sadece sahip |

- Şu an `main`'de 2 Eylül MVP'si ile iki README/görsel commit'i duruyor. Bu
  iki commit'teki README ve `docs/github/` dosyaları `test`'te birebir aynı,
  yani `main`'e yanlışlıkla bir uygulama kodu gitmemiş. Sahip v1'i
  çıkardığında `main`'i `test`'in o anki hâline elle getirecek.
- **Silinmesi gereken eski dallar** (3 Eylül, tamamen eskimiş; hiçbiri
  `test`'e birleşmedi ama içerikleri v0.11 ve öncesine ait):
  `claude/english-exam-app-6i99cu`, `claude/v0-6-egitim-rewrite`,
  `claude/egitim-plani-ders-materyali-7opaiz`. Oturumun git vekili uzak dal
  silmeye izin vermediği için bunu sahip GitHub'da yapar:
  *Repo → Branches → her birinin yanındaki çöp kutusu.*
- Push öncesi zorunlu: `npm run check`. Ekrana dokunan her değişiklikte
  ayrıca `npm run serve` + `npm run verify`.
- `sw.js` içindeki `VERSION` her sürümde artırılır; artırılmazsa telefonlar
  eski önbelleği kullanmaya devam eder.

## 3 · Mimari

Saf HTML/CSS/ES modülleri, olduğu gibi servis edilir. `innerHTML` hiç
kullanılmaz; içerik JSON'dan gelir ve düğüm kurularak (`js/dom.js`)
yazılır. İçerik eklemek hiçbir zaman JavaScript değiştirmeyi gerektirmez.

```
index.html  quiz.html  results.html  about/index.html    dört giriş belgesi
js/home.js            hash yönlendirici (#egitim, #test, #profil, #hosgeldin…)
js/education.js       ders dizini, konu sayfası, ders okuyucu (1.8k satır)
js/quiz.js            test ekranı      js/results.js   sonuç ekranı
js/profile.js         Profil           js/onboarding.js isteğe bağlı tanıtım
js/storage.js         localStorage: geçmiş, ilerleme, ayarlar, yedek (1.2k)
js/interactions.js    hareket motoru: yaylar, girişler, basma/bırakma
js/motion.js          hareket tercihi, aura, belgeler arası geçiş
js/shell.js           bar, kaydırma alanı, eylem çubuğu, canlı bölge
css/style.css         tokenlar + katmanlı temel (@layer)
css/editorial.css     güncel görünüm katmanı (katmansız, style.css'i ezer)
css/interactions.css  hareket ve kontrol sunumu
data/<konu>/*.json    içerik; data/manifest.json dizin
tools/                doğrulayıcı, renk ölçümü, tarayıcı taraması, içerik araçları
```

Tasarımın bağlayıcı belgeleri: `docs/design-system.md`,
`docs/margin-design-system.md`, ADR'ler (`docs/adr/`). Renkler gözle seçilmez;
`npm run color` her token'ı WCAG 2 + APCA'ya göre ölçer ve CI'da çalışır.

## 4 · Bu turda yapılanlar (v0.76)

**Hareket sistemi baştan tasarlandı.**
[motion-v076](design/motion-v076.md) · [ADR 014](adr/014-choreographed-entrances.md)

- *Kök neden:* v0.72'den beri her ekran önce son hâliyle çiziliyor, birkaç
  kare sonra 12px kaydırılıp geri getiriliyordu ("belir → seğir → otur").
- *Şimdi:* giriş animasyonu DOM ile aynı görevde, ilk kareden başlıyor.
  Her ekranda tek bir hareket yönü var: sekmeler yana, alt sayfalar yukarı
  açılıyor; soru metni kayarak, şıklar yerinde belirerek geliyor. Gerçek yay fiziği CSS
  `linear()` eğrisine örneklenip kullanılıyor. Bir kademede en fazla 8 parça
  olabiliyor ve kademe en fazla 220ms içine yayılıyor.
- *Cevap anı:* yanlış şık bir kez sarsılıyor, doğru şık öne çıkıyor,
  açıklama yükseliyor. Sayfa şıkları ekranda tutarak yalnızca açıklamanın
  başını gösterecek kadar yumuşakça kayıyor. Eskiden açıklamaya sert bir
  atlama vardı ve şıklar kayboluyordu.
- *Sonuç ekranı:* çubuk oranına kadar doluyor, imza çiziliyor; skor ilk
  kareden itibaren doğru değeri gösteriyor.
- *Sayfalar arası:* aura her sayfanın HTML'inde bulunuyor ve tek bir
  saatle çalışıyor. Böylece açılıştaki siyah flaş gitti ve renkler sayfa
  değişince kesintisiz sürüyor.
- *Korunanlar:* basma/bırakma tepkisi, kaydırma rayı, aura paleti,
  onboarding çizimleri, About folyosu, hareket anahtarı ve azaltılmış
  hareket desteği.

**Düzeltilen hatalar** (iki ayrı denetim ajanı + elle doğrulama):

1. "Önce kendin düşün" açıkken ya da bir şık odaktayken 1–4 tuşları
   çalışmıyordu.
2. Yedekten geri yüklenen ad, sayfa yenilenene kadar başlıkta görünmüyordu.
3. Testten geri dönüldüğünde, tarayıcının önbelleğinden (bfcache, iOS
   Safari'de sık) gelen ana sayfa eski sayıları gösteriyordu.
4. Tarihi okunamayan eski/içe aktarılmış yanlışlar yanlış defterine
   girmiyordu.
5. Profil'deki geri yükleme durum satırı yanlış öğeye yazılabilirdi
   (kırılgan seçici).
6. Quiz'de cevaptan sonra "Bitir" düğmesi telefonda çıplak bir ✓ olarak
   görünüyor ve "doğru" işareti gibi okunuyordu; artık × kullanılıyor.
7. Onboarding'de "devam" düğmesi sayfadan sayfaya yer değiştiriyordu; artık
   sabit. Tekrarlanan dipnot da kaldırıldı.
8. Diğer görsel düzeltmeler: hata bildirme bağlantısı metin hizasına
   getirildi, sonuç ekranındaki fazla boşluk kapatıldı, Profil'deki simgesiz
   "Yedekten geri yükle" düğmesine simge eklendi.

## 5 · Bilinen açıklar ve doğrulanmamış şeyler

- **Fiziksel cihaz doğrulaması yok.** Bütün testler Chromium'da yapıldı.
  iPhone Safari'de `linear()` yaylar (iOS 17.2+) ve araç çubuğu davranışı
  gerçek telefonda denenmeli. Desteklemeyen tarayıcılar klasik bir eğri alır,
  işlev kaybı yoktur.
- Masaüstünde yüzen sekme kapsülü durağan hâlde sağ sütundaki son satırın
  üstüne biniyor. Kaydırınca açılıyor; tasarım gereği cam, ama portfolyo
  ekran görüntülerinde dikkat çekebilir.
- Kaydırma rayı izi ekranın orta üçte birini kaplıyor; sayfa başında başparmak
  ekranın ortasında duruyor (v0.73 tasarımı, değiştirilmedi).
- Onboarding'in 3. sayfası telefonda altta geniş bir boşluk bırakıyor.
- Açık tema yalnızca Profil'den seçilince ya da "Sistem" seçiliyken
  uygulanıyor; ilk ziyaret her zaman koyu. CLAUDE.md'deki "telefonu izler"
  ifadesi eskimiş.
- Ders başlığı telefon barında kesiliyor ("Present Simple vs Present Con…");
  bu bilinçli bir tek satır kuralı.

## 6 · v1'e kalanlar

İki ayrı "v1" anlamı var; ikisini karıştırmamak gerekir.

**A. Portfolyo v1 (sunulabilirlik) — bu tur büyük ölçüde tamamlandı.**
Geriye kalanlar:

1. Gerçek iPhone ve Android'de hareket ve geçişlerin elle kontrolü.
2. `docs/github/` altındaki portfolyo görsellerinin yeni hareketlerle
   yeniden çekilmesi (`tools/capture-portfolio.py`, `docs/github/capture.py`).
   Mevcut GIF'ler v0.73 hareketlerini gösteriyor. `folio.gif` ve README'deki About anlatımı v0.77'de sıfırdan yapılan About sayfasından önceye ait; yeni sayfa (mercek, harita, soru anatomisi) çekilmeli.
3. Eski dalların silinmesi (§2).

**B. Ürün v1 (`docs/app1-final.md` tanımı).** Bu tanıma göre v1, yeterlik
sınavının 1. oturumunun (60 puan) tamamının çalışılabilir olmasıdır.
Bugün kapsam **30/60**:

| Kalan iş | Not | Tahmini maliyet |
| --- | --- | --- |
| `so / such` cloze kategorisi | Boşluk 7 hâlâ var olmayan bir konu kimliğini gösteriyor (A1/A2) | ~yarım gün |
| Paragraf tamamlama | Yeni madde tipi + 24 soru (Block B) | ~1 gün kod + ~48 saat içerik |
| Okuma bölümü | En büyük bölüm (21 puan): iki metin, metin başına 7 soru; motorun en invaziv değişikliği (Block C) | 1–2 gün kod + 25–35 saat içerik |
| Hata inceleme ekranı | Block D1 | ~2 akşam |
| İnsan çözüm turu | `npm run solve` ile 241 maddenin hiçbiri henüz soğuk çözülmedi; `docs/audit/solve-log.json` yok | 3–28 saat |

Bu kapsamın sahibi sahiptir. `app1-final.md` §7'deki "karar verildi, yeniden
açılmayacak" listesi geçerlidir.

## 7 · Refaktör haritası (önerilen sıra)

Davranış değişmeden yapılacak işler. Her adım `check` + `verify` + Python
tarayıcı testleriyle doğrulanır.

1. **Ölü kodu silmek (düşük risk).**
   - JS: kullanılmayan `js/celebrate.js`; `widgets.js` içinde `ring`,
     `monogram`, `initialsOf`, `choices`, `countUp`, `motionWelcome`; `backup-ui.js`
     `downloadBackup`; `topics.js` `loadRoadmap` ve `data/roadmap.json`;
     `storage.js` `getTopicTotals`, `getCategoryTotals`,
     `getLastActivity`.
   - CSS: `.ring*`, `.choice*`, `.onboard__orb/__steps/__preview*`,
     `.onboard__panel--enter`, `.section-head`, `.formula`; kullanılmayan
     tokenlar `--d-exit`, `--d-view`, `--ease-in`, `--s-10`.
   - Fontlar: `css/fonts.css` ve Source Sans/Serif dosyaları hiç
     kullanılmıyor (Inter geçerli), ama üç sayfa da hâlâ yüklüyor.
   - `sw.js` listesi de güncellenmeli.
2. **CSS katmanlarını birleştirmek (en büyük kazanç, orta–yüksek risk).**
   - *Sorun:* yalnızca `style.css` `@layer` kullanıyor. Katmansız
     `editorial.css` ve beş küçük dosya, `style.css`'in her katmanını
     özgüllükten bağımsız eziyor; 135 seçici iki dosyada birden tanımlı.
   - *Hedef:* tek katman sırası, yani
     `tokens, reset, layout, components, screens, skin, motion, chrome, utilities`.
     Ardından ezilen eski kurallar silinir ve tek bir token kaynağı kalır.
     Bugün `tools/palette.mjs` hiç görünmeyen `style.css` tokenlarını da
     ölçüyor.
   - *Kısıt:* `/about/` sayfası `style.css` olmadan çalışıyor; kendi başına
     yeterli kalmalı.
3. **`storage.js`'i bölmek (düşük–orta risk).** Hedef dosyalar: `kv`,
   `history`, `stats` (yanlış defteri ve istatistikler; saf fonksiyonlar),
   `lesson-progress`, `settings`, `transfer`, `dormant`. `storage.js`
   yeniden dışa aktaran bir dosya olarak kalırsa içe aktaranlar değişmez.
4. **`education.js`'i bölmek (orta risk).** Hedef dosyalar: state/navigation,
   dizin, konu sayfası, blok çizicileri, okuyucu.
5. **Hareket kodunu toplamak.** `interactions.js` üçe ayrılır: basma
   geri bildirimi, ön ayarlar ve yaylar, kompozisyon. Aura ayrı bir
   `atmosphere.js` dosyasına taşınır. Süreler bugün üç yerde tanımlı
   (`MOTION_DURATIONS`, `--d-*`, `editorial.css`); tek kaynağa inmeli.
6. **Küçük tekrarlar.**
   - `home.js`'te soru sayısı seçici iki kez kuruluyor.
   - Zayıf kategori listesi `home.js` ile `profile.js`'te ayrı ayrı var.
   - Düz nesne kontrolü iki kez tanımlı.
   - Yedek aktarımı üç dosyaya dağılmış.

## 8 · Nasıl çalıştırılır ve doğrulanır

```bash
npm run check          # biçim + şema + renk + 247 birim testi (CI'da da çalışır)
npm run serve &        # :8000'de statik sunucu
npm run verify         # gerçek Chromium'da ~3.600 kontrol
python3 tests/<ad>.py --browser-path /opt/pw-browsers/chromium-1194/chrome-linux/chrome
                       # senaryo testleri; bazıları kendi sunucusunu sabit
                       # portta açar, bu yüzden aynı anda iki kopya çalıştırmayın
```

Playwright bilerek bağımlılık değildir. Script global kurulumu bulur ya da
`PLAYWRIGHT_PATH` alır. Python testleri için `pip install playwright` gerekir.

## 9 · Okuma sırası

1. `CLAUDE.md`: kurallar, değişmezler, kitle.
2. Bu belge.
3. `docs/design/motion-v076.md` ve `docs/margin-design-system.md`: güncel
   görsel ve hareket dili.
4. `docs/app1-final.md`: ürün planı (kapalı).
5. `docs/agents/README.md`: içerik üretim döngüsü (ayrı oturumlar, kör
   inceleme, kalibrasyon).
