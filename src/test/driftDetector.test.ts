// ===========================================================================
// driftDetector.test.ts  —  Stage 4. Mostly RED until you implement
// parseDriftResponse() in src/core/driftDetector.ts. This is your spec.
// ===========================================================================
import test from "node:test";
import assert from "node:assert/strict";
import { parseDriftResponse } from "../core/driftDetector";

test("parses a clean drift response", () => {
  const raw = '{"drift":true,"line":3,"hint":"Do you need a second loop here?"}';
  assert.deepEqual(parseDriftResponse(raw), {
    drift: true,
    line: 3,
    hint: "Do you need a second loop here?",
  });
});

test("extracts JSON even with chatty text around it", () => {
  const raw = 'Sure! {"drift":true,"line":2,"hint":"Is this import used?"} hope it helps';
  assert.deepEqual(parseDriftResponse(raw), {
    drift: true,
    line: 2,
    hint: "Is this import used?",
  });
});

test("drift:true with no line yields line null", () => {
  const raw = '{"drift":true,"hint":"Consider the edge case for empty input."}';
  assert.deepEqual(parseDriftResponse(raw), {
    drift: true,
    line: null,
    hint: "Consider the edge case for empty input.",
  });
});

test("drift:false returns the no-drift default", () => {
  const raw = '{"drift":false,"line":null,"hint":""}';
  assert.deepEqual(parseDriftResponse(raw), { drift: false, line: null, hint: "" });
});

test("garbage (not JSON) returns no-drift, never throws", () => {
  assert.deepEqual(parseDriftResponse("the model rambled with no json"), {
    drift: false,
    line: null,
    hint: "",
  });
});

test("rejects a hint that contains code (a ``` fence) -> no-drift", () => {
  const raw = '{"drift":true,"line":1,"hint":"use ```for i in range(n)```"}';
  assert.deepEqual(parseDriftResponse(raw), { drift: false, line: null, hint: "" });
});

test("drift:true but empty hint -> no-drift", () => {
  const raw = '{"drift":true,"line":1,"hint":""}';
  assert.deepEqual(parseDriftResponse(raw), { drift: false, line: null, hint: "" });
});
