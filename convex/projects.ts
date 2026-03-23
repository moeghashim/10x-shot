import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { assertProjectInput, requireAdmin } from "./lib";
import { projectInputValidator } from "./validators";

function toProject(doc: any) {
  return {
    id: doc.legacyId,
    title: doc.title,
    domain: doc.domain,
    description: doc.description,
    objectives: doc.objectives,
    progress: doc.progress,
    status: doc.status,
    aiSkills: doc.aiSkills,
    tools: doc.tools,
    productivity: doc.productivity,
    timeframe: doc.timeframe,
    url: doc.url ?? null,
  };
}

export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("projects").collect();
    return docs.sort((a, b) => a.legacyId - b.legacyId).map(toProject);
  },
});

export const listAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const docs = await ctx.db.query("projects").collect();
    return docs.sort((a, b) => a.legacyId - b.legacyId).map(toProject);
  },
});

export const listSummaries = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("projects").collect();
    return docs
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((doc) => ({
        id: doc.legacyId,
        title: doc.title,
        domain: doc.domain,
      }));
  },
});

export const save = mutation({
  args: {
    id: v.optional(v.number()),
    project: projectInputValidator,
  },
  handler: async (ctx, args) => {
    const { profile } = await requireAdmin(ctx);
    assertProjectInput(args.project);

    const now = Date.now();
    const existing =
      args.id !== undefined
        ? await ctx.db
            .query("projects")
            .withIndex("by_legacy_id", (q) => q.eq("legacyId", args.id!))
            .first()
        : null;

    if (args.id !== undefined && !existing) {
      throw new ConvexError("Project not found");
    }

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args.project,
        updatedAt: now,
      });
      return toProject({ ...existing, ...args.project, updatedAt: now });
    }

    const currentProjects = await ctx.db.query("projects").collect();
    const nextLegacyId = currentProjects.reduce((max, project) => Math.max(max, project.legacyId), 0) + 1;

    const createdId = await ctx.db.insert("projects", {
      ...args.project,
      legacyId: nextLegacyId,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("adminActivity", {
      userId: profile.userId,
      action: "CREATE_PROJECT",
      resourceType: "project",
      resourceId: nextLegacyId,
      details: `Created project: ${args.project.title}`,
      createdAt: now,
    });

    const created = await ctx.db.get(createdId);
    return toProject(created);
  },
});

export const remove = mutation({
  args: {
    id: v.number(),
  },
  handler: async (ctx, args) => {
    const { profile } = await requireAdmin(ctx);
    const project = await ctx.db
      .query("projects")
      .withIndex("by_legacy_id", (q) => q.eq("legacyId", args.id))
      .first();

    if (!project) {
      throw new ConvexError("Project not found");
    }

    const metrics = await ctx.db
      .query("projectMetrics")
      .withIndex("by_project_month", (q) => q.eq("projectLegacyId", args.id))
      .collect();

    for (const metric of metrics) {
      await ctx.db.delete(metric._id);
    }

    await ctx.db.delete(project._id);
    await ctx.db.insert("adminActivity", {
      userId: profile.userId,
      action: "DELETE_PROJECT",
      resourceType: "project",
      resourceId: args.id,
      details: `Deleted project: ${project.title}`,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});
