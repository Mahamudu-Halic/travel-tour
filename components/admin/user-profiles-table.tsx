import React from "react";
import { Card, CardContent } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { EllipsisVertical } from "lucide-react";
import PageNavigator from "../page-navigator";
import Empty from "../empty";
import { createClient } from "@/lib/supabase/server";

interface UserProfilesTableProps {
  role: string;
  page: number;
  totalProfiles: number;
}

const UserProfilesTable = async ({
  role,
  page,
  totalProfiles,
}: UserProfilesTableProps) => {
  const supabase = await createClient();

  const pageSize = 10;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  return (
    <Card className="border-border/50">
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Recent Bookings</h2>

          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold">Filter:</p>
            {/* <LocationFilter />
            <StatusFilter /> */}
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Users</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles?.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell className="flex gap-3 items-center">
                  {profile?.picture ? (
                    <Image
                      src={profile?.picture}
                      width={40}
                      height={40}
                      alt="profile pic"
                      className="rounded-full w-auto h-auto object-cover"
                    />
                  ) : (
                    <p className="font-bold text-xl bg-amber-500 rounded-full h-10 w-10 flex items-center justify-center">
                      {profile?.full_name[0]}
                    </p>
                  )}
                  <div>
                    <p className="font-medium">{profile?.full_name}</p>
                    <p className="text-xs ">{profile?.email}</p>
                  </div>
                </TableCell>
                <TableCell>{profile?.phone}</TableCell>
                <TableCell>{profile?.role}</TableCell>

                <TableCell className="space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"ghost"}>
                        <EllipsisVertical />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="flex flex-col gap-2">
                      {/* <ViewActionButton id={booking.id} />
                      {booking.refund_requested && <RefundActionButton />} */}
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {!profiles && <Empty message="No profiles found" />}
        <PageNavigator
          total={totalProfiles ?? 0}
          limit={pageSize}
          page={page}
        />
      </CardContent>
    </Card>
  );
};

export default UserProfilesTable;
