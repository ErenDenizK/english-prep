// A short, optional tour of the two study modes. No dates, goals, account or
// automatic advance: each page explains a real part of the study workflow.
import { el } from "./dom.js";
import { icon } from "./icons.js";
import { createBrand } from "./brand.js";
import { getProfileName, setProfileName, setOnboarded } from "./storage.js";

const STEPS = [
  {
    mode: "Eğitim",
    heading: "Bildiğin İngilizceyi netleştir.",
    copy: "Konu seç. Makale şeklindeki dersi oku; kısa sorularla ayrımı kontrol et.",
    scenes: [
      { label: "Konu", drawing: "topics", caption: "İhtiyacın olan konudan başla. Ders sırası sana bağlı." },
      { label: "Ders", drawing: "article", caption: "Dersi kaydırarak oku. Kaldığın yere sonra geri dön." },
      { label: "Kontrol", drawing: "check", caption: "Kısa sorularla kendini dene; istersen atlayıp okumaya devam et." },
    ],
    next: "Testi tanı",
  },
  {
    mode: "Test",
    heading: "Cevabı seç. Nedenini öğren.",
    copy: "Konu testi ya da karışık test aç. Her cevabın ardından gerekçesini incele.",
    scenes: [
      { label: "Soru", drawing: "question", caption: "Bir seçenek seç. Cevabın ve açıklaması hemen görünür." },
      { label: "Açıklama", drawing: "reason", caption: "Nedenini anla; gerektiğinde ilgili derse geri dön." },
      { label: "Tekrar", drawing: "return", caption: "Zorlandığın soruları yanlış defterinden yeniden çalış." },
    ],
    next: "Devam et",
  },
  {
    mode: "Sana ait bir çalışma alanı",
    heading: "Hazırsan başlayalım.",
    copy: "Hesap açmana gerek yok. İstersen adını ekle; ilk dersini kendin seç.",
    next: "Uygulamayı aç",
  },
];

const SVG_NS = "http://www.w3.org/2000/svg";

function shape(tag, attributes, className = "") {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, String(value));
  if (className) node.setAttribute("class", className);
  return node;
}

/** Abstract diagrams only: no invented question, answer, lesson or score. */
function drawScene(kind) {
  const svg = shape("svg", {
    viewBox: "0 0 280 112", fill: "none", stroke: "currentColor",
    "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round",
    "aria-hidden": "true", focusable: "false",
  }, "onboard-flow__drawing");
  const paper = shape("g", {}, "onboard-flow__paper");
  const rect = (x, y, width, height, className = "onboard-flow__sheet") =>
    shape("rect", { x, y, width, height, rx: 7 }, className);
  const line = (d, className = "onboard-flow__line") => shape("path", { d }, className);
  const dot = (x, y, r = 3, className = "onboard-flow__dot") => shape("circle", { cx: x, cy: y, r }, className);

  if (kind === "topics") {
    for (const [i, width] of [91, 112, 74].entries()) {
      const y = 11 + i * 31;
      paper.append(rect(37, y, 206, 25), dot(52, y + 12),
        line(`M65 ${y + 12}h${width}`), line(`m221 ${y + 8} 4 4-4 4`, "onboard-flow__accent"));
    }
    svg.append(paper, line("M26 22v65", "onboard-flow__stroke onboard-flow__accent"));
  } else if (kind === "article") {
    paper.append(rect(77, 11, 132, 94, "onboard-flow__back-sheet"), rect(68, 4, 132, 94),
      line("M83 21h56", "onboard-flow__accent"), line("M83 36h99M83 45h88M83 69h91M83 78h78"),
      shape("rect", { x: 82, y: 51, width: 100, height: 10, rx: 3 }, "onboard-flow__highlight"),
      line("M83 56h99", "onboard-flow__stroke onboard-flow__accent"));
    svg.append(paper, line("M227 37v38m-5-5 5 5 5-5", "onboard-flow__stroke onboard-flow__accent"));
  } else if (kind === "check" || kind === "question") {
    paper.append(rect(48, 5, 184, 98), line("M64 21h118M64 30h92"));
    for (const [i, width] of [84, 107, 70].entries()) {
      const y = 48 + i * 18;
      paper.append(shape("circle", { cx: 68, cy: y, r: 4 }, "onboard-flow__line"), line(`M82 ${y}h${width}`));
    }
    svg.append(paper);
    if (kind === "check") {
      svg.append(line("m65 66 3 3 5-6", "onboard-flow__stroke onboard-flow__accent"));
      svg.append(line("M241 52h13m-4-4 4 4-4 4", "onboard-flow__stroke onboard-flow__accent"));
    } else {
      svg.append(dot(68, 48, 2, "onboard-flow__dot onboard-flow__selection"));
      svg.append(line("M246 23v20m-4-4 4 4 4-4", "onboard-flow__stroke onboard-flow__accent"));
    }
  } else if (kind === "reason") {
    paper.append(rect(43, 10, 194, 92),
      line("m59 28 4 4 8-10", "onboard-flow__accent"), line("M82 27h73"),
      line("M59 47h157M59 58h144M59 69h154M59 80h92"));
    svg.append(paper, line("M59 89h70", "onboard-flow__stroke onboard-flow__accent"));
  } else {
    paper.append(rect(91, 15, 113, 82, "onboard-flow__back-sheet"), rect(78, 8, 113, 82),
      line("M94 26h62M94 42h78M94 53h66M94 64h73"));
    svg.append(paper, line("M214 31c23 17 22 46 0 59M214 90l2-11m-2 11 11-2",
      "onboard-flow__stroke onboard-flow__accent"),
      line("M57 79C33 59 35 30 57 19M57 19l-2 11m2-11-11 2", "onboard-flow__stroke onboard-flow__accent"));
  }
  return svg;
}

function flowPreview(current, selected, onSelect) {
  const preview = el("div", "onboard-flow");
  const head = el("div", "onboard-flow__head");
  head.append(el("p", "t-meta", "Akış önizlemesi"), el("span", "t-meta onboard-flow__hint", "Dokun, keşfet"));
  const choices = el("div", "onboard-flow__choices");
  choices.setAttribute("role", "group");
  choices.setAttribute("aria-label", `${current.mode} akışını keşfet`);
  const scene = el("div", "onboard-flow__scene");
  scene.setAttribute("aria-hidden", "true");
  const caption = el("p", "onboard-flow__caption");
  caption.setAttribute("role", "status");
  caption.setAttribute("aria-live", "polite");
  caption.setAttribute("aria-atomic", "true");
  const navigation = el("div", "onboard-flow__navigation");
  navigation.setAttribute("aria-hidden", "true");
  for (const [name, glyph] of [["Eğitim", "book"], ["Test", "check-square"]]) {
    const mode = el("span", "onboard-flow__mode");
    mode.dataset.selected = String(name === current.mode);
    mode.append(icon(glyph, { size: 20 }), el("span", "", name));
    navigation.appendChild(mode);
  }
  const buttons = current.scenes.map((item, index) => {
    const button = el("button", "onboard-flow__choice", item.label);
    button.type = "button";
    button.addEventListener("click", () => {
      if (selected === index) return;
      selected = index;
      onSelect(index);
      paint();
    });
    choices.appendChild(button);
    return button;
  });
  function paint() {
    buttons.forEach((button, index) => button.setAttribute("aria-pressed", String(index === selected)));
    preview.dataset.scene = current.scenes[selected].drawing;
    scene.replaceChildren(drawScene(current.scenes[selected].drawing));
    caption.textContent = current.scenes[selected].caption;
  }
  paint();
  preview.append(head, choices, scene, caption, navigation);
  return preview;
}

export function renderOnboarding(container, { onDone }) {
  let step = 0;
  let name = getProfileName();
  const sceneSelection = [0, 0];
  const form = el("form", "onboard__tour");
  const top = el("div", "onboard__top");
  const brand = createBrand({ variant: "compact" });
  const skip = el("button", "btn btn--quiet onboard__skip", "Tanıtımı geç");
  skip.type = "button";
  top.append(brand, skip);

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

  function show({ focus = false } = {}) {
    const current = STEPS[step];
    stepText.textContent = `${step + 1} / ${STEPS.length} · ${current.mode}`;
    for (const [index, indicator] of indicators.entries()) {
      indicator.dataset.current = String(index === step);
    }
    panel.replaceChildren();
    const heading = el("h1", "t-display", current.heading);
    heading.id = "onboard-step-title";
    heading.tabIndex = -1;
    panel.append(heading, el("p", "t-body onboard__description", current.copy));
    if (current.scenes) {
      const page = step;
      panel.appendChild(flowPreview(current, sceneSelection[page], (index) => { sceneSelection[page] = index; }));
      panel.appendChild(el("p", "t-quiet onboard__note", "İki sekme altta, profil ve ayarlar üstte."));
    } else {
      const wordmark = createBrand({ variant: "full" });
      wordmark.classList.add("onboard__wordmark");
      panel.appendChild(wordmark);
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
    next.replaceChildren(el("span", "", current.next), icon("arrow-right", { size: 20 }));
    // Only the decorative scene enters. Text, state and focus commit now.
    if (focus) {
      container.closest(".shell__scroll")?.scrollTo({ top: 0 });
      heading.focus({ preventScroll: true });
    }
  }

  skip.addEventListener("click", finish);
  back.addEventListener("click", () => {
    if (step > 0) {
      step -= 1;
      show({ focus: true });
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
