import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { api } from "@/convex/_generated/api";
import {
  fetchConvexAuthMutation,
  fetchConvexAuthQuery,
  isAuthError,
} from "@/lib/auth-server";
import { PROGRESS_CACHE_TAG } from "@/lib/cache-tags";
import { localizePlanningCardContent } from "@/lib/translation";
import type { PlanningCard } from "@/types/database";

function revalidateProgressViews() {
  revalidateTag(PROGRESS_CACHE_TAG);
  revalidatePath("/progress");
  revalidatePath("/en/progress");
  revalidatePath("/ar/progress");
}

function handleRouteError(error: unknown) {
  if (isAuthError(error)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    { error: error instanceof Error ? error.message : "Unexpected server error" },
    { status: 500 }
  );
}

export async function GET() {
  try {
    const data = await fetchConvexAuthQuery(api.planningCards.listAdmin, {});
    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const card: PlanningCard = await request.json();
    const previous = card.id
      ? await fetchConvexAuthQuery(api.planningCards.getAdminById, { id: card.id })
      : null;
    const { localized, hadFailures } = await localizePlanningCardContent(card, previous?.localization);

    await fetchConvexAuthMutation(api.planningCards.save, {
      id: card.id,
      card: {
        project_id: card.project_id,
        column: card.column,
        title: card.title,
        description: card.description,
        order: card.order,
      },
      localized,
    });

    if (hadFailures) {
      await fetchConvexAuthMutation(api.adminUsers.logActivity, {
        action: "PLANNING_CARD_TRANSLATION_FAILED",
        resourceType: "planning_card",
        resourceId: card.id,
        details: `Arabic translation fallback was used for planning card ${card.title}`,
      });
    }

    revalidateProgressViews();
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Planning card id is required" }, { status: 400 });
    }

    await fetchConvexAuthMutation(api.planningCards.remove, { id });
    revalidateProgressViews();
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
