import assert from "node:assert/strict";
import test from "node:test";

import { evaluateMathExpression } from "./math-expression";

test("evaluates documented math syntax", () => {
  assert.equal(evaluateMathExpression("sin(PI / 2) + x^2", 3), 10);
  assert.equal(evaluateMathExpression("pow(x, 2) + max(1, 4)", 2), 8);
  assert.equal(evaluateMathExpression("x**2 / 4 - 2", 4), 2);
});

test("rejects JavaScript execution and unknown identifiers", () => {
  for (const expression of [
    "x.constructor.constructor('return globalThis')()",
    "globalThis",
    "import('data:text/javascript,alert(1)')",
    "process.exit(1)",
    "unknown(x)",
  ]) {
    assert.equal(evaluateMathExpression(expression, 1), null);
  }
});

test("rejects invalid and resource-intensive input", () => {
  assert.equal(evaluateMathExpression("sin(", 1), null);
  assert.equal(evaluateMathExpression("1 / 0", 1), null);
  assert.equal(
    evaluateMathExpression("(".repeat(40) + "x" + ")".repeat(40), 1),
    null,
  );
  assert.equal(evaluateMathExpression("x".repeat(257), 1), null);
});
