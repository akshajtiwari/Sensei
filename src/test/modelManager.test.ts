// ===========================================================================
// modelManager.test.ts  —  Stage 1. RED until you fix parsePullProgress().
// (The pullModel streaming fix is verified by hand in F5, not here, because it
//  needs a live Ollama download.)
// ===========================================================================
import test from "node:test";
import assert from "node:assert/strict";
import { parsePullProgress } from "../ollama/modelManager";

test("parsePullProgress: 50 of 200 is 25 percent", () => {
  assert.equal(parsePullProgress('{"completed":50,"total":200}'), 25);
});

test("parsePullProgress: 200 of 200 is 100 percent", () => {
  assert.equal(parsePullProgress('{"completed":200,"total":200}'), 100);
});

test("parsePullProgress: 0 of 200 is 0 percent", () => {
  assert.equal(parsePullProgress('{"completed":0,"total":200}'), 0);
});

test("parsePullProgress: a line with no total is 0", () => {
  assert.equal(parsePullProgress('{"status":"pulling manifest"}'), 0);
});

test("parsePullProgress: garbage (not JSON) is 0, not a crash", () => {
  assert.equal(parsePullProgress("not json at all"), 0);
});
