import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookingsType } from "./types";
const PaymentSummary = ({booking}: {booking: BookingsType}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="">Payment Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Price per person</span>
            <span className="font-medium">
              &#8373;{booking.tours?.price}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Number of participants
            </span>
            <span className="font-medium">
              {booking.number_of_participants}
            </span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="font-semibold">Total Amount</span>
            <span className="text-2xl font-bold text-primary">
              &#8373;{booking.total_amount}
            </span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Payment Status</span>
            <Badge
              variant={
                booking.payment_status === "paid" ? "default" : "destructive"
              }
              className="text-xs"
            >
              {booking.payment_status}
            </Badge>
          </div>
          {booking.payment_reference && (
            <div>
              <p className="mb-1 text-xs text-muted-foreground">
                Payment Reference
              </p>
              <p className="font-mono text-xs">{booking.payment_reference}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSummary;
