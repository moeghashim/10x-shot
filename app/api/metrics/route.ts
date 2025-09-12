import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/supabase"
import { metricSchema } from "@/lib/validations"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    const { data: metrics, error } = await supabase
      .from("metrics")
      .select("*")
      .order("year", { ascending: true })
      .order("month", { ascending: true })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
    }

    return NextResponse.json({ metrics })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = metricSchema.parse(body)

    const supabase = createServerSupabaseClient()

    const { data: metric, error } = await supabase.from("metrics").insert([validatedData]).select().single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create metric" }, { status: 500 })
    }

    return NextResponse.json({ metric }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
    }
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
