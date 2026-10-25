/** Step 2 (below output): counts per type and the placeholder ↔ original table. */
import { $, escapeHtml, maskPreview } from "./dom.js";
import { toast } from "./toast.js";

/**
 * @param {{ onKeep: (original: string) => void }} handlers
 */
export function initEntriesTable({ onKeep }) {
  const stats = $("stats");
  const body = $("entries");
  const wrap = $("tableWrap");
  const revealBtn = $("revealAll");
  let reveal = false;
  let last = { entries: [], hasInput: false };

  revealBtn.addEventListener("click", () => {
    reveal = !reveal;
    revealBtn.textContent = reveal ? "🙈 Hide" : "👁 Show";
    render(last.entries, last.hasInput);
  });

  function renderStats(entries, hasInput) {
    if (!entries.length) {
      stats.innerHTML = hasInput ? `<span class="stat">Nothing detected. Add names above if needed.</span>` : "";
      return;
    }
    const perLabel = {};
    let total = 0;
    for (const e of entries) { perLabel[e.label] = (perLabel[e.label] || 0) + e.count; total += e.count; }
    stats.innerHTML =
      `<span class="stat"><b>${total}</b> masked</span>` +
      Object.entries(perLabel).map(([k, v]) => `<span class="stat">${k.toLowerCase()} <b>${v}</b></span>`).join("");
  }

  function renderRows(entries) {
    body.innerHTML = "";
    for (const e of entries) {
      const tr = document.createElement("tr");
      tr.innerHTML =
        `<td><code>${escapeHtml(e.placeholder)}</code></td>` +
        `<td class="orig">${escapeHtml(reveal ? e.original : maskPreview(e.original))}</td><td></td>`;
      const keep = document.createElement("button");
      keep.type = "button";
      keep.className = "secondary mini";
      keep.textContent = "↩ Keep";
      keep.title = "Not sensitive: leave it visible";
      keep.addEventListener("click", () => { onKeep(e.original); toast("Kept visible: " + maskPreview(e.original)); });
      tr.lastChild.append(keep);
      body.append(tr);
    }
  }

  function render(entries, hasInput) {
    last = { entries, hasInput };
    renderStats(entries, hasInput);
    wrap.hidden = !entries.length;
    renderRows(entries);
  }

  return { render };
}
