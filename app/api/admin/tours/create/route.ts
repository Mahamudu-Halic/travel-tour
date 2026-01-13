import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, role")
      .eq("email", user?.email)
      .single()

    // Check if user is admin
    if (!user || profile?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      slug,
      description,
      short_description,
      destination,
      duration_days,
      duration_nights,
      price,
      max_participants,
      difficulty_level,
      category,
      image_url,
      gallery_urls,
      is_featured,
      is_active,
      included_items,
      excluded_items,
      itinerary
    } = body

    // Validate required fields
    if (!title || !slug || !description || !destination || !price || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert tour
    const { data: tour, error } = await supabase.from("tours").insert({
      title,
      slug,
      description,
      short_description,
      destination,
      duration_days: Number.parseInt(duration_days),
      duration_nights: Number.parseInt(duration_nights),
      price: Number.parseFloat(price),
      max_participants: Number.parseInt(max_participants),
      difficulty_level,
      category,
      image_url,
      gallery_urls,
      is_featured,
      is_active,
      included_items,
      excluded_items,
      itinerary,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, tour }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating tour:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
