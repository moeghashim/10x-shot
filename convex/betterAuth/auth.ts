import { betterAuth } from "better-auth/minimal";
import { options } from "./authOptions";

export const auth = betterAuth(options);
