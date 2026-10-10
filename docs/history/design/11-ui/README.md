# UI v4 — sıfırdan

2026-09-15. `10-ihtiyaclar.md`'nin taramasından çıkan dokuz ekran.
`npm run serve` → `http://localhost:8000/docs/design/11-ui/`

## Dilin kuralı

**Editoryal karanlık.** Neredeyse tek renk, serif başlık, izli büyük
harf künye, tek kehribar, beyaz hap tek eylem. Cam yok, gradyan yok,
gölge yok — ayrım **ince çizgi** ve **boşluk** ile yapılıyor.

| | değer | neden |
|---|---|---|
| zemin | `#0e0e10` | mürekkep siyahı, mavi arduvaz değil |
| en kötü yüzey | `#17171a` | `PAIRS` bunu ölçer |
| mürekkep | `#e8e5e1` · `#d1ccc6` · `#b8b2ab` | Lc 90 · 75 · 60, çözüldü |
| kehribar (işaret) | `#f1af5d` | metin değil; 9.40:1 |
| kehribar (metin) | `#eac897` | Lc 75 — künye için ayrı jeton |
| beyaz (eylem) | `#f7f5f2` | ekranda tek dolu nesne |
| doğru / yanlış | `#83d494` / `#f07f77` | 10.06:1 / 6.82:1 |

Tip: **Source Serif 4** başlık ve İngilizce, **Source Sans 3** Türkçe ve
künye. Dördüncü font yok, dış bağımlılık yok. Künye 15px/600 +0.12em iz
— 13px denendi ve **düştü**: 13/600 Lc 103 istiyor, en parlak mürekkep
98 veriyor.

## Ekranlar ve karşıladıkları ihtiyaç

| # | ekran | ihtiyaç |
|---|---|---|
| 1 | **Bugün** | N1 tek dokunuş · **N2 sınavın dört bölümü** |
| 2 | Konular | çip sırası, ilerleme |
| 3 | Konu | serif başlık, altı ders |
| 4 | Ders | N6 kesintisiz nesir, tam sütun |
| 5 | Soru | N3 kaydırmasız, düğme sabit |
| 6 | Cevap | N4 kural + şık notları |
| 7 | Sonuç | N5 ölçüm — kutlama değil |
| 8 | İlk açılış | N7 tanıtır, kurulum yaptırmaz |
| 9 | Deneme | N8 sınav haftası |

## En büyük değişiklik

**Omurga artık sınavın dört bölümü.** Bugünkü Eğitim/Test ayrımı
uygulamanın kendi yapısı; öğrencinin zihnindeki yapı sınavın bölümleri.
1. ekranda dört bölüm puanları ve durumlarıyla bir dizin olarak duruyor —
Reading ve Paragraph completion taralı, yani "henüz yok" diyor, uygulama
kendi eksiğini saklamıyor.

Nav üç sekme: **Bugün · Konular · Deneme**. Profil başlıkta kalıyor.

## Denetim

390 × 844'te yatay taşma yok, her dokunma hedefi 44px üstünde, yalnız
`.body` kayıyor. Renkler `tools/color.mjs` ile en kötü yüzeye karşı
çözüldü; uygulamaya taşınırken `PAIRS` satırları eklenecek.
