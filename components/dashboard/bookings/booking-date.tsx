import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const BookingDate = ({ created_at }: { created_at: string }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base ">Booked On</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          {new Date(created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </CardContent>
    </Card>
  );
};

export default BookingDate;
