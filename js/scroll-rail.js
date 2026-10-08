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
  const thread = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  thread.classList.add('scroll-rail__thread');
  thread.setAttribute('aria-hidden', 'true');
  thread.setAttribute('focusable', 'false');
  const track = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  track.classList.add('scroll-rail__track');
  thread.append(track);
  const thumb = node('span', 'scroll-rail__thumb');
  const grip = node('span', 'scroll-rail__grip');
  const marks = node('span', 'scroll-rail__marks');
  for (const item of [thumb, marks]) item.setAttribute('aria-hidden', 'true');
  thumb.append(grip);
  control.append(thread, marks, thumb);
  rail.append(control);
  document.body.appendChild(rail);

  let destroyed = false;
  let frame = 0;
  let idleTimer = 0;
  let feedbackTimer = 0;
  let releaseTimer = 0;
  let deformationFrame = 0;
  let deformationTime = 0;
  let pull = 0;
  let pullTarget = 0;
  let thumbTop = 0;
  let needsLayout = true;
  let interactive = false;
  let compact = false;
  let expanded = false;
  let landmarks = [];
  let trackHeight = 240;
  let thumbHeight = 44;
  let drag = null;
  const motionAllowed = () => document.documentElement.dataset.motion !== 'off' && !reducedMotion.matches && !document.hidden;
  // Only this horizontal shape is damped. Vertical position always comes from
  // native scrolling: dragging has no delayed or eased position to fight.
  const bendAt = (y, start, center, end) => {
    if (y <= start || y >= end) return 0;
    const first = y <= center;
    const distance = first ? center - start : end - center;
    const position = (y - (first ? start : center)) / Math.max(1, distance);
    const a = first ? .55 : .4;
    const b = first ? .6 : .45;
    let lower = 0, upper = 1;
    // Invert the monotone cubic ordinate; six tiny dots stay on the same
    // thread while it bends instead of floating beside the grabbed segment.
    for (let index = 0; index < 10; index += 1) {
      const t = (lower + upper) / 2;
      const ordinate = 3 * a * (1 - t) ** 2 * t + 3 * b * (1 - t) * t ** 2 + t ** 3;
      if (ordinate < position) lower = t;
      else upper = t;
    }
    const t = (lower + upper) / 2;
    const amount = 3 * t ** 2 - 2 * t ** 3;
    return first ? amount : 1 - amount;
  };
  const paintThread = () => {
    const axis = compact ? 40 : 22;
    const center = thumbTop + thumbHeight / 2;
    const start = Math.max(0, center - 62);
    const end = Math.min(trackHeight, center + 62);
    const before = center - start;
    const after = end - center;
    const x = axis - pull;
    track.setAttribute('d', `M ${axis} 0 L ${axis} ${start} C ${axis} ${start + before * .55} ${x} ${center - before * .4} ${x} ${center} C ${x} ${center + after * .4} ${axis} ${end - after * .55} ${axis} ${end} L ${axis} ${trackHeight}`);
    grip.style.transform = `translateX(${-pull}px)`;
    for (const landmark of landmarks) {
      const offset = pull ? pull * bendAt(landmark.y, start, center, end) : 0;
      landmark.mark.style.transform = `translate(${-offset}px, -50%)`;
    }
    rail.style.setProperty('--rail-pull', pull.toFixed(3));
  };
  const deform = (time) => {
    deformationFrame = 0;
    if (destroyed) return;
    const elapsed = deformationTime ? Math.min(48, time - deformationTime) : 16;
    deformationTime = time;
    const duration = pullTarget > pull ? 75 : 125;
    pull += (pullTarget - pull) * (1 - Math.exp(-elapsed / duration));
    if (!motionAllowed() || Math.abs(pullTarget - pull) < .015) {
      pull = motionAllowed() ? pullTarget : 0;
      deformationTime = 0;
      paintThread();
      delete rail.dataset.deforming;
      return;
    }
    paintThread();
    deformationFrame = requestAnimationFrame(deform);
  };
  const setPull = (next) => {
    pullTarget = motionAllowed() ? clamp(next, 0, 14) : 0;
    if (!motionAllowed()) {
      cancelAnimationFrame(deformationFrame);
      deformationFrame = 0;
      deformationTime = 0;
      pull = 0;
      delete rail.dataset.deforming;
      paintThread();
    } else if (!deformationFrame && Math.abs(pullTarget - pull) >= .015 && !destroyed) {
      rail.dataset.deforming = 'true';
      deformationFrame = requestAnimationFrame(deform);
    }
  };
  const read = () => ({
    top: scroller.scrollTop,
    viewport: documentScroll ? window.innerHeight : scroller.clientHeight,
    max: Math.max(0, scroller.scrollHeight - (documentScroll ? window.innerHeight : scroller.clientHeight)),
  });
  const setScroll = (top, smooth = false) => {
    scroller.scrollTo({ top: clamp(top, 0, read().max), behavior: smooth && motionAllowed() ? 'smooth' : 'instant' });
  };
  const setExpanded = (next) => {
    expanded = Boolean(next && compact && interactive);
    rail.dataset.expanded = String(expanded);
  };
  const feedback = (phase) => {
    clearTimeout(feedbackTimer);
    rail.dataset.phase = phase;
    clearTimeout(releaseTimer);
    if (phase === 'jump') {
      setPull(5);
      releaseTimer = setTimeout(() => setPull(0), 150);
    } else setPull(0);
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
      control.setAttribute('aria-description', 'İnce tutamacı sürükle; dokunarak bölüm noktalarını göster. Çizgide bir konuma, noktada bölüme git. Oklar, Page Up / Down, Home ve End; bölümler için Shift ve oklar. Escape ile kapat.');
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
    const frameElements = documentScroll ? [...content.querySelectorAll('.about-frame, .ab-frame')].filter(visible) : [content];
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
    rail.style.setProperty('--rail-axis', `${compact ? 40 : 22}px`);
    thread.setAttribute('viewBox', `0 0 44 ${trackHeight}`);
    rail.style.setProperty('--rail-top', `${Math.max(topLimit, (topLimit + bottomLimit - trackHeight) / 2)}px`);
    rail.style.setProperty('--rail-right', `${compact ? 8 : Math.min(32, Math.max(4, (gutter - 44) / 2))}px`);
    collectLandmarks();
  };
  const paint = () => {
    frame = 0;
    if (destroyed) return;
    if (needsLayout) { measure(); needsLayout = false; }
    const { top, max } = read();
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
    thumbHeight = 44;
    thumb.style.height = `${thumbHeight}px`;
    thumbTop = ratio * (trackHeight - thumbHeight);
    thumb.style.transform = `translateY(${thumbTop}px)`;
    paintThread();
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
    setPull(0);
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
    clearTimeout(releaseTimer);
    delete rail.dataset.phase;
    setPull(5);
    rail.dataset.pressed = 'true';
    drag = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, top: read().top, moved: false, onThumb, wasExpanded };
    control.setPointerCapture(event.pointerId);
  };
  const pointerMove = (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    setPull(5 + clamp((drag.x - event.clientX) * .45, 0, 9));
    if (Math.hypot(event.clientY - drag.y, event.clientX - drag.x) < 4 && !drag.moved) return;
    drag.moved = true;
    rail.dataset.dragging = 'true';
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
      feedback('jump');
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
  const onVisibility = () => { if (document.hidden) { cancelDrag(true); setPull(0); setExpanded(false); } else refresh(); };
  const onFocus = () => setExpanded(true);
  const onBlur = () => { cancelDrag(true); setExpanded(false); };
  const onMotion = () => {
    if (!motionAllowed()) { setScroll(read().top); setPull(0); }
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
    cancelAnimationFrame(deformationFrame);
    clearTimeout(releaseTimer);
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
