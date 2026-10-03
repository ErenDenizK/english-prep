// A new visit starts in dark mode. Light and system remain explicit choices;
// an absent storage entry can no longer mean both "default" and "system".
// The blocking head script on all three entry pages mirrors this policy so
// the first paint and the live application always agree.

export const THEME_KEY = "englishPrep.theme";

/** @typedef {"system"|"light"|"dark"} Theme */

const THEME_COLOR = { light: "#fbf7fa", dark: "#141216" };
const validTheme = (theme) => theme === "light" || theme === "system" ? theme : "dark";

export const THEME_LABELS = {
  system: "Sistem",
  light: "Açık",
  dark: "Koyu",
};

// If storage is blocked or full, a choice still lasts for this document.
let temporaryTheme = null;
let media = null;
let stopListening = null;

/** @returns {Theme} */
export function getTheme() {
  if (temporaryTheme !== null) return temporaryTheme;
  try {
    return validTheme(localStorage.getItem(THEME_KEY));
  } catch {
    return "dark";
  }
}

/** @param {Theme} theme */
export function setTheme(theme) {
  const choice = validTheme(theme);
  try {
    // Store system explicitly, so it survives a full navigation/reload.
    localStorage.setItem(THEME_KEY, choice);
    temporaryTheme = null;
  } catch {
    temporaryTheme = choice;
  }
  applyTheme(choice);
}

function systemIsLight() {
  media ??= window.matchMedia("(prefers-color-scheme: light)");
  return media.matches;
}

/** Paint the preference and resolve browser chrome to the actual palette. */
export function applyTheme(theme) {
  const choice = validTheme(theme);
  const root = document.documentElement;
  if (choice === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", choice);
  }

  const resolved = choice === "system" ? (systemIsLight() ? "light" : "dark") : choice;
  const colorScheme = document.querySelector('meta[name="color-scheme"]');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (colorScheme) colorScheme.content = resolved;
  if (themeColor) themeColor.content = THEME_COLOR[resolved];
}

/**
 * Run once on every HTML entry point. CSS follows a system choice live;
 * the matching listener keeps the browser's address bar and controls in
 * sync too. Repeated calls do not register duplicate listeners.
 * @returns {() => void} cleanup, useful for an embedded/document lifecycle
 */
export function initTheme() {
  applyTheme(getTheme());
  if (stopListening) return stopListening;
  media ??= window.matchMedia("(prefers-color-scheme: light)");
  const changed = () => {
    if (getTheme() === "system") applyTheme("system");
  };
  media.addEventListener("change", changed);
  stopListening = () => {
    media.removeEventListener("change", changed);
    stopListening = null;
  };
  return stopListening;
}
