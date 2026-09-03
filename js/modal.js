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
    if (dialog.returnValue === "confirm") {
      onConfirm();
    }
  });

  // Clicking the backdrop is a click on the dialog element itself, since
  // the box's own children cover everything inside it.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close("cancel");
    }
  });

  return {
    open() {
      dialog.returnValue = "";
      dialog.showModal();
      cancelBtn.focus();
    },
    close() {
      dialog.close("cancel");
    },
  };
}
