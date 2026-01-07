import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import BookingCard from "./booking-card";
import { BookingsType } from "./types";
import { ToursType } from "@/components/tours/types";

const BookingTabs = ({
  allBookings,
}: {
  allBookings: (BookingsType & ToursType)[];
}) => {
  const upcomingBookings = allBookings?.filter(
    (b) =>
      b.booking_status === "confirmed" &&
      new Date(b.start_date) >= new Date(new Date().setHours(0, 0, 0, 0))
  );

  const pastBookings = allBookings?.filter(
    (b) =>
      b.booking_status === "completed" ||
      new Date(b.start_date) < new Date(new Date().setHours(0, 0, 0, 0))
  );

  const pendingBookings = allBookings?.filter(
    (b) => b.booking_status === "pending" && b.payment_status === "pending"
  );
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-6 bg-background">
        <TabsTrigger value="all">All ({allBookings?.length || 0})</TabsTrigger>
        <TabsTrigger value="upcoming">
          Upcoming ({upcomingBookings?.length || 0})
        </TabsTrigger>
        <TabsTrigger value="past">
          Past ({pastBookings?.length || 0})
        </TabsTrigger>
        <TabsTrigger value="pending">
          Pending ({pendingBookings?.length || 0})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        {allBookings && allBookings.length > 0 ? (
          allBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))
        ) : (
          <Card className="border-border/50">
            <CardContent className="py-16 text-center">
              <p className="mb-4 text-muted-foreground">No bookings found</p>
              <Button asChild>
                <Link href="/tours">Browse Tours</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="upcoming" className="space-y-4">
        {upcomingBookings && upcomingBookings.length > 0 ? (
          upcomingBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))
        ) : (
          <Card className="border-border/50">
            <CardContent className="py-16 text-center">
              <p className="mb-4 text-muted-foreground">No upcoming bookings</p>
              <Button asChild>
                <Link href="/tours">Browse Tours</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="past" className="space-y-4">
        {pastBookings && pastBookings.length > 0 ? (
          pastBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))
        ) : (
          <Card className="border-border/50">
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground">No past bookings</p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="pending" className="space-y-4">
        {pendingBookings && pendingBookings.length > 0 ? (
          pendingBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))
        ) : (
          <Card className="border-border/50">
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground">No pending bookings</p>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default BookingTabs;
