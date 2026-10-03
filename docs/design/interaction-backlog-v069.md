# Sonraki tasarım incelemesi — v0.69

Bu liste yeni özelliklerin eklenmiş olduğu anlamına gelmez. Uygulamanın özünü
koruyan, materyali değiştirmeden yapılabilecek çalışmaların öncelikli sırasıdır.
Uygulanan kararlar: [ADR008](../adr/008-explorable-interactions.md).

## Yarın elle incelemek için

1. İlk açılıştaki **Konu / Ders / Kontrol**, sonra **Soru / Açıklama / Tekrar**
   seçimlerini dokunarak dene. Geri, Atla ve isteğe bağlı ad akışı açık mı?
   Çizim açıklıyor mu, yoksa yalnızca yer mi kaplıyor?
2. Uzun bir dersi oku; bir ön test cevabı ver, açıklamayı aç ve okumaya dön.
   Ana cümle, yardımcı açıklama ve kısa durum yazısı yeterince ayrışıyor mu?
   Yeşim/mercan işaretlerini iki tema ve ekran parlaklığında değerlendir.
3. Bir menüyü ekranın altından aç; klavyede ok tuşları, Enter ve Escape dene.
   Seçili işaret ve odak aynı kavram gibi görünmemeli. Onay penceresinin iç
   boşluğuna dokunmak pencereyi kapatmamalı.
4. Testte hızlı cevap/sonraki soru, yarıda çıkma ve kaldığın yerden devam etme
   akışını dene. Eski soru metni tekrar solmamalı; sıradaki düğme yer değiştirmemeli.
5. Profil'den hareketi kapat. Okuyucu/test içerik sonundaki kontrolün aynı
   tercihi izlediğini denetle. Telefonun hareket azaltma ayarı açıkken her
   işlevin animasyonsuz çalışması gerekir.
6. About'ta fareyi görselin üzerinde gezdir; sonra telefonda Oku/Uygula/Dön
   ve mimari seçimlerini dene. Görseller hareket edebilir, metin takip etmez.
   Ayrı bir ekran görüntüsü galerisi yoktur; görüntü seçilen adımı açıklar.

## En değerli sonraki çalışmalar

| Öncelik | Soru / çalışma | Kabul ölçütü |
| --- | --- | --- |
| P1 | Gerçek iPhone/Safari ve daha eski Android üzerinde 10 dakikalık okuma/test | Yanlış dokunma, kaydırma takılması, belirgin ısınma ve klavye örtüşmesi olmadan tamamlama; ölçülen cihaz/sürüm kaydedilir. |
| P1 | Hedef kitleyle cevap → açıklama → ilgili ders dönüşünü gözlemleme | Yönlendirme yapılmadan doğru derse dönüp önceki soruyla bağı kurabilme; başarısız noktalar kaydedilir. |
| P1 | Uzun okuma ve ertesi gün devam etmede bilgi hiyerarşisi | Kullanıcı nerede kaldığını ve hangi metnin kural/örnek/açıklama olduğunu kendi sözleriyle gösterebilir. |
| P2 | VoiceOver/TalkBack ile tam ders ve test | Seçenek durumu, yeni açıklama, sonraki eylem ve dialog odağı gerçek okuyucuda anlaşılır; otomatik axe sonucu bunun yerine geçmez. |
| P2 | Yüklü PWA güncellemesini zayıf ağda ve çevrimdışı sınama | Açık çalışma kaybolmaz; erişilemeyen materyal için doğru açıklama; eski/yeni worker davranışı gerçek cihazda kaydedilir. |
| P2 | About anlatımı ve metin uzunluğu | Yeni içerik `about/content.js` üzerinden eklenir; 320px/200% metinde taşma yok, iddia gerçek davranışa bağlı. |

İlk araştırmadan bağımsız kapsamlar (aramada gelişmiş filtreleme, işaretleme,
hesap/senkronizasyon, yeni sınav modları) bu turda eklenmedi. Bunlar için önce bulunabilirlik veya
devamlılık sorununun gözlemle doğrulanması, veri/erişilebilirlik maliyetinin
değerlendirilmesi ve ayrı kapsam kararı gerekir.

## Etkileşim kapsamı

| Öğe | Mevcut davranış | Bilerek sabit kalan |
| --- | --- | --- |
| Düğme / bağlantı | Kısa basma, renk ve yönlü ok tepkisi | Hitbox, metin, eylem zamanı |
| Sekme / rota | Seçili gösterge ve tek giriş ipucu | Navigasyon ve odak anında |
| Menü | Açıldığı kenardan giriş, dönen ok, seçili işaret | Klavye seçimi ve kapanma anında |
| Dialog | Açıldıktan sonra küçük yerel giriş | Native odak, Escape, arka plan sınırı |
| Cevap | Yeni ✓/× için yerel belirginleşme | Soru/paragraf ve seçenek ölçüsü |
| Sonuç | Gerçek değeri gösteren kısa çizgi vurgusu | Sayaç ve sahte ödül yok |
| Onboarding | Kullanıcının seçtiği altı özgün çizim sahnesi | Otomatik ilerleme / öğrenme verisi yok |
| About | Sınırlı görsel tepkisi, seçilebilir kullanım/mimari anlatımı | Başlık ve açıklama fareyi takip etmez |
| Okuyucu / arama / ad | Doğrudan kaydırma ve anlık yazma | Satır/harf animasyonu yok |

Tercih kapalıyken, işletim sistemi hareketi azalttığında veya sayfa gizliyken
süsleyici hareket durur. Daha fazla animasyon eklemek bu kapsam matrisindeki
bir ihtiyaçla gerekçelendirilmelidir; sırf boş göründüğü için eklenmemelidir.
