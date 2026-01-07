import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Users, MapPin, DollarSign, Calendar, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  //   if (!user || !user.email?.endsWith("@besepa.com")) {
  //     redirect("/")
  //   }

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

    const { data: {user}} = await supabase.auth.getUser();

  const { data: recentBookings } = await supabase
    .from("bookings")
    .select("*, tours(title, slug)")
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-balance md:text-4xl">
            Admin Dashboard
          </h1>
          <p className="">
            Manage tours, bookings, and monitor platform activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalTours || 0}</p>
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
                  <p className="text-2xl font-bold">{totalBookings || 0}</p>
                  <p className="text-sm ">
                    Total Bookings
                  </p>
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
                  <p className="text-2xl font-bold">{confirmedBookings || 0}</p>
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

        {/* Recent Bookings Table */}
        <Card className="border-border/50">
          <CardContent className="p-6">
            <h2 className="mb-6 text-xl font-semibold">
              Recent Bookings
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="pb-3 text-left text-sm font-medium ">
                      Reference
                    </th>
                    <th className="pb-3 text-left text-sm font-medium ">
                      Customer
                    </th>
                    <th className="pb-3 text-left text-sm font-medium ">
                      Tour
                    </th>
                    <th className="pb-3 text-left text-sm font-medium ">
                      Date
                    </th>
                    <th className="pb-3 text-left text-sm font-medium ">
                      Amount
                    </th>
                    <th className="pb-3 text-left text-sm font-medium ">
                      Status
                    </th>
                    <th className="pb-3 text-left text-sm font-medium ">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings?.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-border/40 last:border-0"
                    >
                      <td className="py-4 text-sm font-mono">
                        {booking.booking_reference}
                      </td>
                      <td className="py-4 text-sm">
                        <div>
                          <p className="font-medium">
                            {booking.customer_name ?? user?.user_metadata.full_name}
                          </p>
                          <p className="text-xs ">
                            {booking.customer_email ?? user?.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 text-sm">{booking.tours?.title}</td>
                      <td className="py-4 text-sm">
                        {new Date(booking.start_date).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-sm font-semibold">
                        &#8373;{booking.total_amount}
                      </td>
                      <td className="py-4 text-sm">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            booking.booking_status === "confirmed"
                              ? "bg-amber-500/20 "
                              : booking.booking_status === "completed"
                              ? "bg-green-600/20 "
                              : "bg-red-600/20 "
                          }`}
                        >
                          {booking.booking_status}
                        </span>
                      </td>
                      <td className="py-4 text-sm flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Eye />
                        </Button>
                        {booking.refund_requested && (
                          <Button
                          variant="outline"
                          size="sm"
                        >
                          <X />
                        </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
