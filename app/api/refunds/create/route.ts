import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { bookingId, reason, refundAmount } = body

    if (!bookingId || !reason || !refundAmount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify booking exists and belongs to user
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .eq("user_id", user.id)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    if (booking.payment_status !== "paid") {
      return NextResponse.json({ error: "Booking must be paid to request refund" }, { status: 400 })
    }

    // Check if refund request already exists
    const { data: existingRefund } = await supabase
      .from("refund_requests")
      .select("*")
      .eq("booking_id", bookingId)
      .maybeSingle()

    if (existingRefund) {
      return NextResponse.json({ error: "Refund request already exists" }, { status: 400 })
    }

    // Create refund request
    const { data: refundRequest, error: refundError } = await supabase
      .from("refund_requests")
      .insert({
        booking_id: bookingId,
        user_id: user.id,
        reason,
        refund_amount: refundAmount,
        status: "pending",
      })
      .select()
      .single()

    if (refundError) {
      console.error("Refund request creation error:", refundError)
      return NextResponse.json({ error: "Failed to create refund request" }, { status: 500 })
    }

    //update refund_requested to true
    const { error: updateError } = await supabase
      .from("bookings")
      .update({ refund_requested: true })
      .eq("id", bookingId)
       .eq("user_id", user.id)
      .select()
      .single()

    if (updateError) {
      console.error("Refund request update error:", updateError)
      return NextResponse.json({ error: "Failed to update refund request" }, { status: 500 })
    }

    return NextResponse.json(
      {
        success: true,
        refundRequest,
        message: "Refund request submitted successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Refund request error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
