// Two typographic signatures, one accessible brand. Use the compact form in
// constrained chrome and the full name at introductions and presentation scale.
import { el } from "./dom.js";

export function createBrand({ variant = "compact" } = {}) {
  const mode = ["compact", "full", "responsive"].includes(variant) ? variant : "compact";
  const brand = el("span", `brand-mark brand-mark--${mode}`);
  brand.setAttribute("role", "img");
  brand.setAttribute("aria-label", "English Prep");
  brand.lang = "en";
  if (mode === "responsive") {
    brand.append(
      el("span", "brand-mark__letters brand-mark__letters--compact", "ep"),
      el("span", "brand-mark__letters brand-mark__letters--full", "english prep"),
    );
  } else {
    brand.appendChild(el("span", "brand-mark__letters", mode === "full" ? "english prep" : "ep"));
  }
  brand.appendChild(el("span", "brand-mark__dot", "."));
  return brand;
}
