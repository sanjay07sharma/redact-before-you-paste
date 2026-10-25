/** Step 1: the pasted text and the user's own term lists. */
import { DEFAULT_KEEP_DOMAINS, TYPING_DEBOUNCE_MS } from "../config.js";
import { $, debounce } from "./dom.js";

export function initInputPanel(onChange) {
  const input = $("input");
  const clients = $("clients");
  const people = $("people");
  const other = $("other");
  const keepDomains = $("keepDomains");
  keepDomains.value = DEFAULT_KEEP_DOMAINS;

  const fire = debounce(onChange, TYPING_DEBOUNCE_MS);
  [input, clients, people, other, keepDomains].forEach((el) => el.addEventListener("input", fire));
  input.focus();

  return {
    getText: () => input.value,
    /** Options for core redact(), minus categories/keep which live in app state. */
    getTermOptions: () => ({
      clients: clients.value,
      people: people.value,
      other: other.value,
      keepDomains: keepDomains.value,
    }),
    /** Append a term to the "Anything else" list (used by Mask selection). */
    addOtherTerm(term) {
      other.value = other.value ? `${other.value}, ${term}` : term;
    },
    clear() {
      [input, clients, people, other].forEach((el) => (el.value = ""));
    },
  };
}
