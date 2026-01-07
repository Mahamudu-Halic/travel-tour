import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { notFound } from "next/navigation";
import TourInformation from "@/components/dashboard/bookings/tour-information";
import BookingDetails from "@/components/dashboard/bookings/booking-details";
import TravelerInformation from "@/components/dashboard/bookings/traveler-information";
import PaymentSummary from "@/components/dashboard/bookings/payment-summary";
import BookingReference from "@/components/dashboard/bookings/booking-reference";
import BookingDate from "@/components/dashboard/bookings/booking-date";
import BookingActions from "@/components/dashboard/bookings/booking-actions";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: booking, error } = await supabase
    .from("bookings")
    .select(
      "*, tours(title, slug, destination, image_url, category, price, description, duration_days)"
    )
    .eq("id", id)
    .eq("user_id", user?.id)
    .single();

  if (error || !booking) {
    notFound();
  }

  const { data: refundRequest } = await supabase
    .from("refund_requests")
    .select("*")
    .eq("booking_id", id)
    .eq("user_id", user?.id)
    .maybeSingle();

  const statusConfig = {
    pending: {
      color: "bg-amber-500",
      icon: Clock,
      text: "Pending Confirmation",
    },
    confirmed: { color: "bg-green-600", icon: CheckCircle2, text: "Confirmed" },
    completed: { color: "bg-blue-600", icon: CheckCircle2, text: "Completed" },
    cancelled: { color: "bg-red-600", icon: AlertCircle, text: "Cancelled" },
  };

  const status =
    statusConfig[booking.booking_status as keyof typeof statusConfig] ||
    statusConfig.pending;
  const StatusIcon = status.icon;

  return (
      <div className="container mx-auto max-w-6xl px-4">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/dashboard/bookings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bookings
          </Link>
        </Button>

        <div className="mb-6 flex items-center gap-3">
          <h1 className="text-3xl font-bold text-balance md:text-4xl">
            Booking Details
          </h1>
          <Badge
            variant={
              booking.booking_status === "confirmed" ? "default" : "outline"
            }
            className="flex items-center gap-1.5"
          >
            <StatusIcon className="h-3.5 w-3.5" />
            {status.text}
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Tour Information */}
            <TourInformation tours={booking.tours} />

            {/* Booking Details */}
            <BookingDetails booking={booking} />

            {/* Traveler Information */}
            <TravelerInformation user={user}/>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <PaymentSummary booking={booking}/>

            {/* Booking Reference */}
            <BookingReference booking_reference={booking.booking_reference}/>

            {/* Booking Date */}
            <BookingDate created_at={booking.created_at}/>

            {/* Actions */}
            <BookingActions booking={booking} refundRequest={refundRequest}/>
          </div>
        </div>
      </div>
  );
};

export default page;
