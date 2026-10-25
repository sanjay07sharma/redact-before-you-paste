/** "Wipe everything & refresh" plus the idle auto-wipe. */
import { IDLE_TIMEOUT_MS } from "../config.js";
import { $ } from "./dom.js";

/**
 * @param {{ hasData: () => boolean, clearAll: () => void }} deps
 */
export function initSession({ hasData, clearAll }) {
  const hint = $("idleHint");
  const minutes = Math.round(IDLE_TIMEOUT_MS / 60000);
  let lastActivity = Date.now();

  function wipe() {
    clearAll();          // drop values from the DOM first…
    location.reload();   // …then throw away all JS memory
  }

  $("wipeBtn").addEventListener("click", wipe);

  ["input", "keydown", "pointerdown", "scroll"].forEach((ev) =>
    window.addEventListener(ev, () => (lastActivity = Date.now()), { passive: true }));

  setInterval(() => {
    const left = IDLE_TIMEOUT_MS - (Date.now() - lastActivity);
    if (!hasData()) { hint.textContent = `Auto-wipes after ${minutes} min of inactivity.`; return; }
    hint.textContent = `Auto-wipe in ${Math.max(0, Math.ceil(left / 60000))} min if idle.`;
    if (left <= 0) wipe();
  }, 15000);
}
