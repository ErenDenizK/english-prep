# Cam çalışması — boş tuval

> **v2 · iki düzeltme.** (1) Köken **v0.2 değil, v0.57** — UI turlarından
> hemen önceki, v1'e en yaklaştığımız hâl (`198e1cd`): soğuk arduvaz
> H 255 (0.175 / 0.228 / 0.286), serin ak mürekkep `#e9ecef`, kehribar
> `#f1af5d` C 0.125. v0.2'nin menekşesine fazla kaçmıştım.
> (2) **Cam çok beyazdı, göze gri geliyordu** → karartıldı ve
> sadeleştirildi: artık beyaz bir tabaka değil, arduvazın kendisi biraz
> açılmış hâli. Tek beyaz, pervazın ışık gören köşesinde. Tip modern
> grotesk (Inter), Helvetica ayarında.

2026-09-11. Adım 8'in numune levhası reddedildi. Gerekçeler ve her birine
verilen cevap aşağıda. Bu klasör **uygulama içeriği taşımıyor**: bileşen
yok, ekran yok, jeton yok. Sırayla bir alan, bir pano, bir harf, bir
hareket.

`npm run serve` → `http://localhost:8000/docs/design/09-cam/`

---

## Ne söylendi, ne yapıldı

**"Glassmorphism yapmaya çalışıyorsun ama başarılı değilsin, kalitesiz
gözüküyor."** Doğru, ve teknik sebebi tek cümle: **camın arkasında
kıracak bir şey yoktu.** Alan pürüzsüz bir radyal gradyandı; pürüzsüz bir
şeyi bulanıklaştırmak aynı pürüzsüz şeyi verir. `backdrop-filter`
görünürde hiçbir iş yapmıyordu, geriye düz bir yarı saydam kutu kaldı —
yani web'in genel glassmorphism klişesi. §A bunu üç panoda yan yana
gösteriyor.

**"Tasarladığın camın üzerine UI hissettirmiyor."** Referansın camını 6×
büyütüp baktım: **1px beyaz çizgi yok.** Gövde ışığın geldiği yönde
açılan bir gradyan, kenar gradyanlı bir pervaz, karanlıkta film greni
var, köşe sürekli. Benimki düz tint + tek blur + hairline'dı. §C yedi
katmanı tek tek ekliyor.

**"Gradient yapay gözüküyor, arkadan vuran bir ışık gibi olmalı."**
Tek gradyan yapay durur çünkü gerçek ışık tek ölçekli değildir. Alan
artık: panonun omzuna düşen yakın-güçlü bir lob, köşeden gelen
uzak-geniş bir ana ışık, karşı köşede soğuk bir dolgu, ve çok zayıf bir
ikinci yansıma — hepsi 8px yumuşatılmış, üstünde gren. §B dört aşamayı
gösteriyor.

**"Paleti beğenmedim."** Ölçtüm ve haklısın: önceki denemede zemin H 73,
tint H 72, mürekkep H 75, aksan H 70 — **hepsi 5 derece içinde**, yani
tek ton, çamur. `beta1-palette.md`'nin yıllar önce uyardığı hata.

**"Kökenini unutma."** v0.2'yi (commit `1122559`) ayrı bir worktree'de
açıp ölçtüm:

| | köken v0.2 | önceki denemem |
|---|---|---|
| zemin | `#1c1b22` · **H 292 soğuk menekşe** | `#14100b` · H 73 |
| mürekkep | `#efe9de` · **H 83 sıcak krem** | `#f4f1ed` · H 75 |
| aksan | `#e6a13c` · **H 73 · C 0.139 kehribar** | `#fe6a00` · H 45 · C 0.200 |
| başlık | **Fraunces** display serif | Source Sans 600 |
| rakam | **IBM Plex Mono** | Source Sans tabular |
| kenar | hairline, yarıçap 3px | gölge, yarıçap 32px |

Kökenin hamlesi şu: **sıcaklık mürekkepte ve aksanda, zeminde değil.**
Soğuk menekşe bir zemin, sıcak krem mürekkep, yumuşak kehribar. Ben
hepsini sıcağa toplayıp karakteri öldürmüşüm. Bu çalışma kökenin
renklerini ve üç sesini (Fraunces / Plex Sans / Plex Mono) geri alıyor.

**"Boş tuvalde denemelisin."** Bu klasörde uygulama içeriği yok.

---

## Çalışmanın bölümleri

| | ne gösteriyor |
|---|---|
| **A · Teşhis** | aynı ucuz pano düz alanda ve yapılı alanda; sonra tam cam |
| **B · Alan** | tek gradyan → üç lob → yumuşatma → gren |
| **C · Anatomi** | yedi katman tek tek: gövde gradyanı, kalınlık, gradyanlı pervaz, gren, aynasal süpürme |
| **D · Bir harf** | Fraunces / Plex Sans / Plex Mono, camın üstünde |
| **E · Bir hareket** | ışık kayıyor (9s), pano geliyor (260ms) |
| **F · Telefon oranında** | tek pano, tek harf; sağda önceki deneme karşılaştırma için |

## Camın yedi katmanı

1. **gövde gradyanı** — düz tint değil, ışığın geldiği yönde açılan bir gövde
2. **kırıcı** — `blur(26px) saturate(1.45) brightness(1.06)`
3. **temas gölgesi** — dar ve koyu, nesnenin yüzeye değdiği yer
4. **taşıma gölgesi** — geniş ve yumuşak, nesneyi alandan kaldırır
5. **iç alt kenar** — camın kalınlığı
6. **pervaz** — 1px beyaz çizgi değil: ışık köşesinde parlak, karşı köşede koyuya dönen gradyanlı bir bilezik (`mask-composite` ile)
7. **gren + aynasal süpürme** — `feTurbulence` data-URI, %3.2 opaklık, overlay; artı tek bir ince parlaklık bandı

Gren dosya maliyeti sıfır (inline SVG data-URI), bağımlılık yok, build
adımı yok.

## Henüz yapılmadı

Bu bir malzeme çalışması; spesifikasyon değil. Kontrast ölçümü, açık
tema, `PAIRS` satırları ve bileşenler ancak malzeme onaylandıktan sonra
gelir. Fraunces ve IBM Plex şu an Google Fonts'tan çekiliyor — kalırsa
`fonts/` içine subset edilecek, çünkü uygulamanın dış bağımlılığı yok.
