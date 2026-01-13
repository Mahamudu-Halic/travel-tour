import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CalendarDays, MapPin, User, CreditCard } from "lucide-react";
import { redirect } from "next/navigation";
import Empty from "@/components/empty";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: bookings, count: totalBookings } = await supabase
    .from("bookings")
    .select("*, tours(title, slug, destination, image_url, category)", {
      count: "exact",
    })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const { count: upcomingCount } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("booking_status", "confirmed")
    .gte("start_date", new Date().toISOString().split("T")[0]);

  const { count: completedCount } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("booking_status", "completed");


  return (
    <div className="flex-1 bg-muted/30 py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-balance md:text-4xl ">
            Welcome back, {profile?.full_name || "Traveler"}!
          </h1>
          <p className="text-muted-foreground">
            Manage your bookings and explore new adventures
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <CalendarDays className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{upcomingCount || 0}</p>
                  <p className="text-sm text-muted-foreground">
                    Upcoming Tours
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <MapPin className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedCount || 0}</p>
                  <p className="text-sm text-muted-foreground">
                    Completed Tours
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
                  <CreditCard className="h-6 w-6 text-chart-3" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalBookings || 0}</p>
                  <p className="text-sm text-muted-foreground">
                    Total Bookings
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="">Recent Bookings</CardTitle>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="bg-transparent"
                >
                  <Link href="/dashboard/bookings">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {bookings && bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-start gap-4 rounded-lg border border-border/40 p-4"
                      >
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <h3 className="font-semibold">
                              {booking.tours?.title}
                            </h3>
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
                          </div>
                          <div className="mb-2 space-y-1 text-sm text-muted-foreground">
                            <p className="flex items-center gap-2">
                              <MapPin className="h-3 w-3" />
                              {booking.tours?.destination}
                            </p>
                            <p className="flex items-center gap-2">
                              <CalendarDays className="h-3 w-3" />
                              {new Date(booking.start_date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </p>
                            <p className="flex items-center gap-2">
                              <User className="h-3 w-3" />
                              {booking.number_of_participants} participant(s)
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
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
                            <span className="text-sm font-semibold">
                              ${booking.total_amount}
                            </span>
                          </div>
                        </div>
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/dashboard/bookings/${booking.id}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Empty message="You haven't made any bookings yet" />
                    <Button asChild>
                      <Link href="/tours">Browse Tours</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="">Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">
                    {profile?.full_name || "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{profile?.phone || "Not set"}</p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  <Link href="/dashboard/profile">Edit Profile</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-6 border-border/50 bg-primary text-primary-foreground">
              <CardContent className="p-6">
                <h3 className="mb-2 text-lg font-semibold ">
                  Explore More
                </h3>
                <p className="mb-4 text-sm text-primary-foreground/90 leading-relaxed">
                  Discover more amazing tours and create unforgettable memories
                </p>
                <Button
                  asChild
                  variant="secondary"
                  className="w-full bg-white text-primary hover:bg-white/90"
                >
                  <Link href="/tours">Browse Tours</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
