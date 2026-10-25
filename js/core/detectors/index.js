/**
 * The ordered rule list. ORDER MATTERS: when two rules match overlapping text,
 * the one listed first wins. Specific formats go before generic catch-alls.
 *
 * To add a rule: define it in the matching category file, then place it here.
 */
import * as secrets from "./secrets.js";
import * as contact from "./contact.js";
import * as finance from "./finance.js";
import * as identity from "./identity.js";
import * as network from "./network.js";
import * as names from "./names.js";
import * as trace from "./traceback.js";

export const DETECTORS = [
  // 1. Secrets first: a token inside a URL should be masked as a token.
  secrets.privateKey,
  secrets.jwt,
  secrets.vendorKey,
  secrets.authHeader,
  secrets.keyValueSecret,

  // 1b. File paths (before URLs/domains so a path is never half-masked)
  trace.filePathInTrace,
  trace.windowsPath,
  trace.barePath,

  // 2. Structured contact data
  contact.url,
  contact.email,
  contact.domain,

  // 3. Checksummed / strongly shaped identifiers
  finance.iban,
  finance.card,
  identity.aadhaar,
  identity.pan,
  identity.gstin,
  finance.ifsc,
  identity.ssn,
  network.ipv4,
  network.mac,
  network.ipv6,

  // 4. Looser numeric patterns
  contact.phone,
  finance.amount,
  secrets.randomToken,
  finance.longNumber,
  finance.documentRef,

  // 5. Names last (weakest signal)
  names.company,
  names.titledName,
  names.greetingName,
  names.signOffName,

  // 6. Values inside tracebacks / error messages (only inside those blocks)
  trace.errKeyValue,
  trace.errRecordIds,
  trace.errBacktick,
  trace.errSingle,
  trace.errDouble,
  trace.codeStringSingle,
  trace.codeStringDouble,
  trace.memoryAddress,
];

export { NON_NAMES } from "./names.js";
