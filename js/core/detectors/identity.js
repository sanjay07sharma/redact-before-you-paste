/** Government / tax identifiers. */
import { isVerhoeffValid } from "../validators.js";

export const aadhaar = {
  id: "aadhaar", label: "AADHAAR", cat: "ids",
  re: /\b[2-9]\d{3}[ -]?\d{4}[ -]?\d{4}\b/g,
  check: (v) => isVerhoeffValid(v),
};

export const pan = {
  id: "pan", label: "PAN", cat: "ids",
  re: /\b[A-Z]{5}\d{4}[A-Z]\b/g,
};

export const gstin = {
  id: "gstin", label: "GSTIN", cat: "ids",
  re: /\b\d{2}[A-Z]{5}\d{4}[A-Z][A-Z\d]Z[A-Z\d]\b/g,
};

/** US SSN-style 123-45-6789. */
export const ssn = {
  id: "ssn", label: "ID", cat: "ids",
  re: /\b\d{3}-\d{2}-\d{4}\b/g,
};
