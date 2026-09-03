// Confirm modal — wires up a fixed in-app overlay that is already in the
// DOM, instead of window.confirm(), so confirming a destructive action
// never hands the screen to native browser chrome or shifts the page.
//
// Same trade as the custom dropdown: taking over from a native control
// means taking over its keyboard contract too. Focus moves into the
// dialog, is trapped there while it is open (Tab can't wander into the
// page behind it), Escape cancels, and on close focus returns to whatever
// opened the dialog rather than being dumped at the top of the document.

const FOCUSABLE = 'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * @param {{ overlayId: string, confirmId: string, cancelId: string, onConfirm: () => void }} config
 * @returns {{ open: () => void, close: () => void }}
 */
export function createConfirmModal({ overlayId, confirmId, cancelId, onConfirm }) {
  const overlay = document.getElementById(overlayId);
  const dialog = overlay.querySelector(".modal");
  const confirmBtn = document.getElementById(confirmId);
  const cancelBtn = document.getElementById(cancelId);

  let lastFocused = null;

  function focusableItems() {
    return Array.from(dialog.querySelectorAll(FOCUSABLE)).filter(
      (node) => node.offsetParent !== null || node === document.activeElement
    );
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab") {
      return;
    }

    const items = focusableItems();
    if (items.length === 0) {
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || !dialog.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
      event.preventDefault();
      first.focus();
    }
  }

  function open() {
    lastFocused = document.activeElement;
    overlay.hidden = false;
    document.addEventListener("keydown", handleKeydown);
    // Cancel, not confirm: the safe option should be the one under the
    // cursor when a destructive dialog appears.
    cancelBtn.focus();
  }

  function close() {
    overlay.hidden = true;
    document.removeEventListener("keydown", handleKeydown);
    if (lastFocused?.isConnected) {
      lastFocused.focus();
    }
    lastFocused = null;
  }

  confirmBtn.addEventListener("click", () => {
    close();
    onConfirm();
  });
  cancelBtn.addEventListener("click", close);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      close();
    }
  });

  return { open, close };
}
