import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt } from "lucide-react";
const BookingReference = ({
  booking_reference,
}: {
  booking_reference: string;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base ">
          <Receipt className="h-4 w-4" />
          Booking Reference
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-mono text-sm font-semibold">{booking_reference}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Use this reference for any inquiries about your booking
        </p>
      </CardContent>
    </Card>
  );
};

export default BookingReference;
