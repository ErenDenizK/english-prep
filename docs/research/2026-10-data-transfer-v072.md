# Gözden geçirilebilir veri aktarımı — v0.72

4 Ekim 2026. Bu çalışma materyale, puanlamaya veya yedek biçimine dokunmaz.
Tarayıcı API testleri cihazdaki gerçek paylaşım panelinin testi değildir.

## Başlangıçtaki durum

`downloadBackup()` zaten JSON dosyasını yerel paylaşım paneliyle gönderebiliyor,
destek yoksa indirebiliyordu. Yeni özellik bu API'yi ilk kez eklemek değildir.
Eksik olan, kullanıcının hangi kayıtları göndereceğini ve hangi kanalı
kullanacağını eylemden önce görebilmesiydi. Eski başarı cümlesi de dosyanın
gerçekten kaydedildiğini doğrulayamazdı.

## Kaynaklar ve kararlara etkileri

Kaynaklar 4 Ekim 2026'da HTTPS üzerinden resmî dokümantasyonun GitHub
kaynaklarından okunmuştur; ürünlerin canlı arayüzlerinin ölçüldüğü iddia edilmez.

| Kaynak | Kanıt | Uygulama kararı |
| --- | --- | --- |
| [MDN: Navigator.share](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share), [okunan kaynak](https://github.com/mdn/content/blob/main/files/en-us/web/api/navigator/share/index.md) | Paylaşım kullanıcı etkinleştirmesi ister. Promise bazı sistemlerde panel açılırken, bazılarında hedef uygulamaya aktarılırken çözülür. | Dosya hazırlanır; `share()` doğrudan ikinci bir kullanıcı tıklamasından çağrılır. “Kaydedildi” yerine “Paylaşım sistemine verildi.” |
| [W3C Web Share](https://www.w3.org/TR/web-share/), [okunan kaynak](https://github.com/w3c/web-share/blob/main/index.html) | Dosya türü/politika/etkinleştirme başarısız olabilir. Paylaşım iptali `AbortError` ile dönebilir. | Gerçek JSON `File` nesnesiyle `canShare`; iptal sonrası başka kanal otomatik başlatılmaz. Destek yokken indirme ve kopyalama görünür. |
| [MDN: Clipboard.writeText](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText), [okunan kaynak](https://github.com/mdn/content/blob/main/files/en-us/web/api/clipboard/writetext/index.md) | Güvenli bağlam gerekir; izin yine reddedilebilir. | Kopyalama başarısızlığında aynı yedek metni seçili ve elle kopyalanabilir olarak açılır. Başarı olmadığı hâlde “kopyalandı” yazılmaz. |
| [Anki Manual: Exporting](https://docs.ankiweb.net/exporting.html), [okunan kaynak](https://github.com/ankitects/anki-manual/blob/main/src/exporting.md) | Tüm koleksiyon yedeği, bir parçayı başkasıyla paylaşma ve çalışma geçmişini dahil etme farklı amaçlardır. | English Prep'in tam yedeği, anonim ders bağlantısıyla karıştırılmaz. Bu tur tam, mevcut v1 yedeği taşıyoruz; kişisel geçmişin içerdiği açık. |
| [Obsidian URI](https://help.obsidian.md/uri), [okunan kaynak](https://github.com/obsidianmd/obsidian-help/blob/master/en/Extending%20Obsidian/Obsidian%20URI.md) | Belirli not/başlığa bağlantı kurma, bir veri arşivini dışa aktarmaktan ayrı bir iş akışıdır. | Ders bağlantısını paylaşma ileride ayrı, küçük bir eylem olarak değerlendirilir; kişisel ilerleme URL'ye eklenmez. |

## Akış ve veri sınırı

1. **Profil → Yedek al**: o ana ait tek bir JSON snapshot oluşturulur. Ekranda
   test, cevap ve ders kaydı sayısı; tamamlanan dersler, adın dahil olduğu ve
   dosya boyutu gösterilir.
2. Açılabilir **İçeriği gör / elle kopyala** alanı tam dosyayı gösterir. Açık test
   oturumu, görünüm ve hareket tercihleri mevcut v1 biçiminde taşınmadığından
   bunlar ayrıca belirtilir. Eski sürümün hedef/sınav tercihleri aynen korunur.
3. **Dosyayı paylaş**, **Dosyayı indir** ve **Yedek metnini kopyala** ayrı
   kararlardır. Açılış hiçbir aktarım başlatmaz. Uygulama bir sunucuya göndermez;
   kullanıcı sistem panelinde seçtiği hedefe gönderebilir.
4. Başarı/iptal/başarısızlık dialog içinde anlaşılır. İndirme için doğrulanabilir
   iddia “başlatıldı”dır; OS dosya kaydını uygulama doğrulayamaz.
5. Kapatma, bekleyen asenkron UI bildirimini geçersiz kılar ve yedek JSON'unu
   gizli dialog DOM'undan temizler. Yeniden açılış güncel snapshot alır.
6. Diğer cihazda mevcut iki aşamalı geri yükleme önizlemesi ve birleştirme
   kullanılır. Yedek sürümü **1**; import doğrulaması/rollback/merge değişmez.

Native `<dialog>` odak, Escape ve modal sınırlarını sağlar. Hareket sistemi
başlık, gövde ve eylem etiketlerini ayrı sunar; gerçek hitbox ve veri eylemi
animasyonu beklemez. 320px'te tek sütun; geniş alanda iki dosya seçeneği aynı
satırda. Aktarım bir dashboard veya yeni profil sekmesi değildir.

## Doğrulama

- `tests/share.test.js`: snapshot değişmezliği, Türkçe metnin gerçek UTF-8
  boyutu, v1 round-trip, dosya tipi ve yetenek kontrolü, iptal/başarısızlık/handoff,
  clipboard reddi ve tam metnin korunması.
- `tests/transfer_browser.py`: gerçek tarayıcı indirmesinin JSON içeriği,
  depolamanın değişmemesi, iptal/hata sonrası otomatik indirme olmaması,
  320px'te elle kopyalama ve odak dönüşü, kapatılıp yeniden açılan dialoga eski
  Promise sonucunun yazmaması.
- Native OS paylaşım paneli bu ortamda simüle edilir. Gerçek iPhone/Safari,
  Android ve Windows paylaşım hedefi testi ayrıca gerekir.
