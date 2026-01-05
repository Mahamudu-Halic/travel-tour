import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get("reference")

    if (!reference) {
      return redirect("/dashboard/bookings?error=missing_reference")
    }

    const supabase = await createClient()

    // Verify payment with Paystack
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY

    if (!paystackSecretKey) {
      console.error("[v0] Paystack secret key not configured")
      return redirect(`/dashboard/bookings?error=payment_gateway_error`)
    }

    const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
      },
    })

    const verifyData = await verifyResponse.json()

    if (!verifyResponse.ok || !verifyData.status) {
      console.error("[v0] Paystack verification failed:", verifyData)
      return redirect(`/dashboard/bookings?error=verification_failed`)
    }

    const paymentData = verifyData.data

    // Update booking with payment information
    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        payment_status: paymentData.status === "success" ? "paid" : "failed",
        payment_reference: paymentData.reference,
        booking_status: paymentData.status === "success" ? "confirmed" : "pending",
      })
      .eq("booking_reference", reference)

    if (updateError) {
      console.error("[v0] Failed to update booking:", updateError)
    }

    if (paymentData.status === "success") {
      return redirect(`/dashboard/bookings?success=true`)
    } else {
      return redirect(`/dashboard/bookings?error=payment_failed`)
    }
  } catch (error) {
    console.error("[v0] Payment verification error:", error)
    return redirect("/dashboard/bookings?error=server_error")
  }
}
