import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, User } from "lucide-react";
import { BookingsType } from "./types";
const BookingDetails = ({booking}: {booking: BookingsType}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="">Booking Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">
                Start Date
              </p>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                <span className="font-semibold">
                  {new Date(booking.start_date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">
                Participants
              </p>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span className="font-semibold">
                  {booking.number_of_participants} person(s)
                </span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <p className="mb-1 text-sm font-medium text-muted-foreground">
              Special Requests
            </p>
            <p className="text-sm">
              {booking.special_requests || "No special requests provided"}
            </p>
          </div>

          {/* {booking.additional_info && (
            <>
              <Separator />
              <div>
                <p className="mb-1 text-sm font-medium text-muted-foreground">
                  Additional Information
                </p>
                <p className="text-sm">{booking.additional_info}</p>
              </div>
            </>
          )} */}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingDetails;
