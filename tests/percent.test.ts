import assert from "node:assert/strict";
import test from "node:test";
import { percent } from "../src/lib/utils.ts";

test("percent rounds an ordinary ratio", () => {
  assert.equal(percent(2, 3), 67);
});

test("percent safely handles an empty total", () => {
  assert.equal(percent(4, 0), 0);
});
