/**
 * Zero-dependency local server for development and quick internal hosting.
 *   npm start              → http://127.0.0.1:8080
 *   PORT=9000 HOST=0.0.0.0 npm start
 * Sends the same security headers recommended for production (see deploy/nginx.conf).
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, posix, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || "127.0.0.1";

// Only the app's own folders are served (not tests/, tools/, deploy/).
const PUBLIC = ["index.html", "css/", "js/", "assets/"];

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
};

const SECURITY_HEADERS = {
  "Content-Security-Policy":
    "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'none'; form-action 'none'; base-uri 'none'; frame-ancestors 'none'",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), clipboard-read=()",
  "Cache-Control": "no-store",
};

createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/^\/+/, "");
    if (path === "") path = "index.html";
    const rel = posix.normalize(path);
    if (rel.includes("\\") || rel.startsWith("..") || !PUBLIC.some((p) => rel === p || rel.startsWith(p))) throw new Error("forbidden");
    const file = join(ROOT, rel);
    if (!(await stat(file)).isFile()) throw new Error("not a file");
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream", ...SECURITY_HEADERS });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain", ...SECURITY_HEADERS });
    res.end("Not found");
  }
}).listen(PORT, HOST, () => console.log(`Redact tool on http://${HOST}:${PORT}`));
