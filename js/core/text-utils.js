/** Small, pure string helpers shared by the core. */

export const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** "a, b; c\nd" → ["a", "b", "c", "d"] (ignores 1-char noise). */
export function splitTerms(str) {
  return (str || "").split(/[\n,;]+/).map((t) => t.trim()).filter((t) => t.length >= 2);
}

/** Case/space-insensitive key so "Sanjay  Sharma" and "Sanjay Sharma" share a placeholder. */
export const normalize = (s) => s.trim().toLowerCase().replace(/\s+/g, " ");

/** Host part of a URL or bare domain, lower-cased. */
export function hostOf(value) {
  const m = value.match(/^[a-z][a-z0-9+.-]*:\/\/(?:[^@\/\s]*@)?([^\/:?#\s]+)/i);
  return (m ? m[1] : value).toLowerCase();
}

/** True when a URL carries inline credentials (user:pass@host). */
export const hasCredentials = (url) => /:\/\/[^\/\s]*@/.test(url);

export const digitCount = (s) => (s.match(/\d/g) || []).length;
