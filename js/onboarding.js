// The first run — `#hosgeldin`.
//
// Not a tour. The evidence against tours stands (see renderWelcome in
// js/education.js): they interrupt, teach nothing that lasts and make an
// app feel harder. This asks for the three facts the home screen is built
// from — when the exam is, how many questions a day, what to call you —
// and lets the theme be chosen where it can be seen. Four steps, one
// question each, a progress line, and a way to skip at every one; the
// answers are all editable later in Profil.
//
// A learner with any history is marked onboarded on load and never sees
// this (js/home.js). It is reachable again from Profil.

import { el } from "./dom.js";
import { icon } from "./icons.js";
import { choices } from "./widgets.js";
import { announce, scrollToTop } from "./shell.js";
import { getTheme, setTheme, THEME_LABELS } from "./theme.js";
import {
  getProfileName,
  setProfileName,
  getExamDate,
  setExamDate,
  getDailyGoal,
  setDailyGoal,
  DAILY_GOAL_OPTIONS,
  setOnboarded,
} from "./storage.js";

const STEPS = 4;

/** Minutes a goal costs, from the measured seven minutes an item [≈]. */
const GOAL_SUBS = {
  5: "Hafif — günde üç dakika",
  10: "Dengeli — günde altı dakika",
  20: "Yoğun — günde on iki dakika",
};

/**
 * @param {HTMLElement} container
 * @param {{onDone: () => void}} options
 */
export function renderOnboarding(container, { onDone }) {
  const draft = {
    examDate: getExamDate(),
    goal: getDailyGoal(),
    name: getProfileName(),
    theme: getTheme(),
  };
  let step = 0;

  function finish() {
    setExamDate(draft.examDate);
    setDailyGoal(draft.goal);
    setProfileName(draft.name.trim());
    document.dispatchEvent(new CustomEvent("profile:namechange"));
    setOnboarded(true);
    onDone();
  }

  function skip() {
    setOnboarded(true);
    onDone();
  }

  function go(next) {
    step = Math.max(0, Math.min(STEPS - 1, next));
    paint();
    scrollToTop();
    container.querySelector("h1, h2")?.focus?.();
  }

  function steps() {
    const line = el("div", "onboard__steps");
    line.setAttribute("role", "progressbar");
    line.setAttribute("aria-valuemin", "1");
    line.setAttribute("aria-valuemax", String(STEPS));
    line.setAttribute("aria-valuenow", String(step + 1));
    line.setAttribute("aria-label", `Adım ${step + 1} / ${STEPS}`);
    for (let i = 0; i < STEPS; i += 1) {
      line.appendChild(el("span", i <= step ? "onboard__step onboard__step--done" : "onboard__step"));
    }
    return line;
  }

  function head(title, line) {
    const wrap = el("div", "stack stack--tight");
    const heading = el("h2", "t-title", title);
    heading.tabIndex = -1;
    wrap.appendChild(heading);
    if (line) {
      wrap.appendChild(el("p", "t-body", line));
    }
    return wrap;
  }

  function actions(primaryLabel, onPrimary, quietLabel, onQuiet) {
    const wrap = el("div", "onboard__actions");
    const primary = el("button", "btn btn--primary", primaryLabel);
    primary.type = "button";
    primary.addEventListener("click", onPrimary);
    wrap.appendChild(primary);
    if (quietLabel) {
      const quiet = el("button", "btn btn--quiet", quietLabel);
      quiet.type = "button";
      quiet.addEventListener("click", onQuiet);
      wrap.appendChild(quiet);
    }
    return wrap;
  }

  function topRow() {
    const row = el("div", "cluster cluster--spread");
    if (step > 0) {
      const back = el("button", "btn btn--quiet");
      back.type = "button";
      back.appendChild(icon("arrow-left", { size: 20 }));
      back.appendChild(document.createTextNode("Geri"));
      back.addEventListener("click", () => go(step - 1));
      row.appendChild(back);
    } else {
      row.appendChild(el("span"));
    }
    const skipButton = el("button", "btn btn--quiet", "Atla");
    skipButton.type = "button";
    skipButton.addEventListener("click", skip);
    row.appendChild(skipButton);
    return row;
  }

  function stepWelcome() {
    const screen = el("div", "stack stack--loose animate-in");
    const orb = el("div", "onboard__orb");
    orb.appendChild(icon("book-fill", { size: 64 }));
    screen.appendChild(orb);
    const text = el("div", "stack stack--tight");
    text.style.textAlign = "center";
    const title = el("h1", "t-display", "English Prep");
    title.lang = "en";
    title.tabIndex = -1;
    text.appendChild(title);
    text.appendChild(
      el(
        "p",
        "t-lead",
        "Yeterlik sınavı için dersler, paragraf soruları ve yanlış defteri. Hesap yok; her şey bu telefonda kalır."
      )
    );
    screen.appendChild(text);
    screen.appendChild(actions("Başla", () => go(1), "Zaten kullanıyorum, atla", skip));
    return screen;
  }

  function stepExam() {
    const screen = el("div", "stack stack--loose animate-in");
    screen.appendChild(topRow());
    screen.appendChild(
      head("Sınav ne zaman?", "Ana ekranda geri sayım olarak görünür. Bilmiyorsan boş bırak; sonra Profil'den girersin.")
    );
    const label = el("label", "t-label", "Sınav tarihi");
    label.htmlFor = "onboard-exam-date";
    screen.appendChild(label);
    const field = document.createElement("input");
    field.type = "date";
    field.id = "onboard-exam-date";
    field.className = "field";
    field.value = draft.examDate ?? "";
    field.addEventListener("change", () => {
      draft.examDate = field.value || null;
    });
    screen.appendChild(field);
    screen.appendChild(
      actions(
        "Devam",
        () => go(2),
        "Bilmiyorum",
        () => {
          draft.examDate = null;
          go(2);
        }
      )
    );
    return screen;
  }

  function stepGoal() {
    const screen = el("div", "stack stack--loose animate-in");
    screen.appendChild(topRow());
    const heading = head("Günde kaç soru?", "Küçük ve her gün, büyük ve ara sıradan daha çok işe yarar. Sonra değiştirebilirsin.");
    heading.querySelector("h2").id = "onboard-goal-label";
    screen.appendChild(heading);
    screen.appendChild(
      choices({
        options: DAILY_GOAL_OPTIONS.map((n) => ({ value: String(n), label: `${n} soru`, sub: GOAL_SUBS[n] })),
        value: String(draft.goal),
        onChange: (value) => {
          draft.goal = Number(value);
        },
        labelledBy: "onboard-goal-label",
        card: true,
      }).element
    );
    screen.appendChild(actions("Devam", () => go(3)));
    return screen;
  }

  function stepYou() {
    const screen = el("div", "stack stack--loose animate-in");
    screen.appendChild(topRow());
    screen.appendChild(head("Sana nasıl seslenelim?", "İsteğe bağlı. Sadece bu cihazda saklanır."));
    const label = el("label", "t-label", "Adın");
    label.htmlFor = "onboard-name";
    screen.appendChild(label);
    const field = document.createElement("input");
    field.type = "text";
    field.id = "onboard-name";
    field.className = "field";
    field.maxLength = 40;
    field.autocomplete = "given-name";
    field.placeholder = "İsteğe bağlı";
    field.value = draft.name;
    field.addEventListener("input", () => {
      draft.name = field.value;
    });
    screen.appendChild(field);

    const themeLabel = el("p", "t-label", "Görünüm");
    themeLabel.id = "onboard-theme-label";
    screen.appendChild(themeLabel);
    screen.appendChild(
      choices({
        options: Object.entries(THEME_LABELS).map(([value, text]) => ({ value, label: text })),
        value: draft.theme,
        onChange: (value) => {
          draft.theme = value;
          // Painted at once: a theme is chosen by looking at it.
          setTheme(value);
        },
        labelledBy: "onboard-theme-label",
      }).element
    );
    screen.appendChild(actions("Hazırım", finish));
    return screen;
  }

  const SCREENS = [stepWelcome, stepExam, stepGoal, stepYou];

  function paint() {
    container.replaceChildren();
    container.appendChild(steps());
    container.appendChild(SCREENS[step]());
    announce(`Adım ${step + 1} / ${STEPS}`);
  }

  paint();
}
