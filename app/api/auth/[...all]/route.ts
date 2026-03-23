import { NextResponse } from "next/server";
import { convexAuthNextJs } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

function missingConfig() {
  return NextResponse.json(
    { error: "Convex auth is not configured" },
    { status: 500 }
  );
}

export async function GET(request: Request) {
  return convexAuthNextJs ? convexAuthNextJs.handler.GET(request) : missingConfig();
}

export async function POST(request: Request) {
  return convexAuthNextJs ? convexAuthNextJs.handler.POST(request) : missingConfig();
}
