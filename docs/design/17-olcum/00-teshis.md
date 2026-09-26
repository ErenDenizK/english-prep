# Onuncu tur — teşhis, yedi gerçek sistemle ölçülmüş

Sahibinin sözleri: *"tuşlar menüler punto renk tuşlar renkler her şey uyumsuz,
hiçbir font buton ve yazı büyüklüğü birbirine uygun rahat okunabilir değil,
tasarım çok jenerik hiç güzel durmuyor. Okunabilirlik çok kötü menüler ve
tuşlar çirkin."*

Dokuz turdur bunu çizerek çözmeye çalıştım. Bu sefer önce ölçtüm.

## Yöntem

npm registry açık olduğu için dünyanın tasarım sistemlerinin **jeton
dosyalarını** indirdim — dokümanlarını okumak yerine. Yedi sistem,
**2.161 renk**, hepsi kendi aletimizle (`tools/color.mjs` + bu klasördeki
`lib-oklch.mjs`, onun tersi) tek ölçekte ölçüldü.

| sistem | rampa | renk | tema |
|---|---:|---:|---|
| Radix Colors | 62 | 744 | koyu + açık |
| Adobe Spectrum | 38 | 602 | koyu + açık |
| Ant Design | 26 | 260 | koyu + açık |
| Tailwind v4 | 25 | 273 | tek |
| Open Color | 13 | 130 | tek |
| IBM Carbon | 12 | 120 | tek |
| **biz** | 2 | 32 | koyu + açık |

Ölçüm dosyaları: `extract.mjs` (çıkarım), `measure.mjs` (rampa ölçümü),
`dims.mjs` (punto ve bileşen ölçüleri), `controls.mjs` (uygulamanın gerçek
kontrolleri, Chromium'da 390px'te), `solve-ladder.mjs` / `solve-system.mjs`
(çözüm aramaları). `lib-oklch.mjs` `tools/color.mjs`'in tersidir ve gidiş-dönüş
hatası **0.00075** ölçüldü (8-bit kuantalama sınırı).

---

## D1 · Okunabilirlik: 15px kademesi eşiğini 19 Lc kaçırıyor

APCA'nın punto matrisi Helvetica/Arial'in x-yüksekliğine göre indekslidir.
fontTools ile ölçüldü: Liberation Sans x/em **0.5283**, bizim Source Sans 3
@600 **0.4910** — oran **1.0760**. Yani bizim 15px'imiz matrise **13.9px**
olarak girer.

| punto/ağırlık | etkin boy | ham eşik | düzeltilmiş eşik | text-2 koyu | açık |
|---|---:|---:|---:|---|---|
| 15/600 | 13.9px | 75 | **95.6** | 76.3 → **−19.3** | 77.4 → **−18.2** |
| 16/600 | 14.9px | 70 | 78.9 | 76.3 → −2.6 | 77.4 → −1.5 |
| **17/600** | 15.8px | 65 | 71.0 | 76.3 → **geçer** | 77.4 → **geçer** |
| 18/600 | 16.7px | 60 | 66.4 | 76.3 → geçer | 77.4 → geçer |

**Geçen ilk boy 17px.** Ve 15px kademesi her yerde: `.t-meta`, `.row__sub`,
`.row__lead`, `.row__trail`, `.nav__item`, `.tile__meta`, `.tile__sub`,
`.ring__value`, `.t-ui`, `.t-label`, çipler. Uygulamadaki metnin kabaca
yarısı, projenin **kendi** standardını kendi yazı tipiyle karşılamıyor.

Ayrıca: 15px satır yüksekliği 20px = **1.33**. Küçük metin için bulduğum
her kaynak 1.5–1.8 diyor. İki kat hata aynı kademede.

## D2 · Punto ölçeği bir ölçek değil

| ölçek | oranlar | sd | en dar pay |
|---|---|---:|---:|
| bugün 15/18/22/28/36 | 1.200 · 1.222 · 1.273 · 1.286 | 0.035 | **1.3 Lc** |
| Spectrum (18 basamak) | tek oran 1.125 | **0.018** | — |

Oran monoton kayıyor: altta sıkışık, üstte gevşek. Ve pay 1.3 Lc — yani
sıfır. Karşılaştırma: 17px'ten başlayan her aday ölçek **11.3 Lc** pay bırakıyor.

## D3 · Kontroller: bir ekranda 12 yükseklik, kural yok

`docs/components.html`, 390px, Chromium'da ölçüldü — 61 kontrol, 28 ayrı geometri.

- **ayrı yükseklik: 12** — 24, 32, 44, 48, 52, 56, 74, 80, 102, 104, 122, 158
- **ayrı punto: 2** — sadece 15 ve 18. Beş basamaklı ölçeğin **ikisi**
  kontrollerde görünüyor; kontrollerde hiyerarşi yok.
- **yükseklik/etiket oranı: 1.60× – 8.78×**

Spectrum'un *kendi jeton dosyasından* ölçtüğüm bant:

| Spectrum boy | masaüstü | mobil | yük/etiket (mobil) |
|---|---|---|---:|
| 75 | 24px / 12px | 30px / 15px | 2.00× |
| 100 | 32px / 14px | 40px / 17px | 2.35× |
| 200 | 40px / 16px | 50px / 19px | 2.63× |
| 300 | 48px / 18px | 60px / 22px | 2.73× |

Ve mobil çarpanı **tam 1.25×**, her yükseklikte ve her boşlukta.
`button.json`'dan doğrudan okunan kural: **min genişlik = 2.25 × yükseklik**.

Bizim iki düğme boyumuz 48 ve 52 — **%8 fark**. Belgelenmiş sistemler
%25–40 adımlıyor. %8 hiyerarşi değil, tutarsızlık okunur.

## D4 · Her şey hap

Beş yarıçap jetonu var (8/12/20/28/pill) ama **pill** şunların hepsinde:
düğme, çip, alan, listbox tetiği, nav öğesi, nav göstergesi, ilerleme.
Primer (GitHub) toplam **üç** yarıçap yayınlıyor: 3 / 6 / 12px.

İç içe geçme de tutmuyor: eşmerkez kuralı `iç = dış − boşluk`. 20px kart +
16px iç boşluk **4px** iç yarıçap ister; en küçük jetonumuz 8.

## D5 · Jenerikliğin ölçülmüş sebebi: ölçülmemiş bir indigo

`css/style.css:72` — `--wash-2: rgb(120 110 235 / 0.22)`, sayfanın arkasında
radyal bir yıkama.

```
#786AEB → OKLCH L 0.603  C 0.188  H 284
```

**C 0.188 koyu temadaki en doygun değer.** Aksan 0.125, hata rengi 0.140.
Ve `tools/palette.mjs`'te **yok** — yani hiçbir tabloda ölçülmüyor, hiçbir
kontrastı denetlenmiyor.

Ton ailesi sayımı (15° birleştirme):

```
H 257 → surface-0/1/2, text-1/2/3, hairline, edge
H  75 → accent, accent-2, accent-text, on-accent, focus
H 150 → ok
H  25 → no
      → 4 aile ölçülmüş
H 284 → wash-2                    ← ölçülmemiş, en doygun, beşinci aile
```

Palet dört renk ailesiyle disiplinli. Sayfa beş çiziyor ve beşincisi hem en
doygunu hem de hiç denetlenmeyeni. H 284 aynı zamanda sektörün median
arayüz tonudur.

## D6 · Paletin ortası yok — ama sebebi sandığım değil

| | basamak | CIE L\* aralığı | yayılım |
|---|---:|---|---:|
| Radix gray (koyu) | 12 | 5.1 – 94.1 | 89.0 |
| Spectrum gray (koyu) | 13 | 5.1 – 100 | 94.9 |
| Carbon gray | 10 | 7.2 – 96.2 | 89.0 |
| Tailwind slate | 11 | 1.9 – 98.2 | 96.3 |
| **biz, koyu** | **3** | **4.9 – 17.3** | **12.4** |
| **biz, açık** | **3** | **89.0 – 95.3** | **6.3** |

Koyu temada L\* 17.3 ile 75.3 arasında **hiçbir jeton yok** — 58 puanlık bir
boşluk. Dokuz turdur "düz, sığ" denen şey bu.

**Ama çözücü, merdiveni derinleştirmenin işe yaramadığını gösterdi.**
`solve-system.mjs` her derinlikte mürekkebi yeniden çözdü:

```
koyu, en üst yüzey L* 37.5 → text-1 OKL 0.934, text-2 OKL 0.934  ← aynı değer
açık, en üst yüzey L* 76.4 → ÇÖZÜMSÜZ
```

Ara tonlu bir yüzeye sayfanın mürekkep merdivenini koyarsan hiyerarşi
çöküyor; açık temada L\* 82.8'den sonra hiç çözüm yok.

Gerçek sistemlerde de öyle: Radix'in 12 basamağında metin yalnız 11–12'de
oturur. Ara tonlar **metin yüzeyi değil** — kenar, dolgu, bileşen zemini,
ve metin taşıyacaksa kendi mürekkebiyle taşır.

Yani eksiğimiz ara ton değil, **işi olan bir ara ton katmanı**. Bu, önceki
turda "karşı düzlem" diye bulduğum şeyin genel hâli — ve o tur bunu
iddia etmişti, bu tur çözücü **kanıtladı**.

## D7 · Açık temada aksan zeminden 25° uzakta

```
koyu  zemin H 253 · aksan H  70 → ayrım 177°
açık  zemin H  85 · aksan H  60 → ayrım  25°
```

Schloss & Palmer (2011): palet bir küme olarak **yakın tonlar** ister, ama
şekil kendi zeminine karşı **ton karşıtlığı** ister. Koyu tema bunu yapıyor;
açık temada aksanı zeminden ayıran tek şey açıklık.

## Yan bulgu · Ölü jeton — ve bu bir bulgu değilmiş

`--c-text-3` çözülüyor, `npm run color` onu denetliyor, ve `css/style.css`
onu **sıfır kez** kullanıyor. Bunu bir gözden kaçma sandım; değilmiş.
`docs/design-system.md` §2 bunu açıkça yazıyor: *"`--c-text-3` hiçbir kural
tarafından kullanılmıyor… jeton olarak ve `prefers-contrast: more`
geçersiz kılmasında yaşıyor; metin rengi olarak geri gelmemeli."*
Kayıtlı bir karar. Ölçüm doğru, teşhis yanlıştı.

## Doğruladığım ve düzelttiğim iki dış iddia

- **Material 3: "ΔT 50 ⇒ ≥4.5:1 garantisi."** Kendi aletimle her çifti
  taradım: en kötü durum (L\* 50 ↔ 100) **4.478** veriyor. Pratikte doğru,
  **garanti olarak değil**. ΔT 40 ⇒ ≥3.0 iddiası tutuyor (en kötü 3.152).
- **Spectrum: "yan boşluk = yüksekliğin yarısı."** Yayınlanan düzyazı böyle
  diyor; indirdiğim jetonlar **0.37** veriyor (15/40, 19/50, 22/60).
  Jetonlar esas alındı. `min genişlik = 2.25 × yükseklik` ise `button.json`'da
  birebir doğrulandı.

## Kendi hatam

Punto ölçeklerini ilk denediğimde en küçük kademeyi `text-3`'e bağlayıp
"14 Lc açık" buldum. `PAIRS`'a bakınca o kademenin `text-2` olduğu çıktı —
hata bendeydi, uygulamada değil. Düzeltilmiş ölçüm yukarıda (D2).
