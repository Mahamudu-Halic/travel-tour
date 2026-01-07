import { Card, CardContent } from "../ui/card";
import { Calendar, DollarSign, MapPin, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const StatsGrid = async () => {
  const supabase = await createClient();

  const { count: totalTours } = await supabase
    .from("tours")
    .select("*", { count: "exact", head: true });

  const { count: totalBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true });

  const { count: confirmedBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("booking_status", "confirmed");

  const { data: revenueData } = await supabase
    .from("bookings")
    .select("total_amount")
    .eq("payment_status", "paid");

  const totalRevenue =
    revenueData?.reduce(
      (sum, booking) => sum + Number(booking.total_amount),
      0
    ) ?? 0;
  return (
    <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalTours ?? 0}</p>
              <p className="text-sm ">Total Tours</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalBookings ?? 0}</p>
              <p className="text-sm ">Total Bookings</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
              <Users className="h-6 w-6 text-chart-3" />
            </div>
            <div>
              <p className="text-2xl font-bold">{confirmedBookings ?? 0}</p>
              <p className="text-sm ">Confirmed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
              <DollarSign className="h-6 w-6 text-chart-4" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                &#8373;{totalRevenue.toFixed(2)}
              </p>
              <p className="text-sm ">Total Revenue</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsGrid;
