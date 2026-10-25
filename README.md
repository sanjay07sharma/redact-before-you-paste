# ✂️ Redact Before You Paste

![CI](../../actions/workflows/ci.yml/badge.svg)

A small browser-only utility that masks sensitive data before text is shared with an AI assistant.
Users paste text, review the masked version, copy it, and refresh. Nothing is stored or sent anywhere.

## Quick start

```bash
npm start      # serves on http://127.0.0.1:8080 with the production security headers
npm test       # runs the core test suite (Node ≥ 18, no dependencies)
```

> The page uses ES modules, so open it **through a web server** (as above), not by double-clicking `index.html`.

## Project structure

```
redact-tool/
├── index.html                  Page markup only (no inline JS/CSS)
├── css/styles.css              All styling, light + dark theme
├── assets/favicon.svg
├── js/
│   ├── app.js                  Entry point: owns state, wires UI ↔ core
│   ├── theme-boot.js           Applies #dark / #light before first paint
│   ├── config.js               Categories, default kept domains, idle timeout
│   ├── core/                   Pure logic, no DOM (unit-tested)
│   │   ├── index.js            Public API: redact(), restore()
│   │   ├── redactor.js         Pipeline: custom terms → rules → name spreading → placeholders
│   │   ├── span-set.js         Tracks masked ranges, prevents overlaps, applies keep rules
│   │   ├── restore.js          Placeholders → real values
│   │   ├── validators.js       Luhn (cards), mod-97 (IBAN), random-token heuristic
│   │   ├── text-utils.js       Small string helpers
│   │   └── detectors/          One file per kind of data
│   │       ├── index.js        ⚠ Rule ORDER lives here (first match wins)
│   │       ├── secrets.js      Passwords, API keys, JWT, Bearer, private keys
│   │       ├── contact.js      Emails, phones, URLs, domains
│   │       ├── traceback.js    Paths + error-message values (only inside tracebacks)
│       ├── finance.js      IBAN, cards, IFSC, amounts, account numbers, invoice refs
│   │       ├── identity.js     Aadhaar, PAN, GSTIN, SSN
│   │       ├── network.js      IPv4/IPv6, MAC
│   │       └── names.js        Greetings, titles, sign-offs, company suffixes
│   └── ui/                     One file per part of the screen
│       ├── input-panel.js      Step 1: text + custom term fields
│       ├── category-toggles.js "What to detect" chips
│       ├── output-panel.js     Step 2: highlighted output, copy, Mask selection
│       ├── entries-table.js    Counts + placeholder table with Keep / Show
│       ├── restore-panel.js    Step 3: put real values back in the AI's answer
│       ├── session.js          Wipe & refresh, idle auto-wipe
│       ├── clipboard.js        Copy with fallback
│       ├── theme.js            Light/dark toggle
│       ├── toast.js            Status messages
│       └── dom.js              Shared DOM helpers
├── tests/                      node:test suites + invented sample data
├── docs/                       Manual test texts, repo settings
├── .github/workflows/          CI (npm test) + optional GitHub Pages deploy
├── tools/serve.js              Zero-dependency server with security headers
└── deploy/nginx.conf           Example production config
```

## Privacy guarantees

- **No storage**: no localStorage, cookies or IndexedDB. The theme choice is kept only in the URL (`#dark` / `#light`), so it survives a wipe.
- **No network**: the Content-Security-Policy (`connect-src 'none'`, `default-src 'none'`) makes the browser refuse any outgoing request, even if someone later adds code that tries.
- **No third-party code**: no CDN, fonts or analytics. Only same-origin files may load (`script-src 'self'`).
- **No extension leaks**: spell-check and Grammarly/LanguageTool hooks are disabled on the inputs.
- **Wipe**: the "Wipe everything & refresh" button clears fields and reloads; the page also auto-wipes after 10 idle minutes (`config.js`).

## What gets masked

| Placeholder | Catches |
|---|---|
| `<NAME_n>` / `<CLIENT_n>` | Names after greetings, titles or sign-offs; companies with Pvt Ltd / GmbH / LLC…; anything typed in the custom fields |
| `<EMAIL_n>` `<PHONE_n>` | Emails; international, separated and Indian mobile numbers |
| `<URL_n>` `<DOMAIN_n>` | Links, DB connection strings, bare hosts like `acme-prod.odoo.com` |
| `<TOKEN_n>` `<SECRET_n>` | `password=…`, API keys (OpenAI, Anthropic, Stripe, GitHub, AWS, Google, Slack), JWT, Bearer, private keys, long random strings |
| `<IBAN_n>` `<CARD_n>` `<IFSC_n>` | Checksum-verified IBANs and cards, IFSC codes |
| `<AADHAAR_n>` `<PAN_n>` `<GSTIN_n>` `<ID_n>` | Indian IDs, SSN-style IDs |
| `<AMOUNT_n>` | ₹18L, €48,200.50, Rs. 5000, 12 lakh |
| `<PATH_n>` | File paths in tracebacks (`File "/odoo/…/mail_thread.py"`); function names and line numbers stay |
| `<FIELD_n>` `<VALUE_n>` `<STR_n>` `<ADDR_n>` | Inside error messages only: quoted field/view names, `view_id`/`xml_id`/`model` values, record ids, string literals in code lines, memory addresses |
| `<IP_n>` `<MAC_n>` `<NUMBER_n>` `<REF_n>` | Network addresses, 9+ digit numbers, `INV/2026/0412` |

The same value always gets the same placeholder, so the AI can still follow who's who.

## Extending

- **New rule**: add a detector object to the right file in `js/core/detectors/`, then insert it in `detectors/index.js` at the right priority. Add a test in `tests/detectors.test.js`.
- **New category toggle**: add it to `CATEGORIES` in `js/config.js` and use its `id` as the detector's `cat`.
- **Keep more public sites visible**: edit `DEFAULT_KEEP_DOMAINS` in `js/config.js` (exact host match, so `odoo.com` never un-masks `customer.odoo.com`).

## Deploying

Pushing to `main` can publish via GitHub Pages (`.github/workflows/pages.yml`, enable Pages → Source: GitHub Actions). Pages cannot send `frame-ancestors`, so prefer Cloudflare Pages/Netlify/nginx if clickjacking protection matters. Otherwise copy only `index.html`, `css/`, `js/` and `assets/` to a static host. Use `deploy/nginx.conf` as a template; it sets the same headers as `tools/serve.js`, including `frame-ancestors 'none'`, which can't be set from the HTML meta tag.

## Limits

Pattern matching can't understand context. A bare name with no greeting or title, unusual formats, or identifying facts ("the only dentist in Gandhinagar") can slip through. The page tells users to review the output and use the custom fields. It is a safety net next to Odoo's AI policy, not a replacement for it.
