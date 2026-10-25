/** "What to detect" chips. Returns a live map of enabled categories. */
import { CATEGORIES } from "../config.js";
import { $ } from "./dom.js";

/**
 * @param {() => void} onChange called when any toggle flips
 * @returns {Record<string, boolean>} live object, mutated on toggle
 */
export function initCategoryToggles(onChange) {
  const enabled = {};
  const host = $("chips");
  for (const c of CATEGORIES) {
    enabled[c.id] = c.on;
    const label = document.createElement("label");
    label.className = "chip";
    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = c.on;
    box.addEventListener("change", () => { enabled[c.id] = box.checked; onChange(); });
    label.append(box, document.createTextNode(c.name));
    host.append(label);
  }
  return enabled;
}
