// Plain editable product copy. Layout does not depend on item counts.
// Rendered through textContent; see README.md for additions and real captures.
export const studyStages = [
  {
    id: "read", label: "Oku", icon: "book", capture: "article",
    title: "Kulağına doğru gelenin nedenini bul.",
    body: "Birbirine benzeyen kullanımları aynı makale içinde karşılaştır. İngilizce örnekler ve Türkçe açıklamalarla, anlamı değiştiren ayrıntıyı kendi hızında aç.",
    detail: "İstersen önce sezgini yokla. Dersin başındaki soru açık gelir; cevaplamadan okumaya geçebilirsin.",
    action: { label: "Bir derse göz at", href: "../index.html#egitim/tenses-present-perfect-vs-past-simple" },
    alt: "Present Perfect ve Past Simple ayrımını anlatan gerçek makale dersi",
  },
  {
    id: "apply", label: "Uygula", icon: "check-square", capture: "test",
    title: "Bir seçeneğin ötesine geç.",
    body: "Konunu ve soru sayını seç; istersen karışık çalış. Cevabından sonra doğru seçeneğin açıklamasını, diğer seçeneğin neden uymadığını ve yeniden kullanabileceğin ipucunu gör.",
    detail: "Test ve ders birbirinden kopuk değil. Açıklamanın işaret ettiği ayrıma geri dönebilirsin.",
    action: { label: "Test seçeneklerini aç", href: "../index.html#test" },
    alt: "Bir test sorusu, seçenekleri ve verilen cevabın açıklaması",
  },
  {
    id: "return", label: "Geri dön", icon: "refresh", capture: "results",
    title: "Sonucu bir sonraki adıma bağla.",
    body: "Cevaplarını incele, ilgili derse dön veya yanlışlarını yeniden çalış. Okuma konumun saklanır; yeniden başladığında nerede olduğunu aramak zorunda kalmazsın.",
    detail: "Yanlış defteri, bir soruyu farklı iki günde doğru cevaplayınca listeden çıkarır. Yeni bir yanlış bu ilerlemeyi sıfırlar.",
    action: { label: "Çalışma alanını aç", href: "../index.html#test" },
    alt: "Örnek test sonucunda doğru cevap sayısı ve soruları inceleme alanı",
  },
];

export const architecture = [
  {
    id: "content", label: "İçerik", icon: "book", subtitle: "Tipli JSON blokları",
    title: "Yeni bir ders, yeni bir arayüz gerektirmez.",
    body: "Karşılaştırma, kalıp, örnek ve kontrol gibi ders blokları içerik modelinde tanımlı. Aynı düzenleyici her dersi bu yapıdan oluşturuyor; şema doğrulaması ders ve soru eşleşmelerini denetliyor.",
    detail: "Metin, HTML dizeleri yerine güvenli DOM düğümleriyle gösteriliyor.",
    action: { label: "İçerik rehberini incele", href: "https://github.com/ErenDenizK/english-prep/blob/test/docs/CONTENT_GUIDE.md" },
  },
  {
    id: "interface", label: "Arayüz", icon: "check-square", subtitle: "HTML · CSS · ES modülleri",
    title: "Doğrudan çalışan, dikkatini koruyan bir katman.",
    body: "Derleme adımı veya çalışma zamanında paket bağımlılığı yok. Okuma alanı, soru davranışı ve menüler ayrı sorumluluklara sahip; telefon ile geniş ekran aynı öğrenme akışını paylaşıyor.",
    detail: "Hareket, durumu açıklıyor. Cevabı kaydetmek veya sonraki adımı açmak animasyonun bitmesini beklemiyor.",
    action: { label: "Arayüz kaynaklarını incele", href: "https://github.com/ErenDenizK/english-prep/tree/test/js" },
  },
  {
    id: "continuity", label: "Devamlılık", icon: "refresh", subtitle: "Tarayıcıda yerel kayıt",
    title: "Kaldığın yerin de bir mimarisi var.",
    body: "Okuma ve geçmiş localStorage’da, aktif testin doğrulanan kaydı sessionStorage’da tutuluyor. Service worker uygulama dosyalarını ve açılan içerikleri önbelleğe alıyor; yedekleme başka bir tarayıcıya geçişi mümkün kılıyor.",
    detail: "Otomatik cihaz eşitlemesi yok. Çevrimdışı erişim, içeriğin açılmış ve tarayıcı önbelleğinde kalmış olmasına bağlı.",
    action: { label: "Depolama uygulamasını incele", href: "https://github.com/ErenDenizK/english-prep/blob/test/js/storage.js" },
  },
];

export const everydayFeatures = {
  eyebrow: "Çalışma alanın",
  title: "Öğrenmeye yer açan ayrıntılar.",
  intro: "Dersin etrafındaki işler de düşünülmüş: bir soruda kalmak, sonra dönmek, verini saklamak ve istediğin ekranda devam etmek.",
  items: [
    { title: "Kaldığın yer durur.", body: "Okuma konumun tarayıcıda saklanır. Aktif testi aynı sekmede yenilersen, geçerli oturum kaydıyla soruların ve cevapların geri gelir.", label: "Devamlılık", icon: "bookmark" },
    { title: "Çalışmanın kapsamını sen seç.", body: "Bir konuya, dersteki belirli ayrıma, karışık sorulara veya yanlışlarına odaklan. Soru sayısını çalışmana göre belirle.", label: "Pratik", icon: "sliders" },
    { title: "Verin seninle kalsın.", body: "Hesap açman gerekmez. İlerleme bu tarayıcıda tutulur; yedek alıp başka bir tarayıcıya veya cihaza aktarabilirsin.", label: "Yerel veri", icon: "archive" },
    { title: "Bir uygulama gibi aç.", body: "Destekleyen tarayıcılarda ana ekranına ekle. Daha önce açılmış ve önbellekte kalan derslere internet yokken de dönebilirsin.", label: "PWA", icon: "install" },
    { title: "Telefonunda ve masanda.", body: "Küçük ekranda tek çalışma sütunu, geniş ekranda konu haritasına daha fazla alan. Derslerin satırları okumayı zorlaştıracak kadar genişlemez.", label: "Uyarlanabilir düzen", icon: "devices" },
    { title: "Ritmini kendin belirle.", body: "Koyu, açık veya sistem görünümünü seç. Hafif arka plan hareketini durdur; cihazının azaltılmış hareket tercihi her zaman önceliklidir.", label: "Görünüm ve hareket", icon: "spark" },
    { title: "Nerede olduğunu gör.", body: "Profil’de tamamladığın dersleri, çözdüğün soruları ve son cevaplarına dayanan doğruluğu izle. Okuma konumu ve test sonucu farklı göstergelerle anlatılır.", label: "İlerleme", icon: "bar-chart" },
    { title: "Akışı kısa bir turda tanı.", body: "İsteğe bağlı tanıtım, Eğitim ve Test ekranlarının nasıl birbirini tamamladığını adım adım gösterir. Adını eklemek de turu atlamak da sana bağlı.", label: "Başlangıç", icon: "route" },
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
    { label: "Tasarım kararını oku", href: "https://github.com/ErenDenizK/english-prep/blob/test/docs/adr/009-expressive-study-motion.md" },
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
