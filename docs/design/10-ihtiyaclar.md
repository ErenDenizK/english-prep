# İhtiyaçlar, beklentiler, kullanım durumları

2026-09-15. Sıfırdan bir UI/UX'ten önce tarama. Her satır dosyadan
geliyor; hiçbiri varsayım değil. UI kararları `11-ui/` klasöründe ve
her biri buradaki bir numaraya bağlı.

---

## 1 · Uygulama ne işe yarıyor

**YTÜ İYS tarzı bir yeterlilik sınavının I. oturumu.** 60 puan, dört
bölüm, 40 soru, hepsi dört şıklı [S, `docs/app1-final.md` §2]:

| bölüm | soru | puan | bugün |
|---|---|---|---|
| Cloze | 10 | 15 | 10 boşluk türünün 9'u |
| Closest meaning | 10 | 15 | tamam |
| Reading — iki metin | 14 | 21 | başlanmadı |
| Paragraph completion | 6 | 9 | başlanmadı |
| **toplam** | **40** | **60** | **30 / 60** |

II. oturum (dinleme) sahibinin kararıyla kapsam dışı.

İçerik: **10 konu × 6 ders = 60 ders, 241 soru** [S, `data/manifest.json`].

**Bu tablo UI'ın omurgası olmalı.** Bugünkü arayüzde sınavın dört bölümü
hiçbir yerde görünmüyor; öğrenci neyi çalıştığını ve neyin eksik
olduğunu göremiyor. İhtiyaç **N2**.

## 2 · Kim kullanıyor

`CLAUDE.md`'nin tanımı, ve bu dosyadaki her karardan daha belirleyici:

> **Gerçek bir İngilizce tabanı olan, akademik temeli olmayan öğrenci.**
> Diziden, filmden, oyundan kapmış; kulağı iyi, sezgisi çoğu zaman
> doğru; altındaki iskeleti hiç öğrenmemiş. Başlangıç seviyesi değil —
> tam tersi: **etiketsiz yetkinlik.**

UI sonuçları:

- **Kutlama tonu yanlış hedefe konuşur.** "Harikasın!", konfeti, seviye
  rozetleri — bunlar sıfırdan başlayan birine yazılır. Bu öğrenci
  sıfırdan başlamıyor, boşluk kapatıyor.
- **Ciddiyet bir özellik.** Sınav bir yılına karar veriyor. Oyun gibi
  görünen bir şey, tam da bu öğrencinin gözünde itibar kaybeder.
- **Metalanguage açıklanır, dilin kendisi açıklanmaz.** `V3` diye bir
  şey görmemiştir; ama *"I have gone"*u doğru kurar.

## 3 · Ne zaman, nerede, nasıl

Sahibinin ve arkadaşlarının gerçek kullanımı; hesap yok, sunucu yok,
her şey `localStorage` [S, `CLAUDE.md`].

| # | an | süre | koşul | UI'dan istediği |
|---|---|---|---|---|
| K1 | otobüste, sırada, ayakta | 5–10 dk | tek el, dikkat bölük | tek dokunuşta başlayan kısa bir oturum |
| K2 | akşam masada | 30–45 dk | odaklı | bir konuyu okuyup test etmek |
| K3 | sınavdan önceki hafta | 20 dk | gergin | sadece yanlışlar, ve sınav ölçeğinde deneme |
| K4 | ilk açılış | 1 dk | meraklı, sabırsız | bunun ne olduğu — kurulum değil |
| K5 | cevaptan hemen sonra | 20 sn | canı sıkkın | neden yanlış, kural neydi |

**K1 tasarımı belirler.** En sık an, en kısa an, en zor koşul: ayakta,
tek elle, 390 × 844'ün altında bir ekranda. Ana eylem başparmağın
altında olmalı ve bir cevap vermek, basılacak düğmeyi yerinden
oynatmamalı [S, `CLAUDE.md` non-negotiables].

## 4 · Beklentiler

| # | beklenti | bugün karşılanıyor mu |
|---|---|---|
| B1 | Hemen başlayabilmek — hesap yok, kurulum yok | evet |
| B2 | Nerede olduğunu bilmek: kaç puanlık bölüm, ne kaldı | **hayır** |
| B3 | Yanlışı anlamak, sadece görmek değil | evet (açıklama + ipucu + şık notları) |
| B4 | Sınav gibi hissetmek: dört şık, paragraf, süre | kısmen |
| B5 | Telefonda tek elle | evet |
| B6 | Ağır olmamak, çevrimdışı çalışmak | evet (build yok, bağımlılık yok) |
| B7 | Kaldığı yerden devam | kısmen |

## 5 · UI'ın karşılamak zorunda olduğu ihtiyaçlar

Tasarımın ölçüleceği liste. Her biri `11-ui/`de bir ekrana bağlı.

| # | ihtiyaç | nereden |
|---|---|---|
| **N1** | Bir oturum başlatmak **tek dokunuş** olmalı | K1 |
| **N2** | Sınavın dört bölümü ve öğrencinin her birindeki durumu **görünür** olmalı | §1, B2 |
| **N3** | Soru ekranı: paragraf + dört şık, **kaydırmadan**, cevap düğmeyi oynatmadan | K1, B5 |
| **N4** | Cevap ekranı **öğretmeli**: hangi kural, neden bu şık değil | K5, B3 |
| **N5** | Kayıt: ne ilerledi, nerede zayıf — süsleme değil, ölçüm | K3, B2 |
| **N6** | Ders okunabilir olmalı: uzun Türkçe metin, tam sütun genişliği | K2 |
| **N7** | İlk açılış **tanıtır**, kurulum yaptırmaz | K4 |
| **N8** | Yanlış defteri ve deneme, **sınav haftası** için ayrı yollar | K3 |

## 6 · Reddedilenler — yeniden açılmayacak

Sahibinin kararları ve ölçülmüş bulgular [S, `visual-longevity.md` §6,
`CLAUDE.md`, `02-references.md` §13–14]:

streak · XP · rozet · maskot · konfeti · kozmetik kilit açma ·
sınava kalan süre sayacı · dört adımlı onboarding · konu başına ton
(ölçüldü: on ton 30° içine çöküyor) · Liquid Glass'ın sistem olarak
taklidi · gövde metninin arkasında gradyan · 15px'in altında punto.

## 7 · Değişmeyen sözleşme

Build adımı yok · çalışma zamanı bağımlılığı yok · `innerHTML` yok ·
320px'den başlayan mobil · yalnızca `.app-content` kayar · her renk iki
temada WCAG 2 **ve** APCA ile ölçülür (`npm run color`, CI'da) ·
44px dokunma hedefi · UI Türkçe, alıştırma İngilizce · `lang="en"`
büyük harfe çevrilen her İngilizce dizgede.

---

## 8 · Bu taramanın tasarıma söylediği üç şey

1. **Omurga sınavın dört bölümü.** Bugünkü "Eğitim / Test" ayrımı
   uygulamanın kendi yapısı; öğrencinin zihnindeki yapı sınavın
   bölümleri. UI ikincisini göstermeli.
2. **En sık ekran soru ekranı, en kısa an K1.** Tasarım oradan
   başlamalı, giriş ekranından değil.
3. **Ciddiyet ve okunabilirlik bu ürünün estetiği.** Referansların
   editoryal karanlık dili — neredeyse tek renk, serif başlık, izli
   büyük harf künye, içerikten gelen renk — bu öğrenciye doğru
   konuşuyor; oyunlaştırılmış dil konuşmuyor.
