import { Card, CardContent } from "../ui/card";
import { createClient } from "@/lib/supabase/server";
import ViewActionButton from "./view-action-button";
import RefundActionButton from "./refund-action-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Image from "next/image";
import PageNavigator from "../page-navigator";
import Empty from "../empty";
import { Badge } from "../ui/badge";
import LocationFilter from "../location-filter";
import StatusFilter from "../status-filter";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { EllipsisVertical } from "lucide-react";

interface RecentBookingsTableProps {
  page: number;
  totalBookings: number;
}

const RecentBookingsTable = async ({
  page,
  totalBookings,
}: RecentBookingsTableProps) => {
  const supabase = await createClient();

  const pageSize = 10;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: recentBookings } = await supabase
    .from("bookings")
    .select("*, tours(title, slug)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  return (
    <Card className="border-border/50">
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recent Bookings</h2>

          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold">Filter:</p>
            <LocationFilter />
            <StatusFilter />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Tour</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentBookings &&
              recentBookings.length > 0 &&
              recentBookings?.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.booking_reference}</TableCell>
                  <TableCell className="flex gap-3 items-center">
                    {user?.user_metadata.picture ? (
                      <Image
                        src={user?.user_metadata.picture}
                        width={40}
                        height={40}
                        alt="profile pic"
                        className="rounded-full w-auto h-auto object-cover"
                      />
                    ) : (
                      <p className="font-bold text-xl bg-amber-500 rounded-full h-10 w-10 flex items-center justify-center">
                        {user?.user_metadata.full_name[0]}
                      </p>
                    )}
                    <div>
                      <p className="font-medium">
                        {booking.customer_name ?? user?.user_metadata.full_name}
                      </p>
                      <p className="text-xs ">
                        {booking.customer_email ?? user?.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{booking.tours?.title}</TableCell>
                  <TableCell>
                    {new Date(booking.start_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>&#8373;{booking.total_amount}</TableCell>
                  <TableCell>
                    <Badge
                      className={`text-black ${
                        booking.booking_status === "confirmed"
                          ? "bg-amber-500/20"
                          : booking.booking_status === "completed"
                          ? "bg-green-600/20"
                          : "bg-red-600/20"
                      }`}
                    >
                      {booking.booking_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant={"ghost"}>
                          <EllipsisVertical />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="flex flex-col gap-2">
                        <ViewActionButton id={booking.id} />
                        {booking.refund_requested && <RefundActionButton />}
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {(!recentBookings || recentBookings.length === 0) && (
          <Empty message="No bookings found" />
        )}
        <PageNavigator
          total={totalBookings ?? 0}
          limit={pageSize}
          page={page}
        />
      </CardContent>
    </Card>
  );
};

export default RecentBookingsTable;
