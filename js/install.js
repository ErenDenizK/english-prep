// Installation is offered only when the browser exposes it. There is no
// fake success state and no automatic prompt interrupting a lesson.
let deferredPrompt = null;
let installedThisSession = false;
const controls = new Set();

function refreshControls() {
  for (const control of controls) {
    if (control.wrap.isConnected) control.refresh();
    else controls.delete(control);
  }
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  refreshControls();
});
window.addEventListener("appinstalled", () => {
  deferredPrompt = null;
  installedThisSession = true;
  refreshControls();
});

export function createInstallControl() {
  const wrap = document.createElement("div");
  wrap.className = "stack stack--tight install-control";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn btn--secondary";
  button.textContent = "Uygulamayı yükle";
  const note = document.createElement("p");
  note.className = "t-quiet";
  note.setAttribute("role", "status");
  function refresh() {
    const installed = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
    button.hidden = installed || installedThisSession || !deferredPrompt;
    note.textContent = installed
      ? "English Prep uygulama olarak açık."
      : installedThisSession
        ? "English Prep yüklendi. Ana ekranından veya uygulamalarından açabilirsin."
      : deferredPrompt
        ? "Adres çubuğu olmadan, ayrı bir uygulama olarak aç. Daha önce okuduğun derslere çevrimdışı dön."
        : "Adres çubuğu olmadan kullanmak için uygulamayı ana ekranına ekle ve simgesinden aç. iPhone veya iPad’de tarayıcı menüsünden Paylaş’ı, sonra Ana Ekrana Ekle’yi seç; varsa “Web Uygulaması Olarak Aç” seçeneğini açık bırak. Diğer cihazlarda tarayıcının uygulama yükleme menüsünü kullan. Çevrimdışı erişim, daha önce açtığın içerikle sınırlıdır.";
  }
  button.addEventListener("click", async () => {
    if (!deferredPrompt || button.getAttribute("aria-disabled") === "true") return;
    const prompt = deferredPrompt;
    deferredPrompt = null;
    button.setAttribute("aria-disabled", "true");
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (installedThisSession) refresh();
      else note.textContent = choice.outcome === "accepted"
          ? "Yükleme isteği tarayıcıya iletildi."
          : "Yükleme iptal edildi. Tarayıcıdan çalışmaya devam edebilirsin.";
    } catch {
      note.textContent = "Yükleme açılamadı. Tarayıcının yükleme menüsünden tekrar deneyebilirsin.";
    } finally {
      button.hidden = true;
      button.removeAttribute("aria-disabled");
    }
  });
  // Profile can rerender repeatedly. Prune disconnected controls instead
  // of leaving a pair of document listeners behind on every field change.
  refreshControls();
  controls.add({ wrap, refresh });
  wrap.append(button, note);
  refresh();
  return wrap;
}
