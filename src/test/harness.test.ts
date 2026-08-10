
import test from "node:test";
import assert from "node:assert/strict";

test("harness works: node:test + assert are wired up", () => {
  assert.equal(1 + 1, 2); // passes -> this test is green
});


