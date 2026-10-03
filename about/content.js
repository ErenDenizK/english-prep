// Edit the text and append items here. Layout does not depend on item counts.
// Plain strings are rendered as text, never as HTML. See README.md for examples.
export const tourScreens = [
  {
    id: "education", label: "Eğitim", title: "Eksik olduğun ayrımdan başla.",
    body: "Konulara göz at, bir kavram ara ya da kaldığın derse dön. Baştan sona bir kursu tamamlamak zorunda değilsin; ihtiyacın olan noktayı seç.",
    detail: "Konu haritası · arama · okuma konumu",
    action: { label: "Konuları keşfet", href: "../index.html#egitim" },
    alt: "Eğitim ekranında konu haritası, ders araması ve okumaya devam etme alanı",
  },
  {
    id: "article", label: "Ders", title: "Birbirine benzeyenin farkını gör.",
    body: "Kaydırarak okunan dersler; karşılaştırmalar, İngilizce örnekler, Türkçe açıklamalar ve sık yapılan hatalar. Önce kendini yokla, sonra konuyu kendi hızında aç.",
    detail: "Makale akışı · örnekler · isteğe bağlı kontroller",
    action: { label: "Örnek dersi aç", href: "../index.html#egitim/tenses-present-perfect-vs-past-simple" },
    alt: "Present Perfect ve Past Simple ayrımını anlatan makale dersinin gerçek uygulama görünümü",
  },
  {
    id: "test", label: "Test", title: "Cevabının arkasındaki mantığı öğren.",
    body: "Konu seçerek ya da karışık çalış. Cevabın ardından açıklamayı oku; hangi ayrıntının doğru seçeneği belirlediğini ve diğer seçeneğin neden uymadığını gör.",
    detail: "Konu testi · karışık test · açıklamalı cevaplar",
    action: { label: "Bir test başlat", href: "../index.html#test" },
    alt: "İngilizce soru, cevap seçenekleri ve cevap açıklaması bulunan test görünümü",
  },
  {
    id: "results", label: "Sonuç", title: "Bir sayıdan sonra ne yapacağın belli.",
    body: "Cevaplarını gözden geçir, ilgili derse dön ve yanlışlarını yeniden çalış. Sonuç, bir sonraki çalışma adımına açılan bir kapı.",
    detail: "Cevap inceleme · ilgili ders · yanlış defteri",
    action: { label: "Testleri keşfet", href: "../index.html#test" },
    alt: "Bir örnek testin doğru ve cevaplanan soru sayıları ile soru inceleme alanı",
  },
];

export const learningStory = {
  eyebrow: "Çalışmanın akışı",
  title: "Sezgiden açıklığa, adım adım.",
  intro: "İngilizceyi zaten kullanıyorsun. Burada amaç, kulağına doğru gelen şeyin neden doğru olduğunu ve benzer kullanımların nerede ayrıldığını anlamak.",
  items: [
    { title: "Sezgini yokla.", body: "Dersin başındaki soruyla ne düşündüğünü gör. İstersen doğrudan okumaya geç; bir kontrol sorusu hiçbir dersi kilitlemez.", tone: "sakura" },
    { title: "Ayrımı oku.", body: "Kısa ezber kartları yerine, bir konuyu taşıyan makale akışı. Kalıplar, karşılaştırmalar ve örnekler aynı açıklamanın parçalarıdır.", tone: "iris" },
    { title: "Uygula, nedenini gör.", body: "Soruyu cevapla. Doğru cevabın açıklamasını, seçeneğin neden uymadığını ve başka sorulara taşıyabileceğin ipucunu oku.", tone: "apricot" },
    { title: "Gereken yere dön.", body: "Sonuçtan ilgili derse geç ya da Yanlış defteri’ni aç. Bir soruyu farklı iki günde doğru cevapladığında tekrar listesinden çıkar; yeni bir yanlış bu ilerlemeyi sıfırlar.", tone: "sakura" },
  ],
};

export const everydayFeatures = {
  eyebrow: "Çalışma alanın",
  title: "Öğrenmeye yer açan ayrıntılar.",
  intro: "Dersin etrafındaki işler de düşünülmüş: bir soruda kalmak, sonra dönmek, verini saklamak ve istediğin ekranda devam etmek.",
  items: [
    { title: "Kaldığın yer durur.", body: "Okuma konumun tarayıcıda saklanır. Aktif testi aynı sekmede yenilersen, geçerli oturum kaydıyla soruların ve cevapların geri gelir.", label: "Devamlılık" },
    { title: "Çalışmanın kapsamını sen seç.", body: "Bir konuya, dersteki belirli ayrıma, karışık sorulara veya yanlışlarına odaklan. Soru sayısını çalışmana göre belirle.", label: "Pratik" },
    { title: "Verin seninle kalsın.", body: "Hesap açman gerekmez. İlerleme bu tarayıcıda tutulur; yedek alıp başka bir tarayıcıya veya cihaza aktarabilirsin.", label: "Yerel veri" },
    { title: "Bir uygulama gibi aç.", body: "Destekleyen tarayıcılarda ana ekranına ekle. Daha önce açılmış ve önbellekte kalan derslere internet yokken de dönebilirsin.", label: "PWA" },
    { title: "Telefonunda ve masanda.", body: "Küçük ekranda tek çalışma sütunu, geniş ekranda konu haritasına daha fazla alan. Derslerin satırları okumayı zorlaştıracak kadar genişlemez.", label: "Uyarlanabilir düzen" },
    { title: "Ritmini kendin belirle.", body: "Koyu, açık veya sistem görünümünü seç. Hafif arka plan hareketini durdur; cihazının azaltılmış hareket tercihi her zaman önceliklidir.", label: "Görünüm ve hareket" },
    { title: "Nerede olduğunu gör.", body: "Profil’de tamamladığın dersleri, çözdüğün soruları ve son cevaplarına dayanan doğruluğu izle. Okuma konumu ve test sonucu farklı göstergelerle anlatılır.", label: "İlerleme" },
    { title: "Akışı kısa bir turda tanı.", body: "İsteğe bağlı tanıtım, Eğitim ve Test ekranlarının nasıl birbirini tamamladığını adım adım gösterir. Adını eklemek de turu atlamak da sana bağlı.", label: "Başlangıç" },
  ],
};

export const engineering = {
  eyebrow: "Ürünün arkasında",
  title: "Sade görünen deneyimin düşünülmüş yapısı.",
  intro: "İçeriğin, arayüzün ve yerel verinin sorumlulukları ayrılıyor. Böylece yeni bir ders eklemek, uygulamanın davranışını yeniden yazmayı gerektirmiyor.",
  items: [
    { title: "Doğrudan çalışan web", body: "HTML, CSS ve ES modülleri. Derleme adımı, hesap sunucusu veya çalışma zamanında paket bağımlılığı yok. GitHub Pages üzerinden sunuluyor." },
    { title: "İçerik bir veri modeli", body: "Dersler ve sorular tipli JSON bloklarında. Şema doğrulaması konu, ders ve soru eşleşmelerini denetliyor; içerik güvenli DOM düğümleriyle ekrana taşınıyor." },
    { title: "Devam ve kurtarma", body: "İlerleme localStorage’da, aktif testin doğrulanan anlık kaydı sessionStorage’da tutuluyor. Yedek içe aktarma, var olan ilerlemeyi koruyan birleştirme ve hata durumunda yeniden deneme sunuyor." },
    { title: "Sınırları belli çevrimdışı erişim", body: "Service worker, uygulama dosyalarıyla ziyaret edilen içeriği ayrı önbelleklerde saklıyor. Eski sürümün önbelleği ayrı; tarayıcının veriyi silebilmesi gibi sınırlar gizlenmiyor." },
    { title: "Karar, ölçüm, doğrulama", body: "Yazı rolleri, sakura paleti ve hareket dili tasarım kararlarında belgeli. Renk çiftleri ölçülüyor; klavye, dar ekran, metin büyütme ve çalışma akışları tarayıcı kontrolleriyle inceleniyor." },
    { title: "Geçmişi silmeden yenileme", body: "Özgün dersler ve sorular korunuyor. Önceki uygulama arayüzü ayrı bir yolda çalışmaya devam ediyor; tasarım değişikliği öğrenme materyalini ortadan kaldırmıyor." },
  ],
  links: [
    { label: "Kaynak kodunu incele", href: "https://github.com/ErenDenizK/english-prep/tree/test" },
    { label: "Tasarım kararını oku", href: "https://github.com/ErenDenizK/english-prep/blob/test/docs/adr/007-sakura-and-purposeful-motion.md" },
    { label: "Doğrulama raporu", href: "https://github.com/ErenDenizK/english-prep/blob/test/docs/VALIDATION.md" },
  ],
};

export const questions = [
  { title: "Bu uygulama kimler için?", body: "İngilizceyle zaten bir teması olan; benzer dilbilgisi ve anlam kullanımlarını akademik olarak ayırt etmek isteyenler için. Sıfırdan başlayan bir dil kursu veya bütün becerileri kapsayan bir sınav hazırlık programı değildir." },
  { title: "İlerlemem başka cihazda görünür mü?", body: "Otomatik eşitleme yok. İlerleme kullandığın tarayıcıda saklanır. Profil’den yedek alıp diğer cihazda içe aktarabilirsin. Tarayıcı verisini silmeden önce yedek almak iyi bir fikirdir." },
  { title: "İnternetsiz kullanabilir miyim?", body: "Uygulama dosyaları ve daha önce açtığın içerik önbellekte kaldığı sürece kullanılabilir. Henüz açılmamış her dersin indirildiği veya tarayıcının veriyi süresiz saklayacağı garanti edilmez. Yükleme tek başına tüm içeriği indirmez." },
  { title: "İçeriğin kaynağı nedir?", body: "YTÜ İYS örnekleri temel alınarak yapay zekâ desteğiyle hazırlanıp gözden geçirildi. Hata içerebilir; soru bildirim akışıyla sorunları paylaşabilirsin. Bütün sınav bölümlerini kapsamaz ve resmî bir üniversite ürünü değildir." },
];

// Optional full sections. Append { eyebrow, title, intro, items: [...] } objects
// to extend the product story without changing the renderer or CSS.
export const extraSections = [];
