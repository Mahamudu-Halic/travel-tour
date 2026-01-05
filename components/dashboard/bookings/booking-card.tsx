"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BanknoteArrowDown,
  CalendarDays,
  Eye,
  MapPin,
  Trash,
  User,
} from "lucide-react";
import Link from "next/link";
import { BookingsType } from "./types";
import { ToursType } from "@/components/tours/types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const BookingCard = ({ booking }: { booking: BookingsType & ToursType }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const deleteBooking = async () => {
    try {
      const results = await fetch(`/api/bookings/${booking.id}/delete`, {
        method: "DELETE",
      });
      const data = await results.json();
      if (data.success) {
        toast.success("Booking deleted successfully");
        router.refresh();
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Card className="border-border/50 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-lg font-semibold">{booking.tours?.title}</h3>
              <Badge variant="outline" className="text-xs">
                {booking.tours?.category}
              </Badge>
            </div>
            <div className="mb-4 space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {booking.tours?.destination}
              </p>
              <p className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {new Date(booking.start_date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {booking.number_of_participants} participant(s)
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span>
                Booking Status:{" "}
                <Badge
                  variant={
                    booking.booking_status === "confirmed"
                      ? "default"
                      : booking.booking_status === "completed"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {booking.booking_status}
                </Badge>
              </span>
              <span>
                Payment Status:{" "}
                <Badge
                  variant={
                    booking.payment_status === "paid"
                      ? "default"
                      : "destructive"
                  }
                  className="text-xs"
                >
                  {booking.payment_status}
                </Badge>
              </span>
              <span className="ml-auto text-xl font-bold text-primary">
                &#8373;{booking.total_amount}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button asChild variant="ghost" size="icon">
              <Link title="view" href={`/dashboard/bookings/${booking.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            {booking.payment_status === "paid" &&
              booking.booking_status !== "completed" &&
              !booking.refund_requested && (
                <Button asChild variant="ghost" size="icon">
                  <Link
                    title="refund"
                    href={`/dashboard/bookings/${booking.id}/refund`}
                  >
                    <BanknoteArrowDown className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            {booking.payment_status !== "paid" && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button title="delete" variant="ghost" size="icon">
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Booking</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete booking for{" "}
                      <span className="font-bold">{booking.tours?.title}</span>?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button onClick={deleteBooking}>Confirm</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
