import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { paystackAPI } from "@/apis/paystack";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookingReference = `BES-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    // Fetch booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*, tours(slug)")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        booking_reference: bookingReference,
      })
      .eq("booking_reference", booking.booking_reference);

    if (bookingError || !booking || updateError) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.payment_status !== "pending") {
      return NextResponse.json(
        { error: "Booking already paid" },
        { status: 400 }
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

    const paystackResponse = await paystackAPI({
      email: booking.customer_email,
      amount: Math.round(booking.total_amount * 100),
      reference: bookingReference,
      callback_url: `${process.env.NEXT_PUBLIC_URL}/api/bookings/verify?reference=${bookingReference}`,
      metadata: {
        booking_id: booking.id,
        customer_name: booking.customer_name,
        tour_slug: booking.tours?.slug,
        participants: booking.number_of_participants,
      },
    });

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok || !paystackData.status) {
      console.error("Paystack error:", paystackData);
      return NextResponse.json(
        { error: "Failed to initialize payment" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      bookingId: booking.id,
      paystackAuthUrl: paystackData.data.authorization_url,
      reference: bookingReference,
    });
  } catch (error) {
    console.error("Payment initialization error:", error);
    return NextResponse.json(
      { error: "Failed to initialize payment" },
      { status: 500 }
    );
  }
}
