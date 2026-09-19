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
