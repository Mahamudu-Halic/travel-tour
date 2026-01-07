import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@supabase/supabase-js";
import { Mail, Phone } from "lucide-react";
const TravelerInformation = ({ user }: { user: User | null }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="">Traveler Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="mb-1 text-sm font-medium text-muted-foreground">
              Full Name
            </p>
            <p className="font-medium">
              {user?.user_metadata?.full_name ?? user?.email}
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">
                Email
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user?.email}</span>
              </div>
            </div>
            {user?.phone && (
              <div>
                <p className="mb-1 text-sm font-medium text-muted-foreground">
                  Phone
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.phone}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TravelerInformation;
