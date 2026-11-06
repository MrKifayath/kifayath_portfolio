import test from "node:test";
import assert from "node:assert/strict";
import {
  clampProgress,
  calculateTargetIndex,
  calculateImpulse,
  calculateTrackOffset,
} from "./navigation-math";

test("clampProgress clamps values between 0 and 1", () => {
  assert.equal(clampProgress(500, 1000), 0.5);
  assert.equal(clampProgress(-100, 1000), 0);
  assert.equal(clampProgress(1500, 1000), 1);
  assert.equal(clampProgress(100, 0), 0);
});

test("calculateTargetIndex computes correct panel index", () => {
  assert.equal(calculateTargetIndex(0, 1000, 5), 0);
  assert.equal(calculateTargetIndex(490, 1000, 5), 0);
  assert.equal(calculateTargetIndex(510, 1000, 5), 1);
  assert.equal(calculateTargetIndex(1000, 1000, 5), 1);
  assert.equal(calculateTargetIndex(3900, 1000, 5), 4);
  assert.equal(calculateTargetIndex(9999, 1000, 5), 4);
});

test("calculateImpulse scales delta correctly and clamps", () => {
  const impulse = calculateImpulse(100, 1000, true);
  assert.ok(impulse > 0 && impulse <= 750);
  const lineImpulse = calculateImpulse(2, 1000, false);
  assert.equal(lineImpulse, 1000);
});

test("calculateTrackOffset calculates pixel offset", () => {
  assert.equal(calculateTrackOffset(0, 1440), 0);
  assert.equal(calculateTrackOffset(2, 1440), 2880);
});
