// Presentation only: native scroll position is the single source of truth.
// The compact rail has a slim edge grip and a local 44px touch target;
// it never captures an invisible full-height edge gesture.
const instances = new WeakMap();
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const visible = (node) => node?.isConnected && !node.closest('[hidden]') && node.getClientRects().length > 0;
const node = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

/** Enhance an existing scrolling surface without changing content or routing.
 * Repeated initialization is safe; destroy restores the native scrollbar.
 * @param {{scroller?: Element, content?: Element}} [options]
 */
export function initScrollRail({
  scroller = document.getElementById('shell-scroll') || document.scrollingElement,
  content = document.querySelector('#shell-scroll > .page') || document.querySelector('main'),
} = {}) {
  if (!scroller || !content || typeof ResizeObserver === 'undefined') return null;
  if (instances.has(scroller)) return instances.get(scroller);
  const documentScroll = scroller === document.scrollingElement;
  const eventTarget = documentScroll ? window : scroller;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const forcedColors = matchMedia('(forced-colors: active)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const originalId = scroller.id;
  if (!scroller.id) scroller.id = 'scroll-rail-document';

  const rail = node('nav', 'scroll-rail');
  rail.setAttribute('aria-label', 'Sayfa konumu');
  rail.hidden = true;
  const control = node('div', 'scroll-rail__control');
  const track = node('span', 'scroll-rail__track');
  const thumb = node('span', 'scroll-rail__thumb');
  const grip = node('span', 'scroll-rail__grip');
  const marks = node('span', 'scroll-rail__marks');
  const pulse = node('span', 'scroll-rail__pulse');
  for (const item of [track, thumb, marks, pulse]) item.setAttribute('aria-hidden', 'true');
  thumb.append(grip);
  control.append(track, marks, pulse, thumb);
  rail.append(control);
  document.body.appendChild(rail);

  let destroyed = false;
  let frame = 0;
  let idleTimer = 0;
  let feedbackTimer = 0;
  let needsLayout = true;
  let interactive = false;
  let compact = false;
  let expanded = false;
  let landmarks = [];
  let trackHeight = 240;
  let thumbHeight = 44;
  let drag = null;
  const read = () => ({
    top: scroller.scrollTop,
    viewport: documentScroll ? window.innerHeight : scroller.clientHeight,
    max: Math.max(0, scroller.scrollHeight - (documentScroll ? window.innerHeight : scroller.clientHeight)),
  });
  const setScroll = (top, smooth = false) => {
    const reduced = document.documentElement.dataset.motion === 'off' || reducedMotion.matches;
    scroller.scrollTo({ top: clamp(top, 0, read().max), behavior: smooth && !reduced ? 'smooth' : 'instant' });
  };
  const setExpanded = (next) => {
    expanded = Boolean(next && compact && interactive);
    rail.dataset.expanded = String(expanded);
  };
  const feedback = (phase, y) => {
    clearTimeout(feedbackTimer);
    rail.dataset.phase = phase;
    if (y !== undefined) rail.style.setProperty('--rail-pulse-y', `${clamp(y - 22, 0, trackHeight - 44)}px`);
    feedbackTimer = setTimeout(() => { delete rail.dataset.phase; }, 520);
  };
  const offsetOf = (element) => {
    const inset = documentScroll ? 24 : parseFloat(getComputedStyle(scroller).scrollPaddingTop) || 80;
    const top = documentScroll ? 0 : scroller.getBoundingClientRect().top;
    return clamp(element.getBoundingClientRect().top - top + read().top - inset, 0, read().max);
  };
  const labelOf = (element) => (element.matches('h1,h2,h3') ? element : element.querySelector('h1,h2,h3'))?.textContent.trim().replace(/\s+/g, ' ').slice(0, 90) || 'Bölüm';
  const collectLandmarks = () => {
    const article = content.querySelector('.lesson');
    let candidates = [];
    let maximum = 5;
    if (visible(article)) {
      candidates = [article.querySelector('.lesson__head'), ...article.querySelectorAll(':scope > .block:has(h2), :scope > .block--end')];
    } else if (document.body.classList.contains('about-page')) {
      candidates = [...content.querySelectorAll(':scope > section')];
      maximum = 6;
    }
    candidates = [...new Set(candidates.filter(visible))];
    if (candidates.length > maximum) {
      candidates = Array.from({ length: maximum }, (_, index) => candidates[Math.round(index * (candidates.length - 1) / (maximum - 1))]);
    }
    const max = read().max;
    const positions = [];
    for (const element of candidates) {
      const top = positions.length ? offsetOf(element) : 0;
      const y = max ? top / max * (trackHeight - 44) + 22 : 22;
      if (positions.length && y - positions.at(-1).y < 44) continue;
      positions.push({ element, top, y, label: labelOf(element) });
    }
    landmarks = positions.length > 1 ? positions : [];
    marks.replaceChildren();
    for (const landmark of landmarks) {
      const mark = node('span', 'scroll-rail__mark');
      mark.style.top = `${landmark.y}px`;
      marks.appendChild(mark);
      landmark.mark = mark;
    }
    rail.dataset.mode = landmarks.length ? 'staged' : 'continuous';
  };
  const configureInteraction = (next) => {
    if (interactive === next && rail.dataset.interactive !== undefined) return;
    interactive = next;
    rail.dataset.interactive = String(next);
    if (next) {
      rail.removeAttribute('aria-hidden');
      control.tabIndex = 0;
      control.setAttribute('role', 'scrollbar');
      control.setAttribute('aria-label', 'Sayfada gezin');
      control.setAttribute('aria-controls', scroller.id);
      control.setAttribute('aria-orientation', 'vertical');
      control.setAttribute('aria-valuemin', '0');
      control.setAttribute('aria-valuemax', '100');
      control.setAttribute('aria-description', 'Tutamacı sürükle; rayı açmak için dokun. Boş rayda kaydır, noktalarda bölüme git. Oklar, Page Up / Down, Home ve End; bölümler için Shift ve oklar. Escape ile kapat.');
    } else {
      if (document.activeElement === control) control.blur();
      rail.setAttribute('aria-hidden', 'true');
      control.removeAttribute('tabindex');
      for (const attribute of [...control.attributes]) if (attribute.name.startsWith('aria-') || attribute.name === 'role') control.removeAttribute(attribute.name);
      cancelDrag(true);
      setExpanded(false);
    }
  };
  const measure = () => {
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    const viewportWidth = document.documentElement.clientWidth;
    const rect = scroller.getBoundingClientRect();
    const topLimit = Math.max(80, documentScroll ? 80 : rect.top + 80);
    const bottomLimit = Math.min(viewportHeight - 96, documentScroll ? viewportHeight : rect.bottom - 80);
    trackHeight = clamp((bottomLimit - topLimit) * 0.6, 120, 320);
    const frameElements = documentScroll ? [...content.querySelectorAll('.about-frame')].filter(visible) : [content];
    const rightEdge = Math.max(0, ...frameElements.map((element) => {
      const padding = documentScroll ? parseFloat(getComputedStyle(element).paddingRight) || 0 : 0;
      return element.getBoundingClientRect().right - padding;
    }));
    const gutter = viewportWidth - rightEdge;
    const nextCompact = gutter < 52 || !finePointer.matches;
    if (compact !== nextCompact) {
      compact = nextCompact;
      cancelDrag(true);
      setExpanded(false);
    }
    rail.dataset.compact = String(compact);
    configureInteraction(bottomLimit - topLimit >= 120 && !forcedColors.matches);
    rail.style.setProperty('--rail-height', `${trackHeight}px`);
    rail.style.setProperty('--rail-top', `${Math.max(topLimit, (topLimit + bottomLimit - trackHeight) / 2)}px`);
    rail.style.setProperty('--rail-right', `${compact ? 8 : Math.min(32, Math.max(4, (gutter - 44) / 2))}px`);
    collectLandmarks();
  };
  const paint = () => {
    frame = 0;
    if (destroyed) return;
    if (needsLayout) { measure(); needsLayout = false; }
    const { top, viewport, max } = read();
    const enabled = max > 2 && interactive && !forcedColors.matches;
    if (!enabled) {
      if (document.activeElement === control) control.blur();
      cancelDrag(false);
      setExpanded(false);
    }
    rail.hidden = !enabled;
    if (enabled) scroller.setAttribute('data-scroll-rail-enhanced', '');
    else scroller.removeAttribute('data-scroll-rail-enhanced');
    const ratio = max ? clamp(top / max, 0, 1) : 0;
    thumbHeight = compact ? 44 : clamp(viewport / (max + viewport) * trackHeight, 28, 86);
    thumb.style.height = `${thumbHeight}px`;
    thumb.style.transform = `translateY(${ratio * (trackHeight - thumbHeight)}px)`;
    let current = null;
    for (const landmark of landmarks) {
      if (top + 24 >= landmark.top) current = landmark;
      landmark.mark.dataset.current = 'false';
    }
    if (current) current.mark.dataset.current = 'true';
    const value = Math.round(ratio * 100);
    if (interactive) {
      control.setAttribute('aria-valuenow', String(value));
      control.setAttribute('aria-valuetext', `%${value}${current ? ` · ${current.label}` : ' · Sayfa konumu'}`);
    }
  };
  const schedule = (layout = false) => {
    needsLayout ||= layout;
    if (!frame && !destroyed) frame = requestAnimationFrame(paint);
  };
  const onScroll = () => {
    rail.dataset.scrolling = 'true';
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { delete rail.dataset.scrolling; }, 260);
    schedule();
  };
  const refresh = () => schedule(true);
  function cancelDrag(restore) {
    if (!drag) return;
    const previous = drag;
    drag = null;
    delete rail.dataset.dragging;
    delete rail.dataset.pressed;
    rail.style.removeProperty('--rail-pinch');
    if (control.hasPointerCapture(previous.pointerId)) control.releasePointerCapture(previous.pointerId);
    if (restore) {
      setScroll(previous.top);
      feedback('cancel');
      setExpanded(false);
    }
  }
  const pointerDown = (event) => {
    if (!interactive || event.button !== 0 || drag || !event.isPrimary) return;
    event.preventDefault();
    rail.dataset.input = 'pointer';
    const thumbRect = thumb.getBoundingClientRect();
    const wasExpanded = expanded;
    const onThumb = event.clientY >= thumbRect.top && event.clientY <= thumbRect.bottom;
    control.focus({ preventScroll: true });
    setExpanded(true);
    clearTimeout(feedbackTimer);
    delete rail.dataset.phase;
    rail.dataset.pressed = 'true';
    drag = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, top: read().top, moved: false, onThumb, wasExpanded };
    control.setPointerCapture(event.pointerId);
  };
  const pointerMove = (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    if (Math.abs(event.clientY - drag.y) < 4 && !drag.moved) return;
    drag.moved = true;
    rail.dataset.dragging = 'true';
    rail.style.setProperty('--rail-pinch', String(clamp(Math.abs(event.clientX - drag.x) / 60, 0, 1)));
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
    if (previous.moved) feedback('release');
    else if (inBounds && !previous.onThumb) {
      const y = event.clientY - rect.top;
      const landmark = landmarks.find((item) => Math.abs(item.y - y) <= 20);
      rail.dataset.action = landmark ? 'stage' : 'position';
      feedback('jump', y);
      setScroll(landmark ? landmark.top : (y - thumbHeight / 2) / Math.max(1, trackHeight - thumbHeight) * read().max, true);
    } else if (inBounds) {
      // A first tap opens the compact rail; a second tap closes it. Dragging
      // never changes modes or snaps the reader away from the chosen position.
      if (compact && previous.wasExpanded) setExpanded(false);
      feedback('release');
    }
  };
  const pointerCancel = () => cancelDrag(true);
  const keyDown = (event) => {
    if (!interactive) return;
    rail.dataset.input = 'keyboard';
    const { top, viewport, max } = read();
    let next;
    let staged = false;
    if (event.key === 'Escape') {
      event.preventDefault();
      cancelDrag(true);
      setExpanded(false);
      return;
    }
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.shiftKey && (event.key === 'ArrowDown' || event.key === 'ArrowUp') && landmarks.length) {
      const destination = event.key === 'ArrowDown'
        ? landmarks.find((item) => item.top > top + 24)
        : [...landmarks].reverse().find((item) => item.top < top - 24);
      next = destination?.top ?? (event.key === 'ArrowDown' ? max : 0);
      staged = true;
    } else if (event.key === 'ArrowDown') next = top + 48;
    else if (event.key === 'ArrowUp') next = top - 48;
    else if (event.key === 'PageDown' || event.key === ' ' && !event.shiftKey) next = top + viewport * 0.85;
    else if (event.key === 'PageUp' || event.key === ' ' && event.shiftKey) next = top - viewport * 0.85;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = max;
    if (next !== undefined) {
      event.preventDefault();
      setExpanded(true);
      rail.dataset.action = staged ? 'stage' : 'position';
      feedback('release');
      setScroll(next, staged);
    }
  };
  const onDocumentPointerDown = (event) => {
    if (drag && event.pointerId !== drag.pointerId) cancelDrag(true);
    if (!rail.contains(event.target)) setExpanded(false);
  };
  const onVisibility = () => { if (document.hidden) { cancelDrag(true); setExpanded(false); } else refresh(); };
  const onFocus = () => setExpanded(true);
  const onBlur = () => { cancelDrag(true); setExpanded(false); };
  const onMotion = () => {
    if (document.documentElement.dataset.motion === 'off' || reducedMotion.matches) setScroll(read().top);
    schedule();
  };
  eventTarget.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', refresh);
  window.visualViewport?.addEventListener('resize', refresh);
  window.addEventListener('blur', onBlur);
  document.addEventListener('visibilitychange', onVisibility);
  document.addEventListener('motion:change', onMotion);
  document.addEventListener('pointerdown', onDocumentPointerDown, true);
  control.addEventListener('pointerdown', pointerDown);
  control.addEventListener('pointermove', pointerMove);
  control.addEventListener('pointerup', pointerUp);
  control.addEventListener('pointercancel', pointerCancel);
  control.addEventListener('lostpointercapture', pointerCancel);
  control.addEventListener('keydown', keyDown);
  control.addEventListener('focus', onFocus);
  control.addEventListener('blur', onBlur);
  finePointer.addEventListener('change', refresh);
  forcedColors.addEventListener('change', refresh);
  reducedMotion.addEventListener('change', onMotion);
  const resizeObserver = new ResizeObserver(refresh);
  resizeObserver.observe(content);
  if (!documentScroll) resizeObserver.observe(scroller);
  const mutationObserver = new MutationObserver(refresh);
  mutationObserver.observe(content, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'open'] });
  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    cancelDrag(true);
    cancelAnimationFrame(frame);
    clearTimeout(idleTimer);
    clearTimeout(feedbackTimer);
    resizeObserver.disconnect();
    mutationObserver.disconnect();
    eventTarget.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', refresh);
    window.visualViewport?.removeEventListener('resize', refresh);
    window.removeEventListener('blur', onBlur);
    document.removeEventListener('visibilitychange', onVisibility);
    document.removeEventListener('motion:change', onMotion);
    document.removeEventListener('pointerdown', onDocumentPointerDown, true);
    finePointer.removeEventListener('change', refresh);
    forcedColors.removeEventListener('change', refresh);
    reducedMotion.removeEventListener('change', onMotion);
    scroller.removeAttribute('data-scroll-rail-enhanced');
    if (!originalId && scroller.id === 'scroll-rail-document') scroller.removeAttribute('id');
    rail.remove();
    instances.delete(scroller);
  };
  const api = { refresh, destroy };
  instances.set(scroller, api);
  schedule(true);
  return api;
}
