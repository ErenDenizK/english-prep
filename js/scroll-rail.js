// A bounded, optional map of the existing scroll surface. It owns presentation
// and scrolling only: lessons, answers and route state never enter this module.
// Narrow/touch screens retain their full reading width and native gestures.
const instances = new WeakMap();
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const visible = (node) => node?.isConnected && !node.closest("[hidden]") && node.getClientRects().length > 0;
const node = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

/** Enhance the app's scrolling main, or the portfolio's document scroll.
 * Repeated initialization is safe; destroy restores the native scrollbar.
 * @param {{scroller?: Element, content?: Element}} [options]
 */
export function initScrollRail({
  scroller = document.getElementById("shell-scroll") || document.scrollingElement,
  content = document.querySelector("#shell-scroll > .page") || document.querySelector("main"),
} = {}) {
  if (!scroller || !content || typeof ResizeObserver === "undefined") return null;
  if (instances.has(scroller)) return instances.get(scroller);
  const documentScroll = scroller === document.scrollingElement;
  const eventTarget = documentScroll ? window : scroller;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
  const forcedColors = matchMedia("(forced-colors: active)");
  const originalId = scroller.id;
  if (!scroller.id) scroller.id = "scroll-rail-document";

  const rail = node("nav", "scroll-rail");
  rail.setAttribute("aria-label", "Sayfa konumu");
  rail.hidden = true;
  const control = node("div", "scroll-rail__control");
  const track = node("span", "scroll-rail__track");
  const thumb = node("span", "scroll-rail__thumb");
  const marks = node("span", "scroll-rail__marks");
  const caption = node("span", "scroll-rail__caption");
  for (const item of [track, thumb, marks, caption]) item.setAttribute("aria-hidden", "true");
  control.append(track, marks, thumb);
  rail.append(control, caption);
  document.body.appendChild(rail);

  let destroyed = false;
  let frame = 0;
  let idleTimer = 0;
  let needsLayout = true;
  let interactive = false;
  let landmarks = [];
  let trackHeight = 240;
  let thumbHeight = 32;
  let drag = null;
  let lastValue = -1;
  const read = () => ({
    top: scroller.scrollTop,
    viewport: documentScroll ? window.innerHeight : scroller.clientHeight,
    max: Math.max(0, scroller.scrollHeight - (documentScroll ? window.innerHeight : scroller.clientHeight)),
  });
  const setScroll = (top, smooth = false) => {
    const reduced = document.documentElement.dataset.motion === "off" || matchMedia("(prefers-reduced-motion: reduce)").matches;
    scroller.scrollTo({ top: clamp(top, 0, read().max), behavior: smooth && !reduced ? "smooth" : "instant" });
  };
  const offsetOf = (element) => {
    const inset = documentScroll ? 24 : parseFloat(getComputedStyle(scroller).scrollPaddingTop) || 80;
    const top = documentScroll ? 0 : scroller.getBoundingClientRect().top;
    return clamp(element.getBoundingClientRect().top - top + read().top - inset, 0, read().max);
  };
  const labelOf = (element) => (element.matches("h1,h2,h3") ? element : element.querySelector("h1,h2,h3"))?.textContent.trim().replace(/\s+/g, " ").slice(0, 90) || "Bölüm";
  const collectLandmarks = () => {
    const article = content.querySelector(".lesson");
    let candidates = [];
    let maximum = 5;
    if (visible(article)) {
      candidates = [article.querySelector(".lesson__head"), ...article.querySelectorAll(":scope > .block:has(h2), :scope > .block--end")];
    } else if (document.body.classList.contains("about-page")) {
      candidates = [...content.querySelectorAll(":scope > section")];
      maximum = 6;
    }
    candidates = [...new Set(candidates.filter(visible))];
    if (candidates.length > maximum) {
      candidates = Array.from({ length: maximum }, (_, index) => candidates[Math.round(index * (candidates.length - 1) / (maximum - 1))]);
    }
    // A milestone always refers to authored, already visible content. Closely
    // packed positions are merged rather than creating tiny click targets.
    const max = read().max;
    const positions = [];
    for (const element of candidates) {
      const top = offsetOf(element);
      const y = max ? top / max * (trackHeight - 44) + 22 : 22;
      if (positions.length && y - positions.at(-1).y < 44) continue;
      positions.push({ element, top, y, label: labelOf(element) });
    }
    landmarks = positions.length > 1 ? positions : [];
    marks.replaceChildren();
    for (const landmark of landmarks) {
      const mark = node("span", "scroll-rail__mark");
      mark.style.top = `${landmark.y}px`;
      marks.appendChild(mark);
      landmark.mark = mark;
    }
    rail.dataset.mode = landmarks.length ? "staged" : "continuous";
  };
  const configureInteraction = (next) => {
    if (interactive === next && rail.dataset.interactive !== undefined) return;
    interactive = next;
    rail.dataset.interactive = String(next);
    if (next) {
      rail.removeAttribute("aria-hidden");
      control.tabIndex = 0;
      control.setAttribute("role", "scrollbar");
      control.setAttribute("aria-label", "Sayfada gezin");
      control.setAttribute("aria-controls", scroller.id);
      control.setAttribute("aria-orientation", "vertical");
      control.setAttribute("aria-valuemin", "0");
      control.setAttribute("aria-valuemax", "100");
      control.setAttribute("aria-description", "Sürükle veya bir noktaya dokun. Oklar, Page Up / Down, Home ve End ile gezin.");
    } else {
      if (document.activeElement === control) control.blur();
      rail.setAttribute("aria-hidden", "true");
      control.removeAttribute("tabindex");
      for (const attribute of [...control.attributes]) if (attribute.name.startsWith("aria-") || attribute.name === "role" || attribute.name === "title") control.removeAttribute(attribute.name);
      cancelDrag(true);
    }
  };
  const measure = () => {
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    const viewportWidth = document.documentElement.clientWidth;
    const rect = scroller.getBoundingClientRect();
    const topLimit = Math.max(80, documentScroll ? 80 : rect.top + 80);
    const bottomLimit = Math.min(viewportHeight - 96, documentScroll ? viewportHeight : rect.bottom - 80);
    trackHeight = clamp((bottomLimit - topLimit) * 0.6, 120, 320);
    const frameElements = documentScroll ? [...content.querySelectorAll(".about-frame")].filter(visible) : [content];
    const rightEdge = Math.max(0, ...frameElements.map((element) => element.getBoundingClientRect().right));
    const gutter = viewportWidth - rightEdge;
    const adequateHeight = bottomLimit - topLimit >= 160;
    configureInteraction(gutter >= 52 && finePointer.matches && adequateHeight && !forcedColors.matches);
    rail.style.setProperty("--rail-height", `${trackHeight}px`);
    rail.style.setProperty("--rail-top", `${Math.max(topLimit, (topLimit + bottomLimit - trackHeight) / 2)}px`);
    rail.style.setProperty("--rail-right", `${interactive ? Math.min(32, Math.max(4, (gutter - 44) / 2)) : 2}px`);
    collectLandmarks();
  };
  const paint = () => {
    frame = 0;
    if (destroyed) return;
    if (needsLayout) { measure(); needsLayout = false; }
    const { top, viewport, max } = read();
    const enabled = max > 2 && !forcedColors.matches;
    if (!enabled && document.activeElement === control) control.blur();
    rail.hidden = !enabled;
    if (enabled) scroller.setAttribute("data-scroll-rail-enhanced", "");
    else scroller.removeAttribute("data-scroll-rail-enhanced");
    const ratio = max ? clamp(top / max, 0, 1) : 0;
    thumbHeight = clamp(viewport / (max + viewport) * trackHeight, 28, 86);
    thumb.style.height = `${thumbHeight}px`;
    thumb.style.transform = `translateY(${ratio * (trackHeight - thumbHeight)}px)`;
    let current = null;
    for (const landmark of landmarks) {
      if (top + 24 >= landmark.top) current = landmark;
      landmark.mark.dataset.current = "false";
    }
    if (current) current.mark.dataset.current = "true";
    const value = Math.round(ratio * 100);
    if (interactive) {
      control.setAttribute("aria-valuenow", String(value));
      control.setAttribute("aria-valuetext", `%${value}${current ? ` · ${current.label}` : " · Sayfa konumu"}`);
    }
    if (value !== lastValue || caption.textContent !== current?.label) caption.textContent = current?.label || `%${value}`;
    lastValue = value;
  };
  const schedule = (layout = false) => {
    needsLayout ||= layout;
    if (!frame && !destroyed) frame = requestAnimationFrame(paint);
  };
  const onScroll = () => {
    rail.dataset.scrolling = "true";
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { delete rail.dataset.scrolling; }, 240);
    schedule();
  };
  const refresh = () => schedule(true);
  function cancelDrag(restore) {
    if (!drag) return;
    const previous = drag;
    drag = null;
    delete rail.dataset.dragging;
    if (control.hasPointerCapture(previous.pointerId)) control.releasePointerCapture(previous.pointerId);
    if (restore) setScroll(previous.top);
  }
  const pointerDown = (event) => {
    if (!interactive || event.button !== 0 || drag) return;
    event.preventDefault();
    control.focus({ preventScroll: true });
    const thumbRect = thumb.getBoundingClientRect();
    drag = { pointerId: event.pointerId, y: event.clientY, top: read().top, moved: false, onThumb: event.clientY >= thumbRect.top && event.clientY <= thumbRect.bottom };
    control.setPointerCapture(event.pointerId);
  };
  const pointerMove = (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    if (Math.abs(event.clientY - drag.y) < 4 && !drag.moved) return;
    drag.moved = true;
    rail.dataset.dragging = "true";
    const rect = control.getBoundingClientRect();
    const top = drag.onThumb
      ? drag.top + (event.clientY - drag.y) / Math.max(1, trackHeight - thumbHeight) * read().max
      : (event.clientY - rect.top - thumbHeight / 2) / Math.max(1, trackHeight - thumbHeight) * read().max;
    setScroll(top);
  };
  const pointerUp = (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const previous = drag;
    const rect = control.getBoundingClientRect();
    const inBounds = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    cancelDrag(false);
    if (!previous.moved && inBounds && !previous.onThumb) {
      const y = event.clientY - rect.top;
      const landmark = landmarks.find((item) => Math.abs(item.y - y) <= 18);
      setScroll(landmark ? landmark.top : (y - thumbHeight / 2) / Math.max(1, trackHeight - thumbHeight) * read().max, true);
    }
  };
  const pointerCancel = () => cancelDrag(true);
  const keyDown = (event) => {
    if (!interactive) return;
    const { top, viewport, max } = read();
    let next;
    if (event.key === "Escape") {
      event.preventDefault();
      cancelDrag(true);
      rail.dataset.captionDismissed = "true";
      return;
    }
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowDown") next = top + 48;
    else if (event.key === "ArrowUp") next = top - 48;
    else if (event.key === "PageDown" || event.key === " " && !event.shiftKey) next = top + viewport * 0.85;
    else if (event.key === "PageUp" || event.key === " " && event.shiftKey) next = top - viewport * 0.85;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = max;
    if (next !== undefined) { event.preventDefault(); setScroll(next); }
  };
  const onVisibility = () => { if (document.hidden) cancelDrag(true); else refresh(); };
  const resetCaption = () => { delete rail.dataset.captionDismissed; };
  const dismissHoverCaption = (event) => {
    if (event.key === "Escape" && rail.matches(":hover")) rail.dataset.captionDismissed = "true";
  };
  const onMotion = () => {
    // Stop an in-flight programmatic smooth scroll when motion is disabled.
    if (document.documentElement.dataset.motion === "off") setScroll(read().top);
    schedule();
  };
  eventTarget.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", refresh);
  window.visualViewport?.addEventListener("resize", refresh);
  window.addEventListener("blur", pointerCancel);
  document.addEventListener("visibilitychange", onVisibility);
  document.addEventListener("motion:change", onMotion);
  document.addEventListener("keydown", dismissHoverCaption);
  control.addEventListener("pointerdown", pointerDown);
  control.addEventListener("pointermove", pointerMove);
  control.addEventListener("pointerup", pointerUp);
  control.addEventListener("pointercancel", pointerCancel);
  control.addEventListener("lostpointercapture", pointerCancel);
  control.addEventListener("keydown", keyDown);
  control.addEventListener("focus", resetCaption);
  rail.addEventListener("pointerleave", resetCaption);
  finePointer.addEventListener("change", refresh);
  forcedColors.addEventListener("change", refresh);
  const resizeObserver = new ResizeObserver(refresh);
  resizeObserver.observe(content);
  if (!documentScroll) resizeObserver.observe(scroller);
  const mutationObserver = new MutationObserver(refresh);
  mutationObserver.observe(content, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden", "open"] });
  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    cancelDrag(true);
    cancelAnimationFrame(frame);
    clearTimeout(idleTimer);
    resizeObserver.disconnect();
    mutationObserver.disconnect();
    eventTarget.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", refresh);
    window.visualViewport?.removeEventListener("resize", refresh);
    window.removeEventListener("blur", pointerCancel);
    document.removeEventListener("visibilitychange", onVisibility);
    document.removeEventListener("motion:change", onMotion);
    document.removeEventListener("keydown", dismissHoverCaption);
    finePointer.removeEventListener("change", refresh);
    forcedColors.removeEventListener("change", refresh);
    scroller.removeAttribute("data-scroll-rail-enhanced");
    if (!originalId && scroller.id === "scroll-rail-document") scroller.removeAttribute("id");
    rail.remove();
    instances.delete(scroller);
  };
  const api = { refresh, destroy };
  instances.set(scroller, api);
  schedule(true);
  return api;
}
