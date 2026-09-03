// Small DOM builders shared across the screens. Everything here builds
// nodes and sets textContent — no innerHTML anywhere in the app, so
// authored content can never inject markup no matter what a content file
// contains.

/**
 * @param {string} tag
 * @param {string|null} [className]
 * @param {string} [text]
 * @returns {HTMLElement}
 */
export function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) {
    node.className = className;
  }
  if (text !== undefined) {
    node.textContent = text;
  }
  return node;
}

export function clear(node) {
  node.replaceChildren();
}

/**
 * Appends text with `**bold**` spans resolved. The only inline markup the
 * content schema supports: enough to highlight the grammar form a rule is
 * about, without inviting a full Markdown parser into a static app. Odd
 * segments of the split are the emphasized ones; the content validator
 * rejects unbalanced markers, so a stray `**` can't reach here.
 * @param {Node} parent
 * @param {string} text
 */
export function appendInline(parent, text) {
  text.split("**").forEach((segment, index) => {
    if (!segment) {
      return;
    }
    if (index % 2 === 1) {
      parent.appendChild(el("strong", null, segment));
    } else {
      parent.appendChild(document.createTextNode(segment));
    }
  });
}

/**
 * Appends multi-paragraph prose: blank-line-separated paragraphs, each
 * with `**bold**` resolved.
 * @param {Node} parent
 * @param {string} text
 * @param {string} [paragraphClass]
 */
export function appendProse(parent, text, paragraphClass) {
  text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .forEach((paragraph) => {
      const node = el("p", paragraphClass);
      appendInline(node, paragraph);
      parent.appendChild(node);
    });
}

/**
 * Appends a sentence whose `____` blank is rendered as a styled span.
 * Used by both the test questions and the Eğitim tab's inline checks, so
 * a blank looks identical wherever a learner meets one.
 * @param {Node} parent
 * @param {string} text
 */
export function appendBlanked(parent, text) {
  const parts = text.split("____");
  parts.forEach((part, index) => {
    parent.appendChild(document.createTextNode(part));
    if (index < parts.length - 1) {
      parent.appendChild(el("span", "blank", "_____"));
    }
  });
}
