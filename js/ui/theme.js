/** Light/dark toggle. The choice is kept in the URL hash (read by js/theme-boot.js), not in storage: the page stores nothing. */
import { $ } from "./dom.js";

export function initTheme() {
  $("themeBtn").addEventListener("click", () => {
    const root = document.documentElement;
    const isDark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    const next = isDark ? "light" : "dark";
    root.dataset.theme = next;
    history.replaceState(null, "", `#${next}`);
  });
}
