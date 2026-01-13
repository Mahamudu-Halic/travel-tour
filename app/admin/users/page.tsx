import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { ManageUsersForm } from "@/components/admin/manage-users-form";
import { Shield, Mail, Calendar } from "lucide-react";
import Empty from "@/components/empty";
import { Button } from "@/components/ui/button";
import Permission from "@/components/admin/permission";
import { Badge } from "@/components/ui/badge";

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex-1 bg-muted/30 py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-balance md:text-4xl ">
            Manage Users
          </h1>
          <p className="text-muted-foreground">
            Grant admin access to trusted staff members
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Make Admin Form */}
          <div className="lg:col-span-1">
            <Card className="border-border/50 sticky top-4">
              <CardContent className="p-6">
                <h2 className="mb-6 text-xl font-semibold ">
                  Grant Admin Access
                </h2>
                <ManageUsersForm />
              </CardContent>
            </Card>
          </div>

          {/* Users List */}
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardContent className="p-6">
                <h2 className="mb-6 text-xl font-semibold ">
                  All Users ({users?.length ?? 0})
                </h2>
                <div className="space-y-3">
                  {users && users.length > 0 ? (
                    users.map((user) => {
                      const isAdmin = user.role === "admin";
                      return (
                        <div
                          key={user.id}
                          className="flex items-center justify-between rounded-lg border border-border/40 p-4 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold">
                                {user.full_name ?? "Unnamed User"} 
                              </h3>
                              {isAdmin && (
                                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                                  <Shield className="h-3 w-3" />
                                  Admin
                                </span>
                              )}
                            </div>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                {user.email}
                              </div>
                              {user.phone && (
                                <div className="flex items-center gap-2">
                                  Phone: {user.phone}
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Joined{" "}
                                {new Date(
                                  user.created_at
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <Permission role={user.role} email={user.email} />
                        </div>
                      );
                    })
                  ) : (
                    <Empty message="No users found" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
