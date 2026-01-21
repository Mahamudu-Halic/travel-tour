import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // const body = await request.json();
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const short_description = formData.get("short_description") as string;
    const destination = formData.get("destination") as string;
    const duration_days = formData.get("duration_days") as string;
    const duration_nights = formData.get("duration_nights") as string;
    const price = formData.get("price") as string;
    const max_participants = formData.get("max_participants") as string;
    const difficulty_level = formData.get("difficulty_level") as string;
    const category = formData.get("category") as string;
    const image = formData.get("image") as File;
    const included_items = JSON.parse(
      (formData.get("included_items") as string) || "[]",
    );
    const excluded_items = JSON.parse(
      (formData.get("excluded_items") as string) || "[]",
    );
    const itinerary = JSON.parse((formData.get("itinerary") as string) || "[]");

    // Validate required fields
    if (
      !title ||
      !slug ||
      !description ||
      !destination ||
      !price ||
      !category
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!image) {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 },
      );
    }

    // Upload image to Supabase storage
    let arrayBuffer: ArrayBuffer;

    // Check if arrayBuffer method exists
    if (typeof image.arrayBuffer === "function") {
      arrayBuffer = await image.arrayBuffer();
    } else {
      // Fallback: read as blob
      console.log("arrayBuffer method not found, using blob...");
      const blob = new Blob([image], { type: image.type });
      arrayBuffer = await blob.arrayBuffer();
    }

    // const buffer = await image?.arrayBuffer()
    const fileExtension = image?.name?.split(".").pop();
    const fileName = `${slug}-${Date.now()}.${fileExtension}`;
    const contentType =
      image.type || `image/${fileExtension === "jpg" ? "jpeg" : fileExtension}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("tours")
      .upload(`tour-images/${fileName}`, arrayBuffer, {
        contentType,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("[v0] Upload error:", uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get public URL for the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from("tours")
      .getPublicUrl(`tour-images/${fileName}`);
    const imageUrl = publicUrlData.publicUrl;

    // Insert tour with image URL
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
      image_url: imageUrl,
      included_items: included_items || [],
      excluded_items: excluded_items || [],
      itinerary: itinerary || [],
      is_active: true,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { success: true, tour, included_items, excluded_items, itinerary },
      { status: 201 },
    );
  } catch (error) {
    console.error("[v0] Error creating tour:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
