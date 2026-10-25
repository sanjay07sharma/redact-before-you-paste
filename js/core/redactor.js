/**
 * redact(text, options) → { text, entries }
 *
 * Pipeline:
 *   1. user's own terms (always win)
 *   2. detector rules, in priority order
 *   3. spread detected names (and Odoo database names) to every other mention
 *   4. replace with numbered placeholders (same value → same placeholder)
 */
import { CATEGORIES, CUSTOM_LABELS } from "../config.js";
import { DETECTORS, NON_NAMES } from "./detectors/index.js";
import { SpanSet } from "./span-set.js";
import { escapeRegExp, hostOf, normalize, splitTerms } from "./text-utils.js";

const defaultCategories = () => Object.fromEntries(CATEGORIES.map((c) => [c.id, c.on]));
const wordRe = (term, flags) => new RegExp(`(?<![\\w])${escapeRegExp(term)}(?![\\w])`, flags);

/** Step 1 — exact terms typed by the user, longest first so "Acme Textiles" beats "Acme". */
function applyCustomTerms(text, set, options) {
  const terms = Object.entries(CUSTOM_LABELS)
    .flatMap(([field, label]) => splitTerms(options[field]).map((t) => [t, label]))
    .sort((a, b) => b[0].length - a[0].length);
  for (const [term, label] of terms) {
    const re = wordRe(term, "gi");
    let m;
    while ((m = re.exec(text))) set.add(m.index, m.index + m[0].length, label, "custom");
  }
}

/** Resolve a regex match to the exact value + start index the rule wants masked. */
function resolveMatch(rule, m, text) {
  let value = m[0];
  let start = m.index;
  if (rule.group) {
    value = m[rule.group];
    if (value == null) return null;
    start = m.index + m[0].lastIndexOf(value);
  }
  if (rule.trimTrailingPunct) value = value.replace(/[.,;:!?]+$/, "");
  if (rule.trimSentenceDot && value.endsWith(".") && /^(?:\s|$)/.test(text.charAt(start + value.length))) {
    value = value.slice(0, -1);
  }
  return value ? { value, start } : null;
}

/** Step 2 — run every enabled detector. */
function applyDetectors(text, set, enabled) {
  for (const rule of DETECTORS) {
    if (!enabled[rule.cat]) continue;
    rule.re.lastIndex = 0;
    let m;
    while ((m = rule.re.exec(text))) {
      if (m[0].length === 0) { rule.re.lastIndex++; continue; }
      const hit = resolveMatch(rule, m, text);
      if (!hit) continue;
      if (rule.check && !rule.check(hit.value, text, hit.start)) continue;
      set.add(hit.start, hit.start + hit.value.length, rule.labelFor ? rule.labelFor(hit.value) : rule.label, rule.cat);
    }
  }
}

/**
 * Step 3 — if "Rajesh" was caught after "Hi", also catch "Sanjay Sharma"
 * and every later "Rajesh" that had no greeting in front of it.
 */
function propagateNames(text, set) {
  for (const span of set.sorted()) {
    if (span.label !== "NAME" && span.label !== "CLIENT") continue;
    if (span.label === "NAME" && !/\s/.test(span.original)) {
      const fullName = new RegExp(`(?<![\\w])${escapeRegExp(span.original)}[ \\t]+[A-Z][a-zA-Z'-]+(?![\\w])`, "g");
      let f;
      while ((f = fullName.exec(text))) {
        const surname = f[0].split(/\s+/).pop();
        if (!NON_NAMES.has(surname)) set.add(f.index, f.index + f[0].length, "NAME", span.cat);
      }
    }
    const re = wordRe(span.original, "g");
    let m;
    while ((m = re.exec(text))) set.add(m.index, m.index + m[0].length, span.label, span.cat);
  }
}

const ODOO_HOST = /^([a-z0-9][a-z0-9-]*)\.(?:odoo\.com|odoo\.sh|dev\.odoo\.com)$/i;
const NOT_A_DB = new Set(["www", "apps", "accounts", "runbot", "upgrade", "nightly", "download"]);

/**
 * Step 3b — a customer URL like https://acme-prod.odoo.com reveals the database name.
 * Mask that name wherever it appears on its own (log lines, prose).
 */
function propagateDatabaseNames(text, set) {
  for (const span of set.sorted()) {
    if (span.label !== "URL" && span.label !== "DOMAIN") continue;
    const host = hostOf(span.original);
    const m = host.match(ODOO_HOST);
    if (!m || NOT_A_DB.has(m[1].toLowerCase())) continue;
    const re = new RegExp(`(?<![\\w.-])${escapeRegExp(m[1])}(?![\\w-])`, "gi");
    let hit;
    while ((hit = re.exec(text))) set.add(hit.index, hit.index + hit[0].length, "DB", "urls");
  }
}

/** Step 4 — stitch output and build the placeholder table. */
function buildOutput(text, spans) {
  const byKey = new Map();
  const counters = {};
  const entries = [];
  let out = "";
  let pos = 0;
  for (const span of spans) {
    const key = `${span.label}|${normalize(span.original)}`;
    let entry = byKey.get(key);
    if (!entry) {
      counters[span.label] = (counters[span.label] || 0) + 1;
      entry = { placeholder: `<${span.label}_${counters[span.label]}>`, original: span.original, label: span.label, cat: span.cat, count: 0 };
      byKey.set(key, entry);
      entries.push(entry);
    }
    entry.count++;
    out += text.slice(pos, span.start) + entry.placeholder;
    pos = span.end;
  }
  return { text: out + text.slice(pos), entries };
}

/**
 * @param {string} text
 * @param {{clients?:string, people?:string, other?:string, categories?:Record<string,boolean>,
 *          keep?:Iterable<string>, keepDomains?:string}} options
 */
export function redact(text, options = {}) {
  const set = new SpanSet(text, options.keep, options.keepDomains);
  applyCustomTerms(text, set, options);
  applyDetectors(text, set, options.categories || defaultCategories());
  propagateNames(text, set);
  propagateDatabaseNames(text, set);
  return buildOutput(text, set.sorted());
}
