# Numune levhası

2026-09-11. Adım 8. **Uygulama ekranı değil** — malzemenin kendisi,
gerçek boyutta, her birinin yanında ölçümü. `index.html`'i aç:
`npm run serve` → `http://localhost:8000/docs/design/08-numune/`.
Üstteki düğme temayı değiştiriyor. `shots/` içinde yirmi görüntü var
(on numune × iki tema).

Cevaplanmış üç değer buraya gömülü ve artık sorulmuyor: **A1** işaret
H 45, **A2** karanlık zemin sıcak H 70, **A7** sınanan her İngilizce
serif. Levhanın sorduğu dört şey **A3 · A4 · A5 · A6**.

Hiçbir renk uydurma değil: hepsi `07-tasarim-dokumani.md`'de
`tools/color.mjs` ile uygulamanın kendi `PAIRS` tablosuna karşı
çözüldü. `tokens.css` sadece o değerleri taşıyor.

---

## Sorular

### A5 · Tam alan ne kadar geniş olsun? — numune 1

Beş alan, telefon oranında (260 × 562, yani 390 × 844'ün ölçeği).
`measure-screens.py` ile ölçüldü, içerik yokken:

| | olay alanı | doygun | doküman |
|---|---|---|---|
| koyu · tam %15 | 11.1% | 6.7% | dar lob |
| koyu · tam %20 | 17.3% | 10.5% | |
| koyu · tam %25 | 23.5% | 15.0% | dokümandaki |
| koyu · kısık | 8.0% | **3.4%** | 2–5% bandında ✓ |
| koyu · alansız | 0.0% | 0.0% | ✓ |
| açık · tam %15 / %20 / %25 | 12.2 / 15.5 / 20.1% | 0.7 / 1.8 / 4.6% | |

Not: bunlar **boş** alanın ölçümü. Gerçek ekranda üstüne cam panolar,
metin ve işaret geliyor; brief'in girişten istediği ≥%25 olay alanı bu
rakamların üstüne biniyor.

### A6 · Koyu temada beyaza yakın pano gece göz yorar mı? — numune 2

Aynı pano dört opaklıkta, alanın en parlak ucunun üstünde. Altındaki Lc
sayıları tint'i alanın 1. ve 5. durağına bindirip mürekkebi en kötü
sonuca karşı ölçerek bulundu:

| α | koyu | açık |
|---|---|---|
| 0.55 | Lc 93 ✓ | **Lc 82 ✗** |
| 0.70 | Lc 95 ✓ | Lc 89 ✓ |
| **0.78** | **Lc 95 ✓** | **Lc 92 ✓** |
| 0.90 | Lc 96 ✓ | Lc 96 ✓ |

Kural α ≥ 0.78 bu yüzden. Soru sayılarda değil: **telefonda, gece,
karanlık odada** geniş bir açık yüzey rahatsız ediyor mu? Krem zemini
doğuran şikâyet tam buydu.

### A4 · Kontrol yarıçapı düz yay olarak yaşıyor mu? — numune 3

Aynı nesne üç oranda, artı yay/süperelips karşılaştırması.
`corner-shape` sadece Chromium'da (~%65, Baseline değil), yani tasarım
yay sürümü olmak zorunda. 0.16'da yayın teğette bıraktığı kırık
görünüyor mu, yoksa 0.12'ye mi çekmeli?

### A3 · Eylem boyalı mı, düzlem mi? — numune 6

| | etiket | gerekçe |
|---|---|---|
| **boyalı** `#C35000` / `#FFA401` | Lc 77 / 65 | camdan bir ekranda tek opak ve doygun nesne olmak onu *eylem* yapar |
| düzlem `#241E18` / `#ECE7E1` | Lc 97 / 92 | kontrastta yirmi Lc önde, ama "bir pano daha" gibi okunabilir |

---

## Numuneler

| # | numune | neyi çözüyor |
|---|---|---|
| 1 | alan üç seviyede, telefon oranında | §2.1 · **A5** |
| 2 | cam dört opaklıkta, alanın parlak ucunda | §2.2 · **A6** |
| 3 | yarıçap 0.056 / 0.09 / 0.16, yay ve süperelips | §5 · **A4** |
| 4 | aynı soru üç tip kurulumuyla | §6 · A7 [K] |
| 5 | aynı pano dört köşeden aydınlatılmış | §7 |
| 6 | eylem boyalı ve düzlem olarak | §2.3 · **A3** |
| 7 | doku üç yoğunlukta, artı tarama | §9 |
| 8 | basış · geliş · hüküm | §8 |
| 9 | bileşenler dinlenme hâlinde | §11 |
| 10 | aynı nesne on durumda | §13 |

## Bu levhada görünen ve dokümanda yazan şeyler

- **Renk ışıktır**: panolar camdan, renk arkalarındaki alandan geliyor.
  Hiçbir panonun üstü boyalı değil.
- **Ekran başına tek dolu eylem** — numune 9'da liste, çip, kutucuk,
  istatistik var ve sadece bir boyalı buton.
- **Hüküm kutu doldurmuyor**: sol kenarda 4px işaret ve 2px çerçeve,
  öğretmenin kalemi gibi (numune 9 ve 10).
- **Konteynerin etrafında çizgi yok, satır arasında var** (numune 9).
- **Serif sadece sınanan İngilizce'de**, Türkçe her şey sans (numune 4).
- **Tarama "henüz ölçülmedi" demek**, sıfır demek değil (numune 7, 10).
- **Hareket ışığı değiştiriyor**: doğru cevapta kenar yanıyor, kutu
  şişmiyor (numune 8).

## Bundan sonra

A3, A4, A5, A6 cevaplanınca adım 9 araç setini kurar (jetonlar,
`docs/components.html` katalogu, `PAIRS`'e eklenen satırlar), adım 10
uygulamaya taşır. Uygulamaya o ana kadar hiçbir şey girmiyor —
`css/style.css` ve `js/` el değmeden duruyor.
