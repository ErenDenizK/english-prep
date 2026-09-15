# İkinci tur — detay araştırması

Sahibi 2026-09-15: *"Şu an olanı değiştirmeni değil her bir detayı
kapsamlı araştırıp en uygun tasarımı ve tasarım yapısını oluşturmanı
istiyorum. Tüm araştırma ve ölçümlerine devam et, elimizde yeterince
bulgu makale ve örnek olunca ise tasarlamaya geçeriz."*

Yani: **uygulamaya dokunulmuyor.** Bu tur bulgu, makale ve örnek
biriktiriyor. Tasarım kararı sonra.

Birinci tur (`docs/design/12-arastirma/`) sistemin iskeletini kurdu ve
iki canlı hata buldu. Bu tur, o iskeletin **içini** dolduruyor: her kol
bir detay alanını, ölçülebilir hale gelene kadar.

## Ağ gerçeği — zaman kaybetmeyin

Oturumun egress proxy'si organizasyon politikasıyla çalışıyor ve
**doküman sitelerinin neredeyse tamamı 403.** Ölçtüm:

| erişilebilir | kapalı (403 / bağlanmıyor) |
|---|---|
| `raw.githubusercontent.com` | `w3.org`, `developer.mozilla.org`, `caniuse.com` |
| `api.github.com` | `m3.material.io`, `carbondesignsystem.com`, `atlassian.design` |
| `registry.npmjs.org` | `radix-ui.com`, `primer.style`, `spectrum.adobe.com` |
| `WebSearch` aracı | `arxiv.org`, `doi.org`, `springer`, `tandfonline`, `scholar.google` |
| | `nngroup.com`, `smashingmagazine.com`, `web.dev`, `webkit.org` |
| | `WebFetch` aracı da bu hostlarda `EGRESS_BLOCKED` veriyor |

**Politika denemesi yapılmayacak, 403 tekrarlanmayacak.** Yöntem şu ve
aslında doküman sitesinden daha güçlü:

1. **Yönelim için `WebSearch`** — ne aranacağını bulmak, iddiaları
   duymak, kaynak adı öğrenmek.
2. **Birebir değer için deponun kendisi.** W3C spesifikasyonları
   `github.com/w3c/...` altında yaşıyor; Material'ın jetonları
   `androidx`'te; Carbon `carbon-design-system/carbon`'da; GOV.UK
   `alphagov/govuk-design-system`'de; APCA `Myndex/SAPC-APCA`'da;
   Radix renkleri npm'de. `raw.githubusercontent.com` açık.
3. **Ölçülebilen her şey ölçülecek.** npm tarball'ı indirilip tartılır,
   font dosyası `fontTools` ile açılır, renk `tools/color.mjs` ile
   çözülür, ekran `docs/design/measure-screens.py` ve
   `docs/design/midtone.py` ile ölçülür.

Bir kaynağa ulaşamadıysanız **bu bir bulgudur**: neyi, nereden almaya
çalıştığınızı ve açık bir makinede ne çekilmesi gerektiğini
`## Doğrulanamayanlar` altına yazın.

## Elinizdeki araçlar

```
tools/color.mjs            OKLCH, WCAG 2, APCA — sıfır bağımlılık
tools/palette.mjs          çözülmüş palet, PAIRS tablosu, requiredLc()
tools/token-check.mjs      stylesheet'in spec'i taşıdığını denetler
docs/design/measure-screens.py   bir ekranı 02-references.md §2 ölçüleriyle ölçer
docs/design/midtone.py           CIE L* 0.30-0.70 payı (ara ton nüfusu)
docs/design/refs/*.png           sahibinin on bir referans kırpığı
docs/design/11-ui/shots/*.png    reddedilen v4'ün dokuz ekranı
```

Chromium `/opt/pw-browsers/chromium`, Playwright global kurulumda
(`/opt/node22/lib/node_modules/playwright`). **Her launch'a
`executablePath: "/opt/pw-browsers/chromium"` verin** — global
Playwright 1234 derlemesini bekliyor, kurulu olan 1194.
`fontTools` ve `Pillow` sistemde var. esbuild `npx esbuild@0.28.2`.

## Bilmeniz gereken kararlar

`docs/design/12-arastirma/07-karar.md` okunacak. Özeti:

- Çerçeve alınmıyor (React derleme adımsız 110.5 KB gz; Tailwind/Panda
  `npm run color`'ı kırıyor). Derleme adımı sınavdan sonra.
- Yüzey merdiveni üçten beş kademeye çıkıyor, mürekkep L 0.941'den
  0.975'e — çünkü bugünkü mürekkep metin taşıyan en yüksek yüzeyi
  CIE L\* 19.7'ye kilitliyor ve ara ton bandı L\* 30'da başlıyor.
- Nötr bir yüzeyde **L\* 49.5–81.5 arası hiçbir metni taşımıyor**.
- Tip alt ucu 15 → 17 (APCA x-yüksekliği düzeltmesi).
- Hareket: dokuz jeton, üç animasyon, sıfır yay.

## Ret şartları — her öneri bunlara bakacak

`00-v4-olcumu.md`'den, ölçülmüş: sahibi sekiz tur reddetti ve
reddedilenlerin ortak sayısı şu. Yeni hiçbir şey bunları
sağlamıyorsa sunulmadan bilinir ki aynı yere düşüyor.

- giriş ekranında olay alanı **≥ 20%** (v4: 11.6%, referanslar: 21.9%)
- en az bir ölçülebilir renk ailesi, ekranın **≥ 1.5%**'i
  (v4: dokuz ekranın sekizinde sıfır)
- ara ton nüfusu **≥ 10%** (v4: 2.2%, referanslar: 18.4%)

## Öğrenci

`CLAUDE.md`'deki tanım bağlayıcı: **kulağı iyi, etiketi yok.** Dizi,
film, oyun ve konuşmayla İngilizce edinmiş; akademik iskeleti hiç
görmemiş. Başlangıç seviyesi değil — tam tersi. Rozet, seri, kutlama,
"harika iş!" onun ürünü değil. Altı haftalık, sonuç odaklı, dışsal
motivasyonu zaten büyük bir kullanım.

## Her kolun yazacağı dosya

İngilizce, markdown, ~76 karakterde sarılmış, `## Öneri` ve
`## Doğrulanamayanlar` ile biter. Sadece kendi dosyanıza yazın,
commit etmeyin.

Beş kural:

1. **Kanıt bağlantısıyla gelir.** Her iddianın yanında ya bir URL, ya
   bir depo yolu + commit, ya da bu depoda koşulmuş bir komut.
2. **Sıfat değil sayı.** "Daha okunaklı" bir bulgu değil; "satır başına
   57 karakter, ölçüldü" bulgudur.
3. **Her bulgu bu ürüne bağlanır.** Genel bir doğru, bu uygulamada ne
   yapar? Bağlanamıyorsa yazmayın.
4. **Reddetmek de sonuçtur.** "Bakıldı, bu ürüne uymuyor, sebebi şu"
   tam bir bulgudur ve sekiz reddedilen turdan sonra en değerlisidir.
5. **İşaretleme.** `[S]` kaynaktan okundu ya da burada ölçüldü,
   `[≈]` ikincil ama tutarlı, `[?]` doğrulanamadı.
