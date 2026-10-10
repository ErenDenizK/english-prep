# Karar ölçütleri

Bu dosya altı araştırma kolu dönmeden **önce** yazıldı. Sebebi tek:
bulguyu gördükten sonra ölçüt seçilirse, ölçüt değil bahane olur. Kollar
döndüğünde `07-karar.md` bu tablolara göre doldurulacak; bir bulgu
buradaki bir eşiği geçemiyorsa, ne kadar ikna edici yazılmış olursa olsun
geçmemiş sayılır.

Sahibin iki canlı sorusu var:

1. **Tasarım sistemi neyden yapılmalı?** (token mimarisi, renk, tip,
   hareket, bileşen sözleşmesi)
2. **"Build step yok, sıfır bağımlılık" maddesi React için —
   veya bir ara yol için — terk edilmeli mi?**

İkisi ayrı sorular ve ayrı cevaplanacak. Bir tasarım sistemi React
gerektirmez; React de bir tasarım sistemi vermez.

---

## 1. Ölçülen başlangıç durumu

Karar, tahminle değil bu sayılarla verilecek. 2026-09-15, `test` dalı.

### Bugün tarayıcıya giden ağırlık

| Giriş | Modül | Ham | gzip (ayrı dosya) | gzip (birleşik) |
|---|---:|---:|---:|---:|
| `index.html` → `home.js` | 24 | 269.9 KB | ~98.7 KB | **87.0 KB** |
| `quiz.html` → `quiz.js` | 15 | 130.3 KB | ~50.0 KB | 43.5 KB |
| `results.html` → `results.js` | 13 | 119.5 KB | ~39.9 KB | 39.9 KB |

Üstüne her sayfada: `style.css` 51.9 KB ham / **11.8 KB gz**,
`fonts.css` 3.0 KB gz, üç woff2 subset **48.0 KB** (zaten sıkıştırılmış),
`manifest.json` 4.5 KB gz. `data/` toplamı 798 KB ama tamamı hiç
yüklenmez — konu dosyaları istendiğinde gelir.

CSS'in ölçüsü: **110 özel değişken**, 6 katman (`tokens, reset, layout,
components, screens, utilities`), 296 kural bloğu, 15 medya sorgusu.

### Bu sayının öldürdüğünü sandığım argüman — ve düzeltmesi

**Bu bölüm ilk yazıldığında yanlıştı.** Öyle diyordu: *"React ağır, bu
yüzden olmaz" savunulamaz; React 19 + react-dom ~57 KB gz, ana
ekranımız zaten 87 KB gönderiyor, çerçeve uygulamanın kendi kodundan
hafif.* Karşılaştırma adil değildi: **bizim sıkıştırılmamış kaynağımız**
React'in **minify edilmiş üretim derlemesiyle** karşılaştırılmıştı. Kol
05 farklı bir sayı bildirdi; kendim ölçtüm (esbuild 0.28.2,
`--bundle --minify`, `NODE_ENV=production`, `gzip -9`):

| | ham | gzip |
|---|---:|---:|
| `home.js` girişi, bugün gönderildiği gibi (24 ayrı dosya, minify yok) | 269.9 KB | **87.0 KB** |
| aynı kod, bundle + minify | 77.4 KB | **24.5 KB** |
| React 19.3.0 + react-dom/client (üretim) | 222.7 KB | **68.8 KB** |
| Preact 10.29.8 + hooks | 12.8 KB | **5.3 KB** |

Yani doğru cümle şu: **React tek başına, barındıracağı uygulamanın
tamamının 2.8 katı.** Preact ise uygulamanın beşte biri.

Ve asıl bulgu bu tablodan çıkıyor: **derleme adımı sorusu ile çerçeve
sorusu ayrı sorular, ve ödeyen taraf derleme adımı.**

- derleme adımı yok, bugünkü hal: 87.0 KB
- derleme adımı var, çerçeve yok: **24.5 KB** (−%72)
- derleme adımı var, React var: ~93 KB (bugünkünden kötü)
- derleme adımı var, Preact var: ~30 KB

Yani "React ağır" argümanı ölmüş değil; ölçüldüğünde doğru çıktı.
Ama tek başına yeterli de değil, çünkü aynı tablo kendi tembelliğimizi
de gösteriyor: bugün taşıdığımız 87 KB'ın 62 KB'ı yalnızca minify
etmediğimiz için orada.

React'e karşı diğer dürüst argümanlar:

- Derleme adımı, CI, kaynak haritası, `node_modules` tedarik zinciri.
- Bu baytların tamamı **bu uygulamanın kendi mantığı**
  (`education.js` 72.9 KB, `storage.js` 38.4 KB, `home.js` 26.6 KB ham).
  React bunu silmez; üstüne biner. Kazanç ancak yazılan satırda
  aranabilir — bayt tarafında kayıp olduğu artık ölçülü.
- `innerHTML` yasağını React **ihlal etmez** — JSX varsayılan olarak
  kaçışlar — yani bu da React'e karşı bir argüman değil. Doğru soru:
  yasağın var olma sebebi (içerik JSON'dan gelir, düğüm kurulur) React
  altında da aynı güvenceyle duruyor mu.

Kollardan gelen hiçbir teknoloji bulgusu, bu üç maddeden birine
değmiyorsa karar için kullanılmayacak.

---

## 2. Her öneri şu kapılardan geçmek zorunda

Sıra önemli: bir öneri K1'de takılırsa K2'ye bakılmaz.

**K1 — Ürünün fiziği.** 320px'te doğrulanıyor mu; sabit yükseklikli
kabuk, yalnız `.app-content` kayar kuralı duruyor mu; cevaplama anında
öğrencinin dokunacağı düğme yerinden oynamıyor mu. Bu üçü tasarım tercihi
değil, ürünün çalışma koşulu.

**K2 — Ölçülebilirlik.** Önerilen değer bir ölçüye bağlanabiliyor mu?
Renk `npm run color` altında (WCAG 2 **ve** APCA, her iki tema, her boy
eşleşmesi) sıfır hata veriyor mu; ekran `npm run verify` sweep'inden
geçiyor mu. "Güzel duruyor" bir bulgu değil. Bu projede her reddedilen
tur, ölçülemeyen bir gerekçeyle savunulmuştu.

**K3 — Öğrenciye uygunluk.** `CLAUDE.md`'deki öğrenci: kulağı iyi,
etiketi yok. Bir öneri ona sıfırdan öğreten bir ürünün diliyle
konuşuyorsa — rozet, seri, kutlama, "harika iş!" — reddedilir. Bu, altıncı
kolun (rakip analizi) Duolingo bulgularının nereye düşeceğini şimdiden
belirler.

**K4 — Sahibin sekiz turluk reddi.** Yeni öneri, reddedilenlerden hangi
ölçülebilir eksende ayrılıyor? Aynı eksende duruyorsa dokuzuncu kez
reddedilecektir. Bilinen eksenler: olay alanı (%17.5 bizde / %9.8
referansta, girişte %30-67'ye karşı ~%10), karşı düzlem, aksanın ölü
bandı, camın yapı gerektirmesi, palet ton çöküşü.

**K5 — Tek kişilik bakım.** Bu depoyu bir kişi sürdürüyor ve `test` dalı
canlı. Bir öneri, altı ay sonra sahibinin tek başına değiştiremeyeceği bir
şey bırakıyorsa maliyeti yanlış hesaplanmıştır.

---

## 3. Teknoloji kararının eşikleri

Kol 02'nin bulgusu şu tabloya oturtulacak. Sol sütundaki iddia, sağdaki
kanıtla desteklenmiyorsa karar "hayır" tarafında kalır — çünkü mevcut
durum çalışıyor ve değişimin ispat yükü değişimi önerendedir.

| Bırakmak için gereken iddia | Kabul edilecek kanıt | Reddedilecek kanıt |
|---|---|---|
| "Daha az kod yazılır" | `education.js`/`home.js` gibi gerçek bir dosyanın satır sayısında ölçülmüş düşüş | Genel "bileşen modeli daha temiz" |
| "Hata azalır" | Bugün elle yapılan ve çerçevenin garanti ettiği bir sınıf (ör. durum-DOM tutarsızlığı) adıyla gösterilir | "React daha olgun" |
| "Tasarım sistemi ancak böyle olur" | Token'ların çalışma zamanı bağımlılığı gerektirdiği somut bir yer | Tailwind/Panda'nın rahatlığı |
| Maliyet kabul edilebilir | CI'a eklenen süre, `node_modules` boyutu, GitHub Pages yayın akışındaki değişiklik sayıyla | "Bugünlerde herkes yapıyor" |

**Ara yol ayrı değerlendirilecek** (Preact+htm ESM üzerinden, Lit,
web components): bunlar derleme adımı *gerektirmez*, yani `CLAUDE.md`'nin
maddesini kırmadan çerçeve kazancı verebilirler. Ara yol, tam React'ten
farklı bir eşik setine tabi: sadece "K1'i geçiyor ve gerçek bir satır
kazancı var" yeterli.

**Varsayılan cevap hayır.** Sekiz tur reddedilen şey teknoloji değildi,
görseldi. Teknolojiyi değiştirmek, reddedilen şeyi düzeltmez — sadece
düzeltmenin maliyetini artırır. Kol 02 bunu çürütmek zorunda.

---

## 4. Tasarım sistemi kararının eşikleri

Kol 01, 03, 04, 05'in bulguları için:

- **Token mimarisi**: üç katman (ilkel → anlamsal → bileşen) bu ürünün
  110 değişkenine *neyi* ekliyor, adıyla. Yeniden adlandırma tek başına
  kazanç değildir.
- **Renk**: üretilen her rampa `tools/palette.mjs` altında sınanacak.
  Kol 03'ün önerdiği bir rampa `PAIRS` tablosunda tek satır bile
  düşürüyorsa alınmaz. Referans 8'in kendi merdiveninin çözümsüz
  çıkması (`03-research.md`) bunun neden gerekli olduğunun kanıtı.
- **Tip**: öneri, kendi kendine barındırılabilir (`fonts/` 48 KB
  bütçesi), Türkçe aksanlı harfleri (ı İ ğ ş ö ç ü) subset'te taşıyor
  ve `lang` tuzağını bozmuyor olmalı.
- **Hareket**: transform ve opacity dışına çıkan hiçbir şey alınmaz;
  `prefers-reduced-motion` altında çökmeyen hiçbir şey alınmaz. Kol
  04'ün iki anı — cevap geri bildirimi, ekran değişimi — dışındaki
  önerileri ikinci sıraya düşer.
- **Bileşenler**: kol 05'in dört şıklı soru semantiği bulgusu, `verify`
  sweep'inin §8 erişilebilirlik sözleşmesine çevrilebiliyorsa alınır.
  Çevrilemeyen bir ARIA önerisi, sınanamayan bir öneridir.

---

## 5. Kararın dışında olanlar

Kollardan biri bunlara dokunursa bulgu not edilir, karara girmez:

- Sürüm `x` hâlâ `0`. Bu bir asistan kararı değil.
- Gezinme yerleşti: iki içerik sekmesi + başlıkta Profil. Sahibi
  yeniden açmadıkça kapalı.
- Ders kontrolleri ilerlemeyi kilitlemez.
- Okuma sütunu her pencere genişliğinde 608px; geniş yerleşim
  yalnız ekler.
- İçerik veridir: bir konu/ders/soru eklemek JavaScript'e dokunmayı
  gerektirmez.

---

## 6. Bu turun başarı tanımı

Tur, sahibi beğendiği için değil, şunlar doğru olduğu için bitmiş
sayılacak:

1. `07-karar.md` her iki soruyu da **sayıyla** cevaplıyor.
2. Reddedilen her seçenek, hangi kapıda (K1-K5) düştüğü yazılarak
   reddedilmiş.
3. Seçilen palet `npm run color`'dan sıfır hatayla geçiyor.
4. Seçilen yaklaşım, sekiz reddedilen turdan **ölçülen** bir eksende
   ayrılıyor ve o eksen adıyla yazılmış.
