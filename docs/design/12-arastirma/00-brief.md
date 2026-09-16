# Tasarım sistemi araştırması — kol brief'i

2026-09-15. Altı paralel kol. Her kol kendi dosyasını yazar; sentez
`07-karar.md`'de yapılır.

## Ürün, tek paragrafta

Türk üniversitelerinin İngilizce yeterlilik sınavı (YTÜ İYS tarzı) için
statik, mobil-öncelikli bir hazırlık uygulaması. I. oturum: 60 puan,
dört bölüm, 40 dört-şıklı soru — Cloze 15p, Closest meaning 15p,
Reading 21p, Paragraph completion 9p. İçerik 10 konu × 6 ders = 60 ders,
241 soru; hepsi JSON. Kullanıcı: gerçek İngilizce tabanı olan, akademik
temeli olmayan öğrenci ("etiketsiz yetkinlik"). UI Türkçe, alıştırma
İngilizce. Hesap yok, sunucu yok, analitik yok — her şey `localStorage`.
GitHub Pages'ten sunuluyor. Sahibi ve arkadaşları kullanıyor; sınavdan
~6 hafta önce, telefonda, çoğunlukla ayakta ve 5–10 dakikalık
oturumlarda.

## Bugünkü teknik durum

- Düz HTML + CSS + ES modülleri. **Build adımı yok, çalışma zamanı
  bağımlılığı yok.** `package.json` yalnızca araçlar için ve sıfır
  bağımlılığı var.
- `innerHTML` hiçbir yerde yok; içerik JSON'dan geliyor ve `textContent`
  ile düğüm kurularak basılıyor.
- Tek stylesheet (`css/style.css`, ~1900 satır, cascade layer'lar).
- Üç self-hosted woff2 subset (Source Sans 3 × 2, Source Serif 4).
- `tools/palette.mjs` her rengi WCAG 2 **ve** APCA ile, iki temada, her
  punto/ağırlık eşleşmesi için CI'da ölçüyor (`PAIRS` tablosu).
- `tools/verify-ui.mjs` gerçek tarayıcıda 320/390/768/1280'de ~3.400
  kontrol yapıyor.
- 320px'den başlayan mobil; sabit yükseklikli kabuk, yalnız
  `.app-content` kayar.

## Bu araştırmanın sorusu

Altı turdur görsel dil reddedildi. Sahibi artık **profesyonel, sıfırdan
bir tasarım sistemi** istiyor ve gerekirse React gibi daha gelişmiş bir
yapıya geçmeye açık. Soru şu: **bu ürün için doğru tasarım sistemi
mimarisi ve doğru teknoloji tabanı nedir** — ve bugünkü "sıfır
bağımlılık" kısıtı korunmalı mı, gevşetilmeli mi?

## Her kolun uyması gerekenler

1. **Kanıt.** Her iddia ya bir kaynağa (link) ya bu depodaki bir
   ölçüme dayanmalı. Emin olunmayan her şey `[?]` ile işaretlenir.
2. **Sayı.** "Daha hızlı" değil, "şu kadar KB / şu kadar ms".
3. **Bu ürüne bağla.** Genel tasarım sistemi anlatımı istemiyoruz;
   her bulgunun sonunda "bu uygulamada ne anlama geliyor" olmalı.
4. **Ret de bir sonuç.** Bir şeyin bu ürüne uymadığını gerekçesiyle
   yazmak, uyduğunu yazmak kadar değerli.
5. Dosyayı `docs/design/12-arastirma/` altına yaz, İngilizce yaz
   (klasördeki diğer belgeler gibi), sonunda **Öneri** ve
   **Doğrulanamayanlar** bölümleri olsun.
