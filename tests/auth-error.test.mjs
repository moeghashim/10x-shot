import assert from "node:assert/strict";
import { test } from "node:test";
import { ConvexError } from "convex/values";
import { isAuthError } from "../lib/auth-error.ts";

// Production Convex redacts error messages, so the code only survives in `data`.
function productionConvexError(data) {
  const error = new ConvexError("[Request ID: 01ae9049d9b361c0] Server Error");
  error.data = data;
  return error;
}

test("auth failures thrown by requireAdmin are recognised on a production deployment", () => {
  assert.equal(isAuthError(productionConvexError("Unauthenticated")), true);
  assert.equal(isAuthError(productionConvexError("Unauthorized")), true);
});

test("validation failures and plain server errors are not auth errors", () => {
  assert.equal(isAuthError(productionConvexError("Project not found")), false);
  assert.equal(isAuthError(new Error("[Request ID: 770367255d42ffc7] Server Error")), false);
  assert.equal(isAuthError("Unauthenticated"), false);
});

test("auth failures reported only through the message are still recognised", () => {
  assert.equal(isAuthError(new Error("Uncaught ConvexError: Unauthenticated")), true);
  assert.equal(isAuthError(new Error("Authentication required")), true);
});
