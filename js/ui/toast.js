/** Short status messages at the bottom of the screen. */
import { $ } from "./dom.js";

let timer;

export function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(timer);
  timer = setTimeout(() => el.classList.remove("show"), 1800);
}
