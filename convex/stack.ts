import { ConvexError, v } from "convex/values";
import { mutation, query, type MutationCtx } from "./_generated/server";
import { requireAdmin } from "./lib";
import { stackItemInputValidator } from "./validators";

type StackLookup = Map<number, { name: string; category: "tool" | "ai_skill" }>;

function toStackItem(doc: any) {
  return {
    id: doc.legacyId,
    name: doc.name,
    category: doc.category,
    grade: doc.grade,
    familiarity: doc.familiarity,
    reason: doc.reason,
    notes: doc.notes,
  };
}

function normalizeIds(ids: number[] | undefined) {
  return Array.from(new Set((ids ?? []).filter((id) => Number.isInteger(id))));
}

function buildStackLookup(stackDocs: Array<any>): StackLookup {
  return new Map(
    stackDocs.map((doc) => [
      doc.legacyId,
      {
        name: doc.name,
        category: doc.category,
      },
    ])
  );
}

function deriveProjectStack(stackItemIds: number[] | undefined, stackLookup: StackLookup) {
  const aiSkills: string[] = [];
  const tools: string[] = [];

  for (const stackItemId of normalizeIds(stackItemIds)) {
    const item = stackLookup.get(stackItemId);
    if (!item) {
      continue;
    }

    if (item.category === "ai_skill") {
      aiSkills.push(item.name);
    } else {
      tools.push(item.name);
    }
  }

  return { aiSkills, tools };
}

function sameStringArray(left: string[] | undefined, right: string[]) {
  if ((left ?? []).length !== right.length) {
    return false;
  }

  return right.every((value, index) => (left ?? [])[index] === value);
}

async function syncStackItemProjects(
  ctx: MutationCtx,
  stackDocs: Array<any>,
  stackItemId: number,
  projectIds: number[],
  now: number
) {
  const normalizedProjectIds = normalizeIds(projectIds);
  const projectDocs = await ctx.db.query("projects").collect();
  const projectIdsSet = new Set(normalizedProjectIds);
  const projectLookup = new Map(projectDocs.map((project) => [project.legacyId, project]));
  const missingProjectIds = normalizedProjectIds.filter((projectId) => !projectLookup.has(projectId));

  if (missingProjectIds.length > 0) {
    throw new ConvexError(`Unknown project ids: ${missingProjectIds.join(", ")}`);
  }

  const stackLookup = buildStackLookup(stackDocs);

  for (const project of projectDocs) {
    const currentStackItemIds = normalizeIds(project.stackItemIds);
    const isLinked = currentStackItemIds.includes(stackItemId);
    const shouldBeLinked = projectIdsSet.has(project.legacyId);

    if (!isLinked && !shouldBeLinked) {
      continue;
    }

    const nextStackItemIds = shouldBeLinked
      ? normalizeIds([...currentStackItemIds, stackItemId])
      : currentStackItemIds.filter((id) => id !== stackItemId);
    const derivedStack = deriveProjectStack(nextStackItemIds, stackLookup);
    const stackIdsChanged =
      nextStackItemIds.length !== currentStackItemIds.length ||
      nextStackItemIds.some((id, index) => id !== currentStackItemIds[index]);
    const derivedChanged =
      !sameStringArray(project.aiSkills, derivedStack.aiSkills) || !sameStringArray(project.tools, derivedStack.tools);

    if (!stackIdsChanged && !derivedChanged) {
      continue;
    }

    await ctx.db.patch(project._id, {
      stackItemIds: nextStackItemIds,
      aiSkills: derivedStack.aiSkills,
      tools: derivedStack.tools,
      updatedAt: now,
    });
  }
}

async function getLinkedProjectIds(ctx: MutationCtx, stackItemId: number) {
  const projectDocs = await ctx.db.query("projects").collect();

  return projectDocs.filter((project) => (project.stackItemIds ?? []).includes(stackItemId)).map((project) => project.legacyId);
}

export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    const [stackDocs, projectDocs] = await Promise.all([
      ctx.db.query("stackItems").collect(),
      ctx.db.query("projects").collect(),
    ]);

    return stackDocs
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((stackDoc) => {
        const projects = projectDocs
          .filter((project) => (project.stackItemIds ?? []).includes(stackDoc.legacyId))
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((project) => ({
            id: project.legacyId,
            title: project.title,
            status: project.status,
            url: project.url ?? null,
          }));

        return {
          ...toStackItem(stackDoc),
          usageCount: projects.length,
          projects,
        };
      });
  },
});

export const listAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const docs = await ctx.db.query("stackItems").collect();

    return docs.sort((a, b) => a.name.localeCompare(b.name)).map((doc) => toStackItem(doc));
  },
});

export const getAdminById = query({
  args: {
    id: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const doc = await ctx.db
      .query("stackItems")
      .withIndex("by_legacy_id", (q) => q.eq("legacyId", args.id))
      .first();

    return doc ? toStackItem(doc) : null;
  },
});

export const save = mutation({
  args: {
    id: v.optional(v.number()),
    stack: stackItemInputValidator,
    projectIds: v.optional(v.array(v.number())),
  },
  handler: async (ctx, args) => {
    const { profile } = await requireAdmin(ctx);
    const now = Date.now();

    const existing =
      args.id !== undefined
        ? await ctx.db
            .query("stackItems")
            .withIndex("by_legacy_id", (q) => q.eq("legacyId", args.id!))
            .first()
        : null;

    if (args.id !== undefined && !existing) {
      throw new ConvexError("Stack item not found");
    }

    const normalizedName = args.stack.name.trim();
    const normalizedReason = args.stack.reason?.trim() || undefined;
    const normalizedNotes = args.stack.notes?.trim() || undefined;
    if (!normalizedName) {
      throw new ConvexError("Stack item name is required");
    }

    const allStackItems = await ctx.db.query("stackItems").collect();
    const duplicate = allStackItems.find(
      (item) =>
        item.legacyId !== args.id &&
        item.name.trim().toLowerCase() === normalizedName.toLowerCase() &&
        item.category === args.stack.category
    );

    if (duplicate) {
      throw new ConvexError("A stack item with that name already exists in this category");
    }

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: normalizedName,
        category: args.stack.category,
        grade: args.stack.grade,
        familiarity: args.stack.familiarity,
        reason: normalizedReason,
        notes: normalizedNotes,
        updatedAt: now,
      });

      const updatedStackDocs = allStackItems.map((item) =>
        item.legacyId === existing.legacyId
          ? {
              ...item,
              name: normalizedName,
              category: args.stack.category,
              grade: args.stack.grade,
              familiarity: args.stack.familiarity,
              reason: normalizedReason,
              notes: normalizedNotes,
              updatedAt: now,
            }
          : item
      );

      await syncStackItemProjects(
        ctx,
        updatedStackDocs,
        existing.legacyId,
        args.projectIds ?? (await getLinkedProjectIds(ctx, existing.legacyId)),
        now
      );

      await ctx.db.insert("adminActivity", {
        userId: profile.userId,
        action: "UPDATE_STACK_ITEM",
        resourceType: "stack",
        resourceId: args.id,
        details: `Updated stack item: ${normalizedName}`,
        createdAt: now,
      });

      return {
        id: existing.legacyId,
        name: normalizedName,
        category: args.stack.category,
        grade: args.stack.grade,
        familiarity: args.stack.familiarity,
        reason: normalizedReason,
        notes: normalizedNotes,
      };
    }

    const nextLegacyId = allStackItems.reduce((max, item) => Math.max(max, item.legacyId), 0) + 1;
    await ctx.db.insert("stackItems", {
      legacyId: nextLegacyId,
      name: normalizedName,
      category: args.stack.category,
      grade: args.stack.grade,
      familiarity: args.stack.familiarity,
      reason: normalizedReason,
      notes: normalizedNotes,
      createdAt: now,
      updatedAt: now,
    });

    if (args.projectIds !== undefined) {
      await syncStackItemProjects(
        ctx,
        [
          ...allStackItems,
          {
            legacyId: nextLegacyId,
            name: normalizedName,
            category: args.stack.category,
            grade: args.stack.grade,
            familiarity: args.stack.familiarity,
            reason: normalizedReason,
            notes: normalizedNotes,
            createdAt: now,
            updatedAt: now,
          },
        ],
        nextLegacyId,
        args.projectIds,
        now
      );
    }

    await ctx.db.insert("adminActivity", {
      userId: profile.userId,
      action: "CREATE_STACK_ITEM",
      resourceType: "stack",
      resourceId: nextLegacyId,
      details: `Created stack item: ${normalizedName}`,
      createdAt: now,
    });

    return {
      id: nextLegacyId,
      name: normalizedName,
      category: args.stack.category,
      grade: args.stack.grade,
      familiarity: args.stack.familiarity,
      reason: normalizedReason,
      notes: normalizedNotes,
    };
  },
});

export const remove = mutation({
  args: {
    id: v.number(),
  },
  handler: async (ctx, args) => {
    const { profile } = await requireAdmin(ctx);
    const stackDoc = await ctx.db
      .query("stackItems")
      .withIndex("by_legacy_id", (q) => q.eq("legacyId", args.id))
      .first();

    if (!stackDoc) {
      throw new ConvexError("Stack item not found");
    }

    const projectDocs = await ctx.db.query("projects").collect();
    const usageCount = projectDocs.filter((project) => (project.stackItemIds ?? []).includes(args.id)).length;
    if (usageCount > 0) {
      throw new ConvexError(`Stack item is still assigned to ${usageCount} project(s)`);
    }

    await ctx.db.delete(stackDoc._id);
    await ctx.db.insert("adminActivity", {
      userId: profile.userId,
      action: "DELETE_STACK_ITEM",
      resourceType: "stack",
      resourceId: args.id,
      details: `Deleted stack item: ${stackDoc.name}`,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

export const backfillFromProjects = mutation({
  args: {},
  handler: async (ctx) => {
    const { profile } = await requireAdmin(ctx);
    const now = Date.now();
    const [stackDocs, projectDocs] = await Promise.all([
      ctx.db.query("stackItems").collect(),
      ctx.db.query("projects").collect(),
    ]);

    const stackKeyToLegacyId = new Map<string, number>();
    for (const stackDoc of stackDocs) {
      stackKeyToLegacyId.set(`${stackDoc.category}:${stackDoc.name.trim().toLowerCase()}`, stackDoc.legacyId);
    }

    let nextLegacyId = stackDocs.reduce((max, item) => Math.max(max, item.legacyId), 0) + 1;
    let createdCount = 0;
    let updatedProjects = 0;

    for (const project of projectDocs) {
      const stackItemIds = new Set(project.stackItemIds ?? []);
      const groupedEntries: Array<{ category: "tool" | "ai_skill"; names: string[] }> = [
        { category: "tool", names: project.tools ?? [] },
        { category: "ai_skill", names: project.aiSkills ?? [] },
      ];

      for (const entry of groupedEntries) {
        for (const rawName of entry.names) {
          const normalizedName = rawName.trim();
          if (!normalizedName) {
            continue;
          }

          const key = `${entry.category}:${normalizedName.toLowerCase()}`;
          let legacyId = stackKeyToLegacyId.get(key);

          if (!legacyId) {
            legacyId = nextLegacyId++;
            await ctx.db.insert("stackItems", {
              legacyId,
              name: normalizedName,
              category: entry.category,
              grade: "C",
              createdAt: now,
              updatedAt: now,
            });
            stackKeyToLegacyId.set(key, legacyId);
            createdCount += 1;
          }

          stackItemIds.add(legacyId);
        }
      }

      const normalizedIds = Array.from(stackItemIds);
      const existingIds = project.stackItemIds ?? [];
      const changed =
        normalizedIds.length !== existingIds.length ||
        normalizedIds.some((id, index) => id !== existingIds[index]);

      if (changed) {
        await ctx.db.patch(project._id, {
          stackItemIds: normalizedIds,
          updatedAt: now,
        });
        updatedProjects += 1;
      }
    }

    await ctx.db.insert("adminActivity", {
      userId: profile.userId,
      action: "BACKFILL_STACK_ITEMS",
      resourceType: "stack",
      details: `Backfilled ${createdCount} stack items across ${updatedProjects} projects`,
      createdAt: now,
    });

    return {
      createdCount,
      updatedProjects,
    };
  },
});
