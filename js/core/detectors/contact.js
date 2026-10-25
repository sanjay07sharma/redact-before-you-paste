/** Emails, phone numbers, URLs and bare domains. */
import { digitCount } from "../text-utils.js";

const TLDS = "com|net|org|io|in|co|eu|be|fr|de|uk|nl|ch|es|it|us|ca|au|ae|sg|dev|app|ai|info|biz|cloud|tech|xyz|sh|example|local|internal|lan";
const FILE_EXT = /\.(?:py|js|ts|xml|csv|xlsx?|pdf|docx?|json|txt|png|jpe?g|log|html?|css|scss|md|yml|yaml)$/i;

export const url = {
  id: "url", label: "URL", cat: "urls", trimTrailingPunct: true,
  re: /\b(?:https?|ftp|postgres(?:ql)?|mysql|mongodb(?:\+srv)?|redis|amqp|ssh|sftp):\/\/[^\s<>"'`)\]]+/gi,
};

export const email = {
  id: "email", label: "EMAIL", cat: "emails",
  re: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
};

/** Bare hostnames like acme-prod.odoo.com. File names (models.py) are ignored. */
export const domain = {
  id: "domain", label: "DOMAIN", cat: "urls", trimTrailingPunct: true,
  re: new RegExp(`\\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+(?:${TLDS})\\b(?![.\\w-]*@)`, "gi"),
  check: (v, text, i) => !FILE_EXT.test(v) && text[i - 1] !== "@",
};

const ISO_DATE = /^\d{4}[-.]\d{2}[-.]\d{2}$/;
const LOCAL_DATE = /^\d{1,2}[-.\/]\d{1,2}[-.\/]\d{2,4}$/;
const INDIAN_MOBILE = /^(?:0|91)?[6-9]\d{9}$/;

/**
 * International or separated numbers with 8–15 digits.
 * Unseparated digit runs only count when they look like an Indian mobile
 * (other long runs fall through to the "long numbers" rule).
 */
export const phone = {
  id: "phone", label: "PHONE", cat: "phones",
  re: /(?:\+\d{1,3}[\s.-]?)?(?:\(\d{1,5}\)[\s.-]?)?\d[\d\s.-]{6,16}\d\b/g,
  check: (v) => {
    const t = v.trim();
    const n = digitCount(t);
    if (n < 8 || n > 15) return false;
    if (ISO_DATE.test(t) || LOCAL_DATE.test(t)) return false;
    if (/\d{4}-\d{2}-\d{2}/.test(t)) return false; // log timestamps
    if (/^\+/.test(t) || /[\s.-]/.test(t)) return true;
    return INDIAN_MOBILE.test(t);
  },
};
