/** Copy text to the clipboard, with a fallback for plain-http hosting. */
import { toast } from "./toast.js";

function legacyCopy(text) {
  const t = document.createElement("textarea");
  t.value = text;
  t.setAttribute("readonly", "");
  t.style.position = "fixed";
  t.style.opacity = "0";
  document.body.append(t);
  t.select();
  const ok = document.execCommand("copy");
  t.remove();
  return ok;
}

export async function copyText(text, okMessage) {
  let ok = false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      ok = true;
    }
  } catch { /* permission denied → try the legacy path */ }
  if (!ok) {
    try { ok = legacyCopy(text); } catch { ok = false; }
  }
  toast(ok ? okMessage : "Copy failed: select the text and press Ctrl+C");
}
