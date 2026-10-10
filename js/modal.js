// Confirmation dialog, on a native <dialog> with showModal().
//
// The hand-rolled version this replaces carried its own focus trap, its
// own Escape handler and its own focus-restore. All three are things the
// platform already does correctly, and the fourth — making everything
// outside the dialog `inert` — it never did at all. <dialog> is Baseline,
// so the top layer, the ::backdrop, focus containment, Escape-to-close,
// inertness and focus restoration all come for free and stay correct.
//
// What is left is the part that is actually a decision: focus lands on the
// least destructive action, so the safe option is the one under the cursor
// when a destructive dialog appears.

import { animateElement, animateSequence, cancelAnimationsWithin } from "./interactions.js";

/** A dialog assembles around an already usable decision. The top-layer box
 * never travels or scales, so the backdrop boundary and button targets remain
 * exact. A caller sets state, opens the native dialog and focuses first. */
export function presentDialog(dialog) {
  cancelAnimationsWithin(dialog);
  const title = dialog.querySelector("h1, h2, h3");
  const description = title?.parentElement.querySelector("p");
  const actions = [...dialog.querySelectorAll(".dialog__actions .btn")];
  // Wrap only the presentation of an existing button, preserving its name,
  // events, native type and target. Repeat opens reuse the same stable wrapper.
  const actionLabels = actions.map((button) => {
    let label = button.querySelector(".dialog__action-label");
    if (!label) {
      label = document.createElement("span");
      label.className = "dialog__action-label";
      label.append(...button.childNodes);
      button.appendChild(label);
    }
    return label;
  });
  animateElement(dialog, "dialog", { channel: "dialog-shell" });
  animateSequence([
    { element: title, kind: "item", at: 0 },
    { element: description, kind: "item", at: 45 },
    ...actionLabels.map((element, index) => ({ element, kind: "item", at: 80 + index * 35 })),
  ], { channel: "dialog-parts" });
}

/**
 * @param {{ dialogId: string, confirmId: string, cancelId: string, onConfirm: () => void }} config
 * @returns {{ open: () => void, close: () => void }}
 */
export function createConfirmModal({ dialogId, confirmId, cancelId, onConfirm }) {
  const dialog = document.getElementById(dialogId);
  const confirmBtn = document.getElementById(confirmId);
  const cancelBtn = document.getElementById(cancelId);

  confirmBtn.addEventListener("click", () => {
    dialog.close("confirm");
  });
  cancelBtn.addEventListener("click", () => {
    dialog.close("cancel");
  });

  // One place to act on the outcome, so dismissing with Escape and
  // dismissing with the button cannot diverge.
  dialog.addEventListener("close", () => {
    cancelAnimationsWithin(dialog);
    if (dialog.returnValue === "confirm") {
      onConfirm();
    }
  });

  // Native backdrop clicks target the dialog, but so does its own padding.
  // Only an actual point outside the dialog rectangle dismisses it.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right
          || event.clientY < box.top || event.clientY > box.bottom) {
        dialog.close("cancel");
      }
    }
  });

  return {
    open() {
      dialog.returnValue = "";
      dialog.showModal();
      cancelBtn.focus();
      presentDialog(dialog);
    },
    close() {
      dialog.close("cancel");
    },
  };
}
