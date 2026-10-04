import assert from "node:assert/strict";
import { test } from "node:test";
import { loadModule } from "./helpers/load-route.mjs";

const doc = {
  legacyId: 1,
  projectLegacyId: 7,
  month: "2026-09",
  progress: 40,
  productivityScore: 8,
  hoursWorked: 10,
  aiAssistanceHours: 6,
  manualHours: 4,
  achievements: ["Shipped"],
  notes: "Internal: client is unhappy",
  createdAt: 0,
};

function loadProjectMetrics() {
  const identity = (definition) => definition;
  return loadModule("convex/projectMetrics.ts", {
    "./_generated/server": { query: identity, mutation: identity },
    "./lib": { requireAdmin: async () => ({ profile: { userId: "admin" } }), toIsoString: () => "1970-01-01T00:00:00.000Z" },
    "./validators": loadModule("convex/validators.ts", {}),
  });
}

const ctx = { db: { query: () => ({ collect: async () => [doc] }) } };

test("the public metrics query does not return admin notes", async () => {
  const [metric] = await loadProjectMetrics().listPublic.handler(ctx, {});
  assert.equal("notes" in metric, false);
  assert.deepEqual(metric.achievements, ["Shipped"]);
});

test("the admin metrics query still returns notes", async () => {
  const [metric] = await loadProjectMetrics().list.handler(ctx, {});
  assert.equal(metric.notes, "Internal: client is unhappy");
});
