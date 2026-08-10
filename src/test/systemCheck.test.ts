// ===========================================================================
// systemCheck.test.ts  —  Stage 1. These tests are RED until you fix the
// off-by-one in recommendTier() in src/utils/systemCheck.ts.
// ===========================================================================
import test from "node:test";
import assert from "node:assert/strict";
import { recommendTier } from "../utils/systemCheck";



test("recommendTier: 16GB is a 'good' machine", () => {
  assert.equal(recommendTier(16), "good");
});

test("recommendTier: EXACTLY 8GB should still be 'good' (boundary)", () => {
  // This is the one the bug gets wrong. 8 >= 8, so it should be "good".
  assert.equal(recommendTier(8), "good");
});

test("recommendTier: 6GB is 'average'", () => {
  assert.equal(recommendTier(6), "average");
});

test("recommendTier: EXACTLY 4GB should be 'average' (boundary)", () => {
  // The other boundary the bug gets wrong. 4 >= 4, so it should be "average".
  assert.equal(recommendTier(4), "average");
});

test("recommendTier: 2GB is 'minimum'", () => {
  assert.equal(recommendTier(2), "minimum");
});
