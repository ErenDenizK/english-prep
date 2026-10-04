# v0.73 — a thin, pinchable thread

The owner's new sketch supersedes the v0.72 opened well and dotted grip. The
requested object is a thin line that can be caught and pulled gently inward,
with one continuous deformation rather than a sequence of ticks or pulses.
This round changes presentation and interaction feedback, not lesson material,
quiz state, native scrolling, or route behavior.

## Shape and response

- The resting thread is a 1.5px SVG stroke. The rounded grip is 5px wide and
  38px tall; hover/scroll makes it 6px. Holding makes it 8px wide and 34px tall.
  These are visual sizes; the local transparent grab target remains 44×44px.
- A press draws the line inward by 5px. Further horizontal pull adds 0.45px per
  pointer pixel, capped at a total 14px. Outward motion reduces the extra pull.
  A purely horizontal gesture changes the shape without moving the page.
- Two cubic Bézier segments form the local bow, within 62px above/below the
  grip's center. The joining tangents remain vertical and continuous. Section
  dots follow the same curve: the monotone cubic ordinate is inverted to place
  each dot on the thread, so the object remains visually whole.
- Horizontal deformation approaches its target exponentially, using a 75ms
  attack and 125ms return time constant. This is approximately 225ms to 95% of
  the held displacement and 375ms to 95% of the return. Releasing early starts
  from the actual intermediate shape; there is no restarted keyframe or snap.
- Native scroll position drives the grip's **vertical** position immediately.
  A low-pass filter on that position would make the finger and page disagree;
  only the decorative sideways shape is damped.

There is no square grip, opened filled panel, ring pulse, or desktop caption.
A small restrained grip glow confirms a press or destination. Section travel
uses the existing iris role; ordinary position travel uses the Sakura role.
Colors change smoothly without changing the meaning of existing text.

## Touch, pointer, and keyboard

At narrow widths, only the 44px local thumb catches input at rest. A tap exposes
small section dots and enables a 16px edge strip for destination taps. The
thread stays thin in this mode; no opaque well covers the reading column.
Outside press or Escape closes this destination mode. A second thumb tap closes
it too. On a wide layout the existing measured gutter provides the track area.

Dragging is continuous and never snaps to sections. Tapping a real section dot
travels smoothly to its authored offset; tapping elsewhere chooses a continuous
position. The app still has no invented page count or imposed scroll snapping.
Wheel, trackpad, and native swipes in the reading area remain browser scrolling.
The rail never advances a quiz question or writes learning progress.

Arrow keys, Page Up/Down, Home/End, and Shift+Arrow section travel remain.
The focused scrollbar supplies current percentage and section name through
`aria-valuetext`. Its focus indication stays on the thin artwork. Escape,
pointer cancellation, a second touch, and window blur restore an unfinished
drag's original position. Vertical pan and pinch zoom outside the local rail
remain native.

## Lifecycle and motion preference

The deformation loop runs only after input and stops once the error is below
0.015px. Settled drawing, idle time, and ordinary background presence do not run
an animation loop. Scroll/layout changes request one paint, just as before.
Destroy removes observers/listeners and cancels timers and both paint requests.

Reduced motion, the persistent motion-off setting, and a hidden document stop
the decorative deformation. Scrolling and destination actions still work;
programmatic travel becomes immediate. Forced colors and insufficient usable
height retain native scrollbar fallback. No dependency or continuous spring
simulation was introduced.

## Verification

`python3 tests/scroll_rail_browser.py --base-url <served-prefix>` covers 12 real
Chromium cases, including actual CDP touch input:

- 320/390/640px layout, 44px target, thin edge art, and absence of overflow;
- continuous drag, unchanged route/attempt, cancellation, and native wheel;
- native touch scrolling, thumb grab, second-touch cancellation, and tap modes;
- real section stops, keyboard travel, About gutter, and cleanup;
- 390/1440px horizontal-only pull with unchanged page position, intermediate
  deformation, the 8px held width, gradual release, and no remaining timeline;
- reduced-motion deformation suppression and forced-color fallback.

Actual 320/390/1440px resting, held, and returning frames were inspected. The
independent review caught a hover-selector specificity issue that limited the
held desktop width to 6px; matching specificity now gives the intended 8px.
These are Chromium measurements and emulated touch checks, not a physical
Safari certification or a participant usability study.
