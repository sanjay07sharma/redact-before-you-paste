/**
 * Passwords, API keys, tokens, private keys.
 * Detector shape: { id, label, cat, re (global), group?, check?(value, text, index) }
 */
import { looksLikeSecret } from "../validators.js";

export const privateKey = {
  id: "privkey", label: "SECRET", cat: "secrets",
  re: /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g,
};

export const jwt = {
  id: "jwt", label: "TOKEN", cat: "secrets",
  re: /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/g,
};

/** Well-known vendor key formats (OpenAI, Anthropic, Stripe, GitHub, AWS, Google, Slack, GitLab). */
export const vendorKey = {
  id: "vendorkey", label: "TOKEN", cat: "secrets",
  re: /\b(?:sk-ant-[A-Za-z0-9_-]{16,}|sk-(?:proj-)?[A-Za-z0-9_-]{20,}|(?:sk|pk|rk)_(?:live|test)_[A-Za-z0-9]{8,}|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35}|xox[abprs]-[A-Za-z0-9-]{10,}|glpat-[A-Za-z0-9_-]{20,})/g,
};

export const authHeader = {
  id: "bearer", label: "TOKEN", cat: "secrets", group: 1,
  re: /\b(?:Bearer|Basic|Token)\s+([A-Za-z0-9._~+\/=-]{12,})/g,
};

/** key = value / key: value pairs — only the value is masked. */
export const keyValueSecret = {
  id: "kv", label: "SECRET", cat: "secrets", group: 1,
  re: /\b(?:password|passwd|pwd|pass|secret|client[_-]?secret|api[_-]?key|apikey|access[_-]?key|access[_-]?token|auth[_-]?token|refresh[_-]?token|token|session[_-]?id|sessionid|cookie|admin_passwd|db_password|private[_-]?key)\b["']?\s*[:=]\s*("[^"\n]*"|'[^'\n]*'|[^\s,;]+)/gi,
};

/** Catch-all for long random-looking strings. Runs late so specific rules win. */
export const randomToken = {
  id: "randomtoken", label: "TOKEN", cat: "secrets",
  re: /\b[A-Za-z0-9+\/_-]{32,}={0,2}/g,
  check: (v) => looksLikeSecret(v),
};
