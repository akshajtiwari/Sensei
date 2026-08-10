// ===========================================================================
// analysisGate.test.ts  —  Stage 5. RED until you implement shouldAnalyze()
// in src/core/analysisGate.ts.
// ===========================================================================
import test from "node:test";
import assert from "node:assert/strict";
import { hashText, shouldAnalyze } from "../core/analysisGate";

test("first time (no previous hash) always analyzes", () => {
  assert.equal(shouldAnalyze(null, "const x = 1;"), true);
});

test("identical text is skipped", () => {
  const code = "const x = 1;";
  const previous = hashText(code);
  assert.equal(shouldAnalyze(previous, code), false);
});

test("changed text is analyzed", () => {
  const previous = hashText("const x = 1;");
  assert.equal(shouldAnalyze(previous, "const x = 2;"), true);
});
