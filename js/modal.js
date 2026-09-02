// Small confirm-modal helper — wires up a fixed in-app overlay already
// present in the DOM, instead of window.confirm(), so confirming a
// destructive action never triggers native browser chrome or shifts page
// layout.

/**
 * @param {{ overlayId: string, confirmId: string, cancelId: string, onConfirm: () => void }} config
 * @returns {{ open: () => void, close: () => void }}
 */
export function createConfirmModal({ overlayId, confirmId, cancelId, onConfirm }) {
  const overlay = document.getElementById(overlayId);
  const confirmBtn = document.getElementById(confirmId);
  const cancelBtn = document.getElementById(cancelId);

  function close() {
    overlay.hidden = true;
    document.removeEventListener("keydown", handleKeydown);
  }

  function open() {
    overlay.hidden = false;
    document.addEventListener("keydown", handleKeydown);
    confirmBtn.focus();
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      close();
    }
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
