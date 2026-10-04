import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { api } from "@/convex/_generated/api";
import { fetchConvexAuthMutation } from "@/lib/auth-server";
import { handleRouteError } from "@/lib/route-error";
import { PROJECTS_CACHE_TAG, STACK_CACHE_TAG } from "@/lib/cache-tags";

export async function POST() {
  try {
    const data = await fetchConvexAuthMutation(api.stack.backfillFromProjects, {});

    revalidateTag(PROJECTS_CACHE_TAG);
    revalidateTag(STACK_CACHE_TAG);
    revalidatePath("/");
    revalidatePath("/en");
    revalidatePath("/ar");
    revalidatePath("/en/stack");
    revalidatePath("/ar/stack");

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return handleRouteError(error);
  }
}
