/** Step 2: highlighted redacted text, copy button, "Mask selection". */
import { $, escapeHtml, maskPreview } from "./dom.js";
import { copyText } from "./clipboard.js";
import { toast } from "./toast.js";

const PLACEHOLDER = /<[A-Z]+_\d+>/;
const highlight = (s) => escapeHtml(s).replace(/&lt;([A-Z]+_\d+)&gt;/g, "<mark>&lt;$1&gt;</mark>");

/**
 * @param {{ onMaskSelection: (term: string) => void }} handlers
 */
export function initOutputPanel({ onMaskSelection }) {
  const output = $("output");
  const copyBtn = $("copyBtn");
  let current = "";

  copyBtn.addEventListener("click", () => copyText(current, "Redacted text copied ✓"));

  $("maskSelBtn").addEventListener("click", () => {
    const sel = window.getSelection();
    const picked = sel ? sel.toString().trim() : "";
    if (!picked || !output.contains(sel.anchorNode)) return toast("Select a word in the redacted output first");
    if (PLACEHOLDER.test(picked)) return toast("Select only the unmasked words");
    sel.removeAllRanges();
    onMaskSelection(picked);
    toast("Masked: " + maskPreview(picked));
  });

  return {
    render(redactedText, hasInput) {
      current = redactedText;
      output.innerHTML = hasInput ? highlight(redactedText) : "";
      copyBtn.disabled = !hasInput;
    },
    clear() { current = ""; output.textContent = ""; },
  };
}
