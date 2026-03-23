import { query } from "./_generated/server";

export const getPublicStats = query({
  args: {},
  handler: async (ctx) => {
    const [projects, globalMetrics] = await Promise.all([
      ctx.db.query("projects").collect(),
      ctx.db.query("globalMetrics").collect(),
    ]);

    const totalProjects = projects.length;
    const activeProjects = projects.filter((project) => {
      return project.status === "active" || project.status === "completed";
    });
    const projectsLaunched = activeProjects.length;

    const avgProductivityGain =
      totalProjects > 0
        ? projects.reduce((sum, project) => sum + (Number(project.productivity) || 0), 0) / totalProjects
        : 0;

    const currentProductivity =
      activeProjects.length > 0
        ? activeProjects.reduce((sum, project) => sum + (Number(project.productivity) || 0), 0) /
          activeProjects.length
        : avgProductivityGain;

    const aiToolsIntegrated = Array.from(
      new Set(projects.flatMap((project) => project.tools))
    ).length;

    const latestMetric = globalMetrics.sort((a, b) => b.month.localeCompare(a.month))[0];

    return {
      projectsLaunched,
      totalProjects,
      avgProductivityGain,
      aiToolsIntegrated,
      currentProductivity,
      latestGlobalProductivityGain: latestMetric?.productivityGain ?? 0,
    };
  },
});
