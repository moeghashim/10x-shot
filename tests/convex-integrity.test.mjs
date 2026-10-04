import assert from "node:assert/strict";
import { test } from "node:test";
import { adminProfile, loadConvex, memoryDb } from "./helpers/convex-memory.mjs";

const projectInput = { title: "Replacement", description: "New", status: "active", stackItemIds: [], aiSkills: [], tools: [] };

test("a project created after a delete does not inherit the old roadmap or targets", async () => {
  const db = memoryDb({
    adminProfiles: [adminProfile("admin-1")],
    projects: [{ _id: "p1", legacyId: 1, title: "Old", description: "Old", status: "active", stackItemIds: [], aiSkills: [], tools: [] }],
    stackItems: [],
    projectMetrics: [{ _id: "m1", projectLegacyId: 1, month: "2026-08" }],
    planningCards: [{ _id: "c1", projectLegacyId: 1, title: "Old roadmap" }, { _id: "c2", projectLegacyId: 2, title: "Other project" }],
    projectMetricTargets: [{ _id: "t1", projectLegacyId: 1, month: "2026-08" }],
    adminActivity: [],
  });
  const projects = loadConvex("convex/projects.ts");

  await projects.remove.handler({ db }, { id: 1 });
  const created = await projects.save.handler({ db }, { project: projectInput });

  const owned = (table) => db.tables[table].filter((doc) => doc.projectLegacyId === created.id);
  assert.deepEqual(owned("planningCards"), []);
  assert.deepEqual(owned("projectMetricTargets"), []);
  assert.deepEqual(owned("projectMetrics"), []);
  assert.deepEqual(db.tables.planningCards.map((card) => card._id), ["c2"]);
});

const metric = { project_id: 1, progress: 10, sales_gmv: 0, productivity_score: 5, hours_worked: 1, ai_assistance_hours: 1, manual_hours: 0, achievements: [] };
const target = { project_id: 1, target_progress: 10, target_sales_gmv: 0, target_productivity_score: 5, target_hours_worked: 1, target_ai_assistance_hours: 1, target_manual_hours: 0 };
const globalMetric = { twitter_followers: 0, youtube_subscribers: 0, tiktok_followers: 0, instagram_followers: 0, newsletter_subscribers: 0, total_gmv: 0, skills_gained: [], milestones: [] };

const monthWriters = [
  ["project metrics", "convex/projectMetrics.ts", "projectMetrics", (m, month) => m.save.handler, (month) => ({ metric: { ...metric, month } })],
  ["metric targets", "convex/projectMetricTargets.ts", "projectMetricTargets", (m) => m.saveMany.handler, (month) => ({ targets: [{ ...target, month }] })],
  ["global metrics", "convex/globalMetrics.ts", "globalMetrics", (m) => m.save.handler, (month) => ({ metric: { ...globalMetric, month } })],
];

for (const [name, file, table, pick, args] of monthWriters) {
  test(`${name} reject a month the public page cannot format`, async () => {
    const db = memoryDb({ adminProfiles: [adminProfile("admin-1")], [table]: [], adminActivity: [] });
    const handler = pick(loadConvex(file));

    for (const month of ["not-a-month", "2026-13", "2026-9", ""]) {
      await assert.rejects(handler({ db }, args(month)), /Month must be/, month);
    }
    assert.deepEqual(db.tables[table], []);

    await handler({ db }, args("2026-09"));
    assert.deepEqual(db.tables[table].map((doc) => doc.month), ["2026-09"]);
  });
}

test("the last active admin cannot be deactivated", async () => {
  const db = memoryDb({ adminProfiles: [adminProfile("admin-1"), adminProfile("admin-2", false)], adminActivity: [] });
  const adminUsers = loadConvex("convex/adminUsers.ts");

  await assert.rejects(
    adminUsers.updateProfile.handler({ db }, { userId: "admin-1", isActive: false }),
    /last active admin/
  );
  assert.equal(db.tables.adminProfiles[0].isActive, true);
});

test("an admin can be deactivated while another active admin remains", async () => {
  const db = memoryDb({ adminProfiles: [adminProfile("admin-1"), adminProfile("admin-2")], adminActivity: [] });
  const adminUsers = loadConvex("convex/adminUsers.ts");

  await adminUsers.updateProfile.handler({ db }, { userId: "admin-2", isActive: false });

  assert.equal(db.tables.adminProfiles[1].isActive, false);
});
