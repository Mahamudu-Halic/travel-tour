import RecentBookingsTable from "@/components/admin/recent-bookings-table";
import StatsGrid from "@/components/admin/stats-grid";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{
    page: string;
    role: string;
  }>;
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const { page } = await searchParams;

  const supabase = await createClient();

  const { count: totalBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true });

  return (
    <div className="pt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-balance md:text-4xl">
          Admin Dashboard
        </h1>
        <p className="">
          Manage tours, bookings, and monitor platform activity
        </p>
      </div>
      <div className="flex gap-4">
        <Button asChild>
          <Link href={"/admin/tours"}>Tours</Link>
        </Button>
        <Button asChild>
          <Link href={"/admin/users"}>Users</Link>
        </Button>
      </div>
      <StatsGrid />
      <RecentBookingsTable
        page={Number(page) === 0 ? 1 : Number(page ?? 1)}
        totalBookings={totalBookings ?? 0}
      />{" "}
    </div>
  );
}
