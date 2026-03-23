import { action, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { ConvexError, v } from "convex/values";
import { requireAdmin, toIsoString } from "./lib";
import { createAuth } from "./auth";

function toAdminUser(doc: any) {
  return {
    id: doc.userId,
    email: doc.email,
    full_name: doc.fullName,
    role: "admin" as const,
    is_active: doc.isActive,
    last_login: toIsoString(doc.lastLogin),
    created_at: toIsoString(doc.createdAt),
    updated_at: toIsoString(doc.updatedAt),
  };
}

export const current = query({
  args: {},
  handler: async (ctx) => {
    const { profile } = await requireAdmin(ctx);
    return toAdminUser(profile);
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const docs = await ctx.db.query("adminProfiles").collect();
    return docs.sort((a, b) => b.createdAt - a.createdAt).map(toAdminUser);
  },
});

export const activity = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const limit = args.limit ?? 50;
    const docs = await ctx.db.query("adminActivity").collect();
    return docs
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit)
      .map((doc) => ({
        id: doc._id,
        user_id: doc.userId,
        action: doc.action,
        resource_type: doc.resourceType,
        resource_id: doc.resourceId,
        details: doc.details,
        created_at: new Date(doc.createdAt).toISOString(),
      }));
  },
});

export const updateProfile = mutation({
  args: {
    userId: v.string(),
    fullName: v.optional(v.string()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { profile } = await requireAdmin(ctx);
    const existing = await ctx.db
      .query("adminProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!existing) {
      throw new ConvexError("Admin user not found");
    }

    await ctx.db.patch(existing._id, {
      fullName: args.fullName,
      isActive: args.isActive,
      updatedAt: Date.now(),
    });

    await ctx.db.insert("adminActivity", {
      userId: profile.userId,
      action: "UPDATE_USER",
      resourceType: "admin_user",
      details: `Updated user: ${existing.email}`,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

export const createAdminUser = action({
  args: {
    email: v.string(),
    password: v.string(),
    fullName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentAdmin = await ctx.runQuery(internal.adminUsers.requireAdminQuery, {});
    if (!currentAdmin) {
      throw new ConvexError("Unauthorized");
    }

    const auth = createAuth(ctx);
    const result = await auth.api.signUpEmail({
      body: {
        email: args.email,
        password: args.password,
        name: args.fullName || args.email,
      },
    });

    await ctx.runMutation(internal.adminUsers.upsertProfile, {
      userId: result.user.id,
      email: result.user.email,
      fullName: args.fullName || result.user.name || result.user.email,
      isActive: true,
    });

    await ctx.runMutation(internal.adminUsers.logActivityInternal, {
      userId: currentAdmin.userId,
      action: "CREATE_USER",
      resourceType: "admin_user",
      details: `Created user: ${args.email}`,
    });

    return { success: true };
  },
});

export const logActivity = mutation({
  args: {
    action: v.string(),
    resourceType: v.optional(v.string()),
    resourceId: v.optional(v.number()),
    details: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { profile } = await requireAdmin(ctx);
    await ctx.db.insert("adminActivity", {
      userId: profile.userId,
      action: args.action,
      resourceType: args.resourceType,
      resourceId: args.resourceId,
      details: args.details,
      createdAt: Date.now(),
    });
    return { success: true };
  },
});

export const requireAdminQuery = internalQuery({
  args: {},
  handler: async (ctx) => {
    try {
      const { profile } = await requireAdmin(ctx);
      return profile;
    } catch (_error) {
      return null;
    }
  },
});

export const findProfileByEmail = internalQuery({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db
      .query("adminProfiles")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const upsertProfile = internalMutation({
  args: {
    userId: v.string(),
    email: v.string(),
    fullName: v.optional(v.string()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("adminProfiles")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        fullName: args.fullName,
        isActive: args.isActive,
        updatedAt: now,
      });
      return existing._id;
    }

    return ctx.db.insert("adminProfiles", {
      userId: args.userId,
      email: args.email,
      fullName: args.fullName,
      role: "admin",
      isActive: args.isActive,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const logActivityInternal = internalMutation({
  args: {
    userId: v.optional(v.string()),
    action: v.string(),
    resourceType: v.optional(v.string()),
    resourceId: v.optional(v.number()),
    details: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("adminActivity", {
      userId: args.userId,
      action: args.action,
      resourceType: args.resourceType,
      resourceId: args.resourceId,
      details: args.details,
      createdAt: Date.now(),
    });
  },
});
