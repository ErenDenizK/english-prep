# Materyali değiştirmeden sonraki ürün çalışmaları

4 Ekim 2026. Bu liste uygulanmış özellik beyanı veya onaylanmış teslim takvimi
değildir. Akademik makale + konu testi akışını korur. Göreli efor: **S** küçük
yerel arayüz/veri eklemesi; **M** veri modeli ve çok cihazlı davranış; **L** yeni
altyapı veya kapsamlı değerlendirme. Mevcut [etkileşim inceleme listesi](../history/design/interaction-backlog-v069.md)
ve [tarihî içerik roadmap'i](../history/roadmap.md) ile birlikte okunur.

## Bu turda uygulanan

**Gözden geçirilebilir yedek aktarımı.** Gönderilecek kayıtları sayılarıyla
gösterir; native dosya paylaşımı, dosya indirme ve metin kopyalama arasında açık
seçim verir. JSON v1 ve mevcut kayıpsız birleştirme aynı kalır. Kullanıcının
bulutta hesabı veya otomatik senkronizasyonu olduğu ima edilmez.

## Öncelikli keşif listesi

| Öncelik / fikir | Kullanıcı değeri ve doğrulanacak ihtiyaç | Efor / bağımlılık | Veri sınırı ve kabul ölçütü |
| --- | --- | --- | --- |
| P1 · Ders bağlantısını paylaş | Arkadaşa “şu iki kullanımın ayrımı burada” diyebilmek. Genel uygulama adresi yerine doğru ders açılır. | S · Mevcut hash rotası + Web Share/copy | URL yalnızca sabit ders kimliği taşır. Ad, puan ve okuma konumu yok. İptal başka kanalı başlatmaz; yeni/çevrimdışı cihazda erişim doğru açıklanır. |
| P1 · Kısa okuma listesi | “Şimdi değil; tekrar döneceğim” konuları yanlış defterinden bağımsız saklamak. Gerçek kullanım gözlemiyle doğrulansın. | M · Yerel işaret modeli, yedek uyumu, arama entegrasyonu | Sıralama ve silme geri alınabilir. İşaret, tamamlandı veya doğru biliniyor anlamına gelmez. Yeni içerik eklenmez. |
| P1 · Veri aktarımı cihaz provası | Telefon değiştirirken veya PWA kurarken ilerleme kaybı korkusunu azaltmak. | S/M · Gerçek iPhone/Safari + Android + Windows erişimi | Aynı yedek iki kez içe alındığında çoğalma yok. OS paylaşım/clipboard izinleri ve ayrı PWA depolaması gerçek cihazda kayda alınır. |
| P1 · Ders içi bulma / bölüme dönme | Uzun makalede bilinen bir terime hızla dönmek; yeni kaydırma rayı tek başına sözcük araması sağlamaz. | M · Sabit blok kimlikleri, arama odağı ve vurgusu | Metin kopyalanıp değiştirilmez; işaretli sonuç atlamak ilerleme kazandırmaz. Ekran okuyucuda sonuç sayısı ve konumu anlaşılır. |
| P2 · Okunabilir çalışma özeti | Öğretmene veya kendine hangi konulara döndüğünü göstermek; JSON yedeği sunum için uygun değil. | M · Oturum/geçmişten salt okunur özet, önizleme ve veri seçimi | İsim/tarih/soru sonucu kullanıcı tarafından seçilir. Otomatik sosyal paylaşım veya herkese açık profil yok. Test yüzdesi genel İngilizce yeterliliği gibi sunulmaz. |
| P2 · Yerel notlar | Kişinin kendi ayrımını tek cümleyle yazması; eğitim materyalini değiştirmeden kişisel bağ kurmak. | M · Not deposu, silme/geri alma, yedek versiyonlaması, klavye | Notlar ayrı etiketli; resmî ders metniyle karışmaz. İlk sürüm düz metin, tarayıcı içi, isteğe bağlı. Boş metin alanları her derse yüklenmez. |
| P2 · Çevrimdışı hazır durumu | “Bu dersi internet olmadan açabilir miyim?” sorusuna tahmin yerine cevap. | M · Service worker cache manifesti + güncelleme/alan hataları | Tüm materyal çevrimdışıymış gibi gösterilmez. Gerçek önbellek durumuna dayanır; iOS tahliyesi garanti edilemez. |
| P2 · Veri arşivini tarihleriyle yönetme | Birden çok cihaz dosyasının hangisinin daha yeni olduğunu ayırt etmek. | M · Yedek önizlemesine kaynak/tarih ve karşılaştırma | Cihaz adı isteğe bağlı, takipsiz. Varsayılan birleştirme korunur; “yenisi eskisini siler” mantığı yok. |
| P3 · İki cihazda otomatik senkron | Kullanıcı dosya taşıma adımını düzenli tekrarlıyorsa değerlendirilmeli. | L · Kimlik, sunucu, şifreleme, çatışma çözümü ve bakım | Ayrı ürün/altyapı kararı gerekir. Bu sürümde yok; yol haritasına yazılması bağlantı veya otomatik veri aktarımı başlatmaz. |

## Karar kapıları

1. En az bir hedef kullanıcıyla gerçek bir ders → test → açıklama → derse dönüş
   oturumu gözlemlenir. İstenen özellik, akıştaki görülen probleme bağlanır.
2. Öğrenme durumuyla görsel durumu ayıran model yazılır. Bir kaydırma/animasyon/
   paylaşım işlemi puan veya tamamlanma kaydını kendiliğinden değiştiremez.
3. Mobil 320px, büyük yazı, dokunma, klavye, hareket azaltma ve başarısızlık
   hâllerinde bitirilebilir akış gösterilir. Hız ve odak, animasyonu beklemez.
4. Depoya yazan her yeni veri türü için dışa aktarma, içe alma, bozuk dosya ve
   eski yedek uyumu açıklanır. “Yerel” demek “kaybolmaz” demek değildir.

Kaynak ve aktarım tasarım gerekçeleri:
[veri paylaşımı araştırması](../research/2026-10-data-transfer-v072.md).
