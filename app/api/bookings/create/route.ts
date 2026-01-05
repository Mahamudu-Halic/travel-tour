import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      tourId,
      tourSlug,
      startDate,
      participants,
      fullName,
      email,
      phone,
      specialRequests,
      totalAmount,
    } = body;

    // Generate booking reference
    const bookingReference = `BES-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    // Create booking in database
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        tour_id: tourId,
        booking_reference: bookingReference,
        number_of_participants: participants,
        start_date: startDate,
        total_amount: totalAmount,
        payment_status: "pending",
        booking_status: "pending",
        customer_name: fullName,
        customer_email: email,
        customer_phone: phone,
        special_requests: specialRequests || null,
      })
      .select()
      .single();

    if (bookingError) {
      console.error("[v0] Booking creation error:", bookingError);
      return NextResponse.json(
        { error: "Failed to create booking" },
        { status: 500 }
      );
    }

    // Initialize Paystack payment
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!paystackSecretKey) {
      console.error("[v0] Paystack secret key not configured");
      return NextResponse.json(
        {
          bookingId: booking.id,
          message: "Booking created but payment gateway not configured",
        },
        { status: 200 }
      );
    }

    const paystackResponse = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          amount: Math.round(totalAmount * 100), // Paystack amount in kobo (GHS cents)
          reference: bookingReference,
          callback_url: `${
            process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000"
          }/api/bookings/verify?reference=${bookingReference}`,
          metadata: {
            booking_id: booking.id,
            tour_slug: tourSlug,
            customer_name: fullName,
            participants: participants,
          },
        }),
      }
    );

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok || !paystackData.status) {
      console.error("[v0] Paystack initialization error:", paystackData);
      return NextResponse.json(
        {
          bookingId: booking.id,
          message: "Booking created but payment initialization failed",
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      bookingId: booking.id,
      paystackAuthUrl: paystackData.data.authorization_url,
      reference: bookingReference,
    });
  } catch (error) {
    console.error("[v0] Booking API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
