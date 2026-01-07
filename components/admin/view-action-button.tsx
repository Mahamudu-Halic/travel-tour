import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { BookingsType } from "../dashboard/bookings/types";
import { Badge } from "../ui/badge";

const ViewActionButton = async ({ id }: { id: string }) => {
  const supabase = await createClient();

  const { data: booking } = (await supabase
    .from("bookings")
    .select(
      "*, tours(title, destination, image_url, category, price, description, duration_days)"
    )
    .eq("id", id)
    .single()) as unknown as { data: BookingsType };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="justify-start">
          View
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription>
            View the details of this booking.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {booking.refund_requested && (
            <div>
              <Badge variant={"destructive"}>Refund Requested</Badge>
            </div>
          )}
          <div>
            <p className="font-medium">Booking Reference</p>
            <p className="text-sm">{booking.booking_reference}</p>
          </div>
          <div>
            <p className="font-medium">Customer Name</p>
            <p className="text-sm">{booking.customer_name}</p>
          </div>
          <div>
            <p className="font-medium">Customer Email</p>
            <p className="text-sm">{booking.customer_email}</p>
          </div>
          <div>
            <p className="font-medium">Tour</p>
            <p className="text-sm">{booking.tours?.title}</p>
          </div>
          <div>
            <p className="font-medium">Start Date</p>
            <p className="text-sm">{booking.start_date}</p>
          </div>
          <div>
            <p className="font-medium">Number of People</p>
            <p className="text-sm">{booking.number_of_participants}</p>
          </div>
          <div>
            <p className="font-medium">Total Amount</p>
            <p className="text-sm">&#8373;{booking.total_amount}</p>
          </div>
          <div>
            <p className="font-medium">Booking Status</p>
            <Badge
              className={`text-black ${
                booking.booking_status === "confirmed"
                  ? "bg-amber-500/20"
                  : booking.booking_status === "completed"
                  ? "bg-green-600/20"
                  : "bg-red-600/20"
              }`}
            >
              {booking.booking_status}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewActionButton;
