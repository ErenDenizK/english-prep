// A labeled reading/answer metric. Values are available immediately; the
// optional CSS emphasis never counts a number up or postpones its meaning.
import { el } from "./dom.js";

export function progressMetric({ label, value, ratio = null, tone = "accent", description, className = "" }) {
  const metric = el("div", `metric${tone === "confirmed" ? " metric--confirmed" : ""}${ratio === null ? " metric--empty" : ""}${className ? ` ${className}` : ""}`);
  const head = el("div", "metric__head");
  head.appendChild(el("span", "metric__label", label));
  head.appendChild(el("span", "metric__value t-num", value));
  metric.appendChild(head);
  if (ratio !== null) {
    const clamped = Math.min(1, Math.max(0, Number.isFinite(ratio) ? ratio : 0));
    const track = el("div", "metric__track");
    track.setAttribute("role", "progressbar");
    track.setAttribute("aria-label", label);
    track.setAttribute("aria-valuemin", "0");
    track.setAttribute("aria-valuemax", "100");
    track.setAttribute("aria-valuenow", String(Math.round(clamped * 100)));
    track.setAttribute("aria-valuetext", value);
    const fill = el("span", "metric__fill");
    fill.style.transform = `scaleX(${clamped})`;
    track.appendChild(fill);
    metric.appendChild(track);
  }
  if (description) metric.appendChild(el("p", "metric__description t-quiet", description));
  return metric;
}
