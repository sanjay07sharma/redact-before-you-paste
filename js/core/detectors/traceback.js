/**
 * Stack traces and error messages.
 *
 * Tracebacks leak more than people expect: server paths, custom module and
 * field names, record ids, quoted customer values inside the error text.
 * Function names, line numbers and exception types stay visible so the AI can
 * still help debug.
 *
 * Two categories (separate toggles):
 *   paths     → file paths               <PATH_n>
 *   errvalues → quoted values, ids, memory addresses, string literals in code
 */

const ERROR_LINE = /^[A-Za-z_][\w.]*(?:Error|Exception|Warning|Exit|Interrupt)\b/;
const FILE_LINE = /^\s*File "/;
const CODE_LINE = /^[ \t]{4,}\S/;
const ROOTS = new Set(["home", "opt", "odoo", "usr", "var", "etc", "srv", "mnt", "tmp", "root", "Users", "app", "data", "workspace"]);
const FILE_EXT = /\.(?:py|js|ts|xml|csv|xlsx?|pdf|json|txt|log|html?|css|scss|md|ya?ml|conf|cfg|ini|po|pot|sql|sh)$/i;

function lineBounds(text, i) {
  const start = text.lastIndexOf("\n", i - 1) + 1;
  let end = text.indexOf("\n", i);
  if (end < 0) end = text.length;
  return [start, end];
}

/** True when position i sits in the message part of a traceback (after the exception line). */
export function inErrorBlock(text, i) {
  let [start] = lineBounds(text, i);
  for (let n = 0; n < 60; n++) {
    const end = text.indexOf("\n", start);
    const line = text.slice(start, end < 0 ? text.length : end);
    if (ERROR_LINE.test(line)) return true;
    if (FILE_LINE.test(line) || /^Traceback\b/.test(line) || CODE_LINE.test(line)) return false;
    if (start === 0) return false;
    start = text.lastIndexOf("\n", start - 2) + 1;
  }
  return false;
}

/** True when position i is on the source-code line printed under a `File "…"` line. */
function onCodeLine(text, i) {
  const [start] = lineBounds(text, i);
  if (!CODE_LINE.test(text.slice(start, lineBounds(text, i)[1]))) return false;
  if (start === 0) return false;
  const prevStart = text.lastIndexOf("\n", start - 2) + 1;
  return FILE_LINE.test(text.slice(prevStart, start - 1));
}

// ── paths ───────────────────────────────────────────────────────────────────
export const filePathInTrace = {
  id: "tbfile", label: "PATH", cat: "paths", group: 1,
  re: /\bFile "([^"\n]+)"/g,
};

export const barePath = {
  id: "tbpath", label: "PATH", cat: "paths", trimTrailingPunct: true,
  re: /(?<![\w.:/\\-])(?:\/[\w.@+~-]+){2,}/g,
  check: (v) => ROOTS.has(v.split("/")[1]) || FILE_EXT.test(v),
};

export const windowsPath = {
  id: "tbwinpath", label: "PATH", cat: "paths", trimTrailingPunct: true,
  re: /\b[A-Za-z]:\\(?:[\w .@+~-]+\\)*[\w.@+~-]+/g,
};

// ── error values ────────────────────────────────────────────────────────────
const isIdentifier = (v) => /^[A-Za-z_][\w.]*$/.test(v);
const quoted = (id, re, check, label) => ({ id, label: "VALUE", cat: "errvalues", group: 1, re, check, labelFor: label });
const fieldOrValue = (v) => (isIdentifier(v) ? "FIELD" : "VALUE");

export const errBacktick = quoted("tbtick", /`([^`\n]{1,200})`/g, (v, t, i) => inErrorBlock(t, i), fieldOrValue);
export const errSingle = quoted("tbsq", /(?<![\w'])'([^'\n]{1,200})'(?![\w'])/g, (v, t, i) => inErrorBlock(t, i), fieldOrValue);
export const errDouble = quoted("tbdq", /(?<![\w"])"([^"\n]{1,200})"(?![\w"])/g, (v, t, i) => inErrorBlock(t, i), fieldOrValue);

/** [view_id: 647, xml_id: sale.x, model: sale.order] and friends. */
export const errKeyValue = {
  id: "tbkv", label: "VALUE", cat: "errvalues", group: 1,
  re: /\b(?:[a-z_]*_id|id|ids|model|res_model|res_id|xml_id|name|login|user|database|db)\b[ \t]*[:=][ \t]*([^\s,\])}'"`]+)/gi,
  check: (v, t, i) => v !== "False" && v !== "None" && inErrorBlock(t, i),
};

/** res.partner(42,) → the id inside the brackets. */
export const errRecordIds = {
  id: "tbrec", label: "VALUE", cat: "errvalues", group: 1,
  re: /\b[a-z][\w]*(?:\.[a-z][\w]*)+\(([\d, ]+)\)/g,
  check: (v, t, i) => inErrorBlock(t, i),
};

export const memoryAddress = {
  id: "tbaddr", label: "ADDR", cat: "errvalues",
  re: /\b0x[0-9a-fA-F]{6,}\b/g,
};

/** 'search', "res_id" … inside the code line printed under a File line. */
export const codeStringSingle = {
  id: "tbcs1", label: "STR", cat: "errvalues", group: 1,
  re: /(?<![\w'])'([^'\n]{1,200})'(?![\w'])/g,
  check: (v, t, i) => onCodeLine(t, i),
};
export const codeStringDouble = {
  id: "tbcs2", label: "STR", cat: "errvalues", group: 1,
  re: /(?<![\w"])"([^"\n]{1,200})"(?![\w"])/g,
  check: (v, t, i) => onCodeLine(t, i),
};
