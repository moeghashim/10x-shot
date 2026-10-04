import assert from "node:assert/strict";
import { test } from "node:test";
import { adminRouteModules, jsonRequest, loadModule } from "./helpers/load-route.mjs";

function countingTranslator(names) {
  const translated = [];
  const translation = Object.fromEntries(
    names.map((name) => [
      name,
      async (content) => {
        translated.push(content);
        return { localized: undefined, hadFailures: false };
      },
    ])
  );
  return { translation, translated };
}

const translatingRoutes = [
  {
    file: "app/api/admin/planning-cards/route.ts",
    translator: "localizePlanningCardContent",
    body: { project_id: 1, column: "now", title: "New card", order: 0 },
  },
  {
    file: "app/api/admin/site-copy/route.ts",
    translator: "localizeSiteCopyEntry",
    body: { key: "HomePage.title", en: "Fresh copy" },
  },
  {
    file: "app/api/admin/projects/route.ts",
    translator: "localizeProjectContent",
    body: { title: "New project", description: "d", status: "active", aiSkills: [], tools: [] },
  },
  {
    file: "app/api/admin/project-metrics/route.ts",
    translator: "localizeProjectMetricContent",
    body: { project_id: 1, month: "2026-09" },
  },
  {
    file: "app/api/admin/global-metrics/route.ts",
    translator: "localizeGlobalMetricContent",
    body: { month: "2026-09" },
  },
  {
    file: "app/api/admin/translations/backfill/route.ts",
    translator: "localizeProjectContent",
    extraTranslators: ["localizeGlobalMetricContent"],
    body: {},
  },
];

for (const { file, translator, extraTranslators = [], body } of translatingRoutes) {
  test(`${file} rejects a signed-out caller before paying for a translation`, async () => {
    const { translation, translated } = countingTranslator([translator, ...extraTranslators]);
    const { modules } = adminRouteModules({ signedIn: false, translation });
    const route = loadModule(file, modules);

    const response = await route.POST(jsonRequest(body));

    assert.equal(response.status, 401);
    assert.deepEqual(translated, []);
  });
}

test("translation backfill keeps every project field it does not translate", async () => {
  const project = {
    id: 1,
    title: "One",
    description: "First project",
    objectives: "Ship",
    progress: 40,
    launchDate: "2026-09",
    status: "active",
    stackItemIds: ["s1"],
    aiSkills: ["Claude"],
    tools: ["Convex"],
    timeframe: "Q3",
    sector: "Education",
    commits: 5,
    visits: 10,
    growth: 2,
    url: "https://example.com",
  };
  const saved = [];
  const { translation } = countingTranslator(["localizeProjectContent", "localizeGlobalMetricContent"]);
  const { modules } = adminRouteModules({
    signedIn: true,
    translation,
    convex: {
      "adminUsers.current": () => ({ id: "admin" }),
      "projects.listAdmin": () => [project],
      "projects.getAdminById": () => null,
      "projects.save": (args) => saved.push(args),
      "globalMetrics.list": () => [],
      "adminUsers.logActivity": () => null,
    },
  });
  const route = loadModule("app/api/admin/translations/backfill/route.ts", modules);

  const response = await route.POST();

  assert.equal(response.status, 200);
  const { id, ...fields } = project;
  assert.deepEqual(saved, [{ id: 1, project: fields, localized: undefined }]);
});
