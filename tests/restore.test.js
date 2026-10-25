import { test } from "node:test";
import assert from "node:assert/strict";
import { redact, restore } from "../js/core/index.js";
import { DEAL_EMAIL, KITCHEN_SINK } from "./fixtures.js";

test("redact → restore round-trips exactly", () => {
  for (const src of [DEAL_EMAIL, KITCHEN_SINK]) {
    const r = redact(src, { clients: "Zylo ERP" });
    assert.equal(restore(r.text, r.entries), src);
  }
});

test("restores an AI reply that reuses placeholders", () => {
  const r = redact("Hi Simon, email Simon@x.example");
  const reply = "Dear <NAME_1>, I'll write to <EMAIL_1> and cc <NAME_1>.";
  assert.equal(restore(reply, r.entries), "Dear Simon, I'll write to Simon@x.example and cc Simon.");
});

test("<NAME_1> does not clobber <NAME_12>", () => {
  const entries = [
    { placeholder: "<NAME_1>", original: "A" },
    { placeholder: "<NAME_12>", original: "L" },
  ];
  assert.equal(restore("<NAME_12> <NAME_1>", entries), "L A");
});
