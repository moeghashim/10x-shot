import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { api } from "@/convex/_generated/api";
import {
  fetchConvexAuthMutation,
  fetchConvexAuthQuery,
  hasConvexEnv,
  isAuthError,
} from "@/lib/auth-server";
import { SITE_COPY_CACHE_TAG } from "@/lib/cache-tags";
import { DEFAULT_SITE_COPY, mergeSiteCopyEntries } from "@/lib/site-content";
import { localizeSiteCopyEntry } from "@/lib/translation";

function revalidateSiteCopy() {
  revalidateTag(SITE_COPY_CACHE_TAG);
  revalidatePath("/");
  revalidatePath("/en");
  revalidatePath("/ar");
  revalidatePath("/en/progress");
  revalidatePath("/ar/progress");
}

function handleRouteError(error: unknown) {
  if (isAuthError(error)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    {
      error: error instanceof Error ? error.message : "Unexpected server error",
    },
    { status: 500 }
  );
}

export async function GET() {
  try {
    if (!hasConvexEnv()) {
      return NextResponse.json({
        data: Object.values(DEFAULT_SITE_COPY),
        error: "Convex is not configured",
      });
    }

    const data = await fetchConvexAuthQuery(api.siteContent.listAdmin, {});
    return NextResponse.json({
      data: Object.values(mergeSiteCopyEntries(data)).sort((a, b) => a.key.localeCompare(b.key)),
      error: null,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { key, en } = (await request.json()) as { key?: string; en?: string };

    if (!key || typeof en !== "string") {
      return NextResponse.json({ error: "Key and English content are required" }, { status: 400 });
    }

    const previous = await fetchConvexAuthQuery(api.siteContent.getByKey, { key });
    const { localized, hadFailures } = await localizeSiteCopyEntry(key, en, previous);

    await fetchConvexAuthMutation(api.siteContent.save, {
      key,
      content: localized,
    });

    if (hadFailures) {
      await fetchConvexAuthMutation(api.adminUsers.logActivity, {
        action: "SITE_COPY_TRANSLATION_FAILED",
        resourceType: "site_content",
        details: `Arabic translation fallback was used for ${key}`,
      });
    }

    revalidateSiteCopy();
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
