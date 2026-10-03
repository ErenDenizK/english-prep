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

import { animateElement, cancelAnimationsWithin } from "./interactions.js";

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
      animateElement(dialog, "dialog");
    },
    close() {
      dialog.close("cancel");
    },
  };
}
