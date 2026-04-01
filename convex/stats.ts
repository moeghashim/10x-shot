import { query } from "./_generated/server";

export const getPublicStats = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();

    const totalProjects = projects.length;
    const activeProjects = projects.filter((project) => {
      return project.status === "active" || project.status === "completed";
    });
    const projectsLaunched = activeProjects.length;

    const aiToolsIntegrated = Array.from(
      new Set(projects.flatMap((project) => project.tools))
    ).length;

    return {
      projectsLaunched,
      totalProjects,
      aiToolsIntegrated,
    };
  },
});
