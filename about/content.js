// All editable copy for /about/. Rendered with textContent only (no HTML).
// The page's data-driven parts (the distinction map, the anatomy question,
// the corpus figures) come from ../data at runtime; nothing here duplicates
// a count that the data can state for itself. See README.md.

/* ---- Hero: the lens. Two correct sentences, two meanings. ----
 * Every pair must be a pair a competent speaker accepts BOTH halves of:
 * the point is that the ear is right twice and the meaning differs.
 * `topic` + `category` name a real lesson (lesson ids are derived). */
export const pairs = [
  {
    id: "perfect",
    question: "Bitti mi, şimdiye mi uzanıyor?",
    topic: "tenses",
    category: "Present Perfect vs Past Simple",
    diagram: "timeline",
    forms: [
      {
        name: "Past Simple",
        before: "I ", focus: "lost", after: " my keys.",
        state: "closed",
        reading: "Olay geçmişte bir noktada kalır. Cümle şimdiyle bağ kurmaz; anahtarlar çoktan bulunmuş da olabilir.",
      },
      {
        name: "Present Perfect",
        before: "I", focus: "’ve lost", after: " my keys.",
        state: "linked",
        reading: "Olayın sonucu şimdiye taşınır: anahtarlar hâlâ kayıp. Ardından “Can you help me?” gelmesi bu yüzden doğal.",
      },
    ],
  },
  {
    id: "aspect",
    question: "Alışkanlık mı, şu an mı?",
    topic: "tenses",
    category: "Present Simple vs Present Continuous",
    diagram: "timeline",
    forms: [
      {
        name: "Present Simple",
        before: "She ", focus: "works", after: " from home.",
        state: "habit",
        reading: "Genel düzen: işi böyle yürüyor. Dün de öyleydi, yarın da öyle olacak.",
      },
      {
        name: "Present Continuous",
        before: "She", focus: "’s working", after: " from home.",
        state: "ongoing",
        reading: "Şu an ya da bu aralar süren, geçici bir durum. Normalde ofise gidiyor olabilir.",
      },
    ],
  },
  {
    id: "obligation",
    question: "Yasak mı, serbest mi?",
    topic: "modals",
    category: "Must vs Have to vs Mustn't vs Don't Have to",
    diagram: "path",
    forms: [
      {
        name: "Mustn’t",
        before: "You ", focus: "mustn’t", after: " tell him.",
        state: "blocked",
        reading: "Yasak. Söylemek bir seçenek değil; yol kapalı.",
      },
      {
        name: "Don’t have to",
        before: "You ", focus: "don’t have to", after: " tell him.",
        state: "optional",
        reading: "Zorunluluk yok. Söylemesen de olur; istersen söylersin. İki yol da açık.",
      },
    ],
  },
];

/* ---- Manifesto: lit line by line as it is read. ---- */
export const manifesto = [
  "Dizileri altyazısız izliyorsun.",
  "Doğru olanı duyuyorsun.",
  "Ama sınav kâğıdında iki seçenek de kulağına doğru geldiğinde,",
  "karar verecek bir ölçüt gerekir.",
  "English Prep İngilizceyi sıfırdan anlatmaz.",
  "Zaten bildiklerinin arasındaki sınırı çizer.",
];

/* ---- The question whose anatomy is shown, read live from ../data. ---- */
export const anatomy = {
  topic: "tenses",
  questionId: "tenses-t5",
  callouts: [
    { part: "context", title: "Bağlam", body: "Sınavdaki gibi tek bir boşluk, gerçek bir cümlenin içinde. Kararı veren, cümlenin geri kalanı." },
    { part: "options", title: "Dört seçenek, tek doğru", body: "Yetkin bir öğretmenin kabul edeceği bir çeldirici yanlış sayılmaz; o seçenek yeniden yazılır." },
    { part: "notes", title: "Her yanlışın kendi notu", body: "Hangi seçeneği işaretlersen, o seçeneğin neden uymadığını okursun. Genel bir “yanlış” değil." },
    { part: "tip", title: "Taşınabilir ipucu", body: "Bu sorunun ötesinde de işe yarayan tek cümlelik bir kural." },
    { part: "lesson", title: "Derse dönüş", body: "Yanlışın, ayrımı anlatan derse bağlanır. Sonuç ekranından tek dokunuşla oraya gidersin." },
  ],
};

/* ---- Study loop, shown with real captures (assets/*-phone.webp). ---- */
export const flow = [
  {
    id: "read", step: "01", label: "Oku", capture: "article",
    title: "Ayrımı bir makalede gör.",
    body: "Her ders bir “X mi, Y mi?” sorusu üzerine kurulu. İngilizce örnekler, Türkçe açıklamalar, yan yana karşılaştırmalar ve araya serpilmiş kısa kontroller.",
    alt: "Present Perfect ile Past Simple ayrımını anlatan gerçek bir ders ekranı",
    href: "../index.html#egitim",
  },
  {
    id: "apply", step: "02", label: "Uygula", capture: "test",
    title: "Sezgini sına, gerekçesini oku.",
    body: "Konu testi, karışık test ya da yanlışlarından oluşan bir tur. Her cevaptan sonra doğru seçeneğin gerekçesi ve seçtiğin seçeneğin notu hemen gelir.",
    alt: "Bir test sorusu, seçenekleri ve verilen cevabın açıklaması",
    href: "../index.html#test",
  },
  {
    id: "return", step: "03", label: "Geri dön", capture: "results",
    title: "Yanlışını derse bağla.",
    body: "Sonuç ekranı her yanlışı ilgili derse bağlar. Yanlış defteri, bir soruyu iki farklı günde doğru cevaplayana kadar onu sende tutar.",
    alt: "Bir test sonucu: doğru sayısı, konu dağılımı ve soruları inceleme alanı",
    href: "../index.html#test",
  },
];

/* ---- Craft: claims the page proves on itself where it can. ---- */
export const craft = {
  springs: {
    title: "Hareket, yay fiziğiyle.",
    body: "Üç sönümlü yay bir kez hesaplanır ve tarayıcının kendi animasyon motoruna verilir. Aşağıdaki eğriler, uygulamanın şu an kullandığı eğrilerin ta kendisi.",
    names: { soft: "Yumuşak · içerik", lively: "Canlı · geçişler", bouncy: "Esnek · işaretler" },
  },
  contrast: {
    title: "Renkler gözle değil, ölçüyle.",
    body: "Her renk çifti bir kontrast hedefine göre çözülür ve her değişiklikte yeniden ölçülür. Bu oranlar, bu sayfanın renklerinden şu an hesaplandı.",
    pairs: [
      { label: "Metin", fg: "--ink", bg: "--page" },
      { label: "İkincil metin", fg: "--ink-2", bg: "--card" },
      { label: "Vurgu", fg: "--accent-text", bg: "--page" },
      { label: "Düğme", fg: "--accent-ink", bg: "--accent" },
    ],
  },
  facts: [
    { figure: "0", unit: "bağımlılık", body: "Derleme adımı yok, çalışma zamanında paket yok. HTML, CSS ve ES modülleri olduğu gibi sunuluyor." },
    { figure: "0", unit: "innerHTML", body: "İçerik JSON’dan gelir ve düğüm düğüm kurulur. Hiçbir metin HTML olarak yorumlanmaz." },
    { figure: "250", unit: "birim testi", body: "Puanlama, kayıt, yedekleme ve içerik kuralları. Her push’ta yeniden çalışır." },
    { figure: "3.500+", unit: "tarayıcı kontrolü", body: "Dört ekran genişliğinde tam bir öğrenci yolculuğu: taşma, dokunma alanı, odak, ekran okuyucu." },
  ],
  pipeline: {
    title: "İçerik, anahtarı görmeyen bir gözden geçer.",
    body: "Dersleri ve soruları ayrı oturumlar yazar. Sonra cevap anahtarı gizlenmiş bir inceleme gelir; incelemecinin kendisi önce cevabı bilinen on soruyla ölçülür.",
    steps: [
      { title: "Kategori tanımı", body: "Önce ayrımın sınırı yazılır, sonra sorular." },
      { title: "Yazım", body: "Ders ve sorular ayrı oturumlarda." },
      { title: "Kör inceleme", body: "Anahtar gizli, seçenekler karıştırılmış." },
      { title: "Kalibrasyon", body: "İncelemeci, cevabı bilinen 10 soruyla sınanır." },
    ],
  },
  privacy: {
    title: "Hesap yok. Sunucu yok. Verin, senin tarayıcında.",
    body: "İlerlemen yalnızca bu cihazda tutulur. Yedeğini dosya ya da metin olarak alır, başka bir cihazda geri yüklersin. Otomatik eşitleme yok; analitik yok.",
  },
};

export const questions = [
  { title: "Bu uygulama kimler için?", body: "İngilizceyle zaten bir teması olan, kulağı iyi ama dilbilgisi terimleriyle arası olmayanlar için. Sıfırdan bir dil kursu ya da bütün becerileri kapsayan bir sınav programı değildir." },
  { title: "Hangi sınava hazırlıyor?", body: "YTÜ İYS tarzı hazırlık yeterlik sınavlarının yazılı kısmını örnek aldı. Dinleme bölümü kapsam dışında; okuma ve paragraf tamamlama henüz eklenmedi." },
  { title: "İlerlemem başka cihazda görünür mü?", body: "Otomatik eşitleme yok. Profil’den yedek alıp diğer cihazda geri yükleyebilirsin. Tarayıcı verisini silmeden önce yedek almak iyi bir fikir." },
  { title: "İnternetsiz kullanabilir miyim?", body: "Uygulama dosyaları ve daha önce açtığın dersler önbellekte kaldığı sürece evet. Açmadığın her dersin indirilmiş olacağı garanti edilmez." },
  { title: "İçerik nasıl hazırlandı?", body: "Yapay zekâ desteğiyle yazıldı ve anahtarı görmeyen ayrı bir incelemeden geçti. Yine de hata içerebilir; her sorunun altındaki “Bu soruda bir sorun var” bağlantısıyla bildirebilirsin. Resmî bir üniversite ürünü değildir." },
];
