// ===========================================================================
// intentStore.test.ts  —  Stage 2. RED until you implement set() and clear()
// in src/core/intentStore.ts.
// ===========================================================================
import test from "node:test";
import assert from "node:assert/strict";
import { IntentStore } from "../core/intentStore";

test("get on an unknown key returns undefined", () => {
  const store = new IntentStore();
  assert.equal(store.get("file:///a.ts"), undefined);
});

test("set then get returns the stored intent", () => {
  const store = new IntentStore();
  store.set("file:///a.ts", "writing a new API");
  assert.equal(store.get("file:///a.ts"), "writing a new API");
});

test("set overwrites a previous intent for the same file", () => {
  const store = new IntentStore();
  store.set("file:///a.ts", "first");
  store.set("file:///a.ts", "second");
  assert.equal(store.get("file:///a.ts"), "second");
});

test("clear removes only the given file, leaving others intact", () => {
  const store = new IntentStore();
  store.set("file:///a.ts", "intent A");
  store.set("file:///b.ts", "intent B");
  store.clear("file:///a.ts");
  assert.equal(store.get("file:///a.ts"), undefined); // cleared
  assert.equal(store.get("file:///b.ts"), "intent B"); // untouched
});
