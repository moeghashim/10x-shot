import assert from "node:assert/strict";
import { test } from "node:test";
import { hasSpotlightData, gradeSegments, formatVisits, projectTools } from "../lib/home/project-presentation.ts";

const project = { id: 2, title: "Bannaa", description: "", progress: 20, status: "active", stackItemIds: [], aiSkills: [], tools: [] };
const metrics = { sector: "Education", commits: 0, visits: 0, growth: 0 };

test("spotlight requires every metric, accepts zero and negative growth", () => {
  assert.equal(hasSpotlightData(project), false);
  assert.equal(hasSpotlightData({ ...project, ...metrics }), true);
  assert.equal(hasSpotlightData({ ...project, ...metrics, growth: -12.5 }), true);
  for (const field of Object.keys(metrics)) {
    assert.equal(hasSpotlightData({ ...project, ...metrics, [field]: undefined }), false);
  }
  for (const value of [NaN, Infinity, -Infinity]) {
    for (const field of ["commits", "visits", "growth"]) {
      assert.equal(hasSpotlightData({ ...project, ...metrics, [field]: value }), false);
    }
  }
  assert.equal(hasSpotlightData({ ...project, ...metrics, visits: -1 }), false);
  assert.equal(hasSpotlightData({ ...project, ...metrics, sector: " " }), false);
});

test("catalog IDs resolve grades even when legacy tool names are translated", () => {
  const catalog = [{ id: 5, name: "Codex", category: "tool", grade: "B" }];
  assert.deepEqual(projectTools({ ...project, stackItemIds: [5], tools: ["كودكس"] }, catalog), [{ name: "Codex", grade: "B" }]);
  assert.deepEqual(projectTools({ ...project, tools: ["CODEX", "Unknown"] }, catalog), [{ name: "CODEX", grade: "B" }, { name: "Unknown", grade: undefined }]);
  assert.deepEqual(projectTools(project, catalog), []);
});

test("grades use the specified five segments without inventing missing ratings", () => {
  assert.deepEqual(["A", "B", "C", "D", "E", undefined, "F"].map(gradeSegments), [5, 4, 3, 2, 1, 0, 0]);
});

test("visits compact thousands and retain values below 1000", () => {
  for (const [value, formatted] of [[0, "0"], [999, "999"], [1000, "1k"], [3800, "3.8k"], [12400, "12.4k"]]) {
    assert.equal(formatVisits(value), formatted);
  }
});

test("launch links preserve planning state and reject unsafe schemes", async () => {
  const { projectLaunchUrl } = await import("../lib/home/project-presentation.ts");
  assert.equal(projectLaunchUrl({ ...project, status: "planning", url: "example.com" }), null);
  assert.equal(projectLaunchUrl({ ...project, url: "example.com" }), "https://example.com/");
  assert.equal(projectLaunchUrl({ ...project, url: "javascript:alert(1)" }), null);
  assert.equal(projectLaunchUrl({ ...project, url: "" }), null);
});

test("public stack includes legacy assignments, merges casing, and counts each project once", async () => {
  const { buildPublicStack } = await import("../lib/home/project-presentation.ts");
  const catalog = [
    { id: 1, name: "Codex", category: "tool", grade: "A", reason: "Code", familiarity: "expert" },
    { id: 2, name: "Unused", category: "tool", grade: "B" },
  ];
  const projects = [
    { ...project, id: 1, tools: [" Codex ", "CODEX", "ChatGPT", "PaperClip"], aiSkills: ["Review"] },
    { ...project, id: 2, tools: ["paperclip", "ChatGPT"] },
  ];
  const before = JSON.stringify({ projects, catalog });
  const items = buildPublicStack(projects, catalog);
  assert.deepEqual(items.map(item => [item.name, item.usageCount]), [["ChatGPT", 2], ["PaperClip", 2], ["Codex", 1], ["Review", 1]]);
  const codex = items.find(item => item.name === "Codex");
  assert.equal(codex.grade, "A");
  assert.equal(codex.familiarity, "expert");
  assert.equal(codex.reason, "Code");
  assert.equal(items[0].grade, undefined);
  assert.equal(items[0].familiarity, undefined);
  assert.equal(items.find(item => item.name === "Review").category, "ai_skill");
  assert.equal(JSON.stringify({ projects, catalog }), before);
});

test("public stack respects catalog IDs, category boundaries, and safe project links", async () => {
  const { buildPublicStack } = await import("../lib/home/project-presentation.ts");
  const catalog = [{ id: 5, name: "Codex", category: "tool", grade: "B" }];
  const items = buildPublicStack([
    { ...project, id: 1, stackItemIds: [5, 5, 99], tools: ["Stale translated alias"], url: "example.com" },
    { ...project, id: 2, stackItemIds: [99], tools: ["Trigger.dev"], aiSkills: ["Codex"], url: "javascript:alert(1)" },
  ], catalog);
  assert.equal(items.length, 3);
  assert.equal(items.find(item => item.category === "tool" && item.name === "Codex").projects[0].url, "https://example.com/");
  assert.equal(items.find(item => item.category === "ai_skill").grade, undefined);
  assert.equal(items.find(item => item.name === "Trigger.dev").projects[0].url, null);
  assert.deepEqual(buildPublicStack([], catalog), []);
});
