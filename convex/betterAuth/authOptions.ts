import type { BetterAuthOptions } from "better-auth/minimal";
import { twoFactor } from "better-auth/plugins/two-factor";
import { username } from "better-auth/plugins/username";
import { convexAdapter } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import authConfig from "../auth.config";

export const options = {
  baseURL: "http://localhost:3000",
  secret: "component-schema-placeholder",
  database: convexAdapter({} as any, {} as any),
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
