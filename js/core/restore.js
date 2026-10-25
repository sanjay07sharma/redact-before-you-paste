/**
 * Put real values back into an AI answer that still contains placeholders.
 * Longest placeholders first so <NAME_12> isn't hit by <NAME_1>.
 */
export function restore(text, entries) {
  return [...entries]
    .sort((a, b) => b.placeholder.length - a.placeholder.length)
    .reduce((out, e) => out.split(e.placeholder).join(e.original), text);
}
