import { test } from "node:test";
import assert from "node:assert/strict";
import { redact } from "../js/core/index.js";
import { KITCHEN_SINK } from "./fixtures.js";

const labelsFor = (text, opts) => redact(text, opts).entries.map((e) => `${e.label}:${e.original}`);

test("each sensitive value in the kitchen sink is caught with the right label", () => {
  const got = labelsFor(KITCHEN_SINK);
  const expected = [
    "URL:https://acme-prod.odoo.com/web#action=123&model=account.move",
    "REF:INV/2026/0412",
    "AMOUNT:€48,200.50",
    "IBAN:BE68 5390 0754 7034",
    "IFSC:HDFC0001234",
    "PAN:ABCDE1234F",
    "GSTIN:27ABCDE1234F1Z5",
    "AADHAAR:2345 6789 0124",
    "CARD:4111 1111 1111 1111",
    "TOKEN:sk_live_9f8e2c7a6b5d4e3f2a1b",
    'SECRET:"Hunter2!x"',
    "TOKEN:ghp_aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789",
    "IP:10.0.12.45",
    "MAC:00:1A:2B:3C:4D:5E",
    "URL:postgres://odoo:s3cret@db.internal:5432/acme",
    "NUMBER:123456789012345",
    "NAME:Anil Kapoor",
  ];
  for (const e of expected) assert.ok(got.includes(e), `missing ${e}\n got: ${got.join(" | ")}`);
  assert.ok(got.some((g) => g.startsWith("TOKEN:eyJ")), "JWT not caught");
});

test("checksums reject look-alikes", () => {
  assert.equal(labelsFor("Card 4111 1111 1111 1112").some((l) => l.startsWith("CARD")), false);
  assert.equal(labelsFor("Ref BE00 0000 0000 0000").some((l) => l.startsWith("IBAN")), false);
});

test("dates are not phone numbers", () => {
  const out = redact("Meeting 2026-10-12 and 12/10/2026").text;
  assert.equal(out, "Meeting 2026-10-12 and 12/10/2026");
});

test("file names are not domains", () => {
  assert.equal(redact("Error in models.py and report.xlsx").text, "Error in models.py and report.xlsx");
});

test("categories can be switched off", () => {
  const out = redact("Mail a@b.example now", { categories: { emails: false } }).text;
  assert.equal(out, "Mail a@b.example now");
});

test("lowercase paths are not tokens, real-looking keys are", () => {
  assert.equal(redact("see src/odoo/addons/account/models/account_move2024").text, "see src/odoo/addons/account/models/account_move2024");
  assert.match(redact("key Zx9Qw3Er7Ty1Ui5Op2As8Df4Gh6Jk0Lm").text, /<TOKEN_1>/);
});

test("Aadhaar needs a valid Verhoeff checksum; other 12-digit numbers are just numbers", () => {
  assert.equal(redact("Aadhaar 3456 7890 1238").entries[0].label, "AADHAAR");
  assert.equal(redact("Account 987654321098").entries[0].label, "NUMBER");
});

test("log timestamps are not phone numbers", () => {
  const src = "2026-10-09 10:14:22,511 4021 ERROR odoo.http: boom";
  assert.equal(redact(src).text, src);
});
