import { test } from "node:test";
import assert from "node:assert/strict";
import { redact } from "../js/core/index.js";
import { DEFAULT_KEEP_DOMAINS } from "../js/config.js";
import { DEAL_EMAIL, TRACEBACK, TRACEBACK_ERRORS } from "./fixtures.js";

test("deal email: names, company, money, contact all masked", () => {
  const { text } = redact(DEAL_EMAIL, { clients: "Zylo ERP" });
  for (const leak of ["Rajesh", " Sharma", "Acme", "Zylo", "₹18L", "98765", "acmetextiles", "Simon", "Riley"]) {
    assert.ok(!text.includes(leak), `leaked "${leak}":\n${text}`);
  }
  assert.match(text, /^Hi <NAME_1>,/);
  assert.match(text, /Ask <NAME_1> about it/); // same person → same placeholder
  assert.match(text, /22% off/); // percentages stay
});

test("company sentence-ending dot is preserved", () => {
  const { text } = redact("CFO at Acme Textiles Pvt Ltd. Next line.");
  assert.equal(text, "CFO at <CLIENT_1>. Next line.");
});

test("custom terms win and are case-insensitive", () => {
  const { text } = redact("Project ORION and project orion", { other: "Orion" });
  assert.equal(text, "Project <TERM_1> and project <TERM_1>");
});

test("keep list leaves a value visible", () => {
  const { text } = redact("Mail ravi@acme.example now", { keep: ["ravi@acme.example"] });
  assert.equal(text, "Mail ravi@acme.example now");
});

test("public domains kept, customer databases and credential URLs masked", () => {
  const src = "Docs https://www.odoo.com/documentation/18.0 · DB https://acme-prod.odoo.com/web · acme-prod.odoo.com · https://u:pw@github.com/x";
  const { text } = redact(src, { keepDomains: DEFAULT_KEEP_DOMAINS });
  assert.match(text, /https:\/\/www\.odoo\.com\/documentation/);
  assert.ok(!text.includes("acme-prod"), text);
  assert.ok(!text.includes("u:pw"), text);
});

test("traceback: masks paths and error values, keeps the debugging skeleton", () => {
  const { text } = redact(TRACEBACK, { keepDomains: DEFAULT_KEEP_DOMAINS });
  assert.ok(!text.includes("/home/odoo"), text);
  assert.ok(!text.includes("account_move.py"), text);
  assert.ok(text.includes("line 4521, in action_post"), text);
  assert.ok(text.includes("UserError"), text);
  assert.ok(text.includes("https://www.odoo.com/documentation/18.0/applications/finance/accounting.html"), text);
  assert.ok(text.includes("Thanks Team,"), text);
});

test("traceback: field names, view ids, addresses and literals are masked", () => {
  const { text } = redact(TRACEBACK_ERRORS, { keepDomains: DEFAULT_KEEP_DOMAINS });
  for (const leak of ["pos_config_id", "sale_order_view_search_inherit_quotation", "647", "0x7f3c8153e320", "/odoo/odoo-server"]) {
    assert.ok(!text.includes(leak), `${leak} leaked:\n${text}`);
  }
  for (const keep of ["ValueError", "fields_view_get", "line 1381", "n'existe pas"]) {
    assert.ok(text.includes(keep), `${keep} lost:\n${text}`);
  }
});

test("traceback: toggles can be switched off", () => {
  const categories = { paths: false, errvalues: false, names: true, urls: true };
  const { text } = redact(TRACEBACK_ERRORS, { categories });
  assert.ok(text.includes("pos_config_id") && text.includes("/odoo/odoo-server"), text);
});

test("empty input", () => {
  assert.deepEqual(redact(""), { text: "", entries: [] });
});

test("names never run across a line break", () => {
  const { entries } = redact("Best regards,\nSimonRiley\nDB: something");
  assert.deepEqual(entries.map((e) => e.original), ["SimonRiley"]);
});

test("Odoo database name from a URL is masked everywhere", () => {
  const { text } = redact("DB https://acme-prod.odoo.com/web\n10:14 ERROR acme-prod odoo.http: fail", { keepDomains: DEFAULT_KEEP_DOMAINS });
  assert.ok(!text.includes("acme-prod"), text);
  assert.match(text, /ERROR <DB_1> odoo\.http/);
});
