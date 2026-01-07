import React from "react";
import RecentBookingsTable from "@/components/admin/recent-bookings-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/server";
import UserProfilesTable from "./user-profiles-table";

interface AdminTabsProps {
  page: string;
  role: string;
}

const AdminTabs = async ({ page, role }: AdminTabsProps) => {
  const supabase = await createClient();

  const { count: totalBookings } = await supabase
    .from("bookings")
    .select("*", { count: "exact", head: true });

  const { count: totalProfiles } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  return (
    <Tabs defaultValue="booking" className="w-full">
      <TabsList className="mb-6 bg-background">
        <TabsTrigger value="booking">
          Recent Booking ({totalBookings})
        </TabsTrigger>
        <TabsTrigger value="profiles">Profiles ({totalProfiles})</TabsTrigger>
      </TabsList>
      <TabsContent value="booking">
        <RecentBookingsTable
          page={Number(page) === 0 ? 1 : Number(page ?? 1)}
          totalBookings={totalBookings ?? 0}
        />
      </TabsContent>
      <TabsContent value="profiles">
        <UserProfilesTable
          role={role}
          page={Number(page) === 0 ? 1 : Number(page ?? 1)}
          totalProfiles={totalProfiles ?? 0}
        />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;
