/** Checksums and heuristics that cut false positives. */

/** Luhn check for payment card numbers. */
export function isLuhnValid(num) {
  const d = num.replace(/\D/g, "");
  if (d.length < 13 || d.length > 19) return false;
  let sum = 0;
  let alt = false;
  for (let i = d.length - 1; i >= 0; i--) {
    let n = Number(d[i]);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

/** ISO 13616 mod-97 check for IBANs. */
export function isIbanValid(raw) {
  const s = raw.replace(/\s+/g, "").toUpperCase();
  if (s.length < 15 || s.length > 34) return false;
  const rearranged = s.slice(4) + s.slice(0, 4);
  let rem = 0;
  for (const ch of rearranged) {
    const v = /[A-Z]/.test(ch) ? String(ch.charCodeAt(0) - 55) : ch;
    for (const c of v) rem = (rem * 10 + Number(c)) % 97;
  }
  return rem === 1;
}

// Verhoeff tables (used by Aadhaar's last digit)
const V_D = [
  [0,1,2,3,4,5,6,7,8,9],[1,2,3,4,0,6,7,8,9,5],[2,3,4,0,1,7,8,9,5,6],[3,4,0,1,2,8,9,5,6,7],[4,0,1,2,3,9,5,6,7,8],
  [5,9,8,7,6,0,4,3,2,1],[6,5,9,8,7,1,0,4,3,2],[7,6,5,9,8,2,1,0,4,3],[8,7,6,5,9,3,2,1,0,4],[9,8,7,6,5,4,3,2,1,0],
];
const V_P = [
  [0,1,2,3,4,5,6,7,8,9],[1,5,7,6,2,8,3,0,9,4],[5,8,0,3,7,9,6,1,4,2],[8,9,1,6,0,4,3,5,2,7],
  [9,4,5,3,1,2,6,8,7,0],[4,2,8,6,5,7,3,9,0,1],[2,7,9,3,8,0,6,4,1,5],[7,0,4,6,9,1,3,2,5,8],
];

/** Verhoeff checksum: real Aadhaar numbers pass it, random 12-digit numbers mostly don't. */
export function isVerhoeffValid(num) {
  const d = num.replace(/\D/g, "");
  let c = 0;
  [...d].reverse().forEach((ch, i) => { c = V_D[c][V_P[i % 8][Number(ch)]]; });
  return c === 0;
}

/** Long and mixes character classes → probably a key/token, not a word. */
export function looksLikeSecret(s) {
  // lowercase path segments (src/odoo/addons/…) are not secrets
  if (s.includes("/") && s.split("/").every((seg) => /^[a-z0-9_.-]*$/.test(seg))) return false;
  const classes = [/[a-z]/, /[A-Z]/, /\d/].filter((r) => r.test(s)).length;
  return s.length >= 32 && classes >= 2;
}
