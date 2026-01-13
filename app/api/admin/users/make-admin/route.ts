import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, role")
      .eq("email", user?.email)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is admin
    if (!profile || profile?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email, role } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (role && role === "admin") {
      const { data: updatedProfile, error: updateError } = await supabase
        .from("profiles")
        .update({ role: "user" })
        .eq("email", email)
        .single();

      if (updateError || !updatedProfile) {
        return NextResponse.json(
          { error: "Failed to update user role" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: "User role updated successfully.",
        userId: profile.id,
      });
    }

    // // Check if user exists in profiles table
    const { data: userProfile, error: userProfileError } = await supabase
      .from("profiles")
      .select("id, email, role")
      .eq("email", email)
      .single();

    if (userProfileError || !userProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if already admin
    if (userProfile.role === "admin") {
      return NextResponse.json(
        { error: "User is already an admin" },
        { status: 400 }
      );
    }

    const { data: updatedProfile, error: updateError } = await supabase
      .from("profiles")
      .update({ role: "admin" })
      .eq("email", email)
      .single();

    if (updateError || !updatedProfile) {
      return NextResponse.json(
        { error: "Failed to update user role" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "User role updated successfully.",
      userId: profile.id,
    });
  } catch (error) {
    console.error("[v0] Error making user admin:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
