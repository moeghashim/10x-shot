import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { assertProjectInput, requireAdmin } from "./lib";
import {
  projectInputValidator,
  projectLocalizationValidator,
  supportedLocaleValidator,
} from "./validators";

function pickLocalizedText(value: any, locale: "en" | "ar", fallback?: string | null) {
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

function pickProjectTitle(value: any, fallback?: string | null) {
  if (typeof value?.en === "string" && value.en.trim()) {
    return value.en;
  }

  return fallback ?? "";
}

const ARABIC_PROJECT_DESCRIPTION_FALLBACKS: Record<string, string> = {
  "Rabbit Brain":
    "أداة مفتوحة المصدر للويب ولسطر الأوامر للتعلّم من منصة X.\nيقوم Rabbit Brain بتحليل التغريدات، وحفظ الإشارات المرجعية، وتتبع صناع المحتوى، وبناء خلاصات يومية للحسابات حتى تصبح الأفكار المفيدة أسهل في الرجوع إليها من الخط الزمني الذي جاءت منه.",
};

function pickProjectDescription(doc: any, locale: "en" | "ar") {
  if (locale !== "ar") {
    return pickLocalizedText(doc.localizedDescription, locale, doc.description);
  }

  const manualFallback = ARABIC_PROJECT_DESCRIPTION_FALLBACKS[doc.title];
  const localizedArabic = doc.localizedDescription?.ar?.trim();
  const localizedEnglish = doc.localizedDescription?.en?.trim() || doc.description?.trim() || "";

  if (localizedArabic && localizedArabic !== localizedEnglish) {
    return localizedArabic;
  }

  if (manualFallback) {
    return manualFallback;
  }

  return pickLocalizedText(doc.localizedDescription, locale, doc.description);
}

function pickLocalizedList(value: any, locale: "en" | "ar", fallback?: string[]) {
  if (!value) {
    return fallback ?? [];
  }

  const localized = locale === "ar" ? value.ar : value.en;
  if (Array.isArray(localized) && localized.length > 0) {
    return localized;
  }

  if (Array.isArray(value.en) && value.en.length > 0) {
    return value.en;
  }

  return fallback ?? [];
}

function toLocalizationBundle(doc: any) {
  return {
    title: {
      en: doc.localizedTitle?.en ?? doc.title,
      ar: doc.localizedTitle?.en ?? doc.title,
      translationStatus: doc.localizedTitle?.translationStatus ?? "pending",
      sourceHash: doc.localizedTitle?.sourceHash,
      translatedAt: doc.localizedTitle?.translatedAt,
      translationModel: doc.localizedTitle?.translationModel,
    },
    description: doc.localizedDescription ?? {
      en: doc.description,
      ar: doc.description,
      translationStatus: "pending",
    },
    objectives:
      doc.objectives || doc.localizedObjectives
        ? doc.localizedObjectives ?? {
            en: doc.objectives ?? "",
            ar: doc.objectives ?? "",
            translationStatus: "pending",
          }
        : undefined,
    timeframe:
      doc.timeframe || doc.localizedTimeframe
        ? doc.localizedTimeframe ?? {
            en: doc.timeframe ?? "",
            ar: doc.timeframe ?? "",
            translationStatus: "pending",
          }
        : undefined,
    aiSkills: doc.localizedAiSkills ?? {
      en: doc.aiSkills,
      ar: doc.aiSkills,
      translationStatus: "pending",
    },
    tools: doc.localizedTools ?? {
      en: doc.tools,
      ar: doc.tools,
      translationStatus: "pending",
    },
  };
}

function toProject(doc: any, locale: "en" | "ar" = "en") {
  return {
    id: doc.legacyId,
    title: pickProjectTitle(doc.localizedTitle, doc.title),
    description: pickProjectDescription(doc, locale),
    objectives: doc.objectives || doc.localizedObjectives
      ? pickLocalizedText(doc.localizedObjectives, locale, doc.objectives)
      : undefined,
    progress: doc.progress,
    status: doc.status,
    aiSkills: pickLocalizedList(doc.localizedAiSkills, locale, doc.aiSkills),
    tools: pickLocalizedList(doc.localizedTools, locale, doc.tools),
    timeframe: doc.timeframe || doc.localizedTimeframe
      ? pickLocalizedText(doc.localizedTimeframe, locale, doc.timeframe)
      : undefined,
    url: doc.url ?? null,
  };
}

export const listPublic = query({
  args: {
    locale: v.optional(supportedLocaleValidator),
  },
  handler: async (ctx, args) => {
    const locale = args.locale ?? "en";
    const docs = await ctx.db.query("projects").collect();
    return docs.sort((a, b) => a.legacyId - b.legacyId).map((doc) => toProject(doc, locale));
  },
});

export const listAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const docs = await ctx.db.query("projects").collect();
    return docs.sort((a, b) => a.legacyId - b.legacyId).map((doc) => toProject(doc, "en"));
  },
});

export const getAdminById = query({
  args: {
    id: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const doc = await ctx.db
      .query("projects")
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

export const listSummaries = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("projects").collect();
    return docs
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((doc) => ({
        id: doc.legacyId,
        title: doc.title,
      }));
  },
});

export const save = mutation({
  args: {
    id: v.optional(v.number()),
    project: projectInputValidator,
    localized: v.optional(projectLocalizationValidator),
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
        localizedTitle: args.localized?.title,
        localizedDescription: args.localized?.description,
        localizedObjectives: args.localized?.objectives,
        localizedTimeframe: args.localized?.timeframe,
        localizedAiSkills: args.localized?.aiSkills,
        localizedTools: args.localized?.tools,
        updatedAt: now,
      });
      return toProject(
        {
          ...existing,
          ...args.project,
          localizedTitle: args.localized?.title,
          localizedDescription: args.localized?.description,
          localizedObjectives: args.localized?.objectives,
          localizedTimeframe: args.localized?.timeframe,
          localizedAiSkills: args.localized?.aiSkills,
          localizedTools: args.localized?.tools,
          updatedAt: now,
        },
        "en"
      );
    }

    const currentProjects = await ctx.db.query("projects").collect();
    const nextLegacyId = currentProjects.reduce((max, project) => Math.max(max, project.legacyId), 0) + 1;

    const createdId = await ctx.db.insert("projects", {
      ...args.project,
      localizedTitle: args.localized?.title,
      localizedDescription: args.localized?.description,
      localizedObjectives: args.localized?.objectives,
      localizedTimeframe: args.localized?.timeframe,
      localizedAiSkills: args.localized?.aiSkills,
      localizedTools: args.localized?.tools,
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
    return toProject(created, "en");
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
