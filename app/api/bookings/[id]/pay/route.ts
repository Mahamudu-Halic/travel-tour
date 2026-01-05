import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    if (booking.payment_status !== "pending") {
      return NextResponse.json({ error: "Booking already paid" }, { status: 400 })
    }

    // Initialize Paystack payment
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: booking.customer_email,
        amount: Math.round(booking.total_amount * 100), // Convert to kobo/cents
        reference: booking.booking_reference,
        callback_url: `${process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000"}/api/bookings/verify`,
        metadata: {
          booking_id: booking.id,
          customer_name: booking.customer_name,
        },
      }),
    })

    const paystackData = await paystackResponse.json()

    if (!paystackResponse.ok || !paystackData.status) {
      console.error("Paystack error:", paystackData)
      return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 })
    }

    // Update payment reference
    await supabase.from("bookings").update({ payment_reference: booking.booking_reference }).eq("id", booking.id)

    // Redirect to Paystack payment page
    return NextResponse.redirect(paystackData.data.authorization_url)
  } catch (error) {
    console.error("Payment initialization error:", error)
    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 })
  }
}