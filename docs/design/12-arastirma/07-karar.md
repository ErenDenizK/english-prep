# Karar

Altı kol döndü. Bu belge `00-olcutler.md`'nin K1–K5 kapılarına göre
yazıldı ve sahibinin iki canlı sorusunu cevaplıyor.

**Kısa cevap:**

1. **Tasarım sistemi neyden yapılmalı?** Sahip olduğumuzdan. Yığın
   alınmayacak. Değişecek olan üç ölçülmüş değer: yüzey merdiveni üç
   kademeden beşe ve ara ton bandına, hareket dokuz jetona ve üç
   animasyona, tip ölçeğinin alt ucu 15'ten 17'ye.
2. **"Build step yok, sıfır bağımlılık" terk edilmeli mi?** **Hayır** —
   ve React özelinde bu bir tercih değil, ölçülmüş bir imkânsızlık.
   Derleme adımı ayrı bir soru, cevabı "evet ama şimdi değil".

---

## 1 · Teknoloji

### React, sorulduğu haliyle, mümkün değil

Sahip *"gerekirse css yerine react gibi daha gelişmiş bir yapı"* dedi.
npm'in gönderdiği üretim dosyalarını kendim ölçtüm:

| | gzip |
|---|---:|
| `react-dom-client.production.js`, **npm'in gönderdiği hali** | **110.5 KB** |
| aynısı esbuild ile minify | 63.5 KB |
| `react.production.js` minify | 3.1 KB |
| **bütün uygulamamız**, bundle + minify | **24.5 KB** |
| Preact 10 + hooks | 5.3 KB |

npm'in yayınladığı React üretim derlemesi **whitespace-minify
edilmemiş**. Yani React'i derleme adımı olmadan kullanmak ~115 KB gz
demek — bugün gönderdiğimiz her şeyden kötü. **React ile "build step
yok" bir arada duramıyor.** Derleme adımıyla da uygulamanın 2.7 katı
bir çerçeve taşınıyor.

**K5'te düşüyor** (tek kişilik bakım): derleme adımı + `node_modules`
tedarik zinciri + Pages Actions dağıtımı, canlı bir dalda, sınavdan
haftalar önce.

### Yardımcı çerçeveler ve stil araçları

| seçenek | düştüğü kapı | sebep, ölçülmüş |
|---|---|---|
| Tailwind v4 / Panda / StyleX | **K2** | `PAIRS` tablosu "hangi mürekkep, hangi punto, hangi zemin" diye elle tutulan bir liste. Utility CSS bunu kuralın değil markup'ın kombinatoryal özelliği yapıyor: tablo yazılamıyor, `npm run color` koşamıyor. Bu projede paletin var olma sebebini siler. |
| `@tailwindcss/browser` (tek derlemesizi) | K2 + bayt | 73.5 KB gz JavaScript — uygulamanın bütün JS yükünün %75'i, çalışma zamanında CSS üretmek için |
| htmx | **K1** | Sunucudan HTML parçası ister; GitHub Pages'te sunucu yok. Takas mekanizması `innerHTML`'in kendisi. |
| Alpine | K1 | `new Function` kullanıyor (`unsafe-eval` ya da ayrı CSP derlemesi); modeli sunucu HTML'ine serpiştirme, bizde o HTML yok |
| Radix / Headless UI / Ark / Base UI | **K5** | Radix Select 30.7 KB gz, `js/listbox.js` 1.26 KB — **24 kat**. Radix Dialog 13.3 KB, `js/modal.js` 0.26 KB — **52 kat**. Çerçevesiz Zag'ın vanilla dialog'u bile 19.8 KB. Hiçbiri bu ölçekte kendini ödemiyor. |
| DTCG JSON + Style Dictionary | K2 + K5 | DTCG'de `need: { lc: 90, wcag: 7.0 }` için yer yok — ki `palette.mjs`'in var olma sebebi tam olarak o. Style Dictionary kurulumu ölçüldü: 106 paket / 62 MB, sıfır bağımlılıklı bir depoya. |

### Derleme adımı: ayrı soru, ve cevabı "evet, ama sonra"

Çerçeve olmadan sadece minify eden bir adım ölçülebilir kazanç veriyor:

- `home.js` girişi **87.0 → 24.5 KB gz** (−%72)
- ilk ziyaret **164.5 → ~96 KB**, 31 istek → ~5
- `sw.js`'in elle tutulan 31 kalemlik `SHELL` listesi üretilir hale gelir

Bu, React'in tarttığından fazlasını kesiyor ve çalışma zamanı maliyeti
sıfır. Ama **şimdi yapılmayacak**, üç sebeple:

1. `test` canlı ve dağıtım bugün `git push`. Pages Actions'a geçmek
   dağıtım yolunu değiştirir — `CLAUDE.md`'nin *"kötü bir push sınavdan
   önceki gece bir öğrenciye ulaşır"* uyarısının tam hedefi.
2. `dist/` **asla `test`'e commit edilmemeli**; commit edilirse
   `CLAUDE.md`'nin içerik biçimlendirmesi için yazdığı "dört yüz
   satırlık diff" sorunu kod katmanında tekrarlanır.
3. Sahibin şikâyeti performans değildi, **"yavan"dı**. Minify onu
   düzeltmez.

Sınavdan sonraki turun ilk maddesi. `tools/verify-ui.mjs` sayfa içinde
`/js/storage.js` import ettiği için `npm run serve` kaynağı sunmaya
devam etmeli; tarama kaynağa, ikinci kısa bir duman testi `dist/`'e
koşar.

### Çerçeve karar kuralı — dördü birden doğru olmadan alınmaz

1. Beşten fazla `replaceWith`/yeniden-kurma yeri kaydırma, odak veya
   animasyon durumunu korumak zorunda. **Bugün: bir**
   (`js/education.js:1409`, 320px'te 162px kayma).
   Denetim: `grep -c replaceWith js/*.js`
2. Üçten fazla modüller arası durum bağı. **Bugün: bir**
   (`profile:namechange`). Denetim: `grep -rn CustomEvent js/`
3. Çalışma zamanı <10 KB gz **ve** 6× yavaşlatmada <15 ms.
4. Bundler'sız vendor edilebilir, yani `git push` dağıtım olarak kalır.

React 3 ve 4'te düşüyor ve 1 ile 2 doğru olsa bile düşmeye devam eder.
**Preact + htm** (5.3 KB, 6.6 ms) 3 ve 4'ü geçiyor, 1 ile 2'yi
bekliyor — çerçeve günü gelirse alınacak olan o.

---

## 2 · Tasarım sistemi

### Neden "yavan" — üç sayı, ve üçünün de tek bir sebebi

`00-v4-olcumu.md`'de ölçüldü:

| | v4 | sahibin beş referansı |
|---|---:|---:|
| olay alanı (ortanca) | 10.3% | 21.9% |
| ara ton nüfusu (CIE L\* 0.30–0.70) | **2.2%** | **18.4%** |
| ölçülebilir renk ailesi | 9 ekranın 8'inde yok | 5'in 4'ünde var |

Ve sebebi **mürekkebin kendisi.** Bugünkü `--c-text-1` OKLCH L 0.941
(`#E9ECEF`). Lc 90 + WCAG 7 şartıyla, bu mürekkep metin taşıyan en
yüksek yüzeyi **CIE L\* 19.7**'ye kilitliyor — bugünkü en açık
yüzeyimiz zaten L\* 17.3. Yani merdivenin tavanı yok değil, mürekkep
onu kendi üstüne kapatmış:

```
ink L 0.941 #E9ECEF  ->  en yüksek metin taşıyan yüzey  CIE L* 19.7
ink L 0.960 #EFF2F6  ->                                 CIE L* 26.0
ink L 0.975 #F4F7FB  ->                                 CIE L* 30.4
ink L 0.990 #F9FCFF  ->                                 CIE L* 34.3
```

Ara ton bandı L\* 30'da başlıyor. **Mürekkebi 0.941'den 0.975'e almak,
bütün merdiveni ara ton bandına açıyor** — ve hiçbir erişilebilirlik
bedeli yok, çünkü Lc 90 ve WCAG 7 hâlâ sağlanıyor.

Bunun ötesi de ölçülü: nötr bir yüzeyde **L\* 49.5 ile 81.5 arası hiçbir
metni taşımıyor** (32 puan geniş). Oraya ancak metinsiz alan gider —
bant, şerit, görsel, halka, karşı düzlem.

### Çözülen merdiven

Üç kademe yerine beş, Radix'in kroma çanıyla (uçlarda düşük, ortada
yüksek — bugün C 0.014'te düz):

| jeton | OKLCH | hex | CIE L\* |
|---|---|---|---:|
| `surface-0` (sayfa) | `L 0.175 C 0.012 H 255` | `#0D1116` | 4.9 |
| `surface-1` | `L 0.235 C 0.016 H 255` | `#191F26` | 11.5 |
| `surface-2` | `L 0.295 C 0.018 H 255` | `#272D36` | 18.3 |
| `surface-3` | `L 0.360 C 0.016 H 255` | `#383E46` | 25.9 |
| `surface-4` | `L 0.400 C 0.012 H 255` | `#43484E` | **30.3** |

En kötü zemin `surface-4`. Mürekkepler ona karşı çözüldü:

| jeton | OKLCH | hex | Lc | WCAG |
|---|---|---|---:|---:|
| `text-1` | `L 0.975 C 0.006 H 255` | `#F4F7FB` | 90 | 8.59 |
| `text-2` | `L 0.905 C 0.010 H 255` | `#DBE0E6` | 75 | 6.95 |
| `text-3` | `L 0.827 C 0.012 H 255` | `#C1C7CE` | 60 | 5.42 |

Aksan, ok, no, focus jetonlarının hepsi `surface-4` üzerinde 3:1'i
geçiyor (4.85 / 4.83 / 3.25 / 6.82).

**Bir sınır çıktı ve kural oluyor:** `accent-text` bugünkü kromasıyla
(C 0.085) `surface-4` üzerinde **çözümsüz**; C 0.070'e inince çözülüyor
ama kehribar solmuş oluyor. `surface-2` üzerinde ise C 0.085 ile L
0.867'de çözülüyor. Dolayısıyla: **kehribar metin sayfa ve alt iki
kademe içindir; yükseltilmiş düzlemler yalnız nötr mürekkep taşır.**
"Bir aksan bir iş yapar" kuralının ölçülmüş sınırı.

### Hareket — dokuz jeton, üç animasyon, sıfır yay

Bugünkü `--spring-bouncy` ζ 0.558, **779 ms**, %12 aşım, ve sekme
göstergesine bağlı — uygulamanın en sık dokunulan öğesi. M3
Expressive'in *en zıpzıp* jetonu 360 ms / %9.5. Sekiz kademeli stagger
son satırı ekrana **756 ms** sonra koyuyor. Hareket bütçesi sıklıkla
ters orantılı harcanmış.

Yayın bir bézier'de olmayan tek özelliği kesinti altında hız
sürekliliği. Bu uygulamada jest yok ve uçuş sırasında geri alınan
hiçbir şey yok — yani yaya ihtiyacı yok.

```css
--d-instant:  0ms;    --d-press:  100ms;   --d-state: 160ms;
--d-enter:  220ms;    --d-exit:   140ms;   --d-screen: 180ms;
--ease-out:      cubic-bezier(0, 0, 0, 1);
--ease-standard: cubic-bezier(0.2, 0, 0, 1);
--ease-in:       cubic-bezier(0.3, 0, 1, 1);
```

Üç animasyon: **renk-only basış**, **hareketsiz verdict**, **opacity-only
ekran geçişi**. Verdict'in hareketsiz olması bir zevk tercihi değil:
etki büyüklüğü açıklamada (ayrıntılı geri bildirim g ≈ 0.49'a karşı
sadece doğru/yanlış 0.05), yani açıklama ilk kareden itibaren okunabilir
olmalı. Yükselen, ölçeklenen, sallanan bir blok tam da en değerli
kısmı geciktiriyor.

Reddedilenler, adıyla: konfeti, shake, pop, stagger, aşımın tamamı,
scale ile basış, 700 ms count-up, nefes alan orb, kaydırmayla sürülen
animasyon, iskelet yükleme.

### Tip — tek zorunlu değişiklik alt uçta

APCA'nın font matrisi referans fonta (Helvetica/Arial) endeksli ve APCA
kendi x-yüksekliği düzeltmesini yayınlıyor. x-yüksekliklerini
`fontTools` ile font dosyalarından kendim ölçtüm:

| font | x/em | düzeltme oranı |
|---|---:|---:|
| Liberation Sans (Arial metrik eşi) | 0.5283 | — |
| Source Sans 3 400 | 0.4860 | 1.0871 |
| Source Sans 3 600 | 0.4910 | **1.0760** |
| Source Serif 4 | 0.4750 | 1.1123 |

Düzeltme uygulanınca 15px/600 katmanı gereken Lc'yi tutturamıyor: 15px
Source Sans 3 600, referans fontta **13.9px** gibi davranıyor. Gereken
punto **16.1px**, yani ölçek **15 → 17**.

Ve bu, sahibin kendi eski geri bildirimiyle aynı yöne bakıyor: iş #54,
*"Hiyerarşi ve küçük punto"*.

Önerilen ölçek: **36/44 · 28/36 · 22/28 · 18/28 · 17/24**. İki satır
yüksekliği artışı da ölçülmüş: 36/40'ta Türkçe aksanlarla bir satırın
alt uzantıları ile sonraki satırın mürekkebi arasında **0px** kalıyor
(İngilizcede 6px); 28/32'de 1px (İngilizcede 5px).

Bir düzeltme daha: `--w-measure: 65ch` Türkçede satır başına **81
karakter** veriyor — WCAG 1.4.8'in 80 tavanının üstünde. Sebep her iki
ailenin de tabular rakam varsayması: `0` ortalama harften %22–25 geniş.
Aile başına iki jeton gerekiyor.

### Bileşenler

`role="group"` düzeltmesi bu turda çıktı ve **zaten gönderildi**
(v0.63). Kalanlar:

- Ürünün kendisinden türetilmiş **14 anlamsal bileşen**, okuma parçası
  ve süreli deneme dahil. İkisi de APG widget'ı değil: okuma parçası
  bir belge-yapısı problemi, sınav sayacı bir durum mesajı, canlı bir
  tıklayıcı değil. B/C bloklarının şema işi başlamadan önce
  spesifikasyonları yazılmalı.
- §8.1'e iki eksik: 24×24 için **geometrik test** ("hedefin tamamen
  içine eksen hizalı 24×24 kare çizilebiliyor mu") ve yuvarlak köşe
  başarısızlık örneği. Bu uygulamanın düğmeleri hap şeklinde, yani
  maruziyeti tam orada.
- `--c-focus` tek jeton ve `--page`, `--card`, `--raised` üzerinde
  ayrı ayrı 3:1 tutmak zorunda; `PAIRS`'te bu satırların varlığı
  denetlenecek.

### Reddedilen dil: Duolingo

Altı kanıt hattıyla, zevkle değil. En bağlayıcısı: **yenilik etkisinin
sönme penceresi (~4. haftadan itibaren, 2–6 hafta) tam bizim altı
haftalık ürün ömrümüz** — oyunlaştırma katmanı en zayıf olacağı anda
sınav haftasına denk geliyor. Üstüne: dış motivasyon zaten büyük ve
ödüller onu *zayıflatıyor* (d = −0.28…−0.40); Sailer & Homner'ın pozitif
meta-analitik etkisini taşıyan üç şeyin (oyun kurgusu, sosyal
etkileşim, küçük çocuklar) üçü de bizde yok; ve `CLAUDE.md`'nin
"etiketsiz yetkinlik" öğrencisi oyuncağa güvenini kaybeder.

Ve kategorinin görsel lehçesi pedagojinin değil **iş modelinin**
altında: DAU ile fonlanan ürünler (Duolingo, Memrise, Quizlet) gürültülü;
sonuçla fonlananlar (Babbel, UWorld, Anki, Mochi) ağırbaşlı. Hesap yok,
sunucu yok, analitik yok, altı hafta — yapısal olarak ikinci gruptayız
ve birinci grup gibi giydirilmişiz. **Altı turda ilk kez, ağırbaşlı
yönün lehine zevk olmayan bir argüman var.**

---

## 3 · Kolların düzelttiğim üç iddiası

Ajanlar sorgusuz kabul edilmiyor; üçünde ölçüm farklı çıktı.

1. **`.onboard__orb` "kontrolsüz" değil.** 04 kolu `4s … infinite`
   animasyonun kontrolü olmadığını ve SC 2.2.2 (Seviye A) sınırında
   olduğunu söyledi. Kural `css/style.css:1937` ve
   `@media (prefers-reduced-motion: no-preference)` bloğunun **içinde**
   (1887–1945). Az hareket isteyen kullanıcıda hiç başlamıyor. Kod
   değişikliği gerekmiyor.
2. **x-yüksekliği oranı 600 ağırlığında farklı.** 03 kolu bütün aile
   için 400'ün değerini (0.486) kullandı; 600'ünki 0.491, oran 1.086
   değil **1.076**. Yön aynı, 15px'in gerektirdiği punto 16.3 değil
   **16.1**. Sonuç değişmiyor (17'ye çıkıyor), gerekçe düzeliyor.
3. **React'in boyutu alıntı değil ölçüm olmalı.** 02 kolu 57.6 KB
   andı, bir alıntı olduğunu da söyleyerek. npm üretim dosyalarından
   ölçtüm: minify edilmiş 66.6 KB, esbuild bundle 68.8 KB, npm'in
   gönderdiği hali 110.5 KB. Yön aynı, büyüklük daha kötü.

Ve **kendi belgemi** de düzelttim: `00-olcutler.md` ilk halinde "React
ağır argümanı savunulamaz" diyordu; bizim sıkıştırılmamış kaynağımızı
React'in minify edilmiş derlemesiyle karşılaştırmışım. Düzeltildi ve
sonuç tersine döndü.

---

## 4 · Bu turda zaten gönderilenler

Araştırma iki canlı hata buldu, ikisi de doğrulandı ve `test`'e itildi:

- **v0.63** — `--c-edge` 3.12:1 ölçülüyor, 2.89:1 gönderiliyordu.
  WCAG 2.2 SC 1.4.11 kontrol sınırı. `tools/token-check.mjs` yazıldı:
  stylesheet'teki 62 renk bildiriminin hepsini spec'le karşılaştırıyor,
  sıfır bağımlılık, `npm run color`'ın ikinci yarısı.
- **`role="radiogroup"` → `role="group"`** — radio sahibi olmayan bir
  radiogroup. Erişilebilirlik ağacı Chromium'da döküldü: `radiogroup` +
  düğme ile `group` + düğme birebir aynı ağaç. Vaat edilen "1 of 4"
  hiç teslim edilmiyordu. Tarama artık bunu yakalıyor.

Her ikisi de `npm run check` ve `npm run verify` (3451 kontrol) ile
doğrulandı.

---

## 5 · Sıradaki

`00-olcutler.md` §6'daki başarı tanımına göre bu belge dört şartın
üçünü karşılıyor: iki soru sayıyla cevaplandı, her reddedilen seçenek
düştüğü kapıyla yazıldı, ve seçilen yaklaşım ölçülen bir eksende
(ara ton nüfusu, mürekkep tavanı) reddedilenlerden ayrılıyor.

Kalan dördüncü şart — *seçilen palet `npm run color`'dan sıfır hatayla
geçiyor* — ancak merdiven `style.css`'e ve `palette.mjs`'e girince
sınanabilir. Sıra o.

1. `palette.mjs`'e beş kademeli merdiven ve yeni mürekkepler; `PAIRS`
   x-yüksekliği düzeltmesiyle yeniden çözülür; `npm run color` sıfır
   hata verene kadar.
2. Tip ölçeği 36/44 · 28/36 · 22/28 · 18/28 · 17/24; ölçü jetonu aile
   başına ikiye ayrılır.
3. Hareket jetonları; üç animasyon; reddedilenler silinir.
4. Ekranlar yeni merdiven üzerinde yeniden kurulur — hedef, ret
   şartları: giriş olay alanı ≥ 20%, en az bir renk ailesi ≥ 1.5%,
   ara ton ≥ 10%.
5. `npm run verify`, `docs/design/measure-screens.py` ve
   `docs/design/midtone.py` ile ölçüm; sayılar tutmadan gösterilmez.
