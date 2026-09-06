# Soğuk çözüm — insan için

`docs/agents/` altındaki diğer belgeler yapay zekâ oturumlarına yazılmış
brief'ler. Bu değil. Bu, **bir insanın klavye başında yapacağı tek iş**
için, ve bu proje boyunca devredilemeyen tek adım o.

Türkçe, çünkü okuyacak olanlar Türkçe okuyor.

---

## Neden var

Bu külliyatta üç ayrı savunma hattı var ve üçü de aynı kusuru göremiyor.

- `npm run check` şemayı, biçimi, kontrastı ve tutarlılığı doğruluyor.
  **İki savunulabilir cevabı olan bir soruyu göremez** — çünkü ikisi de
  geçerli İngilizce.
- Soruyu yazan model de göremez: cevabı zaten biliyor, o yüzden kendi
  çeldiricisine "olur mu acaba" diye bakmıyor.
- Bir konu dosyasının tamamını okuyan inceleyici, dördüncü soruda artık
  soruyu değil **yazarı okuyor**. Kalıbı öğreniyor ve isabet oranı
  yükseliyor — ama bulduğu kusur sayısı düşüyor.

Geriye tek bir şey kalıyor: yetkin bir insanın, anahtarı görmeden,
soruyu gerçekten çözmesi.

**Ölçüldü: soru başına ~7 dakika, 241 soru için ~28 saat.** Bu, projenin
gerçek bilançosu (`docs/business/vision.md` §4).

---

## Nasıl çalıştırılır

```bash
npm run solve                          # 8 çözülmemiş soru, tüm külliyat
npm run solve -- --topic modals        # tek konu
npm run solve -- --count 20 --solver deniz
npm run solve -- --all                 # çözülmüşleri de aç
npm run solve -- --report              # sadece defter, soru sorma
```

Cevap: `a` `b` `c` `d`. `s` atlar, `q` kaydedip çıkar. Terminali
kapatmak da kaydeder.

**Ve asıl önemli tuş:** cevabın sonuna `?` ekle — `b?` — yani *"ben b
dedim ama başka bir şık da savunulabilir."*

Şıklar karıştırılıyor, kategori gizli, açıklama ancak cevapladıktan
sonra çıkıyor.

---

## Ne aranıyor

Puan değil. **Puan bir yan ürün.** Aranan üç şey var:

**1. Anahtarla uyuşmama.** Sen bir şey seçtin, anahtar başka bir şey
diyor. İki ihtimal var ve ikisi de bulgu: ya anahtar yanlış, ya soru
ayırt etmiyor.

**2. `?` işareti.** Doğru cevabı verdin ve yine de başka bir şık
savunulabilir görünüyor. **Bu, bir puanlama sisteminin çöpe atacağı tek
bilgi ve muhtemelen en değerlisi.** Bu projenin kuralı zaten şu:
*yetkin bir öğretmenin kabul edeceği bir şık, yanlış bir şıktır* — daha
az doğal bir şık değil.

**3. Paragrafsız çözülebilme.** Şıklara bakıp paragrafı okumadan doğru
cevabı bulabildiysen, o soru dilbilgisini değil şık yazımını ölçüyor.
Bunu `?` ile işaretle.

---

## İki kişi olmanın anlamı

Aynı soruyu iki kişinin ayrı ayrı çözmesi **tekrar değil**. İkinizin de
anahtarla aynı fikirde olduğu bir soru, tek kişinin onayladığı sorudan
çok daha güçlü bir kanıt; ayrıldığınız bir soru ise neredeyse kesin bir
bulgu.

Araç bunu bilerek destekliyor: `--solver` adını değiştirince aynı sorular
yeniden açılıyor.

**Ve ikinci çözücü bir katkı değil, bir rol.** İçerik yazmak külliyatın
tek standartta olma özelliğini bozar ve telif sorusunu hemen açar
(`docs/business/licensing.md` §5). Çözmek hiçbirini yapmaz — sadece
önemli olan tek sayıyı yarıya indirir.

---

## Ne zaman

**Sattığın her şeyi, satmadan önce.** Hepsini değil — ücretli katmanın
gerçekten içerdiği kadarını.

Ücretsiz bir uygulamada yanlış soru bir omuz silkmedir. Ücretli bir
uygulamada iade, pazar günü gelen bir mesaj, ve bu projenin bütün
kimliğinin üzerine kurulu olduğu tek şeyin çürümesi.

Gerçekçi tempo: **akşam bir saat, ~8 soru.** Haftada bir konu, ya da bir
ay akşamlarda bütün külliyat.

---

## Bulgu çıkınca

Aracın işi bulguyu **kaydetmek**, düzeltmek değil.
`docs/audit/solve-log.json` ekleme-yalnızca bir dosya; her satır bir
çözüm. `npm run solve -- --report` uyuşmayanları ve işaretlenenleri
listeler.

Düzeltme ayrı bir tur, ve bu projenin kendi kuralı geçerli: **onarımı
yazan oturum onaylayamaz.** Şu ana kadarki onarım turlarının beşi yeni
bir kusur getirdi ve hepsi ancak bağımsız bir yeniden denetimde
yakalandı.

---

## Kaydın biçimi

```json
{
  "version": 1,
  "entries": [
    {
      "id": "modals-t19",
      "topicId": "modals",
      "solver": "deniz",
      "date": "2026-09-06T06:25:08.444Z",
      "chose": "ought to",
      "key": "ought to",
      "agreed": true,
      "flagged": false
    }
  ]
}
```

Ekleme-yalnızca: aynı soruyu tekrar çözmek eski satırı silmez, yenisini
ekler. Rapor her (soru, çözücü) çifti için **en son** satırı sayar — yani
düzeltilmiş bir soruyu yeniden çözmek bulguyu kapatır ve iz kaybolmaz.
