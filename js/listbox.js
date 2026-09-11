// The listbox — an app-owned menu instead of a native <select>, so opening
// it never hands the screen over to OS chrome and, being absolutely
// positioned, never reflows the page around it.
//
// Replacing a native control means re-earning what it gave for free, so
// this is a *select-only combobox* in the WAI-ARIA sense: role="combobox"
// on the trigger, role="listbox" on the popup, and — the part hand-rolled
// versions get wrong — DOM focus never leaves the trigger, with the active
// option tracked by aria-activedescendant. Down/Up open and move, Enter
// accepts, Escape dismisses without committing, Home/End jump, and
// printable characters type ahead, all as a real <select> does.

import { icon } from "./icons.js";

let instanceCount = 0;

/** How long consecutive keystrokes count as one type-ahead search. */
const TYPEAHEAD_RESET_MS = 500;

/**
 * @param {{
 *   container: HTMLElement,
 *   options: Array<{value: string, label: string}>,
 *   value: string,
 *   onChange?: (value: string) => void,
 *   labelledBy?: string,
 * }} config
 * @returns {{ getValue: () => string, setValue: (value: string) => void }}
 */
export function createListbox({ container, options, value, onChange, labelledBy }) {
  const id = `listbox-${(instanceCount += 1)}`;
  container.classList.add("listbox");
  const optionId = (index) => `${id}-option-${index}`;

  let currentValue = value;
  let activeIndex = Math.max(
    options.findIndex((option) => option.value === value),
    0
  );

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "listbox__trigger";
  trigger.setAttribute("role", "combobox");
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-controls", `${id}-menu`);

  const triggerLabel = document.createElement("span");
  triggerLabel.id = `${id}-value`;
  // The accessible name has to include the current value, not just the
  // field label — otherwise the control announces as "Soru sayısı" with
  // no hint of what it is set to.
  trigger.setAttribute("aria-labelledby", [labelledBy, triggerLabel.id].filter(Boolean).join(" "));

  trigger.append(triggerLabel, icon("chevron-down", { size: 20 }));

  const menu = document.createElement("ul");
  menu.id = `${id}-menu`;
  menu.className = "listbox__menu";
  menu.setAttribute("role", "listbox");
  menu.hidden = true;

  const isOpen = () => !menu.hidden;

  function labelFor(val) {
    return options.find((option) => option.value === val)?.label ?? val;
  }

  function renderOptions() {
    menu.replaceChildren();
    options.forEach((option, index) => {
      const item = document.createElement("li");
      item.id = optionId(index);
      item.className = "listbox__option";
      item.setAttribute("role", "option");
      item.textContent = option.label;
      item.setAttribute("aria-selected", String(option.value === currentValue));
      item.classList.toggle("listbox__option--active", isOpen() && index === activeIndex);
      // Pointer, not click: on touch this fires before the document-level
      // outside-click handler can close the menu out from under the tap.
      item.addEventListener("pointerup", () => select(index));
      item.addEventListener("click", () => select(index));
      menu.appendChild(item);
    });
    trigger.setAttribute("aria-activedescendant", isOpen() ? optionId(activeIndex) : "");
  }

  function select(index) {
    const option = options[index];
    if (!option) {
      return;
    }
    const changed = option.value !== currentValue;
    currentValue = option.value;
    activeIndex = index;
    triggerLabel.textContent = option.label;
    close();
    trigger.focus();
    if (changed) {
      onChange?.(currentValue);
    }
  }

  let typeahead = "";
  let typeaheadAt = 0;

  /**
   * Type-ahead. Repeating one character cycles through the options starting
   * with it, which is what a native <select> does and what someone reaching
   * for "5" then "5" again expects.
   */
  function typeAhead(char) {
    const now = Date.now();
    typeahead = now - typeaheadAt > TYPEAHEAD_RESET_MS ? char : typeahead + char;
    typeaheadAt = now;

    const repeated = typeahead.length > 1 && typeahead.split("").every((c) => c === typeahead[0]);
    const needle = (repeated ? typeahead[0] : typeahead).toLocaleLowerCase("tr");
    const from = repeated ? activeIndex + 1 : activeIndex;

    for (let step = 0; step < options.length; step += 1) {
      const index = (from + step) % options.length;
      if (options[index].label.toLocaleLowerCase("tr").startsWith(needle)) {
        activeIndex = index;
        renderOptions();
        return;
      }
    }
  }

  function moveActive(delta) {
    activeIndex = (activeIndex + delta + options.length) % options.length;
    renderOptions();
  }

  function open() {
    if (isOpen()) {
      return;
    }
    activeIndex = Math.max(
      options.findIndex((option) => option.value === currentValue),
      0
    );
    menu.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    renderOptions();
    document.addEventListener("pointerdown", handleOutsidePointer, true);
  }

  function close() {
    if (!isOpen()) {
      return;
    }
    menu.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    renderOptions();
    document.removeEventListener("pointerdown", handleOutsidePointer, true);
  }

  function handleOutsidePointer(event) {
    if (!container.contains(event.target)) {
      close();
    }
  }

  trigger.addEventListener("click", () => (isOpen() ? close() : open()));

  trigger.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (isOpen()) {
        event.stopPropagation();
        close();
      }
      return;
    }

    if (!isOpen()) {
      if (["ArrowDown", "ArrowUp", "Enter", " ", "Spacebar"].includes(event.key)) {
        event.preventDefault();
        open();
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveActive(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveActive(-1);
        break;
      case "Home":
        event.preventDefault();
        activeIndex = 0;
        renderOptions();
        break;
      case "End":
        event.preventDefault();
        activeIndex = options.length - 1;
        renderOptions();
        break;
      case "Enter":
      case " ":
      case "Spacebar":
        event.preventDefault();
        select(activeIndex);
        break;
      case "Tab":
        close();
        break;
      default:
        if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
          event.preventDefault();
          typeAhead(event.key);
        }
        break;
    }
  });

  triggerLabel.textContent = labelFor(currentValue);
  renderOptions();
  container.append(trigger, menu);

  return {
    getValue: () => currentValue,
    setValue: (val) => {
      currentValue = val;
      triggerLabel.textContent = labelFor(val);
      renderOptions();
    },
  };
}
