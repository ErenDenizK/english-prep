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

  // A menu inside a clipped card must still paint above that card. Keeping
  // a popover in the same DOM preserves its label, inherited theme and ARIA
  // relationships; older browsers temporarily mount it under the body.
  const usesPopover = typeof menu.showPopover === "function";
  if (usesPopover) menu.setAttribute("popover", "manual");
  Object.assign(menu.style, { position: "fixed", right: "auto", bottom: "auto", minWidth: "0" });
  let anchorPosition = null;

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
    if (isOpen()) revealActiveOption();
  }

  function revealActiveOption() {
    const active = menu.children[activeIndex];
    if (!active) return;
    const box = menu.getBoundingClientRect();
    const item = active.getBoundingClientRect();
    const top = box.top + menu.clientTop;
    const bottom = top + menu.clientHeight;
    // scrollIntoView would also move the fixed app shell beneath the menu.
    if (item.top < top) menu.scrollTop -= top - item.top;
    else if (item.bottom > bottom) menu.scrollTop += item.bottom - bottom;
  }

  function positionMenu() {
    const anchor = trigger.getBoundingClientRect();
    anchorPosition = { top: anchor.top, left: anchor.left };
    const viewport = window.visualViewport;
    const gap = 4;
    const inset = 8;
    const left = (viewport?.offsetLeft ?? 0) + inset;
    const right = (viewport?.offsetLeft ?? 0) + (viewport?.width ?? innerWidth) - inset;
    let top = (viewport?.offsetTop ?? 0) + inset;
    let bottom = (viewport?.offsetTop ?? 0) + (viewport?.height ?? innerHeight) - inset;

    for (const chrome of document.querySelectorAll("#shell-header, #bottom-nav, .shell__bar")) {
      const box = chrome.getBoundingClientRect();
      if (!box.width || !box.height || box.right <= anchor.left || box.left >= anchor.right) continue;
      if (chrome.id === "shell-header") top = Math.max(top, box.bottom + inset);
      else bottom = Math.min(bottom, box.top - inset);
    }

    menu.style.width = "max-content";
    menu.style.minWidth = `${Math.min(anchor.width, right - left)}px`;
    menu.style.maxWidth = `${right - left}px`;
    menu.style.maxHeight = "";
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    const authoredMax = parseFloat(getComputedStyle(menu).maxHeight) || Infinity;
    const fullHeight = menu.scrollHeight + menu.offsetHeight - menu.clientHeight;
    const desiredHeight = Math.min(fullHeight, authoredMax);
    const above = Math.max(0, anchor.top - top - gap);
    const below = Math.max(0, bottom - anchor.bottom - gap);
    const openAbove = below < desiredHeight && above > below;
    const room = openAbove ? above : below;
    menu.style.maxHeight = `${Math.min(desiredHeight, room)}px`;
    const box = menu.getBoundingClientRect();
    menu.style.width = `${box.width}px`;
    menu.style.left = `${Math.max(left, Math.min(anchor.right - box.width, right - box.width))}px`;
    menu.style.top = `${openAbove ? anchor.top - gap - box.height : anchor.bottom + gap}px`;
    revealActiveOption();
  }

  function handleScroll(event) {
    // Scrolling a long popup is local; moving its anchor closes it.
    if (event.target === menu || menu.contains(event.target)) return;
    const anchor = trigger.getBoundingClientRect();
    // Focus can queue a scroll event before the click opens the popup.
    // Its geometry already reflects that scroll, so only later movement
    // should dismiss the menu the learner has just opened.
    if (!anchorPosition || Math.abs(anchor.top - anchorPosition.top) > 0.5 || Math.abs(anchor.left - anchorPosition.left) > 0.5) close();
  }

  function watchPosition(add) {
    const method = add ? "addEventListener" : "removeEventListener";
    document[method]("scroll", handleScroll, true);
    window[method]("resize", close);
    window[method]("hashchange", close);
    window.visualViewport?.[method]("resize", close);
    window.visualViewport?.[method]("scroll", close);
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
    if (usesPopover) menu.showPopover();
    else document.body.appendChild(menu);
    positionMenu();
    document.addEventListener("pointerdown", handleOutsidePointer, true);
    watchPosition(true);
  }

  function close() {
    if (!isOpen()) {
      return;
    }
    watchPosition(false);
    if (usesPopover) {
      if (menu.matches(":popover-open")) menu.hidePopover();
    } else container.appendChild(menu);
    menu.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    renderOptions();
    document.removeEventListener("pointerdown", handleOutsidePointer, true);
  }

  function handleOutsidePointer(event) {
    if (!container.contains(event.target) && !menu.contains(event.target)) {
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
