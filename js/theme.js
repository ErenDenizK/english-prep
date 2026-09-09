// Which palette the app paints in.
//
// Three states rather than a toggle, because a boolean cannot express
// "follow the phone": **sistem / açık / koyu**. The default is `sistem`
// for a new learner and the stored value for everyone else — but the
// *stylesheet's* default is dark, so an install that has never chosen
// keeps looking exactly as it did.
//
// The preference has its own localStorage key rather than joining
// `englishPrep.settings`, and that is deliberate. A blocking script in
// the head of all three pages reads it before the stylesheet loads, to
// stop a flash of the wrong theme on cold start, and that script has to
// stay a few lines — parsing a settings object in front of first paint
// is the opposite of the point. The duplication is the cost of having no
// build step, and the head comment says to keep the copies identical.
//
// Everything here is guarded: storage can throw in a private window, and
// a theme preference is not worth taking a screen down for.

export const THEME_KEY = "englishPrep.theme";

/** @typedef {"system"|"light"|"dark"} Theme */

/** The page colour each theme paints, for `<meta name="theme-color">`. */
const THEME_COLOR = { light: "#f6f1e7", dark: "#0c1117" };

export const THEME_LABELS = {
  system: "Sistem",
  light: "Açık",
  dark: "Koyu",
};

/** @returns {Theme} */
export function getTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

/**
 * Writes the preference and paints it, in that order, so a storage
 * failure still changes the screen the learner is looking at.
 * @param {Theme} theme
 */
export function setTheme(theme) {
  try {
    if (theme === "system") {
      localStorage.removeItem(THEME_KEY);
    } else {
      localStorage.setItem(THEME_KEY, theme);
    }
  } catch {
    // Unavailable. The choice holds for this visit and is forgotten.
  }
  applyTheme(theme);
}

/**
 * `system` means removing the attribute rather than setting one, which
 * hands the decision back to `prefers-color-scheme` — the stylesheet
 * carries both directions, so nothing here needs to know which way the
 * phone is set.
 *
 * `theme-color` and `color-scheme` are rewritten too: the first is the
 * browser chrome around the page, the second is what form controls,
 * scrollbars and the dialog backdrop follow. Under `system` they go back
 * to naming both, and the browser picks.
 *
 * @param {Theme} theme
 */
export function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "light" || theme === "dark") {
    root.setAttribute("data-theme", theme);
  } else {
    root.removeAttribute("data-theme");
  }

  const meta = (name) => document.querySelector(`meta[name="${name}"]`);
  const colorScheme = meta("color-scheme");
  if (colorScheme) {
    colorScheme.content = theme === "system" ? "dark light" : theme;
  }
  const themeColor = meta("theme-color");
  if (themeColor && THEME_COLOR[theme]) {
    themeColor.content = THEME_COLOR[theme];
  } else if (themeColor) {
    // Under `system`, name the one the stylesheet falls back to.
    themeColor.content = THEME_COLOR.dark;
  }
}
