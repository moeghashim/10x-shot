import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import { requireAdmin, toIsoString } from "./lib";
import {
  planningCardInputValidator,
  planningCardLocalizationValidator,
  supportedLocaleValidator,
} from "./validators";

type Locale = "en" | "ar";
type PublicColumn = "todo" | "doing" | "done";

function normalizeColumn(column: string): PublicColumn {
  if (column === "doing" || column === "done") {
    return column;
  }

  return "todo";
}

function pickLocalizedText(value: any, locale: Locale, fallback?: string | null) {
  if (!value) {
    return fallback ?? "";
  }

  if (locale === "ar" && typeof value.ar === "string" && value.ar.trim()) {
    return value.ar;
  }

  if (typeof value.en === "string" && value.en.trim()) {
    return value.en;
  }

  return fallback ?? "";
}

function toLocalizationBundle(doc: any) {
  return {
    title: doc.localizedTitle ?? {
      en: doc.title,
      ar: doc.title,
      translationStatus: "pending",
    },
    description: doc.localizedDescription ?? {
      en: doc.description,
      ar: doc.description,
      translationStatus: "pending",
    },
  };
}

function toPlanningCard(doc: any, locale: Locale = "en") {
  return {
    id: doc.legacyId,
    project_id: doc.projectLegacyId,
    column: normalizeColumn(doc.column),
    title: pickLocalizedText(doc.localizedTitle, locale, doc.title),
    description: pickLocalizedText(doc.localizedDescription, locale, doc.description),
    order: doc.order,
    created_at: toIsoString(doc.createdAt),
    updated_at: toIsoString(doc.updatedAt),
  };
}

async function assertProjectExists(ctx: MutationCtx, projectLegacyId: number) {
  const project = await ctx.db
    .query("projects")
    .withIndex("by_legacy_id", (q) => q.eq("legacyId", projectLegacyId))
    .first();

  if (!project) {
    throw new ConvexError("Project not found");
  }
}

export const listPublic = query({
  args: {
    locale: v.optional(supportedLocaleValidator),
    projectId: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const locale = args.locale ?? "en";
    let docs = await ctx.db.query("planningCards").collect();
    if (args.projectId !== undefined) {
      docs = docs.filter((doc) => doc.projectLegacyId === args.projectId);
    }

    return docs
      .sort((a, b) => a.column.localeCompare(b.column) || a.order - b.order || a.createdAt - b.createdAt)
      .map((doc) => toPlanningCard(doc, locale));
  },
});

export const listAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const docs = await ctx.db.query("planningCards").collect();
    return docs
      .sort((a, b) => a.column.localeCompare(b.column) || a.order - b.order || a.createdAt - b.createdAt)
      .map((doc) => toPlanningCard(doc));
  },
});

export const getAdminById = query({
  args: {
    id: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const doc = await ctx.db
      .query("planningCards")
      .withIndex("by_legacy_id", (q) => q.eq("legacyId", args.id))
      .first();

    if (!doc) {
      return null;
    }

    return {
      id: doc.legacyId,
      localization: toLocalizationBundle(doc),
    };
  },
});

export const save = mutation({
  args: {
    id: v.optional(v.number()),
    card: planningCardInputValidator,
    localized: v.optional(planningCardLocalizationValidator),
  },
  handler: async (ctx, args) => {
    const { profile } = await requireAdmin(ctx);
    await assertProjectExists(ctx, args.card.project_id);

    const now = Date.now();
    const existing =
      args.id !== undefined
        ? await ctx.db
            .query("planningCards")
            .withIndex("by_legacy_id", (q) => q.eq("legacyId", args.id!))
            .first()
        : null;

    if (args.id !== undefined && !existing) {
      throw new ConvexError("Planning card not found");
    }

    if (existing) {
      await ctx.db.patch(existing._id, {
        projectLegacyId: args.card.project_id,
        column: args.card.column,
        title: args.card.title,
        description: args.card.description,
        localizedTitle: args.localized?.title,
        localizedDescription: args.localized?.description,
        order: args.card.order,
        updatedAt: now,
      });
    } else {
      const cards = await ctx.db.query("planningCards").collect();
      const nextLegacyId = cards.reduce((max, card) => Math.max(max, card.legacyId || 0), 0) + 1;
      await ctx.db.insert("planningCards", {
        legacyId: nextLegacyId,
        projectLegacyId: args.card.project_id,
        column: args.card.column,
        title: args.card.title,
        description: args.card.description,
        localizedTitle: args.localized?.title,
        localizedDescription: args.localized?.description,
        order: args.card.order,
        createdAt: now,
        updatedAt: now,
      });
    }

    await ctx.db.insert("adminActivity", {
      userId: profile.userId,
      action: "SAVE_PLANNING_CARD",
      resourceType: "planning_card",
      resourceId: args.id,
      details: `Saved planning card ${args.card.title}`,
      createdAt: now,
    });

    return { success: true };
  },
});

export const remove = mutation({
  args: {
    id: v.number(),
  },
  handler: async (ctx, args) => {
    const { profile } = await requireAdmin(ctx);
    const doc = await ctx.db
      .query("planningCards")
      .withIndex("by_legacy_id", (q) => q.eq("legacyId", args.id))
      .first();

    if (!doc) {
      throw new ConvexError("Planning card not found");
    }

    await ctx.db.delete(doc._id);
    await ctx.db.insert("adminActivity", {
      userId: profile.userId,
      action: "DELETE_PLANNING_CARD",
      resourceType: "planning_card",
      resourceId: args.id,
      details: `Deleted planning card ${doc.title}`,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});
