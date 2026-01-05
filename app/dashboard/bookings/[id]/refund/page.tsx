import { createClient } from "@/lib/supabase/server";
import { RefundRequestForm } from "@/components/refund-request-form";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?redirect=/dashboard/bookings/${id}/refund`);
  }

  // Fetch booking
  const { data: booking, error } = await supabase
    .from("bookings")
    .select("*, tours(title, slug, price)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !booking) {
    notFound();
  }

  // Check if booking is eligible for refund
  if (booking.payment_status !== "paid") {
    redirect(`/dashboard/bookings/${id}`);
  }

  // Check if refund request already exists
  const { data: existingRefund } = await supabase
    .from("refund_requests")
    .select("*")
    .eq("booking_id", id)
    .maybeSingle();

  if (existingRefund) {
    redirect(`/dashboard/bookings/${id}`);
  }

  return (
    <div className=" py-12 md:py-16">
      <div className="container mx-auto max-w-2xl px-4">
        <Button asChild variant="ghost" className="mb-6">
          <Link href={`/dashboard/bookings/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Booking
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-balance md:text-4xl mb-2">
            Request Refund
          </h1>
          <p className="text-muted-foreground">
            Submit a refund request for your booking. Our team will review and
            respond within 2-3 business days.
          </p>
        </div>

        <RefundRequestForm booking={booking} />
      </div>
    </div>
  );
};

export default page;
