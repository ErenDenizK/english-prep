// Small custom dropdown component — an app-owned menu instead of a native
// <select>, so opening it never triggers OS chrome and, being absolutely
// positioned, never reflows the surrounding layout.

/**
 * @param {{ container: HTMLElement, options: Array<{value: string, label: string}>, value: string, onChange: (value: string) => void, labelledBy?: string }} config
 * @returns {{ getValue: () => string, setValue: (value: string) => void }}
 */
export function createDropdown({ container, options, value, onChange, labelledBy }) {
  let currentValue = value;

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "dropdown__trigger";
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");
  if (labelledBy) {
    trigger.setAttribute("aria-labelledby", labelledBy);
  }

  const triggerLabel = document.createElement("span");
  const chevron = document.createElement("span");
  chevron.className = "dropdown__chevron";
  chevron.textContent = "▾";
  trigger.appendChild(triggerLabel);
  trigger.appendChild(chevron);

  const menu = document.createElement("ul");
  menu.className = "dropdown__menu";
  menu.setAttribute("role", "listbox");
  menu.hidden = true;

  function findLabel(val) {
    return options.find((option) => option.value === val)?.label ?? val;
  }

  function renderOptions() {
    menu.innerHTML = "";
    options.forEach((option) => {
      const item = document.createElement("li");
      item.className = "dropdown__option";
      item.setAttribute("role", "option");
      item.textContent = option.label;
      item.setAttribute("aria-selected", String(option.value === currentValue));
      item.addEventListener("click", () => {
        currentValue = option.value;
        triggerLabel.textContent = findLabel(currentValue);
        renderOptions();
        closeMenu();
        onChange(currentValue);
      });
      menu.appendChild(item);
    });
  }

  function openMenu() {
    menu.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    document.addEventListener("click", handleOutsideClick, { capture: true });
    document.addEventListener("keydown", handleKeydown);
  }

  function closeMenu() {
    menu.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    document.removeEventListener("click", handleOutsideClick, { capture: true });
    document.removeEventListener("keydown", handleKeydown);
  }

  function handleOutsideClick(event) {
    if (!container.contains(event.target)) {
      closeMenu();
    }
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      closeMenu();
      trigger.focus();
    }
  }

  trigger.addEventListener("click", () => {
    if (menu.hidden) {
      openMenu();
    } else {
      closeMenu();
    }
  });

  triggerLabel.textContent = findLabel(currentValue);
  renderOptions();

  container.appendChild(trigger);
  container.appendChild(menu);

  return {
    getValue: () => currentValue,
    setValue: (val) => {
      currentValue = val;
      triggerLabel.textContent = findLabel(val);
      renderOptions();
    },
  };
}
