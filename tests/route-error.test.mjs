import assert from "node:assert/strict";
import { test } from "node:test";
import { createRequire } from "node:module";
import { loadModule } from "./helpers/load-route.mjs";

// The module under test is loaded as CommonJS, so the error class must come from the same build.
const { ConvexError } = createRequire(import.meta.url)("convex/values");

const { handleRouteError } = loadModule("lib/route-error.ts", {
  "next/server": { NextResponse: { json: (body, init) => ({ body, status: init?.status ?? 200 }) } },
});

// Production Convex redacts `message`; only `data` carries what the function threw.
function productionConvexError(data) {
  const error = new ConvexError("[Request ID: 01ae9049d9b361c0] Server Error");
  error.data = data;
  return error;
}

test("a validation failure reaches the admin as its own message, not a redacted server error", () => {
  assert.deepEqual(handleRouteError(productionConvexError("Project progress must be between 0 and 100")), {
    status: 400,
    body: { error: "Project progress must be between 0 and 100" },
  });
});

test("a missing record is a 404 with the record named", () => {
  assert.deepEqual(handleRouteError(productionConvexError("Planning card not found")), {
    status: 404,
    body: { error: "Planning card not found" },
  });
});

test("a signed-out caller gets 401 and a signed-in non-admin gets 403", () => {
  assert.equal(handleRouteError(productionConvexError("Unauthenticated")).status, 401);
  assert.equal(handleRouteError(productionConvexError("Unauthorized")).status, 403);
  assert.equal(handleRouteError(new Error("Authentication required")).status, 401);
});

test("a malformed request body is a 400", () => {
  let parseError;
  try {
    JSON.parse("{not json");
  } catch (error) {
    parseError = error;
  }
  assert.deepEqual(handleRouteError(parseError), { status: 400, body: { error: "Request body must be valid JSON" } });
});

test("an unexpected failure is a 500 that does not echo internals", () => {
  assert.deepEqual(handleRouteError(new Error("[Request ID: 77] Server Error")), {
    status: 500,
    body: { error: "Unexpected server error" },
  });
});
