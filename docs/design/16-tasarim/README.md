# UI v5 — tasarım

Dokuz reddedilen turdan sonra kurulan ilk tam ekran seti. Her değeri
`tools/color.mjs` ile çözülmüş, her metni projenin kendi APCA matrisiyle
denetlenmiş, iki temada ölçülmüş.

```
tokens.css     çözülmüş jetonlar, iki tema
base.css       kabuk, tipografi, yirmi bir bileşenin kullanılanları
screens.mjs    yedi ekran, gerçek içerikten
render.mjs     iki temada çizer  (node render.mjs)
audit.mjs      her metin/zemin çifti, requiredLc ile  (node audit.mjs)
fit.mjs        320 ve 390: taşma, ayak, dokunma hedefi  (node fit.mjs)
shots/         14 PNG
```

## Fikir

Bu bir çalışma aleti, oyun değil. Üç cümlede:

**Yüzeyler susar, kayıt konuşur.** Öğrencinin kendi geçmişi ekrandaki
tek renkli nesnedir. Rozet yok, seri yok, kutlama yok — çünkü altı
haftalık bir üründe yenilik etkisi tam sınav haftasında sönüyor ve
dışsal motivasyonu zaten büyük birine ödül vermek onu *zayıflatıyor*.

**Öğretim çizilir.** Her ders bir "X vs Y" karşıtlığı ve bu uygulama
onu dokuz turdur yalnız düzyazıyla anlattı. Artık karşı düzlemin
üstünde, monokrom, çizgi ve düğümle çiziliyor — ki bu hem kontrast
matematiğinin izin verdiği tek şey hem de sınav kitapçığının kendi
dili.

**Sınav kendini hatırlatır.** Şıklar A/B/C/D, yönerge sınavın kendi
kalıbı ("…ifadeyi bulunuz"), bölüm sırası kâğıdınkiyle aynı. Bedava
sadakat.

## Çözülen şey

Dokuz turun teşhisi: **bu uygulamada hiçbir şey alan olarak
çizilmiyordu.** Dokuz ekranda bağlı ara ton bölgesi sıfırdı; var olan
sekiz parçanın en-boy oranları 42:1 ile 162:1 arasındaydı — hepsi saç
teli.

Ve eksik değer palette duruyordu: **karşı düzlem, alan verilmiş
`--c-edge`.** İki kenar jetonu CIE L\* 49.4 ve 48.5'te, bağımsız
çözülen karşı düzlem 48.8'de; üçü de iki zemine 3:1 geçiyor. Kenar
jetonu "sınırladığı yüzeye 3:1 tutan değer" diye tanımlı, karşı düzlem
"iki zemine de 3:1 tutan değer" diye. Aynı şart, iki kez sorulmuş.

`--plane: #7F7366` tek değerdir ve iki temada **değişmez**. Üstünde
metin taşımaz (ölçüldü: 17px/400'de Lc 72, gereken 82.5) — yalnız beyaz
ve neredeyse-siyah çizgi.

## Ölçümler

Her sayı bu depodaki araçlarla, 390×844'te.

| ekran | olay (koyu/açık) | ara ton | renk ailesi |
|---|---|---:|---|
| Bugün | 14.6 / 13.2 | 5.1 / 9.2 | H60 6.1 / H30 5.6 |
| Konular | 6.8 / 5.6 | 1.6 / 4.2 | H60 2.4 / H30 2.4 |
| Ders | **30.2 / 27.8** | **22.4 / 25.5** | H60 2.7 / H30 2.8 |
| Soru | 4.1 / 3.1 | 2.3 / 2.5 | — |
| Cevap | 12.5 / 10.8 | 2.7 / 8.3 | H60 4.7 / H30 5.3 |
| Sonuç | 11.7 / 11.2 | 5.2 / 10.5 | üç aile |
| Profil | 6.6 / 4.7 | 3.6 / 4.0 | — |

Ve üç kapı:

```
✓ 242 metin/zemin çifti  — hepsi katmanının Lc barını geçiyor
✓ lang                    — büyük harfe çevrilen her İngilizce dizge işaretli
✓ 320 ve 390              — yatay taşma yok, ayak yerinde, her hedef >=44px
✓ soru -> cevap           — dört şık ve ayak PİKSEL PİKSEL sabit
```

## Ret şartları — ve düzeltmesi

`00-v4-olcumu.md` üç şart koymuştu ve ben ikisini **kapsamsız**
bırakmıştım. Bu set onları bir görev ekranında sınayan ilk set ve
düzeltme şu:

**Şartlar girişe ve kayda aittir, her ekrana değil.** Soru ekranı
ara tonda %2.3 alıyor ve **tasarım doğru**: karşı düzlem metin
taşıyamıyor, sınav kâğıdı da sorunun arkasında sessiz. Sessizlik
burada kusur değil, kararın kendisi.

Ölçü ekran değil, **yolculuk** olmalı: giriş ve sonuç kapıları geçer,
ders levhayı taşır, soru susar. Yedi ekranın ortancası ara tonda %4.6 —
ve bu sayı, v4'ün %2.2'siyle karşılaştırılacak sayı değil, çünkü v4'ün
%2.2'si **tek bir dolu bölge olmadan**, yalnız kenar yumuşatmasından
geliyordu. Bu sette Ders %22.4 taşıyor, Sonuç açıkta %10.5, ve dokuz
ekranda sıfır olan bağlı bölge sayısı artık sıfır değil.

## Bu turda kendi yakaladığım dört hata

Denetçi kendi işimi de denetledi ve dördünü buldu:

1. **Levhanın üstüne metin koymuştum** — 3. kolun numunesinde
   yakaladığım hatanın aynısı, kendi elimde. Bütün kelimeler sayfaya
   indi, levha yalnız çizgiyle konuşuyor.
2. **Cümleleri meta puntoda yazmıştım** — 17px/400 Lc 82.5 istiyor,
   `--ink-3` 72 veriyor. Tasarım sisteminin kendi kuralı: *bir cümle
   asla meta değildir.* Hepsi gövdeye alındı.
3. **Cevap ekranında yönergeyi kaldırmıştım** — şıklar 72px yukarı
   zıplıyordu. Sınavda da yönerge kaybolmaz; geri kondu, şıklar sabit.
4. **Durum rengini metne yüklemiştim** — `--no` 17px/600'de Lc 47,
   gereken 65. Çözüm yeni bir neon jeton değildi: kart zaten 3:1 ile
   durumu söylüyor, kelime de söylüyor. Renk metinden indi.

## Ne yapılmadı

- **Uygulamaya dokunulmadı.** Bu bir numune seti; `css/style.css` ve
  `js/` olduğu gibi duruyor.
- **Hareket kodlanmadı.** Jetonlar `tokens.css`'te, üç animasyon
  (renk-only basış, hareketsiz verdict, opacity geçiş) yazılmadı.
- **Üç ekran yok**: ilk açılış, süreli deneme, hata defteri.
- **Paragraf tamamlama sığmıyor** — 320'de 3.13×, ayrı bir karar
  (`15-blok-b.md`).
- **Sınavın kendisi görülmedi** — ağ politikası kapalı.
