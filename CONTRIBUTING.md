# Contributing

```bash
npm test      # Node ≥ 18, no dependencies
npm start     # http://127.0.0.1:8080
```

- **New detector:** add it to the right file in `js/core/detectors/`, register it in `detectors/index.js` (order = priority), add a test in `tests/`.
- **Leak found?** Add the smallest invented example to `tests/fixtures.js` first, watch the test fail, then fix.
- **No dependencies, no build step, no network calls.** See `SECURITY.md`.
- Manual check lists live in `docs/`.
