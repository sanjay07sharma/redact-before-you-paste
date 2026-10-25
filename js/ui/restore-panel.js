/** Step 3: swap placeholders in the AI's answer back to the real values. */
import { restore } from "../core/index.js";
import { $ } from "./dom.js";
import { copyText } from "./clipboard.js";

export function initRestorePanel() {
  const answer = $("aiAnswer");
  const output = $("restored");
  const copyBtn = $("copyRestored");
  let entries = [];
  let restored = "";

  function render() {
    restored = answer.value ? restore(answer.value, entries) : "";
    output.textContent = restored;
    copyBtn.disabled = !restored;
  }

  answer.addEventListener("input", render);
  copyBtn.addEventListener("click", () => copyText(restored, "Restored text copied. Use it only internally"));

  return {
    /** Called whenever the redaction changes so restore uses the latest mapping. */
    setEntries(next) { entries = next; render(); },
    hasText: () => Boolean(answer.value),
    clear() { answer.value = ""; restored = ""; output.textContent = ""; entries = []; },
  };
}
