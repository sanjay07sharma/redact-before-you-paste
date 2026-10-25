/** Tiny DOM helpers shared by UI modules. */

export const $ = (id) => document.getElementById(id);

export const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

/** "rajesh@acme.example" → "ra••••••••" (for on-screen review without shoulder-surfing). */
export const maskPreview = (s) => (s.length <= 3 ? "•••" : s.slice(0, 2) + "•".repeat(Math.min(8, s.length - 2)));

export function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}
