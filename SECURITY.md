# Security

This tool runs entirely in the browser. It must never send, store or log the text a user pastes.

Guarantees to preserve in every change:
- No `fetch`, XHR, WebSocket, beacon or third-party script/font/CDN.
- No `localStorage`, `sessionStorage`, cookies or IndexedDB.
- The CSP in `index.html` (and the headers in `tools/serve.js` / `deploy/nginx.conf`) stays at `connect-src 'none'`.
- Tests and sample data use invented values only. Never commit real customer data, even redacted.

Found a way text could leave the page, or a pattern that leaks? Report it privately to the maintainers (do not open a public issue with real data).
