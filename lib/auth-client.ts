"use client";

import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

const baseURL =
  typeof window === "undefined" ? undefined : new URL("/api/auth", window.location.origin).toString();

export const authClient = createAuthClient({
  ...(baseURL ? { baseURL } : {}),
  plugins: [convexClient()],
});

export type AuthSession = typeof authClient.$Infer.Session;
