// A short, optional tour of the two study modes. No dates, goals, account or
// automatic advance: each page explains a real part of the study workflow.
import { el } from "./dom.js";
import { icon } from "./icons.js";
import { createMotionControl } from "./motion.js";
import { getProfileName, setProfileName, setOnboarded } from "./storage.js";

const STEPS = [
  {
    mode: "Eğitim",
    heading: "Bildiğin İngilizceyi netleştir.",
    copy: "Konunu seç. Makale şeklindeki dersi kendi hızında oku; örneklerle benzer yapıları ayırt et.",
    preview: [
      { icon: "book", label: "Konunu seç", detail: "Tenses", english: true },
      { icon: "arrow-right", label: "Dersi oku", detail: "Present Perfect vs Past Simple", english: true },
      { icon: "check-square", label: "Kendini dene", detail: "Ders içindeki kısa sorularla ayrımı kontrol et." },
    ],
    note: "Dersler kaydırarak okunur. Kaldığın yere geri dönebilirsin.",
    next: "Testi tanı",
  },
  {
    mode: "Test",
    heading: "Cevabı seç. Nedenini öğren.",
    copy: "Bir konuyu çalış ya da karışık test aç. Her cevabın ardından açıklamayı incele; zorlandığın ayrımın dersine geri dön.",
    preview: [
      { icon: "check-square", label: "Soruyu çöz", detail: "Konu testi veya karışık test" },
      { icon: "book", label: "Açıklamayı incele", detail: "Doğru cevap ve seçeneklerin gerekçeleri" },
      { icon: "refresh", label: "Yanlışlarına dön", detail: "Yanlış defterinde yeniden çalış" },
    ],
    note: "Eğitim ve Test, alttaki iki sekmede. Profil ve ayarlar üstte.",
    next: "Devam et",
  },
  {
    mode: "Sana ait bir çalışma alanı",
    heading: "Hazırsan başlayalım.",
    copy: "Hesap açmana gerek yok. İstersen adını ekle; ilk dersini kendin seç.",
    next: "Uygulamayı aç",
  },
];

function preview(steps) {
  const list = el("ol", "onboard__preview");
  for (const [index, step] of steps.entries()) {
    const row = el("li", "onboard__preview-step");
    row.style.setProperty("--step-index", String(index));
    const symbol = el("span", "onboard__preview-icon");
    symbol.appendChild(icon(step.icon, { size: 22 }));
    const text = el("div", "onboard__preview-copy");
    text.appendChild(el("p", "t-ui", step.label));
    const detail = el("p", "t-body", step.detail);
    if (step.english) detail.lang = "en";
    text.appendChild(detail);
    row.append(symbol, text);
    list.appendChild(row);
  }
  return list;
}

export function renderOnboarding(container, { onDone }) {
  let step = 0;
  let name = getProfileName();
  const form = el("form", "onboard__tour");
  const top = el("div", "onboard__top");
  const brand = el("span", "brand-mark");
  brand.setAttribute("role", "img");
  brand.setAttribute("aria-label", "English Prep");
  brand.lang = "en";
  brand.append(el("span", "brand-mark__letters", "ep"), el("span", "brand-mark__dot", "."));
  const skip = el("button", "btn btn--quiet onboard__skip", "Tanıtımı geç");
  skip.type = "button";
  const utilities = el("div", "onboard__utilities");
  utilities.append(skip, createMotionControl({ compact: true }));
  top.append(brand, utilities);

  const progress = el("div", "onboard__progress");
  const stepText = el("p", "t-meta");
  const dots = el("div", "onboard__dots");
  dots.setAttribute("aria-hidden", "true");
  const indicators = STEPS.map(() => el("span", "onboard__dot"));
  dots.append(...indicators);
  progress.append(stepText, dots);
  const panel = el("section", "onboard__panel");
  panel.setAttribute("aria-labelledby", "onboard-step-title");
  const actions = el("div", "onboard__actions");
  const back = el("button", "btn btn--quiet", "Geri");
  back.type = "button";
  const next = el("button", "btn btn--primary");
  next.type = "submit";
  actions.append(back, next);
  form.append(top, progress, panel, actions);

  function finish() {
    setProfileName(name.trim());
    setOnboarded(true);
    document.dispatchEvent(new CustomEvent("profile:namechange"));
    onDone();
  }

  function show({ focus = false, direction = "forward" } = {}) {
    const current = STEPS[step];
    stepText.textContent = `${step + 1} / ${STEPS.length} · ${current.mode}`;
    for (const [index, indicator] of indicators.entries()) {
      indicator.dataset.current = String(index === step);
    }
    panel.dataset.direction = direction;
    panel.classList.remove("onboard__panel--enter");
    panel.replaceChildren();
    const heading = el("h1", "t-display", current.heading);
    heading.id = "onboard-step-title";
    heading.tabIndex = -1;
    panel.append(heading, el("p", "t-body onboard__description", current.copy));
    if (current.preview) {
      panel.appendChild(preview(current.preview));
      panel.appendChild(el("p", "t-quiet onboard__note", current.note));
    } else {
      const field = el("div", "stack stack--snug onboard__name");
      const label = el("label", "t-ui", "Adın · isteğe bağlı");
      label.htmlFor = "onboard-name";
      const input = el("input", "field");
      input.id = "onboard-name";
      input.type = "text";
      input.autocomplete = "given-name";
      input.maxLength = 40;
      input.value = name;
      input.placeholder = "Adın";
      input.setAttribute("aria-describedby", "onboard-privacy");
      input.addEventListener("input", () => { name = input.value; });
      const privacy = el("p", "t-meta", "Adın ve ilerlemen bu tarayıcıda saklanır. Profil'den yedek alabilirsin.");
      privacy.id = "onboard-privacy";
      field.append(label, input, privacy);
      panel.appendChild(field);
    }
    back.hidden = step === 0;
    next.textContent = current.next;
    // Only restart the finite panel cue. No timer delays the route or focus.
    void panel.offsetWidth;
    panel.classList.add("onboard__panel--enter");
    if (focus) {
      container.closest(".shell__scroll")?.scrollTo({ top: 0 });
      heading.focus({ preventScroll: true });
    }
  }

  skip.addEventListener("click", finish);
  back.addEventListener("click", () => {
    if (step > 0) {
      step -= 1;
      show({ focus: true, direction: "back" });
    }
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (step === STEPS.length - 1) {
      finish();
    } else {
      step += 1;
      show({ focus: true });
    }
  });
  container.replaceChildren(form);
  show();
}
