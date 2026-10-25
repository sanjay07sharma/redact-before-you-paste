/** Bank and payment data, money amounts, document references. */
import { isIbanValid, isLuhnValid } from "../validators.js";

export const iban = {
  id: "iban", label: "IBAN", cat: "finance",
  re: /\b[A-Z]{2}\d{2}(?:[ ]?[A-Z0-9]{4}){2,7}(?:[ ]?[A-Z0-9]{1,4})?\b/g,
  check: (v) => isIbanValid(v),
};

export const card = {
  id: "card", label: "CARD", cat: "finance",
  re: /\b(?:\d[ -]?){12,18}\d\b/g,
  check: (v) => isLuhnValid(v),
};

export const ifsc = {
  id: "ifsc", label: "IFSC", cat: "finance",
  re: /\b[A-Z]{4}0[A-Z0-9]{6}\b/g,
};

/** ₹18L · €48,200.50 · Rs. 5000 · USD 1.2M · 12 lakh · 3 crores */
export const amount = {
  id: "amount", label: "AMOUNT", cat: "amounts",
  re: /(?:[₹€$£¥]|\b(?:Rs\.?|INR|EUR|USD|GBP|CHF|AED|SGD)\s?)\s?\d[\d,]*(?:\.\d+)?(?:\s?(?:k|K|M|bn|L|lakhs?|lacs?|cr|crores?|million|billion))?\b|\b\d[\d,]*(?:\.\d+)?\s?(?:₹|€|\$|£|INR|EUR|USD|GBP|CHF|lakhs?|lacs?|crores?)(?![A-Za-z])/g,
};

/** Bank account numbers and other long IDs (9+ digits). */
export const longNumber = {
  id: "longnum", label: "NUMBER", cat: "numbers",
  re: /\b\d{9,}\b/g,
};

/** Odoo-style sequences: INV/2026/0412, BILL/2026/00012, SO12345. */
export const documentRef = {
  id: "docref", label: "REF", cat: "refs",
  re: /\b[A-Z]{2,6}\/\d{4}\/\d{2,6}\b|\b(?:INV|SO|PO|BILL|RINV|SINV|S|P)\d{4,}\b/g,
};
