import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { api } from "@/convex/_generated/api";
import {
  fetchConvexAuthMutation,
  fetchConvexAuthQuery,
  isAuthError,
} from "@/lib/auth-server";
import { PROJECTS_CACHE_TAG, STACK_CACHE_TAG } from "@/lib/cache-tags";
import type { StackItem } from "@/types/database";

type StackUpsertPayload = Omit<StackItem, "id"> & {
  id?: number;
  projectIds?: number[];
};

function revalidateStackViews() {
  revalidateTag(PROJECTS_CACHE_TAG);
  revalidateTag(STACK_CACHE_TAG);
  revalidatePath("/");
  revalidatePath("/en");
  revalidatePath("/ar");
  revalidatePath("/en/stack");
  revalidatePath("/ar/stack");
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
    const data = await fetchConvexAuthQuery(api.stack.listAdmin, {});
    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const stack: StackUpsertPayload = await request.json();
    const data = await fetchConvexAuthMutation(api.stack.save, {
      id: stack.id,
      stack: {
        name: stack.name,
        category: stack.category,
        grade: stack.grade,
        notes: stack.notes?.trim() ? stack.notes.trim() : undefined,
      },
      projectIds: Array.isArray(stack.projectIds) ? stack.projectIds : undefined,
    });

    revalidateStackViews();
    return NextResponse.json({ data });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Stack item id is required" }, { status: 400 });
    }

    await fetchConvexAuthMutation(api.stack.remove, { id });
    revalidateStackViews();
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
