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
 * Appends text with `**bold**` and `*emphasis*` spans resolved — the only
 * two inline marks the content schema supports, enough to point at a
 * grammar form or a Turkish example word without inviting a Markdown
 * parser into a static app.
 *
 * Emphasis was added on 2026-09-09 because 21 authored strings across
 * eight topics already used it, and the renderer was printing the
 * asterisks: a stranger's first look at a topic overview read
 * "*tutumunu*". Authors reach for `*x*` by instinct; forbidding it in a
 * schema they never see does not stop them, and the validator now
 * rejects an unbalanced mark of either kind so a stray one cannot reach
 * here.
 *
 * `<em>` is the right element for a screen reader; how it looks is the
 * stylesheet's decision, and no italic face ships, so it is not italic.
 *
 * @param {Node} parent
 * @param {string} text
 */
export function appendInline(parent, text) {
  // One pass, longest mark first, so `**` is never read as two `*`.
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/);
  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      parent.appendChild(el("strong", null, part.slice(2, -2)));
    } else if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      parent.appendChild(el("em", null, part.slice(1, -1)));
    } else {
      parent.appendChild(document.createTextNode(part));
    }
  }
}

/**
 * Appends multi-paragraph prose: blank-line-separated paragraphs, each
 * with `**bold**` and `*emphasis*` resolved.
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
 * Appends a sentence whose `____` blank is rendered as a rule on the
 * baseline. Used by both the test questions and the Eğitim tab's inline
 * checks, so a blank looks identical wherever a learner meets one.
 *
 * The gap carries no glyphs: a run of underscores breaks the sentence's
 * rhythm in the serif, and a screen reader reads them out one at a time.
 * The word inside is for the synthesiser only. Every blank is the same
 * width on purpose — sizing it to the answer would leak the answer.
 * @param {Node} parent
 * @param {string} text
 */
export function appendBlanked(parent, text) {
  const parts = text.split("____");
  parts.forEach((part, index) => {
    parent.appendChild(document.createTextNode(part));
    if (index < parts.length - 1) {
      const blank = el("span", "blank");
      blank.appendChild(el("span", "visually-hidden", "boşluk"));
      parent.appendChild(blank);
    }
  });
}

/**
 * A section's label, with an optional line under it saying what the
 * section is for.
 *
 * Shared because two screens grew the same shape independently: the Test
 * tab's weak-spot list and the Eğitim index's topic list both need a
 * label that can carry a hedge or an explanation without becoming a
 * heading level of its own.
 *
 * @param {string} text
 * @param {string} [hint]
 */
export function sectionHeading(text, hint) {
  const head = el("div", "stack stack--tight");
  head.appendChild(el("h2", "t-label", text));
  if (hint) {
    // A sentence, so the quiet pair and not the one-line tier.
    head.appendChild(el("p", "t-quiet", hint));
  }
  return head;
}

/**
 * The one way the app says something failed to load. It had three — a
 * grey line saying "Sayfayı yenile", a card saying "Tekrar dene", and a
 * quiz message with an "Ana sayfa" button — with three vocabularies for
 * one event. One card, one sentence, and a retry that does the thing
 * again rather than telling the learner to.
 *
 * @param {string} what - the noun that failed, in the nominative:
 *   "Dersler", "Konular", "Test"
 * @param {() => void} retry
 * @param {{label: string, onClick?: () => void, href?: string}} [back]
 */
export function failureCard(what, retry, back) {
  const card = el("section", "surface stack");
  const head = el("div", "stack stack--tight");
  head.appendChild(el("h2", "t-title", `${what} yüklenemedi`));
  head.appendChild(
    el("p", "t-body", "Bağlantını kontrol edip tekrar dene. İlerlemen olduğu gibi duruyor.")
  );
  card.appendChild(head);

  const again = el("button", "btn btn--primary", "Tekrar dene");
  again.type = "button";
  again.addEventListener("click", retry);
  card.appendChild(again);

  if (back) {
    const control = back.href ? el("a", "btn btn--quiet", back.label) : el("button", "btn btn--quiet", back.label);
    if (back.href) {
      control.href = back.href;
    } else {
      control.type = "button";
      control.addEventListener("click", back.onClick);
    }
    card.appendChild(control);
  }
  return card;
}

/**
 * A text button: a quiet action that sits on the keyline with a chevron,
 * for the second thing a card offers. It was a centred grey label with
 * no shape, which read as something that had lost its button.
 *
 * @param {string} label
 * @param {() => void} onClick
 * @param {(name: string, options?: object) => SVGElement} icon - passed
 *   in rather than imported, so this module stays free of the icon set
 */
export function textButton(label, onClick, icon) {
  const button = el("button", "btn btn--quiet btn--text", label);
  button.type = "button";
  button.appendChild(icon("chevron-right", { size: 20 }));
  button.addEventListener("click", onClick);
  return button;
}

/**
 * One column of a `.split` (css/style.css, utilities). A split's tracks are
 * positional — the first child takes the first column — so a split is
 * built from exactly two of these and never from three: a third child
 * would silently start a second row instead of erroring.
 *
 * Below the split's breakpoint a pane is an ordinary `.stack stack--loose`,
 * which is the class the containers being split already carried. That is
 * deliberate: the phone layout is not restored by the media query, it is
 * simply never left.
 */
export function pane() {
  return el("div", "stack stack--loose");
}
