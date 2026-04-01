import { mutation, query } from "./_generated/server";
import { requireAdmin, toIsoString } from "./lib";
import { localizedTextValidator } from "./validators";
import { v } from "convex/values";

function toEntry(doc: any) {
  return {
    key: doc.key,
    en: doc.en,
    ar: doc.ar,
    source_hash: doc.sourceHash,
    translated_at: toIsoString(doc.translatedAt),
    translation_model: doc.translationModel,
    translation_status: doc.translationStatus,
    created_at: toIsoString(doc.createdAt),
    updated_at: toIsoString(doc.updatedAt),
  };
}

export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("siteContent").collect();
    return docs.sort((a, b) => a.key.localeCompare(b.key)).map(toEntry);
  },
});

export const listAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const docs = await ctx.db.query("siteContent").collect();
    return docs.sort((a, b) => a.key.localeCompare(b.key)).map(toEntry);
  },
});

export const getByKey = query({
  args: {
    key: v.string(),
  },
  handler: async (ctx, args) => {
    const doc = await ctx.db
      .query("siteContent")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    return doc ? toEntry(doc) : null;
  },
});

export const save = mutation({
  args: {
    key: v.string(),
    content: localizedTextValidator,
  },
  handler: async (ctx, args) => {
    const { profile } = await requireAdmin(ctx);
    const now = Date.now();
    const existing = await ctx.db
      .query("siteContent")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        en: args.content.en,
        ar: args.content.ar,
        sourceHash: args.content.sourceHash,
        translatedAt: args.content.translatedAt,
        translationModel: args.content.translationModel,
        translationStatus: args.content.translationStatus,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("siteContent", {
        key: args.key,
        en: args.content.en,
        ar: args.content.ar,
        sourceHash: args.content.sourceHash,
        translatedAt: args.content.translatedAt,
        translationModel: args.content.translationModel,
        translationStatus: args.content.translationStatus,
        createdAt: now,
        updatedAt: now,
      });
    }

    await ctx.db.insert("adminActivity", {
      userId: profile.userId,
      action: "SAVE_SITE_CONTENT",
      resourceType: "site_content",
      details: `Saved site content: ${args.key}`,
      createdAt: now,
    });

    return { success: true };
  },
});
