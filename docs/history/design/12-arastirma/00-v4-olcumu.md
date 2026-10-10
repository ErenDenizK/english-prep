# "Yavan" — UI v4'ün ölçümü

Sahibi UI v4'e *"bu tasarım oldukça yavan"* dedi. Bu dosya o cümleyi
sayıya çeviriyor, ve kolların bulguları gelmeden yazıldı: `00-olcutler.md`
K4 kapısı yeni önerinin reddedilenlerden **ölçülen bir eksende** ayrılmasını
şart koşuyor, o eksenin ne olduğu ise ancak v4 ölçülerek bulunabilir.

Yöntem `docs/design/measure-screens.py`, `02-references.md` §2'deki
tanımlarla. Kendi ekran görüntülerimiz inset'siz, referans kırpıkları
`--inset=0.03`.

## v4'ün dokuz ekranı

| ekran | neutral | struct | tonal | conc | counter | ink | event | hues |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| 1 Bugün | 99.5% | 13.7% | 0.93 | 100% | 9.1% | 10.1% | 11.6% | — |
| 2 Konular | 100.0% | 9.6% | 0.27 | 100% | 2.3% | 3.7% | 4.8% | — |
| 3 Konu | 100.0% | 12.8% | 0.91 | 100% | 8.1% | 9.2% | 10.7% | — |
| 4 Ders | 99.9% | 13.7% | 0.92 | 100% | 8.7% | 9.6% | 11.3% | — |
| 5 Soru | 99.9% | 9.0% | 0.13 | 100% | 2.2% | 2.7% | 3.8% | — |
| 6 Cevap | 98.1% | 12.7% | 0.92 | 96% | 7.7% | 8.9% | 10.7% | — |
| 7 Sonuç | 98.7% | 10.8% | 0.92 | 100% | 8.4% | 9.1% | 10.3% | H60:0.8% |
| 8 İlk açılış | 99.9% | 7.6% | 0.92 | 100% | 7.6% | 8.1% | 8.8% | — |
| 9 Deneme | 99.3% | 9.1% | 0.18 | 100% | 1.8% | 2.9% | 4.2% | — |
| **ortanca** | **99.9%** | **10.8%** | **0.92** | **100%** | **7.7%** | **8.9%** | **10.3%** | **yok** |

## Sahibin beş referansı, aynı ölçekte

Onbir referanstan sahibinin işaret ettiği beşi (1, 3, 4, 8, 10):

| ekran | neutral | struct | tonal | conc | counter | ink | event | hues |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| 1 Traffic | 99.6% | 16.0% | 0.63 | 100% | 16.0% | 18.7% | 21.9% | — |
| 3 Log | 72.8% | 13.2% | 0.89 | 72% | 39.8% | 43.7% | 45.2% | H0:9.0% |
| 4 Wallet | 91.6% | 15.2% | 0.90 | 99% | 47.3% | 49.8% | 53.2% | H120:0.6% |
| 8 Midnightreads | 93.1% | 33.2% | 0.58 | 97% | 10.2% | 9.6% | 16.4% | H60:1.7% |
| 10 Wearable | 91.1% | 5.6% | 0.36 | 100% | 2.7% | 7.7% | 20.5% | H300:3.5%, H90:1.2% |
| **ortanca** | **91.6%** | **15.2%** | **0.63** | **99%** | **16.0%** | **18.7%** | **21.9%** | **bir-iki** |

## Üç ayrım, ve biri yeni

**1. Olay alanı: 10.3% karşı 21.9%.** Bu, `02-references.md`'nin zaten
bulduğu eksen — ve v4 onu **kötüleştirdi**. v0.62 ortancası 9.8%'di,
referans bandı 17.5%. Kendi araştırma belgem açığın olay alanında
olduğunu yazdıktan sonra, açığı kapatmayan bir arayüz çizdim.

**2. Aksan ölçülemiyor.** Dokuz ekranın **sekizinde** hiçbir renk
ailesi eşiği (ekranın %0.5'i) geçmiyor; dokuzuncusunda H60 %0.8. Kehribar
`--amber` jetonu palette var, ekranda yok. Referansların dördünde
ölçülebilir bir aile var, birinde iki tane. "Bir aksan bir iş yapar"
kuralı, aksanı görünmez yapmak anlamına gelmiyordu.

**3. Ara ton nüfusu: %2.2 karşı %18.4.** Bu yeni bir ölçü ve neden
gerektiğini v4'ün kendi `tonal` sütunu gösteriyor: değer ya 0.13–0.27
ya 0.91–0.93, arası yok. Sebep, tonal aralığın tamamen o ekranda beyaz
düğmenin bulunup bulunmamasına bağlı olması. Ekran iki değerden kurulmuş
— koyu zemin, açık mürekkep — ve ortayı dolduran hiçbir şey yok.

`docs/design/midtone.py`, CIE L\* 0.30–0.70 aralığındaki piksel payını
sayar. Sonuç, bir iddia değil bir karşılaştırma olarak, üç küme:

| küme | ara ton ortancası |
|---|---:|
| UI v4 (dokuz ekran) | **2.2%** |
| Sahibin beğenmediği altı referans | 8.2% |
| Sahibin işaret ettiği beş referans | **18.4%** |

Sekiz kat. Ve dizilim anlamlı: beğenmediği referanslar bile bizim dört
katımız. Bu, `tonal`in yakalayamadığı şeyi yakalıyor — bir ekran hem
geniş tonal aralığa sahip olup hem düz görünebilir, eğer o aralık iki
uçta toplanmışsa.

## Bunun karara etkisi

`00-olcutler.md` K4 kapısı artık adıyla yazılabilir. Dokuzuncu tur,
şu üç sayıda reddedilenlerden ayrılmak zorunda:

- olay alanı, giriş ekranında ≥ 20%
- en az bir ölçülebilir renk ailesi, ekranın ≥ 1.5%'i
- ara ton nüfusu ≥ 10%

Bunlar tasarım tercihi değil, **ret şartı**: sağlanmazsa öneri
sunulmadan bilinir ki aynı yere düşüyor.

Ve bunların hiçbiri teknoloji seçimiyle ilgili değil. React ara ton
üretmez. Bu, 02 kolunun bulgusu ne olursa olsun, kararın ağırlık
merkezinin nerede olduğunu söylüyor.
