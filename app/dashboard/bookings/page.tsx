import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BookingTabs from "@/components/dashboard/bookings/booking-tabs";

export default async function BookingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/bookings");
  }

  const { data: allBookings } = await supabase
    .from("bookings")
    .select("*, tours(title, slug, destination, image_url, category)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-balance md:text-4xl ">
            My Bookings
          </h1>
          <p className="text-muted-foreground">
            View and manage all your tour bookings
          </p>
        </div>

        {allBookings && <BookingTabs allBookings={allBookings} />}
      </div>
    </div>
  );
}
