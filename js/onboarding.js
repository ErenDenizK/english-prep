// A single optional introduction. No goals, dates, streaks, or theme setup.
import { el } from "./dom.js";
import { getProfileName, setProfileName, setOnboarded } from "./storage.js";

export function renderOnboarding(container, { onDone }) {
  const form = el("form", "stack onboard__intro");
  const heading = el("h1", "t-display", "English Prep");
  heading.lang = "en";
  form.appendChild(heading);
  form.appendChild(el("p", "t-body", "Bildiğin İngilizcedeki ayrımları netleştirmek için kısa dersler ve açıklamalı sorular."));
  const modes = el("div", "onboard__modes");
  for (const [title, text] of [
    ["Eğitim", "Konuyu seç. Makale şeklindeki dersi oku, örnekleri incele."],
    ["Test", "Soruları çöz. Cevabın nedenini öğren, yanlışlarına geri dön."],
  ]) {
    const section = el("section");
    section.appendChild(el("h2", "t-lead", title));
    section.appendChild(el("p", "t-body", text));
    modes.appendChild(section);
  }
  form.appendChild(modes);
  const field = el("div", "stack stack--snug");
  const label = el("label", "t-ui", "Adın · isteğe bağlı");
  label.htmlFor = "onboard-name";
  const input = el("input", "field");
  input.id = "onboard-name";
  input.type = "text";
  input.autocomplete = "given-name";
  input.maxLength = 40;
  input.value = getProfileName();
  input.placeholder = "Adın";
  field.append(label, input);
  field.appendChild(el("p", "t-meta", "Hesap gerekmez. Adın ve ilerlemen bu tarayıcıda saklanır."));
  form.appendChild(field);
  const actions = el("div", "onboard__actions");
  const start = el("button", "btn btn--primary", "Uygulamayı aç");
  start.type = "submit";
  actions.appendChild(start);
  form.appendChild(actions);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    setProfileName(input.value.trim());
    setOnboarded(true);
    document.dispatchEvent(new CustomEvent("profile:namechange"));
    onDone();
  });
  container.replaceChildren(form);
}
