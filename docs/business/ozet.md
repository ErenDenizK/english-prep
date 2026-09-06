# Özet — Türkçe

Bu klasörde altı belge var, hepsi İngilizce ve toplamı üç bin satıra
yakın. Bu dosya onların Türkçe özeti. Amacı, hepsini okumadan da neyin
konuşulduğunu ve hangi kararların sana kaldığını görebilmen.

**Hiçbiri acil değil.** Sınav birkaç gün sonra. Aşağıdaki tek yakın
tarihli madde, arkadaşın içerik yazmaya başlamadan önce hallolması
gereken bir cümle — o da beş dakikalık bir iş.

---

## Bir cümlede

İki uygulama fikrin doğru, ama ayrım çizgisi yanlış yerde: bölünme
**Türkçe / yabancı** değil, **sınav / sınav değil**. Fiyat hesabın
tutuyor. Ve dört ayrı araştırma, birbirinden bağımsız çalışıp aynı
duvara tosladı: **herkese açık, statik bir dosya satılamaz.**

---

## 1. Herkese açık bir dosya satılamaz

Bu, gecenin en önemli bulgusu ve dört belgede ayrı ayrı çıktı.

Projenin iki kuralı var, ikisi de tek başına doğru:

- "Önemli bir bölümü mutlaka ücretsiz olacak" — senin sözün.
- "İçerik veridir" — sorular `data/` klasöründe düz JSON dosyaları
  olarak duruyor ve GitHub Pages onları olduğu gibi yayınlıyor.

Bu ikisi bir araya gelince para almak imkânsızlaşıyor. Şu anda
uygulamadaki **her soru, her ders, her açıklama** tek bir komutla
indirilebiliyor. `localStorage`'a yazılan bir "kilit açıldı" işareti,
kapısı zaten açık bir odaya asılmış bir asma kilit — üstelik hedef
kitlen teknik olarak becerikli ve birbirini tanıyan öğrenciler. Sınıfın
grup sohbetine düşen tek bir ekran görüntüsü modeli bitirir.

**Karar verildi (6 Eylül):** kaynağı ücretliye geçmeden kapatırız, zaten
o noktaya gelmeden içerikte önemli değişiklikler olur. Bu dördüncü ve
daha temiz bir çözüm — dört araştırma kolu da "depo açık kalır"
varsayımının içinde düşünüyordu, o varsayım hiç senin değildi.

Taşınması gereken tek gerçek: **depoyu sonradan gizlemek, o güne kadar
açık olanı geri almaz.** Klonlayan kimsenin elindeki kopya kalır. Yani
eylül hâlindeki külliyat dışarıda — ama senin ikinci cümlen tam da bunu
karşılıyor: ücretli sürüm o kopya olmayacak. Yani "önemli
değişiklikler" kısmı süs değil, planın taşıyıcı ayağı.

Belgelerin ulaştığı üç çözüm de duruyor, çünkü her birinin neye mal
olduğunu gösteriyorlar:

1. **Kabı sat, içeriği hediye et.** Web uygulaması sonsuza kadar
   ücretsiz ve eksiksiz kalır; insanların satın aldığı şey kurulum,
   çevrimdışı kolaylık ve projeyi desteklemek olur.
2. **İçeriği ikiye böl.** Ücretsiz kısım depoda kalır, ücretli kısım
   sadece mağaza sürümünde bulunur. Bunun bedeli projenin "içerik
   veridir" kuralını kaybetmek — ve o kural bütün yazım düzeninin
   taşıyıcısı.
3. **App 1 için hiç para alma.** Mağaza kaydını ve vergi kaydını prova
   olarak yap, para isteyen şey App 2 olsun.

Belgeler farklı yönlere meylediyor ve nedenlerini yazıyor. Senin yerine
kimse seçemez, çünkü seçim parayı ne kadar istediğine bağlı — ve sen
zaten "asıl amaç gelir değil" dedin.

---

## 2. İki uygulama — evet, ama çizgi başka yerde

Ölçtük: **241 sorunun sadece 21'i Türkçe üzerinden düşünüyor, ama 60
dersin 51'i öyle.** (Bu sayılar bu gece ikinci kez, ayrı bir betikle
doğrulandı; birebir çıktı.)

Yani **soru bankası taşınır, dersler taşınmaz.** Derslerin yöntemi
zaten Türkçenin yaptığı karışıklığı çözmek — "Türkçede 'az' hem few hem
little demektir" gibi. Bu cümle İspanyolcaya çevrilemez, ancak
İspanyolca sezgisi seninki kadar iyi olan biri tarafından **yeniden
yazılabilir**.

Sonuç: **yabancı dile çevirmek ikinci adım değil, üçüncü adım** — ve
para meselesi değil, insan meselesi. Her dil bir çevirmen değil, bir
ortak yazar demek. Kabaca dil başına 45–60 saatlik uzman emeği.

App 2 önce Türkçe çıkmalı, aynı öğrenciye, farklı bir iş yaparak.

---

## 3. Fiyat hesabın tutuyor

270 TL için hesap: KDV düşünce 225, Apple'ın küçük işletme programıyla
%15 komisyon düşünce **191 TL**, %15 stopaj sonrası **elinde ~163 TL**.
Senin tahminin 150'ydi — iyi tahmin etmişsin. İki kaydı da yaptırırsan
(Apple Small Business + vergi istisnası) üst rakam geçerli olur.

Vergi konusunda hatırladığın şey **gerçek**: GVK mükerrer 20/B, mobil
uygulama geliştiricileri için şirket gerektirmeyen bir istisna, 2026
sınırı ~5,3 milyon TL. Ama bir tuzağı var: özetler **adi ortaklığın bu
istisnadan yararlanamayacağını** söylüyor — bu doğrudan "arkadaşımla
beraber yürütürüz" fikrine çarpar. **Bu soru bir SMMM'ye sorulmalı, hem
de geliştirici hesabı birinin adına açılmadan önce.**

**Kimsenin hesaplamadığı sayı: üretim maliyeti.** Bu külliyat — 241
soru, 60 ders, 723 seçenek notu — dört günde, sabit ücretli bir abonelik
üzerinden üretildi. O aboneliğin bir aylık bedeli kabaca **otuz satışa**
denk. Aynı işi API ücretleriyle yapmak birkaç yüz satış ederdi. Yani
projenin ekonomisi tamamen aboneliğe dayanıyor; boru hattını API'ye
taşımak hesabı her hacimde bozar.

**En kırılgan varsayım komisyon ya da vergi değil**: "üç okul × 50
kişi". Bu cümle sessizce "ulaşmak = satmak" varsayıyor. Yanılma payı on
kat olabilecek tek satır bu.

---

## 4. Mağaza: Android önce, Apple sonra

- En ucuz yol **hiç mağaza kullanmamak**: PWA + Türkiye'de bireysel
  satıcı kabul eden bir ödeme sayfasından kilit kodu. Sıfır sabit
  ücret, inceleyici yok, sunucu yok.
- Sonra **Google Play, 25 dolar** (bir kerelik). Türkiye'de telefonların
  %85'inden fazlası Android; Apple'a önce gitmek, en zor incelemeye ve
  yıllık 99 dolara, öğrencilerinin belki beşte biri için para vermek
  demek.
- **Play için önce alan adı almak gerekiyor** — teknik sebep: doğrulama
  dosyası sitenin kök dizininde durmak zorunda, `github.io` altındaki
  bir alt klasörde duramaz.
- **Native'e yeniden yazma.** Sebep beş-dokuz ay değil: düzelttiğin her
  soru, sınav haftasında bir-üç günlük mağaza incelemesinin arkasında
  kalırdı.

---

## 5. Abonelik mi, tek seferlik mi

- **App 1: tek seferlik.** Sunucu maliyeti sıfır, talep sınav takvimine
  bağlı, sızdıracak bir şey yok.
- **App 2: burada belgeler anlaşamıyor** ve anlaşmazlığı olduğu gibi
  bırakıyorum. Biri "yıllık abonelik, ama ancak her ay içerik çıkarmaya
  söz verirsen" diyor; öbürü "verme" diyor — çünkü o söz, kalıcı olarak
  ayda 3–4 saatlik **senin kendi dikkatin** demek ve aylık fiyat, süren
  bir arz sözüdür. Aynı gerçeğe bakıp farklı bahis oynuyorlar. Orta yol
  olarak da şu var: hiçbir şeyi kilitlemeyen bir **destekçi** aboneliği.
- **Ücretsiz katman için öneri: sonsuza kadar ücretsiz, derinlik
  ücretli.** Bütün dersler ve v1 soru külliyatı ücretsiz; kategori başına
  5–10. sorular, okuma parçaları ve süreli deneme ücretli.

---

## 5b. App 1 biter, App 2 ondan doğup uzaklaşır

Sahibinin kendi çerçevesi, 6 Eylül: **App 1 bu sistemin nihai hâli.**
Bir basamak değil — bitiyor ve orada bırakılıyor. App 2 onun içinden
doğuyor ama çok farklı bir yere evriliyor, çünkü daha geniş bir kitleye
ve çok daha uzun bir süre boyunca ders veriyor; **sistem ve UI
değişiyor.**

Bu doğru ve bir şeyi düzeltiyor: daha önce "sınav dışında her şey
taşınır" yazmıştım. Ölçtüm, öyle değil.

| | Satır | |
|---|---|---|
| **Taşınan çekirdek** | **~1.990 (%29)** | dom, modal, listbox, icons, quiz motoru, yedek birleştirme, storage, config |
| **Yeniden yazılan kabuk** | **~4.790 (%71)** | education (1.768), home, profile, quiz, results, topics, shell… |

Yani App 2'yi "sınavı çıkarılmış App 1" diye planlamak maliyeti kabaca
**üç kat eksik** hesaplamak olur.

**Bütünüyle taşınan tek şey `tools/`** — 6.065 satır doğrulayıcı,
biçimlendirici, kör geçiş, kalibrasyon, süpürme ve çözüm defteri. İçeriğin
*ne öğrettiğiyle* değil *nasıl denetlendiğiyle* ilgili oldukları için iki
uygulamada da aynı. Kopyalanamayan varlık bu.

**Sürenin uzaması neyi bozuyor:** App 1'de "yarın niye açayım" sorusunu
takvim cevaplıyor; App 2'de cevaplayacak bir şey yok — ve bu proje
streak'i, bildirimi, artan sayıyı reddetti. Dürüst karşılığı sınır
modeli: *"dört sınır tekrar bakılmaya hazır"* bir **durum**, puan değil;
tatile çıkınca kaybedilmiyor. Ayrıca oturum biçimi tersine dönüyor
(uzun oturum → kısa ve sık), içerik tükenmesi baş kısıt hâline geliyor,
ve `visual-longevity.md` araştırması canlanıyor — o belge doğru soruyu
sordu ama bütün kollarını park etti, park sebeplerinin ikisi de App 1'in
özelliğiydi. **App 1'in olmadığı bir problemi araştırıyordu.**

**Kitlenin genişlemesi neyi bozuyor:** ortak hedef yok (sormak ya da
çıkarmak gerekiyor — çıkarmak zaten kama), ortak seviye yok (sınır modeli
bunu soğuruyor), ortak son tarih yok. Ve "sınav" kelimesi App 1'in
metninde taşıyıcı: onu çıkarmak bul-değiştir değil, her ekran için "bu
ekran neden var" sorusunu yeniden cevaplamak.

**Pratik biçim:** App 2 ayrı bir kod tabanı, çekirdeği kopyalayarak.
Ortak paket ya da monorepo bir derleme adımı ister ve derleme adımının
olmaması bu projenin hâlâ çalışmasının ve sıfıra mal olmasının büyük
sebebi. **2.000 satırı bir kez kopyalamak, bir araç zinciri edinmekten
ucuz.**

---

## 6. Rakip Duolingo değil, ChatGPT

Bu, sindirilmesi gereken cümle. App 2'nin ana özelliği "daha iyi
açıklıyor" olursa ölür — açıklama artık her yerde bedava.

Elindeki tek gerçek avantaj **teşhis**: öğrencinin *sormayı bilmediği*
eksiği bulmak. Bunun yarısı zaten `js/storage.js` içinde yazılı.

Ve kopyalanamayan varlık içerik değil, **boru hattı**: kör inceleme,
ders yeterlilik geçişi, bağımsız yeniden denetim. Yavaş olması kasıtlı,
kopyalanması zor olmasının sebebi de bu.

---

## 7. Sana kalan kararlar

| Ne zaman | Karar |
|---|---|
| **Arkadaşın içerik yazmadan önce** | Yazdığını kimin lisanslayabileceğine dair tek paragraf. Metin hazır: `contributing-draft.md` — hem repo için, hem gönderebileceğin Türkçe mesaj olarak |
| Geliştirici hesabı birinin adına açılmadan önce | Adi ortaklık vergi istisnasını bozuyor mu — **SMMM'ye** |
| 25 doları harcamadan önce | Türkiye Google Play'de satıcı ülkesi mi (doğrulanamadı) |
| ~~Para almadan önce~~ | ~~Üç çözümden hangisi~~ — **karar verildi: önce kaynak kapatılır** |
| Para almadan önce | Ücretli sürüm içeriği **çekiyor mu, gömüyor mu** — yanlış bir soru mağaza incelemesi bekleyecekse, tam da lazım olduğu hafta yanlış kalır |
| Acelesi yok | `data/` için lisans (her hakkı saklı mı, CC BY-NC-ND mi) ve kod için MIT mi Apache mi |

---

## 8. Ve şunu bilerek oku

Bu belgeleri yazan oturumlarda **internet erişimi yoktu**. Repo'dan
ölçülen her sayı iki kez, ayrı betiklerle doğrulandı ve birebir çıktı.
Ama repo dışından gelen her rakam — KDV oranı, Apple komisyonu, vergi
istisnası, mağaza kuralları — **arama özeti**, kaynağından okunmuş
değil. Belgelerin her biri bunu kullandığı yerde işaretliyor.

Üç tanesi taşıyıcı ve üçü de doğrulanmadı: Türkiye KDV oranı, Apple
Small Business şartları, GVK mükerrer 20/B. Para harcamadan önce
bakılacak liste `shipping.md` §9 ve `pricing.md` §7'de duruyor.
