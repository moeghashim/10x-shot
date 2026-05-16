import { components, internal } from "./_generated/api";
import { action, internalAction, query } from "./_generated/server";
import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth, type BetterAuthOptions } from "better-auth/minimal";
import { twoFactor } from "better-auth/plugins/two-factor";
import { username } from "better-auth/plugins/username";
import authSchema from "./betterAuth/schema";
import authConfig from "./auth.config";
import type { DataModel } from "./_generated/dataModel";
import { v } from "convex/values";

export const authComponent = createClient<DataModel, typeof authSchema>(components.betterAuth as any, {
  local: {
    schema: authSchema,
  },
  verbose: false,
});

export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
  const siteUrl =
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";
  const trustedOrigins = Array.from(
    new Set(
      [
        siteUrl,
        process.env.SITE_URL,
        process.env.NEXT_PUBLIC_SITE_URL,
        "https://www.10claws.com",
        "https://10claws.com",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
      ].filter((origin): origin is string => Boolean(origin))
    )
  );
  const secret =
    process.env.BETTER_AUTH_SECRET || "change-me-before-production";

  return {
    baseURL: siteUrl,
    trustedOrigins,
    secret,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    user: {
      deleteUser: {
        enabled: true,
      },
    },
    plugins: [username(), twoFactor(), convex({ authConfig })],
  } satisfies BetterAuthOptions;
};

export const createAuth = (ctx: GenericCtx<DataModel>) => betterAuth(createAuthOptions(ctx));

export const { getAuthUser } = authComponent.clientApi();

export const rotateKeys = internalAction({
  args: {},
  handler: async (ctx) => {
    const auth = createAuth(ctx);
    return auth.api.rotateKeys();
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.safeGetAuthUser(ctx);
  },
});

export const signInWithEmail = action({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const auth = createAuth(ctx);
    return auth.api.signInEmail({
      body: {
        email: args.email,
        password: args.password,
      },
    });
  },
});

export const ensureInitialAdmin = internalAction({
  args: {
    email: v.string(),
    password: v.string(),
    fullName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingProfile: any = await ctx.runQuery(internal.adminUsers.findProfileByEmail, {
      email: args.email,
    });
    if (existingProfile) {
      return existingProfile;
    }

    const auth = createAuth(ctx);
    const result = (await auth.api.signUpEmail({
      body: {
        email: args.email,
        password: args.password,
        name: args.fullName || args.email,
      },
    })) as {
      user: {
        id: string;
        email: string;
        name?: string | null;
      };
    };

    await ctx.runMutation(internal.adminUsers.upsertProfile, {
      userId: result.user.id,
      email: result.user.email,
      fullName: args.fullName || result.user.name || result.user.email,
      isActive: true,
    });

    return result.user;
  },
});
