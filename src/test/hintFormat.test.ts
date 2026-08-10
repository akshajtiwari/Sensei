// ===========================================================================
// hintFormat.test.ts  —  Stage 3. RED until you implement formatHint and
// isDuplicate in src/core/hintFormat.ts.
// ===========================================================================
import test from "node:test";
import assert from "node:assert/strict";
import { formatHint, isDuplicate, Hint } from "../core/hintFormat";

test("formatHint prefixes the message with the Sensei lightbulb", () => {
  assert.equal(formatHint("rethink this loop"), "💡 Sensei: rethink this loop");
});

test("isDuplicate: nothing shown before is never a duplicate", () => {
  const next: Hint = { line: 5, text: "same" };
  assert.equal(isDuplicate(null, next), false);
});

test("isDuplicate: identical line + text is a duplicate", () => {
  const prev: Hint = { line: 5, text: "same" };
  const next: Hint = { line: 5, text: "same" };
  assert.equal(isDuplicate(prev, next), true);
});

test("isDuplicate: same text but a different line is NOT a duplicate", () => {
  const prev: Hint = { line: 5, text: "same" };
  const next: Hint = { line: 9, text: "same" };
  assert.equal(isDuplicate(prev, next), false);
});

test("isDuplicate: same line but different text is NOT a duplicate", () => {
  const prev: Hint = { line: 5, text: "old" };
  const next: Hint = { line: 5, text: "new" };
  assert.equal(isDuplicate(prev, next), false);
});
