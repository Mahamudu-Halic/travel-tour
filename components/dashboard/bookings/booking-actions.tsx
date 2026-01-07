"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookingsType } from "./types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
const BookingActions = ({
  booking,
  refundRequest,
}: {
  booking: BookingsType;
  refundRequest: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`/api/bookings/${booking.id}/pay`, {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create booking");
      }

      // Initialize Paystack payment
      if (data.bookingId && data.paystackAuthUrl) {
        window.location.href = data.paystackAuthUrl;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle className="text-base ">
          {booking.payment_status === "pending"
            ? "Complete Payment"
            : "Need Help?"}
        </CardTitle>
        <CardDescription>
          {booking.payment_status === "pending"
            ? "Complete your payment to confirm your booking"
            : "Contact us for assistance with your booking"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {booking.payment_status === "pending" && (
          <Button
            onClick={handlePayment}
            className="w-full bg-primary"
            size="lg"
            disabled={isLoading}
          >
            Make Payment (&#8373;{booking.total_amount})
          </Button>
        )}

        {booking.payment_status === "paid" &&
          booking.booking_status !== "cancelled" &&
          !refundRequest && (
            <Button asChild className="w-full" variant="destructive">
              <Link href={`/dashboard/bookings/${booking.id}/refund`}>
                Request Refund
              </Link>
            </Button>
          )}

        <Button asChild className="w-full bg-transparent" variant="outline">
          <Link href="/contact">Contact Support</Link>
        </Button>
        <Button asChild className="w-full bg-transparent" variant="outline">
          <Link href={`/tours/${booking.tours?.slug}`}>View Tour Details</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default BookingActions;
