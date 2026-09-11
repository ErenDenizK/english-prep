# Üç yön — reddedildi, kayıt olarak duruyor

> **2026-09-11 · Bu adım reddedildi ve kasten silinmedi.** Sebebi
> `06-sozel-yonerge.md` §0'da: yanlış eksende çeşitlendi. Sahibi
> bağımsız bir *tasarım dili* geliştirmesi istedi; bu klasör üç **ürün
> yapısı** verdi (girişi ne taşıyor), hepsi de benim tek başıma
> seçtiğim tek bir görsel dili giyerek. Seçilmesi gereken şey hiç
> seçime sunulmadı. Ayrıca malzemesi yanlıştı: onun beğendiği beş
> referansta nesneler cam (ekranın %34–49'u), buradakiler opak levha
> (%41–43).
>
> Ölçüm yöntemi ve kabuk mekaniği (kutucuğun kontrolün kendisi olması,
> karşı düzlem ile tek eylemin aynı malzeme olması, satır arası ayraç)
> hâlâ geçerli ve adım 7'ye taşınıyor.

2026-09-11. Adım 5. `index.html`'i bir tarayıcıda aç — `npm run serve`
çalışırken `http://localhost:8000/docs/design/05-directions/index.html`.
Üstteki düğmeler A ve B seçimlerini (işaretin canlılığı, karanlık
zeminin ısısı) ve genişliği (390 / 320) canlı değiştiriyor. `shots/`
içinde aynı ekranların ölçülmüş görüntüleri var.

**İstenen şey onay değil, sıralama.** Birinci, ikinci, üçüncü — ve bir
cümleyle *neye göre* sıraladığın. O cümle bu klasörün geri kalanından
daha değerli, çünkü projede hiç toplanmamış tek şey o.

---

## Üçü de aynı iki ekran

Her yön **girişi** ve **yanlış cevap gösterilmiş soru ekranını**
gösteriyor, iki temada. Karşılaştırılabilsinler diye içerik aynı: aynı
gerçek soru (`data/tenses/tenses.json`, `tenses-t1`), aynı kelimeler,
aynı jetonlar. Değişen tek şey **girişin %25'ini neyin taşıdığı** —
`04-brief.md` §4'teki C seçimi.

Renklerin hiçbiri uydurma: hepsi `03-research.md`'de `tools/color.mjs`
ile çözüldü, `tokens.css` sadece o değerleri taşıyor.

| | bahis | verdiği |
|---|---|---|
| **A · Oturum** | giriş bugünün çalışmasıdır; karşı düzlem tek bir iş nesnesidir ve dokunulduğunda o iş başlar | kayıt görünmez — öğrenci nerede olduğunu ancak çalışarak öğrenir |
| **B · Soru** | pano yok; uygulama sıradaki soruyla açılır, karşı düzlem sorunun kendisidir | genel bakış ve tercih hissi |
| **C · Kayıt** | giriş öğrencinin kendi kaydıdır — haftası ve kategorileri çizilmiş veri olarak | ilk gün boş bir kayıt; o durum ayrıca tasarlanmalı |

---

## Ölçüm — ve hangi yön nerede kalıyor

`docs/design/measure-screens.py`, açık tema, 390 × 844.

| | olay (giriş) | olay (cevap) | yüksek÷düşük | karşı düzlem | doygun (giriş) | doygun (cevap) | ton ailesi |
|---|---|---|---|---|---|---|---|
| **brief** | **≥ 25%** | **≤ 12%** | **≥ 3×** | **≥ 25%** | **8–20%** | **1–3%** | **1** |
| A · Oturum | 37.9% ✓ | 9.3% ✓ | **4.1×** ✓ | 32.2% ✓ | 7.3% ✗ | 0.6% ✗ | 1 ✓ |
| B · Soru | 29.0% ✓ | **21.6%** ✗ | **1.3×** ✗ | 25.1% ✓ | 5.3% ✗ | 0.8% ✗ | 1 ✓ |
| C · Kayıt | 37.0% ✓ | 9.4% ✓ | **3.9×** ✓ | 27.9% ✓ | **12.7%** ✓ | 1.0% ✓ | 1 ✓ |

Karanlık temada (iki zemin ısısında da) sayılar bire bir aynı davranıyor:
A 38.9 / 10.4, B 29.8 / 22.1, C 37.5 / 10.4.

**Bunu düzeltmedim, çünkü bilgi.** Üç şey söylüyor:

1. **B, C2'yi ve C3'ü yapısı gereği geçemez.** Girişi soru olduğu için
   sessiz ekranı yok: yüksek ile düşük arasındaki fark 1.3×, briefin
   istediği 3×'in yarısından az — yani B'nin bahsi, tam da referansların
   yaptığı modülasyondan vazgeçmek. Bu bir hata değil, bir tercih; ama
   ölçüde görünüyor.
2. **C, briefin tamamını geçen tek yön** — ve bunu süsleyerek değil,
   veriyi çizerek yapıyor. Doygun alanın %12.7'si haftanın çubukları ve
   üç kategori barı; hiçbiri ornament, hepsi bir ölçüm.
3. **A, doygunluğu az farkla kaçırıyor** (7.3 / 8 ve 0.6 / 1). Sebebi
   tek: A'da işaret yalnızca ışık kaynağı ve ince bir çubuk. Tek satırlık
   çare var — soru ekranına ilerlemeyi işaret renginde bir çubuk olarak
   koymak — ama bu da C'nin bahsini A'ya ödünç vermek olurdu, o yüzden
   bırakıldı.

320 × 568'de üçünde de yatay taşma yok ve her dokunma hedefi 44px'in
üstünde; gövde kayıyor, ki kabuk zaten öyle çalışıyor.

---

## Neye bakman lazım

- **İlk iki saniye.** Beş turdur reddedilen şey buydu. Üç girişe sırayla
  bak ve hangisinin "ciddi ama ölü değil" durduğunu söyle.
- **Cevap ekranı.** En sık görülen ekran. Doğru/yanlış artık dolu bir
  kutu değil, sol kenarda bir çubuk ve ince bir çerçeve — öğretmenin
  kalemi gibi. Yeterince net mi, yoksa fazla mı sessiz?
- **Seçim A (işaret).** H 45 varsayılan. H 36'ya bas: referansın kendi
  turuncusu, %66 daha canlı. Fazla mı?
- **Seçim B (karanlık zemin).** Soğuk varsayılan. Sıcağa bas. İkisi de
  kontrastta bire bir aynı; fark sadece his.
- **Karanlık temada beyaza yakın düzlem.** `03-research.md` §15.8'de
  açıkça uyarı olarak yazıldı: sayıları çok iyi (Lc 92, 15.4:1) ama
  gece telefonda göz yorabilir. Bunu ancak sen söyleyebilirsin.

## Neye bakmana gerek yok

Uygulamanın içine hiçbir şey girmedi. Bunlar statik HTML; `css/style.css`
ve `js/` el değmeden duruyor. Adım 6 sadece senin seçtiğin yönü araç
setine çevirir, adım 7 uygulamaya taşır.
