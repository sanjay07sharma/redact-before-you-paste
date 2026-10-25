/**
 * App-wide settings. Change behaviour here, not in the logic files.
 */

/** Detector categories shown as toggles in "What to detect". */
export const CATEGORIES = [
  { id: "names", name: "Names & companies", on: true },
  { id: "emails", name: "Emails", on: true },
  { id: "phones", name: "Phone numbers", on: true },
  { id: "urls", name: "URLs & domains", on: true },
  { id: "secrets", name: "Passwords, keys & tokens", on: true },
  { id: "finance", name: "IBAN, cards, IFSC", on: true },
  { id: "ids", name: "Aadhaar, PAN, GSTIN, IDs", on: true },
  { id: "amounts", name: "Money amounts", on: true },
  { id: "network", name: "IP & MAC addresses", on: true },
  { id: "numbers", name: "Long numbers (accounts…)", on: true },
  { id: "refs", name: "Invoice / order refs", on: true },
  { id: "paths", name: "File paths (tracebacks)", on: true },
  { id: "errvalues", name: "Error values, ids, literals", on: true },
];

/**
 * Public hosts left visible (exact host match only).
 * Customer databases like acme.odoo.com are NOT covered by "odoo.com".
 */
export const DEFAULT_KEEP_DOMAINS = [
  "odoo.com", "www.odoo.com", "apps.odoo.com", "github.com",
  "docs.python.org", "stackoverflow.com", "developer.mozilla.org",
].join(", ");

/** Wipe the page after this much inactivity while it holds text. */
export const IDLE_TIMEOUT_MS = 10 * 60 * 1000;

/** Debounce for live redaction while typing. */
export const TYPING_DEBOUNCE_MS = 120;

/** Labels used for the user's own term lists. */
export const CUSTOM_LABELS = { clients: "CLIENT", people: "NAME", other: "TERM" };
